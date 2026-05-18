# PLAN CONTROL — בקרה על שינויי-תכנון

## פורמט

```markdown
## CHG-NNN | YYYY-MM-DD HH:MM | סטטוס: ✅/🟡/🔴
**מהות:** מה השתנה
**טריגר:** מי ביקש ולמה
**שינוי-עיקרי:** ...

### סעיפים שהושפעו
- [x] §מחסנית טכנית — עודכן
- [x] §מבנה תיקיות — עודכן
- ...

### וידוא-עקביות
- ✅ Grep "X" — כל ההפניות עקביות
```r

## CHG-001 | 2026-05-17 | ✅ הוטמע
**מהות:** הוספת Drive sync ל-MVP (היה Phase 2)
**טריגר:** משתמש - "חיבור מהיר ל-Google Drive"
**שינוי:** העברת sync/ ל-MVP, הוספת PowerShell Launcher

## CHG-002 | 2026-05-17 | ✅ הוטמע
**מהות:** Multi-user — תמיכה ב-N פרופילים
**טריגר:** משתמש - "פתיחת משתמשים נוספים"

## CHG-003 | 2026-05-17 | ✅ הוטמע
**מהות:** ~40 patches מ-2 סבבי Council
**טריגר:** Council recommendation
**שינוי:** PIN PBKDF2, HttpListener bind, OAuth GIS, XSS textContent, ועוד 36

## CHG-004 | 2026-05-17 | ✅ הוטמע
**מהות:** Round 2 Final fixes
**טריגר:** Council Round 2 review
**שינוי:** CSS tokens, TTS rate consistency, prepared names, PIN recovery, lockout time