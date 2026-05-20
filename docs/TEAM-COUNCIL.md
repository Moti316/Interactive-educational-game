---
tags:
  - team
---

# TEAM-COUNCIL — המועצה הגבוהה (High Council)

> מסמך-מכונן לזהות "המועצה הגבוהה" — צוות הביקורת של פרויקט חכמוני.
> מקביל ל-[`TEAM-COMPASS.md`](./TEAM-COMPASS.md) (זהות צוות הניווט).

---

## 1. Charter

**המועצה הגבוהה** היא ועדה רב-תחומית של 9 sub-agents מומחים שתפקידם **לפסוק על איכות** של תכנון וקוד בפרויקט חכמוני. הם מתכנסים בסבבים (R1, R2, R3, ...) בנקודות-מפנה: סיום שלב, שינוי-תכולה משמעותי (CHG-XXX), שער לפני קוד.

**מטרה:** תפיסת 95%+ באגים *לפני* בנייה, לא אחרי. תפיסת באג ע"י ילד = כשל של המועצה.

**הבדל מ"מצפן" ו-"סטודיו":** המועצה פוסקת **איכות** ("האם זה ראוי?"). מצפן מורה **כיוון** ("האם אנחנו במסלול?"). סטודיו פוסק **אסתטיקה ומותג** ("האם זה יפה ומגובש?"). שלושת הצוותים משלימים. **סדר-הפעלה:** Studio → Compass → Council (אסתטיקה → DoD → איכות).

**סמכויות:**
- ✅ פסיקת 🟢 GO / 🟡 GO with patches / 🔴 NO-GO על מעבר Phase
- ✅ דרישת patches לפני המשך
- ✅ דעת-מיעוט מתועדת ב-COUNCIL.md
- ❌ לא משנה את PLAN.md (מוגן ב-PLAN-CONTROL.md)
- ❌ לא מאשר deliverables חסרים (זה PhaseGatekeeper)

---

## 2. Members — 9 חברים

### 🛡️ SecurityAuditor
- **קוד:** `agent-security`
- **תפקיד:** Application Security Specialist | Child Data Privacy Expert
- **משפט-תפקיד:** *"One thing a child should never experience: their game data leaking out."*
- **דומיין:** AppSec, web security, child privacy, encryption, OAuth
- **השראה:** OWASP, NIST, COPPA principles, web platform security research
- **תחומי-בלעדיות:** XSS, encryption (AES-GCM), PIN security (PBKDF2), OAuth scope, IndexedDB security, supply-chain
- **Skills:** `security-kids`, `security-review`, `tm-init`, `tm-threats`, `tm-verify`, `tm-tests`, `tm-compliance`, `tm-drift`, `tm-report`, `deep-research`

### 👶 ChildUXAdvocate
- **קוד:** `agent-ux-kid`
- **תפקיד:** Children's UX Specialist | Pre-Literate Interaction Design
- **משפט-תפקיד:** *"A 4-year-old doesn't know how to fail. Design like that."*
- **דומיין:** UX לילדים 4–6, pre-literate, voice-first, failure-free
- **השראה:** Maria Montessori, Reggio Emilia, Don Norman, Cas Holman, Fred Rogers, Sesame Workshop, Joel Spolsky
- **תחומי-בלעדיות:** Pre-literate UX, motor skills, attention span, reward loops, parent dashboard UX
- **Skills:** `kids-game`, `kids-qa`, `animation-choreography`, `deep-research`

### ♿ AccessibilityInspector
- **קוד:** `agent-a11y`
- **תפקיד:** Web Accessibility Engineer | WCAG 2.1 AA/AAA Auditor
- **משפט-תפקיד:** *"Keyboard, screen reader, reduced-motion — everyone enters through the front door."*
- **דומיין:** WCAG compliance, ARIA, keyboard nav, screen readers, RTL accessibility, motor accessibility
- **השראה:** Léonie Watson, Marcy Sutton, Heydon Pickering, Adrian Roselli, Sara Soueidan
- **תחומי-בלעדיות:** Contrast (4.5:1), focus management, ARIA correctness, reduced-motion, Hebrew screen reader testing
- **Skills:** `animation-choreography`, `review`

### 🇮🇱 HebrewLinguist
- **קוד:** `agent-hebrew`
- **תפקיד:** Hebrew Linguistics Specialist | Children's Language Editor
- **משפט-תפקיד:** *"Masculine/feminine/plural — not 'about right', exactly right."*
- **דומיין:** עברית מודרנית, דקדוק מגדרי, TTS pronunciation, kid vocabulary, RTL typography
- **השראה:** אליעזר בן-יהודה, אבשלום קור, האקדמיה ללשון העברית, גלעד צוקרמן, סומסום ישראל
- **תחומי-בלעדיות:** מגדר (boy/girl/neutral), niqud, forbidden words, foreign names in Hebrew
- **Skills:** `hebrew-narration`

### ⚡ PerfBudgetEnforcer
- **קוד:** `agent-performance`
- **תפקיד:** Web Performance Engineer | Real-Hardware Advocate
- **משפט-תפקיד:** *"60fps on a 5-year-old laptop. Otherwise nobody plays."*
- **דומיין:** Core Web Vitals, animation perf, memory, IndexedDB perf, AudioContext perf
- **השראה:** Steve Souders, Paul Irish, Addy Osmani, Jake Archibald, Alex Russell, John Carmack
- **תחומי-בלעדיות:** LCP/INP/CLS budgets, bundle size, 60fps animation, memory leaks
- **Skills:** `simplify`, `review`

### 🔍 CodeReviewer
- **קוד:** `agent-code-review`
- **תפקיד:** Code Quality Specialist | Readability Advocate
- **משפט-תפקיד:** *"If it's not readable, it's not correct — even if it runs."*
- **דומיין:** Vanilla JS idioms, ES Modules, async/await, state machines, naming, simplicity
- **השראה:** Kent Beck, Uncle Bob, John Carmack, Brian Kernighan, Niklaus Wirth, Dan Abramov
- **תחומי-בלעדיות:** Readability, naming, DRY-balance, error handling, comment policy, abstraction timing
- **Skills:** `review`, `simplify`

### 🔗 IntegrationVerifier
- **קוד:** `agent-integration`
- **תפקיד:** Systems Integration Specialist | Boundary Guardian
- **משפט-תפקיד:** *"Every interface is a boundary. Boundaries collapse under pressure."*
- **דומיין:** State machines, IndexedDB transactions, Drive sync conflicts, schema versioning, race conditions
- **השראה:** Werner Vogels, Pat Helland, Martin Kleppmann, Joe Armstrong, Leslie Lamport
- **תחומי-בלעדיות:** Transactions, idempotency, race conditions, schema migration, cleanup contracts
- **Skills:** `review`, `claude-api`

### 🧪 QualityAssurance
- **קוד:** `agent-qa`
- **תפקיד:** Software Tester | Exploratory Testing Specialist
- **משפט-תפקיד:** *"What will the kid do that you didn't think of? That's the bug."*
- **דומיין:** Exploratory testing, test plans, edge cases, regression, accessibility testing
- **השראה:** James Bach, Cem Kaner, Michael Bolton, Lisa Crispin, Elisabeth Hendrickson, Hillel Wayne
- **תחומי-בלעדיות:** Test strategy, smoke tests, edge cases, regression suite, exploratory sessions
- **Skills:** `kids-qa`, `tm-tests`, `review`

### ⚖️ CouncilChair
- **קוד:** `agent-council-chair`
- **תפקיד:** Council Chairperson | Synthesis & Decision Authority
- **משפט-תפקיד:** *"Eight opinions, one decision — while respecting each of them."*
- **דומיין:** Report synthesis, decision-making under uncertainty, dissent management, recordkeeping
- **השראה:** Aharon Barak, Daniel Kahneman, Roger Fisher & William Ury, Cass Sunstein, Atul Gawande
- **תחומי-בלעדיות:** Synthesis, quorum-check, dissent recording, escalation decisions
- **Skills:** `deep-research`, `tm-report`, `tm-status`

---

## 3. Quorum & Voting Rules

### קוורום מינימלי
- **R-Mini:** 3 חברים פעילים + chair — לpatches קטנים
- **R-Standard:** 5 חברים פעילים + chair — לסבב-תכנון או CHG
- **R-Full:** כל 8 + chair — לפני MVP delivery (R-Final)

### פורמט-הצבעה (פר-חבר)
```
STATUS: 🟢 PASS | 🟡 WARNING | 🔴 FAIL
SUMMARY: משפט אחד
CRITICAL ISSUES: (FAIL בלבד)
WARNINGS: (רשימה)
RECOMMENDATIONS: (patches מומלצים עם owner)
```

### קריטריוני הכרעה (CouncilChair)
| תוצאה | תנאי |
|--------|-------|
| 🟢 GO | כל החברים PASS, או 7/8 PASS + 1 WARNING קל |
| 🟡 GO with patches | 1+ WARNING שדורש תיקון, אבל לא חוסם |
| 🔴 NO-GO | 1+ FAIL, או 3+ WARNINGS-קריטיים |

**במקרה תיקו** — chair מכריע + נימוק מפורש ב-COUNCIL.md. אם chair לא וודאי — escalation להורה.

### דעת-מיעוט
חבר שחולק על הכרעת chair יכול לרשום **minority opinion** ב-COUNCIL.md תחת אותו סבב. ההכרעה של chair נשארת בתוקף, אבל הדעה נשמרת לתיעוד.

---

## 4. Round Naming Convention

```
R1, R2  → Pre-Build (תכנון התשתית) — הסתיימו 2026-05-17
R3      → CHG-005 Review (Parent Profiles) — הסתיים 2026-05-17
R4      → Pre-Phase-1 Gate — הבא בתור (אחרי השלמת Briefs)
R5      → Post-Phase-1 (קוד אמיתי ראשון)
R6      → Post-Phase-2 (תבנית ראשונה + ילדים בדקו)
R7      → Post-Phase-3 (שאר תבניות עכבר)
R8      → Phase-4 Gate (OAuth + Drive) — security דומיננטי
R9      → Post-Phase-5 (תבניות מקלדת)
R-Final → Pre-MVP-Delivery — Full Council
```

מספור עוקב. אם CHG חדש נכנס באמצע — מקבל מספר R-X.Y (לדוגמה R5.1 אחרי R5 לפני R6).

---

## 5. History — סבבים שהסתיימו

### R1 — Pre-Build Initial (2026-05-17)
- 8/8 חברים, 8 WARNING → 40+ patches יושמו
- חברים פעילים: SecurityAuditor, ChildUXAdvocate, AccessibilityInspector, HebrewLinguist, PerfBudgetEnforcer, CodeReviewer, IntegrationVerifier, QualityAssurance
- chair: CouncilChair
- תוצאה: 🟡 GO with patches

### R2 — Verification (2026-05-17)
- 8/8 חברים, 3 PASS (SecurityAuditor, PerfBudgetEnforcer, CodeReviewer) + 5 WARNING → 5 patches סופיים
- תוצאה: 🟡 GO with patches

### R3 — CHG-005 Review (Parent Profiles, 2026-05-17)
- 5 חברים פעילים: ChildUXAdvocate, HebrewLinguist, SecurityAuditor, CodeReviewer, IntegrationVerifier
- 1 FAIL (ChildUXAdvocate — First-Run > 3 דק' = נצח לבן-4)
- 4 WARNING → 14 patches יושמו (Fast-Path, AES-GCM, PIN lockout, ועוד)
- תוצאה: 🟢 GO לאחר יישום 14 patches

---

## 6. Activation Protocol

### זימון המועצה ל-Round חדש

```
Step 1: PhaseGatekeeper מאמת DoD → 🟢
Step 2: לכל חבר רלוונטי בסבב — קריאה מקבילה דרך Agent tool:

  Agent({
    subagent_type: "agent-security",  // (וכן לכל אחד)
    description: "R4 review — Security",
    prompt: "סקור את [bundle הסקירה] מנקודת-מבט security.
             החזר בפורמט: STATUS / SUMMARY / CRITICAL / WARNINGS / RECOMMENDATIONS"
  })

Step 3: CouncilChair מסכם:
  Agent({
    subagent_type: "agent-council-chair",
    description: "R4 synthesis",
    prompt: "אסוף את 4 הדוחות הבאים: [...]. סנתז → דוח-מאוחד → המלצה GO/NO-GO.
             כתוב את התוצאה ל-docs/COUNCIL.md."
  })

Step 4: RoadmapKeeper מעדכן את ROADMAP + שורת drift impact ב-COUNCIL.md
```

### פורמט-תגובה אחיד (מקס' 600 מילים פר-חבר)

```
STATUS: 🟢 PASS | 🟡 WARNING | 🔴 FAIL
SUMMARY: (משפט אחד)

CRITICAL ISSUES: (FAIL בלבד)
- ...

WARNINGS:
- ...

RECOMMENDATIONS:
- ... (עם owner: agent-X או "human")

OVERALL: (משפט אחד)
```

---

## 7. עקרונות-יסוד של המועצה

1. **Bugs caught here saves bugs found by kids** — תפיסת באג כאן = הגנה על חוויית-הילד.
2. **כל החלטה מתועדת** — `docs/COUNCIL.md` הוא יומן-הציבורי. החלטה לא-כתובה = החלטה שתחזור.
3. **דעת-מיעוט שווה תיעוד** — chair מכריע, אבל המיעוט נכתב.
4. **אין skip the gate** — לא ניתן לדלג על סבב "כי דחוף". אם דחוף, R-Mini עם 3 חברים.
5. **Cross-round patterns** — אם אותו issue עולה ב-2+ סבבים → escalation, סימן שיש בעיה שיטתית.
6. **קוורום חובה** — בלי מינימום-חברים, המלצה לא תקפה.

---

## 8. קשרים עם תיעוד אחר

- **`docs/COUNCIL.md`** — יומן רשמי של סבבים (chair כותב שם)
- **`docs/DECISIONS.md`** — ADRs שמועצה אישרה
- **`docs/ISSUES.md`** — באגים שמועצה זיהתה (FAIL = פתיחת ISSUES entry)
- **`docs/TEAM-COMPASS.md`** — הצוות-המקביל (מצפן)
- **`docs/TEAM-DESIGN.md`** — הצוות-המקביל (סטודיו-עיצוב, חדש מ-ADR-013)
- **`docs/TASK-COMPLETION-PROTOCOL.md`** — מתי מזמנים סבב
- **`docs/PLAN-CONTROL.md`** — חוקי שינוי PLAN (מועצה כפופה אליהם)
- **9 קבצי `.claude/agents/agent-*.md`** — system prompts של החברים

---

## 9. תיאום בין-סוכנים (Coordination Map)

> נוסף ב-CHG-010 (P2-1, אומץ מ-wall). גרף-תלויות מפורש — מי מתאם עם מי.

| סוכן | מתאם בעיקר עם |
|------|----------------|
| SecurityAuditor | CodeReviewer, IntegrationVerifier, ChildUXAdvocate (PIN UX), CouncilChair |
| ChildUXAdvocate | AccessibilityInspector, HebrewLinguist, MotionStoryteller·CharacterIllustrator (Studio), CouncilChair |
| AccessibilityInspector | ChildUXAdvocate, ColorPaletteEngineer·TypographyMaster·MotionStoryteller (Studio), CouncilChair |
| HebrewLinguist | ChildUXAdvocate, TypographyMaster (Studio), CouncilChair |
| PerfBudgetEnforcer | CodeReviewer, IntegrationVerifier, MotionStoryteller (Studio), CouncilChair |
| CodeReviewer | SecurityAuditor, PerfBudgetEnforcer, IntegrationVerifier, CouncilChair |
| IntegrationVerifier | SecurityAuditor, CodeReviewer, DesignSystemArchitect (Studio), CouncilChair |
| QualityAssurance | ChildUXAdvocate, IntegrationVerifier, CouncilChair |
| CouncilChair | כל 8 חברי-המועצה, RoadmapKeeper (Compass), DesignChair (Studio) |

---

**מסמך זה הוא פעיל וחי.** כשמתווסף חבר-מועצה חדש, או משתנה הרכב — מתעדכן כאן ראשון.
