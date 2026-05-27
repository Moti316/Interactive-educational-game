// sync/drive-config.js — OAuth Client ID configuration.
// To activate Drive Sync, set CLIENT_ID below to your Google OAuth Client ID.
// See docs/guides/PARENT-GUIDE.md for the one-time setup (~30 min).
//
// SCOPE = drive.file → app can only see files it created. NOT all-drive access.
// We never request drive.readonly / drive (full). Per CLAUDE.md security policy.

export const DRIVE_CONFIG = Object.freeze({
  // PASTE YOUR OAUTH CLIENT ID HERE (format: 1234567890-abcdef.apps.googleusercontent.com)
  // Until set, Drive Sync UI shows "OAuth needs setup" guidance.
  CLIENT_ID: '',
  SCOPE: 'https://www.googleapis.com/auth/drive.file',
  DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  PROGRESS_FILE_PREFIX: 'chachmoni-progress-',  // per-profile
  PROGRESS_FILE_EXT: '.json',
});

export function isConfigured() {
  return Boolean(DRIVE_CONFIG.CLIENT_ID && DRIVE_CONFIG.CLIENT_ID.length > 0);
}
