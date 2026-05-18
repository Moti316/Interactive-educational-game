# חכמוני — Master Progress Dashboard

> **עדכון אחרון:** 2026-05-18 (Compass setup) | **מחשב:** HOME-PC | **גרסה:** v0.3.0 (Compass + ROADMAP)
> **תוכנית חיה:** [`docs/ROADMAP.md`](./ROADMAP.md) (מתוחזק ע"י [RoadmapKeeper](../.claude/agents/agent-roadmap-keeper.md))

## 📍 שדות-מהירים

| שדה | ערך |
|------|------|
| **Phase נוכחי** | 0.5 (30%) |
| **Next Gate** | R4 (Pre-Phase-1, אחרי השלמת Briefs #2–5) |
| **Last DoD-verified** | 2026-05-19 (Phase 0.5 re-verified post-R3.5 — DoD מעודכן) |
| **Last Council** | R3.5 (2026-05-19, 🟢 GO with 17 patches) |
| **Active blockers** | Briefs #2–5 (תלות-הורה — עכשיו בגרסה משופרת) |

## 🚦 סטטוס שלבים

| שלב | סטטוס | יום | התקדמות | הערות |
|-----|--------|-----|----------|--------|
| **0 — תשתית** | ✅ הושלם | 1 | 100% | 49 קבצים ב-GitHub |
| **0.5 — מוקאפים** | 🟢 בעבודה | 2 | 30% | Brief #1 ✅ Version A נבחר. הבא: Brief #2 |
| **CHG-005 (חדש)** | 📋 תוכנן | 2 | 0% | Parent Profiles + Fast-Path + 4 ערוצי-נוכחות |
| 1 — שלד + פרופילים | ⏳ ממתין | — | 0% | יכלול CHG-005 לפי התכנון |
| 2 — תבנית ראשונה | ⏳ ממתין | — | 0% | |
| 3 — תבניות עכבר | ⏳ ממתין | — | 0% | |
| 4 — PowerShell + Drive | ⏳ ממתין | — | 0% | מחכה ל-OAuth setup מההורה |
| 5 — תבניות מקלדת | ⏳ ממתין | — | 0% | |
| 6 — point-and-narrate | ⏳ ממתין | — | 0% | |
| 7 — 50 משימות | ⏳ ממתין | — | 0% | |
| 8 — ליטוש | ⏳ ממתין | — | 0% | |
| 9 — אריזה ומסירה | ⏳ ממתין | — | 0% | |

## 📍 מה הצעד הבא?

**ההורה (בערב מהבית):**
1. פתח [`docs/CLAUDE-DESIGN-BRIEFS.md`](./CLAUDE-DESIGN-BRIEFS.md)
2. גלול ל-**Brief #2** (Mascot — 5 pose-ים)
3. העתק → claude.ai (צ'אט חדש) → קבל artifact → החזר את ה-START PASTE/END PASTE

**אחרי Brief #2 (ינשוף-המורה):**
- Brief #3 (Welcome Screen A/B)
- Brief #4 (12 אווטארים)
- Brief #5 (Task Screen + Celebration)
- ואז: Phase 1 — שלד מערכת + פרופילים (יכלול CHG-005)

## 🆕 CHG-005 — מה התווסף (תכנון בלבד, לא ביצוע)

**תכונת-משפחה מקיפה:**
- 2 סוגי-פרופילים: child + parent (עד 2 הורים)
- Fast-Path: ילד משחק תוך 30ש', הורה אחר-כך
- 4 ערוצי-נוכחות-הורה: אווטאר בפרופיל, cameo בחגיגה (50%), הקלטת-קול 4ש', תמונות בdashboard
- שדה `gender` לדקדוק עברי
- A/B Niqud Preview לשמות-עמומים
- AES-GCM encryption לvoice + Drive sync של voice (מוצפן)
- PIN משותף + 3 רמות-איפוס

**Council Round 3:** 5 sub-agents סקרו, 14 patches יושמו (1 FAIL → תוקן Fast-Path).

## 🎯 מה תקוע / חוסם?

- **לא חוסם:** Brief #2 עד #5 — ההורה צריך להעתיק 4 briefs מ-claude.ai.
- **לא חוסם:** OAuth Client ID של Drive — נדרש רק בשלב 4.

## 💰 שימוש-מודלים בסשן האחרון

- Opus 4.7: תכנון CHG-005 + Council Round 3
- Sonnet 4.6: כתיבת skills/agents/scripts
- Haiku 4.5: לא שומש
- עלות (תחת Max): $0

## 🐛 באגים פתוחים

ראה `docs/ISSUES.md`. כרגע: **0 באגים** (טרם התחלנו לבנות לוגיקה).

## 📋 Council Reviews

ראה `docs/COUNCIL.md`:
- Round 1: 8 agents, 8 WARNING — 14 patches קריטיים
- Round 2: 8 agents, 3 PASS + 5 WARNING — 5 patches סופיים
- Round 3 (CHG-005): 5 agents, 1 FAIL + 4 WARNING — 14 patches

## 📝 הערה-עצמית לסשן הבא

- **המשך מהבית בערב:** `git pull --rebase` במחשב הביתי, פתח `docs/CLAUDE-DESIGN-BRIEFS.md`, התחל Brief #2.
- אם רוצים — אפשר לבדוק את הלוגו ב-`design-mocks/01-logo-options.html` (פתח ב-Chrome).
- CHG-005 כולל הרבה — יש את כל הפרטים ב-PLAN.md סעיפים: "Council Round 3", "CHG-005", "חוויית פעם-ראשונה", "פרופילים מקומיים".
