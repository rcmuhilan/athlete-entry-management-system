import { pgTable, text, bigserial, integer, date, time, timestamp } from "drizzle-orm/pg-core";

/**
 * EVENTS TABLE
 */
export const events = pgTable("events", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  date: date("date", { mode: "string" }).notNull(),
  maxParticipants: integer("max_participants").default(0),
  time: time("time"),
  location: text("location"),
  rules: text("rules"),
  judges: text("judges"),
  createdAt: timestamp("created_at").defaultNow(),
});
