// browser-check.js — verify required browser features + window size.
// Runs before bootstrap. Shows overlay if anything is missing.

export function checkBrowser() {
  const issues = [];
  if (!('localStorage' in window)) issues.push('localStorage');
  if (!('indexedDB' in window)) issues.push('IndexedDB');
  if (!('speechSynthesis' in window)) issues.push('SpeechSynthesis (TTS)');
  if (!('crypto' in window) || !window.crypto.subtle) issues.push('SubtleCrypto');
  if (!('fetch' in window)) issues.push('fetch');

  const winOK = window.innerWidth >= 1024 && window.innerHeight >= 600;
  return {
    ok: issues.length === 0 && winOK,
    missingFeatures: issues,
    windowTooSmall: !winOK,
  };
}

export function showMinWindowWarning(target = document.body) {
  if (document.getElementById('min-window-warning')) return;
  const overlay = document.createElement('div');
  overlay.className = 'min-window-warning';
  overlay.id = 'min-window-warning';
  const h2 = document.createElement('h2');
  h2.textContent = 'החלון קטן מדי';
  const p = document.createElement('p');
  p.textContent = 'חכמוני זקוק לחלון של 1024×600 לפחות. הגדל את החלון או החלף למסך גדול יותר.';
  overlay.append(h2, p);
  target.append(overlay);
}

export function showMissingFeaturesWarning(features, target = document.body) {
  const overlay = document.createElement('div');
  overlay.className = 'min-window-warning';
  const h2 = document.createElement('h2');
  h2.textContent = 'הדפדפן לא נתמך';
  const p = document.createElement('p');
  p.textContent = 'חסרות יכולות בדפדפן: ' + features.join(', ') + '. נסה Chrome עדכני.';
  overlay.append(h2, p);
  target.append(overlay);
}
