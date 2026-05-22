---
name: roadmap-tracking
description: Shared protocol for ROADMAP maintenance, drift detection, and phase transitions. Used by RoadmapKeeper, PhaseGatekeeper, and CouncilChair to ensure consistent handling of plan-vs-actual tracking across the Compass and Council teams.
---

# Skill: roadmap-tracking (פרוטוקול-מעקב משותף)

## מטרה

skill זה מספק **כללי-עבודה משותפים** לסוכנים שנוגעים ב-ROADMAP.md ובמעקב-התקדמות. הוא מבטיח שכל סוכן (RoadmapKeeper, PhaseGatekeeper, CouncilChair) משתמש באותם פורמטים, אותם קריטריונים, אותו דיווח.

---

## עקרונות-יסוד (קריטיים)

1. **ROADMAP < PLAN** — סתירה? PLAN.md גובר. ROADMAP חייב להתאים.
2. **drift log אסור למחוק** — היסטוריה היא נכס. רק להוסיף.
3. **Evidence over trust** — אל תאשר על-בסיס דיווח. בדוק בעצמך.
4. **Auto-allowed vs. Approval-required** — שני סוגי-שינוי, שני תהליכים.
5. **דיווח קצר** — סורק ב-30 שניות, לא מאמר.

---

## פורמט drift log (אחיד)

```markdown
| Date | Phase | Change | Reason | Re-baseline? |
|------|-------|--------|---------|---------------|
| 2026-05-18 | (init) | יצירת ROADMAP.md | אין SSoT תפעולי | לא |
| 2026-05-25 | 1 | +1 day | bug ב-IndexedDB AES-GCM | לא |
```

**שדות חובה:**
- **Date:** ISO 8601 (YYYY-MM-DD)
- **Phase:** מספר Phase או `(init)` / `(setup)` / `(R-N)` לסבבים
- **Change:** משפט אחד — מה השתנה
- **Reason:** למה (קצר, ספציפי)
- **Re-baseline?:** כן/לא (אם כן — דורש ADR)

---

## חישוב Drift

### Drift בזמן
```
drift_days = (actual_completion_date - planned_completion_date)
drift_pct = drift_days / planned_duration_days * 100
```

**רמות:**
- 0–10% → ירוק, לא לדווח מיוחד
- 10–20% → 🟡 צהוב, לדווח בדוח-סטטוס תקופתי
- 20–50% → 🟡 unmitigated drift, סימן ב-ROADMAP, התראה להורה
- > 50% → 🔴 דורש Re-baseline session

### Drift בתכולה
- Deliverable חדש שהתווסף → תיעוד ב-drift log
- Deliverable שהוסר → דורש ADR
- DoD שהשתנה → דורש ADR + אישור-הורה

### Drift בתלויות
- תלות חדשה (בlocker) → 🟡 בדוח
- תלות-הורה שלא בוצעה > 72 שעות → 🟡, escalation אחרי 7 ימים

---

## ETA Forecasting (Range, לא נקודתי)

**אסור:** "MVP יהיה מוכן ב-15 ביוני."
**נכון:** "MVP צפוי בין 14 ל-21 ימי-עבודה מהיום."

### חישוב Range
```
optimistic = sum(remaining_phases.duration) * 1.0
pessimistic = sum(remaining_phases.duration) * 1.5
median = (optimistic + pessimistic) / 2
```

הfactor 1.5 מבוסס על נתוני McConnell — אומדנים נוטים להיות overoptimistic ב-30–50%.

### עדכון לפי היסטוריה
אם Phases 0+0.5 לקחו +20% מהמתוכנן → התאם את ה-pessimistic ל-1.7×.

---

## Auto-allowed vs. Approval-required

### ✅ Auto-allowed (RoadmapKeeper ישר ל-ROADMAP)
- עדכון % Phase
- עדכון Last DoD-verified
- עדכון Next Gate
- הוספת drift log entry
- עדכון ETA range
- שורת "drift impact" אחרי סבב-מועצה

### ✋ Approval-required (דורש ADR + אישור-הורה)
- שינוי Deliverables של Phase
- שינוי DoD-checklist
- שינוי Gate composition
- הוספת/הסרת Phase
- Re-baseline (ETA-baseline change, לא drift)
- שינוי לפרוטוקול עצמו (ל-ROADMAP-CONTROL.md)

---

## פורמט-דיווח אחיד (כל סוכן עם skill זה)

```
STATUS: 🟢 OK | 🟡 WARNING | 🔴 BLOCK / RE-BASELINE
SUMMARY: (משפט אחד)

CURRENT STATE:
- Phase: X.Y (Z%)
- Next Gate: R-N
- ETA: A–B days (range)

DRIFT:
- [none] | [detail]

ACTIONS TAKEN:
- updated [file]: [section]
- added drift log: [entry]

NEXT ACTION:
- [recommendation]
```

מקס' 500 מילים. אם יש drift > 20% — מדגיש בכותרת.

---

## בדיקת-עקביות לפני עדכון ROADMAP

לפני שRoadmapKeeper כותב ל-ROADMAP, חובה לאמת:

- [ ] ROADMAP לא סותר את PLAN.md
- [ ] PROGRESS.md מתאים (אותו %, אותו Next Gate)
- [ ] TASKS.md מסונכרן (אם משימות זזו)
- [ ] CHANGELOG.md יקבל רשומה חדשה
- [ ] אם שינוי-תכולה: ADR קיים ב-DECISIONS.md

אם בדיקה נכשלת — לא לעדכן.

---

## טריגרים — מתי הפעל את ה-Skill הזה

- אתה RoadmapKeeper ועומד לעדכן ROADMAP
- אתה PhaseGatekeeper ועומד לאמת DoD
- אתה CouncilChair וצריך להוסיף שורת drift impact ל-COUNCIL.md
- כל פעם שדרושה החלטה על "Re-baseline או דחיית-החלטה"

---

## קישורים

- [`docs/status/ROADMAP.md`](../../docs/status/ROADMAP.md) — התוצר הראשי
- [`docs/process/ROADMAP-CONTROL.md`](../../docs/process/ROADMAP-CONTROL.md) — חוקי-השינוי
- [`docs/teams/TEAM-COMPASS.md`](../../docs/teams/TEAM-COMPASS.md) — זהות הצוות
- [`docs/process/TASK-COMPLETION-PROTOCOL.md`](../../docs/process/TASK-COMPLETION-PROTOCOL.md) — מתי "done"
