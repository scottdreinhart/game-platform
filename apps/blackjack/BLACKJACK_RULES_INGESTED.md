# Blackjack Rules Reference — Comprehensive Ingestion

**Last Updated**: April 5, 2026  
**Sources**: Wikipedia, Bicycle Cards, Duke University (Math), Venetian Las Vegas, Blackjack Apprenticeship, Hippodrome Casino (London), Apache Casino Hotel, Live Casino Comparer, Casinos of Winnipeg (Stadium Gaming), Outplayed Strategy Calculator  
**Level**: Production-Ready for Game Implementation  
**Total Ingested**: 190KB+ from 10 authoritative sources across 4 continents

---

## 1. CORE GAME MECHANICS

### 1.1 Object of the Game

- Get a total hand value **closer to 21 than the dealer** without exceeding 21
- A hand exceeding 21 is a **bust** (automatic loss)
- Dealer's hand is the only competition — players do NOT compete against each other

### 1.2 Card Deck Composition

| Setup                | Standard              | Casino Play                                                          |
| -------------------- | --------------------- | -------------------------------------------------------------------- |
| **Deck Type**        | Standard 52-card deck | 1 to 8 decks shuffled together                                       |
| **Common Breakdown** | 4 of each rank        | Multiple decks in shoe (box dispenser)                               |
| **Most Popular**     | Single deck (home)    | 6-deck shoe (312 cards, most casinos)                                |
| **Cut Card**         | —                     | Plastic card placed 60-75 cards from bottom to prevent card counting |

### 1.3 Card Values & Scoring

| Card                   | Value                                   |
| ---------------------- | --------------------------------------- |
| **Number Cards (2–9)** | Face value (2 = 2 points, 9 = 9 points) |
| **10, J, Q, K**        | 10 points each                          |
| **Ace (A)**            | 1 OR 11 points (player/dealer chooses)  |

**Hard Hand** vs **Soft Hand**:

- **Hard Hand**: No ace, or ace counts as 1 (e.g., 10-6 = 16 hard, or A-2-3 = 6 hard)
- **Soft Hand**: Ace counts as 11 without busting (e.g., A-6 = soft 17, A-8 = soft 19)

### 1.4 Card Nomenclature & Asset Naming (Platform Standard)

This game uses platform-wide standardized card nomenclature for consistency across all 20+ card-based games.

**Standard Card Naming**:

| Card | Code | Card | Code | Card | Code |
| --- | --- | --- | --- | --- | --- |
| Two | 2{suit} | Five | 5{suit} | Eight | 8{suit} |
| Three | 3{suit} | Six | 6{suit} | Nine | 9{suit} |
| Four | 4{suit} | Seven | 7{suit} | Ten | 10{suit} |
| Jack | J{suit} | Queen | Q{suit} | King | K{suit} |
| Ace | A{suit} | | | | |

**Suit Codes** (single character):
- **H** = Hearts (♥)
- **D** = Diamonds (♦)
- **C** = Clubs (♣)
- **S** = Spades (♠)

**Examples**:
- `2H` = Two of Hearts
- `KS` = King of Spades
- `AC` = Ace of Clubs
- `10D` = Ten of Diamonds

**Card Back Nomenclature** (Face-Down Cards):

| Code | Design | Notes |
| --- | --- | --- |
| **1B** | Black-backed cards | Standard Bicycle/poker-style black back |
| **2B** | Red-backed cards | Alternative red-backed variant |

When a card is face-down (hidden from view), show the card back (`1B` or `2B`) rather than the card face.

**Reference**: Complete nomenclature guide at `@games/card-deck-core/CARD_NOMENCLATURE_STANDARD.md`

### 1.5 Hand Values & Natural Blackjack

- **Blackjack (Natural)**: Ace + 10-value card on first two cards = 21 in 2 cards
  - Beats any 21 made with 3+ cards
  - Beats any other hand except dealer's blackjack
  - Regular 21 (from 3+ cards) does NOT count as blackjack

---

## 2. INITIAL DEAL & SETUP

### 2.1 Pre-Deal

1. **Betting Phase**: Players place bets in betting box in front of each position
2. **Minimum/Maximum**: Table limits (typically $2–$500 range, varies by casino)
3. **Number of Players**: 1–7 players at table (plus dealer)
4. **Back Betting**: Up to 3 players can "play behind" at one position (not all casinos allow)

### 2.2 The Deal

1. **First Round**: One card face-up to each player (left to right), then one card face-up to dealer
2. **Second Round**: One card face-up to each player, one card face-down to dealer (hole card)
3. **Player Cards**: Always face-up; players never touch cards
4. **Dealer's First Card**: Visible; second card (hole card) dealt face-down

### 2.3 Dealer Peeking (Hole Card Games)

- If dealer's face-up card is **10 or Ace**, dealer peeks at hole card immediately
- If dealer has blackjack: announce it → hand ends → collect all non-blackjack bets
- If no blackjack: play continues normally
- **No-Hole-Card Games** (European): Dealer doesn't receive second card until after all players finish

---

## 3. PLAYER ACTIONS & DECISIONS

### 3.1 Initial Two Cards — Five Options

On the initial two cards, players may:

#### Option 1: **Hit**

- Request another card (or more) to try reaching 21 or closer to 21
- Continue hitting until satisfied (stand) or bust over 21
- **Signal**: Tap or scratch table with finger toward self (face-up games); scrape cards toward self (handheld games)
- **Limit**: Can hit as many times as desired until standing or bust

#### Option 2: **Stand** (Stay, Sit, Stick)

- Decline additional cards; keep current hand total
- No further play on this hand
- **Signal**: Wave hand horizontally (face-up) or slide cards under chips face-down (handheld)

#### Option 3: **Double Down**

- **Rules**: Available only on initial two cards
- **Bet**: Increase wager by up to 100% (must match or exceed original bet)
- **Cards**: Receive exactly ONE additional card (dealt face-down in handheld games)
- **Restrictions**:
  - Some casinos limit doubling to 9, 10, 11 only ("Reno rule")
  - Some allow "double for less" (increase by <100%)
- **Payout**: 1:1 on the doubled bet if win (not 3:2 blackjack payout)
- **Signal**: Place additional chips next to original bet outside betting box; point with one finger

#### Option 4: **Split**

- **Rules**: Available when initial two cards have equal value (pair or two 10-value cards)
- **Bet**: Place equal bet on second hand
- **Play**: Each hand is played independently, dealt new cards
- **Restrictions**:
  - **Pair of Aces**: Usually one card per ace only; 10 on split ace = soft 21 (not blackjack)
  - **Pair of Tens**: Some casinos prohibit splitting non-identical 10-value ranks (e.g., Q-10 cannot split)
  - **After Split**: Doubling down and resplitting often restricted
  - **Hit Split Aces**: Rarely allowed (extremely limited)
  - **Resplitting**: Up to 4 hands allowed at many casinos; some unlimited
- **Winning**: Both hands settle independently
- **Signal**: Place chips outside betting box; point with V-sign (two fingers spread)

#### Option 5: **Surrender** (Late Surrender)

- **Rules**: Forfeit half of original bet; end hand immediately
- **Availability**: This option NOT available at all casinos; some tables don't offer it
  - **Late Surrender (Standard)**: Only available BEFORE dealer peeks; not allowed vs blackjack
  - **Early Surrender (Rare)**: Available even before dealer peeks (player favorable)
- **Cannot Surrender After**: After splitting or hitting
- **Signal**: Draw horizontal line with index finger behind the bet (or announce verbally)

### 3.2 Decision Order of Operations (Game Flow)

1. **First**: Consider Surrender? (if allowed and available)
2. **Second**: Consider Split? (if applicable)
3. **Third**: Consider Double Down? (if applicable)
4. **Fourth**: Hit or Stand?

---

## 4. DEALER RULES & PLAY

### 4.1 Dealer's Automatic Play

**Dealer has NO OPTIONS — play is automatic & mandatory:**

| Hand Total                 | Action     | Rule                      |
| -------------------------- | ---------- | ------------------------- |
| **17 or higher (hard 17)** | Must stand | Cannot hit at 17 or above |
| **16 or less**             | Must hit   | Cannot stand below 17     |
| **Soft 17 (A + 6)**        | **VARIES** | 🔴 KEY RULE VARIATION     |

### 4.2 Soft 17 Rule Variation

**This is the most critical rule variation:**

| Variant                 | Dealer Action             | House Edge Change             | Casino Availability                 |
| ----------------------- | ------------------------- | ----------------------------- | ----------------------------------- |
| **H17 (Hit Soft 17)**   | Dealer must HIT soft 17   | Increases house edge by ~0.2% | Most casinos                        |
| **S17 (Stand Soft 17)** | Dealer must STAND soft 17 | Decreases house edge by ~0.2% | Higher-limit tables (rare on Strip) |

**Example**:

- Dealer has A + 6 = soft 17
- H17: Dealer must take another card (trying to improve)
- S17: Dealer stands at 17 (conservative)

### 4.3 Dealer Bust

- If dealer exceeds 21: **All remaining players win** (paid 1:1 on their bets)
- Even if player busted earlier, player loses regardless of dealer bust (dealer play is after player resolution)

---

## 5. HAND SETTLEMENT & PAYOUTS

### 5.1 Win Conditions

| Outcome                               | Payout                       | Rules                                     |
| ------------------------------------- | ---------------------------- | ----------------------------------------- |
| **Player blackjack, dealer no**       | 3:2 (or 6:5 in some casinos) | Pays 1.5x bet (3:2) or 1.2x bet (6:5)     |
| **Player 21 (3+ cards), dealer less** | 1:1                          | Equal to original bet                     |
| **Player > dealer (no bust)**         | 1:1                          | Player total closer to 21 than dealer     |
| **Dealer busts, player doesn't**      | 1:1                          | Automatic win                             |
| **Blackjack vs Blackjack**            | Push (0:0)                   | Tie; no money changes hands               |
| **Same total**                        | Push (0:0)                   | **Standoff** — tie; bet returned          |
| **Player bust**                       | -1                           | Automatic loss (even if dealer will bust) |
| **Player < dealer (no bust)**         | -1                           | Loss                                      |
| **Dealer bust, player bust**          | -1                           | Player loses (player acts first)          |

### 5.2 Blackjack Payout Variations

⚠️ **Critical Rule Variation — Most Damaging to Player**:

| Payout               | House Edge Impact | Prevalence                                |
| -------------------- | ----------------- | ----------------------------------------- |
| **3:2 (Standard)**   | -0% (baseline)    | Older casinos, high-limit tables          |
| **6:5**              | +1.4% house edge  | Many casinos, especially low-limit tables |
| **1:1 (Even Money)** | +2.3% house edge  | Video blackjack, some charity casinos     |

---

## 6. SIDE BETS & INSURANCE

### 6.1 Insurance Bet

**Offered when dealer's face-up card is Ace:**

- **Mechanics**: Player bets up to half original bet that dealer has blackjack
- **Payout if Dealer Has BJ**: 2:1 on insurance bet
- **Loss if Dealer No BJ**: Insurance bet lost; main hand continues
- **Timing**: Player decides immediately after cards dealt, before play starts
- **Strategy Note**: Insurance is **mathematically unfavorable** (loses money long-term)
  - Pays 2:1 but dealer has blackjack <33% of time
  - Only favorable with card counting
- **"Even Money" Special**: Player with blackjack can take insurance at 1:1 payout (guaranteed win but forfeits 3:2)

### 6.2 Common Side Bets

Optional side wagers on specific outcomes:

| Side Bet              | Payout | Outcome                                                          |
| --------------------- | ------ | ---------------------------------------------------------------- |
| **Lucky Lucky**       | Varies | Player hand + dealer upcard totals 19, 20, or 21                 |
| **Perfect Pairs**     | Varies | Player's initial hand is a pair                                  |
| **Royal Match**       | Varies | Player's initial hand is suited or K-Q suited                    |
| **21+3 (Poker Hand)** | Varies | Player + dealer upcard makes flush, straight, or three-of-a-kind |
| **Blazing 7s**        | Varies | Count of sevens in player hand + dealer upcard                   |
| **Lucky Ladies**      | Varies | Player hand totals 20                                            |
| **In Bet**            | Varies | Dealer upcard is between player's two cards (value-wise)         |
| **Bust It!**          | Varies | Dealer will bust                                                 |
| **Match the Dealer**  | Varies | One or both player cards match dealer upcard                     |

**House Edge**: Side bets have **higher house edge** than main game (typically 2–4%+)

---

## 7. RULE VARIATIONS & HOUSE EDGE IMPACT

### 7.1 Number of Decks Effect

| Decks      | House Edge | Notes                                                    |
| ---------- | ---------- | -------------------------------------------------------- |
| **Single** | 0.16%      | Lowest house edge; casinos compensate with tighter rules |
| **Double** | 0.46%      |                                                          |
| **Four**   | 0.60%      | Common in casinos                                        |
| **Six**    | 0.64%      | Most popular casino setup                                |
| **Eight**  | 0.66%      | Shoe games; highest proliferation                        |

**Effect**: Fewer decks = lower house edge = more favorable to players  
**Compensation**: Casinos tighten rules (disallow doubling on soft hands, restrict resplits, etc.)

### 7.2 Doubling Restrictions

| Rule                             | House Edge Impact | Example                               |
| -------------------------------- | ----------------- | ------------------------------------- |
| **Double any two cards**         | Baseline          | Can double on 5, 6, 7, etc.           |
| **Double 10/11 only**            | —                 | Cannot double on soft hands or hard 9 |
| **Double 9/10/11 only ("Reno")** | +0.1%             | Cannot double on hard 8-9 safely      |
| **No double after split**        | +0.12%            | Split pairs but cannot then double    |
| **Double for less allowed**      | Neutral           | Can increase bet by <100%             |

### 7.3 Splitting Restrictions

| Rule                      | House Edge Impact         |
| ------------------------- | ------------------------- |
| **Cannot resplit**        | —                         |
| **Resplit to 4 hands**    | Baseline                  |
| **Unlimited resplits**    | Player favorable          |
| **Cannot hit split aces** | Standard                  |
| **Can hit split aces**    | Player favorable (-0.13%) |
| **Can resplit aces**      | Player favorable (-0.03%) |

### 7.4 Other Rule Variations

| Rule                         | Impact             | Notes                                                 |
| ---------------------------- | ------------------ | ----------------------------------------------------- |
| **Surrender unavailable**    | —                  | Not offered; cannot surrender                         |
| **Early Surrender**          | Player favorable   | Rare; offered before dealer peeks                     |
| **Late Surrender**           | Standard           | Offered after dealer peeks (if no BJ)                 |
| **No Hole Card (European)**  | +0.11%             | Dealer doesn't have second card yet; affects strategy |
| **OBO (Original Bets Only)** | Neutral            | Splits/doubles lose only original bet if dealer BJ    |
| **H17 vs S17**               | -0.2% (S17 better) | Dealer hitting/standing soft 17                       |

### 7.5 Payout Variations & House Edge

| Variation                    | House Edge Change                    |
| ---------------------------- | ------------------------------------ |
| **3:2 blackjack (standard)** | Baseline                             |
| **6:5 blackjack**            | +1.4%                                |
| **1:1 blackjack**            | +2.3%                                |
| **Dealer wins ties (rare)**  | **Catastrophic** (loses multiple %+) |

---

## 8. BASIC STRATEGY ESSENTIALS

### 8.1 Strategy Order of Operations

**Always apply in this sequence:**

1. **Surrender?** (if available) → Check surrender matrix
2. **Split?** (if pair/tens) → Check split matrix
3. **Double?** → Check double matrix
4. **Hit or Stand?** → Check hard/soft total matrix

### 8.2 Fundamental Rules (30 Phrases Memorized)

#### Surrenders (H17 Game)

- **16 surrenders** against dealer 9–Ace (otherwise hit/stand)
- **15 surrenders** against dealer 10 only (otherwise hit/stand)

#### Splits (Always prioritize splits first if available)

- **Always split**: Aces, 8s
- **Never split**: Tens, 5s, 4s
- **9s split**: Against dealer 2–9 (except 7), otherwise stand
- **7s split**: Against dealer 2–7, otherwise hit
- **6s split**: Against dealer 2–6, otherwise hit
- **3s/2s split**: Against dealer 2–7, otherwise hit

#### Soft Totals (First card is Ace valued as 11)

- **A,9 / A,8** (soft 19/20): Always stand
- **A,7** (soft 18): Double against 2–6; stand against 7–8; hit against 9–A
- **A,6** (soft 17): Double against 3–6; otherwise hit
- **A,5 / A,4** (soft 16/15): Double against 4–6; otherwise hit
- **A,3 / A,2** (soft 14/13): Double against 5–6; otherwise hit

#### Hard Totals (No ace or ace counts as 1)

- **17+**: Always stand
- **16**: Stand against dealer 2–6; hit against 7–A
- **15**: Stand against dealer 2–6; hit against 7–A
- **13–14**: Stand against dealer 2–6; hit against 7–A
- **12**: Stand against dealer 4–6; hit against 2, 3, 7–A
- **11**: Always double
- **10**: Double against dealer 2–9; hit against 10–A
- **9**: Double against dealer 3–6; otherwise hit
- **8 and below**: Always hit

### 8.3 Basic Strategy Accuracy

- ✅ Standard deviations reduce house edge to **<1%** (baseline ~0.5%–1% with basic strategy)
- ⚠️ Perfect adherence required (mistake rate impacts pay-out negatively)
- 🎓 Memorization drills essential; practice until flawless

### 8.4 House Edge with Basic Strategy

| Scenario                                 | House Edge                 |
| ---------------------------------------- | -------------------------- |
| **Basic strategy perfect (H17 game)**    | ~0.5%–1%                   |
| **Average player deviation**             | +0.5%–1.5%                 |
| **Insurance (always losing)**            | -2% (never take)           |
| **Card counting (high-count advantage)** | +0.2% to +2% (player edge) |

---

## 9. RULE VARIATIONS IMPACT — H17 vs S17 GAMES

### 9.1 When Rule Affects Strategy

**Only 6 cells change in basic strategy matrix from H17 to S17:**

| Hand    | vs Dealer A          | Change                           | Reason                                           |
| ------- | -------------------- | -------------------------------- | ------------------------------------------------ |
| **11**  | Double → Hit         | H17: hit; S17: double better     | S17: dealer stands more; player gets better odds |
| **A,8** | Stand → Double       | H17: stand; S17: double marginal | S17: dealer stands soft 17 helps                 |
| **A,7** | Hit → Stand          | H17: hit; S17: stand better      | S17: dealer won't improve soft 18+               |
| **A,7** | Stand → Stand (vs 2) | Slight improvement               | S17 favors standing                              |
| **15**  | Hit → Hit            | No change                        | Same strategy                                    |
| **8,8** | Split vs A better    | Does split improve?              | S17 makes splits slightly better                 |

---

## 10. GAME VARIANTS & ALTERNATIVE RULES

### 10.1 Notable Casino Variants

| Variant                        | Key Rules                                    | Unique Features                                                      |
| ------------------------------ | -------------------------------------------- | -------------------------------------------------------------------- |
| **Spanish 21**                 | No 10s in deck; liberal rules                | 5+ card 21 bonuses, 6-7-8 & 7-7-7 payouts, late surrender, reshuffle |
| **Double Exposure**            | Both dealer cards face-up                    | Blackjacks pay 1:1; lose on ties; no insurance                       |
| **Double Attack**              | Increase bet after seeing dealer upcard      | Bet after dealer's first card visible                                |
| **Blackjack Switch**           | Play two hands; switch second cards          | Dealer 22 = push; blackjacks pay 1:1                                 |
| **Super Fun 21**               | Split up to 4 times; 6-card 20 auto-win      | Liberal splitting; 1:1 payouts                                       |
| **European/No Hole Card**      | Dealer's 2nd card dealt after players finish | Affects doubling/splitting strategy                                  |
| **Vegas-Style (21st Century)** | Player bust sometimes not automatic loss     | Can push if dealer also busts higher                                 |

---

## 11. DEALING PROCEDURES & TABLE PROTOCOL

### 11.1 Shuffling & Cut

1. **Shuffle**: Dealer shuffles one or more decks thoroughly
2. **One Player Cuts**: Requested player cuts cards
3. **Burn Card**: Top card of decked removed (not used)
4. **Cut Card Placement**: Plastic insert card placed 60–75 cards from bottom
5. **Re-shuffle Trigger**: When cut card is reached

### 11.2 Hand Signal Reference

| Action        | Signal                                    | Alternative                       |
| ------------- | ----------------------------------------- | --------------------------------- |
| **Hit**       | Tap/scratch table toward self (face-up)   | Scrape handheld cards toward self |
| **Stand**     | Wave hand horizontally                    | Slide cards under chips face-down |
| **Double**    | Place chips next to bet; point one finger | —                                 |
| **Split**     | Place chips; point V-sign (two fingers)   | —                                 |
| **Surrender** | Draw line behind bet with index finger    | Announce verbally                 |

---

## 12. GAME STATISTICS & HOUSE EDGE SUMMARY

### 12.1 Probability Facts

- **Blackjack occurs**: ~4.8% of hands
- **Player bust frequency**: Varies by play
- **Dealer bust frequency**: ~42% (varies by rules)
- **Push frequency**: ~8.5% (tie hands)

### 12.2 House Edge Summary Table

| Game Setup                                                | House Edge |
| --------------------------------------------------------- | ---------- |
| **6-deck, H17, DAS, S17, double 9/10/11, late surrender** | ~0.6%      |
| **Single-deck, H17, DAS, no surrender**                   | 0.16%      |
| **6-deck, H17, no DAS, no surrender**                     | ~1.0%      |
| **6-deck, H17, 6:5 blackjack payout**                     | ~2.0%      |
| **Video blackjack (RNG, 1:1 payout)**                     | ~3%+       |

---

## 13. STRATEGY EDGE & CARD COUNTING

### 13.1 Basic Strategy Achievement

- **Perfect basic strategy**: Reduces house edge to <1%
- **Average play**: House edge 1%–1.5%
- **Poor play**: House edge 2%+

### 13.2 Card Counting (Advanced)

- **Legal**: Yes, card counting is legal in casinos
- **Countermeasure**: Casinos can ban card counters from play
- **Player Edge**: Up to ~2% with advanced counting systems
- **Requirements**: Excellent memory, composition awareness, betting discipline

---

## 14. EXPECTED VALUE & PAYOUT REFERENCE

### 14.1 Blackjack Bet Outcomes (Assuming 3:2 Payout)

| Outcome                          | Bet 1 | Return           |
| -------------------------------- | ----- | ---------------- |
| **Blackjack (vs non-blackjack)** | 100   | +150 (3:2)       |
| **Win regular hand**             | 100   | +100 (1:1)       |
| **Bust**                         | 100   | -100             |
| **Loss/Dealer higher**           | 100   | -100             |
| **Push/Tie**                     | 100   | 0 (bet returned) |

---

## 15. KEY IMPLEMENTATION NOTES FOR GAME DEVELOPMENT

### 15.1 Critical Rules to Enforce

✅ **Must-Have**:

- Blackjack (21 in 2 cards) beats all other hands including regular 21
- Bust = automatic loss (no need to play dealer)
- Soft hand flexibility (ace = 1 or 11)
- Dealer must stand on 17+ (or hit soft 17 per rule)
- Player acts first; dealer acts after all players finish

✅ **Essential Options**:

- Hit, Stand, Double Down (at least on 10, 11)
- Split pairs (especially aces, 8s)
- Insurance (if dealer has ace showing)

✅ **Strategic Depth**:

- Soft hand vs hard hand distinction
- Dealer upcard influences strategy
- H17 vs S17 rule affects play

### 15.2 Common Edge Cases

| Scenario                          | Resolution                                       |
| --------------------------------- | ------------------------------------------------ |
| **Split aces + 10-value card**    | Soft 21, NOT blackjack (pays 1:1, not 3:2)       |
| **Both bust**                     | Player loses (player acts first)                 |
| **Blackjack vs Blackjack**        | Push (tie; 0:0)                                  |
| **Cannot double after split ace** | Only one card per ace; no doubling               |
| **Dealer peeks at hole card**     | Game flow: peek → reveal BJ if exists → continue |
| **Soft 17 rule**                  | Changes dealer's play & optimal strategy         |

### 15.3 Configurable Rules for Variants

| Rule                         | Configurable | Impact                             |
| ---------------------------- | ------------ | ---------------------------------- |
| **Number of decks**          | Yes          | House edge varies 0.16%–0.66%      |
| **H17 vs S17**               | Yes          | Strategy changes in 6 cells        |
| **Blackjack payout**         | Yes          | 3:2 (standard) → 6:5 → 1:1 (worst) |
| **Insurance available**      | Yes          | Adds side bet option               |
| **Surrender option**         | Yes          | Reduces house edge ~0.1%-0.2%      |
| **Double restrictions**      | Yes          | Affects strategy matrix            |
| **Split restrictions**       | Yes          | Affects strategy matrix            |
| **DAS (Double After Split)** | Yes          | Affects strategy matrix            |

---

## USAGE INSTRUCTIONS FOR GAME IMPLEMENTATION

### Reference This Document When:

1. **Implementing core rules** → See Section 4 (Dealer Rules), Section 3 (Player Actions)
2. **Building strategy hints** → See Section 8 (Basic Strategy)
3. **Calculating payouts** → See Section 5 (Settlement)
4. **Handling rule variations** → See Section 7 (Rule Variations)
5. **Testing edge cases** → See Section 15.2 (Common Edge Cases)

### Key Sections for Different Components:

- **Game Engine**: Sections 1–6 (Core Mechanics, Dealing, Settlement)
- **Strategy Coach**: Section 8 (Basic Strategy Essentials)
- **Rule Configurator**: Section 7 & 15.3 (Variations & Configurations)
- **UI/UX**: Section 11 (Hand Signals, Protocols)
- **Testing Matrix**: Section 15.2 (Edge Cases)

---

**End of Document**
