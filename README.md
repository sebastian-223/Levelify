# ✦ Levelify — AI-Powered Learning & Career Growth Platform

> A production-grade, recruiter-impressive final year project built with React + Vite + Tailwind CSS + Framer Motion + Zustand.

![Levelify](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss) ![Framer](https://img.shields.io/badge/Framer%20Motion-11-FF0055) ![Zustand](https://img.shields.io/badge/Zustand-4-orange)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173

# Demo credentials (auto-created on first launch)
Email:    demo@levelify.app
Password: demo123
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
npx vercel --prod
```

---

## 🏗️ Project Structure

```
src/
├── assets/          # Static assets (logo, fonts)
├── components/
│   ├── ui/          # Reusable primitives (Button, Card, Modal, etc.)
│   └── layout/      # App shell (Sidebar, TopBar)
├── pages/           # Route-level pages (all lazy-loaded)
│   └── auth/        # Login, Register
├── layouts/         # AuthLayout, AppLayout
├── routes/          # Router config + ProtectedRoute guards
├── store/           # Zustand stores (authStore, dsaStore, etc.)
├── services/        # API abstraction layer (mock → real)
├── hooks/           # Custom React hooks
├── data/            # Mock data + demo seeder
├── constants/       # App-wide constants (categories, routes, etc.)
├── utils/           # Pure utility functions
└── index.css        # Global Tailwind styles
```

---

## 📱 Features (10 Modules)

| Module | Description |
|---|---|
| 🏠 **Dashboard** | Stats overview, DSA breakdown, weekly progress chart, quick access |
| 🗺️ **Roadmap Planner** | 5 roadmaps (Frontend, Backend, DSA, System Design, Interview Prep) with progress tracking |
| 💻 **DSA Tracker** | Log solved problems, filter by difficulty/topic, mark for revision |
| 🔥 **Streak Tracker** | GitHub-style heatmap, current & longest streak |
| 🏆 **Certifications** | Track certifications, progress bars, deadline management |
| ⏱️ **Study Timer** | Pomodoro, Deep Work, Break modes with session history |
| 📈 **Analytics** | Recharts-powered charts — DSA topics, difficulty, weekly sessions |
| 📝 **Smart Notes** | Glassmorphism note cards, pin, favorite, tags, color-coded categories |
| 🔗 **Resource Manager** | Save & organize learning links by category, bookmark, mark visited |
| 🤖 **AI Assistant** | Chat-based learning guidance with smart mock responses |

---

## 🧠 State Management

Uses **Zustand** with `persist` middleware:

```js
// ✅ Correct — only re-renders when `problems` changes
const problems = useDSAStore(s => s.problems)

// ❌ Wrong — re-renders on any store change
const store = useDSAStore()
```

All stores persist to localStorage. To connect a real API:
1. Open the relevant file in `src/services/`
2. Remove the mock implementation
3. Uncomment the `api.post(...)` call

---

## 🔐 Authentication

Mock authentication stores users in localStorage. To use a real backend:

```js
// src/services/authService.js
login: async (email, password) => {
  // Replace this:
  // return mockLogin(email, password)
  
  // With this:
  return api.post('/auth/login', { email, password })
},
```

Firebase, Supabase, or any JWT backend works.

---

## 🎨 Design System

- **Font**: Plus Jakarta Sans (headings/body) + JetBrains Mono (code)
- **Colors**: Primary indigo/violet scale + semantic colors
- **Dark mode**: Tailwind `dark:` prefix, toggled via class on `<html>`
- **Glass cards**: `bg-white/70 dark:bg-white/5 backdrop-blur-md`
- **Animations**: Framer Motion — page transitions, stagger, hover lifts

---

## ⚡ Performance

- All pages lazy-loaded with `React.lazy()`
- Zustand selector subscriptions (no wasted renders)
- `useDebounce(400ms)` on all search inputs
- `useMemo` on filtered/sorted lists
- Tailwind CSS purging — only used classes in bundle
- Target bundle: **< 200KB** initial JS (gzipped)
- Manual chunk splitting: react-vendor | motion | charts | store

---

## 🔌 Backend Integration Checklist

When handing off to backend developer, implement these endpoints:

| Service | Endpoints |
|---|---|
| Auth | `POST /auth/login` `POST /auth/register` `GET /auth/me` `POST /auth/logout` |
| DSA | `GET/POST/PUT/DELETE /dsa/problems` |
| Roadmap | `GET /roadmaps` `PUT /roadmaps/:id/node/:nodeId` |
| Notes | `GET/POST/PUT/DELETE /notes` |
| Resources | `GET/POST/PUT/DELETE /resources` |
| Certs | `GET/POST/PUT/DELETE /certifications` |
| Streak | `GET /streak` `POST /streak/log` |
| Timer | `POST /sessions` `GET /sessions/analytics` |
| AI | `POST /ai/chat` `GET /ai/suggestions` |

---

## 🚢 Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add env variable: `VITE_API_URL=https://your-api.com`

The `vercel.json` in the root handles SPA routing automatically.

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| react | 18.x | UI framework |
| vite | 5.x | Build tool |
| tailwindcss | 3.x | Styling |
| framer-motion | 11.x | Animations |
| zustand | 4.x | State management |
| react-router-dom | 6.x | Routing |
| recharts | 2.x | Charts |
| lucide-react | 0.344 | Icons |
| date-fns | 3.x | Date utilities |
| sonner | 1.x | Toast notifications |
| react-hook-form | 7.x | Form handling |

---

*Built with ❤️ by manvi Raj! 🚀*
