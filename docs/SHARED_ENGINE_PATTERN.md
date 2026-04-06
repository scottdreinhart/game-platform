# Option B - Shared Engine Pattern Implementation Guide

**Pattern Name**: Option B - Shared Engine Package  
**Authority**: AGENTS.md § 4.5, § 21.2  
**Template Version**: 1.0  
**Status**: PROVEN ✅  
**Reference Implementation**: Simon/Simon-Says Consolidation (April 4, 2026)

---

## Overview

The **"Option B - Shared Engine"** pattern consolidates duplicate game logic into a shared, reusable package while keeping game apps independent products.

**When to Use**:

- 2+ games with identical or nearly-identical rule logic ✓
- Shared types, constants, and domain functions ✓
- No conflicting game-specific hardcodes ✗
- Logic lives in `src/domain/`, not UI/app layers ✓

**When NOT to Use**:

- Single-game logic (use game-specific code) ✗
- UI/component duplication (use shared UI packages) ✗
- Platform-specific code with conflicting requirements ✗

---

## Consolidation Workflow (8 Steps)

### Step 1: Audit & Identify Duplicate Logic

**Objective**: Prove both games share identical domain logic.

**Process**:

```bash
# Compare domain structures
diff -r apps/game1/src/domain/rules/ apps/game2/src/domain/rules/
diff -r apps/game1/src/domain/types.ts apps/game2/src/domain/types.ts
diff -r apps/game1/src/domain/constants.ts apps/game2/src/domain/constants.ts
```

**Example (Simon consolidation)**:

```
Both Simon and Simon-Says had:
✓ Identical SimonRuleConfig type
✓ Identical game rule variants (11 variants)
✓ Identical game state machine functions
✓ Identical move validation logic
```

**Acceptance Criteria**:

- [ ] At least 50% of domain/rules code is identical
- [ ] Shared logic is in domain layer (framework-agnostic)
- [ ] No conflicting game-specific hardcodes
- [ ] Both games fully build before consolidation

---

### Step 2: Create Shared Package Structure

**Objective**: Create new package with extracted logic.

**Directory Layout**:

```
packages/my-game-engine/
├── package.json
├── src/
│   ├── index.ts                   # Master barrel export
│   ├── types.ts                   # All shared types
│   ├── constants.ts               # Shared constants
│   ├── rules.ts                   # Core game logic
│   ├── helpers.ts                 # Utility functions (if needed)
│   └── [subfolder]/               # If logic is large
│       ├── index.ts               # Sub-barrel
│       └── specific-logic.ts      # Grouped by concern
└── README.md
```

**Example (Simon Engine)**:

```
packages/simon-engine/
├── package.json
├── src/
│   ├── index.ts                   # Main barrel
│   ├── types.ts                   # SimonRuleConfig, SimonColor, etc.
│   ├── constants.ts               # DEFAULT_RULES, SIMON_FREQUENCIES
│   ├── rules/
│   │   ├── index.ts               # Rules barrel
│   │   └── simon.rules.ts         # 11 game rule variants
│   └── [other files]
└── README.md
```

---

### Step 3: Populate Shared Package from Source

**Process**:

1. Copy complete `rules.ts` from game1
2. Copy `types.ts` from game1 (verify identical in game2)
3. Copy relevant parts of `constants.ts` (merge if slightly different)
4. Verify all external dependencies are available to package

**Code Template**:

```ts
// packages/my-game-engine/src/index.ts
// Master barrel: re-export all public APIs

export * from './types'
export * from './constants'
export {
  // Core rule functions
  functionName1,
  functionName2,
  // Do NOT export internal helpers or implementation details
} from './rules'

export type { PublicType1, PublicType2 } from './types'
```

**Example (Simon Engine)**:

```ts
// packages/simon-engine/src/index.ts
export * from './types'
export * from './constants'
export {
  DEFAULT_RULES,
  RULE_VARIANTS,
  getColorSequence,
  validateRules,
  describeRules,
} from './rules'
export type { SimonRuleConfig, SimonColor, SimonRuleVariant } from './rules'
```

---

### Step 4: Configure Package Metadata

**Objective**: Register package in monorepo with correct exports.

**Template**:

```json
{
  "name": "@games/my-game-engine",
  "version": "1.0.0",
  "private": true,
  "description": "Shared rule engine for [Game Family]",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "files": ["src/"],
  "keywords": ["game", "engine", "rules"]
}
```

**Example**:

```json
{
  "name": "@games/simon-engine",
  "version": "1.0.0",
  "private": true,
  "description": "Shared rule engine for Simon and Simon-Says games",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": { ".": "./src/index.ts" }
}
```

---

### Step 5: Update First App to Use Shared Package

**Objective**: Replace local imports with shared package imports.

**Changes to `app1/package.json`**:

```json
{
  "dependencies": {
    "@games/my-game-engine": "workspace:*"
  }
}
```

**Changes to `app1/src/domain/index.ts`**:

```ts
// OLD: Local-only imports
export * from './rules/my-game-rules'
export * from './types'
export * from './constants'

// NEW: Import from shared package
export * from '@games/my-game-engine'
// Add any app-specific extensions here
```

**Changes to `app1/src/domain/rules/index.ts`**:

```ts
// OLD: Re-export local file
export * from './my-game-rules'

// NEW: Re-export from shared package
export * from '@games/my-game-engine'
```

**Update `app1/src/domain/[other files]` imports**:

```ts
// OLD
import { DEFAULT_RULES } from './rules/my-game-rules'

// NEW
import { DEFAULT_RULES } from '@games/my-game-engine'
```

**tsconfig.json Path Aliases** (add if missing):

```json
{
  "compilerOptions": {
    "paths": {
      "@games/my-game-engine": ["../../packages/my-game-engine/src"],
      "@/*": ["./src/*"]
    }
  }
}
```

**vite.config.ts Aliases** (add if missing):

```ts
import path from 'path'

export default {
  resolve: {
    alias: {
      '@games/my-game-engine': path.resolve(__dirname, '../../packages/my-game-engine/src'),
      '@': path.resolve(__dirname, './src'),
    },
  },
}
```

**Example (Simon Consolidation)**:

```ts
// apps/simon/src/domain/index.ts (AFTER)
export * from '@games/simon-engine'

// apps/simon/src/domain/engine.ts (AFTER)
import { SimonColor, SimonRuleConfig } from '@games/simon-engine'

// apps/simon/package.json (AFTER)
{
  "dependencies": {
    "@games/simon-engine": "workspace:*"
  }
}
```

---

### Step 6: Update Second App to Use Shared Package

**Process**: Repeat Step 5 for app2.

**Special Case**: If app2 has game-specific variants, extend the shared rules:

```ts
// apps/game2/src/domain/game2-variants.ts
import { RULE_VARIANTS } from '@games/my-game-engine'

export const GAME2_SPECIFIC_VARIANTS = {
  ...RULE_VARIANTS,
  // Add game2-only variants here
}
```

---

### Step 7: Cleanup & Remove Duplicates

**Objective**: Delete local copies of now-shared files.

**Files to Delete from app1**:

```bash
rm -f apps/app1/src/domain/rules/my-game-rules.ts
rm -f apps/app1/src/domain/rules/[other shared files]
```

**Files to Delete from app2**:

```bash
rm -f apps/app2/src/domain/rules/my-game-rules.ts
rm -f apps/app2/src/domain/rules/[other shared files]
```

**Keep Only**:

- App-specific rule variants
- App-specific constants
- UI hooks and components
- App-specific tests

**Example (Simon Cleanup)**:

```bash
# Deleted from Simon
rm apps/simon/src/domain/rules/simon.rules.ts

# Kept
apps/simon/src/app/hooks/useSimonGame.ts     # App-specific hook
apps/simon/src/ui/organisms/GameBoard.tsx    # App-specific UI
```

---

### Step 8: Validation & Testing

**Build Checks**:

```bash
# Verify shared package types
pnpm --filter @games/my-game-engine typecheck

# Build each game independently
pnpm --filter @games/app1 build
pnpm --filter @games/app2 build

# Full monorepo validation
pnpm validate  # includes: lint, format, typecheck, build
```

**Expected Output**:

```
✓ 48 modules transformed        # or similar count
dist/index.html                 0.61 kB
dist/assets/main.js           208.69 kB
✓ built in 1.46s
```

**Success Criteria**:

- [ ] Both games build without errors
- [ ] No circular dependency warnings
- [ ] No "is not exported by" errors
- [ ] `pnpm validate` passes
- [ ] Monorepo `pnpm install` succeeds

**Example (Simon Validation)**:

```bash
$ pnpm --filter @games/simon build     # ✓ built in 1.56s
$ pnpm --filter @games/simon-says build # ✓ built in 3.31s
$ pnpm validate                         # ✓ All checks pass
```

---

## Troubleshooting Guide

### Error: "X is not exported by src/app.tsx"

**Cause**: Vite/Rollup path alias confusion between file name and directory name.  
**Example**: `App.tsx` file conflicts with `app/` directory.

**Solution**:

```bash
# Rename the component file to avoid collision
mv apps/game1/src/App.tsx apps/game1/src/AppShell.tsx
mv apps/game1/src/App.module.css apps/game1/src/AppShell.module.css

# Update main.tsx
# Change: import { App } from './App'
# To: import { AppShell } from './AppShell'
```

**Prevention**: Use more specific names for top-level components.

---

### Error: "requires 'workspace:\*' specifier"

**Cause**: Package dependency doesn't specify workspace protocol.  
**Solution**:

```json
{
  "dependencies": {
    "@games/my-game-engine": "workspace:*" // Correct
    // NOT: "@games/my-game-engine": "^1.0.0"
  }
}
```

---

### Error: "EACCES: permission denied" on pnpm install

**Cause**: Platform-incompatible node_modules (WSL ↔ Windows).  
**Solution**:

```bash
# Clean and reinstall with correct platform binaries
pnpm clean:node
pnpm install
```

---

### Error: "terser not found" during build

**Cause**: Optional dependency missing.  
**Solution**:

```ts
// vite.config.ts
export default {
  build: {
    minify: 'esbuild', // Use built-in esbuild instead of terser
  },
}
```

---

### Circular Dependency Warning

**Cause**: Package imports from app layer, or app imports package that re-imports app.  
**Solution**: Ensure shared packages contain ONLY domain layer code.

```ts
// ✓ CORRECT: Domain-only
// packages/my-game-engine/src/index.ts
export * from './types'
export * from './rules'

// ✗ WRONG: Importing React/hooks
// packages/my-game-engine/src/index.ts
export * from '@/app/hooks' // NO! Should not import from app layer
```

---

## Common Variations

### Variation A: Game-Specific Extensions

**When**: One app needs custom rule variants beyond the shared engine.

**Pattern**:

```ts
// packages/my-game-engine/src/index.ts
export const RULE_VARIANTS: Record<string, RuleVariant> = {
  CLASSIC: {
    /* shared variant */
  },
  SPEED: {
    /* shared variant */
  },
}

// apps/game2/src/domain/game2-variants.ts
import { RULE_VARIANTS } from '@games/my-game-engine'

export const GAME2_VARIANTS = {
  ...RULE_VARIANTS,
  CUSTOM: {
    /* game2-only variant */
  },
}
```

---

### Variation B: Platform-Specific Implementations

**When**: Logic differs slightly between web and mobile.

**Pattern**:

```ts
// packages/my-game-engine/src/index.ts
export * from './base-rules'

// apps/game-web/src/domain/rules/index.ts
export * from '@games/my-game-engine'
export { webSpecificRule } from './web-overrides'

// apps/game-mobile/src/domain/rules/index.ts
export * from '@games/my-game-engine'
export { mobileSpecificRule } from './mobile-overrides'
```

---

### Variation C: Incremental Migration

**When**: Games are 70% similar, need to migrate gradually.

**Process**:

1. Create shared package with 70% of logic
2. Keep 30% game-specific in each app
3. Gradually move shared logic to package
4. Both apps import from package incrementally

---

## Best Practices

### ✅ DO

- ✅ Extract **pure business logic** to shared package (rules, validation)
- ✅ Keep **shared types** in one place (DRY principle)
- ✅ Use **workspace:\* protocol** for monorepo dependencies
- ✅ Export from **barrels only** (prevent internal imports)
- ✅ Test **shared logic independently** (unit tests in package)
- ✅ Document **public API** via JSDoc comments
- ✅ Version shared packages (even in monorepo)

### ❌ DON'T

- ❌ Import **React** or **UI libraries** into shared packages
- ❌ Import from **app layer** (hooks, context) into packages
- ❌ Create **circular dependencies** (package ← → app)
- ❌ Hardcode **game-specific constants** in shared logic
- ❌ Use **relative imports** across packages (\`../../\`)
- ❌ Expose **internal implementation** (private helpers)
- ❌ Share **UI components** via this pattern (use dedicated UI packages)

---

## Integration Checklist

**For Each New Consolidation:**

- [ ] Audit: Identify 2+ games with shared logic
- [ ] Architecture: Design shared package structure
- [ ] Create: `packages/my-game-engine/` with barrel exports
- [ ] Populate: Extract and organize shared code
- [ ] Config: Update `package.json` + `tsconfig.json` + `vite.config.ts`
- [ ] Integration: Update both apps' imports (domain/index.ts, domain/rules/index.ts)
- [ ] Cleanup: Delete duplicate files from apps
- [ ] Test: Build both games independently
- [ ] Validate: Run `pnpm validate` (full monorepo check)
- [ ] Document: Add consolidation notes to `docs/`
- [ ] Commit: Push with clear consolidation message

---

## Example PR Description

```markdown
## Consolidation: Bingo Game Family

### Objective

Consolidate shared rule logic from 6 Bingo variants (bingo, bingo-30, bingo-80, bingo-90, bingo-pattern, speed-bingo) into a single, reusable engine.

### Changes

- Created `packages/bingo-engine` with shared:
  - Ball drawing mechanics
  - Pattern detection
  - Win condition validation
  - Score calculation
- Updated all 6 games to import from `@games/bingo-engine`
- Removed duplicate `bingo-rules.ts` from each game (6 files deleted)
- Updated path aliases and configuration for each game

### Benefits

- 2,000+ LOC deduplication
- Single source of truth for Bingo rules
- Easier to maintain rule consistency
- Faster new Bingo variant development (just UI + cosmetics)

### Testing

- ✓ All 6 games build independently
- ✓ Full monorepo validation passes
- ✓ No circular dependencies
- ✓ All tests pass

### Pattern Reference

This consolidation follows the "Option B - Shared Engine" pattern documented in:

- `docs/GAME_FAMILY_CONSOLIDATION_AUDIT.md`
- `docs/SHARED_ENGINE_PATTERN.md`
- Reference implementation: Simon/Simon-Says (April 4, 2026)
```

---

## Reference: Simon/Simon-Says Implementation

**Timeline**: April 4, 2026  
**Files Created**: 4 (simon-engine package)  
**Files Deleted**: 1 (duplicate simon.rules.ts)  
**Files Modified**: 7 (both apps' domain imports)  
**Build Time**: Both apps build in ~1.5-3.3 seconds  
**Status**: ✅ Production Ready

**Key Lessons Learned**:

1. Path alias collision (App.tsx vs app/) caused Rollup errors → Fixed by renaming to AppShell.tsx
2. Local imports still referencing old paths → Must update ALL imports to use @games/simon-engine
3. Terser minifier optional → Use esbuild as fallback
4. Platform markers matter → pnpm clean:node needed after consolidation

---

## Next Consolidation Candidates

**Recommended Priority Order**:

1. **Bingo Family** (6 variants, ~2,000 LOC savings)
2. **Dice Games** (8 games, ~2,500 LOC savings)
3. **Board Primitives** (7 games, shared tile system)
4. **Card Games** (4 games, deck/scoring logic)

Each consolidation should follow this template and be documented in the audit.

---

**Pattern Authority**: AGENTS.md § 4.5, § 21.2  
**Last Updated**: April 4, 2026  
**Template Version**: 1.0  
**Status**: PRODUCTION READY ✅
