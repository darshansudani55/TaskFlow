# TaskFlow 📋

> A full-stack task management web application built with React, Node.js, Express, and MongoDB Atlas.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## 📌 Overview

TaskFlow is a clean, modern, single-user task management app that lets you create, organize, filter, and track your daily tasks. All data is persisted in MongoDB Atlas, so your tasks survive browser refreshes and restarts.

> ⚠️ **Security Notice:** This is a single-user demo without login or authentication. Do not store confidential information in the public demo. Add proper user authentication before deploying for multiple users.

---

## ✨ Features

- ✅ Create, view, edit, and delete tasks
- 🔍 Search tasks by title or description
- 🗂 Filter by status (Pending / Completed) and priority (Low / Medium / High)
- 📅 Optional due dates with overdue detection
- 📊 Dashboard with statistics and a progress indicator
- 🔔 Toast notifications for all actions
- 🗑 Delete confirmation dialogs
- 📱 Fully responsive (desktop, tablet, mobile)
- ♿ Accessible — keyboard navigation and ARIA labels throughout

---

## 🛠 Technology Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 18, Vite, React Router v6       |
| Styling    | Vanilla CSS (custom design system)    |
| Backend    | Node.js, Express 4                    |
| Database   | MongoDB Atlas (Mongoose ODM)          |
| API        | REST (JSON)                           |
| Testing    | Jest, Supertest, mongodb-memory-server|
| Deployment | Frontend → Vercel, Backend → Render   |

---

## 📁 Project Structure

```
TaskFlow/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── tasks.js              # Centralized API utility
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatisticsCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── FilterControls.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   ├── LoadingIndicator.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── ConfirmationDialog.jsx
│   │   │   └── ToastNotification.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── AddTask.jsx
│   │   │   ├── EditTask.jsx
│   │   │   └── TaskDetails.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── taskController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── Task.js
│   ├── routes/
│   │   ├── taskRoutes.js
│   │   └── statsRoutes.js
│   ├── tests/
│   │   └── tasks.test.js
│   ├── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** v18 or later — [Download](https://nodejs.org/)
- **npm** v9 or later (comes with Node.js)
- **MongoDB Atlas** account (free tier is sufficient) — [Create account](https://www.mongodb.com/cloud/atlas)
- **Git** — [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

Copy the example file and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```bash
cp frontend/.env.example frontend/.env
```

The default value works for local development and does not need to change until you deploy:

```
VITE_API_URL=http://localhost:5000
```

---

## 🍃 MongoDB Atlas Setup

Follow these steps to create your free cloud database:

### Step 1 — Create an account
Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up for a free account.

### Step 2 — Create a cluster
1. Click **"Build a Database"**
2. Choose **"Free"** (M0 Sandbox)
3. Select a cloud provider and region (any is fine)
4. Click **"Create"**

### Step 3 — Create a database user
1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **Password** authentication
4. Enter a username and a strong password (save these!)
5. Under "Database User Privileges", select **"Read and write to any database"**
6. Click **"Add User"**

### Step 4 — Configure network access
1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development: click **"Allow Access from Anywhere"** (`0.0.0.0/0`)
4. For production: add only your Render server's IP address

### Step 5 — Get your connection string
1. Click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Click **"Drivers"**
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with the credentials from Step 3
6. Add `/taskflow` before the `?` to specify the database name:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
   ```
7. Paste this into `MONGODB_URI` in `backend/.env`

### Step 6 — Verify the connection
Start the backend and look for:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 TaskFlow API running on port 5000
```

### Troubleshooting MongoDB connection
| Error | Solution |
|-------|----------|
| `Authentication failed` | Check username/password in the connection string |
| `Network timeout` | Check Network Access — make sure your IP is allowed |
| `ECONNREFUSED` | MongoDB URI may be wrong or empty |
| `Cannot find module '../models/Task'` | Make sure you ran `npm install` |

---

## 💻 Running Locally

Open two terminal windows.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

The API will start at: `http://localhost:5000`

Verify it works:
```bash
curl http://localhost:5000/api/health
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

The app will start at: `http://localhost:5173`

---

## 🌐 API Endpoints

**Base URL (local):** `http://localhost:5000`

| Method   | Endpoint                    | Description                        |
|----------|-----------------------------|------------------------------------|
| `GET`    | `/api/health`               | API health status                  |
| `GET`    | `/api/tasks/stats`          | Dashboard statistics               |
| `GET`    | `/api/tasks`                | Get all tasks (with filters)       |
| `POST`   | `/api/tasks`                | Create a task                      |
| `GET`    | `/api/tasks/:id`            | Get a single task                  |
| `PUT`    | `/api/tasks/:id`            | Update all task fields             |
| `PATCH`  | `/api/tasks/:id/status`     | Update task status only            |
| `DELETE` | `/api/tasks/:id`            | Delete a task                      |

### Query Parameters for `GET /api/tasks`

| Parameter  | Values                         | Example                        |
|------------|--------------------------------|--------------------------------|
| `search`   | Any string                     | `?search=meeting`              |
| `status`   | `Pending`, `Completed`         | `?status=Pending`              |
| `priority` | `Low`, `Medium`, `High`        | `?priority=High`               |
| `sort`     | `newest`, `oldest`, `dueDate`  | `?sort=oldest`                 |
| `page`     | Number                         | `?page=2`                      |
| `limit`    | Number (max 100)               | `?limit=10`                    |

### Sample Requests

**Create a task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","priority":"Low","dueDate":"2024-12-31"}'
```

**Get all pending tasks:**
```bash
curl "http://localhost:5000/api/tasks?status=Pending&sort=dueDate"
```

**Update task status:**
```bash
curl -X PATCH http://localhost:5000/api/tasks/TASK_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'
```

---

## 🧪 Testing

Backend tests use **Jest** + **Supertest** with an **in-memory MongoDB** database (does NOT touch your real database).

### Run backend tests

```bash
cd backend
npm test
```

### Run frontend production build (validates code)

```bash
cd frontend
npm run build
```

---

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| `VITE_API_URL` not defined | Copy `frontend/.env.example` to `frontend/.env` |
| Backend won't start | Check `MONGODB_URI` in `backend/.env` |
| CORS errors in browser | Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly |
| Blank page on frontend | Check browser console — usually a missing env variable |
| Tasks not saving | Verify MongoDB Atlas connection string and network access |
| Port already in use | Change `PORT` in `backend/.env` or kill the process using that port |

---

## 📸 Screenshots

*(Add screenshots here after running the application)*

To add screenshots:
1. Run the application locally
2. Take screenshots of the Dashboard, Task List, and Add Task form
3. Save them in a `docs/screenshots/` folder
4. Replace this section with: `![Dashboard](docs/screenshots/dashboard.png)`

---

## 🔒 Security

- Database credentials are stored in `.env` files (never committed to Git)
- Input is validated on both frontend and backend
- CORS is configured to allow only the specified frontend origin
- Rate limiting: 200 requests per 15 minutes per IP
- Stack traces are hidden in production responses
- MongoDB queries use Mongoose (safe from injection)
- **Not implemented yet:** User authentication, task ownership, HTTPS certificate management

---

## 🐙 GitHub Setup

```bash
# 1. Initialize git (from the taskflow root directory)
git init

# 2. Stage all files
git add .

# 3. Initial commit
git commit -m "feat: initial TaskFlow implementation"

# 4. Create a new repository on GitHub (go to github.com → New Repository)
#    Name it: taskflow
#    Do NOT initialize with README or .gitignore

# 5. Add the remote
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git

# 6. Push
git branch -M main
git push -u origin main
```

---

## ☁️ Deployment

### Backend on Render

1. Go to [https://render.com](https://render.com) and sign in
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node
5. Add environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `FRONTEND_URL` — your Vercel frontend URL (e.g. `https://taskflow-xyz.vercel.app`)
   - `NODE_ENV` — `production`
6. Click **"Create Web Service"**
7. Wait for the first deploy to finish (~3 minutes)
8. Test: `https://your-service.onrender.com/api/health`

### Frontend on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - `VITE_API_URL` — your Render backend URL (e.g. `https://taskflow-api.onrender.com`)
6. Click **"Deploy"**
7. After deploy, update `FRONTEND_URL` in your Render backend to the Vercel URL
8. Redeploy the backend on Render (so CORS is updated)

### URLs to verify after deployment

- `https://your-backend.onrender.com/api/health` → Should return `{"success":true,"message":"TaskFlow API is running",...}`
- `https://your-frontend.vercel.app` → Should show the TaskFlow dashboard

---

## 🔮 Future Improvements

### Version 2 Ideas
- 👤 User authentication (JWT + bcrypt)
- 📁 Task categories and labels
- 🔔 Email or push notification reminders
- 📎 File attachments per task
- 🧑‍🤝‍🧑 Task sharing and collaboration
- 📈 More detailed analytics and charts
- 🌙 Dark mode support
- 📱 Progressive Web App (PWA) support
- ♻️ Recurring tasks

---

## 🌐 Live Demo

| Environment | URL |
|-------------|-----|
| Frontend    | *(Add your Vercel URL here after deploying)* |
| Backend API | *(Add your Render URL here after deploying)* |
| GitHub      | *(Add your GitHub repository URL here)* |

---

*Built with ❤️ as a beginner full-stack learning project.*
