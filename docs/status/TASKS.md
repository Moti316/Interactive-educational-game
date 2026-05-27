---
tags:
  - status
---

# TASKS — רשימת משימות-פיתוח

> **מסונכרן עם** [`docs/status/ROADMAP.md`](./ROADMAP.md) ו-[`docs/status/PROGRESS.md`](./PROGRESS.md).
> **גרסה:** v1.0.0 (2026-05-24) — MVP feature-complete autonomous run.

## ✅ הושלם

### Phase 0 — תשתית
- [x] git clone של הריפו · מבנה תיקיות · README · 9 sub-agents · 5 skills · 6 PS scripts

### Phase 0.5 — מוקאפים (5 briefs)
- [x] Brief #1.5 (Logo Redux) · #2 (Mascot 6 poses) · #3 (Welcome A/B) · #4 (12 avatars) · #5 (Task + Celebration)

### Phase 1 — שלד + פרופילים
- [x] `index.html` (file:// detection)
- [x] `src/app.js` (state machine)
- [x] `src/audio.js` (TTS he-IL 0.85)
- [x] `src/audio-cues.js` (Web Audio synth — ADR-017)
- [x] `src/storage.js` (chachmoni:* prefix)
- [x] `src/db.js` (IndexedDB wrapper) — **חדש**
- [x] `src/photo-store.js` (magic-bytes + canvas) — **חדש**
- [x] `src/backup.js` (Export/Import JSON) — **חדש**
- [x] `src/profiles.js` (CRUD)
- [x] `src/pin-entry.js` (PBKDF2 PIN) — **חדש (CHG-005 v1)**
- [x] `src/settings.js` (parent dashboard) — **חדש (CHG-005 v1)**
- [x] `src/ui/button.js` (textContent only)
- [x] `src/ui/avatar-picker.js` (12-grid)
- [x] `src/welcome.js` (first-run wizard)
- [x] `src/browser-check.js`
- [x] `styles/global.css` (imports tokens.css)
- [x] `styles/components.css` (~1000 lines)

### Phase 2 — תבנית ראשונה + game loop
- [x] `src/templates/click-targets.js` + 3 משימות (balloons, bubbles, stars)
- [x] `src/celebration.js` (mascot + confetti + audio cue)
- [x] לולאת-משחק WELCOME → WORLD_MAP → TASK → CELEBRATION → repeat

### Phase 3 — תבניות עכבר (5 templates · ADR-018 right-click revival)
- [x] `src/templates/hover-target.js` + 3 משימות (animals, objects, fruits)
- [x] `src/templates/double-click-reveal.js` + 2 משימות (treasures, gifts)
- [x] `src/templates/drag-drop-match.js` + 3 משימות (animals, fruits, colors)
- [x] `src/templates/right-click-menu.js` + 2 משימות (pick, animals)

### Phase 4 — Drive Sync infrastructure
- [x] `src/sync/drive-config.js` (CLIENT_ID slot · drive.file scope only)
- [x] `src/sync/drive-auth.js` (GIS token-client)
- [x] `src/sync/drive-sync.js` (per-profile files · 2-way merge · auto-sync on launch)
- [ ] **⏳ ACTIVATION:** OAuth Client ID setup ב-Google Cloud (~30 דק' תלוי-הורה)

### Phase 5 — תבניות מקלדת (2 templates)
- [x] `src/templates/key-press.js` + 4 משימות (arrows-basic, arrows-mix, space-enter, arrows-long)
- [x] `src/templates/type-word.js` + 5 משימות (אבא, אמא, דוד, סוס, כדור, ים, שיר, שמש)

### Phase 6 — point-and-narrate (1 template, multi-world)
- [x] `src/templates/point-and-narrate.js` (SVG backdrops: window + browser)
- [x] World 3 (window): 3 משימות (anatomy, actions, colors)
- [x] World 4 (browser): 3 משימות (anatomy, buttons, address)

### Phase 7 — תוכן (26/50 משימות — ~52%)
- [x] Mouse: 14 משימות (3 click + 3 hover + 2 dblclick + 3 dragdrop + 2 right-click + 1 stars)
- [x] Keyboard: 9 משימות (4 key-press + 5 type-word)
- [x] Window: 3 משימות
- [x] Browser: 3 משימות
- [ ] **🔜 Future:** הרחבה ל-50 (lower-priority — לא חוסם MVP)

### Phase 8 — ליטוש
- [x] Audio cues (cueCorrect/Wrong/Complete/Click)
- [x] Per-world progress meter (world cards)
- [x] Progressive world unlock (3-3-2 — ADR-019)
- [x] `@media (prefers-reduced-motion)` overrides
- [x] Auto-sync on launch (silent best-effort)
- [ ] **🔜 Future:** BUG-002 (4 avatar quality) — deferred

### Phase 9 — אריזה ומסירה
- [x] `scripts/start-chachmoni.ps1` (PowerShell Launcher, port 8080-8085, CSP headers)
- [x] `scripts/install-shortcut.ps1` (Desktop .lnk)
- [x] `docs/guides/PARENT-GUIDE.md` (full rewrite, OAuth walkthrough, backup, PIN)
- [x] Export/Import UI ב-settings.js
- [x] `docs/log/KIDS-FEEDBACK.md` (template + 6 test scenarios)

## ⏳ ממתין לפעולת-הורה (2 חוסמים)

- [ ] **OAuth Client ID setup** (~30 דק' חד-פעמי, Google Cloud Console)
  → הוראות-מלאות ב-`docs/guides/PARENT-GUIDE.md` §2 (5 שלבים)
  → אחרי הצבה ב-`src/sync/drive-config.js`, Drive sync יפעל אוטומטית.

- [ ] **Kid-testing** (Phase 2 DoD)
  → הורה + יואב + ביתי, ~30 דק'
  → תיעוד ב-`docs/log/KIDS-FEEDBACK.md` (template + 6 תרחישים מוכנים)

## 🔜 ממתין

### R5 — Council Post-Phase-1 (אופציונלי לפני R-Final)
- ראה `docs/teams/TEAM-COUNCIL.md` להרכב

### R7 — Council Post-Phase-3 (אופציונלי לפני R-Final)

### R-Final — Pre-MVP-Delivery
- אחרי OAuth + kid-test השלמה
- Full Council (8 members + chair)
- GO criteria: כל PASS או 7/8 + 1 WARNING קל

## 📊 התקדמות-כללית

- **Phase 0-1:** 100%
- **Phase 2-3:** 100% קוד · 95% (חסר kid-test)
- **Phase 4:** 95% (קוד-מוכן · חסר OAuth activation)
- **Phase 5-6:** 100%
- **Phase 7:** 52% (26/50 משימות — Future expansion)
- **Phase 8-9:** 100%
- **MVP feature-complete:** ~95%

## 🎯 KPIs

- **קבצי-קוד:** 26 modules (~3300 LOC)
- **משימות פעילות:** 26 (mouse 14, keyboard 9, window 3, browser 3)
- **תבניות:** 8 (click, hover, dblclick, drag, right-click, key-press, type-word, point-narrate)
- **bugs-caught-by-council:** 40+ (Rounds 1-4)
- **bugs-open:** 1 (BUG-002, Low)
- **bugs-found-by-kids:** 0 (test pending)
