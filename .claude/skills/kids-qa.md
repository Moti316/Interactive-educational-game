---
name: kids-qa
description: QA checklist for kid-game testing in Chachmoni. Activates for bug checks, testing, kid feedback review, and pre-release verification.
---

# Skill: kids-qa (QA Checklist)

## Pre-Release Checklist — לכל משימה חדשה

### Voice / Narration
- [ ] קריינות אוטומטית בכניסה למסך
- [ ] hover-to-replay על כל אלמנט-טקסט (600ms)
- [ ] קריינות לא מוקלטת באמצע (cancel before speak)
- [ ] rate: 0.85, lang: 'he-IL' מאומת
- [ ] טקסט עומד בכללי-כתיבה (`docs/STYLE-GUIDE.md`)

### UX
- [ ] כפתורים ≥ 80×80px
- [ ] משוב ויזואלי על hover/click
- [ ] אין מסך-כשלון (רק "ננסה שוב")
- [ ] רמז אוטומטי אחרי 10ש' תקיעות
- [ ] inactivity help (30/60/90/120s)
- [ ] confetti ratchet-down אחרי 3 משימות-ברצף

### Accessibility
- [ ] ניגודיות 4.5:1 (טקסט רגיל), 3:1 (UI)
- [ ] `prefers-reduced-motion` fallback
- [ ] keyboard navigation (Tab, Enter, Esc)
- [ ] focus ring נראה (#0066CC)
- [ ] aria-label בכל אלמנט אינטראקטיבי
- [ ] alt-text לתמונות

### Performance
- [ ] FCP < 1s ב-localhost
- [ ] cleanup() מוחזר מ-mount()
- [ ] speech queue לא דולפת
- [ ] memory growth < 50MB ב-30 דק'

### Multi-Profile
- [ ] התקדמות נשמרת פר-פרופיל
- [ ] Drive sync — קובץ-נפרד לכל ילד
- [ ] hover על שם-פרופיל = הקראת השם

### Security
- [ ] PIN — PBKDF2 + salt + 100K iterations
- [ ] OAuth — drive.file scope בלבד
- [ ] textContent, לא innerHTML עם user/AI input
- [ ] photo upload — magic-bytes + canvas re-encode

## Testing Protocol עם ילדים

ראה `docs/TESTING.md` לפרוטוקול-מלא (15 דק', 3 משימות, 5 אינדיקטורי-מצוקה).

## טריגרים

הפעל בכל פעם שאתה:
- מסיים שלב-בנייה (לפני High Council)
- מתקן באג
- מוסיף תכונה חדשה
- מכין לpre-release
