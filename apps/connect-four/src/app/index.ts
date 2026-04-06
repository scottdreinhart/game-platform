/**
 * Application layer barrel export.
 * Re-exports all React hooks and services.
 *
 * Usage: import { useThemeContext, useSoundEffects } from '@/app'
 */

// Shared infrastructure
export {
  logWebVitals,
  useAppScreens,
  useDeviceInfo,
  useKeyboardControls,
  useLongPress,
  useMediaQuery,
  useOnlineStatus,
  usePerformanceMetrics,
  useResponsiveState,
  useServiceLoader,
  useWindowSize,
  type DeviceInfo,
  type DeviceType,
  type WindowSize,
} from '@games/app-hook-utils'

// Local services
export { SoundProvider, useSoundContext } from '@games/sound-context'
export * from './connectFourAiService'
export * from './crashLogger'
export * from './haptics'
export * from './storageService'
export { ThemeProvider, useThemeContext } from './ThemeContext'

// App-specific hooks
export { useSwipe } from '@games/app-hook-utils'
export { useStats } from './useStats'
