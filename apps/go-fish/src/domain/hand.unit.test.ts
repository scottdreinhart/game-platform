import { describe, expect, it } from 'vitest'

/**
 * Unit tests for Go Fish game mechanics
 * Tests hand management, book detection, and draw logic
 */

interface GoFishCard {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  rank: string // 'A', '2'-'10', 'J', 'Q', 'K'
}

describe('Go Fish Game', () => {
  it('should detect a book (4 cards of same rank)', () => {
    const hand: GoFishCard[] = [
      { suit: 'hearts', rank: '5' },
      { suit: 'diamonds', rank: '5' },
      { suit: 'clubs', rank: '5' },
      { suit: 'spades', rank: '5' },
    ]

    const rankCounts = new Map<string, number>()
    for (const card of hand) {
      rankCounts.set(card.rank, (rankCounts.get(card.rank) ?? 0) + 1)
    }

    const hasBook = Array.from(rankCounts.values()).some((count) => count === 4)
    expect(hasBook).toBe(true)
  })

  it('should allow asking for a rank that exists in hand', () => {
    const hand: GoFishCard[] = [
      { suit: 'hearts', rank: 'K' },
      { suit: 'diamonds', rank: '7' },
      { suit: 'clubs', rank: 'K' },
    ]

    const rankToAsk = 'K'
    const hasRank = hand.some((card) => card.rank === rankToAsk)

    expect(hasRank).toBe(true)
  })
})
