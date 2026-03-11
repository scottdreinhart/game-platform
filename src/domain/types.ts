/**
 * Central type definitions — pure domain types, no framework dependencies.
 */

export type Board = boolean[][] // true = light on, false = light off

export interface GameState {
  board: Board
  moves: number
  isSolved: boolean
}

export interface Position {
  row: number
  col: number
}
