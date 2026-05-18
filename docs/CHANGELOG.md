# CHANGELOG

כל השינויים-המשמעותיים בפרויקט.

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