# ⚡ Customer Support Ticketing CRM System

A **production-ready** Customer Support Ticketing CRM built with **React + Vite + Tailwind CSS**, **Firebase Authentication**, **Node.js + Express**, and **SQLite**.

---

## 🚀 Live Demo

> **Frontend** → Deploy to Vercel  
> **Backend** → Deploy to Render

---

## 📦 Tech Stack

| Layer          | Technology                                          |
|----------------|-----------------------------------------------------|
| Frontend       | React 18, Vite 5, Tailwind CSS 3, React Router v6  |
| Auth           | Firebase Authentication (Email/Password)            |
| HTTP Client    | Axios                                               |
| Backend        | Node.js 18+, Express 4                              |
| Database       | SQLite via `better-sqlite3`                         |
| Deploy         | Vercel (frontend) + Render (backend)                |

---

## 🗂️ Project Structure

```
support-crm/
├── backend/
│   ├── src/
│   │   ├── controllers/ticketController.js
│   │   ├── services/ticketService.js
│   │   ├── routes/tickets.js
│   │   ├── middleware/errorHandler.js
│   │   ├── middleware/requestLogger.js
│   │   ├── database/db.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   ├── render.yaml
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── firebase/firebase.js        ← Firebase init
    │   ├── context/
    │   │   ├── AuthContext.jsx          ← Auth state + methods
    │   │   └── ThemeContext.jsx         ← Dark/light theme
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx       ← Auth guard
    │   │   ├── StatusBadge.jsx
    │   │   ├── PriorityBadge.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── Spinner.jsx
    │   │   └── EmptyState.jsx
    │   ├── hooks/useTickets.js
    │   ├── layouts/AppLayout.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── TicketList.jsx
    │   │   ├── CreateTicket.jsx
    │   │   ├── TicketDetail.jsx
    │   │   └── NotFound.jsx
    │   ├── routes/AppRoutes.jsx
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── .env.local.example
```

---

## ✅ Features

| Feature                              | Status |
|--------------------------------------|--------|
| Firebase Email/Password Auth         | ✅     |
| Protected routes (redirect to login) | ✅     |
| Login page with validation           | ✅     |
| Signup with password strength meter  | ✅     |
| Sign out (sidebar + topbar)          | ✅     |
| Dark / Light theme toggle            | ✅     |
| Dashboard with stat cards            | ✅     |
| All-tickets table (search + filter)  | ✅     |
| Create ticket with validation        | ✅     |
| Ticket detail with notes timeline    | ✅     |
| Delete tickets & individual notes    | ✅     |
| Status updates                       | ✅     |
| Priority & category fields           | ✅     |
| Mobile responsive                    | ✅     |
| Toast notifications                  | ✅     |
| Loading spinners & empty states      | ✅     |

---

## 🔌 API Reference

| Method   | Endpoint                             | Description                  |
|----------|--------------------------------------|------------------------------|
| GET      | `/api/health`                        | Health check                 |
| POST     | `/api/tickets`                       | Create ticket                |
| GET      | `/api/tickets`                       | List tickets (search/filter) |
| GET      | `/api/tickets/stats`                 | Count by status              |
| GET      | `/api/tickets/:ticketId`             | Ticket detail + notes        |
| PUT      | `/api/tickets/:ticketId`             | Update status / add note     |
| DELETE   | `/api/tickets/:ticketId`             | Delete ticket                |
| DELETE   | `/api/tickets/:ticketId/notes/:noteId` | Delete a note              |

---

## ⚙️ Local Setup

### 1. Clone

```bash
git clone https://github.com/Harshita-0705/Customer-Support-Ticketing-CRM-System.git
cd Customer-Support-Ticketing-CRM-System
```

### 2. Backend

```bash
cd backend
npm install --ignore-scripts
cp .env.example .env
npm run dev          # http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your Firebase credentials in .env.local
npm run dev          # http://localhost:5173
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project → Enable **Authentication → Email/Password**
3. Project Settings → Your apps → Copy the config
4. Paste into `frontend/.env.local`

---

## 🚀 Deployment

### Frontend → Vercel

1. Push to GitHub, import repo at [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Framework: **Vite**
4. Add env vars from `.env.local.example`

### Backend → Render

1. New Web Service → Connect repo
2. Root directory: `backend`
3. Build: `npm install --ignore-scripts`
4. Start: `npm start`
5. Add a **Disk** at `/var/data`, set `DB_PATH=/var/data/crm.db`
6. Set `NODE_ENV=production`, `CORS_ORIGINS=https://your-app.vercel.app`

---

## 🏗️ Architecture Notes

- **Firebase Auth** is frontend-only — no backend auth middleware needed
- **ProtectedRoute** redirects unauthenticated users to `/login` and restores the original URL after login
- **CSS variables** power the dark/light theme — every component reads from `var(--bg)`, `var(--surface)`, etc.
- **better-sqlite3** prebuilt binary is included for Node 22 / Windows x64
