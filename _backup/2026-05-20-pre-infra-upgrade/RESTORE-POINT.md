# 🛟 נקודת-שחזור — לפני שדרוג-תשתית

> **תאריך:** 2026-05-20
> **נוצר:** לפני שדרוג-תשתית של חכמוני (בעקבות R-Design-1 + ניתוח-השוואתי מול wall)

---

## מה זו הנקודה הזו?

זוהי **תמונת-מצב מלאה ובטוחה** של פרויקט חכמוני, נכון לרגע לפני שמתחילים שינויי-תשתית
(פיצול PLAN.md, הוספת RISKS.md, שדרוג קבצי-תיעוד וכו').

אם משהו ישתבש בשדרוג — אפשר לחזור לכאן ולקבל את הפרויקט בדיוק כמו שהיה.

## פרטי-הגיבוי

| פריט | ערך |
|------|------|
| **Commit hash** | `b896787657ef215a1ad9734ecb354bae1c871769` |
| **Commit קצר** | `b896787` |
| **הודעת-Commit** | docs: add visual decision board for R-Design-1 |
| **ענף-גיבוי** | `backup/pre-infra-upgrade-2026-05-20` |
| **תגית-גיבוי** | `backup-2026-05-20-pre-infra` |
| **Phase בזמן-הגיבוי** | 0.5 (40%) — Brief #1 + #2 הושלמו |

## איך משחזרים (אם צריך)

### אפשרות 1 — לראות את המצב הישן בלי לשנות כלום
```powershell
cd "C:\Users\b0066820\Desktop\Claude project\Interactive-educational-game"
git checkout backup/pre-infra-upgrade-2026-05-20
```
זה מעביר אותך ל"צילום" הישן. כדי לחזור להווה:
```powershell
git checkout main
```

### אפשרות 2 — לשחזר את main לגמרי למצב הישן (פעולה הרסנית!)
⚠️ זה **מוחק** את כל מה שנעשה אחרי הגיבוי. רק אם באמת צריך.
```powershell
cd "C:\Users\b0066820\Desktop\Claude project\Interactive-educational-game"
git checkout main
git reset --hard backup-2026-05-20-pre-infra
git push --force origin main
```

### אפשרות 3 — לשחזר קובץ בודד בלבד
```powershell
git checkout backup-2026-05-20-pre-infra -- <נתיב/הקובץ>
```

## הערה

**אל תמחק** את ענף-הגיבוי ואת התגית. הם הרשת-הביטחון. הם תופסים מעט-מאוד מקום.
git שומר את ההיסטוריה ממילא — הענף והתגית פשוט מקלים למצוא את הנקודה הזו.

**במקרה של ספק — אל תריץ `git reset --hard` או `git push --force` לבד.** בקש מ-Claude Code לעזור.
