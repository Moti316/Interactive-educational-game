// storage.js — localStorage wrapper with chachmoni:* prefix.
// Per CLAUDE.md: never wipe other apps' data; only chachmoni keys.
const PREFIX = 'chachmoni:';

export function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (err) {
    console.warn('[storage] get failed:', key, err);
    return fallback;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn('[storage] set failed:', key, err);
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

export function keys() {
  const result = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) result.push(k.slice(PREFIX.length));
  }
  return result;
}

export function clear() {
  for (const k of keys()) remove(k);
}
