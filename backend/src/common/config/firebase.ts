import admin from "firebase-admin";
import fs from "fs";
import path from "path";

import { LoggerInstance } from "../logging/logger.js";
const Logger = new LoggerInstance({ serviceName: "Firebase", filePath: "backend/src/common/config/firebase.ts" });

let serviceAccount: any;

const RENDER_SECRET_PATH = "/etc/secrets/muhilan-firebase-credentials";
const LOCAL_SECRET_PATH = path.resolve(process.cwd(), "muhilan-firebase-firebase-adminsdk-fbsvc-e2d541adfa.json");

// 1. Try Render Secrets Path First (Production)
if (fs.existsSync(RENDER_SECRET_PATH)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(RENDER_SECRET_PATH, "utf8"));
    Logger.info("Loading Firebase credentials from Render Secret File.");
  } catch (err: any) {
    Logger.error("Failed to parse Render secret file: " + err.message);
  }
}

// 2. Try Fallback Environment Variable (Alternative Production)
if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    Logger.info("Loading Firebase credentials from environment variable.");
  } catch (err: any) {
    Logger.error("Failed to parse FIREBASE_SERVICE_ACCOUNT variable: " + err.message);
  }
}

// 3. Fallback to Local Storage (Development)
if (!serviceAccount && fs.existsSync(LOCAL_SECRET_PATH)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(LOCAL_SECRET_PATH, "utf8"));
    Logger.info("Loading Firebase credentials from local JSON file.");
  } catch (err: any) {
    Logger.error("Failed to load local Firebase JSON file: " + err.message);
  }
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    Logger.success("Firebase Admin SDK initialized successfully.");
  } catch (err: any) {
    Logger.error("Error initializing Firebase Admin SDK: " + err.message);
  }
} else {
  Logger.error("Firebase Admin SDK NOT initialized: No credentials found. Looked in /etc/secrets/muhilan-firebase-credentials and local root.");
}

export const firebaseAdmin = admin;
