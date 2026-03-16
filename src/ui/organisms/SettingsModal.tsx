import { useCallback, useState } from 'react'

import { useSoundContext, useThemeContext } from '@/app'
import { COLOR_THEMES } from '@/domain'
import { QuickThemePicker, SoundToggle } from '@/ui'
import styles from './SettingsModal.module.css'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * SettingsModal — Comprehensive full-screen settings modal
 *
 * Organizes settings into three sections:
 * 1. Display & Theme (theme picker)
 * 2. Accessibility (sound toggle, reduced motion)
 * 3. About (app info)
 *
 * Uses transactional semantics: OK button persists changes, Cancel reverts.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, setColorTheme } = useThemeContext()
  const { soundEnabled, setSoundEnabled } = useSoundContext()

  // Local state for transactional semantics (changes only persist on OK)
  const [pendingThemeId, setPendingThemeId] = useState(settings.colorTheme)
  const [pendingSoundEnabled, setPendingSoundEnabled] = useState(soundEnabled)

  // Reset pending values when modal closes
  const handleCancel = useCallback(() => {
    setPendingThemeId(settings.colorTheme)
    setPendingSoundEnabled(soundEnabled)
    onClose()
  }, [settings.colorTheme, soundEnabled, onClose])

  // Persist changes and close
  const handleConfirm = useCallback(() => {
    if (pendingThemeId !== settings.colorTheme) {
      setColorTheme(pendingThemeId)
    }
    if (pendingSoundEnabled !== soundEnabled) {
      setSoundEnabled(pendingSoundEnabled)
    }
    onClose()
  }, [
    pendingThemeId,
    settings.colorTheme,
    pendingSoundEnabled,
    soundEnabled,
    setColorTheme,
    setSoundEnabled,
    onClose,
  ])

  if (!isOpen) {
    return null
  }

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h2 id="settings-modal-title" className={styles.title}>
              Settings
            </h2>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close settings"
              onClick={handleCancel}
            >
              ✕
            </button>
          </div>

          {/* Scrollable content */}
          <div className={styles.content}>
            {/* Display & Theme Section */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Display & Theme</h3>
              <div className={styles.sectionContent}>
                <p className={styles.label}>Theme</p>
                <QuickThemePicker
                  themes={COLOR_THEMES}
                  activeThemeId={pendingThemeId}
                  onSelectTheme={setPendingThemeId}
                />
              </div>
            </section>

            {/* Accessibility Section */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Accessibility</h3>
              <div className={styles.sectionContent}>
                <SoundToggle
                  enabled={pendingSoundEnabled}
                  onChange={setPendingSoundEnabled}
                  label="Sound Effects"
                />
                <p className={styles.hint}>Toggle sound effects on/off</p>
              </div>
            </section>

            {/* Info Section */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>About</h3>
              <div className={styles.sectionContent}>
                <p className={styles.hint}>Lights Out - A minimal puzzle game</p>
              </div>
            </section>
          </div>

          {/* Footer with action buttons */}
          <div className={styles.footer}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={handleConfirm}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
