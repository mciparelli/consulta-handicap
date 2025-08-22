import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "./schema";

// Function to create a new Kysely instance connected to Hyperdrive
export function createKyselyClient(env: Env): Kysely<DB> {
  // Use the Hyperdrive connection string provided by Cloudflare
  const connectionString = env.HYPERDRIVE.connectionString;

  // Create a PostgreSQL connection pool
  const pool = new Pool({ connectionString });

  // Create and return the Kysely instance
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool,
    }),
  });
}

// Create a singleton instance for use throughout the app
let db: Kysely<DB> | null = null;

// Get or create the DB client
export function getKyselyClient(env: Env): Kysely<DB> {
  if (!db) {
    db = createKyselyClient(env);
  }
  return db;
}
