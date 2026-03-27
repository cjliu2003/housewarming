import { useState } from 'react'

const CORRECT = 'calebiscool'

export default function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (input === CORRECT) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div style={styles.overlay}>
      <form
        onSubmit={handleSubmit}
        style={{
          ...styles.card,
          animation: shake ? 'shake 0.5s ease' : 'none',
        }}
      >
        <div style={styles.lock}>🔒</div>
        <h1 style={styles.title}>Clark & Liu Spectacular</h1>
        <p style={styles.subtitle}>Enter the password to continue</p>

        <input
          autoFocus
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false) }}
          placeholder="Password"
          style={{
            ...styles.input,
            borderColor: error ? '#e74c3c' : 'rgba(255,255,255,0.15)',
          }}
        />

        {error && <p style={styles.error}>Wrong password. Try again.</p>}

        <button type="submit" style={styles.btn}>Enter →</button>
      </form>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-10px); }
          40%      { transform: translateX(10px); }
          60%      { transform: translateX(-8px); }
          80%      { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg, #050d1a)',
    zIndex: 9999,
  },
  card: {
    background: 'var(--card, #111e33)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 18,
    padding: '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
    width: '100%',
    maxWidth: 380,
    boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
  },
  lock: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontFamily: "var(--font-display, 'Bebas Neue', Impact, sans-serif)",
    fontSize: '2.4rem',
    color: 'var(--gold, #f5c518)',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: 'var(--muted, #7a8ba8)',
    fontSize: '0.9rem',
    marginBottom: 6,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1.5px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.05)',
    color: 'var(--text, #eef2ff)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    textAlign: 'center',
    letterSpacing: 2,
  },
  error: {
    color: '#e74c3c',
    fontSize: '0.82rem',
    marginTop: -6,
  },
  btn: {
    marginTop: 6,
    width: '100%',
    padding: '12px 0',
    borderRadius: 10,
    border: 'none',
    background: 'var(--gold, #f5c518)',
    color: '#050d1a',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    letterSpacing: 1,
    transition: 'opacity 0.2s',
  },
}
