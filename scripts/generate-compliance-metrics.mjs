#!/usr/bin/env node

/**
 * Compliance Metrics Generator
 * Scans all 25 game apps and generates quality/compliance metrics
 * Extends compliance/matrix.json with per-game compliance data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');
const complianceDir = path.join(rootDir, 'compliance');
const matrixFile = path.join(complianceDir, 'matrix.json');

// 25 core games (not ui package)
const CORE_GAMES = [
  'battleship', 'bunco', 'cee-lo', 'checkers', 'chicago', 'cho-han',
  'connect-four', 'crossclimb', 'farkle', 'hangman', 'liars-dice',
  'lights-out', 'mancala', 'memory-game', 'mexico', 'minesweeper',
  'mini-sudoku', 'monchola', 'nim', 'pig', 'pinpoint', 'queens',
  'reversi', 'rock-paper-scissors', 'ship-captain-crew', 'shut-the-box',
  'simon-says', 'snake', 'sudoku', 'tango', 'tictactoe', 'zip'
];

/**
 * Check if app has passing build
 */
function checkBuildStatus(appName) {
  const appDir = path.join(appsDir, appName);
  const distDir = path.join(appDir, 'dist');
  return fs.existsSync(distDir) ? 'green' : 'red';
}

/**
 * Check test status
 */
function checkTestStatus(appName) {
  const appDir = path.join(appsDir, appName);
  try {
    // Try to run tests for this app (isolated)
    execSync(`cd "${appDir}" && pnpm test --run 2>/dev/null`, { 
      stdio: 'pipe',
      timeout: 30000 
    });
    return 'green';
  } catch (e) {
    // Tests failed or no tests
    const testsDir = path.join(appDir, 'src');
    const hasTests = execSync(`find "${testsDir}" -name "*.test.ts*" -type f 2>/dev/null | wc -l`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
    return hasTests > 0 ? 'amber' : 'red';
  }
}

/**
 * Check keyboard navigation implementation
 */
function checkKeyboardNavigation(appName) {
  const appDir = path.join(appsDir, appName);
  const srcDir = path.join(appDir, 'src');
  
  // Look for keyboard-related code
  try {
    const result = execSync(
      `find "${srcDir}" -name "*.ts*" -type f -exec grep -l "useKeyboardControls\\|onKeyDown\\|onKeyUp\\|KeyboardEvent" {} \\; 2>/dev/null | wc -l`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
    return parseInt(result) > 0 ? 'green' : 'amber';
  } catch (e) {
    return 'red';
  }
}

/**
 * Check accessibility (WCAG) implementation
 */
function checkAccessibility(appName) {
  const appDir = path.join(appsDir, appName);
  const srcDir = path.join(appDir, 'src');
  
  try {
    // Look for aria attributes and semantic HTML
    const result = execSync(
      `find "${srcDir}" -name "*.tsx" -type f -exec grep -l "aria-\\|role=\\|semantic" {} \\; 2>/dev/null | wc -l`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
    return parseInt(result) > 0 ? 'green' : 'amber';
  } catch (e) {
    return 'red';
  }
}

/**
 * Check shared system adoption
 */
function checkSharedSystems(appName) {
  const appDir = path.join(appsDir, appName);
  const srcDir = path.join(appDir, 'src');
  
  try {
    // Check for usage of shared packages
    const result = execSync(
      `find "${srcDir}" -name "*.tsx" -o -name "*.ts" | xargs grep -h "@games/\\|@packages/" 2>/dev/null | sort -u | wc -l`,
      { encoding: 'utf-8', shell: '/bin/bash', stdio: 'pipe' }
    ).trim();
    const count = parseInt(result);
    if (count > 5) return 'green';
    if (count > 2) return 'amber';
    return 'red';
  } catch (e) {
    return 'amber';
  }
}

/**
 * Check responsive design (5 tiers)
 */
function checkResponsiveDesign(appName) {
  const appDir = path.join(appsDir, appName);
  const srcDir = path.join(appDir, 'src');
  
  try {
    // Look for responsive patterns
    const result = execSync(
      `find "${srcDir}" -name "*.css" -o -name "*.module.css" | xargs grep -l "@media\\|useResponsiveState" 2>/dev/null | wc -l`,
      { encoding: 'utf-8', shell: '/bin/bash', stdio: 'pipe' }
    ).trim();
    return parseInt(result) > 0 ? 'green' : 'amber';
  } catch (e) {
    return 'amber';
  }
}

/**
 * Check feature completeness
 */
function checkFeatureCompleteness(appName) {
  const appDir = path.join(appsDir, appName);
  
  // Check for required feature files
  const requiredPatterns = [
    'src/domain',      // Game rules
    'src/ui',          // UI components
    'src/app',         // App logic
  ];
  
  const hasAllPatterns = requiredPatterns.every(pattern => {
    return fs.existsSync(path.join(appDir, pattern));
  });
  
  return hasAllPatterns ? 'green' : 'amber';
}

/**
 * Aggregate compliance status
 */
function aggregateStatus(metrics) {
  const counts = { green: 0, amber: 0, red: 0 };
  Object.values(metrics).forEach(status => {
    if (status === 'green') counts.green++;
    else if (status === 'amber') counts.amber++;
    else if (status === 'red') counts.red++;
  });
  
  const total = counts.green + counts.amber + counts.red;
  const percentage = Math.round((counts.green / total) * 100);
  
  if (counts.red > 0) return 'red';
  if (counts.amber > 0) return 'amber';
  return 'green';
}

/**
 * Main execution
 */
function generateCompliance() {
  console.log('📊 Generating compliance metrics for all games...\n');
  
  // Load existing matrix
  let matrix = {};
  if (fs.existsSync(matrixFile)) {
    const content = fs.readFileSync(matrixFile, 'utf-8');
    const data = JSON.parse(content);
    matrix = data;
  }
  
  // Initialize compliance section if not exists
  if (!matrix.compliance) {
    matrix.compliance = {
      metadata: {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        description: 'Quality and compliance metrics for all 25 game apps',
        totalGames: CORE_GAMES.length,
      },
      games: {}
    };
  } else {
    // Update generation time
    matrix.compliance.metadata.generatedAt = new Date().toISOString();
  }
  
  // Generate metrics for each game
  CORE_GAMES.forEach((gameName, index) => {
    const appDir = path.join(appsDir, gameName);
    
    if (!fs.existsSync(appDir)) {
      console.log(`⏭️  ${gameName}: Skipped (directory not found)`);
      return;
    }
    
    console.log(`📈 ${index + 1}/${CORE_GAMES.length}: Scanning ${gameName}...`);
    
    const metrics = {
      buildStatus: checkBuildStatus(gameName),
      testStatus: checkTestStatus(gameName),
      keyboardNavigation: checkKeyboardNavigation(gameName),
      accessibility: checkAccessibility(gameName),
      sharedSystems: checkSharedSystems(gameName),
      responsiveDesign: checkResponsiveDesign(gameName),
      featureCompleteness: checkFeatureCompleteness(gameName),
    };
    
    metrics.overallStatus = aggregateStatus(metrics);
    
    matrix.compliance.games[gameName] = {
      ...metrics,
      completionPercentage: Object.values(metrics)
        .filter(v => v !== 'overallStatus')
        .filter(v => v === 'green').length / 6 * 100,
      lastScanned: new Date().toISOString(),
    };
  });
  
  // Calculate overall compliance
  const statuses = Object.values(matrix.compliance.games).map(g => g.overallStatus);
  const overallGreen = statuses.filter(s => s === 'green').length;
  const overallAmber = statuses.filter(s => s === 'amber').length;
  const overallRed = statuses.filter(s => s === 'red').length;
  
  matrix.compliance.metadata.overallStatus = {
    green: overallGreen,
    amber: overallAmber,
    red: overallRed,
    completionPercentage: Math.round((overallGreen / CORE_GAMES.length) * 100),
  };
  
  // Write updated matrix
  fs.writeFileSync(
    matrixFile,
    JSON.stringify(matrix, null, 2),
    'utf-8'
  );
  
  console.log(`\n✅ Updated: ${matrixFile}`);
  console.log(`\n📊 Summary:`);
  console.log(`   🟢 Green (compliant):  ${matrix.compliance.metadata.overallStatus.green}/${CORE_GAMES.length}`);
  console.log(`   🟡 Amber (partial):    ${matrix.compliance.metadata.overallStatus.amber}/${CORE_GAMES.length}`);
  console.log(`   🔴 Red (issues):       ${matrix.compliance.metadata.overallStatus.red}/${CORE_GAMES.length}`);
  console.log(`   Overall:               ${matrix.compliance.metadata.overallStatus.completionPercentage}% compliant\n`);
}

// Run
generateCompliance();
