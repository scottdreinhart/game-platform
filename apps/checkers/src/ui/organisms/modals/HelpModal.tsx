/**
 * Help Modal Adapter for Checkers App
 * Wraps the shared HelpModal component with checkers-specific help and frequently asked questions.
 *
 * Provides quick answers to common questions about controls, board interaction, and gameplay.
 */

import { HelpModal as SharedHelpModal } from '@games/bingo-ui-components/organisms'

export interface HelpModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

/**
 * Help modal answering common questions about playing Checkers.
 */
export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const HELP_ITEMS = [
    {
      question: 'How do I move my pieces?',
      answer: (
        <p>
          Click on a piece to select it, then click on a highlighted square to move there. Your
          piece moves diagonally, and you can only move to empty dark squares. Look for the
          highlight to see where you can move.
        </p>
      ),
    },
    {
      question: 'How do I capture opponent pieces?',
      answer: (
        <p>
          Jump diagonally over an opponent&apos;s piece to an empty square beyond it. The jumped
          piece is removed from the board. If you have multiple capture options, any valid jump is
          allowed. After capturing, if more jumps are available from the same piece, you may (but
          are not required to) continue jumping.
        </p>
      ),
    },
    {
      question: 'What does a King do?',
      answer: (
        <p>
          When your piece reaches the opposite end of the board, it is promoted to a King. Kings can
          move diagonally forward <strong>or backward</strong>, giving them more movement options.
          This makes them more powerful in the endgame.
        </p>
      ),
    },
    {
      question: 'Is capturing mandatory?',
      answer: (
        <p>
          Yes, if a legal capture is available, you must take it. If multiple captures are
          available, you can choose which one to make. After a capture, if the same piece can
          capture again, those additional captures are usually optional (depending on house rules).
        </p>
      ),
    },
    {
      question: 'How do I win?',
      answer: (
        <p>
          Capture all of your opponent&apos;s pieces, or block them so they have no legal moves
          available. In timed games, the player with the most pieces when time runs out wins.
        </p>
      ),
    },
    {
      question: 'Can I undo my move?',
      answer: (
        <p>
          Depending on the game settings, you may be able to undo recent moves. Look for the undo
          button in the controls, or check the settings to enable/disable move undoing.
        </p>
      ),
    },
    {
      question: 'What does the difficulty level do?',
      answer: (
        <p>
          The difficulty level determines how smart your AI opponent plays. At easier levels, the AI
          makes more random moves. At harder levels, it plays more strategically and looks ahead to
          plan its moves. Adjust the difficulty to match your skill level.
        </p>
      ),
    },
    {
      question: 'How does the timer work?',
      answer: (
        <p>
          In timed games, each player has a limited time for their turn. When your time runs out,
          your turn automatically ends. Make your moves carefully to avoid running out of time.
          Check the settings to adjust time limits.
        </p>
      ),
    },
  ]

  return <SharedHelpModal isOpen={isOpen} onClose={onClose} title="Help & FAQ" items={HELP_ITEMS} />
}
