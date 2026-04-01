import { useState, useEffect, useRef, useMemo } from 'react'
import { supabase } from '../supabase'

const GAME_ID = 'game'

// ── Small guest thumbnail for the sidebar ─────────────────
function GuestThumb({ guest }) {
  const [errored, setErrored] = useState(false)
  if (!guest.photo || errored) {
    return <span className="trivia-guest-placeholder">👤</span>
  }
  return (
    <img
      className="trivia-guest-photo"
      src={guest.photo}
      alt={guest.name}
      onError={() => setErrored(true)}
    />
  )
}

// ── Guest photo in the guessing-round card reveal ─────────
function RevealPhoto({ photo, name }) {
  const [errored, setErrored] = useState(false)
  if (!photo || errored) return <span className="tcard-reveal-placeholder">👤</span>
  return (
    <img className="tcard-reveal-photo" src={photo} alt={name} onError={() => setErrored(true)} />
  )
}

// ── Single trivia question card (inline reveal) ───────────
function TriviaCard({ qNum, question, answer, used, teams, onAward, onRestore }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className={`tcard${used ? ' tcard--used' : ''}${revealed ? ' tcard--revealed' : ''}`}>
      <div className="tcard-top">
        <span className="tcard-num">Q{qNum}</span>
        <p className="tcard-question">{question}</p>
        <span className="tcard-pts">1 pt</span>
      </div>

      {(revealed || used) && (
        <div className="tcard-answer-row">
          <span className="tcard-answer-label">Answer</span>
          <span className="tcard-answer">{answer}</span>
        </div>
      )}

      {revealed && !used && (
        <div className="tcard-award-row">
          {teams.map(t => (
            <button key={t} className="btn btn-team" onClick={() => onAward(t)}>+1 pt → {t}</button>
          ))}
          <button className="btn btn-team btn-team--none" onClick={() => onAward(null)}>✗ No one</button>
        </div>
      )}

      {!revealed && !used && (
        <div className="tcard-actions">
          <button className="btn btn-show-answer" onClick={() => setRevealed(true)}>Show Answer</button>
        </div>
      )}

      {used && (
        <div className="tcard-used-row">
          <span className="tcard-used-badge">✓ Played</span>
          <button className="btn btn-ghost tcard-restore-btn" onClick={onRestore}>↩ Restore</button>
        </div>
      )}
    </div>
  )
}

// ── Single guessing-round card (inline reveal) ────────────
function GuessCard({ idx, fact, guest, used, teams, onAward, onRestore }) {
  const [showReveal, setShowReveal] = useState(false)
  const [revealed,   setRevealed]   = useState(false)

  const reveal = () => {
    if (revealed) return
    setShowReveal(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setRevealed(true)))
  }

  return (
    <div className={`tcard${used ? ' tcard--used' : ''}${revealed ? ' tcard--revealed' : ''}`}>
      <div className="tcard-top">
        <span className="tcard-num">#{idx + 1}</span>
        <p className="tcard-question">&ldquo;{fact.fact}&rdquo;</p>
        <span className="tcard-pts">1 pt</span>
      </div>

      {(showReveal || used) && (
        <div className={`tcard-guest-reveal${revealed || used ? ' visible' : ''}`}>
          <div className="tcard-reveal-photo-wrap">
            <RevealPhoto photo={guest?.photo} name={guest?.name} />
          </div>
          <div className="tcard-reveal-name">{guest?.name ?? '???'}</div>
        </div>
      )}

      {revealed && !used && (
        <div className="tcard-award-row">
          {teams.map(t => (
            <button key={t} className="btn btn-team" onClick={() => onAward(t)}>+1 pt → {t}</button>
          ))}
          <button className="btn btn-team btn-team--none" onClick={() => onAward(null)}>✗ No one</button>
        </div>
      )}

      {!revealed && !used && (
        <div className="tcard-actions">
          <button className="btn btn-show-answer" onClick={reveal}>Reveal Guest</button>
        </div>
      )}

      {used && (
        <div className="tcard-used-row">
          <span className="tcard-used-badge">✓ Played</span>
          <button className="btn btn-ghost tcard-restore-btn" onClick={onRestore}>↩ Restore</button>
        </div>
      )}
    </div>
  )
}

// ── Main Trivia component ─────────────────────────────────
export default function Trivia({ jeopardy, guests }) {
  const { teams: defaultTeams, categories } = jeopardy

  const guestMap = useMemo(
    () => Object.fromEntries(guests.map(g => [g.id, g])),
    [guests]
  )

  const zeroScores = (teamList) => Object.fromEntries(teamList.map(t => [t, 0]))

  const [teams,        setTeams]        = useState(defaultTeams)
  const [scores,       setScores]       = useState(() => zeroScores(defaultTeams))
  const [usedCells,    setUsedCells]    = useState(new Set())
  const [syncStatus,   setSyncStatus]   = useState('connecting')
  const [activeRound,  setActiveRound]  = useState(0)
  const [history,      setHistory]      = useState([])
  const [editingScore, setEditingScore] = useState(null)

  const suppressNext = useRef(false)
  const scoreRefs    = useRef({})

  // ── Load & subscribe ──────────────────────────────────────
  useEffect(() => {
    let channel

    async function init() {
      const { data, error } = await supabase
        .from('jeopardy_state')
        .select('scores, used_cells, teams, history')
        .eq('id', GAME_ID)
        .single()

      if (error) {
        console.error('[trivia] load error', error)
        setSyncStatus('error')
      } else if (data) {
        const dbTeams = (data.teams?.length > 0) ? data.teams : defaultTeams
        setTeams(dbTeams)
        setScores({ ...zeroScores(dbTeams), ...(data.scores ?? {}) })
        setUsedCells(new Set(data.used_cells ?? []))
        setHistory(data.history ?? [])
        setSyncStatus('ok')
      }

      channel = supabase
        .channel('trivia_state_changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'jeopardy_state', filter: `id=eq.${GAME_ID}` },
          (payload) => {
            if (suppressNext.current) { suppressNext.current = false; return }
            const row = payload.new
            if (row) {
              if (row.teams?.length > 0) setTeams(row.teams)
              setScores(row.scores ?? {})
              setUsedCells(new Set(row.used_cells ?? []))
              setHistory(row.history ?? [])
            }
          }
        )
        .subscribe((s) => {
          if (s === 'SUBSCRIBED')    setSyncStatus('ok')
          if (s === 'CHANNEL_ERROR') setSyncStatus('error')
        })
    }

    init()
    return () => { if (channel) supabase.removeChannel(channel) }
  }, []) // eslint-disable-line

  const persist = async (nextScores, nextUsed, nextTeams = teams, nextHistory = history) => {
    suppressNext.current = true
    const { error } = await supabase.from('jeopardy_state').upsert({
      id:         GAME_ID,
      scores:     nextScores,
      used_cells: [...nextUsed],
      teams:      nextTeams,
      history:    nextHistory,
      updated_at: new Date().toISOString(),
    })
    if (error) {
      console.error('[trivia] persist error', error)
      suppressNext.current = false
      setSyncStatus('error')
    }
  }

  // ── Award a point ───────────────────────────────────────
  const awardPoint = async (key, team) => {
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    const nextUsed    = new Set([...usedCells, key])
    let nextScores    = scores
    if (team) {
      nextScores = { ...scores, [team]: (scores[team] ?? 0) + 1 }
      setScores(nextScores)
      const el = scoreRefs.current[team]
      if (el) {
        el.classList.remove('bump')
        void el.offsetWidth
        el.classList.add('bump')
        setTimeout(() => el.classList.remove('bump'), 350)
      }
    }
    setHistory(nextHistory)
    setUsedCells(nextUsed)
    await persist(nextScores, nextUsed, teams, nextHistory)
  }

  // ── Restore a question ──────────────────────────────────
  const restoreCell = async (key) => {
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    const nextUsed    = new Set([...usedCells].filter(k => k !== key))
    setHistory(nextHistory)
    setUsedCells(nextUsed)
    await persist(scores, nextUsed, teams, nextHistory)
  }

  // ── Reset ───────────────────────────────────────────────
  const reset = async () => {
    if (!confirm('Reset all scores and mark all questions as unplayed?')) return
    const nextScores = zeroScores(teams)
    const nextUsed   = new Set()
    setHistory([])
    setUsedCells(nextUsed)
    setScores(nextScores)
    await persist(nextScores, nextUsed, teams, [])
  }

  const undo = async () => {
    if (!history.length) return
    const prev        = history[history.length - 1]
    const nextHistory = history.slice(0, -1)
    setHistory(nextHistory)
    setScores(prev.scores)
    setUsedCells(new Set(prev.usedCells))
    if (prev.teams?.length) setTeams(prev.teams)
    await persist(prev.scores, new Set(prev.usedCells), prev.teams ?? teams, nextHistory)
  }

  // ── Score editing ─────────────────────────────────────────
  const startEditScore = (team) => setEditingScore({ team, draft: String(scores[team] ?? 0) })

  const commitScoreEdit = async () => {
    if (!editingScore) return
    const { team, draft } = editingScore
    const newVal = parseInt(draft, 10)
    setEditingScore(null)
    if (isNaN(newVal) || newVal === (scores[team] ?? 0)) return
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    const nextScores  = { ...scores, [team]: newVal }
    setHistory(nextHistory)
    setScores(nextScores)
    await persist(nextScores, usedCells, teams, nextHistory)
  }

  // ── Team management ───────────────────────────────────────
  const addTeam = async () => {
    const name = prompt('New team name:')?.trim()
    if (!name) return
    if (teams.includes(name)) { alert(`"${name}" already exists.`); return }
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    const nextTeams   = [...teams, name]
    const nextScores  = { ...scores, [name]: 0 }
    setHistory(nextHistory)
    setTeams(nextTeams)
    setScores(nextScores)
    await persist(nextScores, usedCells, nextTeams, nextHistory)
  }

  const deleteTeam = async (team) => {
    if (teams.length <= 1) { alert('Need at least one team.'); return }
    if (!confirm(`Remove "${team}"?`)) return
    const nextHistory = [...history, { scores: { ...scores }, usedCells: [...usedCells], teams: [...teams] }]
    const nextTeams   = teams.filter(t => t !== team)
    const nextScores  = { ...scores }
    delete nextScores[team]
    setHistory(nextHistory)
    setTeams(nextTeams)
    setScores(nextScores)
    await persist(nextScores, usedCells, nextTeams, nextHistory)
  }

  // ── Keyboard shortcuts ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [history]) // eslint-disable-line

  // ── Progress helpers ──────────────────────────────────────
  const roundProgress = (ri) => {
    const used = categories[ri].clues.filter((_, qi) => usedCells.has(`r${ri}-${qi}`)).length
    return { used, total: categories[ri].clues.length }
  }

  return (
    <div className="trivia-layout">

      {/* ── Sidebar ── */}
      <aside className="trivia-sidebar">

        {/* Scoreboard */}
        <div className="trivia-sidebar-section">
          <div className="trivia-sidebar-title">
            Scores
            <span
              className={`sync-dot sync-dot--${syncStatus}`}
              title={syncStatus === 'ok' ? 'Synced' : syncStatus === 'error' ? 'Sync error' : 'Connecting…'}
            />
          </div>
          {teams.map(t => (
            <div key={t} className="trivia-score-row">
              <span className="trivia-score-team">
                {t}
                <button
                  className="trivia-score-delete"
                  onClick={() => deleteTeam(t)}
                  title={`Remove ${t}`}
                >✕</button>
              </span>
              {editingScore?.team === t ? (
                <input
                  className="trivia-score-input"
                  type="number"
                  value={editingScore.draft}
                  onChange={e => setEditingScore(s => ({ ...s, draft: e.target.value }))}
                  onBlur={commitScoreEdit}
                  onKeyDown={e => {
                    if (e.key === 'Enter')  commitScoreEdit()
                    if (e.key === 'Escape') setEditingScore(null)
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className="trivia-score-val"
                  ref={el => { scoreRefs.current[t] = el }}
                  onClick={() => startEditScore(t)}
                  title="Click to edit"
                >
                  {scores[t] ?? 0}
                  <span className="trivia-score-unit"> pt{(scores[t] ?? 0) !== 1 ? 's' : ''}</span>
                </span>
              )}
            </div>
          ))}
          <button className="btn btn-ghost trivia-add-team-btn" onClick={addTeam}>
            ＋ Add Team
          </button>
        </div>

        {/* Guest grid */}
        <div className="trivia-sidebar-section trivia-guest-section">
          <div className="trivia-sidebar-title">Guests</div>
          <div className="trivia-guest-grid">
            {guests.map(g => (
              <div key={g.id} className="trivia-guest-item">
                <div className="trivia-guest-photo-wrap">
                  <GuestThumb guest={g} />
                </div>
                <span className="trivia-guest-name">{g.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="trivia-sidebar-footer">
          <button className="btn btn-ghost" onClick={undo} disabled={!history.length}>↩ Undo</button>
          <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
        </div>

      </aside>

      {/* ── Main ── */}
      <main className="trivia-main">

        {/* Round tabs */}
        <div className="trivia-tabs">
          {categories.map((cat, i) => {
            const { used, total } = roundProgress(i)
            const isGuess  = cat.type === 'guess'
            const triviaN  = categories.slice(0, i).filter(c => c.type !== 'guess').length
            const guessN   = categories.slice(0, i).filter(c => c.type === 'guess').length
            const label    = isGuess ? `🎭 Pt. ${guessN + 1}` : `Round ${triviaN + 1}`
            return (
              <button
                key={i}
                className={`trivia-tab${activeRound === i ? ' active' : ''}${used === total ? ' done' : ''}${isGuess ? ' trivia-tab--guess' : ''}`}
                onClick={() => setActiveRound(i)}
                title={cat.name}
              >
                <span className="trivia-tab-label">{label}</span>
                <span className="trivia-tab-prog">{used}/{total}</span>
              </button>
            )
          })}
        </div>

        {/* Unified round view — type-aware */}
        {(() => {
          const cat     = categories[activeRound]
          const isGuess = cat.type === 'guess'
          const { used, total } = roundProgress(activeRound)
          const triviaN = categories.slice(0, activeRound).filter(c => c.type !== 'guess').length
          const guessN  = categories.slice(0, activeRound).filter(c => c.type === 'guess').length
          return (
            <div className="trivia-round-view">
              <div className="trivia-round-header">
                <h2 className="trivia-round-title">{cat.name}</h2>
                <p className="trivia-round-sub">
                  {isGuess ? `Guessing Pt. ${guessN + 1}` : `Round ${triviaN + 1}`} · {used} of {total} played · 1 pt each
                </p>
              </div>
              <div className={`trivia-q-list${isGuess ? ' trivia-q-list--guess' : ''}`}>
                {cat.clues.map((clue, qi) => {
                  const key = `r${activeRound}-${qi}`
                  return isGuess ? (
                    <GuessCard
                      key={`${activeRound}-${qi}`}
                      idx={qi}
                      fact={clue}
                      guest={guestMap[clue.guestId]}
                      used={usedCells.has(key)}
                      teams={teams}
                      onAward={(team) => awardPoint(key, team)}
                      onRestore={() => restoreCell(key)}
                    />
                  ) : (
                    <TriviaCard
                      key={`${activeRound}-${qi}`}
                      qNum={qi + 1}
                      question={clue.question}
                      answer={clue.answer}
                      used={usedCells.has(key)}
                      teams={teams}
                      onAward={(team) => awardPoint(key, team)}
                      onRestore={() => restoreCell(key)}
                    />
                  )
                })}
              </div>
            </div>
          )
        })()}

      </main>
    </div>
  )
}
