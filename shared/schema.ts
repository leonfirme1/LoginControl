import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const consultants = pgTable("consultants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  password: text("password").notNull(),
});

export const insertConsultantSchema = createInsertSchema(consultants).pick({
  name: true,
  password: true,
});

export type InsertConsultant = z.infer<typeof insertConsultantSchema>;
export type Consultant = typeof consultants.$inferSelect;

// Legacy compatibility for auth system
export const users = consultants;
export const insertUserSchema = insertConsultantSchema;
export type InsertUser = InsertConsultant;
export type User = Consultant;
