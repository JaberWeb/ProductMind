import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/myapp";
const dbName = process.env.DATABASE_NAME || "myapp";

let client: MongoClient;
let db: Db;

export async function connectDB(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export function getDB(): Db {
  if (!db) throw new Error("Database not initialized");
  return db;
}

export function getClient(): MongoClient {
  if (!client) throw new Error("Client not initialized");
  return client;
}
