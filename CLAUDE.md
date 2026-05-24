# CLAUDE.md — הוראות לClaude Code לפרויקט "חכמוני"

## הקשר במשפט אחד

משחק דפדפן בעברית ללימוד יסודות המחשב לילדים בני 4–6 שעדיין לא קוראים. **Voice-first** מלא: כל טקסט מוקרא.

## מצב הפרויקט

> בלוק חי. **מתעדכן בסוף כל סשן** (חוק 3 ב"פרוטוקול ביצוע"). מאפשר לסשן הבא לדעת מאיפה להמשיך.
> אומץ מפרויקט wall (CHG-010). פירוט מלא תמיד ב-`docs/status/PROGRESS.md`.

- **Phase נוכחי:** 3 — תבניות עכבר (3/4: hover + double-click + drag-drop ✓; right-click נדחה)
- **נתיב הפרויקט:** `C:\Users\b0066820\Desktop\Claude project\Interactive-educational-game` (הועבר 2026-05-20).
- **משימה אחרונה שהושלמה:** Phase 3 — 3 תבניות (hover/double-click/drag-drop) + 5 משימות חדשות + file:// fix ב-index.html (CHG-015). 7 משימות פלייבליות. v0.9.0.
- **המשימה הבאה:** Phase 4 (Drive sync — דורש OAuth setup ממך), או Phase 5 (תבניות מקלדת), או הוספת תוכן (Phase 7). וגם: **בדיקת-ילדים** ל-DoD של Phase 2+3.
- **חוסם:** אין.
- **עדכון אחרון:** 2026-05-23.

## איפה מתחילים בכל סשן

1. **קרא את `docs/status/ROADMAP.md`** — תוכנית-עבודה חיה: Phase נוכחי, Next Gate, ETA.
2. **קרא את `docs/status/PROGRESS.md`** — סטטוס בזמן-אמת של כל שלב.
3. **קרא את `docs/status/TASKS.md`** — מה הושלם, מה בעבודה, מה נשאר.
4. **קרא את `docs/log/ISSUES.md`** — באגים פתוחים.
5. אם צריך הקשר על הצוותים — `docs/teams/TEAM-COMPASS.md` + `docs/teams/TEAM-COUNCIL.md`.
6. אם צריך הקשר על תהליך אישור-סיום — `docs/process/TASK-COMPLETION-PROTOCOL.md`.
7. אם צריך הקשר עמוק יותר — `PLAN.md` (אינדקס) → 8 קבצי `context/` (התכנון המלא).

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

### הצוותים שלנו — 19 Sub-Agents (3 צוותים)

#### ⚖️ המועצה הגבוהה (High Council) — 9 חברים
פוסקת **איכות** בסיום כל שלב-בנייה. ראה [`docs/teams/TEAM-COUNCIL.md`](./docs/teams/TEAM-COUNCIL.md).

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
מורה **כיוון** — מוודא שאנחנו במסלול. ראה [`docs/teams/TEAM-COMPASS.md`](./docs/teams/TEAM-COMPASS.md).

| 🎭 | שם תפקיד | קוד |
|----|-----------|------|
| 🗺️ | **RoadmapKeeper** | `agent-roadmap-keeper` (PM) |
| 🛡️ | **PhaseGatekeeper** | `agent-phase-gatekeeper` (DoD verifier) |
| 🔗 | **CrossTeamAuditor** | `agent-cross-team-auditor` (gap auditor) |

#### 🎨 סטודיו-העיצוב (Design Studio) — 7 חברים
פוסק **אסתטיקה ומותג** — האם זה יפה ומגובש? ראה [`docs/teams/TEAM-DESIGN.md`](./docs/teams/TEAM-DESIGN.md).

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

## פרוטוקול ביצוע (Execution Protocol)

### חוק 1 — כל החלטה-מאושרת חובה לתעד

לכל החלטה שההורה אישר במהלך סשן — תיעוד-חובה לפני המעבר למשימה הבאה:

| סוג החלטה | יעד-תיעוד | פורמט |
|------------|-----------|--------|
| ארכיטקטורה / יסוד | `docs/log/DECISIONS.md` | ADR-NNN |
| שינוי-תכולה / תהליך | `docs/log/PLAN-CONTROL.md` | CHG-NNN |
| באג ותיקון | `docs/log/ISSUES.md` | BUG-NNN |
| סבב-מועצה | `docs/log/COUNCIL.md` | R-N |
| סבב-סטודיו | `docs/log/DESIGN-AUDIT-R*.md` | R-Design-N |
| שינוי-נכס | `docs/spec/ASSETS.md` | inline section |
| Phase / drift | `docs/status/PROGRESS.md` + `ROADMAP.md` | header fields + drift log |
| Version bump | `docs/log/CHANGELOG.md` | semver entry |
| הוראת-ביצוע חוזרת | `CLAUDE.md` (כאן) + protocol doc ב-`docs/` | sub-section + standalone doc |
| **סוף כל סשן** | `docs/status/PROGRESS.md` | חובה! |

**הכלל:** אם הוצאת ADR/CHG/BUG בלי לעדכן את הקובץ — המשימה לא הושלמה.

### חוק 2 — Auto-Push ל-GitHub בסיום כל משימה-לוגית

> **🌳 מדיניות ענף-יחיד (single-branch):** כל העבודה תמיד על `main`, וכל push
> תמיד `git push origin main`. **אין feature branches, אין PRs.** כל הקבצים
> ממוזגים ישירות ל-main. החריג **היחיד**: ענפי-גיבוי (`backup/*`) — קפואים
> בכוונה כנקודות-שחזור, **לא ממוזגים** ל-main לעולם.

בסיום כל **משימה-לוגית** (לא בסוף כל edit), מבוצע:
1. `git status --short` — בדיקת-מצב
2. `git add -A` — staging (או רשימה ממוקדת אם יש קבצים-לא-לדחוף)
3. `git commit` עם תיאור מובנה (תבנית-זהב ב-[`docs/process/GIT-SYNC-PROTOCOL.md`](./docs/process/GIT-SYNC-PROTOCOL.md))
4. `git push origin main`

**משימה-לוגית = ?** ראה [`docs/process/GIT-SYNC-PROTOCOL.md`](./docs/process/GIT-SYNC-PROTOCOL.md) סעיף 1. תקציר:
- ✅ Brief שהסתיים, BUG-fix, ADR/CHG מיושם, סבב-מועצה, סיום-Phase, פעולת-תשתית
- ❌ עריכה-בודדת באמצע משימה, plan mode, exploration, work-in-progress

**שפה:** הודעת-commit באנגלית (GitHub Search לא טוב עם עברית).

**אם push נכשל:** `git pull --rebase` → resolve → push שוב. לא להיכנע ל-`--force` בלי אישור-הורה.

### חוק 3 — סוף-סשן

בסוף כל סשן (לפני שההורה סוגר את הטרמינל):
1. `docs/status/PROGRESS.md` מעודכן (Phase, blocker, next-action)
2. הכל-pushed לפי חוק 2
3. אם חצינו Phase או הסכמנו על Brief חדש → מעדכן `docs/status/ROADMAP.md`

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
- אל תכתוב טקסט קריינות בלי לבדוק נגד **מילון-אסור** (ראה `docs/spec/STYLE-GUIDE.md`).
- אל תשתמש ב-`innerHTML` עם תוכן-משתמש או AI.
- אל תשמור secrets בקוד (API keys, PINs בclear) — תמיד hash/env.

## מקור התכנון

התכנון המלא מפוצל ל-8 קבצים תחת `context/`; `PLAN.md` הוא אינדקס-ניווט. `context/` הוא מקור-האמת. אחרי 2 סבבי-מועצה ו-~40 patches, התכנון מאושר לביצוע (3 PASS, 5 WARNING ב-Round 2 — כולן non-blocking).
