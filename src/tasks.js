// tasks.js — All task data. ~50 tasks across 4 worlds × ~8 templates.
// Naming: task-{worldId}-{kebab-skill-name}  (per CLAUDE.md).

export const TASKS = [
  // ============================================================
  // WORLD: MOUSE — click / hover / dblclick / drag / right-click
  // ============================================================

  // --- click-targets ---
  {
    id: 'task-mouse-balloons',
    worldId: 'mouse',
    template: 'click-targets',
    title: 'פוצצו את הבלונים!',
    narration: 'פוצצו את הבלונים על-ידי לחיצה עליהם.',
    config: {
      count: 5,
      colors: ['#FF6B6B', '#6BCB77', '#FFD93D', '#C9A0DC', '#FF6B6B'],
      positions: [
        { top: '10%', left: '14%' }, { top: '8%',  left: '62%' },
        { top: '38%', left: '34%' }, { top: '32%', left: '70%' },
        { top: '56%', left: '48%' },
      ],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-bubbles',
    worldId: 'mouse',
    template: 'click-targets',
    title: 'פוצצו את הבועות!',
    narration: 'פוצצו את הבועות על-ידי לחיצה עליהן.',
    config: {
      count: 5,
      colors: ['#6FC3DF', '#C9A0DC', '#6BCB77', '#FFD93D', '#6FC3DF'],
      positions: [
        { top: '12%', left: '20%' }, { top: '24%', left: '60%' },
        { top: '46%', left: '18%' }, { top: '40%', left: '64%' },
        { top: '60%', left: '40%' },
      ],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-stars',
    worldId: 'mouse',
    template: 'click-targets',
    title: 'אסוף כוכבים!',
    narration: 'לחץ על כל הכוכבים כדי לאסוף אותם.',
    config: {
      count: 6,
      colors: ['#FFD93D', '#FFD93D', '#FFD93D', '#FFD93D', '#FFD93D', '#FFD93D'],
      positions: [
        { top: '8%',  left: '12%' }, { top: '14%', left: '46%' },
        { top: '20%', left: '76%' }, { top: '44%', left: '22%' },
        { top: '50%', left: '58%' }, { top: '64%', left: '40%' },
      ],
    },
    starsOnComplete: 1,
  },

  // --- hover-target ---
  {
    id: 'task-mouse-hover-animals',
    worldId: 'mouse',
    template: 'hover-target',
    title: 'גלה מה מסתתר!',
    narration: 'העבר את העכבר על הקופסאות כדי לגלות מה בפנים.',
    config: { reveals: ['🐶', '🐱', '🐰', '🦋', '⭐', '🌈'] },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-hover-objects',
    worldId: 'mouse',
    template: 'hover-target',
    title: 'מה מסתתר בקופסאות?',
    narration: 'העבר את העכבר על הקופסאות. כל אחת מסתירה משהו אחר.',
    config: { reveals: ['🎈', '🎁', '🍎', '🌞', '🌸', '🐝'] },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-hover-fruits',
    worldId: 'mouse',
    template: 'hover-target',
    title: 'מצא את הפירות',
    narration: 'העבר את העכבר על הקופסאות. נשמע איזה פרי מסתתר.',
    config: { reveals: ['🍎', '🍌', '🍇', '🍓', '🍉', '🍊'] },
    starsOnComplete: 1,
  },

  // --- double-click-reveal ---
  {
    id: 'task-mouse-dblclick-treasures',
    worldId: 'mouse',
    template: 'double-click-reveal',
    title: 'לחץ פעמיים לפתוח!',
    narration: 'לחץ פעמיים על כל תיבה כדי לפתוח אותה.',
    config: { reveals: ['🐶', '🐱', '🐰', '⭐', '🌈'] },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-dblclick-gifts',
    worldId: 'mouse',
    template: 'double-click-reveal',
    title: 'מתנות לפתוח',
    narration: 'לחץ פעמיים על כל מתנה. מה בפנים?',
    config: { reveals: ['🎁', '🎈', '🎂', '⭐', '🌸'] },
    starsOnComplete: 1,
  },

  // --- drag-drop-match ---
  {
    id: 'task-mouse-dragdrop-animals',
    worldId: 'mouse',
    template: 'drag-drop-match',
    title: 'חבר כל חיה לשם שלה!',
    narration: 'גרור כל חיה לשם הנכון.',
    config: {
      pairs: [
        { id: 'dog',    icon: '🐶', label: 'כלב' },
        { id: 'cat',    icon: '🐱', label: 'חתול' },
        { id: 'rabbit', icon: '🐰', label: 'ארנב' },
      ],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-dragdrop-fruits',
    worldId: 'mouse',
    template: 'drag-drop-match',
    title: 'חבר כל פרי לשם שלו!',
    narration: 'גרור כל פרי לשם הנכון.',
    config: {
      pairs: [
        { id: 'apple',  icon: '🍎', label: 'תפוח' },
        { id: 'banana', icon: '🍌', label: 'בננה' },
        { id: 'grapes', icon: '🍇', label: 'ענבים' },
      ],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-dragdrop-colors',
    worldId: 'mouse',
    template: 'drag-drop-match',
    title: 'חבר כל כדור לצבע',
    narration: 'גרור כל כדור-צבעוני לשם הצבע.',
    config: {
      pairs: [
        { id: 'red',    icon: '🔴', label: 'אדום' },
        { id: 'yellow', icon: '🟡', label: 'צהוב' },
        { id: 'green',  icon: '🟢', label: 'ירוק' },
        { id: 'blue',   icon: '🔵', label: 'כחול' },
      ],
    },
    starsOnComplete: 1,
  },

  // --- right-click-menu ---
  {
    id: 'task-mouse-right-click-pick',
    worldId: 'mouse',
    template: 'right-click-menu',
    title: 'לחץ ימני לבחור',
    narration: 'לחץ עם הכפתור הימני, ואז בחר.',
    config: {
      items: [
        { id: 'gift',  icon: '🎁', label: 'מתנה' },
        { id: 'star',  icon: '⭐', label: 'כוכב' },
        { id: 'apple', icon: '🍎', label: 'תפוח' },
      ],
    },
    starsOnComplete: 1,
  },

  // ============================================================
  // WORLD: KEYBOARD — key-press + type-word
  // ============================================================

  // --- key-press: arrows ---
  {
    id: 'task-keyboard-arrows-basic',
    worldId: 'keyboard',
    template: 'key-press',
    title: 'הקש על החיצים',
    narration: 'לחץ על המקש שמופיע על המסך.',
    config: { keys: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] },
    starsOnComplete: 1,
  },
  {
    id: 'task-keyboard-arrows-mix',
    worldId: 'keyboard',
    template: 'key-press',
    title: 'חיצים מעורבבים',
    narration: 'הקש על המקש שמופיע.',
    config: { keys: ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'] },
    starsOnComplete: 1,
  },
  {
    id: 'task-keyboard-space-enter',
    worldId: 'keyboard',
    template: 'key-press',
    title: 'רווח ואנטר',
    narration: 'הקש על הרווח, אחר-כך על אנטר.',
    config: { keys: [' ', 'Enter', ' ', 'Enter'] },
    starsOnComplete: 1,
  },

  // --- type-word: short Hebrew words ---
  {
    id: 'task-keyboard-type-aba',
    worldId: 'keyboard',
    template: 'type-word',
    title: 'הקלד אבא',
    narration: 'הקלד אות אחר אות: אבא.',
    config: { word: 'אבא' },
    starsOnComplete: 1,
  },
  {
    id: 'task-keyboard-type-ima',
    worldId: 'keyboard',
    template: 'type-word',
    title: 'הקלד אמא',
    narration: 'הקלד אות אחר אות: אמא.',
    config: { word: 'אמא' },
    starsOnComplete: 1,
  },
  {
    id: 'task-keyboard-type-dod',
    worldId: 'keyboard',
    template: 'type-word',
    title: 'הקלד דוד',
    narration: 'הקלד אות אחר אות: דוד.',
    config: { word: 'דוד' },
    starsOnComplete: 1,
  },
  {
    id: 'task-keyboard-type-sus',
    worldId: 'keyboard',
    template: 'type-word',
    title: 'הקלד סוס',
    narration: 'הקלד אות אחר אות: סוס.',
    config: { word: 'סוס' },
    starsOnComplete: 1,
  },
  {
    id: 'task-keyboard-type-kar',
    worldId: 'keyboard',
    template: 'type-word',
    title: 'הקלד כדור',
    narration: 'הקלד אות אחר אות: כדור.',
    config: { word: 'כדור' },
    starsOnComplete: 1,
  },

  // ============================================================
  // WORLD: WINDOW — point-and-narrate
  // ============================================================
  {
    id: 'task-window-anatomy',
    worldId: 'window',
    template: 'point-and-narrate',
    title: 'חלקי החלון',
    narration: 'הצבע על כל חלק כדי לשמוע מה הוא.',
    config: {
      scene: 'window',
      parts: [
        { id: 'close', label: 'סגור', pos: { top: '17%', left: '76%' }, color: '#FF6B6B', narration: 'כפתור סגירה — סוגר את החלון' },
        { id: 'minimize', label: 'מזער', pos: { top: '17%', left: '70%' }, color: '#FFD93D', narration: 'כפתור מזעור — מקטין את החלון' },
        { id: 'maximize', label: 'הגדל', pos: { top: '17%', left: '64%' }, color: '#6BCB77', narration: 'כפתור הגדלה — מרחיב את החלון' },
        { id: 'titlebar', label: 'שורת כותרת', pos: { top: '17%', left: '36%' }, color: '#C9A0DC', narration: 'שורת הכותרת — אפשר לתפוס ולגרור את החלון' },
        { id: 'content', label: 'תוכן', pos: { top: '50%', left: '50%' }, color: '#6FC3DF', narration: 'אזור התוכן — מה שרואים בתוך החלון' },
      ],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-window-actions',
    worldId: 'window',
    template: 'point-and-narrate',
    title: 'מה אפשר לעשות עם חלון?',
    narration: 'נצביע על פעולות שאפשר לעשות עם חלון.',
    config: {
      scene: 'window',
      parts: [
        { id: 'drag', label: 'גרור', pos: { top: '17%', left: '30%' }, color: '#FFD93D', narration: 'אפשר לגרור את החלון על-ידי שורת הכותרת' },
        { id: 'resize', label: 'שנה גודל', pos: { top: '80%', left: '85%' }, color: '#C9A0DC', narration: 'אפשר לשנות גודל מהפינה התחתונה' },
        { id: 'close-x', label: 'סגירה', pos: { top: '17%', left: '76%' }, color: '#FF6B6B', narration: 'סוגרים עם הכפתור האדום' },
      ],
    },
    starsOnComplete: 1,
  },

  // ============================================================
  // WORLD: BROWSER — point-and-narrate
  // ============================================================
  {
    id: 'task-browser-anatomy',
    worldId: 'browser',
    template: 'point-and-narrate',
    title: 'חלקי הדפדפן',
    narration: 'הצבע על כל חלק כדי לשמוע מה הוא.',
    config: {
      scene: 'browser',
      parts: [
        { id: 'close', label: 'סגור', pos: { top: '18%', left: '12%' }, color: '#FF6B6B', narration: 'כפתור אדום — סוגר את הדפדפן' },
        { id: 'minimize', label: 'מזער', pos: { top: '18%', left: '15%' }, color: '#FFD93D', narration: 'כפתור צהוב — מזער' },
        { id: 'maximize', label: 'הגדל', pos: { top: '18%', left: '18%' }, color: '#6BCB77', narration: 'כפתור ירוק — מגדיל' },
        { id: 'address', label: 'כתובת', pos: { top: '18%', left: '55%' }, color: '#6FC3DF', narration: 'שורת הכתובת — שם מקלידים את הכתובת של האתר' },
        { id: 'content', label: 'תוכן', pos: { top: '60%', left: '50%' }, color: '#C9A0DC', narration: 'אזור התוכן — שם מופיע האתר' },
      ],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-browser-buttons',
    worldId: 'browser',
    template: 'point-and-narrate',
    title: 'כפתורי הדפדפן',
    narration: 'נכיר את הכפתורים הצבעוניים.',
    config: {
      scene: 'browser',
      parts: [
        { id: 'red', label: 'אדום', pos: { top: '18%', left: '12%' }, color: '#FF6B6B', narration: 'הכפתור האדום — סוגר' },
        { id: 'yellow', label: 'צהוב', pos: { top: '18%', left: '15%' }, color: '#FFD93D', narration: 'הכפתור הצהוב — מזער' },
        { id: 'green', label: 'ירוק', pos: { top: '18%', left: '18%' }, color: '#6BCB77', narration: 'הכפתור הירוק — מגדיל' },
      ],
    },
    starsOnComplete: 1,
  },
];

export function getTask(id) { return TASKS.find(t => t.id === id) || null; }
export function getWorldTasks(worldId) { return TASKS.filter(t => t.worldId === worldId); }
export function getNextTask(worldId, completedIds = []) {
  const worldTasks = getWorldTasks(worldId);
  return worldTasks.find(t => !completedIds.includes(t.id)) || null;
}

export function getProgress(worldId, completedIds = []) {
  const total = getWorldTasks(worldId).length;
  const done = completedIds.filter(id => {
    const t = getTask(id); return t && t.worldId === worldId;
  }).length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}
