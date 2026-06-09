# ⚡ Customer Support Ticketing CRM System

A **production-ready** Customer Support Ticketing CRM built with **React + Vite + Tailwind CSS**, **Firebase Authentication**, **Node.js + Express**, and **SQLite**.

---



## 📦 Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Frontend   | React 18, Vite 5, Tailwind CSS 3, React Router v6  |
| Auth       | Firebase Authentication (Email/Password)           |
| HTTP       | Axios                                              |
| Backend    | Node.js 18+, Express 4                             |
| Database   | SQLite via `better-sqlite3`                        |
| Deployment | Vercel (frontend) + Render (backend)               |

---

## 🗂️ Project Structure

```
Customer-Support-Ticketing-CRM-System/
│
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
    │   ├── firebase/
    │   │   └── firebase.js          ← Firebase init (reads env vars)
    │   ├── context/
    │   │   └── AuthContext.jsx      ← Auth state + login/signup/logout
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx   ← Redirects to /login if not authed
    │   │   ├── StatusBadge.jsx
    │   │   ├── PriorityBadge.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── Spinner.jsx
    │   │   └── EmptyState.jsx
    │   ├── hooks/
    │   │   └── useTickets.js
    │   ├── layouts/
    │   │   └── AppLayout.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── TicketList.jsx
    │   │   ├── CreateTicket.jsx
    │   │   ├── TicketDetail.jsx
    │   │   └── NotFound.jsx
    │   ├── routes/AppRoutes.jsx
    │   ├── services/api.js          ← Axios client using VITE_API_URL
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    │   └── favicon.svg
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── vercel.json
    └── .env.example
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
| Dashboard with stat cards            | ✅     |
| All-tickets table (search + filter)  | ✅     |
| Create ticket with form validation   | ✅     |
| Ticket detail with notes timeline    | ✅     |
| Delete tickets & individual notes    | ✅     |
| Status updates (Open/In Progress/Closed) | ✅  |
| Priority & category fields           | ✅     |
| Mobile responsive layout             | ✅     |
| Toast notifications                  | ✅     |
| Loading spinners & empty states      | ✅     |

---

## 🔌 API Endpoints

| Method   | Endpoint                               | Description              |
|----------|----------------------------------------|--------------------------|
| `GET`    | `/api/health`                          | Health check             |
| `POST`   | `/api/tickets`                         | Create a ticket          |
| `GET`    | `/api/tickets`                         | List tickets             |
| `GET`    | `/api/tickets/stats`                   | Stats by status          |
| `GET`    | `/api/tickets/:ticketId`               | Get ticket + notes       |
| `PUT`    | `/api/tickets/:ticketId`               | Update status / add note |
| `DELETE` | `/api/tickets/:ticketId`               | Delete ticket            |
| `DELETE` | `/api/tickets/:ticketId/notes/:noteId` | Delete a note            |

### Request / Response Examples

**POST** `/api/tickets`
```json
// Request body
{
  "customer_name": "Alice Johnson",
  "customer_email": "alice@gmail.com",
  "subject": "Cannot login",
  "description": "Getting invalid credentials error"
}

// Response 201
{ "ticket_id": "TKT-001", "created_at": 1718000000000 }
```

**GET** `/api/tickets?status=Open&search=alice`
```json
{
  "tickets": [
    {
      "ticket_id": "TKT-001",
      "customer_name": "Alice Johnson",
      "subject": "Cannot login",
      "status": "Open",
      "created_at": 1718000000000
    }
  ],
  "total": 1
}
```

**PUT** `/api/tickets/TKT-001`
```json
// Request body
{ "status": "In Progress", "note": "Looking into this now" }

// Response
{ "success": true, "updated_at": 1718003000000 }
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo

```bash
git clone https://github.com/Harshita-0705/Customer-Support-Ticketing-CRM-System.git
cd Customer-Support-Ticketing-CRM-System
```

### 2. Backend

```bash
cd backend
npm install --ignore-scripts
cp .env.example .env
npm run dev
# Running at http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

```bash
npm run dev
# Running at http://localhost:5173
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Authentication** → **Sign-in method**
3. Enable **Email/Password**
4. Copy your config from **Project Settings → Your apps**

---

## 🚀 Deployment

### Architecture

```
User Browser
     ↓
Frontend (Vercel)
     ↓  API calls via VITE_API_URL
Backend (Render)
     ↓
SQLite Database (Render Disk)
```

### Frontend → Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Set **Root Directory** → `frontend`
4. Framework preset → **Vite**
5. Add **Environment Variables**:
```
VITE_API_URL                  = https://customer-support-ticketing-crm-system-kpb2.onrender.com
VITE_FIREBASE_API_KEY         = your_value
VITE_FIREBASE_AUTH_DOMAIN     = your_value
VITE_FIREBASE_PROJECT_ID      = your_value
VITE_FIREBASE_STORAGE_BUCKET  = your_value
VITE_FIREBASE_MESSAGING_SENDER_ID = your_value
VITE_FIREBASE_APP_ID          = your_value
```
6. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo
3. Set **Root Directory** → `backend`
4. Build command → `npm install --ignore-scripts`
5. Start command → `npm start`
6. Add a **Disk** → Mount path `/var/data` → Size 1GB
7. Add **Environment Variables**:
```
PORT         = 10000
NODE_ENV     = production
DB_PATH      = /var/data/crm.db
CORS_ORIGINS = https://your-app.vercel.app
```
8. Deploy

---

## 🔒 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `VITE_API_URL` | Frontend | Render backend URL |
| `VITE_FIREBASE_*` | Frontend | Firebase project config |
| `PORT` | Backend | Server port (10000 on Render) |
| `NODE_ENV` | Backend | `production` on Render |
| `DB_PATH` | Backend | SQLite file path |
| `CORS_ORIGINS` | Backend | Allowed frontend origins |

> ⚠️ Never commit `.env.local` to GitHub. Use `.env.example` as a template.

---

## 🏗️ Architecture Notes

- **Firebase Auth** is frontend-only — backend has no auth middleware
- **ProtectedRoute** redirects unauthenticated users to `/login` and returns them to the original URL after login
- **better-sqlite3** prebuilt binary included for Node 22 / Windows x64
- **CORS** configured to allow localhost dev + all Vercel preview URLs via regex
