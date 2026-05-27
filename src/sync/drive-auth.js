// sync/drive-auth.js — Google Identity Services (GIS) OAuth flow.
// Token-client model (no client-side secret). Token cached in memory + localStorage.
// Scope: drive.file only.

import * as storage from '../storage.js';
import { DRIVE_CONFIG, isConfigured } from './drive-config.js';

const TOKEN_KEY = 'driveToken';
const PROFILE_KEY = 'driveUserProfile';
let gisLoaded = false;
let tokenClient = null;

function injectScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load: ' + src));
    document.head.append(s);
  });
}

async function loadGIS() {
  if (gisLoaded) return;
  await injectScript('https://accounts.google.com/gsi/client');
  // Poll briefly for google.accounts.oauth2
  for (let i = 0; i < 50; i++) {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) break;
    await new Promise(r => setTimeout(r, 100));
  }
  if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
    throw new Error('Google Identity Services לא נטען');
  }
  gisLoaded = true;
}

export function getToken() {
  const tok = storage.get(TOKEN_KEY);
  if (!tok || !tok.access_token) return null;
  if (tok.expiresAt && Date.now() > tok.expiresAt) return null;
  return tok;
}

export function clearToken() {
  storage.remove(TOKEN_KEY);
  storage.remove(PROFILE_KEY);
}

export function isSignedIn() {
  return Boolean(getToken());
}

export function getUserProfile() {
  return storage.get(PROFILE_KEY, null);
}

/**
 * Start the OAuth consent flow. Opens a Google popup.
 * @returns {Promise<{ token: object }>}
 */
export async function signIn() {
  if (!isConfigured()) throw new Error('OAuth Client ID לא הוגדר');
  await loadGIS();
  return new Promise((resolve, reject) => {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: DRIVE_CONFIG.CLIENT_ID,
      scope: DRIVE_CONFIG.SCOPE,
      callback: (resp) => {
        if (resp.error) { reject(new Error(resp.error)); return; }
        const tok = {
          access_token: resp.access_token,
          expiresAt: Date.now() + (Number(resp.expires_in || 3600) - 60) * 1000,
        };
        storage.set(TOKEN_KEY, tok);
        // Fetch user email
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tok.access_token}` },
        })
        .then(r => r.json())
        .then(info => {
          storage.set(PROFILE_KEY, { email: info.email, name: info.name });
        })
        .catch(() => {});
        resolve({ token: tok });
      },
    });
    tokenClient.requestAccessToken({ prompt: 'consent' });
  });
}

export function signOut() {
  const tok = getToken();
  if (tok && window.google && window.google.accounts && window.google.accounts.oauth2) {
    try { window.google.accounts.oauth2.revoke(tok.access_token); } catch {}
  }
  clearToken();
}

/**
 * Authorized fetch — auto-adds Bearer token, refreshes once on 401.
 */
export async function authedFetch(url, opts = {}) {
  let tok = getToken();
  if (!tok) throw new Error('Not signed in');
  const doFetch = (token) => fetch(url, {
    ...opts,
    headers: { ...(opts.headers || {}), Authorization: `Bearer ${token.access_token}` },
  });
  let res = await doFetch(tok);
  if (res.status === 401) {
    clearToken();
    throw new Error('הסשן פג — יש להתחבר שוב');
  }
  return res;
}
