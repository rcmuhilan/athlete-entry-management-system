# 🏟 Athlete Entry Management System

The **Athlete Entry Management System** is a modular, high-performance application for managing athletic profiles, event registrations, and scheduling. It uses a modern stack with **React 19**, **Vite 6**, **Express**, and **Supabase**.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Supabase Account**: Required for database and authentication.

### 2. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT Configuration
JWT_SECRET="your-secret-key"
```

### 3. Installation & Run
```bash
pnpm install
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🚀 Deployment (Render)

This project is optimized for deployment on **Render** using GitHub integration.

### Settings:
- **Build Command**: `pnpm install && pnpm run build`
- **Start Command**: `pnpm run db:migrate && pnpm start` (Runs migrations before starting).
- **Environment Variables**: See [`.env.example`](./.env.example).
- **Secret Files**: Add your Firebase Admin SDK JSON via Render's "Secret Files" as `/etc/secrets/muhilan-firebase-credentials`.

---

## 📂 Architecture

This project follows a modular, scalable structure:

- **Backend (`/backend/src`)**: Controller-Service architecture.
- **Frontend (`/frontend/src`)**: Component-based UI with a centralized API service.
- **Unified Entry**: `server.ts` in the root serves both the Express API and the Vite frontend.

For a deep dive into the architecture and roles, see the [guide.md](./guide.md).

---

## 🔐 Roles & Permissions

- **Admin**: Full control over athletes, events, and registrations.
- **Coordinator**: Can manage athletes and sign-ups.
- **Viewer**: Read-only access to all data.

---

## 🛠 Features

- **Real-time Data**: Directly integrated with Supabase.
- **Premium Aesthetics**: Tailwind CSS 4 & Motion animations.
- **Advanced Filtering**: Categorized event search and date-range registration tracking.
