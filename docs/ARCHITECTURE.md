# ARCHITECTURE — מבנה המערכת

## סקירה

הקובץ הזה ימולא בשלב 1 כשנתחיל לבנות את הקוד הראשי.

## מבנה תיקיות

ראה PLAN.md לפירוט מלא.

## חוזי-API בין מודולים

- `src/app.js` (state machine) → `src/templates/*`: `mount(container, onComplete) → cleanup`.
- `src/audio.js` → `speak()`, `cancel()`, `speakOnHover()`, `speakOnHoverOrTouch()`.
- `src/storage.js` → `getProfile()`, `saveProgress(profileId, taskId)`, prefix `chachmoni:*`.
- `src/sync/drive-sync.js` → `uploadProfile(profileId, data)`, `downloadProfile(profileId)` — קובץ פר-פרופיל.

## State Machine

ראה PLAN.md סעיף `State Machine של app.js` ל-STATES + TRANSITIONS מלאים.

## עדכון

*יעודכן עם כל שינוי-ארכיטקטוני משמעותי.*