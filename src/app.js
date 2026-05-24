// app.js — entry + state machine bootstrap.
// Wires welcome.js / profiles.js into the 12-state machine.
// Placeholder screens for world-map / task / celebration / pin-entry
// (real implementations in subsequent files / phases).

import { checkBrowser, showMinWindowWarning, showMissingFeaturesWarning } from './browser-check.js';
import * as audio from './audio.js';
import * as profiles from './profiles.js';
import { createButton } from './ui/button.js';
import { renderWelcome, renderProfileCreate } from './welcome.js';
import { getAvatarById } from './ui/avatar-picker.js';

const STATES = Object.freeze({
  LOADING: 'loading',
  FIRST_RUN: 'first-run',
  WELCOME: 'welcome',
  PROFILE_CREATE: 'profile-create',
  PIN_ENTRY: 'pin-entry',
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

  switch (state.current) {
    case STATES.LOADING:
      appRoot.append(renderLoading());
      break;
    case STATES.FIRST_RUN:
      appRoot.append(renderProfileCreate({
        isFirstRun: true,
        onComplete: (id) => {
          state.activeProfileId = id;
          setState(STATES.WORLD_MAP);
        },
      }));
      break;
    case STATES.WELCOME:
      appRoot.append(renderWelcome({
        onSelectProfile: (id) => {
          profiles.setActive(id);
          state.activeProfileId = id;
          setState(STATES.WORLD_MAP);
        },
        onCreateNew: () => setState(STATES.PROFILE_CREATE),
        onOpenSettings: () => setState(STATES.PIN_ENTRY),
      }));
      break;
    case STATES.PROFILE_CREATE:
      appRoot.append(renderProfileCreate({
        isFirstRun: false,
        onComplete: (id) => {
          state.activeProfileId = id;
          setState(STATES.WORLD_MAP);
        },
        onCancel: () => setState(STATES.WELCOME),
      }));
      break;
    case STATES.WORLD_MAP:
      appRoot.append(renderWorldMapPlaceholder());
      break;
    case STATES.PIN_ENTRY:
      appRoot.append(renderPinEntryPlaceholder());
      break;
    default:
      appRoot.append(renderUnknownStatePlaceholder(state.current));
      break;
  }
}

function renderLoading() {
  const wrap = document.createElement('div');
  wrap.className = 'screen';
  wrap.style.cssText = 'align-items:center; justify-content:center;';
  const p = document.createElement('p');
  p.style.fontSize = 'var(--font-size-large)';
  p.textContent = 'טוען…';
  wrap.append(p);
  return wrap;
}

function renderWorldMapPlaceholder() {
  const wrap = document.createElement('div');
  wrap.className = 'screen';
  wrap.style.cssText = 'padding:32px; align-items:center; justify-content:center; text-align:center;';
  const active = profiles.getActive();
  if (active) {
    const av = getAvatarById(active.avatarId);
    const avatarImg = document.createElement('img');
    avatarImg.src = `assets/avatars/${av.file}`;
    avatarImg.alt = av.name;
    avatarImg.style.cssText = 'width:140px; height:140px; margin-bottom:8px;';
    const greet = document.createElement('h1');
    greet.style.cssText = 'font-family:var(--font-heading); font-size:var(--font-size-h1); color:var(--color-text-emphasis); margin:0 0 8px;';
    greet.textContent = `שלום ${active.name}!`;
    wrap.append(avatarImg, greet);
    setTimeout(() => audio.speak(`שלום ${active.name}!`), 400);
  }
  const sub = document.createElement('p');
  sub.style.cssText = 'font-size:var(--font-size-large); color:var(--color-text); margin:8px 0 24px;';
  sub.textContent = 'מפת העולמות תיבנה ב-Phase 2.';
  wrap.append(sub);
  wrap.append(createButton({
    label: 'חזרה למסך פתיחה',
    variant: 'secondary',
    onClick: () => setState(STATES.WELCOME),
  }));
  return wrap;
}

function renderPinEntryPlaceholder() {
  const wrap = document.createElement('div');
  wrap.className = 'screen';
  wrap.style.cssText = 'padding:32px; align-items:center; justify-content:center; text-align:center;';
  const h = document.createElement('h1');
  h.style.cssText = 'font-size:var(--font-size-h1); color:var(--color-text-emphasis);';
  h.textContent = 'הגדרות הורים';
  const sub = document.createElement('p');
  sub.style.cssText = 'font-size:var(--font-size-large); color:var(--color-text); margin:16px 0 24px;';
  sub.textContent = 'מסך-PIN ייבנה בהמשך Phase 1 (CHG-005).';
  wrap.append(h, sub);
  wrap.append(createButton({
    label: 'חזרה',
    variant: 'secondary',
    onClick: () => setState(STATES.WELCOME),
  }));
  return wrap;
}

function renderUnknownStatePlaceholder(stateName) {
  const wrap = document.createElement('div');
  wrap.className = 'screen';
  wrap.style.cssText = 'padding:32px; align-items:center; justify-content:center; text-align:center;';
  const h = document.createElement('h1');
  h.style.cssText = 'font-size:var(--font-size-h1); color:var(--color-text-emphasis);';
  h.textContent = 'בקרוב…';
  const sub = document.createElement('p');
  sub.style.cssText = 'font-size:var(--font-size-large); color:var(--color-text); margin:16px 0 24px;';
  sub.textContent = `המסך הזה (${stateName}) ייבנה בשלבים הבאים.`;
  wrap.append(h, sub);
  wrap.append(createButton({
    label: 'חזרה',
    variant: 'secondary',
    onClick: () => setState(STATES.WELCOME),
  }));
  return wrap;
}

async function bootstrap() {
  appRoot = document.getElementById('app');
  if (!appRoot) {
    console.error('[app] #app root not found');
    return;
  }

  const check = checkBrowser();
  if (check.windowTooSmall) { showMinWindowWarning(); return; }
  if (check.missingFeatures.length > 0) {
    showMissingFeaturesWarning(check.missingFeatures);
    return;
  }

  await audio.init();

  const list = profiles.listChildren();
  if (list.length === 0) {
    setState(STATES.FIRST_RUN);
  } else {
    const active = profiles.getActive();
    if (active) state.activeProfileId = active.id;
    setState(STATES.WELCOME);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}

window.addEventListener('resize', () => {
  const check = checkBrowser();
  const existing = document.getElementById('min-window-warning');
  if (check.windowTooSmall && !existing) {
    showMinWindowWarning();
  } else if (!check.windowTooSmall && existing) {
    existing.remove();
  }
});

window.__chachmoni = { state, setState, STATES, profiles };
