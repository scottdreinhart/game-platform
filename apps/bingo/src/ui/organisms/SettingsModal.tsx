/**
 * Settings Modal Adapter for Bingo App
 * Wraps the shared SettingsModal component with bingo-specific themes and configuration.
 */

import { SettingsModal as SharedSettingsModal } from '@games/bingo-ui-components/organisms'

export interface SettingsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onThemeChange?: (themeId: string) => void
}

/**
 * Settings modal for game preferences.
 * Includes theme/palette selection specific to the bingo game.
 */
export function SettingsModal({
  isOpen,
  onClose,
  onThemeChange,
}: SettingsModalProps) {
  const THEMES = [
    { id: 'classic', label: 'Classic', color: '#1a73e8' },
    { id: 'dark', label: 'Dark', color: '#1e1e1e' },
    { id: 'ocean', label: 'Ocean', color: '#006994' },
    { id: 'forest', label: 'Forest', color: '#2d5016' },
  ]

  return (
    <SharedSettingsModal
      isOpen={isOpen}
      onClose={onClose}
      themes={THEMES}
      onThemeChange={onThemeChange}
    />
  )
}
