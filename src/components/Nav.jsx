export default function Nav({ section, navigate, title }) {
  const links = [
    { id: 'home',     label: 'Home'      },
    { id: 'guests',   label: 'Guests'    },
    { id: 'facts',    label: 'Who Am I?' },
    { id: 'jeopardy', label: 'Jeopardy'  },
  ]

  return (
    <nav className="nav">
      <button
        className={`nav-brand${section === 'home' ? ' active' : ''}`}
        onClick={() => navigate('home')}
      >
        🏠 <span>{title}</span>
      </button>

      <div className="nav-links">
        {links.map(l => (
          <button
            key={l.id}
            className={`nav-btn${section === l.id ? ' active' : ''}`}
            onClick={() => navigate(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
