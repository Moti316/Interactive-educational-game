// templates/hover-target.js — "hover to reveal" template.
// Teaches the hover mouse-gesture: kid moves cursor over mystery boxes,
// each reveals an emoji + plays its name on hover.

import { createButton } from '../ui/button.js';
import { attachSpeakOnHover, speak } from '../audio.js';
import * as profiles from '../profiles.js';

const EMOJI_NAMES = {
  '🐶': 'כלב', '🐱': 'חתול', '🐰': 'ארנב', '🦁': 'אריה',
  '🐼': 'פנדה', '🦊': 'שועל', '🐻': 'דוב', '🦋': 'פרפר',
  '⭐': 'כוכב', '🌈': 'קשת', '🌸': 'פרח', '🌞': 'שמש',
  '🎈': 'בלון', '🎁': 'מתנה', '🍎': 'תפוח', '🍦': 'גלידה',
  '🐢': 'צב', '🐸': 'צפרדע', '🐧': 'פינגווין', '🐝': 'דבורה',
};

function emojiName(emoji) {
  return EMOJI_NAMES[emoji] || 'יופי';
}

/**
 * Render a hover-target task.
 * @param {object} task
 * @param {object} ctx - { onComplete, onExit }
 * @returns {HTMLElement}
 */
export function renderHoverTarget(task, { onComplete, onExit } = {}) {
  const cfg = task.config || {};
  const reveals = cfg.reveals || ['🐶', '🐱', '🐰', '🦋', '⭐', '🌈'];
  const total = reveals.length;
  const discovered = new Set();

  const wrap = document.createElement('div');
  wrap.className = 'screen screen-task';

  // Header
  const header = document.createElement('div');
  header.className = 'screen-header task-header';
  const star = document.createElement('div');
  star.className = 'star-count';
  const s = document.createElement('span');
  s.className = 'star';
  s.textContent = '⭐';
  const sc = document.createElement('span');
  const active = profiles.getActive();
  sc.textContent = active ? String(active.stars || 0) : '0';
  star.append(s, sc);

  const headerBtns = document.createElement('div');
  headerBtns.className = 'header-right';
  headerBtns.append(createButton({
    label: '🔊',
    ariaLabel: 'שמע שוב את ההוראה',
    variant: 'icon',
    onClick: () => speak(task.narration || task.title),
  }));
  headerBtns.append(createButton({
    label: '🏠',
    ariaLabel: 'חזרה למפת העולמות',
    variant: 'icon',
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

  // Progress (created first, referenced by grid)
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

  // Grid of mystery boxes
  const grid = document.createElement('div');
  grid.className = 'hover-grid';

  for (let i = 0; i < total; i++) {
    const box = document.createElement('button');
    box.type = 'button';
    box.className = 'hover-box';
    box.setAttribute('aria-label', 'קופסה מסתורית');

    const front = document.createElement('div');
    front.className = 'hover-box-front';
    front.textContent = '?';
    const back = document.createElement('div');
    back.className = 'hover-box-back';
    back.textContent = reveals[i];
    box.append(front, back);

    const reveal = () => {
      if (box.classList.contains('is-revealed')) return;
      box.classList.add('is-revealed');
      discovered.add(i);
      speak(emojiName(reveals[i]));
      const idx = discovered.size - 1;
      if (progressStars[idx]) progressStars[idx].classList.remove('empty');
      if (discovered.size >= total) {
        setTimeout(() => onComplete && onComplete(task), 800);
      }
    };
    // Triggers: hover (mouse), focus (keyboard), touch / click (mobile + fallback)
    box.addEventListener('mouseenter', reveal);
    box.addEventListener('focus', reveal);
    box.addEventListener('touchstart', reveal, { passive: true });
    box.addEventListener('click', reveal);

    grid.append(box);
  }

  wrap.append(grid);
  wrap.append(progress);

  setTimeout(() => speak(task.narration || task.title), 600);
  return wrap;
}
