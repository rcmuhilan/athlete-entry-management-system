import { pgTable, text, bigserial, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";

/**
 * ATHLETES TABLE
 */
export const athletes = pgTable("athletes", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  college: text("college").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow(),
});
