/**
 * WASM Infrastructure Service
 * Provides WebAssembly-accelerated operations for domain logic.
 * Domain layer depends on this abstraction, not on WASM directly.
 */

interface WasmModule {
  instance: WebAssembly.Instance
}

// WASM module cache (lazy-loaded)
let wasmModule: WasmModule | null = null

/**
 * Initialize WASM module from embedded base64 binary
 */
async function initWasm(): Promise<WasmModule | null> {
  if (wasmModule) {
    return wasmModule
  }

  try {
    // Dynamically import the WASM module
    const { AI_WASM_BASE64 } = await import('@/wasm/ai-wasm')

    const binaryString = atob(AI_WASM_BASE64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 })
    const importObject = {
      env: {
        memory,
        abort: () => {
          throw new Error('WASM abort')
        },
      },
    }

    const wasmResult = await WebAssembly.instantiate(bytes, importObject)
    wasmModule = { instance: wasmResult.instance }
    console.log('[WASM Service] WASM module loaded for optimization')
    return wasmModule
  } catch (err) {
    console.warn('[WASM Service] WASM unavailable, using JS:', err)
    return null
  }
}

/**
 * Rock-Paper-Scissors WASM operations
 */
export const rockPaperScissorsWasm = {
  /**
   * Get round winner using WASM (0=draw, 1=player win, 2=cpu win)
   */
  async getRoundWinner(playerMove: number, cpuMove: number): Promise<number | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      // Call WASM function (placeholder - actual implementation depends on WASM exports)
      const result = (wasm.instance.exports as any).getRoundWinner?.(playerMove, cpuMove)
      return result ?? null
    } catch (err) {
      console.debug('WASM round winner calculation failed')
      return null
    }
  },

  /**
   * Select CPU move using WASM
   */
  async selectCPUMove(roundsData: number[]): Promise<number | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      // Call WASM function (placeholder - actual implementation depends on WASM exports)
      const result = (wasm.instance.exports as any).selectCPUMove?.(roundsData)
      return result ?? null
    } catch (err) {
      console.debug('WASM CPU move selection failed')
      return null
    }
  },

  /**
   * Check if game is over using WASM
   */
  async isGameOver(scores: number[], bestOf: number): Promise<boolean | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      // Call WASM function (placeholder - actual implementation depends on WASM exports)
      const result = (wasm.instance.exports as any).isGameOver?.(scores, bestOf)
      return result ?? null
    } catch (err) {
      console.debug('WASM game over check failed')
      return null
    }
  },
}

/**
 * Lights-Out WASM operations
 */
export const lightsOutWasm = {
  /**
   * Create optimized board using WASM
   */
  async createBoard(): Promise<boolean[][] | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      // Call WASM function (placeholder - actual implementation depends on WASM exports)
      const result = (wasm.instance.exports as any).createBoard?.()
      return result ?? null
    } catch (err) {
      console.debug('WASM board creation failed')
      return null
    }
  },

  /**
   * Toggle cell with neighbors using WASM optimization
   */
  async toggleCell(board: boolean[][], row: number, col: number): Promise<boolean[][] | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      // Call WASM function (placeholder - actual implementation depends on WASM exports)
      const result = (wasm.instance.exports as any).toggleCell?.(board.flat(), row, col, 5)
      return result ?? null
    } catch (err) {
      console.debug('WASM cell toggle failed')
      return null
    }
  },

  /**
   * Check if board is solved using WASM
   */
  async isSolved(board: boolean[][]): Promise<boolean | null> {
    const wasm = await initWasm()
    if (!wasm) return null

    try {
      // Call WASM function (placeholder - actual implementation depends on WASM exports)
      const result = (wasm.instance.exports as any).isSolved?.(board.flat())
      return result ?? null
    } catch (err) {
      console.debug('WASM solved check failed')
      return null
    }
  },
}
