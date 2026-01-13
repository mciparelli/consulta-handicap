import { createClient, type Client } from "@libsql/client";
import type { Env } from "~/types";

export interface DbContext {
  env: Env;
  db?: Client;
}

/**
 * Create a libSQL client configured for Turso
 */
export function getClient(context: DbContext): Client {
  // If a client is already provided, use it
  if (context.db) {
    return context.db;
  }

  const url = context.env.LIBSQL_URL;
  const authToken = context.env.LIBSQL_AUTH_TOKEN;

  if (!url) {
    throw new Error("LIBSQL_URL environment variable is not defined");
  }

  return createClient({
    url,
    authToken,
  });
}

/**
 * Execute a SQL query with optional parameters
 */
export async function query(
  context: DbContext,
  sql: string,
  params: unknown[] = []
): Promise<{ rows: Record<string, unknown>[] }> {
  const client = getClient(context);
  try {
    const result = await client.execute({ sql, args: params as any[] });
    return { rows: result.rows as unknown as Record<string, unknown>[] };
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

/**
 * Execute multiple operations within a transaction
 */
export async function withTransaction<T>(
  context: DbContext,
  callback: (client: Client) => Promise<T>
): Promise<T> {
  const client = getClient(context);

  const tx = await client.transaction("write");
  try {
    // Create a wrapper that uses the transaction
    const txClient = {
      execute: tx.execute.bind(tx),
      batch: tx.batch.bind(tx),
    } as unknown as Client;

    const result = await callback(txClient);
    await tx.commit();
    return result;
  } catch (error) {
    await tx.rollback();
    console.error("Transaction error:", error);
    throw error;
  }
}
