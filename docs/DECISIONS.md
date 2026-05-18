# DECISIONS — ADR (Architecture Decision Records)

## ADR-001 | 2026-05-17 | Vanilla JS, ללא React/Vite
**החלטה:** Vanilla HTML/CSS/JS + ES Modules.  
**נימוק:** הילדים לא ייהנו יותר. הפיתוח מסתבך עם Node. ולא צריך build step.  
**אלטרנטיבות שנשללו:** React (overkill), Vue (overkill), Svelte (מעניין אבל compile required).

## ADR-002 | 2026-05-17 | localStorage + IndexedDB, ללא backend
**החלטה:** localStorage ל-state, IndexedDB ל-blob.  
**נימוק:** משחק לבית-אחד. אין צורך ב-DB. פרטיות מירבית.

## ADR-003 | 2026-05-17 | Local-only + PowerShell Launcher, ללא Vercel
**החלטה:** PowerShell `HttpListener` על `localhost:8080`.  
**נימוק:** משפחה אחת, מחשב אחד. אבטחה מירבית. file:// לא תומך ב-ES Modules + OAuth.

## ADR-004 | 2026-05-17 | Drive sync — קובץ פר-פרופיל (לא יחיד)
**החלטה:** `progress-{profileId}.json` בנפרד לכל ילד.  
**נימוק:** הורה יכול לשתף/לאפס פר-ילד. אין race-conditions בין-פרופילים.

## ADR-005 | 2026-05-17 | PIN — PBKDF2 + salt + 100K iterations
**החלטה:** לא SHA-256 פשוט (rainbow-table פותר).  
**נימוק:** המלצת agent-security ב-Council Round 1.

## ADR-006 | 2026-05-17 | AI generator — Phase 2 בלבד
**החלטה:** 50 משימות מובנות-מראש ב-MVP, אין שימוש API.  
**נימוק:** מספיק לחודש-חודשיים. עלות 0. אם נצטרך — Phase 2.