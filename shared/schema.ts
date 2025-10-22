import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const skins = pgTable("skins", {
  id: serial("id").primaryKey(),
  coromonName: text("coromon_name").notNull(),
  skinName: text("skin_name").notNull(),
  potentLevels: text("potent_levels").array().notNull(),
  hasPotentVariant: boolean("has_potent_variant").notNull().default(false),
  pattern: text("pattern").notNull().default('standard'),
});

export const insertSkinSchema = createInsertSchema(skins).omit({
  id: true,
});

export type InsertSkin = z.infer<typeof insertSkinSchema>;
export type Skin = typeof skins.$inferSelect;
