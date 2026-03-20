import { pgTable, bigint, text, bigserial, timestamp } from "drizzle-orm/pg-core";
import { athletes } from "./athletes.js";
import { events } from "./events.js";

/**
 * REGISTRATIONS TABLE
 */
export const registrations = pgTable("registrations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  athleteId: bigint("athlete_id", { mode: "number" }).references(() => athletes.id, { onDelete: "cascade" }),
  eventId: bigint("event_id", { mode: "number" }).references(() => events.id, { onDelete: "cascade" }),
  status: text("status").default("confirmed"),
  createdAt: timestamp("created_at").defaultNow(),
});
