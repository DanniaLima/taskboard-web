
# TaskBoard Web

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=for-the-badge&logo=vercel)

A modern task management web application built with **React**, **TypeScript**, **Vite** and **Tailwind CSS**. Connects to the [TaskBoard API](https://github.com/DanniaLima/taskboard-api) for full CRUD operations on tasks.

## 🚀 Live Demo

**Deployed on Vercel:**

- 🔗 **Web App:** [https://taskboard-web-rho.vercel.app](https://taskboard-web-rho.vercel.app)
- 🔗 **Backend API:** [https://taskboard-api-6aml.onrender.com/swagger-ui/index.html](https://taskboard-api-6aml.onrender.com/swagger-ui/index.html)

> ⚠️ The backend runs on a free-tier Render instance that sleeps after 15 minutes of inactivity. The first request may take up to 50 seconds to wake it up.

## Features

- Full CRUD for tasks (create, read, update, delete)
- Mark tasks as done with a single click
- Inline edit — the form replaces the card in place
- Color-coded badges for status and priority
- Loading skeleton for a smoother UX
- Friendly empty state with call-to-action
- Custom favicon and branded header
- Responsive dark interface
- Confirmation prompt before destructive actions

## Tech Stack

| Category            | Technology                          |
|---------------------|--------------------------------------|
| Language            | TypeScript                           |
| Library             | React 19                             |
| Build Tool          | Vite                                 |
| Styling             | Tailwind CSS v4                      |
| HTTP Client         | Native `fetch`                       |
| Type Safety         | TypeScript interfaces + strict mode  |
| Deployment          | Vercel                               |
| Backend Integration | REST API (Spring Boot)               |

## Architecture

```
┌──────────────────┐      fetch       ┌──────────────────┐
│  React Frontend  │ ───────────────► │  Spring Boot API │
│  (Vercel)        │ ◄─────────────── │  (Render)        │
└──────────────────┘      JSON        └──────────────────┘
                                              │
                                              ▼
                                      ┌──────────────────┐
                                      │   PostgreSQL     │
                                      │   (Supabase)     │
                                      └──────────────────┘
```

## Project Structure

```
taskboard-web/
├── public/
│   ├── favicon.svg
│   ├── favicon.png
│   └── logo.png
├── src/
│   ├── components/
│   │   └── TaskForm.tsx
│   ├── services/
│   │   └── taskService.ts
│   ├── types/
│   │   └── task.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .vscode/
│   └── settings.json
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Running Locally

### Prerequisites

- Node.js 20+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/DanniaLima/taskboard-web.git
cd taskboard-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://taskboard-api-6aml.onrender.com/api/tasks
```

> The app falls back to the production API URL if `VITE_API_URL` is not set — useful for quick local testing.

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

The project is deployed on **Vercel** with automatic deployments on every push to `main`.

- **Framework preset:** Vite (auto-detected)
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variable:** `VITE_API_URL` is set in the Vercel dashboard

## Roadmap

### ✅ v1 — Completed

- [x] List tasks with pagination
- [x] Create new tasks
- [x] Edit existing tasks (inline form)
- [x] Delete tasks with confirmation
- [x] Mark tasks as done
- [x] Color-coded status and priority badges
- [x] Filter tasks by status (all, pending, in progress, done)
- [x] Sort tasks by creation date and due date
- [x] Loading skeleton and empty state
- [x] Custom favicon and branding
- [x] Production deployment with CI/CD

### 🔮 v2 — Planned

- [ ] **Full-text search** on task titles (backend-powered)
- [ ] **Priority sorting** (requires backend `@Query` with custom ORDER BY)
- [ ] **Authentication** (user accounts, JWT)
- [ ] **Collaboration** (teams, assignments, comments)
- [ ] **Kanban board view**
- [ ] **Multi-language support** (IT / EN / PT)

## Author

**Amisterdania (Dania) de Oliveira Lima**
AI Developer & Data Analyst student — transitioning into Full-Stack & Backend development.

- GitHub: [@DanniaLima](https://github.com/DanniaLima)
- LinkedIn: [dannialima](https://www.linkedin.com/in/dannialima/)
```

