import { useState, useEffect } from 'react'
import PARTY_DATA from './data'
import Nav from './components/Nav'
import Home from './components/Home'
import Guests from './components/Guests'
import Trivia from './components/Trivia'
import PasswordGate from './components/PasswordGate'

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem('party_unlocked') === 'yes'
  )
  const [section, setSection] = useState('home')
  const { site, guests, facts, jeopardy } = PARTY_DATA

  useEffect(() => {
    document.title = site.title
  }, [site.title])

  if (!unlocked) {
    return (
      <PasswordGate
        onUnlock={() => {
          sessionStorage.setItem('party_unlocked', 'yes')
          setUnlocked(true)
        }}
      />
    )
  }

  return (
    <>
      <Nav section={section} navigate={setSection} title={site.title} />

      {section === 'home'   && <Home   site={site} navigate={setSection} />}
      {section === 'guests' && <Guests guests={guests} />}
      {section === 'trivia' && <Trivia jeopardy={jeopardy} guests={guests} />}
    </>
  )
}
