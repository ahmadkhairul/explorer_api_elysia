import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.APP_DATA_CONN_STRING ||
    "postgres://postgres:00000000@localhost:5432/explorer",
});

export const db = drizzle(pool, { logger: true });
