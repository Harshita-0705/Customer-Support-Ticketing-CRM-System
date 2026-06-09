const { getDb } = require("../database/db");

// ── helpers ────────────────────────────────────────────────────────────────

function nextTicketId(db) {
  const row = db
    .prepare("SELECT ticket_id FROM tickets ORDER BY id DESC LIMIT 1")
    .get();
  if (!row) return "TKT-001";
  const last = parseInt(row.ticket_id.split("-")[1], 10);
  return `TKT-${String(last + 1).padStart(3, "0")}`;
}

const VALID_STATUSES = ["Open", "In Progress", "Closed"];

// ── service methods ────────────────────────────────────────────────────────

function createTicket({ customer_name, customer_email, subject, description, priority = "Normal", category = "General" }) {
  const db = getDb();
  const ticket_id = nextTicketId(db);
  const now = Date.now();

  db.prepare(`
    INSERT INTO tickets
      (ticket_id, customer_name, customer_email, subject, description,
       status, priority, category, created_at, updated_at)
    VALUES (?,?,?,?,?,'Open',?,?,?,?)
  `).run(
    ticket_id,
    customer_name.trim(),
    customer_email.trim().toLowerCase(),
    subject.trim(),
    description.trim(),
    priority,
    category,
    now,
    now
  );

  return db.prepare("SELECT * FROM tickets WHERE ticket_id = ?").get(ticket_id);
}

function listTickets({ status, search, page = 1, limit = 50 } = {}) {
  const db = getDb();

  let sql = "SELECT * FROM tickets WHERE 1=1";
  const params = [];

  if (status && VALID_STATUSES.includes(status)) {
    sql += " AND status = ?";
    params.push(status);
  }

  if (search && search.trim()) {
    const q = `%${search.trim().toLowerCase()}%`;
    sql += ` AND (
      LOWER(ticket_id)      LIKE ? OR
      LOWER(customer_name)  LIKE ? OR
      LOWER(customer_email) LIKE ? OR
      LOWER(subject)        LIKE ? OR
      LOWER(description)    LIKE ?
    )`;
    params.push(q, q, q, q, q);
  }

  // count before pagination
  const countRow = db
    .prepare(sql.replace("SELECT *", "SELECT COUNT(*) as total"))
    .get(...params);
  const total = countRow ? countRow.total : 0;

  sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), (Number(page) - 1) * Number(limit));

  const tickets = db.prepare(sql).all(...params);

  return { tickets, total, page: Number(page), limit: Number(limit) };
}

function getTicketById(ticketId) {
  const db = getDb();
  const ticket = db
    .prepare("SELECT * FROM tickets WHERE ticket_id = ?")
    .get(ticketId);
  if (!ticket) return null;

  const notes = db
    .prepare("SELECT * FROM notes WHERE ticket_id = ? ORDER BY created_at ASC")
    .all(ticketId);

  return { ...ticket, notes };
}

function updateTicket(ticketId, { status, note, priority, category }) {
  const db = getDb();
  const ticket = db
    .prepare("SELECT * FROM tickets WHERE ticket_id = ?")
    .get(ticketId);
  if (!ticket) return null;

  const now = Date.now();
  const updates = [];
  const vals = [];

  if (status) {
    if (!VALID_STATUSES.includes(status))
      throw new Error(`Invalid status: ${status}`);
    updates.push("status = ?");
    vals.push(status);
  }
  if (priority) { updates.push("priority = ?"); vals.push(priority); }
  if (category) { updates.push("category = ?"); vals.push(category); }

  if (updates.length) {
    updates.push("updated_at = ?");
    vals.push(now, ticketId);
    db.prepare(`UPDATE tickets SET ${updates.join(", ")} WHERE ticket_id = ?`).run(...vals);
  }

  if (note && String(note).trim()) {
    db.prepare(
      "INSERT INTO notes (ticket_id, note_text, created_at) VALUES (?,?,?)"
    ).run(ticketId, String(note).trim(), now);
  }

  return getTicketById(ticketId);
}

function deleteTicket(ticketId) {
  const db = getDb();
  // cascade deletes notes too
  const info = db.prepare("DELETE FROM tickets WHERE ticket_id = ?").run(ticketId);
  return info.changes > 0;
}

function deleteNote(noteId) {
  const db = getDb();
  const info = db.prepare("DELETE FROM notes WHERE id = ?").run(Number(noteId));
  return info.changes > 0;
}

function getStats() {
  const db = getDb();
  const rows = db
    .prepare(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status='Open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status='In Progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status='Closed' THEN 1 ELSE 0 END) as closed
      FROM tickets
    `)
    .get();
  return rows;
}

module.exports = {
  createTicket,
  listTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  deleteNote,
  getStats,
};
