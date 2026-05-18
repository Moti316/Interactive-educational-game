# חכמוני — משחק לימוד מחשב לילדים

> **שם המשחק:** חכמוני
> **דומיין (מוצע):** chachmoni.app
> **קהל יעד:** ילדי 4–6 שעדיין לא יודעים לקרוא
> **מטרה:** ללמד שימוש בעכבר, מקלדת בסיסית, ניווט ומושגים — כולו ב-voice-first עברי

---

## תכנון

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

**דוח מלא ב-`docs/COUNCIL.md` לאחר תחילת-בנייה.** עכשיו אוסיף את ה-14 ה-patches החובה לסעיפים-הרלוונטיים.

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
2. ✅ **פעם אחת לפני שלב Drive (30 דק'):** הקמת OAuth Client ב-Google Cloud Console — לפי הוראה מפורטת ב-`docs/DEPLOY.md`.
3. ✅ **בערב, מהבית (30 דק'):** העתקת 5 briefs ל-Claude Design.
4. ✅ **תוך כדי פיתוח (15 דק' לאחר כל שלב):** בדיקה עם הילדים.

---

## הקשר (Context)

המשתמש (אבא) מבקש לבנות משחק דפדפן בעברית שילמד את ילדיו (בני 4 ו-6) את היסודות של הפעלת מחשב: שימוש בעכבר, מקלדת בסיסית, ניווט בסיסי ומושגים כלליים. **שני הילדים עדיין לא קוראים** — לכן המערכת כולה חייבת להיות **voice-first**: כל טקסט שמופיע על המסך מוקרא בקול. הטקסט הכתוב הוא תוספת ויזואלית להורים ולעתיד, לא אמצעי-הוראה לילדים.

המשחק יבנה כעת מאפס יחד עם המשתמש (אין קוד קיים), בעברית בלבד, עם RTL, ורץ **Local + PowerShell Launcher** — שרת-מקומי קטן על `http://localhost:8080` שמתחיל אוטומטית מקיצור-דרך בשולחן-העבודה. אין אירוח באינטרנט, אין URL פומבי. תומך ב-**מספר בלתי-מוגבל של פרופילי-ילדים** (לא רק 2).

המבנה: סדרת **משימות** לינארית — 50 משימות "מקוריות" + **ווריאציות רנדומיות בתוכן** של כל משימה (פעם בלונים, פעם דגים, פעם פירות) + **גנרטור AI אופציונלי** ליצירת משימות חדשות לחלוטין. סה"כ: תוכן בלתי-מוגבל בפועל. **כל המשחק נשען על קריינות איטית, ידידותית-לילד, בעברית.** עמידה (hover) על כל כפתור משמיעה מחדש את ההוראה — אין מצב שהילד נשאר בלי שמיעה של מה לעשות.

**דרישות מערכת נוספות שאושרו:**
- **פרופילים מקומיים עם אווטאר ושם** לכל ילד (ללא PIN/login).
- **תמיכה בתמונה אמיתית של הילד** כאווטאר (העלאה דרך file picker), בנוסף לאווטארים המאוירים.
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

**למה לא Vite/React:** הילדים לא ייהנו יותר, הפיתוח מסתבך, וצריך הסבר על Node. וניל פשוט עובד מהקובץ — ראה `docs/DECISIONS.md`.

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
    profiles.js              — ניהול פרופילים: יצירה, מחיקה, החלפה
    photo-store.js           — IndexedDB wrapper לתמונות פרופיל
    backup.js                — Export/Import של כל הנתונים כ-JSON (MVP)
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
      photo-uploader.js      — העלאת תמונה + crop ל-300x300
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
    13-photo-uploader.html
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

## עקרונות עיצוב מרכזיים (קריטיים לגיל 4–6)

1. **Voice-first — כל טקסט מוקרא**. אין טקסט גלוי במשחק שלא מוקרא בקול: כותרות, הוראות, הודעות הצלחה, אפילו מספרי-ספירה. הטקסט הוא תוספת ויזואלית להורים — הילד עובד מהקול.
2. **קריינות איטית, חמה, ידידותית-לילד** — כל קריאה רצה ב-`rate: 0.85` (Patch מ-Hebrew מהמועצה). הניסוחים נכתבים כפנייה ישירה לילד ("בוא ננסה...", "כל הכבוד!"), עם משפטים קצרים ופאוזה בין רעיונות.
3. **Hover-to-replay על כל אלמנט-טקסט** — עמידה של ~600ms מעל כל כפתור, שם פרופיל, או כל אלמנט שמכיל טקסט-משמעותי מפעילה הקראה. יציאת ההצבעה לפני הסוף עוצרת. זה מובנה ברכיב משותף — לא צריך לזכור בכל שלב.
4. **קריינות אוטומטית בכניסה לכל משימה ולכל מסך** — ההוראה והכותרת נקראות מיד. כפתור-רמקול גדול בפינה לחזרה ידנית.
5. **כפתורים ענקיים** (min 80×80px), צבעים רוויים, פינות מעוגלות, אנימציית-לחיצה.
6. **משוב מיידי**: כל אינטראקציה (גם שגויה) מקבלת תגובה ויזואלית + קולית. אין "מסך כשלון" — רק "ננסה שוב" עם חיוך.
7. **מצביע עכבר מודגש**: hint ויזואלי (חץ מהבהב, יד מצביעה) כשהילד תקוע יותר מ-10 שניות + חזרה אוטומטית על ההוראה.
8. **התקדמות חזותית**: מד התקדמות עם כוכבים בראש המסך, ולא טקסט.
9. **פרופילים** עם אווטאר ושם, כל ילד שומר התקדמות נפרדת. **Hover על שם/אווטאר = הקראת השם בקול.**
10. **יציאה תמיד נגישה** — כפתור בית גדול בפינה, חוזר למסך-הראשי בלי קונפירמציה ארוכה.
11. **אין טיימרים מלחיצים** — אין שעון יורד, אין "אתה מאבד חיים". הקצב של הילד.

---

## פרופילים מקומיים עם אווטאר ושם

מבנה פרופיל ב-localStorage:

```js
// localStorage key: 'chachmoni:profiles'  (Patch #6 — היה 'mouse-school:profiles')
{
  profiles: [
    {
      id: 'p-1738249100',           // uuid-ish
      name: 'יואב',
      avatarType: 'photo',           // 'preset' | 'photo'
      avatarValue: 'rabbit',         // אם preset: מזהה SVG; אם photo: מפתח ב-photoStore
      photoStoreKey: 'photo-p1738', // (רק אם photo) מפתח שמצביע על base64 ב-IndexedDB
      color: '#FFD93D',
      createdAt: '2026-05-17',
      progress: {
        completedTaskIds: ['hover-rabbit', 'click-balloons'],
        currentTaskId: 'click-stars',
        stars: 17,
        lastPlayed: '2026-05-17T18:43:00Z'
      },
      settings: {
        ttsRate: 0.75,
        soundEnabled: true,
        backgroundMusic: false
      }
    }
  ],
  lastActiveProfileId: 'p-1738249100',
  driveSync: { enabled: true, fileId: '1abc...xyz', lastSyncAt: '2026-05-17T18:45:00Z' }
}
```

**אווטאר — שתי אפשרויות:**

1. **אווטאר מאויר (12 אופציות):** ארנב, חתול, אריה, פיל, צפרדע, ינשוף, דוב, כלב, דג, פרפר, רובוט, כוכב. SVG מאויירים בסגנון אחיד.
2. **תמונה אמיתית של הילד:** בעת יצירת פרופיל, ההורה לוחץ "העלאת תמונה". התהליך עם **בדיקות-אבטחה מהמועצה (Patch מ-Security):**
   - **MIME validation:** רק `image/jpeg`, `image/png`, `image/webp` מאושרים. SVG אסור (יכול להכיל `<script>`).
   - **Magic-bytes check:** קריאת 8 הבייטים הראשונים של הקובץ בפועל, וידוא שהם תואמים לפורמט המוצהר.
   - **Max file size:** 10MB לפני crop. דחיית קבצים גדולים יותר.
   - **Canvas re-encode:** הקובץ עובר דרך `<canvas>`, מוקצץ למרובע + מקטין ל-300×300px, **ו-`toBlob('image/jpeg', 0.8)`** — זה מנטרל metadata חשודה (EXIF, payloads).
   - **שמירה כ-Blob ב-IndexedDB** (לא base64 — Patch מ-Performance). חוסך 33% מקום + מהיר יותר.
   - **`alt`-text אוטומטי:** "תמונה של {name}" — Patch מ-A11y.
   - מסונכרן ל-Drive כקובץ-נפרד פר-פרופיל (Patch #12: Drive = source of truth).

**מסך פתיחה** מציג כרטיסי-פרופיל ענקיים (אווטאר/תמונה + שם) + כרטיס "+ פרופיל חדש".
- **Hover על כרטיס פרופיל = הקראת השם בקול** (אחרי 600ms, דרך אותו `speakOnHover` של ui/button.js).
- הילד לוחץ על הכרטיס שלו ונכנס.
- אין PIN — הילדים יודעים איזה אווטאר/תמונה שלהם.

**ניהול פרופילים** (מסך הגדרות של ההורה): יצירה, מחיקה, איפוס התקדמות, שינוי שם/אווטאר/תמונה.

### תמיכה במספר בלתי-מוגבל של פרופילים

המערכת **לא מוגבלת ל-2 ילדים**. תומכת ב-N פרופילים:

- מסך-הפתיחה מציג גריד-של-כרטיסים. עד 4 כרטיסים בשורה. אם יותר — scrolling אופקי עדין.
- כפתור "+ פרופיל חדש" תמיד נראה.
- **כל ילד שמתווסף** — אווטאר חדש (12 אופציות + אופציית-תמונה אישית), שם, צבע, מקבל אוטומטית קובץ-Drive פר-פרופיל משלו (`progress-{id}.json`).
- **המשחק עצמו זהה לחלוטין** — אותן 50 משימות, אותה התקדמות, אותם כוכבים. שום קוד-מיוחד לפרופילים שונים.
- **שימושי לעתיד:** כשיגיע אחיין, בן-דוד, חבר של הילדים — אפשר ליצור לו פרופיל זמני בלי לפגוע בהתקדמות של הילדים העיקריים.

**הגבלות מעשיות:** Drive חינמי = 15GB, כל פרופיל ~5KB ⇒ אפשר עד 3,000,000 פרופילים תיאורטית. למעשה ~20 פרופילים מקסימום לפני שה-UI הופך מסורבל.

---

## עיצוב חזותי

### לוח צבעים

| שם | hex | שימוש |
|----|-----|------|
| שמיים | `#6FC3DF` | רקע ראשי, מסך פתיחה |
| שמש | `#FFD93D` | כפתור CTA, תגמולים |
| אלמוגי בהיר | `#FF6B6B` | רקע, accents — **לא לטקסט-לבן עליו (1.7:1 fail)** |
| אלמוגי כהה | `#D14545` | טקסט/border ב-Secondary buttons (≥4.5:1 על לבן) — **Patch #1 מהמועצה** |
| נענע | `#6BCB77` | סיום משימה, התקדמות |
| לבנדר | `#C9A0DC` | רקעי משימות, גוון משני |
| לבן רך | `#FFFCF2` | רקע פנימי של כרטיסים |
| כהה-חם | `#2D2A26` | טקסט (לא שחור — רך יותר לעין) |

### טיפוגרפיה

- **כותרות:** Varela Round 700, 48–72px, רוויח אותיות חיובי
- **גוף:** Heebo 500, 24–32px (גדול! לבן 4 שצריך לראות)
- **כפתורים:** Heebo 700, 28px
- **line-height:** 1.6 (אוויר נדיב)

### עקרונות וויזואליים

- **Border-radius: 24px+** בכל מקום (כפתורים 9999px = pill).
- **Box-shadow רך** במקום קווי-מתאר: `0 8px 24px rgba(0,0,0,0.08)`.
- **Spacing: 32px+** בין רכיבים — לא צפוף.
- **אנימציות עדינות** (300ms ease-out) על hover/click — לא קופצניות.
- **מצב hover מודגש**: סקייל 1.05 + הגדלת shadow.
- **דמות-מורה (mascot):** ינשוף ידידותי בשם "פרופ' חכם" שמופיע בפינה כשמסבירים מושג חדש.

### מסכים — מוקאפים בASCII (RTL — קריא מימין לשמאל)

```
┌──────────────────────── מסך פתיחה ────────────────────────┐
│                                                           │
│              🦉  ברוכים הבאים!  🦉                        │
│              [ קריינות אוטומטית מתחילה ]                  │
│                                                           │
│    ┌────────┐    ┌────────┐    ┌────────┐                │
│    │  🐰    │    │  🦁    │    │   +    │                │
│    │ יואב   │    │  מיה   │    │  חדש   │                │
│    └────────┘    └────────┘    └────────┘                │
│                                                           │
│                                       ⚙ הגדרות הורים     │
└───────────────────────────────────────────────────────────┘

┌────────────────── מסך מפת המשימות ────────────────────────┐
│  🐰 יואב  •  ⭐ 17                       🏠  🔊  ☁ מסונכרן│
│                                                           │
│   🌍 עולם העכבר          🌍 עולם המקלדת                   │
│   ✅✅✅✅✅✅⏳⏸⏸⏸     ⏸⏸⏸⏸⏸⏸                       │
│                                                           │
│   ┌──────────────────────────────────────┐                │
│   │   📍 המשימה הבאה: בלונים            │                │
│   │   [ לחצו כאן להתחיל ]                │                │
│   └──────────────────────────────────────┘                │
└───────────────────────────────────────────────────────────┘

┌────────────────── מסך משימה (בלונים) ──────────────────────┐
│  ⭐ 17    🔊 שמע שוב    🏠                                 │
│                                                           │
│              "פוצצו את כל הבלונים!"                       │
│                                                           │
│       🎈    🎈           🎈                               │
│                                                           │
│                🎈           🎈                            │
│                                                           │
│   ────────────  3 / 5  ────────────                       │
└───────────────────────────────────────────────────────────┘

┌────────────────── מסך הצלחה ──────────────────────────────┐
│            🎉  כל הכבוד!  🎉                              │
│           [ קריינות: "וואו, איזה כיף!" ]                  │
│                                                           │
│              ⭐ + 1 כוכב חדש!                             │
│                                                           │
│   [ למשימה הבאה ]      [ חזרה למפה ]                      │
└───────────────────────────────────────────────────────────┘
```

---

## תוכן בלתי-מוגבל — ווריאציות + גנרטור AI

### שכבה 1: ווריאציות רנדומיות (בנוי-תוך, חינמי, אופליין)

כל תבנית תומכת ב**רנדומיזציה של תוכן ספציפי** בכל פעם שהמשימה רצה — בלי שהמבנה משתנה. הילד שמסיים משימה ומחזיר אליה רואה גרסה אחרת:

- **מיקומים:** מטרות מופיעות בכל פעם במקומות שונים.
- **כמויות:** טווח (`count: { min: 3, max: 6 }`) במקום מספר קבוע.
- **תוכן ויזואלי:** בכל פעם נבחר אקראית מתוך **בנק נושאים** של התבנית.

**דוגמה: בנק נושאים של `click-targets`:**
```js
const themes = [
  { emoji: '🎈', name: 'בלונים', successText: 'איזה כיף, פוצצת את כולם!' },
  { emoji: '🐠', name: 'דגים', successText: 'תפסת את כל הדגים!' },
  { emoji: '⭐', name: 'כוכבים', successText: 'אספת את כל הכוכבים!' },
  { emoji: '🍎', name: 'תפוחים', successText: 'קטפת את כל התפוחים!' },
  { emoji: '🦋', name: 'פרפרים', successText: 'גילית את כל הפרפרים!' },
  // ... עוד 10–15 נושאים
];
```

כשמשימה רצה, התבנית בוחרת theme אקראי (או קבוע, אם המשימה מציינת `lockedTheme`). הילד מקבל **חוויה שונה בכל פעם** בלי שאף שורת קוד חדשה נכתבת.

**הפעלה:** כל תבנית מקבלת אופציונלית `randomize: true` ובנק `themes: []` כברירת מחדל. המשימות עצמן יכולות גם לקבע theme ספציפי (לדוגמה משימת "בלונים" שתמיד תהיה בלונים).

זה לבד מכפיל את התוכן: 50 משימות × ~5 ווריאציות ממוצעות = ~250 חוויות שונות.

### שכבה 2: גנרטור AI על-דרישה (Phase 2 — תשתית בלבד ב-MVP, מופעל בעתיד)

> **חשוב:** ב-MVP (50 המשימות הראשונות) **אין שימוש ב-API**. כל 50 המשימות נכתבות מראש ידנית (data files). הגנרטור הוא רק **תשתית-קוד** שמתפתחת ב-Phase 2 — לא רץ, לא עולה כסף, לא דורש API key. ההורה אפילו לא רואה את הכפתור עד שהוא מפעיל את הפיצ'ר ידנית במסך-ההגדרות (toggle "תכונות AI מתקדמות").

**מצב MVP (Phase 1):**
- אין `src/ai/task-generator.js` — לא נכתב, לא נטען.
- אין כפתור "צור משימה חדשה" במסך-ההגדרות.
- אין הזנת API key.
- אין עלות.
- הילדים משחקים את 50 המשימות הכתובות-מראש (× ווריאציות = ~250 חוויות) — מספיק לחודשים.

**מתי בונים את התשתית:**
- **Phase 2** (אחרי שה-MVP רץ בבית והילדים מרוצים — אולי 2–4 שבועות אחרי השקה).
- אז: יוצרים את `src/ai/task-generator.js` + UI במסך ההגדרות + toggle "תכונות AI". כל זה מסתתר מאחורי flag — מי שלא מפעיל, לא רואה.

**איך זה ייראה אחרי הפעלה:** כפתור בהגדרות-ההורה: **"צור משימה חדשה"**. לחיצה פותחת modal:
```
   בחר תבנית: [click-targets ▾]
   נושא רצוי: [_____________]    (לדוגמה: "חרקים", "כלי-נגינה", "כדורים")
   רמת קושי: [קל ▾]
   [ צור משימה ] 
```

**מאחורי הקלעים:** קריאה ל-Claude API (Anthropic) דרך `src/ai/task-generator.js`:

```js
// קריאה ל-Claude עם system prompt שמכיל את הסכמה
const response = await anthropic.messages.create({
  model: 'claude-haiku-4-5-20251001',   // הזול והמהיר; טוב למשימות structured
  max_tokens: 1024,
  system: SYSTEM_PROMPT,                 // מסביר את הסכמה ואת קהל היעד
  messages: [{ role: 'user', content: `צור משימת ${template} בנושא: ${topic}, רמה: ${level}` }]
});
// פלט: JSON שתואם למבנה task. עובר וולידציה ל-schema, ואז נכנס ל-localStorage כ"משימת-משתמש".
```

**עלות:** ~$0.001 למשימה ב-Haiku. ההורה מזין API key חד-פעמית במסך הגדרות (נשמר ב-localStorage בלבד, לא נשלח לאף מקום).

**משימות שנוצרו על-ידי AI:**
- נשמרות ב-`profile.customTasks[]` (לא ב-source code).
- מסומנות חזותית בכוכב סגול (✨) במסך המפה — "משימה חדשה!".
- ההורה יכול לסקור ולערוך לפני שמוסיף לילד (מסך אישור).
- מסונכרנות ל-Drive כחלק מהפרופיל.

**Skill `claude-api` יותקן** ב-`.claude/skills/` כדי שClaude Code ידע לבנות את האינטגרציה נכון (כולל prompt caching לחסכון בעלויות).

### סיכום שכבות

| שכבה | זמינות | עלות | מספר משימות שמיש |
|------|---------|------|-------------------|
| 50 משימות מובנות | תמיד | $0 | 50 |
| ווריאציות רנדומיות | תמיד | $0 | ~250 חוויות |
| AI generator | לפי דרישה | ~$0.001/משימה | ∞ |

הילד לא ידע לעולם מהיכן הגיעה משימה — כולן מרגישות חלק מהמשחק.

---

## טיפול בכשלים — Google Drive Sync

### Token פג באמצע סשן
- `gapi` מחזיר 401 → המשחק זוהה את זה, מנסה רענון שקט דרך `gapi.auth2.getAuthInstance().signIn({ prompt: 'none' })`.
- אם זה נכשל (קרה > שעה מבלי לפתוח) → אינדיקטור הסנכרון בפינה הופך לכתום, ההורה רואה הודעה במסך-ההגדרות "התחבר שוב". המשחק ממשיך לעבוד מ-localStorage.

### קונפליקט בין שני מחשבים (last-write-wins + warning)
- כל שמירה ל-Drive כוללת `updatedAt` timestamp.
- בעת טעינה ממחשב חדש: השוואת `localStorage.updatedAt` ל-`drive.updatedAt`.
  - אם Drive חדש יותר ב-30+ שניות → "הצענו לך גיבוי חדש מ-{תאריך}. להעלות?".
  - אם localStorage חדש יותר → push רגיל.
  - אם הם זהים ± 30s → ההנחה היא שזה אותו state, פעולה רגילה.
- **אבדן נתונים נמנע ע"י backup retention** (ראה מטה) — אם בטעות overwriting, יש backup-ים קודמים.

### אין רשת
- localStorage הוא ה-source of truth → המשחק עובד כרגיל offline.
- שמירות מצטברות ל-queue פנימי (`pendingSyncOperations[]`).
- כשהרשת חוזרת → flush של ה-queue כ-single batch.
- אינדיקטור בפינה: ☁ → ⚠ (offline) → ↻ (syncing) → ✓ (synced).

### Drive API rate-limit
- Drive API מתיר 1000 בקשות לדקה — לא ייתכן שנגיע לזה. אבל אם כן:
- חזרה אקספוננציאלית (1s, 2s, 4s, 8s...) עד 5 ניסיונות, אז viewing ב-`docs/ISSUES.md`.

---

## שמירת היסטוריית גיבויים (Drive Backup Retention)

ב-Drive נשמרים:
- `progress.json` — קובץ ראשי, נדרס כל שמירה.
- `progress-backups/progress-YYYYMMDD-HHmm.json` — snapshot **לפני** כל שמירה. שומר עד **7 אחרונים**, ה-8 מוחק.
- `avatars/avatar-{profileId}.json` — תמונות פרופיל בקבצים נפרדים (גדולים מדי לכלול ב-progress.json).

**הרמת-עצמית של ההורה במצב חירום:** במסך-ההגדרות → "שחזר גרסה קודמת" → רשימה של 7 ה-backup עם תאריכים → "שחזר".

---

## סנכרון דו-כיווני אוטומטי ל-GitHub

**מטרה:** עבודה ממחשבים שונים בלי לזכור pull/push ידני, עם הגנה מקונפליקטים.

### שכבה 1: Hook על Claude Code (תחילת + סוף סשן)

Claude Code תומך ב-hooks דרך `~/.claude/settings.json`. נגדיר:

```json
{
  "hooks": {
    "SessionStart": [
      { "command": "powershell -File scripts/git-sync.ps1 -Action pull" },
      { "command": "powershell -File scripts/show-progress.ps1" }
    ],
    "Stop": [
      { "command": "powershell -File scripts/update-progress.ps1" },
      { "command": "powershell -File scripts/git-sync.ps1 -Action push -Message 'auto: end of session'" }
    ]
  }
}
```

- **SessionStart**:
  - `git pull --rebase --autostash` — מבטיח שהסשן מתחיל עם הקוד העדכני.
  - `show-progress.ps1` — מציג את התוכן של `docs/PROGRESS.md` בקונסול → Claude מודע מיד "איפה הפסקנו".
- **Stop**:
  - `update-progress.ps1` — מעדכן את `docs/PROGRESS.md` עם timestamp, שם-מחשב, מה השתנה בסשן.
  - `git-sync.ps1 -Action push` — `git add -A`, `git commit -m "auto: ..."`, `git push`.

### שכבה 2: Windows Task Scheduler (כל שעה ברקע)

טאסק מתוזמן שרץ גם כשClaude Code לא פתוח — מבטיח שהקוד מסונכרן גם כשעובדים ב-VSCode בלבד או רק קוראים את הקוד:

```powershell
# scripts/git-sync.ps1 (Patch #13 מהמועצה — lock-file mechanism)
param([string]$Action = 'sync', [string]$Message = "auto-sync from $env:COMPUTERNAME at $(Get-Date -Format 'yyyy-MM-dd HH:mm')")

cd C:\Users\b0066820\Interactive-educational-game

# Lock mechanism — מונע התנגשות בין Task Scheduler ל-Claude hooks
$lockFile = '.git/sync.lock'
if (Test-Path $lockFile) {
  $lockAge = (Get-Date) - (Get-Item $lockFile).LastWriteTime
  if ($lockAge.TotalMinutes -lt 5) {
    Write-Host "Sync already running. Exit."
    exit 0
  }
  # lock ישן מ-5 דקות — כנראה תקוע, מוחקים
  Remove-Item $lockFile -Force
}

# יצירת lock
New-Item -Path $lockFile -ItemType File -Force | Out-Null

try {
  if ($Action -in 'sync', 'pull') {
    git pull --rebase --autostash
    if ($LASTEXITCODE -ne 0) {
      New-Item -Path '.git/SYNC_CONFLICT' -ItemType File -Force | Out-Null
      exit 1
    }
  }

  if ($Action -in 'sync', 'push') {
    $status = git status --porcelain
    if ($status) {
      # Patch #13 חלק ב': רשימה מפורשת של תיקיות, לא git add -A עיוור
      git add src/ docs/ styles/ scripts/ assets/ design-mocks/ .claude/ index.html CLAUDE.md README.md PLAN.md .gitignore
      git commit -m $Message
      git push
    }
  }
} finally {
  # שחרור lock
  Remove-Item $lockFile -Force -ErrorAction SilentlyContinue
}
```

**הקמת ה-Task Scheduler:**
```powershell
$action = New-ScheduledTaskAction -Execute 'powershell.exe' `
  -Argument '-NoProfile -WindowStyle Hidden -File C:\Users\b0066820\Interactive-educational-game\scripts\git-sync.ps1'
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
  -RepetitionInterval (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName 'EduGame Git Sync' -Action $action -Trigger $trigger
```

### טיפול בקונפליקטים

- **rebase אוטומטי נכשל** → הסקריפט יוצר `.git/SYNC_CONFLICT` ועוצר. בפתיחה הבאה של Claude Code, ה-hook יזהה את הקובץ ויודיע ל-Claude לעזור בפתרון.
- **באג ב-progress.json** → לא רלוונטי: התקדמות הילדים זורמת רק דרך Google Drive, לא דרך git. ה-git מסנכרן רק קוד.
- **שני מחשבים מבצעים push בו-זמנית** → ה-push השני נדחה. הריצה הבאה של ה-Task Scheduler (תוך שעה) תעשה pull+push ותסנכרן.

### `.gitignore` חשוב — מורחב (Patch מ-Security)

קבצים שלא נכנסים ל-git (פר-מחשב או רגישים):
```
# Per-machine / Local
.env
.env.local
.vercel/
node_modules/
.DS_Store
*.log
.claude/local-secrets.*
profiles-backup-*.json

# Secrets — חובה ביטחונית
*.key
*.pem
*.p12
*.pfx
secrets.*
config.local.*
oauth-client*.json
client-secret*.json
credentials*.json
api-keys*

# Development / Test
.idea/
.vscode/settings.json
*.swp
*.swo
.tmp/
coverage/
playwright-report/

# Backups / temp files
*.bak
*.tmp
~$*
```

**Pre-commit hook עם secret-scanner:** התקנת `gitleaks` או `trufflehog` ב-`.git/hooks/pre-commit` — סורק אוטומטית לפני כל commit. אם נמצא secret → commit נדחה.

API keys (Anthropic, Google OAuth) **לעולם** לא נכנסים ל-git — נשמרים ב-localStorage של הדפדפן וב-Windows Credential Manager לסקריפטים.

ראה `docs/PROCESSES.md` ל-flow המלא ו-`docs/SECURITY.md` לעניין מפתחות.

---

## סנכרון אוטומטי ל-Google Drive

**איך זה עובד מבחינת הילדים:** הם לא רואים כלום. הסנכרון רץ ברקע. בפינת המסך אינדיקטור קטן (☁) שמראה "מסונכרן" / "מסנכרן..." / "לא מסונכרן".

**איך זה עובד מבחינת ההורה (התקנה חד-פעמית):**

1. **הגדרת OAuth client ב-Google Cloud Console** (~30 דקות, חד-פעמי):
   - יצירת פרויקט חדש ב-Google Cloud
   - הפעלת Google Drive API
   - יצירת OAuth client (Web application)
   - הוספת origins מורשים: `http://localhost:8080` (הפורט של PowerShell Launcher). ואם תפעיל Vercel ב-Phase 2 — גם הכתובת שם.
   - העתקת ה-Client ID

2. **הזנת ה-Client ID במשחק** (פעם אחת): מסך הגדרות → "הגדרת גיבוי" → הדבקת Client ID → "התחבר ל-Google".

3. **התחברות** דרך **Google Identity Services (GIS) Token Client החדש** (Patch #11 — Google ביטל Implicit Flow ב-2023). אנו משתמשים ב-`google.accounts.oauth2.initTokenClient()` עם state-nonce + sessionStorage (לא localStorage) כדי למנוע CSRF. ההורה מאשר הרשאת `drive.file` (מצומצמת: רק קבצים שהאפליקציה יצרה).

4. **שמירה**: בכל סיום משימה — upload של `progress.json` ל-Drive. הקובץ נשמר בתיקייה `Mouse School Progress/`.

5. **טעינה במחשב חדש**: אחרי התחברות, אם קיים קובץ ב-Drive — הצעה: "מצאנו גיבוי קודם, להעלות?".

**מבנה הקבצים ב-Drive (Patch #5 מהמועצה — תוקנה חוסר-עקביות):**
```
My Drive/חכמוני/
  meta.json                          — רשימת-פרופילים + הגדרות-משחק (לא כולל progress)
  progress-{profileId}.json          — קובץ פר-פרופיל עם ההתקדמות שלו
  avatars/photo-{profileId}.json     — תמונה אישית (אם יש), פר-פרופיל
  backups/progress-{id}-{ts}.json    — 7 גיבויי-snapshot פר-פרופיל
```

**Source of Truth (Patch #12):** Drive הוא מקור-האמת לתמונות-פרופיל. IndexedDB משמש רק כ-cache מקומי לתמונות שכבר נטענו מ-Drive.

**Storage prefix (Patch #6):** כל מפתחות localStorage בקידומת `chachmoni:*` (לא `mouse-school:*`).

**מצב לא-מקוון:** localStorage הוא ה-source of truth. אם אין רשת — המשחק עובד רגיל, סנכרון נדחה.

**טיפול בקונפליקטים:** אם שני מחשבים עדכנו ב-offline → "last write wins" עם warning בפעם הראשונה. (אופציה לעתיד: merge חכם.)

**עלות:** $0. Google Drive חינמי עד 15GB; progress.json שוקל ~5KB.

ראה `docs/SECURITY.md` לעניין הרשאות ופרטיות הילדים.

---

## הקמה ראשונית של GitHub (חד-פעמי)

```powershell
gh auth login                                                      # פעם ראשונה בלבד
cd C:\Users\b0066820
git clone https://github.com/Moti316/Interactive-educational-game
cd Interactive-educational-game
# מתחילים לבנות... הסקריפט git-sync.ps1 יטפל בכל סנכרון מכאן ואילך
```

**Local-Only deployment (MVP):** אין דפלוי באינטרנט. המשחק נטען מקובץ ב-Chrome מהמחשב המשפחתי. עדכונים מגיעים דרך git pull. ראה `docs/DEPLOY.md` ל-runbook מלא.

---

## תיעוד — קבצי MD

**עיקרון:** כל קובץ ב-`docs/` הוא "מסמך חי" שמתעדכן תוך כדי עבודה. Claude יקרא אותם בתחילת כל סשן (דרך CLAUDE.md), ויעדכן אותם כשהוא לומד משהו חדש.

| קובץ | מה בו | מתי מעדכנים |
|------|--------|-------------|
| `CLAUDE.md` (בשורש) | הוראות ל-Claude Code: איך הפרויקט בנוי, סגנון קוד, מה לקרוא, מה לעדכן | כשמשנים תהליך עבודה משמעותי |
| `README.md` (בשורש) | סקירה, איך להריץ מקומית, איך לדפלוי, צילומי מסך | בשינוי משמעותי לחוויית המשתמש |
| `docs/ARCHITECTURE.md` | מבנה התיקיות, חוזי-API בין מודולים, החלטות-עיצוב מרכזיות | כשמשנים ארכיטקטורה |
| `docs/CONTENT.md` | רשימת כל 50+ המשימות + הטקסטים הסופיים לקריינות | לפני כל הוספת/שינוי משימה |
| `docs/HOW-TO-ADD-TASK.md` | מדריך שלב-אחר-שלב להוסיף משימה חדשה (קריטי לעצמאות עתידית) | בשינוי חוזה התבניות |
| `docs/ISSUES.md` | "יומן רופא": כל באג שנמצא + פתרון + תאריך. **מתעדכן בכל באג, גם קטן.** | בכל באג + תיקון |
| `docs/SECURITY.md` | הרשאות, פרטיות, OAuth scopes, ניהול secrets | בכל שינוי שנוגע ל-auth/data |
| `docs/PROCESSES.md` | תהליכי המערכת: זרימת התחלת משחק, סיום משימה, סנכרון, הוספת פרופיל | בשינוי flow |
| `docs/TASKS.md` | רשימת משימות פיתוח: מה הושלם ✅, מה בעבודה ⏳, מה נשאר. עם תאריכים | בכל סיום/התחלת משימה |
| `docs/DECISIONS.md` | ADR: למה Vanilla ולא React, למה localStorage ולא IndexedDB, למה OAuth-implicit ולא PKCE, וכו'. כל החלטה עם תאריך ונימוק | בכל החלטה משמעותית |
| `docs/KIDS-FEEDBACK.md` | תובנות מבדיקות עם הילדים: ציטוטים, איפה נתקעו, מה ביקשו, גילם בזמן הבדיקה | אחרי כל סשן עם ילד |
| `docs/NARRATION.md` | קטלוג כל הטקסטים הקריינות בעברית — קל לסקור ולעדכן, גם מאהסן הנקודות הדקדוקיות ל-TTS | בכל הוספת משימה/טקסט |
| `docs/DEPLOY.md` | runbook: יצירת קיצור-דרך, עדכוני git, Export/Import, חזרה לגרסה קודמת, איבחון בעיות | בכל שינוי תהליך הדפלוי |
| `docs/ASSETS.md` | רשימת כל נכס (אווטאר, צליל, mp3) + מקור + רישיון + קרדיט | בכל הוספת נכס |
| `docs/PROGRESS.md` | **Master Status Dashboard** — סטטוס-בזמן-אמת של כל שלב, מה הושלם, מה בעבודה, מה תקוע, גרסה נוכחית, סשן-עבודה אחרון | בכל סוף-סשן-עבודה |
| `docs/PLAN-CONTROL.md` | **Plan Change Control** — כל שינוי שבוצע בתכנון, מתי, למה, אילו סעיפים הושפעו, וידוא-עקביות | בכל שינוי-תכנון משמעותי |
| `docs/COUNCIL.md` | **High Council Reports** — דוחות-אישור של מועצה-גבוהה אחרי כל שלב | בסיום כל שלב-בנייה |
| `docs/RECOVERY.md` | **Disaster Recovery Runbook** — תרחישי-חירום ומשבר (Patch מ-QA) | בכל זיהוי של תרחיש-חירום חדש |

### תוספות מומלצות אחרי סקירה חוזרת — 5 קבצי MD נוספים

לאחר סקירה מעמיקה, זיהיתי 5 קבצי-MD נוספים שיעזרו מאוד. שלושה הם **לתועלת ההורה** (לא רק לClaude), שניים הם **לאיכות-הקוד**:

| קובץ | מה בו | למה זה חשוב |
|------|--------|-------------|
| `docs/PARENT-GUIDE.md` | מדריך מלא להורה: איך להפעיל, איך ליצור פרופיל, איך לעדכן PIN, איך לדווח על באג, איך לסקור התקדמות. **בעברית, ידידותי**. | היום אין מסמך **להורה** — רק לClaude (CLAUDE.md). ההורה צריך מסמך משלו |
| `docs/CHANGELOG.md` | רישום-גרסאות: "v0.1: שלד מערכת", "v0.2: 5 משימות עכבר ראשונות", וכו'. כל push משמעותי = שורה חדשה | חשוב בעבודה דו-מחשבית. כשמחר חוזרים אחרי שבועיים — רואים בקצרה מה השתנה |
| `docs/CLAUDE-DESIGN-BRIEFS.md` | 5 הבריפים המוכנים-להעתקה ל-Claude Design (הסקציה שלמעלה ב-PLAN.md, אבל בקובץ-נפרד וקצר) | קל לפתוח, קל להעתיק. לא צריך לחפש בתוך 100KB של PLAN.md |
| `docs/TESTING.md` | פרוטוקול בדיקות עם הילדים: כמה זמן סשן, איך לא להשפיע, מה לרשום, אילו אינדיקטורים-מצוקה לזהות | בדיקות-משתמש עם בני 4–6 דורשות מתודולוגיה. בלי זה — הבדיקות יהיו לא-עקביות |
| `docs/STYLE-GUIDE.md` | מדריך-סגנון לכתיבת הקריינות (7 כללי-כתיבה, בנק-משפטים סטנדרטיים) — סקציה מ-PLAN.md מובאת כקובץ-נפרד | תוך כדי עבודה אני אצטרך לכתוב טקסטים חדשים. עדיף קובץ זמין בקליק אחד |

**סה"כ מעודכן: 24 קבצי MD** (הוספת PERFORMANCE.md, PROGRESS.md, PLAN-CONTROL.md, COUNCIL.md, RECOVERY.md).

### `docs/PROGRESS.md` — Master Dashboard (פירוט)

זהו ה-**Single Source of Truth** של "איפה אנחנו עכשיו". בעבודה ממחשבים שונים, זה הקובץ הראשון שתפתח כדי להבין את המצב.

**מבנה הקובץ (מתעדכן בכל סוף-סשן):**

```markdown
# חכמוני — Master Progress Dashboard

> עדכון אחרון: 2026-05-17 18:45  |  מחשב: WORK-PC  |  גרסה: v0.3

## 🚦 סטטוס שלבים

| שלב | סטטוס | יום | התקדמות | הערות |
|-----|--------|-----|----------|--------|
| 0 — תשתית | ✅ הושלם | 1 (2026-05-12) | 100% | git auto-sync פעיל |
| 0.5 — מוקאפים 01-05 | ✅ הושלם | 1 (2026-05-12) | 100% | mockups 11-13 נשארו |
| 1 — שלד + פרופילים | 🟢 בעבודה | 2 (2026-05-13) | 80% | profile photo upload עובד |
| 2 — תבנית ראשונה | ⏳ ממתין | — | 0% | |
| 3 — תבניות עכבר | ⏳ ממתין | — | 0% | |
| 4 — Drive sync | ⏳ ממתין | — | 0% | מחכה ל-OAuth setup מההורה |
| 5–9 | ⏳ ממתין | — | 0% | |

## 📍 מה הצעד הבא?
לסיים את שלב 1: לכתוב את `src/profiles.js` + UI לבחירת פרופיל. צפי: 1.5 שעות.

## 🎯 מה תקוע / חוסם?
- מחכה למוקאפ-לוגו מ-Claude Design (Brief #1) — לא חוסם, יכול להמשיך עם 🦉 emoji עד שיגיע
- OAuth Client ID של Drive — חוסם את שלב 4. ההורה צריך לבצע 30-דק' Google Cloud setup.

## 💰 שימוש-מודלים בסשן האחרון
- Opus 4.7: 12 הודעות (תכנון אדריכלות profiles)
- Sonnet 4.6: 45 הודעות (קוד יומיומי)
- Haiku 4.5: 0
- עלות-משוערת: ~$4.20

## 🐛 באגים פתוחים
ראה `docs/ISSUES.md`. כרגע: 2 פתוחים, 1 חמור (קריינות לא עוצרת בעת מעבר-מסך).

## 📝 הערה-עצמית לסשן הבא
- לבדוק עם הילד שה-hover על שם-פרופיל מקריא בזמן הנכון
- לעדכן את `docs/KIDS-FEEDBACK.md` עם תובנות מסשן האתמול
```

**מתי מתעדכן:**
- אוטומטית — **בכל סוף-סשן של Claude Code** (דרך hook).
- ידנית — לאחר כל commit משמעותי, או כשמתגלים חסמים חדשים.

**יתרון לעבודה מרובת-מחשבים:** פותח את הריפו בבית בערב → קורא PROGRESS.md → תוך 30 שניות יודע בדיוק איפה הפסקנו ומה לעשות הלאה. ללא צורך לקרוא 100 הודעות-צ'אט.

הם לא רק תיעוד — הם **מנגנון הזיכרון** של הפרויקט. Claude מתחיל כל סשן בקריאת CLAUDE.md, שמפנה ל-TASKS.md (מה נשאר) ול-ISSUES.md (איזה באגים פתוחים).

---

## Claude Code — הגדרות עבודה

### 1. `CLAUDE.md` (בשורש הפרויקט)

Claude Code קורא את הקובץ הזה אוטומטית בתחילת כל סשן. הוא יכיל:
- סקירה קצרה של הפרויקט (1 פסקה)
- היכן מתחילים (קרא קודם: `docs/TASKS.md` ו-`docs/ISSUES.md`)
- כללי קוד פר-פרויקט: עברית בטקסטים, RTL, אסור שגיאות a11y, כפתורים תמיד דרך `ui/button.js`
- הנחיות לתיעוד: "אחרי שינוי משמעותי — עדכן את הקובץ הרלוונטי ב-`docs/`"
- פקודות נפוצות: הרצה מקומית, push, deploy

### 2. שימוש בskill הקיים `ui-ux-pro-max`

Skill מובנה ב-Claude Code לעיצוב UI/UX. נשתמש בו כש:
- צריך להחליט על paddings/spacing
- כשמעצבים מסך חדש
- כשבוחרים animation curves
- כשבודקים נגישות

הפעלה: ידנית בעת הצורך, לא לכל בקשה (חיסכון בקונטקסט).

### 3. Skill מותאם — `.claude/skills/kids-game.md`

Skill שאני אצור עבור הפרויקט. תוכן:
- **הקשר הכי חשוב:** משחק לימוד מחשב לבני 4 ו-6 בעברית, RTL, voice-first, קריינות איטית
- **דרישות לא-לשכוח:**
  - **שני הילדים לא קוראים** — כל טקסט גלוי חייב להיות מוקרא
  - hover על כל אלמנט-טקסט ל-600ms = הקראה (לא רק כפתורים)
  - כפתורים min 80×80px
  - rate: 0.85 לכל קריינות, lang: 'he-IL'
  - בדיקת נגישות לכל שינוי DOM
- **קונבנציות שמות:** `task-{worldId}-{kebab-skill-name}` (לדוגמה `task-mouse-balloons`)
- **טריגרים:** הSkill ייטען כשמדובר ב"משימה חדשה", "טקסט קריינות", "כפתור חדש", "נגישות"

### 4. Skill `claude-api` (מובנה — שימוש בעת בניית גנרטור AI)

ל-Claude Code יש skill מובנה `claude-api` שמכיר את ה-SDK של Anthropic, prompt caching, ו-best practices. נשתמש בו כשבונים:
- `src/ai/task-generator.js` — הקריאה ל-Claude API
- `src/ai/prompts.js` — system prompts ו-schemas
- **prompt caching** — לחסכון בעלויות בעת קריאות חוזרות עם אותה schema

ה-skill ייטען אוטומטית כשנמצאים בקבצים שב-`src/ai/`.

---

## Plan Change Control — בקרה על שינויי-תכנון

זוהי הבעיה שעלתה: בכל פעם שמשנים סעיף-תכנון אחד, **סעיפים אחרים עשויים להפוך לא-עקביים.** אנחנו צריכים מנגנון שאוכף עקביות.

### הפתרון: `docs/PLAN-CONTROL.md`

קובץ-תיעוד מובְנה של **כל שינוי לתכנון**, עם בדיקת-התאמה אוטומטית. דוגמה:

```markdown
# Plan Change Control — חכמוני

## CHG-001 | 2026-05-17 16:32 | סטטוס: ✅ הוטמע
**מהות:** הוספת Drive sync ל-MVP (היה Phase 2)
**טריגר:** משתמש: "אני רוצה חיבור מהיר ל-Google Drive לסנכרון אוטומטי"
**שינוי-עיקרי:** העברת `sync/` מ-Phase 2 ל-MVP, הוספת PowerShell Launcher

### סעיפים שהושפעו (Checklist)
- [x] §מחסנית טכנית — עודכן (Drive REST API + Identity Services)
- [x] §מבנה תיקיות — עודכן (`sync/` ב-MVP, scripts/start-chachmoni.ps1)
- [x] §שלבי בנייה — עודכן (שלב 4 חדש: PowerShell + Drive)
- [x] §Pre-Flight — עודכן (OAuth setup ביום 5)
- [x] §Phase 2 — עודכן (Drive הוסר מ-Phase 2)
- [x] §סיכום-מהיר — עודכן (בלוק "תשתית")
- [x] §זמן-פיתוח — עודכן (~11 ימים)
- [x] §אתגרים-צפויים — עודכן (5 אתגרי-Drive)

### וידוא-עקביות
- ✅ Grep "Drive sync" — כל ה-50+ הפניות עקביות
- ✅ Grep "Phase 2" — לא מכיל Drive
- ✅ Grep "ימי עבודה" — כולן 11

## CHG-002 | 2026-05-17 17:15 | סטטוס: ✅ הוטמע
**מהות:** Multi-user — תמיכה ב-N פרופילים (היה 2)
...
```

### תהליך-עדכון (לכל שינוי)

1. **לפני שינוי:** Claude מוסיף `CHG-NNN` חדש עם "סטטוס: 🟡 בעבודה" + רשימת-סעיפים-צפויים-להיות-מושפעים.
2. **בעת השינוי:** Claude מעדכן את כל הסעיפים, מסמן ✅ בכל אחד שעודכן.
3. **אחרי השינוי:** Claude מריץ Grep אוטומטי לחיפוש חוסר-עקביות + מסמן "סטטוס: ✅ הוטמע".
4. **אם נמצא חוסר-עקביות:** "סטטוס: 🔴 חסום" + תיעוד הבעיה לתיקון.

### יתרון לעבודה ארוכת-טווח

- **תיעוד-מלא של למה החלטות נעשו** (לא רק "מה הוחלט")
- **מעבר-זמן-קל** — לקרוא PLAN-CONTROL.md → להבין את ההיסטוריה
- **רוורסל קל** — אם רוצים להחזיר אחורה, רואים בדיוק מה צריך
- **בודק-עקביות מובְנה** — לא יהיו עוד "שכחתי לעדכן את הסעיף ההוא"

---

## High Council — מועצה-גבוהה לאישור-שלבים

זהו הרעיון העוצמתי ביותר שהוספת. בכל סיום-שלב, **8 סוכני-עזר עצמאיים** סוקרים את העבודה, כל אחד מזווית-שונה, ומחזירים דוחות לאישור.

### חברי המועצה — 8 Sub-Agents

כל סוכן מקובץ ב-`.claude/agents/`:

| Agent | תפקיד | מודל מומלץ |
|--------|--------|--------------|
| **`agent-qa`** | QA Checklist לבדיקה-עם-ילדים (15 נקודות) | Sonnet 4.6 |
| **`agent-security`** | PIN hashing, OAuth scope, XSS, storage security | **Opus 4.7** (קריטי) |
| **`agent-ux-kid`** | "מתחזה" לבן-4: האם אני מצליח להבין רק מהקול? | **Opus 4.7** (יצירתי) |
| **`agent-a11y`** | WCAG AA, reduced-motion, contrast, focus indicators | Sonnet 4.6 |
| **`agent-hebrew`** | איכות-קריינות עברית, TTS pronunciation, סגנון | Sonnet 4.6 |
| **`agent-performance`** | FCP < 1s, TTI < 2s, memory leak detection | Sonnet 4.6 |
| **`agent-code-review`** | קוד-איכות, anti-patterns, IIFE/module consistency | Sonnet 4.6 |
| **`agent-integration`** | בדיקת חוזי-API בין מודולים, schema migration | Sonnet 4.6 |

### יו"ר-המועצה — `agent-council-chair`

סוכן-נוסף שמרכז את התוצאות:
1. **בסיום-שלב** — Claude (orchestrator) מפעיל את כל 8 הסוכנים **במקביל** (בקריאת-tool אחת עם 8 sub-calls).
2. **כל סוכן** מחזיר דוח עם: `PASS / WARNING / FAIL` + פירוט.
3. **היו"ר** קורא את כל הדוחות, מייצר דוח-מאוחד עם:
   - סיכום-תוצאות (כמה PASS / כמה WARNING / כמה FAIL)
   - בעיות-קריטיות שדורשות תיקון מיידי
   - בעיות-קלות שאפשר לדחות
   - המלצה: **GO** / **NO-GO** / **GO with patches**
4. **דוח-המועצה נשמר** ב-`docs/COUNCIL.md` עם timestamp.
5. **המשתמש (ההורה)** רואה את הדוח, מאשר GO או מבקש תיקונים.

### דוגמה לדוח-מועצה

```markdown
# COUNCIL Report — Phase 4 (PowerShell + Drive Sync)
> 2026-05-17 22:45 | Duration: 2:30min

## תוצאות-סוכנים (8/8 השיבו)

| Agent | Status | Issues |
|-------|--------|--------|
| QA | ✅ PASS | — |
| Security | 🟡 WARNING | OAuth state ב-localStorage צריך להיות sessionStorage |
| UX-Kid | ✅ PASS | — |
| A11y | ✅ PASS | — |
| Hebrew | 🟡 WARNING | "מסונכרן" צריך להיקרא בקול ב-hover |
| Performance | ✅ PASS | First sync: 340ms — בתוך budget |
| Code-Review | ✅ PASS | — |
| Integration | 🟡 WARNING | חוזה profiles.js לא תואם לחוזה drive-sync.js |

## סיכום
- ✅ PASS: 5/8
- 🟡 WARNING: 3/8 (לא חוסם, אבל מומלץ לתקן)
- 🔴 FAIL: 0/8

## המלצה: 🟢 GO with patches
תקן את 3 ה-warnings הקלים (~30 דק' עבודה) ואז המשיכה לשלב 5.

## פירוט תיקונים (מומלצים, לא חוסמים)
1. **agent-security:** העבר את `oauth_state` מ-localStorage ל-sessionStorage ב-`src/sync/drive-auth.js:42`
2. **agent-hebrew:** הוסף `aria-label` ו-`hoverText` לאינדיקטור-הסנכרון ב-`src/sync/sync-status.js:18`
3. **agent-integration:** בדוק קונסיסטנציה ב-`src/profiles.js:67` vs `src/sync/drive-sync.js:23` — שני המקומות מייצרים `profileId` באופן שונה
```

### תזמון המועצה

- **בסיום שלב 0** — בדיקת תשתית (קצר, אולי 5 דק')
- **בסיום שלב 1** — שלד + פרופילים (פעם ראשונה ארוכה ~5 דק' לכל סוכן)
- **בסיום כל שלב נוסף** — מועצה רגילה
- **לפני שחרור MVP** — מועצה-סופית מורחבת (כל 8 הסוכנים + סקירה-ידנית של ההורה)

### עלות

**תחת מנוי Max — $0 (מכוסה במנוי הקיים).**

- כל סוכן רץ דרך Claude Code = ב-quota של Max
- אין צורך ב-Anthropic API key נפרד
- אין חיוב פר-קריאה
- ההבדל מ-Run-time AI generator (Phase 2): שם הקוד רץ בדפדפן ושולח ל-Anthropic API — דורש API key + עלות

**זמן-תוספת:** ~3–5 דקות לכל שלב (8 סוכנים × ~30 שניות ריצה במקביל) → סה"כ ~45–60 דקות על כל ה-MVP.

### אופציית "Light Council" — אם רוצים לחסוך זמן

אם רוצים MVP-מהיר יותר, אפשר להפעיל **3 סוכנים קריטיים בלבד** בכל שלב:
1. **`agent-security`** — חובה תמיד
2. **`agent-ux-kid`** — Voice-First הוא קריטי
3. **`agent-code-review`** — איכות-קוד

ו-5 הסוכנים האחרים יופעלו **רק לפני MVP-go-live** (מועצה-סופית).

חוסך ~30 דקות סך-הכל, פחות-בדיקה אבל יותר זריזות. **המלצה: ניסוי 'Light Council' בשלבים 1–3, אם הכל חלק → המשכה כך. אם מתגלים באגים → חזרה ל-Full Council.**

**יתרון רוחבי:** איכות-יסוד גבוהה. הסיכוי להגיע לבאגים-בייצור (אצל הילדים) נמוך לאין-ערוך.

---

## Claude Skills — מה לנצל לאורך הפיתוח

מעבר ל-3 ה-skills שכבר זוהו (CLAUDE.md, kids-game מותאם, ui-ux-pro-max), יש skills נוספים — מובנים וחיצוניים — שיעזרו מאוד לאורך הפרויקט.

### Skills מובנים שאפעיל בעת-צורך

| Skill | מתי אפעיל | במה זה עוזר |
|-------|------------|-------------|
| **`security-review`** | אחרי כל שלב שנוגע ל-OAuth/PIN/Drive | סקירה אוטומטית של נקודות-אבטחה: storage, OAuth flow, PIN hashing, XSS risks |
| **`review`** | אחרי בנייה של כל שלב | סקירת קוד-משותף (review של "PR" עצמי) — מציאת באגים, רעיונות-שיפור |
| **`simplify`** | כל שבוע שני | סקירת קוד אחרי שכבר ייצב — מציאת חזרות, abstractions לא-נחוצות, אפשרויות-מחיקה |
| **`design`** | בעת יצירת נכסים | יצירת לוגו "חכמוני", 12 אווטארים, mascot דרך Gemini AI |
| **`ui-ux-pro-max`** | בעת עיצוב מסכים חדשים | המלצות palette, motion curves, accessibility |
| **`design-system`** | בעת יצירת tokens.css | טוקני-עיצוב מובנים: spacing scale, typography scale, color tokens |
| **`claude-api`** | רק ב-Phase 2 | בנייה נכונה של גנרטור-AI עם prompt caching |
| **`fewer-permission-prompts`** | פעם אחת ב-onboard | סריקה של הרשאות-permissions של Claude Code, מינימיזציה של הפסקות |
| **`update-config`** | בעת הגדרת hooks | תיקון `settings.json` עבור hooks של git-sync (SessionStart/Stop) |

### Skills מותאמים-לפרויקט שאצור

אצור 4 skills חדשים שמתאימים בדיוק לפרויקט הזה:

#### 1. `.claude/skills/kids-qa.md` — QA לבדיקה עם ילדים
- **טריגרים:** "בדיקה עם הילדים", "QA", "kids testing"
- **תוכן:** Checklist-בדיקה לכל משימה: האם הקריינות עובדת? האם hover-to-replay תקין? האם רמז מופיע אחרי 10ש'? האם משוב-טעות אדיב? האם הילד מבין את ההוראה מהקול בלבד? — וכ-15 נקודות נוספות.
- **תועלת:** מבטיח שכל שלב עובר checklist קונסיסטנטי לפני שמכריזים עליו "מוכן".

#### 2. `.claude/skills/security-kids.md` — אבטחת-ילדים
- **טריגרים:** "אבטחה", "PIN", "OAuth", "Drive", "child safety"
- **תוכן:** איך לתחזק את ה-PIN בלי שהילד יעקוף, איך לאמת ש-OAuth scope `drive.file` עובד נכון, איך למנוע XSS בטקסטים-של-ילדים שעוברים ל-TTS.
- **תועלת:** מונע באגי-אבטחה שלא נחשוב עליהם — כמו ילד שמקלידי "; alert('hacked')" וזה מוזרק ל-DOM.

#### 3. `.claude/skills/hebrew-narration.md` — כתיבת קריינות עברית
- **טריגרים:** "טקסט קריינות", "narration", "TTS"
- **תוכן:** 7 כללי-כתיבה (קצר, פנייה ישירה, חיוב, מילות-קסם), בנק-משפטים סטנדרטיים, נקודות-דקדוק קריטיות ל-TTS, איך לבדוק שטקסט מבוטא נכון.
- **תועלת:** קונסיסטנטיות מלאה בכל הטקסטים — לא משתמש בשתי מילים שונות לאותו עניין.

#### 4. `.claude/skills/animation-choreography.md` — כוריאוגרפיית-תנועה
- **טריגרים:** "אנימציה", "celebration", "transition", "motion"
- **תוכן:** ה-easing-curves שבחרנו, durations, ה-celebration-choreography של 6 שלבים, איך לבדוק `prefers-reduced-motion`.
- **תועלת:** כל אנימציה תהיה עקבית עם השאר — לא יקרה שמסך אחד יש animation 800ms ואחר 200ms ללא סיבה.

### Skills חיצוניים (אם נצליח להתחבר)

- **Canva MCP** — כבר מחובר. אפעיל בעת-הצורך להעלאת mockups לאישור-הורה.
- **Google Drive MCP** (מחובר) — אפעיל ב-Phase 2 לעזר עם debugging של sync-issues.

### גישה לקריאה

המסמך `CLAUDE.md` (בשורש הפרויקט) יציין את כל ה-skills האלה ויסביר מתי להפעיל כל אחד. Claude Code יקרא את CLAUDE.md בכל סשן ויהיה מודע לזמינות.

---

## חוויית פעם-ראשונה (First-Run Experience)

**טריגר:** אין פרופילים ב-localStorage.

**זרימה (כל המסכים voice-first עם קריינות אוטומטית):**

1. **מסך 1 — ברוכים הבאים:**
   - דמות "פרופ' חכמוני" (ינשוף) מופיעה במרכז.
   - קריינות: "שלום! אני פרופ' חכמוני. אני הולך ללמד אתכם איך להפעיל את המחשב. בוא נתחיל!"
   - כפתור גדול: "המשך".

2. **מסך 2 — מה זה עכבר?:**
   - איור של עכבר ענק במרכז, חצים מצביעים על שני הכפתורים.
   - קריינות: "זה העכבר. כשמזיזים אותו, החץ על המסך זז. ולחיצה — מפעילה דברים. ננסה!"

3. **מסך 3 — תרגול ראשון:**
   - כוכב ענק זוהר במרכז.
   - קריינות: "תלחץ על הכוכב הזה."
   - לחיצה → אנימציית-זיקוקים → קריינות: "מצוין! אתה מוכן."

4. **מסך 4 — הגדרת הורה (עם Guest Mode — Patch מ-UX-Kid):**
   - "עכשיו צריך עזרה מאמא או אבא."
   - **2 כפתורים** (לא רק אחד):
     - **"קרא לאמא/אבא"** (Primary CTA) — לחיצה משמיעה צליל-קריאה רם וברור ("דין-דון, צריכים אותך!") + מציג שעון-המתנה.
     - **"שחק במצב-אורח"** (Secondary) — מאפשר 5 משימות-דמו בלי PIN, בלי לשמור התקדמות. ככה ילד שהגיע לבד לא יוותר על המשחק.
   - מסך הורה: יצירת PIN של 4 ספרות + יצירת פרופילי הילדים.

5. **מסך 5 — בחירת פרופיל ראשונה ומשחק:**
   - מסך הבית הרגיל מוצג; הילד בוחר את הפרופיל שלו ומתחיל את משימה 1.

הוויזרד הזה רץ פעם אחת בלבד. אחרי שהוקם PIN — גישה למסך-הוויזרד חוזרת רק דרך מסך-ההגדרות (בכפוף ל-PIN).

### עזרי-תמיכה ל-Inactivity (Patches מ-UX-Kid)

- **אחרי 30ש' של חוסר-פעילות:** דמות-המורה מנופפת מהפינה.
- **אחרי 60ש':** קריינות: "אתה עוד כאן? נמשיך כשתרצה."
- **אחרי 90ש' תקיעות במשימה ו-3 ניסיונות-שגויים:** מסך-עזרה "🆘 אם משהו לא ברור, קרא לאמא או אבא" + צליל-קריאה אופציונלי.
- **אחרי 120ש':** המשחק חוזר אוטומטית למסך-הפתיחה (Pause מלא).

### Confetti Ratchet-Down (Patch מ-UX-Kid)

ב-3 משימות-ברצף — חגיגה מלאה. **מהמשימה ה-4 ברצף ואילך** — חגיגה מצומצמת (4 חלקיקי-confetti במקום 20, ללא scale-up, ללא mascot bounce). מונע overstimulation בסשנים-ארוכים.

---

## גישת הורה — PIN של 4 ספרות

**איך:**
- אייקון קטן ⚙ בפינה תחתונה-שמאלית של מסך הפתיחה (כמעט בלתי-מורגש לילד).
- לחיצה → מודאל "הזינו PIN" עם 4 שדות-ספרה ענקיים + מקלדת ויזואלית.
- PIN שגוי 3 פעמים → נעילה של 15 דקות (תוקן ב-Round 2 — היה 5, הופך ל-15 לעקביות עם מסך-PIN).

**איפה PIN נשמר (עודכן ע"פ Patch #2 מהמועצה):**
- ב-localStorage כ-**hash מ-PBKDF2-SHA256** עם **salt-16-byte ייחודי + 100,000 iterations**. SHA-256 פשוט היה חלש מדי (rainbow-table של 10K צירופים פותרת בשנייה).
- בנוסף: **rate-limiting קשיח ב-IndexedDB** עם timestamps של ניסיונות — לא רק "3 ניסיונות-בזיכרון" שמתאפס ב-refresh.
- בקריינות-לילד: **"סיסמה"** או **"קוד-סודי"**, לא "PIN" (Patch #9).
- מסונכרן ל-Drive כחלק מ-progress.json.
- אם ההורה שכח PIN — מסך "שכחתי PIN" עם שאלה **שילד אינו יכול לדעת** (Patch מ-Security + UX-Kid Round 2 — היה "שם החיה של הפרופיל הראשון" שילד רואה כל יום!). השאלה החדשה: **"תאריך הלידה שלך בפורמט DD/MM"** (הילד לא יודע, ההורה כן). התשובה עצמה עוברת **גם** דרך PBKDF2 hash, לא clear-text.

**מסך-ההגדרות מכיל:**
- ניהול פרופילים (יצירה, מחיקה, עריכה, איפוס)
- העלאת תמונה אישית לפרופיל
- הגדרת Google Drive sync
- הזנת Anthropic API key + הצגת שימוש חודשי
- הגדרות חזותיות (cap ל-rate, הפעלת מוזיקת רקע)
- כפתור "צור משימה חדשה" (AI generator)
- כפתור "דווח על באג" — מתעד screenshot + state + טקסט חופשי, מוריד JSON

---

## TTS Fallback — הקלטות מוקלטות מראש (Phase 2 בלבד)

> **בהבהרה: ב-MVP זה לא קיים.** המשחק נשען בלבד על Web Speech API של Chrome עם קול עברי "Microsoft Asaf" המובנה. אם הילדים פותחים תמיד באותו Chrome מאותו מחשב — לא נדרש שום fallback.

### "מוקלט מראש" — מי מקליט?

**אף אחד לא מקליט בעצמו. הכל אוטומטי דרך AI.**

התהליך:
1. כל טקסטי-הקריינות במשחק רשומים ב-`docs/NARRATION.md` (קובץ-טקסט פשוט).
2. סקריפט-בנייה אחד (`scripts/generate-tts.js`) קורא את כל הטקסטים.
3. הסקריפט קורא ל-API של **Gemini 2.5 TTS Hebrew** (או ElevenLabs) — שירות שמהפך טקסט-לדיבור באמצעות AI.
4. כל טקסט הופך לקובץ-mp3 עם שם מתאים (לדוגמה `task-click-balloons-instruction.mp3`).
5. כל ה-mp3-ים נשמרים ב-`assets/audio/he/` ועולים לrepo.

**מה אתה צריך לעשות:** רק להריץ את הסקריפט פעם אחת. הוא רץ 5–10 דקות ומפיק את כל ה-75 הקבצים. אחר-כך הקבצים יושבים ב-repo, נטענים ע"י המשחק כשצריך.

**עלות:** ~$0.50 חד-פעמית ב-Gemini TTS (4MB אודיו = זול), או חינם דרך Web Speech API שמייצר את ה-mp3 בדפדפן.

**מתי כדאי לבנות את זה (Phase 2):** רק אם מתברר שדפדפנים שונים (לא Chrome) או הגדרות שונות גורמות לקול-עברי לא להופיע. ב-90% מהמקרים — לא נצטרך.

### אילו טקסטים מוקלטים (אם וכשנבנה)

- 50 הוראות-משימה
- 4 הקדמות-עולמות
- ~10 מסכי-מערכת (ברוכים-הבאים, הצלחה וכו')
- 12 שמות-אווטארים
- **שמות-ילדים: לא** — אלו דינמיים, נשארים תלויים ב-Web Speech API.

סה"כ ~75 קבצים × 50KB = ~4MB.

---

## תקרת עלות AI — $5 לחודש

**מנגנון:**
- ב-localStorage נשמר: `aiUsage = { month: '2026-05', totalCostUSD: 0.012, requests: 7 }`
- לפני כל קריאה ל-Claude API: חישוב עלות צפוי לפי `pricing.haiku.input`, `pricing.haiku.output`.
- אם `totalCostUSD + estimated >= 5.0` → דחיית הבקשה עם הודעה: "הגעת לתקרה החודשית של $5. אפשר לאפס מתי שתרצה במסך ההגדרות, או להמתין לחודש הבא."
- ההורה רואה במסך-ההגדרות: שורת-התקדמות "$X.XX מתוך $5" + כפתור "אפס שעון".

**הגנה כפולה (חובה — Patch מ-Security):** ההורה **חייב** להגדיר billing-cap קשיח ב-Anthropic Console ($5 hard cap) **לפני** שה-toggle "תכונות AI" מאופשר במשחק. ה-toggle חסום עד שההורה מאשר שעשה זאת (checkbox "אישרתי billing-cap").

**Content Safety לפלט-AI (Patch מ-QA + Security):**
1. **JSON-schema קשיח** — פלט-AI חייב לעבור validation מול schema (id, title, instructionText, type — אסור fields נוספים).
2. **תווי-מילים מותרים בלבד:** עברית + ספרות + סימני-פיסוק בסיסיים. רגקס: `/^[א-ת0-9\s,.!?\-]+$/`.
3. **אורך-מקסימלי:** instructionText ≤ 100 תווים.
4. **Strip-tags עם DOMPurify** לפני שפלט-AI מועבר ל-DOM.
5. **Parent-approval חובה:** משימת-AI לא רצה לילד עד שההורה לוחץ "אישרתי" (preview במסך-ההגדרות).

**אופציה לעתיד:** Cache של תוצאות AI עם `prompt caching` של Anthropic — מפחית עלות ל-Variations של אותה תבנית.

---

## מקור הנכסים (Asset Sourcing)

| נכס | מקור | למה |
|-----|------|-----|
| 12 אווטארי-חיות | יצירה ב-Gemini 3.1 Pro Image (skill מובנה) | סגנון אחיד-חמוד, גודל אחד, רקעי-שקיפות |
| דמות פרופ' חכמוני (ינשוף) | יצירה ב-Gemini 3.1 Pro Image | דמות-המורה, מופיעה בכמה pose-ים |
| Emoji למשימות (בלונים, פירות, חיות) | רנדורינג emoji מובנה של הדפדפן | זמין, אחיד, אינסופי, $0 |
| צלילי-משוב (success, fail, click) | Mixkit / Freesound.org (CC0) | חינמיים מסחרית, איכותיים |
| מוזיקת רקע אופציונלית | Pixabay Music / Freesound (CC0) | חינמית |
| הקלטות-TTS (75 קבצים) | Gemini 2.5 TTS Hebrew | קול ידידותי לילדים בעברית |
| Favicon ולוגו "חכמוני" | יצירה ב-Gemini 3.1 Pro Image | זהות חזותית למשחק |

**מי יוצר את האווטארים והדמות?** Claude (אני) — דרך ה-skill `design` שיש לי גישה אליו. אצור פרומפט אחיד עם guidelines של סגנון (flat, rounded, cheerful, hebrew-children-illustration style) ואייצר את 12 האווטארים בבת אחת, אז את דמות המורה ב-5 pose-ים.

**רישוי:** כל הצלילים והמוזיקה ב-CC0 או רישיון-חופשי. רישוי מתועד ב-`docs/ASSETS.md` (נוסיף את הקובץ הזה לרשימת ה-MD).

---

## תמיכת דפדפנים

**יעד ראשוני:** Chrome (גרסה אחרונה) ב-Windows. זהו ה-must-pass.

**עובד גם אבל לא נבדק רשמית:** Edge על Windows (זהה ל-Chrome טכנית).

**מחוץ ל-scope:** Firefox, Safari, מובייל. אם המשחק יפעל שם — בונוס; אם לא — לא מתקנים.

**מינימום:** Chrome 100+ (תמיכת ES Modules, IndexedDB, Web Speech API מתקדם).

ראה `docs/PROCESSES.md` ל-checklist בדיקה.

---

## עבודה עם Claude Design דרך גשר-המשתמש (Bridge Protocol)

המשתמש משמש כגשר בין Claude Code (שמכיר את הפרויקט לעומק) ל-Claude Design (claude.ai במצב artifacts, שמייצר עיצובים ויזואליים עשירים). חלוקת-עבודה:

| תפקיד | מי | מה הוא עושה |
|--------|-----|--------------|
| **בריף מובנה ומפורט** | Claude Code (אני) | מכין brief עשיר עם כל ההקשר, מגביל-עיצוביות, ספקיפיקציות |
| **גשר** | המשתמש | מעתיק brief ל-claude.ai, מציג את המוצר חזרה אלי |
| **יצירה ויזואלית עשירה** | Claude Design (claude.ai) | מייצר HTML artifacts, SVG, mockups, image generation |
| **בקרת-איכות ואינטגרציה** | Claude Code (אני) | בודק קונסיסטנטיות, מטמיע ב-`design-mocks/`, מתרגם ל-CSS אמיתי |

### זרימת-עבודה (Cycle)

```
┌──────────────┐  brief   ┌──────────────┐  copy   ┌──────────────┐
│ Claude Code  │ ───────► │   המשתמש     │ ──────► │ Claude Design│
│  (כאן)       │          │  (אתה)       │         │ (claude.ai)  │
└──────────────┘          └──────────────┘         └──────────────┘
        ▲                        │                         │
        │                        │  artifact / image       │
        │                        ◄─────────────────────────┘
        │                        │
        │    HTML/PNG/desc       │
        └────────────────────────┘
```

### מבנה Brief סטנדרטי

כל brief שאני אכין יבוא בפורמט הזה, מוכן להעתקה ל-claude.ai:

```markdown
# [שם הברייף]

## הקשר
[1 פסקה — מי הקהל, מה המטרה, איפה זה משתלב במשחק]

## הדרישה הקונקרטית
[מה אני רוצה לקבל — מסך/אייקון/לוגו/אנימציה]

## אילוצים-עיצוביים (חובה)
- צבעים: [רשימת hex codes מהפלטה שלנו]
- פונטים: [Heebo / Varela Round]
- RTL: עברית, יישור-לימין
- מינימום-טאצ': 80×80px לאלמנטים אינטראקטיביים
- ניגודיות: WCAG AA (4.5:1 לטקסט רגיל)
- קהל יעד: ילדי 4–6 שעדיין לא קוראים

## מה אני רוצה לקבל בחזרה (Deliverable)
[HTML artifact מוכן לפתיחה / SVG inline / image / Tailwind component]

## הוראות-עריכה ל-Claude Design
- צור artifact מסוג [HTML / React / SVG]
- כל הטקסטים בעברית
- השתמש ב-CSS variables שצוינו
- אם יש 2 גרסאות שונות — הראה את שתיהן (A/B)

## מידע נוסף שעוזר
[שורות-קוד שכבר כתבתי / ASCII mockup שלי / סגנון-רפרנס]
```

### פרוטוקול-החזרה ל-Claude Code

כשתקבל artifact מ-claude.ai, תוכל להחזיר אותו אלי בכמה דרכים — כל אחת עובדת:

1. **HTML מלא** (הכי טוב לאינטגרציה): העתק את הקוד של ה-artifact ושלח לי. אני אטמיע ב-`design-mocks/`.
2. **צילום-מסך** (טוב לסקירה): צלם את ה-artifact ושלח לי כתמונה. אני אנתח ואכתוב את ה-CSS בעצמי.
3. **תיאור-מילולי**: "הוא יצר מסך עם רקע כחול, כפתור צהוב במרכז..." — אני אסיק מזה.
4. **קישור ל-claude.ai share**: אם תיצור public share — אני יכול לפתוח אותו דרך WebFetch.

**הכי יעיל:** HTML מלא של ה-artifact (אופציה 1). מסתפק בו ב-90% מהמקרים.

### יתרונות הגישה

- **Claude Design רואה איך זה נראה** — הוא יכול להריץ artifact ולסקור ויזואלית את התוצאה לפני שהוא מחזיר.
- **אני שומר על הקונסיסטנטיות** של הפרויקט — Claude Design לא רואה את כל 100KB של PLAN.md, אבל אני כן.
- **אתה בוחר** — לכל brief יש "A/B options", אתה רואה ובוחר.

---

## 5 בריפים מוכנים-לשימוש — Pure Copy-Paste

### איך זה עובד (בלי לחשוב)

1. **בערב, כשתחזור הביתה:** תפתח את הקובץ `docs/CLAUDE-DESIGN-BRIEFS.md` בריפו (אצור אותו אחרי שאצא מ-Plan Mode).
2. **תבחר brief** (התחל מ-#1 — לוגו).
3. **תעתיק את כל הקטע** של ה-brief (בין סימני `═══`) — **הכל**, גם את ה"הוראות החזרה" בסוף.
4. **תפתח claude.ai**, צ'אט חדש, **תדביק**.
5. **תחכה לתגובה** של Claude Design — היא תכלול artifact עם המוצר + בסוף שורת `═══ START PASTE ═══` ועוד שורת `═══ END PASTE ═══`.
6. **תעתיק את כל מה שבין השורות האלו** ותחזיר אלי בצ'אט.
7. **אני אדע בדיוק מה לעשות** עם הפלט.

זה זהה לכל brief. אין צעד חמישי-חצי שאתה צריך להבין. רק העתק-הדבק.

---

### ═══ Brief #1 — Logo & Brand Direction ═══

```
שלום Claude.

זה brief מפרויקט מקביל שאני עובדים עליו עם Claude Code. תפקידך: לייצר עיצוב לפי המפרט, ולהחזיר בפורמט מובנה שאני אעתיק חזרה ל-Claude Code.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני (Chachmoni)
תיאור: משחק דפדפן בעברית ללימוד יסודות המחשב לילדים בני 4-6 שעדיין לא קוראים
דמות-מרכזית: ינשוף-מורה ידידותי בשם "פרופ' חכמוני"
שפה: עברית בלבד, RTL
פלטה רשמית:
  - שמיים: #6FC3DF
  - שמש: #FFD93D
  - אלמוגי: #FF6B6B
  - נענע: #6BCB77
  - לבנדר: #C9A0DC
  - לבן-רך: #FFFCF2
  - כהה-חם: #2D2A26
פונטים: Varela Round (כותרות), Heebo (גוף)

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 2 גרסאות שונות (A ו-B) של לוגו המילה "חכמוני" בעברית.

דרישות לכל גרסה:
- טקסט עברי "חכמוני" קריא וברור
- סמל קטן ליד הטקסט: גרסה A — ינשוף קטן מסוגנן. גרסה B — צורה אבסטרקטית (כוכב/ספר/אות).
- מתאים להיות בכותרת ענקית (300x80) וגם בפאוויקון (48x48)
- 2-3 צבעים מהפלטה בלבד
- מודרני, חמים, ידידותי-לילדים

מה שאני צריך גם:
- 3 מילים-מאפיינות לכל גרסה (לדוגמה: "חם, חכם, פתוח")

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact מסוג HTML שמכיל:
1. כותרת "Version A" עם SVG של הלוגו ב-3 גדלים (300x80, 128x128, 48x48) + 3 מילים-מאפיינות
2. מפריד אופקי
3. כותרת "Version B" עם SVG של הלוגו ב-3 גדלים + 3 מילים-מאפיינות

אחרי ה-artifact, בטקסט-הצ'אט, תוסיף **בדיוק** את הטקסט הבא (אני אעתיק אותו חזרה ל-Claude Code):

═══ START PASTE ═══
BRIEF: 1
SUBJECT: Logo
ARTIFACT_HTML:
[הדבק כאן את כל קוד ה-HTML של ה-artifact ש-you created, מ-<!DOCTYPE> ועד </html>]
VERSION_A_KEYWORDS: [3 מילים מופרדות בפסיקים]
VERSION_B_KEYWORDS: [3 מילים מופרדות בפסיקים]
NOTES: [אופציונלי — הערות שלך על כיוונים אפשריים]
═══ END PASTE ═══
```

---

### ═══ Brief #2 — Mascot "פרופ' חכמוני" — 5 Poses ═══

```
שלום Claude.

זה brief מפרויקט שאני עובדים עליו עם Claude Code. תפקידך: לייצר עיצוב לפי המפרט, ולהחזיר בפורמט מובנה שאני אעתיק חזרה ל-Claude Code.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני
דמות מרכזית: ינשוף-מורה ידידותי בשם "פרופ' חכמוני"
קהל יעד: ילדים בני 4-6 שעדיין לא קוראים
שפה: עברית, RTL
פלטה: שמיים #6FC3DF, שמש #FFD93D, נענע #6BCB77, לבנדר #C9A0DC, כתום חם #FFA552, לבן-רך #FFFCF2

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 5 pose-ים של ינשוף-המורה. הוא צריך להיראות כמשפחה אחת — אותו עיצוב, אותם צבעים, רק תנוחות שונות.

ה-5 pose-ים:
1. standing-wave — עומד, מנופף שלום בכנף אחת. נכנס במסך פתיחה.
2. pointing — מצביע עם כנף על משהו. נכנס במסכי-הסבר.
3. celebrating — קופץ עם כנפיים פתוחות, כוכבים מסביב. נכנס בחגיגת-הצלחה.
4. thinking — כנף על המקור, חושב. נכנס במסך-טעינה / רמז.
5. sleeping — עיניים סגורות, "ZZZ" קטן מעליו. נכנס במסך-inactivity.

מאפייני הדמות (חובה לכל ה-pose-ים):
- ינשוף עם גוף עגול, שמיים-כחול עם בטן-כתום
- עיניים גדולות עגולות עם בבואה לבנה
- מקור כתום-קטן-משולש
- חובש כובע-מורה מרובע (אקדמי) קטן עם פונפון נענע
- ידידותי, חמוד, **לא** מאיים — לא חוטם חד, לא ציפורניים, לא צל-כהה
- סגנון flat-illustration, vector-friendly
- רקעי-שקיפות

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact מסוג HTML שמכיל את 5 ה-pose-ים כ-SVG inline, מסודרים ב-grid 3×2 (השישי ריק). תחת כל אחד — תווית בעברית של ה-pose.

אחרי ה-artifact, בטקסט-הצ'אט, תוסיף **בדיוק** את הטקסט הבא (אני אעתיק אותו חזרה):

═══ START PASTE ═══
BRIEF: 2
SUBJECT: Mascot
ARTIFACT_HTML:
[הדבק כאן את כל קוד ה-HTML של ה-artifact, מ-<!DOCTYPE> ועד </html>]
INDIVIDUAL_SVGS:
- standing-wave: [SVG inline]
- pointing: [SVG inline]
- celebrating: [SVG inline]
- thinking: [SVG inline]
- sleeping: [SVG inline]
NOTES: [אופציונלי]
═══ END PASTE ═══
```

---

### ═══ Brief #3 — Welcome Screen A/B ═══

```
שלום Claude.

זה brief מפרויקט שאני עובדים עליו עם Claude Code. תפקידך: לייצר 2 גרסאות-עיצוב למסך, ולהחזיר בפורמט מובנה.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני — משחק לימוד-מחשב לילדים בני 4-6
הילדים לא קוראים — לכן הכל voice-first (מוקרא בקול), הטקסט תוספת ויזואלית בלבד
שפה: עברית, RTL
פלטה: שמיים #6FC3DF, שמש #FFD93D, אלמוגי #FF6B6B, נענע #6BCB77, לבנדר #C9A0DC, לבן-רך #FFFCF2, כהה-חם #2D2A26 (לטקסט)
פונטים: Varela Round (כותרות), Heebo (גוף)

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 2 גרסאות-עיצוב למסך-הפתיחה של המשחק, זו-לצד-זו (A | B):

גרסה A — "חמה ועשירה":
- רקע gradient תכלת
- עננים מצוירים בעדינות
- שמש בפינה
- ינשוף-המורה במרכז (אפשר ב-emoji 🦉 לצורך mockup, כי הדמות עוד לא הופקה)

גרסה B — "מינימליסטית":
- רקע לבן-רך
- אלמנטים גיאומטריים פשוטים (עיגולים פסטליים מפוזרים)
- ינשוף-המורה במרכז, קטן יותר

תכולה משותפת לשתי הגרסאות (חובה):
- כותרת "חכמוני" + ינשוף 🦉 — בולטת בראש
- 3 כרטיסי-פרופיל ענקיים בשורה (220×280px):
  - כרטיס יואב — עיגול עם 🐰 + שם "יואב"
  - כרטיס מיה — עיגול עם 🦁 + שם "מיה"  
  - כרטיס "+ חדש" — עיגול עם + + הטקסט "פרופיל חדש"
- אייקון ⚙ "הגדרות הורים" בפינה תחתונה-שמאלית, גודל 40×40, אטימות 30%
- ניגודיות AA לכל טקסט

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact יחיד מסוג HTML שמכיל:
- גוף עם dir="rtl" ושימוש בפונטים Heebo / Varela Round (יבוא מ-Google Fonts ב-<link>)
- שני div-ים זה-לצד-זה (50% / 50%) מופרדים בקו אנכי דק
- div שמאלי = גרסה A, div ימני = גרסה B (כי RTL — A יופיע מימין, B משמאל)
- כל div מציג את המסך-המלא של הגרסה שלו
- מעל כל אחד מהם, כותרת קטנה "גרסה A" / "גרסה B"

אחרי ה-artifact, בטקסט-הצ'אט, תוסיף **בדיוק** את הטקסט הבא:

═══ START PASTE ═══
BRIEF: 3
SUBJECT: Welcome Screen A/B
ARTIFACT_HTML:
[הדבק כאן את כל קוד ה-HTML של ה-artifact]
VERSION_A_NOTES: [תיאור-קצר בעברית של הבחירות העיצוביות בגרסה A]
VERSION_B_NOTES: [תיאור-קצר בעברית של הבחירות העיצוביות בגרסה B]
RECOMMENDATION: [A או B — איזה לדעתך מתאים יותר לקהל יעד 4-6, וייסבר 1 משפט]
═══ END PASTE ═══
```

---

### ═══ Brief #4 — 12 Animal Avatars ═══

```
שלום Claude.

זה brief מפרויקט שאני עובדים עליו עם Claude Code. תפקידך: לייצר סט של 12 אווטארים, ולהחזיר בפורמט מובנה.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני
מטרת השימוש: במסך-יצירת-פרופיל ההורה בוחר אווטאר לילד. צריך 12 אופציות שכולן באותו סגנון.
קהל יעד: ילדים בני 4-6
פלטה לרקעי האווטאר: כל הצבעים מהפלטה הראשית (שמיים, שמש, אלמוגי, נענע, לבנדר, ועוד פסטלים רכים)

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 12 אווטארי-חיות, כל אחד 200×200px, באותו סגנון:

1. 🐰 ארנב — רקע ורוד פסטל
2. 🐱 חתול — רקע כתום פסטל
3. 🦁 אריה — רקע צהוב
4. 🐘 פיל — רקע אפור-כחול פסטל
5. 🐸 צפרדע — רקע ירוק רך
6. 🦉 ינשוף — רקע סגול-לבנדר
7. 🐻 דוב — רקע חום פסטל
8. 🐶 כלב — רקע שמנת
9. 🐠 דג — רקע תכלת
10. 🦋 פרפר — רקע לבן עם נקודות ורוד+סגול
11. 🤖 רובוט — רקע כסף-אפור
12. ⭐ כוכב — רקע שמש מבריקה

מאפיינים אחידים (חובה):
- כל אווטאר ברקע-עיגול בצבע הפסטל שלו
- רואים רק את ראש החיה (לא גוף-שלם), חזיתית
- כולם מחייכים בעדינות
- סגנון flat-illustration, geometric-friendly, color-blocked
- אין רקע מסובך — רק העיגול הצבעוני
- מתאים לגודל קטן (יוצג גם ב-80×80)

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact מסוג HTML שמכיל grid 4×3 של 12 ה-SVG-ים inline. תחת כל אחד — שמו בעברית עם פונט Heebo.

אחרי ה-artifact, בטקסט-הצ'אט, תוסיף **בדיוק** את הטקסט הבא:

═══ START PASTE ═══
BRIEF: 4
SUBJECT: Animal Avatars Set
ARTIFACT_HTML:
[הדבק כאן את כל קוד ה-HTML של ה-artifact]
AVATARS:
- rabbit: [SVG inline]
- cat: [SVG inline]
- lion: [SVG inline]
- elephant: [SVG inline]
- frog: [SVG inline]
- owl: [SVG inline]
- bear: [SVG inline]
- dog: [SVG inline]
- fish: [SVG inline]
- butterfly: [SVG inline]
- robot: [SVG inline]
- star: [SVG inline]
NOTES: [אופציונלי]
═══ END PASTE ═══
```

---

### ═══ Brief #5 — Task Screen (Balloons) + Celebration ═══

```
שלום Claude.

זה brief מפרויקט שאני עובדים עליו עם Claude Code. תפקידך: לייצר 2 מסכים-של-משחק, ולהחזיר בפורמט מובנה.

═══════════════════════════════════════════════
PROJECT CONTEXT
═══════════════════════════════════════════════

שם המשחק: חכמוני — לימוד מחשב לילדים בני 4-6
הילדים לא קוראים — voice-first, הטקסט תוספת ויזואלית
שפה: עברית, RTL
פלטה: שמיים #6FC3DF, שמש #FFD93D, אלמוגי #FF6B6B, נענע #6BCB77, לבנדר #C9A0DC, לבן-רך #FFFCF2
פונטים: Varela Round (כותרות), Heebo (גוף)

═══════════════════════════════════════════════
TASK
═══════════════════════════════════════════════

צור 2 מסכים זה-מתחת-לזה:

מסך 1: "פוצצו את הבלונים"
- header עליון (גובה 80px):
  - שמאלה (כי RTL — בעצם זה הימני בDOM): "⭐ 17" — מונה כוכבים, גודל 32px
  - מרכז: כפתור עגול 64×64 עם 🔊 ("שמע שוב")
  - ימינה (השמאלי בDOM): כפתור עגול 64×64 עם 🏠 ("בית")
- מרכז המסך:
  - כותרת בולטת "פוצצו את הבלונים!" (48px, Varela Round, צבע #2D2A26)
  - 5 בלונים מרחפים במיקומים-שונים על המסך (לא בשורה), כל בלון 80×120px עם חוט, צבעים שונים: אדום-עדין #FF6B6B, צהוב #FFD93D, תכלת #6FC3DF, ירוק #6BCB77, סגול #C9A0DC
- תחתית (גובה 60px):
  - progress bar ויזואלי: 5 כוכבים, 3 מלאים (#FFD93D) + 2 ריקים (outline בלבד) — מציין שהילד פוצץ 3 מתוך 5
- רקע: gradient תכלת-בהיר → לבן (מ-#6FC3DF ל-#FFFCF2)

מסך 2: חגיגת-הצלחה
- ינשוף-המורה במרכז (200×250px), אפשר ב-🦉 ענק לצורך mockup
- מתחתיו: כותרת ענקית "כל הכבוד!" (88px, Varela Round, #FF6B6B)
- מתחת: "+1 ⭐ כוכב חדש!" (48px, #FFD93D)
- 2 כפתורים-ענקיים זה-לצד-זה:
  - "למשימה הבאה" — Primary CTA: רקע #FFD93D, טקסט #2D2A26, גודל 240×96, radius 9999, shadow גדול
  - "חזרה למפה" — Secondary: רקע #FFFCF2, border 3px #FF6B6B, טקסט #FF6B6B, גודל 200×88
- ברקע: 15-20 חלקיקי-confetti צבעוניים (סטטיים, לא אנימציה במוקאפ) פזורים מהחלק העליון

═══════════════════════════════════════════════
HOW TO RESPOND
═══════════════════════════════════════════════

צור artifact מסוג HTML שמכיל שני sections זה-מתחת-לזה, כל אחד מציג מסך אחד. הוסף כותרת קטנה מעל כל section ("מסך משימה" / "מסך חגיגה").

אחרי ה-artifact, בטקסט-הצ'אט, תוסיף **בדיוק** את הטקסט הבא:

═══ START PASTE ═══
BRIEF: 5
SUBJECT: Task Screen + Celebration
ARTIFACT_HTML:
[הדבק כאן את כל קוד ה-HTML של ה-artifact]
DESIGN_DECISIONS: [תיאור-קצר בעברית של ההחלטות העיצוביות שעשית]
SUGGESTIONS_FOR_OTHER_TEMPLATES: [אופציונלי — איזה עיצובים-אחים יעבדו טוב עם המסכים האלו לתבניות אחרות במשחק]
═══ END PASTE ═══
```

---

**הערה חשובה לאחר ExitPlanMode:** אצור קובץ נפרד `docs/CLAUDE-DESIGN-BRIEFS.md` בריפו עם **רק** הבריפים האלה — קל לפתוח, קל להעתיק, בלי לחפש בתוך 100KB של PLAN.md.

---

## תהליך עיצוב — Design Workflow

### שילוב ארבעת הכלים — "Claude Design" המעשי

יש לי ארבעה כלים שמשלימים זה את זה. הגישה שלי:

| שלב | כלי | מה הוא מייצר | מתי |
|-----|-----|---------------|-----|
| **A. החלטות-עיצוב** | `ui-ux-pro-max` skill | המלצות פלטה, פונטים, spacing, motion curves, accessibility | לפני שמייצרים מוקאפ |
| **B. עיצוב ויזואלי עשיר** | **Claude Design** (claude.ai) דרך גשר-המשתמש | mockups עם image generation, A/B exploration, סגנון-שאינו אצלי | לכל מסך גדול / לוגו / mascot |
| **C. מוקאפים אינטראקטיביים** | סקריפט HTML ב-`design-mocks/` שלי | קבצי HTML שאפשר לפתוח בכרום | אחרי בחירת-כיוון מ-Claude Design |
| **D. נכסים גרפיים** | `design` skill + Gemini 3.1 Pro Image | 12 אווטארים, דמות-מורה, לוגו, פאוויקון | בשלב הנכסים |
| **E. שיתוף עם הורה לאישור** | **Canva MCP** | קבצי Canva ערוכים | אופציונלי |

### למה זה הסדר הנכון

- **HTML mockups קודמים** — הם **קוד**. אם הם נראים נכון, חצי מהעבודה כבר נעשתה (הסטיילים מתאימים לפרויקט). פחות "תרגום" מ-Canva ל-CSS.
- **Canva בא רק לאישור-הורה** — לא לעיצוב הראשוני. שם זה נתון כעדכון, לא כסעיף-עבודה.
- **Gemini לנכסים בלבד** — לא למסכים שלמים. הוא טוב באיורי-מטרה (אווטאר, mascot), לא בקומפוזיציות UI מורכבות.

### תיקיית `design-mocks/`

בריפו, ניצור תיקייה `design-mocks/` שמכילה HTML mockups עצמאיים — לא חלק מהמשחק הסופי, אלא **תצוגה מקדימה**:
```
design-mocks/
  index.html              — אינדקס לכל המוקאפים
  01-welcome.html
  02-profile-select.html
  03-profile-create.html
  04-pin-entry.html
  05-pin-wrong.html
  06-parent-dashboard.html
  07-ai-generator-modal.html
  08-drive-setup-step1.html
  09-drive-setup-step2.html
  10-first-run-wizard-1.html
  11-first-run-wizard-2.html
  12-world-map.html
  13-task-click-balloons.html
  14-success-celebration.html
  15-photo-uploader.html
  shared/
    tokens.css            — design tokens (משותף לכל המוקאפים)
    base.css
```

אפשר לפתוח את `design-mocks/index.html` ולסקור את כל המסכים ברצף. הם משמשים גם כ-spec לפיתוח.

---

## מסכי-משנה — פירוט

מסכים שלא היו ב-ASCII mockups הקודמים:

### 1. מסך פתיחה (כשיש פרופילים)
- כרטיסי פרופיל ענקיים (180×180) במרכז.
- אייקון ⚙ קטן (40×40, אטימות 30%) פינה תחתונה-שמאלית.
- ברוכים-הבאים נקרא אוטומטית.
- Hover על כרטיס פרופיל ל-600ms → קריינות "יואב" / "מיה".

### 2. מסך יצירת פרופיל
- כותרת: "מי משחק היום? בואו ניצור פרופיל"
- שלב 1: **בחירת שם** — שתי-אפשרויות:
  - **רשימת-שמות-נפוצים-מוכנה** (Patch מ-UX-Kid Round 2): chips של 20 שמות-עבריים נפוצים (יואב, מיה, נועם, אדם, שירה, איתי, יעל, אריאל, רותם, הילה, אלון, נטע, רוני, גיא, תמר, אורי, ליה, אלעד, שיר, איתן). הילד יכול ללחוץ על שם מהרשימה.
  - **הקלדה חופשית** עם המקלדת הוויזואלית הענקית — אם השם לא ברשימה.
  - **כפתור "🔊 שמע את השם"** (Patch מ-Hebrew Round 2 — Pronunciation Preview): מריץ `speak(name)` מיידית כדי שההורה יוודא ש-TTS מבטא נכון לפני שמירה.
- שלב 2: **בחירת אווטאר** — גריד 4×3 של אווטארי-החיות + כרטיס "📷 תמונה שלי" בנפרד
- שלב 3 (אם בחר תמונה): **העלאת תמונה** עם crop dialog
- שלב 4: **אישור** — תצוגת הפרופיל הסופי

### 3. מסך הזנת PIN
- **כפתור ענק "← חזרה למשחק" בראש המסך** (Patch #7 — קריטי! בלי זה ילד שנכנס בטעות יתקע).
- קריינות אוטומטית: "זה רק לאמא ואבא. אם נכנסתם בטעות — לחצו על החץ הגדול כדי לחזור לשחק."
- 4 ריבועים ענקיים (100×100) במרכז
- מקלדת מספרים ויזואלית (3×4 grid עם 1-9, 0, ⌫)
- כותרת: "הזינו את הקוד-הסודי של ההורים"
- מתחת: אזהרת-טעות אחרי כל ניסיון
- אחרי 3 טעויות: מסך נעילה עם countdown (15 דק' — לא 5)

### 4. מסך הגדרות-הורה (Dashboard)
```
┌─────── הגדרות הורים ──────────────────────────────────────┐
│  ← חזרה למשחק                                              │
│                                                            │
│  📊 התקדמות הילדים                                         │
│  ┌─ יואב ─────────────────────────┐  ⭐ 17 כוכבים          │
│  │ עולם 1: ████████░░ 8/18         │  📅 שיחק לאחרונה: היום │
│  │ עולם 2: ░░░░░░░░░░ 0/16         │  ⏱ סה"כ: 2:34 שעות    │
│  └────────────────────────────────┘                        │
│                                                            │
│  👥 פרופילים                                               │
│  [ ניהול פרופילים ]                                        │
│                                                            │
│  ☁ סנכרון Google Drive                                     │
│  ✓ מסונכרן · גיבוי אחרון: לפני 5 דקות                     │
│  [ הגדרות גיבוי ]    [ שחזר גרסה קודמת ]                   │
│                                                            │
│  ✨ יצירת תוכן עם AI                                       │
│  שימוש החודש: $0.12 / $5.00                                │
│  [ ████░░░░░░░░░░░░░ ]                                     │
│  [ צור משימה חדשה ]                                        │
│                                                            │
│  🐞 דיווח על באג                                          │
│  [ דווח על באג עם צילום מסך ]                             │
│                                                            │
│  ⚙ הגדרות מתקדמות                                          │
│  [ שנה PIN ]  [ אפס משחק ]  [ ייצא נתונים ]                │
└────────────────────────────────────────────────────────────┘
```

### 5. מודאל גנרטור AI
```
┌─── ✨ צרו משימה חדשה ─────────────┐
│                                  │
│  בחרו סוג משימה:                  │
│  ◉ ללחוץ על מטרות                │
│  ○ לגרור פריטים                  │
│  ○ ללחוץ מקש                     │
│  ○ להקליד מילה                   │
│                                  │
│  נושא רצוי:                       │
│  ┌────────────────────────────┐  │
│  │ כלי-נגינה                  │  │
│  └────────────────────────────┘  │
│  (לדוגמה: חרקים, רכבים, צבעים)   │
│                                  │
│  רמת קושי:                        │
│  ○ קל   ◉ בינוני   ○ קשה         │
│                                  │
│  עלות צפויה: ~$0.001              │
│                                  │
│  [ ביטול ]   [ ✨ צור משימה ]    │
└──────────────────────────────────┘
```

### 6. מסך First-Run Wizard
ראה סעיף "חוויית פעם-ראשונה" למעלה. 5 מסכים: ברוכים-הבאים, מה-זה-עכבר, תרגול-לחיצה, הגדרת-הורה, התחל-לשחק.

### 7. מסך הגדרת Drive (חד-פעמי)
4 substeps עם הדרכה מצולמת:
1. "פתחו את Google Cloud Console" — קישור + צילום מסך
2. "הפעילו את Drive API"
3. "צרו OAuth Client" — עם רשימת ה-origins להעתקה
4. "הדביקו את ה-Client ID כאן" — שדה + כפתור אימות

### 8. מסך פרופיל-עריכה (מסך הורה)
ניהול: שם, אווטאר/תמונה, איפוס התקדמות, מחיקה.

---

## מפרט אנימציות (Animation Spec)

### עקרון
**אנימציות לילדים = רכות, איטיות, צפויות.** אין whiplash, אין surprise. כל אנימציה משרתת מטרה (משוב, הכוונה, חגיגה).

### Tokens של תנועה
```css
--ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-instant: 100ms;
--duration-quick: 200ms;
--duration-base: 400ms;        /* ברירת מחדל לרוב המעברים */
--duration-celebration: 800ms;  /* לאנימציות הצלחה */
```

### מעברי-מסכים
- **כניסה למסך:** slide-in מימין + fade-in, 400ms ease-soft. (RTL — מימין כי זה כיוון "קדימה" בעברית)
- **יציאה ממסך:** slide-out לשמאל + fade-out, 300ms.
- **חזרה (←):** slide-in משמאל, slide-out לימין (הפוך).

### Hover על כפתור
- `transform: scale(1.05)` + `box-shadow` גדל, 200ms ease-soft.
- אחרי 600ms עמידה: הקריינות מתחילה (לא אנימציה ויזואלית נוספת — הצליל הוא המשוב).

### Click על כפתור
- `transform: scale(0.95)` ל-100ms, אז חזרה ל-1.0 ב-200ms ease-bounce.
- ripple effect דק מהמרכז (50% opacity → 0, 400ms).

### הצלחת משימה (Celebration)
זמן כולל: 1.8 שניות. רצף:
1. **0–200ms:** הפריט-מטרה האחרון נעלם עם spin + fade.
2. **200–400ms:** רקע מתבהר (overlay לבן 30%).
3. **400–800ms:** דמות "פרופ' חכמוני" מופיעה עם scale-in (`ease-bounce`).
4. **800–1200ms:** 5–10 כוכבים (`⭐`) צצים מתחתיו ועפים כלפי מעלה בקווים-מעוקלים.
5. **1200–1400ms:** טקסט "כל הכבוד!" מופיע ב-scale-in + הקריינות מתחילה.
6. **1400–1800ms:** כפתורי "הבא" ו"חזרה" מופיעים מלמטה.

### רמז (אחרי 10 שניות תקיעות)
- אנימציית "יד מצביעה" (`👆`) פולסטת על המטרה הנכונה — `scale: 1 → 1.2 → 1` בלולאה של 800ms.
- במקביל הקריינות חוזרת על ההוראה.

### Drive sync indicator
- מסונכרן (`✓`): סטטי.
- מסנכרן (`↻`): רוטציה רציפה 360°/1500ms.
- שגוי (`⚠`): pulse של opacity 1 ↔ 0.6, 1000ms.

### Confetti לסיום-משימה
20 חלקיקים צבעוניים נופלים מהחלק העליון של המסך, רוטציה אקראית, 1500–2500ms duration ב-`ease-out`. רק אחרי שהילד לוחץ "הבא" — לא בא יחד עם החגיגה (שלא יהיה חוויית-יתר).

### `prefers-reduced-motion`
- Disabled: כל ה-transforms (slide, scale, spin) → opacity-only fades.
- כל ה-celebrations מתקצרות ל-300ms סך-הכל.
- ה-confetti לא מופיע.

---

## Sound Design Palette

### UI Sounds (כל פעולה משמיעה משהו עדין)
| צליל | מתי | אופי |
|------|-----|------|
| `ui-hover.mp3` | hover על כפתור (אחרי 100ms) | "טינק" עדין, 80ms, גובה גבוה |
| `ui-click.mp3` | click | "פופ" קצר, רך, 120ms |
| `ui-back.mp3` | חזרה ממסך | "סוויש" יורד |
| `ui-success.mp3` | משימה הושלמה | מנגינה עולה (do-mi-sol), 600ms |
| `ui-cheer.mp3` | סיום עולם | מנגינה ארוכה יותר, 1.5s |
| `ui-try-again.mp3` | טעות עדינה | "אופ" רך, לא מבהיל |
| `ui-pin-correct.mp3` | PIN נכון | "דין-דין", 400ms |
| `ui-pin-wrong.mp3` | PIN שגוי | "בהזז" עדין |

### Game Sounds (פר-תבנית)
| צליל | תבנית |
|------|--------|
| `game-balloon-pop.mp3` | click-targets עם בלונים |
| `game-fish-catch.mp3` | click-targets עם דגים |
| `game-star-collect.mp3` | click-targets כללי |
| `game-drag-grab.mp3` | drag-drop כשמתחילים גרירה |
| `game-drag-drop-correct.mp3` | drag-drop כשמשחררים נכון |
| `game-drag-drop-wrong.mp3` | drag-drop כשמשחררים לא-נכון |
| `game-key-press.mp3` | key-press כללי |
| `game-letter-found.mp3` | key-press כשהאות הנכונה |

### Voice (75 הקלטות-mp3 מ-Gemini TTS — כבר מתועדות)

### Ambient (אופציונלי, מושתק כברירת מחדל)
- `ambient-mouse-world.mp3` — מנגינה רגועה לעולם העכבר
- `ambient-keyboard-world.mp3` — מנגינה מעט "מכנית"
- `ambient-concepts-world.mp3` — נוסטלגית-חינוכית

### Volume mixing
- UI sounds: -20dB
- Game sounds: -15dB
- Voice (קריינות): -8dB (הכי בולט — זה התוכן)
- Ambient: -28dB (כמעט שקוף)

### מקור
כל הצלילים נורדים מ-Mixkit / Freesound (CC0). הקלטות-קול ייוצרו ע"י Gemini TTS. רישוי מתועד ב-`docs/ASSETS.md`.

---

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

## ארכיטקטורת תוכן: תבניות (templates) + נתוני משימה (data)

כדי להגיע ל-50+ משימות בלי לכתוב 50 קבצי קוד נפרדים, אנחנו מפרידים בין **תבנית-משחק** (קוד) לבין **נתוני-משימה** (JS object). כל תבנית יודעת לעבד מנת-נתונים שונה ולייצר משימה אחרת.

```js
// תבנית: src/templates/click-targets.js
// מציגה N מטרות, מצפה ללחיצה על כל אחת
export default function clickTargets({ targets, successText, instructionText }) {
  return {
    mount(container, onComplete) { /* ... */ }
  };
}
```

```js
// נתון: src/tasks/click/balloons.js
import clickTargets from '../../templates/click-targets.js';
export default {
  id: 'click-balloons',
  skill: 'click',
  title: 'בלונים',
  difficulty: 1,
  instructionText: 'בואו נפוצץ בלונים. לחצו על כל בלון עם האצבע על העכבר.',
  build: () => clickTargets({
    targets: [{ emoji: '🎈', count: 5 }],
    successText: 'איזה כיף, פוצצת את כולם!'
  })
};
```

**יתרון:** הוספת משימה חדשה = ~10 שורות JS, בלי נגיעה בלוגיקה. המשתמש יוכל להוסיף משימות עתידיות בעצמו אחרי שהוא לומד את התבנית.

### תבניות מתוכננות (~8 תבניות, מכסות 50+ משימות)

| תבנית | מהי | מספר משימות שניתן לבנות ממנה |
|--------|-----|------------------------------|
| `hover-target` | להעביר עכבר אל מטרה ולעצור עליה | 5+ (חיות שונות, פירות שונים, מטרות נעות) |
| `click-targets` | ללחוץ על N מטרות שצצות | 8+ (בלונים, כוכבים, דגים, פירות, חרקים...) |
| `double-click-reveal` | קליק כפול חושף תוכן | 4+ (תיבות, ביצים, מתנות, צדפים) |
| `right-click-menu` | קליק ימני פותח תפריט בחירה | 3+ (בחירת צבע, בחירת חיה, בחירת מאכל) |
| `drag-drop-match` | גרירת פריט ליעד נכון | 8+ (התאמת צבעים, צורות, חיות-לבית, פירות-לסלסילה, אותיות-לקופסה) |
| `key-press` | לחיצה על מקש ספציפי / רצף | 10+ (Space לקפיצה, חצים למסלול, אותיות שונות, ספרות, Enter, Backspace, Shift) |
| `type-word` | להקליד מילה קצרה | 5+ (השם של הילד, "אמא", "אבא", שמות חיות) |
| `point-and-narrate` | "סיור מודרך" — מצביעים על אובייקטים ומסבירים | 7+ (חלקי חלון, חלקי דפדפן, אייקונים על שולחן עבודה, חלקי מקלדת, חלקי עכבר, סוגי קבצים)|

**סה"כ פוטנציאל מהתבניות האלו: ~50 משימות "מובנות מראש".** אם רוצים יותר — מוסיפים נתוני-משימה חדשים או תבנית חדשה.

---

## תוכן ראשוני — מסלול 50 המשימות

המסלול מחולק ל-4 "עולמות". בתוך כל עולם המשימות בסדר עולה של קושי. הילד פותח אחת-אחת.

### עולם 1: עולם העכבר (משימות 1–18)
- **Hover (1–4):** האכלת ארנב, החזקת בלון, חימום ידיים ליד אש, ליטוף חתול
- **Click בודד (5–9):** פיצוץ בלונים, חיפוש דגים, איסוף כוכבים, הדלקת נורות, קטיפת פרחים
- **Double-click (10–12):** פתיחת מתנות, בקיעת ביצים, פתיחת צדפים
- **Right-click (13–14):** תפריט-קסם לבחירת צבע, תפריט לבחירת מאכל לחיה
- **Drag & drop (15–18):** התאמת צבעים, פירות לסלסילה, חיות לבית, צורות לחור הנכון

### עולם 2: עולם המקלדת (משימות 19–34)
- **Space (19–20):** קפיצת צפרדע, ירייה במשחק חלל פשוט
- **חצים (21–24):** מבוך קצר, מירוץ, דגים בים, ספינה
- **אותיות (25–30):** ציד אותיות בודדות (כל פעם אות אחרת), זיהוי האות הראשונה בשם הילד, התאמת אות לחיה (א=ארנב)
- **ספרות (31–32):** ספירת חפצים והקלדת המספר, התאמת קוביות
- **Enter + Backspace (33):** הקלדת השם של הילד עם תיקון
- **Shift (34):** "הקפצת" דמות עם Shift (היכרות עם מקש משנה)

### עולם 3: עולם החלון והדפדפן (משימות 35–42)
- **חלון (35–37):** סגירה (X), מזעור, הגדלה — כל אחד משימה נפרדת
- **גלילה (38):** scroll עם גלגל-העכבר (תוכן ארוך בעמוד)
- **דפדפן (39–42):** מה זה כתובת, כפתור-חזור, כפתור-קדימה, רענון

### עולם 4: עולם המושגים (משימות 43–50)
- **שולחן עבודה (43):** מה זה אייקון, איך פותחים אותו
- **תיקייה וקובץ (44–45):** מה ההבדל, איך נראים, איך פותחים
- **חלקי מחשב (46):** סיור — מסך, מקלדת, עכבר, רמקולים
- **חלקי עכבר (47):** כפתור שמאלי, ימני, גלגלת
- **חלקי מקלדת (48):** אזורי אותיות, ספרות, חצים, רווח
- **בטיחות (49):** "אם משהו לא ברור, קוראים לאבא או אמא" — משימת סיום
- **חגיגת סיום (50):** מסך הישגים עם כל הכוכבים שנאספו

---

## תוכן מורחב — עולמות 5–8 (Phase 2)

לאחר שהושלמו 50 המשימות הבסיסיות, יש 4 **עולמות נוספים** שמרחיבים את הלימוד הרבה מעבר ל"עכבר + מקלדת" — לכיוון של **חשיבה דיגיטלית כוללת**. גם עולמות אלו משתמשים בתבניות הקיימות (בעיקר `point-and-narrate`, `drag-drop-match`, `click-targets`) — לא דורש קוד חדש משמעותי.

**סה"כ +28 משימות → המשחק מגיע ל-78 משימות מובנות.**

### עולם 5 — 🎨 יצירה דיגיטלית (משימות 51–57, 7 משימות)

הילד מבין שהמחשב הוא גם **כלי-יצירה**, לא רק "מסך-משחק".

- **51. סקרבל הראשון:** קאנבס ריק, העכבר מצייר. הילד גורר את העכבר ויוצר קו. הקריינות: "תזיזו את העכבר! רואים? אתם מציירים!"
- **52. בחירת צבע:** פלטה של 6 צבעים. לחיצה על צבע משנה את צבע-הקו. "תלחצו על אדום. עכשיו תציירו תפוח."
- **53. גודל-המכחול:** 3 כפתורי-עובי (דק/בינוני/עבה). שילוב של צבע + גודל.
- **54. מחיקה:** כלי-מחק. גרירה מוחקת את מה שצויר. "טעית? אפשר למחוק!"
- **55. צביעה בתוך-קווים:** קונטור-נתון (פרח, חיה), הילד צובע לפי-בחירה. **קונספט "מילוי באזור" של תוכנת-גרפיקה.**
- **56. שמירת ציור:** כפתור "שמור". הציור מופיע ב-"גלריה" בפרופיל. **קונספט-מפתח: דברים יכולים להישמר.**
- **57. גלריה אישית:** מסך עם כל הציורים של הילד. אפשר לראות, למחוק, לשתף (יורד כקובץ PNG).

תבנית חדשה: `draw-canvas` (canvas API פשוט עם mouse-move = stroke). בנייה: יום אחד.

### עולם 6 — 🔢 מספרים, צורות ולוגיקה (משימות 58–67, 10 משימות)

קוגניציה. מתחזק את מה שלמדו בגן.

- **58. ספירה עד 5:** "כמה כוכבים יש? תלחצו על המספר הנכון." (מקלדת ויזואלית 1-9)
- **59. ספירה עד 10:** אותו דבר, יותר אובייקטים.
- **60. גדול/קטן:** שני בלונים בגדלים שונים. "תלחצו על הבלון הגדול." (drag-drop-match או click-targets)
- **61. רב/מעט:** קופסה עם 8 פירות vs קופסה עם 3. "באיזה קופסה יש יותר?"
- **62. סדר עולה:** 4 פירות בגדלים שונים, גרירה לסדר מהקטן לגדול.
- **63. דפוס:** רצף "🔴🟡🔴🟡🔴 ?", הילד בוחר את הצבע הבא.
- **64. צורות:** "תלחצו על המשולש." (זיהוי משולש/ריבוע/עיגול בין 4 אופציות)
- **65. התאמת-צורות:** גרירת צורות לחורים מתאימים (כמו פאזל-תינוקות אבל דיגיטלי).
- **66. זיכרון-זוגות:** 6 כרטיסים הפוכים (3 זוגות) — לחיצה הופכת, מצאת זוג = נשאר פתוח.
- **67. סיווג:** מסך עם 8 אובייקטים, 2 קופסאות ("חיות" / "פירות"). גרירה לקופסה הנכונה.

תבניות חדשות: `pattern-sequence`, `memory-match`. בנייה: יומיים.

### עולם 7 — 🛡️ בטיחות באינטרנט (משימות 68–73, 6 משימות)

**קריטי** לגיל הזה — הילדים יתחילו לראות מסכים בקרוב מאוד, הם חייבים בסיס.

- **68. מי זה זר?** מסך עם 4 פנים: "תלחצו על מי שאתם **לא** מכירים." (4 פנים — שלוש מהמשפחה ואחת זרה).
- **69. הכתובת היא סוד:** הילד רואה שאלה במסך "מה הכתובת שלך?". 2 כפתורים: "להגיד" / "לקרוא לאבא". (הילד אמור ללחוץ על הקריאה להורה.) קריינות: "אם מישהו במחשב שואל איפה גרים, **לא עונים**. קוראים לאבא או לאמא!"
- **70. השם המלא הוא סוד:** דומה, אבל לשאלת השם המלא.
- **71. פרסומת או משחק?** מסך עם 2 דמויות-משחק ו-1 "פרסומת" צבעונית מהבהבת. "איזה זה משחק אמיתי?" (הילד לומד שלא כל מה שמהבהב = לוחצים.)
- **72. כפתור "סגור" (X):** מסך עם חלון "תרצו לשחק בעוד משחק?" עם X גדול בפינה. "אם משהו מבלבל — תמיד יש X."
- **73. בקשה לעזרה:** סימולציה: "משהו לא ברור?" → כפתור-ענק "👨‍👩 קראו לאמא/אבא". **זוהי המשימה החשובה ביותר בעולם הזה.** הילד לומד שיש "כפתור-חירום" לכל מצב.

תבנית: שימוש ב-`right-click-menu` שכבר קיים + click-targets. בנייה: יום.

### עולם 8 — 🎵 צליל ומולטימדיה (משימות 74–78, 5 משימות)

מולטימדיה — להבין שלמחשב יש "אוזניים ופה".

- **74. עוצמת קול:** סליידר-ויזואלי (3 רמות, לא רציף — קל יותר לבן 4). הילד שומע את אותה מנגינה בלחישה, רגיל, חזק. "תבחרו את הקול שאתם אוהבים."
- **75. השתקה (mute):** הכפתור 🔊 ↔ 🔇. הילד לוחץ — המוזיקה נעלמת. שוב — חוזרת. **קונספט toggle.**
- **76. Play/Pause:** סרטון קצר (חיה מחייכת) עם כפתורי ▶️ / ⏸. הילד לומד "להפעיל ולעצור".
- **77. זיהוי צלילים:** "תלחצו על החיה שאתם שומעים." משמיע צלילי-חיה (חתול, כלב, פרה), הילד בוחר.
- **78. יצירת מוזיקה — Xylophone:** 8 מקשים-צבעוניים. כל מקש = צליל. **משימת-יציאה** של העולם — חופשית, יצירתית. הילד יכול לנגן עד שמתעייף.

תבנית: שימוש ב-`click-targets` + Audio API. בנייה: יומיים.

---

## סיכום: 78 משימות מובנות ב-8 עולמות

| עולם | מס' משימות | טווח | קושי |
|------|-------------|------|------|
| 1 — 🖱️ עכבר | 18 | 1–18 | קל → בינוני |
| 2 — ⌨️ מקלדת | 16 | 19–34 | בינוני |
| 3 — 🪟 חלון ודפדפן | 8 | 35–42 | בינוני |
| 4 — 💡 מושגים | 8 | 43–50 | בינוני → קשה |
| 5 — 🎨 יצירה | 7 | 51–57 | פתוח |
| 6 — 🔢 לוגיקה ומספרים | 10 | 58–67 | בינוני |
| 7 — 🛡️ בטיחות | 6 | 68–73 | **חיוני** |
| 8 — 🎵 צליל ומדיה | 5 | 74–78 | קל → פתוח |
| **סה"כ** | **78** | | |

עם ווריאציות × ~5 ממוצע → **~390 חוויות-משחק שונות**. עם AI generator → **∞**.

### סדר הצעה לעבודה (לאחר MVP)

**MVP (השקה ראשונה לבית):** עולמות 1–4 = 50 משימות. ~11 ימי עבודה.

**גרסה 1.5 (אחרי חודש שימוש בבית, לפי משוב):** עולם 7 (בטיחות) — מוקדם כי זה הכי קריטי. +יום עבודה.

**גרסה 2.0:** עולמות 5, 6, 8 לפי קלט מהילדים. +3-5 ימי עבודה לכל עולם.

---

## חוזה ה-API של משימה (Task contract)

כל קובץ ב-`src/tasks/**` מייצא אובייקט נתונים שמחזיר instance של תבנית:

```js
export default {
  id: 'click-balloons',
  worldId: 'mouse',
  skill: 'click',
  title: 'בלונים',
  difficulty: 1,
  instructionText: 'בואו נפוצץ בלונים. לחצו על כל בלון.',
  hoverHint: 'לחצו כאן כדי להתחיל את המשימה',  // לקריינות hover על כפתור-המשימה במסך הראשי
  build: () => clickTargets({ /* params */ })
};
```

תבנית חוזרת על החוזה הישן:

```js
// תבנית מחזירה אובייקט עם mount
function template(params) {
  return {
    mount(container, onComplete) { /* ... */ return cleanup; }
  };
}
```

זה מאפשר ל-`app.js` להחליף משימות בלי לדעת על הפרטים הפנימיים, ולהוסיף משימה חדשה = ליצור קובץ data + לרשום ב-registry.

---

## קריינות עברית — פרטים טכניים

- `audio.js` יציג פונקציות:
  - `speak(text, opts)` — עוטפת `SpeechSynthesisUtterance` עם `rate: 0.85`, `pitch: 1.1`, `lang: 'he-IL'`.
  - `cancel()` — לעצירת קריינות פעילה.
  - `speakOnHover(element, text, delayMs = 600)` — debounce ב-`mouseenter`/`mouseleave`.
  - **`speakOnHoverOrTouch()`** (Patch מ-UX-Kid) — תומך גם ב-tap-and-hold 600ms ב-touch-screens, לא רק עכבר.
  - **`speakWithFallback()`** (Patch מ-Hebrew) — voice-chain: Asaf → Hila → כל voice עם `lang='he-IL'` → התראה להורה אם אין.
  - **Audio Visual Fallback** (Patch מ-QA): אם TTS נכשל 3 פעמים — animation של פה+חץ מציגה ש"יש לחיצה" (לילד שלא-קורא).
  - **`audioReady` flag** (Patch מ-Integration): כל קריאה ל-`speak()` לפני הקליק-הראשון של המשתמש = no-op שקט (autoplay restriction).

### Voice Chain Strategy (Patch מ-Hebrew)
```js
function selectVoice() {
  const voices = speechSynthesis.getVoices();
  return voices.find(v => v.name.includes('Asaf'))
      || voices.find(v => v.name.includes('Hila'))
      || voices.find(v => v.lang === 'he-IL')
      || voices.find(v => v.lang.startsWith('he'))
      || null;  // לא נמצא — אזהרה להורה, Phase 2 fallback ל-mp3
}
```

### NARRATION.md Schema (Patch מ-Hebrew) — תמיכה בניקוד
```json
{
  "task-click-balloons-instruction": {
    "text": "פוצצו את כל הבלונים",
    "textNiqud": "פּוֹצְצוּ אֶת כָּל הַבָּלוֹנִים",
    "textTTS": "פוצצו את כל הבלונים",
    "altText": "תמונה של בלונים צבעוניים"
  }
}
```

- **`text`:** גלוי במסך
- **`textNiqud`:** עם ניקוד (לקריאה ע"י קוראי-מסך)
- **`textTTS`:** מה שמועבר ל-`speak()` — לעיתים שונה מ-`text` (לדוגמה כדי לתקן הגייה)
- **`altText`:** לאלמנט-ויזואלי

### מילון אסור-בקריינות-לילד (Patch מ-Hebrew)
מילים שלא נכתוב בקריינות-לילד (אבל מותרות בטקסט-להורה):
`PIN, Drive, GitHub, OAuth, sync, Anthropic, AI, API, modal, modal, dashboard, log, password, login`

תרגומים-מותרים:
- PIN → "קוד-סודי" / "סיסמה"
- Drive → "מקום-השמירה" / "ענן"
- sync → "שמירה"

### גוף-שני יחיד vs זוגי (Patch מ-Hebrew)
- במצב חד-משתמש (פרופיל אחד נכנס) — **גוף-שני יחיד**: "תלחץ", "בוא ננסה".
- במצב הצגה-כללית (מסך-פתיחה לכלל-המשפחה) — זוגי: "בואו". 
- זיהוי-מגדר אופציונלי בפרופיל (m/f) — משפיע על "תלחץ"/"תלחצי".

---

## קבצים קריטיים להיווצרות

- [index.html](mouse-school/index.html) — `<html lang="he" dir="rtl">`, mount של `<div id="app">`, ייבוא של `src/app.js`
- [src/app.js](mouse-school/src/app.js) — בקר ראשי, ניתוב, מעבר בין משימות
- [src/audio.js](mouse-school/src/audio.js) — TTS עברי איטי + `speakOnHover`
- [src/storage.js](mouse-school/src/storage.js) — `getProfile()`, `saveProgress(profileId, taskId)`
- [src/ui/button.js](mouse-school/src/ui/button.js) — כפתור משותף עם hover-to-replay מובנה (קריטי — כל כפתור עובר דרכו)
- [src/templates/](mouse-school/src/templates/) — 8 תבניות-משחק
- [src/tasks/](mouse-school/src/tasks/) — 50+ נתוני-משימה
- [src/taskRegistry.js](mouse-school/src/taskRegistry.js) — סדר רץ של כל המשימות
- [src/welcome.js](mouse-school/src/welcome.js) — מסך פתיחה, מקים את ה-TTS אחרי הקליק הראשון
- [styles/global.css](mouse-school/styles/global.css) — RTL, פונט (Heebo מ-Google Fonts), צבעי בסיס

---

## שלבי בנייה מומלצים (סדר ביצוע)

הגישה: **שלד + תבנית אחת + 1–2 משימות → בדיקה עם הילדים → להחליט אם להמשיך.** לא בונים 50 משימות לפני שהתבנית הראשונה עובדת על ילד אמיתי.

### שלב 0 — תשתית פרויקט (יום 1, בוקר)
1. **`git clone` של הריפו** הקיים.
2. יצירת מבנה תיקיות בסיסי (`src/`, `styles/`, `assets/`, `docs/`, `.claude/skills/`, `scripts/`, **`design-mocks/`**).
3. כתיבת **CLAUDE.md** + **skill מותאם** `kids-game.md`.
4. אתחול 24 קבצי ה-MD ב-`docs/` עם תוכן התחלתי (כולל PROGRESS.md, PLAN-CONTROL.md, COUNCIL.md, RECOVERY.md עם הכותרות-הנכונות).
5. **יצירת 9 sub-agents ב-`.claude/agents/`** (8 חברי-מועצה + יו"ר).
5. **הקמת סנכרון git אוטומטי:** `scripts/git-sync.ps1` + הוספת hooks ל-`~/.claude/settings.json` + הרצת `scripts/install-task-scheduler.ps1`.
6. `.gitignore`, `README.md` בסיסי. (אין `vercel.json` ב-MVP)
7. **`design-mocks/shared/tokens.css`** — design tokens (צבעים, פונטים, spacing, motion) — יהיו הגלעין שיועתק אחר כך ל-`styles/global.css`.
8. **`scripts/check-contrast.js`** — בדיקה אוטומטית של ניגודיות על tokens.
9. commit ראשון: "init: project scaffolding + docs + auto-sync + design tokens".

### שלב 0.5 — עיצוב מוקאפים לפני קוד אמיתי (יום 1–2)
**עיקרון: כל מסך חדש מתחיל כ-HTML mockup ב-`design-mocks/`.** רק אחרי שהמוקאפ נראה טוב — אני בונה אותו "באמת" ב-`src/`.

1. **מוקאפים 01–05** (welcome, profile-select, profile-create, pin-entry, pin-wrong) — לפני שלב 1.
2. **מוקאפים 11–13** (task-click-balloons, success-celebration) — לפני שלב 2.
3. **מוקאפ 06** (parent-dashboard) — לפני שלב 1 (יש בו PIN entry שצריך מסך).
4. **מוקאפ 09** (first-run wizard) — לפני סיום שלב 1.
5. **מוקאפ 10** (world-map) — לפני שלב 3.
6. **מוקאפ 08** (Drive setup wizard) — לפני שלב 4 ב-MVP.
7. **מוקאפ 07** (AI generator modal) — **רק ב-Phase 2** אם נחליט לבנות.

המוקאפים נשארים בריפו לתיעוד עתידי וכרפרנס אם רוצים לעצב מחדש מסך.

**Canva handoff (אופציונלי):** אחרי שהמוקאפים מוכנים, אם ההורה רוצה לראות אותם בכלי שיתוף — אפשר להעלות לCanva דרך ה-MCP ולשתף לינק. לא חובה.

### שלב 1 — שלד מערכת + פרופילים (יום 1, אחה"צ — יום 2 בוקר)
- `index.html` + `app.js` + `audio.js` (כולל `speakOnHover`) + `storage.js` + `profiles.js` + `photo-store.js`
- `src/ui/button.js` עם hover-to-replay מובנה — **גם על שמות פרופילים, לא רק כפתורים**
- `src/ui/photo-uploader.js` — העלאת תמונה, crop, שמירה ב-IndexedDB
- מסך פתיחה: כרטיסי-פרופיל עם אווטאר/תמונה, hover על שם = הקראת השם
- **מבחן הצלחה:** קריינות עברית איטית עובדת, hover על שם פרופיל מקריא את השם, יצירת פרופיל עם תמונה אמיתית נשמרת ועובדת אחרי רענון.

### שלב 2 — תבנית ראשונה + ווריאציות (יום 2, אחה"צ)
- `templates/click-targets.js` עם תמיכת ווריאציות (themes bank).
- 2 משימות: אחת קבועה ("בלונים") ואחת רנדומית (סורקת מ-themes).
- **בדיקה עם הילדים** — תיעוד התובנות ב-`docs/KIDS-FEEDBACK.md`.
- תיקון לפי משוב.

### שלב 3 — שאר תבניות העכבר (ימים 3–4)
`hover-target`, `double-click-reveal`, `right-click-menu`, `drag-drop-match` — כל אחת עם themes-bank + 2 משימות. בסוף הבלוק יש ~12 משימות × ~5 ווריאציות = ~60 חוויות שונות.

### שלב 4 — PowerShell Launcher + Drive Sync (יום 5)
- **`scripts/start-chachmoni.ps1`** — שרת-מקומי + פותח Chrome.
- **`src/sync/drive-auth.js`** + **`src/sync/drive-sync.js`** — OAuth + upload/download של 2 קבצים פר-ילד.
- **`src/sync/sync-status.js`** — אינדיקטור-סנכרון בפינה.
- **ההורה: הקמת OAuth Client ב-Google Cloud Console** (~30 דקות) — הוראה מפורטת עם צילומי-מסך ב-`docs/DEPLOY.md`.
- **מבחן הצלחה:** התחברות ל-Drive, התקדמות של יואב נשמרת ב-`progress-yoav.json`, של מיה ב-`progress-mia.json`, רענון דפדפן → ייבוא אוטומטי.

### שלב 5 — תבניות מקלדת (ימים 6–7)
`key-press`, `type-word` — דורש זיהוי `keydown` ויזואליזציה של מקלדת על המסך.

### שלב 6 — תבנית `point-and-narrate` (יום 8)
לעולמות 3+4 (חלון, דפדפן, מושגים).

### שלב 7 — השלמת התוכן ל-50 משימות (ימים 9–10)
בעיקר עבודת data. כל משימה נכתבת ל-`docs/CONTENT.md` + `docs/NARRATION.md`.

### שלב 8 — ליטוש (יום 11)
אנימציות, צלילים, מד התקדמות, נעילות, מסך הישגי-סיום, אופטימיזציה.

### שלב 9 — אריזה ומסירה (יום 11)
- ייצור **כפתור "Export Data"** במסך-הגדרות → מוריד `chachmoni-backup-YYYY-MM-DD.json` ל-Downloads.
- ייצור **כפתור "Import Data"** → File input → מעלה JSON חזרה.
- **הרצת `scripts/install-shortcut.ps1`** — מייצר קיצור-דרך "חכמוני" בשולחן-העבודה של המחשב המשפחתי. הקיצור מצביע ל-`start-chachmoni.ps1` עם אייקון favicon.
- כתיבת `docs/PARENT-GUIDE.md` עם הוראות-הפעלה.
- בדיקה מקצה-לקצה: לחיצה על אייקון בשולחן-העבודה → המשחק נפתח → משחק → סנכרון Drive → Export ידני.
- **🎉 MVP חי בבית! הילדים יכולים לשחק.**

**סה"כ MVP: ~11 ימי עבודה.**

---

### Phase 2 — תוספות אופציונליות (אחרי MVP)

לא חלק מ-MVP. מבצעים רק אם וכשיש צורך/רצון, **אחרי** שה-MVP רץ בבית ויש משוב מהילדים.

- **שלב P2.1 (אופציונלי) — גנרטור AI:** רק אם המשפחה רוצה תוכן מעבר ל-250 חוויות הבסיסיות. דורש Anthropic API key. בנייה: יום אחד.
- **שלב P2.2 (אופציונלי) — עולמות 5–8:** יצירה, לוגיקה, בטיחות, מדיה. +28 משימות. בנייה: 3–4 ימים.
- **שלב P2.3 (אופציונלי) — הקלטות-TTS מוקלטות-מראש:** רק אם מתברר שהילדים משתמשים בדפדפן בלי קול עברי. בנייה: ½ יום (סקריפט) + 1 יום (הקלטה).
- **שלב P2.4 (אופציונלי) — Vercel hosting:** אם בעתיד נרצה לאפשר שחיקה ממחשבים אחרים (סבא-סבתא, טאבלט). דורש שינויי OAuth קל. בנייה: ½ יום.

**עיקרון רוחבי:** הסנכרון האוטומטי דואג ש-`git push` קורה לבד. אחרי כל באג — עדכון `docs/ISSUES.md`. אחרי כל החלטה משמעותית — `docs/DECISIONS.md`. אחרי כל משימה גמורה — סימון ב-`docs/TASKS.md`.

---

## מה ההורה צריך לעשות בעצמו — Pre-Flight Checklist

רוב הפיתוח אני עושה לבד. אבל יש 5 רגעים שבהם **רק ההורה יכול לפעול** — דרושים חשבונות, סיסמאות, אישורים. הנה הרשימה לפי-סדר:

### 1. הפעם הראשונה — הכנת חשבונות (לפני שלב 0)
**מתי:** **עכשיו, פעם אחת, ~5 דקות.** מומלץ לעשות **לפני** שמתחילים את שלב 0.

- ✅ חשבון GitHub — כבר יש (`Moti316`)
- ✅ חשבון Google — כבר יש (`motilev8@gmail.com`). **נדרש ב-MVP ל-Drive sync** + Phase 2.
- ⚪ חשבון Vercel — **לא נדרש ב-MVP (גישת Local-only).** ידולג.
- ⚪ חשבון Anthropic — **לא נדרש ב-MVP.** Phase 2.
- ⚪ Canva — יש (לבריפי-עיצוב)

### 2. הגדרת קיצור-דרך — בשלב 9 (אריזה)
**מתי:** ביום 11 (השלב האחרון של MVP). ~5 דקות.

המשחק רץ Local-only, לכן אין "דפלוי" — רק יצירת קיצור-דרך נוח על שולחן-העבודה של המחשב המשפחתי:

1. נווט אל תיקיית הפרויקט: `C:\Users\b0066820\Interactive-educational-game`
2. לחיצה-ימנית על `index.html` → "Send to" → "Desktop (create shortcut)"
3. על שולחן-העבודה: לחיצה-ימנית על הקיצור החדש → "Properties" → שינוי-שם ל"חכמוני"
4. (אופציונלי) "Change Icon" → `assets/icons/favicon.ico` כדי שהקיצור יראה את הלוגו של חכמוני
5. בדיקה: לחיצה-כפולה → המשחק נפתח ב-Chrome.

**זה הכל. הילדים מקבלים אייקון על שולחן-העבודה — לוחצים — משחקים.**

### 3. הגדרת Google Drive OAuth — **לפני שלב 4 ב-MVP**
**מתי:** ביום 5 בפיתוח. ~30 דקות, חד-פעמית.

זוהי הפעם היחידה ב-MVP שדורשת מההורה לעשות עבודה טכנית מסוימת. אני אדריך צעד-צעד עם צילומי-מסך ב-`docs/DEPLOY.md` ברגע שנגיע לשלב.

**הצעדים בכותרות (פירוט מלא ב-DEPLOY.md):**
1. כניסה ל-`console.cloud.google.com`
2. "New Project" → שם: `chachmoni`
3. "APIs & Services" → "Library" → חיפוש "Google Drive API" → Enable
4. "Credentials" → "Create OAuth Client ID":
   - Type: **Web Application**
   - Name: `Chachmoni Game`
   - Authorized JavaScript origins: `http://localhost:8080`
   - Authorized redirect URIs: `http://localhost:8080`
5. תקבל **Client ID** ארוך
6. תפעיל את חכמוני, תיכנס להגדרות → "Drive Backup" → תדביק את ה-Client ID
7. ❤️ סנכרון אוטומטי פעיל

**הגנת-אבטחה:** ה-OAuth scope שאני מבקש הוא `drive.file` בלבד — האפליקציה רואה ויוצרת רק קבצים שהיא עצמה יצרה. **אין לה גישה ליתר ה-Drive שלך.**

**מה הדרך הזו דורשת ממך בפועל (כשתחליט לעשות):**

1. כניסה ל-`console.cloud.google.com`
2. "New Project" → שם: `chachmoni`
3. "APIs & Services" → "Enable APIs" → חיפוש "Google Drive API" → Enable
4. "Credentials" → "Create OAuth Client ID":
   - Type: **Web Application**
   - Name: `Chachmoni Game`
   - Authorized JavaScript origins: `http://localhost:8080` (הפורט של PowerShell Launcher)
5. "Create" → תקבל **Client ID** (מחרוזת ארוכה).
6. תעתיק את ה-Client ID ותדביק במשחק (מסך-ההגדרות → "הגדרת גיבוי" → "הדבק Client ID").

**אני אכתוב לך הוראות מפורטות עם צילומי-מסך ב-`docs/DEPLOY.md` כשנגיע לשלב הזה.** במידה ותחליט לדחות — אין שום השפעה על MVP, פשוט הכפתור "הגדרת גיבוי" יציג "Drive sync disabled — לחץ כדי להפעיל".

### 4. הגדרת Anthropic API — **לא חובה, רק ב-Phase 2 אם נרצה**
**מתי:** רק אחרי שה-MVP חי וההורה רוצה תוכן AI נוסף. ~5 דקות, חד-פעמית.

- כניסה ל-`console.anthropic.com`
- יצירת API key
- הגדרת **billing cap** של $5/חודש (חובה!) ב-Settings → Plans & billing
- הדבקת ה-key במסך-ההגדרות של חכמוני

**ב-MVP זה לא רץ.** אפילו אם תהיה לי הצעה ל-feature שמשתמש ב-AI ב-Phase 1, אעדיף להוריד אותו ולעשות בלי.

### 5. בדיקות עם הילדים — תוך כדי פיתוח
**מתי:** כל אחרי-שלב משמעותי. ~15 דקות לבדיקה.

- אני נותן לך ה"מסך-בדיקה" כקובץ HTML מקומי או דרך URL.
- אתה מושיב את הילד מולו ו**לא מדבר** — רק צופה.
- אתה רושם ב-`docs/KIDS-FEEDBACK.md`: מה הילד עשה, איפה נתקע, מה אמר.
- אני מעדכן את התכנון לפי המשוב.

---

## סיכום הצירים — מי עושה מה

| הצי שלי (Claude Code) | הצי שלך (ההורה) |
|------------------------|------------------|
| כתיבת כל הקוד | יצירת קיצור-דרך בשולחן-העבודה (פעם) |
| יצירת מבנה תיקיות | יצירת OAuth client *רק אם רוצים sync* |
| כתיבת 50 משימות-data | בדיקה עם הילדים אחרי כל שלב |
| design-mocks ב-HTML | העתקה של briefs ל-Claude Design (אופציונלי) |
| הגדרת git auto-sync | תיעוד הערות-הילדים ב-`docs/KIDS-FEEDBACK.md` |
| כתיבת ה-MD documentation | בחירה בין A/B עיצובים |
| אריזה (Export/Import + קיצור-דרך) | אישור-סופי לפני מסירה לילדים |

---

## פערים שזיהיתי בסקירה אחרונה — תיקונים חיוניים

### 1. ניהול-גרסאות של data (Schema Migration)

**הבעיה:** מה קורה אם בעתיד נשנה את מבנה ה-localStorage (למשל נוסיף שדה חדש לפרופיל)? נתוני-הילדים הישנים יישברו.

**הפתרון (יבנה ב-MVP):** כל אובייקט-data כולל `schemaVersion`. ב-`src/storage.js` יש פונקצית-migration שמזהה גרסה ישנה ומעדכנת אותה אוטומטית:
```js
const MIGRATIONS = {
  1: (data) => ({ ...data, schemaVersion: 2, newField: defaultValue }),
  2: (data) => ({ ...data, schemaVersion: 3, /* ... */ })
};
```

### 2. בדיקת תאימות-דפדפן בכניסה ראשונה

**הבעיה:** אם הילד פותח בדפדפן לא-תקין (ישן, ללא Web Speech, ללא IndexedDB) — קריסה שקטה.

**הפתרון:** קובץ `src/browser-check.js` שבודק בעלייה: Web Speech, IndexedDB, localStorage, ES Modules. אם משהו חסר → מסך-הוראה ידידותי להורה: "פתח בChrome 100+".

### 3. נעילת-תפריטים של דפדפן (Kid-Proof Browser)

**הבעיה:** ילד עשוי להקיש Ctrl+P (הדפסה), F12 (DevTools), קליק-ימני (Inspect Element) — חוויות מבלבלות.

**הפתרון (ב-MVP):**
```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'F12' || (e.ctrlKey && (e.key === 'p' || e.key === 's'))) {
    e.preventDefault();
  }
});
document.addEventListener('contextmenu', (e) => e.preventDefault());
```
**חוץ** ממשימות שכן רוצים right-click (משימה 13-14 — תפריט-קסם).

### 4. ניקוי-זיכרון בין משימות (Memory Management)

**הבעיה:** משחק של 30+ דקות מצטבר event-listeners ו-DOM nodes. דליפת-זיכרון.

**הפתרון:** **כל תבנית מחזירה פונקציית-cleanup** מ-`mount(container, onComplete)`:
```js
mount(container, onComplete) {
  const handlers = [];
  // ... setup
  return () => {
    handlers.forEach(({el, ev, fn}) => el.removeEventListener(ev, fn));
    container.innerHTML = '';
  };
}
```
ה-`app.js` קורא ל-cleanup לפני כל מעבר-מסך.

### 5. תגובת-resize של החלון

**הבעיה:** אבא מקטין את החלון באמצע משחק — האלמנטים נשברים.

**הפתרון:** CSS responsive עם `clamp()` + breakpoints מינימליים. **גודל-חלון מינימלי: 1024×600** — אם פחות, מסך-שגיאה: "המסך קטן מדי, הגדל את החלון".

### 6. אסטרטגיית-גרסאות + Rollback

**הבעיה:** באג חמור מגיע למחשב-הילדים, איך חוזרים?

**הפתרון:**
- **תיוג גרסאות:** `git tag v1.0`, `v1.1` בכל שחרור משמעותי. CHANGELOG.md מתעד.
- **Rollback בידי ההורה:** קובץ `scripts/rollback.ps1` שמאפשר `rollback.ps1 v1.0` → `git reset --hard v1.0`. דרך מסך-ההגדרות → "Restore Previous Version".
- **בדיקה לפני שחרור:** אסור push ל-`main` בלי שעבר את ה-QA checklist (`docs/TESTING.md`).

### 7. תקצוב-ביצועים (Performance Budget)

**הבעיה:** ככל שהמשחק גדל, הוא מאט. אין מד.

**הפתרון:** יעדים מפורשים:
- **First Contentful Paint:** < 1 שנייה ב-localhost
- **Time to Interactive:** < 2 שניות
- **Bundle size (אם נצטרך):** < 500KB סך-הכל
- **Memory after 30min play:** < 100MB

נמדד ב-DevTools Performance + Lighthouse. רשום ב-`docs/PERFORMANCE.md` — קובץ MD חדש 20.

### 8. מצב-דמו / טסט (Demo Mode)

**הבעיה:** אבא רוצה לבדוק משימה בלי לדפוק את הסטטיסטיקה של הילד.

**הפתרון:** במסך-הגדרות → "מצב דמו" → יוצר פרופיל זמני בשם "DEMO" בצבע אפור. כל פעולה תחת DEMO לא נשמרת ל-Drive ולא נספרת לכוכבים-אמיתיים.

---

## אסטרטגיית-מודלים — חיסכון טוקנים + ביצועים

הצעה מצוינת שלך. ב-Claude Code אפשר להחליף מודלים פר-משימה. הצעת-חלוקה:

### חלוקה אופטימלית למודלים

| משימה | מודל מומלץ | למה |
|--------|-------------|-----|
| **תכנון-ארכיטקטוני, החלטות-עיצוב, debugging מורכב** | **Opus 4.7** | יקר אבל הכי-חכם. נחוץ למה שעשינו עכשיו |
| **קוד יומיומי (כתיבת קומפוננטות, templates, סקריפטים)** | **Sonnet 4.6** | זול פי-3 מ-Opus, מספיק טוב לעיקר העבודה |
| **כתיבה מסיבית של data-files (50 משימות)** | **Haiku 4.5** | זול מאוד, מהיר, מצוין לעבודה חוזרת-נשנית |
| **סקירת-קוד (review skill)** | **Sonnet 4.6** | טוב לבדיקת-עקביות |
| **security-review** | **Opus 4.7** | חשיבה-מעמיקה לאיתור-פגיעות |
| **AI generator ב-Phase 2 (runtime)** | **Haiku 4.5-20251001** | זול, מהיר. כבר תוכנן |
| **כתיבת documentation (MD files)** | **Sonnet 4.6** | מספיק |

### זרימת-עבודה מומלצת

```
שלב 0 (תשתית)           ⇒ Sonnet 4.6
שלב 0.5 (mockups)        ⇒ Opus 4.7 (החלטות עיצוב) + Sonnet 4.6 (HTML)
שלב 1 (שלד + פרופילים)   ⇒ Opus 4.7 (ארכיטקטורה) + Sonnet 4.6 (מימוש)
שלב 2 (תבנית ראשונה)    ⇒ Opus 4.7 (תבנית) + Sonnet 4.6 (משימות)
שלבים 3–6 (בנייה רגילה) ⇒ Sonnet 4.6
שלב 7 (50 משימות data)  ⇒ Haiku 4.5 (יצירה המונית) + Sonnet 4.6 (בדיקה)
שלב 8 (ליטוש)           ⇒ Sonnet 4.6 + Opus 4.7 לאופטימיזציות
שלב 9 (אריזה)           ⇒ Sonnet 4.6
```

### איך מחליפים מודל ב-Claude Code

- פקודה: `/model` או `/fast` (Opus 4.7 מהיר)
- אפשר גם להגדיר ב-`.claude/settings.json`:
```json
{
  "model": "claude-sonnet-4-6"
}
```
- **המלצה שלי:** התחל כל סשן עם המודל המתאים לסוג-העבודה. אם בסוף משימה אתה רואה שזה מסובך — לעבור ל-Opus.

### הערכת חיסכון

הערכת-עלות לפיתוח MVP מלא (לפי 11 ימי עבודה, ~4 שעות-Claude ביום):

| תרחיש | עלות-משוערת |
|--------|--------------|
| הכל ב-Opus 4.7 (אסור — מטורף יקר) | ~$400+ |
| Opus לתכנון, Sonnet לקוד, Haiku ל-data | **~$80–120** |
| הכל ב-Sonnet (חיסכון מוקצב) | ~$50 |

ההצעה שלי: **חלוקה דינמית** — חיסכון של 70% בלי לוותר על איכות בנקודות-קריטיות.

---

## QA Patches מהמועצה — תוכן TESTING.md ו-RECOVERY.md

### `docs/TESTING.md` — פרוטוקול בדיקות עם ילדים

הקובץ הזה לא נשאר ריק. יקבל תוכן-מינימלי לפני שלב 1:

```markdown
# Testing Protocol — חכמוני

## פרוטוקול-בדיקה עם ילד (15 דק' מקסימום)

### לפני הסשן
1. ההורה לא מתערב — צופה בלבד (זה הכי קשה!)
2. מכין סטופר + פתקית-תיעוד
3. וידוא: רק 3 משימות-לסשן (לא יותר)
4. הילד יודע: "אם אין לך כיף, אפשר לסגור"

### בזמן הסשן
- רושם זמן-עד-שהילד הבין את ההוראה (מתחילת-קריינות עד תחילת-פעולה)
- רושם כל "אמירה" של הילד (חיובית או שלילית)
- רושם נקודות-תקיעה (לפחות 5ש' בלי פעולה)
- **לא לעזור** — גם אם הילד מבקש. רק לזכור.

### אינדיקטורי-מצוקה (לעצור מיד)
1. **פאניקה** — נשיפות-מהירות, אצבעות-קפוצות
2. **ויתור** — "אני לא רוצה" אחרי 2 ניסיונות
3. **שעמום** — מסתכל על המסך 30ש' בלי פעולה
4. **בלבול** — מסביר משהו שונה ממה שקורה
5. **פחד** — בורח מהמסך, מבקש לסגור

### אחרי הסשן
- פותח `docs/KIDS-FEEDBACK.md` ומתעד:
  - תאריך + גיל הילד + שעת-יום
  - 3 משימות שנבדקו
  - זמן-עד-הבנה לכל אחת
  - נקודות-תקיעה + מה הילד אמר
  - הרגש-הכללי (חיובי/ניטרלי/שלילי)
- מקסימום 3 פסקאות. אם יותר — מסכמים.

## Smoke Tests (Playwright)
ראה `tests/smoke/`. כל push ל-`main` מריץ אוטומטית.

## Schema Migration Tests
ב-`tests/fixtures/` יש JSON snapshots של v1, v2, etc.
ב-`tests/migration.spec.js` רץ migration על כל fixture.

## Browser Compatibility Test
לפני MVP-release: פתיחה ידנית ב-Chrome 100+ ב-Windows.

## Council Effectiveness Metric
לכל שלב, ספירת:
- bugs-caught-by-council
- bugs-found-by-kids-later
- ratio תהיה > 5:1 בשלבים 3+. אם פחות — לבדוק אם המועצה מועילה.
```

### `docs/RECOVERY.md` — Runbook לתרחישי-משבר

```markdown
# Recovery Runbook — חכמוני

## תרחיש 1: ההורה שכח PIN
1. **פתח מצב-ילד.** במסך-בחירת-פרופיל לחץ על אייקון-⚙ → "שכחתי PIN"
2. **השב על שאלת-recovery** (שם החיה הראשונה שבחר ילדך)
3. אם גם זה לא — הזן URL: `chachmoni.app/?reset-pin=parent-emergency`
4. אם גם זה לא — `localStorage.removeItem('chachmoni:pin')` ב-DevTools (אבל זה דורש Chrome+F12)

## תרחיש 2: נתוני-ילד נמחקו ב-Drive בטעות
1. **פתח Google Drive** → תיקיית "חכמוני" → סל-המיחזור
2. **בלחיצה-ימנית על הקובץ** → "Restore"
3. **אם עברו 30 יום** — לקבצים שבסל-המיחזור — אבדנו. השתמש ב-backup-אחרון מ-`backups/` באותה תיקייה.

## תרחיש 3: localStorage נמחק (פרופיל-Windows חדש)
1. במחשב-החדש, התקן את הריפו (`git clone ...`)
2. בפתיחה-ראשונה של המשחק, יוצג מסך "מצאנו גיבוי קודם, להעלות?"
3. אם לא רואים מסך כזה — וודא שChrome מחובר לאותו חשבון-Google.

## תרחיש 4: Migration נכשלה (data corrupted)
1. **אל תיבהל!** ה-backup קיים ב-IndexedDB.
2. פתח DevTools → Application → IndexedDB → `migrations-backup` → ראה גרסה אחרונה.
3. הרץ ידנית `restoreFromMigrationBackup()` ב-Console.

## תרחיש 5: PowerShell Launcher לא נפתח
1. **שגיאת firewall** — Windows Defender חוסם. אישור ידני בעת prompt.
2. **port-collision** — סקריפט עובר אוטומטית ל-8081, 8082...
3. **PowerShell Execution Policy** — הרץ פעם אחת: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

## תרחיש 6: Chrome עוצר את autoplay של קריינות
1. כתובת-Chrome: `chrome://settings/content/sound` → אישור chachmoni
2. או: `chrome://flags/#autoplay-policy` → "No user gesture required"

## טלפון-חירום
אם משהו ממש שבור — `docs/ISSUES.md` (פתח issue).
```

### Lighthouse CI Script (Patch מ-Performance + QA)

```powershell
# scripts/audit.ps1
# מריץ Lighthouse על localhost:8080 ומשווה ל-budgets
$results = lighthouse http://localhost:8080 --output=json --quiet
$fcp = $results.audits.'first-contentful-paint'.numericValue
if ($fcp -gt 1000) { Write-Error "FCP $fcp ms > 1000ms budget" }
# בנוסף: TTI, accessibility score, best-practices score
```

ירוץ בכל push ב-GitHub Actions (.github/workflows/audit.yml).

---

## Integration Patches מהמועצה

### Template Cleanup Enforcement (Patch מ-Integration)

החוזה `mount(container, onComplete) → cleanup` חייב להיאכף ב-runtime:

```js
// app.js
async function startTask(taskId) {
  const task = await loadTask(taskId);
  const instance = task.build();
  const cleanup = instance.mount(container, onComplete);

  // ⚠️ Patch: אכיפת חוזה — חובה להחזיר function
  if (typeof cleanup !== 'function') {
    console.error(`Template ${task.id} did not return cleanup`);
    // Fallback automatic cleanup
    return () => { container.innerHTML = ''; };
  }
  return cleanup;
}
```

### TaskResolver — שילוב משימות-מקוריות + AI (Patch מ-Integration)

```js
// src/taskRegistry.js
const STATIC_TASKS = [...];  // 50 משימות מקוריות
function getAllTasks(profile) {
  return [
    ...STATIC_TASKS,
    ...(profile.customTasks || []).map(t => ({ ...t, source: 'ai' }))
  ];
}
```

**completedTaskIds[] משתמש בפיענוח דרך getAllTasks() — לא breaks אם משימת-AI נוספת באמצע.**

### Per-Profile Sync Queues (Patch מ-Integration)

במקום queue אחד גלובלי, queue פר-פרופיל:

```js
// src/sync/drive-sync.js
const syncQueues = new Map();  // profileId → Queue

function enqueueSync(profileId, data) {
  if (!syncQueues.has(profileId)) {
    syncQueues.set(profileId, new SyncQueue(profileId));
  }
  syncQueues.get(profileId).enqueue(data);
}
```

**יתרון:** אם sync של פרופיל-1 נכשל, פרופיל-2 לא נחסם.

### Schema Migration עם Backup (Patch מ-Integration + QA)

```js
// src/storage.js
async function migrate(data, fromVersion, toVersion) {
  // 1. Backup הנתונים הנוכחיים ל-IndexedDB לפני migration
  await indexedDB.put('migrations-backup', {
    version: fromVersion,
    timestamp: Date.now(),
    data: structuredClone(data)
  });
  
  // 2. הרצת migrations
  let current = data;
  for (let v = fromVersion; v < toVersion; v++) {
    current = MIGRATIONS[v](current);
  }
  return current;
}
```

**אם migration נכשל — שחזור מ-backup אוטומטי. אין אובדן-נתונים.**

### Audio Gating — User Gesture Required (Patch מ-Integration)

```js
// src/audio.js
let audioReady = false;

// listener גלובלי לקליק-ראשון
document.addEventListener('click', () => { audioReady = true; }, { once: true });

export function speak(text) {
  if (!audioReady) {
    // queue ל-after-first-click
    pendingUtterances.push({ text, queuedAt: Date.now() });
    return;
  }
  // ... regular speak
}
```

**מונע באג: hover על כפתור לפני הקליק-הראשון לא מנסה לקרוא ונכשל.**

---

## State Machine של app.js (Patch מ-Code-Review)

במקום logic-scattered של מעברי-מסכים, בקר-מרכזי מבוסס state-machine:

```js
// src/app.js
const STATES = {
  BOOT: 'boot',                    // טעינה ראשונית, browser check
  FIRST_RUN: 'first-run',          // ויזרד פעם-ראשונה
  GUEST: 'guest',                  // מצב-אורח (Patch מ-UX-Kid)
  PROFILE_SELECT: 'profile-select',
  PROFILE_CREATE: 'profile-create',
  PIN_ENTRY: 'pin-entry',
  PARENT_DASHBOARD: 'parent-dashboard',
  WORLD_MAP: 'world-map',
  TASK_LOADING: 'task-loading',    // dynamic import של template
  TASK_RUNNING: 'task-running',
  CELEBRATION: 'celebration',
  ERROR: 'error'                   // browser unsupported, etc.
};

const TRANSITIONS = {
  BOOT: ['FIRST_RUN', 'PROFILE_SELECT', 'ERROR'],
  FIRST_RUN: ['GUEST', 'PROFILE_CREATE'],
  GUEST: ['PROFILE_SELECT', 'BOOT'],  // ילד-יוצא או לאחר משימה מוקדמת
  PROFILE_SELECT: ['WORLD_MAP', 'PROFILE_CREATE', 'PIN_ENTRY'],
  // ...
};

function transition(toState, payload = {}) {
  if (!TRANSITIONS[currentState].includes(toState)) {
    console.error(`Invalid transition: ${currentState} → ${toState}`);
    return;
  }
  cleanupCurrentScreen();
  currentState = toState;
  renderState(toState, payload);
}
```

**יתרון:** debug-קל, transitions-validated, אין-spaghetti-of-screens.

---

## Browser Fallback Strategy (Patch מ-Code-Review)

במקום "Chrome בלבד או crash" — מסך-הפניה ידידותי:

```js
// src/browser-check.js
const required = {
  speechSynthesis: !!window.speechSynthesis,
  indexedDB: !!window.indexedDB,
  webCrypto: !!(window.crypto && window.crypto.subtle),
  esModules: 'noModule' in document.createElement('script')
};

const missing = Object.entries(required)
  .filter(([k, v]) => !v)
  .map(([k]) => k);

if (missing.length > 0) {
  showBrowserUnsupportedScreen(missing);
  return;  // לא לטעון את המשחק
}
```

**מסך-הפניה לילד שלא-קורא:**
- אייקון-Chrome ענק במרכז
- צליל-קריינות: "בוא נפתח בכרום! קרא לאמא או אבא."
- כפתור-קריאה רם.

---

## Light Council כ-Default (Patch מ-Code-Review)

המלצת-המועצה: **Full Council = ברירת-מחדל**, Light Council אופציה לפי-בחירה.
המשתמש כבר אישר Full Council תחת Max subscription — נשארים עליו.

**Light Council ייכנס לפעולה רק אם:**
- שלב-הבנייה דורש < 2 שעות (תיקון-באג קטן, refactor)
- ההורה בלחץ-זמן

---

## Playwright Smoke Tests (Patch מ-Code-Review + QA)

בנוסף לבדיקות-ידניות, smoke-tests אוטומטיים:

```js
// tests/smoke/templates.spec.js
import { test, expect } from '@playwright/test';

test.describe('Template Smoke Tests', () => {
  test('click-targets template renders + completes', async ({ page }) => {
    await page.goto('http://localhost:8080/?testMode=true&task=click-balloons');
    await expect(page.locator('.task-target')).toHaveCount(5);
    // Click all 5
    for (let i = 0; i < 5; i++) await page.locator('.task-target').first().click();
    await expect(page.locator('.celebration')).toBeVisible();
  });
  // אותו דבר ל-7 templates נוספים
});
```

**8 smoke tests = הגנה זולה מרגרסיה. ירוצו אוטומטית ב-CI (GitHub Actions).**

---

## אסטרטגיית-ביצועים מפורטת (Patches מ-Performance Agent)

### Lazy Loading — חובה ב-MVP

ללא code-splitting, 50 templates + 50 tasks יוצרים bundle של ~500KB. הפתרון:

```js
// app.js — initial bundle ~50KB בלבד
// טוען רק: app.js, audio.js, welcome.js, profiles.js, ui/button.js

async function loadTemplate(templateName) {
  // dynamic import — נטען רק כשמתחילים משימה
  const module = await import(`./templates/${templateName}.js`);
  return module.default;
}

async function loadTask(taskId) {
  const [worldId, slug] = taskId.split('-', 2);
  const module = await import(`./tasks/${worldId}/${slug}.js`);
  return module.default;
}
```

**יעדי-bundle:**
- Initial: ≤ 80KB (app.js + audio.js + welcome.js + ui/button.js + tokens.css)
- Per-task: ≤ 50KB transferred (template + task data + dependencies)
- Total transferred ב-30 דק' משחק: ≤ 800KB

### IndexedDB עם Blob (לא base64)

```js
// photo-store.js — Patch מ-Performance
async function savePhoto(profileId, file) {
  // file הוא Blob ישירות (לא JSON.stringify של base64)
  const db = await openDB();
  return db.put('photos', { profileId, blob: file, timestamp: Date.now() });
}
```

**יתרון:** חוסך 33% מקום, מהיר פי-3 בקריאה, אין JSON.parse blocking the main thread.

### Font Loading Strategy

```html
<!-- ב-index.html, ב-<head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="font" type="font/woff2"
      href="https://fonts.gstatic.com/.../heebo.woff2" crossorigin>
<style>
  @font-face {
    font-family: 'Heebo';
    font-display: swap;  /* מציג fallback מיד, מחליף כשהפונט מוכן */
    src: local('Heebo'), url('https://fonts.gstatic.com/.../heebo.woff2');
  }
</style>
```

**Self-hosted fallback:** קופי-מקומית של הפונט ב-`assets/fonts/heebo.woff2` ב-Phase 2 (אם רוצים-offline).

### Canvas-based Confetti (לא DOM)

DOM-based confetti עם 20+ elements + transforms = max 30fps. מעבר ל-Canvas 2D = 60fps יציב גם עם 50+ חלקיקים.

```js
// celebration.js
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// 20 particles עם requestAnimationFrame, opacity, rotation
```

### requestIdleCallback ל-Drive sync

```js
// drive-sync.js — לא להריץ sync בזמן אנימציות
function scheduleSync(profileId, data) {
  requestIdleCallback(() => {
    drive.upload(`progress-${profileId}.json`, data);
  }, { timeout: 5000 });  // אחרי 5ש' רץ בכל-אופן
}
```

### Long-Task Observer (dev mode)

```js
// scripts/check-performance.js
if (process.env.NODE_ENV === 'dev') {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => {
      if (entry.duration > 50) console.warn(`Long task: ${entry.duration}ms`);
    });
  });
  observer.observe({ type: 'longtask', buffered: true });
}
```

### Async PowerShell HttpListener (Patch מ-Performance)

ה-default של HttpListener הוא single-threaded. אם 15+ קבצים נטענים במקביל — bottleneck. הפתרון: `BeginGetContext` async pattern.

```powershell
# start-chachmoni.ps1 — async pattern
$listener.BeginGetContext($asyncCallback, $listener)
# הקריאה לא חוסמת — קבצי-מקבילים נטענים במקביל
```

---

## אתגרים-צפויים בבנייה (Anticipated Challenges)

לפני שמתחילים, מצאתי 12 נקודות-תורפה אפשריות. לכל אחת — תוכנית-מענה.

### תשתית

| # | אתגר | סיכון | תוכנית-מענה |
|---|------|-------|-------------|
| 1 | **PowerShell HttpListener נחסם ע"י Windows Firewall** | בינוני | אם נחסם: הרשאה ידנית פר-משתמש (לא דורש אדמין). בדוק בשלב 0! |
| 2 | **port 8080 תפוס ע"י תוכנה אחרת** | נמוך | הסקריפט בודק port זמין, נופל אוטומטית ל-8081, 8082 וכו'. ב-OAuth: רושמים את כל הפורטים האפשריים |
| 3 | **ES Modules עם נתיבים יחסיים** | בינוני | להקפיד על `./` ב-imports. בדיקה: כל `import` חייב להתחיל ב-`./` או `/`. אוטומטית באמצעות ESLint config |
| 4 | **GitHub Auto-sync rebase conflict** | בינוני | כבר תוכנן: יצירת קובץ flag `.git/SYNC_CONFLICT`. הוספה: Slack/email notification אופציונלי |

### Drive Sync

| # | אתגר | סיכון | תוכנית-מענה |
|---|------|-------|-------------|
| 5 | **OAuth token פג באמצע משחק** | גבוה | כבר תוכנן: refresh שקט (`prompt: 'none'`). אם נכשל — toast להורה, אבל המשחק ממשיך |
| 6 | **Drive API rate-limit (1000 req/min)** | נמוך | exponential backoff. **הוספה:** debouncing — לא להעלות יותר מפעם ל-3 שניות, גם אם הילד מסיים 5 משימות במהירות |
| 7 | **Race condition: שני ילדים שומרים במקביל ב-2 חלונות-Chrome** | בינוני | **הוספה:** queue פנימי במקום promises מקבילים. רק סנכרון אחד בכל-עת, אחרים ממתינים |
| 8 | **קובץ ב-Drive נמחק ידנית ע"י ההורה** | נמוך | בעת sync: אם הקובץ לא קיים → יצירה מחדש מתוך localStorage. **אין אובדן-נתונים** |

### Web Speech API

| # | אתגר | סיכון | תוכנית-מענה |
|---|------|-------|-------------|
| 9 | **קול עברי לא זמין** | נמוך ב-Chrome | טוסט להורה "פתח ב-Chrome". טקסט עדיין מוצג. Phase 2: mp3 fallback |
| 10 | **קריינות מתחלפת באמצע (interrupt) — באג בכרום** | בינוני | קריאה ל-`speechSynthesis.cancel()` לפני כל `speak()` חדש. **הוספה:** queue של utterances עם state-machine, לא קריאות-בלתי-מוזמנות |

### תוכן וקוד

| # | אתגר | סיכון | תוכנית-מענה |
|---|------|-------|-------------|
| 11 | **תמונה אישית של ילד שוקלת 5MB+** | בינוני | crop וקומפרסיה אוטומטית ל-300×300 + JPEG quality 0.8 לפני שמירה. מקסימום ~50KB |
| 12 | **localStorage quota exceeded** (אם יש 20 פרופילים) | נמוך | quota בדפדפנים: 5–10MB. ה-photos עוברים ל-IndexedDB (50MB+). meta-data נשאר ב-localStorage |

### Multi-User (חדש)

| # | אתגר | סיכון | תוכנית-מענה |
|---|------|-------|-------------|
| 13 | **N פרופילים — UI מתפוצץ אחרי 6+** | בינוני | **תכנון-מתחילה:** scrolling אופקי במסך-הפתיחה (כמו carousel) — תומך בעד 20 פרופילים |
| 14 | **N פרופילים — Drive sync איטי (N קבצים)** | נמוך | סנכרון-עצל: רק הפרופיל-הפעיל מתעדכן. אחרים נטענים בעת-החלפה |
| 15 | **מחיקת פרופיל — הקובץ ב-Drive נשאר?** | נמוך | בעת מחיקה: גם מחיקת הקובץ ב-Drive (עם אישור-הורה). או הזזה ל-archived/ |

---

## אימות (Verification)

לאחר בניית כל תבנית/משימה:

1. **דפדפן מקומי**: פתיחת `index.html` ב-Chrome (קליק כפול על הקובץ או `npx serve` אם רוצים שרת מקומי).
2. **בדיקת קריינות**: לוודא שב-DevTools Console רואים את `speechSynthesis.getVoices()` מחזיר קול עברי, ושה-`rate` באמת איטי.
3. **בדיקת hover-to-replay**: עמידה 600ms על כפתור → קריינות מתחילה. הזזה מהירה → לא מקריא.
4. **בדיקת RTL**: טקסט יישור ימינה, כפתורי "המשך" בצד שמאל.
5. **בדיקת מולטי-פרופיל**: יצירת 3+ פרופילים, סיום משימה בכל אחד, וידוא שההתקדמות נפרדת ושכל פרופיל מקבל קובץ-Drive נפרד.
6. **בדיקת Google Drive sync**: התחברות → סיום משימה → בדיקה ב-Drive ש-`progress.json` עודכן. רענון דפדפן → התקדמות נטענה. במחשב שני: התחברות → הצעת יבוא.
7. **בדיקת GitHub flow**: שינוי קוד → push → pull במחשב אחר → אותו state.
8. **בדיקה עם הילדים** (החשובה ביותר): לתת לכל ילד לשחק לבד, לתעד ב-`docs/KIDS-FEEDBACK.md`.
9. **בדיקת קיצור-הדרך**: לחיצה-כפולה על אייקון "חכמוני" בשולחן-העבודה → המשחק נפתח ב-Chrome → עובד מקצה-לקצה.

---

## מה לא בתכנון הזה (במכוון)

- **אין מערכת חשבונות / login לילדים** — פרופילים מקומיים עם אווטאר. ה-OAuth של Google הוא של ההורה בלבד, לסנכרון.
- **אין backend / DB משלנו** — localStorage + Google Drive של ההורה.
- **אין תמיכה במובייל/טאצ'** — נשמר למשחק עתידי, היום המטרה היא לימוד עכבר.
- **אין אנגלית** — שפה אחת = פחות באגים, פחות מסכי הגדרות שיבלבלו ילד.
- **אין עורך משימות גרפי** — להוסיף משימה = ליצור קובץ JS קטן ב-`src/tasks/`. ראה `docs/HOW-TO-ADD-TASK.md`.
- **אין end-to-end encryption לגיבוי** — Google Drive scope של `drive.file` כבר מספק בידוד מהקבצים האחרים של ההורה. הקובץ עצמו לא מוצפן (אין מידע רגיש מלבד שמות הילדים והתקדמות).
- **אין CI tests אוטומטיים בשלב הראשון** — הפרויקט קטן ופשוט מספיק; בדיקות ידניות + בדיקה עם הילדים מספיקות לגרסה הראשונה. אם יגדל — נוסיף Playwright.

---

## סיכום מהיר של מה שמתוכנן

**שם:** חכמוני 🦉
**יעד:** ילדי 4–6 שעדיין לא קוראים, ב-Chrome על Windows.

### תכונות
- Vanilla HTML/JS, RTL עברי, **Local + PowerShell Launcher** (שרת-מקומי על `localhost:8080`, אין אירוח באינטרנט פומבי).
- **50 משימות ב-MVP** (+28 משימות ב-Phase 2 ⇒ 78 בסך-הכל). ווריאציות רנדומיות + גנרטור AI אופציונלי ב-Phase 2.
- **Voice-first מלא** — קריינות עברית איטית (rate 0.75) על כל טקסט, hover-to-replay בכל אלמנט-טקסט.
- TTS fallback ע"י ~75 הקלטות-mp3 (Gemini TTS / ElevenLabs) — **Phase 2 בלבד**, רק אם נצטרך.
- פרופילים מקומיים עם אווטאר מאויר (Gemini-generated) **או תמונה אמיתית** של הילד.
- הקראת שם הילד ב-hover על כרטיס הפרופיל.
- חוויית פעם-ראשונה: ויזרד 5-מסכים עם דמות-מורה "פרופ' חכמוני".
- מסך הורה נגיש דרך PIN של 4 ספרות (hash ב-localStorage).

### תשתית
- **PowerShell Launcher** — קיצור-דרך בשולחן-העבודה ⇒ שרת `localhost:8080` ⇒ Chrome.
- **Google Drive sync אוטומטי** ב-MVP: גיבוי **פר-ילד** (`progress-yoav.json` נפרד מ-`progress-mia.json`). OAuth scope: `drive.file` בלבד. 7 backups history.
- **Export/Import ידני** JSON כתוספת.
- סנכרון GitHub דו-כיווני (Task Scheduler כל שעה + Claude Code hooks).
- ריפו: `https://github.com/Moti316/Interactive-educational-game`

### תיעוד וכלים
- **24 קבצי MD** ב-`docs/` שמתעדכנים תוך כדי עבודה (כולל 10 חדשים: PARENT-GUIDE, CHANGELOG, CLAUDE-DESIGN-BRIEFS, TESTING, STYLE-GUIDE, PERFORMANCE, **PROGRESS** (Master Dashboard), **PLAN-CONTROL** (בקרת-שינויים), **COUNCIL** (דוחות-מועצה), **RECOVERY** (Disaster Recovery)).
- **CLAUDE.md** + **5 skills מותאמים-לפרויקט**: `kids-game.md` (כללי), `kids-qa.md` (QA), `security-kids.md` (אבטחה), `hebrew-narration.md` (קריינות), `animation-choreography.md` (אנימציות).
- **Skills מובנים בעת-צורך**: `security-review`, `review`, `simplify`, `design`, `ui-ux-pro-max`, `design-system`, `claude-api`, `fewer-permission-prompts`, `update-config`.
- **🏛️ High Council** — 8 sub-agents + יו"ר שמאשרים כל שלב לפני המעבר הבא (`agent-qa`, `agent-security`, `agent-ux-kid`, `agent-a11y`, `agent-hebrew`, `agent-performance`, `agent-code-review`, `agent-integration`).
- **📋 Plan Control** — `docs/PLAN-CONTROL.md` מתעד כל שינוי-תכנון עם בדיקת-עקביות.

### עיצוב
- **HTML mockups ב-`design-mocks/`** — כל מסך מעוצב לפני שכותבים אותו "אמיתי".
- **Design tokens** ב-`design-mocks/shared/tokens.css` — צבעים, פונטים, spacing, motion. מקור-אמת לעיצוב.
- **Canva MCP** מחובר — אופציה להעלות מוקאפים ל-Canva לאישור-הורה.
- **Gemini 3.1 Pro Image** — ליצירת אווטארים, דמות-מורה, לוגו, פאוויקון.
- **מפרט אנימציות מלא** — easing, durations, choreography של celebrations.
- **Sound design palette** — UI sounds + game sounds + voice + ambient (4 רבדים).
- **נגישות WCAG AA** + `prefers-reduced-motion` + colorblind-safe + ניגודיות-גבוהה אופציונלית.

### זמן פיתוח משוער
- **גרסה שמיש מקומית (~12 משימות)**: 4 ימי עבודה.
- **MVP מלא (50 משימות + Drive sync פר-ילד + Export/Import)**: **~11 ימי עבודה** (לא רצופים).
- **Phase 2 — תוספות לפי בחירה**: עוד +1 עד +6 ימים (AI, עולמות 5–8, TTS-fallback, Vercel hosting).
