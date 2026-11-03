# Ticket Management System

A production-grade, full-stack enterprise Ticket Management System built with **React**, **TypeScript**, **Material UI (MUI)**, **FastAPI**, **SQLAlchemy 2.0**, and **PostgreSQL**.

The application features full JWT authentication with Bearer tokens, strict server-side role-based access control (RBAC) separating `USER` and `ADMIN` workflows, comprehensive data validation with **Zod** and **Pydantic**, automated database migrations via **Alembic**, and interactive OpenAPI documentation.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Features](#2-features)
- [3. Mandatory Technology Stack](#3-mandatory-technology-stack)
- [4. Project Architecture](#4-project-architecture)
- [5. Database Schema & Models](#5-database-schema--models)
- [6. Default Credentials & Role Management](#6-default-credentials--role-management)
- [7. Backend Setup](#7-backend-setup)
- [8. Frontend Setup](#8-frontend-setup)
- [9. Running the Application](#9-running-the-application)
- [10. API Documentation (Swagger)](#10-api-documentation-swagger)
- [11. Security & Architectural Decisions](#11-security--architectural-decisions)

---

## 1. Project Overview

The Ticket Management System allows clients to register their own accounts (`USER` role), submit support inquiries, track progress through distinct statuses (`OPEN`, `IN_PROGRESS`, `CLOSED`), and manage their tickets. System administrators (`ADMIN` role) have full visibility over all tickets, can adjust ticket statuses, edit or delete tickets across all accounts, and inspect the registered user directory.

Security and isolation are enforced at the backend dependency and router layer: regular users cannot query, view, edit, or delete another user's tickets, nor can they alter protected ticket statuses or access administrative endpoints.

---

## 2. Features

### Authentication & Security
- **JWT Authentication:** Signed HS256 tokens carrying user claims (`sub`, `email`, `role`, `iat`, `exp`).
- **Secure Password Hashing:** Robust Bcrypt hashing; passwords are never stored in plaintext.
- **Centralized FastAPI Dependencies:** `get_current_user` and `get_current_admin` extract, verify, and enforce Bearer tokens.
- **Axios Interceptor:** Automatically appends Bearer tokens to outgoing API requests and safely resets state on 401 expiration.
- **Auto-Seeded Default Admin:** On backend startup, the system automatically ensures the default administrator account exists.

### Role-Based Access Control (RBAC)
- **Standard Users (`USER`):**
  - Register their own accounts via the web registration page (`/register`).
  - Create support tickets (automatically initialized with `OPEN` status).
  - View only tickets created under their account.
  - View full ticket details for their own tickets.
  - Edit title and description of their own tickets.
  - Delete their own tickets.
  - Access account profile.
- **Administrators (`ADMIN`):**
  - Log in using default admin credentials (`admin@example.com` / `Admin@123`).
  - View all tickets submitted across the entire platform.
  - Update ticket title, description, and status (`OPEN`, `IN_PROGRESS`, `CLOSED`).
  - Delete any ticket in the system.
  - Access user directory (`GET /api/users`) with search and pagination.
  - Inspect creator details on each ticket.

### Frontend Application
- **Material UI (MUI) Enterprise Theme:** Clean, restrained navy (`#0F172A`) and royal blue (`#2563EB`) design system.
- **KPI Metrics Dashboard:** Real-time statistics calculated directly from API data:
  - User view: Total Tickets, Open Tickets, In Progress Tickets, Closed Tickets, Recent Tickets.
  - Admin view: Total Tickets, Total Registered Users, Open, In Progress, Closed.
- **Interactive Ticket List:** MUI Table with search filtering, status dropdown filter, pagination, and sorting.
- **Modal Confirmation Dialogs:** Prevents accidental deletion with confirmation prompts.
- **Toast Notifications:** MUI Snackbar and Alerts for validation errors and success confirmations.
- **Protected Routing:** Strict route guards (`PublicRoute`, `ProtectedRoute`, `AdminRoute`) redirecting unauthorized navigation.

---

## 3. Mandatory Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Material UI (MUI v5), React Router DOM v6, Axios, React Hook Form, Zod |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, PyJWT, Passlib, Bcrypt |
| **Database** | PostgreSQL 14+, Psycopg 3 (`psycopg[binary]`) driver, SQLite (auto-fallback if PostgreSQL is offline) |

---

## 4. Project Architecture

```
ticket-management-system/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts           # Axios client with JWT Bearer interceptor
│   │   │   ├── authApi.ts         # Login, register, current user API
│   │   │   ├── ticketApi.ts       # CRUD endpoints for support tickets
│   │   │   └── userApi.ts         # User management API for admins
│   │   │
│   │   ├── assets/                # Static assets and icons
│   │   ├── components/
│   │   │   ├── common/            # Reusable UI widgets (chips, modals, spinners)
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   ├── NotificationSnackbar.tsx
│   │   │   │   ├── RoleChip.tsx
│   │   │   │   └── StatusChip.tsx
│   │   │   └── layout/            # Navigation layout elements
│   │   │       ├── Navbar.tsx
│   │   │       └── Sidebar.tsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Global authentication & user state context
│   │   ├── hooks/
│   │   │   └── useAuth.ts         # Hook to access AuthContext
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx     # Centered card layout for login & register
│   │   │   └── DashboardLayout.tsx# SaaS layout with navbar, sidebar, and container
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.tsx          # User & Admin login page
│   │   │   ├── Register.tsx       # Standard user registration page
│   │   │   ├── Dashboard.tsx      # Metrics & recent activity dashboard
│   │   │   ├── Tickets.tsx        # Filterable ticket table with pagination
│   │   │   ├── CreateTicket.tsx   # Ticket submission form
│   │   │   ├── EditTicket.tsx     # Ticket update page (with status edit for admins)
│   │   │   ├── TicketDetails.tsx  # In-depth ticket viewer with creator info
│   │   │   ├── Users.tsx          # Admin-only user directory
│   │   │   ├── Profile.tsx        # Authenticated user account information
│   │   │   └── NotFound.tsx       # 404 handler
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx      # Route configuration table
│   │   │   ├── ProtectedRoute.tsx # Route guard for logged-in users
│   │   │   ├── AdminRoute.tsx     # Route guard for administrators
│   │   │   └── PublicRoute.tsx    # Route guard redirecting authenticated users
│   │   │
│   │   ├── types/                 # TypeScript interfaces and type definitions
│   │   │   ├── auth.ts
│   │   │   ├── ticket.ts
│   │   │   └── user.ts
│   │   │
│   │   ├── theme.ts               # Custom enterprise Material UI theme
│   │   ├── App.tsx                # App root provider wrapper
│   │   ├── main.tsx               # Entrypoint mounting DOM
│   │   └── vite-env.d.ts
│   │
│   ├── .env.example
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── dependencies.py    # FastAPI dependencies for JWT and RBAC verification
│   │   │   ├── jwt.py             # PyJWT encoding and validation
│   │   │   └── password.py        # Passlib bcrypt password hashing
│   │   ├── database/
│   │   │   ├── base.py            # SQLAlchemy DeclarativeBase
│   │   │   └── connection.py      # SessionLocal, Engine, and get_db dependency
│   │   ├── models/
│   │   │   ├── ticket.py          # Ticket model & TicketStatus Enum
│   │   │   └── user.py            # User model & UserRole Enum
│   │   ├── routers/
│   │   │   ├── auth.py            # /api/auth endpoints
│   │   │   ├── tickets.py         # /api/tickets CRUD endpoints
│   │   │   └── users.py           # /api/users admin endpoint
│   │   ├── schemas/
│   │   │   ├── auth.py            # Pydantic schemas for authentication
│   │   │   ├── ticket.py          # Pydantic schemas for tickets
│   │   │   └── user.py            # Pydantic schemas for users
│   │   ├── services/
│   │   │   ├── auth_service.py    # Authentication business logic
│   │   │   ├── ticket_service.py  # Ticket CRUD & authorization logic
│   │   │   └── user_service.py    # User directory querying logic
│   │   ├── utils/
│   │   │   └── bootstrap_admin.py # Controlled CLI command to create admin accounts
│   │   ├── config.py              # Pydantic BaseSettings environment configuration
│   │   └── main.py                # FastAPI factory, CORS, and auto-admin seeding
│   │
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 001_initial_tables.py
│   │   ├── env.py
│   │   └── script.py.mako
│   │
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── database/
│   └── init.sql                   # Direct PostgreSQL DDL script
│
├── .gitignore
└── README.md
```

---

## 5. Database Schema & Models

### `users` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY`, Autoincrement | Unique user identifier |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full name of the user |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE`, Indexed | Case-insensitive login email |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt password hash |
| `role` | `VARCHAR(50)` | `NOT NULL`, Default `'USER'` | Access role (`ADMIN` or `USER`) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT now()` | User registration timestamp |

### `tickets` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | `PRIMARY KEY`, Autoincrement | Unique ticket identifier |
| `title` | `VARCHAR(255)` | `NOT NULL` | Summary of the issue |
| `description` | `TEXT` | `NOT NULL` | Detailed explanation of the issue |
| `status` | `VARCHAR(50)` | `NOT NULL`, Default `'OPEN'`, Indexed | Lifecycle status (`OPEN`, `IN_PROGRESS`, `CLOSED`) |
| `user_id` | `INTEGER` | `NOT NULL`, Indexed, `REFERENCES users(id) ON DELETE CASCADE` | Creator foreign key |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT now()` | Creation timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, `DEFAULT now()` | Last update timestamp |

---

## 6. Default Credentials & Role Management

### Administrator Role (Pre-Configured)
The default administrator account is **automatically seeded into the database on startup**:
- **Email:** `admin@example.com`
- **Password:** `Admin@123`
- **Role:** `ADMIN`

### Standard User Role (Self-Registration)
Users create their own accounts directly through the application:
1. Open `http://localhost:5173/register`
2. Enter your **Name**, **Email**, and **Password** (min 8 characters).
3. The server automatically assigns the `USER` role.
4. Sign in at `http://localhost:5173/login`.

---

## 7. Backend Setup

From the `backend` directory:
```bash
cd backend
python -m venv .venv
```

Activate virtual environment:
- **Windows (PowerShell):** `.\.venv\Scripts\Activate.ps1`
- **Windows (CMD):** `.\.venv\Scripts\activate.bat`
- **macOS / Linux:** `source .venv/bin/activate`

Install dependencies:
```bash
pip install -r requirements.txt
```

---

## 8. Frontend Setup

From the `frontend` directory:
```bash
cd frontend
npm install
```

---

## 9. Running the Application

### 1. Start Backend Server
In terminal #1:
```bash
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload
```
*(Runs on `http://localhost:8000`)*

### 2. Start Frontend Server
In terminal #2:
```bash
cd frontend
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 10. API Documentation (Swagger)

FastAPI provides full interactive API documentation:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 11. Security & Architectural Decisions

1. **Server-Side Enforcement:**
   All authorization and ownership checks are verified in FastAPI backend dependencies (`get_current_user`, `get_current_admin`) and SQL queries.
2. **Password Masking:**
   Pydantic schemas explicitly exclude `password_hash` across all endpoints (`UserResponse`, `UserListResponse`).
3. **Automatic Admin Seeding:**
   The `seed_default_admin` function runs on application startup to guarantee the default administrator is always available without requiring manual SQL queries.
4. **Self-Registration Security:**
   Public registration via `/api/auth/register` hardcodes `role=UserRole.USER` to prevent privilege escalation.
