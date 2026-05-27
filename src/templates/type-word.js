// templates/type-word.js — "type a Hebrew word letter-by-letter" template.
// Big slots show each letter. Pressing the correct Hebrew letter fills the slot.
// Forgiving: wrong keys are ignored (no penalty), correct key advances.

import { createButton } from '../ui/button.js';
import { attachSpeakOnHover, speak } from '../audio.js';
import { cueCorrect } from '../audio-cues.js';
import * as profiles from '../profiles.js';

/**
 * @param {object} task - config: { word: 'אבא', narration?: '...' }
 */
export function renderTypeWord(task, { onComplete, onExit } = {}) {
  const cfg = task.config || {};
  const word = cfg.word || 'אבא';
  const letters = [...word];
  const total = letters.length;
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

  // Slots (RTL — first letter on the right)
  const slots = document.createElement('div');
  slots.className = 'type-word-slots';
  const slotEls = [];
  for (let i = 0; i < total; i++) {
    const slot = document.createElement('div');
    slot.className = 'type-word-slot';
    slot.dataset.target = letters[i];
    slot.textContent = '';
    if (i === 0) slot.classList.add('is-current');
    slots.append(slot);
    slotEls.push(slot);
  }
  wrap.append(slots);

  // Visual hint: the next-letter
  const hint = document.createElement('div');
  hint.className = 'type-word-hint';
  hint.textContent = 'הקלד: ' + letters[0];
  wrap.append(hint);

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
  wrap.append(progress);

  function advance() {
    slotEls[idx].textContent = letters[idx];
    slotEls[idx].classList.remove('is-current');
    slotEls[idx].classList.add('is-filled');
    if (progressStars[idx]) progressStars[idx].classList.remove('empty');
    idx++;
    if (idx >= total) {
      teardown();
      speak(word);
      setTimeout(() => onComplete && onComplete(task), 900);
      return;
    }
    slotEls[idx].classList.add('is-current');
    hint.textContent = 'הקלד: ' + letters[idx];
  }

  const onKey = (ev) => {
    const expected = letters[idx];
    if (ev.key === expected) {
      ev.preventDefault();
      cueCorrect();
      speak(expected);
      advance();
    }
    // Wrong keys: silently ignored (forgiving).
  };

  function teardown() { window.removeEventListener('keydown', onKey); }
  window.addEventListener('keydown', onKey);

  setTimeout(() => speak(task.narration || ('הקלד ' + word)), 600);
  return wrap;
}
