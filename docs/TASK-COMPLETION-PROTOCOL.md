# TASK-COMPLETION-PROTOCOL

> פרוטוקול אישור סיום-משימה ודיווח להורה.
> מסמך-מכונן: מגדיר **מתי משימה "done"**, מי מאמת, ואיך מדווחים חזרה.

---

## 1. סוגי משימות (Task Types)

| סוג | תיאור | משך טיפוסי | אישור-הורה? |
|-----|--------|--------------|----------------|
| **Phase** | שלב רב-יומי לפי PLAN.md (1–9) | יום–שבועיים | ✋ חובה לפני המעבר |
| **Brief** | תוצר עיצובי דרך claude.ai web | ~30 דק' (הורה) | ⚙️ דיווח-בלבד |
| **Patch** | תיקון קטן מממצא-מועצה | דקות–שעה | ⚙️ אוטומטי |
| **Sub-task** | שינוי קוד/תיעוד יחיד בתוך Phase | דקות | ⚙️ אוטומטי |
| **Setup** | תשתית חד-פעמית (כמו הקמת Compass) | שעה–יום | ✋ חובה |

---

## 2. Definition-of-Done Matrix

### Phase (1–9)
**done** ⇔ כל הבאים מתקיימים:
- כל הקבצים מ-ROADMAP.md (סעיף "Deliverables") קיימים במיקום הנכון
- כל ה-Sub-tasks ב-`docs/TASKS.md` סומנו `[x]`
- כל הבדיקות מ-`docs/TESTING.md` עברו
- PhaseGatekeeper החזיר 🟢
- Council Round (R-N) החזיר 🟢 GO או 🟡 GO with patches
- `docs/PROGRESS.md` עודכן (% → 100, status → ✅)
- `docs/CHANGELOG.md` כולל רשומה חדשה
- ROADMAP.md משקף את הסטטוס החדש
- commit + push עברו ל-`main`

### Brief
**done** ⇔:
- כל קבצי-היעד קיימים בנתיב הנכון (לפי TASKS.md)
- `scripts/check-contrast.ps1` עבר (אם רלוונטי לעיצוב)
- `docs/CHANGELOG.md` כולל רשומה
- commit + push עברו

### Patch
**done** ⇔:
- השינוי בקוד או בתיעוד בוצע
- Council Round רלוונטית סימנה את ה-patch כ-✓
- `docs/CHANGELOG.md` כולל רשומה
- אם הוא תיקון-בקוד: CodeReviewer + (אם רלוונטי) SecurityAuditor אישרו

### Sub-task
**done** ⇔:
- השינוי בוצע + עבר self-check
- `docs/TASKS.md` סומן `[x]`
- commit (יכול להיות חלק מ-batch של Phase)

### Setup
**done** ⇔:
- כל הקבצים החדשים קיימים
- שני סוכני Compass רצו בהצלחה לאימות
- אישור-הורה מפורש לפני commit ל-`main`

---

## 3. Verification Chain (שרשרת אימות פר-סוג)

```
Phase:
  Claude self-check
    → PhaseGatekeeper (DoD)
    → Council Round (איכות)
    → RoadmapKeeper (ROADMAP sync)
    → ✋ User approval
    → commit + push

Brief:
  Parent self-check (artifact קיים, נכון)
    → RoadmapKeeper auto-update
    → Auto-notify user (⚙️)

Patch:
  Claude self-check
    → CodeReviewer (if code change)
    → RoadmapKeeper (drift impact)
    → Auto-report (⚙️)

Sub-task:
  Claude self-check
    → Auto-report (⚙️)

Setup (like THIS one):
  Claude self-check
    → Both Compass agents test-run
    → ✋ User approval
    → commit + push
```

---

## 4. Approval Gates — מתי נדרש אישור-מפורש שלך

### ✋ חובה לקבל אישור-מפורש

| מקרה | למה |
|------|-------|
| מעבר Phase N → N+1 | החלטה אסטרטגית, blast radius גדול |
| Re-baseline של ROADMAP | שינוי-תכולה משמעותי |
| ADR חדש (DECISIONS.md) | החלטה ארכיטקטונית קבועה |
| Council החזיר 🔴 NO-GO | משהו לא תקין יסודית |
| הוצאה כספית | Anthropic API, שירותים חדשים |
| שינוי PLAN-CONTROL / ROADMAP-CONTROL | חוקי-המשחק עצמם |
| פעולה הרסנית | delete files, git reset, force-push |
| התקנת dependency חדשה | אסור ב-Vanilla approach |

### ⚙️ לא דורש אישור (פעולה אוטומטית עם דיווח)

| מקרה | למה |
|------|-------|
| Patches אוטומטיים שלא משנים סקופ | פעולה-שגרה |
| עדכוני-תיעוד שגרתיים (PROGRESS, CHANGELOG) | חלק מהcommit |
| RoadmapKeeper refreshes | תפקיד הסוכן |
| Commits של תיקוני-באג קטנים שהמועצה דרשה | כבר מאושר ע"י מועצה |
| הפעלת skills built-in | חלק מעבודת-הסוכן |

---

## 5. Report Format — פורמט-דיווח אליך

תבנית קבועה, קצרה, סורקת. הדיווח חוזר אליך **בעברית, בצ'אט**, אחרי כל אירוע משמעותי:

```markdown
## [סוג-משימה] [שם-משימה] — [סטטוס emoji]

**מה נעשה (3-5 בולטים):**
- ...

**מה הבא:**
[משפט אחד]

**דרוש אישורך?** ✅ כן / ❌ לא
[אם כן: על מה בדיוק]

**קבצים שהשתנו:**
- path/to/file1.ext
- path/to/file2.ext

**סבב-מועצה:** R-N (🟢 GO / 🟡 WARNING / 🔴 NO-GO) — אם רלוונטי
**Roadmap drift:** ללא / +X ימים / re-baseline נדרש — אם רלוונטי
```

**עקרון:** הדיווח חייב להיקרא ב-30 שניות. ההורה לא צריך לקרוא את הקוד כדי להבין מה קרה.

---

## 6. Audit Trail — שרשרת תיעוד אוטומטית

| אירוע | קבצים שמתעדכנים |
|--------|----------------------|
| סיום Phase | `PROGRESS.md` + `COUNCIL.md` + `CHANGELOG.md` + `ROADMAP.md` |
| סיום Brief | `PROGRESS.md` + `CHANGELOG.md` |
| Patch | `CHANGELOG.md` (+ `ISSUES.md` אם פותר באג) |
| Re-baseline | `ROADMAP.md` (drift log) + `DECISIONS.md` (אם ADR) |
| Council Round | `COUNCIL.md` (חדש) + `ROADMAP.md` (impact line) |
| Setup | `CHANGELOG.md` + `DECISIONS.md` (ADR) |

**עקרון:** כל אירוע משמעותי משאיר עקבות **בלי תלות בזיכרון של Claude Code**. אם נחזור לפרויקט אחרי שבועיים, נוכל לדעת מה קרה.

---

## 7. תרחישי-קצה (Edge Cases)

### 🔄 קונפליקטים פנימיים בין-סוכנים
- **PhaseGatekeeper 🔴 vs. Claude סבור שגמר** → ISSUES.md entry, חזרה לעבודה. אסור לעקוף.
- **Council חלוקה (4 PASS + 4 FAIL)** → CouncilChair חייב להכריע + לתעד נימוק. אם chair לא וודאי → אישור-הורה.
- **Gatekeeper 🟢 אבל Council אחר-כך מוצא issue קריטי** → תיקון מיידי + retrospective: "למה Gatekeeper פספס?" → עדכון DoD-checklist.
- **חבר-מועצה חולק על Chair** → minority opinion ב-COUNCIL.md, ההכרעה של Chair נשארת.
- **ADR קיים מתנגש עם ממצא-מועצה חדש** → ADR חדש דורש אישור-הורה. הישן SUPERSEDED.

### ⚙️ כשלים טכניים של סוכן
- **RoadmapKeeper נכשל / שגיאה** → retry אחד. אם שוב → דיווח-קצר + המשך-עבודה ידני, סימן "keeper-stale" ב-PROGRESS.
- **חבר-מועצה לא זמין** → אם non-critical לסבב — ממשיכים ומסמנים. אם critical (לדוגמה SecurityAuditor ב-OAuth) — סבב נדחה.
- **RoadmapKeeper מזהה drift > 50%** → דורש Re-baseline session עם ההורה.

### 👤 אינטראקציות עם ההורה
- **ההורה דוחה אישור-מעבר** → קוד נשאר ב-branch מקומי. אסור commit ל-main עד אישור.
- **ההורה דוחה Re-baseline → drift ממשיך** → סימן `unmitigated drift` + warning בכל דוח עתידי + ETA מעודכן.
- **ההורה לא זמין > 72 שעות** → Claude מסיים עבודות בטוחות בלבד (תיעוד, פצ'ים non-scope). approval queue מוצג בדוח-אחד בחזרה.
- **"דלג על הסבב הזה"** → לא מבוצע. Alternative: סבב מקוצר (3 סוכנים) עם תיעוד-החריגה ב-DECISIONS.md.

### 🎨 כשלי-תוכן ועיצוב
- **Brief artifact חלקי/פגום** → לא מקבלים. ההורה חוזר ל-claude.ai. RoadmapKeeper לא מעדכן 100%.
- **Brief נכשל בניגודיות** (`check-contrast.ps1`) → לא מקבלים. דוח עם רשימת צבעים בעייתיים.
- **Brief מציע פתרון שמנוגד לעקרון-קוד** → SecurityAuditor חוסם. דוח-הסבר.

### 🔀 שינויי-תכולה
- **CHG-XXX באמצע Phase פעיל** → backlog, יוצג בסיום-Phase. אם דחוף (security/safety) → exception, ההורה מאשר.
- **CHG-XXX סותר את PLAN.md** → דרוש ADR + סבב-מועצה. PLAN-CONTROL.md מנהל.

### 🌐 כשלים חיצוניים
- **OAuth Client ID פג** (Phase 4+) → המשחק offline, "Drive sync disabled". הוראות-רענון להורה.
- **Drive quota הוצף** → דיווח + blocker ב-ROADMAP. אסור לכתוב עד פתרון.
- **IndexedDB quota הוצף** → אסור uploads חדשים עד אישור-מחיקה.
- **Chrome update שבר משהו** → ISSUES.md + hotfix. דיווח דחוף אם חוסם.
- **PowerShell script נכשל** → דיווח עם הצעת-debug. לא חוסם Phase שלא דורש את הסקריפט.

### 🧒 משוב מהילדים (Phase 2+)
- **יואב/ביתי מוצאים באג בproduction** → `KIDS-FEEDBACK.md` entry → retrospective: "למה QA פספסה?" → עדכון תסריטי-בדיקה. אם חמור → hotfix מיידי.
- **בדיקה עם ילדים חושפת פגם-עיצוב יסודי** → ראיון ChildUXAdvocate, אפשרות לCHG חדש.

### ⚠️ סיטואציות-חירום
- **דליפת-מידע פוטנציאלית** → SecurityAuditor + ההורה התראה אדומה מיידית. כל פיתוח עוצר. ADR-חירום + retrospective חובה.
- **Git repo corrupted / לא ניתן ל-push** → Claude עוצר commits, הוראות-recovery (`docs/RECOVERY.md`).
- **Multi-parent disagreement** (CHG-005) → לפי PIN-holder admin. אם שניהם admin → דיון נדרש.

---

## 8. עקרונות-יסוד של הפרוטוקול

1. **Done means done** — אין "כמעט", אין "בסך-הכל".
2. **Evidence over assertion** — לא "אני סומך"; ראיתי את הקובץ במיקום X.
3. **Audit trail אוטומטי** — כל אירוע משאיר עקבות, גם אם אף אחד לא קורא אותם עכשיו.
4. **Approval gates שקופים** — ההורה יודע מראש איזה דברים ידרשו את אישורו.
5. **דיווח קצר** — 30 שניות לקריאה. אם ארוך — לא ייקרא.
6. **אין skip the protocol** — חריגה דורשת תיעוד מפורש ב-DECISIONS.md.

---

**מסמך זה הוא פעיל וחי.** עדכונים לפרוטוקול דורשים ADR ב-DECISIONS.md.
