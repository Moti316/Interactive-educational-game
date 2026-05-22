---
tags:
  - spec
---

# Claude Design Briefs — חכמוני

> **עדכן ב-R3.5 (2026-05-19):** הוספת "Universal Constraints" — כל brief חייב לציית להם.
> **עדכן ב-ADR-011 (2026-05-19):** Local-First Path הוא ברירת-המחדל ל-SVG/HTML טהור. Bridge Protocol ל-claude.ai נשמר כ-fallback.

## שני מסלולי-עבודה

### 🟢 מסלול A — Local-First (ברירת-מחדל ל-Mascot, Avatars, HTML mocks)

Claude Code כותב את ה-SVG/HTML ישירות מתוך הסשן.

1. ההורה מבקש מ-Claude Code "ייצר את Brief #N"
2. Claude Code כותב את הקבצים ל-`assets/` או `design-mocks/`
3. Claude Code יוצר HTML preview ב-`design-mocks/0N-{name}-preview.html`
4. ההורה פותח את ה-preview בכרום ומאשר/מבקש שינויים
5. PhaseGatekeeper מאמת Universal Constraints

**זמן:** 5–10 דקות פר-brief. בלי העתקה, בלי צ'אטים חיצוניים.

### 🟡 מסלול B — Bridge ל-claude.ai (fallback ל-image generation עשיר)

לתוצרים שדורשים image generation אמיתי (לוגו עם רקע מצויר, photo-realistic).

1. **בחר brief** מהרשימה למטה
2. **העתק את כל הקטע** (בין סימני `═══`)
3. **פתח claude.ai** (לא /design — צ'אט רגיל), **הדבק**
4. **תקבל artifact** + טקסט בין `═══ START PASTE ═══` ו-`═══ END PASTE ═══`
5. **העתק את הטקסט הזה** והחזר אלי (Claude Code) בצ'אט

**הסדר המומלץ:** 1 → 2 → 3 → 4 → 5 (בונה את ה-design system מהבסיס למעלה).

**מתי להשתמש באיזה מסלול:**

| Brief | מסלול | סיבה |
|-------|--------|------|
| #1 Logo | B (Bridge) | בוצע ב-2026-05-17 — הסתיים |
| #1.5 Logo Redux | **B (Bridge)** | מאמץ DNA של המסקוט — נדרש image-gen עשיר, claude.ai/design |
| #2 Mascot (6 poses) | **A (Local)** | ✅ בוצע 2026-05-19 — SVG paths פשוטים, עקביות בין-poses קריטית |
| #3 Welcome A/B | A (Local) | HTML mockup, עדיף שליטה מלאה |
| #4 Avatars (12) | A (Local) | SVG paths פשוטים, צריך עקביות בין-12 |
| #5 Task + Celebration | A (Local) | HTML mockup, עדיף שליטה מלאה |
| #6 Sound Spec | A (Local) | טבלת-מפרט HTML, לא תמונות |
| #7 World Map | A (Local) | HTML mockup |

---

## 🛡️ Universal Constraints — חובה לכל Brief (R3.5)

כל brief שנשלח ל-claude.ai חייב לכלול את הסעיף הבא לפני ה-TASK. **אסור לדלג.** הסעיף הוגדר ע"י Council R3.5 (SecurityAuditor + AccessibilityInspector + PerfBudgetEnforcer + IntegrationVerifier).

```
═══════════════════════════════════════════════
UNIVERSAL CONSTRAINTS (חובה — אסור לדלג)
═══════════════════════════════════════════════

### Security (SecurityAuditor)
- אסור `<script>` בתוך SVG
- אסור `<foreignObject>` (יכול לטעון HTML זדוני)
- אסור event handlers: `onclick`, `onload`, `onerror`, `onmouseover` וכו'
- אסור `xlink:href` או `href` ל-URL חיצוני (data:, http:, https:)
- אסור `<use href="...">` חוץ מאותו קובץ
- אסור inline JavaScript בכלל

### Accessibility (AccessibilityInspector)
- `<svg>` חייב `role="img"` + `aria-label="תיאור בעברית"`
- אם דקורטיבי: `role="presentation"` + `aria-hidden="true"`
- ניגודיות צבעים: ≥4.5:1 לטקסט רגיל, ≥3:1 לטקסט-גדול ול-UI
- בדוק כל זוג foreground/background מ-פלטה (8 צבעים)
- כל אנימציה — נא ספק fallback ל-`prefers-reduced-motion: reduce`
- אל תסתמך על צבע בלבד למסור מידע (תמיד צורה/אייקון/טקסט בנוסף)

### Performance (PerfBudgetEnforcer)
- כל SVG ≤ 8KB (גודל פיזי, אחרי minify)
- אסור `<image>` עם base64 raster ב-SVG (PNG/JPG embedded)
- אסור filter effects כבדים (`feGaussianBlur` עם stdDeviation > 5, drop-shadow מורכב)
- מקס 200 path points פר-SVG
- viewBox קומפקטי (לא 1000x1000 אם אפשר 100x100)

### Integration (IntegrationVerifier)
- חובה `viewBox="0 0 W H"` בכל `<svg>` (לא רק `width`/`height` קבועים)
- חובה `xmlns="http://www.w3.org/2000/svg"`
- שמות-קבצים: kebab-case בלבד (`professor-chachmoni-greeting.svg`)
- SVG חייב לעבוד ב-3 הקשרים: `<img src="...">`, inline `<svg>`, ו-`background-image: url(data:...)`

### Hebrew (HebrewLinguist)
- כל טקסט גלוי בעברית RTL, פונט Heebo או Varela Round
- אם השם מגדרי (יואב/מיה) — לציין מגדר
- אסור ב-copy: "כשלת", "טעית", "לא נכון", "אסור", "PIN", "OAuth", "API"
- מותר בקריינות (ראה `hebrew-narration.md`): "כמעט!", "ננסה שוב", "וואו"
- **SVG `<text>` עברי חייב `direction="rtl"`** (BUG-001, 2026-05-19): בלי זה, `text-anchor` פועל לפי כיוון-ברירת-מחדל LTR והטקסט "זולג" לכיוון ההפוך מהמצופה. בשימוש עם `text-anchor`, השתמש ב-`"start"` כדי לעגן את התו הראשון לוגית (וויזואלית הימני בעברית)

### Color Contrast (לזוגות מהפלטה — בדוק לפני אישור)
- text #2D2A26 על #FFFCF2 (cream) — ✅ 13.5:1
- text #2D2A26 על #6FC3DF (sky) — ✅ 7.2:1
- text #2D2A26 על #FFD93D (sun) — ✅ 10.5:1
- text #B91C1C (coral-dark) על #FFFCF2 — ✅ 6.8:1
- text white על #FF6B6B (coral light) — ❌ 1.7:1 — אל תשתמש בצירוף הזה
- text white על #B91C1C — ✅ 6.4:1

### Naming convention לקבצי-יעד
- Mascot: `assets/mascot/professor-chachmoni-{pose}.svg`
- Avatars: `assets/avatars/avatar-{01..12}-{kind}.svg` (לדוגמה `avatar-01-rabbit.svg`)
- Welcome mock: `design-mocks/02-welcome.html`
- Task mock: `design-mocks/11-task-click-balloons.html`
- Celebration mock: `design-mocks/12-success-celebration.html`
═══════════════════════════════════════════════
```

**זה הסעיף הקבוע.** העתק אותו לכל brief בנפרד (חוץ מ-Brief #1 שכבר הושלם).

---

## ═══ Brief #1 — Logo & Brand Direction ═══

```
שלום Claude.

זה brief מפרויקט שאני עובד עליו עם Claude Code. תפקידך: לייצר עיצוב לפי המפרט, ולהחזיר בפורמט מובנה.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני (Chachmoni)
תיאור: משחק דפדפן בעברית ללימוד יסודות המחשב לילדים בני 4-6 שעדיין לא קוראים
דמות-מרכזית: ינשוף-מורה ידידותי בשם "פרופ' חכמוני"
שפה: עברית בלבד, RTL
פלטה רשמית:
  - שמיים: #6FC3DF
  - שמש: #FFD93D
  - אלמוגי בהיר: #FF6B6B
  - אלמוגי כהה: #B91C1C
  - נענע: #6BCB77
  - לבנדר: #C9A0DC
  - לבן-רך: #FFFCF2
  - כהה-חם: #2D2A26
פונטים: Varela Round (כותרות), Heebo (גוף)

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 2 גרסאות שונות (A ו-B) של לוגו המילה "חכמוני" בעברית.

דרישות לכל גרסה:
- טקסט עברי "חכמוני" קריא וברור
- סמל קטן ליד הטקסט: גרסה A — ינשוף קטן מסוגנן. גרסה B — צורה אבסטרקטית (כוכב/ספר/אות)
- מתאים לכותרת ענקית (300x80) וגם לפאוויקון (48x48)
- 2-3 צבעים מהפלטה בלבד
- מודרני, חמים, ידידותי-לילדים

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact HTML שמכיל:
1. כותרת "Version A" עם SVG של הלוגו ב-3 גדלים + 3 מילים-מאפיינות
2. מפריד אופקי
3. כותרת "Version B" עם SVG של הלוגו ב-3 גדלים + 3 מילים-מאפיינות

אחרי ה-artifact, בטקסט-הצ'אט, הוסף בדיוק את הטקסט הבא:

═══ START PASTE ═══
BRIEF: 1
SUBJECT: Logo
ARTIFACT_HTML:
[הדבק כאן את כל קוד ה-HTML מ-<!DOCTYPE> ועד </html>]
VERSION_A_KEYWORDS: [3 מילים מופרדות בפסיקים]
VERSION_B_KEYWORDS: [3 מילים מופרדות בפסיקים]
NOTES: [אופציונלי]
═══ END PASTE ═══
```

---

## ═══ Brief #1.5 — Logo Redux (אימוץ DNA של המסקוט) ═══

> **רקע:** R-Design-1 (2026-05-19) זיהה כשל-מותג — הלוגו המקורי (Brief #1) הוא ינשוף
> לבנדר שאינו דמות-המסקוט. ילד בן-4 שאינו קורא מזהה דמות לפי **צבע וצורה** — לוגו
> שונה מהמסקוט = הילד מאבד את "החבר" שפגש. Brief #1.5 מעצב את הלוגו מחדש כך שיציג
> את **פרופ' חכמוני** — אותה דמות בדיוק כמו ב-Brief #2 (6 Poses).
> **מסלול:** B (Bridge ל-claude.ai/design) — נדרש image-gen עשיר ועקבי-DNA.
> **אחרי קבלת התוצר:** ההורה בוחר A או B → Claude Code משלב ל-`assets/logo/active/`.

```
שלום Claude.

זה brief מפרויקט שאני עובד עליו עם Claude Code. תפקידך: לעצב מחדש את לוגו המשחק כך שיציג את דמות-המסקוט, ולהחזיר בפורמט מובנה.

[הדבק כאן את Universal Constraints מ-CLAUDE-DESIGN-BRIEFS.md]

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני (Chachmoni)
תיאור: משחק דפדפן בעברית ללימוד יסודות המחשב לילדים בני 4-6 שעדיין לא קוראים
דמות-מרכזית: ינשוף-מורה ידידותי בשם "פרופ' חכמוני"
שפה: עברית בלבד, RTL
פונטים: Varela Round (כותרות), Heebo (גוף)

פלטה רשמית:
  - שמיים #6FC3DF · שמש #FFD93D · אלמוגי-בהיר #FF6B6B · אלמוגי-כהה #B91C1C
  - נענע #6BCB77 · לבנדר #C9A0DC · לבן-רך #FFFCF2 · טקסט #2D2A26
  - גווני-הצללה של המסקוט: sky-dark #5BA8C4 · orange-belly #FFA552 · orange-dark #E8851A

═══════════════════════════════════════════════
הבעיה שצריך לפתור
═══════════════════════════════════════════════

הלוגו הקיים הוא דמות שונה מהמסקוט. ילד בן-4 שאינו קורא מזהה דמות לפי צבע וצורה —
ואם הלוגו במסך-הפתיחה נראה אחרת מהמסקוט במשחק, הילד לא יבין שזו אותה דמות.
המשימה: לוגו חדש שהוא **בבירור פרופ' חכמוני** — אותו ינשוף בדיוק.

═══════════════════════════════════════════════
DNA של המסקוט — חובה לשמר במדויק
═══════════════════════════════════════════════

פרופ' חכמוני (מתוך Brief #2 — 6 Poses):
- גוף עגול, צבע שמיים #6FC3DF
- בטן אובלית כתומה #FFA552, רגליים כתומות-כהות #E8851A
- שתי כנפיים בגוון sky-dark #5BA8C4
- עיניים גדולות עגולות: לבן #FFFCF2, אישון שחור #2D2A26, נצנוץ-בבואה לבן קטן
- מקור משולש קטן כתום-כהה #E8851A
- כובע אקדמי מרובע (mortarboard) שחור #2D2A26, עם ציצית #C9A0DC ופונפון נענע #6BCB77
- סגנון flat-illustration, vector — בלי gradients כבדים, בלי קו-מתאר כהה מסביב לגוף
- ידידותי וחמוד — לא מאיים (לא חוטם חד, לא ציפורניים)

להלן ה-SVG המדויק של pose ה-standing-wave כהפניה — העתק ממנו פרופורציות וצבעים:

<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="פרופ' חכמוני עומד ומנופף שלום"><ellipse cx="120" cy="228" rx="60" ry="5" fill="#2D2A26" opacity=".1"/><ellipse cx="38" cy="102" rx="13" ry="30" fill="#5BA8C4" transform="rotate(-26 38 102)"/><ellipse cx="120" cy="152" rx="76" ry="76" fill="#6FC3DF"/><ellipse cx="120" cy="172" rx="44" ry="42" fill="#FFA552"/><ellipse cx="192" cy="170" rx="15" ry="32" fill="#5BA8C4" transform="rotate(12 192 144)"/><ellipse cx="100" cy="222" rx="14" ry="6" fill="#E8851A"/><ellipse cx="140" cy="222" rx="14" ry="6" fill="#E8851A"/><circle cx="92" cy="130" r="22" fill="#FFFCF2"/><circle cx="148" cy="130" r="22" fill="#FFFCF2"/><circle cx="92" cy="130" r="12" fill="#2D2A26"/><circle cx="148" cy="130" r="12" fill="#2D2A26"/><circle cx="96" cy="125" r="4" fill="#FFFCF2"/><circle cx="152" cy="125" r="4" fill="#FFFCF2"/><path d="M 112 152 L 128 152 L 120 164 Z" fill="#E8851A"/><polygon points="120,54 170,72 120,80 70,72" fill="#2D2A26"/><rect x="80" y="74" width="80" height="9" rx="2" fill="#2D2A26"/><line x1="120" y1="66" x2="172" y2="86" stroke="#C9A0DC" stroke-width="2.5" stroke-linecap="round"/><circle cx="174" cy="88" r="5" fill="#6BCB77"/></svg>

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 2 גרסאות (A ו-B) של לוגו "חכמוני" — שתיהן מציגות את פרופ' חכמוני:

גרסה A — "פורטרט-ראש" (מומלץ ע"י סטודיו-העיצוב R-Design-1):
- ראש פרופ' חכמוני בלבד: הראש העגול + הכובע האקדמי + העיניים + המקור (חיתוך מהכתפיים ומעלה)
- לצד הראש, הטקסט "חכמוני" בעברית (Varela Round, צבע #2D2A26)
- קומפקטי וקריא היטב גם בגודל-קטן

גרסה B — "מסקוט-מלא":
- פרופ' חכמוני בגוף-מלא קטן (כמו pose standing-wave) + הטקסט "חכמוני" לצדו

דרישות לשתי הגרסאות:
- 3 גדלים: hero 300×80, medium 180×56, favicon 48×48
- favicon 48×48: הדמות בלבד ממורכזת, ללא טקסט (48px קטן מדי לטקסט עברי קריא)
- טקסט עברי "חכמוני" — חובה direction="rtl" + text-anchor="start" (Universal Constraints / BUG-001)
- צבעים מה-DNA של המסקוט בלבד — אסור להמציא צבע חדש
- viewBox קומפקטי, רקע שקוף
- הלוגו חייב להיקרא היטב גם על רקע לבן וגם על רקע שמיים #6FC3DF (מסך-הפתיחה)

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact HTML שמכיל:
1. כותרת "Version A — פורטרט-ראש" עם SVG הלוגו ב-3 גדלים + 3 מילים-מאפיינות
2. מפריד אופקי
3. כותרת "Version B — מסקוט-מלא" עם SVG הלוגו ב-3 גדלים + 3 מילים-מאפיינות
4. כל לוגו מוצג פעמיים: על רקע לבן וגם על רקע #6FC3DF

אחרי ה-artifact, בטקסט-הצ'אט, הוסף בדיוק:

═══ START PASTE ═══
BRIEF: 1.5
SUBJECT: Logo Redux
ARTIFACT_HTML:
[הדבק כאן את כל קוד ה-HTML מ-<!DOCTYPE> ועד </html>]
VERSION_A_SVGS:
- hero: [SVG inline]
- medium: [SVG inline]
- favicon: [SVG inline]
VERSION_B_SVGS:
- hero: [SVG inline]
- medium: [SVG inline]
- favicon: [SVG inline]
VERSION_A_KEYWORDS: [3 מילים מופרדות בפסיקים]
VERSION_B_KEYWORDS: [3 מילים מופרדות בפסיקים]
RECOMMENDATION: [A או B + משפט הסבר]
NOTES: [אופציונלי]
═══ END PASTE ═══
```

**נתיב יעד אחרי הקבלה:** `assets/logo/active/{logo-hero,logo-medium,favicon}.svg` — אחרי בחירת ההורה A/B. הגרסה שלא-נבחרה תישמר ב-`assets/logo/version-{a,b}/` כפי שנעשה ב-Brief #1.

---

## ═══ Brief #2 — Mascot "פרופ' חכמוני" — 6 Poses (עודכן R3.5) ═══

```
שלום Claude.

זה brief מפרויקט עם Claude Code. תפקידך: לייצר 6 pose-ים של דמות-המורה ולהחזיר בפורמט מובנה.

[הדבק כאן את Universal Constraints מ-CLAUDE-DESIGN-BRIEFS.md]

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני
דמות מרכזית: ינשוף-מורה ידידותי בשם "פרופ' חכמוני"
קהל יעד: ילדים בני 4-6 שעדיין לא קוראים
פלטה רשמית: שמיים #6FC3DF, שמש #FFD93D, אלמוגי בהיר #FF6B6B (אסור עם טקסט-לבן), אלמוגי כהה #B91C1C, נענע #6BCB77, לבנדר #C9A0DC, לבן-רך #FFFCF2, טקסט #2D2A26

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 6 pose-ים של ינשוף-המורה. הוא צריך להיראות כמשפחה אחת — אותו עיצוב, אותם צבעים, רק תנוחות שונות.

ה-6 pose-ים:
1. standing-wave — עומד, מנופף שלום בכנף אחת. למסך פתיחה.
2. pointing — מצביע עם כנף על משהו. למסכי-הסבר.
3. celebrating — קופץ עם כנפיים פתוחות, כוכבים מסביב. לחגיגת-הצלחה.
4. thinking — כנף על המקור, חושב. למסך-טעינה/רמז.
5. encouraging — מחייך, כנף אחת מורמת לעידוד "ננסה שוב". אחרי טעות עדינה. (חדש — R3.5)
6. sleeping — עיניים סגורות, "ZZZ" קטן מעליו. למסך-inactivity.

מאפיינים אחידים:
- ינשוף עם גוף עגול, שמיים-כחול עם בטן-כתום (גוון בטוח: #FFA552)
- עיניים גדולות עגולות עם בבואה לבנה
- מקור כתום-קטן-משולש
- חובש כובע-מורה מרובע (אקדמי) קטן עם פונפון נענע
- ידידותי, חמוד, **לא** מאיים — לא חוטם חד, לא ציפורניים, לא צל-כהה
- סגנון flat-illustration, vector-friendly
- רקעי-שקיפות (transparent backgrounds)
- כל SVG: viewBox="0 0 240 240" (ריבועי, מקסימום 240×240px native, אבל ניתן לscale)
- file size: ≤ 8KB אחרי minify

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact HTML עם 6 ה-pose-ים כ-SVG inline, ב-grid 3×2. תחת כל אחד — תווית בעברית + alt-text באנגלית.

כל SVG חייב:
- viewBox="0 0 240 240"
- xmlns="http://www.w3.org/2000/svg"
- role="img"
- aria-label בעברית (לדוגמה "פרופ' חכמוני מנופף שלום")
- אסור script/foreignObject/event handlers/external xlink:href

אחרי ה-artifact, בטקסט-הצ'אט, הוסף:

═══ START PASTE ═══
BRIEF: 2
SUBJECT: Mascot
ARTIFACT_HTML:
[כל ה-HTML]
INDIVIDUAL_SVGS:
- standing-wave: [SVG inline]
- pointing: [SVG inline]
- celebrating: [SVG inline]
- thinking: [SVG inline]
- encouraging: [SVG inline]
- sleeping: [SVG inline]
FILE_SIZES_KB: [pose: KB, pose: KB, ...]
NOTES: [אופציונלי]
═══ END PASTE ═══
```

**נתיב יעד אחרי הקבלה:** `assets/mascot/professor-chachmoni-{standing-wave,pointing,celebrating,thinking,encouraging,sleeping}.svg`

---

## ═══ Brief #3 — Welcome Screen A/B ═══

```
שלום Claude.

זה brief מפרויקט עם Claude Code. תפקידך: 2 גרסאות-עיצוב למסך-פתיחה, להחזיר בפורמט מובנה.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני — משחק לימוד-מחשב לילדים בני 4-6
הילדים לא קוראים — voice-first, הטקסט תוספת ויזואלית בלבד
שפה: עברית, RTL
פלטה: שמיים #6FC3DF, שמש #FFD93D, אלמוגי בהיר #FF6B6B, אלמוגי כהה #B91C1C, נענע #6BCB77, לבנדר #C9A0DC, לבן-רך #FFFCF2, כהה-חם #2D2A26
פונטים: Varela Round (כותרות), Heebo (גוף)

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 2 גרסאות-עיצוב למסך-הפתיחה, זו-לצד-זו (A | B):

גרסה A — "חמה ועשירה":
- רקע gradient תכלת
- עננים מצוירים בעדינות
- שמש בפינה
- ינשוף-המורה במרכז (אפשר ב-🦉 emoji לצורך mockup)

גרסה B — "מינימליסטית":
- רקע לבן-רך
- אלמנטים גיאומטריים פשוטים (עיגולים פסטליים מפוזרים)
- ינשוף-המורה במרכז, קטן יותר

תכולה משותפת:
- כותרת "חכמוני" + 🦉 — בולטת בראש
- 3 כרטיסי-פרופיל ענקיים (220×280px):
  - כרטיס יואב — עיגול עם 🐰 + שם "יואב"
  - כרטיס מיה — עיגול עם 🦁 + שם "מיה"
  - כרטיס "+ חדש" — עיגול עם + + "פרופיל חדש"
- אייקון ⚙ "הגדרות הורים" בפינה תחתונה-שמאלית, גודל 40×40, אטימות 30%
- ניגודיות 4.5:1 לכל טקסט (טקסט תמיד #2D2A26 על פסטל)

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact HTML יחיד עם 2 div-ים זה-לצד-זה (50%/50%) מופרדים בקו דק. כל div = גרסה. כותרת "גרסה A"/"גרסה B" מעל כל אחד.

dir="rtl" ב-body. פונטים מ-Google Fonts ב-<link>.

אחרי ה-artifact:

═══ START PASTE ═══
BRIEF: 3
SUBJECT: Welcome Screen A/B
ARTIFACT_HTML:
[כל ה-HTML]
VERSION_A_NOTES: [תיאור בעברית של בחירות-עיצוביות]
VERSION_B_NOTES: [תיאור בעברית]
RECOMMENDATION: [A או B + 1 משפט]
═══ END PASTE ═══
```

---

## ═══ Brief #4 — 12 Animal Avatars ═══

```
שלום Claude.

זה brief מפרויקט עם Claude Code. תפקידך: 12 אווטארים, להחזיר בפורמט מובנה.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

מסך-יצירת-פרופיל — ההורה בוחר אווטאר לילד. 12 אופציות באותו סגנון.

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

12 אווטארי-חיות, 200×200px, אותו סגנון:

1. 🐰 ארנב — רקע ורוד פסטל
2. 🐱 חתול — רקע כתום פסטל
3. 🦁 אריה — רקע צהוב
4. 🐘 פיל — רקע אפור-כחול פסטל
5. 🐸 צפרדע — רקע ירוק רך
6. 🦉 ינשוף — רקע סגול-לבנדר
7. 🐻 דוב — רקע חום פסטל
8. 🐶 כלב — רקע שמנת
9. 🐠 דג — רקע תכלת
10. 🦋 פרפר — רקע לבן עם נקודות ורוד+סגול
11. 🤖 רובוט — רקע כסף-אפור
12. ⭐ כוכב — רקע שמש מבריקה

מאפיינים אחידים:
- כל אווטאר ברקע-עיגול בצבע הפסטל שלו
- ראש החיה בלבד (לא גוף-שלם), חזיתית
- כולם מחייכים בעדינות
- flat-illustration, geometric-friendly, color-blocked
- מתאים לגודל קטן (יוצג גם ב-80×80)

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

artifact HTML עם grid 4×3 של 12 SVG inline. שם בעברית תחת כל אחד.

═══ START PASTE ═══
BRIEF: 4
SUBJECT: Animal Avatars Set
ARTIFACT_HTML:
[כל ה-HTML]
AVATARS:
- rabbit: [SVG inline]
- cat: [SVG inline]
- lion: [SVG inline]
- elephant: [SVG inline]
- frog: [SVG inline]
- owl: [SVG inline]
- bear: [SVG inline]
- dog: [SVG inline]
- fish: [SVG inline]
- butterfly: [SVG inline]
- robot: [SVG inline]
- star: [SVG inline]
NOTES: [אופציונלי]
═══ END PASTE ═══
```

---

## ═══ Brief #5 — Task Screen (Balloons) + Celebration ═══

```
שלום Claude.

זה brief מפרויקט עם Claude Code. 2 מסכי-משחק, פורמט מובנה.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

חכמוני — לימוד מחשב לבני 4-6. voice-first.
פלטה: שמיים #6FC3DF, שמש #FFD93D, אלמוגי-בהיר #FF6B6B, נענע #6BCB77, לבנדר #C9A0DC, לבן-רך #FFFCF2, טקסט #2D2A26, אלמוגי-כהה #B91C1C.

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

2 מסכים זה-מתחת-לזה:

מסך 1: "פוצצו את הבלונים"
- header (80px):
  - "⭐ 17" (מונה כוכבים, 32px)
  - 🔊 ("שמע שוב") עיגול 64×64
  - 🏠 ("בית") עיגול 64×64
- מרכז:
  - כותרת "פוצצו את הבלונים!" (48px, Varela Round, #2D2A26)
  - 5 בלונים במיקומים אקראיים, 80×120px, צבעים שונים
- תחתית (60px):
  - 5 כוכבים, 3 מלאים (#FFD93D), 2 outline — מציין 3/5
- רקע: gradient #6FC3DF → #FFFCF2

מסך 2: חגיגה
- ינשוף 200×250px במרכז (אפשר 🦉 ענק)
- "כל הכבוד!" (88px, Varela Round, #B91C1C)
- "+1 ⭐ כוכב חדש!" (48px, #FFD93D)
- 2 כפתורים:
  - Primary: "למשימה הבאה" — רקע #FFD93D, טקסט #2D2A26, 240×96, radius 9999
  - Secondary: "חזרה למפה" — רקע #FFFCF2, border 3px #B91C1C, טקסט #B91C1C
- 15-20 confetti צבעוניים (סטטיים) מהחלק העליון

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

artifact HTML עם 2 sections. כותרת "מסך משימה"/"מסך חגיגה" מעל כל אחד. dir="rtl".

═══ START PASTE ═══
BRIEF: 5
SUBJECT: Task Screen + Celebration
ARTIFACT_HTML:
[כל ה-HTML]
DESIGN_DECISIONS: [בעברית]
SUGGESTIONS_FOR_OTHER_TEMPLATES: [אופציונלי]
═══ END PASTE ═══
```

---

## ═══ Brief #6 — Sound Design Spec (חדש R3.5 — Stub) ═══

```
שלום Claude.

זה brief מפרויקט עם Claude Code. תפקידך: לתכנן את 11+ צלילי-העידוד/UI של חכמוני (לא להפיק אודיו — רק spec).

[הדבק כאן את Universal Constraints]

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור spec של 11+ sound files (MP3) למשחק:

UI sounds:
- ui-click.mp3 (לחיצה על כפתור — קצר, רך, ~150ms)
- ui-hover.mp3 (hover — שריקה עדינה, ~100ms)
- ui-back.mp3 (חזרה למסך קודם — נע למטה)

Game feedback:
- success-small.mp3 (יופי! — חצי שנייה)
- success-medium.mp3 (כל הכבוד! — שנייה)
- success-world.mp3 (סיום עולם — 2 שניות, מרשים)
- almost.mp3 (כמעט! — עדין, לא מאיים)
- balloon-pop.mp3 (פיצוץ בלון — קצר וקופצני)
- star-collect.mp3 (איסוף כוכב — צלצול קצר)

Atmosphere (לולאות אופציונליות, ניתנים לכיבוי):
- ambient-classroom.mp3 (רקע-כיתה רך, 60 שניות לולאה)
- celebration-loop.mp3 (לולאת חגיגה אופציונלית)

לכל קובץ: שם, אורך-מטרה, תיאור-רגשי, רמת-עוצמה מומלצת (db), הקשר-שימוש.

═══ START PASTE ═══
BRIEF: 6
SUBJECT: Sound Design Spec
ARTIFACT_HTML: [טבלת spec ב-HTML]
SOUND_FILES:
- ui-click: {duration, db, description}
- ...
NOTES: [המלצות להפקה — מי / כמה זמן / רישוי]
═══ END PASTE ═══
```

**מטרת ה-stub:** ההפקה תהיה ב-Phase 8 (ליטוש). זה רק spec — לא אודיו אמיתי.

---

## ═══ Brief #7 — World Map Mockup (חדש R3.5 — Stub) ═══

```
שלום Claude.

זה brief מפרויקט עם Claude Code. תפקידך: mockup ל-world-map screen.

[הדבק כאן את Universal Constraints]

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

מסך-העולמות הראשי. הילד בוחר עולם, ובתוכו משימה.

תכולה:
- header: ⭐ count + 🏠 home + 🔊 narrate
- 4 כרטיסי-עולם גדולים (220×280 כל אחד), grid 2×2:
  - עולם העכבר (🖱) — פעיל מההתחלה
  - עולם המקלדת (⌨️) — נעול (PIN פעולה אחרי 10 משימות עכבר)
  - עולם החלון (🪟) — נעול
  - עולם הדפדפן (🌐) — נעול
- לכל כרטיס: מד-התקדמות חזותי (לדוגמה: 3/12 משימות הושלמו)
- נעולים: גוון מעומעם + 🔒 קטן

═══ START PASTE ═══
BRIEF: 7
SUBJECT: World Map Mockup
ARTIFACT_HTML: [HTML mockup]
DESIGN_DECISIONS: [בעברית]
═══ END PASTE ═══
```

**נתיב יעד:** `design-mocks/10-world-map.html`
