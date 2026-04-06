import {
  HamburgerMenu as SharedHamburgerMenu,
  type MenuItem,
} from '@games/bingo-ui-components/organisms'

export interface HamburgerMenuProps {
  onSettings: () => void
  onAbout: () => void
  onRules: () => void
}

/**
 * Hamburger menu adapter for quick navigation and access to settings/about/rules.
 * Uses shared HamburgerMenu component with bingo-specific menu items.
 */
export function HamburgerMenu({ onSettings, onAbout, onRules }: HamburgerMenuProps) {
  const items: MenuItem[] = [
    {
      label: 'How to Play',
      icon: '🎮',
      action: onRules,
    },
    {
      label: 'Settings',
      icon: '⚙️',
      action: onSettings,
    },
    {
      label: 'About',
      icon: 'ℹ️',
      action: onAbout,
    },
  ]

  return <SharedHamburgerMenu items={items} />
}
