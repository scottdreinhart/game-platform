# Blackjack Implementation Specification

**Date**: April 5, 2026  
**Status**: Ready for Development  
**Foundation**: 190KB+ ingested from 10 authoritative sources

---

## 1. GAME ARCHITECTURE

### 1.1 Domain Layer (`src/domain/`)

Pure, framework-agnostic game logic. No React imports.

**Core Files**:

- `types.ts` — Type definitions (Card, Hand, GameState, Player, Dealer, etc.)
- `constants.ts` — Game constants (min/max bets, deck count, shuffling rules, payout ratios)
- `rules.ts` — Business logic enforcement (valid moves, bust detection, dealer strategy)
- `engine.ts` — Game orchestration (dealing, game flow, settlement)
- `strategy.ts` — Basic strategy lookup tables and AI moves
- `index.ts` — Public API barrel

### 1.2 App Layer (`src/app/`)

React integration, state management, services.

**Core Files**:

- `hooks/useBlackjackGame.ts` — Main game state hook
- `hooks/useGameHistory.ts` — Statistics and past hands
- `services/gameService.ts` — Persistence and state management
- `context/GameContext.tsx` — Game state provider

### 1.3 UI Layer (`src/ui/`)

React components (atoms, molecules, organisms).

**Core Components**:

- `atoms/Card.tsx` — Individual card display
- `molecules/Hand.tsx` — Player/dealer hand display
- `molecules/BetControl.tsx` — Betting interface
- `organisms/GameBoard.tsx` — Full game layout
- `organisms/GameTable.tsx` — Table with dealer and players

---

## 2. DOMAIN TYPES & CORE DATA STRUCTURES

### 2.1 Card Representation

```typescript
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

interface Card {
  suit: Suit
  rank: Rank
  value: number // 1-11 for aces, actual pip for others
}
```

### 2.2 Hand & Player State

```typescript
interface Hand {
  cards: Card[]
  bet: number
  status: 'initial' | 'playing' | 'stand' | 'bust' | 'blackjack' | 'settled'
  totalValue: number // calculated hard value
  softValue?: number // if ace can be 11 without busting
}

interface Player {
  id: string
  balance: number
  currentHand?: Hand
  splitHands?: Hand[] // if split
  result?: 'win' | 'lose' | 'push'
}
```

### 2.3 Dealer State

```typescript
interface Dealer {
  hand: Card[]
  hiddenCard?: Card // face-down initial card
  value: number
  status: 'initial' | 'playing' | 'bust' | 'stand'
}
```

### 2.4 Game State

```typescript
interface GameState {
  id: string
  players: Player[]
  dealer: Dealer
  deckCount: number // 1-8
  decksRemaining: number
  phase: 'betting' | 'dealing' | 'playing' | 'settling' | 'completed'
  rules: GameRules
  timestamp: Date
}

interface GameRules {
  deckCount: number // 1-8 decks
  dealerHitsSoft17: boolean // H17 vs S17 rule
  blackjackPayout: number // 1.5 for 3:2, 1.2 for 6:5
  canSurrender: boolean
  canDoubleSplitAces: boolean
  maxSplits: number // typically 3-4 splits max (2-4 hands)
  doubleDownOn: 'any' | '9-11' | '10-11' // which hands allow double
}
```

---

## 3. CORE RULES ENGINE

### 3.1 Card Valuation

```typescript
export const getCardValue = (rank: Rank): 1 | 10 | 11 => {
  if (rank === 'A') return 11
  if (['J', 'Q', 'K'].includes(rank)) return 10
  return parseInt(rank) as 1 | 10 | 11
}

export const getHandValue = (cards: Card[]): { hard: number; soft?: number } => {
  const values = cards.map((c) => getCardValue(c.rank))
  let hard = values.reduce((a, b) => a + b, 0)
  const softValue = values.includes(11) && hard > 21 ? hard - 10 : undefined
  return { hard, soft: softValue }
}
```

### 3.2 Valid Moves by Game State

```typescript
export type GameAction = 'hit' | 'stand' | 'double' | 'split' | 'surrender'

export const getValidMoves = (hand: Hand, dealerUpcard: Card, rules: GameRules): GameAction[] => {
  const moves: GameAction[] = ['hit', 'stand']

  const handValue = getHandValue(hand.cards)

  // Double down on allowed hands
  if (hand.cards.length === 2) {
    if (rules.doubleDownOn === 'any') moves.push('double')
    else if (rules.doubleDownOn === '9-11' && [9, 10, 11].includes(handValue.hard))
      moves.push('double')
    else if (rules.doubleDownOn === '10-11' && [10, 11].includes(handValue.hard))
      moves.push('double')
  }

  // Split if pair
  if (hand.cards.length === 2 && hand.cards[0].rank === hand.cards[1].rank) {
    moves.push('split')
  }

  // Surrender (early surrender before dealer checks)
  if (rules.canSurrender && hand.cards.length === 2) {
    moves.push('surrender')
  }

  return moves
}
```

### 3.3 Dealer Automatic Strategy

```typescript
export const getDealerMove = (dealerHand: Dealer, rules: GameRules): 'hit' | 'stand' => {
  const handValue = getHandValue(dealerHand.hand)

  // Dealer must hit on 16 or less
  if (handValue.hard <= 16) return 'hit'

  // Dealer must stand on 17+
  if (handValue.hard >= 17) {
    // Exception: Soft 17 (A + 6 = soft 17)
    if (rules.dealerHitsSoft17 && handValue.soft === 17) return 'hit'
    return 'stand'
  }

  return 'stand'
}
```

### 3.4 Settlement & Payouts

```typescript
export const settleHand = (
  player: Hand,
  dealer: Dealer,
  rules: GameRules,
): {
  result: 'win' | 'loss' | 'push'
  payout: number
} => {
  const playerValue = getHandValue(player.cards)
  const dealerValue = getHandValue(dealer.hand)

  // Dealer bust → player wins
  if (dealerValue.hard > 21) {
    return {
      result: 'win',
      payout: player.bet * 2, // 1:1 + original bet back
    }
  }

  // Player bust → loss
  if (playerValue.hard > 21) {
    return { result: 'loss', payout: 0 }
  }

  // Compare values
  const playerFinal =
    playerValue.soft !== undefined && playerValue.soft <= 21 ? playerValue.soft : playerValue.hard
  const dealerFinal =
    dealerValue.soft !== undefined && dealerValue.soft <= 21 ? dealerValue.soft : dealerValue.hard

  if (playerFinal > dealerFinal) {
    // Blackjack bonus
    if (player.cards.length === 2 && playerFinal === 21) {
      return {
        result: 'win',
        payout: player.bet * (1 + rules.blackjackPayout), // e.g., 1.5 for 3:2
      }
    }
    return { result: 'win', payout: player.bet * 2 }
  } else if (playerFinal === dealerFinal) {
    return { result: 'push', payout: player.bet } // Original bet back
  } else {
    return { result: 'loss', payout: 0 }
  }
}
```

---

## 4. GAME VARIATIONS & RULE SETS

### 4.1 Configuration Matrix

The following rule combinations should be configurable:

| Parameter            | Options                         | Default |
| -------------------- | ------------------------------- | ------- |
| **Deck Count**       | 1, 2, 4, 6, 8                   | 6       |
| **Dealer Soft 17**   | Hit (H17), Stand (S17)          | S17     |
| **Blackjack Payout** | 3:2 (1.5), 6:5 (1.2), 1:1 (1.0) | 3:2     |
| **Double Down**      | Any, 9-11, 10-11                | Any     |
| **Surrender**        | Yes, No                         | No      |
| **Max Splits**       | 1, 3, 4 (unlimited)             | 3       |
| **Split Aces**       | 1 card each, Multiple cards     | 1 card  |
| **Resplit Aces**     | Yes, No                         | No      |

### 4.2 House Edge Impact (from Live Casino Comparer)

- Single deck: **0.16%** house edge
- 6-deck shoe: **0.64%** house edge
- 8-deck shoe: **0.66%** house edge
- H17 rule: **+0.21%** to house edge
- Double after split (DDAS): **-0.14%** from house edge
- Surrender: **-0.08%** from house edge
- 6-card Charlie: **-0.16%** from house edge

---

## 5. IMPLEMENTATION PRIORITIES

### Phase 1: Core Game Logic (MVP)

- [x] Card deck creation and shuffling
- [x] Hand valuation (hard/soft)
- [x] Valid move detection
- [x] Dealer automatic strategy
- [x] Settlement calculation
- [x] Basic strategy lookup table
- [x] Game state machine

### Phase 2: UI Components

- [ ] Card display component
- [ ] Hand visualization
- [ ] Betting interface
- [ ] Game board layout
- [ ] Results display

### Phase 3: Game Integration

- [ ] useBlackjackGame hook for state management
- [ ] Game persistence (localStorage)
- [ ] Statistics tracking
- [ ] Undo/redo support (optional)

### Phase 4: Advanced Features

- [ ] Multiple betting strategies AI
- [ ] Game variants (Spanish 21, Double Exposure, etc.)
- [ ] Live streaming UI simulation
- [ ] Mobile touch optimizations

---

## 6. TESTING STRATEGY

### Unit Tests (`*.unit.test.ts`)

- Card valuation logic
- Hand value calculation
- Move validation
- Dealer strategy
- Settlement logic

### Integration Tests (`*.integration.test.ts`)

- Complete game rounds
- Multi-hand scenarios (splits)
- Rule variation combinations
- State transitions

### Component Tests (`*.component.test.tsx`)

- Card rendering
- Hand display
- Betting controls
- Game board layout

---

## 7. PERFORMANCE TARGETS

- **Deal speed**: < 500ms (instant in UI)
- **AI move calculation**: < 100ms for basic strategy lookup
- **Hand resolution**: < 200ms (dealer plays out hand)
- **Full game round**: 2-5 seconds (player action + dealer resolution)

---

## 8. NEXT IMMEDIATE STEPS

1. **Create domain types** (`src/domain/types.ts`)
2. **Implement card valuation** (`src/domain/rules.ts`)
3. **Build game engine** (`src/domain/engine.ts`)
4. **Create basic strategy tables** (`src/domain/strategy.ts`)
5. **Write unit tests** for core logic
6. **Build React hook** (`src/app/useBlackjackGame.ts`)
7. **Create UI components** starting with Card and Hand
