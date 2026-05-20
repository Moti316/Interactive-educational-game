# CHANGELOG

כל השינויים-המשמעותיים בפרויקט.

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
- **P1-1:** `docs/RISKS.md` — מרשם-סיכונים (7 סיכונים, בעלים+מיטיגציה)
- **P1-2:** `docs/AGENT-ACTIVITY-LOG.md` — יומן-הפעלות מרוכז
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

- **`docs/TEAM-DESIGN.md`** — מסמך-מכונן חדש (Charter, 7 חברים, Workflow, Escalation, Activation Protocol)
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
- **R-Design-1 (Initial Audit)** — הסטודיו מתכנס לסבב-ראשון לסקור: לוגו, מסקוט, palette, tokens, fonts, mocks. דוח ב-`docs/DESIGN-AUDIT-R1.md`
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
- CHG-007 ב-`docs/PLAN-CONTROL.md`
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
- `docs/CLAUDE-DESIGN-BRIEFS.md` — סעיף חדש "Universal Constraints" שחובה לכל brief:
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
- `docs/COUNCIL.md`: Round 3.5 entry מלא (17 patches מתועדים)
- `docs/DECISIONS.md`: ADR-010 (Universal Constraints כפרוטוקול)
- `docs/ROADMAP.md`: 2 drift log entries (R3.5 + DoD update)
- `docs/PROGRESS.md`: Last Council + Last DoD-verified עודכנו

## [0.3.0] - 2026-05-18 — Identities Formalized

### Added — צוות "מצפן" (Compass)
- `docs/TEAM-COMPASS.md` — מסמך-זהות של צוות הניווט
- `docs/ROADMAP.md` — תוכנית-עבודה חיה (single source-of-truth תפעולי)
- `docs/ROADMAP-CONTROL.md` — חוקי שינוי ROADMAP
- `docs/TASK-COMPLETION-PROTOCOL.md` — מתי משימה "done" + פורמט-דיווח
- `.claude/agents/agent-roadmap-keeper.md` — 🗺️ RoadmapKeeper (Lead PM)
- `.claude/agents/agent-phase-gatekeeper.md` — 🛡️ PhaseGatekeeper (DoD verifier)
- `.claude/skills/roadmap-tracking.md` — פרוטוקול-מעקב משותף

### Added — פורמליזציה של "המועצה הגבוהה" (High Council)
- `docs/TEAM-COUNCIL.md` — מסמך-זהות של המועצה (9 חברים בשמות תפקידיים)
- שמות חדשים: SecurityAuditor, ChildUXAdvocate, AccessibilityInspector, HebrewLinguist, PerfBudgetEnforcer, CodeReviewer, IntegrationVerifier, QualityAssurance, CouncilChair

### Changed
- 9 קבצי `.claude/agents/agent-*.md` קיבלו שכבת-זהות (שם תפקיד, משפט-תפקיד, השראה, תחומי-אחריות מורחבים, Skills mapping, קווים-אדומים, Triggers)
- `CLAUDE.md` — רשימת 11 sub-agents + סעיף "הצוותים שלנו" + הוראת תחילת-סשן
- `docs/PROGRESS.md` — header עם "Next Gate" + "Last DoD-verified"
- `docs/COUNCIL.md` — header עם קישור ל-TEAM-COUNCIL + שמות חדשים ב-R1/R2/R3
- `docs/TASKS.md` — קישור-עליון ל-ROADMAP ול-TASK-COMPLETION-PROTOCOL
- `docs/DECISIONS.md` — ADR-007 (Compass), ADR-008 (Council identities), ADR-009 (completion protocol)

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