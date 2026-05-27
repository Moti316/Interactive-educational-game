// hebrew.js — light Hebrew gender-aware narration helper (R-Final fix).
// Profile has gender: 'boy' | 'girl' | 'neutral'.
// Imperative verbs in Hebrew vary by gender — this helper picks the form.

import * as profiles from './profiles.js';

/**
 * Pick the gendered form of a phrase based on the active profile.
 * Example: gendered({ boy: 'לחץ', girl: 'לחצי', neutral: 'לחצו' })
 * If profile is unknown, neutral is used.
 * @param {object} forms - { boy, girl, neutral }
 * @returns {string}
 */
export function gendered(forms) {
  const p = profiles.getActive();
  const g = (p && p.gender) || 'neutral';
  return forms[g] || forms.neutral || forms.boy || '';
}

/**
 * Most common case: "לחץ"/"לחצי"/"לחצו" + same suffix.
 * Example: imperative('press', 'על הבלון') → "לחצי על הבלון" (for girls).
 * Use sparingly — for tasks.js content we still ship masculine titles
 * because per-profile rewrite at render time is more work than it's worth.
 * This helper is for runtime feedback strings.
 * @param {'press'|'choose'|'try'|'find'|'type'} verb
 * @param {string} [suffix='']
 */
export function imperative(verb, suffix = '') {
  const TABLE = {
    press:  { boy: 'לחץ',   girl: 'לחצי',   neutral: 'לחצו' },
    choose: { boy: 'בחר',   girl: 'בחרי',   neutral: 'בחרו' },
    try:    { boy: 'נסה',   girl: 'נסי',    neutral: 'נסו' },
    find:   { boy: 'מצא',   girl: 'מצאי',   neutral: 'מצאו' },
    type:   { boy: 'הקלד',  girl: 'הקלידי', neutral: 'הקלידו' },
    drag:   { boy: 'גרור',  girl: 'גררי',   neutral: 'גררו' },
    look:   { boy: 'הסתכל', girl: 'הסתכלי', neutral: 'הסתכלו' },
  };
  const form = gendered(TABLE[verb] || { boy: verb, girl: verb, neutral: verb });
  return suffix ? `${form} ${suffix}` : form;
}

/**
 * Greeting variant by gender.
 * "שלום ילד" / "שלום ילדה" / "שלום חבר".
 */
export function greeting(name) {
  return gendered({
    boy:     `שלום ${name}`,
    girl:    `שלום ${name}`,
    neutral: `שלום ${name}`,
  });
  // Names are stored as-is; the actual differentiation lives in form-words like
  // "כל הכבוד" (gender-neutral) vs. "כל הכבוד לך גיבור/גיבורה" (variant).
}
