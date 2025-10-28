# 🤝 מדריך תרומה - Public Voice Hub

תודה על העניין שלך לתרום ל-Public Voice Hub! מדריך זה יעזור לך להתחיל ולתרום בצורה הטובה ביותר.

## 🎯 איך לתרום

### דרכים לתרומה

- **קוד:** פיתוח תכונות חדשות ותיקון באגים
- **תיעוד:** שיפור התיעוד והמדריכים
- **עיצוב:** שיפור העיצוב וחוויית המשתמש
- **בדיקות:** בדיקת קוד ודיווח על באגים
- **רעיונות:** הצעות לתכונות חדשות
- **תרגום:** תרגום לשפות נוספות
- **קהילה:** עזרה למשתמשים אחרים

### תחומי תרומה

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, APIs, Databases
- **DevOps:** GitHub Actions, CI/CD
- **תיעוד:** Markdown, מדריכים
- **עיצוב:** UI/UX, גרפיקה
- **בדיקות:** Unit Tests, Integration Tests
- **אבטחה:** Security Reviews, Penetration Testing

## 🚀 התחלה מהירה

### 1. הכנה

```bash
# Fork את הפרויקט
git clone https://github.com/YOUR_USERNAME/PublicVoiceHub.git
cd PublicVoiceHub

# הוסף את ה-repository המקורי
git remote add upstream https://github.com/AnLoMinus/PublicVoiceHub.git

# צור branch חדש
git checkout -b feature/your-feature-name
```

### 2. פיתוח

```bash
# עשה את השינויים שלך
# הוסף קבצים חדשים או ערוך קיימים

# בדוק את השינויים
git status
git diff

# הוסף את השינויים
git add .
git commit -m "Add: תיאור קצר של השינוי"
```

### 3. שליחה

```bash
# Push את ה-branch
git push origin feature/your-feature-name

# צור Pull Request ב-GitHub
```

## 📋 תהליך הפיתוח

### 1. תכנון

- **בדוק Issues קיימים** לפני שתתחיל
- **צור Issue חדש** אם אין אחד קיים
- **דון ברעיון** עם הקהילה
- **קבל אישור** לפני שתתחיל לפתח

### 2. פיתוח

- **עקוב אחר הסגנון** הקיים
- **כתב קוד נקי** ומובן
- **הוסף הערות** במקומות נדרשים
- **בדוק את הקוד** לפני השליחה

### 3. בדיקות

- **בדוק את הקוד** מקומית
- **הרץ בדיקות** אוטומטיות
- **בדוק על דפדפנים** שונים
- **בדוק על מכשירים** שונים

### 4. שליחה

- **כתב הודעה ברורה** על השינוי
- **הוסף תמונות** אם רלוונטי
- **ציין Issues** שפתרת
- **בדוק את ה-CI** עובר

## 📝 סגנון קוד

### HTML

```html
<!-- השתמש בסמנטיקה נכונה -->
<main>
  <section>
    <h2>כותרת</h2>
    <p>תוכן</p>
  </section>
</main>

<!-- הוסף alt לטקסטים -->
<img src="image.jpg" alt="תיאור התמונה">

<!-- השתמש ב-ARIA labels -->
<button aria-label="סגור חלון">×</button>
```

### CSS

```css
/* השתמש ב-CSS Variables */
:root {
  --primary-color: #2c3e50;
  --secondary-color: #3498db;
}

/* השתמש ב-BEM naming */
.button {
  background: var(--primary-color);
}

.button--primary {
  background: var(--secondary-color);
}

.button__text {
  color: white;
}
```

### JavaScript

```javascript
// השתמש ב-const ו-let
const userName = 'John';
let userAge = 25;

// השתמש ב-arrow functions
const getUserData = () => {
  return fetch('/api/user');
};

// השתמש ב-template literals
const message = `שלום ${userName}, אתה בן ${userAge}`;

// הוסף JSDoc
/**
 * מחלקת ניהול משתמשים
 * @class UserManager
 */
class UserManager {
  /**
   * יוצר משתמש חדש
   * @param {string} name - שם המשתמש
   * @param {number} age - גיל המשתמש
   */
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
```

### Markdown

```markdown
# כותרת ראשית

## כותרת משנית

### כותרת שלישית

**טקסט מודגש**

*טקסט נטוי*

`קוד`

```javascript
// בלוק קוד
const example = 'דוגמה';
```

- רשימה
- עם
- נקודות

1. רשימה
2. ממוספרת
3. עם מספרים

[קישור](https://example.com)

![תמונה](image.jpg)
```

## 🧪 בדיקות

### בדיקות מקומיות

```bash
# בדוק את ה-HTML
npm run lint:html

# בדוק את ה-CSS
npm run lint:css

# בדוק את ה-JavaScript
npm run lint:js

# הרץ בדיקות
npm test

# בנה את הפרויקט
npm run build
```

### בדיקות ידניות

- **בדוק על Chrome** (דסקטופ ומובייל)
- **בדוק על Firefox** (דסקטופ ומובייל)
- **בדוק על Safari** (דסקטופ ומובייל)
- **בדוק על Edge** (דסקטופ)
- **בדוק נגישות** עם screen reader
- **בדוק ביצועים** עם DevTools

## 📋 Pull Request Template

### כותרת

```
Add: תכונה חדשה
Fix: תיקון באג
Update: עדכון תכונה קיימת
Remove: הסרת תכונה
Docs: עדכון תיעוד
Style: שינוי עיצוב
Refactor: שיפור קוד
Test: הוספת בדיקות
```

### תיאור

```markdown
## מה השתנה?

תיאור קצר של השינוי

## איך זה עובד?

הסבר על איך התכונה עובדת

## תמונות/סרטונים

הוסף תמונות או סרטונים אם רלוונטי

## בדיקות

- [ ] בדקתי את הקוד מקומית
- [ ] הרצתי בדיקות אוטומטיות
- [ ] בדקתי על דפדפנים שונים
- [ ] בדקתי על מכשירים שונים

## Issues

פותר #123
```

## 🐛 דיווח על באגים

### איך לדווח

1. **בדוק Issues קיימים** לפני שתיצור חדש
2. **צור Issue חדש** עם התבנית
3. **הוסף פרטים מלאים** על הבעיה
4. **הוסף תמונות** אם רלוונטי
5. **הוסף מידע על הסביבה** שלך

### תבנית דיווח באג

```markdown
## תיאור הבעיה

תיאור קצר וברור של הבעיה

## איך לשחזר

1. לך ל-...
2. לחץ על...
3. גלול למטה ל-...
4. ראה שגיאה

## התנהגות צפויה

מה אתה מצפה שיקרה

## התנהגות בפועל

מה קורה בפועל

## תמונות

הוסף תמונות אם רלוונטי

## מידע על הסביבה

- מערכת הפעלה: [Windows/macOS/Linux]
- דפדפן: [Chrome/Firefox/Safari/Edge]
- גרסה: [גרסה]
- מכשיר: [דסקטופ/מובייל/טאבלט]

## מידע נוסף

כל מידע נוסף שיכול לעזור
```

## 💡 הצעות לתכונות

### איך להציע

1. **בדוק Issues קיימים** לפני שתיצור חדש
2. **צור Issue חדש** עם התבנית
3. **הוסף פרטים מלאים** על התכונה
4. **הוסף דוגמאות** אם אפשר
5. **דון עם הקהילה** על הרעיון

### תבנית הצעת תכונה

```markdown
## תיאור התכונה

תיאור קצר וברור של התכונה

## בעיה שזה פותר

איזה בעיה התכונה פותרת

## פתרון מוצע

איך התכונה פותרת את הבעיה

## דוגמאות

הוסף דוגמאות אם אפשר

## מימוש אפשרי

איך אפשר לממש את התכונה

## מידע נוסף

כל מידע נוסף שיכול לעזור
```

## 📚 משאבים

### תיעוד

- [מדריך מפתח](docs/developer-guide.md)
- [מדריך משתמש](docs/user-guide.md)
- [מדיניות פרטיות](docs/privacy-policy.md)
- [קוד התנהגות](CODE_OF_CONDUCT.md)
- [מדיניות אבטחה](SECURITY.md)

### כלים

- [GitHub](https://github.com)
- [VS Code](https://code.visualstudio.com)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [MDN Web Docs](https://developer.mozilla.org)
- [Can I Use](https://caniuse.com)

### קהילה

- [GitHub Discussions](https://github.com/AnLoMinus/PublicVoiceHub/discussions)
- [GitHub Issues](https://github.com/AnLoMinus/PublicVoiceHub/issues)
- [Discord](https://discord.gg/publicvoicehub) (אם קיים)
- [Telegram](https://t.me/publicvoicehub) (אם קיים)

## 🙏 הכרה

### תורמים

תודה לכל התורמים שמעניקים מזמנם ומכישוריהם לפרויקט!

### קרדיט

- **תורמי קוד:** מופיעים ב-GitHub Contributors
- **תורמי תיעוד:** מופיעים ב-GitHub Contributors
- **תורמי עיצוב:** מופיעים ב-GitHub Contributors
- **תורמי בדיקות:** מופיעים ב-GitHub Contributors
- **תורמי קהילה:** מופיעים ב-GitHub Contributors

## 📞 יצירת קשר

- **אימייל:** <contributors@publicvoicehub.org>
- **GitHub:** [GitHub Discussions](https://github.com/AnLoMinus/PublicVoiceHub/discussions)
- **Issues:** [GitHub Issues](https://github.com/AnLoMinus/PublicVoiceHub/issues)

## 📜 רישיון

מדריך תרומה זה מוגן תחת רישיון MIT. ראה [LICENSE](https://github.com/AnLoMinus/PublicVoiceHub/blob/main/LICENSE) לפרטים.

---

**Public Voice Hub** - כי לכל קול יש משמעות! 🌟✨

*מדריך זה יעזור לך לתרום בצורה הטובה ביותר לפרויקט Public Voice Hub ולבנות יחד קהילה חזקה ומגובשת.*
