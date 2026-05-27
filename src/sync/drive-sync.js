// sync/drive-sync.js — Per-profile progress sync to Google Drive (drive.file scope).
// File naming: chachmoni-progress-{profileId}.json — one file per profile.
// Sync model: pull → merge (newer wins per-task) → push.

import { authedFetch, signIn, signOut, isSignedIn, getUserProfile } from './drive-auth.js';
import { isConfigured, DRIVE_CONFIG } from './drive-config.js';
import * as profiles from '../profiles.js';
import * as storage from '../storage.js';

const FILES_API = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';
const SYNC_META_KEY = 'driveSyncMeta';   // { lastSync: ISO }

export function getDriveStatus() {
  return {
    configured: isConfigured(),
    signedIn: isSignedIn(),
    email: (getUserProfile() || {}).email || null,
    lastSync: (storage.get(SYNC_META_KEY) || {}).lastSync || null,
  };
}

export async function startDriveAuth() {
  if (!isConfigured()) throw new Error('OAuth Client ID לא הוגדר');
  return signIn();
}

export function signOutDrive() { signOut(); }

function fileName(profileId) {
  return `${DRIVE_CONFIG.PROGRESS_FILE_PREFIX}${profileId}${DRIVE_CONFIG.PROGRESS_FILE_EXT}`;
}

async function findFileId(name) {
  const q = encodeURIComponent(`name='${name}' and trashed=false`);
  const res = await authedFetch(`${FILES_API}?q=${q}&fields=files(id,name,modifiedTime)`);
  if (!res.ok) throw new Error('Drive list failed: ' + res.status);
  const data = await res.json();
  return data.files && data.files.length > 0 ? data.files[0] : null;
}

async function downloadFile(fileId) {
  const res = await authedFetch(`${FILES_API}/${fileId}?alt=media`);
  if (!res.ok) throw new Error('Drive download failed: ' + res.status);
  return res.json();
}

async function uploadFile(name, content, existingId) {
  const meta = { name, mimeType: 'application/json' };
  const boundary = '-------chachmoni' + Math.random().toString(36).slice(2);
  const body =
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(meta) +
    `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
    JSON.stringify(content) +
    `\r\n--${boundary}--`;

  const url = existingId
    ? `${UPLOAD_API}/${existingId}?uploadType=multipart`
    : `${UPLOAD_API}?uploadType=multipart`;
  const method = existingId ? 'PATCH' : 'POST';
  const res = await authedFetch(url, {
    method,
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
  if (!res.ok) throw new Error('Drive upload failed: ' + res.status);
  return res.json();
}

function profileToCloud(p) {
  return {
    schema: 1,
    profileId: p.id,
    name: p.name,
    gender: p.gender || 'neutral',
    avatarId: p.avatarId,
    stars: p.stars || 0,
    completedTasks: p.completedTasks || [],
    updatedAt: new Date().toISOString(),
  };
}

function mergeProgress(local, cloud) {
  // Per-task: union. Stars: max.
  const tasks = new Set([...(local.completedTasks || []), ...(cloud.completedTasks || [])]);
  return {
    ...local,
    stars: Math.max(local.stars || 0, cloud.stars || 0),
    completedTasks: [...tasks],
  };
}

/**
 * Two-way sync for all child profiles.
 * @returns {Promise<{ ok: boolean, profiles: number }>}
 */
export async function syncNow() {
  if (!isSignedIn()) throw new Error('לא מחובר');
  const children = profiles.listChildren();
  for (const p of children) {
    const name = fileName(p.id);
    const remote = await findFileId(name);
    if (remote) {
      try {
        const cloud = await downloadFile(remote.id);
        const merged = mergeProgress(p, cloud);
        if (merged.stars !== p.stars || merged.completedTasks.length !== (p.completedTasks || []).length) {
          profiles.update(p.id, {
            stars: merged.stars,
            completedTasks: merged.completedTasks,
          });
        }
        await uploadFile(name, profileToCloud({ ...p, ...merged }), remote.id);
      } catch (e) {
        console.warn('[drive-sync] failed for', p.id, e);
      }
    } else {
      await uploadFile(name, profileToCloud(p));
    }
  }
  storage.set(SYNC_META_KEY, { lastSync: new Date().toISOString() });
  return { ok: true, profiles: children.length };
}

/**
 * Auto-sync on launch (silent, best-effort).
 * Called from app.js bootstrap.
 */
export async function autoSyncOnLaunch() {
  if (!isConfigured() || !isSignedIn()) return { ok: false, reason: 'not-ready' };
  try { return await syncNow(); }
  catch (e) {
    console.warn('[drive-sync] auto-sync failed:', e.message);
    return { ok: false, reason: e.message };
  }
}
