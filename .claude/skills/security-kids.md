---
name: security-kids
description: Security skill for child-game context — PIN handling, OAuth scope, XSS prevention, secret management. Activates for any auth, storage, or input-handling code.
---

# Skill: security-kids

## PIN (4-digit parent PIN)

- **Hash:** PBKDF2-SHA256 + salt 16-byte ייחודי + 100,000 iterations. **לא** SHA-256 פשוט (rainbow-table פותר 10K צירופים בשנייה).
- **Storage:** `chachmoni:pin-hash` + `chachmoni:pin-salt` ב-localStorage.
- **Rate-limit:** counter ב-IndexedDB עם timestamps. אחרי 3 ניסיונות-שגויים → 15 דק' lockout.
- **Recovery question:** "תאריך-לידת-הורה (DD/MM)" — **לא** "שם-החיה" (ילד יודע!). התשובה גם עוברת PBKDF2 hash.

## OAuth (Google Drive)

- **Scope:** `drive.file` בלבד (לא `drive` או `drive.readonly`). גישה רק לקבצים שהאפליקציה יצרה.
- **Flow:** Google Identity Services (GIS) Token Client — **לא** Implicit Flow (Google ביטל ב-2023).
- **State:** state-nonce ב-`sessionStorage` (לא localStorage) למניעת CSRF.
- **Redirect URI:** `http://localhost:8080` (ועוד 8081–8085 fallback). לא wildcard.

## HttpListener (PowerShell)

- **Bind מפורש:** `http://127.0.0.1:8080/` — **לא** `+` או `*` (מאזין על כל ה-interfaces).
- **Host-header validation:** דחיית בקשות שה-Host לא `127.0.0.1`.
- **Headers:** `X-Content-Type-Options: nosniff`, basic CSP, `Cache-Control: no-store`.

## XSS Prevention

- **NEVER innerHTML** עם user input או AI output.
- תמיד `textContent` / `createElement`.
- **DOMPurify** ל-AI output (Phase 2).

## File Upload (Photo)

- **MIME validation:** `image/jpeg`, `image/png`, `image/webp` בלבד. SVG אסור (יכול `<script>`).
- **Magic-bytes check:** 8 בייטים ראשונים תואמים לפורמט המוצהר.
- **Max size:** 10MB לפני crop.
- **Canvas re-encode:** קובץ עובר דרך `<canvas>` ו-`toBlob('image/jpeg', 0.8)` — מנטרל EXIF/payloads.
- **Storage:** Blob ב-IndexedDB (לא base64).

## Anthropic API Key (Phase 2 בלבד)

- ההורה חייב להגדיר billing-cap קשיח ($5/חודש) ב-Anthropic Console **לפני** שה-toggle "AI" מאופשר.
- API key ב-localStorage `chachmoni:anthropic-key` — Phase 2 שדרוג: הצפנה עם derived-key מה-PIN.

## AI Output Safety (Phase 2 בלבד)

5 שכבות:
1. JSON schema validation — קשיח
2. Regex: `/^[א-ת0-9\s,.!?\-]+$/` (עברית + פיסוק בלבד)
3. Max length: instructionText ≤ 100 תווים
4. DOMPurify לפני הצגה ב-DOM
5. Parent-approval חובה לפני שמשימה רואה את הילד

## .gitignore

`.env`, `*.key`, `secrets.*`, `oauth-client*.json`, `credentials*.json`, `api-keys*`, `.claude/local-secrets.*`. **רשימה מפורשת ב-`git add`, לא `-A` עיוור.**

## טריגרים

הפעל בכל פעם שאתה:
- כותב/משנה PIN logic
- כותב/משנה OAuth flow
- כותב file upload code
- מטמיע AI generator (Phase 2)
- נוגע ב-localStorage / IndexedDB
- כותב הזרקת-DOM כלשהי
