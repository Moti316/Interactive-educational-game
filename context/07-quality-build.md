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
- **בדיקה לפני שחרור:** אסור push ל-`main` בלי שעבר את ה-QA checklist (`docs/quality/TESTING.md`).

### 7. תקצוב-ביצועים (Performance Budget)

**הבעיה:** ככל שהמשחק גדל, הוא מאט. אין מד.

**הפתרון:** יעדים מפורשים:
- **First Contentful Paint:** < 1 שנייה ב-localhost
- **Time to Interactive:** < 2 שניות
- **Bundle size (אם נצטרך):** < 500KB סך-הכל
- **Memory after 30min play:** < 100MB

נמדד ב-DevTools Performance + Lighthouse. רשום ב-`docs/quality/PERFORMANCE.md` — קובץ MD חדש 20.

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

### `docs/quality/TESTING.md` — פרוטוקול בדיקות עם ילדים

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
- פותח `docs/log/KIDS-FEEDBACK.md` ומתעד:
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

### `docs/guides/RECOVERY.md` — Runbook לתרחישי-משבר

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
אם משהו ממש שבור — `docs/log/ISSUES.md` (פתח issue).
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
8. **בדיקה עם הילדים** (החשובה ביותר): לתת לכל ילד לשחק לבד, לתעד ב-`docs/log/KIDS-FEEDBACK.md`.
9. **בדיקת קיצור-הדרך**: לחיצה-כפולה על אייקון "חכמוני" בשולחן-העבודה → המשחק נפתח ב-Chrome → עובד מקצה-לקצה.

---

## מה לא בתכנון הזה (במכוון)

- **אין מערכת חשבונות / login לילדים** — פרופילים מקומיים עם אווטאר. ה-OAuth של Google הוא של ההורה בלבד, לסנכרון.
- **אין backend / DB משלנו** — localStorage + Google Drive של ההורה.
- **אין תמיכה במובייל/טאצ'** — נשמר למשחק עתידי, היום המטרה היא לימוד עכבר.
- **אין אנגלית** — שפה אחת = פחות באגים, פחות מסכי הגדרות שיבלבלו ילד.
- **אין עורך משימות גרפי** — להוסיף משימה = ליצור קובץ JS קטן ב-`src/tasks/`. ראה `docs/process/HOW-TO-ADD-TASK.md`.
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
- **📋 Plan Control** — `docs/log/PLAN-CONTROL.md` מתעד כל שינוי-תכנון עם בדיקת-עקביות.

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
