---
tags:
  - status
---

# TASKS — רשימת משימות-פיתוח

> **מסונכרן עם** [`docs/ROADMAP.md`](./ROADMAP.md) — תוכנית-עבודה חיה.
> **לפני סימון משימה כהושלמה:** ודא תאימות עם [`docs/TASK-COMPLETION-PROTOCOL.md`](./TASK-COMPLETION-PROTOCOL.md) (DoD per task type).
> **אם משימה חדשה משנה תכולה:** עדכן ROADMAP דרך RoadmapKeeper, לא ידנית.

## ✅ הושלם

### Phase 0 — תשתית (יום 1)
- [x] git clone של הריפו
- [x] מבנה תיקיות (`src/`, `styles/`, `assets/`, `docs/`, `scripts/`, `design-mocks/`, `.claude/skills/`, `.claude/agents/`, `tests/`)
- [x] `design-mocks/shared/tokens.css` (canonical design tokens)
- [x] `design-mocks/shared/base.css`
- [x] `CLAUDE.md` (project instructions)
- [x] 5 custom skills ב-`.claude/skills/`
- [x] 9 sub-agents ב-`.claude/agents/`

## ⏳ בעבודה

### Phase 0 — נשאר
- [ ] אתחול שאר 24 קבצי MD ב-`docs/` (חלק נעשה — PROGRESS.md, TASKS.md)
- [ ] 6 PowerShell scripts:
  - [ ] `scripts/start-chachmoni.ps1` (PowerShell Launcher)
  - [ ] `scripts/install-shortcut.ps1`
  - [ ] `scripts/git-sync.ps1` (bidirectional)
  - [ ] `scripts/install-task-scheduler.ps1`
  - [ ] `scripts/check-contrast.ps1`
  - [ ] `scripts/audit.ps1` (Lighthouse)
- [ ] `.gitignore` מורחב
- [ ] עדכון `README.md`
- [ ] עדכון `PLAN.md` (גרסה אחרונה מהתכנון)
- [ ] commit ראשון

## 🔜 ממתין

### Phase 0.5 — מוקאפים (לפני שלב 1)
- [ ] 5 briefs מ-Claude Design (לוגו, mascot, welcome A/B, avatars, task+celebration)
- [ ] design-mocks/01-welcome.html
- [ ] design-mocks/02-profile-select.html
- [ ] design-mocks/03-profile-create.html
- [ ] design-mocks/04-pin-entry.html
- [ ] design-mocks/05-pin-wrong.html
- [ ] design-mocks/06-parent-dashboard.html
- [ ] design-mocks/09-first-run-wizard.html
- [ ] design-mocks/10-world-map.html
- [ ] design-mocks/11-task-click-balloons.html
- [ ] design-mocks/12-success-celebration.html
- [ ] design-mocks/13-photo-uploader.html

### Phase 1 — שלד + פרופילים
- [ ] `index.html`
- [ ] `src/app.js` (state machine)
- [ ] `src/audio.js` (TTS + speakOnHover + speakOnHoverOrTouch)
- [ ] `src/storage.js` (multi-profile localStorage)
- [ ] `src/profiles.js` (CRUD)
- [ ] `src/photo-store.js` (IndexedDB Blob)
- [ ] `src/backup.js` (Export/Import JSON)
- [ ] `src/ui/button.js` (textContent, no innerHTML)
- [ ] `src/ui/photo-uploader.js` (magic-bytes + canvas)
- [ ] `src/ui/avatar-picker.js`
- [ ] `src/browser-check.js`
- [ ] `src/welcome.js` (First-Run wizard + Guest Mode)
- [ ] `styles/global.css` (import tokens.css)
- [ ] `styles/components.css`

### Phase 2-9 — ראה `PLAN.md` (שלבי בנייה מפורטים)

## 📊 התקדמות-כללית

- **Phase 0:** 80% (תשתית כמעט-גמורה)
- **MVP בכלל:** ~10% (תשתית בלבד)
- **משימות-מובנות ל-MVP:** 0/50
- **תבניות:** 0/8
- **קבצי MD:** ~10/24 נוצרו

## 🎯 KPIs

- **bugs-caught-by-council:** 40+ (Round 1+2)
- **bugs-found-by-kids:** 0 (לא התחלנו)
- **Ratio:** N/A
- **קוד-שורות:** ~700 (tokens + skills + agents)
