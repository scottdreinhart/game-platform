import { useBlackjackGame } from '@/app'
import { GameBoard } from './GameBoard'
import type { GameBoardProps as GameLayoutGameBoardProps } from './GameLayout'

/**
 * GameBoardAdapter
 *
 * Bridges GameLayout's GameBoardProps interface with the existing GameBoard component.
 *
 * GameLayout passes:
 * - tableVariant, minBet, maxBet, chipSet, balance, onHandComplete, onChangeTable
 *
 * Existing GameBoard expects:
 * - gameState, phase, currentHand, currentPlayer, availableActions, onBet, onAction, etc.
 *
 * This adapter connects the two by:
 * 1. Using the passed balance and bet limits from GameLayout
 * 2. Using useBlackjackGame to manage game state
 * 3. Translating hand completion to onHandComplete callback
 */
export function GameBoardAdapter({
  tableVariant,
  minBet,
  maxBet,
  chipSet,
  balance,
  onHandComplete,
  onChangeTable,
}: GameLayoutGameBoardProps) {
  const {
    gameState,
    placeBet,
    hit,
    stand,
    doubleDown,
    split,
    playDealer,
    newRound,
    getAvailableActions,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useBlackjackGame()

  const handleBet = (betAmount: number) => {
    // Validate bet against table limits
    if (betAmount < minBet || betAmount > maxBet) {
      return
    }
    placeBet(betAmount)
  }

  const handleNewRound = () => {
    newRound()
  }

  const handleGameAction = (action: string) => {
    switch (action) {
      case 'hit':
        hit()
        break
      case 'stand':
        stand()
        // Dealer will play automatically via useEffect in useGame.ts
        break
      case 'double':
        doubleDown()
        // Dealer will play automatically via useEffect in useGame.ts
        break
      case 'split':
        split()
        break
    }
  }

  const currentPlayer = gameState.players[0]
  const currentHand = currentPlayer?.currentHand

  return (
    <GameBoard
      gameState={gameState}
      phase={gameState.phase}
      currentHand={currentHand ?? null}
      currentPlayer={currentPlayer}
      availableActions={getAvailableActions()}
      onBet={handleBet}
      onAction={handleGameAction as any}
      onNewRound={handleNewRound}
      onHelp={() => {}}
      canUndo={canUndo}
      canRedo={canRedo}
      onUndo={undo}
      onRedo={redo}
    />
  )
}
