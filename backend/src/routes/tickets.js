const { Router } = require("express");
const ctrl = require("../controllers/ticketController");

const router = Router();

router.get("/stats", ctrl.getStats);
router.post("/", ctrl.createTicket);
router.get("/", ctrl.listTickets);
router.get("/:ticketId", ctrl.getTicket);
router.put("/:ticketId", ctrl.updateTicket);
router.delete("/:ticketId/notes/:noteId", ctrl.deleteNote);  // DELETE note
router.delete("/:ticketId", ctrl.deleteTicket);

module.exports = router;
