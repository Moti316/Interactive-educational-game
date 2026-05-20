---
tags:
  - quality
---

# SECURITY — הרשאות, פרטיות, secrets

ראה `.claude/skills/security-kids.md` למפרט-מלא.

## עקרונות-יסוד

- PIN: PBKDF2-SHA256 + salt + 100K iterations
- OAuth scope: `drive.file` בלבד
- XSS: NEVER innerHTML עם user/AI input
- Photos: magic-bytes + canvas re-encode
- Secrets: לא בקוד, `.gitignore` מורחב
- HttpListener: bind ל-127.0.0.1, Host validation

## OAuth Setup (חד-פעמי, ע''י ההורה)

ראה `docs/DEPLOY.md`.