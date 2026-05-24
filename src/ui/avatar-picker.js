// ui/avatar-picker.js — 12-avatar selection grid.
// Used in profile creation. Each avatar speaks its name on hover.

import { attachSpeakOnHover } from '../audio.js';

const AVATARS = [
  { id: 1,  kind: 'rabbit',    name: 'ארנב',   file: 'avatar-01-rabbit.svg' },
  { id: 2,  kind: 'cat',       name: 'חתול',   file: 'avatar-02-cat.svg' },
  { id: 3,  kind: 'lion',      name: 'אריה',   file: 'avatar-03-lion.svg' },
  { id: 4,  kind: 'elephant',  name: 'פיל',    file: 'avatar-04-elephant.svg' },
  { id: 5,  kind: 'frog',      name: 'צפרדע',  file: 'avatar-05-frog.svg' },
  { id: 6,  kind: 'owl',       name: 'ינשוף',  file: 'avatar-06-owl.svg' },
  { id: 7,  kind: 'bear',      name: 'דוב',    file: 'avatar-07-bear.svg' },
  { id: 8,  kind: 'dog',       name: 'כלב',    file: 'avatar-08-dog.svg' },
  { id: 9,  kind: 'fish',      name: 'דג',     file: 'avatar-09-fish.svg' },
  { id: 10, kind: 'butterfly', name: 'פרפר',   file: 'avatar-10-butterfly.svg' },
  { id: 11, kind: 'robot',     name: 'רובוט',  file: 'avatar-11-robot.svg' },
  { id: 12, kind: 'star',      name: 'כוכב',   file: 'avatar-12-star.svg' },
];

export const AVATAR_LIST = AVATARS;

export function getAvatarById(id) {
  return AVATARS.find(a => a.id === Number(id)) || AVATARS[0];
}

/**
 * Create avatar picker (4×3 grid).
 * @param {object} opts
 * @param {number} [opts.selected=1] - Initially selected avatar id.
 * @param {Function} [opts.onSelect] - Called with avatar object on selection.
 * @returns {HTMLElement}
 */
export function createAvatarPicker({ selected = 1, onSelect } = {}) {
  const container = document.createElement('div');
  container.className = 'avatar-picker';
  container.setAttribute('role', 'radiogroup');
  container.setAttribute('aria-label', 'בחר אווטאר');

  for (const av of AVATARS) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'avatar-cell';
    cell.setAttribute('role', 'radio');
    cell.setAttribute('aria-label', av.name);
    cell.dataset.avatarId = String(av.id);
    const isSelected = av.id === Number(selected);
    cell.setAttribute('aria-checked', String(isSelected));
    if (isSelected) cell.classList.add('is-selected');

    const img = document.createElement('img');
    img.src = `assets/avatars/${av.file}`;
    img.alt = av.name;
    img.className = 'avatar-cell-img';
    cell.append(img);

    const label = document.createElement('span');
    label.className = 'avatar-cell-name';
    label.textContent = av.name;
    cell.append(label);

    attachSpeakOnHover(cell, av.name);

    cell.addEventListener('click', () => {
      for (const c of container.children) {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      }
      cell.classList.add('is-selected');
      cell.setAttribute('aria-checked', 'true');
      if (onSelect) onSelect(av);
    });

    container.append(cell);
  }
  return container;
}
