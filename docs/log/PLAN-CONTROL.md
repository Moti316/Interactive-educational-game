---
tags:
  - log
---

# PLAN CONTROL — בקרה על שינויי-תכנון

## פורמט

```markdown
## CHG-NNN | YYYY-MM-DD HH:MM | סטטוס: ✅/🟡/🔴
**מהות:** מה השתנה
**טריגר:** מי ביקש ולמה
**שינוי-עיקרי:** ...

### סעיפים שהושפעו
- [x] §מחסנית טכנית — עודכן
- [x] §מבנה תיקיות — עודכן

### וידוא-עקביות
- ✅ Grep "X" — כל ההפניות עקביות
```

---

## CHG-001 | 2026-05-17 | ✅ הוטמע
**מהות:** הוספת Drive sync ל-MVP (היה Phase 2)
**טריגר:** משתמש — "חיבור מהיר ל-Google Drive"
**שינוי:** העברת sync/ ל-MVP, הוספת PowerShell Launcher

---

## CHG-002 | 2026-05-17 | ✅ הוטמע
**מהות:** Multi-user — תמיכה ב-N פרופילים (היה 2)
**טריגר:** משתמש — "פתיחת משתמשים נוספים"

---

## CHG-003 | 2026-05-17 | ✅ הוטמע
**מהות:** ~40 patches מ-2 סבבי Council
**טריגר:** Council recommendation
**שינוי:** PIN PBKDF2, HttpListener bind, OAuth GIS, XSS textContent, ועוד 36

---

## CHG-004 | 2026-05-17 | ✅ הוטמע
**מהות:** Round 2 Final fixes
**טריגר:** Council Round 2 review
**שינוי:** CSS tokens, TTS rate consistency, prepared names, PIN recovery, lockout time

---

## CHG-005 | 2026-05-17 | 📋 תוכנן (טרם ביצוע — Phase 1)
**מהות:** Parent Profiles + Fast-Path First-Run + 4 ערוצי-נוכחות-הורה
**טריגר:** משתמש — "המשחק יפתח ללא משתמשים קבועים. ילד תחילה, אז הורה. ההורה חלק מהמשחק."
**שינוי-עיקרי:**
- 2 סוגי פרופילים: `kind: 'child' | 'parent'`
- עד 2 הורים (אבא + אמא)
- Schema: `age`, `favoriteColor`, `gender`, `nameNiqud`, `voiceRecordings`, `parentIds`
- 4 ערוצי-נוכחות-הורה: avatar בפרופיל, cameo בחגיגה (50%), הקלטת-קול 4ש', תמונות בdashboard
- 8 צבעים-ראשיים לבחירת-ילד (כל הילדים, ללא הבדלי-גיל/מגדר)
- PIN משותף + 3 רמות-איפוס (recovery question / Drive email / URL emergency)
- A/B Niqud Preview לשמות-עמומים (אורי/הילי)
- AES-GCM encryption + Drive sync של voice (מוצפן)

### סעיפים שהושפעו ב-PLAN.md
- [x] §מחסנית טכנית — AES-GCM, MediaRecorder API
- [x] §מבנה תיקיות — db.js חדש, parents.js מאוחד, niqud-preview, gender-picker
- [x] §פרופילים — schema v2 חדש
- [x] §חוויית פעם-ראשונה — Fast-Path + Progressive Onboarding
- [x] §IDEAS.md — 8 רעיוני-הרחבת-הורה (P1)
- [x] §סיכום-מהיר — עודכן

### תוצאות Council Round 3
- UX-Kid: 🔴 FAIL → תוקן ע"י Fast-Path
- Hebrew: 🟡 WARNING → gender field + 4sec recording + A/B preview
- Security: 🟡 WARNING → AES-GCM + lockout
- Code-Review: 🟡 WARNING → parents merge + db.js + naming
- Integration: 🟡 WARNING → IndexedDB centralized + cleanup + cascade delete

---

## CHG-010 | 2026-05-20 | ✅ 10/10 הוטמע (P1-4 + P0-1 הושלמו 2026-05-22)
**מהות:** שדרוג-תשתית — אימוץ דפוסי-wall לחכמוני (אחרי ניתוח-השוואתי)
**טריגר:** ההורה ביקש ניתוח-השוואתי בין חכמוני ל-wall/TodoWall, ואז אישר אימוץ כל ההמלצות (P0+P1+P2).

**סטטוס פר-פריט:**
- ✅ **P0-2:** בלוק "מצב הפרויקט" חי ב-CLAUDE.md
- ✅ **P1-1:** `docs/status/RISKS.md` — מרשם-סיכונים (7 סיכונים)
- ✅ **P1-2:** `docs/log/AGENT-ACTIVITY-LOG.md` — יומן-הפעלות
- ✅ **P1-3:** תבנית-ADR עשירה (חובה מ-ADR-014)
- ✅ **P2-1:** מפות-תיאום ב-3 מסמכי-הצוות (במקום 19 עריכות-סוכן — right-sized)
- ✅ **P2-2:** role חדש `cross-team-auditor` (חבר Compass שלישי)
- ✅ **P2-3:** backfill ADR-001–006 לתבנית-העשירה (תוכן אמיתי בלבד)
- ✅ **P2-4:** תבנית-שלד `_agent-template.md` (במקום generator גנרי — right-sized)
- ✅ **P1-4:** קיבוץ `docs/` ל-7 תת-תיקיות (`status/ log/ process/ spec/ quality/ teams/ guides/`) — **בוצע 2026-05-22**. 34 קבצים הועברו; `_DASHBOARD`+`_INDEX` נשארו בשורש כנקודות-כניסה. כל ההפניות (CLAUDE.md, .claude/, canvas, HTML) עודכנו; כל קישור אומת שנפתר.
- ✅ **P0-1:** פיצול `PLAN.md` (4097 שורות) ל-8 קבצי `context/` — **בוצע 2026-05-22**. אומת byte-exact (md5 זהה לפני/אחרי). `PLAN.md` הפך אינדקס-ניווט; הפניות אליו נשארות תקפות.

**הקשר נלווה:** Part 1 (גיבוי — branch+tag+`_backup/`) ו-Part 2 (עדכון `workspace-template`) הושלמו לפני CHG זה.

### וידוא-עקביות
- ✅ 8 הפריטים שהוטמעו — נדחפו ב-4 commits (batch 1-3 + batch-2)
- ✅ `cross-team-auditor` קיים ב-`.claude/agents/` + מתועד ב-TEAM-COMPASS
- ✅ ADR-001–006 בתבנית-עשירה; ADR-014+ מחויבים לתבנית
- ✅ P1-4 + P0-1 — בוצעו בסשן-תשתית ממוקד 2026-05-22.

### P1-4 + P0-1 — נדחו ואז הושלמו (שקיפות)
שניהם רפקטור-מבני בקנה-מידה גדול. P1-4 = הפניות-צולבות רבות; P0-1 = פיצול קובץ 4097-שורות. ביצוע בזנב סשן ארוך-מאוד מסכן שבירה-שקטה / אובדן-תוכן. עיקרון "measure twice, cut once" — נדחו עם תיעוד מלא.

**עדכון 2026-05-22:** שניהם בוצעו בסשן-תשתית ממוקד — בדיוק כפי שהדחייה התכוונה. P1-4 אומת ע"י resolution-check לכל קישור-markdown ולכל נתיב ב-canvas; P0-1 אומת ע"י md5 זהה בין המקור לאיחוד-מחדש של 8 הקבצים.

---

## CHG-008 | 2026-05-19 | ✅ הוטמע
**מהות:** Design Studio Formalization (ADR-013) — צוות שלישי לפרויקט
**טריגר:** ההורה זיהה אי-עקביות בין-לוגו-מסקוט; דרש צוות-עיצוב ייעודי + חשיבה-מחודשת על העיצוב מ-Phase 1 ל-MVP
**שינוי-עיקרי:**
- צוות חדש: 7 sub-agents (6 חברים + chair) עם זהות-עומק לכל אחד
- 8 קבצים חדשים: `docs/teams/TEAM-DESIGN.md` + 7 קבצי `.claude/agents/agent-*.md`
- עדכון `CLAUDE.md` — המעבר מ-11 sub-agents ל-18 sub-agents (3 צוותים)
- סדר-הפעלה חדש: Studio (אסתטיקה) → Compass (DoD) → Council (איכות)
- ADR-013 בDECISIONS.md
- הסבב הבא: R-Design-1 (Initial Audit) ייצא דוח ב-`docs/log/DESIGN-AUDIT-R1.md`

### סעיפים שהושפעו ב-PLAN.md
- (אין שינוי-יסוד ב-PLAN.md עצמו — Studio הוא תוספת-ארכיטקטונית של ניהול-פרויקט, לא של תכולה. תכולה תיגזר משלב B — Design Audit.)

### קבצים חדשים
- `docs/teams/TEAM-DESIGN.md` — Charter + 6 חברים + Chair + Workflow Diagram
- `.claude/agents/agent-brand-identity.md`
- `.claude/agents/agent-character-design.md`
- `.claude/agents/agent-color-palette.md`
- `.claude/agents/agent-typography.md`
- `.claude/agents/agent-design-system-arch.md`
- `.claude/agents/agent-motion-story.md`
- `.claude/agents/agent-design-chair.md`

### קבצים מעודכנים
- `CLAUDE.md` — סעיף Sub-Agents (3 צוותים)
- `docs/log/DECISIONS.md` — ADR-013
- `docs/teams/TEAM-COUNCIL.md` — cross-ref ל-Design Studio
- `docs/teams/TEAM-COMPASS.md` — cross-ref ל-Design Studio
- `docs/status/PROGRESS.md` — שדה Latest Design Review
- `docs/log/CHANGELOG.md` — entry 0.5.0

### וידוא-עקביות
- ✅ 7 קבצי agent קיימים תחת `.claude/agents/`
- ✅ TEAM-DESIGN.md כולל 10 sections (Charter, Members, Quorum, Round Naming, History, Workflow, Escalation, Activation, Principles, Doc Cross-Refs)
- ✅ CLAUDE.md מציין את 3 הצוותים
- ✅ ADR-013 נקרא לפי תבנית ADR-007/008
- ✅ TEAM-COUNCIL.md ו-TEAM-COMPASS.md מזכירים Design Studio

---

## CHG-007 | 2026-05-19 | ✅ הוטמע
**מהות:** Local-First Design Path — Claude Code כותב SVG/HTML ישירות (ADR-011)
**טריגר:** Brief #2 ביצוע — ההורה בחר במסלול-מקומי במקום Bridge ל-claude.ai
**שינוי-עיקרי:**
- Bridge Protocol (PLAN.md §1788) הופך fallback path
- Local-First הופך ברירת-מחדל ל-SVG/HTML טהור
- CLAUDE-DESIGN-BRIEFS.md מציג 2 מסלולים (A + B) עם טבלת-החלטה פר-brief
- DoD פר-brief מתעדכן: מסלול-A דורש HTML preview + אישור-ויזואלי-של-הורה; מסלול-B נשאר עם START PASTE/END PASTE
- חיסכון מוערך: ~1 יום ב-ETA ל-MVP

### סעיפים שהושפעו
- [x] `docs/log/DECISIONS.md` — ADR-011 חדש
- [x] `docs/spec/CLAUDE-DESIGN-BRIEFS.md` — סעיף "שני מסלולי-עבודה" חדש
- [x] `PLAN.md §1788` — header עם הפניה ל-ADR-011
- [x] `docs/status/ROADMAP.md` — Phase 0.5 DoD ו-Owner מעודכנים, drift log
- [x] `docs/status/PROGRESS.md` — סטטוס Brief #2 ✅, Phase 0.5 → 40%
- [x] `docs/spec/ASSETS.md` — 6 mascot poses delivered

### תוצרים בפועל
- 6 SVG ב-`assets/mascot/professor-chachmoni-{standing-wave,pointing,celebrating,thinking,encouraging,sleeping}.svg`
- 1 preview ב-`design-mocks/01-mascot-preview.html`
- ADR-011 + CHG-007 בתיעוד

### וידוא-עקביות
- ✅ Grep "script|foreignObject|onclick|onload|onerror|onmouseover|external href" באסטים → 0
- ✅ Grep "viewBox=\"0 0 240 240\"" → 6/6
- ✅ Grep "role=\"img\"" → 6/6
- ✅ Grep "aria-label" → 6/6 (בעברית)
- ✅ גדלים: 1.62–2.19 KB (יעד ≤8 KB)

---

## CHG-006 | 2026-05-17 | 📋 חלק מ-CHG-005
**מהות:** Round 3 Council Patches (14 patches)
**טריגר:** Council Round 3 review
**שינוי:**
1. Fast-Path Mode (30ש' עד משחק)
2. parents.js → profiles.js (מאוחד)
3. src/db.js חדש (IndexedDB מרכזי, version-bump אחד)
4. `gender` field לדקדוק עברי
5. `voiceRecordings: { nameKey, cameoKey }` מאוחד
6. `ttsOverride` אחיד (לא nameTTS+textTTS)
7. A/B Niqud Preview (לא Niqud Picker)
8. 4 שניות הקלטה + waveform + auto-trim
9. Toggle "שם בלועזית" + translit
10. 30 שמות-מוכנים (היה 20)
11. AES-GCM encryption (voice + photo)
12. PIN reset lockout (5 ניסיונות + exponential backoff)
13. voice-recorder.js cleanup contract (`stream.getTracks().forEach(t => t.stop())`)
14. celebration.js pre-fetch של voice לפני החגיגה

### החלטות-משנה שהוחלטו ע"י ההורה
1. Voice → Drive sync (מוצפן) ✅
2. PIN → משותף + 3 רמות-איפוס ✅
3. Cameo → אקראי 50/50 ✅
4. Solo parent → Cameo עדיין ✅

---

## CHG-009 | 2026-05-22 | ✅ הוטמע (P0-fixes מ-R-Design-1)
**מהות:** ביצוע 2 ה-P0-fixes שזיהה סבב-העיצוב R-Design-1 — חוסמי Phase 1.
**טריגר:** R-Design-1 (2026-05-19) נתן 🔴 OFF-BRAND; ההורה אישר ביצוע ב-2026-05-22 — בחר שהלוגו יציג את דמות-המסקוט (Brief #1.5 ייצר 2 גרסאות A/B), ואישר ADR-014.

**שינוי-עיקרי:**
- **Brief #1.5 — Logo Redux** נכתב ב-`docs/spec/CLAUDE-DESIGN-BRIEFS.md`: brief למסלול-B (claude.ai/design) שמורה לעצב לוגו חדש המאמץ את DNA של המסקוט. 2 גרסאות (A פורטרט-ראש / B מסקוט-מלא), 3 גדלים, מטמיע את ה-SVG של standing-wave כהפניה.
- **ADR-014 — Palette Extension + Semantic Layer** הוטמע ב-`tokens.css`: 3 primitive shade tokens + שכבת Layer 2 (11 tokens) + תיעוד 3 hex מקודדים-קשיח.

### סעיפים שהושפעו
- [x] `docs/spec/CLAUDE-DESIGN-BRIEFS.md` — Brief #1.5 חדש + שורה בטבלת-מסלולים
- [x] `design-mocks/shared/tokens.css` — ADR-014 (additive)
- [x] `docs/log/DECISIONS.md` — ADR-014 (תבנית-עשירה)
- [x] `docs/status/{PROGRESS,ROADMAP}.md` + `docs/_DASHBOARD.md` + `CLAUDE.md` — blocker מעודכן
- [x] `docs/log/CHANGELOG.md` — גרסה 0.6.4

### מצב חוסמים אחרי CHG-009
- ✅ ADR-014 — הוטמע. כבר לא חוסם Phase 1.
- ✅ Brief #1.5 — נמסר מ-claude.ai/design ושולב 2026-05-23 (Version B נבחר). ראה CHANGELOG 0.6.5 + ADR-015.

---

## CHG-011 | 2026-05-23 | ✅ הוטמע (Brief #4 — 12 avatars delivered Local-First)
**מהות:** Brief #4 (12 אווטארי-חיות) נמסר Local-First — אומץ ADR-011 בפועל לאווטארים.
**טריגר:** ההורה אישר Local-First אחרי הצלחת proof (ארנב + pose "מקשיב" של חכמוני).

**שינוי-עיקרי:**
- 12 SVG אווטאר ב-`assets/avatars/avatar-{01..12}-*.svg` — נכתבו ישירות ע"י Claude Code.
- 8 אושרו ע"י ההורה (ארנב, חתול, צפרדע, דוב, כלב, פרפר, רובוט, כוכב).
- 4 (אריה, פיל, ינשוף, דג) — איכות "מקובלת לבינתיים", נדחו ל-Phase 8 (BUG-002).
- ניסיון Brief #4.1 ב-claude.ai/design ל-4 הקשים — לא שיפר; הוחזר ל-Local-First.
- `design-mocks/04-avatars-preview.html` — תצוגת 12 לסקירה.
- `design-mocks/local-svg-proof/` — proof folder עם pose "מקשיב" + iteration history.
- ADR-016 — Avatar Palette Extension (12 רקעי-פסטל + 5 צבעי-גוף ייעודיים).

### סעיפים שהושפעו
- [x] `assets/avatars/` — 12 קבצי SVG חדשים
- [x] `design-mocks/04-avatars-preview.html` + `design-mocks/local-svg-proof/` — חדשים
- [x] `docs/spec/ASSETS.md` — סעיף אווטארים מלא
- [x] `docs/spec/CLAUDE-DESIGN-BRIEFS.md` — Brief #4.1 נוסף + טבלת-מסלולים מעודכנת
- [x] `docs/log/{DECISIONS,ISSUES,CHANGELOG}.md` — ADR-016, BUG-002, 0.6.6
- [x] `docs/status/{PROGRESS,ROADMAP}.md` + `docs/_DASHBOARD.md` + `CLAUDE.md` — Phase 0.5 → 60%

### וידוא-עקביות
- ✅ 12 SVGs ב-`assets/avatars/`, naming `avatar-NN-kind.svg`
- ✅ כל SVG עומד ב-Universal Constraints (אין script/foreignObject/handlers, viewBox 0 0 200 200, role + aria-label בעברית)
- ✅ צבעי-גוף הדמויות מהפלטה הראשית; צבעי הרחבה (פסטלים + חומים) מתועדים ב-ADR-016

---

## CHG-012 | 2026-05-23 | ✅ הוטמע (Briefs #3 + #5 — Welcome + Task + Celebration)
**מהות:** 2 ה-briefs האחרונים של Phase 0.5 נמסרו Local-First. Phase 0.5 → 100%.
**טריגר:** ההורה אישר מצב אוטונומי לכל Phase 0.5 + Phase 1; Claude Code מבצע ברצף עד R4.

**שינוי-עיקרי:**
- `design-mocks/02-welcome.html` — Brief #3 Welcome A/B (חמה-עשירה / מינימליסטית). 3 כרטיסי-פרופיל (יואב/מיה/חדש), מסקוט במרכז, ⚙ הגדרות-הורים.
- `design-mocks/11-task-click-balloons.html` — Brief #5 task screen (תבנית click-targets, 5 בלונים, header עם ⭐+🔊+🏠, שורת 3/5).
- `design-mocks/12-success-celebration.html` — Brief #5 celebration (חכמוני קופץ, "כל הכבוד!", +1⭐, primary/secondary buttons, 17 confetti).

### סעיפים שהושפעו
- [x] 3 design-mocks חדשים
- [x] CHANGELOG 0.6.7, PROGRESS/ROADMAP/CLAUDE.md/_DASHBOARD/TASKS — Phase 0.5 → 100%
- [x] חוסם-Phase-1 הוסר; ממתינים ל-R4

### הצעד הבא
- R4 Council Gate (Pre-Phase-1, lens-based) — סקירה רוחבית של Phase 0.5
- אם 🟢 GO → Phase 1 (שלד `src/` + פרופילים, יכלול CHG-005)

---

## CHG-013 | 2026-05-23 | 🟢 בעבודה (Phase 1 — שלד-יסוד)
**מהות:** התחלת Phase 1 — שלד הקוד הראשון של המשחק (foundation).
**טריגר:** R4 🟢 GO 4/4 PASS — Phase 1 פתוח רשמית.

**שינוי-עיקרי (מנת-יסוד 1/N):**
- `index.html` — entry point (מחליף את ה-placeholder של Phase 0.5)
- `styles/global.css` — מייבא את `tokens.css` כ-SSoT, בסיס RTL/פונטים
- `styles/components.css` — buttons, profile cards, screen layouts
- `src/storage.js` — localStorage wrapper, `chachmoni:*` prefix
- `src/browser-check.js` — feature + window-size detection
- `src/audio.js` — TTS he-IL 0.85 + speakOnHover (600ms delay)
- `src/ui/button.js` — factory חובה לכל כפתור (textContent only — security)
- `src/app.js` — state machine 12 מצבים + bootstrap

**נשאר ב-Phase 1:**
- `src/profiles.js` (CHG-005 — child + parent profiles, gender, PIN PBKDF2)
- `src/db.js` (IndexedDB — AES-GCM voice + photos)
- `src/photo-store.js` (magic-bytes validation + canvas → Blob)
- `src/backup.js` (export/import JSON)
- `src/ui/photo-uploader.js`, `src/ui/avatar-picker.js`
- `src/welcome.js` (first-run wizard + Fast-Path)
- מסכי-משחק אמיתיים (Welcome, Profile-Select, Profile-Create, PIN-Entry, World-Map)

### עקרונות-מפתח שמיושמים
- **tokens.css = SSoT:** `styles/global.css` מייבא דרך `@import` — קוד משתמש ב-Layer 2 semantic (ADR-014).
- **textContent חובה:** `ui/button.js` הוא ה-API היחיד לכפתורים. אסור innerHTML עם תוכן-ילד או AI.
- **Voice-first:** כל label בכפתור מוקרא ב-hover אחרי 600ms (`attachSpeakOnHover`).
- **min 80×80 לכל כפתור:** מ-R4 patch.

### סטטוס Phase 1
- שלד יסוד: ✅ (8 קבצים, ~600 שורות)
- פרופילים + IndexedDB: ⏳ בהמשך
- מסכי-משחק אמיתיים: ⏳ בהמשך
- **אומדן:** 8/15 קבצים = ~33% של Phase 1

### וידוא-עקביות
- ✅ tokens.css — שינוי additive בלבד; אף token קיים לא שינה ערך
- ✅ Brief #1.5 כולל הפניה ל-Universal Constraints + בלוק START/END PASTE
- ✅ ADR-014 נכתב בתבנית-העשירה (חובה מ-ADR-014 ואילך)
