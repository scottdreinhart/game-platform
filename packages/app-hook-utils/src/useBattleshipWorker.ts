/**
 * Hook to manage Battleship Web Worker lifecycle and async move calculation
 *
 * Provides async move calculation with optional fallback to synchronous version.
 * Automatically spawns worker on first use, cleans up on unmount.
 */

import type {
  BattleshipWorkerMessage,
  BattleshipWorkerResponse,
  Board,
  Cell,
  CellOwner,
  Coord,
  Difficulty,
} from '@games/battleship-wasm'
import { createBattleshipWorker } from '@games/battleship-wasm'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Configuration for the worker hook
 */
export interface UseBattleshipWorkerConfig<B> {
  /** Function to calculate move synchronously (for fallback) */
  moveCalculator: (board: B, difficulty: Difficulty) => Coord
  /** Function to adapt board to WASM format before sending to worker */
  boardAdapter?: (board: B) => Board
  /** Timeout for worker move calculation (ms) */
  timeout?: number
  /** Fallback to sync if worker unavailable */
  useFallback?: boolean
}

/**
 * Result of useBattleshipWorker hook
 */
export interface UseBattleshipWorkerResult<B> {
  /** Request async move from worker */
  getMoveAsync: (board: B, difficulty: Difficulty) => Promise<{ move: Coord; timeTaken: number }>
  /** Request sync move (fallback) */
  getMoveSync: (board: B, difficulty: Difficulty) => { move: Coord; timeTaken: number }
  /** Whether worker is ready */
  isReady: boolean
  /** Cleanup worker (called automatically on unmount) */
  cleanup: () => void
}

interface PendingRequest {
  resolve: (result: { move: Coord; timeTaken: number }) => void
  reject: (error: Error) => void
  timeout: ReturnType<typeof setTimeout>
}

/**
 * Adapt app domain Board to battleship-wasm worker Board format
 *
 * App Board: { size, grid: CellState[][], ships: Ship[] }
 * WASM Board: { cells: Cell[][], ships: Array<{owner, cells}> }
 *
 * CellState mapping:
 * - 'empty' → { owner: 'empty', status: 'water' }
 * - 'ship' → { owner: 'player', status: 'water' }
 * - 'playerHit' → { owner: 'player', status: 'hit' }
 * - 'playerMiss' → { owner: 'empty', status: 'miss' }
 * - 'cpuHit' → { owner: 'cpu', status: 'hit' }
 * - 'cpuMiss' → { owner: 'empty', status: 'miss' }
 */
function adaptBoardToWasm(appBoard: unknown): Board {
  // Type cast with validation
  const board = appBoard as {
    size: number
    grid: Array<Array<string>>
    ships: Array<{ owner: string; cells: Coord[] }>
  }

  if (!board || !board.grid || !Array.isArray(board.grid)) {
    throw new Error('Invalid board structure: missing or invalid grid')
  }

  const size = board.grid.length
  const cells: Cell[][] = []

  // Convert grid from CellState[] to Cell[]
  for (let row = 0; row < size; row++) {
    cells[row] = []
    for (let col = 0; col < size; col++) {
      const cellState = board.grid[row][col] as string
      let cell: Cell

      switch (cellState) {
        case 'empty':
          cell = { owner: 'empty', status: 'water' }
          break
        case 'ship':
          cell = { owner: 'player', status: 'water' }
          break
        case 'playerHit':
          cell = { owner: 'player', status: 'hit' }
          break
        case 'playerMiss':
          cell = { owner: 'empty', status: 'miss' }
          break
        case 'cpuHit':
          cell = { owner: 'cpu', status: 'hit' }
          break
        case 'cpuMiss':
          cell = { owner: 'empty', status: 'miss' }
          break
        default:
          // Fallback for unknown states
          cell = { owner: 'empty', status: 'water' }
      }

      cells[row][col] = cell
    }
  }

  // Convert ships from app format to WASM format
  const wasmShips: Array<{ owner: CellOwner; cells: Coord[] }> = []
  if (board.ships && Array.isArray(board.ships)) {
    for (const ship of board.ships) {
      wasmShips.push({
        owner: (ship.owner as CellOwner) || 'empty',
        cells: ship.cells || [],
      })
    }
  }

  return {
    cells,
    ships: wasmShips,
  }
}

/**
 * Hook: Manage Battleship Web Worker for async CPU moves
 *
 * Generic over: Board type, Difficulty type, Move type (Coord)
 *
 * Usage:
 * ```ts
 * const { getMoveAsync, getMoveSync } = useBattleshipWorker({
 *   moveCalculator: (board, difficulty) => getCpuMove(board, difficulty),
 *   timeout: 5000,
 *   useFallback: true,
 * })
 * ```
 */
export function useBattleshipWorker<B>(
  config: UseBattleshipWorkerConfig<B>,
): UseBattleshipWorkerResult<B> {
  const {
    moveCalculator,
    boardAdapter = adaptBoardToWasm as (board: B) => Board,
    timeout = 5000,
    useFallback = true,
  } = config

  const workerRef = useRef<Worker | null>(null)
  const pendingRef = useRef<Map<string, PendingRequest>>(new Map())
  const requestIdRef = useRef<number>(0)
  const [isReady, setIsReady] = useState(false)

  /**
   * Initialize worker on first use
   */
  const initWorker = useCallback(() => {
    if (workerRef.current) {
      return // Already initialized
    }

    try {
      // Create worker using factory from battleship-wasm package
      workerRef.current = createBattleshipWorker()

      workerRef.current.onmessage = (event: MessageEvent<BattleshipWorkerResponse>) => {
        const { data } = event

        if (data.type === 'moveReady' && data.requestId) {
          const pending = pendingRef.current.get(data.requestId)
          if (pending) {
            clearTimeout(pending.timeout)
            pending.resolve({
              move: data.move!,
              timeTaken: data.timeTaken!,
            })
            pendingRef.current.delete(data.requestId)
          }
        } else if (data.type === 'error' && data.requestId) {
          const pending = pendingRef.current.get(data.requestId)
          if (pending) {
            clearTimeout(pending.timeout)
            pending.reject(new Error(data.message || 'Worker error'))
            pendingRef.current.delete(data.requestId)
          }
        } else if (data.type === 'ready') {
          setIsReady(true)
        }
      }

      workerRef.current.onerror = ((error: ErrorEvent | string) => {
        const message = typeof error === 'string' ? error : error.message
        console.error('Battleship worker error:', message)
        // Reject all pending requests
        pendingRef.current.forEach(({ reject, timeout: t }) => {
          clearTimeout(t)
          reject(new Error('Worker error: ' + message))
        })
        pendingRef.current.clear()
        workerRef.current = null
        setIsReady(false)
      }) as OnErrorEventHandler

      // Send init message
      workerRef.current.postMessage({ type: 'init' })
      setIsReady(true)
    } catch (error) {
      console.error('Failed to initialize Battleship worker:', error)
      setIsReady(false)
    }
  }, [])

  /**
   * Request move synchronously (fallback)
   */
  const getMoveSync = useCallback(
    (board: B, difficulty: Difficulty) => {
      const startTime = performance.now()
      const move = moveCalculator(board, difficulty)
      const timeTaken = performance.now() - startTime
      return { move, timeTaken }
    },
    [moveCalculator],
  )

  /**
   * Request move asynchronously via worker
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getMoveAsync = useCallback(
    async (board: B, difficulty: Difficulty) => {
      // Lazy initialize worker on first call
      if (!workerRef.current) {
        initWorker()
      }

      if (!workerRef.current) {
        // Fallback to sync if worker unavailable
        if (useFallback) {
          return getMoveSync(board, difficulty)
        }
        throw new Error('Worker unavailable and fallback disabled')
      }

      return new Promise<{ move: Coord; timeTaken: number }>((resolve, reject) => {
        const requestId = String(++requestIdRef.current)

        const timeoutId = setTimeout(() => {
          pendingRef.current.delete(requestId)
          if (useFallback) {
            resolve(getMoveSync(board, difficulty))
          } else {
            reject(new Error('Worker timeout'))
          }
        }, timeout)

        pendingRef.current.set(requestId, { resolve, reject, timeout: timeoutId })

        // Convert board to WASM Board format before sending
        const wasmBoard = boardAdapter(board)
        const message: BattleshipWorkerMessage = {
          type: 'getMove',
          board: wasmBoard,
          difficulty: difficulty as unknown as Difficulty,
          requestId,
        }

        try {
          workerRef.current!.postMessage(message)
        } catch (error) {
          clearTimeout(timeoutId)
          pendingRef.current.delete(requestId)
          if (useFallback) {
            resolve(getMoveSync(board, difficulty))
          } else {
            reject(error)
          }
        }
      })
    },
    [initWorker, getMoveSync],
  )

  /**
   * Cleanup: Terminate worker
   */
  const cleanup = useCallback(() => {
    if (workerRef.current) {
      // Reject all pending requests
      pendingRef.current.forEach(({ reject, timeout: t }) => {
        clearTimeout(t)
        reject(new Error('Worker terminating'))
      })
      pendingRef.current.clear()

      // Send terminate message
      try {
        workerRef.current.postMessage({ type: 'terminate' })
      } catch {
        // Worker may already be terminated
      }

      // Terminate and cleanup
      workerRef.current.terminate()
      workerRef.current = null
      setIsReady(false)
    }
  }, [])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    getMoveAsync,
    getMoveSync,
    isReady,
    cleanup,
  }
}
