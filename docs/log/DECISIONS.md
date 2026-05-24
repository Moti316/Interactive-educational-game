---
tags:
  - log
---

# DECISIONS — ADR (Architecture Decision Records)

## תבנית-ADR (חובה מ-ADR-014 ואילך)

> אומץ מפרויקט wall (CHG-010). ADR-001–013 דקים — ייתכן backfill עתידי.
> כל ADR חדש נכתב בתבנית-העשירה:

```markdown
## ADR-NNN | YYYY-MM-DD | כותרת
**סטטוס:** מאושר / מוצע / נדחה · **בעלים:** agent-slug / human

**הקשר:** מה המצב, מה הכוח-המנוגד, למה צריך להכריע.

**ההחלטה:** מה הוחלט — מפורש וניתן-לביצוע.

**אכיפה:** איך ההחלטה נאכפת בפועל (CI, review, constraint, מי בודק).

**השלכות:** חיובי — ... · שלילי — ... (שתי הפנים, בכנות).

**אלטרנטיבות שנדחו:** X (למה נדחה) · Y (למה נדחה).
```

---

> **הערה (CHG-010, P2-3):** ADR-001–006 עברו backfill לתבנית-העשירה ב-2026-05-20.
> השדות הורחבו רק עם תוכן אמיתי-ניתן-לגזירה מהמקור — סעיפים שלא תועדו במקור
> מסומנים מפורשות. ADR-007–009 נשארו כפי שהם (מובְנים דיים).

## ADR-001 | 2026-05-17 | Vanilla JS, ללא React/Vite
**סטטוס:** מאושר · **בעלים:** human (החלטת-יסוד)
**הקשר:** משחק-דפדפן פשוט למשפחה אחת. הכוח-המנוגד: framework מודרני מאיץ פיתוח-UI מורכב, אך מוסיף build step, תלות-Node, ומורכבות שאינה מוצדקת לפרויקט בקנה-מידה כזה.
**ההחלטה:** Vanilla HTML/CSS/JS + ES Modules. ללא build step.
**אכיפה:** CLAUDE.md §"עקרונות קוד" אוסר npm/React/build. CodeReviewer בודק בכל סבב.
**השלכות:** חיובי — אפס build, פשטות, קל-לתחזוקה למשפחה. שלילי — אין component-framework; דפוסי-UI נכתבים ידנית.
**אלטרנטיבות שנדחו:** React/Vue (overkill לקנה-המידה); Svelte (מעניין, אך דורש compile).

## ADR-002 | 2026-05-17 | localStorage + IndexedDB, ללא backend
**סטטוס:** מאושר · **בעלים:** human
**הקשר:** המשחק רץ במחשב-בית אחד. נדרש אחסון-state מתמשך + אחסון blob (קול, תמונות). הכוח-המנוגד: DB אמיתי נותן שאילתות, אך מצריך backend ופוגע בפרטיות.
**ההחלטה:** localStorage ל-state, IndexedDB ל-blobים.
**אכיפה:** prefix `chachmoni:*` ל-localStorage (CLAUDE.md). IntegrationVerifier בודק schema.
**השלכות:** חיובי — אפס backend, פרטיות מירבית, נתונים נשארים במכשיר. שלילי — אין שאילתות חוצות-מכשיר; sync דורש פתרון נפרד (ראה ADR-004).
**אלטרנטיבות שנדחו:** backend DB (פוגע בפרטיות, מצריך תחזוקת-שרת).

## ADR-003 | 2026-05-17 | Local-only + PowerShell Launcher, ללא Vercel
**סטטוס:** מאושר · **בעלים:** human
**הקשר:** המשחק צריך לרוץ מקומית. הכוח-המנוגד: `file://` פשוט אך לא תומך ב-ES Modules ו-OAuth; hosting (Vercel) מוסיף חשיפה-ציבורית מיותרת.
**ההחלטה:** PowerShell `HttpListener` על `localhost:8080`.
**אכיפה:** `scripts/start-chachmoni.ps1`. CLAUDE.md דורש הרצה דרך ה-launcher, לא `file://`.
**השלכות:** חיובי — ES Modules + OAuth עובדים, אפס חשיפה-ציבורית, אבטחה מירבית. שלילי — תלות ב-PowerShell; ההורה מריץ סקריפט להפעלה.
**אלטרנטיבות שנדחו:** `file://` (אין ES Modules/OAuth); Vercel/hosting (חשיפה-ציבורית מיותרת למשחק-משפחתי).

## ADR-004 | 2026-05-17 | Drive sync — קובץ פר-פרופיל (לא יחיד)
**סטטוס:** מאושר · **בעלים:** human
**הקשר:** סנכרון התקדמות בין-מכשירים דרך Google Drive. הכוח-המנוגד: קובץ-יחיד פשוט יותר, אך יוצר race-conditions כששני ילדים משחקים במקביל.
**ההחלטה:** `progress-{profileId}.json` נפרד לכל פרופיל.
**אכיפה:** Drive schema ב-CLAUDE.md. IntegrationVerifier בודק ב-Phase 4.
**השלכות:** חיובי — אין race בין-פרופילים, הורה יכול לאפס/לשתף פר-ילד. שלילי — N קבצים במקום אחד; cleanup פר-פרופיל נדרש.
**אלטרנטיבות שנדחו:** קובץ-progress יחיד (race-conditions בין-פרופילים).

## ADR-005 | 2026-05-17 | PIN — PBKDF2 + salt + 100K iterations
**סטטוס:** מאושר · **בעלים:** agent-security (Council Round 1)
**הקשר:** מסך-הורה מוגן ב-PIN. הכוח-המנוגד: SHA-256 פשוט קל-למימוש, אך פגיע ל-rainbow-table.
**ההחלטה:** PBKDF2 + salt + 100K iterations. לא SHA-256 פשוט.
**אכיפה:** skill `security-kids`. SecurityAuditor בודק בכל סבב הנוגע ל-PIN.
**השלכות:** חיובי — עמיד ל-rainbow-table ו-brute-force. שלילי — חישוב כבד מעט יותר (זניח לאימות-יחיד).
**אלטרנטיבות שנדחו:** SHA-256 פשוט (rainbow-table פותר); plaintext PIN (אסור מוחלט).

## ADR-006 | 2026-05-17 | AI generator — Phase 2 בלבד
**סטטוס:** מאושר · **בעלים:** human
**הקשר:** המשחק יכול לייצר משימות דינמית דרך Claude API. הכוח-המנוגד: generator דינמי עשיר, אך מוסיף עלות-API ותלות-רשת ל-MVP.
**ההחלטה:** 50 משימות מובנות-מראש ב-MVP. AI generator נדחה ל-Phase 2.
**אכיפה:** ROADMAP — generator לא ב-scope של MVP. PhaseGatekeeper.
**השלכות:** חיובי — עלות $0, אפס תלות-רשת ב-MVP, תוכן צפוי. שלילי — תוכן סופי (50 משימות) עד Phase 2; חזרתיות לאחר זמן.
**אלטרנטיבות שנדחו:** AI generator ב-MVP (עלות + תלות-רשת לא מוצדקות לחודשיים הראשונים).

## ADR-007 | 2026-05-18 | אימוץ `ROADMAP.md` + צוות "מצפן"
**החלטה:** יצירת `docs/status/ROADMAP.md` כתוכנית-עבודה חיה (view של PLAN.md), ומקימים צוות "מצפן" (Compass) עם 2 סוכנים חדשים:
- 🗺️ **RoadmapKeeper** (`agent-roadmap-keeper`) — PM, custodian של ROADMAP
- 🛡️ **PhaseGatekeeper** (`agent-phase-gatekeeper`) — DoD verifier לפני Council

**נימוק:** PLAN.md (237KB) גדול מדי לשימוש-יום-יום. אין role ייעודי לאיתור drift planned-vs-actual. אין שער-DoD פורמלי לפני Council. ROADMAP + Compass פותרים את שלושת הפערים.
**מסמכים נלווים:** `TEAM-COMPASS.md`, `ROADMAP-CONTROL.md`.
**אלטרנטיבות שנשללו:** רק עדכון PROGRESS.md (לא מספיק structured), automation מבוסס cron (פרגיל, לא מאומת).

## ADR-008 | 2026-05-18 | פורמליזציה של "המועצה הגבוהה"
**החלטה:** מתן זהות פורמלית ל-9 חברי-המועצה — שמות תפקידיים באנגלית + משפט-תפקיד + פרופיל-עומק (השראה, אחריות, skills, קווים-אדומים).
**שמות:** SecurityAuditor, ChildUXAdvocate, AccessibilityInspector, HebrewLinguist, PerfBudgetEnforcer, CodeReviewer, IntegrationVerifier, QualityAssurance, CouncilChair.
**מסמך נלווה:** `docs/teams/TEAM-COUNCIL.md`.
**נימוק:** דוחות-מועצה היו אנונימיים ("agent-security WARNING"). שמות תפקידיים = קריאות + דיון נעשה לבר-ביצוע ("בקש מ-SecurityAuditor לסקור"). פרופיל-עומק = כל סוכן יודע מה דומיין-הבלעדיות שלו והשראתו.
**אלטרנטיבות שנשללו:** שמות אישיים בעברית (פחות מתארים את התפקוד); שמות גנריים ("Agent-1"...).

## ADR-010 | 2026-05-19 | Universal Constraints ב-Briefs
**החלטה:** כל brief ב-`docs/spec/CLAUDE-DESIGN-BRIEFS.md` חייב לכלול סעיף "Universal Constraints" לפני ה-TASK. הסעיף מגדיר חוקים שמועצה אכפה: Security (SVG XSS prevention), Accessibility (ARIA, contrast pairs), Performance (size budgets), Integration (viewBox, naming), Hebrew (forbidden words).

**נימוק:** בלי החוקים הללו, claude.ai יצור artifacts שייכשלו בבקרת-המועצה האחורית — בזבוז iteration. הוספת constraints לpre-flight מקצרת לoop "design → review → fix" ל-"review → design ראשון תקין".

**מסמך נלווה:** `docs/log/COUNCIL.md` Round 3.5 (הסבב שזיהה את הצורך).

**אכיפה:** PhaseGatekeeper בודק שכל artifact שמתקבל ב-Phase 0.5 עומד ב-constraints. אם לא — חזרה ל-claude.ai עם הdelta המסומן.

## ADR-009 | 2026-05-18 | פרוטוקול אישור-סיום-משימה
**החלטה:** אימוץ `docs/process/TASK-COMPLETION-PROTOCOL.md` שמגדיר:
- 5 סוגי משימות (Phase, Brief, Patch, Sub-task, Setup)
- מטריצת DoD פר-סוג
- שרשרת אימות (Verification Chain)
- 8 סוגי-מקרים שדורשים אישור-הורה (✋) vs. 5 שאוטומטיים (⚙️)
- פורמט-דיווח אחיד אליך
- שרשרת-תיעוד אוטומטית
- 22 תרחישי-קצה מקוטלגים

**נימוק:** "done" לא היה מוגדר באופן יחיד. הפרוטוקול מסיר אי-בהירות ומאפשר automation בטוח של דיווחים.

## ADR-011 | 2026-05-19 | Local-First Design Path — Claude Code כותב SVG ישירות
**החלטה:** עבור briefs שתוצאתם SVG/HTML טהור (Mascot, Avatars, mockups), Claude Code יכתוב את ה-SVG ישירות במקום להעביר דרך claude.ai. הגשר ל-claude.ai (Bridge Protocol ב-PLAN.md §1788) נשמר כ-fallback לתוצרי image generation שדורשים מודל-תמונה אמיתי (לוגו עם רקע מצויר, photo-realistic).

**טריגר:** Brief #2 (Mascot 6 poses). הגשר ל-claude.ai הצריך 4 פעולות-ידניות מההורה פר-brief (העתקה, הדבקה, המתנה, החזרה). 4 briefs × 4 פעולות = 16 פעולות + סיכון לאי-עקביות בין-poses (claude.ai לא רואה את ה-poses הקודמים).

**נימוק:**
1. **Universal Constraints (ADR-010) קל יותר לאכוף ב-קוד-מקומי** — אין סיכון ש-claude.ai יוסיף `<script>` בטעות.
2. **עקביות בין-poses** — Claude Code רואה את כל 6 ה-SVG ויכול לוודא שהם משתמשים באותם elements (אותו בסיס-ינשוף, אותם eye positions, אותו cap design).
3. **בלי תלות ב-GEMINI_API_KEY** — שזה לא מוגדר אצל ההורה ודורש setup נוסף.
4. **זמן-iteration קצר** — תיקון = עריכת קובץ, לא העתקה-הדבקה-הדבקה.
5. **גודל-קבצים מבוקר** — 1.6–2.2 KB פר-SVG בפועל (יעד היה ≤8 KB).

**מתי בכל זאת להשתמש בגשר claude.ai:**
- Briefs שדורשים image generation אמיתי (לדוגמה: תמונת-רקע עם מרקם, אילוסטרציה מורכבת מאוד שלא ניתן לבטא ב-paths פשוטים).
- Briefs שמועילים מ-A/B exploration ויזואלי שונה (claude.ai יכול לתת variations במהירות).

**מסמכים מושפעים:**
- `docs/spec/CLAUDE-DESIGN-BRIEFS.md` — הוספת "Local-First Path" כברירת-מחדל ל-Mascot/Avatars/HTML mocks.
- `PLAN.md §1788 (Bridge Protocol)` — סימון כ-fallback path במקום primary.
- `docs/process/TASK-COMPLETION-PROTOCOL.md` — Brief מסוג "local-svg" מקבל DoD שונה (אין START PASTE/END PASTE).

**אלטרנטיבות שנשללו:**
- **design skill עם Gemini API** — דורש GEMINI_API_KEY שלא מוגדר; Pro-image-preview היה ייתן raster לא SVG.
- **רק claude.ai (כמו במקור)** — ראה נימוק 1–5 לעיל.
- **claude.ai/design (Research Preview)** — מיועד ל-prototypes/slides, לא לאיורי-וקטור. פורמט-החזרה שונה מהמתועד.

**אכיפה:** PhaseGatekeeper בודק את הקבצים שב-`assets/mascot/` כמו תמיד — Universal Constraints חלים זהה. אין הקלה בבדיקה.

## ADR-013 | 2026-05-19 | Design Studio Formalization
**החלטה:** הקמת צוות-אחות שלישי לפרויקט — **סטודיו-העיצוב (Design Studio)** — מקביל ל-High Council ול-Compass. 7 חברים (6 + chair) עם זהות-עומק לכל אחד.

**טריגר:** ההורה זיהה (אחרי השלמת Brief #2 ו-bug-fix של הלוגו ב-BUG-001) שהלוגו (לבנדר, עיניים-סגורות) והמסקוט (תכלת, עיניים-פתוחות, כובע אקדמי) נראים כשתי דמויות נפרדות — לא כ"פרופ' חכמוני אחד". הצוותים הקיימים (High Council, Compass) פוסקים איכות וכיוון — אבל אין role שאחראי על **אסתטיקה, מותג, יופי**. ChildUXAdvocate הכי קרוב, אבל הוא ממוקד ב-UX (אינטראקציה), לא ב-Visual Design.

**נימוק:**
1. **קוהרנטיות-מותגית קריטית לקהל-יעד 4–6** — ילדים מזהים מותג דרך **דמות**, לא דרך לוגו מופשט. אם הלוגו והמסקוט שונים — הם רואים "אפליקציות שונות".
2. **Pre-Council gate חסר** — Studio מאשר את הנכס לפני שהוא עובר ל-Council. בלי זה, Council מקבל artifacts לא-קוהרנטיים ונאלץ לשלוח אחורה (פחות יעיל).
3. **Documentation-as-code** — לכל חבר יש system prompt עם זהות, השראה, תחומי-בלעדיות, קווים-אדומים. זה לא רק טקסט — זה ניתן להפעלה דרך Agent tool.
4. **השראה מתועדת** — כל חבר מצטט מי מהמורים שלו (Saul Bass, Mary Blair, Albers, Spiekermann, Brad Frost, Disney 12 principles, Vignelli). החלטות אינן ad-hoc.

**חברים (7):**
- 🎭 BrandIdentityArchitect (`agent-brand-identity`) — coherence
- 🖼️ CharacterIllustrator (`agent-character-design`) — character DNA
- 🎨 ColorPaletteEngineer (`agent-color-palette`) — palette + contrast
- 🔤 TypographyMaster (`agent-typography`) — RTL Hebrew + type
- 🧬 DesignSystemArchitect (`agent-design-system-arch`) — tokens.css
- 🎬 MotionStoryteller (`agent-motion-story`) — animation choreography
- ⚖️ DesignChair (`agent-design-chair`) — synthesis + ADRs

**מסמכים נלווים:**
- `docs/teams/TEAM-DESIGN.md` (חדש — מסמך-מכונן)
- 7 קבצי `.claude/agents/agent-*.md` (system prompts חדשים)
- `CLAUDE.md` (עודכן — סעיף Sub-Agents)

**אלטרנטיבות שנשללו:**
- הרחבת ChildUXAdvocate ל-UX+Design — שני תחומים שונים מדי, סוכן אחד יסתבך
- שילוב הסוכנים החדשים ב-Council — מבזבז זמן בסבבים שלא קשורים לעיצוב
- ללא צוות-design רשמי, רק ad-hoc — מסביר איך הגענו ל-לוגו≠מסקוט מלכתחילה

**אכיפה:** כל artifact חדש (לוגו, mascot, avatar, mock-HTML, CSS חדש) חייב לעבור R-Design-N לפני מעבר ל-Council. DesignChair כותב את הדוח ב-`docs/DESIGN-AUDIT-R-N.md`.

**הסבב הבא:** R-Design-1 (Initial Audit) — אחרי אישור-הורה.

## ADR-014 | 2026-05-22 | Palette Extension (Shade Variants) + Semantic Layer
**סטטוס:** מאושר · **בעלים:** agent-color-palette + agent-design-system-arch (R-Design-1) · אישר: human

**הקשר:** R-Design-1 גילה ש-`design-mocks/shared/tokens.css` — שאמור להיות single-source-of-truth של העיצוב — אינו מלא. המסקוט (שכבר אושר ב-Brief #2) משתמש ב-3 צבעי-hex שאינם מתועדים בקובץ: `#5BA8C4` (הצללת כנפיים), `#FFA552` (בטן), `#E8851A` (הצללת מקור/רגליים). בנוסף, חסרה שכבת-Semantic (Layer 2) — קוד Phase 1 ייאלץ לכתוב `--color-sky` ישירות גם כשהמשמעות היא "רקע-עמוד" או "גוף-דמות". הכוח-המנוגד: שינוי-tokens מסכן רגרסיה ויזואלית במוקאפים הקיימים.

**ההחלטה:** הרחבת `tokens.css` ב-3 חלקים, **additive בלבד** (אף token קיים לא משנה ערך):
1. 3 primitive tokens חדשים — `--color-sky-dark` (#5BA8C4), `--color-orange-belly` (#FFA552), `--color-orange-dark` (#E8851A) — מתעדים את צבעי-המסקוט.
2. שכבת-Semantic (Layer 2) — 11 tokens (`--color-text-primary`, `--color-bg-page`, `--color-character-body` וכו') הבנויים מעל ה-primitive. בזכות resolve-at-use-time של CSS vars, הטוקנים הסמנטיים יורשים אוטומטית את ה-override של High-Contrast mode.
3. תיעוד 3 hex מקודדים-קשיח (`#FFCE10`, `#8E44AD`, `#0066CC`) בהערות `/* TODO (ADR-014) */`.
נדחה ל-P1/P2: token-ים לרכיבים (`--card-*`, `--input-*`), `--space-xxs/xxl`, `--ease-elastic`, refactor שמות ל-primitive-prefix.

**אכיפה:** `tokens.css` הוא ה-SSoT; `styles/global.css` ב-Phase 1 ייבא ממנו. DesignSystemArchitect ו-ColorPaletteEngineer בודקים ב-R-Design-N הבא שאין hex חדש מחוץ ל-Layer 1. CodeReviewer בודק ב-Phase 1 שהקוד משתמש ב-Layer 2 ולא ב-primitive ישירות.

**השלכות:** חיובי — tokens.css הופך מלא וכן (3 צבעי-המסקוט מתועדים); קוד Phase 1 מקבל אוצר-מילים סמנטי; HC mode עובד דרך הירושה. שלילי — שתי שכבות-naming (primitive + semantic) דורשות משמעת — קל לכתוב `--color-sky` במקום `--color-bg-page` בטעות; נדרשת אכיפת-review.

**אלטרנטיבות שנדחו:** השארת tokens.css כמו-שהוא (משאיר 3 צבעי-מסקוט לא-מתועדים — הפרת SSoT); refactor מלא ל-primitive-prefix naming מיד (`--color-primitive-sky-500`) — refactor גדול מדי, נדחה לסבב מאוחר; הוספת component-tokens עכשיו — אין עדיין רכיבי-UI אמיתיים לגזור מהם.

## ADR-015 | 2026-05-23 | Logo Character Unification Policy
**סטטוס:** מאושר · **בעלים:** agent-brand-identity (R-Design-1) · אישר: human

**הקשר:** R-Design-1 (2026-05-19) זיהה ש-Brief #1 ייצר לוגו (ינשוף לבנדר) שאינו דמות-המסקוט. ילד בן-4 שאינו קורא מזהה מותג לפי דמות — והכשל הזה הגדיר את המוצר כ-OFF-BRAND וחסם את Phase 1. Brief #1.5 תיקן את הלוגו בפועל; חסרה מדיניות שתמנע הישנות בכל שינוי-לוגו עתידי.

**ההחלטה:** הלוגו של חכמוני — בכל גודל ובכל הקשר — חייב להציג את **דמות-המסקוט פרופ' חכמוני** (הינשוף התכלת עם הכובע האקדמי), ב-DNA זהה ל-Brief #2. אסור לוגו אבסטרקטי ואסורה דמות אחרת. כל שינוי-לוגו עתידי נגזר מ-DNA זה.

**אכיפה:** BrandIdentityArchitect ו-CharacterIllustrator בודקים ב-R-Design-N הבא. כל Brief-לוגו עתידי חייב להטמיע SVG-הפניה של המסקוט (כפי שעשה Brief #1.5).

**השלכות:** חיובי — זהות-מותג אחת ועקבית; הילד מזהה את "החבר" מהלוגו ועד המשחק. שלילי — פחות חופש-עיצובי ללוגו; שינוי-מסקוט עתידי יחייב עדכון-לוגו במקביל.

**אלטרנטיבות שנדחו:** לוגו אבסטרקטי (Brief #1.5 אופציה C) — מאבד את החיבור הרגשי לדמות; השארת לוגו≠מסקוט — הכשל המקורי של R-Design-1.

## ADR-016 | 2026-05-23 | Avatar Palette Extension (Pastel Backgrounds + Body Colors)
**סטטוס:** מאושר · **בעלים:** human (לאחר Brief #4 Local-First) · אישר: human

**הקשר:** Brief #4 (12 אווטארים) דורש רקע-פסטל ייחודי לכל חיה + 5 צבעי-גוף ייעודיים (חום-דוב, חום-ינשוף, אפור-פיל, כסף-רובוט, ורוד-אוזן-ארנב). 12 רקעי-פסטל + 5 צבעי-גוף לא קיימים בפלטה הראשית של 8 הצבעים, וגם לא ב-shade variants של ADR-014. ללא עיגון רשמי, הצבעים האלה ב-SVG-ים יוצרים hex-מקודד-קשיח מחוץ ל-tokens.css → הפרת SSoT.

**ההחלטה:** הרחבת-פלטה ייעודית לאווטארים, **בקטגוריה נפרדת ומבודדת** (לא חלק מהפלטה הראשית של ה-UI). כל הצבעים שמשמשים *רק* באווטארים יקבלו tokens מובחנים בקטגוריית "avatar palette" ב-tokens.css. הפלטה הראשית של ה-UI (8 צבעים + ADR-014 shade) לא מושפעת.

**Tokens חדשים** (יתווספו ב-tokens.css בעדכון הבא):
- רקעים (12): `--avatar-bg-{rabbit,cat,lion,elephant,frog,owl,bear,dog,fish,butterfly,robot,star}` — גוונים פסטליים ייחודיים פר-חיה.
- צבעי-גוף ייעודיים (5): `--avatar-brown-light` (חום-דוב/ינשוף), `--avatar-brown-dark` (חום-כהה), `--avatar-grey-elephant`, `--avatar-silver-robot`, `--avatar-pink-inner-ear`.

**אכיפה:** DesignSystemArchitect ו-ColorPaletteEngineer בודקים ב-R-Design הבא ש-(a) SVG-אווטאר משתמש רק ב-avatar-palette tokens + פלטה ראשית; (b) קוד-UI לא משתמש ב-avatar-palette tokens (קטגוריה נפרדת). CodeReviewer בודק ב-Phase 1 שעלי-בחירת-אווטאר משתמשים נכון בטוקנים.

**השלכות:** חיובי — SSoT שלם, כל hex מתועד; קל לעדכן צבע-חיה ע"י עריכת token אחד; קטגוריה מבודדת מונעת זיהום הפלטה הראשית. שלילי — מוסיף 12-17 tokens (יעלה הקובץ tokens.css ב-~20 שורות); דורש משמעת ב-Phase 1 לא לערבב.

**אלטרנטיבות שנדחו:** הטמעת hex ב-SVG-אווטאר ידנית (משאיר אותם מחוץ ל-SSoT — הפרה); מיזוג ה-avatar-pastels לפלטה הראשית (מזהם את הפלטה ה-UI עם צבעים שלא רלוונטיים לרכיבים — הפרת היררכיית-עיצוב).