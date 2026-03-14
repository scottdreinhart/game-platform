/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useTheme, useSoundEffects } from '@/app'
 */

export * from './haptics'
export * from './crashLogger'
export { SoundProvider, useSoundContext } from './SoundContext'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'
export { useGame } from './useGame'
export { useOnlineStatus } from './useOnlineStatus'
export { useStats } from './useStats'
export { useKeyboardControls } from './useKeyboardControls'
export { useMediaQuery } from './useMediaQuery'
export { useWindowSize } from './useWindowSize'
export { useResponsiveState } from './useResponsiveState'
export { useDeviceInfo } from './useDeviceInfo'
export { useAppScreens } from './useAppScreens'
export { useServiceLoader } from './useServiceLoader'
export { useLongPress } from './useLongPress'
export { usePerformanceMetrics, logWebVitals } from './usePerformanceMetrics'
