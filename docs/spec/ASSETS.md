---
tags:
  - spec
---

# ASSETS — מקור/רישוי לכל נכס

## פורמט

```markdown
### filename.svg
- **מקור:** Gemini 3.1 Pro Image / Mixkit / Freesound / Custom
- **רישיון:** CC0 / Generated / Project
- **קרדיט (אם נדרש):** ...
- **תאריך-הוספה:** YYYY-MM-DD
```r

## אווטארים (12)
*ייווצרו דרך Claude Design — Brief #4*

## דמות-מורה (6 pose-ים) — ✅ נוצרו 2026-05-19

### Professor Chachmoni — 6 SVG poses (claude.ai/design via Bridge Protocol)

| Pose | קובץ | aria-label | גודל | שימוש |
|------|------|------------|------|--------|
| standing-wave | `assets/mascot/professor-chachmoni-standing-wave.svg` | פרופ' חכמוני עומד ומנופף שלום | 1.54 KB | מסך פתיחה |
| pointing | `assets/mascot/professor-chachmoni-pointing.svg` | פרופ' חכמוני מצביע עם הכנף | 1.26 KB | מסכי-הסבר |
| celebrating | `assets/mascot/professor-chachmoni-celebrating.svg` | פרופ' חכמוני חוגג בקפיצה עם כוכבים | 1.93 KB | חגיגת-הצלחה |
| thinking | `assets/mascot/professor-chachmoni-thinking.svg` | פרופ' חכמוני חושב, כנף על המקור | 1.77 KB | טעינה/רמז |
| encouraging | `assets/mascot/professor-chachmoni-encouraging.svg` | פרופ' חכמוני מעודד עם כנף מורמת | 1.56 KB | אחרי טעות עדינה |
| sleeping | `assets/mascot/professor-chachmoni-sleeping.svg` | פרופ' חכמוני ישן, אותיות Z מעליו | 1.88 KB | inactivity |

- **מאפיינים:** ינשוף עגול, גוף #6FC3DF, בטן #FFA552 + #5BA8C4/#E8851A כ-shade variants לעומק, כובע אקדמי mortarboard עם tassel לבנדר ופונפון מנטה. צל-קרקע, כובע מוטה ב-celebrating/sleeping, סומק-לחיים ב-encouraging.
- **viewBox:** 0 0 240 240 (כולם)
- **מקור:** claude.ai/design (Anthropic Labs Research Preview) דרך Bridge Protocol (PLAN.md §1788)
- **רישיון:** Project-generated
- **Universal Constraints (R3.5):** ✅ PASS (security · a11y · perf · hebrew · integration*)
- ***Integration caveat:** sleeping.svg משתמש ב-`<text>` עם font-family Heebo+fallback ל-sans-serif. ב-Windows ללא Heebo system-installed — ה-Z's ירונדרו ב-sans-serif. fallback robust, לא breaks.
- **R3.6 Council:** Option B נבחר כקנוני אחרי השוואה ויזואלית (Child-UX וויזואל איכותי משמעותית). Option A (Local-First) מארכב ב-`assets/mascot/_archive-option-a/`.
- **תצוגה מקדימה:** `design-mocks/01-mascot-preview.html`

## לוגו + פאוויקון

### Logo Redux — Brief #1.5 — ✅ פעיל (2026-05-23)

**הלוגו הנוכחי של חכמוני.** עוצב מחדש כדי להציג את דמות-המסקוט — פותר את כשל
"לוגו ≠ מסקוט" שזיהה R-Design-1.

| נכס | קובץ | aria-label | viewBox |
|-----|------|------------|---------|
| hero | `assets/logo/active/logo-hero.svg` | לוגו חכמוני עם המסקוט המלא | 0 0 300 80 |
| medium | `assets/logo/active/logo-medium.svg` | לוגו חכמוני עם המסקוט המלא | 0 0 180 56 |
| favicon | `assets/logo/active/favicon.svg` | פרופ' חכמוני | 0 0 100 100 |
| favicon (כפול) | `assets/icons/favicon.svg` | פרופ' חכמוני | 0 0 100 100 |

- **גרסה שנבחרה:** B — מסקוט-מלא (ההורה בחר 2026-05-23). מילים: מלא-אופי · נרטיבי · ילדותי-חמוד.
- **שתי הגרסאות בארכיון:** `assets/logo/brief-1.5/logo-redux-{A,B}-{hero,medium,favicon}.svg` (A = פורטרט-ראש, לא נבחר).
- **DNA:** מאמץ את מסקוט פרופ' חכמוני — גוף #6FC3DF, בטן #FFA552, כנפיים/הצללה #5BA8C4, מקור/רגליים #E8851A, כובע אקדמי שחור עם ציצית #C9A0DC ופונפון #6BCB77. צבעים מפלטת-ה-DNA בלבד.
- **Universal Constraints:** ✅ ללא script/foreignObject/handlers · viewBox + role="img" + aria-label · `<text>` עברי עם direction="rtl" + text-anchor="start" · כל קובץ < 1KB.
- **מקור:** claude.ai/design (Bridge — Brief #1.5). **רישיון:** Project-generated.
- **תצוגה מקדימה:** `design-mocks/01-logo-redux-preview.html`
- **מדיניות:** ADR-015 — הלוגו חייב תמיד להציג את דמות-המסקוט.

---

## לוגו — Brief #1 (2026-05-17) — ⚠️ superseded ע"י Brief #1.5

> נפסל ב-R-Design-1 כ-OFF-BRAND (ינשוף לבנדר ≠ מסקוט תכלת). נשמר לתיעוד בלבד
> ב-`assets/logo/version-a/` ו-`version-b/`.

### Version A — "פרופ' חכמוני (ינשוף מסוגנן)"
- **קבצים:**
  - `assets/logo/version-a/logo-hero-300x80.svg`
  - `assets/logo/version-a/logo-medium-180x56.svg`
  - `assets/logo/version-a/favicon-48.svg` (רקע cream)
  - `assets/logo/version-a/favicon-48-alt-lavender.svg` (רקע לבנדר)
- **מאפיינים:** דמות־מקור גיאומטרית עגולה. ינשוף עם משקפיים.
- **מילים-מתאימות:** חברותי · משחקי · חם
- **פלטה:** lavender + sun + coral + ink
- **מקור:** Claude Design (claude.ai) דרך Brief #1
- **רישיון:** Project-generated (יוצר על-ידינו דרך Claude)

### Version B — "סמל אבסטרקטי (ספר + כוכב)"
- **קבצים:**
  - `assets/logo/version-b/logo-hero-300x80.svg`
  - `assets/logo/version-b/logo-medium-180x56.svg`
  - `assets/logo/version-b/favicon-48.svg` (רקע sky)
  - `assets/logo/version-b/favicon-48-alt-yellow.svg` (רקע sun)
- **מאפיינים:** ספר פתוח עם כוכב בולט. צורה גיאומטרית נקייה.
- **מילים-מתאימות:** נקי · ידע · סקרני
- **פלטה:** sky + sun + coral + ink
- **מקור:** Claude Design (claude.ai) דרך Brief #1
- **רישיון:** Project-generated

### בחירת Brief #1 (2026-05-17, היסטורי — בוטל)
ההורה בחר אז את Version A. **בוטל** — R-Design-1 פסל את הלוגו והוא הוחלף ע"י
Brief #1.5 (ראה למעלה). `design-mocks/01-logo-options.html` נשאר כתיעוד-Brief-#1.

## צלילים
*יוטענו מ-Mixkit / Freesound (CC0)*

- ui-hover.mp3
- ui-click.mp3
- ui-success.mp3
- ui-cheer.mp3
- ui-try-again.mp3
- ui-pin-correct.mp3
- ui-pin-wrong.mp3
- game-balloon-pop.mp3
- game-fish-catch.mp3
- game-star-collect.mp3
- ... (ראה PLAN.md לרשימה-מלאה)