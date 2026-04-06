import { HamburgerMenu as SharedHamburgerMenu, type MenuItem } from '@games/common'

export interface HamburgerMenuProps {
  onExit: () => void
  onToggleSound: () => void
  soundEnabled: boolean
}

/**
 * Bunco HamburgerMenu — Adapter for local callbacks
 *
 * Converts Bunco-specific callbacks to the shared menu items format.
 * Uses the shared HamburgerMenu from @games/common for consistent behavior.
 */
export function HamburgerMenu({ onExit, onToggleSound, soundEnabled }: HamburgerMenuProps) {
  // Convert callbacks to items format for shared component
  const menuItems: MenuItem[] = [
    {
      label: soundEnabled ? 'Mute Sounds' : 'Enable Sounds',
      icon: soundEnabled ? '🔊' : '🔇',
      action: onToggleSound,
    },
    {
      label: 'Back to Menu',
      icon: '🏠',
      action: onExit,
    },
  ]

  return <SharedHamburgerMenu items={menuItems} ariaLabel="Bunco menu" />
}
