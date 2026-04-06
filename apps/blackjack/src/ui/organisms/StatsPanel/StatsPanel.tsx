import type { PlayerStatistics } from '@/domain'
import styles from './StatsPanel.module.css'

interface StatsPanelProps {
  stats: PlayerStatistics
  className?: string
}

/**
 * StatsPanel Component - Displays player statistics
 *
 * Shows comprehensive statistics including:
 * - Games played and win rate
 * - Blackjack frequency
 * - Current and best streaks
 * - Total winnings/losses
 */
export function StatsPanel({ stats, className }: StatsPanelProps) {
  const winRate = stats.gamesPlayed > 0 ? (stats.wins / stats.gamesPlayed) * 100 : 0
  const blackjackRate = stats.gamesPlayed > 0 ? (stats.blackjacks / stats.gamesPlayed) * 100 : 0

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <h3 className={styles.title}>Your Statistics</h3>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <div className={styles.label}>Games Played</div>
          <div className={styles.value}>{stats.gamesPlayed}</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Win Rate</div>
          <div className={styles.value}>{winRate.toFixed(1)}%</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Blackjacks</div>
          <div className={styles.value}>
            {stats.blackjacks} ({blackjackRate.toFixed(1)}%)
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Current Streak</div>
          <div
            className={`${styles.value} ${stats.currentStreak > 0 ? styles.positive : stats.currentStreak < 0 ? styles.negative : ''}`}
          >
            {stats.currentStreak > 0 ? `+${stats.currentStreak}` : stats.currentStreak}
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Best Streak</div>
          <div className={`${styles.value} ${styles.positive}`}>+{stats.bestStreak}</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Worst Streak</div>
          <div className={`${styles.value} ${styles.negative}`}>{stats.worstStreak}</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Total Winnings</div>
          <div
            className={`${styles.value} ${stats.totalWinnings >= 0 ? styles.positive : styles.negative}`}
          >
            ${stats.totalWinnings >= 0 ? '+' : ''}
            {stats.totalWinnings}
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.label}>Average Bet</div>
          <div className={styles.value}>${stats.averageBet.toFixed(0)}</div>
        </div>
      </div>
    </div>
  )
}
