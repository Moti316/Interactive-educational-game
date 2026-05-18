---
name: kids-game
description: General skill for the Chachmoni project — Hebrew kids' computer-learning game. Activates for any kid-game task: voice narration, RTL UI, accessibility, naming conventions, button creation.
---

# Skill: kids-game (חכמוני General)

## הקשר הכי חשוב (לא לשכוח!)

זה משחק חינוכי לבני **4–6 שאינם קוראים**. בעברית, RTL, voice-first מלא.

## דרישות-יסוד שלא-לעבור עליהן

### Voice & Narration
- **כל טקסט גלוי חייב להיות מוקרא בקול.** הילדים לא קוראים.
- TTS rate: **0.85** (לא 0.75!), `lang: 'he-IL'`, `pitch: 1.1`.
- `speakOnHover()` ב-600ms על כל אלמנט-טקסט.
- לפני כל קריאה חדשה: `speechSynthesis.cancel()` (מונע queue overflow).
- **`audioReady` flag** — לא לקרוא ל-`speak()` לפני הקליק-הראשון של המשתמש (autoplay restriction).

### Buttons
- **כל כפתור עובר דרך `src/ui/button.js`** — לא DOM ידני.
- מינ' 80×80px (גם icon-only).
- מצבי-חובה: default, hover, focus, pressed, disabled, loading.
- **textContent, לא innerHTML** עם user/AI input.

### UI
- RTL (`dir="rtl"`), עברית בכל הטקסטים.
- כפתור-בית בפינה תמיד נגיש.
- אין טיימרים מלחיצים, אין "מסך-כשלון" (רק "ננסה שוב").
- אנימציות עם `prefers-reduced-motion` fallback.

### Naming
- Tasks: `task-{worldId}-{kebab-skill-name}` (למשל `task-mouse-balloons`).
- localStorage: `chachmoni:*` (לא `mouse-school:*`).
- Drive files: `progress-{profileId}.json` (לא קובץ-יחיד).

## טריגרים — מתי הפעל את ה-Skill הזה

הפעל בכל פעם שאתה:
- בונה כפתור חדש
- כותב טקסט-קריינות
- מטמיע template / task חדש
- נוגע ב-localStorage / IndexedDB
- כותב CSS שמשפיע על accessibility

## קישורים

- `PLAN.md` — תכנון מלא
- `docs/ARCHITECTURE.md` — מבנה
- `docs/STYLE-GUIDE.md` — כתיבת קריינות
- `docs/CONTENT.md` — רשימת משימות
