import type { GameAction } from '@/domain'
import React from 'react'
import styles from './ActionPanel.module.css'

export interface ActionPanelProps {
  /** Available actions the player can take */
  availableActions: GameAction[]
  /** Callback when action is selected */
  onAction: (action: GameAction) => void
  /** Whether panel is disabled (e.g., during animation) */
  disabled?: boolean
  /** Layout orientation */
  layout?: 'row' | 'column'
  /** Additional CSS classes */
  className?: string
  /** Undo/redo functionality */
  canUndo?: boolean
  canRedo?: boolean
  onUndo?: () => void
  onRedo?: () => void
}

const ACTION_LABELS: Record<GameAction, string> = {
  hit: 'Hit',
  stand: 'Stand',
  double: 'Double Down',
  split: 'Split',
  surrender: 'Surrender',
  insurance: 'Insurance',
}

const ACTION_DESCRIPTIONS: Record<GameAction, string> = {
  hit: 'Request another card',
  stand: 'Keep current hand',
  double: 'Double bet and take one card',
  split: 'Split pair into two hands',
  surrender: 'Give up half the bet',
  insurance: 'Insurance against dealer blackjack',
}

const UNDO_REDO_LABELS = {
  undo: 'Undo',
  redo: 'Redo',
}

const UNDO_REDO_DESCRIPTIONS = {
  undo: 'Undo the last action',
  redo: 'Redo the undone action',
}

/**
 * ActionPanel Molecule — Game action buttons
 *
 * Displays available player actions (Hit, Stand, Double Down, Split, Surrender).
 * Automatically disables unavailable actions.
 */
export const ActionPanel = React.memo<ActionPanelProps>(
  ({
    availableActions,
    onAction,
    disabled = false,
    layout = 'row',
    className = '',
    canUndo = false,
    canRedo = false,
    onUndo,
    onRedo,
  }) => {
    const allActions: GameAction[] = ['hit', 'stand', 'double', 'split', 'surrender', 'insurance']

    const handleActionClick = (action: GameAction) => {
      if (!disabled && availableActions.includes(action)) {
        onAction(action)
      }
    }

    const handleUndoClick = () => {
      if (!disabled && canUndo && onUndo) {
        onUndo()
      }
    }

    const handleRedoClick = () => {
      if (!disabled && canRedo && onRedo) {
        onRedo()
      }
    }

    const handleActionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, action: GameAction) => {
      if (
        (e.code === 'Space' || e.code === 'Enter') &&
        !disabled &&
        availableActions.includes(action)
      ) {
        e.preventDefault()
        onAction(action)
      }
    }

    const handleUndoRedoKeyDown = (
      e: React.KeyboardEvent<HTMLButtonElement>,
      action: 'undo' | 'redo',
    ) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        if (action === 'undo' && canUndo && onUndo) {
          onUndo()
        } else if (action === 'redo' && canRedo && onRedo) {
          onRedo()
        }
      }
    }

    return (
      <div
        className={`${styles.root} ${styles[layout]} ${className}`}
        aria-label="Player actions"
        aria-disabled={disabled}
      >
        {allActions.map((action) => {
          const isAvailable = availableActions.includes(action)

          return (
            <button
              key={action}
              className={`${styles.button} ${isAvailable ? styles.available : styles.unavailable}`}
              onClick={() => handleActionClick(action)}
              onKeyDown={(e) => handleActionKeyDown(e, action)}
              disabled={!isAvailable || disabled}
              title={ACTION_DESCRIPTIONS[action]}
              aria-label={ACTION_LABELS[action]}
              aria-disabled={!isAvailable || disabled}
            >
              {ACTION_LABELS[action]}
            </button>
          )
        })}

        {/* Undo/Redo buttons */}
        {canUndo && (
          <button
            className={`${styles.button} ${styles.undoRedo}`}
            onClick={handleUndoClick}
            onKeyDown={(e) => handleUndoRedoKeyDown(e, 'undo')}
            disabled={disabled}
            title={UNDO_REDO_DESCRIPTIONS.undo}
            aria-label={UNDO_REDO_LABELS.undo}
            aria-disabled={disabled}
          >
            {UNDO_REDO_LABELS.undo}
          </button>
        )}

        {canRedo && (
          <button
            className={`${styles.button} ${styles.undoRedo}`}
            onClick={handleRedoClick}
            onKeyDown={(e) => handleUndoRedoKeyDown(e, 'redo')}
            disabled={disabled}
            title={UNDO_REDO_DESCRIPTIONS.redo}
            aria-label={UNDO_REDO_LABELS.redo}
            aria-disabled={disabled}
          >
            {UNDO_REDO_LABELS.redo}
          </button>
        )}
      </div>
    )
  },
)

ActionPanel.displayName = 'ActionPanel'
