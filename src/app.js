// app.js — entry + state machine + screen routing.
// Phase 2: complete game loop (welcome → world-map → task → celebration → repeat).

import { checkBrowser, showMinWindowWarning, showMissingFeaturesWarning } from './browser-check.js';
import * as audio from './audio.js';
import * as profiles from './profiles.js';
import { createButton } from './ui/button.js';
import { getAvatarById } from './ui/avatar-picker.js';
import { renderWelcome, renderProfileCreate } from './welcome.js';
import { renderWorldMap, getWorld } from './worlds.js';
import { renderClickTargets } from './templates/click-targets.js';
import { renderHoverTarget } from './templates/hover-target.js';
import { renderCelebration } from './celebration.js';
import { getTask, getNextTask } from './tasks.js';

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
  activeWorldId: null,
  activeTaskId: null,
  lastTaskStars: 0,
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
      appRoot.append(renderWorldMap({
        onSelectWorld: (world) => {
          const active = profiles.getActive();
          const next = getNextTask(world.id, (active && active.completedTasks) || []);
          if (next) {
            state.activeWorldId = world.id;
            state.activeTaskId = next.id;
            setState(STATES.TASK);
          } else {
            audio.speak('סיימת את כל המשימות בעולם הזה! עוד יבואו בהמשך.');
          }
        },
        onBack: () => setState(STATES.WELCOME),
      }));
      break;

    case STATES.TASK: {
      const task = getTask(state.activeTaskId);
      if (!task) { setState(STATES.WORLD_MAP); break; }
      let view;
      const onTaskComplete = (t) => {
        const active = profiles.getActive();
        if (active) {
          profiles.markTaskComplete(active.id, t.id);
          profiles.addStars(active.id, t.starsOnComplete || 1);
        }
        state.lastTaskStars = t.starsOnComplete || 1;
        setState(STATES.CELEBRATION);
      };
      const onTaskExit = () => setState(STATES.WORLD_MAP);
      switch (task.template) {
        case 'click-targets':
          view = renderClickTargets(task, { onComplete: onTaskComplete, onExit: onTaskExit });
          break;
        case 'hover-target':
          view = renderHoverTarget(task, { onComplete: onTaskComplete, onExit: onTaskExit });
          break;
        default:
          view = renderTemplateNotImplemented(task);
      }
      appRoot.append(view);
      break;
    }

    case STATES.CELEBRATION:
      appRoot.append(renderCelebration({
        starsEarned: state.lastTaskStars || 1,
        onNext: () => {
          const active = profiles.getActive();
          const next = getNextTask(state.activeWorldId || 'mouse', (active && active.completedTasks) || []);
          if (next) {
            state.activeTaskId = next.id;
            setState(STATES.TASK);
          } else {
            setState(STATES.WORLD_MAP);
          }
        },
        onBackToMap: () => setState(STATES.WORLD_MAP),
      }));
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

function renderTemplateNotImplemented(task) {
  const wrap = document.createElement('div');
  wrap.className = 'screen';
  wrap.style.cssText = 'padding:32px; align-items:center; justify-content:center; text-align:center;';
  const h = document.createElement('h1');
  h.style.cssText = 'font-size:var(--font-size-h1); color:var(--color-text-emphasis);';
  h.textContent = 'תבנית עוד לא מוכנה';
  const sub = document.createElement('p');
  sub.style.cssText = 'font-size:var(--font-size-large); color:var(--color-text); margin:16px 0 24px;';
  sub.textContent = `תבנית "${task.template}" תיבנה בשלבים הבאים.`;
  wrap.append(h, sub);
  wrap.append(createButton({
    label: 'חזרה למפה',
    variant: 'secondary',
    onClick: () => setState(STATES.WORLD_MAP),
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
