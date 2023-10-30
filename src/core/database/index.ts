import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

import * as schema from "./schemas";
import { environment } from "../environment";

const options = {
  host: environment.POSTGRES_HOST,
  port: environment.POSTGRES_PORT,
  user: environment.POSTGRES_USERNAME,
  password: environment.POSTGRES_PASSWORD,
  database: environment.POSTGRES_DATABASE,
} satisfies pg.ClientConfig;

const client = new pg.Client(options);
await client.connect();

export const database = drizzle(client, { schema });
await migrate(database, { migrationsFolder: "./drizzle" });
