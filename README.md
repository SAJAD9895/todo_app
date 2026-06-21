# TodoApp — Full-Stack Todo Application

A production-ready full-stack Todo application built with **React**, **Express.js**, and **PostgreSQL**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios, Chart.js |
| Backend | Node.js, Express.js, JWT, bcrypt, express-validator |
| Database | PostgreSQL, Sequelize ORM |
| DevOps | Docker, Docker Compose, Nginx |

## Features

- **Auth** — Register, Login, JWT-based protected routes
- **Todos** — Full CRUD with title, description, priority, status, category, due date, reminder
- **Views** — List view & Card view with search, filter, sort, pagination
- **Bulk actions** — Select and delete multiple tasks
- **Dashboard** — Stats overview + Chart.js charts (weekly activity, priority breakdown)
- **Reminders** — Browser Notification API + in-app alerts for due/overdue tasks
- **Dark Mode** — System-aware with manual toggle
- **Responsive** — Mobile-first design

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- (Optional) Docker & Docker Compose

---

### Option A — Docker (recommended)

```bash
cd todo-app
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Demo login: `demo@todoapp.com` / `Demo@1234`

---

### Option B — Manual Setup

#### 1. Database

```sql
-- Create database in psql
CREATE DATABASE todo_app;
\c todo_app
\i database/schema.sql
\i database/seed.sql
```

#### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials

npm install
npm run dev       # runs on http://localhost:5000
```

#### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api

npm install
npm run dev       # runs on http://localhost:5173
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/todo_app` |
| `JWT_SECRET` | Secret for signing tokens (32+ chars) | `your-secret-here` |
| `JWT_EXPIRES_IN` | Token TTL | `7d` |
| `CORS_ORIGIN` | Allowed origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/profile` | Yes | Get current user |

**Register / Login body:**
```json
{
  "name": "John Doe",       // register only
  "email": "john@example.com",
  "password": "Secret@123",
  "confirmPassword": "Secret@123"  // register only
}
```

### Todos

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | List todos (paginated, filterable) |
| POST | `/api/todos` | Create todo |
| GET | `/api/todos/:id` | Get single todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| DELETE | `/api/todos/bulk` | Bulk delete |

**GET /api/todos query params:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `search` | string | Search title/description/category |
| `status` | string | `pending` \| `in_progress` \| `completed` |
| `priority` | string | `low` \| `medium` \| `high` |
| `category` | string | Filter by category |
| `sortBy` | string | `createdAt` \| `dueDate` \| `title` \| `priority` |
| `sortOrder` | string | `ASC` \| `DESC` |

**Todo body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "status": "pending",
  "category": "Personal",
  "dueDate": "2025-07-01T10:00:00Z",
  "reminderTime": "2025-07-01T09:00:00Z"
}
```

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Get stats + charts data |

**Response:**
```json
{
  "overview": {
    "total": 20, "completed": 8, "pending": 10,
    "inProgress": 2, "overdue": 3, "todayTasks": 4,
    "completionRate": 40
  },
  "priorityBreakdown": { "low": 5, "medium": 10, "high": 5 },
  "weeklyActivity": [{ "date": "2025-06-15", "count": "3" }]
}
```

**All API responses:**
```json
{ "success": true, "message": "...", "data": { ... } }
// or
{ "success": false, "message": "...", "errors": [...] }
```

---

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build           # verify build locally first

# Push to GitHub, then in Vercel dashboard:
# 1. Import repo → select /frontend as root
# 2. Framework preset: Vite
# 3. Add env var: VITE_API_URL=https://your-backend.railway.app/api
# 4. Deploy
```

Or with Vercel CLI:
```bash
npm i -g vercel
cd frontend
vercel --prod
```

### Backend → Railway

1. Push code to GitHub
2. Create new Railway project → "Deploy from GitHub"
3. Select the `backend/` subdirectory
4. Add environment variables (copy from `.env.example`)
5. Set `DATABASE_URL` to your Supabase/Neon connection string
6. Deploy — Railway auto-detects `npm start`

Or with Railway CLI:
```bash
npm i -g @railway/cli
cd backend
railway login
railway init
railway up
```

### Database → Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste `database/schema.sql` → Run
3. (Optional) paste `database/seed.sql` for demo data
4. Copy the **Connection String** (Transaction mode, port 6543)
5. Set it as `DATABASE_URL` in your backend environment

Or → **Neon** (alternative):
1. Create project at [neon.tech](https://neon.tech)
2. Run the schema SQL in the SQL editor
3. Use the provided `DATABASE_URL`

---

## Project Structure

```
todo-app/
├── backend/
│   ├── config/           # DB config, JWT helpers
│   ├── controllers/      # authController, todoController, dashboardController
│   ├── middleware/        # auth, rateLimiter, errorHandler
│   ├── models/           # User, Todo (Sequelize)
│   ├── routes/           # auth, todos, dashboard
│   ├── utils/            # response helpers, logger
│   ├── validations/      # express-validator rules
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── auth/     # LoginForm, RegisterForm
│       │   ├── dashboard/ # StatsCard, CompletionChart, PriorityChart
│       │   ├── todos/    # TodoList, TodoItem, TodoCard, TodoForm, TodoFilters, BulkActions
│       │   └── ui/       # Button, Input, Modal, Navbar, Sidebar, Badge, Pagination…
│       ├── context/      # AuthContext, ThemeContext, TodoContext
│       ├── hooks/        # useNotifications
│       ├── layouts/      # MainLayout, AuthLayout
│       ├── pages/        # LoginPage, RegisterPage, DashboardPage, TodosPage
│       ├── services/     # api.js, authService, todoService, dashboardService
│       └── utils/        # constants, helpers, validators
│
├── database/
│   ├── schema.sql        # Table definitions
│   └── seed.sql          # Demo data
│
├── docker-compose.yml
└── README.md
```

---

## Security Measures

- **JWT** authentication on all protected routes
- **bcrypt** (cost factor 12) for password hashing
- **Helmet** sets security HTTP headers
- **CORS** restricted to configured origin
- **Rate limiting** — 100 req/15min globally, 10 req/15min on auth routes
- **express-validator** validates all inputs
- **Sequelize parameterized queries** prevent SQL injection
- **Sequelize scopes** ensure users only access their own todos
- **No password in API responses** (User.toJSON strips it)

---

## Demo Credentials

After seeding:
- Email: `demo@todoapp.com`
- Password: `Demo@1234`
