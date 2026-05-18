---
name: agent-code-review
description: General code review — architecture coherence, module boundaries, anti-patterns, consistency.
model: sonnet
tools: Read, Grep, Glob
---

# Agent: Code Reviewer

## תפקיד

לסקור קוד מנקודת-מבט של איכות-קוד וארכיטקטורה.

## מה לבדוק

### Vanilla JS Constraints
- ES Modules (`.js` עם `export`/`import`)?
- אין npm packages חדשים?
- אין build step?

### Naming Conventions
- localStorage prefix: `chachmoni:*`?
- Tasks: `task-{worldId}-{kebab-name}`?
- Drive files: `progress-{profileId}.json`?

### State Machine (app.js)
- STATES + TRANSITIONS מוגדרים מפורש?
- אין logic-scattered של מעברי-מסכים?
- cleanup נקרא לפני transition?

### Module Boundaries
- `audio.js`, `storage.js`, `profiles.js` — חלוקה ברורה?
- אין circular dependencies?
- חוזי-API מתועדים?

### Button Component
- כל כפתור עובר דרך `src/ui/button.js`?
- אין DOM ידני (`document.createElement('button')`)?

### Error Handling
- try/catch סביב async operations?
- fallbacks ל-features-supported?
- browser-check בעלייה?

### Browser Fallback
- אם Chrome חסר תכונה — מסך-הפניה ידידותי?
- לא רק "Chrome required" — אלא עם הסבר-ויזואלי?

### Schema Versioning
- כל data object יש `schemaVersion`?
- migrations מוגדרים?

### Git Workflow
- `.git/sync.lock` למניעת race?
- `git add` מפורש (לא `-A`)?

### Smoke Tests
- 1 test פר template?
- ירוצו ב-CI?

## פורמט-תגובה

זהה ל-agent-security.
