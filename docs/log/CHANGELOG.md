---
tags:
  - log
---

# CHANGELOG

כל השינויים-המשמעותיים בפרויקט.

## [0.9.0] - 2026-05-23 — Phase 3: 3 of 4 mouse templates done (CHG-015)

### Added
- **src/templates/double-click-reveal.js** — "double-click to open" template.
  Forgiving 600ms window (kids 4-6 struggle with the strict native dblclick).
  Treasure chests flip open to reveal an emoji.
- **src/templates/drag-drop-match.js** — "drag item to matching slot" template.
  Pointer-events based (works for both mouse and touch). Wrong drops bounce
  back with `is-wrong` shake animation. Correct drops snap and lock.
- 3 new tasks: `task-mouse-dblclick-treasures`, `task-mouse-dragdrop-animals`,
  `task-mouse-dragdrop-fruits`.
- `styles/components.css`: dblclick-grid/box + dnd-slots/items/item +
  shake animation reuse + reduced-motion overrides.

### Changed
- `src/app.js`: switch handles `double-click-reveal` and `drag-drop-match`.

### Skipped
- `right-click-menu` template — deferred (right-click + context-menu navigation
  is a hard gesture for kids 4-6; will revisit in Phase 8 polish if needed).

### Status
- **Phase 3 → ~75%** (3/4 templates done; right-click deferred).
- **7 tasks playable**: balloons, bubbles, hover-animals, hover-objects,
  dblclick-treasures, dragdrop-animals, dragdrop-fruits.

## [0.8.1] - 2026-05-23 — Phase 3 begins: hover-target + file:// fallback

### Fixed
- **index.html**: detects `location.protocol === 'file:'` and shows a
  Hebrew helper card pointing to `scripts/start-chachmoni.ps1`. Prevents
  the silent "blue background, nothing loads" state when the user opens
  the file directly instead of through the launcher (ES modules require
  HTTP origin).

### Added
- **src/templates/hover-target.js** — Phase 3 first template. Mystery
  boxes flip from "?" to emoji on hover; narrates the emoji name. Touch
  and keyboard fallbacks included.
- 2 new tasks: `task-mouse-hover-animals` + `task-mouse-hover-objects`.
- `styles/components.css`: hover-grid + hover-box flip-fade animation
  (respects `prefers-reduced-motion`).

### Changed
- `src/app.js`: switch handles `hover-target` template via shared
  task-complete / task-exit handlers.

### Notes
- Phase 3 → ~25% (1/4 templates done). Next: double-click-reveal,
  right-click-menu, drag-drop-match.
- **4 tasks playable now**: 2 click-targets (balloons, bubbles) + 2 hover-target.

## [0.8.0] - 2026-05-23 — Phase 2 opens: playable game loop end-to-end (CHG-014)

### Added
- **src/worlds.js** — world data (4 worlds: mouse/keyboard/window/browser) +
  `renderWorldMap` screen with user info, star count, home button, and 2×2 grid.
- **src/tasks.js** — task data registry. Phase 2 ships 2 click-targets tasks:
  `task-mouse-balloons` and `task-mouse-bubbles`.
- **src/templates/click-targets.js** — generic "click N targets" template.
  Renders header (stars/listen/home), title, balloons area (positioned by task
  config), and progress bar that fills as targets are clicked.
- **src/celebration.js** — celebration screen with mascot, headline,
  +stars indicator, "next" / "back-to-map" buttons, 17 static confetti.
- `styles/components.css`: ~170 lines for world-map / task / celebration /
  balloons / confetti.

### Changed
- **src/app.js** — wires complete game loop:
  WELCOME → WORLD_MAP → TASK → CELEBRATION → (next task or WORLD_MAP).
  On task complete: `profiles.markTaskComplete` + `addStars`.

### Status
- **The game is playable end-to-end.** Open `index.html` → first-run wizard
  (or pick profile) → world map (mouse unlocked) → balloons task → pop 5 →
  celebration → next task (bubbles) → repeat. Stars persist per profile.
- Phase 1: ~80% (deferred: db.js, photo-store.js, backup.js, photo-uploader.js —
  needed for parent voice/photos; not blocking gameplay).
- Phase 2: ~40% (template + 2 tasks + game loop ✓; need more templates +
  kids testing per CLAUDE.md DoD).

## [0.7.1] - 2026-05-23 — Phase 1: profile flow runnable (CHG-013 cont.)

### Added
- **src/profiles.js** — CRUD לפרופילי-ילד (CHG-005 v1: name + gender + avatar
  + stars + completedTasks). Active-profile tracking. Parent profiles + PIN
  + voice יבואו ב-CHG-005 v2.
- **src/ui/avatar-picker.js** — גריד 12 אווטארים לבחירה, hover-narrates שם.
- **src/welcome.js** — `renderWelcome` (מסך פתיחה — בחירת פרופיל) +
  `renderProfileCreate` (טופס יצירה: שם, מגדר, אווטאר). first-run flow.
- `styles/components.css`: ~140 שורות סטיילים חדשים — welcome screen, create
  wizard, gender options, avatar picker grid, error shake animation.

### Changed
- **src/app.js** — state machine מחובר: FIRST_RUN → ProfileCreate → WORLD_MAP
  (placeholder). WELCOME → ProfileSelect | NewProfile | OpenSettings.
  Placeholder לעולמות-מפה ו-PIN.

### Status
- **המשחק רץ** מ-`index.html`: מסך-פתיחה מציג פרופילים קיימים, כפתור "+חדש"
  מפעיל wizard, יצירת פרופיל ראשון אוטומטית ב-first-run. TTS עברי על hover.
- Phase 1: ~73% (11/15 קבצים). נשאר: `db.js`, `photo-store.js`, `backup.js`,
  `ui/photo-uploader.js`.

## [0.7.0] - 2026-05-23 — Phase 1 begins: foundation skeleton (CHG-013)

### Added
- **index.html** — production entry (replaces Phase 0.5 placeholder).
- **styles/global.css** — base styles, imports `tokens.css` as SSoT via
  `@import url("../design-mocks/shared/tokens.css")`.
- **styles/components.css** — buttons (primary/secondary/icon/parent-settings),
  profile cards (220×280), screen layouts. All built from tokens.
- **src/storage.js** — localStorage wrapper, `chachmoni:*` prefix.
- **src/browser-check.js** — feature + window-size detection (Hebrew warnings).
- **src/audio.js** — Hebrew TTS service (he-IL, rate 0.85, pitch 1.1):
  `speak()`, `stop()`, `attachSpeakOnHover()` with 600ms hover delay.
- **src/ui/button.js** — button factory (textContent only — no innerHTML),
  4 variants matching components.css; integrates speakOnHover.
- **src/app.js** — entry + 12-state state machine + bootstrap.

### Notes
- Foundation layer only — 8 of 15 Phase 1 files done. Next: CHG-005 profiles
  (child + parent), IndexedDB (AES-GCM voice + photos), photo store, backup,
  welcome wizard, real screens.
- Phase 1: 33% (foundation complete).

## [0.6.7] - 2026-05-23 — Briefs #3 + #5 delivered → Phase 0.5 complete (CHG-012)

### Added
- `design-mocks/02-welcome.html` — Brief #3 Welcome A/B (חמה-עשירה vs מינימליסטית).
  3 כרטיסי-פרופיל, מסקוט במרכז, כפתור-הגדרות-הורים בפינה.
- `design-mocks/11-task-click-balloons.html` — Brief #5 task screen (5 בלונים,
  header עם ⭐+🔊+🏠, שורת-התקדמות 3/5).
- `design-mocks/12-success-celebration.html` — Brief #5 celebration (חכמוני קופץ,
  "כל הכבוד!" 88px, +1⭐ 44px, primary/secondary buttons, 17 confetti).

### Notes
- **Phase 0.5 → 100%.** כל 5 ה-briefs נמסרו Local-First (#1.5, #2, #3, #4, #5).
- ממתינים ל-R4 (Pre-Phase-1 Council Gate) → Phase 1.

## [0.6.6] - 2026-05-23 — Brief #4 delivered: 12 avatars Local-First (CHG-011)

### Added
- **12 אווטארי-חיות** ב-`assets/avatars/avatar-{01..12}-*.svg`: ארנב · חתול · אריה ·
  פיל · צפרדע · ינשוף · דוב · כלב · דג · פרפר · רובוט · כוכב. שפה ויזואלית אחת
  עם פרופ' חכמוני (עיניים גדולות, סגנון flat, חיוך פשוט), כל אווטאר על רקע-פסטל ייחודי.
- **ADR-016** — Avatar Palette Extension (12 רקעי-פסטל + 5 צבעי-גוף ייעודיים,
  קטגוריה מבודדת מהפלטה הראשית).
- **BUG-002** ב-ISSUES — 4 אווטארים (אריה/פיל/ינשוף/דג) נדחו ל-Phase 8 לאחר 5
  איטרציות שלא הגיעו לרף.
- `design-mocks/04-avatars-preview.html` — תצוגת 12 לסקירת-הורה.
- `design-mocks/local-svg-proof/` — תיקיית proof עם pose "מקשיב" של חכמוני (Local-First proof).
- `docs/spec/CLAUDE-DESIGN-BRIEFS.md` — Brief #4.1 (4 redux ב-claude.ai/design) +
  עדכון טבלת-מסלולים.

### Changed
- אומץ Local-First כברירת-מחדל ל-Brief #4 (תואם ADR-011). Brief #4.1 (Bridge) ניסיון
  להחלפת 4 הקשים — לא שיפר; הוחזר ל-Local-First.

### Notes
- Phase 0.5 → 60%. Brief #3 (Welcome) ו-Brief #5 (Task+Celebration) נותרו לפני R4.

## [0.6.5] - 2026-05-23 — Brief #1.5 delivered: logo redux integrated

### Changed — Logo
- **Brief #1.5 (Logo Redux)** התקבל מ-claude.ai/design ושולב. הלוגו החדש מציג
  את דמות-המסקוט פרופ' חכמוני — פותר את כשל לוגו≠מסקוט (R-Design-1 OFF-BRAND).
- `assets/logo/active/{logo-hero,logo-medium,favicon}.svg` + `assets/icons/favicon.svg`
  הוחלפו ב-Version B (מסקוט-מלא) — נבחר ע"י ההורה.
- שתי גרסאות Brief #1.5 (A פורטרט-ראש, B מסקוט-מלא) נשמרו ב-`assets/logo/brief-1.5/`.
- לוגו Brief #1 (ינשוף לבנדר) — superseded; קבצים היסטוריים ב-`version-a/`, `version-b/`.

### Added
- `design-mocks/01-logo-redux-preview.html` — תצוגה מקדימה: 2 גרסאות × 3 גדלים × רקע לבן/שמיים.
- **ADR-015** — Logo Character Unification Policy (הלוגו חייב תמיד להציג את המסקוט).

### Notes
- Phase 0.5 → 50%. שני חוסמי-Phase-1 (Brief #1.5 + ADR-014) נסגרו.

## [0.6.4] - 2026-05-22 — Brief #1.5 + ADR-014 (R-Design-1 P0-fixes, CHG-009)

### Added
- **Brief #1.5 — Logo Redux** ב-`docs/spec/CLAUDE-DESIGN-BRIEFS.md`: brief למסלול-B
  (claude.ai/design) לעיצוב לוגו חדש המאמץ את DNA של המסקוט — פותר את כשל לוגו≠מסקוט
  שזיהה R-Design-1. 2 גרסאות A/B, 3 גדלים, מטמיע SVG-הפניה של standing-wave.

### Changed — Design Tokens (ADR-014)
- `tokens.css`: 3 primitive shade tokens חדשים — `--color-sky-dark` (#5BA8C4),
  `--color-orange-belly` (#FFA552), `--color-orange-dark` (#E8851A) — מתעדים צבעים
  שהמסקוט כבר השתמש בהם מחוץ לפלטה.
- `tokens.css`: שכבת **Layer 2 — Semantic** חדשה (11 tokens: `--color-text-primary`,
  `--color-bg-page`, `--color-character-body` ועוד).
- `tokens.css`: 3 hex מקודדים-קשיח (#FFCE10/#8E44AD/#0066CC) סומנו ב-`TODO (ADR-014)`.
- כל השינויים **additive** — אף token קיים לא שינה ערך.

### Notes
- CHG-009 ב-`docs/log/PLAN-CONTROL.md`. ADR-014 כבר לא חוסם Phase 1.
- חוסם שנותר: Brief #1.5 ממתין להרצת-הורה ב-claude.ai/design.

## [0.6.3] - 2026-05-22 — Docs reorganization + PLAN.md split (CHG-010 complete)

### Changed
- **P1-4:** 34 מסמכי `docs/` קובצו ל-7 תת-תיקיות לפי הטקסונומיה הקיימת
  (`status/ log/ process/ spec/ quality/ teams/ guides/`). `_DASHBOARD.md`
  ו-`_INDEX.md` נשארו בשורש כנקודות-כניסה. כל ההפניות (CLAUDE.md, .claude/,
  Obsidian canvas, 2 קבצי HTML) עודכנו ואומתו — קישורי `[[wikilink]]` לא הושפעו.
- **P0-1:** `PLAN.md` (4097 שורות, ~243KB) פוצל ל-8 קבצי `context/`. אומת
  byte-exact (md5 זהה). `PLAN.md` הפך אינדקס-ניווט.

### Notes
- CHG-010 הושלם במלואו (10/10) — 2 הפריטים שנדחו בוצעו בסשן-תשתית ממוקד.
- R-001 (PLAN.md מונוליטי) נסגר ב-`RISKS.md`.

## [0.6.2] - 2026-05-20 — Obsidian "control room"

### Added
- `docs/_DASHBOARD.md` — לוח-בקרה: מצב-פרויקט חי + קישורים-חמים + צעד-הבא.
- `project-map.canvas` — Obsidian Canvas: מפת-פרויקט חזותית (3 צוותים, Phases, מצב).
- `docs/guides/OBSIDIAN-GUIDE.md` — מדריך-שימוש בעברית להורה.
- **תגיות:** frontmatter `tags` ל-34 מסמכי `docs/` — טקסונומיה בת 7 קטגוריות
  (`#status #team #log #process #spec #quality #guide`) → מאפשר סינון ב-Obsidian.
- `docs/_INDEX.md` — קישורים ל-Dashboard / Canvas / Guide.

## [0.6.1] - 2026-05-20 — Folder relocation + Obsidian vault

### Changed — project relocated
- הפרויקט הועבר ל-`C:\Users\b0066820\Desktop\Claude project\Interactive-educational-game`.
- 5 נתיבים-קשיחים עודכנו (PLAN.md ×3, RESTORE-POINT.md ×2); נתיבים עם הרווח מצוטטים.
- git/remote/היסטוריה/ענף-גיבוי/תגית — לא הושפעו.

### Added — Obsidian vault
- `.obsidian/` — קונפיג vault: app.json (RTL + alwaysUpdateLinks), core-plugins
  (graph/backlink/canvas/...), appearance, graph, community-plugins.
- `docs/_INDEX.md` — Map of Content עם קישורי `[[wikilink]]`.
- `.gitignore` — סקציית Obsidian (מחריג רק UI-state תנודתי).

## [0.6.0] - 2026-05-20 — Infrastructure Upgrade (CHG-010, wall comparison)

### Context
ניתוח-השוואתי מול פרויקט wall/TodoWall זיהה דפוסים לאימוץ. ההורה אישר P0+P1+P2.
גם בוצע: גיבוי (ענף+תגית+`_backup/`) ועדכון ריפו `workspace-template` (wall+חכמוני).

### Added / Changed — 8/10 items
- **P0-2:** בלוק "מצב הפרויקט" חי בראש CLAUDE.md (מתעדכן סוף-סשן)
- **P1-1:** `docs/status/RISKS.md` — מרשם-סיכונים (7 סיכונים, בעלים+מיטיגציה)
- **P1-2:** `docs/log/AGENT-ACTIVITY-LOG.md` — יומן-הפעלות מרוכז
- **P1-3:** תבנית-ADR עשירה ב-DECISIONS.md (חובה מ-ADR-014)
- **P2-1:** מפות-תיאום בין-סוכנים ב-3 מסמכי-הצוות
- **P2-2:** סוכן חדש `cross-team-auditor` (Compass — 2→3 חברים; 18→19 sub-agents)
- **P2-3:** ADR-001–006 backfilled לתבנית-העשירה (תוכן אמיתי בלבד)
- **P2-4:** `.claude/agents/_agent-template.md` — תבנית-שלד לסוכן

### Deferred — 2/10 items (documented, not cancelled)
- **P1-4** (קיבוץ docs/ לתתי-תיקיות) ו-**P0-1** (פיצול PLAN.md 230KB) — נדחו לסשן
  ממוקד. סיבה: רפקטור-מבני גדול (274 הפניות-צולבות / קובץ 230KB) — סיכון לשבירה
  שקטה אם מבוצע בחיפזון. מתועד ב-CHG-010.

## [0.5.0] - 2026-05-19 — Design Studio Formalization (3rd Team)

### Added — Design Studio Team
ההורה זיהה אי-עקביות בין הלוגו (לבנדר, אבסטרקטי) למסקוט (תכלת, illustrated עם כובע). זיהה צורך בצוות-עיצוב ייעודי. ADR-013 + CHG-008 בתיעוד.

- **`docs/teams/TEAM-DESIGN.md`** — מסמך-מכונן חדש (Charter, 7 חברים, Workflow, Escalation, Activation Protocol)
- **7 קבצי agent חדשים ב-`.claude/agents/`:**
  - `agent-brand-identity.md` 🎭 (BrandIdentityArchitect — Saul Bass, Paula Scher, Studio Eitan Bartal השראה)
  - `agent-character-design.md` 🖼️ (CharacterIllustrator — Mary Blair, Mo Willems, Hervé Tullet)
  - `agent-color-palette.md` 🎨 (ColorPaletteEngineer — Josef Albers, Refactoring UI, Maria Montessori)
  - `agent-typography.md` 🔤 (TypographyMaster — Spiekermann, Yanek Iontef, Sara Soueidan)
  - `agent-design-system-arch.md` 🧬 (DesignSystemArchitect — Brad Frost, Jina Anne, Nathan Curtis)
  - `agent-motion-story.md` 🎬 (MotionStoryteller — Disney 12 principles, Val Head, Rachel Nabors)
  - `agent-design-chair.md` ⚖️ (DesignChair — Massimo Vignelli, Milton Glaser, Bruno Munari)
- **`CLAUDE.md`** — סעיף Sub-Agents עבר מ-11 ל-18 (3 צוותים: Council 9, Compass 2, Studio 7)
- **סדר-הפעלה חדש:** Studio (אסתטיקה) → Compass (DoD) → Council (איכות)
- **ADR-013** בDECISIONS.md — נימוק + אלטרנטיבות-שנשללו

### Coming Next — Stage B
- **R-Design-1 (Initial Audit)** — הסטודיו מתכנס לסבב-ראשון לסקור: לוגו, מסקוט, palette, tokens, fonts, mocks. דוח ב-`docs/log/DESIGN-AUDIT-R1.md`
- בעקבות הדוח: Brief #1.5 (לוגו חדש שמשתמש בדמות-המסקוט)

## [0.4.2] - 2026-05-19 — Logo RTL Bug Fix + Brief #2 → claude.ai/design canonical

### Fixed
- **BUG-001** — לוגו "חכמוני" עלה על איור-הינשוף בכל גדלי הלוגו (hero/medium). תוקן ב-7 קבצים: הוספת `direction="rtl"` ל-`<text>` + שינוי `text-anchor="end"` → `"start"`.
- Universal Constraints (R3.5) קיבלו patch: כל SVG `<text>` עברי חייב `direction="rtl"` — מונע הישנות BUG-001.

### Changed — Brief #2 Source
- 6 קבצי mascot ב-`assets/mascot/` הוחלפו לגרסת **claude.ai/design** (Bridge Protocol, אחרי R3.6 A/B comparison).
- 6 קבצי הגרסה המקומית של Claude Code (ADR-011) מארכבים ב-`assets/mascot/_archive-option-a/`.
- ASSETS.md עודכן עם metadata חדש (mortarboard + tassel + cheek-blush + ground shadow).
- ADR-011 (Local-First) **לא** שונה רשמית — נמתין ל-Brief #3 להחלטה.

## [0.4.1] - 2026-05-19 — Brief #2 Delivered + Local-First Design Path

### Delivered — Brief #2 (Mascot, 6 poses)
- 6 SVG ב-`assets/mascot/professor-chachmoni-*.svg`:
  - `standing-wave.svg` (1.63 KB) — מסך פתיחה
  - `pointing.svg` (1.62 KB) — מסכי-הסבר
  - `celebrating.svg` (2.19 KB) — חגיגת-הצלחה
  - `thinking.svg` (1.84 KB) — טעינה/רמז
  - `encouraging.svg` (1.85 KB) — אחרי טעות עדינה (R3.5)
  - `sleeping.svg` (1.84 KB) — inactivity
- כל הקבצים: viewBox 0 0 240 240, role="img", aria-label בעברית
- כל הקבצים עוברים Universal Constraints (R3.5) — 0 violations
- HTML preview: `design-mocks/01-mascot-preview.html`

### Added — ADR-011: Local-First Design Path
- Claude Code כותב SVG/HTML ישירות במקום הגשר ל-claude.ai
- Bridge Protocol (PLAN.md §1788) הופך fallback path
- CHG-007 ב-`docs/log/PLAN-CONTROL.md`
- מסמכי-בקרה מעודכנים: DECISIONS.md, CLAUDE-DESIGN-BRIEFS.md, PLAN.md, ROADMAP.md, PROGRESS.md, ASSETS.md

### Changed — Phase 0.5 Progress
- 30% → 40% (Brief #2 הושלם)
- ETA ל-MVP: 14–21 → 13–20 ימים (חיסכון של ~1 יום מ-Local-First)
- Active blocker עבר מ-"Briefs #2–5 (תלות-הורה)" ל-"אישור-ויזואלי ל-Brief #2 בלבד"

## [0.4.0] - 2026-05-19 — R3.5 Plan-Wide Re-Review

### Council Round 3.5 (Lens-based Synthesized Review)
- 17 רבדי-עיצוב-ו-UX נסקרו דרך 11-agent system המעודכן (post-`23b2aa3`)
- Synthesis ע"י CouncilChair → 8 P0 + 9 P1 patches = 17 patches יושמו
- 6 P2 → backlog ב-`ISSUES.md`
- תוצאה: 🟢 GO לשליחת Brief #2 המעודכן

### Added — Briefs Universal Constraints
- `docs/spec/CLAUDE-DESIGN-BRIEFS.md` — סעיף חדש "Universal Constraints" שחובה לכל brief:
  - Security (SecurityAuditor): אסור `<script>`/`<foreignObject>`/event handlers/external xlink:href ב-SVG
  - A11y (AccessibilityInspector): `role="img"` + `aria-label`, contrast pairs table
  - Performance (PerfBudgetEnforcer): SVG ≤8KB, אסור raster ב-SVG, אסור filters כבדים
  - Integration (IntegrationVerifier): viewBox חובה, naming convention kebab-case
  - Hebrew (HebrewLinguist): forbidden words רגשיים+טכניים
- Color contrast pairs table — 6 זוגות מאומתים + 1 אסור (white על coral 1.7:1)
- File naming convention — נתיבי-יעד מפורשים לכל brief

### Added — Brief Enhancements
- Brief #2 (Mascot): 5 → 6 poses (נוסף "encouraging")
- Brief #2: viewBox + aria-label + file size budget
- Brief #6 (Sound Design Spec) — stub חדש ל-Phase 8 ליטוש
- Brief #7 (World Map Mockup) — stub חדש ל-Phase 3

### Changed — Design Tokens
- `tokens.css`: `--color-coral` קיבל usage rule (רקע-בלבד, אסור טקסט עליו)
- `tokens.css`: High-Contrast mode עכשיו override גם `--btn-tertiary-text`, `--btn-tertiary-hover-bg`, `--btn-icon-bg`

### Changed — Skills
- `hebrew-narration.md`: מילון-אסור הורחב לרגשי-שלילי ("כשלת", "טעית", "לא נכון" וכו') + חלופות-מותרות
- `hebrew-narration.md`: gender field עבר מ-"אופציה" ל-"חובה" (תואם CHG-005). 3 ערכים: boy/girl/neutral
- `animation-choreography.md`: `prefers-reduced-motion` הורחב — Mascot bounce מבוטל לחלוטין, Hint pulse → outline סטטי, Drive-sync rotation → opacity-pulse

### Documentation
- `docs/log/COUNCIL.md`: Round 3.5 entry מלא (17 patches מתועדים)
- `docs/log/DECISIONS.md`: ADR-010 (Universal Constraints כפרוטוקול)
- `docs/status/ROADMAP.md`: 2 drift log entries (R3.5 + DoD update)
- `docs/status/PROGRESS.md`: Last Council + Last DoD-verified עודכנו

## [0.3.0] - 2026-05-18 — Identities Formalized

### Added — צוות "מצפן" (Compass)
- `docs/teams/TEAM-COMPASS.md` — מסמך-זהות של צוות הניווט
- `docs/status/ROADMAP.md` — תוכנית-עבודה חיה (single source-of-truth תפעולי)
- `docs/process/ROADMAP-CONTROL.md` — חוקי שינוי ROADMAP
- `docs/process/TASK-COMPLETION-PROTOCOL.md` — מתי משימה "done" + פורמט-דיווח
- `.claude/agents/agent-roadmap-keeper.md` — 🗺️ RoadmapKeeper (Lead PM)
- `.claude/agents/agent-phase-gatekeeper.md` — 🛡️ PhaseGatekeeper (DoD verifier)
- `.claude/skills/roadmap-tracking.md` — פרוטוקול-מעקב משותף

### Added — פורמליזציה של "המועצה הגבוהה" (High Council)
- `docs/teams/TEAM-COUNCIL.md` — מסמך-זהות של המועצה (9 חברים בשמות תפקידיים)
- שמות חדשים: SecurityAuditor, ChildUXAdvocate, AccessibilityInspector, HebrewLinguist, PerfBudgetEnforcer, CodeReviewer, IntegrationVerifier, QualityAssurance, CouncilChair

### Changed
- 9 קבצי `.claude/agents/agent-*.md` קיבלו שכבת-זהות (שם תפקיד, משפט-תפקיד, השראה, תחומי-אחריות מורחבים, Skills mapping, קווים-אדומים, Triggers)
- `CLAUDE.md` — רשימת 11 sub-agents + סעיף "הצוותים שלנו" + הוראת תחילת-סשן
- `docs/status/PROGRESS.md` — header עם "Next Gate" + "Last DoD-verified"
- `docs/log/COUNCIL.md` — header עם קישור ל-TEAM-COUNCIL + שמות חדשים ב-R1/R2/R3
- `docs/status/TASKS.md` — קישור-עליון ל-ROADMAP ול-TASK-COMPLETION-PROTOCOL
- `docs/log/DECISIONS.md` — ADR-007 (Compass), ADR-008 (Council identities), ADR-009 (completion protocol)

### Skills Mapping (חדש)
SecurityAuditor מקבל 9 skills (security-kids + 7 tm-* + security-review + deep-research) להעצמה בפלילי אבטחה / threat modeling.
שאר 10 הסוכנים מקבלים skills מתאימים לתפקידם (mermaid ל-RoadmapKeeper, tm-verify ל-PhaseGatekeeper, וכו').

## [Unreleased] - בעבודה

### Added
- Phase 0: תשתית מלאה
  - מבנה תיקיות (26 directories)
  - 5 custom skills ב-.claude/skills/
  - 9 sub-agents ב-.claude/agents/
  - tokens.css + base.css (design system)
  - 24 קבצי MD ב-docs/
  - 6 PowerShell scripts (start-chachmoni, git-sync, ...)
  - .gitignore מורחב
  - CLAUDE.md + CLAUDE-DESIGN-BRIEFS.md

## [0.0.1] - 2026-05-17

### Added
- תכנון מלא ב-PLAN.md (~230KB)
- 2 סבבי Council review (40+ patches)
- ריפו GitHub מחובר