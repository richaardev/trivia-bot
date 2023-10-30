import "dotenv/config";
import type { Config } from "drizzle-kit";

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USERNAME,
  POSTGRES_PASSSWORD,
  POSTGRES_DATABASE,
} = process.env;

export default {
  schema: "./src/core/database/schemas/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: POSTGRES_HOST!,
    port: Number(POSTGRES_PORT!),
    user: POSTGRES_USERNAME!,
    password: POSTGRES_PASSSWORD!,
    database: POSTGRES_DATABASE!,
  },
} satisfies Config;
