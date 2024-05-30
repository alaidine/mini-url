import {
  pgTable,
  serial,
  varchar,
  timestamp,
  uuid,
  pgSchema,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const authSchema = pgSchema("auth");

const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  longUrl: varchar("long_url", { length: 255 }),
  shortUrl: varchar("short_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: uuid("user_id").references(() => users.id),
});

export const insertUrls = createInsertSchema(urls);
export const selectUrls = createSelectSchema(urls);
