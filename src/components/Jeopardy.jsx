import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

const GAME_ID = 'game'

export default function Jeopardy({ jeopardy }) {
  const { teams: defaultTeams, pointValues, categories } = jeopardy

  // zeroScores: build a { team: 0 } map for any team list
  const zeroScores = (teamList) => Object.fromEntries(teamList.map(t => [t, 0]))

  const [teams,       setTeams]       = useState(defaultTeams)
  const [scores,      setScores]      = useState(() => zeroScores(defaultTeams))
  const [usedCells,   setUsedCells]   = useState(new Set())
  const [modal,       setModal]       = useState(null)   // { col, row, cat, val, key, clue }
  const [answerShown, setAnswerShown] = useState(false)
  const [syncStatus,  setSyncStatus]  = useState('connecting') // 'connecting' | 'ok' | 'error'

  // Refs to score DOM nodes so we can pulse them on change
  const scoreRefs    = useRef({})
  // Suppress the real-time echo of our own writes
  const suppressNext = useRef(false)
  // Snapshot of state captured when a question is opened (used for undo)
  const snapshotRef  = useRef(null)

  // Undo / redo stacks – each entry: { scores, usedCells: string[] }
  const [history, setHistory] = useState([])
  const [future,  setFuture]  = useState([])

  // Inline score editing: { team, draft } | null
  const [editingScore, setEditingScore] = useState(null)

  // ── Load initial state & subscribe to real-time changes ─────
  useEffect(() => {
    let channel

    async function init() {
      const { data, error } = await supabase
        .from('jeopardy_state')
        .select('scores, used_cells, teams, history')
        .eq('id', GAME_ID)
        .single()

      if (error) {
        console.error('[jeopardy] load error', error)
        setSyncStatus('error')
      } else if (data) {
        const dbTeams = (data.teams && data.teams.length > 0) ? data.teams : defaultTeams
        // Merge: start from zeros so every team has a value, then overlay saved scores
        const dbScores = { ...zeroScores(dbTeams), ...(data.scores ?? {}) }
        setTeams(dbTeams)
        setScores(dbScores)
        setUsedCells(new Set(data.used_cells ?? []))
        setHistory(data.history ?? [])
        setSyncStatus('ok')
      }

      // Real-time subscription – updates every device when state changes
      channel = supabase
        .channel('jeopardy_state_changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'jeopardy_state', filter: `id=eq.${GAME_ID}` },
          (payload) => {
            if (suppressNext.current) {
              suppressNext.current = false
              return
            }
            const row = payload.new
            if (row) {
              if (row.teams && row.teams.length > 0) setTeams(row.teams)
              setScores(row.scores     ?? {})
              setUsedCells(new Set(row.used_cells ?? []))
              setHistory(row.history   ?? [])
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setSyncStatus('ok')
          if (status === 'CHANNEL_ERROR') setSyncStatus('error')
        })
    }

    init()
    return () => { if (channel) supabase.removeChannel(channel) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist full game state to Supabase ─────────────────────
  const persist = async (nextScores, nextUsed, nextTeams = teams, nextHistory = history) => {
    suppressNext.current = true
    const { error } = await supabase
      .from('jeopardy_state')
      .upsert({
        id:         GAME_ID,
        scores:     nextScores,
        used_cells: [...nextUsed],
        teams:      nextTeams,
        history:    nextHistory,
        updated_at: new Date().toISOString(),
      })
    if (error) {
      console.error('[jeopardy] persist error', error)
      suppressNext.current = false   // don't suppress the next real event
      setSyncStatus('error')
    }
  }

  // ── Game actions ─────────────────────────────────────────────
  const openModal = (col, row, cat, val) => {
    const key = `${col}-${row}`
    if (usedCells.has(key)) {
      // Used cell – show restore dialog instead of ignoring the click
      setModal({ col, row, cat, val, key, clue: cat.clues[row], restore: true })
      return
    }
    // Capture a snapshot of state before this question starts (for undo)
    snapshotRef.current = { scores: { ...scores }, usedCells: new Set(usedCells), teams: [...teams] }
    setModal({ col, row, cat, val, key, clue: cat.clues[row] })
    setAnswerShown(false)
  }

  const closeModal = () => {
    snapshotRef.current = null   // discard snapshot if closed before reveal
    setModal(null)
    setAnswerShown(false)
  }

  const showAnswer = () => {
    // Commit pre-question snapshot to history before any state change
    let nextHistory = history
    if (snapshotRef.current) {
      const snap = snapshotRef.current
      nextHistory = [...history, { scores: snap.scores, usedCells: [...snap.usedCells], teams: snap.teams ?? [...teams] }]
      setHistory(nextHistory)
      setFuture([])
      snapshotRef.current = null
    }
    // Mark the cell used as soon as the answer is revealed
    const nextUsed = new Set([...usedCells, modal.key])
    setUsedCells(nextUsed)
    setAnswerShown(true)
    persist(scores, nextUsed, teams, nextHistory)
  }

  const awardTeam = (team) => {
    let nextScores = scores
    if (team) {
      nextScores = { ...scores, [team]: (scores[team] ?? 0) + modal.val }
      setScores(nextScores)
      // Pulse the score element
      const el = scoreRefs.current[team]
      if (el) {
        el.classList.remove('bump')
        void el.offsetWidth               // force reflow to restart animation
        el.classList.add('bump')
        setTimeout(() => el.classList.remove('bump'), 350)
      }
      persist(nextScores, usedCells)
    }
    closeModal()
  }

  const reset = async () => {
    if (!confirm('Reset the board and all scores?')) return
    const nextScores = zeroScores(teams)
    const nextUsed   = new Set()
    setHistory([])
    setFuture([])
    snapshotRef.current = null
    setUsedCells(nextUsed)
    setScores(nextScores)
    await persist(nextScores, nextUsed, teams, [])
  }

  // ── Undo / Redo / Restore ────────────────────────────────────
  const undo = async () => {
    if (history.length === 0) return
    const prev        = history[history.length - 1]
    const nextHistory = history.slice(0, -1)
    const nextFuture  = [...future, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    setFuture(nextFuture)
    setHistory(nextHistory)
    const nextScores = prev.scores
    const nextUsed   = new Set(prev.usedCells)
    const nextTeams  = prev.teams ?? [...teams]
    setScores(nextScores)
    setUsedCells(nextUsed)
    setTeams(nextTeams)
    await persist(nextScores, nextUsed, nextTeams, nextHistory)
  }

  const redo = async () => {
    if (future.length === 0) return
    const next        = future[future.length - 1]
    const nextFuture  = future.slice(0, -1)
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    setFuture(nextFuture)
    setHistory(nextHistory)
    const nextScores = next.scores
    const nextUsed   = new Set(next.usedCells)
    const nextTeams  = next.teams ?? [...teams]
    setScores(nextScores)
    setUsedCells(nextUsed)
    setTeams(nextTeams)
    await persist(nextScores, nextUsed, nextTeams, nextHistory)
  }

  const restoreCell = async () => {
    // Save current state so the restore itself can be undone
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    setHistory(nextHistory)
    setFuture([])
    const nextUsed = new Set([...usedCells].filter(k => k !== modal.key))
    setUsedCells(nextUsed)
    await persist(scores, nextUsed, teams, nextHistory)
    closeModal()
  }

  // ── Inline score editing ────────────────────────────────────
  const startEditScore = (team) => {
    setEditingScore({ team, draft: String(scores[team]) })
  }

  const commitScoreEdit = async () => {
    if (!editingScore) return
    const { team, draft } = editingScore
    const parsed = parseInt(draft, 10)
    const newVal = isNaN(parsed) ? scores[team] : parsed
    setEditingScore(null)
    if (newVal === scores[team]) return
    // Push current state to history so the manual edit can be undone
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    setHistory(nextHistory)
    setFuture([])
    const nextScores = { ...scores, [team]: newVal }
    setScores(nextScores)
    await persist(nextScores, usedCells, teams, nextHistory)
  }

  const cancelScoreEdit = () => setEditingScore(null)

  // ── Add / Delete Team ────────────────────────────────────────
  const addTeam = async () => {
    const name = prompt('New team name:')?.trim()
    if (!name) return
    if (teams.includes(name)) { alert(`"${name}" already exists.`); return }
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    const nextTeams   = [...teams, name]
    const nextScores  = { ...scores, [name]: 0 }
    setHistory(nextHistory)
    setFuture([])
    setTeams(nextTeams)
    setScores(nextScores)
    await persist(nextScores, usedCells, nextTeams, nextHistory)
  }

  const deleteTeam = async (team) => {
    if (teams.length <= 1) { alert('You need at least one team.'); return }
    if (scores[team] !== 0 && !confirm(`Delete "${team}" (score: $${scores[team]})?`)) return
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    const nextTeams   = teams.filter(t => t !== team)
    const nextScores  = { ...scores }
    delete nextScores[team]
    setHistory(nextHistory)
    setFuture([])
    setTeams(nextTeams)
    setScores(nextScores)
    await persist(nextScores, usedCells, nextTeams, nextHistory)
  }

  // Close modal on Escape; Undo on ⌘Z; Redo on ⌘⇧Z or ⌘Y
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { closeModal(); return }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [history, future]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <section className="section section--jeopardy">

        {/* ── Scoreboard ── */}
        <div className="section-header">
          <h2>
            Jeopardy!
            <span
              className={`sync-dot sync-dot--${syncStatus}`}
              title={syncStatus === 'ok' ? 'Synced' : syncStatus === 'error' ? 'Sync error – check console' : 'Connecting…'}
            />
          </h2>
          <div className="scoreboard">
            {teams.map(t => (
              <div key={t} className="score-card">
                <div className="score-team">
                  {t}
                  <button
                    onClick={() => deleteTeam(t)}
                    title={`Remove ${t}`}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.7rem', marginLeft: '0.3rem', padding: '0 2px', lineHeight: 1 }}
                  >✕</button>
                </div>
                {editingScore?.team === t ? (
                  <input
                    className="score-edit-input"
                    type="number"
                    value={editingScore.draft}
                    onChange={e => setEditingScore(s => ({ ...s, draft: e.target.value }))}
                    onBlur={commitScoreEdit}
                    onKeyDown={e => {
                      if (e.key === 'Enter')  commitScoreEdit()
                      if (e.key === 'Escape') cancelScoreEdit()
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="score-val"
                    ref={el => { scoreRefs.current[t] = el }}
                    onClick={() => startEditScore(t)}
                    title="Click to edit score"
                    style={{ cursor: 'pointer' }}
                  >
                    ${scores[t]}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={addTeam} style={{ alignSelf: 'center', whiteSpace: 'nowrap' }}>＋ Add Team</button>
        </div>

        {/* ── Board ── */}
        <div className="board-wrap">
          <div
            className="jeopardy-board"
            style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}
          >
            {/* Category headers */}
            {categories.map((cat, i) => (
              <div key={i} className="j-header">{cat.name}</div>
            ))}

            {/* Clue cells */}
            {pointValues.map((val, row) =>
              categories.map((cat, col) => {
                const key  = `${col}-${row}`
                const used = usedCells.has(key)
                return (
                  <div
                    key={key}
                    className={`j-cell${used ? ' j-cell--used' : ''}`}
                    onClick={() => openModal(col, row, cat, val)}
                    title={used ? 'Click to restore this question' : undefined}
                  >
                    {used ? <span style={{ opacity: 0.25, fontSize: '0.9rem' }}>↩</span> : `$${val}`}
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="jeopardy-footer">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-ghost"
              onClick={undo}
              disabled={history.length === 0}
              title="Undo last action (⌘Z)"
            >↩ Undo</button>
            <button
              className="btn btn-ghost"
              onClick={redo}
              disabled={future.length === 0}
              title="Redo (⌘⇧Z)"
            >↪ Redo</button>
          </div>
          <button className="btn btn-ghost" onClick={reset}>
            ↺ Reset board &amp; scores
          </button>
        </div>

      </section>

      {/* ── Modal ── */}
      {modal && (
        <div
          className="modal-overlay"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="modal-box" role="dialog" aria-modal="true">

            <div className="modal-cat">{modal.cat.name}</div>
            <div className="modal-val">${modal.val}</div>

            {modal.restore ? (
              <>
                <div className="modal-clue" style={{ opacity: 0.55, fontStyle: 'italic' }}>
                  This question has already been played.
                </div>
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={closeModal}>✕ Close</button>
                  <button className="btn btn-show-answer" onClick={restoreCell}>↩ Restore Question</button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-clue">{modal.clue.question}</div>

                {answerShown && (
                  <div className="modal-answer">{modal.clue.answer}</div>
                )}

                {answerShown && (
                  <div className="modal-teams">
                    {teams.map(t => (
                      <button key={t} className="btn btn-team" onClick={() => awardTeam(t)}>
                        +${modal.val} → {t}
                      </button>
                    ))}
                    <button
                      className="btn btn-team btn-team--none"
                      onClick={() => awardTeam(null)}
                    >
                      ✗ No one
                    </button>
                  </div>
                )}

                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={closeModal}>✕ Close</button>
                  {!answerShown && (
                    <button className="btn btn-show-answer" onClick={showAnswer}>
                      Show Answer
                    </button>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  )
}
