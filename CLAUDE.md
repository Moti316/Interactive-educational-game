# CLAUDE.md — הוראות לClaude Code לפרויקט "חכמוני"

## הקשר במשפט אחד

משחק דפדפן בעברית ללימוד יסודות המחשב לילדים בני 4–6 שעדיין לא קוראים. **Voice-first** מלא: כל טקסט מוקרא.

## איפה מתחילים בכל סשן

1. **קרא את [PLAN.md](./PLAN.md)** — התכנון המלא והמעודכן ביותר. הוא ה-source of truth.
2. אם קיים `docs/TASKS.md` — קרא אותו לראות מה הושלם ומה נשאר.
3. אם קיים `docs/ISSUES.md` — קרא אותו לראות באגים פתוחים.

## מצב נוכחי (עדכון אחרון: 2026-05-17)

הפיתוח **עדיין לא התחיל**. רק קובץ התכנון (`PLAN.md`) קיים. הצעד הבא הוא **שלב 0** מהתכנון:
- יצירת מבנה תיקיות
- כתיבת `.claude/skills/kids-game.md`
- אתחול 14 קבצי ה-MD ב-`docs/`
- הקמת `scripts/git-sync.ps1` + Task Scheduler
- `.gitignore`, `vercel.json`

## עקרונות קוד פר-פרויקט

- **עברית בכל הטקסטים** הגלויים למשתמש. RTL.
- **כל טקסט גלוי חייב להיות מוקרא** — שני הילדים לא קוראים.
- **קצב TTS: 0.75**, `lang: 'he-IL'`.
- **Hover על כל אלמנט-טקסט = הקראה אחרי 600ms.**
- **כפתורים min 80×80px**, צבעים רוויים, פינות מעוגלות.
- **Vanilla JS / ES Modules** — בלי build step, בלי React, בלי npm.
- **כל כפתור עובר דרך `src/ui/button.js`** — לא ליצור כפתורים ידנית.
- **קונבנציות שמות משימות:** `task-{worldId}-{kebab-skill-name}` (למשל `task-mouse-balloons`).

## עדכון תיעוד תוך כדי עבודה

אחרי כל שינוי משמעותי — עדכן את הקובץ הרלוונטי ב-`docs/`:
- באג מצאת/תיקנת → `docs/ISSUES.md`
- החלטה משמעותית → `docs/DECISIONS.md`
- משימה חדשה → `docs/CONTENT.md` + `docs/NARRATION.md` + `docs/TASKS.md`
- ארכיטקטורה השתנתה → `docs/ARCHITECTURE.md`
- בדיקה עם ילדים → `docs/KIDS-FEEDBACK.md`

## Skills לשימוש

- **ui-ux-pro-max** (מובנה) — עבור עיצוב מסכים, spacing, colors, accessibility.
- **design** (מובנה) — עבור יצירת אווטארים, לוגו, פאוויקון דרך Gemini.
- **claude-api** (מובנה) — בעת בניית `src/ai/task-generator.js`.
- **kids-game** (מותאם פרויקט, ייווצר ב-`.claude/skills/`) — נטען אוטומטית.

## פקודות נפוצות

```powershell
# הרצה מקומית
Start-Process 'chrome.exe' -ArgumentList 'C:\Users\b0066820\Interactive-educational-game\index.html'

# סנכרון ידני (אם הטאסק האוטומטי לא רץ)
powershell -File scripts/git-sync.ps1

# Vercel deploy ידני (לא נחוץ אם auto-deploy פעיל)
vercel --prod
```

## מה לא לעשות

- אל תוסיף תלות חיצונית (npm package) בלי דיון.
- אל תיצור backend/server-side — הכל סטטי.
- אל תפנה לילדים בטקסט אנגלי.
- אל תוסיף טיימרים/שעוני-לחץ במשחקים.
- אל תוסיף "מסכי כישלון" — רק "ננסה שוב" עם חיוך.
- אל תכתוב טקסט קריינות בלי ניקוד נכון לגיל (משפטים קצרים, מילים פשוטות).

## מקור התכנון

PLAN.md עודכן ב-2026-05-17. הוא תוצר של מספר סבבי תכנון בין המשתמש ו-Claude. כל החלטה משמעותית שלא נמצאת בקובץ — דיון נדרש לפני שינוי.
