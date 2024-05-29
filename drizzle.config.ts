import { defineConfig } from "drizzle-kit";

const connectionString = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: connectionString as string,
  },
});
