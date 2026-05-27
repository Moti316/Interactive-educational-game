---
tags:
  - guide
  - parent
---

# מדריך הורה — חכמוני 🦉

ברוך הבא! המסמך הזה מסביר איך:
1. להפעיל את המשחק לילדים
2. להגדיר Drive Sync (אופציונלי, ~30 דק' חד-פעמי)
3. לגבות / לשחזר נתונים
4. לאפס PIN שכחת

---

## 1. הפעלה רגילה — לחצן-דבל-קליק

```
שלב 1: רץ פעם-אחת:  scripts\install-shortcut.ps1
שלב 2: ילד עושה דבל-קליק על "חכמוני" בשולחן-העבודה
```

זהו. השרת קם, Chrome נפתח אוטומטית על `http://127.0.0.1:8080`, המשחק מתחיל.

לסגירה — סוגרים את חלון Chrome. השרת ימשיך לרוץ ברקע; אפשר לסגור גם את חלון PowerShell.

### במקרה של תקלה
- **"השרת לא עולה"** — ודא ש-PowerShell 5.1+ זמין. הסקריפט תואם.
- **"דף-לבן ב-Chrome"** — פתח DevTools (F12) ובדוק שגיאות.
- **"Audio לא עובד"** — Chrome חוסם autoplay. הילד יקליק פעם-אחת, ואז שמע יעבוד.

---

## 2. הגדרת Drive Sync (אופציונלי)

ההתקדמות נשמרת בענן Google Drive — מאפשר לעבור מחשבים בלי לאבד כוכבים.

**ההיקף:** scope אחד בלבד — `drive.file`. האפליקציה רואה **רק** קבצים שהיא יצרה. **לא** שאר ה-Drive שלך. לעולם.

### שלבים — חד-פעמי, ~30 דק'

#### א. יצירת פרויקט ב-Google Cloud Console

1. פתח https://console.cloud.google.com
2. צור פרויקט חדש: שם "chachmoni" (או כל שם).
3. בתפריט-צד → **APIs & Services** → **Library**
4. חפש "Google Drive API" → לחץ **Enable**

#### ב. יצירת OAuth Consent Screen

1. **APIs & Services** → **OAuth consent screen**
2. סוג: **External** (חינם)
3. שם אפליקציה: "חכמוני"
4. אימייל-תמיכה: האימייל שלך
5. **Scopes**: הוסף `https://www.googleapis.com/auth/drive.file` (לא יותר!)
6. **Test users**: הוסף את האימייל שלך (יספיק עד שתפרסם)
7. שמור

#### ג. יצירת OAuth Client ID

1. **APIs & Services** → **Credentials**
2. **+ CREATE CREDENTIALS** → **OAuth client ID**
3. סוג אפליקציה: **Web application**
4. שם: "Chachmoni Local"
5. **Authorized JavaScript origins**:
   - הוסף `http://127.0.0.1:8080`
   - הוסף `http://127.0.0.1:8081` (וגם 8082-8085 לכל הבטחון)
6. **Authorized redirect URIs**: אותם URLs (8080-8085)
7. שמור → תקבל **Client ID** בצורה `1234567890-abc.apps.googleusercontent.com`

#### ד. הדבק את Client ID בקוד

ערוך את הקובץ `src/sync/drive-config.js`:

```javascript
export const DRIVE_CONFIG = Object.freeze({
  CLIENT_ID: 'הדבק כאן את ה-Client ID',
  SCOPE: 'https://www.googleapis.com/auth/drive.file',
});
```

שמור. הפעל מחדש את המשחק (Ctrl+C ב-PowerShell, ואז שוב start-chachmoni.ps1).

#### ה. בדיקה

1. כניסה למשחק רגיל.
2. ⚙ (פינה ימנית) → הכנס PIN.
3. בקופסת **סנכרון Google Drive** → "התחבר ל-Google" → אישור.
4. לחץ "סנכרן עכשיו" → צריך לראות "סונכרן (N פרופילים)".

מעכשיו, כל פעם שהמשחק יעלה — סנכרון אוטומטי ברקע.

### אם משהו השתבש

- **"OAuth Client ID לא הוגדר"** — לא הדבקת ל-`drive-config.js`. חזור לשלב ד'.
- **"403 Forbidden"** — בדוק שהוספת את האימייל ב-Test users.

---

## 3. גיבוי ושחזור (מקומי, בלי Drive)

### ייצוא
1. ⚙ → PIN → **גיבוי וייבוא** → **ייצוא נתונים**.
2. הדפדפן מוריד `chachmoni-backup-YYYY-MM-DD.json`.
3. שמור במקום בטוח (USB, Drive ידני, אימייל לעצמך).

הקובץ מכיל: כל הפרופילים · כוכבים · משימות-שהושלמו · תמונות-פרופיל.

### ייבוא
1. ⚙ → PIN → **גיבוי וייבוא** → **ייבוא נתונים**.
2. בחר את הקובץ JSON.
3. הנתונים יידחפו ל-localStorage + IndexedDB.

הייבוא **מוזג** (merge) — כל key נדרס לפי הקובץ.

---

## 4. PIN — איפוס ושחזור

PIN של ההורה הוא 4 ספרות. נשמר hash (PBKDF2 + salt) ב-localStorage, לא ב-clear.

### 3 שכבות איפוס

| תרחיש | מה לעשות |
|--------|-----------|
| **זוכר את ה-PIN** | פשוט הכנס אותו ב-⚙ |
| **שכחתי PIN** | DevTools (F12) → Application → Local Storage → מחק `chachmoni:parentPin` |
| **כפתור "אפס PIN"** | זמין מתוך הגדרות (אם נכנסת בעבר) |
| **אופציה אחרונה** | מחק את התיקייה `~/AppData/Local/Google/Chrome/User Data/Default/Local Storage` |

**ניסיונות:** 3 שגויים → נעילה 30 שניות.

---

## 5. הרכב הפרויקט (לסקרנים)

```
chachmoni/
├── index.html
├── src/
│   ├── app.js              ← state machine + routing
│   ├── audio.js            ← TTS עברי (he-IL, rate 0.85)
│   ├── audio-cues.js       ← צלילי-עידוד (Web Audio synth)
│   ├── storage.js          ← localStorage wrapper
│   ├── db.js               ← IndexedDB (Blobs)
│   ├── profiles.js         ← CRUD פרופילים
│   ├── photo-store.js      ← תמונות (magic-bytes + canvas)
│   ├── backup.js           ← Export / Import JSON
│   ├── pin-entry.js        ← PIN (PBKDF2-SHA256 100K)
│   ├── settings.js         ← לוח-מחוונים להורים
│   ├── welcome.js          ← מסך פתיחה
│   ├── worlds.js           ← מפת-עולמות
│   ├── tasks.js            ← נתוני 40+ משימות
│   ├── celebration.js      ← מסך חגיגה
│   ├── browser-check.js    ← בדיקת-תאימות
│   ├── ui/
│   │   ├── button.js       ← factory יחיד לכל הכפתורים
│   │   └── avatar-picker.js
│   ├── templates/          ← 8 מיני-משחקים
│   │   ├── click-targets.js
│   │   ├── hover-target.js
│   │   ├── double-click-reveal.js
│   │   ├── drag-drop-match.js
│   │   ├── right-click-menu.js
│   │   ├── key-press.js
│   │   ├── type-word.js
│   │   └── point-and-narrate.js
│   └── sync/
│       ├── drive-config.js  ← OAuth Client ID כאן
│       ├── drive-auth.js
│       └── drive-sync.js
├── styles/
│   ├── global.css
│   └── components.css
├── assets/
│   ├── mascot/             ← 6 תנוחות של פרופ' חכמוני
│   ├── avatars/            ← 12 אווטארים
│   ├── logo/
│   └── icons/
└── scripts/
    ├── start-chachmoni.ps1
    └── install-shortcut.ps1
```

---

## 6. הסבר על "חוסר-כישלון"

המשחק תוכנן ל**חוסר-כישלון** — לכל פעולה יש פידבק חיובי. גרירה לא-נכונה? "ננסה שוב" + הכדור חוזר. PIN שגוי? "ננסה שוב בעוד רגע". אין מסכי-מוות, אין טיימרים, אין רף-עליון.

תהליך-משחק טוב לגיל 4-6:
- ילד יושב **לבד**, ההורה רחוק (אבל זמין)
- 10-15 דק' לסשן, לא יותר
- אחרי 3 משימות = "כל הכבוד, היום סיימנו"

---

## 7. בעיות נפוצות

| בעיה | פתרון |
|------|--------|
| המסך לבן | DevTools (F12) → Console → קח צילום-מסך |
| ילד לא קורא — איך יבחר פרופיל? | אווטאר + שם נקראים בקול (hover או טאצ') |
| Drive Sync לא עובד | בדוק שהוספת את `127.0.0.1:8080` באוריגינים המורשים |
| PowerShell חוסם הרצה | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| המשחק תקוע ב"טוען…" | רענן את הדף, ובדוק DevTools Network |

---

## 8. ערוצי-עזרה

- **באג ב-UI/קוד:** פתח issue ב-GitHub
- **שאלה כללית:** פנה למפתח
- **רצונות-לעתיד:** הוסף ל-`docs/spec/CONTENT.md`

תהנו! 🎉
