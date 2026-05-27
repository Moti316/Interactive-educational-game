// templates/point-and-narrate.js — "point at each part to learn it" template.
// Used for worlds 3 (window) and 4 (browser): the kid hovers/clicks on labeled
// parts of an illustration, each narrates its name and brief description.
// Completion: every labeled part has been pointed-at at least once.

import { createButton } from '../ui/button.js';
import { attachSpeakOnHover, speak } from '../audio.js';
import * as profiles from '../profiles.js';

/**
 * @param {object} task - config: {
 *   scene: 'window' | 'browser',
 *   parts: [{ id, label, pos: { top, left, width?, height? }, color?, narration? }, ...]
 * }
 */
export function renderPointAndNarrate(task, { onComplete, onExit } = {}) {
  const cfg = task.config || {};
  const parts = cfg.parts || [];
  const total = parts.length;
  const visited = new Set();

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
    onClick: () => onExit && onExit(),
  }));
  header.append(star, headerBtns);
  wrap.append(header);

  const title = document.createElement('h1');
  title.className = 'task-title';
  title.textContent = task.title;
  attachSpeakOnHover(title, task.title);
  wrap.append(title);

  // Scene
  const scene = document.createElement('div');
  scene.className = `point-narrate-scene scene-${cfg.scene || 'generic'}`;
  scene.setAttribute('aria-label', 'איור עם חלקים מסומנים');

  // Background scene rendering — simple geometric shapes via SVG.
  // We draw a basic window or browser mockup in pure SVG so it's RTL-safe,
  // scales, and is screen-reader friendly via labels on each hot-spot.
  scene.append(buildBackdrop(cfg.scene));

  // Hot-spots (labeled parts)
  const progressLabel = document.createElement('div');
  progressLabel.className = 'point-narrate-progress';
  const updateLabel = () => {
    progressLabel.textContent = `גילית ${visited.size} מתוך ${total} חלקים`;
  };
  updateLabel();

  for (const part of parts) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'point-narrate-hotspot';
    dot.dataset.id = part.id;
    dot.setAttribute('aria-label', part.label);
    if (part.color) dot.style.setProperty('--hotspot-color', part.color);
    if (part.pos) {
      if (part.pos.top != null) dot.style.top = part.pos.top;
      if (part.pos.left != null) dot.style.left = part.pos.left;
      if (part.pos.width != null) dot.style.width = part.pos.width;
      if (part.pos.height != null) dot.style.height = part.pos.height;
    }
    const pulse = document.createElement('span');
    pulse.className = 'hotspot-pulse';
    const label = document.createElement('span');
    label.className = 'hotspot-label';
    label.textContent = part.label;
    dot.append(pulse, label);
    attachSpeakOnHover(dot, part.narration || part.label);

    const reveal = () => {
      if (visited.has(part.id)) return;
      visited.add(part.id);
      dot.classList.add('is-visited');
      speak(part.narration || part.label);
      updateLabel();
      if (visited.size >= total) {
        setTimeout(() => onComplete && onComplete(task), 1000);
      }
    };
    dot.addEventListener('click', reveal);
    dot.addEventListener('focus', reveal);
    dot.addEventListener('mouseenter', reveal);

    scene.append(dot);
  }
  wrap.append(scene);
  wrap.append(progressLabel);

  setTimeout(() => speak(task.narration || task.title), 600);
  return wrap;
}

function buildBackdrop(sceneType) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 800 480');
  svg.setAttribute('class', 'point-narrate-backdrop');
  svg.setAttribute('aria-hidden', 'true');

  if (sceneType === 'browser') {
    appendRect(svg, 60, 60, 680, 360, '#FFFCF2', '#2D2A26', 18);
    appendRect(svg, 60, 60, 680, 56, '#F5F1E8', '#2D2A26', 18);
    appendCircle(svg, 96, 88, 8, '#FF6B6B');
    appendCircle(svg, 120, 88, 8, '#FFD93D');
    appendCircle(svg, 144, 88, 8, '#6BCB77');
    appendRect(svg, 200, 76, 480, 32, '#FFFFFF', '#C9C2B0', 16);
  } else if (sceneType === 'window') {
    appendRect(svg, 80, 60, 640, 360, '#FFFCF2', '#2D2A26', 12);
    appendRect(svg, 80, 60, 640, 40, '#F5F1E8', '#2D2A26', 12);
    appendRect(svg, 660, 70, 24, 20, '#FF6B6B', '#2D2A26', 4);
    appendRect(svg, 626, 70, 24, 20, '#FFD93D', '#2D2A26', 4);
    appendRect(svg, 592, 70, 24, 20, '#6BCB77', '#2D2A26', 4);
  } else {
    appendRect(svg, 60, 60, 680, 360, '#FFFCF2', '#2D2A26', 16);
  }
  return svg;
}

function appendRect(svg, x, y, w, h, fill, stroke, r) {
  const r1 = document.createElementNS(svg.namespaceURI, 'rect');
  r1.setAttribute('x', x); r1.setAttribute('y', y);
  r1.setAttribute('width', w); r1.setAttribute('height', h);
  r1.setAttribute('fill', fill);
  if (stroke) { r1.setAttribute('stroke', stroke); r1.setAttribute('stroke-width', '2'); }
  if (r) { r1.setAttribute('rx', r); r1.setAttribute('ry', r); }
  svg.append(r1);
}
function appendCircle(svg, cx, cy, r, fill) {
  const c = document.createElementNS(svg.namespaceURI, 'circle');
  c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
  c.setAttribute('fill', fill);
  svg.append(c);
}
