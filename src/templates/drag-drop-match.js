// templates/drag-drop-match.js — "drag item to matching slot" template.
// Uses pointer events (works for both mouse and touch).

import { createButton } from '../ui/button.js';
import { attachSpeakOnHover, speak } from '../audio.js';
import * as profiles from '../profiles.js';

/**
 * Render a drag-drop-match task.
 * Items are scrambled. Drag each to its matching slot.
 * Wrong drop → bounces back + gentle "ננסה שוב". Correct → locks in place.
 */
export function renderDragDropMatch(task, { onComplete, onExit } = {}) {
  const cfg = task.config || {};
  const pairs = cfg.pairs || [
    { id: 'a', icon: '🐶', label: 'כלב' },
    { id: 'b', icon: '🐱', label: 'חתול' },
    { id: 'c', icon: '🐰', label: 'ארנב' },
  ];
  const total = pairs.length;
  const matched = new Set();

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

  // Slots (targets) — labels in original order
  const slotsRow = document.createElement('div');
  slotsRow.className = 'dnd-slots';
  for (const p of pairs) {
    const slot = document.createElement('div');
    slot.className = 'dnd-slot';
    slot.dataset.pairId = p.id;
    slot.textContent = p.label;
    attachSpeakOnHover(slot, p.label);
    slotsRow.append(slot);
  }

  // Items (sources) — icons, scrambled
  const itemsRow = document.createElement('div');
  itemsRow.className = 'dnd-items';
  const shuffled = [...pairs].sort(() => Math.random() - 0.5);

  for (const p of shuffled) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'dnd-item';
    item.dataset.pairId = p.id;
    item.setAttribute('aria-label', p.label);
    item.textContent = p.icon;
    attachSpeakOnHover(item, p.label);

    let pointerId = null;
    let originRect = null;
    let dragging = false;

    const startDrag = (e) => {
      if (item.classList.contains('is-matched')) return;
      pointerId = e.pointerId;
      originRect = item.getBoundingClientRect();
      dragging = true;
      item.setPointerCapture(pointerId);
      item.classList.add('is-dragging');
      // Lift out of layout for free movement
      item.style.position = 'fixed';
      item.style.zIndex = '9999';
      item.style.left = `${originRect.left}px`;
      item.style.top = `${originRect.top}px`;
      item.style.width = `${originRect.width}px`;
      item.style.height = `${originRect.height}px`;
    };

    const moveDrag = (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      item.style.left = `${e.clientX - originRect.width / 2}px`;
      item.style.top = `${e.clientY - originRect.height / 2}px`;
      // Highlight slot under pointer
      item.style.pointerEvents = 'none';
      const target = document.elementFromPoint(e.clientX, e.clientY);
      item.style.pointerEvents = '';
      slotsRow.querySelectorAll('.dnd-slot').forEach(s => s.classList.remove('is-hover'));
      if (target && target.classList.contains('dnd-slot') && !target.classList.contains('is-matched')) {
        target.classList.add('is-hover');
      }
    };

    const endDrag = (e) => {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false;
      try { item.releasePointerCapture(pointerId); } catch {}
      slotsRow.querySelectorAll('.dnd-slot').forEach(s => s.classList.remove('is-hover'));

      item.style.pointerEvents = 'none';
      const target = document.elementFromPoint(e.clientX, e.clientY);
      item.style.pointerEvents = '';

      const matchesSlot = target && target.classList.contains('dnd-slot') && target.dataset.pairId === item.dataset.pairId && !target.classList.contains('is-matched');

      if (matchesSlot) {
        // Snap to slot
        const slotRect = target.getBoundingClientRect();
        item.style.left = `${slotRect.left + slotRect.width / 2 - originRect.width / 2}px`;
        item.style.top  = `${slotRect.top  + slotRect.height / 2 - originRect.height / 2}px`;
        target.classList.add('is-matched');
        item.classList.add('is-matched');
        matched.add(p.id);
        speak('יופי!');
        const idx = matched.size - 1;
        if (progressStars[idx]) progressStars[idx].classList.remove('empty');
        if (matched.size >= total) {
          setTimeout(() => onComplete && onComplete(task), 700);
        }
      } else {
        // Bounce back
        const wrongSlot = target && target.classList.contains('dnd-slot') ? target : null;
        if (wrongSlot) {
          wrongSlot.classList.add('is-wrong');
          setTimeout(() => wrongSlot.classList.remove('is-wrong'), 500);
        }
        speak('ננסה שוב');
        // Restore inline-flow position
        item.style.position = '';
        item.style.zIndex = '';
        item.style.left = '';
        item.style.top = '';
        item.style.width = '';
        item.style.height = '';
        item.classList.remove('is-dragging');
      }
      pointerId = null;
    };

    item.addEventListener('pointerdown', startDrag);
    item.addEventListener('pointermove', moveDrag);
    item.addEventListener('pointerup', endDrag);
    item.addEventListener('pointercancel', endDrag);

    itemsRow.append(item);
  }

  wrap.append(slotsRow);
  wrap.append(itemsRow);
  wrap.append(progress);

  setTimeout(() => speak(task.narration || task.title), 600);
  return wrap;
}
