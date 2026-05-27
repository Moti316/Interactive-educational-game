// audio-cues.js — Encouraging non-speech sounds (Web Audio API).
// Per CLAUDE.md: no MP3 binaries shipped; synth-based to keep repo small.
// Respects prefers-reduced-motion (interpreted as "less ambient flourish").

let ctx = null;
let muted = false;
let reducedMotion = false;

function init() {
  if (ctx) return;
  if (!('AudioContext' in window) && !('webkitAudioContext' in window)) return;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function play({ freq = 440, type = 'sine', duration = 0.2, gain = 0.2, slide = 0 }) {
  if (muted) return;
  init();
  if (!ctx) return;
  // resume on first interaction (some browsers require it)
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (slide) osc.frequency.linearRampToValueAtTime(freq + slide, ctx.currentTime + duration);
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(g).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function setMuted(m) { muted = Boolean(m); }
export function isMuted() { return muted; }

export function cueCorrect() {
  // Two ascending notes ("ding-ding")
  play({ freq: 660, type: 'triangle', duration: 0.15, gain: 0.18 });
  setTimeout(() => play({ freq: 880, type: 'triangle', duration: 0.18, gain: 0.16 }), 120);
}

export function cueWrong() {
  // Soft downward chirp — NOT harsh. Kids learn, never feel punished.
  play({ freq: 360, type: 'sine', duration: 0.2, gain: 0.12, slide: -80 });
}

export function cueComplete() {
  // Three notes ascending C-E-G
  if (reducedMotion) {
    play({ freq: 660, type: 'triangle', duration: 0.3, gain: 0.18 });
    return;
  }
  const notes = [523, 659, 784];
  notes.forEach((f, i) => setTimeout(() => play({ freq: f, type: 'triangle', duration: 0.25, gain: 0.2 }), i * 120));
}

export function cueClick() {
  play({ freq: 880, type: 'sine', duration: 0.05, gain: 0.06 });
}
