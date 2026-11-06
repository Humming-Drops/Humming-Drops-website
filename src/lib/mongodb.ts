import { MongoClient, type Db } from "mongodb";

/**
 * MongoDB Atlas client for document-shaped data only. Postgres/Drizzle
 * remains authoritative for RBAC, payments, subscriptions, and audit
 * logs -- anything relying on foreign keys, transactions, or the
 * zero-row-update ownership checks used throughout those modules.
 * This client is additive scaffolding; no existing feature reads from
 * or writes to it yet.
 */

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }
  const client = new MongoClient(uri);
  return client.connect();
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "production") {
    return createClientPromise();
  }

  // Reuse the client across Next.js dev-server hot reloads instead of
  // opening a new connection pool on every module reload.
  if (!global.__mongoClientPromise) {
    global.__mongoClientPromise = createClientPromise();
  }
  return global.__mongoClientPromise;
}

export async function getMongoDb(dbName?: string): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(dbName);
}
