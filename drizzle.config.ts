import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl === "YOUR_ACTUAL_DATABASE_URL") {
  throw new Error(
    "DATABASE_URL must be the real PostgreSQL connection string. Do not use the placeholder value."
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: databaseUrl,
  },
});