# COLUMN DROP (Connect Four-style)

**Canonical Source**: Wikipedia - Connect Four  
**Genre**: Strategy - Gravity-Based  
**Players**: 2 alternating (or 1 vs AI)  
**Turn-Based**: Yes

## Neutral Identity

- **Product Name**: Column Drop, Disc Connect, or Four Line
- **Branding**: Neutral colored discs (red/yellow or generic colors)
- **Visual Theme**: Grid-based strategy aesthetic

## Board Specification

- **Dimensions**: 7 columns × 6 rows (42 cells total)
- **Coordinate System**: [row, col] where 0≤row≤5, 0≤col≤6
- **Initial State**: All cells empty
- **Gravity**: Discs fall to lowest available row
- **No vertical scrolling**: Board fits on all device screens

## Game Objects

1. **Player Disc**:
   - Colors: Red (Player 1) and Yellow (Player 2)
   - States: Empty, Red, Yellow
   - Physics: Falls to lowest empty cell in chosen column

2. **Win Line** (conceptual):
   - Length: Exactly 4 consecutive discs
   - Directions: Horizontal, Vertical, Diagonal (multiple winning lines possible)

## Core Rules

1. **Setup**: Assign colors to players (Red typically goes first)
2. **Turn Loop**:
   - Active player selects a column (1-7)
   - System drops disc to lowest available row
   - Check win, draw, or invalid conditions
   - Pass turn to opponent
3. **Legal Actions**:
   - Select non-full column (columns with <6 discs)
4. **Illegal Actions**:
   - Select full column (already has 6 discs)
   - Play after game ends
5. **Scoring**:
   - Win: 1 point
   - Draw: 0 points
   - Loss: 0 points
6. **Win Condition**:
   - First player to create 4 in a row (horizontal, vertical, or diagonal)
   - Automatically detected after each move
7. **Draw Condition**:
   - All 42 cells filled, no winner
8. **Game End**:
   - Immediate on win or draw

## State Machine

```
[Empty Board]
    ↓ Player-1 Drops Disc in Column 3
[Disc Falls to Row 5, Col 3] → [Check: Win? No | Draw? No]
    ↓ Player-2 Drops Disc in Column 4
[Disc Falls to Row 5, Col 4] → [Check: Win? No | Draw? No]
    ↓ ... continue ...
[Board Full OR 4-in-a-row Found]
    ↓
[GAME OVER - Win or Draw]
```

## Input Model

**Keyboard** (Desktop):

- Select column: Number keys (1-7) or Arrow keys left/right
- Drop disc: Enter/Space
- Settings: ESC for menu
- New Game: N key

**Mouse** (Desktop):

- Click column header or cell area to drop disc

**Touch** (Mobile):

- Tap column area to drop disc
- Swipe left/right to select column, tap to drop

**Controller** (TV/Xbox):

- D-Pad left/right to select column
- A/OK button to drop

**Accessibility**:

- Screen reader support for column descriptions ("Column 1", "Column 7")
- High contrast discs
- Keyboard-only fully playable

## UI Layout Contract

**Top HUD** (required):

- Active Player indicator ("Red's Turn" or "Player 1")
- Score display (if tournament mode)
- Timer (optional, for speed challenges)

**Central Board** (required):

- 7×6 grid centered on viewport
- No vertical scrolling under any circumstance
- Column headers or indicators showing playable columns
- Touch target minimums: 44px × 44px mobile, 60px × 60px TV
- Responsive sizing: Scale board to fit all device tiers

**Bottom Controls** (required):

- New Game button
- Rules / Help button (icon or text)
- Settings button (difficulty if AI, display options)

**Rules Modal** (required):

- Explanation of 4-in-a-row concept
- Neutral language, no copyright references
- Examples of winning lines (visual diagrams)
- Gravity mechanics explanation

## Rule Variants (Documented)

1. **Standard (Default)**
   - 7×6 board, first to 4 in a row wins
2. **6×5 Board**
   - Smaller board for faster games
   - First to 4 in a row wins
   - Selectable in settings

3. **3-in-a-Row Variant**
   - 7×6 board, first to 3 in a row wins
   - Shorter, quicker gameplay
   - Toggle in settings

4. **Pop-Out** (Advanced Variant):
   - Players can remove discs from bottom of columns
   - Adds tactical complexity
   - Optional toggle

5. **Timeout Mode**:
   - Each player has max 10 seconds per turn
   - Timer display in HUD

## AI Strategy (if applicable)

**Baseline AI (Default)**:

- Difficulty 1: Random legal moves
- Difficulty 2: Block opponent winning move 2 turns ahead, take winning move
- Difficulty 3: Minimax algorithm with alpha-beta pruning (near-optimal play)

**Extension Points**:

- Heuristics for board control
- Column preference weighting
- Opening book for first N moves

## Test Requirements

1. **Rule Validation Tests**:
   - Win detection: Horizontal, vertical, and both diagonals (4 directions × multiple positions)
   - Draw detection: Board full (42 discs) with no winner
   - Gravity: Disc falls to correct row (lowest empty)
   - Column full detection: Can't drop in full column
2. **State Transition Tests**:
   - Player switch works correctly
   - Game resets properly for new game
   - Win/draw immediately stops turn loop
3. **Edge Cases**:
   - Winning move on column boundaries (cols 0, 6)
   - Winning move on row boundaries (rows 0, 5)
   - Multiple winning lines created in single move
   - Diagonal wins from bottom-left to top-right
   - Diagonal wins from top-left to bottom-right

## Shared Platform Reuse

- **Grid Engine**: N×M tile system with gravity
- **Turn Engine**: Abstract two-player alternation
- **Win Detection**: Line-scan algorithm (horizontal, vertical, diagonal)
- **Shared Hooks**: useResponsiveState, useGame (custom), rules modal
- **Shared Components**: Button, Modal, HUD Status Bar

## Legal / Brand Safety

- ✅ **Safe Name**: "Column Drop" or "Disc Connect"
- ✅ **Safe Symbols**: Neutral colored discs (red/yellow or other colors)
- ✅ **No Copyright Risk**: Game mechanics are public domain (invented 1974, rules public)
- ❌ **Avoid**: "Connect Four" (trademarked by Hasbro)

## Implementation File Structure

```
apps/column-drop/
├── src/
│   ├── domain/
│   │   ├── types.ts          # Board, Disc, GameState
│   │   ├── rules.ts          # isLegalMove, checkWin, dropDisc
│   │   ├── gravity.ts        # Disc falling logic
│   │   ├── ai.ts             # minimax algorithm
│   │   └── index.ts          # barrel
│   ├── app/
│   │   ├── useColumnDropGame.ts
│   │   ├── useGravity.ts
│   │   ├── useAI.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── atoms/Disc.tsx
│   │   ├── molecules/GameBoard.tsx, RulesModal.tsx
│   │   ├── organisms/ColumnDropGame.tsx
│   │   └── index.ts
│   └── styles/
│       └── GameBoard.module.css
├── tests/
│   ├── rules.unit.test.ts
│   ├── gravity.unit.test.ts
│   ├── ai.unit.test.ts
│   └── gameplay.e2e.spec.ts
└── docs/
    ├── RULES.md
    ├── variants.json
    └── strategy.md
```
