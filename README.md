# ✝️ Oratio — Your Catholic Companion App

> *"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."* — Matthew 7:7

**Oratio** is a modern Catholic prayer and devotion app designed to help the faithful grow closer to God through daily prayer, the Holy Rosary, novenas, and personal reflection. Built with love for the Catholic community.

🌐 **Live App:** [https://oratio-317ac.web.app/](https://oratio-317ac.web.app/)

---

## 📱 Features

### 🙏 Daily Prayers
Browse and pray essential Catholic prayers anytime. Searchable by name or category — Essential, Daily, Marian, and Protection — with a clean, readable popup for each prayer.

### 📿 Holy Rosary
Pray the Holy Rosary with a full **step-by-step interactive guide** that walks you through every prayer and decade. The app automatically selects today's mystery based on the day of the week. Includes:
- Full guided prayer flow (Sign of the Cross → Opening prayers → 5 Decades)
- Rosary counter saved to your account
- Milestone celebrations at 3, 5, 10, 15, 20, 30, 50, and 100 rosaries

### 🕯️ Novenas
Pray nine-day novenas to your favorite saints and devotions. Features include:
- Day-by-day prayer flow with prayer text pulled directly from the data source
- Date-locked progression (one day per day — no skipping ahead)
- Progress tracker with visual day indicators
- Currently includes: Divine Mercy, Sacred Heart, Our Lady of Perpetual Help, St. Jude, St. Joseph, Holy Spirit, and **St. Carlo Acutis** (first millennial saint, canonized 2025)

### 📖 Confession Journal
Prepare your heart for the Sacrament of Reconciliation. Features include:
- Private, user-specific journal entries stored securely in the cloud
- Categorize sins by capital vice (Pride, Greed, Lust, etc.)
- Mark entries as confessed with a visual checkmark
- Built-in **Examination of Conscience** based on the Ten Commandments

### ⛪ Mass Attendance Tracker
Track your Sunday Mass attendance over the last 8 weeks. Features include:
- Sunday reminder banner and auto-prompt
- Visual streak counter (🔥)
- Celebration popup for attending Mass
- Gentle encouragement and link to Confession Journal if you missed

### 👤 User Profiles
- Sign up with Email/Password or Google
- Customizable display name and profile picture
- Password change with re-authentication
- All data synced securely across devices via Firebase

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React + TypeScript** | Frontend framework |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **Firebase Auth** | User authentication |
| **Firebase Firestore** | Cloud database |
| **Firebase Storage** | Profile photo uploads |
| **Firebase Hosting** | Deployment |
| **GitHub Actions** | CI/CD pipeline |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/oratio.git
cd oratio

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file at the root of the project:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## 🔒 Firestore Security Rules

All user data is protected. Only authenticated users can read or write their own data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── components/       # Shared components (Navigation, ProtectedRoute, etc.)
│   ├── contexts/         # AuthContext
│   ├── data/             # prayers.ts — all prayer and novena data
│   ├── hooks/            # useJournal, useNovenaProgress
│   └── pages/            # Home, DailyPrayers, Rosary, Novenas, Confessions, Profile, Auth
├── lib/
│   └── firebase.ts       # Firebase initialization
└── styles/
    └── index.css
public/
└── images/
    └── novenas/          # Novena images (one per novena id)
```

---

## ➕ Adding a New Novena

All novena data lives in `src/app/data/prayers.ts`. To add a new one:

1. Add a new entry to the `novenas` array:

```ts
{
  id: 'st-therese',
  title: 'St. Thérèse of Lisieux Novena',
  description: 'The Little Flower novena',
  days: 9,
  patron: 'St. Thérèse of Lisieux',
  intention: 'For missionaries and those who suffer',
  image: '/images/novenas/st-therese.png',
  prayers: Array.from({ length: 9 }, (_, i) => `Your prayer text here. Day ${i + 1}.`),
},
```

2. Drop the image at `public/images/novenas/st-therese.png`

That's it — no changes needed anywhere else.

---

## 🚢 Deployment (CI/CD)

This project auto-deploys to Firebase Hosting on every push to `main` via GitHub Actions.

Required GitHub Secrets:
- `FIREBASE_SERVICE_ACCOUNT` — full JSON from Firebase → Project Settings → Service Accounts
- All `VITE_FIREBASE_*` environment variables

---

## 🙏 About

Oratio (Latin for *prayer*) was built to make Catholic devotional life more accessible and consistent for the modern faithful. Inspired by St. Carlo Acutis — the first millennial saint — who believed in using technology to bring souls closer to God.

> *"The Eucharist is my highway to heaven."* — St. Carlo Acutis

---

*Made with 🙏 for the glory of God.*