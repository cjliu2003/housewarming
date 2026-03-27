import { useState } from 'react'

function GuestPhoto({ photo, name }) {
  const [errored, setErrored] = useState(false)

  if (!photo || errored) {
    return <div className="guest-placeholder">👤</div>
  }
  return (
    <img
      className="guest-photo"
      src={photo}
      alt={name}
      onError={() => setErrored(true)}
    />
  )
}

export default function Guests({ guests }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>The Guests</h2>
        <p className="section-sub">Everyone here tonight</p>
      </div>

      <div className="guests-grid">
        {guests.map(g => (
          <div key={g.id} className="guest-card">
            <div className="guest-photo-wrap">
              <GuestPhoto photo={g.photo} name={g.name} />
            </div>
            <div className="guest-name">{g.name}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
