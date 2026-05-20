# Plan — גיבוי + עדכון workspace-template + המלצות-תשתית לחכמוני

## Context

בוצע ניתוח-השוואתי מעמיק בין חכמוני לבין `wall`/TodoWall (הוצג בצ'אט). התגלה שהריפו `workspace-template` של ההורה הוא cookiecutter template מתוחכם (33 סוכנים, 13 צוותים, Council of 4, Chief of Staff, gesher bridge, 9 מנגנוני anti-chaos) שכבר נגזר מ-wall.

ההורה ביקש 3 דברים לפני אישור המשך:
1. **גיבוי** — נקודת-שחזור לפני שינויי-תשתית בחכמוני.
2. **עדכון workspace-template** — לשלב את חוזקות-חכמוני בתבנית (שכרגע wall-only).
3. ואז להחליט על המלצות-התשתית לחכמוני (P0/P1/P2).

---

## Part 1 — גיבוי (בריפו חכמוני)

נקודת-שחזור מלאה לפני כל שינוי-תשתית:

1. **ענף-גיבוי git** — `backup/pre-infra-upgrade-2026-05-20` מה-HEAD הנוכחי (commit `b896787`). ענף קפוא — תמונת-מצב מושלמת.
2. **תגית git** — `backup-2026-05-20-pre-infra` על אותו commit (גיבוי-כפול).
3. **תיקייה `_backup/2026-05-20-pre-infra-upgrade/`** בריפו, עם:
   - `RESTORE-POINT.md` — בעברית פשוטה: מה זו הנקודה, שם-הענף, ה-commit hash, והוראות-שחזור צעד-אחר-צעד.
   - `infra-upgrade-plan.md` — עותק של קובץ-התכנון הזה (כפי שההורה ביקש).
4. **commit + push** של ה-`_backup/` + הענף + התגית.

**שחזור (אם יידרש):** `git checkout backup/pre-infra-upgrade-2026-05-20` או `git reset --hard backup-2026-05-20-pre-infra`.

---

## Part 2 — עדכון workspace-template (ריפו נפרד)

`git clone` של `Moti316/workspace-template` לתיקייה זמנית, הזרקת 7 חוזקות-חכמוני, commit + push.

מה ל-`workspace-template` **כבר יש** (מ-wall): teams/ tree · tasks.md פר-סוכן · PROTOCOL.md · context/ · Council governance · bootstrap script · first-session greeting · cookiecutter parametrization.

מה **חסר** (חוזקות-חכמוני להזרקה):

| # | הזרקה | מה |
|---|--------|-----|
| **A** | **העשרת פורמט-הסוכן** | פורמט-הסוכן הנוכחי wall-style (Purpose/You handle/Coordinate with). להוסיף 3 שכבות-חכמוני: **השראה ממאסטרים** · **קווים-אדומים** · **פורמט-תגובה מובנה**. לשמר את השכבה התפעולית של wall. עריכה ב-`scripts/bootstrap_agents.py` (הגנרטור) + קבצי-הסוכן המומחשים. |
| **B** | **`.claude/skills/`** | התבנית יש `skills/` ו-`skills-curator` אבל אין קבצי-skill ממשיים. להוסיף `.claude/skills/` עם template-skill + README שמסביר את הפורמט. |
| **C** | **`ROADMAP.md` template** | התבנית אין ROADMAP. להוסיף תבנית עם **drift-log** (חוזקה ייחודית של חכמוני) + שלבים + תנאי-כניסה. |
| **D** | **`RISKS.md` + `BUGS.md` templates** | להוסיף תבניות — מרשם-סיכונים (בעלים+מיטיגציה) ויומן-באגים (BUG-NNN). |
| **E** | **תבנית-פרוטוקול** | להוסיף `docs/` עם תבניות פרוטוקול: TASK-COMPLETION + GIT-SYNC (חכמוני formalized אותם; wall רק inline). |
| **F** | **lens-based review** | לתעד ב-`teams/council/_governance.md` את טכניקת הסקירה-דרך-עדשה (חיסכון 80% מול N קריאות-sub-agent). |
| **G** | **יומני-החלטות מוקלדים (אופציונלי)** | להציע ב-README את האפשרות לפצל PROTOCOL.md ל-DECISIONS/CHANGES/ISSUES בנפרד (כמו חכמוני) — לפרויקטים גדולים. |

- עדכון `README.md` של התבנית — תיעוד החוזקות החדשות + provenance: "extracted from wall + חכמוני".
- אם נדרשים cookiecutter variables חדשים → `cookiecutter.json` (נשאף למינימום — רוב ההזרקות סטטיות).
- commit + push לענף הראשי של `workspace-template`.

---

## Part 3 — המלצות-תשתית לחכמוני (תפריט-החלטה — לא לביצוע עדיין)

אחרי Part 1+2, ההורה בוחר אילו לאמץ. (פירוט מלא הוצג בצ'אט.)

**🔥 P0:** (1) פיצול PLAN.md ל-`context/` · (2) בלוק "מצב הפרויקט" חי ב-CLAUDE.md
**⚠️ P1:** (1) `RISKS.md` · (2) יומן-הפעלות-סוכנים · (3) תבנית-ADR עשירה · (4) קיבוץ `docs/` לתתי-תיקיות
**💡 P2:** "Coordinate with" בסוכנים · role `cross-team-auditor` · backfill ADRs ישנים · generator-סוכנים

---

## Critical files

**Part 1 (ריפו חכמוני):** `_backup/2026-05-20-pre-infra-upgrade/RESTORE-POINT.md` (חדש), `_backup/.../infra-upgrade-plan.md` (חדש), ענף+תגית git.

**Part 2 (ריפו workspace-template, דרך clone זמני):** `scripts/bootstrap_agents.py`, `.claude/agents/*` template, `.claude/skills/*` (חדש), `ROADMAP.md` (חדש), `RISKS.md` (חדש), `BUGS.md` (חדש), `docs/*-PROTOCOL.md` (חדש), `teams/council/_governance.md`, `README.md`, `cookiecutter.json`.

**Part 3:** ייקבע אחרי בחירת-ההורה.

## Verification

1. **Part 1:** `git branch` מציג את ענף-הגיבוי; `git tag` מציג את התגית; `_backup/RESTORE-POINT.md` קריא בעברית עם hash נכון.
2. **Part 2:** `cookiecutter` עדיין רץ ללא שגיאה (אם מותקן) — או לפחות `cookiecutter.json` תקין JSON; קבצי-סוכן מומחשים מכילים את 3 השכבות החדשות; ROADMAP/RISKS/BUGS קיימים.
3. הכל-pushed לפי "פרוטוקול ביצוע" (חוק 2).

## Execution order

1. Part 1 (גיבוי) — **ראשון תמיד**, כדי שתהיה נקודת-שחזור.
2. Part 2 (workspace-template) — ריפו נפרד, לא נוגע בחכמוני.
3. Part 3 — עוצרים, ההורה בוחר מה-תפריט.

## הערה

Part 1+2 הם ביצוע (אחרי אישור ExitPlanMode). Part 3 הוא תפריט-החלטה — שום פריט שם לא יבוצע עד בחירה מפורשת.
