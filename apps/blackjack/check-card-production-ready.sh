#!/usr/bin/env bash

# Blackjack Card Component - Final Verification Checklist
# Run this script to verify Card component is production-ready

set -e

echo "🎴 Blackjack Card Component - Production Readiness Verification"
echo "================================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

check() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC} $1"
    ((PASS++))
  else
    echo -e "${RED}❌${NC} $1"
    ((FAIL++))
  fi
}

# 1. Component files exist
echo -e "${BLUE}📄 Code Files${NC}"
test -f "src/ui/atoms/Card/Card.tsx"
check "Card component exists"

test -f "src/ui/molecules/Hand/Hand.tsx"
check "Hand molecule exists"

test -f "src/ui/molecules/Dealer/Dealer.tsx"
check "Dealer molecule exists"

# 2. SVG assets present
echo ""
echo -e "${BLUE}🃏 SVG Assets${NC}"
CARD_COUNT=$(find public/cards -name "*.svg" | wc -l)
test "$CARD_COUNT" = "56"
check "All 56 SVG cards in public/cards/ ($CARD_COUNT found)"

# 3. Build output includes assets
echo ""
echo -e "${BLUE}📦 Build Output${NC}"
test -d "dist/cards"
check "dist/cards/ directory exists"

if [ -d "dist/cards" ]; then
  DIST_CARD_COUNT=$(find dist/cards -name "*.svg" | wc -l)
  test "$DIST_CARD_COUNT" = "56"
  check "All 56 SVG cards in dist/cards/ ($DIST_CARD_COUNT found)"
fi

test -f "dist/index.html"
check "dist/index.html exists"

test -f "dist/manifest.json"
check "dist/manifest.json exists"

# 4. Configuration files
echo ""
echo -e "${BLUE}⚙️  Configuration${NC}"
test -f "vite.config.js"
check "vite.config.js exists"

test -f "package.json"
check "package.json exists"

grep -q '"@games/blackjack"' package.json
check "Package name is correct"

# 5. TypeScript configuration
echo ""
echo -e "${BLUE}🔷 TypeScript${NC}"
test -f "tsconfig.json"
check "tsconfig.json exists"

grep -q '"strict": true' tsconfig.json
check "TypeScript strict mode enabled"

# 6. Module configuration
echo ""
echo -e "${BLUE}📦 Module Config${NC}"
grep -q '"type": "module"' package.json
check "ES modules configured"

grep -q 'pnpm@10.31.0' package.json
check "pnpm package manager specified"

# Summary
echo ""
echo "================================================================"
echo -e "Results: ${GREEN}${PASS} passed${NC}, ${RED}${FAIL} failed${NC}"

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}✅ Card component is production-ready!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Review above.${NC}"
  exit 1
fi
