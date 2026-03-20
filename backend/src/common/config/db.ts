import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../database/schema/index.js";
import dotenv from "dotenv";

import { LoggerInstance } from "../logging/logger.js";
const Logger = new LoggerInstance({ serviceName: "Database", filePath: "backend/src/common/config/db.ts" });

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes("your-password")) {
  Logger.error("DATABASE_URL not set or still contains placeholder! Please check your .env file.");
}

const client = postgres(connectionString || "", { prepare: false });
export const db = drizzle(client, { schema });

Logger.success("Drizzle ORM initialized successfully.");
