import { SplashScreen } from '@/ui'
import { useCallback, useState } from 'react'

type AppPhase = 'splash' | 'playing' | 'help'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('splash')

  const handleSplashComplete = useCallback(() => {
    setPhase('playing')
  }, [])

  const handleHowToPlay = useCallback(() => {
    setPhase('help')
  }, [])

  const handleLetsPlay = useCallback(() => {
    setPhase('playing')
  }, [])

  if (phase === 'splash') {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
        onHowToPlay={handleHowToPlay}
        onLetsPlay={handleLetsPlay}
      />
    )
  }

  if (phase === 'help') {
    return (
      <div className="help-screen">
        <h2>How to Play Hangman</h2>
        <p>Guess letters to reveal a hidden word before the stick figure completes.</p>
        <button onClick={handleLetsPlay}>Back to Game</button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Hangman</h1>
      <p>Guess letters to reveal a hidden word before the stick figure completes</p>
    </div>
  )
}
