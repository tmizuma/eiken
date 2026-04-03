import Database from "better-sqlite3";
import path from "path";

const dbPath = process.env.DB_PATH || path.join(process.cwd(), "..", "db", "master.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const isReadonly = process.env.DB_READONLY === "true";
    db = new Database(dbPath, { readonly: isReadonly });
    if (!isReadonly) {
      db.pragma("journal_mode = WAL");
    }
    db.pragma("foreign_keys = ON");
  }
  return db;
}
