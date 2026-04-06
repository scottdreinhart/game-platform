import type { HandHistory } from '@/domain'
import styles from './HistoryPanel.module.css'

interface HistoryPanelProps {
  recentGames: HandHistory[]
  className?: string
}

/**
 * HistoryPanel Component - Displays recent game history
 *
 * Shows the last several games with:
 * - Date/time of game
 * - Bet amount
 * - Outcome (win/loss/push)
 * - Payout amount
 */
export function HistoryPanel({ recentGames, className }: HistoryPanelProps) {
  if (recentGames.length === 0) {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        <h3 className={styles.title}>Game History</h3>
        <div className={styles.empty}>
          <p>No games played yet.</p>
          <p>Start playing to see your history!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h3 className={styles.title}>Recent Games</h3>

      <div className={styles.historyList}>
        {recentGames.slice(0, 10).map((game, index) => (
          <div key={game.gameId} className={styles.gameItem}>
            <div className={styles.gameHeader}>
              <div className={styles.gameNumber}>#{recentGames.length - index}</div>
              <div className={styles.gameDate}>{new Date(game.timestamp).toLocaleDateString()}</div>
            </div>

            <div className={styles.gameDetails}>
              <div className={styles.detail}>
                <span className={styles.label}>Bet:</span>
                <span className={styles.value}>${game.amounts.bet}</span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Outcome:</span>
                <span className={`${styles.value} ${styles.outcome} ${styles[game.outcomes[0]]}`}>
                  {game.outcomes[0]}
                </span>
              </div>

              <div className={styles.detail}>
                <span className={styles.label}>Result:</span>
                <span
                  className={`${styles.value} ${game.amounts.payout >= 0 ? styles.positive : styles.negative}`}
                >
                  {game.amounts.payout >= 0 ? '+' : ''}${game.amounts.payout}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recentGames.length > 10 && (
        <div className={styles.moreIndicator}>And {recentGames.length - 10} more games...</div>
      )}
    </div>
  )
}
