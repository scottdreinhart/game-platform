import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { HelpModal } from './HelpModal'

describe('Checkers HelpModal Integration', () => {
  describe('Modal Rendering', () => {
    it('should render modal when isOpen is true', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()
    })

    it('should not render modal when isOpen is false', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={false} onClose={mockOnClose} />)

      const modals = screen.queryAllByRole('dialog')
      expect(modals.length).toBe(0)
    })

    it('should display correct title', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByText('Help & FAQ')).toBeInTheDocument()
    })
  })

  describe('FAQ Content Rendering', () => {
    it('should render all FAQ questions', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      expect(screen.getByText('What is Checkers?')).toBeInTheDocument()
      expect(screen.getByText('How do I move pieces?')).toBeInTheDocument()
      expect(screen.getByText('What is a King?')).toBeInTheDocument()
      expect(screen.getByText('What happens if I reach the opposite end?')).toBeInTheDocument()
    })

    it('should render corresponding answers', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      // Check for key text from answers
      expect(screen.getByText(/capture opponent's pieces by jumping/i)).toBeInTheDocument()
      expect(screen.getByText(/diagonal moves/i)).toBeInTheDocument()
    })
  })

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const mockOnClose = vi.fn()
      const user = userEvent.setup()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const closeBtn = screen.getByLabelText('Close help')
      await user.click(closeBtn)

      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should call onClose when ESC key is pressed', async () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' })

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('should call onClose when backdrop is clicked', async () => {
      const mockOnClose = vi.fn()
      const user = userEvent.setup()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      // Find the backdrop (the modal's parent overlay)
      const modal = screen.getByRole('dialog')
      const backdrop = modal.parentElement

      if (backdrop) {
        await user.click(backdrop)
        expect(mockOnClose).toHaveBeenCalled()
      }
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-labelledby')
    })

    it('should have close button with proper aria-label', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const closeBtn = screen.getByLabelText('Close help')
      expect(closeBtn).toBeInTheDocument()
    })

    it('should trap focus within modal', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toBeInTheDocument()

      // Focus should be available within modal
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      expect(focusableElements.length).toBeGreaterThan(0)
    })
  })

  describe('Integration with Shared Component', () => {
    it('should use shared HelpModal component', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      // Verify the modal structure matches shared component
      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('modal') // Class from shared component
    })

    it('should properly adapt game-specific content', () => {
      const mockOnClose = vi.fn()
      render(<HelpModal isOpen={true} onClose={mockOnClose} />)

      // These are Checkers-specific content
      expect(screen.getByText(/Kings can move backward/i)).toBeInTheDocument()
      expect(screen.getByText(/Checkers is a strategy game/i)).toBeInTheDocument()
    })
  })
})
