import { useGame, useSettingsModal, useStats, useThemeContext } from '@/app'
import { COLOR_THEMES, initBoardWasm } from '@/domain'
import { OfflineIndicator } from '@/ui/atoms'
import { GameBoard, HamburgerMenu, QuickThemePicker } from '@/ui/molecules'
import { SettingsModal } from '@/ui/organisms'
import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './App.module.css'

export default function App() {
  const { board, moves, isSolved, handleCellClick, resetGame } = useGame()
  const { stats, recordWin, resetStats } = useStats()
  const { settings, setColorTheme } = useThemeContext()
  const { isOpen: isSettingsOpen, open: openSettings, close: closeSettings } = useSettingsModal()
  const [isLoading, setIsLoading] = useState(true)
  const recordedWin = useRef(false)

  // Initialize WASM module for board optimization
  useEffect(() => {
    initBoardWasm().catch((err) => console.warn('WASM init failed:', err))
  }, [])

  // Loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isSolved && !recordedWin.current) {
      recordWin()
      recordedWin.current = true
    }
    if (!isSolved) {
      recordedWin.current = false
    }
  }, [isSolved, recordWin])

  const handleNewGame = useCallback(() => {
    resetGame()
  }, [resetGame])

  if (isLoading) {
    return (
      <div className={styles.loSplash}>
        <div className={styles.loSplashOrb}></div>
        <div className={styles.loSplashGrid}></div>
        <div className={styles.loSplashContent}>
          <div className={styles.loSplashBadge}>
            <div className={styles.loSplashEmoji}>💡</div>
          </div>
          <div className={styles.loSplashEyebrow}>Click. Toggle. Solve.</div>
          <h1 className={styles.loSplashTitle}>Lights Out</h1>
          <p className={styles.loSplashSubtitle}>Turn off all lights to win!</p>
          <div className={styles.loSplashLoading}>
            <span className={styles.loSplashDot}></span>
            <span className={styles.loSplashDot}></span>
            <span className={styles.loSplashDot}></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="lights-out-main-content" className={styles.appContainer}>
      <OfflineIndicator />

      <header className={styles.appHeader}>
        <h1 className={styles.headerTitle}>Lights Out</h1>

        <div className={styles.headerRight}>
          <HamburgerMenu>
            <div className={styles.hamburgerPanelContent}>
              <h3 className={styles.menuSectionTitle}>Theme</h3>
              <QuickThemePicker
                themes={COLOR_THEMES}
                activeThemeId={settings.colorTheme}
                onSelectTheme={(themeId) => {
                  setColorTheme(themeId)
                }}
              />

              <h3 className={styles.menuSectionTitle}>Game</h3>
              <button type="button" onClick={handleNewGame} className={styles.hamburgerMenuButton}>
                New Game
              </button>
              <button type="button" onClick={resetStats} className={styles.hamburgerMenuButton}>
                Reset Stats
              </button>

              <h3 className={styles.menuSectionTitle}>Settings</h3>
              <button type="button" onClick={openSettings} className={styles.hamburgerMenuButton}>
                All Settings
              </button>
            </div>
          </HamburgerMenu>
        </div>
      </header>

      <main className={styles.appContent}>
        <GameBoard board={board} onCellClick={handleCellClick} />

        <div className={styles.gameStats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Moves</span>
            <span className={styles.statValue}>{moves}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Wins</span>
            <span className={styles.statValue}>{stats.wins}</span>
          </div>
          {isSolved && (
            <div className={styles.winMessage}>
              <span className={styles.trophy}>🎉</span>
              <span>Solved in {moves} moves!</span>
              <span className={styles.trophy}>🎉</span>
            </div>
          )}
        </div>

        <button onClick={handleNewGame} className={styles.btnReset}>
          New Game
        </button>
      </main>

      <footer className={styles.appFooter}>
        <p>Rules: Click a light to toggle it and its 4 neighbors (up, down, left, right).</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
    </div>
  )
}
