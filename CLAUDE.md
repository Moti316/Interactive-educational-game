# CLAUDE.md — הוראות לClaude Code לפרויקט "חכמוני"

## הקשר במשפט אחד

משחק דפדפן בעברית ללימוד יסודות המחשב לילדים בני 4–6 שעדיין לא קוראים. **Voice-first** מלא: כל טקסט מוקרא.

## איפה מתחילים בכל סשן

1. **קרא את `docs/ROADMAP.md`** — תוכנית-עבודה חיה: Phase נוכחי, Next Gate, ETA.
2. **קרא את `docs/PROGRESS.md`** — סטטוס בזמן-אמת של כל שלב.
3. **קרא את `docs/TASKS.md`** — מה הושלם, מה בעבודה, מה נשאר.
4. **קרא את `docs/ISSUES.md`** — באגים פתוחים.
5. אם צריך הקשר על הצוותים — `docs/TEAM-COMPASS.md` + `docs/TEAM-COUNCIL.md`.
6. אם צריך הקשר על תהליך אישור-סיום — `docs/TASK-COMPLETION-PROTOCOL.md`.
7. אם צריך הקשר עמוק יותר — `PLAN.md` (התכנון המלא, ~230KB).

## עקרונות קוד פר-פרויקט (קריטיים — לא לעבור!)

- **עברית בכל הטקסטים** הגלויים למשתמש. RTL.
- **כל טקסט גלוי חייב להיות מוקרא** — שני הילדים לא קוראים.
- **קצב TTS: 0.85**, `lang: 'he-IL'`.
- **Hover על כל אלמנט-טקסט = הקראה אחרי 600ms.**
- **כפתורים min 80×80px**, צבעים רוויים, פינות מעוגלות.
- **Vanilla JS / ES Modules** — בלי build step, בלי React, בלי npm.
- **רץ דרך PowerShell Launcher** (`scripts/start-chachmoni.ps1` על `localhost:8080`) — לא file://.
- **כל כפתור עובר דרך `src/ui/button.js`** — לא ליצור כפתורים ידנית.
- **NEVER innerHTML** עם user/AI input — תמיד `textContent` / `createElement`. DOMPurify ל-AI output.
- **localStorage prefix:** `chachmoni:*` (לא `mouse-school:*`).
- **Drive schema:** פר-פרופיל (`progress-{profileId}.json`, לא קובץ-יחיד).
- **קונבנציות שמות משימות:** `task-{worldId}-{kebab-skill-name}` (למשל `task-mouse-balloons`).

## Skills + Sub-Agents

### Skills מותאמים-לפרויקט (`.claude/skills/`)
- `kids-game.md` — כללי (RTL, TTS עברי, a11y, naming)
- `kids-qa.md` — QA Checklist לבדיקה עם ילדים
- `security-kids.md` — PIN, OAuth, scope drive.file, XSS prevention
- `hebrew-narration.md` — 7 כללי-כתיבה + בנק-משפטים + מילון-אסור
- `animation-choreography.md` — easing, durations, choreography

### Skills מובנים — בעת-צורך
- `security-review` — אחרי כל שלב OAuth/PIN/Drive
- `review` — אחרי בנייה של שלב
- `simplify` — סקירה תקופתית
- `design` + `ui-ux-pro-max` + `design-system`
- `claude-api` — Phase 2 (AI generator)
- `fewer-permission-prompts`, `update-config`

### הצוותים שלנו — 18 Sub-Agents (3 צוותים)

#### ⚖️ המועצה הגבוהה (High Council) — 9 חברים
פוסקת **איכות** בסיום כל שלב-בנייה. ראה [`docs/TEAM-COUNCIL.md`](./docs/TEAM-COUNCIL.md).

| 🎭 | שם תפקיד | קוד |
|----|-----------|------|
| 🛡️ | **SecurityAuditor** | `agent-security` |
| 👶 | **ChildUXAdvocate** | `agent-ux-kid` |
| ♿ | **AccessibilityInspector** | `agent-a11y` |
| 🇮🇱 | **HebrewLinguist** | `agent-hebrew` |
| ⚡ | **PerfBudgetEnforcer** | `agent-performance` |
| 🔍 | **CodeReviewer** | `agent-code-review` |
| 🔗 | **IntegrationVerifier** | `agent-integration` |
| 🧪 | **QualityAssurance** | `agent-qa` |
| ⚖️ | **CouncilChair** | `agent-council-chair` (יו"ר) |

#### 🧭 מצפן (Compass) — 2 חברים
מורה **כיוון** — מוודא שאנחנו במסלול. ראה [`docs/TEAM-COMPASS.md`](./docs/TEAM-COMPASS.md).

| 🎭 | שם תפקיד | קוד |
|----|-----------|------|
| 🗺️ | **RoadmapKeeper** | `agent-roadmap-keeper` (PM) |
| 🛡️ | **PhaseGatekeeper** | `agent-phase-gatekeeper` (DoD verifier) |

#### 🎨 סטודיו-העיצוב (Design Studio) — 7 חברים
פוסק **אסתטיקה ומותג** — האם זה יפה ומגובש? ראה [`docs/TEAM-DESIGN.md`](./docs/TEAM-DESIGN.md).

| 🎭 | שם תפקיד | קוד |
|----|-----------|------|
| 🎭 | **BrandIdentityArchitect** | `agent-brand-identity` |
| 🖼️ | **CharacterIllustrator** | `agent-character-design` |
| 🎨 | **ColorPaletteEngineer** | `agent-color-palette` |
| 🔤 | **TypographyMaster** | `agent-typography` |
| 🧬 | **DesignSystemArchitect** | `agent-design-system-arch` |
| 🎬 | **MotionStoryteller** | `agent-motion-story` |
| ⚖️ | **DesignChair** | `agent-design-chair` (יו"ר) |

**הפעלה:**
- **מועצה** — בסיום כל Phase (Full Council תחת מנוי Max)
- **מצפן** — אוטומטית אחרי כל סבב + סיום-Phase, או on-demand
- **סטודיו** — לפני שילוב נכס-עיצובי לפרויקט (R-Design-N); סבב R-Design-1 ראשון אחרי הקמת-הצוות

**סדר-הפעלה:** Studio (אסתטיקה) → Compass (DoD) → Council (איכות).

## עדכון תיעוד תוך כדי עבודה

אחרי כל שינוי משמעותי — עדכן את הקובץ הרלוונטי ב-`docs/`:
- באג נמצא/תוקן → `docs/ISSUES.md`
- החלטה משמעותית → `docs/DECISIONS.md`
- שינוי-תכנון → `docs/PLAN-CONTROL.md` (עם בדיקת-עקביות)
- משימה חדשה → `docs/CONTENT.md` + `docs/NARRATION.md` + `docs/TASKS.md`
- ארכיטקטורה השתנתה → `docs/ARCHITECTURE.md`
- בדיקה עם ילדים → `docs/KIDS-FEEDBACK.md`
- דוח-מועצה בסיום-שלב → `docs/COUNCIL.md`
- **סוף כל סשן** → `docs/PROGRESS.md` (חובה!)

## פקודות נפוצות

```powershell
# הרצה מקומית
powershell -File scripts/start-chachmoni.ps1

# סנכרון ידני
powershell -File scripts/git-sync.ps1

# בדיקת ניגודיות
powershell -File scripts/check-contrast.ps1

# Lighthouse audit
powershell -File scripts/audit.ps1
```

## מה לא לעשות

- אל תוסיף תלות חיצונית (npm package) בלי דיון.
- אל תיצור backend/server-side — הכל סטטי.
- אל תפנה לילדים בטקסט אנגלי.
- אל תוסיף טיימרים/שעוני-לחץ במשחקים.
- אל תוסיף "מסכי כישלון" — רק "ננסה שוב" עם חיוך.
- אל תכתוב טקסט קריינות בלי לבדוק נגד **מילון-אסור** (ראה `docs/STYLE-GUIDE.md`).
- אל תשתמש ב-`innerHTML` עם תוכן-משתמש או AI.
- אל תשמור secrets בקוד (API keys, PINs בclear) — תמיד hash/env.

## מקור התכנון

`PLAN.md` הוא המקור-המלא. אחרי 2 סבבי-מועצה ו-~40 patches, התכנון מאושר לביצוע (3 PASS, 5 WARNING ב-Round 2 — כולן non-blocking).
