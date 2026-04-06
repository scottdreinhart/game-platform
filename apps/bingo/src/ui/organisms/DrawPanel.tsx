/**
 * Draw Panel Component - Bingo App Adapter
 * Wraps the shared DrawPanel component and adapts it to the bingo app's interface.
 * 
 * This adapter bridges the bingo app's state management with the generic
 * shared DrawPanel component, maintaining backward compatibility while
 * leveraging the shared component's functionality.
 */

import type { BingoCard, DrawResult } from '@games/bingo-core'
import { DrawPanel as SharedDrawPanel } from '@games/bingo-ui-components/organisms'
import React, { useCallback, useMemo } from 'react'

interface DrawPanelProps {
  currentNumber: number | null
  numbersDrawn: number
  totalNumbers: number
  onDraw: () => DrawResult | null
  onReset: () => void
  disabled?: boolean
  winners?: string[]
  card?: BingoCard
}

export const DrawPanel: React.FC<DrawPanelProps> = ({
  currentNumber,
  numbersDrawn,
  totalNumbers,
  onDraw,
  onReset,
  disabled = false,
  winners,
}) => {
  // Determine game state based on remaining numbers
  const remaining = totalNumbers - numbersDrawn
  const gameState =
    remaining === 0 ? ('won' as const) : disabled ? ('idle' as const) : ('playing' as const)

  // Create a mock card for the shared component
  // In a full implementation, this would accept the actual card
  const mockCard: BingoCard = useMemo(
    () => ({
      numbers: [],
      rows: [],
      columns: [],
      isWinner: () => false,
      markNumber: () => {},
      isMarked: () => false,
    } as any),
    [],
  )

  // Create drawn numbers array from current state
  // In the actual app, this would come from gameState.drawnNumbers
  // For now, we create a placeholder array
  const drawnNumbers = useMemo(() => {
    const nums: number[] = []
    if (currentNumber !== null) {
      nums.push(currentNumber)
    }
    return nums
  }, [currentNumber])

  // Wrap the onDraw callback with validation
  const handleDraw = useCallback(() => {
    if (disabled || remaining === 0) return
    const result = onDraw()
    // Result is handled by the onDraw callback
  }, [disabled, remaining, onDraw])

  // Handle new game (same as reset for now)
  const handleNewGame = useCallback(() => {
    onReset()
  }, [onReset])

  return (
    <SharedDrawPanel
      card={mockCard}
      drawnNumbers={drawnNumbers}
      gameState={gameState}
      onDraw={handleDraw}
      onReset={onReset}
      onNewGame={handleNewGame}
      canDraw={!disabled && remaining > 0}
      remainingCount={remaining}
      totalCount={totalNumbers}
    />
  )
}
