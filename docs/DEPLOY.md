---
tags:
  - guide
---

# DEPLOY — הרצה, פריסה, גיבוי

## הרצה מקומית

```powershell
# Double-click על שולחן-העבודה "חכמוני"
# או:
powershell -File scripts/start-chachmoni.ps1
```r

השרת רץ על `http://localhost:8080` (או 8081-8085 אם תפוס).

## הגדרת קיצור-דרך (חד-פעמית)

```powershell
powershell -File scripts/install-shortcut.ps1
```r

יצירת `חכמוני.lnk` על שולחן-העבודה עם אייקון.

## הגדרת Google Drive OAuth (חד-פעמית, ~30 דק')

1. כניסה ל-console.cloud.google.com
2. "New Project" → שם: `chachmoni`  
3. "APIs & Services" → "Library" → חפש "Google Drive API" → Enable
4. "Credentials" → "Create OAuth Client ID":
   - Type: **Web Application**
   - Authorized JavaScript origins: `http://localhost:8080`, `http://localhost:8081`, `http://localhost:8082`, `http://localhost:8083`, `http://localhost:8084`, `http://localhost:8085`  
   - Authorized redirect URIs: אותם URLs
5. תקבל **Client ID** ארוך
6. הזן במשחק: הגדרות-הורה → "Drive Backup" → הדבק Client ID

## גיבוי ידני (Export/Import)

- במסך-הגדרות-הורה: "Export Data" → מוריד `chachmoni-backup-YYYY-MM-DD.json`  
- "Import Data" → File input → מחזיר את הנתונים

## חזרה לגרסה קודמת (Rollback)

```powershell
powershell -File scripts/rollback.ps1 v1.0
```r

או: ב-Drive → תיקיית `חכמוני/backups/` → בחר גרסה → Restore