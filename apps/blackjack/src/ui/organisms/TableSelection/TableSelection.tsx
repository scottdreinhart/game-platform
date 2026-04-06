import {
  BETTING_LIMITS_CASUAL,
  BETTING_LIMITS_HIGH_ROLLER,
  BETTING_LIMITS_MID,
  CHIP_SET_CASUAL,
  CHIP_SET_HIGH_ROLLER,
  CHIP_SET_MID,
  RECOMMENDED_BANKROLLS,
  type TableVariant,
} from '@games/banking'
import React, { useCallback } from 'react'
import styles from './TableSelection.module.css'

export interface TableSelectionProps {
  /**
   * Player's current balance
   */
  balance: number
  /**
   * Called when player selects a table
   */
  onSelectTable: (variant: TableVariant, chipSet: readonly number[]) => void
  /**
   * Is table selection disabled?
   */
  disabled?: boolean
}

interface TableOption {
  variant: TableVariant
  title: string
  description: string
  minBet: number
  maxBet: number
  recommended: number
  comfortable: number
  chipSet: readonly number[]
  emoji: string
  color: string
}

const TABLE_OPTIONS: TableOption[] = [
  {
    variant: 'casual',
    title: 'Casual Table',
    description: 'Perfect for learning and relaxed play',
    minBet: BETTING_LIMITS_CASUAL.minBet,
    maxBet: BETTING_LIMITS_CASUAL.maxBet,
    recommended: RECOMMENDED_BANKROLLS.casual.recommended,
    comfortable: RECOMMENDED_BANKROLLS.casual.comfortable,
    chipSet: CHIP_SET_CASUAL,
    emoji: '🎲',
    color: '#2e7d32',
  },
  {
    variant: 'mid',
    title: 'Mid-Stakes Table',
    description: 'Standard casino play with moderate risk',
    minBet: BETTING_LIMITS_MID.minBet,
    maxBet: BETTING_LIMITS_MID.maxBet,
    recommended: RECOMMENDED_BANKROLLS.mid.recommended,
    comfortable: RECOMMENDED_BANKROLLS.mid.comfortable,
    chipSet: CHIP_SET_MID,
    emoji: '💎',
    color: '#0d47a1',
  },
  {
    variant: 'high-roller',
    title: 'High Roller Table',
    description: 'Premium stakes for experienced players',
    minBet: BETTING_LIMITS_HIGH_ROLLER.minBet,
    maxBet: BETTING_LIMITS_HIGH_ROLLER.maxBet,
    recommended: RECOMMENDED_BANKROLLS.highRoller.recommended,
    comfortable: RECOMMENDED_BANKROLLS.highRoller.comfortable,
    chipSet: CHIP_SET_HIGH_ROLLER,
    emoji: '👑',
    color: '#6a1b9a',
  },
]

/**
 * TableSelection — Allows player to choose which casino table to play at.
 *
 * Each table has different betting limits, chip denominations, and house rules.
 * Player's balance determines availability/recommendations.
 */
export const TableSelection = React.memo<TableSelectionProps>(
  ({ balance, onSelectTable, disabled = false }) => {
    const handleSelectTable = useCallback(
      (variant: TableVariant, chipSet: readonly number[]) => {
        onSelectTable(variant, chipSet as number[])
      },
      [onSelectTable],
    )

    return (
      <div className={styles.root}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Select Your Table</h2>
          <p className={styles.subtitle}>Choose your preferred betting level</p>
          <div className={styles.balanceDisplay}>
            <span className={styles.balanceLabel}>Your Balance</span>
            <span className={styles.balanceAmount}>${balance}</span>
          </div>
        </div>

        {/* Table Options Grid */}
        <div className={styles.tablesGrid}>
          {TABLE_OPTIONS.map((table) => {
            const canAfford = balance >= table.minBet
            const isRecommended = balance >= table.recommended
            const isComfortable = balance >= table.comfortable

            return (
              <div
                key={table.variant}
                className={`${styles.tableCard} ${isComfortable ? styles.comfortable : isRecommended ? styles.recommended : ''}`}
              >
                {/* Table Header */}
                <div className={styles.tableHeader} style={{ borderColor: table.color }}>
                  <span className={styles.emoji}>{table.emoji}</span>
                  <h3 className={styles.tableName}>{table.title}</h3>
                </div>

                {/* Table Description */}
                <p className={styles.tableDescription}>{table.description}</p>

                {/* Betting Limits */}
                <div className={styles.limitsBox}>
                  <div className={styles.limitRow}>
                    <span className={styles.limitLabel}>Min Bet:</span>
                    <span className={styles.limitValue}>${table.minBet}</span>
                  </div>
                  <div className={styles.limitRow}>
                    <span className={styles.limitLabel}>Max Bet:</span>
                    <span className={styles.limitValue}>${table.maxBet}</span>
                  </div>
                </div>

                {/* Chip Set */}
                <div className={styles.chipSetBox}>
                  <span className={styles.chipSetLabel}>Available Chips</span>
                  <div className={styles.chipSet}>
                    {table.chipSet.map((chip) => (
                      <div key={chip} className={styles.chipDenom} title={`$${chip} chip`}>
                        ${chip}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bankroll Recommendation */}
                <div className={styles.recommendationBox}>
                  {isComfortable ? (
                    <div className={`${styles.recommendation} ${styles.comfortable}`}>
                      ✓ Great for your bankroll
                    </div>
                  ) : isRecommended ? (
                    <div className={`${styles.recommendation} ${styles.recommended}`}>
                      ✓ Good fit
                    </div>
                  ) : canAfford ? (
                    <div className={`${styles.recommendation} ${styles.tight}`}>
                      ⚠ Tight bankroll (min recommended: ${table.recommended})
                    </div>
                  ) : (
                    <div className={`${styles.recommendation} ${styles.unavailable}`}>
                      ✗ Unavailable (need $${table.minBet})
                    </div>
                  )}
                </div>

                {/* Select Button */}
                <button
                  className={styles.selectButton}
                  style={{ backgroundColor: table.color }}
                  onClick={() => handleSelectTable(table.variant, table.chipSet)}
                  disabled={disabled || !canAfford}
                  title={!canAfford ? `Requires minimum $${table.minBet}` : undefined}
                >
                  {canAfford ? 'Select Table' : 'Unavailable'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Tips Section */}
        <div className={styles.tips}>
          <h4 className={styles.tipsTitle}>💡 Bankroll Tips</h4>
          <ul className={styles.tipsList}>
            <li>
              <strong>20x rule:</strong> Have at least 20 times the minimum bet
            </li>
            <li>
              <strong>100x ideal:</strong> Comfortable play requires 100x the minimum
            </li>
            <li>
              <strong>House edge:</strong> Blackjack favors disciplined players (~0.5%)
            </li>
            <li>
              <strong>Session limit:</strong> Set a loss limit before playing
            </li>
          </ul>
        </div>
      </div>
    )
  },
)

TableSelection.displayName = 'TableSelection'
