/**
 * Blackjack API client module
 *
 * Uses @games/shared-api-client for secure HTTP communication
 */

import {
  createApiClient,
  type ApiResult,
} from '@games/shared-api-client'
import { getConfig } from '@games/shared-config'

// Initialize API client with app configuration
const config = getConfig()
const apiClient = createApiClient({
  baseUrl: config.apiUrl,
  timeout: config.apiTimeout,
})

/**
 * Game statistics from server
 */
export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  totalWinnings: number
  largestWin: number
}

/**
 * Get player statistics from server
 */
export async function getPlayerStats(
  playerId: string,
): Promise<ApiResult<GameStats>> {
  return apiClient.get<GameStats>(`/api/players/${playerId}/stats`)
}

/**
 * Save game result to server
 */
export async function saveGameResult(
  playerId: string,
  result: {
    outcome: 'win' | 'loss' | 'draw'
    winnings: number
    handsPlayed: number
  },
): Promise<ApiResult<{ saved: boolean }>> {
  return apiClient.post(`/api/players/${playerId}/games`, result)
}
