---
tags:
  - spec
---

# NARRATION — קטלוג כל הטקסטים בעברית + ניקוד

## פורמט

```json
{
  "task-click-balloons-instruction": {
    "text": "פוצצו את כל הבלונים",
    "textNiqud": "פּוֹצְצוּ אֶת כָּל הַבָּלוֹנִים",
    "textTTS": "פוצצו את כל הבלונים",
    "altText": "תמונה של בלונים צבעוניים"
  }
}
```r

## שדות

- **text:** הטקסט הגלוי במסך
- **textNiqud:** ניקוד-מלא (לקוראי-מסך, ל-screen readers)
- **textTTS:** מה שמועבר ל-`speak()` (לעיתים שונה מ-text כדי לתקן הגייה)
- **altText:** לתמונות-הקשורות

## קטלוג

*ריק — יתמלא תוך-כדי-עבודה.*

## מילים-קריטיות לבדיקת-TTS ידנית

ראה `.claude/skills/hebrew-narration.md` סעיף `TTS Pronunciation`.