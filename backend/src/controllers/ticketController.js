const ticketService = require("../services/ticketService");

// POST /api/tickets
async function createTicket(req, res, next) {
  try {
    const { customer_name, customer_email, subject, description, priority, category } = req.body;

    const missing = ["customer_name", "customer_email", "subject", "description"]
      .filter((f) => !req.body[f] || !String(req.body[f]).trim());

    if (missing.length) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
    }

    // Basic email format check
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(customer_email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const ticket = ticketService.createTicket({
      customer_name,
      customer_email,
      subject,
      description,
      priority,
      category,
    });

    return res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
}

// GET /api/tickets
async function listTickets(req, res, next) {
  try {
    const { status, search, page, limit } = req.query;
    const result = ticketService.listTickets({ status, search, page, limit });
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/tickets/:ticketId
async function getTicket(req, res, next) {
  try {
    const ticket = ticketService.getTicketById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    return res.json(ticket);
  } catch (err) {
    next(err);
  }
}

// PUT /api/tickets/:ticketId
async function updateTicket(req, res, next) {
  try {
    const { status, note, priority, category } = req.body;
    const ticket = ticketService.updateTicket(req.params.ticketId, {
      status,
      note,
      priority,
      category,
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    return res.json(ticket);
  } catch (err) {
    if (err.message && err.message.startsWith("Invalid status")) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

// DELETE /api/tickets/:ticketId
async function deleteTicket(req, res, next) {
  try {
    const deleted = ticketService.deleteTicket(req.params.ticketId);
    if (!deleted) return res.status(404).json({ error: "Ticket not found" });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/stats
async function getStats(req, res, next) {
  try {
    const stats = ticketService.getStats();
    return res.json(stats);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tickets/:ticketId/notes/:noteId
async function deleteNote(req, res, next) {
  try {
    const deleted = ticketService.deleteNote(req.params.noteId);
    if (!deleted) return res.status(404).json({ error: "Note not found" });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTicket, listTickets, getTicket, updateTicket, deleteTicket, getStats, deleteNote };
