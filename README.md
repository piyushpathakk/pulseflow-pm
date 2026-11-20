# ⚡ PulseFlow — Enterprise Project Management & Issue Tracking SaaS Platform

> **Linear-Speed Execution × Jira Enterprise Governance × Google AdSense Monetization Readiness**

PulseFlow is a commercial-grade, full-stack Project Management and Bug Tracking SaaS platform designed for high-velocity software engineering teams. Built with a futuristic **Royal Blue × Deep Purple** glassmorphism aesthetic, persistent WebSockets, comprehensive defect severity matrices, and complete Google AdSense policy compliance.

---

## 🎨 Design System & Visual Palette

PulseFlow implements an ultra-luxurious, futuristic SaaS user experience:
- **Royal Blue**: `#4169E1`
- **Electric Blue**: `#2563EB`
- **Deep Purple**: `#5B21B6`
- **Violet**: `#8B5CF6`
- **Lavender**: `#A78BFA`
- **Deep Obsidian Background**: `#0B1020`
- **Glassmorphism**: 16px backdrop-blur frosted cards with subtle neon glowing borders and floating depth.
- **Dynamic Themes**: Instant toggle between Royal Blue Dark Mode and High-Contrast Light Mode.

---

## 🚀 Key Architectural Features

### 1. Advanced Project & Sprint Management
- Create, configure, archive, and delete agile initiatives.
- Automatic project key generation (e.g. `NOVA`, `AETH`, `CORE`).
- Sprint progress indicators and completion percentage bars.
- Project collaborator management with granular roles.

### 2. High-Performance Drag-and-Drop Kanban Board
- 4 Columns: **To Do**, **In Progress**, **In Review**, **Done**.
- Smooth HTML5 drag-and-drop with optimistic client-side state reconcile.
- Sub-40ms WebSocket synchronization via Socket.io broadcasts to all active peers.
- Instant multi-factor filters: search query, issue type, priority, and assignee.

### 3. Defect Severity Matrix & Bug Tracker
- Dedicated classification: **Blocker (P0)**, **Critical (P1)**, **Major (P2)**, and **Minor (P3)**.
- Screenshot attachments and log file uploads powered by Multer.
- Linear-inspired keyboard-friendly table triage view with inline status switcher.
- Threaded collaborative comments and audit event history.

### 4. Enterprise Analytics & Productivity Reporting
- Interactive charts powered by **Recharts**:
  - 7-Day Velocity and task completion trends (AreaChart).
  - Sprint status allocation (PieChart).
  - Defect severity breakdown (BarChart).
  - Individual engineer velocity scores and productivity leaderboards.
- **One-Click CSV Report Exports** for sprint retrospectives.

### 5. Multi-Tier Role-Based Access Control (RBAC)
- **Admin**: Full superuser privileges, system metrics, user role management, AdSense configuration.
- **Manager**: Sprint planning, ticket creation, team invitations, and progress reporting.
- **Developer**: Ticket execution, status movement, screenshot attachments, and commenting.
- **Viewer**: Read-only oversight for stakeholders and clients.

### 6. Original Educational Blog & SEO Engine
- Content-rich engineering publications on Agile workflows, Kanban WIP limits, and defect triage.
- Fast SEO routing: dynamic Open Graph tags, canonical URLs, semantic HTML.
- **Dynamic XML Sitemap** automatically generated at `/sitemap.xml`.
- **Crawler Instructions** configured at `/robots.txt`.

### 7. Google AdSense Policy Compliance & Monetization Readiness
- **Configurable Publisher ID**: Supports standard `ca-pub-XXXXXXXXXXXXXXXX` via environment or admin panel.
- **Official ads.txt**: Dynamically served at `/ads.txt` with publisher verification token.
- **AdSense Verification Support**: Verified script injection and responsive ad slots.
- **Strict Compliance Safeguards**:
  - ✅ Ads are **NEVER** placed on login, registration, password recovery, or workspace pages.
  - ✅ Private workspaces and dashboards remain 100% distraction-free.
  - ✅ Ad units are clearly marked with "SPONSORED / ADVERTISEMENT".
  - ✅ Privacy Policy and Cookie Policy disclose Google DoubleClick DART cookies with opt-out links.
  - ✅ Persistent Cookie Consent banner for GDPR/CCPA compliance.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Tailwind CSS v4, Vite 8, React Router v7, Recharts, Lucide React, Socket.io Client, Axios |
| **Backend** | Node.js, Express.js, Socket.io, Multer, Helmet, CORS, JWT, bcryptjs, dotenv |
| **Database** | MongoDB Atlas / Mongoose + Automatic Embedded SQLite WAL Fallback Store |
| **Security** | Bcrypt password hashing, JWT bearer auth, RBAC middleware, secure file uploads |

---

## 🔑 Pre-Seeded Demo User Accounts

The database comes pre-seeded with realistic enterprise users:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `admin@pulseflow.dev` | `Admin@123456` | Full platform control, telemetry, users & AdSense |
| 💼 **Manager** | `sarah.chen@pulseflow.dev` | `Demo@123456` | Sprints, team invitations, project settings |
| 💻 **Senior Dev** | `alex.rivera@pulseflow.dev` | `Demo@123456` | Ticket creation, drag-and-drop, comments |
| 🐞 **QA Lead** | `elena.rostova@pulseflow.dev` | `Demo@123456` | Blocker bug logging, attachments |
| 👁️ **Viewer** | `marcus.vance@pulseflow.dev` | `Demo@123456` | Read-only board and analytics access |

---

## ⚡ Quick Start & Installation

### 1. Clone & Enter Repository
```bash
cd pulseflow-pm
```

### 2. Install Dependencies
```bash
# Install backend packages
cd backend && npm install

# Install frontend packages
cd ../frontend && npm install
```

### 3. Initialize Database & Seed Demo Data
```bash
cd ../backend
npm run seed
```

### 4. Run Automated Integration Test Suite
```bash
npm test
```
*Validates 19 integration tests across health, auth, projects, kanban drag/drop, bug triage, comments, notifications, CSV export, blog system, ads.txt, and sitemap.xml.*

### 5. Launch Development Servers
In separate terminal sessions:
```bash
# Terminal 1: Backend Server (Port 5000)
cd backend && npm run dev

# Terminal 2: Frontend Vite App (Port 5173)
cd frontend && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 API Endpoint Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and obtain JWT
- `GET /api/auth/me` — Retrieve active profile (Protected)
- `PUT /api/auth/profile` — Update name, bio, avatar, settings
- `PUT /api/auth/change-password` — Change password with old verification
- `POST /api/auth/forgot-password` — Generate password recovery token
- `POST /api/auth/reset-password` — Reset password using token
- `POST /api/auth/avatar` — Upload custom avatar (Multer)
- `GET /api/auth/users` — Fetch team directory for project assignment

### Projects (`/api/projects`)
- `GET /api/projects` — List all projects with live task metrics
- `POST /api/projects` — Create project with custom key
- `GET /api/projects/:id` — Get project details, members, and stats
- `PUT /api/projects/:id` — Update project metadata
- `DELETE /api/projects/:id` — Delete project and cascade tickets
- `POST /api/projects/:id/members` — Add collaborator with role
- `DELETE /api/projects/:id/members/:userId` — Remove collaborator

### Tasks & Bug Tracking (`/api/tasks`)
- `GET /api/tasks` — Filter tasks by project, status, type, severity, priority, or search
- `POST /api/tasks` — Create task or bug report (auto-generates key like `NOVA-101`)
- `GET /api/tasks/:id` — Detailed ticket view
- `PUT /api/tasks/:id` — Update ticket attributes
- `PUT /api/tasks/:id/status` — Kanban drag status update & WebSocket broadcast
- `POST /api/tasks/:id/attachments` — Upload screenshot / file attachment
- `DELETE /api/tasks/:id` — Remove ticket

### Comments (`/api/comments`)
- `GET /api/comments/:taskId` — Threaded comments for ticket
- `POST /api/comments` — Post comment & notify ticket owner/assignee

### Analytics & CSV Export (`/api/analytics`)
- `GET /api/analytics/dashboard` — Global task metrics, status pie, 7-day velocity
- `GET /api/analytics/team` — Productivity and velocity scores per engineer
- `GET /api/analytics/export-csv` — Direct CSV download of tickets

### Blog & Resources (`/api/articles`)
- `GET /api/articles` — Public blog articles
- `GET /api/articles/categories` — Article categories with counts
- `GET /api/articles/slug/:slug` — Single article by SEO slug
- `POST /api/articles` — Create article (Admin/Manager)
- `PUT /api/articles/:id` — Edit article (Admin/Manager)
- `DELETE /api/articles/:id` — Delete article (Admin)

### Google AdSense & SEO Endpoints
- `GET /ads.txt` — Public ads.txt crawler file
- `GET /sitemap.xml` — Dynamic XML sitemap for Google Search Console
- `GET /robots.txt` — Search engine crawler instructions
- `GET /api/adsense/config` — Public AdSense client configuration
- `PUT /api/adsense/config` — Update publisher ID & slot configuration (Admin)

---

## 🚢 Production Deployment Guide

### Deploying to Render & Railway
1. Push repository to GitHub.
2. In Render / Railway, select **Web Service**.
3. Root Directory: `backend`
4. Build Command: `npm install && cd ../frontend && npm install && npm run build`
5. Start Command: `npm start`
6. Set Environment Variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=<strong-random-key>`
   - `MONGODB_URI=mongodb+srv://<user>:<pwd>@cluster0.abcde.mongodb.net/pulseflow?retryWrites=true&w=majority`
   - `ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX`

### Deploying Frontend to Vercel (Optional Decoupled Setup)
1. Link the `frontend/` directory to Vercel.
2. Framework Preset: **Vite**
3. Output Directory: `dist`
4. Configure `/api` rewrite to your backend URL in `vercel.json`.

---

## 📋 Google AdSense Approval Readiness Checklist

- [x] **Original, High-Value Content**: Human-quality 1,000+ word engineering publications on Agile and Kanban.
- [x] **Mandatory Policy Pages**: About Us, Contact Us, Privacy Policy, Terms, Disclaimer, Cookie Policy.
- [x] **Verified ads.txt**: Automatically served at `/ads.txt` with publisher token.
- [x] **XML Sitemap & robots.txt**: Dynamically generated and compliant with Google Search Console.
- [x] **Clear Ad Separation**: Ads are marked "SPONSORED / ADVERTISEMENT" and segregated from editorial copy.
- [x] **Ad-Free Workspace**: No ads on login, registration, or private authenticated workspaces.
- [x] **GDPR/CCPA Cookie Consent**: Interactive banner with essential vs advertising cookie choice.

---

## 📄 License
ISC License &copy; 2026 PulseFlow Systems Inc.
