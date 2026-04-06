/**
 * Rules Modal Adapter for Bingo App
 * Wraps the shared RulesModal component with bingo-specific game rules and instructions.
 *
 * Consolidated UX: Displays gameplay mechanics, instructions, and visual winning patterns.
 * Duplicate "About" content has been moved to AboutModal for clearer information hierarchy.
 */

import { RulesModal as SharedRulesModal } from '@games/bingo-ui-components/organisms'
import { PatternShowcase } from '../molecules/PatternShowcase'

export interface RulesModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

/**
 * Rules modal displaying how to play Bingo including winning conditions and basic instructions.
 * Features visual pattern examples to help players understand winning combinations.
 */
export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const RULES_SECTIONS = [
    {
      heading: 'Objective',
      content: (
        <p>
          Mark numbers on your Bingo card as they are drawn. Be the first to complete a winning
          pattern and call out "Bingo!" to win.
        </p>
      ),
    },
    {
      heading: 'Getting Started',
      content: (
        <ol style={{ marginLeft: '1.5rem' }}>
          <li>
            <strong>Generate a Card</strong> — Click &quot;New Card&quot; to generate a randomized
            Bingo card
          </li>
          <li>
            <strong>Draw Numbers</strong> — Click &quot;Draw&quot; to randomly select the next
            number
          </li>
          <li>
            <strong>Mark Your Card</strong> — Click on numbers on your card as they&apos;re drawn
          </li>
          <li>
            <strong>Complete a Pattern</strong> — Form a winning pattern on your card
          </li>
          <li>
            <strong>Win</strong> — Call &quot;Bingo!&quot; when you complete a pattern
          </li>
        </ol>
      ),
    },
    {
      heading: 'Winning Patterns',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>
            Click on the cards below to see visual examples of all winning patterns. The colored
            tiles show which numbers need to be marked to win:
          </p>
          <div>
            <PatternShowcase />
          </div>
        </div>
      ),
    },
    {
      heading: 'Tips',
      content: (
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Watch the drawn numbers area to track which numbers have been called</li>
          <li>Click numbers on your card to mark them (they&apos;ll turn a different color)</li>
          <li>Use the Hints feature to highlight potential winning patterns</li>
          <li>Play at your own pace — there&apos;s no time limit</li>
          <li>Try different game variants for variety and different challenges</li>
        </ul>
      ),
    },
  ]

  return (
    <SharedRulesModal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play"
      sections={RULES_SECTIONS}
    />
  )
}
