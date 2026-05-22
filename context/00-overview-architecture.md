# חכמוני — משחק לימוד מחשב לילדים

> **שם המשחק:** חכמוני
> **דומיין (מוצע):** chachmoni.app
> **קהל יעד:** ילדי 4–6 שעדיין לא יודעים לקרוא
> **מטרה:** ללמד שימוש בעכבר, מקלדת בסיסית, ניווט ומושגים — כולו ב-voice-first עברי

---

## תכנון

## 🏛️ Council Round 3 — CHG-005 Review (2026-05-17)

5 sub-agents סקרו את CHG-005. **תוצאות:**

| Agent | Status | Critical |
|-------|--------|----------|
| 👶 UX-Kid | 🔴 **FAIL** | First-Run 3-5 דק' = נצח לבן-4. נדרש Fast-Path |
| 🇮🇱 Hebrew | 🟡 WARNING | חסר `gender` field, 2sec הקלטה קצר מדי, Niqud Picker טכני |
| 🛡️ Security | 🟡 WARNING | Voice unencrypted, recovery lockout חסר |
| 🔍 Code-Review | 🟡 WARNING | `parents.js` מיותר (כפילות), naming inconsistency |
| 🔗 Integration | 🟡 WARNING | IndexedDB schema לא-מתועד, orphan blobs, cleanup חסר |

### 🔧 12 Patches Round 3 — יושמו

#### Critical Architecture
1. **Fast-Path Mode** (UX-Kid) — הילד יכול לשחק תוך 30 שניות (Skip-To-Play). פרופיל-הורה דחוי ל-Progressive Onboarding אחרי 5 משימות.
2. **`parents.js` הוסר** (Code-Review) — אוחד ב-`profiles.js` עם `createChild()`, `createParent()`, `getRandomParent()`. מודול-אחד, חוזה-אחד.
3. **`src/db.js` חדש** (Integration) — מרכז את כל ה-IndexedDB stores: `photos`, `voices`, `migrations-backup`. version-bump אחד, `onupgradeneeded` יחיד.

#### Schema Enhancements
4. **`gender: 'boy' | 'girl' | 'neutral'`** ל-profile schema (Hebrew) — קריטי לדקדוק עברי ("גיבור/גיבורה"). אופציה ל-"לא להגיד".
5. **`voiceRecordings: { nameKey, cameoKey }`** מאוחד (Code-Review) — במקום `nameVoiceKey` + `voiceRecordingKey` (כפילות).
6. **`ttsOverride` במקום `nameTTS` + `textTTS`** — naming אחיד.

#### Hebrew Pronunciation
7. **A/B Niqud Preview** במקום Niqud Picker (Hebrew) — "אוֹרִי? [▶] או אוּרִי? [▶]" — בחירה במקום ניקוד.
8. **הקלטת-שם: 4 שניות + waveform + auto-trim** (Hebrew) — היה 2 שניות, קצר מדי.
9. **Toggle "שם בלועזית?"** + translit אוטומטי (Hebrew) — Ethan/Sophie/Liam.
10. **30 שמות-מוכנים** עם ניקוד+הקלטה מוכנים (Hebrew) — היה 20.

#### Security
11. **AES-GCM encryption ל-voice/photo בpolymorphic IndexedDB** — key נגזר מ-PIN (PBKDF2). Recovery lockout: 5 ניסיונות → 30s→5min→1h→24h backoff.
12. **Profile deletion cascade** — `deleteProfile()` מוחק גם blobs ב-IndexedDB + מסיר parentIds מילדים מקושרים.

#### Cleanup Contracts
13. **`voice-recorder.js` cleanup** — `stream.getTracks().forEach(t => t.stop())` + mount/cleanup contract תיעוד.
14. **`celebration.js` pre-fetch** — קול-ההורה נטען לפני החגיגה, לא במהלכה (Race fix).

### החלטות שאומצו

- **Drive Sync של voice-recordings:** רק מקומי ב-MVP (Phase 2 — אופציה).
- **Parent Cameo probability:** 50% (לא 30% — UX-Kid אמר שזה נדיר מדי).
- **age-picker / color-picker:** **לא** מודולים נפרדים. variants ב-`button.js`.

### לא-יושם (Phase 2)

- וידאו-קמיו של הורה (וידאו במקום אודיו)
- PIN פר-הורה (PIN משותף ב-MVP)
- 8 רעיוני-הרחבת-הורה (`docs/spec/IDEAS.md`)

---

## 🆕 CHG-005 | First-Run Flow + Parent Profiles (2026-05-17, אחרי Phase 0.5)

**טריגר:** משתמש: "אני רוצה שהמשחק יפתח ללא משתמשים קבועים, הצעד הראשון יהיה הוספת ילד עם שם, גיל, צבע, אווטאר/תמונה. אחר-כך הגדרת ההורה: PIN, שם, אווטאר/תמונה — שהילד ירגיש שאמא ואבא חלק מהמשחק."

**שינוי:** הרחבה משמעותית של First-Run Experience + הוספת **Parent Profile** כישות-ראשונה-במשחק (לא רק PIN).

### חלוקה: 2 סוגי-פרופילים

המערכת תמכה ב-N "פרופילים" — עכשיו כל פרופיל יש לו `kind`:
- **`kind: 'child'`** — פרופיל-ילד. יש לו: שם, גיל, צבע-מועדף, אווטאר/תמונה, התקדמות.
- **`kind: 'parent'`** — פרופיל-הורה. יש לו: שם, אווטאר/תמונה, הקלטת-קול, קשור ל-PIN. אין התקדמות-משחקית.

**עד 2 הורים** (אבא + אמא) + **N ילדים**. כל פרופיל-הורה מקושר ל-PIN משלו (או PIN משותף).

### Schema מעודכן

```js
// localStorage key: 'chachmoni:profiles'
{
  profiles: [
    // ─── ילדים ───
    {
      id: 'p-1738249100',
      kind: 'child',
      name: 'יואב',
      age: 5,                          // 🆕 chips 4/5/6/7/8
      favoriteColor: '#FF6B6B',        // 🆕 מ-palette של 8 צבעים-ילדיים
      avatarType: 'preset',
      avatarValue: 'rabbit',
      schemaVersion: 2,
      progress: { ... },
      settings: { ... },
      // 🆕 קישור להורים — שהילד ידע "מי המשפחה"
      parentIds: ['p-parent-1', 'p-parent-2']
    },
    // ─── הורים ───
    {
      id: 'p-parent-1',
      kind: 'parent',
      name: 'אבא',                    // או "מוטי", או כל שם
      avatarType: 'photo',            // עדיף תמונה אמיתית (אינטימי יותר)
      photoStoreKey: 'photo-parent-1',
      voiceRecordingKey: 'voice-parent-1',  // 🆕 IndexedDB
      pinHashRef: 'pin-1',            // PIN משלו (או shared)
      schemaVersion: 2,
      role: 'mother' | 'father' | 'guardian'
    }
  ],
  lastActiveProfileId: 'p-1738249100'
}
```

### 8 צבעים ראשיים — בורר-צבע-מועדף לילד

הילד יבחר עיגול-צבעוני אחד מתוך 8. **הכפתורים גדולים פיזית** (120×120px) כדי שיהיה קל לבחור. **אותה רשימה זהה לכל הילדים** — בני 4, 5, 6, 7 או 8, בנים ובנות — כולם רואים את אותה פלטה של 8 צבעים-ראשיים-בולטים:

| צבע | hex | מתאים לרקע-פרופיל |
|------|-----|---------------------|
| 🔴 אדום | `#FF6B6B` (אלמוגי) | ✓ |
| 🟠 כתום | `#FFA552` | ✓ |
| 🟡 צהוב | `#FFD93D` (שמש) | ✓ |
| 🟢 ירוק | `#6BCB77` (נענע) | ✓ |
| 🔵 כחול | `#6FC3DF` (שמיים) | ✓ |
| 🟣 סגול | `#C9A0DC` (לבנדר) | ✓ |
| 🤎 חום | `#A0826D` | ✓ |
| 🩷 ורוד | `#FFB6C1` | ✓ |

**Patch:** עדכון `tokens.css` להוסיף 2 צבעים חדשים (`--color-orange`, `--color-brown`, `--color-pink`) שעדיין לא קיימים.

### חוויית פעם-ראשונה — Flow חדש (Round 3: Fast-Path)

זמן-משך: **~30 שניות** עד שהילד משחק (Fast-Path) + Progressive Onboarding של ההורה לאחר 5 משימות.

> **Patch Round 3 (UX-Kid FAIL):** הילד-בן-4 שמתלהב לשחק לא יחכה 3-5 דקות. ה-Flow פוצל ל-2 חלקים: ילד מהיר → משחק → הורה אחר-כך.

#### חלק 1: Fast-Path (~30 שניות)
מסך 1 — ברוכים-הבאים-מיני (5ש'):
- חכמוני מנופף + "שלום! מה השם שלך?"
- 2 כפתורים: **"בוא נשחק עכשיו"** (Primary CTA) / **"הגדרה מלאה"** (אם הורה כבר שם)

מסך 2 — שם בלבד (15ש'):
- שדה-שם + Pronunciation Preview
- ברירת-מחדל: גיל=5, צבע=שמש (אקראי), אווטאר=ארנב
- "המשך לשחק!"

מסך 3 — מיני תרגול (10ש'):
- "תלחץ על הכוכב הזה!" → לחיצה → "מצוין!"
- מעבר ישיר ל-משחק (משימה 1)

**אחרי 5 משימות מוצלחות** → Progressive Onboarding:

#### חלק 2: Progressive Onboarding (~2 דקות, מופיע אחרי 5 משימות)
חכמוני מופיע: "כל הכבוד! עכשיו בוא נכיר אותך טוב יותר ונזמין את אבא/אמא."

- **שלב 2a — עריכת הילד:** גיל (chips 4-8), צבע-מועדף (4 צבעים ראשיים + "עוד"), אווטאר מותאם או תמונה
- **שלב 2b — הזמנת הורה:** "📲 קרא לאמא או אבא"
  - PIN, שם, אווטאר/תמונה, הקלטת-קול (4ש' + waveform + auto-trim)
- אם הילד מדלג: מצב-אורח נשאר עד שהורה ייכנס

#### פיצול-בעלות (Patch UX-Kid)
- מסך-שם: **ילד-לבד** מצליח (Pronunciation Preview עוזר)
- שלב "תמונה": **תווית-הורה** (📷 אייקון של הורה)
- שלב "חיה": **תווית-ילד** (🐰 אייקון של ילד)
- הקלטת-הורה (15ש'): **אנימציית-חכמוני** מתעסקת עם הילד בזמן ההקלטה

```
מסך 1: ברוכים-הבאים-קצר (15ש')
  - "שלום! אני פרופ' חכמוני."
  - "בוא נכיר אותך. ואת אמא/אבא."
  - כפתור: "בואו נתחיל"

מסך 2: יצירת פרופיל-ילד (60ש')
  שלב 2a: שם
    - Chips של 20 שמות-עבריים נפוצים + "אחר (להקליד)"
    - כפתור "🔊 שמע את השם" → Pronunciation Preview
  שלב 2b: גיל
    - Chips: 4 / 5 / 6 / 7 / 8 (5 כפתורי-גדולים)
    - הקריינות: "כמה אתה בן?"
  שלב 2c: צבע-מועדף
    - Grid 4×2 של 8 צבעים-עיגוליים-ענקיים
    - הקריינות: "איזה צבע אתה הכי אוהב?"
    - הילד נוגע → הצבע מתרחב + שם-הצבע מוקרא
  שלב 2d: אווטאר או תמונה
    - 2 כפתורים-ענקיים: "🐰 חיה" / "📷 התמונה שלי"
    - "חיה": grid 4×3 של 12 אווטארים → בוחר
    - "התמונה": file-picker + crop dialog (300×300)
    - Preview של הפרופיל-המלא בסוף

מסך 3: יצירת פרופיל-הורה (60-90ש')
  - הקריינות: "עכשיו תור של אמא או אבא. הם חלק מהמשחק שלך!"
  - כפתור: "📲 קרא לאמא או אבא" (מומלץ — צליל מובחן)
  - אופציה: "אני אעשה לבד" (ילד מהיר)
  
  שלב 3a: שם-הורה ("אבא" / "אמא" / שם-פרטי)
  שלב 3b: PIN של 4 ספרות
    - "תקליד 4 ספרות שתזכור — כל פעם שתרצה לראות הגדרות"
    - PBKDF2 + salt + 100K iterations
  שלב 3c: שאלת-recovery
    - "אם תשכח: מה תאריך-הלידה שלך? (DD/MM)"
  שלב 3d: אווטאר או תמונה (עדיף תמונה — אינטימי)
    - אותו flow כמו של הילד
  שלב 3e: הקלטת-קול 🎤
    - "תרצה להקליט משפט-עידוד שיופיע בחגיגות?"
    - דוגמה: "אני אוהבת אותך, יואב! כל הכבוד!"
    - 15 שניות מקסימום, MediaRecorder API → Blob → IndexedDB
    - אופציונלי — אפשר לדלג
  שלב 3f: "להוסיף הורה נוסף?" (אבא + אמא)

מסך 4: סיור-קצר עם פרופ' חכמוני (30ש')
  - "תכיר את העכבר!" (איור עכבר)
  - "תלחץ על הכוכב הזה" — תרגול ראשון
  
מסך 5: כניסה למשחק
  - "בוא נשחק!" → מסך-פתיחה עם הפרופיל החדש
  - האווטאר של ההורה מופיע בפינה למעלה ב-30% אטימות
```

### 4 ערוצי-נוכחות-הורה (כל ה-4 אושרו)

| איפה | מה רואים | מה שומעים |
|------|----------|------------|
| **1. מסך-פרופיל-הילד** | אווטאר/תמונת-הורה בפינה (קטן, אטימות 60%) | hover → "אבא/אמא" |
| **2. חגיגת-משימה (אקראית, פעם ב-3-5 משימות)** | פופ-אפ אווטאר-ההורה לרגע ("3 שניות") | "וואו! אבא/אמא גאה בך!" — TTS דינמי |
| **3. הקלטת-קול (אם הוקלטה)** | אווטאר-ההורה במרכז | הקלטה אמיתית של ההורה: "אני אוהבת אותך, יואב!" — מתנגנת מ-IndexedDB |
| **4. Parent Dashboard** | תמונות-ההורים בצד-הראש של הדשבורד | — (זה מסך-הורה, לא ילד) |

### תזמון Cameo בחגיגות (כדי לא להגזים)

- חגיגה רגילה (משימה 1-2): רק mascot
- חגיגה משופרת (כל 3-5 משימות אקראית): mascot + parent-cameo + voice
- סיום-עולם (כל 18 משימות): mascot + שני ההורים יחד + voice ארוך

### תוספות לקבצי-המקור

**`src/parents.js`** (חדש):
- CRUD לפרופיל-הורה
- `getRandomParent()` לחגיגה
- linkChildToParents()

**`src/voice-recorder.js`** (חדש):
- MediaRecorder API
- שמירת blob ב-IndexedDB עם key `voice-{parent-id}`
- חזרה: 15ש' max, MP3 encoding

**`src/ui/age-picker.js`** (חדש):
- 5 chips: 4 / 5 / 6 / 7 / 8
- selected state ב-`--color-sun`

**`src/ui/color-picker.js`** (חדש):
- 8 עיגולים-ענקיים (120×120px)
- hover על עיגול → "שמע את שם-הצבע"
- selected state עם border-thick

**`src/celebration.js`** (עדכון):
- בכל חגיגה 3-5 — הוסף parent-cameo עם 30% probability
- אם voiceRecording קיים — נגן אותו

**`design-mocks/`** קבצים חדשים:
- `03b-profile-create-child-wizard.html` (4 שלבים)
- `03c-profile-create-parent-wizard.html` (5-6 שלבים)
- `12b-celebration-with-parent.html`

### תוספות לקבצי-MD

- **`docs/spec/ARCHITECTURE.md`** — הוסף section "Parent Profiles" עם diagram של relationship
- **`docs/spec/CONTENT.md`** — הוסף NARRATION לטקסטי first-run
- **`docs/spec/STYLE-GUIDE.md`** — הנחיות לטקסטי-מעורבות-הורה ("אבא/אמא גאה בך")
- **`docs/process/PROCESSES.md`** — תהליך First-Run + תהליך parent-cameo
- **`docs/quality/SECURITY.md`** — שמירת קול-הורה (לא נשלח לDrive? או כן? להחליט)
- **`docs/log/PLAN-CONTROL.md`** — CHG-005 entry

### 🇮🇱 טיפול בשמות-עבריים-עמומים (CHG-005 enhancement)

**הבעיה אמיתית:** TTS עברי (Asaf, Hila) לא תמיד מבטא נכון שמות עם **כתיב-חסר** או **דו-משמעות**. דוגמאות:

| שם | קריאה אפשרית #1 | קריאה אפשרית #2 | מה ה-TTS עלול לבחור |
|----|------------------|------------------|----------------------|
| **אורי** | אוֹרִי (Ori) | אוּרִי (Uri) | אקראי |
| **הילי** | הִילִי (Hili) | הֵילִי (Hailee) | לעיתים שגוי |
| **שיר** | שִׁיר (Shir, שם) | שִׁיר (song, אותו דבר) | OK |
| **רן** | רָן (Ran) | רֹן (Ron) | משתנה |
| **עמרי** | עָמְרִי (Omri) | עַמְרִי (Amri) | משתנה |
| **רותם** | רוֹתֵם (Rotem) | רֹתֶם (Rotem variants) | OK |
| **מאי** | מַאי (May) | מָאִי (Ma'i) | OK |
| **תאיר** | תָּאִיר (Ta'ir) | TYR | משתנה |

### פתרון 3-שכבתי

#### שכבה 1: Pronunciation Preview (חובה — כבר ב-plan)

במסך-יצירת-פרופיל, ליד שדה-השם:
```
[שדה השם] [🔊 שמע את השם]
```
ההורה לוחץ → מאזין → אם נכון, ממשיך. אם לא נכון, עובר לשכבה 2.

#### שכבה 2: Niqud Override (חדש)

אם ההורה שמע ולא בסדר — מופיעה אופציה:
```
לא נשמע נכון?
[ הוסף ניקוד ]
```
לחיצה → modal עם השם + 6 כפתורים-ניקוד (תפתח אותיות בודדות, ההורה לוחץ "א" → בחירת ניקוד מתפריט: ַ ָ ֵ ֶ ִ ֹ ֻ ).
שומר ב-`profile.nameNiqud` ומעביר ל-TTS.

לדוגמה: השם "אורי" → ההורה מנקד "אוֹרִי" או "אוּרִי" → TTS מבטא נכון.

#### שכבה 3: הקלטת-קול-של-ההורה (Fallback אחרון — כבר ב-plan)

אם גם הניקוד לא עוזר (TTS מתעקש לבטא רע), ההורה לוחץ:
```
[ 🎤 הקלט את השם בקול שלך ]
```
המודול `voice-recorder.js` (CHG-005) פתוח — ההורה אומר "יואב" → 2 שניות → שמירה ב-IndexedDB עם key `name-voice-{profileId}`.

מאז: בכל פעם שהמשחק "מקריא את שם הילד" — הוא משתמש בהקלטה במקום TTS.

### Schema מורחב לטיפול-שמות

```js
{
  id: 'p-1738249100',
  kind: 'child',
  name: 'אורי',                       // הטקסט המוצג
  nameNiqud: 'אוֹרִי',                  // 🆕 ניקוד-מלא לקריינות
  nameTTS: 'אורי',                     // 🆕 fallback ידני (אם TTS לא קולט ניקוד)
  nameVoiceKey: 'name-voice-p1738',    // 🆕 מפתח להקלטה ב-IndexedDB (אם הוקלטה)
  ...
}
```

### Flow ב-`audio.js` (Patch ל-CHG-005)

```js
async function speakName(profile) {
  // עדיפות 1: הקלטה אמיתית של ההורה
  if (profile.nameVoiceKey) {
    const blob = await indexedDB.get('voice-store', profile.nameVoiceKey);
    return playBlob(blob);
  }
  // עדיפות 2: ניקוד מ-niqud field (TTS יבטא נכון יותר)
  if (profile.nameNiqud) {
    return speak(profile.nameNiqud);
  }
  // עדיפות 3: nameTTS override ידני (אם יש)
  if (profile.nameTTS) {
    return speak(profile.nameTTS);
  }
  // ברירת-מחדל: השם כפי שהוא
  return speak(profile.name);
}
```

זהה לפרופיל-הורה (שם-הורה יכול להיות "אבא" / "אמא" / "מוטי" / "ליאת" — כולם דורשים אותו טיפול).

### השכבות בפועל — חוויית-משתמש

**95% מהשמות** יעבדו ב-TTS ברירת-מחדל (שכבה 1 — פשוט מאשרים).
**4% (כמו אורי/עמרי/רן)** ידרשו ניקוד-ידני (שכבה 2 — 30 שניות עבודה להורה).
**1% (שמות-זרים, יחודיים מאוד)** ידרשו הקלטה (שכבה 3 — 10 שניות).

### ✅ החלטות-משנה — הוחלטו ע"י ההורה (2026-05-17)

1. **קול-הורה — Drive sync?** ✅ **כן — מסונכרן ל-Drive (מוצפן AES-GCM)**.
   - הקלטה ב-IndexedDB מוצפנת + עותק מוצפן ב-Drive.
   - העלאה לאחר OAuth + הצפנה עם key נגזר מ-PIN.
   - גודל-Drive: ~150KB × 2 הורים = ~300KB. שולי.
   - **תועלת:** במחשבי-סבא/סבתא — הילדים שומעים את אבא/אמא שלהם בחגיגות.

2. **PIN משותף או פר-הורה?** ✅ **משותף לשני ההורים + ⚙ flow לאיפוס**.
   - 2 ההורים יודעים את אותו PIN.
   - **תוספת חדשה (Round 3 fix):** מסלול-איפוס מורחב:
     - **רמה 1:** שאלת-recovery (תאריך-לידת-הורה DD/MM) — בילד תיק.
     - **רמה 2:** "שלחו לי email-איפוס" — דרך Drive OAuth (גוגל שולחת מייל-אימות).
     - **רמה 3:** איפוס-מלא של PIN דרך מסך-הגדרות-מיוחד שמופיע ב-`?reset-pin=family-emergency` (URL ידני).

3. **איזה הורה מקבל Cameo?** ✅ **אקראי 50-50** (במקרה של 2 הורים).
   - בכל חגיגה: `Math.random() < 0.5 ? parent1 : parent2`.
   - לא מבוסס "מי הקליט יותר" — שיוויון מוחלט.

4. **אם רק הורה אחד הוקם?** ✅ **כן, Cameo של ההורה היחיד**.
   - לא מרגיש "חסר" — הילד חווה עידוד מההורה היחיד שלו.
   - אם אין הורים בכלל — Guard ב-`celebration.js` יבטל cameo (mascot-only).

### תוספות-קוד הנדרשות (Round 3 final)

**PIN Recovery Flow (חדש)** — `src/parent-recovery.js`:
- `tryRecoveryQuestion(answer)` → אם נכון: מאפשר reset PIN.
- `tryEmailReset()` → דרך Drive OAuth — שולח מייל מ-Google עם קוד-אימות.
- `manualReset()` → URL-only `?reset-pin=family-emergency` (לא מקושר ב-UI הילד).

**Drive Encryption** — `src/sync/drive-encrypt.js`:
- Key derivation: PBKDF2 על PIN + project-salt → AES-GCM key.
- כל קובץ-voice/photo ב-Drive מוצפן לפני העלאה.
- בעת טעינה — פענוח עם אותו key (דורש PIN פעיל).
- **חשוב:** אם ההורה מאפס PIN, הקבצים-הישנים לא ניתנים לפענוח (הסיכון הטבעי). הילדים יקבלו TTS גנרי במקום הקלטה.

### לא בתכנון (Phase 2 — רעיונות-הרחבה למעורבות-הורה)

1. **וידאו-מסר במקום קול** — הורה מקליט וידאו 10ש' של עידוד שמופיע בחגיגות-מיוחדות.
2. **מסר-טקסטואלי שההורה כותב** — מסך-הגדרות → "כתוב הודעה ליואב" → ההודעה מוקראת ע"י TTS בקול-המורה למחרת בכניסה למשחק.
3. **עדכוני-הורה ב-WhatsApp/Email** — כשהילד מסיים עולם, ההורה מקבל push: "יואב סיים את עולם-העכבר! יש לו 18 כוכבים."
4. **"סלון-משפחה"** — מסך-מיוחד שכל המשפחה רואה התקדמות-כולם (גם של אחיינים מרוחקים, אם הם משתמשים גם הם בחכמוני).
5. **"משימה משותפת אבא+ילד"** — משימות-מיוחדות שהילד וההורה צריכים לעשות יחד (לדוגמה: הורה אומר אות → ילד לוחץ עליה. מקרב משפחה).
6. **תמונה-קבוצתית בסיום-עולם** — הילד והורה מצטלמים יחד דרך מצלמת-המחשב, התמונה נשמרת בדף-הישגים.
7. **"יומן-יואב"** — הילד יכול ללחוץ ☆ אחרי משימה ולסמן "אהבתי את זה" — ההורה רואה ב-dashboard מה מצא חן בעיני הילד.
8. **"לחץ פה לעודד"** — לפני שינה, ההורה לוחץ כפתור והודעת-לילה-טוב מהמורה תופיע מחר בבוקר ("אבא ביקש שאגיד לך — לילה טוב, יואב!").

כל אלו ל-Phase 2/3 בעתיד — לא לפני MVP.

---

## 🏛️ Council Pre-Build Review — 2026-05-17

**הופעלה מועצה מלאה של 8 סוכנים, בשני סבבים.** תוצאות:

### Round 2 (Final) — אחרי יישום ~40 patches

| Agent | Round 1 | Round 2 |
|-------|---------|---------|
| 🛡️ Security | 🟡 WARNING (10 issues) | ✅ **PASS** (2 minor warnings) |
| 👶 UX-Kid | 🟡 WARNING (3 critical) | 🟡 WARNING (prepared names — תוקן ב-Round 2 final) |
| ♿ A11y | 🟡 WARNING (3 critical) | 🟡 WARNING (CSS tokens — תוקן ב-Round 2 final) |
| 🇮🇱 Hebrew | 🟡 WARNING (4 critical) | 🟡 WARNING (rate consistency — תוקן ב-Round 2 final) |
| ⚡ Performance | 🟡 WARNING (3 critical) | ✅ **PASS** (3 nice-to-have) |
| 🔍 Code-Review | 🟡 WARNING (5 critical) | ✅ **PASS** (TRANSITIONS table partial) |
| 🔗 Integration | 🟡 WARNING (4 critical) | 🟡 WARNING (contract docs needed) |
| ✅ QA | 🟡 WARNING (6 critical) | 🟡 WARNING (instrumentation gaps) |

**שיפור Round 1 → Round 2:** 3 PASS, 5 WARNING (היו 0/8 → 3/8 PASS) + תיקוני-Round-2-final החלשו את ה-WARNINGS שנותרו.

### תיקוני Round 2 Final שיושמו (אחרי סקירה שנייה)
1. ✅ **CSS tokens regression** — `--btn-secondary-text/border` עודכן ל-`#D14545`, `--btn-focus-ring` ל-`#0066CC` (A11y)
2. ✅ **TTS rate consistency** — כל ההפניות הוחלפו מ-0.75 ל-0.85 (Hebrew)
3. ✅ **Prepared names list** — מסך-יצירת-פרופיל קיבל 20 שמות-נפוצים + Pronunciation Preview (UX-Kid + Hebrew)
4. ✅ **PIN recovery question** — מ"שם החיה" (ילד יודע!) ל"תאריך-לידת-הורה" + hash (Security)
5. ✅ **Lockout time** — אחיד ל-15 דקות (UX-Kid)

### Round 1 — 14 Patches החובה שיושמו (מהסבב הראשון)

| Agent | Status | Critical | Warnings |
|-------|--------|----------|----------|
| 🛡️ Security | 🟡 WARNING | 0 | 10 |
| 👶 UX-Kid | 🟡 WARNING | 3 | 5 |
| ♿ A11y | 🟡 WARNING | 3 | 10 |
| 🇮🇱 Hebrew | 🟡 WARNING | 4 | 6 |
| ⚡ Performance | 🟡 WARNING | 3 | 7 |
| 🔍 Code-Review | 🟡 WARNING | 5 | 8 |
| 🔗 Integration | 🟡 WARNING | 4 | 7 |
| ✅ QA | 🟡 WARNING | 6 | 7 |

**סיכום:** 0 PASS / 8 WARNING / 0 FAIL.
**המלצת-יו"ר:** 🟡 **GO with mandatory patches** — התכנון יציב יסודית, אבל **14 patches קריטיים** חובה לפני שלב 0.

### 14 ה-Patches החובה (מיושמים מיד ב-PLAN.md)

| # | Patch | סוכן-מקור | תיקון |
|---|-------|-----------|--------|
| 1 | **ניגודיות-צבעים נכשלת** — לבן על פסטל = 1.7–2.5:1, מתחת 4.5:1 | A11y | טקסט בכל הכפתורים = `#2D2A26` (כהה-חם). Secondary button: text+border = `#D14545` (גוון כהה יותר של אלמוגי) |
| 2 | **PIN — SHA-256 חלש (rainbow-table פותרת בשנייה)** | Security | PBKDF2-SHA256 עם salt-16-byte + 100K iterations |
| 3 | **HttpListener bind על כל ה-interfaces** | Security | binding מפורש ל-`http://127.0.0.1:8080/` (לא localhost/star) + Host-header validation |
| 4 | **innerHTML XSS על שמות-ילדים ו-AI output** | Security | `textContent` בכל מקום עם input משתמש/AI. אם innerHTML — DOMPurify |
| 5 | **Drive schema-inconsistency** (קובץ-יחיד vs פר-ילד) | Integration | סופית: **פר-פרופיל**. סעיף "סנכרון אוטומטי" עודכן |
| 6 | **Storage prefix `mouse-school:*` vs `chachmoni:*`** | Code-Review | אחיד ל-`chachmoni:*` בכל מקום |
| 7 | **PIN-trap לבן 4** — נתקע במסך-PIN | UX-Kid | כפתור ענק "← חזרה למשחק" במסך-PIN + הקראה: "זה רק לאמא ואבא" |
| 8 | **TTS rate 0.75 איטי מדי** | Hebrew | ברירת-מחדל `0.85`, slider 0.7–1.1 בהגדרות-הורה |
| 9 | **"PIN" בקריינות-לילד** | Hebrew | בקריינות: "סיסמה" / "קוד-סודי". בטקסט-הורה: "PIN" נשאר |
| 10 | **Port 8080 תפוס = crash** | Code-Review | סקריפט בודק 8080 → 8081 → ... ו-OAuth רושם 8080–8085 |
| 11 | **OAuth Implicit Flow מיושן (Google ביטל 2023)** | Security | מעבר ל-GIS Token Client החדש + state-nonce |
| 12 | **Photo source-of-truth דו-משמעי** (IndexedDB+Drive) | Integration | **Drive = source of truth**, IndexedDB = cache בלבד |
| 13 | **git auto-sync vs hooks race** | Code-Review | `.git/sync.lock` file mechanism — task scheduler לא רץ אם hook עובד |
| 14 | **Speech queue memory leak** (30min play) | Performance | `speechSynthesis.cancel()` ב-cleanup contract של כל template + max queue size |

### 6 שיפורים מומלצים (לפני שלב 1)

| # | Patch | סוכן |
|---|-------|------|
| 15 | TESTING.md ריק — צריך פרוטוקול-בדיקות מלא לפני שלב 1 | QA |
| 16 | RECOVERY.md חדש — runbook לתרחישי-משבר (Drive נמחק, PIN שכוח) | QA |
| 17 | Lazy loading מפורש: dynamic import לכל template + task | Performance |
| 18 | First-Run "guest mode" אם הילד לבד (בלי הורה) | UX-Kid |
| 19 | Font review: Heebo + Assistant (vs Varela Round) לעברית | Hebrew |
| 20 | Pronunciation preview במסך-יצירת-פרופיל (TTS test) | Hebrew |

### 5 הצעות-אופטימיזציה (אופציונליות)

| # | המלצה | סוכן |
|---|-------|------|
| 21 | Light Council כ-default (3 agents), Full Council רק לפני MVP-release | Code-Review |
| 22 | איחוד 23→15 קבצי MD (PROGRESS+TASKS+CHANGELOG ⇒ STATUS; PLAN-CONTROL+DECISIONS ⇒ DECISIONS) | Code-Review |
| 23 | תבניות `click-targets` + `double-click-reveal` + `right-click-menu` → תבנית אחת עם `mode:` | Code-Review |
| 24 | Playwright smoke-tests (1 פר template = 8 בדיקות) | QA |
| 25 | Lighthouse CI ב-`scripts/audit.ps1` | Performance |

**דוח מלא ב-`docs/log/COUNCIL.md` לאחר תחילת-בנייה.** עכשיו אוסיף את ה-14 ה-patches החובה לסעיפים-הרלוונטיים.

---

## ⚡ סכום מהיר — מה נבנה בפועל

### MVP (~11 ימי עבודה) — Local-Only + Drive Sync

| תחום | מה ב-MVP | מה לא ב-MVP |
|------|-----------|--------------|
| **לימוד** | 50 משימות מובנות + ווריאציות (~250 חוויות) | 28 משימות נוספות (Phase 2) |
| **שפה/קול** | Web Speech API עברי, hover-to-replay | TTS-fallback mp3 (Phase 2) |
| **פרופילים** | מקומיים, עם אווטאר מאויר או תמונה אישית | — |
| **איפה רץ** | **מקומית! PowerShell Launcher** פותח `http://localhost:8080` ב-Chrome | אירוח באינטרנט, URL פומבי |
| **גיבוי ידני** | **Export/Import JSON** — כפתורים במסך-הגדרות | — |
| **גיבוי אוטומטי** | **Google Drive sync** — גיבוי פר-ילד, אוטומטי בכל סיום-משימה | — |
| **תוכן חדש** | 50 משימות + ווריאציות אוטומטיות | גנרטור AI (Phase 2) |
| **דפדפן** | Chrome עדכני | Edge/Firefox/Safari (לא נבדק) |
| **עדכוני קוד** | git auto-sync — pull כל שעה ע"י Task Scheduler | — |

### למה Local + Drive (השילוב הנכון)

- ✅ **100% פרטי בקוד** — הקוד רץ מהמחשב המקומי, אין שירות-אירוח שיכול לראות.
- ✅ **רק נתוני-הילדים** הולכים ל-Drive — וזה ה-Drive של ההורה, פרטי לחלוטין.
- ✅ **אבטחה מירבית** — אין URL פומבי. השרת לוקלי, רץ רק כשהמשחק פתוח.
- ✅ **גיבוי-לכל-ילד נפרד** — ההתקדמות של יואב לעולם לא מתערבבת עם של מיה.
- ✅ **פשטות להורה** — קיצור-דרך אחד בשולחן-העבודה. הילדים לוחצים → משחקים.
- ✅ **חינמי** — Drive חינמי עד 15GB (אנחנו משתמשים ב-~50KB).

### מה ההורה עושה ב-MVP

1. ✅ **פעם אחת בהתחלה (5 דק'):** התקנת קיצור-הדרך בשולחן-העבודה.
2. ✅ **פעם אחת לפני שלב Drive (30 דק'):** הקמת OAuth Client ב-Google Cloud Console — לפי הוראה מפורטת ב-`docs/guides/DEPLOY.md`.
3. ✅ **בערב, מהבית (30 דק'):** העתקת 5 briefs ל-Claude Design.
4. ✅ **תוך כדי פיתוח (15 דק' לאחר כל שלב):** בדיקה עם הילדים.

---

## הקשר (Context)

המשתמש (אבא) מבקש לבנות משחק דפדפן בעברית שילמד את ילדיו (בני 4 ו-6) את היסודות של הפעלת מחשב: שימוש בעכבר, מקלדת בסיסית, ניווט בסיסי ומושגים כלליים. **שני הילדים עדיין לא קוראים** — לכן המערכת כולה חייבת להיות **voice-first**: כל טקסט שמופיע על המסך מוקרא בקול. הטקסט הכתוב הוא תוספת ויזואלית להורים ולעתיד, לא אמצעי-הוראה לילדים.

המשחק יבנה כעת מאפס יחד עם המשתמש (אין קוד קיים), בעברית בלבד, עם RTL, ורץ **Local + PowerShell Launcher** — שרת-מקומי קטן על `http://localhost:8080` שמתחיל אוטומטית מקיצור-דרך בשולחן-העבודה. אין אירוח באינטרנט, אין URL פומבי. תומך ב-**מספר בלתי-מוגבל של פרופילי-ילדים** (לא רק 2).

המבנה: סדרת **משימות** לינארית — 50 משימות "מקוריות" + **ווריאציות רנדומיות בתוכן** של כל משימה (פעם בלונים, פעם דגים, פעם פירות) + **גנרטור AI אופציונלי** ליצירת משימות חדשות לחלוטין. סה"כ: תוכן בלתי-מוגבל בפועל. **כל המשחק נשען על קריינות איטית, ידידותית-לילד, בעברית.** עמידה (hover) על כל כפתור משמיעה מחדש את ההוראה — אין מצב שהילד נשאר בלי שמיעה של מה לעשות.

**דרישות מערכת נוספות שאושרו:**
- **פרופילים מקומיים — 2 סוגים** (CHG-005): פרופיל-**ילד** (עם שם, גיל, צבע-מועדף, אווטאר/תמונה, התקדמות) + פרופיל-**הורה** (עד 2 הורים — שם, אווטאר/תמונה, הקלטת-קול, PIN).
- **תמיכה בתמונה אמיתית** של הילד וההורים (העלאה דרך file picker + canvas crop).
- **First-Run משופר** (CHG-005): פרופיל-ילד → פרופיל-הורה → mascot intro. ההורה הוא חלק-מהמשחק.
- **4 ערוצי-נוכחות-הורה במשחק** (CHG-005): אווטאר בפרופיל-ילד, parent-cameo בחגיגה, הקלטת-קול-עידוד, תמונות ב-parent-dashboard.
- **Hover על שם הילד = הקראת השם בקול**.
- **סנכרון אוטומטי ל-Google Drive** כגיבוי (דורש הגדרת OAuth client חד-פעמית).
- **סנכרון דו-כיווני אוטומטי ל-GitHub** (Task Scheduler כל שעה + Hook של Claude Code על תחילה/סוף סשן): `https://github.com/Moti316/Interactive-educational-game`.
- **תוכן בלתי-מוגבל**: ווריאציות רנדומיות במשימות הקיימות + גנרטור AI (Claude API) ליצירת משימות חדשות לפי דרישה.
- **תיעוד מלא ב-MD** + הגדרת CLAUDE.md ו-skill מותאם לפרויקט עבור הפיתוח עם Claude Code.

---

## מחסנית טכנית (Tech Stack)

### Runtime (בדפדפן) — Local + PowerShell Launcher

- **Vanilla HTML + CSS + JavaScript ES Modules** — בלי build step, בלי Node. נטען דרך **שרת-מקומי קטן PowerShell** על `http://localhost:8080`.
- **PowerShell Launcher** (`start-chachmoni.ps1`): סקריפט (~120 שורות) שעושה:
  1. מתחיל `HttpListener` של .NET עם **binding מפורש ל-`http://127.0.0.1:8080/`** (Patch #3 — לא `+` או `*` שמאזין על כל ה-interfaces).
  2. **בודק zwischen port (8080, 8081, ..., 8085)** — אם תפוס, עובר לבא (Patch #10).
  3. **Host-header validation** — דוחה בקשות שה-Host שלהן אינו `127.0.0.1`.
  4. מוסיף headers: `X-Content-Type-Options: nosniff`, CSP בסיסי, `Cache-Control: no-store`.
  5. פותח Chrome אוטומטית ל-`http://127.0.0.1:{port}`
  6. רץ עד שChrome נסגר → עוצר את עצמו
  - **לא דורש התקנות** (PowerShell מובנה ב-Windows)
  - **לא דורש הרשאות-אדמין** (ports 8080–8085 פתוחים)
  - **אינדיקטור-מצב** ב-System Tray כשהוא רץ (אופציונלי)
- **למה לא file:// ישיר?** מודולי-ES, Google OAuth, ו-IndexedDB עובדים טוב יותר ב-`http://localhost`. השרת-המקומי הוא **שקוף** לחלוטין — מבחינת הילדים זה זהה.
- **Web Speech API** (`window.speechSynthesis`) להקראה בעברית (`lang: 'he-IL'`).
- **HTML5 Audio** לצלילי-משוב + (ב-Phase 2) hp3 fallback.
- **localStorage** ל-state ראשי (פרופילים, התקדמות, הגדרות).
- **IndexedDB** ל-blob גדולים (תמונות פרופיל אישיות).
- **Web Crypto API** (`crypto.subtle.digest`) לhash של PIN ההורה.
- **HTML Anchor `download`** + **File Input** ל-Export/Import של נתונים כ-JSON (replaces Drive sync ב-MVP).
- **CSS variables + `dir="rtl"`** ב-`<html>` לתמיכת RTL מובנית.
- **Google Fonts**: `Heebo` + `Varela Round` (מ-CDN — נטענים פעם ראשונה כשיש אינטרנט, אז cache).

**אין ב-MVP:**
- ❌ Vercel / Netlify / GitHub Pages (אין אירוח באינטרנט פומבי)
- ❌ Anthropic SDK (Phase 2)
- ❌ הקלטות-TTS מוקלטות-מראש (Phase 2)

**יש ב-MVP (עודכן):**
- ✅ Google Identity Services + Drive REST API — דרך localhost:8080
- ✅ ES Modules — עובדים דרך השרת-המקומי
- ✅ Drive sync אוטומטי עם גיבוי פר-ילד

### זמן-בנייה (לא runtime)
- **Gemini 3.1 Pro Image** — יצירת אווטארים, דמות-מורה, לוגו, favicon.
- **Gemini 2.5 TTS Hebrew** או **ElevenLabs** — יצירת ~75 קבצי הקלטה לטקסטים קריטיים.
- **Mixkit / Freesound.org / Pixabay** — צלילי-משוב ומוזיקת רקע (CC0).
- **PowerShell** — סקריפטי git-sync ו-Task Scheduler.

**אין תלויות חיצוניות בעת ריצה** מלבד CDN-ים של גוגל, פונטים, ו-Anthropic (אופציונלי). בלי npm install, בלי build.

**למה לא Vite/React:** הילדים לא ייהנו יותר, הפיתוח מסתבך, וצריך הסבר על Node. וניל פשוט עובד מהקובץ — ראה `docs/log/DECISIONS.md`.

---

## מבנה תיקיות

```
Interactive-educational-game/
  index.html                 — נקודת כניסה, mount של #app
  CLAUDE.md                  — הוראות לClaude Code בתוך הפרויקט
  README.md                  — סקירה, הרצה, דפלוי
  .gitignore                 — node_modules, .env, .DS_Store
  (ללא vercel.json — לא נדרש ב-MVP)
  styles/
    global.css               — RTL, פונט, צבעים, רקעים
    components.css           — כפתורים, מודאלים, כוכבים-תגמול
  src/
    app.js                   — בקר ראשי: בחירת פרופיל, ניתוב משימות
    audio.js                 — עטיפת TTS עברי איטי + טעינה עצלה של קול
    storage.js               — קריאה/כתיבה ל-localStorage (מולטי-פרופיל)
    profiles.js              — 🔄 Round 3: CRUD מאוחד לchild+parent. כולל createChild, createParent, getRandomParent, linkChildToParents, deleteProfile (cascade!)
    db.js                    — 🆕 Round 3: IndexedDB-יחיד עם stores: photos, voices, migrations-backup, rate-limit
    photo-store.js           — wrapper סביב db.js, שומר תמונות מוצפנות (Patch מ-Security)
    voice-recorder.js        — MediaRecorder API + AES-GCM encryption. 4ש' + waveform + auto-trim
    backup.js                — Export/Import של כל הנתונים כ-JSON (MVP)
    celebration.js           — חגיגות + parent-cameo (50% prob, pre-fetch של voice לפני החגיגה)
    sync/                    — Drive sync (MVP — גיבוי פר-ילד)
      drive-auth.js          — Google OAuth (Implicit Flow) דרך localhost:8080
      drive-sync.js          — upload/download פר-פרופיל (meta.json + progress-{id}.json)
      sync-status.js         — אינדיקטור סנכרון בפינת המסך
    ai/                      — ⚠ Phase 2 בלבד (AI generator — לא ב-MVP)
      task-generator.js      — קריאה ל-Claude API ליצירת משימות חדשות
      prompts.js             — System prompts + schemas
    ui/
      button.js              — כפתור משותף עם hover-to-replay מובנה
      progress.js            — מד התקדמות, כוכבים
      home-button.js         — כפתור בית קבוע בפינה
      avatar-picker.js       — בחירת אווטאר ליצירת פרופיל
      photo-uploader.js      — העלאת תמונה + magic-bytes + canvas re-encode + crop 300x300
      parent-cameo.js        — pop-up של הורה בחגיגה (50% prob)
      niqud-preview.js       — 🆕 Round 3: A/B Niqud Preview ("אוֹרִי?" vs "אוּרִי?")
      gender-picker.js       — 🆕 Round 3: 3 chips (בן / בת / לא חשוב)
      ──────────────────
      Note: age-picker / color-picker מאוחדים ל-button.js עם variants `chip` ו-`circle-color`
    templates/               — ~8 תבניות-משחק (קוד)
      hover-target.js
      click-targets.js
      double-click-reveal.js
      right-click-menu.js
      drag-drop-match.js
      key-press.js
      type-word.js
      point-and-narrate.js
    tasks/                   — 50+ נתוני-משימות (data בלבד)
      mouse/                 — משימות 1–18
      keyboard/              — משימות 19–34
      window/                — משימות 35–42
      concepts/              — משימות 43–50
    taskRegistry.js          — סדר רץ של כל המשימות
    welcome.js               — מסך בחירת פרופיל
  favicon.ico                — לוגו "חכמוני" — מוצג בטאב הדפדפן ובקיצור-הדרך
  assets/
    avatars/                 — 12 אווטארים: חיות וצורות (SVG)
    images/                  — אמוג'י-SVG חינמיים (חיות, פירות, צורות)
    logo.svg                 — לוגו ראשי של "חכמוני"
    icons/                   — אייקונים שונים (גם favicon.ico כפול לקיצור-הדרך)
    sounds/
      success.mp3, fail.mp3, bg-loop.mp3
  docs/                      — תיעוד מלא (ראה סעיף "תיעוד" למטה)
    ARCHITECTURE.md
    CONTENT.md
    HOW-TO-ADD-TASK.md
    ISSUES.md
    SECURITY.md
    PROCESSES.md
    TASKS.md
    DECISIONS.md
    KIDS-FEEDBACK.md
    NARRATION.md
    DEPLOY.md
    ASSETS.md                — מקור/רישוי לכל נכס (אווטארים, צלילים, mp3)
    PARENT-GUIDE.md          — מדריך להורה: הפעלה, פרופילים, PIN, דיווח, סקירה
    CHANGELOG.md             — היסטוריית גרסאות / שינויים משמעותיים
    CLAUDE-DESIGN-BRIEFS.md  — 5 הבריפים המוכנים-להעתקה ל-Claude Design
    TESTING.md               — פרוטוקול בדיקות עם ילדים (מתודולוגיה)
    STYLE-GUIDE.md           — מדריך-סגנון לכתיבת קריינות עברית
    PERFORMANCE.md           — יעדי-ביצועים + מדידות (FCP, TTI, memory)
    PROGRESS.md              — **Master Dashboard** — סטטוס בזמן-אמת של כל שלב
    PLAN-CONTROL.md          — **Plan Change Control** — תיעוד שינויי-תכנון וסנכרון-עקביות
    COUNCIL.md               — **High Council Reports** — דוחות-אישור אחרי כל שלב
    RECOVERY.md              — **Disaster Recovery** — runbook לתרחישי-משבר
    IDEAS.md                 — 🆕 **Future Ideas Backlog** — רעיונות ל-Phase 2/3 מסודרים לפי-נושא
  design-mocks/              — HTML mockups לתצוגה מקדימה (לא חלק מהמשחק)
    index.html               — אינדקס לכל המוקאפים
    01-welcome.html
    02-profile-select.html
    03-profile-create.html
    04-pin-entry.html
    05-pin-wrong.html
    06-parent-dashboard.html
    07-ai-generator-modal.html
    08-drive-setup-step1-4.html
    09-first-run-wizard.html
    10-world-map.html
    11-task-click-balloons.html
    12-success-celebration.html
    12b-celebration-with-parent.html      — 🆕 CHG-005: חגיגה עם parent-cameo
    13-photo-uploader.html
    14-profile-create-child-wizard.html   — 🆕 CHG-005: 4 שלבים (שם/גיל/צבע/אווטאר)
    15-profile-create-parent-wizard.html  — 🆕 CHG-005: 5-6 שלבים (PIN/שם/אווטאר/קול)
    16-voice-recorder.html                — 🆕 CHG-005: הקלטת-קול-הורה
    shared/
      tokens.css             — design tokens (צבעים, פונטים, spacing, motion)
      base.css               — RTL, body defaults
  scripts/
    start-chachmoni.ps1      — PowerShell Launcher: שרת-מקומי + פותח Chrome (MVP!)
    install-shortcut.ps1     — יצירת קיצור-דרך בשולחן-העבודה (חד-פעמי)
    git-sync.ps1             — סקריפט סנכרון git דו-כיווני (לhook + Task Scheduler)
    install-task-scheduler.ps1 — התקנת ה-task המתוזמן (חד-פעמי)
    show-progress.ps1        — Hook SessionStart: מציג PROGRESS.md בקונסול
    update-progress.ps1      — Hook Stop: מעדכן PROGRESS.md עם timestamp + שינויים
    check-contrast.js        — בדיקת ניגודיות אוטומטית על tokens (Phase 2)
    generate-tts.js          — סקריפט-בנייה להפקת 75 קבצי הקלטה (Phase 2)
  .claude/
    skills/
      kids-game.md                   — Skill מותאם כללי (RTL, TTS עברי, a11y, naming)
      kids-qa.md                     — Skill QA: checklist בדיקה עם ילדים
      security-kids.md               — Skill אבטחה: PIN, OAuth, scope drive.file
      hebrew-narration.md            — Skill כתיבת קריינות עברית
      animation-choreography.md      — Skill כוריאוגרפיית-תנועה
      claude-api.md (Phase 2)        — Skill מובנה לבניית AI generator
    agents/                           — High Council Sub-Agents (8 + יו"ר)
      agent-qa.md                    — QA Checklist (15 נקודות לבדיקה עם ילדים)
      agent-security.md              — אבטחה (PIN, OAuth, XSS)
      agent-ux-kid.md                — UX מנקודת-מבט של בן-4
      agent-a11y.md                  — נגישות (WCAG AA, reduced-motion)
      agent-hebrew.md                — איכות עברית + TTS
      agent-performance.md           — ביצועים (FCP, TTI, memory)
      agent-code-review.md           — קוד-איכות + anti-patterns
      agent-integration.md           — חוזי-API בין מודולים
      agent-council-chair.md         — יו"ר: מאחד דוחות, ממליץ GO/NO-GO
```

---

