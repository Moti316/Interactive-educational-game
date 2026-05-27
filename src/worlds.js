// worlds.js — world data + world-map screen.
// 4 worlds. Mouse always unlocked. Others unlock when previous world has ≥N completed tasks.

import { createButton } from './ui/button.js';
import { attachSpeakOnHover, speak } from './audio.js';
import * as profiles from './profiles.js';
import { getAvatarById } from './ui/avatar-picker.js';
import { getProgress } from './tasks.js';

export const WORLDS = [
  { id: 'mouse',    name: 'עולם העכבר',   emoji: '🖱',  prereqCount: 0,  color: 'var(--color-sky)' },
  { id: 'keyboard', name: 'עולם המקלדת',  emoji: '⌨️',  prereqCount: 3,  prereqWorld: 'mouse',    color: 'var(--color-mint)' },
  { id: 'window',   name: 'עולם החלון',   emoji: '🪟',  prereqCount: 3,  prereqWorld: 'keyboard', color: 'var(--color-lavender)' },
  { id: 'browser',  name: 'עולם הדפדפן',  emoji: '🌐',  prereqCount: 2,  prereqWorld: 'window',   color: 'var(--color-sun)' },
];

export function getWorld(id) { return WORLDS.find(w => w.id === id) || null; }

export function isUnlocked(worldId, completedIds = []) {
  const w = getWorld(worldId);
  if (!w) return false;
  if (w.prereqCount === 0) return true;
  const p = getProgress(w.prereqWorld, completedIds);
  return p.done >= w.prereqCount;
}

/**
 * Render world-map screen.
 */
export function renderWorldMap({ onSelectWorld, onBack } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'screen screen-world-map';

  const active = profiles.getActive();
  const completed = (active && active.completedTasks) || [];

  // Header
  const header = document.createElement('div');
  header.className = 'screen-header world-header';

  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  if (active) {
    const av = getAvatarById(active.avatarId);
    const avatarImg = document.createElement('img');
    avatarImg.src = `assets/avatars/${av.file}`;
    avatarImg.alt = av.name;
    avatarImg.className = 'user-avatar';
    const userName = document.createElement('span');
    userName.className = 'user-name';
    userName.textContent = active.name;
    attachSpeakOnHover(avatarImg, active.name);
    userInfo.append(avatarImg, userName);
  }

  const headerRight = document.createElement('div');
  headerRight.className = 'header-right';

  const starCount = document.createElement('div');
  starCount.className = 'star-count';
  const star = document.createElement('span');
  star.className = 'star';
  star.textContent = '⭐';
  const count = document.createElement('span');
  count.textContent = active ? String(active.stars || 0) : '0';
  starCount.append(star, count);
  headerRight.append(starCount);

  headerRight.append(createButton({
    label: '🏠', ariaLabel: 'חזרה למסך פתיחה', variant: 'icon',
    onClick: () => onBack && onBack(),
  }));

  header.append(userInfo, headerRight);
  wrap.append(header);

  // Title
  const title = document.createElement('h1');
  title.textContent = 'בחר עולם';
  title.className = 'screen-title';
  attachSpeakOnHover(title, 'בחר עולם');
  wrap.append(title);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'world-grid';
  for (const w of WORLDS) {
    const unlocked = isUnlocked(w.id, completed);
    grid.append(createWorldCard(w, unlocked, completed, onSelectWorld));
  }
  wrap.append(grid);

  // Greet on mount
  if (active) setTimeout(() => speak(`שלום ${active.name}, בחר עולם`), 400);

  return wrap;
}

function createWorldCard(world, unlocked, completedIds, onSelectWorld) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'world-card';
  if (!unlocked) card.classList.add('is-locked');
  card.setAttribute('aria-label', world.name + (unlocked ? '' : ' (נעול)'));
  card.style.setProperty('--world-color', world.color);

  const emoji = document.createElement('div');
  emoji.className = 'world-emoji';
  emoji.textContent = unlocked ? world.emoji : '🔒';

  const name = document.createElement('div');
  name.className = 'world-name';
  name.textContent = world.name;

  card.append(emoji, name);

  if (unlocked) {
    const p = getProgress(world.id, completedIds);
    const meter = document.createElement('div');
    meter.className = 'world-progress';
    const bar = document.createElement('div');
    bar.className = 'world-progress-bar';
    bar.style.width = `${p.percent}%`;
    meter.append(bar);
    const label = document.createElement('div');
    label.className = 'world-progress-label';
    label.textContent = `${p.done}/${p.total}`;
    card.append(meter, label);
  }

  let speakText = world.name;
  if (!unlocked) {
    const prereq = getWorld(world.prereqWorld);
    speakText += `, נעול — סיים ${world.prereqCount} משימות ב${prereq ? prereq.name : ''}`;
  }
  attachSpeakOnHover(card, speakText);

  card.addEventListener('click', () => {
    if (!unlocked) { speak(speakText); return; }
    onSelectWorld && onSelectWorld(world);
  });
  return card;
}
