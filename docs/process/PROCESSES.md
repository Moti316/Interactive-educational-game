---
tags:
  - process
---

# PROCESSES — תהליכי המערכת

*יעודכן בשלב 1 כשנתחיל לבנות את ה-flows.*

## תהליכים-מתוכננים

1. **First-Run Wizard** — 5 מסכים (welcome, mouse intro, click practice, parent setup, profile select)
2. **Profile Login** — בחירה מ-N פרופילים מקומיים, Hover מקריא שם
3. **Task Lifecycle** — splash (1.4s) → gameplay → celebration (1.8s) → return-to-map (0.9s)
4. **Drive Sync** — debounce 3s → upload פר-פרופיל → backup ל-history (7 last)
5. **Schema Migration** — backup לפני, migrate, restore אם נכשל
6. **PIN Flow** — entry → validate (PBKDF2) → success/wrong → lockout 15 דק' אחרי 3