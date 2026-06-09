const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "..", "..", "data", "crm.db");

// Ensure data directory exists
const fs = require("fs");
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id      TEXT    NOT NULL UNIQUE,
      customer_name  TEXT    NOT NULL,
      customer_email TEXT    NOT NULL,
      subject        TEXT    NOT NULL,
      description    TEXT    NOT NULL,
      status         TEXT    NOT NULL DEFAULT 'Open'
                     CHECK(status IN ('Open','In Progress','Closed')),
      priority       TEXT    NOT NULL DEFAULT 'Normal'
                     CHECK(priority IN ('Normal','High','Urgent')),
      category       TEXT    NOT NULL DEFAULT 'General',
      created_at     INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
      updated_at     INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
    );

    CREATE TABLE IF NOT EXISTS notes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id  TEXT    NOT NULL REFERENCES tickets(ticket_id) ON DELETE CASCADE,
      note_text  TEXT    NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
    );

    CREATE INDEX IF NOT EXISTS idx_tickets_status  ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_notes_ticket    ON notes(ticket_id);
  `);
}

module.exports = { getDb };
