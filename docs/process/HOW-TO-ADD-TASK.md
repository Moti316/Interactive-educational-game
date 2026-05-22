---
tags:
  - process
---

# HOW-TO-ADD-TASK — מדריך הוספת משימה חדשה

## שלבי-הוספה

### 1. בחר תבנית מתאימה
`src/templates/` כולל 8 תבניות. ראה `docs/spec/ARCHITECTURE.md`.

### 2. צור קובץ-data חדש
```js
// src/tasks/{world}/01-my-task.js
import clickTargets from '../../templates/click-targets.js';

export default {
  id: 'task-mouse-balloons',
  worldId: 'mouse',
  skill: 'click',
  title: 'בלונים',
  difficulty: 1,
  instructionText: 'פוצצו את הבלונים',
  hoverHint: 'לחצו כדי להתחיל',
  build: () => clickTargets({
    targets: [{ emoji: '🎈', count: 5 }],
    successText: 'איזה כיף!'
  })
};
```r

### 3. הוסף ל-taskRegistry
`src/taskRegistry.js` — שורה חדשה עם import.

### 4. תעד ב-CONTENT.md + NARRATION.md
- `docs/spec/CONTENT.md` — שורה חדשה
- `docs/spec/NARRATION.md` — text/textNiqud/textTTS/altText

### 5. הרץ Council 
לפני commit — Council Light לפחות (security, ux-kid, hebrew).