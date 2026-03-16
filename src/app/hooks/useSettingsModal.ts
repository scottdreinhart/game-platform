import { useCallback, useState } from 'react'

/**
 * useSettingsModal — Manage full-screen settings modal state
 *
 * Provides open/close/toggle controls for the SettingsModal organism.
 * Can be used from any component to control settings visibility.
 *
 * @example
 * const { isOpen, open, close, toggle } = useSettingsModal()
 * return (
 *   <>
 *     <button onClick={toggle}>Settings</button>
 *     <SettingsModal isOpen={isOpen} onClose={close} />
 *   </>
 * )
 */
export function useSettingsModal() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}
