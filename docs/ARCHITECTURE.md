# ARCHITECTURE — מבנה המערכת

## סקירה

חכמוני הוא Vanilla JS ES Modules, רץ דרך PowerShell Launcher (localhost:8080). אין build step, אין backend.

## מבנה תיקיות

ראה `PLAN.md` סעיף "מבנה תיקיות" לפירוט מלא (~30 תיקיות).

## חוזי-API בין מודולים

### Core
- `src/app.js` (state machine) → `src/templates/*`: `mount(container, onComplete) → cleanup()`.
- `src/audio.js` → `speak(text)`, `speakName(profile)`, `cancel()`, `speakOnHover()`, `speakOnHoverOrTouch()`.
- `src/storage.js` → `getProfile()`, `saveProgress(profileId, taskId)`, prefix `chachmoni:*`. Schema v2 (CHG-005).
- `src/profiles.js` (CHG-005 מאוחד) → `createChild()`, `createParent()`, `getRandomParent()`, `deleteProfile()` (cascade!).

### Storage Layer (CHG-006)
- **`src/db.js`** (חדש) — IndexedDB מרכזי, single connection, object-stores: `photos`, `voices`, `migrations-backup`, `rate-limit`. version-bump אחד.
- `src/photo-store.js` → wrapper סביב `db.js`, magic-bytes + canvas re-encode + AES-GCM encryption.
- `src/voice-recorder.js` → MediaRecorder API + 4ש' + waveform + auto-trim + AES-GCM. Cleanup: `stream.getTracks().forEach(t => t.stop())`.

### Sync
- `src/sync/drive-auth.js` → GIS Token Client + state-nonce (sessionStorage).
- `src/sync/drive-sync.js` → `uploadProfile(profileId, data)`, `downloadProfile(profileId)`. Per-profile queue.
- `src/sync/drive-encrypt.js` (CHG-005) → AES-GCM encryption של voice/photo, key נגזר מ-PIN דרך PBKDF2.

### UI
- `src/ui/button.js` → `createButton({type, label, onClick, ...})`. textContent בלבד (XSS-proof). variants: primary, secondary, tertiary, icon, **chip**, **circle-color**.
- `src/ui/avatar-picker.js` → 12 אווטארים.
- `src/ui/photo-uploader.js` → file input + magic-bytes + canvas.
- `src/ui/parent-cameo.js` → pop-up + pre-fetched voice.
- `src/ui/niqud-preview.js` (CHG-005) → A/B Niqud Preview.
- `src/ui/gender-picker.js` (CHG-005) → 3 chips (בן/בת/לא חשוב).

## IndexedDB Schema (CHG-006)

```
chachmoni-db (version 2)
├── photos       (key: photoStoreKey, value: encrypted Blob)
├── voices       (key: voiceKey, value: encrypted Blob)
├── migrations-backup (key: timestamp, value: full state snapshot)
└── rate-limit   (key: 'pin-attempts', value: {count, firstAt, lockedUntil})
```

### Key format
- Photos: `photo-{profileId}` או `photo-parent-{parentId}`
- Voices: `voice-name-{profileId}` (הקלטת שם) או `voice-cameo-{parentId}` (הקלטת cameo)

## Profile Schema (v2, CHG-005)

```js
// localStorage: 'chachmoni:profiles'
{
  schemaVersion: 2,
  profiles: [
    // Child
    {
      id: 'uuid',  // crypto.randomUUID()
      kind: 'child',
      name: 'יואב',
      nameNiqud: 'יוֹאָב',          // אופציונלי
      ttsOverride: null,            // fallback ידני
      gender: 'boy',                // boy | girl | neutral
      age: 5,
      favoriteColor: '#FF6B6B',
      avatarType: 'preset',         // 'preset' | 'photo'
      avatarValue: 'rabbit',
      photoStoreKey: null,
      voiceRecordings: { nameKey, cameoKey },
      createdAt: '2026-05-17',
      parentIds: ['uuid', 'uuid'],
      progress: {...},
      settings: {...}
    },
    // Parent
    {
      id: 'uuid',
      kind: 'parent',
      name: 'אבא',
      role: 'father',               // mother | father | guardian
      gender: 'boy',
      avatarType: 'photo',
      photoStoreKey: 'photo-parent-uuid',
      voiceRecordings: { nameKey: null, cameoKey: 'voice-cameo-uuid' },
      pinHashRef: 'pin-shared'      // shared ב-MVP, פר-הורה ב-Phase 2
    }
  ],
  lastActiveProfileId: 'uuid',
  driveSync: {...}
}
```

## State Machine (app.js)

ראה `PLAN.md` סעיף "State Machine של app.js" — 12 states + validated transitions.

עדכוני CHG-005:
- מצב חדש: `FAST_PATH_CHILD_SETUP` — שם בלבד, גיל ברירת-מחדל, אווטאר ארנב.
- מצב חדש: `PROGRESSIVE_ONBOARDING` — מופיע אחרי 5 משימות, מרחיב את ה-flow.

## Relationship Integrity (CHG-006)

- `deleteProfile(parentId)` → מסיר `parentIds: parentId` מכל ילד מקושר + מוחק blobs מ-IndexedDB (cascade).
- `deleteProfile(childId)` → מוחק photos + voices + custom-tasks (cascade).
- `parents.length === 0` → cameo מבוטל (Guard ב-`celebration.js`).

## עדכון

*יעודכן עם כל שינוי-ארכיטקטוני משמעותי.*
- 2026-05-17: ARCHITECTURE.md ראשון, עודכן עם CHG-005 + CHG-006 (Round 3).
