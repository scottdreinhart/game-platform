import { useEffect } from 'react'

/**
 * Manages dropdown menu behavior: ESC closure, outside-click detection, focus management.
 * Used by HamburgerMenu, DropdownSelector, and other portal-based menus.
 *
 * @param config - Configuration object
 * @param config.open - Whether the menu is currently open
 * @param config.onClose - Callback when menu should close (ESC or outside-click)
 * @param config.triggerRef - Ref to the trigger button (to restore focus on close)
 * @param config.panelRef - Ref to the menu panel (for click-outside detection)
 * @param config.onOutsideClick - Optional callback for outside-click events
 *
 * @example
 * const btnRef = useRef<HTMLButtonElement>(null)
 * const panelRef = useRef<HTMLDivElement>(null)
 * const [open, setOpen] = useState(false)
 *
 * useDropdownBehavior({
 *   open,
 *   onClose: () => setOpen(false),
 *   triggerRef: btnRef,
 *   panelRef,
 * })
 */
export const useDropdownBehavior = ({
  open,
  onClose,
  triggerRef,
  panelRef,
  onOutsideClick,
}: {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  panelRef: React.RefObject<HTMLElement | null>
  onOutsideClick?: () => void
}): void => {
  useEffect(() => {
    if (!open) {
      return
    }

    // Handle outside clicks (mousedown to detect before panel capture)
    const handleOutsideClick = (e: Event) => {
      const target = e.target as Node
      const isTrigger = triggerRef.current?.contains(target) ?? false
      const isPanel = panelRef.current?.contains(target) ?? false

      if (!isTrigger && !isPanel) {
        onClose()
        onOutsideClick?.()
      }
    }

    // Handle ESC key
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        // Return focus to trigger button
        triggerRef.current?.focus()
      }
    }

    // Use mousedown (not click) to detect outside before panel captures events
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick as EventListener)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick as EventListener)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [open, triggerRef, panelRef, onClose, onOutsideClick])
}
