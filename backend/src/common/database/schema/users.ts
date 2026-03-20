import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * USERS TABLE
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique(),
  phone: text("phone").unique(),
  password: text("password"),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["admin", "teacher", "student", "viewer"] }).default("viewer"),
  createdAt: timestamp("created_at").defaultNow(),
});
