// audio.js — Hebrew TTS service (he-IL, rate 0.85).
// Voice-first: every visible text the kid sees can be spoken.
// Per CLAUDE.md: rate 0.85, pitch 1.1, lang he-IL.

const LANG = 'he-IL';
const RATE = 0.85;
const PITCH = 1.1;
const HOVER_DELAY_MS = 600;

let voicesReady = false;
let preferredVoice = null;
let queue = [];
let speaking = false;

function loadVoices() {
  return new Promise((resolve) => {
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const hebrew = voices.filter(v => v.lang === LANG || v.lang.startsWith('he'));
        preferredVoice = hebrew[0] || null;
        voicesReady = true;
        resolve();
      }
    };
    pick();
    if (!voicesReady) {
      window.speechSynthesis.addEventListener('voiceschanged', () => { pick(); }, { once: true });
      setTimeout(() => { voicesReady = true; resolve(); }, 1000);
    }
  });
}

export async function init() {
  if (!('speechSynthesis' in window)) {
    console.warn('[audio] SpeechSynthesis not available');
    return;
  }
  await loadVoices();
}

export function speak(text, opts = {}) {
  if (!text || !('speechSynthesis' in window)) return;
  if (opts.interrupt !== false) {
    window.speechSynthesis.cancel();
    queue = [];
    speaking = false;
  }
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = opts.lang || LANG;
  utt.rate = opts.rate || RATE;
  utt.pitch = opts.pitch || PITCH;
  if (preferredVoice) utt.voice = preferredVoice;
  utt.onend = () => { speaking = false; processQueue(); };
  utt.onerror = () => { speaking = false; processQueue(); };
  if (speaking) {
    queue.push(utt);
  } else {
    speaking = true;
    window.speechSynthesis.speak(utt);
  }
}

function processQueue() {
  if (queue.length > 0) {
    const next = queue.shift();
    speaking = true;
    window.speechSynthesis.speak(next);
  }
}

export function stop() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  queue = [];
  speaking = false;
}

// Hover-to-narrate with 600ms delay. Used on every text element kids see.
// On touch devices, narrates on touchstart (no hover).
export function attachSpeakOnHover(element, text) {
  let timer = null;
  element.addEventListener('mouseenter', () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => speak(text), HOVER_DELAY_MS);
  });
  element.addEventListener('mouseleave', () => {
    if (timer) { clearTimeout(timer); timer = null; }
  });
  element.addEventListener('touchstart', () => speak(text), { passive: true });
}
