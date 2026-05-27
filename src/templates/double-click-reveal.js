// templates/double-click-reveal.js — "double-click to open" template.
// Teaches the double-click mouse gesture (with a forgiving 600ms window
// since the dblclick event is too strict for kids 4-6).

import { createButton } from '../ui/button.js';
import { attachSpeakOnHover, speak } from '../audio.js';
import { cueCorrect } from '../audio-cues.js';
import * as profiles from '../profiles.js';

const DBLCLICK_WINDOW_MS = 600;

/**
 * Render a double-click-reveal task.
 * Each box opens on double-click (or 2 clicks within 600ms) and reveals an emoji.
 */
export function renderDoubleClickReveal(task, { onComplete, onExit } = {}) {
  const cfg = task.config || {};
  const reveals = cfg.reveals || ['🐶', '🐱', '🐰', '⭐', '🌈'];
  const total = reveals.length;
  const opened = new Set();

  const wrap = document.createElement('div');
  wrap.className = 'screen screen-task';

  // Header
  const header = document.createElement('div');
  header.className = 'screen-header task-header';
  const star = document.createElement('div');
  star.className = 'star-count';
  const s = document.createElement('span'); s.className = 'star'; s.textContent = '⭐';
  const sc = document.createElement('span');
  const active = profiles.getActive();
  sc.textContent = active ? String(active.stars || 0) : '0';
  star.append(s, sc);

  const headerBtns = document.createElement('div');
  headerBtns.className = 'header-right';
  headerBtns.append(createButton({
    label: '🔊', ariaLabel: 'שמע שוב את ההוראה', variant: 'icon',
    onClick: () => speak(task.narration || task.title),
  }));
  headerBtns.append(createButton({
    label: '🏠', ariaLabel: 'חזרה למפת העולמות', variant: 'icon',
    onClick: () => onExit && onExit(),
  }));
  header.append(star, headerBtns);
  wrap.append(header);

  // Title
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

  // Grid of boxes
  const grid = document.createElement('div');
  grid.className = 'dblclick-grid';

  for (let i = 0; i < total; i++) {
    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'dblclick-box';
    box.setAttribute('aria-label', 'תיבה. לחץ פעמיים כדי לפתוח');

    const closed = document.createElement('div');
    closed.className = 'dblclick-closed';
    closed.textContent = '🎁';
    const opened_div = document.createElement('div');
    opened_div.className = 'dblclick-open';
    opened_div.textContent = reveals[i];
    box.append(closed, opened_div);

    const openBox = () => {
      if (box.classList.contains('is-open')) return;
      box.classList.add('is-open');
      opened.add(i);
      cueCorrect();
      speak('יופי!');
      const idx = opened.size - 1;
      if (progressStars[idx]) progressStars[idx].classList.remove('empty');
      if (opened.size >= total) {
        setTimeout(() => onComplete && onComplete(task), 700);
      }
    };

    let lastClick = 0;
    box.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastClick < DBLCLICK_WINDOW_MS) openBox();
      lastClick = now;
    });
    box.addEventListener('dblclick', openBox); // mouse-native

    grid.append(box);
  }

  wrap.append(grid);
  wrap.append(progress);

  setTimeout(() => speak(task.narration || task.title), 600);
  return wrap;
}
