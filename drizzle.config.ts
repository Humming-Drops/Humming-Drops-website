import fs from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read Next.js env files. Load .env.local for local
// runs (npm run db:migrate / db:generate); in CI and production DATABASE_URL
// comes from the real environment and this is skipped.
if (!process.env.DATABASE_URL && fs.existsSync(".env.local")) {
  (process as unknown as { loadEnvFile: (path: string) => void }).loadEnvFile(".env.local");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  strict: true,
  verbose: true,
});
