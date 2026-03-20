import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "..", "db", "master.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath, { readonly: false });
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}
