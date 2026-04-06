import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HamburgerMenu } from './HamburgerMenu'

/**
 * HamburgerMenu Integration Tests
 *
 * Tests the HamburgerMenu component integration with modal triggers:
 * - Menu opens/closes on button click
 * - All five menu items are visible and clickable
 * - Callbacks fire correctly for Rules, Help, Settings, Sound, and Exit
 * - Menu closes after item selection
 */
describe('HamburgerMenu Integration', () => {
  const mockOnRules = vi.fn()
  const mockOnHelp = vi.fn()
  const mockOnSettings = vi.fn()
  const mockOnToggleSound = vi.fn()
  const mockOnExit = vi.fn()

  const defaultProps = {
    onRules: mockOnRules,
    onHelp: mockOnHelp,
    onSettings: mockOnSettings,
    onToggleSound: mockOnToggleSound,
    onExit: mockOnExit,
    soundEnabled: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the hamburger menu button', () => {
    render(<HamburgerMenu {...defaultProps} />)
    const button = screen.getByRole('button', { name: /menu/i })
    expect(button).toBeInTheDocument()
  })

  it('should open menu when button is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    // Menu should now be visible with all items
    expect(screen.getByText('Rules')).toBeInTheDocument()
    expect(screen.getByText('Help')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should call onRules when Rules item is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const rulesItem = screen.getByText('Rules')
    await user.click(rulesItem)

    expect(mockOnRules).toHaveBeenCalledOnce()
  })

  it('should call onHelp when Help item is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const helpItem = screen.getByText('Help')
    await user.click(helpItem)

    expect(mockOnHelp).toHaveBeenCalledOnce()
  })

  it('should call onSettings when Settings item is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const settingsItem = screen.getByText('Settings')
    await user.click(settingsItem)

    expect(mockOnSettings).toHaveBeenCalledOnce()
  })

  it('should call onToggleSound when Sound item is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const soundItem = screen.getByText(/Enable Sounds|Mute Sounds/)
    await user.click(soundItem)

    expect(mockOnToggleSound).toHaveBeenCalledOnce()
  })

  it('should call onExit when Back to Menu item is clicked', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const exitItem = screen.getByText('Back to Menu')
    await user.click(exitItem)

    expect(mockOnExit).toHaveBeenCalledOnce()
  })

  it('should display correct sound button label based on soundEnabled prop', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<HamburgerMenu {...defaultProps} soundEnabled={true} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    expect(screen.getByText('Mute Sounds')).toBeInTheDocument()

    // Re-render with sound disabled
    await user.click(button) // Close menu first
    rerender(<HamburgerMenu {...defaultProps} soundEnabled={false} />)

    const buttonAgain = screen.getByRole('button', { name: /menu/i })
    await user.click(buttonAgain)

    expect(screen.getByText('Enable Sounds')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    expect(button).toHaveAttribute('aria-haspopup')
    expect(button).toHaveAttribute('aria-label')
  })

  it('should render menu items in correct order', async () => {
    const user = userEvent.setup()
    render(<HamburgerMenu {...defaultProps} />)

    const button = screen.getByRole('button', { name: /menu/i })
    await user.click(button)

    const menu = screen.getByRole('menu')
    const items = within(menu).getAllByRole('menuitem')

    expect(items).toHaveLength(5)
    expect(items[0]).toHaveTextContent('Rules')
    expect(items[1]).toHaveTextContent('Help')
    expect(items[2]).toHaveTextContent('Settings')
    expect(items[3]).toHaveTextContent(/Sounds/)
    expect(items[4]).toHaveTextContent('Back to Menu')
  })
})
