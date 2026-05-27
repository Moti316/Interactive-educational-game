// templates/key-press.js — "press the highlighted key" template.
// Teaches keyboard awareness. Single-key targets (Hebrew letters or arrow keys).

import { createButton } from '../ui/button.js';
import { attachSpeakOnHover, speak } from '../audio.js';
import { cueCorrect, cueWrong } from '../audio-cues.js';
import * as profiles from '../profiles.js';

const KEY_NAMES = {
  'ArrowUp': 'חץ למעלה', 'ArrowDown': 'חץ למטה',
  'ArrowLeft': 'חץ שמאלה', 'ArrowRight': 'חץ ימינה',
  ' ': 'רווח', 'Enter': 'אנטר', 'Escape': 'אסקייפ',
};
function describeKey(k) {
  return KEY_NAMES[k] || k;
}

/**
 * @param {object} task - config: { keys: ['ArrowLeft','ArrowRight',...] }
 * @param {object} ctx
 */
export function renderKeyPress(task, { onComplete, onExit } = {}) {
  const cfg = task.config || {};
  const targetKeys = cfg.keys || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
  const total = targetKeys.length;
  let idx = 0;

  const wrap = document.createElement('div');
  wrap.className = 'screen screen-task';

  // Header
  const header = document.createElement('div');
  header.className = 'screen-header task-header';
  const star = document.createElement('div'); star.className = 'star-count';
  const s = document.createElement('span'); s.className = 'star'; s.textContent = '⭐';
  const sc = document.createElement('span');
  const active = profiles.getActive();
  sc.textContent = active ? String(active.stars || 0) : '0';
  star.append(s, sc);
  const headerBtns = document.createElement('div'); headerBtns.className = 'header-right';
  headerBtns.append(createButton({
    label: '🔊', ariaLabel: 'שמע שוב את ההוראה', variant: 'icon',
    onClick: () => speak(task.narration || task.title),
  }));
  headerBtns.append(createButton({
    label: '🏠', ariaLabel: 'חזרה למפת העולמות', variant: 'icon',
    onClick: () => { teardown(); onExit && onExit(); },
  }));
  header.append(star, headerBtns);
  wrap.append(header);

  const title = document.createElement('h1');
  title.className = 'task-title';
  title.textContent = task.title;
  attachSpeakOnHover(title, task.title);
  wrap.append(title);

  // Progress
  const progress = document.createElement('div');
  progress.className = 'task-progress';
  const progressStars = [];
  for (let i = 0; i < total; i++) {
    const ps = document.createElement('span');
    ps.className = 'pstar empty';
    ps.textContent = '★';
    progress.append(ps);
    progressStars.push(ps);
  }

  // Big key display
  const stage = document.createElement('div');
  stage.className = 'key-press-stage';
  const cue = document.createElement('div');
  cue.className = 'key-press-cue';
  const keyVisual = document.createElement('div');
  keyVisual.className = 'key-press-key';
  cue.append(keyVisual);
  stage.append(cue);
  wrap.append(stage);
  wrap.append(progress);

  function renderTarget() {
    const k = targetKeys[idx];
    const display = describeKey(k);
    keyVisual.textContent = k.startsWith('Arrow') ? arrowSymbol(k) : (k === ' ' ? '⎵' : (k === 'Enter' ? '↵' : k));
    keyVisual.setAttribute('aria-label', display);
    setTimeout(() => speak(`לחץ על ${display}`), 100);
  }

  function arrowSymbol(k) {
    // Physical keys have universal glyphs — '→' is printed on the right-arrow
    // key on every keyboard regardless of OS language. R-Final fix: show the
    // symbol that matches the physical key, not the RTL-flipped reading.
    return { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→' }[k] || k;
  }

  const onKey = (ev) => {
    const expected = targetKeys[idx];
    // For arrow keys, use ev.code (physical key, locale-agnostic).
    // ev.key gets swapped by some Chrome configurations on RTL pages —
    // pressing physical Right could report 'ArrowLeft'. ev.code never lies.
    // For non-arrows (Space, Enter), ev.key is correct (' ' / 'Enter').
    const pressed = expected.startsWith('Arrow') ? ev.code : ev.key;
    if (pressed === expected) {
      ev.preventDefault();
      keyVisual.classList.add('is-correct');
      cueCorrect();
      speak('כל הכבוד!');
      if (progressStars[idx]) progressStars[idx].classList.remove('empty');
      idx++;
      if (idx >= total) {
        teardown();
        setTimeout(() => onComplete && onComplete(task), 600);
        return;
      }
      setTimeout(() => {
        keyVisual.classList.remove('is-correct');
        renderTarget();
      }, 700);
    } else {
      keyVisual.classList.add('is-wrong');
      cueWrong();
      setTimeout(() => keyVisual.classList.remove('is-wrong'), 400);
    }
  };

  function teardown() {
    window.removeEventListener('keydown', onKey);
  }
  window.addEventListener('keydown', onKey);

  renderTarget();
  setTimeout(() => speak(task.narration || task.title), 600);
  return wrap;
}
