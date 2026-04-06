/**
 * useBasicStrategy Hook
 *
 * Manages basic strategy recommendations and tracking for player decisions.
 * Provides visual hints and accuracy feedback for learning mode.
 */

import type { GameAction, StrategyHint } from '@/domain'
import { getBasicStrategyRecommendation, getStrategyAccuracyFeedback } from '@/domain'
import type { Card } from '@games/card-deck-core'
import { useCallback, useState } from 'react'

interface UseBasicStrategyProps {
  enabled: boolean
  learningMode: boolean
}

interface UseBasicStrategyResult {
  currentHint: StrategyHint | null
  correctDecisions: number
  totalDecisions: number
  accuracyRate: number
  getRecommendation: (
    playerValue: number | { hard: number; soft?: number },
    dealerUpCard: Card,
    playerAction: GameAction,
  ) => { recommendedAction: string; isCorrect: boolean }
  recordDecision: (isCorrect: boolean) => void
  resetStats: () => void
}

export const useBasicStrategy = ({
  enabled,
  learningMode,
}: UseBasicStrategyProps): UseBasicStrategyResult => {
  const [currentHint, setCurrentHint] = useState<StrategyHint | null>(null)
  const [correctDecisions, setCorrectDecisions] = useState(0)
  const [totalDecisions, setTotalDecisions] = useState(0)

  const accuracyRate = totalDecisions > 0 ? (correctDecisions / totalDecisions) * 100 : 0

  // Get recommendation for regular hand decision
  const getRecommendation = useCallback(
    (
      playerValue: number | { hard: number; soft?: number },
      dealerUpCard: Card,
      playerAction: GameAction,
    ) => {
      if (!enabled) {
        return { recommendedAction: '', isCorrect: false }
      }

      const recommendation = getBasicStrategyRecommendation(playerValue, dealerUpCard)
      const feedback = getStrategyAccuracyFeedback(recommendation as any, playerAction)
      
      // Generate hint if learning mode is enabled
      if (learningMode) {
        const hint: StrategyHint = {
          type: feedback.isCorrect ? 'confirmation' : 'correction',
          message: feedback.feedback,
          priority: feedback.isCorrect ? 'low' : 'high',
          showInLearningMode: true,
        }
        setCurrentHint(hint)
      }

      // Auto-record decision if learning mode
      if (learningMode) {
        recordDecision(feedback.isCorrect)
      }

      return { recommendedAction: recommendation, isCorrect: feedback.isCorrect }
    },
    [enabled, learningMode],
  )

  // Record a decision as correct or incorrect
  const recordDecision = useCallback((isCorrect: boolean) => {
    setTotalDecisions((prev) => prev + 1)
    if (isCorrect) {
      setCorrectDecisions((prev) => prev + 1)
    }
  }, [])

  // Reset statistics
  const resetStats = useCallback(() => {
    setCorrectDecisions(0)
    setTotalDecisions(0)
    setCurrentHint(null)
  }, [])

  return {
    currentHint,
    correctDecisions,
    totalDecisions,
    accuracyRate,
    getRecommendation,
    recordDecision,
    resetStats,
  }
}
