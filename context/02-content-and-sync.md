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
- חזרה אקספוננציאלית (1s, 2s, 4s, 8s...) עד 5 ניסיונות, אז viewing ב-`docs/log/ISSUES.md`.

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
  - `show-progress.ps1` — מציג את התוכן של `docs/status/PROGRESS.md` בקונסול → Claude מודע מיד "איפה הפסקנו".
- **Stop**:
  - `update-progress.ps1` — מעדכן את `docs/status/PROGRESS.md` עם timestamp, שם-מחשב, מה השתנה בסשן.
  - `git-sync.ps1 -Action push` — `git add -A`, `git commit -m "auto: ..."`, `git push`.

### שכבה 2: Windows Task Scheduler (כל שעה ברקע)

טאסק מתוזמן שרץ גם כשClaude Code לא פתוח — מבטיח שהקוד מסונכרן גם כשעובדים ב-VSCode בלבד או רק קוראים את הקוד:

```powershell
# scripts/git-sync.ps1 (Patch #13 מהמועצה — lock-file mechanism)
param([string]$Action = 'sync', [string]$Message = "auto-sync from $env:COMPUTERNAME at $(Get-Date -Format 'yyyy-MM-dd HH:mm')")

cd "C:\Users\b0066820\Desktop\Claude project\Interactive-educational-game"

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
  -Argument '-NoProfile -WindowStyle Hidden -File "C:\Users\b0066820\Desktop\Claude project\Interactive-educational-game\scripts\git-sync.ps1"'
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

ראה `docs/process/PROCESSES.md` ל-flow המלא ו-`docs/quality/SECURITY.md` לעניין מפתחות.

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

ראה `docs/quality/SECURITY.md` לעניין הרשאות ופרטיות הילדים.

---

## הקמה ראשונית של GitHub (חד-פעמי)

```powershell
gh auth login                                                      # פעם ראשונה בלבד
cd C:\Users\b0066820
git clone https://github.com/Moti316/Interactive-educational-game
cd Interactive-educational-game
# מתחילים לבנות... הסקריפט git-sync.ps1 יטפל בכל סנכרון מכאן ואילך
```

**Local-Only deployment (MVP):** אין דפלוי באינטרנט. המשחק נטען מקובץ ב-Chrome מהמחשב המשפחתי. עדכונים מגיעים דרך git pull. ראה `docs/guides/DEPLOY.md` ל-runbook מלא.

---

