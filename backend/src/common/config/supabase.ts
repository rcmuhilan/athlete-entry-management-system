import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { LoggerInstance } from "../logging/logger.js";

const Logger = new LoggerInstance({ serviceName: "Supabase", filePath: "backend/src/common/config/supabase.ts" });

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export let supabase: any = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== "https://your-project.supabase.co") {
  supabase = createClient(supabaseUrl, supabaseKey);
  Logger.success("Supabase initialized successfully.");
} else {
  Logger.error("ERROR: Supabase configuration missing! Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.");
  process.exit(1);
}
