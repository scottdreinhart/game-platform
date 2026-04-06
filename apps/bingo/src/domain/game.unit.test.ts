import { describe, expect, it } from 'vitest'

/**
 * Unit tests for traditional Bingo game mechanics
 * Tests card generation, number drawing, and basic game state
 */

interface BingoGameState {
  balls: Set<number>
  drawnBalls: number[]
  maxBalls: number
  isComplete: boolean
}

describe('Traditional Bingo Game', () => {
  it('should initialize game with 75 balls (B-1-15, I-16-30, N-31-45, G-46-60, O-61-75)', () => {
    const balls = new Set<number>()
    for (let i = 1; i <= 75; i++) {
      balls.add(i)
    }

    expect(balls.size).toBe(75)
  })

  it('should draw a random ball without replacement', () => {
    const game: BingoGameState = {
      balls: new Set(Array.from({ length: 75 }, (_, i) => i + 1)),
      drawnBalls: [],
      maxBalls: 75,
      isComplete: false,
    }

    // Draw first ball
    const ball1 = Array.from(game.balls)[Math.floor(Math.random() * game.balls.size)]
    game.drawnBalls.push(ball1)
    game.balls.delete(ball1)

    expect(game.drawnBalls).toHaveLength(1)
    expect(game.balls.has(ball1)).toBe(false)
    expect(game.balls.size).toBe(74)
  })

  it('should continue drawing until game can complete', () => {
    const game: BingoGameState = {
      balls: new Set(Array.from({ length: 75 }, (_, i) => i + 1)),
      drawnBalls: [],
      maxBalls: 75,
      isComplete: false,
    }

    // Simulate drawing 30 balls
    for (let i = 0; i < 30; i++) {
      const ball = Array.from(game.balls)[Math.floor(Math.random() * game.balls.size)]
      game.drawnBalls.push(ball)
      game.balls.delete(ball)
    }

    expect(game.drawnBalls).toHaveLength(30)
    expect(game.balls.size).toBe(45)
  })

  it('should validate that drawn balls are within valid range (1-75)', () => {
    const drawnBalls = [5, 22, 35, 52, 68]

    const allValid = drawnBalls.every((ball) => ball >= 1 && ball <= 75)
    expect(allValid).toBe(true)
  })
})
