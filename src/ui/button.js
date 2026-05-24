// ui/button.js — Button factory. ALL buttons must go through here.
// Per CLAUDE.md security rule: textContent only, NEVER innerHTML.

import { attachSpeakOnHover } from '../audio.js';

const VARIANTS = ['primary', 'secondary', 'icon', 'parent-settings'];

/**
 * Create a button with consistent styling + voice-first hover.
 *
 * @param {object} opts
 * @param {string} opts.label - Visible text (used for textContent and hover narration).
 * @param {Function} [opts.onClick] - Click handler.
 * @param {'primary'|'secondary'|'icon'|'parent-settings'} [opts.variant='primary']
 * @param {boolean} [opts.speakOnHover=true] - Narrate label on hover (600ms delay).
 * @param {string} [opts.ariaLabel] - Override aria-label (e.g. for icon buttons where label is emoji).
 * @param {string} [opts.className] - Additional CSS classes.
 * @returns {HTMLButtonElement}
 */
export function createButton({
  label,
  onClick,
  variant = 'primary',
  speakOnHover = true,
  ariaLabel = null,
  className = '',
}) {
  if (!VARIANTS.includes(variant)) {
    console.warn('[button] unknown variant, falling back to primary:', variant);
    variant = 'primary';
  }
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `btn-${variant} ${className}`.trim();
  // SECURITY: textContent only. Never innerHTML with kid- or AI-content.
  btn.textContent = label || '';
  if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
  if (onClick) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      onClick(e);
    });
  }
  // Voice-first: narrate the label on hover. Use ariaLabel if label is emoji.
  if (speakOnHover) {
    const spokenText = ariaLabel || label;
    if (spokenText) attachSpeakOnHover(btn, spokenText);
  }
  return btn;
}
