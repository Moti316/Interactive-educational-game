# חכמוני — תכנון מלא (אינדקס)

> **שם המשחק:** חכמוני
> **דומיין (מוצע):** chachmoni.app
> **קהל יעד:** ילדי 4–6 שעדיין לא יודעים לקרוא
> **מטרה:** ללמד שימוש בעכבר, מקלדת בסיסית, ניווט ומושגים — כולו ב-voice-first עברי

---

## על המסמך הזה

התכנון המלא (~243KB, 4097 שורות) פוצל ל-8 קבצים תחת [`context/`](./context/)
לצורך תחזוקה ונוחות-קריאה (P0-1, CHG-010). **התוכן לא השתנה** — הפיצול
אומת byte-exact (md5 זהה לפני ואחרי).

`context/` הוא **מקור-האמת המלא** של התכנון. בסתירה מול `docs/status/ROADMAP.md`
או מסמך אחר — התכנון כאן גובר.

## מפת הקבצים

| # | קובץ | תוכן |
|---|------|------|
| 00 | [`context/00-overview-architecture.md`](./context/00-overview-architecture.md) | פתיחה, Council Round 3, מפרט CHG-005, Pre-Build Review, סיכום-מהיר, הקשר, מחסנית טכנית, מבנה תיקיות |
| 01 | [`context/01-design-and-profiles.md`](./context/01-design-and-profiles.md) | עקרונות עיצוב לגיל 4–6, פרופילים מקומיים (CHG-005), עיצוב חזותי |
| 02 | [`context/02-content-and-sync.md`](./context/02-content-and-sync.md) | תוכן בלתי-מוגבל + גנרטור AI, Google Drive Sync, git-sync, רשימת קבצי-MD |
| 03 | [`context/03-process-and-council.md`](./context/03-process-and-council.md) | הגדרות עבודה ל-Claude Code, Plan Change Control, High Council, Skills, חוויית פעם-ראשונה, PIN, TTS, תקרת-עלות, מקור-נכסים, Bridge Protocol |
| 04 | [`context/04-design-briefs-ui.md`](./context/04-design-briefs-ui.md) | 5 בריפים מוכנים, Design Workflow, מסכי-משנה, מפרט אנימציות, Sound Design |
| 05 | [`context/05-ux-components.md`](./context/05-ux-components.md) | נגישות (WCAG), עקרונות UX לגיל 4–6, ספריית-רכיבים, Micro-Copy, מיקרו-אינטראקציות |
| 06 | [`context/06-content-tasks.md`](./context/06-content-tasks.md) | ארכיטקטורת תוכן, מסלול 50 המשימות, עולמות 5–8, חוזה-API של משימה, קריינות, סדר-בנייה, Pre-Flight Checklist |
| 07 | [`context/07-quality-build.md`](./context/07-quality-build.md) | פערים ותיקונים, אסטרטגיית-מודלים, QA + Testing, Recovery Runbook, Integration Patches, State Machine, ביצועים, אימות, סיכום |

## איפה מתחילים

- **תוכנית-עבודה חיה:** [`docs/status/ROADMAP.md`](./docs/status/ROADMAP.md)
- **סטטוס בזמן-אמת:** [`docs/status/PROGRESS.md`](./docs/status/PROGRESS.md)
- **הוראות-Claude:** [`CLAUDE.md`](./CLAUDE.md)
- **בקרת-שינויים על התכנון:** [`docs/log/PLAN-CONTROL.md`](./docs/log/PLAN-CONTROL.md)
