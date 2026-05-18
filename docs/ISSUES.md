# ISSUES — יומן באגים ותיקונים

## פתוחים

(כרגע אין באגים — לא התחלנו לבנות לוגיקה. ה-Council זיהה ~40 patches שתועדו בPLAN.md ויושמו כתשתית.)

## תוקנו

(ריק — יתעדכן עם תיקוני-באגים אמיתיים בעתיד)

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
