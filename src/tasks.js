// tasks.js — Task data definitions.
// Phase 2 starts with the click-targets template (balloons).
// More templates and tasks added in Phase 3, 5, 6, 7.

export const TASKS = [
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
        { top: '10%', left: '14%' },
        { top: '8%',  left: '62%' },
        { top: '38%', left: '34%' },
        { top: '32%', left: '70%' },
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
        { top: '12%', left: '20%' },
        { top: '24%', left: '60%' },
        { top: '46%', left: '18%' },
        { top: '40%', left: '64%' },
        { top: '60%', left: '40%' },
      ],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-hover-animals',
    worldId: 'mouse',
    template: 'hover-target',
    title: 'גלה מה מסתתר!',
    narration: 'העבר את העכבר על הקופסאות כדי לגלות מה בפנים.',
    config: {
      reveals: ['🐶', '🐱', '🐰', '🦋', '⭐', '🌈'],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-hover-objects',
    worldId: 'mouse',
    template: 'hover-target',
    title: 'מה מסתתר בקופסאות?',
    narration: 'העבר את העכבר על הקופסאות. כל אחת מסתירה משהו אחר.',
    config: {
      reveals: ['🎈', '🎁', '🍎', '🌞', '🌸', '🐝'],
    },
    starsOnComplete: 1,
  },
  {
    id: 'task-mouse-dblclick-treasures',
    worldId: 'mouse',
    template: 'double-click-reveal',
    title: 'לחץ פעמיים לפתוח את התיבות!',
    narration: 'לחץ פעמיים על כל תיבה כדי לפתוח אותה.',
    config: { reveals: ['🐶', '🐱', '🐰', '⭐', '🌈'] },
    starsOnComplete: 1,
  },
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
];

export function getTask(id) { return TASKS.find(t => t.id === id) || null; }
export function getWorldTasks(worldId) { return TASKS.filter(t => t.worldId === worldId); }
export function getNextTask(worldId, completedIds = []) {
  const worldTasks = getWorldTasks(worldId);
  return worldTasks.find(t => !completedIds.includes(t.id)) || null;
}
