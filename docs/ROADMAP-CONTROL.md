# ROADMAP-CONTROL — חוקי שינוי `docs/ROADMAP.md`

> מסמך זה מגדיר מי, מתי, ואיך משנה את `docs/ROADMAP.md`.
> מקביל ל-[`PLAN-CONTROL.md`](./PLAN-CONTROL.md) שמגן על PLAN.md.

---

## 1. הקשר

`docs/ROADMAP.md` הוא **view פעיל** של PLAN.md — תוכנית-עבודה חיה שמשמשת לתפעול-יום-יום. PLAN.md הוא תוכנית-העל (קבוע, 237KB, מאושר ע"י מועצה). ROADMAP.md הוא הגרסה התפעולית.

**הסכנה:** אם ROADMAP "מתנהל את עצמו" בלי בקרה — הוא יזחל הרחק מ-PLAN ויאבד אמינות. החוקים כאן מונעים זאת.

---

## 2. מי יכול לעדכן ROADMAP

| גורם | מה מותר | מה אסור |
|------|----------|------------|
| **RoadmapKeeper** (סוכן) | סנכרון סטטוס, drift log, ETA updates, dependency mapping | שינוי-תכולה (Deliverables, DoD) |
| **PhaseGatekeeper** (סוכן) | סימן "DoD verified" + תאריך | שינוי-תכולה |
| **CouncilChair** (סוכן) | הוספת שורת "drift impact" אחרי סבב | שינוי-תכולה |
| **Claude Code** (במהלך עבודה) | רק אחרי שRoadmapKeeper הופעל | עדכון ידני בלי keeper |
| **ההורה** | הכל, כולל שינוי-תכולה | — |

**עיקרון:** עדכון "סטטוס" (% התקדמות, drift, ETA) — שגרתי. עדכון "תכולה" (Deliverables, DoD, Gate composition) — דורש תהליך.

---

## 3. סוגי שינויים

### 3A. שינוי-שגרה (auto-allowed)
- עדכון % התקדמות פר-Phase
- עדכון "Next Gate" + "Last DoD-verified"
- הוספת drift log entry
- עדכון ETA (range)
- שורת "drift impact" אחרי סבב

**מי:** RoadmapKeeper / PhaseGatekeeper / CouncilChair (לפי תפקיד).
**איך:** ישר ל-ROADMAP.md, עם תיעוד ב-CHANGELOG.

### 3B. שינוי-תכולה (Phase Re-baseline)
- שינוי Deliverables של Phase
- שינוי DoD-checklist
- שינוי Gate composition
- הוספת/הסרת Phase
- שינוי ETA-baseline (לא drift)

**דורש:**
1. ADR ב-`DECISIONS.md` עם נימוק
2. אישור-הורה מפורש (✋)
3. בדיקת-עקביות מול PLAN.md (לא להתנגש)
4. RoadmapKeeper מבצע את העדכון אחרי האישור

### 3C. שינוי-מבנה (חוקי המסמך עצמו)
- שינוי הסעיפים ב-ROADMAP
- שינוי פורמט drift log
- שינוי קריטריונים ל-re-baseline

**דורש:**
1. ADR
2. אישור-הורה מפורש
3. עדכון של ROADMAP-CONTROL.md (זה הקובץ) במקביל

---

## 4. בדיקת-עקביות (Consistency Checks)

לפני כל שינוי, RoadmapKeeper מאמת:

- [ ] ROADMAP לא סותר את PLAN.md (PLAN הוא source-of-truth-תכנון)
- [ ] PROGRESS.md יסונכרן אחרי (אותו %, אותו "Next Gate")
- [ ] TASKS.md יסונכרן (אם משימות זזות)
- [ ] CHANGELOG.md מקבל רשומה חדשה
- [ ] אם שינוי-תכולה: ADR קיים ב-DECISIONS.md

אם בדיקה נכשלת — לא לעדכן ROADMAP עד שתוקן.

---

## 5. פורמט drift log

ב-ROADMAP.md בסוף הקובץ — טבלה רציפה:

```markdown
| Date | Phase | Change | Reason | Re-baseline? |
|------|-------|--------|---------|---------------|
| 2026-05-18 | (init) | יצירת ROADMAP.md | אין SSoT תפעולי | לא |
| 2026-05-25 | 1 | +1 day | bug ב-IndexedDB AES-GCM גילה הרבה edge cases | לא |
| 2026-06-02 | 2 | +3 days | Re-baseline אחרי משוב יואב | כן |
```

**אסור:** למחוק רשומות drift היסטוריות. הן חלק מהאמת.

---

## 6. תהליך Re-baseline

כשהמצב דורש שינוי-תכולה משמעותי (drift > 20% או שינוי-תכולה אקטיבי):

```
Step 1: RoadmapKeeper מזהה ומדווח (דיווח-להורה)
Step 2: ההורה מאשר את הנחיצות → ADR ב-DECISIONS.md
Step 3: RoadmapKeeper מציע גרסה חדשה של הסעיפים הרלוונטיים
Step 4: ההורה מאשר את הגרסה
Step 5: RoadmapKeeper מעדכן ROADMAP + drift log + CHANGELOG
Step 6: אם נדרש: סבב-מועצה לאישור-המעבר (R-X.Y)
Step 7: רשומת PROGRESS משקפת את ה-baseline החדש
```

---

## 7. עקרונות-יסוד

1. **ROADMAP < PLAN** — אם יש סתירה, PLAN גובר. ROADMAP חייב להתאים.
2. **שינוי-תכולה דורש ADR** — לא משנים תכולה בשקט.
3. **drift log אסור למחוק** — היסטוריה היא נכס.
4. **Auto-allowed vs. Approval-required** — שני סוגי-שינוי, שני תהליכים, שקיפות מלאה.
5. **RoadmapKeeper הוא custodian, לא decision-maker** — מאשר/מעדכן אחרי שמישהו אחר (chair/הורה) החליט.

---

**מסמך זה הוא פעיל וחי.** שינוי לחוקיו דורש ADR ואישור-הורה.
