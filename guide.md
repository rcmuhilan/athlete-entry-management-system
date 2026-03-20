# 🏟 Athlete Entry Management System - Developer Guide

Welcome to the **Athlete Entry Management System**. This guide provides everything you need to set up, run, and understand the project architecture.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **Supabase Account**: You'll need a Supabase project to handle data and authentication.

### 2. Environment Setup
Create a `.env` file in the root directory (or use `.env.local`) and add your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT Configuration (Optional for manual signing)
JWT_SECRET="your-super-secret-key"
```

### 3. Installation
```bash
yarn install
```

### 4. Running the App
The project uses a unified dev server that handles both the backend (Express) and frontend (Vite).

```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

The project has been refactored into a modular, scalable architecture.

### **Backend (`/backend/src`)**
Follows a **Controller-Service-Middleware** pattern:
- `modules/`: Feature-based directories containing:
    - `*.controller.ts`: Routing and request handling.
    - `*.service.ts`: Business logic and Supabase interaction.
- `common/`: Shared utilities, including global `auth.middleware.ts` and the Supabase client.

### **Frontend (`/frontend/src`)**
A modular React application:
- `components/`: Organized by feature (Auth, Dashboard, Athletes, etc.).
- `services/`: `api.service.ts` centralizes all backend communication.
- `types/`: Shared TypeScript interfaces.
- `App.tsx`: Clean container managing global state.

---

## 🔐 Authentication & Roles

The system uses Supabase Auth with custom metadata for roles.

| Role | Permissions |
| :--- | :--- |
| **Admin** | Full system access (CRUD on everything). |
| **Coordinator** | Can manage Athletes and Registrations (Create/Update). Read-only for Events. |
| **Viewer** | Read-only access to all dashboards. |

### How to assign roles:
When a user signs up via the UI, they can choose a role (for demo purposes). In a production environment, you would typically manage these roles via the Supabase Dashboard or a dedicated Admin UI.

---

## 🛠 Features

- **Real-time Validations**: Uses Supabase directly for consistent data state.
- **Modern UI**: Built with Tailwind CSS 4 and Motion animations for a premium feel.
- **Search & Filter**: Advanced filtering for events and registrations by category and date.
- **Scalable**: Decoupled service layers allow for easy replacement of the data source if needed.

---

## 🧪 Troubleshooting

- **Supabase Errors**: Ensure your `SERVICE_ROLE_KEY` is correct. The system requires service-level access to manage user metadata during signup.
- **Port Conflicts**: If port 3000 is taken, modify the `PORT` constant in `backend/src/main.ts`.

Enjoy building! 🏃‍♂️💨
