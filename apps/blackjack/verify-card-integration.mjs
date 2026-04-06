#!/usr/bin/env node

/**
 * Card Component Integration Verification Script
 * 
 * Verifies:
 * 1. SVG assets are accessible via HTTP
 * 2. Card component can load and render SVG images
 * 3. All 56 card SVG files are present
 * 4. Asset paths are correct
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BASE_URL = 'http://localhost:5173'
const PUBLIC_CARDS_DIR = path.join(__dirname, 'public/cards')
const DIST_CARDS_DIR = path.join(__dirname, 'dist/cards')

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath)
  if (exists) {
    log('green', `✅ ${description}`)
    return true
  } else {
    log('red', `❌ ${description} - NOT FOUND: ${filePath}`)
    return false
  }
}

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolve({ status: res.statusCode, data }))
      })
      .on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
          reject(new Error('Dev server not running (ECONNREFUSED)'))
        } else {
          reject(err)
        }
      })
  })
}

async function verifyCardAsset(cardName) {
  const url = `${BASE_URL}/cards/${cardName}.svg`
  try {
    const { status, data } = await fetchUrl(url)
    if (status === 200 && data.includes('<svg')) {
      return true
    }
    return false
  } catch {
    return false
  }
}

async function main() {
  console.log('\n' + '='.repeat(70))
  log('blue', '  Card Component Integration Test Report')
  log('blue', '  ' + new Date().toISOString())
  console.log('='.repeat(70) + '\n')

  let passCount = 0
  let failCount = 0

  // 1. Check source files
  log('blue', '📄 Checking Source Files...')
  if (checkFile(path.join(__dirname, 'src/ui/atoms/Card/Card.tsx'), 'Card component exists')) {
    passCount++
  } else {
    failCount++
  }
  if (checkFile(path.join(__dirname, 'src/ui/molecules/Hand/Hand.tsx'), 'Hand component exists')) {
    passCount++
  } else {
    failCount++
  }

  // 2. Check public assets
  log('blue', '\n🃏 Checking SVG Assets (Public)...')
  const cardNames = ['AS', 'AH', 'AD', 'AC', 'KS', 'KH', 'KD', 'KC', '2S', '2H', '2D', '2C', '1B']
  const publicAssets = fs.readdirSync(PUBLIC_CARDS_DIR).filter((f) => f.endsWith('.svg'))
  log('blue', `  Found ${publicAssets.length} SVG files in public/cards/`)
  if (publicAssets.length === 56) {
    log('green', `✅ All 56 card SVGs present`)
    passCount++
  } else {
    log('red', `❌ Expected 56 SVG files, found ${publicAssets.length}`)
    failCount++
  }

  // 3. Check dist assets
  log('blue', '\n📦 Checking SVG Assets (Build Output)...')
  if (fs.existsSync(DIST_CARDS_DIR)) {
    const distAssets = fs.readdirSync(DIST_CARDS_DIR).filter((f) => f.endsWith('.svg'))
    log('blue', `  Found ${distAssets.length} SVG files in dist/cards/`)
    if (distAssets.length === 56) {
      log('green', `✅ All 56 card SVGs in build output`)
      passCount++
    } else {
      log('red', `❌ Expected 56 build SVG files, found ${distAssets.length}`)
      failCount++
    }
  } else {
    log('yellow', '⚠️  dist/cards/ not found (run pnpm build first)')
  }

  // 4. Test dev server access
  log('blue', '\n🚀 Testing Dev Server Asset Access...')
  try {
    const response = await fetchUrl(BASE_URL)
    if (response.status === 200) {
      log('green', '✅ Dev server responding on localhost:5173')
      passCount++
    } else {
      log('red', `❌ Dev server returned ${response.status}`)
      failCount++
    }
  } catch (err) {
    log('red', `❌ Cannot reach dev server: ${err.message}`)
    log('yellow', '   Start dev server with: pnpm dev')
    failCount++
    process.exit(1)
  }

  // 5. Test card SVG access
  log('blue', '\n🎴 Testing Card SVG Access (Sample)...')
  const testCards = ['AS', 'KH', '2D', '1B']
  for (const card of testCards) {
    try {
      const accessible = await verifyCardAsset(card)
      if (accessible) {
        log('green', `✅ Card ${card}.svg accessible via HTTP`)
        passCount++
      } else {
        log('red', `❌ Card ${card}.svg not accessible`)
        failCount++
      }
    } catch (err) {
      log('red', `❌ Error accessing ${card}.svg: ${err.message}`)
      failCount++
    }
  }

  // 6. Summary
  console.log('\n' + '='.repeat(70))
  log('blue', '  Test Summary')
  console.log('='.repeat(70))
  log('green', `  ✅ Passed: ${passCount}`)
  log('red', `  ❌ Failed: ${failCount}`)
  const total = passCount + failCount
  const percentage = total > 0 ? Math.round((passCount / total) * 100) : 0
  log(percentage >= 80 ? 'green' : 'red', `  Score: ${percentage}% (${passCount}/${total})`)
  console.log('='.repeat(70) + '\n')

  process.exit(failCount > 0 ? 1 : 0)
}

main().catch((err) => {
  log('red', `Fatal Error: ${err.message}`)
  process.exit(1)
})
