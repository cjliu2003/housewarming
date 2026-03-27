export default function Home({ site, navigate }) {
  const cards = [
    { id: 'guests',   icon: '👥', label: 'Guests',    desc: "Who's here tonight"          },
    { id: 'facts',    icon: '🕵️', label: 'Who Am I?', desc: 'Guess the guest from clues'  },
    { id: 'jeopardy', icon: '🎯', label: 'Jeopardy!', desc: 'The classic trivia showdown' },
  ]

  return (
    <section className="section">
      <div className="hero">
        <h1 className="hero-title">{site.title}</h1>
        <p className="hero-sub">{site.subtitle}</p>

        <div className="hero-cards">
          {cards.map(c => (
            <button key={c.id} className="hero-card" onClick={() => navigate(c.id)}>
              <div className="hero-icon">{c.icon}</div>
              <div className="hero-card-label">{c.label}</div>
              <div className="hero-card-desc">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
