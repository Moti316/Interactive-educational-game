// db.js — IndexedDB wrapper with promise API.
// Stores blobs (photos, voice recordings) too big for localStorage.
// Per CLAUDE.md: chachmoni:* namespace, AES-GCM for voice content.

const DB_NAME = 'chachmoni';
const DB_VERSION = 1;
const STORES = Object.freeze({
  PHOTOS: 'photos',       // key: profileId,  value: Blob (image/jpeg, ≤200KB)
  VOICE:  'voice',        // key: voiceId,    value: { encryptedBlob, iv, profileId }
  CACHE:  'cache',        // key: name,       value: any (TTS cache, etc.)
});

let dbPromise = null;

function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      for (const store of Object.values(STORES)) {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store);
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error || new Error('IndexedDB open failed'));
  });
  return dbPromise;
}

function tx(storeName, mode = 'readonly') {
  return open().then(db => db.transaction(storeName, mode).objectStore(storeName));
}

export async function put(storeName, key, value) {
  const store = await tx(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.put(value, key);
    req.onsuccess = () => resolve(true);
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function get(storeName, key) {
  const store = await tx(storeName);
  return new Promise((resolve, reject) => {
    const req = store.get(key);
    req.onsuccess = (e) => resolve(e.target.result ?? null);
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function remove(storeName, key) {
  const store = await tx(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function keys(storeName) {
  const store = await tx(storeName);
  return new Promise((resolve, reject) => {
    const req = store.getAllKeys();
    req.onsuccess = (e) => resolve(e.target.result || []);
    req.onerror = (e) => reject(e.target.error);
  });
}

export async function clear(storeName) {
  const store = await tx(storeName, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = (e) => reject(e.target.error);
  });
}

export const stores = STORES;

// Convenience: total size estimate for a store (Blob-aware).
export async function estimateStoreBytes(storeName) {
  const store = await tx(storeName);
  return new Promise((resolve, reject) => {
    let total = 0;
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (!cursor) { resolve(total); return; }
      const v = cursor.value;
      if (v instanceof Blob) total += v.size;
      else if (typeof v === 'string') total += v.length * 2;
      else if (v && typeof v === 'object') total += JSON.stringify(v).length * 2;
      cursor.continue();
    };
    req.onerror = (e) => reject(e.target.error);
  });
}
