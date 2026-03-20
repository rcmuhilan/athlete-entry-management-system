# 🤖 Claude Assistant Context & Project Guide

Welcome! This document serves as the central context file for AI assistants (like Claude, ChatGPT, etc.) and developers working on the **Athlete Entry Management System**. It outlines the project's purpose, technology stack, architecture, and coding conventions to ensure consistent and high-quality contributions.

---

## 🏟️ Project Overview
The **Athlete Entry Management System** is a modular, high-performance web application designed to manage athletic profiles, sports events, and event registrations. 
Currently, the core functionalities (Authentication, Athlete Management, Event Tracking, and Registrations) are fully operational.

**Roles in the system**:
- **Admin**: Full control over athletes, events, and registrations.
- **Coordinator**: Can manage athletes and registrations, read-only for events.
- **Viewer**: Read-only access to all dashboards.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (framer-motion)
- **Language**: TypeScript
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT, Passport.js, Firebase Admin (for social logins) / Supabase Auth
- **Language**: TypeScript

---

## 📂 Architecture

### Backend (`/backend/src`)
Follows a modular, **Controller-Service-Middleware** architecture focusing on separation of concerns.
- **`api/`**: Contains feature modules (`athletes`, `auth`, `events`, `registrations`).
  - `*.controller.ts`: Handles HTTP requests/responses and input validation.
  - `*.service.ts`: Contains business logic and interacts with the database.
  - `*.routes.ts`: Defines API endpoints.
- **`common/`**: Shared resources across the backend.
  - `config/`: Environment and app configurations.
  - `database/`: Drizzle schemas and DB connection setup.
  - `middleware/`: Custom Express middlewares (e.g., authentication, error handling).
  - `utils/`: Reusable utility functions (e.g., standard API responses, custom loggers).

### Frontend (`/frontend/src`)
A structured React application built for scalability.
- **`components/`**: UI components categorized by feature (Auth, Dashboard, Athletes, Events, Registrations) and generic UI elements.
- **`services/`**: API interaction layer (`api.service.ts`) abstracting complete backend communication.
- **`context/`**: React Context providers for global state (e.g., Auth, Toast notifications).
- **`types/`**: Shared TypeScript interfaces describing API contracts and frontend models.

---

## 📝 Coding Conventions & Best Practices

1. **TypeScript First**: Ensure all new files are written in TypeScript with proper interfaces and types. Avoid `any` where possible.
2. **API Responses**: Always use the standardized `ApiResponse` structure returned from the backend for consistency on the frontend.
3. **Environment Variables**: Never hardcode secrets. Always use `process.env` defined in `.env`.
4. **Modularity**: When adding a new backend feature, create a new folder under `backend/src/api/` with its respective controller, service, and route files.
5. **Styling**: Use tailwind classes. Maintain the premium aesthetics by utilizing consistent color palettes and adding subtle hover/motion effects.
6. **Error Handling**: Use the global error handlers in the backend and show standardized Toast feedback in the frontend.

---

## 🚀 Current Status & Next Steps
**Status**: Core MVP is 100% functional. All CRUD operations for Athletes, Events, Registrations, and Authentication routing are intact.

**Upgrades**: Application is ready to be expanded. When proposing or implementing upgrades, please ensure backward compatibility and follow the existing patterns outlined above.
