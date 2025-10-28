# 💻 מדריך מפתח - FixCry

## 🎯 מבוא

ברוכים הבאים למדריך המפתחים של **FixCry**! מדריך זה מיועד למפתחים שרוצים לתרום לפרויקט או להבין את המבנה הטכני שלו.

## 🏗️ ארכיטקטורה כללית

```
FixCry/
├── .github/           # GitHub Actions ותבניות
├── data/              # נתונים ותיקים
├── docs/              # תיעוד
├── web/               # אתר סטטי
├── tools/             # כלי עבודה וסקריפטים
└── media/             # קבצי מדיה
```

## 🛠️ טכנולוגיות

### Frontend
- **HTML5** - מבנה בסיסי
- **CSS3** - עיצוב וסטיילינג
- **JavaScript (ES6+)** - אינטראקטיביות
- **Bootstrap 5** - רכיבי UI

### Backend
- **GitHub API** - ניהול תיקים
- **GitHub Pages** - אירוח סטטי
- **JSON** - מבנה נתונים

### כלי פיתוח
- **Git** - ניהול גרסאות
- **GitHub Actions** - CI/CD
- **Node.js** - כלי עבודה
- **JSON Schema** - אימות נתונים

## 📊 מבנה נתונים

### סכימת תיק (Issue Schema)

```json
{
  "id": "FC-2025-10-28-0001",
  "title": "מעבר חציה מחוק ליד בית ספר",
  "category": "חינוך/מוניציפלי",
  "location": {
    "city": "Holon",
    "street": "Herzl 12",
    "geo": [32.011, 34.779]
  },
  "description": "מעבר החציה מחוק ומסוכן. נדרש צביעה ושילוט.",
  "evidence": ["media/proofs/FC-0001-photo.jpg"],
  "reporter": {
    "mode": "anonymous",
    "contact": null
  },
  "submitted_at": "2025-10-28T17:58:00+02:00",
  "status": "open",
  "stage": "triage",
  "assignee": "municipality:holon",
  "sla": { 
    "first_response_h": 48, 
    "target_fix_days": 7 
  },
  "labels": ["safety", "school_zone", "urgent"],
  "duplicates": ["FC-2025-10-27-0091"],
  "history": [
    { 
      "at": "2025-10-28T18:10:00+02:00", 
      "action": "triage-assigned", 
      "by": "ops-bot" 
    }
  ]
}
```

### סטטוסי תיקים

```javascript
const ISSUE_STATUSES = {
  OPEN: 'open',
  TRIAGE: 'triage', 
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  WAITING_ON_AUTHORITY: 'waiting_on_authority',
  RESOLVED: 'resolved',
  VERIFIED: 'verified',
  CLOSED: 'closed'
};
```

### קטגוריות

```javascript
const CATEGORIES = {
  TRANSPORT: 'תחבורה',
  HEALTH: 'בריאות',
  EDUCATION: 'חינוך',
  WELFARE: 'רווחה',
  ENVIRONMENT: 'סביבה',
  SECURITY: 'ביטחון',
  HOUSING: 'דיור',
  GOVERNMENT: 'ממשל'
};
```

## 🔧 הגדרת סביבת פיתוח

### דרישות מערכת
- Node.js 16+
- Git
- דפדפן מודרני

### התקנה

```bash
# Clone הפרויקט
git clone https://github.com/AnLoMinus/FixCry.git
cd FixCry

# התקנת תלויות
npm install

# הרצת שרת פיתוח
npm run dev
```

### סקריפטים זמינים

```bash
npm run dev          # שרת פיתוח
npm run build        # בניית פרודקשן
npm run test         # הרצת בדיקות
npm run lint         # בדיקת קוד
npm run validate     # אימות נתונים
```

## 🧪 בדיקות

### בדיקות יחידה
```bash
npm test
```

### בדיקות אינטגרציה
```bash
npm run test:integration
```

### בדיקות E2E
```bash
npm run test:e2e
```

## 📝 כללי קוד

### JavaScript
- השתמש ב-ES6+ features
- השתמש ב-const/let במקום var
- כתוב פונקציות קצרות וממוקדות
- הוסף הערות לקוד מורכב

### CSS
- השתמש ב-BEM methodology
- כתוב CSS מודולרי
- השתמש ב-CSS variables
- תמוך ב-responsive design

### HTML
- השתמש ב-semantic HTML
- הוסף alt text לתמונות
- וודא נגישות (accessibility)
- השתמש ב-ARIA labels

## 🔄 Git Workflow

### Branching Strategy
- `main` - קוד יציב
- `develop` - פיתוח פעיל
- `feature/*` - פיצ'רים חדשים
- `bugfix/*` - תיקוני באגים
- `hotfix/*` - תיקונים דחופים

### Commit Messages
```
type(scope): description

feat(auth): add login functionality
fix(ui): resolve mobile layout issue
docs(readme): update installation guide
```

### Pull Request Process
1. צור branch חדש
2. כתוב קוד + בדיקות
3. עדכן תיעוד
4. שלח PR
5. המתן לאישור
6. Merge ל-main

## 🚀 Deployment

### GitHub Pages
- אוטומטי מ-branch `main`
- בנייה דרך GitHub Actions
- URL: `https://anlominus.github.io/FixCry/`

### תהליך Release
1. עדכן גרסה ב-package.json
2. עדכן CHANGELOG.md
3. צור tag חדש
4. GitHub Actions יבנה ויפרסם

## 🔐 אבטחה

### GitHub Security
- השתמש ב-Dependabot
- סרוק dependencies
- עדכן באופן קבוע

### נתונים רגישים
- אל תכלול API keys בקוד
- השתמש ב-GitHub Secrets
- הגן על פרטיות משתמשים

## 📊 API

### GitHub API Endpoints
```javascript
// קבלת תיקים
GET /repos/AnLoMinus/FixCry/issues

// יצירת תיק חדש
POST /repos/AnLoMinus/FixCry/issues

// עדכון תיק
PATCH /repos/AnLoMinus/FixCry/issues/{issue_number}
```

### Custom API (עתידי)
```javascript
// API פנימי לניתוח נתונים
GET /api/analytics/heatmap
GET /api/reports/weekly
POST /api/validation/schema
```

## 🧰 כלי עבודה

### Scripts זמינים
- `tools/scripts/validate-data.js` - אימות נתונים
- `tools/scripts/generate-report.js` - יצירת דוחות
- `tools/scripts/duplicate-check.js` - בדיקת כפילויות

### Schemas
- `tools/schemas/issue-schema.json` - סכימת תיק
- `tools/schemas/report-schema.json` - סכימת דוח

## 🐛 דיבוג

### כלי דיבוג
- Browser DevTools
- GitHub Actions logs
- Console logging

### בעיות נפוצות
- **CORS errors:** בדוק הגדרות GitHub Pages
- **API rate limits:** השתמש ב-authentication
- **Build failures:** בדוק Node.js version

## 📚 משאבים נוספים

- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [JSON Schema Specification](https://json-schema.org/)

## 🤝 תרומה לפרויקט

### איך לתרום
1. Fork הפרויקט
2. צור branch חדש
3. כתוב קוד + בדיקות
4. שלח Pull Request

### תחומי תרומה
- **Frontend:** שיפור UI/UX
- **Backend:** פיתוח API
- **DevOps:** שיפור CI/CD
- **Documentation:** עדכון תיעוד
- **Testing:** כתיבת בדיקות

---

**תודה על התרומה!** 🙏  
ביחד נבנה פלטפורמה טובה יותר! 🚀✨
