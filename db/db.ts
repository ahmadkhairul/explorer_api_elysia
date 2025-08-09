import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const CONN_STRING =
  process.env.APP_DATA_CONN_STRING ||
  "postgres://postgres:00000000@localhost:5432/explorer";

const pool = new Pool({
  connectionString: CONN_STRING,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { logger: true });
