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

### וידוא-עקביות
- ✅ Grep "X" — כל ההפניות עקביות
```

---

## CHG-001 | 2026-05-17 | ✅ הוטמע
**מהות:** הוספת Drive sync ל-MVP (היה Phase 2)
**טריגר:** משתמש — "חיבור מהיר ל-Google Drive"
**שינוי:** העברת sync/ ל-MVP, הוספת PowerShell Launcher

---

## CHG-002 | 2026-05-17 | ✅ הוטמע
**מהות:** Multi-user — תמיכה ב-N פרופילים (היה 2)
**טריגר:** משתמש — "פתיחת משתמשים נוספים"

---

## CHG-003 | 2026-05-17 | ✅ הוטמע
**מהות:** ~40 patches מ-2 סבבי Council
**טריגר:** Council recommendation
**שינוי:** PIN PBKDF2, HttpListener bind, OAuth GIS, XSS textContent, ועוד 36

---

## CHG-004 | 2026-05-17 | ✅ הוטמע
**מהות:** Round 2 Final fixes
**טריגר:** Council Round 2 review
**שינוי:** CSS tokens, TTS rate consistency, prepared names, PIN recovery, lockout time

---

## CHG-005 | 2026-05-17 | 📋 תוכנן (טרם ביצוע — Phase 1)
**מהות:** Parent Profiles + Fast-Path First-Run + 4 ערוצי-נוכחות-הורה
**טריגר:** משתמש — "המשחק יפתח ללא משתמשים קבועים. ילד תחילה, אז הורה. ההורה חלק מהמשחק."
**שינוי-עיקרי:**
- 2 סוגי פרופילים: `kind: 'child' | 'parent'`
- עד 2 הורים (אבא + אמא)
- Schema: `age`, `favoriteColor`, `gender`, `nameNiqud`, `voiceRecordings`, `parentIds`
- 4 ערוצי-נוכחות-הורה: avatar בפרופיל, cameo בחגיגה (50%), הקלטת-קול 4ש', תמונות בdashboard
- 8 צבעים-ראשיים לבחירת-ילד (כל הילדים, ללא הבדלי-גיל/מגדר)
- PIN משותף + 3 רמות-איפוס (recovery question / Drive email / URL emergency)
- A/B Niqud Preview לשמות-עמומים (אורי/הילי)
- AES-GCM encryption + Drive sync של voice (מוצפן)

### סעיפים שהושפעו ב-PLAN.md
- [x] §מחסנית טכנית — AES-GCM, MediaRecorder API
- [x] §מבנה תיקיות — db.js חדש, parents.js מאוחד, niqud-preview, gender-picker
- [x] §פרופילים — schema v2 חדש
- [x] §חוויית פעם-ראשונה — Fast-Path + Progressive Onboarding
- [x] §IDEAS.md — 8 רעיוני-הרחבת-הורה (P1)
- [x] §סיכום-מהיר — עודכן

### תוצאות Council Round 3
- UX-Kid: 🔴 FAIL → תוקן ע"י Fast-Path
- Hebrew: 🟡 WARNING → gender field + 4sec recording + A/B preview
- Security: 🟡 WARNING → AES-GCM + lockout
- Code-Review: 🟡 WARNING → parents merge + db.js + naming
- Integration: 🟡 WARNING → IndexedDB centralized + cleanup + cascade delete

---

## CHG-006 | 2026-05-17 | 📋 חלק מ-CHG-005
**מהות:** Round 3 Council Patches (14 patches)
**טריגר:** Council Round 3 review
**שינוי:**
1. Fast-Path Mode (30ש' עד משחק)
2. parents.js → profiles.js (מאוחד)
3. src/db.js חדש (IndexedDB מרכזי, version-bump אחד)
4. `gender` field לדקדוק עברי
5. `voiceRecordings: { nameKey, cameoKey }` מאוחד
6. `ttsOverride` אחיד (לא nameTTS+textTTS)
7. A/B Niqud Preview (לא Niqud Picker)
8. 4 שניות הקלטה + waveform + auto-trim
9. Toggle "שם בלועזית" + translit
10. 30 שמות-מוכנים (היה 20)
11. AES-GCM encryption (voice + photo)
12. PIN reset lockout (5 ניסיונות + exponential backoff)
13. voice-recorder.js cleanup contract (`stream.getTracks().forEach(t => t.stop())`)
14. celebration.js pre-fetch של voice לפני החגיגה

### החלטות-משנה שהוחלטו ע"י ההורה
1. Voice → Drive sync (מוצפן) ✅
2. PIN → משותף + 3 רמות-איפוס ✅
3. Cameo → אקראי 50/50 ✅
4. Solo parent → Cameo עדיין ✅
