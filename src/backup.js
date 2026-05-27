// backup.js — Export / Import all chachmoni:* data to one JSON file.
// Used by Settings → "ייצוא נתונים" / "ייבוא נתונים".
// Per CLAUDE.md: profile-scoped Drive uses different schema. This is local-only full backup.

import * as storage from './storage.js';
import { get as dbGet, put as dbPut, keys as dbKeys, stores } from './db.js';

const SCHEMA_VERSION = 1;
const MIME = 'application/json';

async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(b64, type = 'image/jpeg') {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}

/**
 * Serialize everything → JSON string.
 * @returns {Promise<string>}
 */
export async function exportAll() {
  const payload = {
    schema: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    localStorage: {},
    photos: {},
  };
  for (const k of storage.keys()) {
    payload.localStorage[k] = storage.get(k);
  }
  for (const id of await dbKeys(stores.PHOTOS)) {
    const blob = await dbGet(stores.PHOTOS, id);
    if (blob instanceof Blob) {
      payload.photos[id] = {
        type: blob.type || 'image/jpeg',
        data: await blobToBase64(blob),
      };
    }
  }
  return JSON.stringify(payload, null, 2);
}

/**
 * Trigger a browser download of the exported JSON.
 * @returns {Promise<string>} filename used
 */
export async function downloadBackup() {
  const json = await exportAll();
  const blob = new Blob([json], { type: MIME });
  const date = new Date().toISOString().slice(0, 10);
  const filename = `chachmoni-backup-${date}.json`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 1000);
  return filename;
}

/**
 * Restore data from a JSON string. Merges with existing (overwrites by key).
 * @param {string} json
 * @returns {Promise<{ profiles: number, photos: number, lsKeys: number }>}
 */
export async function importAll(json) {
  let parsed;
  try { parsed = JSON.parse(json); }
  catch (e) { throw new Error('קובץ לא תקין (JSON שבור)'); }

  if (!parsed || typeof parsed !== 'object') throw new Error('קובץ ריק או לא תקין');
  if (parsed.schema !== SCHEMA_VERSION) {
    console.warn('[backup] schema mismatch:', parsed.schema, '!=', SCHEMA_VERSION);
  }

  let lsCount = 0;
  if (parsed.localStorage && typeof parsed.localStorage === 'object') {
    for (const [k, v] of Object.entries(parsed.localStorage)) {
      storage.set(k, v);
      lsCount++;
    }
  }

  let photoCount = 0;
  if (parsed.photos && typeof parsed.photos === 'object') {
    for (const [id, photo] of Object.entries(parsed.photos)) {
      if (photo && photo.data) {
        const blob = base64ToBlob(photo.data, photo.type || 'image/jpeg');
        await dbPut(stores.PHOTOS, id, blob);
        photoCount++;
      }
    }
  }

  const profiles = (parsed.localStorage && parsed.localStorage.profiles) || [];
  return {
    profiles: Array.isArray(profiles) ? profiles.length : 0,
    photos: photoCount,
    lsKeys: lsCount,
  };
}

/**
 * Read a File picked by <input type="file"> and import.
 * @param {File} file
 */
export async function importFromFile(file) {
  if (!file) throw new Error('לא נבחר קובץ');
  const text = await file.text();
  return importAll(text);
}
