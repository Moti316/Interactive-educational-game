# CHANGELOG

כל השינויים-המשמעותיים בפרויקט.

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