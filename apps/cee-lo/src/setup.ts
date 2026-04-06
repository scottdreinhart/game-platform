/**
 * Test setup file for @games/cee-lo
 * Initializes Vitest environment with necessary test utilities
 */

import { expect, afterEach, vi } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
})
