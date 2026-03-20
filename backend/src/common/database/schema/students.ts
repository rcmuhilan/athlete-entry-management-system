import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { houses } from "./houses.js";

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  registerNumber: text("register_number").unique().notNull(),
  phone: text("phone").notNull(),
  rollNumber: text("roll_number").unique().notNull(),
  className: text("class_name").notNull(),
  degree: text("degree").notNull(),
  department: text("department").notNull(),
  year: text("year").notNull(),
  address: text("address").notNull(),
  houseId: uuid("house_id").references(() => houses.id),
  createdAt: timestamp("created_at").defaultNow(),
});
