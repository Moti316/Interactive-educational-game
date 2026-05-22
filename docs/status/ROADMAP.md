---
tags:
  - status
---

# חכמוני — ROADMAP (תוכנית-עבודה חיה)

> **Single source-of-truth** מהיום עד MVP. מתוחזק ע"י [`agent-roadmap-keeper`](../../.claude/agents/agent-roadmap-keeper.md) (RoadmapKeeper).
> חוקי-שינוי: [`ROADMAP-CONTROL.md`](../process/ROADMAP-CONTROL.md).
> המסמך הזה הוא **view** של [`PLAN.md`](../../PLAN.md), לא תחליף.

---

## Header — סטטוס נוכחי

| שדה | ערך |
|------|------|
| **Phase נוכחי** | 0.5 (50%) |
| **Next Gate** | R4 (אחרי השלמת Briefs #3–5) |
| **ETA ל-MVP** | 13–20 ימי-עבודה מהיום (Local-First מאיץ Briefs ב-~1 יום) |
| **Last DoD-verified** | 2026-05-19 (Brief #2 — 6 mascot SVGs, 1.6–2.2 KB, Universal Constraints PASS) |
| **Last RoadmapKeeper refresh** | 2026-05-19 (אחרי Brief #2 + ADR-011) |
| **Active blockers** | אין חוסם-Phase-1; נותרו Briefs #3–5 להשלמת Phase 0.5 |
| **Recent council** | R3.5 (Plan-Wide, 🟢 GO 17 patches) |
| **Recent design review** | **R-Design-1** (2026-05-19, 🔴 OFF-BRAND — P0-fixes בוצעו ב-CHG-009) |
| **Latest ADR** | ADR-015 (Logo Character Unification Policy) |

---

## תצוגת-על (ASCII Map)

```
[היום: Phase 0.5 — 30%]
   │
   ├── (1) השלמת Phase 0.5: Briefs #2–5
   │       └── PhaseGatekeeper DoD-check
   │
   ├── (2) Council R4 — Pre-Phase-1 Gate
   │       └── 4 חברים: AccessibilityInspector, PerfBudgetEnforcer, QualityAssurance, IntegrationVerifier
   │       └── + CouncilChair
   │
   ├── (3) Phase 1 — שלד + פרופילים
   │       └── PhaseGatekeeper → Council R5 (8/9 חברים)
   │
   ├── (4) Phase 2 — תבנית "click-targets" + 2 משימות
   │       └── 🧒 בדיקה עם הילדים → KIDS-FEEDBACK.md
   │       └── Council R6 (דגש ChildUXAdvocate + HebrewLinguist)
   │
   ├── (5) Phase 3 — שאר תבניות עכבר → R7
   │
   ├── (6) Phase 4 — PowerShell + Drive Sync
   │       └── ⚠️ OAuth setup מההורה (~30 דק')
   │       └── Council R8 (דגש SecurityAuditor + IntegrationVerifier)
   │
   ├── (7) Phase 5 — תבניות מקלדת → R9
   │
   ├── (8) Phase 6 — point-and-narrate
   │
   ├── (9) Phase 7 — השלמת 50 משימות (data)
   │
   ├── (10) Phase 8 — ליטוש (Lighthouse, animations)
   │
   └── (11) Phase 9 — אריזה + MVP
           └── Council R-Final (כל 8 + chair)
           └── 🎉 קיצור-דרך → הילדים משחקים
```

---

## פירוט שלבים

### Phase 0 — תשתית
- **סטטוס:** ✅ הושלם 2026-05-17
- **DoD-verified:** 2026-05-17 (manual, before Gatekeeper existed)
- **Deliverables:** 49 קבצים ב-GitHub, 22 docs, 9 sub-agents, 5 skills, 6 PS scripts
- **Owner:** Claude Code
- **Gate:** R1 + R2 (2 סבבי-מועצה)

---

### Phase 0.5 — מוקאפים עיצוביים
- **סטטוס:** 🟢 50%
- **Inputs:** `docs/spec/CLAUDE-DESIGN-BRIEFS.md` (5 Briefs + 2 stubs)
- **Deliverables:**
  - ✅ Brief #1.5 — לוגו Redux (Version B מסקוט-מלא; מחליף את Brief #1 שנפסל ב-R-Design-1)
  - ✅ Brief #2 — Mascot 6 poses (Local-First, ADR-011) → `assets/mascot/professor-chachmoni-{standing-wave,pointing,celebrating,thinking,encouraging,sleeping}.svg`
  - ⏳ Brief #4 — 12 אווטארים → `assets/avatars/avatar-{01..12}-{kind}.svg`
  - ⏳ Brief #3 — Welcome A/B → `design-mocks/02-welcome.html`
  - ⏳ Brief #5 — Task + Celebration → `design-mocks/11-task-click-balloons.html`, `12-success-celebration.html`
- **DoD:**
  - 6 mascot SVG ב-`assets/mascot/` (עודכן R3.5)
  - 12 avatars ב-`assets/avatars/`
  - 9 mock HTMLs ב-`design-mocks/` (כולל previews)
  - כל הקבצים עומדים ב-Universal Constraints (ADR-010)
  - אישור-ויזואלי-של-הורה פר-brief (פתיחת preview HTML בכרום)
- **Owner:** Claude Code (Local-First) + ההורה (אישור-ויזואלי)
- **Estimated:** 3 sessions × ~15 דק' = ~45 דק' (חיסכון של ~1:15 לעומת Bridge)
- **Gate:** R4

---

### Phase 1 — שלד + פרופילים
- **סטטוס:** ⏳ ממתין ל-Phase 0.5 + R4
- **Deliverables (`src/`):**
  - `index.html` (להחליף את הplaceholder)
  - `src/app.js` — State Machine 12 מצבים
  - `src/audio.js` — TTS he-IL 0.85 + speakOnHover + forbidden-words
  - `src/storage.js` — localStorage `chachmoni:*`
  - `src/db.js` — IndexedDB (קול AES-GCM + תמונות)
  - `src/profiles.js` — child + parent (CHG-005), gender, PIN PBKDF2
  - `src/photo-store.js` — magic-bytes + canvas → Blob
  - `src/backup.js` — Export/Import JSON
  - `src/ui/button.js` — textContent only, hover-to-replay
  - `src/ui/photo-uploader.js`, `src/ui/avatar-picker.js`
  - `src/browser-check.js`
  - `src/welcome.js` — First-Run wizard + Fast-Path + Guest
  - `styles/global.css` (import tokens), `styles/components.css`
- **DoD:**
  - כל הקבצים קיימים ועוברים syntax check
  - TTS עברי איטי עובד
  - hover על שם פרופיל מקריא את השם
  - יצירת פרופיל עם תמונה נשמרת אחרי refresh
  - PhaseGatekeeper 🟢
- **Owner:** Claude Code
- **Estimated:** 1.5–2 ימים
- **Gate:** R5 (8/9 חברים — כל המועצה חוץ מ-CouncilChair המסכם)

---

### Phase 2 — תבנית ראשונה + 2 משימות
- **סטטוס:** ⏳ ממתין ל-Phase 1 + R5
- **Deliverables:**
  - `src/templates/click-targets.js`
  - 2 משימות: `task-mouse-balloons` (קבועה) + 1 רנדומית
- **DoD:**
  - תבנית עובדת
  - 2 משימות נטענות
  - **🧒 בדיקה עם הילדים** + תיעוד ב-`docs/log/KIDS-FEEDBACK.md`
- **Owner:** Claude Code + ההורה (לבדיקת-ילדים)
- **Estimated:** ½ יום + session בדיקה
- **Gate:** R6 (דגש ChildUXAdvocate + HebrewLinguist + QualityAssurance)

---

### Phase 3 — שאר תבניות עכבר
- **סטטוס:** ⏳
- **Deliverables:**
  - `src/templates/hover-target.js`
  - `src/templates/double-click-reveal.js`
  - `src/templates/right-click-menu.js`
  - `src/templates/drag-drop-match.js`
  - 8 משימות נוספות (2 לכל תבנית)
- **DoD:** סה"כ ~12 משימות × ~5 ווריאציות = ~60 חוויות
- **Estimated:** 1.5 ימים
- **Gate:** R7

---

### Phase 4 — PowerShell Launcher + Drive Sync
- **סטטוס:** ⏳
- **Deliverables:**
  - `scripts/start-chachmoni.ps1` ✅ (קיים מ-Phase 0)
  - `src/sync/drive-auth.js` — OAuth flow
  - `src/sync/drive-sync.js` — upload/download `progress-{profileId}.json`
  - `src/sync/sync-status.js` — אינדיקטור בפינה
- **⚠️ פעולה מההורה:** OAuth Client Setup ב-Google Cloud (~30 דק')
- **DoD:**
  - התקדמות יואב נשמרת ב-`progress-yoav.json`
  - התקדמות ביתי ב-`progress-biti.json`
  - רענון → ייבוא אוטומטי
- **Estimated:** 1 יום
- **Gate:** R8 (דגש SecurityAuditor + IntegrationVerifier)

---

### Phase 5 — תבניות מקלדת
- **סטטוס:** ⏳
- **Deliverables:**
  - `src/templates/key-press.js` (זיהוי `keydown`)
  - `src/templates/type-word.js` (וויזואליזציה של מקלדת)
- **Estimated:** 2 ימים
- **Gate:** R9

---

### Phase 6 — point-and-narrate
- **סטטוס:** ⏳
- **Deliverables:** תבנית-קריינות לעולמות 3+4 (חלון, דפדפן, מושגים)
- **Estimated:** 1 יום
- **Gate:** (פנים)

---

### Phase 7 — השלמת 50 משימות
- **סטטוס:** ⏳
- **Deliverables:** עבודת data — `docs/spec/CONTENT.md` + `docs/spec/NARRATION.md`
- **Estimated:** 2 ימים
- **Gate:** (פנים)

---

### Phase 8 — ליטוש
- **סטטוס:** ⏳
- **Deliverables:**
  - אנימציות לפי `animation-choreography.md`
  - 11+ צלילי-עידוד (MP3)
  - מד-התקדמות פר-עולם
  - נעילות תוכן
  - מסך הישגי-סיום
  - אופטימיזציה — `scripts/audit.ps1` Lighthouse
- **Estimated:** 1 יום
- **Gate:** (פנים)

---

### Phase 9 — אריזה + MVP
- **סטטוס:** ⏳
- **Deliverables:**
  - כפתור "Export Data" + "Import Data" במסך-הגדרות
  - `scripts/install-shortcut.ps1` → קיצור "חכמוני" על שולחן-העבודה
  - `docs/guides/PARENT-GUIDE.md` עם הוראות-הפעלה
  - בדיקה end-to-end
- **⚠️ פעולה מההורה:** הפעלת install-shortcut.ps1 (~5 דק')
- **DoD:**
  - קיצור-דרך פותח את המשחק
  - יואב + ביתי יכולים לשחק לפחות תבנית-אחת בלי עזרה
  - Lighthouse: Performance ≥ 90, Accessibility ≥ 95
- **Gate:** R-Final (Full Council — כל 8 + chair)

🎉 **MVP חי בבית.**

---

## שערי-מועצה — מפרט

### R4 — Pre-Phase-1 Gate
- **מתי:** אחרי השלמת Phase 0.5
- **הרכב:** AccessibilityInspector, PerfBudgetEnforcer, QualityAssurance, IntegrationVerifier + CouncilChair
- **Focus:** Re-verification של 14 patches מ-R3 + סקירת CHG-005 ע"י סוכנים שלא ראו
- **GO criteria:** 4/4 PASS או 3/4 PASS + 1 WARNING קל

### R5 — Post-Phase-1
- **מתי:** אחרי PhaseGatekeeper 🟢 על Phase 1
- **הרכב:** 8/9 (כל המועצה חוץ מ-chair המסכם) — קוד אמיתי ראשון
- **Focus:** CodeReviewer + SecurityAuditor + IntegrationVerifier על `src/` חדש
- **GO criteria:** רוב PASS, אין FAIL

### R6, R7, R8, R9 — Post-Phase-N
- כל אחד עם הרכב מותאם לדומיין

### R-Final — Pre-MVP-Delivery
- **מתי:** סיום Phase 9
- **הרכב:** Full Council (8 + chair)
- **Focus:** כל הדומיינים בבדיקת-מסירה
- **GO criteria:** כל PASS, או 7/8 PASS + 1 WARNING קל

---

## תלויות-הורה

| # | מתי | מה | משך |
|---|------|-----|------|
| 1 | עכשיו | Briefs #2–5 (claude.ai web) | ~2 שעות מצטבר |
| 2 | Phase 4 | OAuth Client ב-Google Cloud | ~30 דק' |
| 3 | Phase 9 | install-shortcut.ps1 | ~5 דק' |
| 4 | Post-MVP (אופציונלי) | Anthropic API + billing cap | ~5 דק' |

**סה"כ עבודה ידנית של ההורה לאורך הפרויקט: ~3 שעות מצטברות.**

---

## drift log

| Date | Phase | Change | Reason | Re-baseline? |
|------|-------|--------|---------|---------------|
| 2026-05-18 | (init) | יצירת ROADMAP.md | אין SSoT תפעולי. PLAN.md גדול מדי לשימוש-יום-יום | לא |
| 2026-05-19 | (R3.5) | 17 patches יושמו (8 P0 + 9 P1) | סבב-מועצה רוחבי על כל הרבדים אחרי שדרוג הצוות | לא — ETA לא השתנה |
| 2026-05-19 | 0.5 | DoD איכות הbriefs הועלה (Universal Constraints) | R3.5 הוסיף security/a11y/perf constraints. Brief #2 הורחב ל-6 poses | לא |
| 2026-05-19 | 0.5 | Brief #2 הושלם (6 mascot SVGs, Local-First) + ADR-011 | Local-First Path אומץ כברירת-מחדל; Bridge הפך fallback | קל — חיסכון ~1 יום ב-MVP ETA |
| 2026-05-19 | 0.5 | Brief #2 הוחלף לגרסת claude.ai/design (R3.6 A/B) | Option B נבחר ע"י ההורה אחרי A/B comparison; איכות-עיצוב משמעותית עדיפה | אין |
| 2026-05-19 | 0.5 | BUG-001 תוקן (Hebrew SVG RTL ב-7 קבצי-לוגו) | text-anchor="end" + bidi עברי = טקסט-זולג; פטר על-ידי direction="rtl" + text-anchor="start" | אין |
| 2026-05-19 | 0.5 | ADR-013 + CHG-008: סטודיו-עיצוב הוקם (7 sub-agents, 18 סה"כ) | אי-עקביות לוגו≠מסקוט חשפה גאפ בצוותים — אין role על אסתטיקה | אין |
| 2026-05-19 | 0.5 | R-Design-1: 🔴 OFF-BRAND — Brief #1.5 חוסם Phase 1 | 2 FAIL + 3 NEEDS-PATCH; דורש Brief #1.5 + ADR-014 | קל — +30 דק' ההורה + +15 דק' Claude Code |
| 2026-05-22 | 0.5 | CHG-009: ADR-014 הוטמע ב-tokens.css + Brief #1.5 נכתב | ביצוע P0-fixes של R-Design-1 אחרי אישור-הורה | לא — ETA לא השתנה |
| 2026-05-23 | 0.5 | Brief #1.5 נמסר ושולב — לוגו חדש (Version B מסקוט-מלא) פעיל; ADR-015 נוסף | claude.ai/design השלים את Brief #1.5; ההורה בחר B | לא — Phase 0.5 → 50% |

---

## עקרונות-יסוד

1. **ROADMAP < PLAN** — סתירה? PLAN גובר.
2. **drift log אסור למחוק** — היסטוריה היא נכס.
3. **כל סבב-מועצה מוסיף שורת "drift impact"** — אחרי כל R-N.
4. **שינוי-תכולה דורש ADR** — לא בשקט (ראה ROADMAP-CONTROL.md).
5. **RoadmapKeeper הוא custodian** — מסנכרן, לא מחליט.

---

**מסמך זה הוא פעיל וחי.** נכון לתאריך: 2026-05-18.
