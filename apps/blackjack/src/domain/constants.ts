/**
 * Blackjack Domain Constants
 * Game configuration, rules, and default values
 */

import type { GameRules } from './types'

// ┌─────────────────────────────────────────────────────────┐
// │ GAME RULES & CONFIGURATION                              │
// └─────────────────────────────────────────────────────────┘

/**
 * Vegas Strip Blackjack Rules (most common variant)
 */
export const RULES_VEGAS_STRIP: GameRules = {
  name: 'Vegas Strip',
  decks: 8,
  dealerHitsSoft17: true,
  doubleDownAllowed: true,
  doubleDownOnAny: true,
  splitAllowed: true,
  resplitAllowed: true,
  resplitAces: false,
  surrenderAllowed: true,
  insuranceAllowed: false,
  blackjackPayout: 1.5,
}

/**
 * Single Deck Blackjack Rules
 */
export const RULES_SINGLE_DECK: GameRules = {
  name: 'Single Deck',
  decks: 1,
  dealerHitsSoft17: true,
  doubleDownAllowed: true,
  doubleDownOnAny: true,
  splitAllowed: true,
  resplitAllowed: true,
  resplitAces: false,
  surrenderAllowed: false,
  insuranceAllowed: false,
  blackjackPayout: 1.5,
}

/**
 * Hard Rock Blackjack Rules (restrictive)
 */
export const RULES_HARD_ROCK: GameRules = {
  name: 'Hard Rock',
  decks: 6,
  dealerHitsSoft17: false,
  doubleDownAllowed: true,
  doubleDownOnAny: false, // Only 10 or 11
  splitAllowed: true,
  resplitAllowed: false,
  resplitAces: false,
  surrenderAllowed: false,
  insuranceAllowed: true,
  blackjackPayout: 1.5,
}

// ┌─────────────────────────────────────────────────────────┐
// │ CHIP DENOMINATIONS                                      │
// └─────────────────────────────────────────────────────────┘

/**
 * Standard casino chip denominations (lowest to highest)
 * Used for betting UI and chip-based banking system
 */
export const CHIP_DENOMINATIONS = [1, 5, 10, 25, 50, 100, 500, 1000] as const
export type ChipDenomination = (typeof CHIP_DENOMINATIONS)[number]

// ┌─────────────────────────────────────────────────────────┐
// │ GAME LIMITS                                             │
// └─────────────────────────────────────────────────────────┘

export const MIN_BET = 5
export const MAX_BET = 1000
export const DEFAULT_BET = 50
export const DEFAULT_STARTING_BALANCE = 1000

// ┌─────────────────────────────────────────────────────────┐
// │ GAME PHASES                                             │
// └─────────────────────────────────────────────────────────┘

export const HAND_STATUSES = [
  'initial',
  'playing',
  'stand',
  'bust',
  'blackjack',
  'settled',
] as const
export const GAME_PHASES = [
  'betting',
  'dealing',
  'playing',
  'dealer-turn',
  'settlement',
  'game-over',
] as const

// ┌─────────────────────────────────────────────────────────┐
// │ CARD PROPERTIES                                         │
// └─────────────────────────────────────────────────────────┘

export const CARD_SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const
export const CARD_RANKS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
] as const

export const CARD_VALUES: Record<string, number> = {
  A: 11,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 10,
  Q: 10,
  K: 10,
}

// ┌─────────────────────────────────────────────────────────┐
// │ ANIMATION & TIMING                                      │
// └─────────────────────────────────────────────────────────┘

export const DEAL_ANIMATION_MS = 300
export const CARD_FLIP_MS = 200
export const DEALER_THINK_MS = 500
export const SETTLEMENT_DELAY_MS = 1000
