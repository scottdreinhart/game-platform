/**
 * Blackjack configuration module
 *
 * Uses @games/shared-config for environment variable management
 */

import { getConfig, getBooleanEnv, getStringEnv } from '@games/shared-config'

/**
 * Get Blackjack-specific configuration
 *
 * Merges global app config with game-specific settings
 */
export function getBlackjackConfig() {
  const appConfig = getConfig()

  return {
    // App configuration
    ...appConfig,

    // Blackjack-specific settings
    maxPlayers: 6,
    minBet: 1,
    maxBet: 10000,
    initialChips: 1000,
    dealerStandsOn: 17, // Dealer hits on soft 17
    allowSplits: true,
    allowDoubleDown: true,
    allowInsurance: false, // Not implemented yet

    // Feature flags
    enableAI: getBooleanEnv('VITE_ENABLE_AI', true),
    aiDifficulty: getStringEnv('VITE_AI_DIFFICULTY', 'medium'),
  }
}

// Export type for use in components
export type BlackjackConfig = ReturnType<typeof getBlackjackConfig>
