# חכמוני 🦉

**משחק דפדפן בעברית ללימוד יסודות המחשב לילדים בני 4–6.**

> שני הילדים עדיין לא קוראים — לכן המערכת **voice-first**: כל טקסט על המסך מוקרא בקול.

---

## מצב נוכחי

🚧 **Phase 0 — תשתית הוקמה** | תוכנן מלא ב-[PLAN.md](./PLAN.md) | סטטוס: [docs/PROGRESS.md](./docs/PROGRESS.md)

הצעד הבא: **שלב 0.5** — מוקאפים מ-Claude Design (5 briefs ב-[docs/CLAUDE-DESIGN-BRIEFS.md](./docs/CLAUDE-DESIGN-BRIEFS.md)).

---

## תקציר

- **שם:** חכמוני
- **קהל יעד:** ילדי 4–6 שעדיין לא קוראים
- **טכנולוגיה:** Vanilla HTML/CSS/JavaScript ES Modules (בלי build step)
- **דפדפן:** Chrome עדכני (Windows)
- **הרצה:** PowerShell Launcher → `http://localhost:8080` (Local-only, אין אירוח באינטרנט)
- **גיבוי:** Google Drive sync (OAuth, drive.file scope) + Export/Import JSON ידני
- **תוכן:** 50 משימות מובנות + ווריאציות רנדומיות (Phase 2: גנרטור AI)

---

## להפעיל את המשחק

```powershell
# פעם אחת:
powershell -File scripts/install-shortcut.ps1

# מאז: לחיצה כפולה על "חכמוני" בשולחן-העבודה
```

או ידנית:

```powershell
powershell -File scripts/start-chachmoni.ps1
```

---

## להמשך עבודה מהבית

1. `git clone https://github.com/Moti316/Interactive-educational-game`
2. פתח את התיקייה ב-Claude Code
3. Claude יקרא אוטומטית את `CLAUDE.md` ו-`docs/PROGRESS.md`
4. המשך מהשלב הנוכחי (ראה PROGRESS.md)

---

## מבנה התיעוד

| קובץ | מה בו |
|------|--------|
| [PLAN.md](./PLAN.md) | תכנון מלא: ארכיטקטורה, 50 משימות, סנכרון, AI, הכל (~230KB) |
| [CLAUDE.md](./CLAUDE.md) | הוראות ל-Claude Code לעבודה בפרויקט הזה |
| [docs/PROGRESS.md](./docs/PROGRESS.md) | **Master Dashboard** — סטטוס בזמן-אמת |
| [docs/PARENT-GUIDE.md](./docs/PARENT-GUIDE.md) | מדריך להורה (ידידותי, ללא ז'רגון) |
| [docs/CLAUDE-DESIGN-BRIEFS.md](./docs/CLAUDE-DESIGN-BRIEFS.md) | 5 בריפים מוכנים-להעתקה ל-Claude Design |
| [docs/](./docs/) | 22 קבצי-תיעוד נוספים |

---

## תכונות

- 🎯 **50 משימות-מובנות** ב-4 עולמות (עכבר, מקלדת, חלון/דפדפן, מושגים)
- 🔄 **ווריאציות רנדומיות** — בלונים, דגים, כוכבים, פירות... בכל פעם שונה
- 🦉 **דמות-מורה "פרופ' חכמוני"** — ינשוף ידידותי שמלווה לאורך-הדרך
- 👶 **N פרופילים** — תמיכה בכל המשפחה (לא רק 2)
- 📷 **אווטאר/תמונה אישית** — 12 חיות מאוירות או תמונה של הילד
- 🔊 **Voice-first מלא** — קריינות עברית איטית (rate 0.85) על כל טקסט
- 💾 **גיבוי פר-ילד** — Drive sync + Export/Import JSON
- ♿ **נגישות WCAG AA** — ניגודיות, reduced-motion, focus indicators
- 🔒 **פרטיות מירבית** — Local-only, אין אירוח באינטרנט, אין URL פומבי

---

## אישור-איכות

המשחק עבר **2 סבבי High Council** (8 sub-agents):
- **Round 1:** 40+ patches זוהו ויושמו
- **Round 2:** 3 PASS (Security, Performance, Code-Review) + 5 WARNING + Round-2-final fixes

ראה [docs/COUNCIL.md](./docs/COUNCIL.md).
