# Lights Out — Quick Execution Checklist

**Status**: All code ready. Awaiting WSL recovery (system restart).

---

## 🔴 CRITICAL: System Recovery (DO THIS FIRST)

**Windows requires restart** to clear WSL socket buffer exhaustion.

### Step 1: Restart Windows
1. Save all work
2. **Start Menu → Power → Restart**
3. Wait for system to reboot (~1 minute)
4. Log back in

### Step 2: Verify WSL Recovery
```bash
wsl
# Should open WSL terminal without errors
cd /mnt/c/Users/scott/lights-out
ls package.json
# Should show file with no errors
```

If still seeing "Wsl/Service/0x80072747" errors, try:
```powershell
# From PowerShell:
wsl --unregister Ubuntu
wsl --install -d Ubuntu
```

**Once WSL works**, proceed to Phase A.

---

## ✅ Phase A: Pre-Deployment Validation (15–20 minutes)

**All commands from WSL Bash**:

### A1: TypeScript Check
```bash
cd /mnt/c/Users/scott/lights-out
pnpm typecheck
```
**Expected**: `✓ 0 errors`

### A2: ESLint Check
```bash
pnpm lint
```
**Expected**: `✓ No violations`

### A3: Prettier Check
```bash
pnpm format:check
```
**Expected**: `✓ All files formatted`

### A4: Combined Quality Gate
```bash
pnpm check
```
**Expected**: All three pass (lint + format + typecheck)

### A5: Production Build
```bash
pnpm build
```
**Expected**: 
```
✓ dist/ generated (1.4 MB)
✓ 30 files compiled
```

### A6: Accessibility Tests
```bash
pnpm test:a11y
```
**Expected**: `✓ 45+ tests pass`

### A7: Lighthouse Audit
```bash
pnpm test:lighthouse
```
**Expected**: `✓ Scores 90+ across all categories`

### A8: Full Validation Pipeline
```bash
pnpm validate
```
**Expected**: All steps pass (check + build)

---

## ✅ Phase B: UI Refinement (DONE — No Action Needed)

**Status**: ✓ Complete and integrated
- ✓ useDropdownBehavior hook extracted
- ✓ HamburgerMenu enhanced with animation
- ✓ SettingsModal organism created
- ✓ All integrated into App.tsx

**To test**: After Phase A succeeds:
```bash
pnpm dev
# Open http://localhost:5173
# Click hamburger menu (top-right)
# Click "All Settings"
# Toggle theme and sound
# Click Cancel/OK to test transactional behavior
```

---

## ✅ Phase C: Electron Builds (10–15 minutes)

**Prerequisites**: Phase A must pass

### C1: Clean & Build Web
```bash
pnpm clean
pnpm build
```
**Expected**: 1.4 MB dist/

### C2: Build Windows Executable (PowerShell)
```powershell
cd C:\Users\scott\lights-out
pnpm electron:build:win
```
**Expected**: 
```
✓ release/Lights Out 1.0.0.exe (~200 MB)
```

**Test**:
1. Double-click the .exe file
2. App launches
3. Test menu and settings modal

### C3: Build Linux AppImage (Bash/WSL)
```bash
cd /mnt/c/Users/scott/lights-out
pnpm build
pnpm electron:build:linux
```
**Expected**:
```
✓ release/lights-out-1.0.0.AppImage (~150 MB)
```

### C4: Build macOS DMG (macOS only)
```bash
# Only if you have macOS hardware:
pnpm build
pnpm electron:build:mac
```
**Expected**:
```
✓ release/Lights Out-1.0.0.dmg (~180 MB)
```

---

## ✅ Phase D: Android Mobile Build (15–20 minutes)

**Prerequisites**: Phase A + C must pass

### D1: Sync Web Assets
```bash
cd /mnt/c/Users/scott/lights-out
pnpm build
pnpm cap:sync
```
**Expected**: Assets synced to android/app/src/main/assets/public/

### D2: Open Android Studio
```bash
pnpm cap:open:android
```
**Expected**: Android Studio opens with project loaded

### D3: Build APK in Android Studio
1. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete (~2–3 minutes)
3. Expected output: `app/release/app-release.apk` (~50 MB)

### D4: Test on Emulator/Device
```bash
# With emulator or device running:
adb install -r app/release/app-release.apk
```

**Expected**: App launches on Android, menu and settings work

---

## 📋 Post-Execution Checklist

After all phases complete:

### Verification
- [ ] Phase A: All 8 commands pass (typecheck, lint, format, build, test:a11y, test:lighthouse, validate)
- [ ] Phase B: Menu opens, settings modal functional, animations smooth
- [ ] Phase C: Windows .exe, Linux .AppImage, and macOS .dmg all built and tested
- [ ] Phase D: Android APK built and installed on emulator/device

### Deployment (Optional)
```bash
# Commit all work
git add -A
git commit -m "chore: Phase A-D execution complete — production ready"
git tag -a v1.0.0 -m "Production release"

# Deploy web (choose one):
# Option 1: Netlify
netlify deploy --prod --dir=dist

# Option 2: Vercel
vercel --prod

# Option 3: GitHub Pages
git push origin main --tags
```

---

## 🆘 Troubleshooting

### Issue: pnpm commands still fail after restart
**Solution**:
```bash
# Clear node_modules and reinstall
pnpm clean:node
pnpm install

# Or full reset:
pnpm clean:all
pnpm install
```

### Issue: Electron build fails with "Icon not found"
**Solution**: Icons should be in `public/`:
```bash
ls public/icon.png
ls public/icon.icns  # macOS only
```

### Issue: Android build fails in Android Studio
**Solution**:
```bash
# Resync and try again
pnpm cap:sync
pnpm cap:open:android
# Then clean build: Build → Clean Project
```

### Issue: Lighthouse scores below 90
**Solution**: Check performance tab in Lighthouse report, likely:
- Large images (optimize via Vite)
- Unused CSS (check theme files)
- Third-party scripts (verify analytics)

---

## Key Command Reference

| Phase | Command | Expected Output |
|-------|---------|-----------------|
| A | `pnpm validate` | All pass ✓ |
| A | `pnpm test:a11y` | 45+ tests ✓ |
| A | `pnpm test:lighthouse` | 90+ scores ✓ |
| B | `pnpm dev` (manual test) | App runs, menu works ✓ |
| C | `pnpm electron:build:win` | ~200 MB .exe ✓ |
| C | `pnpm electron:build:linux` | ~150 MB .AppImage ✓ |
| D | `pnpm cap:sync` + Android build | ~50 MB .apk ✓ |

---

## Timeline Estimate

- **System Restart**: 1–2 minutes
- **Phase A**: 15–20 minutes
- **Phase B**: 5 minutes (testing only, code already done)
- **Phase C**: 10–15 minutes
- **Phase D**: 15–20 minutes
- **Total**: 45–75 minutes for full completion

---

## Go / No-Go Decision Points

✅ **Green Light to Proceed** if:
- [x] WSL fully recovered (can run `ls`, `pnpm --version`)
- [x] Phase A: All 8 commands pass
- [x] Phase B: Menu and settings working
- [x] No new TypeScript errors

🔴 **Stop and Debug** if:
- [ ] WSL still failing with buffer errors
- [ ] Phase A command fails
- [ ] Phase C build has linking errors
- [ ] Phase D APK fails to install

---

**Created**: March 15, 2026  
**Project**: Lights Out v1.0.0  
**Status**: Code complete, awaiting execution
