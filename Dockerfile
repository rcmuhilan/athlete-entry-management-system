# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend
RUN pnpm run build

# Stage 2: Production
FROM node:20-slim

WORKDIR /app

# Install pnpm for running if needed (or just use node)
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
# Note: tsx is in dependencies now
RUN pnpm install --prod --frozen-lockfile

# Copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy backend source (required for tsx)
COPY backend ./backend
COPY server.ts ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./
# Copy firebase admin sdk if it exists
COPY muhilan-firebase-firebase-adminsdk-fbsvc-e2d541adfa.json ./ 

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["pnpm", "start"]
