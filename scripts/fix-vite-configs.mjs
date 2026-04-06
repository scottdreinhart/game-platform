#!/usr/bin/env node

/***
 * Fix Vite Configs - Add Capacitor External Configuration
 *
 * This script updates all game app vite.config.js files to mark Capacitor
 * packages as external. This prevents Vite/Rolldown from trying to bundle
 * Capacitor on web builds (where it's not available).
 *
 * Usage:
 *   node scripts/fix-vite-configs.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const appsDir = path.join(rootDir, 'apps')

const CAPACITOR_PACKAGES = [
  '@capacitor/core',
  '@capacitor/app',
  '@capacitor/device',
  '@capacitor/preferences',
  '@capacitor/haptics',
  '@capacitor/splash-screen',
  '@capacitor/keyboard',
]

function generateExternalArray() {
  return `    external: [
      '${CAPACITOR_PACKAGES.join("',\n      '")}',
    ],`
}

function updateViteConfig(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')

  // Check if external array already exists
  if (content.includes('external:')) {
    return { status: 'skip', msg: 'Already has external config' }
  }

  // Try pattern 1: Find rollupOptions with output
  let updatedContent = content.replace(
    /(\s+rollupOptions:\s*\{)\s*(output:)/,
    `$1\n${generateExternalArray()}\n$2`,
  )

  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf8')
    return { status: 'updated', msg: 'Added Capacitor external config (existing rollupOptions)' }
  }

  // Try pattern 2: Find build config but no rollupOptions - we need to add it
  updatedContent = content.replace(
    /(\s+build:\s*\{[^}]*)(outDir:|sourcemap:|target:|cssTarget:|modulePreload:|minify:|cssMinify:)/,
    (match, buildStart, nextKey) => {
      // Only add if there's no rollupOptions yet
      if (buildStart.includes('rollupOptions:')) {
        return match
      }
      const indent = buildStart.match(/\n(\s+)/)?.[1] || '    '
      return buildStart + `\n${indent}rollupOptions: {\n${generateExternalArray()}\n${indent}},` + nextKey
    },
  )

  if (updatedContent !== content) {
    fs.writeFileSync(filePath, updatedContent, 'utf8')
    return { status: 'updated', msg: 'Added Capacitor external config (new rollupOptions)' }
  }

  return { status: 'error', msg: 'Could not find build or rollupOptions.output pattern' }
}

async function main() {
  try {
    const apps = fs.readdirSync(appsDir).filter((name) => {
      const fullPath = path.join(appsDir, name)
      return (
        fs.statSync(fullPath).isDirectory() &&
        name !== 'ui' && // Skip the ui package
        fs.existsSync(path.join(fullPath, 'vite.config.js'))
      )
    })

    console.log(`\nUpdating vite.config.js for ${apps.length} game apps...\n`)

    let updated = 0,
      skipped = 0,
      errors = 0

    for (const app of apps) {
      const viteConfig = path.join(appsDir, app, 'vite.config.js')
      const result = updateViteConfig(viteConfig)

      if (result.status === 'updated') {
        console.log(`✓ ${app.padEnd(25)} - ${result.msg}`)
        updated++
      } else if (result.status === 'skip') {
        console.log(`⊘ ${app.padEnd(25)} - ${result.msg}`)
        skipped++
      } else {
        console.log(`✗ ${app.padEnd(25)} - ERROR: ${result.msg}`)
        errors++
      }
    }

    console.log(`\n────────────────────────────────────────`)
    console.log(`Updated: ${updated}`)
    console.log(`Skipped: ${skipped}`)
    console.log(`Errors:  ${errors}`)
    console.log(`────────────────────────────────────────\n`)

    if (errors > 0) {
      console.log('⚠️  Some files could not be updated. Please check them manually.')
      process.exit(1)
    } else {
      console.log('✅ All vite.config.js files updated successfully!')
      console.log('\nNext steps:')
      console.log('  1. Run: pnpm install (if needed)')
      console.log('  2. Test builds: pnpm --filter "@games/*" build')
      console.log('  3. Verify web builds work without Capacitor errors')
      process.exit(0)
    }
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
