import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const CONN_STRING =
  process.env.APP_DATA_CONN_STRING ||
  "postgres://postgres:00000000@localhost:5432/explorer";

const pool = new Pool({
  connectionString: CONN_STRING,
  ssl: { rejectUnauthorized: false },
});

// Debug koneksi
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully!");
    client.release();
  } catch (err: unknown) {
    console.error(
      "❌ Failed to connect to database:",
      err,
      (CONN_STRING || "").replace(/:(.*?)@/, ":****@")
    );
  }
})();

export const db = drizzle(pool, { logger: true });
