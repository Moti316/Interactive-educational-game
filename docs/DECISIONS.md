# DECISIONS — ADR (Architecture Decision Records)

## ADR-001 | 2026-05-17 | Vanilla JS, ללא React/Vite
**החלטה:** Vanilla HTML/CSS/JS + ES Modules.  
**נימוק:** הילדים לא ייהנו יותר. הפיתוח מסתבך עם Node. ולא צריך build step.  
**אלטרנטיבות שנשללו:** React (overkill), Vue (overkill), Svelte (מעניין אבל compile required).

## ADR-002 | 2026-05-17 | localStorage + IndexedDB, ללא backend
**החלטה:** localStorage ל-state, IndexedDB ל-blob.  
**נימוק:** משחק לבית-אחד. אין צורך ב-DB. פרטיות מירבית.

## ADR-003 | 2026-05-17 | Local-only + PowerShell Launcher, ללא Vercel
**החלטה:** PowerShell `HttpListener` על `localhost:8080`.  
**נימוק:** משפחה אחת, מחשב אחד. אבטחה מירבית. file:// לא תומך ב-ES Modules + OAuth.

## ADR-004 | 2026-05-17 | Drive sync — קובץ פר-פרופיל (לא יחיד)
**החלטה:** `progress-{profileId}.json` בנפרד לכל ילד.  
**נימוק:** הורה יכול לשתף/לאפס פר-ילד. אין race-conditions בין-פרופילים.

## ADR-005 | 2026-05-17 | PIN — PBKDF2 + salt + 100K iterations
**החלטה:** לא SHA-256 פשוט (rainbow-table פותר).  
**נימוק:** המלצת agent-security ב-Council Round 1.

## ADR-006 | 2026-05-17 | AI generator — Phase 2 בלבד
**החלטה:** 50 משימות מובנות-מראש ב-MVP, אין שימוש API.  
**נימוק:** מספיק לחודש-חודשיים. עלות 0. אם נצטרך — Phase 2.

## ADR-007 | 2026-05-18 | אימוץ `ROADMAP.md` + צוות "מצפן"
**החלטה:** יצירת `docs/ROADMAP.md` כתוכנית-עבודה חיה (view של PLAN.md), ומקימים צוות "מצפן" (Compass) עם 2 סוכנים חדשים:
- 🗺️ **RoadmapKeeper** (`agent-roadmap-keeper`) — PM, custodian של ROADMAP
- 🛡️ **PhaseGatekeeper** (`agent-phase-gatekeeper`) — DoD verifier לפני Council

**נימוק:** PLAN.md (237KB) גדול מדי לשימוש-יום-יום. אין role ייעודי לאיתור drift planned-vs-actual. אין שער-DoD פורמלי לפני Council. ROADMAP + Compass פותרים את שלושת הפערים.
**מסמכים נלווים:** `TEAM-COMPASS.md`, `ROADMAP-CONTROL.md`.
**אלטרנטיבות שנשללו:** רק עדכון PROGRESS.md (לא מספיק structured), automation מבוסס cron (פרגיל, לא מאומת).

## ADR-008 | 2026-05-18 | פורמליזציה של "המועצה הגבוהה"
**החלטה:** מתן זהות פורמלית ל-9 חברי-המועצה — שמות תפקידיים באנגלית + משפט-תפקיד + פרופיל-עומק (השראה, אחריות, skills, קווים-אדומים).
**שמות:** SecurityAuditor, ChildUXAdvocate, AccessibilityInspector, HebrewLinguist, PerfBudgetEnforcer, CodeReviewer, IntegrationVerifier, QualityAssurance, CouncilChair.
**מסמך נלווה:** `docs/TEAM-COUNCIL.md`.
**נימוק:** דוחות-מועצה היו אנונימיים ("agent-security WARNING"). שמות תפקידיים = קריאות + דיון נעשה לבר-ביצוע ("בקש מ-SecurityAuditor לסקור"). פרופיל-עומק = כל סוכן יודע מה דומיין-הבלעדיות שלו והשראתו.
**אלטרנטיבות שנשללו:** שמות אישיים בעברית (פחות מתארים את התפקוד); שמות גנריים ("Agent-1"...).

## ADR-010 | 2026-05-19 | Universal Constraints ב-Briefs
**החלטה:** כל brief ב-`docs/CLAUDE-DESIGN-BRIEFS.md` חייב לכלול סעיף "Universal Constraints" לפני ה-TASK. הסעיף מגדיר חוקים שמועצה אכפה: Security (SVG XSS prevention), Accessibility (ARIA, contrast pairs), Performance (size budgets), Integration (viewBox, naming), Hebrew (forbidden words).

**נימוק:** בלי החוקים הללו, claude.ai יצור artifacts שייכשלו בבקרת-המועצה האחורית — בזבוז iteration. הוספת constraints לpre-flight מקצרת לoop "design → review → fix" ל-"review → design ראשון תקין".

**מסמך נלווה:** `docs/COUNCIL.md` Round 3.5 (הסבב שזיהה את הצורך).

**אכיפה:** PhaseGatekeeper בודק שכל artifact שמתקבל ב-Phase 0.5 עומד ב-constraints. אם לא — חזרה ל-claude.ai עם הdelta המסומן.

## ADR-009 | 2026-05-18 | פרוטוקול אישור-סיום-משימה
**החלטה:** אימוץ `docs/TASK-COMPLETION-PROTOCOL.md` שמגדיר:
- 5 סוגי משימות (Phase, Brief, Patch, Sub-task, Setup)
- מטריצת DoD פר-סוג
- שרשרת אימות (Verification Chain)
- 8 סוגי-מקרים שדורשים אישור-הורה (✋) vs. 5 שאוטומטיים (⚙️)
- פורמט-דיווח אחיד אליך
- שרשרת-תיעוד אוטומטית
- 22 תרחישי-קצה מקוטלגים

**נימוק:** "done" לא היה מוגדר באופן יחיד. הפרוטוקול מסיר אי-בהירות ומאפשר automation בטוח של דיווחים.