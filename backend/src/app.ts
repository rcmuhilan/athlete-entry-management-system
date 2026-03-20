import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { LoggerInstance, COLORS } from "./common/logging/logger.js";
const Logger = new LoggerInstance({ serviceName: "App", filePath: "backend/src/app.ts" });

const app = express();

app.use((req, res, next) => {
  Logger.debug(`Request Method: ${req.method}, URL: ${req.url}`);
  next();
});

app.use(morgan("dev", {
  stream: {
    write: (message) => {
      process.stdout.write(`${COLORS.info}[BACKEND]${COLORS.reset} ${message}`);
    }
  }
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize() as any);

const endpoints = [
  "/api/auth",
  "/api/athletes",
  "/api/events",
  "/api/registrations",
  "/api/houses",
  "/api/students"
]


// Healthcheck
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
for (const endpoint of endpoints) {
  const { default: endpointRouter } = await import(`.${endpoint}/routes`);
  app.use(endpoint, endpointRouter);
  Logger.info(`"Endpoint started successfully: ${endpoint}"`);
}

export default app;
