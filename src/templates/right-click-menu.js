// templates/right-click-menu.js — "right-click to choose action" template.
// Originally deferred (Phase 3) — added back with kid-friendly tweaks:
// - "press-and-hold" (450ms) ALSO works as a fallback to right-click.
//   Kids 4-6 may not yet master right-click; long-press teaches the same concept.
// - The "menu" is one button only ("בחר"), turning the gesture into a single decision
//   not a navigation tree.

import { createButton } from '../ui/button.js';
import { attachSpeakOnHover, speak } from '../audio.js';
import { cueCorrect } from '../audio-cues.js';
import * as profiles from '../profiles.js';

const HOLD_MS = 450;

/**
 * @param {object} task
 * @param {object} ctx - { onComplete, onExit }
 */
export function renderRightClickMenu(task, { onComplete, onExit } = {}) {
  const cfg = task.config || {};
  const items = cfg.items || [
    { id: 'gift', icon: '🎁', label: 'מתנה' },
    { id: 'star', icon: '⭐', label: 'כוכב' },
    { id: 'apple', icon: '🍎', label: 'תפוח' },
  ];
  const total = items.length;
  const completed = new Set();

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

  // Grid of items
  const grid = document.createElement('div');
  grid.className = 'right-click-grid';

  for (const it of items) {
    const cell = document.createElement('div');
    cell.className = 'right-click-cell';
    cell.dataset.id = it.id;

    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'right-click-item';
    item.setAttribute('aria-label', it.label);
    item.setAttribute('aria-haspopup', 'menu');
    item.setAttribute('aria-expanded', 'false');
    item.textContent = it.icon;
    attachSpeakOnHover(item, it.label);

    const menu = document.createElement('div');
    menu.className = 'right-click-menu';
    menu.setAttribute('role', 'menu');
    const pickBtn = createButton({
      label: 'בחר',
      variant: 'primary',
      className: 'right-click-pick',
      onClick: () => choose(),
    });
    menu.append(pickBtn);

    function showMenu() {
      // Hide other open menus
      for (const c of grid.querySelectorAll('.right-click-cell.is-open')) {
        c.classList.remove('is-open');
        const trigger = c.querySelector('.right-click-item');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
      cell.classList.add('is-open');
      item.setAttribute('aria-expanded', 'true');
      speak('בחר ' + it.label);
      // Move focus to "choose" button so keyboard users land there
      const pick = cell.querySelector('.right-click-pick');
      if (pick) pick.focus();
    }
    function hideMenu() {
      cell.classList.remove('is-open');
      item.setAttribute('aria-expanded', 'false');
    }
    function choose() {
      if (completed.has(it.id)) { hideMenu(); return; }
      completed.add(it.id);
      cell.classList.add('is-completed');
      hideMenu();
      cueCorrect();
      speak('יפה!');
      const idx = completed.size - 1;
      if (progressStars[idx]) progressStars[idx].classList.remove('empty');
      if (completed.size >= total) {
        setTimeout(() => onComplete && onComplete(task), 600);
      }
    }

    // Right-click (native)
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (cell.classList.contains('is-completed')) return;
      showMenu();
    });

    // Keyboard: Enter / Space opens the menu (R-Final · a11y fix)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (cell.classList.contains('is-completed')) return;
        showMenu();
      } else if (e.key === 'Escape') {
        hideMenu();
      }
    });

    // Long-press fallback (touch + kids)
    let holdTimer = null;
    const startHold = () => {
      if (cell.classList.contains('is-completed')) return;
      holdTimer = setTimeout(() => { holdTimer = null; showMenu(); }, HOLD_MS);
    };
    const cancelHold = () => { if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; } };
    item.addEventListener('pointerdown', startHold);
    item.addEventListener('pointerup', cancelHold);
    item.addEventListener('pointerleave', cancelHold);
    item.addEventListener('pointercancel', cancelHold);

    cell.append(item, menu);
    grid.append(cell);
  }

  // Dismiss any open menu when clicking outside
  grid.addEventListener('click', (e) => {
    if (e.target.classList.contains('right-click-pick')) return;
    for (const c of grid.querySelectorAll('.right-click-cell.is-open')) {
      c.classList.remove('is-open');
    }
  });

  wrap.append(grid);
  wrap.append(progress);

  setTimeout(() => speak(task.narration || task.title), 600);
  return wrap;
}
