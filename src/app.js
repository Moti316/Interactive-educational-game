// app.js — entry + state machine bootstrap.
// Phase 1 skeleton: 12-state machine, mounts initial screen.
// Real screens (welcome, profile-create, world-map, task, celebration)
// will be added in subsequent files (welcome.js, profiles.js, etc.).

import { checkBrowser, showMinWindowWarning, showMissingFeaturesWarning } from './browser-check.js';
import * as audio from './audio.js';
import * as storage from './storage.js';
import { createButton } from './ui/button.js';

const STATES = Object.freeze({
  LOADING: 'loading',
  FIRST_RUN: 'first-run',
  WELCOME: 'welcome',
  PROFILE_CREATE: 'profile-create',
  PIN_ENTRY: 'pin-entry',
  PIN_WRONG: 'pin-wrong',
  WORLD_MAP: 'world-map',
  TASK: 'task',
  CELEBRATION: 'celebration',
  PARENT_DASHBOARD: 'parent-dashboard',
  SETTINGS: 'settings',
  ERROR: 'error',
});

const state = {
  current: STATES.LOADING,
  activeProfileId: null,
  activeTaskId: null,
};

let appRoot = null;

function setState(next, ctx = {}) {
  console.info('[app] state →', next);
  state.current = next;
  Object.assign(state, ctx);
  render();
}

function render() {
  if (!appRoot) return;
  appRoot.replaceChildren();

  // Placeholder render — real screens come in next turn (welcome.js, etc.).
  const wrap = document.createElement('div');
  wrap.style.flex = '1';
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.alignItems = 'center';
  wrap.style.justifyContent = 'center';
  wrap.style.padding = '32px';
  wrap.style.textAlign = 'center';

  const h = document.createElement('h1');
  h.textContent = 'חכמוני';
  h.style.fontSize = 'var(--font-size-h1)';
  h.style.color = 'var(--color-text-emphasis)';
  h.style.marginBottom = '16px';

  const sub = document.createElement('p');
  sub.style.fontSize = 'var(--font-size-large)';
  sub.style.color = 'var(--color-text)';
  sub.style.marginBottom = '32px';
  // Hebrew state names for the developer placeholder.
  const labels = {
    [STATES.LOADING]: 'טוען…',
    [STATES.FIRST_RUN]: 'ברוכים הבאים! בואו ניצור פרופיל ראשון.',
    [STATES.WELCOME]: 'בחר פרופיל',
    [STATES.PROFILE_CREATE]: 'יצירת פרופיל חדש',
    [STATES.PIN_ENTRY]: 'הזן PIN',
    [STATES.WORLD_MAP]: 'מפת העולמות',
    [STATES.TASK]: 'משימה',
    [STATES.CELEBRATION]: 'כל הכבוד!',
    [STATES.PARENT_DASHBOARD]: 'לוח-הורה',
    [STATES.SETTINGS]: 'הגדרות',
    [STATES.ERROR]: 'אופס, משהו השתבש',
  };
  sub.textContent = labels[state.current] || `מצב: ${state.current}`;

  wrap.append(h, sub);

  // Skeleton: show one button per "next state" for testing.
  if (state.current === STATES.FIRST_RUN) {
    const btn = createButton({
      label: 'בואו נתחיל',
      onClick: () => setState(STATES.PROFILE_CREATE),
      variant: 'primary',
    });
    wrap.append(btn);
  } else if (state.current === STATES.WELCOME) {
    const btn = createButton({
      label: 'התחל לשחק',
      onClick: () => setState(STATES.WORLD_MAP),
      variant: 'primary',
    });
    wrap.append(btn);
  }

  appRoot.append(wrap);
}

async function bootstrap() {
  appRoot = document.getElementById('app');
  if (!appRoot) {
    console.error('[app] #app root not found');
    return;
  }

  // 1. Feature + window check
  const check = checkBrowser();
  if (check.windowTooSmall) {
    showMinWindowWarning();
    return;
  }
  if (check.missingFeatures.length > 0) {
    showMissingFeaturesWarning(check.missingFeatures);
    return;
  }

  // 2. Init audio (TTS)
  await audio.init();

  // 3. Determine starting state: first-run vs returning
  const profiles = storage.get('profiles', []);
  const hasProfiles = Array.isArray(profiles) && profiles.length > 0;
  setState(hasProfiles ? STATES.WELCOME : STATES.FIRST_RUN);
}

// Boot when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}

// Re-check window size on resize
window.addEventListener('resize', () => {
  const check = checkBrowser();
  const existing = document.getElementById('min-window-warning');
  if (check.windowTooSmall && !existing) {
    showMinWindowWarning();
  } else if (!check.windowTooSmall && existing) {
    existing.remove();
  }
});

// Dev hook
window.__chachmoni = { state, setState, STATES };
