## נגישות מלאה (WCAG AA + מעבר)

### Contrast ratios (חובה לכל זוג foreground/background)
- טקסט רגיל (24–32px): מינימום 4.5:1
- טקסט גדול (48px+): מינימום 3:1
- כפתורים: מינימום 4.5:1 בין הטקסט לרקע
- **בדיקה אוטומטית** — אקנפיג סקריפט node-ind (`scripts/check-contrast.js`) שירוץ על קובץ ה-tokens

### Colorblind-safe
- לא מסתמכים על צבע בלבד — תמיד יש סמל/צורה + צבע (למשל "כפתור הצלחה" יש לו ✓ ירוק *וגם* צבע ירוק).
- בדיקה ידנית עם **Coblis simulator** (לא נדרשת בדפדפן — בדיקה חד-פעמית).

### `prefers-reduced-motion`
- מזהים את ה-media query ומחילים: `motion: reduce` → כל ה-transforms נופלים, fades בלבד.

### Focus indicators
- ילדים לא משתמשים במקלדת לניווט (הם משתמשים בעכבר). אבל **ההורה** משתמש במסך-ההגדרות → focus rings ברורים בכל input/button.

### ARIA labels
- כל אלמנט-טקסט אינטראקטיבי מקבל `aria-label` בעברית.
- אזורי-עזר (`role="region"`, `aria-live="polite"`) במקומות שמופיע משוב.

### High-contrast mode (אופציה במסך-הגדרות) — מפורט (Patch מ-A11y)
- toggle "ניגודיות גבוהה" מחליף את הפלטה ל-4 צבעים בלבד עם ניגודיות 7:1:
  - רקע: `#FFFFFF` לבן טהור
  - טקסט: `#000000` שחור
  - Primary action: `#0000AA` כחול-עז (יותר נראה מאלמוגי)
  - Highlight: `#FFFF00` צהוב מלא
- אווטארים נשארים בצבעים-המקוריים (יש להם sufficient contrast עם רקע לבן).

### Larger-text mode — פירוט-יישום (Patch מ-A11y)
- toggle "טקסט גדול": x1, x1.25, x1.5 (CSS variable `--text-scale`).
- שינוי משפיע על font-size אך לא על container-width — text-wrap הוא אקטיבי.
- min line-height: 1.6, max: 2.0 כשטקסט גדול. מונע overflow.

### Reduced sound
- toggle "כבה צלילים" משתיק UI sounds + Game sounds, אבל **משאיר את הקריינות** (כי בלעדיה הילד לא יודע מה לעשות).

### Pause/Stop לאנימציות (Patch מ-A11y — WCAG 2.2.2)
- כפתור "🛑" קטן בפינה תחתונה-שמאלית בזמן confetti — לחיצה עוצרת מיידית.
- `prefers-reduced-motion` אוטומטית מבטל confetti.
- אנימציית-pulse של Primary CTA נכבית אוטומטית תחת reduced-motion.

### Alt-Text לתמונות-פרופיל (Patch מ-A11y)
- בכל יצירת-פרופיל: שדה-חובה `altText` (אוטומטי: "תמונה של {name}").
- ב-DOM: `<img src="..." alt="{altText}">`.
- בעת hover על תמונת-פרופיל: ה-altText מוקרא (לא רק השם).

### Transcript לקריינות (Patch מ-A11y)
- כל קריינות מוצגת גם כ-`<div class="sr-only" aria-live="polite">{text}</div>` נסתר ויזואלית אבל קריא ע"י screen readers.
- מועיל לקוראי-מסך של ההורה ולעתיד-עברית-נגישה.

### Focus Indicators במסכי-ילד (Patch מ-A11y)
- בנוסף ל-parent dashboard: גם במסכי-ילד יש focus rings (במידה והורה משתמש ב-Tab).
- צבע: `#0066CC` (≥3:1 על לבן/פסטל) — Patch לתוקן את `#4DA8FF` המקורי שהיה 3:1 בקושי.

### Keyboard Navigation (Patch מ-A11y)
- מקש `Tab` עובר בין-אלמנטים-אינטראקטיביים בסדר-DOM.
- `Enter` או `Space` מפעיל כפתור.
- `Esc` סוגר modals (PIN entry, AI generator, etc.) וחוזר אחורה.
- focus-trap בכל modal פתוח.

---

## עקרונות UX לגיל 4–6 — חשיבה מעמיקה (Designer-level)

המתודולוגיה כאן שונה מ-UX רגיל. הילד הוא **לא משתמש מקצועי**: הוא לא יודע לקרוא, לא יודע "לבחור פעולה מתפריט", לא יודע "לחפש", לא יודע "לחזור אחורה". הוא **רק** מגיב לגירויים — קולי, ויזואלי, פיזי. כל החלטת-עיצוב נובעת מההכרה הזו.

### 20 עקרונות יסוד (חובה לכל מסך)

| # | עיקרון | יישום פרקטי | למה זה חשוב לגיל 4–6 |
|---|---------|------------|---------------------|
| 1 | **One thing at a time** | מסך מציג מטרה אחת. אם יש שתיים — אחת בולטת, השנייה משנית | קוגניציה של בן 4 לא יכולה לבחור בין 2 ערכים שקולים |
| 2 | **Redundant affordance** | כפתור = צבע + צל + תנועה (pulse עדין על CTA) + סמל. **לא** "טקסט בלבד" | בן 4 לא מזהה "טקסט עם רקע" כ"כפתור". צריך אישור-כפול ויזואלי |
| 3 | **No discoverable UI** | אין hamburger menu, אין שלוש-נקודות, אין long-press לתפריט. הכל גלוי | ילדים לא חוקרים מסך — הם מגיבים למה שרואים |
| 4 | **Voice-first wayfinding** | כל פעולה אפשרית נקראת. אם הילד לא יודע איפה ללחוץ — הקריינות מובילה אותו | הילד לא קורא — הקול הוא ה-UI |
| 5 | **Forgiveness > efficiency** | undo קל, אישורים על פעולות הרסניות (מחיקת פרופיל), אין shortcuts מסוכנים | טעויות בגיל הזה תכופות. כל טעות שגוררת אובדן = טראומה |
| 6 | **Early & often rewards** | כל אינטראקציה חיובית מקבלת משוב חיובי, גם מינור (hover → צליל hover) | dopamine loops מחזקים את הרצון לחזור |
| 7 | **Predictability over novelty** | אותה פעולה = אותה תגובה תמיד. אין "easter eggs", אין רנדומיות בהתנהגות UI | מערכת לא-צפויה = חרדה לילד |
| 8 | **Very low visual density** | מקסימום 3–4 אלמנטים אינטראקטיביים פעילים על המסך בו-זמנית | יותר מ-4 בחירות = הילד מקפיא |
| 9 | **Color = meaning, never decoration** | צהוב = פעולה אפשרית. ירוק = הצלחה. כתום-רך = הזהרה (אסור אדום!). סגול = פרס | צבעים חוזרים ויוצרים שפה |
| 10 | **Time as content, not wait** | אין "מסך טעינה" סטטי. אם משהו לוקח זמן — דמות-מורה מספרת בדיחה | "המתנה" לבן 4 = "לא קורה כלום" = יוצא מהמשחק |
| 11 | **Touch targets > 80px** | גם לעכבר. גם לאייקונים. אין כפתורים קטנים, ולא כפתורים-בצמוד | מוטוריקה עדינה של בן 4 לא יכולה לכוון ל-40px |
| 12 | **Animation = confirmation** | כל שינוי-מצב מאומת ע"י תנועה. אם לחצת ומשהו לא זז — הילד לוחץ עוד פעם | סטטי = "לא קרה כלום" |
| 13 | **Hidden complexity, exposed simplicity** | הגדרות-הורה מאחורי PIN. ניהול-משימות-AI מאחורי PIN. הילד רואה רק "שחק" | מסך-הורה הוא קוגניטיבית אחר לגמרי |
| 14 | **Zero reading required** | כל טקסט = איקון + נקרא. הילד מצליח גם אם טקסט מוסתר | זו דרישת-ליבה — שני הילדים לא קוראים |
| 15 | **Familiar metaphors only** | בלון, פרי, חיה, כוכב, תיבה. **לא** gears, sliders, toggles, dropdowns | מטאפורות מופשטות = לא קיימות לבן 4 |
| 16 | **Flat structure, no menus** | אין navigation מקונן. מסך ראשי → מסך משימה → חזרה. סוף | כל רמת-תפריט = הילד הולך לאיבוד |
| 17 | **No time pressure** | אין shot clock, אין "אתה מאחר", אין "המהר!" | מתח-זמן ב-4 = bypass של הלמידה |
| 18 | **Empowerment over assistance** | רמז רק אחרי 10ש' תקיעות. תיתן לילד לפתור | עזרה מוקדמת = למידת חוסר-אונים |
| 19 | **Sibling-resilient** | בקנס שני ילדים אצל המסך — נעילת-משחק אחרי 3 ניסיונות שגויים מתאפסת לפרופיל הנכון | שני אחים יילחמו על העכבר |
| 20 | **Parent-aware, child-blind** | אינדיקטור-סנכרון בפינה (2% מהמסך) — ההורה רואה, הילד לא שם לב | טייטל ועניינים-לא-משחקיים לא מבטים-ילד |

### עומק קוגניטיבי לפי גיל

| גיל | יכולות אופייניות | מה זה אומר לעיצוב |
|-----|------------------|-------------------|
| 4 | זיהוי צבעים, צורות, חיות. ספירה עד 5. זיהוי שם+פנים. תהליכים של שלב-אחד | משימות כניסה — פעולה בודדת (לחיצה אחת = משוב מיידי) |
| 4.5 | ספירה עד 10. דפוסים פשוטים. התאמת-זוגות. שלבים של 2 | משימות drag-drop של 3 פריטים |
| 5 | התחלת זיהוי אותיות-בודדות. דפוסים מורכבים. תוצאה-וסיבה | משימות זיהוי-אות. הוראות עם 2 צעדים |
| 6 | זיהוי כל אותיות א-ב. ספירה עד 20. תכנון של רצף קצר. הבנת חוקים | משימות הקלדה, חישוב פשוט, רצפים |

המשחק **משתמש בקושי-מדורג** בתוך כל תבנית — לא רק "משימה קלה" vs "קשה", אלא **הסתעפויות** בתבנית עצמה לפי הצלחות הילד.

### "מס-המעבר" בין מסכים

קוגניטיבית, **כל מעבר-מסך עולה לילד מטבע-קשב**. עיצוב המינימליסטי:
- אין "skeleton screens" — תמיד יש משהו שמטריד (mascot מנופף).
- מעברים < 400ms.
- אם הילד צריך לעבור 2 מסכים בשביל לעשות פעולה — קונדנסציה לעמוד אחד.
- "Back" תמיד באותו מקום (פינה ימנית-עליונה ב-RTL).

---

## ספריית רכיבים — מערכת כפתורים מלאה

זוהי **ה-DNA של ה-UI**. כל כפתור במשחק עובר דרך `src/ui/button.js` ומקבל את הסגנון מהמערכת הזו. אין כפתורים "ידניים".

### היררכיית כפתורים — 10 סוגים

| # | סוג | שימוש | גודל מינ' | צבע | צורה |
|---|-----|--------|------------|-----|------|
| 1 | **Primary CTA** | "המשך", "התחל", "שמור" — פעולה ראשית | 200×96px | שמש (`#FFD93D`) | pill (radius 9999) |
| 2 | **Secondary** | "חזור", "דלג", "ביטול" | 160×80px | לבן + border 3px אלמוגי | pill |
| 3 | **Tertiary / Ghost** | "עוד פרטים", "השמע שוב" | 120×64px | שקוף + טקסט סגול | radius 24px |
| 4 | **Icon-only** | בית, הגדרות, השתק, סנכרון | 64×64px | לפי קונטקסט | circle |
| 5 | **Task Target** | "בלון", "כוכב", "פירות" (במשחק) | 100×100px (גריד) | רנדומלי-בוהק | אורגני (לפי האייקון) |
| 6 | **Profile Card** | "יואב", "מיה" — בחירת פרופיל | 220×280px | רקע צבע-הפרופיל | radius 32px, shadow גבוה |
| 7 | **Avatar Selector** | בחירת חיה ביצירת פרופיל | 100×100px (גריד 4×3) | לבן | circle |
| 8 | **Numeric Key** | PIN entry, hocus | 120×120px | לבן | radius 24px |
| 9 | **Visual Keyboard Key** | משימות הקלדה | 80×80px | לבן + הדגשת-קוהורט | radius 16px |
| 10 | **World Card** | בחירת עולם במפה | 280×320px | gradient לפי העולם | radius 48px, shadow מאוד-גבוה |

### מצבי כל כפתור (states)

```
default → hover → focus → pressed → disabled → loading
                ↘ narration → ↗
```

#### Default
- צבע מלא, shadow `0 8px 24px rgba(0,0,0,0.10)`.
- אופציונלי: **pulse עדין** ב-Primary CTA — `scale: 1 ↔ 1.02 every 2000ms` — לסמן "אני המטרה".

#### Hover
- `transform: scale(1.05)` + shadow `0 12px 32px rgba(0,0,0,0.16)`, transition 200ms ease-soft.
- **100ms אחרי כניסה:** `ui-hover.mp3` (טינק עדין, אם sound enabled).
- **600ms אחרי כניסה:** הקריינות מתחילה (text-to-speech של ה-`aria-label`).

#### Focus (keyboard navigation, רלוונטי בעיקר ב-parent dashboard)
- ring כחול-בהיר 4px solid + offset 2px.
- לא מבטל hover state — מצטבר.

#### Pressed (`:active`)
- `transform: scale(0.95)` ל-100ms, אז חזרה ל-1.0 ב-200ms ease-bounce.
- `ui-click.mp3`.
- ripple effect: עיגול לבן (50% opacity) מתפזר מנקודת-הקליק, fade-out ב-400ms.

#### Disabled
- `opacity: 0.5`, `pointer-events: none`, אך **לא** `display: none` (חשוב — הילד צריך להבין שזה קיים אבל נעול עכשיו).
- אייקון 🔒 קטן בפינה.
- hover על disabled → קריינות "צריך לסיים את ___ קודם" (במקום הטקסט הרגיל).

#### Loading
- spinner קטן מחליף את האייקון/הטקסט בכפתור.
- הכפתור נשאר באותם מידות (לא קופץ).
- aria-busy="true".

### Tokens של כפתור (CSS variables)

```css
:root {
  /* Primary CTA */
  --btn-primary-bg: #FFD93D;
  --btn-primary-text: #2D2A26;
  --btn-primary-shadow: 0 8px 24px rgba(255, 217, 61, 0.4);
  --btn-primary-hover-bg: #FFCE10;

  /* Secondary */
  --btn-secondary-bg: #FFFCF2;
  --btn-secondary-text: #D14545;     /* תוקן ב-Round 2 — היה #FF6B6B שנכשל ניגודיות 4.5:1 */
  --btn-secondary-border: 3px solid #D14545;

  /* Tertiary */
  --btn-tertiary-bg: transparent;
  --btn-tertiary-text: #8E44AD;
  --btn-tertiary-hover-bg: rgba(142, 68, 173, 0.08);

  /* Icon-only */
  --btn-icon-bg: rgba(255, 255, 255, 0.85);
  --btn-icon-size: 64px;

  /* States */
  --btn-pulse-scale: 1.02;
  --btn-hover-scale: 1.05;
  --btn-press-scale: 0.95;
  --btn-disabled-opacity: 0.5;
  --btn-focus-ring: 4px solid #0066CC;  /* תוקן ב-Round 2 — היה #4DA8FF שכמעט נכשל 3:1 */

  /* Sizing */
  --btn-primary-min-height: 96px;
  --btn-primary-padding: 24px 48px;
  --btn-primary-font: 700 28px/1.2 'Heebo', sans-serif;
}
```

### API של רכיב הכפתור (`src/ui/button.js`)

**Patch #4 מהמועצה: כל יצירת-DOM משתמשת ב-`textContent`, לא `innerHTML`** — מונע XSS אם שם-ילד או פלט-AI מגיעים ל-label.

```js
import { speakOnHover } from '../audio.js';

export function createButton({
  type = 'primary',         // 'primary' | 'secondary' | 'tertiary' | 'icon' | ...
  label,                    // טקסט גלוי
  icon,                     // אופציונלי: emoji או SVG-מהימן (לא user input!)
  hoverText,                // אופציונלי: טקסט אחר ל-narration (ברירת מחדל = label)
  onClick,
  disabled = false,
  disabledReason,
  ariaLabel,
  pulse = false
}) {
  const btn = document.createElement('button');
  btn.className = `btn btn--${type} ${pulse ? 'btn--pulse' : ''}`;
  btn.disabled = disabled;
  btn.setAttribute('aria-label', ariaLabel || label);

  // ⚠️ NEVER innerHTML — always textContent or createElement
  if (icon) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'btn__icon';
    iconSpan.textContent = icon;  // safe: emoji rendered as text
    btn.appendChild(iconSpan);
  }
  const labelSpan = document.createElement('span');
  labelSpan.className = 'btn__label';
  labelSpan.textContent = label;  // ⚠️ safe — XSS-proof
  btn.appendChild(labelSpan);

  // Hover-to-narrate (600ms)
  speakOnHover(btn, disabled ? disabledReason || `${label} עדיין נעול` : (hoverText || label));

  // Click → sound + handler
  btn.addEventListener('click', (e) => {
    if (disabled) return;
    playSound('ui-click');
    triggerRipple(e, btn);
    onClick?.(e);
  });

  return btn;
}
```

**אזהרה לעתיד:** אם משימת-AI מחזירה טקסט (Phase 2) — לעולם לא להזריק ישירות ל-DOM. עבור דרך DOMPurify או שכבת sanitization.

### דוגמאות-שימוש מלאות

```js
// Primary CTA במסך משימה
createButton({
  type: 'primary',
  label: 'המשך',
  icon: '➡️',
  pulse: true,
  hoverText: 'לחצו כאן למשימה הבאה',
  onClick: () => goToNextTask()
});

// Icon-only — בית
createButton({
  type: 'icon',
  icon: '🏠',
  label: '',
  ariaLabel: 'חזרה למסך הראשי',
  hoverText: 'חזרה לתפריט הראשי',
  onClick: () => goHome()
});

// Disabled — משימה נעולה במפה
createButton({
  type: 'world',
  label: 'עולם המקלדת',
  icon: '⌨️',
  disabled: !worldUnlocked,
  disabledReason: 'צריך לסיים את עולם העכבר קודם',
  onClick: () => enterWorld('keyboard')
});
```

### דוגמת קומפוננטה ויזואלית של Primary CTA (CSS)

```css
.btn--primary {
  background: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  min-height: var(--btn-primary-min-height);
  padding: var(--btn-primary-padding);
  border-radius: 9999px;
  font: var(--btn-primary-font);
  border: none;
  cursor: pointer;
  box-shadow: var(--btn-primary-shadow);
  transition:
    transform 200ms var(--ease-soft),
    box-shadow 200ms var(--ease-soft),
    background 200ms var(--ease-soft);
}

.btn--primary:hover:not(:disabled) {
  background: var(--btn-primary-hover-bg);
  transform: scale(var(--btn-hover-scale));
  box-shadow: 0 12px 32px rgba(255, 217, 61, 0.5);
}

.btn--primary:active:not(:disabled) {
  transform: scale(var(--btn-press-scale));
  transition-duration: 100ms;
}

.btn--primary:disabled {
  opacity: var(--btn-disabled-opacity);
  cursor: not-allowed;
}

.btn--pulse {
  animation: btn-pulse 2000ms var(--ease-soft) infinite;
}

@keyframes btn-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(var(--btn-pulse-scale)); }
}

@media (prefers-reduced-motion: reduce) {
  .btn { transition: opacity 200ms !important; animation: none !important; }
  .btn:hover, .btn:active { transform: none !important; }
}
```

### Checklist לכל כפתור חדש

לפני שכפתור עולה לקוד-ייצור, חייב לעבור:

- [ ] עובר דרך `createButton()` — לא DOM ידני
- [ ] יש לו `aria-label` ברור בעברית
- [ ] יש לו `hoverText` (גם אם זהה ל-label) — הקריינות חייבת לעבוד
- [ ] גודל ≥ 80×80px (אם icon-only) / 100×80px (אם עם טקסט)
- [ ] ניגודיות ≥ 4.5:1
- [ ] משוב ויזואלי על hover/active (transform או shadow)
- [ ] משוב קולי על click (`ui-click.mp3`)
- [ ] מצב disabled מוגדר אם אפשר להגיע אליו
- [ ] עובד עם `prefers-reduced-motion`

---

## Micro-Copy — שפת הקריינות

כתיבת קריינות לבני 4–6 היא **דיסציפלינה בפני עצמה**. כללים ברורים:

### 7 כללי כתיבה לקריינות

| # | כלל | טוב ✓ | רע ✗ |
|---|-----|-------|------|
| 1 | **פנייה ישירה בגוף-שני זוגי** ("בואו...", "תלחצו..." — לא "המשתמש יבחר") | "בואו ננסה!" | "ניתן ללחוץ על הכפתור" |
| 2 | **משפטים קצרים** (מקס 8 מילים) | "תלחצו על הבלון. כל הכבוד!" | "אם תרצו תוכלו עכשיו ללחוץ על הבלון הצהוב והוא יפוצץ" |
| 3 | **פעלי-עידוד**: "בואו", "ננסה", "נראה" | "בואו נראה מה קורה" | "המתינו לתוצאה" |
| 4 | **שמות-עצם קונקרטיים**, לא מופשטים | "בלון", "כוכב", "ארנב" | "אובייקט", "פריט", "אלמנט" |
| 5 | **חיוב, לא שלילה** | "כמעט! ננסה שוב" | "לא, טעית" |
| 6 | **שאלות-רטוריות** מעלות סקרנות | "מה יקרה אם נלחץ פה?" | "לחץ כאן" |
| 7 | **מילות-קסם של חגיגה**: "וואו", "אֵיזֶה", "באמת", "מצוין", "כל הכבוד" | "וואו, איזה כיף!" | "המשימה הושלמה" |

### בנק-משפטים סטנדרטיים

קונסיסטנטיות = הילד מזהה ולומד. תמיד נשתמש באותן מילים לאותם מצבים:

| מצב | משפט סטנדרטי |
|------|---------------|
| כניסה למסך-פתיחה | "שלום! מי משחק היום?" |
| הקראת שם פרופיל | "{name}" (רק השם, לא "זה {name}") |
| כניסה למשימה | "{instructionText}" |
| הצלחה — קטנה | "יופי!" / "כל הכבוד!" |
| הצלחה — בינונית | "וואו, איזה כיף!" / "מצוין!" |
| הצלחה — גדולה (סיום עולם) | "תראו תראו, סיימתם את כל עולם ה{world}!" |
| טעות עדינה | "כמעט! ננסה שוב!" / "אופ! אופ!" |
| 10ש' תקיעות | "{repeat instruction}" — חזרה מילולית על ההוראה |
| בקשת עזרה | "אם משהו לא ברור — תקראו לאמא או אבא" |
| יציאה / חזרה | "להתראות! נמשיך אחר-כך." |

### שינוי-טון לפי-מצב

- **משימה ראשונה ביום:** טון אנרגטי-מתלהב. "שלום! איזה כיף שבאתם!"
- **משימה ה-5 ביום ברצף:** טון רגוע יותר, אולי הזכרה לקחת הפסקה: "כל הכבוד שלמדתם הרבה! רוצים הפסקה קטנה?"
- **אחרי טעות:** טון רך, מעודד. "אופ! אין בעיה, ננסה עוד פעם."
- **אחרי הצלחה:** טון חוגג אך לא היסטרי (לא רוצים גירוי-יתר).

### הקראת מספרים וזמן

- **מספרים:** תמיד במילים בעברית — "שתיים", לא "2".
- **זמן:** "עכשיו", "אחר-כך", "מהר", "לאט". אין "תוך שתי דקות" — לא רלוונטי לבן 4.

### עברית — נקודות דקדוקיות חשובות ל-TTS

- **שווא נע vs נח:** TTS-ים לא תמיד מבחינים. נכתוב טקסט עם **ניקוד מלא** במקומות שגויים תכופים.
- **ה' הידיעה:** ה-TTS עברי יודע. נכתוב רגיל.
- **מילים עם kre-ktiv שונה** (כמו "אכלתי" / "אכלת") — נבחר את הצורה שה-TTS מבטא נכון, נבדוק ידנית.
- **אזהרת-כתיב לחיצה כפולה:** TTS-ים מבטאים "לחיצה" שונה מ"לחצה" — נשים לב.
- **קונסיסטנטיות במילים יחודיות:** "עכבר" תמיד "עכבר", לא לחילופין "עכברון" — הילד לומד את המילה.

---

## רגעי-מעבר ומיקרו-אינטראקציות

**"רגע-מעבר" = הצוואר-בקבוק הכי גדול ב-UX לילדים.** כשהילד עובר ממסך A למסך B, יש 400ms שבהם **הוא לא יודע מה קורה**. אם זה לא מנוהל — הילד הולך לאיבוד.

### 5 רגעי-מעבר מרכזיים

1. **כניסה למשימה חדשה (`splash`)**
   - 0–400ms: מסך-המפה דועך, רקע-העולם של המשימה החדשה נכנס.
   - 400–800ms: דמות-המורה צצה ב-scale-in, אומרת את שם המשימה: "בלונים!".
   - 800–1400ms: ההוראה נקראת.
   - 1400ms ואילך: המשחק עצמו מתחיל (המטרות צצות אחת-אחת ב-stagger).
   - **לא** מתחילים את המשחק לפני שההוראה נגמרה.

2. **סיום משימה → חגיגה (`celebration`)**
   - כבר תועד. 1.8s.

3. **חגיגה → מסך-המפה (`return`)**
   - 0–300ms: החגיגה מתפוגגת.
   - 300–600ms: מסך-המפה נכנס, **המשימה שזה-עתה סיימת מהבהבת ירוק** (`✓` מתאפשרת).
   - 600–900ms: הכוכב החדש "עף" מהמיקום של המשימה לאיזור-הצבירה למעלה.
   - 900ms: הכוכבים-הכוללים מתעדכנים עם +1.
   - **קריינות אוטומטית** (אחרי 1200ms): "כל הכבוד! יש לכם כבר 18 כוכבים!"

4. **מעבר בין-עולמות (`world-transition`)**
   - 0–500ms: השער של העולם הקודם נסגר (אנימציה: שני דלתות מתקרבות במרכז).
   - 500–1000ms: השער של העולם החדש נפתח.
   - 1000–1500ms: הקריינות: "ברוכים הבאים לעולם ה{שם}!"

5. **התעוררות אחרי inactivity (`come-back`)**
   - אם הילד שתק 30 שניות: דמות-המורה צצה מהפינה עם הנפת-יד.
   - 60 שניות: הקריינות: "אתם כאן? נמשיך כשרוצים!"
   - 120 שניות: pause מלא — מסך-הפתיחה חוזר (לאפשר לילד אחר לבוא).

### Micro-interactions פר-תבנית

מעבר ל-state-changes של כפתורים, יש micro-interactions ספציפיות לכל תבנית:

#### `click-targets`
- מטרות **לא** מופיעות בבת-אחת — צצות ב-stagger של 150ms ביניהן.
- כל מטרה עושה bounce-in קטן (scale 0 → 1.1 → 1).
- כשהילד לוחץ — pop animation (scale 1 → 1.4 + opacity → 0 + צליל-פוצץ).
- מונה ההתקדמות (3/5) מתעדכן באנימציה — הספרה הקודמת זזה למעלה ונעלמת, החדשה נכנסת מלמטה.

#### `drag-drop-match`
- **Drag-start**: הפריט מקבל `scale: 1.1` + shadow-deep. צליל "grab".
- **תוך-גרירה**: היעדים הנכונים מקבלים pulse עדין. היעדים הלא-נכונים נשארים סטטיים. **הילד מקבל רמז ויזואלי מי "מצפה לו"**.
- **Drop נכון**: snap-to-position + צליל-חיובי + הפריט נמוג.
- **Drop לא-נכון**: shake קטן (3 רעידות, ±5px ב-200ms סך-הכל) + פריט חוזר למקור.

#### `key-press`
- מקלדת ויזואלית על המסך כל הזמן.
- כשהמקש הנכון מוקש — הוא **בוהק** (glow צהוב 300ms).
- כשהילד מקיש מקש לא-נכון — המקש מקבל shake קטן, **אבל הכפתור הנכון מתחיל לפלסט כרמז**.

#### `point-and-narrate`
- כל אובייקט-יעד יש לו indicator-מצביע (חץ עדין מהבהב).
- אחרי שהילד מצביע ושומע — האובייקט מקבל ✓ ירוק קטן.
- כשכל האובייקטים סומנו — חגיגה.

---

