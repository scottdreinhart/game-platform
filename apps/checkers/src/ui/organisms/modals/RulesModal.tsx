/**
 * Rules Modal Adapter for Checkers App
 * Wraps the shared RulesModal component with checkers-specific game rules and instructions.
 *
 * Displays gameplay mechanics, board setup, movement rules, and winning conditions.
 */

import { RulesModal as SharedRulesModal } from '@games/bingo-ui-components/organisms'

export interface RulesModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

/**
 * Rules modal displaying how to play Checkers including movement, capturing, and winning conditions.
 */
export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const RULES_SECTIONS = [
    {
      heading: 'Objective',
      content: (
        <p>
          Capture all of your opponent&apos;s pieces or block them so they cannot move. Use your
          pieces strategically to dominate the board and achieve victory.
        </p>
      ),
    },
    {
      heading: 'The Board',
      content: (
        <div>
          <p>
            Checkers is played on an 8×8 board with 32 playable squares (the dark squares). Each
            player starts with 12 pieces arranged in three rows at their end of the board.
          </p>
          <ul style={{ marginLeft: '1.5rem', fontSize: '0.95rem' }}>
            <li>
              <strong>Red pieces</strong> start at the top of the board
            </li>
            <li>
              <strong>Black pieces</strong> start at the bottom of the board
            </li>
            <li>Pieces can only move diagonally on dark squares</li>
          </ul>
        </div>
      ),
    },
    {
      heading: 'Movement Rules',
      content: (
        <ol style={{ marginLeft: '1.5rem', fontSize: '0.95rem' }}>
          <li>
            <strong>Normal moves</strong> — Move your piece diagonally forward to an empty dark
            square
          </li>
          <li>
            <strong>Capturing</strong> — Jump diagonally over an opponent&apos;s piece to capture it
            (the piece must have an empty square beyond it)
          </li>
          <li>
            <strong>Mandatory capture</strong> — If a jump is available, you must take it
          </li>
          <li>
            <strong>Multiple jumps</strong> — Continue jumping if additional captures are available
            from the same piece
          </li>
          <li>
            <strong>Promotion</strong> — When a piece reaches the opposite end, it becomes a King
            and can move backward
          </li>
        </ol>
      ),
    },
    {
      heading: 'Winning the Game',
      content: (
        <ul style={{ marginLeft: '1.5rem', fontSize: '0.95rem' }}>
          <li>Capture all of your opponent&apos;s pieces</li>
          <li>Block your opponent so they cannot make any legal moves</li>
          <li>In timed games, have the highest piece count when time expires</li>
        </ul>
      ),
    },
    {
      heading: 'Game Tips',
      content: (
        <ul style={{ marginLeft: '1.5rem', fontSize: '0.95rem' }}>
          <li>Control the center of the board for better positioning</li>
          <li>Protect your back row — losing pieces there weakens your position</li>
          <li>Force your opponent into bad trades by threatening multiple pieces</li>
          <li>Plan ahead for opportunities to promote to Kings</li>
          <li>Watch for chains of captures that can clear large sections of the board</li>
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
