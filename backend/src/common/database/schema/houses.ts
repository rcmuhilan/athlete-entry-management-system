import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const houses = pgTable("houses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  points: integer("points").default(0),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
});
