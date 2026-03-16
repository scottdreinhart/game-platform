# Lights Out — Complete Deployment & Refinement Phase Guide

Comprehensive step-by-step guide for executing Phases A, B, C, and D.

---

## Phase A: Pre-Deployment Validation

**Goal**: Confirm all code quality checks pass before deployment.

### Step 1: TypeScript Type Check
```bash
cd /mnt/c/Users/scott/lights-out
pnpm typecheck
```

**Expected Output**:
```
✓ 0 errors
```

**If fails**: 
- Review error messages
- Run `pnpm lint:fix` to auto-fix
- Manually fix type violations if needed

---

### Step 2: ESLint Code Quality Check
```bash
pnpm lint
```

**Expected Output**:
```
✓ No violations
```

**If fails**: Run `pnpm lint:fix` for auto-corrections

---

### Step 3: Prettier Format Verification
```bash
pnpm format:check
```

**Expected Output**:
```
✓ All files formatted
```

**If fails**: Run `pnpm format` to auto-format

---

### Step 4: Combined Quality Gate
```bash
pnpm check
```

This runs all three above simultaneously: `lint + format:check + typecheck`

**Expected Output**: All green ✓

---

### Step 5: Production Build
```bash
pnpm build
```

**Expected Output**:
```
✓ dist/ generated (1.4 MB)
✓ 30 files compiled
✓ Build time: ~3-4 seconds
```

**If fails**: Check for:
- Missing dependencies (run `pnpm install`)
- Vite 8.0.0 compatibility (should already be fixed in vite.config.js)
- Asset path issues

---

### Step 6: Accessibility Tests (Playwright)
```bash
pnpm test:a11y
```

**Expected Output**:
```
✓ 45+ tests pass
✓ All browsers (Chrome, Firefox, Safari, Edge, WebKit)
✓ WCAG 2.1 AA compliance verified
```

**If fails**: 
- Review accessibility violations in test output
- Fix contrast ratios, ARIA labels, focus management
- Rerun: `pnpm test:a11y`

---

### Step 7: Lighthouse Performance Audit
```bash
pnpm test:lighthouse
```

**Expected Output**:
```
✓ Performance: 90+
✓ Accessibility: 95+
✓ Best Practices: 90+
✓ SEO: 90+
```

**If below thresholds**: 
- Large Image Optimization (see bundle-report.html)
- CSS reduction
- Third-party script optimization

---

### Step 8: Full Validation Pipeline
```bash
pnpm validate
```

Runs: `check + build` (full pre-push gate)

**Expected Output**: All steps pass with no errors

---

### ✅ Phase A Complete Checklist
After Phase A succeeds:
- [ ] `pnpm typecheck` ✓
- [ ] `pnpm lint` ✓
- [ ] `pnpm format:check` ✓
- [ ] `pnpm build` ✓ (1.4 MB dist/)
- [ ] `pnpm test:a11y` ✓ (45+ tests)
- [ ] `pnpm test:lighthouse` ✓ (90+ scores)
- [ ] `pnpm validate` ✓ (full pipeline)

---

## Phase B: UI Refinement Work

**Goal**: Enhance HamburgerMenu, extract dropdown behavior hook, create SettingsModal organism.

Estimated time: **2-3 hours**

### Step 1: Extract useDropdownBehavior Hook

**Create**: `src/app/hooks/useDropdownBehavior.ts`

```typescript
import { useEffect } from 'react'

interface DropdownConfig {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement>
  panelRef: React.RefObject<HTMLElement>
  onOutsideClick?: () => void
}

/**
 * Centralized dropdown behavior: ESC key, outside-click detection,
 * focus management, and tab trapping.
 * 
 * Used by: HamburgerMenu, QuickThemePicker, and other dropdowns
 */
export const useDropdownBehavior = ({
  open,
  onClose,
  triggerRef,
  panelRef,
  onOutsideClick,
}: DropdownConfig): void => {
  useEffect(() => {
    if (!open) return

    // Handle outside click (before panel capture)
    const handleOutsideClick = (e: Event) => {
      if (
        !triggerRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) {
        onClose()
        onOutsideClick?.()
      }
    }

    // Handle ESC key
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        triggerRef.current?.focus() // Return focus to trigger
      }
    }

    // Use mousedown (not click) to detect outside before panel capture
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [open, triggerRef, panelRef, onClose, onOutsideClick])
}
```

**Export from barrel**: Update `src/app/hooks/index.ts`
```typescript
export { useDropdownBehavior } from './useDropdownBehavior'
```

---

### Step 2: Enhance HamburgerMenu Component

**File**: `src/ui/molecules/HamburgerMenu.tsx`

Key enhancements:
1. Integrate `useDropdownBehavior` hook
2. Implement 3-line → X icon animation
3. Add smart positioning via `useLayoutEffect`
4. Add ARIA attributes
5. Content density awareness

```typescript
import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLayoutEffect } from 'react'
import { useResponsiveState } from '@/app'
import { useDropdownBehavior } from '@/app'
import styles from './HamburgerMenu.module.css'

interface HamburgerMenuProps {
  children: React.ReactNode
  onOpen?: () => void
  onClose?: () => void
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  children,
  onOpen,
  onClose,
}) => {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState<{ top: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const responsive = useResponsiveState()

  // Integrate dropdown behavior hook
  useDropdownBehavior({
    open,
    onClose: () => {
      setOpen(false)
      onClose?.()
    },
    triggerRef: btnRef,
    panelRef,
  })

  // Calculate position from button bounding rect
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return

    const btnRect = btnRef.current.getBoundingClientRect()
    const board = document.getElementById('game-board')
    const boardRect = board?.getBoundingClientRect()

    if (boardRect) {
      // Align panel right-edge to board right-edge with overflow clamping
      const panelWidth = responsive.isMobile ? 320 : responsive.isTablet ? 400 : 480
      let left = boardRect.right - panelWidth

      const minLeft = boardRect.left + 12
      if (left < minLeft) left = minLeft

      setPanelPos({
        top: btnRect.bottom + 8,
        left,
      })
    }
  }, [open, responsive.isMobile, responsive.isTablet])

  return (
    <div className={styles.root}>
      <button
        ref={btnRef}
        type="button"
        className={styles.button}
        onClick={() => {
          setOpen(!open)
          !open && onOpen?.()
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="hamburger-menu-panel"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {/* 3-line hamburger icon → X animation */}
        <span className={`${styles.line} ${open ? styles.lineOpen : ''}`} />
        <span className={`${styles.line} ${open ? styles.lineOpen : ''}`} />
        <span className={`${styles.line} ${open ? styles.lineOpen : ''}`} />
      </button>

      {open && panelPos && createPortal(
        <div
          ref={panelRef}
          id="hamburger-menu-panel"
          className={styles.panel}
          role="menu"
          aria-label="Game menu"
          style={{
            top: `${panelPos.top}px`,
            left: `${panelPos.left}px`,
          }}
        >
          {children}
        </div>,
        document.body,
      )}
    </div>
  )
}
```

**Update**: `src/ui/molecules/HamburgerMenu.module.css`

```css
.root {
  position: relative;
}

.button {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1000;
  transition: transform 200ms ease;
}

.button:hover {
  transform: scale(1.05);
}

.line {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 300ms ease;
  border-radius: 1px;
}

/* Transform to X shape when open */
.lineOpen:nth-child(1) {
  transform: translateY(6.5px) rotate(45deg);
}

.lineOpen:nth-child(2) {
  opacity: 0;
}

.lineOpen:nth-child(3) {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* Portal panel fixed positioning */
.panel {
  position: fixed;
  background: var(--bg-primary, #ffffff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 12px;
  padding: 14px 16px;
  min-width: 240px;
  max-width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  animation: panelEnter 250ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
  max-height: 80vh;
  overflow-y: auto;
}

@keyframes panelEnter {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive sizing */
@media (max-width: 599px) {
  .panel {
    min-width: 240px;
    max-width: 320px;
  }
}

@media (min-width: 600px) and (max-width: 899px) {
  .panel {
    min-width: 280px;
    max-width: 400px;
  }
}

@media (min-width: 900px) {
  .panel {
    min-width: 320px;
    max-width: 480px;
  }
}

@media (min-width: 1800px) {
  .panel {
    min-width: 380px;
    max-width: 520px;
  }
}

/* Touch device: disable hover animations */
@media (pointer: coarse) {
  .button:hover {
    transform: none;
  }
  
  .panel {
    /* Touch-friendly adjustments */
  }
}
```

---

### Step 3: Create SettingsModal Organism

**Create**: `src/ui/organisms/SettingsModal.tsx`

```typescript
import React, { useState } from 'react'
import { useTheme, useSoundEffects, useResponsiveState } from '@/app'
import { Button } from '@/ui/atoms'
import { QuickThemePicker } from '@/ui/molecules'
import styles from './SettingsModal.module.css'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const { theme, setTheme } = useTheme()
  const { soundEnabled, toggleSound } = useSoundEffects()
  const responsive = useResponsiveState()

  const [pendingTheme, setPendingTheme] = useState(theme)
  const [pendingSound, setPendingSound] = useState(soundEnabled)

  const handleOK = () => {
    setTheme(pendingTheme)
    // Update sound setting if needed
    if (pendingSound !== soundEnabled) {
      toggleSound()
    }
    onClose()
  }

  const handleCancel = () => {
    // Revert to previous state
    setPendingTheme(theme)
    setPendingSound(soundEnabled)
    onClose()
  }

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        style={{
          maxHeight: '90vh',
          padding: responsive.contentDensity === 'compact' ? '1rem' : '1.5rem',
        }}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="settings-title">Settings</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Display & Theme Section */}
          <section className={styles.section}>
            <h3>Display & Theme</h3>
            <QuickThemePicker
              currentTheme={pendingTheme}
              onSelect={setPendingTheme}
            />
          </section>

          {/* Sound Section */}
          <section className={styles.section}>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={pendingSound}
                onChange={(e) => setPendingSound(e.target.checked)}
              />
              <span>Sound Effects</span>
            </label>
          </section>

          {/* About Section */}
          <section className={styles.section}>
            <h3>About</h3>
            <p>Lights Out v1.0.0</p>
            <p>© 2026 Scott Reinhart. All rights reserved.</p>
          </section>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleOK}>
            OK
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**Create**: `src/ui/organisms/SettingsModal.module.css`

```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  animation: fadeIn 200ms ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: var(--bg-primary);
  border-radius: 16px;
  max-width: 500px;
  width: 95vw;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideUp 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.closeBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  color: var(--text-secondary);
  transition: color 200ms ease;
}

.closeBtn:hover {
  color: var(--text-primary);
}

.content {
  flex: 1;
  padding-bottom: 1rem;
}

.section {
  margin-bottom: 1.5rem;
}

.section h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: var(--text-secondary);
}

.section p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.label input {
  cursor: pointer;
}

.footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap-reverse;
}

/* Mobile: Stack buttons vertically */
@media (max-width: 599px) {
  .footer {
    flex-direction: column-reverse;
  }

  .footer button {
    width: 100%;
  }
}

/* Tablet+: Side by side */
@media (min-width: 600px) {
  .footer {
    justify-content: flex-end;
  }
}
```

---

### Step 4: Integrate SettingsModal into App.tsx

**Update**: `src/ui/organisms/App.tsx`

Add state for modal visibility and integrate SettingsModal:

```typescript
import { SettingsModal } from '@/ui/organisms'

export const App: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className={styles.app}>
      {/* Existing content */}
      <HamburgerMenu>
        <button onClick={() => setSettingsOpen(true)}>
          All Settings
        </button>
      </HamburgerMenu>

      {/* Settings Modal */}
      <SettingsModal 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  )
}
```

---

### Step 5: Test Responsive Behavior

After code changes, test at all 5 breakpoints:

```bash
pnpm dev
# Open browser DevTools (F12)
# Test at: 375px, 600px, 900px, 1200px, 1800px
```

**Checklist**:
- ✓ Icon animates smoothly (3-line → X)
- ✓ Menu slides in from right
- ✓ Modal appears with fade + slide animation
- ✓ Buttons positioned correctly per breakpoint
- ✓ Content scrollable on mobile (90vh max)
- ✓ Touch targets ≥44px on mobile
- ✓ Cancel reverts changes
- ✓ OK persists changes to storage

---

### ✅ Phase B Complete Checklist
- [ ] Extract useDropdownBehavior hook ✓
- [ ] Enhance HamburgerMenu with animation + positioning ✓
- [ ] Create SettingsModal organism ✓
- [ ] Integrate into App.tsx ✓
- [ ] Test all 5 responsive breakpoints ✓
- [ ] Verify animations smooth ✓
- [ ] Verify ARIA attributes present ✓
- [ ] Verify touch targets ≥44px ✓

---

## Phase C: Electron Desktop Builds

**Goal**: Build and test Electron packages for Windows, Linux, and macOS.

### Prerequisites Check

```bash
cd /mnt/c/Users/scott/lights-out

# Verify Electron installed
pnpm list electron

# Verify electron-builder installed
pnpm list electron-builder
```

Expected:
```
electron@41.0.2
electron-builder@26.8.1
```

---

### Step 1: Clean & Build Web Assets (All Platforms)

```bash
pnpm clean
pnpm build
```

Expected output:
```
✓ dist/ generated (1.4 MB)
✓ 30 files
```

---

### Step 2: Build Windows Executable (.exe)

**Command** (from PowerShell):
```powershell
cd C:\Users\scott\lights-out
pnpm electron:build:win
```

**Expected output**:
```
✓ Lights Out 1.0.0.exe (~200 MB)
✓ Output: release/Lights Out 1.0.0.exe
✓ Portable executable (no installer needed)
```

**Installation Test**:
1. Double-click `release/Lights Out 1.0.0.exe`
2. App extracts to `%APPDATA%/Local/Programs/Lights Out`
3. Verify app launches
4. Test: Hamburger menu, settings modal, theme selection

---

### Step 3: Build Linux AppImage (.AppImage)

**Command** (from WSL/Bash):
```bash
cd /mnt/c/Users/scott/lights-out
pnpm build
pnpm electron:build:linux
```

**Expected output**:
```
✓ lights-out-1.0.0.AppImage (~150 MB)
✓ Output: release/lights-out-1.0.0.AppImage
✓ Self-contained, no dependencies needed
```

**Installation Test** (on Linux):
```bash
chmod +x lights-out-1.0.0.AppImage
./lights-out-1.0.0.AppImage
```

Verify app launches and functions correctly.

---

### Step 4: Build macOS DMG (.dmg)

**Prerequisites**:
- macOS hardware (10.13+)
- Xcode Command Line Tools: `xcode-select --install`
- Valid Apple Developer ID (for code signing)

**Command** (from macOS only):
```bash
cd /path/to/lights-out
pnpm build
pnpm electron:build:mac
```

**Expected output**:
```
✓ Lights Out-1.0.0.dmg (~180 MB)
✓ Output: release/Lights Out-1.0.0.dmg
✓ Installer with drag-to-Applications workflow
```

**Installation Test**:
1. Open DMG file
2. Drag app to /Applications
3. Launch app from Applications folder
4. Verify functionality

---

### Step 5: Verify All Builds

```bash
ls -lah release/
```

Expected:
```
Lights Out 1.0.0.exe         ~200 MB
lights-out-1.0.0.AppImage    ~150 MB
Lights Out-1.0.0.dmg         ~180 MB (if on macOS)
```

---

### ✅ Phase C Complete Checklist
- [ ] pnpm build succeeds ✓
- [ ] pnpm electron:build:win succeeds (PowerShell) ✓
- [ ] pnpm electron:build:linux succeeds (Bash) ✓
- [ ] pnpm electron:build:mac succeeds (macOS only) ✓
- [ ] Windows .exe launches and functions ✓
- [ ] Linux .AppImage launches and functions ✓
- [ ] macOS .dmg launches and functions ✓
- [ ] All IPC channels working (version, platform, window controls) ✓

---

## Phase D: Android Mobile Build

**Goal**: Sync web assets to Capacitor native project and build Android APK.

### Prerequisites

```bash
# Check Android Studio installed
which android
# or on macOS/Linux:
echo $ANDROID_HOME

# Check Java 17+
java -version

# Check Gradle
gradle --version
```

Expected: Android Studio 2024.x+, Java 17+, Gradle 8.x+

---

### Step 1: Sync Web Assets to Capacitor Project

```bash
cd /mnt/c/Users/scott/lights-out
pnpm build
pnpm cap:sync
```

**Expected output**:
```
✓ Web assets synced to android/app/src/main/assets/public/
✓ Capacitor plugins updated
✓ Android project ready for build
```

---

### Step 2: Open Android Studio

```bash
pnpm cap:open:android
```

This launches Android Studio with the `android/` project open.

---

### Step 3: Configure Signing (Optional for App Store)

For development/testing, no signing needed. For Play Store:

1. In Android Studio: **Build → Generate Signed Bundle/APK**
2. Select **APK**
3. Create or select keystore:
   - Keystore Path: `~/.android/release.keystore`
   - Password: (secure password)
   - Key Alias: upload
4. Enter variant: **release**
5. Complete signing

---

### Step 4: Build Release APK

**In Android Studio**:
1. File → Project Structure → Project (verify SDK 33+)
2. Build → Build Bundle(s) / APK(s) → Build APK(s)
3. Build → Build Signed Bundle/APK → APK
4. Select release variant

**Expected output**:
```
✓ app/release/app-release.apk (~50 MB)
✓ Build completed in 2-3 minutes
✓ No errors/warnings
```

---

### Step 5: Test on Emulator or Device

**On Emulator**:
```bash
# With device/emulator running:
adb install -r app/release/app-release.apk
```

Or in Android Studio: **Run → Run 'app'**

**Expected**:
- App launches on Android
- Settings modal visible
- Theme switching works
- Sound toggle functions
- Capacitor plugins (StatusBar, Keyboard) respond

---

### Step 6: Prepare for Play Store (Optional)

If submitting to Google Play:

1. **Create Google Play Developer Account** (~$25 one-time)
2. **Create App Listing** in Google Play Console
3. **Upload APK** to closed testing track first
4. **Complete Store Listing**: 
   - App name, description, screenshots
   - Permissions (Microphone, Camera, etc.)
   - Privacy policy URL
5. **Submit for Review** (2-4 hours typically)

---

### ✅ Phase D Complete Checklist
- [ ] pnpm build succeeds ✓
- [ ] pnpm cap:sync succeeds ✓
- [ ] Android Studio opens without errors ✓
- [ ] APK builds successfully ✓
- [ ] APK size reasonable (~50 MB) ✓
- [ ] APK installs on emulator/device ✓
- [ ] App launches and functions ✓
- [ ] Settings modal works on Android ✓
- [ ] Capacitor plugins (StatusBar, Keyboard) work ✓

---

## Summary Command Reference

### Phase A: Pre-Deployment
```bash
pnpm typecheck          # TypeScript check
pnpm lint               # ESLint check
pnpm format:check       # Prettier check
pnpm check              # All three
pnpm build              # Production build
pnpm test:a11y          # Accessibility
pnpm test:lighthouse    # Lighthouse audit
pnpm validate           # Full pipeline (check + build)
```

### Phase B: UI Refinement
```bash
# After code changes:
pnpm dev                # Start dev server (test responsive)
pnpm lint:fix           # Auto-fix code
pnpm format             # Auto-format
pnpm build              # Verify build still works
```

### Phase C: Electron Builds
```bash
pnpm build              # Build web assets
pnpm electron:build:win    # Windows (PowerShell)
pnpm electron:build:linux  # Linux (Bash/WSL)
pnpm electron:build:mac    # macOS (Apple only)
```

### Phase D: Android Build
```bash
pnpm build              # Build web assets
pnpm cap:sync          # Sync to Android project
pnpm cap:open:android  # Open Android Studio
# Then: Build → Build APK in Android Studio
```

---

## Rollback Plan

If any phase fails:

### Phase A Failures
```bash
# Revert code changes
git checkout src/
git checkout vite.config.js

# Reinstall dependencies
pnpm install

# Retry commands
pnpm validate
```

### Phase B Failures
```bash
# Revert UI refinements
git checkout src/ui/
git checkout src/app/

# Rebuild
pnpm build
pnpm lint:fix
```

### Phase C Failures
```bash
# Clean builds
pnpm clean
pnpm build

# Retry Electron build
pnpm electron:build:win  # or :linux/:mac
```

### Phase D Failures
```bash
# Resync Capacitor
pnpm cap:sync
pnpm cap:open:android

# Clean Android build
rm -rf android/app/build
# Rebuild in Android Studio
```

---

## Next Steps After All Phases Complete

1. **Commit Work**:
   ```bash
   git add -A
   git commit -m "chore: Complete UI refinement, Electron & Android builds"
   git tag -a v1.0.0 -m "Production release"
   git push origin main --tags
   ```

2. **Deploy Web**:
   - Netlify: `netlify deploy --prod --dir=dist`
   - Vercel: `vercel --prod`
   - GitHub Pages: Push `dist/` to `gh-pages` branch

3. **Distribute Desktop**:
   - GitHub Releases: Upload .exe, .AppImage, .dmg files
   - Add release notes

4. **Publish Mobile**:
   - Google Play Store: Submit APK for review
   - Apple App Store: Submit IPA (iOS) for review

---

**Last Updated**: March 15, 2026  
**Project**: Lights Out v1.0.0  
**Status**: Ready for Phases A–D execution
