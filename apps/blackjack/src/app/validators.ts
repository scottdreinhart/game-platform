/**
 * Blackjack-specific validation utilities
 *
 * Uses shared validators from @games/shared-validators
 * Provides domain-specific validation patterns for blackjack rules
 */

import {
  validateNumber,
  validateObject,
  validateString,
  type ValidationResult,
} from '@games/shared-validators'

/**
 * Validate a bet amount in blackjack
 *
 * Rules:
 * - Must be a number
 * - Must be positive
 * - Must be within reasonable game limits
 */
export function validateBetAmount(input: unknown): ValidationResult<number> {
  return validateNumber(input, {
    min: 1,
    max: 10000,
    integer: true,
  })
}

/**
 * Validate a player name
 *
 * Rules:
 * - Must be a string
 * - 1-50 characters
 * - Only alphanumeric and spaces
 */
export function validatePlayerName(input: unknown): ValidationResult<string> {
  return validateString(input, {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s]+$/,
    trim: true,
  })
}

/**
 * Validate game move (hit, stand, double down, etc.)
 *
 * Rules:
 * - Must be one of: 'hit', 'stand', 'double', 'split'
 */
export function validateGameMove(input: unknown): ValidationResult<string> {
  const result = validateString(input, {
    minLength: 1,
    maxLength: 20,
  })

  if (!result.ok) {
    return result
  }

  const validMoves = ['hit', 'stand', 'double', 'split']
  const move = result.value.toLowerCase()

  if (!validMoves.includes(move)) {
    return {
      ok: false,
      error: `Invalid move. Expected one of: ${validMoves.join(', ')}`,
    }
  }

  return { ok: true, value: move }
}

/**
 * Validate player data structure
 *
 * Ensures player object has required properties
 */
export function validatePlayerData(
  input: unknown,
): ValidationResult<{ name: string; bet: number }> {
  return validateObject<{ name: string; bet: number }>(input, {
    name: validatePlayerName,
    bet: validateBetAmount,
  })
}
