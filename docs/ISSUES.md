# ISSUES — יומן באגים ותיקונים

## פתוחים

(כרגע אין באגים — לא התחלנו לבנות לוגיקה. ה-Council זיהה ~40 patches שתועדו בPLAN.md ויושמו כתשתית.)

## תוקנו

### BUG-001 | 2026-05-19 | ✅ תוקן
**תיאור:** טקסט "חכמוני" בלוגו זולג מעבר ל-x-anchor ועובר על איור-הינשוף.
**איפה:** 6 קבצי SVG (`assets/logo/active/*.svg`, `assets/logo/version-a/*.svg`, `assets/logo/version-b/*.svg`) + `design-mocks/01-logo-options.html`.
**איך לשחזר:** פותחים `01-logo-options.html` בכרום. רואים את הטקסט עולה על הינשוף ב-hero (300×80) ו-medium (180×56).
**Severity:** High (פוגע ב-visual identity של המוצר).
**מתעד:** ההורה (visual inspection ב-2026-05-19).
**סיבה-שורש:** `<text>` השתמש ב-`text-anchor="end"` בלי `direction="rtl"`. דפדפן רינדר את העברית bidi-reversed (וויזואלית RTL), אבל text-anchor פעל לפי כיוון-ברירת-מחדל LTR — כך נקודת-העיגון יושבת על התו ה"אחרון" לוגית (י), שהוא וויזואלית השמאלי-ביותר, וכל הטקסט נמתח ממנו ימינה במקום שמאלה.
**תיקון:** `text-anchor="end"` → `text-anchor="start" direction="rtl"`. עכשיו נקודת-העיגון יושבת על "ח" (התו הראשון לוגית, וויזואלית הימני) והטקסט נמתח שמאלה — בדיוק מתחת לפס-האדום ובלי לעבור על הינשוף.
**Commit:** (ידני, באותה סשן)
**Learning:** Universal Constraints ב-`CLAUDE-DESIGN-BRIEFS.md` צריך לכלול חוק: "כל `<text>` עברי ב-SVG חייב `direction='rtl'`". פתיחת patch ל-Brief-template הבא.

## פורמט-רישום (לכל באג חדש)

```markdown
### BUG-NNN | YYYY-MM-DD | סטטוס
**תיאור:** מה קרה
**איפה:** קובץ:שורה
**איך לשחזר:** צעד-אחר-צעד
**Severity:** Critical / High / Medium / Low
**מתעד:** מי דיווח (Claude / Council / Kid testing)
**תיקון:** מה נעשה (אחרי תיקון)
**Commit:** hash אחרי תיקון
```

## דוגמה

```markdown
### BUG-001 | 2026-05-20 | ✅ תוקן
**תיאור:** TTS לא נעצר בעת מעבר-מסך מהיר, יוצר queue overflow.
**איפה:** `src/audio.js:42`
**איך לשחזר:** הקלקה מהירה על "הבא" 5 פעמים ברצף.
**Severity:** High
**מתעד:** agent-performance ב-Council של Phase 1
**תיקון:** הוספת `speechSynthesis.cancel()` בfunction `speak()` לפני כל קריאה.
**Commit:** abc123f
```
