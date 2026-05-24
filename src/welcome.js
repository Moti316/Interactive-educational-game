// welcome.js — Welcome screen (profile select) + first-run / profile-create wizard.

import { createButton } from './ui/button.js';
import { createAvatarPicker, getAvatarById } from './ui/avatar-picker.js';
import * as profiles from './profiles.js';
import { speak, attachSpeakOnHover } from './audio.js';

const MASCOT_GREETING = 'assets/mascot/professor-chachmoni-standing-wave.svg';

/**
 * Welcome screen: profile select + new profile + parent settings.
 * @param {object} ctx - callbacks for state machine
 * @returns {HTMLElement}
 */
export function renderWelcome({ onSelectProfile, onCreateNew, onOpenSettings } = {}) {
  const children = profiles.listChildren();

  const wrap = document.createElement('div');
  wrap.className = 'screen screen-welcome';

  // Greeting
  const greeting = document.createElement('div');
  greeting.className = 'welcome-greeting';
  const mascot = document.createElement('img');
  mascot.src = MASCOT_GREETING;
  mascot.alt = "פרופ' חכמוני";
  mascot.className = 'welcome-mascot';
  const title = document.createElement('h1');
  title.textContent = 'חכמוני';
  title.className = 'welcome-title';
  greeting.append(mascot, title);
  wrap.append(greeting);

  // Profile row
  const row = document.createElement('div');
  row.className = 'profile-row';
  for (const p of children) {
    row.append(createProfileCard(p, () => onSelectProfile && onSelectProfile(p.id)));
  }

  // "+ new" card
  const newCard = document.createElement('button');
  newCard.type = 'button';
  newCard.className = 'profile-card new';
  newCard.setAttribute('aria-label', 'יצירת פרופיל חדש');
  const plus = document.createElement('div');
  plus.className = 'plus';
  plus.textContent = '+';
  const newName = document.createElement('div');
  newName.className = 'name';
  newName.textContent = 'פרופיל חדש';
  newCard.append(plus, newName);
  attachSpeakOnHover(newCard, 'פרופיל חדש');
  newCard.addEventListener('click', () => onCreateNew && onCreateNew());
  row.append(newCard);

  wrap.append(row);

  // Parent settings
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'btn-parent-settings welcome-settings';
  settings.setAttribute('aria-label', 'הגדרות הורים');
  settings.textContent = '⚙';
  settings.addEventListener('click', () => onOpenSettings && onOpenSettings());
  wrap.append(settings);

  return wrap;
}

function createProfileCard(profile, onClick) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'profile-card';
  card.setAttribute('aria-label', profile.name);

  const av = getAvatarById(profile.avatarId);
  const img = document.createElement('img');
  img.src = `assets/avatars/${av.file}`;
  img.alt = av.name;
  img.className = 'avatar';
  card.append(img);

  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = profile.name;
  card.append(name);

  attachSpeakOnHover(card, profile.name);
  card.addEventListener('click', onClick);
  return card;
}

/**
 * Profile create / first-run wizard.
 * Asks name + gender + avatar, then saves & calls onComplete(id).
 */
export function renderProfileCreate({ onComplete, onCancel, isFirstRun = false } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'screen screen-create';

  // Greeting (only on first run)
  if (isFirstRun) {
    const greet = document.createElement('div');
    greet.className = 'welcome-greeting';
    const mascot = document.createElement('img');
    mascot.src = MASCOT_GREETING;
    mascot.alt = "פרופ' חכמוני";
    mascot.className = 'welcome-mascot';
    greet.append(mascot);
    const hello = document.createElement('h1');
    hello.className = 'welcome-title';
    hello.textContent = 'שלום! אני חכמוני';
    greet.append(hello);
    wrap.append(greet);
    setTimeout(() => speak('שלום! אני חכמוני. בואו ניצור לך פרופיל'), 300);
  }

  const title = document.createElement('h2');
  title.className = 'create-title';
  title.textContent = isFirstRun ? 'בואו ניצור פרופיל' : 'פרופיל חדש';
  wrap.append(title);

  // Name input
  const nameWrap = document.createElement('label');
  nameWrap.className = 'create-field';
  const nameLabel = document.createElement('span');
  nameLabel.className = 'create-label';
  nameLabel.textContent = 'איך קוראים לך?';
  attachSpeakOnHover(nameLabel, 'איך קוראים לך?');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'create-input';
  nameInput.dir = 'rtl';
  nameInput.maxLength = 20;
  nameInput.setAttribute('aria-label', 'הזן את שמך');
  nameInput.placeholder = 'השם שלי…';
  nameWrap.append(nameLabel, nameInput);
  wrap.append(nameWrap);

  // Gender picker
  const genderWrap = document.createElement('div');
  genderWrap.className = 'create-field';
  const genderLabel = document.createElement('span');
  genderLabel.className = 'create-label';
  genderLabel.textContent = 'אני…';
  attachSpeakOnHover(genderLabel, 'אני');
  genderWrap.append(genderLabel);
  const genderOptions = document.createElement('div');
  genderOptions.className = 'gender-options';
  let selectedGender = 'neutral';
  const genderChoices = [
    { value: 'boy', label: 'בן' },
    { value: 'girl', label: 'בת' },
    { value: 'neutral', label: 'לא משנה' },
  ];
  for (const c of genderChoices) {
    const opt = document.createElement('button');
    opt.type = 'button';
    opt.className = 'gender-option';
    opt.textContent = c.label;
    if (c.value === selectedGender) opt.classList.add('is-selected');
    attachSpeakOnHover(opt, c.label);
    opt.addEventListener('click', () => {
      selectedGender = c.value;
      for (const x of genderOptions.children) x.classList.remove('is-selected');
      opt.classList.add('is-selected');
    });
    genderOptions.append(opt);
  }
  genderWrap.append(genderOptions);
  wrap.append(genderWrap);

  // Avatar picker
  const avatarLabel = document.createElement('span');
  avatarLabel.className = 'create-label create-label-block';
  avatarLabel.textContent = 'בחר חיה';
  attachSpeakOnHover(avatarLabel, 'בחר חיה');
  wrap.append(avatarLabel);
  let selectedAvatarId = 1;
  const picker = createAvatarPicker({
    selected: selectedAvatarId,
    onSelect: (av) => { selectedAvatarId = av.id; },
  });
  wrap.append(picker);

  // Actions
  const buttons = document.createElement('div');
  buttons.className = 'create-buttons';

  const saveBtn = createButton({
    label: 'שמור',
    variant: 'primary',
    onClick: () => {
      const name = (nameInput.value || '').trim();
      if (!name) {
        speak('צריך לכתוב שם');
        nameInput.focus();
        nameInput.classList.add('is-error');
        setTimeout(() => nameInput.classList.remove('is-error'), 1500);
        return;
      }
      try {
        const id = profiles.create({
          name,
          gender: selectedGender,
          avatarId: selectedAvatarId,
          kind: 'child',
        });
        profiles.setActive(id);
        speak('כל הכבוד, ' + name + '!');
        if (onComplete) onComplete(id);
      } catch (err) {
        console.error('[welcome] create failed:', err);
        speak('אופס, ננסה שוב');
      }
    },
  });
  buttons.append(saveBtn);

  if (!isFirstRun && onCancel) {
    const cancelBtn = createButton({
      label: 'ביטול',
      variant: 'secondary',
      onClick: onCancel,
    });
    buttons.append(cancelBtn);
  }
  wrap.append(buttons);

  // Focus name input after mount
  setTimeout(() => nameInput.focus(), 100);
  return wrap;
}
