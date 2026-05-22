---
tags:
  - status
---

# חכמוני — Master Progress Dashboard

> **עדכון אחרון:** 2026-05-23 (Brief #1.5 נמסר ושולב — לוגו חדש פעיל) | **מחשב:** HOME-PC | **גרסה:** v0.6.5
> **תוכנית חיה:** [`docs/status/ROADMAP.md`](./ROADMAP.md) (מתוחזק ע"י [RoadmapKeeper](../../.claude/agents/agent-roadmap-keeper.md))

## 📍 שדות-מהירים

| שדה | ערך |
|------|------|
| **Phase נוכחי** | 0.5 (40%) |
| **Next Gate** | R4 (Pre-Phase-1, אחרי השלמת Briefs #3–5) |
| **Last DoD-verified** | 2026-05-19 (Brief #2 — Mascot 6 poses, Universal Constraints PASS) |
| **Last Council** | R3.5 (2026-05-19, 🟢 GO with 17 patches) |
| **Last Design Review** | **R-Design-1** (2026-05-19, 🔴 OFF-BRAND — 2 FAIL + 3 NEEDS-PATCH; Brief #1.5 חוסם Phase 1) |
| **Last ADR** | ADR-015 (Logo Character Unification Policy) |
| **Teams active** | 3 (High Council 9, Compass 3, Design Studio 7 = **19 sub-agents**) |
| **Active blockers** | אין חוסם-Phase-1. נותרו Briefs #3–5 להשלמת Phase 0.5 |

## 🚦 סטטוס שלבים

| שלב | סטטוס | יום | התקדמות | הערות |
|-----|--------|-----|----------|--------|
| **0 — תשתית** | ✅ הושלם | 1 | 100% | 49 קבצים ב-GitHub |
| **0.5 — מוקאפים** | 🟢 בעבודה | 3 | 50% | Briefs #1.5 ✅ (לוגו), #2 ✅ (6 poses). הבא: #3 Welcome |
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

> **Brief #1.5 הושלם (2026-05-23):** הלוגו עוצב מחדש דרך claude.ai/design, ההורה בחר Version B (מסקוט-מלא), והוא שולב כלוגו הפעיל. שני חוסמי-Phase-1 (Brief #1.5 + ADR-014) נסגרו.

**רצף-העבודה הבא — השלמת Phase 0.5:**
1. Brief #3 — Welcome A/B (claude.ai/design)
2. Brief #4 — 12 אווטארים (DNA-aligned עם המסקוט)
3. Brief #5 — Task + Celebration (+ motion-spec)
4. R4 Council Gate (Pre-Phase-1)
5. Phase 1 — שלד מערכת + פרופילים (יכלול CHG-005)

> אופציונלי: R-Design-2 לאימות הלוגו החדש לפני R4.

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

- **חוסם Phase 1:** Brief #1.5 (Logo Redux). R-Design-1 (2026-05-19) זיהה שהלוגו הנוכחי ≠ דמות-המסקוט. דורש החלטת-הורה.
- **חוסם Phase 1:** ADR-014 (Palette Extension + Semantic Layer). דורש החלטת-הורה.
- **לא חוסם:** Briefs #3–5 — יבוצעו דרך claude.ai/design אחרי Brief #1.5.
- **לא חוסם:** OAuth Client ID של Drive — נדרש רק בשלב 4.

## 💰 שימוש-מודלים בסשן האחרון

- Opus 4.7: תכנון CHG-005 + Council Round 3
- Sonnet 4.6: כתיבת skills/agents/scripts
- Haiku 4.5: לא שומש
- עלות (תחת Max): $0

## 🐛 באגים פתוחים

ראה `docs/log/ISSUES.md`. כרגע: **0 באגים** (טרם התחלנו לבנות לוגיקה).

## 📋 Council Reviews

ראה `docs/log/COUNCIL.md`:
- Round 1: 8 agents, 8 WARNING — 14 patches קריטיים
- Round 2: 8 agents, 3 PASS + 5 WARNING — 5 patches סופיים
- Round 3 (CHG-005): 5 agents, 1 FAIL + 4 WARNING — 14 patches

## 📝 הערה-עצמית לסשן הבא

- **תשתית 2026-05-20:** הוקם "חדר-בקרה" ב-Obsidian — `docs/_DASHBOARD.md`, `project-map.canvas`, `docs/guides/OBSIDIAN-GUIDE.md`, ותגיות ל-34 מסמכים.
- **המשך:** ההורה פותח `design-mocks/01-mascot-preview.html` בכרום, מאשר/מבקש תיקונים.
- אם מאשר — Claude Code מתחיל Brief #3 (Welcome A/B) באותה שיטה (Local-First).
- ADR-011 שינה את ברירת-המחדל: Local-First במקום Bridge. תיעוד מלא ב-`docs/log/DECISIONS.md` + `docs/spec/CLAUDE-DESIGN-BRIEFS.md`.
- CHG-005 כולל הרבה — יש את כל הפרטים ב-PLAN.md סעיפים: "Council Round 3", "CHG-005", "חוויית פעם-ראשונה", "פרופילים מקומיים".
