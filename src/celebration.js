// celebration.js — celebration screen after task completion.
import { createButton } from './ui/button.js';
import { speak } from './audio.js';
import { cueComplete } from './audio-cues.js';

const CELEBRATING_MASCOT = 'assets/mascot/professor-chachmoni-celebrating.svg';
const CONFETTI_COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#C9A0DC', '#6FC3DF'];

export function renderCelebration({ starsEarned = 1, onNext, onBackToMap } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'screen screen-celebration';

  // Confetti (17 static pieces)
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  for (let i = 0; i < 17; i++) {
    const c = document.createElement('span');
    const shape = ['sq', 'ci', 'tr'][i % 3];
    c.className = `confetti-piece ${shape}`;
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    if (shape === 'tr') c.style.color = color;
    else c.style.background = color;
    c.style.top = `${10 + (i * 13) % 110}px`;
    c.style.left = `${(i * 6) % 96}%`;
    confetti.append(c);
  }
  wrap.append(confetti);

  // Mascot
  const mascot = document.createElement('img');
  mascot.src = CELEBRATING_MASCOT;
  mascot.alt = 'חכמוני חוגג';
  mascot.className = 'celebration-mascot';
  wrap.append(mascot);

  // Headline + sub
  const headline = document.createElement('div');
  headline.className = 'headline';
  headline.textContent = 'כל הכבוד!';
  wrap.append(headline);

  const sub = document.createElement('div');
  sub.className = 'celebration-sub';
  const yellow = document.createElement('span');
  yellow.className = 'yellow';
  yellow.textContent = `+${starsEarned} ⭐`;
  const txt = document.createElement('span');
  txt.textContent = starsEarned === 1 ? 'כוכב חדש!' : 'כוכבים חדשים!';
  sub.append(yellow, txt);
  wrap.append(sub);

  // Buttons
  const buttons = document.createElement('div');
  buttons.className = 'celebration-buttons';
  if (onNext) {
    buttons.append(createButton({
      label: 'למשימה הבאה',
      variant: 'primary',
      onClick: onNext,
    }));
  }
  buttons.append(createButton({
    label: 'חזרה למפה',
    variant: 'secondary',
    onClick: onBackToMap,
  }));
  wrap.append(buttons);

  cueComplete();
  setTimeout(() => speak('כל הכבוד!'), 500);
  return wrap;
}
