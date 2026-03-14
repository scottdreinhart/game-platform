import { useGame } from '@/app'
import { initBoardWasm } from '@/domain'
import { GameBoard } from '@/ui/molecules'
import { useEffect, useState } from 'react'
import './App.css'

export default function App() {
  const { board, moves, isSolved, handleCellClick, resetGame } = useGame()
  const [isLoading, setIsLoading] = useState(true)

  // Initialize WASM module for board optimization
  useEffect(() => {
    initBoardWasm().catch((err) => console.warn('WASM init failed:', err))
  }, [])

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="lo-splash">
        <div className="lo-splash__orb"></div>
        <div className="lo-splash__grid"></div>
        <div className="lo-splash__content">
          <div className="lo-splash__badge">
            <div className="lo-splash__emoji">💡</div>
          </div>
          <div className="lo-splash__eyebrow">Click. Toggle. Solve.</div>
          <h1 className="lo-splash__title">Lights Out</h1>
          <p className="lo-splash__subtitle">Turn off all lights to win!</p>
          <div className="lo-splash__loading">
            <span className="lo-splash__dot"></span>
            <span className="lo-splash__dot"></span>
            <span className="lo-splash__dot"></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lights Out</h1>
        <p className="app-subtitle">Turn off all lights to win!</p>
      </header>

      <main className="app-main">
        <GameBoard board={board} onCellClick={handleCellClick} />

        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Moves</span>
            <span className="stat-value">{moves}</span>
          </div>
          {isSolved && (
            <div className="win-message">
              <span className="trophy">🎉</span>
              <span>Solved in {moves} moves!</span>
              <span className="trophy">🎉</span>
            </div>
          )}
        </div>

        <button onClick={resetGame} className="btn-reset">
          New Game
        </button>
      </main>

      <footer className="app-footer">
        <p>Rules: Click a light to toggle it and its 4 neighbors (up, down, left, right).</p>
      </footer>
    </div>
  )
}
