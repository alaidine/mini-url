import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("urls", {
    longUrl: varchar("long_url", { length: 255 }),
    shortUrl: varchar("short_url", { length: 255 }),
    createdAt: serial("created_at"),
    userId: serial("user_id"),
});
