import { useState, useEffect, useCallback, useMemo } from 'react'

function RevealPhoto({ photo, name }) {
  const [errored, setErrored] = useState(false)

  if (!photo || errored) {
    return <span className="reveal-placeholder">👤</span>
  }
  return (
    <img
      className="reveal-photo"
      src={photo}
      alt={name}
      onError={() => setErrored(true)}
    />
  )
}

export default function Facts({ facts, guests }) {
  const guestMap = useMemo(
    () => Object.fromEntries(guests.map(g => [g.id, g])),
    [guests]
  )

  const [order,       setOrder]       = useState(() => {
    const arr = facts.map((_, i) => i)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })
  const [idx,         setIdx]         = useState(0)
  const [revealed,    setRevealed]    = useState(false)
  const [showReveal,  setShowReveal]  = useState(false)

  const fact  = facts[order[idx]]
  const guest = guestMap[fact?.guestId]

  // Advance to next card
  const goNext = useCallback(() => {
    setIdx(i => (i + 1) % order.length)
    setRevealed(false)
    setShowReveal(false)
  }, [order.length])

  // Go back to previous card
  const goPrev = useCallback(() => {
    setIdx(i => (i - 1 + order.length) % order.length)
    setRevealed(false)
    setShowReveal(false)
  }, [order.length])

  // Reveal: mount element first, then add .visible on the next frame for CSS transition
  const reveal = useCallback(() => {
    if (revealed) return
    setShowReveal(true)
    // Double-rAF to let browser paint the element before the transition fires
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setRevealed(true))
    )
  }, [revealed])

  // Shuffle order
  const shuffle = () => {
    const arr = [...order]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    setOrder(arr)
    setIdx(0)
    setRevealed(false)
    setShowReveal(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'Enter')      reveal()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, reveal])

  return (
    <section className="section">
      <div className="section-header">
        <h2>Who Am I?</h2>
        <p className="section-sub">Read the clue — guess the guest — then reveal</p>
      </div>

      <div className="facts-wrap">
        <div className="fact-card">

          <div className="fact-meta">{idx + 1} of {order.length}</div>

          <div className="fact-body">
            <span className="fact-quote">&ldquo;</span>
            <p className="fact-text">{fact?.fact}</p>
          </div>

          {/* Reveal — mounted only after button press so CSS transition can play */}
          {showReveal && (
            <div className={`fact-reveal${revealed ? ' visible' : ''}`}>
              <div className="reveal-rule" />
              <div className="reveal-inner">
                <div className="reveal-photo-wrap">
                  <RevealPhoto photo={guest?.photo} name={guest?.name} />
                </div>
                <div className="reveal-name">{guest?.name ?? '???'}</div>
              </div>
            </div>
          )}

          <div className="fact-controls">
            <button className="btn btn-ghost" onClick={goPrev}>← Prev</button>
            <button
              className="btn btn-reveal"
              onClick={reveal}
              disabled={revealed}
            >
              {revealed ? '✓ Revealed' : '🎭 Reveal'}
            </button>
            <button className="btn btn-ghost" onClick={goNext}>Next →</button>
          </div>

        </div>

        <button className="btn btn-text" onClick={shuffle}>🔀 Shuffle order</button>
      </div>
    </section>
  )
}
