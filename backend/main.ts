import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import app from "./src/app";
import { LoggerInstance } from "./src/common/logging/logger.js";
const Logger = new LoggerInstance({ serviceName: "Server", filePath: "backend/src/main.ts" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    Logger.info("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      root: path.resolve(__dirname, "../frontend"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    Logger.info("Starting server in PRODUCTION mode...");
    const distPath = path.resolve(__dirname, "../frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    Logger.info(`Express Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  Logger.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});
