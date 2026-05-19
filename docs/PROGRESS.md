# חכמוני — Master Progress Dashboard

> **עדכון אחרון:** 2026-05-19 (Brief #2 הושלם, ADR-011) | **מחשב:** HOME-PC | **גרסה:** v0.4.0 (Local-First Design Path)
> **תוכנית חיה:** [`docs/ROADMAP.md`](./ROADMAP.md) (מתוחזק ע"י [RoadmapKeeper](../.claude/agents/agent-roadmap-keeper.md))

## 📍 שדות-מהירים

| שדה | ערך |
|------|------|
| **Phase נוכחי** | 0.5 (40%) |
| **Next Gate** | R4 (Pre-Phase-1, אחרי השלמת Briefs #3–5) |
| **Last DoD-verified** | 2026-05-19 (Brief #2 — Mascot 6 poses, Universal Constraints PASS) |
| **Last Council** | R3.5 (2026-05-19, 🟢 GO with 17 patches) |
| **Last Design Review** | (טרם — R-Design-1 מתוכנן אחרי אישור-הורה על Design Studio) |
| **Last ADR** | ADR-013 (Design Studio Formalization) |
| **Teams active** | 3 (High Council 9, Compass 2, Design Studio 7 = **18 sub-agents**) |
| **Active blockers** | Briefs #3–5 (Local-First — Claude Code יכתוב, אישור-הורה ויזואלי) |

## 🚦 סטטוס שלבים

| שלב | סטטוס | יום | התקדמות | הערות |
|-----|--------|-----|----------|--------|
| **0 — תשתית** | ✅ הושלם | 1 | 100% | 49 קבצים ב-GitHub |
| **0.5 — מוקאפים** | 🟢 בעבודה | 2 | 40% | Briefs #1 ✅, #2 ✅ (6 poses, 1.6-2.2KB). הבא: #3 Welcome |
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

**אישור-הורה ויזואלי על Brief #2:**
1. פתח `design-mocks/01-mascot-preview.html` בכרום
2. ודא שכל 6 ה-poses נראים כמשפחה אחת (אותו ינשוף, רק תנוחות שונות)
3. אם מאשר → ממשיכים ל-Brief #3
4. אם דורש שינויים → תגיד מה לתקן, Claude Code יערוך

**אחרי אישור Brief #2:**
- Brief #3 (Welcome Screen A/B) — Local-First (HTML mockup)
- Brief #4 (12 אווטארים) — Local-First (SVG)
- Brief #5 (Task Screen + Celebration) — Local-First (HTML mockup)
- R4 Council Gate (Pre-Phase-1)
- Phase 1 — שלד מערכת + פרופילים (יכלול CHG-005)

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

- **ממתין לאישור-ויזואלי:** Brief #2 — ההורה צריך לפתוח את ה-preview ולאשר.
- **לא חוסם:** Briefs #3–5 — Local-First, Claude Code יכתוב, ההורה יאשר חזותית בכל אחד.
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

- **המשך:** ההורה פותח `design-mocks/01-mascot-preview.html` בכרום, מאשר/מבקש תיקונים.
- אם מאשר — Claude Code מתחיל Brief #3 (Welcome A/B) באותה שיטה (Local-First).
- ADR-011 שינה את ברירת-המחדל: Local-First במקום Bridge. תיעוד מלא ב-`docs/DECISIONS.md` + `docs/CLAUDE-DESIGN-BRIEFS.md`.
- CHG-005 כולל הרבה — יש את כל הפרטים ב-PLAN.md סעיפים: "Council Round 3", "CHG-005", "חוויית פעם-ראשונה", "פרופילים מקומיים".
