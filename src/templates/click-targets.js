// templates/click-targets.js — "click N targets" template.
// Used by balloon-popping / bubble-popping / similar simple tap-tasks.

import { createButton } from '../ui/button.js';
import { attachSpeakOnHover, speak } from '../audio.js';
import { cueCorrect } from '../audio-cues.js';
import * as profiles from '../profiles.js';

/**
 * Render a click-targets task.
 * @param {object} task - Task config (see tasks.js).
 * @param {object} ctx - { onComplete(task), onExit() }
 * @returns {HTMLElement}
 */
export function renderClickTargets(task, { onComplete, onExit } = {}) {
  const cfg = task.config || {};
  const total = cfg.count || 5;
  let popped = 0;

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

  // Balloons area
  const area = document.createElement('div');
  area.className = 'balloons-area';

  // Progress
  const progress = document.createElement('div');
  progress.className = 'task-progress';
  for (let i = 0; i < total; i++) {
    const ps = document.createElement('span');
    ps.className = 'pstar empty';
    ps.textContent = '★';
    progress.append(ps);
  }

  // Create targets (balloons)
  for (let i = 0; i < total; i++) {
    const color = (cfg.colors && cfg.colors[i]) || '#FF6B6B';
    const pos = (cfg.positions && cfg.positions[i]) || {
      top: `${10 + (i * 17) % 60}%`,
      left: `${15 + (i * 23) % 65}%`,
    };
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'balloon';
    b.setAttribute('aria-label', 'בלון');
    b.style.top = pos.top;
    b.style.left = pos.left;
    b.style.color = color;

    const body = document.createElement('div');
    body.className = 'balloon-body';
    const tie = document.createElement('div');
    tie.className = 'balloon-tie';
    const string = document.createElement('div');
    string.className = 'balloon-string';
    b.append(body, tie, string);

    b.addEventListener('click', () => {
      if (b.classList.contains('is-popped')) return;
      b.classList.add('is-popped');
      popped++;
      cueCorrect();
      // Fill next progress star
      const stars = progress.querySelectorAll('.pstar');
      if (stars[popped - 1]) stars[popped - 1].classList.remove('empty');
      // Encouraging feedback (every 2nd to avoid spam)
      if (popped < total && popped % 2 === 1) speak('יופי!');
      if (popped >= total) {
        // Done!
        setTimeout(() => { onComplete && onComplete(task); }, 500);
      }
    });
    area.append(b);
  }

  wrap.append(area);
  wrap.append(progress);

  // Speak instructions on mount
  setTimeout(() => speak(task.narration || task.title), 600);

  return wrap;
}
