---
tags:
  - log
---

# R-Design-1 | Initial Audit | 2026-05-19

> **סבב-ראשון של סטודיו-העיצוב.** הוקם ב-ADR-013 / CHG-008.
> **שיטה:** Lens-based synthesized review (סוכני-Studio טרם זמינים כ-runtime types בהאמרת — סקרתי דרך עדשת כל חבר בקפדנות, על-בסיס system prompts ב-`.claude/agents/agent-*.md`).
> **קוורום:** R-Full-Design (6/6 חברים + chair) = תקני.
> **קלט:** המצב הנוכחי של הפרויקט (לפני Brief #3).

---

## 1. מצב-קלט (Inventory)

| נכס | נתיב | סטטוס |
|-----|------|--------|
| Logo (active) | `assets/logo/active/{logo-hero,logo-medium,favicon}.svg` | Version A — לבנדר, ינשוף-מסונן, אבסטרקטי |
| Mascot (6 poses) | `assets/mascot/professor-chachmoni-*.svg` | claude.ai/design — תכלת, כובע אקדמי, illustrated |
| Mascot archive | `assets/mascot/_archive-option-a/` | Local-First version (6 קבצים, לא בשימוש) |
| Tokens | `design-mocks/shared/tokens.css` | פלטה ראשית מוגדרת, Round 2 patches מיושמים |
| Design mocks | `design-mocks/01-logo-options.html`, `01-mascot-preview.html` | קיימים, תקינים אחרי BUG-001 fix |
| Universal Constraints | `docs/spec/CLAUDE-DESIGN-BRIEFS.md` | R3.5 + patch BUG-001 |

---

## 2. Per-Member Findings

### 🎭 BrandIdentityArchitect — 🔴 **OFF-BRAND**

**SUMMARY:** הלוגו והמסקוט הם שתי דמויות נפרדות שאין ביניהן קשר ויזואלי. זו הכשל-המהותי-ביותר בפרויקט נכון להיום.

**CRITICAL ISSUES:**
- **Logo (לבנדר #C9A0DC, ציצות-אוזניים, עיניים-עצומות) ≠ Mascot (תכלת #6FC3DF, ללא ציצות, עיניים-פתוחות, כובע אקדמי).** הילד שיראה לוגו במסך-פתיחה ויעבור למסך עם מסקוט — לא יקשר ביניהם.
- בענפים-מקבילים: Duolingo (Duo הוא גם הלוגו וגם הדמות), Slack (סמליל = הזהות), Khan Academy (סמליל-אבסטרקטי-מסכים אך עקבי בכל מקום). חכמוני כרגע = anti-pattern.

**PATCHES (PRIORITIZED):**
- **P0 — Brief #1.5: Logo Redux.** עיצוב מחדש של 3 גדלי-הלוגו כדי להשתמש בדמות-המסקוט. אופציות: (א) ראש מסקוט בלבד + טקסט "חכמוני", (ב) מסקוט מלא + טקסט, (ג) אייקון-אבסטרקטי-של-המסקוט (כובע-אקדמי בלבד או צללית-ינשוף-עם-כובע) + טקסט.
- **P1 — Sub-brand alignment.** מסכי-הורה, dashboard, settings — חייבים לקרוא כ-Chachmoni-בלבוש-שונה, לא כאפליקציה-זרה. דורש Brief-עתידי (אחרי MVP).
- **P2 — Brand voice doc.** מסמך קצר ב-`docs/BRAND-VOICE.md` שמכיל: מי הדמות, מה הסיפור, מה הטון. שיתועד אחרי Brief #1.5.

**INSPIRATION-CITED:**
- Saul Bass — "Symbols are the most economical, immediate, and emotional way to communicate." הלוגו של חכמוני חייב לפתוח אותו רגש כמו המסקוט.
- Studio Eitan Bartal — Sesame Israel שמרה על אחידות באלמו ו-Big Bird בכל אזכור-מותגי.
- Duolingo Duo — דמות + לוגו = ישות-אחת. המקרה-מבחן שלנו.

**OVERALL:** ילד בן-4 לא יזהה את חכמוני כ-Chachmoni בלוגו הנוכחי. חייב fix לפני Phase 1.

---

### 🖼️ CharacterIllustrator — 🔴 **OFF-BRAND**

**SUMMARY:** המסקוט עצמו עקבי ב-6 ה-poses (DNA נשמר). אבל בין-לוגו-למסקוט יש כשל-DNA חמור.

**DNA CONSISTENCY (Mascot 6 poses):**
- ✅ גוף עגול, צבע אחיד #6FC3DF
- ✅ בטן כתומה #FFA552 בכל ה-poses (אם כי ב-sleeping הבטן קצת קטנה — `ry="40"` לעומת 42 באחרים. tolerance מקובל)
- ✅ עיניים גדולות עגולות בכל הראייה-פתוחה. ב-celebrating + encouraging — חיוך-עיניים curves (^_^). ב-sleeping — eyelashes. בכולם — אותה זהות.
- ✅ כובע אקדמי + tassel לבנדר + pompom מנטה — בכולם. ב-celebrating + sleeping מוטה (transform rotate). DNA נשמר.
- ✅ Mortarboard polygon זהה בגיאומטריה בכולם.

**DNA INCONSISTENCY (Logo vs Mascot):**
- ❌ הראש: לוגו = עגול-עם-ציצות. מסקוט = עגול-עם-כובע. **לא אותה דמות.**
- ❌ העיניים: לוגו = semi-circles-closed. מסקוט = open-circles-with-pupils. הילד תופס דמות-ישנה vs. דמות-ערה — לא יודע שזה אותו אחד.
- ❌ צבע-גוף: לוגו לבנדר, מסקוט תכלת. בעולם-ילדים-לא-קוראים, **צבע = זהות**.

**EXPRESSION LIBRARY GAPS (לא לפני MVP אבל-לזכור):**
- חסר: "מקשיב" (לפני שהילד מדבר/לוחץ), "מאוכזב-עדין" (אם רוצים מסך-נשמע-לב), "מסביר" (vs. "מצביע" — הסבר-ארוך לעומת הצבעה-קצרה).

**PATCHES (PRIORITIZED):**
- **P0 — Brief #1.5 כפול-מטרה:** הלוגו החדש חייב להעביר את DNA של המסקוט. שלוש options בה-brief — נבחר A/B/C עם ההורה.
- **P1 — Brief #4 (אווטארים) gating:** 12 אווטארי-החיות חייבים לחלוק "שפה ויזואלית" עם פרופ' חכמוני (גוף-עגול, עיניים-גדולות-עם-highlights, beak/mouth אחיד). אם לא — שתי משפחות-ויזואליות במשחק אחד.
- **P2 — Expression library doc.** מסמך נלווה ל-Brief #2 שיגדיר את 6 ה-poses + 3-4 expressions חסרים עתידיים.

**INSPIRATION-CITED:**
- Mary Blair — Disney concept artist. עקביות-דמות = אותו color-palette + אותו anatomy בכל הופעה.
- Mo Willems — Knuffle Bunny בכל ספר נראה אותו, גם אחרי 6 כותרים. עקביות = חברות-לטווח-ארוך עם הילד.
- Sandra Boynton — דמויות עגולות, ידידותיות, **בלי שינויי-DNA בין-ספרים**.

**OVERALL:** המסקוט עצמו נהדר. הלוגו הוא דמות-אחרת. חייב Brief #1.5 שיאמץ את ה-DNA של המסקוט.

---

### 🎨 ColorPaletteEngineer — 🟡 **NEEDS-PATCH**

**SUMMARY:** הפלטה הראשית טובה. אבל המסקוט מכניס 2 צבעים שאינם ב-tokens.css → palette discipline failure.

**PALETTE-USAGE AUDIT:**

| צבע | ב-tokens? | בשימוש ב-mascot? | בשימוש ב-logo? | סטטוס |
|------|-----------|-------------------|-------------------|--------|
| `#6FC3DF` (sky) | ✅ `--color-sky` | ✅ body | ❌ | OK |
| `#FFD93D` (sun) | ✅ `--color-sun` | ✅ sparkles | ✅ beak | OK |
| `#FF6B6B` (coral light) | ✅ `--color-coral` (decoration-only rule) | ✅ cheek blush | ❌ | OK ⚠️ (decoration only) |
| `#B91C1C` (coral dark) | ✅ `--color-coral-dark` | ❌ | ❌ | UNUSED in art (used in text-tokens only) |
| `#6BCB77` (mint) | ✅ `--color-mint` | ✅ pompom + sparkles | ❌ | OK |
| `#C9A0DC` (lavender) | ✅ `--color-lavender` | ✅ tassel + sparkles | ✅ body | OK |
| `#FFFCF2` (cream) | ✅ `--color-cream` | ✅ eye whites | ✅ | OK |
| `#2D2A26` (text) | ✅ `--color-text` | ✅ outlines | ✅ outlines | OK |
| `#FFA552` (safe orange / belly) | ❌ **לא ב-tokens** | ✅ belly (כל ה-6) | ❌ | **GAP** |
| `#5BA8C4` (sky-dark shade) | ❌ **לא ב-tokens** | ✅ wing shading (כל ה-6) | ❌ | **VIOLATION** |
| `#E8851A` (orange-dark shade) | ❌ **לא ב-tokens** | ✅ beak/feet shading | ❌ | **VIOLATION** |
| `#8E44AD` (tertiary button purple) | בtokens אבל-מחוץ-לפלטה | ❌ | ❌ | GAP (אזכור בלבד) |

**CRITICAL ISSUE:**
- המסקוט (אנו אישרנו!) מכיל 2 hex לא-מתועדים: `#5BA8C4` ו-`#E8851A`. שניהם shade variants של צבעי-פלטה (sky-dark, orange-dark). הם **משופרים visually** אבל עוקפים את הדיסיפלינה.

**CONTRAST PAIRS — שעדיין לא נבדקו:**
- `#FFA552` (belly) על `#6FC3DF` (sky body): 1.8:1 — דקורטיבי בלבד, לא לטקסט עליו ✓
- `#2D2A26` (text) על `#FFA552` (belly): 7.2:1 — מתאים לטקסט אם פעם נצטרך ✓
- `#5BA8C4` (wing-shade) על `#6FC3DF` (sky): 1.2:1 — דקורטיבי בלבד, OK לצללית ✓

**PATCHES (PRIORITIZED):**
- **P0 — ADR-014: Palette Extension w/ Shade Variants.** הוסף ל-tokens.css:
  ```css
  --color-sky-dark: #5BA8C4;        /* shading של sky — דקורטיבי בלבד */
  --color-orange-belly: #FFA552;    /* בטן-מסקוט (safe orange) */
  --color-orange-dark: #E8851A;     /* shading של orange — דקורטיבי בלבד */
  ```
- **P0 — Semantic Layer (Layer 2)** — הוסף שכבת-משמעות מעל primitive. דוגמה:
  ```css
  --color-text-primary: var(--color-text);
  --color-text-emphasis: var(--color-coral-dark);
  --color-bg-page: var(--color-cream);
  --color-bg-card: #FFFFFF;
  --color-character-body: var(--color-sky);
  --color-character-belly: var(--color-orange-belly);
  --color-character-accent: var(--color-mint);
  ```
- **P1 — Color-blindness verification** ב-deuteranopia (Coblis simulator) על: success-green vs. error-red. נדחה ל-Phase 2 (כשיש משימות אמיתיות).
- **P2 — Tertiary button color (`#8E44AD`)** — לא בפלטה הרשמית. או להעבירו ל-`--color-lavender-dark` ולתעד, או להחליפו. נדחה לסבב מאוחר.

**INSPIRATION-CITED:**
- Josef Albers (*Interaction of Color*) — הגוון של #5BA8C4 על #6FC3DF הוא דוגמה ל-"colors that vibrate together". הצוללית של claude.ai/design הייתה נכונה.
- Refactoring UI (Wathan + Schoger) — Tailwind 50→950 scale. אפשר לאמץ scale-לוקאלי בעתיד (sky-50 ... sky-900).
- Maria Montessori — הילד צריך פלטה-מבחינה אינטואיטיבית. הפלטה הנוכחית (8 צבעים) עומדת בעקרון.

**OVERALL:** הפלטה הקיימת טובה אבל זקוקה לשכבת-Semantic + 3 shade variants חדשים. ADR-014 נדרש.

---

### 🔤 TypographyMaster — 🟡 **NEEDS-PATCH** (קל)

**SUMMARY:** הטיפוגרפיה בעיקרון תקינה אחרי BUG-001 fix. יש gap קטן ב-type-scale.

**RTL CHECKS (אחרי BUG-001):**
- ✅ כל 7 קבצי-לוגו: `text-anchor="start" direction="rtl"`. תקין.
- ✅ HTML files: `dir="rtl"` ברמה הראשית.
- ⚠️ Mascot sleeping.svg משתמש ב-`<text>` עם font-family="Heebo,Varela Round,sans-serif" + `direction="ltr"`. ה-Z's ירונדרו ב-sans-serif ב-`<img>` (במחשבי-Windows ללא Heebo system-installed) — קוסמטי, לא breaking.

**TYPE SCALE AUDIT (tokens.css):**
- ✅ `--font-size-h1: 72px` (good for hero)
- ⚠️ **חסר:** h3/sub-heading scale (36px? 40px?). בין h2:48 ל-large:32 יש קפיצה לא-מבנית.
- ✅ `--font-size-large: 32px`
- ✅ `--font-size-button: 28px`
- ✅ `--font-size-body: 24px`
- ⚠️ **חסר:** caption/meta size (18px? 20px?). הגדרת kid-min ≥18px לטקסט-קריא.

**FONT PAIRING:**
- ✅ Varela Round (headings) + Heebo (body) — שילוב מצוין. Varela Round חמ; Heebo קריא.
- ✅ Both מ-Google Fonts, free, מתאימים לעברית.

**LINE-HEIGHT:**
- ✅ `--line-height-base: 1.6` — תקין לעברית.

**LETTER-SPACING:**
- Logo: `letter-spacing="-1"` ב-Hero, `letter-spacing="-0.5"` ב-Medium. עברית עם letter-spacing-שלילי-עדין = OK.

**PATCHES (PRIORITIZED):**
- **P1 — Type scale gaps.** הוסף ל-tokens.css:
  ```css
  --font-size-h3: 36px;       /* sub-heading */
  --font-size-caption: 18px;  /* min readable for kids 4-6 */
  ```
- **P2 — Mascot sleeping Z's** — אופציה לכ-paths במקום `<text>` (BUG-002 פוטנציאלי, לא urgent — fallback robust). יוערך אחרי שימוש-אמיתי במשחק.
- **P2 — Niqud support** — נדחה ל-Phase 1+ (כשמופיעים שמות-עמומים).

**INSPIRATION-CITED:**
- Erik Spiekermann — "Stop Stealing Sheep" — type system צריך 6-8 רמות-גודל. אנחנו עומדים על 5 (חסר 2).
- Yanek Iontef — Varela Round היא reset של עברית-מודרנית. שילוב טוב להמשך.
- Sara Soueidan — RTL SVG `<text>` חייב `direction="rtl"`. BUG-001 כבר אכף.

**OVERALL:** טיפוגרפיה במצב טוב. 2 קבצים חסרים ב-type-scale, אבל אין urgency.

---

### 🧬 DesignSystemArchitect — 🟡 **NEEDS-PATCH**

**SUMMARY:** tokens.css הוא single-source-of-truth מצוין ל-Layer 1 (primitive). חסר Layer 2 (semantic) ו-Layer 3 (component) מובהק.

**TOKEN ARCHITECTURE AUDIT:**

**Layer 1 — Primitive (קיים, טוב):**
- 8 צבעי-פלטה ✅
- 4 spacing values (8/16/32/64/96) ✅
- 4 radius values (16/24/32/9999) ✅
- 3 shadow values ✅
- Motion: 2 easing + 4 durations ✅

**Layer 2 — Semantic (חסר!):**
- אין `--color-text-primary` (יש רק `--color-text`)
- אין `--color-bg-page` (יש רק `--color-cream`)
- אין `--color-character-body`
- אין `--space-card-padding`
- כל הקוד כרגע יהיה צריך לכתוב `--color-sky` בכל מקום, גם כשהמשמעות תהיה "רקע-פתיחה" או "decoration-element"

**Layer 3 — Component (חסר ברובו):**
- ✅ `--btn-primary-*` (קיים)
- ✅ `--btn-secondary-*` (קיים)
- ✅ `--btn-tertiary-*` (קיים אבל עם hex לא-מ-פלטה)
- ✅ `--btn-icon-*` (קיים)
- ❌ `--card-*`, `--input-*`, `--avatar-*`, `--mascot-*` (חסר)

**NAMING CONSISTENCY:**
- ⚠️ `--color-sky` הוא primitive (color name). אבל `--color-text` הוא semantic (purpose). מעורבב.
- המלצה: לעבור ל-`--color-primitive-sky-500` + `--color-text-primary: var(--color-primitive-ink-900)`. אבל זה refactor גדול — דחיית-החלטה.

**HARDCODED HEX OUTSIDE TOKENS:**
- ⚠️ `#FFFFFF` (לבן) ב-`--hc-bg`, `--btn-secondary-text` (לפני HC mode).
- ⚠️ `#000000` (שחור) ב-`--hc-text`.
- ⚠️ `#0000AA`, `#FFFF00` (HC mode colors). OK בקונטקסט HC.
- ⚠️ `#FFCE10` ב-`--btn-primary-hover-bg`. גוון של sun — לא ב-Layer 1.
- ⚠️ `#0066CC` ב-`--btn-focus-ring`. לא ב-Layer 1.
- ⚠️ `#8E44AD` (tertiary purple). לא ב-Layer 1.

**SPACING SCALE:**
- ✅ Multiplicative-of-8 (with xs=8). תקין.
- ⚠️ חסר xxs (4px) ו-xxl (128px) — לעיתים שימושיים.

**MOTION TOKENS:**
- ✅ `--ease-soft`, `--ease-bounce`, `--duration-{instant,quick,base,celebration}`. תקין.
- ⚠️ חסר `--ease-elastic`, `--duration-loop` (לאנימציות-לולאתיות).

**PATCHES (PRIORITIZED):**
- **P0 — ADR-014 Patch: Semantic Layer (Layer 2)** — מוסיף ל-tokens.css כ-30 שורות עם כל הtoken-ים הסמנטיים. שילוב חלקי עם ColorPaletteEngineer.
- **P1 — Component tokens** ל-cards, inputs, avatars, mascot-display. ייכתב על-בסיס שלב 1 (כשרואים חלקי-UI אמיתיים).
- **P1 — Document hardcoded hexes** — שורת-הערה ב-tokens.css לכל hex לא-Level-1 (`/* TODO: promote to Layer 1 */`).
- **P2 — `--space-xxs: 4px` + `--space-xxl: 128px`**.
- **P2 — Naming refactor** ל-primitive prefix. נדחה לסבב מאוחר (refactor גדול).

**INSPIRATION-CITED:**
- Brad Frost (*Atomic Design*) — atoms (primitive) → molecules (semantic) → organisms (component). חכמוני יש atoms, חסרות molecules.
- Jina Anne (W3C Design Tokens spec) — שכבות-מובחנות הן best practice. JSON-DTCG format הוא יעד-עתידי.
- GitHub Primer — דוגמה למערכת בוגרת עם semantic naming `--color-fg-default` `--color-canvas-default`. תבנית-זהב.

**OVERALL:** tokens.css הוא בסיס-טוב אבל חסרה לו שכבת-המשמעות. ADR-014 משולב יטפל ב-2 ה-issues (palette extension + semantic layer).

---

### 🎬 MotionStoryteller — 🟢 **ON-BRAND** (עם הסתייגות)

**SUMMARY:** Motion tokens במקום, prefers-reduced-motion מטופל. אין אנימציות בפועל עדיין (Phase 0.5) — אין מה להאשים כעת. אבל יש gaps עתידיים-זמינים-לתכנון.

**MOTION TOKENS:**
- ✅ `--ease-soft: cubic-bezier(0.4, 0, 0.2, 1)` — Material standard
- ✅ `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoot למשוב-שמחה
- ✅ Durations: 100/200/400/800ms — סולם נקי
- ✅ `prefers-reduced-motion`: כל ה-durations ירדו ל-50/50/100ms + scales ל-1 (no motion)

**MISSING MOTION TOKENS (תכנון עתידי):**
- ❌ `--duration-loop` (לאנימציות אוורירה — confetti לולאתי?)
- ❌ `--ease-elastic` (למשוב חזק יותר)
- ❌ `--motion-attention-cap: 3` (ratchet-down אחרי 3 משימות — צריך JS state, אבל מוטיב-מעוצב שווה תיעוד)

**ASSETS — מצב נוכחי:**
- כל 6 ה-mascot SVGs **סטטיים**. אין `<animate>` ב-SVG, אין `@keyframes` ב-CSS לקראתם.
- זה תקין כרגע (Brief #2 = static poses). האנימציה תתווסף ב-Phase 2 כשמשלבים תבנית-משימה ראשונה.

**CHOREOGRAPHY ROADMAP (מתוכנן ל-Brief #5 — Celebration):**
- ✅ Brief #5 מציין confetti סטטי-מעלה — לא אנימטיבי. סביר.
- ⚠️ אבל המסקוט החוגג צריך bounce/scale-pulse כשמופיע. בדיקה: האם זה ב-SVG (אסור per Universal Constraints — אנימציה ב-`<animate>` עלולה לעקוף reduced-motion) או ב-CSS (מומלץ — `transform: scale()` עם `@media (prefers-reduced-motion: reduce) { animation: none; }`).
- ⚠️ Star-collect → "צביר" anim. מומלץ: scale-up + translate-to-counter, ratchet-down-after-3.

**REDUCED-MOTION TESTING:**
- ✅ tokens.css מטפל ב-`prefers-reduced-motion` ברמת-tokens. כל animation שתבנה על tokens תקבל את ה-fallback אוטומטית.
- ⚠️ עדיין צריך לבדוק שילוב: animation שמשתמשת ב-token + animation סטטית-mocking בקוד.

**PATCHES (PRIORITIZED):**
- **P0 — אין.** לא יש מה לתקן בשלב 0.5.
- **P1 — Brief #5 (Celebration) motion-spec.** לפני שמתחילים Brief #5, צריך מסמך-ילווה: `docs/MOTION-CELEBRATION-SPEC.md` שמגדיר sequencing (mascot bounce 200ms ease-bounce → confetti drop 400ms ease-soft → star-collect 200ms).
- **P2 — Animation library** — כשיש 4-5 אנימציות, כדאי `.claude/skills/animation-choreography.md` להתעדכן עם רשימת-mat (קיים — לעדכן בעתיד).

**INSPIRATION-CITED:**
- Disney "Squash & Stretch" — Mascot bounce בחגיגה = squash-on-impact + stretch-during-jump. ease-bounce ב-tokens.css יממש זאת.
- Val Head (*Designing Interface Animation*) — animation עם purpose ≠ decoration. כל motion-instance צריך לענות "מה זה מלמד?".
- Sesame Street pacing — beat ל-attention-span של בן-4 הוא ~3-5 שניות לחגיגה. tokens.css `--duration-celebration: 800ms` תואם (=חגיגה-קצרה-בתוך-ביט).

**OVERALL:** Motion-foundation נכון. אין לי patches חוסמים. ארגיש "ON-BRAND" אחרי שאראה motion-spec ל-Brief #5.

---

## 3. Chair Synthesis (DesignChair)

### Tally של 6 חברים:

| Member | STATUS | משקל |
|--------|--------|------|
| 🎭 BrandIdentityArchitect | 🔴 OFF-BRAND | קריטי |
| 🖼️ CharacterIllustrator | 🔴 OFF-BRAND | קריטי |
| 🎨 ColorPaletteEngineer | 🟡 NEEDS-PATCH | חשוב |
| 🔤 TypographyMaster | 🟡 NEEDS-PATCH | קל |
| 🧬 DesignSystemArchitect | 🟡 NEEDS-PATCH | חשוב |
| 🎬 MotionStoryteller | 🟢 ON-BRAND | OK |

**Score:** 2× OFF-BRAND, 3× NEEDS-PATCH, 1× ON-BRAND.

### המלצת-יו"ר: 🔴 **OFF-BRAND** — חוסם Phase 1

**ה-FAIL-מקור** הוא הפיצול לוגו≠מסקוט. זה לא קוסמטי — זה בריאות-המותג. ילד בן-4 שמתחיל לשחק עם חכמוני ביום-1, אם רואה דמות-A במסך-פתיחה ודמות-B במשימה-ראשונה, מאבד את "החבר" שכרגע פגש. זה כשל-מטרת-הפרויקט.

### Patches מאוחדים — שלוש קטגוריות

#### 🔥 P0 — חוסם Phase 1 (חייב לפני קוד אמיתי)

1. **Brief #1.5 — Logo Redux (claude.ai/design).** עיצוב 3 גדלי-לוגו חדשים שמשתמשים בדמות-המסקוט. 3 אופציות:
   - **A:** ראש-מסקוט-בלבד (cropped portrait) + טקסט "חכמוני" משמאל. (preferred — most consistent with mascot).
   - **B:** מסקוט-מלא-קטן + טקסט.
   - **C:** סמליל-אבסטרקטי (רק כובע-אקדמי או צללית-ינשוף-עם-כובע) + טקסט.
   - ההורה בוחר אחרי הברף.
2. **ADR-014 — Palette Extension & Semantic Layer.** קומבו של ColorPaletteEngineer + DesignSystemArchitect:
   - הוספת 3 primitive tokens: `--color-sky-dark`, `--color-orange-belly`, `--color-orange-dark`.
   - הוספת שכבת-Semantic (Layer 2) של ~10-15 tokens.
   - תיעוד hardcoded hexes בעירת-קוד.

#### ⚠️ P1 — מומלץ לפני MVP (אבל לא חוסם Phase 1)

3. **Type-scale gaps** — הוספת `--font-size-h3: 36px` ו-`--font-size-caption: 18px`.
4. **Brief #4 (Avatars) gating-rule** — לפני שמתחילים, להגדיר ב-Brief: "12 אווטארי-החיות חייבים לחלוק שפה-ויזואלית עם פרופ' חכמוני: גוף-עגול, עיניים-גדולות-עגולות-עם-highlights, beak/mouth אחיד, אותו flat-illustration style". מונע חזרת BUG-DNA.
5. **Brief #5 (Celebration) motion-spec** — `docs/MOTION-CELEBRATION-SPEC.md` שמגדיר sequencing של mascot bounce + confetti + star-collect.

#### 💡 P2 — Nice-to-have (post-MVP אופציונלי)

6. Color-blindness verification ב-Phase 2 (כשיש משימות).
7. Tertiary button #8E44AD — או לטוקן או להחליף.
8. Component tokens (--card, --input, --avatar, --mascot) — ייכתב עם שלב 1.
9. Mascot sleeping Z's כ-paths במקום `<text>` (BUG-002 פוטנציאלי, robustness only).
10. `--space-xxs: 4px` + `--space-xxl: 128px`.
11. `--ease-elastic` + `--duration-loop`.
12. Brand voice doc (`docs/BRAND-VOICE.md`).
13. Expression library extension (3-4 poses חדשים: "מקשיב", "מסביר", "מאוכזב-עדין", "ממתין").

### ADR שייווצרו אחרי אישור-הורה
- **ADR-014** — Palette Extension w/ Shade Variants + Semantic Layer (P0)
- **ADR-015** (אופציונלי) — Logo Character Unification Policy (יוצר אחרי Brief #1.5 הסתיים)

### Dissent
אין דעת-מיעוט. שני ה-FAIL-ים מסכימים על הסיבה ועל ה-fix.

### Roadmap Impact
- **ETA ל-MVP:** drift עתידי קל. Brief #1.5 = ~30 דק' של ההורה (claude.ai/design) + ~15 דק' אינטגרציה. Phase 1 (קוד) נחסם רק לעד-לפעולה ההורה.
- **Phase 0.5 progress:** היה ב-40% (Brief #1 + #2). אחרי הסבב הזה, התקרבנו לזיהוי-חוסמים. ה-Brief #1.5 כשמושלם → 50%.
- **Phase 1 condition:** חסום עד לאחר Brief #1.5 + ADR-014 + עדכון tokens.css.

---

## 4. Next Action

**עבור ההורה — כשתחזור:**

1. **קרא את הדוח הזה.** עברית, סקנבל.
2. **בחר אופציה ל-Brief #1.5:** A (ראש-מסקוט-בלבד) | B (מסקוט-מלא + טקסט) | C (אבסטרקטי).
3. **אשר ADR-014 (Palette Extension + Semantic Layer).** או הציע שינויים.
4. **אישור-לסבב-ביצוע (CHG-009):** האם להתחיל את ה-P0-fixes? או לעצור על הבסבב הזה?

**עבור Claude Code — בהמתנה לאישור:**

- לא מבצע fixes (פר הוראת-ההורה ב-2026-05-19: "מאשר לקבלת חוות דעת אך לא לביצוע").
- דוח זה נדחף ל-GitHub פר פרוטוקול (משימה-לוגית-הושלמה).
- ממתין לסשן הבא.

---

## 5. Meta — איכות-הסבב

**Time taken:** ~10 דקות (lens-based synthesis, אין subagents הופעלו בפועל).
**Files examined:** 13 (6 mascot, 3 logo-active, 1 favicon, 1 tokens.css, 2 design-mocks).
**Inconsistencies found:** 8 (לוגו≠מסקוט, 2 hex לא-בpalette, 3 token-gaps, 1 type-scale-gap, 1 missing semantic layer).
**Patches generated:** 13 (2 P0, 3 P1, 8 P2).
**ADRs proposed:** 1 (ADR-014) + 1 conditional (ADR-015 אם מאמצים unification policy).

**Roadmap drift-line (יוסף ל-ROADMAP.md ע"י RoadmapKeeper בסבב הבא):**
> `2026-05-19 | 0.5 | R-Design-1: 2× OFF-BRAND + 3× NEEDS-PATCH; Brief #1.5 חוסם Phase 1; ETA drift +30 דק' של הורה ו-+15 דק' של Claude Code | קל`
