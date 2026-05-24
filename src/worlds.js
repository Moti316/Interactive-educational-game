// worlds.js — world data + world-map screen.
// MVP has 4 worlds; only 'mouse' unlocked at start. Others unlock per progress.

import { createButton } from './ui/button.js';
import { attachSpeakOnHover, speak } from './audio.js';
import * as profiles from './profiles.js';
import { getAvatarById } from './ui/avatar-picker.js';

export const WORLDS = [
  { id: 'mouse',    name: 'עולם העכבר',   emoji: '🖱',  unlocked: true,  color: 'var(--color-sky)' },
  { id: 'keyboard', name: 'עולם המקלדת',  emoji: '⌨️',  unlocked: false, color: 'var(--color-mint)' },
  { id: 'window',   name: 'עולם החלון',   emoji: '🪟',  unlocked: false, color: 'var(--color-lavender)' },
  { id: 'browser',  name: 'עולם הדפדפן',  emoji: '🌐',  unlocked: false, color: 'var(--color-sun)' },
];

export function getWorld(id) { return WORLDS.find(w => w.id === id) || null; }

/**
 * Render world-map screen.
 * @param {object} ctx - { onSelectWorld(world), onBack(), onOpenSettings() }
 */
export function renderWorldMap({ onSelectWorld, onBack } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'screen screen-world-map';

  // Header
  const header = document.createElement('div');
  header.className = 'screen-header world-header';

  const active = profiles.getActive();
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
    label: '🏠',
    ariaLabel: 'חזרה למסך פתיחה',
    variant: 'icon',
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
    grid.append(createWorldCard(w, onSelectWorld));
  }
  wrap.append(grid);

  // Greet on mount
  if (active) setTimeout(() => speak(`שלום ${active.name}, בחר עולם`), 400);

  return wrap;
}

function createWorldCard(world, onSelectWorld) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'world-card';
  if (!world.unlocked) card.classList.add('is-locked');
  card.setAttribute('aria-label', world.name + (world.unlocked ? '' : ' (נעול)'));
  card.style.setProperty('--world-color', world.color);

  const emoji = document.createElement('div');
  emoji.className = 'world-emoji';
  emoji.textContent = world.unlocked ? world.emoji : '🔒';

  const name = document.createElement('div');
  name.className = 'world-name';
  name.textContent = world.name;

  card.append(emoji, name);

  attachSpeakOnHover(card, world.name + (world.unlocked ? '' : ', נעול'));

  card.addEventListener('click', () => {
    if (!world.unlocked) {
      speak('עולם זה עוד נעול');
      return;
    }
    onSelectWorld && onSelectWorld(world);
  });
  return card;
}
