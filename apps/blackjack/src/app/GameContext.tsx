/**
 * Game Context - Central game state management
 * Provides a React Context for sharing game state across components
 */

import type { GameAction, GameState } from '@/domain'
import { createGameState, dealInitialHands, playDealerTurn, processPlayerAction } from '@/domain'
import React, { createContext, ReactNode, useReducer } from 'react'

export interface GameContextValue {
  gameState: GameState
  dispatch: React.Dispatch<GameContextAction>
}

export type GameContextAction =
  | { type: 'RESET_GAME'; payload?: { balance?: number } }
  | { type: 'SET_BET'; payload: number }
  | { type: 'DEAL_HANDS'; payload: { playerCards: any[]; dealerCards: any[] } }
  | { type: 'PLAYER_ACTION'; payload: { action: GameAction; card?: any } }
  | { type: 'DEALER_TURN'; payload: { cards: any[] } }
  | { type: 'SETTLEMENT' }
  | { type: 'NEW_ROUND' }

function gameReducer(state: GameState, action: GameContextAction): GameState {
  switch (action.type) {
    case 'RESET_GAME':
      return createGameState(action.payload?.balance)

    case 'SET_BET':
      return {
        ...state,
        player: {
          ...state.player,
          currentHand: {
            ...state.player.currentHand,
            bet: action.payload,
          },
        },
      }

    case 'DEAL_HANDS':
      return dealInitialHands(state, action.payload.playerCards, action.payload.dealerCards)

    case 'PLAYER_ACTION':
      return processPlayerAction(state, action.payload.action, action.payload.card)

    case 'DEALER_TURN':
      return playDealerTurn(state, action.payload.cards)

    case 'SETTLEMENT':
      return {
        ...state,
        phase: 'settlement',
      }

    case 'NEW_ROUND':
      return createGameState(state.player.balance)

    default:
      return state
  }
}

export const GameContext = createContext<GameContextValue | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, dispatch] = useReducer(gameReducer, createGameState())

  return <GameContext.Provider value={{ gameState, dispatch }}>{children}</GameContext.Provider>
}

export function useGameContext() {
  const context = React.useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return context
}
