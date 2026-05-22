---
tags:
  - guide
---

# RECOVERY — Disaster Recovery Runbook

## תרחיש 1: ההורה שכח PIN
1. במסך-בחירת-פרופיל לחץ על ⚙ → "שכחתי PIN"
2. השב על שאלת-recovery (תאריך-לידתך DD/MM)
3. אם גם זה לא — נשארת אפשרות איפוס דרך DevTools:
   - F12 → Application → Local Storage → מחק `chachmoni:pin-hash`  
   - רענן → מתחיל First-Run מחדש (ההתקדמות של הילדים נשמרת ב-Drive)

## תרחיש 2: נתוני-ילד נמחקו ב-Drive בטעות
1. פתח Google Drive → תיקיית "חכמוני" → סל-המיחזור
2. בלחיצה-ימנית על הקובץ → "Restore"
3. אם עברו 30 יום — מהsub-תיקייה `backups/` יש 7 גיבויים אחרונים

## תרחיש 3: localStorage נמחק (פרופיל-Windows חדש)
1. במחשב-החדש, `git clone` של הריפו
2. הרץ `scripts/start-chachmoni.ps1`  
3. בפתיחה-ראשונה תופיע ההצעה "מצאנו גיבוי קודם, להעלות?"
4. אם לא רואים — וודא Chrome מחובר לאותו חשבון-Google

## תרחיש 4: Migration נכשלה (data corrupted)
1. **אל תיבהל!** ה-backup קיים ב-IndexedDB
2. פתח DevTools → Application → IndexedDB → `migrations-backup`  
3. ראה את הגרסה-האחרונה
4. הרץ `restoreFromMigrationBackup()` ב-Console

## תרחיש 5: PowerShell Launcher לא נפתח
1. **שגיאת firewall** — Windows Defender חוסם. אישור ידני בעת prompt.
2. **port-collision** — סקריפט עובר אוטומטית ל-8081, 8082...
3. **PowerShell Execution Policy** — הרץ פעם אחת:
   `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`  

## תרחיש 6: Chrome עוצר את autoplay של קריינות
1. `chrome://settings/content/sound` → אישור chachmoni
2. או: `chrome://flags/#autoplay-policy` → "No user gesture required"

## טלפון-חירום
אם משהו ממש שבור — תיעוד ב-`docs/log/ISSUES.md` עם תיאור מלא.