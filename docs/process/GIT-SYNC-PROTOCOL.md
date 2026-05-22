---
tags:
  - process
---

# GIT-SYNC-PROTOCOL — פרוטוקול סנכרון ל-GitHub

> **תוקף:** מ-2026-05-19 (אחרי commit `e89ba95`).
> **בסיס:** ההחלטה של ההורה לאמץ "push בסיום כל משימה-לוגית" כברירת-מחדל.
> **עדכון 2026-05-20:** מדיניות ענף-יחיד עוגנה (סעיף 0).

---

## 0. מדיניות ענף — single-branch

- **כל העבודה על `main`.** כל push: `git push origin main`. אין feature
  branches, אין Pull Requests — כל הקבצים ממוזגים ישירות ל-main.
- **חריג יחיד:** ענפי-גיבוי בתבנית `backup/*` (לדוגמה
  `backup/pre-infra-upgrade-2026-05-20`). אלה **קפואים בכוונה** כנקודות-שחזור.
  לעולם לא ממזגים אותם ל-main; לא מוחקים אותם.
- החלטת-הורה (2026-05-20): "כל העלה לגיט מרגע זה תמיד יהיה ל-MAIN".

---

## 1. הגדרת "משימה-לוגית"

יחידת-עבודה שראויה ל-commit + push:

| ✅ משימה-לוגית | ❌ לא משימה-לוגית |
|----------------|-------------------|
| תיקון-באג שהושלם (BUG-NNN closed ב-ISSUES.md) | עריכת-קובץ-בודדת תוך כדי משימה |
| Brief שהסתיים (כל הקבצים נוצרו + תועדו) | בדיקת/קריאת-קבצים (read-only) |
| ADR שיושם במלואו (ADR-NNN + תיעוד נלווה) | שאלות-הבהרה למשתמש |
| CHG שיושם (CHG-NNN + סעיפים מושפעים מעודכנים) | תכנון / Plan Mode |
| סבב-מועצה שהסתיים (R-N עם דוח-יו"ר) | עבודה-בתהליך שלא הושלמה |
| סיום-Phase | בדיקות-ניסיון שנכשלו (נכשל = לא לדחוף) |
| פעולת-תשתית גדולה (הקמת-צוות, פתיחת-מסלול) | שינוי-הגדרות מקומי (settings.local.json) |

**כלל-אצבע:** אם משהו השתנה במצב-העולמי של הפרויקט בצורה ראויה-לשחזור — push. אם זה work-in-progress או exploration — לא.

---

## 2. תהליך-Push סטנדרטי (4 שלבים)

### Step 1 — בדיקת-מצב
```powershell
git status --short
```
לוודא:
- אילו קבצים השתנו / נוצרו
- אין secrets שדלפו (API keys, PIN בclear)
- אין קבצים שלא ראויים (logs, .env, builds)

### Step 2 — Staging
```powershell
git add -A    # ברירת-מחדל ל-Claude Code: רוב הקבצים רלוונטיים
```
או, אם רוצים סינון:
```powershell
git add docs/ assets/ src/ .claude/agents/ CLAUDE.md
```

### Step 3 — Commit עם תיאור מובנה
```powershell
git commit -m @'
<type>: <one-line summary in English>

<paragraph 1: what was done — bulleted list>

<paragraph 2: why / context — what triggered this>

<paragraph 3: cross-refs — ADR-NNN, CHG-NNN, BUG-NNN, R-N>
'@
```

**Type prefixes** (כמו Conventional Commits):
- `feat:` — פיצ'ר / יכולת חדשה
- `fix:` — תיקון-באג
- `docs:` — שינויי תיעוד-בלבד
- `refactor:` — שינוי-מבנה בלי שינוי-התנהגות
- `chore:` — תחזוקה (build, scripts)
- `style:` — עיצוב חזותי בלבד
- `perf:` — שיפור-ביצועים

**שפה:** אנגלית (GitHub Search לא טוב עם עברית).

### Step 4 — Push
```powershell
git push origin main
```

אם יש שגיאה (rejected — non-fast-forward):
```powershell
git pull --rebase origin main
# resolve conflicts if any
git push origin main
```

---

## 3. גרסה אוטומטית — `scripts/git-sync.ps1`

קיים סקריפט `scripts/git-sync.ps1` שמבצע את כל 4 השלבים כפעולה-אחת:

```powershell
powershell -File scripts/git-sync.ps1 -Action sync -Message "feat: ..."
```

**ההבדל:** הסקריפט משתמש ב-`git add` עם רשימה מפורשת של תיקיות (Patch #13 — מונע push של secrets). ל-Claude Code הוא שימושי לסשנים-מהירים, אבל ל-commits גדולים עדיף תהליך-ידני עם הודעה מותאמת.

---

## 4. הודעת-Commit — תבנית-זהב

```
feat: Design Studio team + Brief #2 mascot + BUG-001 logo fix

ADR-013: Design Studio formalization (3rd team, 7 sub-agents)
- docs/teams/TEAM-DESIGN.md (Charter + 7 members + Workflow)
- 7 agent system prompts: brand-identity, character-design, color-palette,
  typography, design-system-arch, motion-story, design-chair
- CLAUDE.md: 11 -> 18 sub-agents across 3 teams (Council/Compass/Studio)

Brief #2 (Mascot 6 poses) - Delivered via claude.ai/design
- 6 SVGs in assets/mascot/ (1.27-1.93 KB each)
- R3.6 A/B comparison: Option B selected

BUG-001: Hebrew SVG <text> RTL rendering fix
- 7 logo files + 1 HTML: text-anchor end -> start + direction=rtl

Phase 0.5: 30% -> 40% (Brief #2 done; Briefs #3-5 next)
Docs: ADR-011/013, CHG-007/008, COUNCIL R3.6, CHANGELOG 0.4.1/0.4.2/0.5.0
```

**מבנה:**
1. **שורה ראשונה** — `type: summary` (≤72 chars)
2. **שורה ריקה**
3. **פסקה לכל "קונסרן" — בולטים**
4. **שורה אחרונה** — cross-refs (ADR/CHG/BUG/R/CHANGELOG numbers)

---

## 5. תרחישי-קצה

### A. Conflict ב-pull
ההורה לא יעבוד מ-2 מחשבים בו-זמנית, אבל למקרה: `.git\SYNC_CONFLICT` flag נוצר ע"י `git-sync.ps1`. אם זה מופיע — Claude Code חוסם עד פתרון-ידני.

### B. Push נכשל בגלל permissions
- ההורה צריך לוודא Git Credentials Manager עובד.
- אם נכשל — Claude Code מודיע ודוחה למחזור-הבא.

### C. שינוי-קונפיגורציה (.claude/settings.local.json)
- **לא ל-push.** הקובץ הזה מקומי בלבד. נוסף ל-`.gitignore` אם לא כבר.

### D. Secrets בטעות
- אם Claude Code מזהה (e.g., string "sk-" + 48 chars) — חוסם push, מבקש הסבר מההורה.
- כלל-אצבע: לעולם לא לעשות hard-coded API keys.

### E. Push של commits-משולבים
- אם נצטרך משהו דחוף לפני סיום משימה-לוגית (e.g., backup), אפשר push ידני. אבל בברירת-מחדל — ממתינים.

---

## 6. סיכום פר-Claude Code

**ברירת-מחדל בכל סשן:**
1. בסוף משימה-לוגית → `git status` + הצעת-commit + push.
2. אם המשימה ארוכה ויש סיכון לאיבוד-עבודה → checkpoint commit (push) באמצע, עם type `chore: WIP — <description>`.
3. אם Plan Mode פעיל → לא pushing. רק תכנון.
4. אם חוסר-הסכמה עם ההורה על מה ראוי-push → להציע, להמתין לאישור.

**המטרה:** לעולם לא לאבד עבודה שאושרה.

---

## 7. תיעוד עצמי

כל push משמעותי מוסיף שורה ב-`docs/log/CHANGELOG.md` (אם זה bump-version) או נשמר רק ב-`git log` (אם זה patch קטן).

הפרוטוקול הזה עצמו מתועד ב:
- ADR-014 (יווצר ב-DECISIONS.md אם נדרשת החלטה-יסוד)
- CLAUDE.md סעיף "פרוטוקול ביצוע" (קישור מעלה)
- memory: `feedback_auto_push.md` (cross-session)
