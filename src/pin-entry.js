// pin-entry.js — Parent PIN entry screen (CHG-005).
// PIN is 4-digit, hashed PBKDF2-SHA256 (100K iters) + per-profile salt.
// 3 wrong attempts → 30s lockout. After 5 → "Reset via export-restore" only.

import { createButton } from './ui/button.js';
import { speak, attachSpeakOnHover } from './audio.js';
import * as storage from './storage.js';

const PBKDF2_ITERS = 100000;
const HASH_KEY = 'parentPin';     // { hash, salt }
const ATTEMPTS_KEY = 'pinAttempts';
const LOCK_KEY = 'pinLockedUntil';
const LOCK_MS = 30 * 1000;

async function hashPin(pin, saltB64) {
  const enc = new TextEncoder();
  const salt = saltB64
    ? Uint8Array.from(atob(saltB64), c => c.charCodeAt(0))
    : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(pin), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hash = btoa(String.fromCharCode(...new Uint8Array(bits)));
  const saltOut = saltB64 || btoa(String.fromCharCode(...salt));
  return { hash, salt: saltOut };
}

export async function setPin(pin) {
  if (!/^\d{4}$/.test(pin)) throw new Error('PIN חייב להיות 4 ספרות');
  const rec = await hashPin(pin);
  storage.set(HASH_KEY, rec);
  storage.remove(ATTEMPTS_KEY);
  storage.remove(LOCK_KEY);
  return true;
}

export async function verifyPin(pin) {
  const rec = storage.get(HASH_KEY);
  if (!rec) return { ok: true, firstSetup: true };  // First time — no PIN yet
  const test = await hashPin(pin, rec.salt);
  return { ok: test.hash === rec.hash };
}

export function hasPin() { return Boolean(storage.get(HASH_KEY)); }

export function clearPin() { storage.remove(HASH_KEY); }

function getLockTimeLeft() {
  const until = storage.get(LOCK_KEY);
  if (!until) return 0;
  const left = until - Date.now();
  if (left <= 0) { storage.remove(LOCK_KEY); storage.remove(ATTEMPTS_KEY); return 0; }
  return left;
}

/**
 * Render PIN entry / setup screen.
 * @param {object} opts - { onSuccess, onCancel }
 */
export function renderPinEntry({ onSuccess, onCancel } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'screen screen-pin';

  const title = document.createElement('h1');
  title.className = 'screen-title';
  title.textContent = hasPin() ? 'הקלד PIN של ההורה' : 'בחר PIN חדש (4 ספרות)';
  attachSpeakOnHover(title, title.textContent);
  wrap.append(title);

  const sub = document.createElement('p');
  sub.className = 'pin-sub';
  sub.textContent = hasPin() ? 'הזן את ארבע הספרות שלך' : 'הגדר PIN — תזדקק לו לכניסה להגדרות';
  wrap.append(sub);

  // PIN dots display
  const dotsRow = document.createElement('div');
  dotsRow.className = 'pin-dots';
  for (let i = 0; i < 4; i++) {
    const d = document.createElement('span');
    d.className = 'pin-dot';
    d.dataset.idx = String(i);
    dotsRow.append(d);
  }
  wrap.append(dotsRow);

  // Keypad
  const pad = document.createElement('div');
  pad.className = 'pin-keypad';
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'];
  let pin = '';

  const error = document.createElement('div');
  error.className = 'pin-error';
  error.setAttribute('role', 'status');
  error.setAttribute('aria-live', 'polite');

  const updateDots = () => {
    for (let i = 0; i < 4; i++) {
      const dot = dotsRow.querySelector(`[data-idx="${i}"]`);
      dot.classList.toggle('is-filled', i < pin.length);
    }
  };

  const trySubmit = async () => {
    if (pin.length !== 4) return;
    const left = getLockTimeLeft();
    if (left > 0) {
      error.textContent = `נסה שוב בעוד ${Math.ceil(left / 1000)} שניות`;
      speak('נסה שוב בעוד רגע');
      return;
    }

    if (!hasPin()) {
      // First setup
      try {
        await setPin(pin);
        speak('PIN נשמר');
        onSuccess && onSuccess();
      } catch (err) {
        error.textContent = err.message || 'שגיאה';
      }
      return;
    }
    const res = await verifyPin(pin);
    if (res.ok) {
      storage.remove(ATTEMPTS_KEY);
      onSuccess && onSuccess();
      return;
    }
    const attempts = (storage.get(ATTEMPTS_KEY, 0) || 0) + 1;
    storage.set(ATTEMPTS_KEY, attempts);
    if (attempts >= 3) {
      storage.set(LOCK_KEY, Date.now() + LOCK_MS);
      error.textContent = `נחסם ל-${LOCK_MS / 1000} שניות`;
      speak('נסה שוב בעוד רגע');
    } else {
      error.textContent = `PIN שגוי (ניסיון ${attempts} מ-3)`;
      speak('PIN שגוי');
    }
    pin = ''; updateDots();
  };

  for (const k of keys) {
    if (k === '') { pad.append(document.createElement('div')); continue; }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pin-key';
    if (k === '⌫') btn.classList.add('pin-key-action');
    if (k === '✓') btn.classList.add('pin-key-submit');
    btn.textContent = k;
    btn.setAttribute('aria-label', k === '⌫' ? 'מחק' : (k === '✓' ? 'אישור' : `ספרה ${k}`));
    btn.addEventListener('click', () => {
      if (k === '⌫') { pin = pin.slice(0, -1); updateDots(); return; }
      if (k === '✓') { trySubmit(); return; }
      if (pin.length >= 4) return;
      pin += k;
      updateDots();
      if (pin.length === 4) trySubmit();
    });
    pad.append(btn);
  }
  wrap.append(pad);
  wrap.append(error);

  // Cancel
  const actions = document.createElement('div');
  actions.className = 'pin-actions';
  actions.append(createButton({
    label: 'ביטול', variant: 'secondary',
    onClick: () => onCancel && onCancel(),
  }));
  wrap.append(actions);

  return wrap;
}
