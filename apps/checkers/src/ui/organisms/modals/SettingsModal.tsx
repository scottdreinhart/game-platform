/**
 * Settings Modal Adapter for Checkers App
 * Wraps the shared SettingsModal component with checkers-specific game configuration.
 *
 * Controls gameplay options, difficulty, timer, audio, visual themes, and accessibility features.
 */

import type { SettingsSection } from '@games/bingo-ui-components/organisms'
import { SettingsModal as SharedSettingsModal } from '@games/bingo-ui-components/organisms'

export interface SettingsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

/**
 * Settings modal for configuring Checkers gameplay, difficulty, timer, audio, theme, and accessibility.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const SETTINGS_SECTIONS: SettingsSection[] = [
    {
      category: 'Gameplay',
      description: 'Configure game rules and difficulty',
      controls: [
        {
          label: 'Difficulty',
          type: 'select',
          options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Medium', value: 'medium' },
            { label: 'Hard', value: 'hard' },
            { label: 'Expert', value: 'expert' },
          ],
          description: 'AI opponent skill level',
        },
        {
          label: 'Enable Timer',
          type: 'toggle',
          description: 'Limit each turn to a set time',
        },
        {
          label: 'Time per Turn',
          type: 'number',
          min: 10,
          max: 300,
          step: 10,
          unit: 'seconds',
          description: 'Seconds allowed per move',
          dependsOn: 'Enable Timer',
        },
        {
          label: 'Allow Undo',
          type: 'toggle',
          description: 'Allow taking back moves',
        },
      ],
    },
    {
      category: 'Display & Theme',
      description: 'Customize visual appearance',
      controls: [
        {
          label: 'Color Scheme',
          type: 'select',
          options: [
            { label: 'Classic', value: 'classic' },
            { label: 'Modern', value: 'modern' },
            { label: 'High Contrast', value: 'high-contrast' },
            { label: 'Dark Mode', value: 'dark' },
          ],
          description: 'Board and piece colors',
        },
        {
          label: 'Board Size',
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          description: 'Scale of the game board',
        },
        {
          label: 'Piece Style',
          type: 'select',
          options: [
            { label: 'Flat', value: 'flat' },
            { label: 'Gradient', value: 'gradient' },
            { label: '3D', value: '3d' },
          ],
          description: 'How pieces are rendered',
        },
        {
          label: 'Show Grid Lines',
          type: 'toggle',
          description: 'Display board grid overlay',
        },
        {
          label: 'Highlight Valid Moves',
          type: 'toggle',
          description: 'Show possible destinations when piece selected',
        },
      ],
    },
    {
      category: 'Audio',
      description: 'Sound effects and music settings',
      controls: [
        {
          label: 'Master Volume',
          type: 'slider',
          min: 0,
          max: 100,
          unit: '%',
          description: 'Overall sound level',
        },
        {
          label: 'Sound Effects',
          type: 'toggle',
          description: 'Enable move, capture, and click sounds',
        },
        {
          label: 'Background Music',
          type: 'toggle',
          description: 'Enable ambient game music',
        },
        {
          label: 'Notification Sounds',
          type: 'toggle',
          description: 'Sounds for game state changes',
        },
      ],
    },
    {
      category: 'Accessibility',
      description: 'Features for comfortable play',
      controls: [
        {
          label: 'High Contrast Mode',
          type: 'toggle',
          description: 'WCAG AA compliant color scheme',
        },
        {
          label: 'Reduce Motion',
          type: 'toggle',
          description: 'Minimize animations and transitions',
        },
        {
          label: 'Large Text',
          type: 'toggle',
          description: 'Increase font sizes for readability',
        },
        {
          label: 'Keyboard Navigation Only',
          type: 'toggle',
          description: 'Play using keyboard controls',
        },
        {
          label: 'Screen Reader Support',
          type: 'toggle',
          description: 'Optimize for screen readers (ARIA labels)',
        },
        {
          label: 'Haptic Feedback',
          type: 'toggle',
          description: 'Vibration on mobile devices',
        },
      ],
    },
    {
      category: 'Data & Privacy',
      description: 'Manage game data and preferences',
      controls: [
        {
          label: 'Auto-Save Progress',
          type: 'toggle',
          description: 'Automatically save game state',
        },
        {
          label: 'Reset to Defaults',
          type: 'button',
          buttonLabel: 'Reset All Settings',
          description: 'Restore all settings to defaults',
        },
        {
          label: 'Clear Game History',
          type: 'button',
          buttonLabel: 'Clear History',
          description: 'Remove all past game records',
          warning: 'This action cannot be undone',
        },
      ],
    },
  ]

  return (
    <SharedSettingsModal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      sections={SETTINGS_SECTIONS}
    />
  )
}
