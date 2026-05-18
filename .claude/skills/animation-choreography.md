---
name: animation-choreography
description: Animation choreography skill for Chachmoni. Activates for any CSS animation, transition, celebration sequence, or motion design.
---

# Skill: animation-choreography

## עקרון

**אנימציות לילדים = רכות, איטיות, צפויות.** כל אנימציה משרתת מטרה (משוב, הכוונה, חגיגה). אין whiplash.

## Tokens של תנועה (מ-`tokens.css`)

```css
--ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-instant: 100ms;
--duration-quick: 200ms;
--duration-base: 400ms;
--duration-celebration: 800ms;
```

## מעברי-מסכים (RTL)

- **כניסה למסך:** slide-in מימין + fade-in, 400ms ease-soft.
- **יציאה ממסך:** slide-out לשמאל + fade-out, 300ms.
- **חזרה (←):** הפוך (slide-in משמאל, slide-out לימין).

## Hover על כפתור

- `transform: scale(1.05)` + shadow גדל, 200ms ease-soft.
- 100ms אחרי כניסה: `ui-hover.mp3`.
- 600ms אחרי כניסה: קריינות מתחילה.

## Click על כפתור

- `transform: scale(0.95)` ל-100ms, חזרה ל-1.0 ב-200ms ease-bounce.
- ripple effect: 400ms.
- `ui-click.mp3`.

## Celebration (סיום משימה) — 1.8 שניות, 6 שלבים

1. **0–200ms:** הפריט-מטרה האחרון נעלם עם spin + fade.
2. **200–400ms:** רקע מתבהר (overlay לבן 30%).
3. **400–800ms:** דמות-המורה צצה ב-scale-in (`ease-bounce`).
4. **800–1200ms:** 5–10 כוכבים (⭐) צצים ועפים כלפי מעלה.
5. **1200–1400ms:** "כל הכבוד!" מופיע ב-scale-in + קריינות.
6. **1400–1800ms:** כפתורי "הבא" / "חזרה" מופיעים מלמטה.

**Ratchet-down:** אחרי 3 משימות-ברצף — חגיגה מצומצמת (4 חלקיקים, ללא scale-up, ללא mascot bounce).

## רמז (אחרי 10ש' תקיעות)

- "יד מצביעה" (👆) פולסטת על המטרה הנכונה — `scale: 1 → 1.2 → 1` בלולאה 800ms.
- קריינות חוזרת על ההוראה.

## Drive Sync Indicator

- מסונכרן (✓): סטטי.
- מסנכרן (↻): רוטציה 360°/1500ms.
- שגוי (⚠): pulse opacity 1 ↔ 0.6, 1000ms.

## Confetti

- **Canvas 2D**, לא DOM (60fps יציב).
- 20 חלקיקים נופלים, 1500–2500ms, ease-out.
- כפתור-Stop (🛑) — WCAG 2.2.2.
- ב-reduced-motion: לא מופיע.

## `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  /* Transforms (slide, scale, spin) → opacity-only fades */
  /* Celebrations מתקצרות ל-300ms סה"כ */
  /* Confetti לא מופיע */
}
```

## טריגרים

הפעל בכל פעם שאתה:
- כותב CSS @keyframes או transition
- בונה celebration / mockup-screen
- מטמיע hover/click states
- בודק אנימציות עם prefers-reduced-motion
