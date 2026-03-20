import admin from "firebase-admin";
import serviceAccount from "../../../../muhilan-firebase-firebase-adminsdk-fbsvc-e2d541adfa.json";

import { LoggerInstance } from "../logging/logger.js";
const Logger = new LoggerInstance({ serviceName: "Firebase", filePath: "backend/src/common/config/firebase.ts" });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

Logger.success("Firebase Admin SDK initialized successfully.");

export const firebaseAdmin = admin;
