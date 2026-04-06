/**
 * Domain types for Dominoes game.
 */

export interface Domino {
  left: number
  right: number
}

export type GamePhase = 'playing' | 'game-over'

export interface GameState {
  phase: GamePhase
  playerHand: Domino[]
  computerHand: Domino[]
  boneyard: Domino[]
  table: Domino[]
  currentPlayer: 'player' | 'computer'
  playerScore: number
  computerScore: number
  gameOver: boolean
}
