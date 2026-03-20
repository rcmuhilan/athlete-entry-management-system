import { db } from "../../common/config/db.js";
import { users } from "../../common/database/schema/index.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { firebaseAdmin } from "../../common/config/firebase.js";
import { LoggerInstance } from "../../common/logging/logger.js";

const Logger = new LoggerInstance({ serviceName: "AuthService", filePath: "backend/src/modules/auth/auth.service.ts" });

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Service to handle authentication logic using Passport, JWT, & Firebase.
 */
export class AuthService {
  /**
   * Registers a new user with metadata (full_name, role).
   */
  async signup(email: string, password: string, full_name: string, role: string = "viewer") {
    // Check if user already exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      throw new Error("User already exists.");
    }

    // Hash user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user record to local DB
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        fullName: full_name,
        role: role as "admin" | "coordinator" | "viewer"
      })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role
      });

    Logger.success(`New user registered: ${email}`);
    return newUser;
  }

  /**
   * Generates a sign-in token from social login (Google/Facebook via Firebase).
   */
  async firebaseSocialLogin(idToken: string) {
    try {
      // 1. Verify Firebase token
      const decodedUser = await firebaseAdmin.auth().verifyIdToken(idToken);
      const { email, name } = decodedUser;

      if (!email) throw new Error("Firebase token missing email.");

      // 2. Check if user exists in the local DB
      let [user] = await db
        .select({ id: users.id, email: users.email, fullName: users.fullName, role: users.role })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      // If user doesn't exist, create it (auto-register)
      if (!user) {
        const [newUser] = await db
          .insert(users)
          .values({
            email,
            fullName: name || "User",
            role: "viewer",
          })
          .returning({ id: users.id, email: users.email, fullName: users.fullName, role: users.role });

        user = newUser;
      }

      // 3. Issue our own JWT
      Logger.success(`Social login successful for user: ${email}`);
      const token = this.generateToken(user);
      return { user, token };

    } catch (err: any) {
      throw new Error("Social authentication failed: " + err.message);
    }
  }

  /**
   * Helper to generate local JWT.
   */
  generateToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
  }
}

export const authService = new AuthService();
