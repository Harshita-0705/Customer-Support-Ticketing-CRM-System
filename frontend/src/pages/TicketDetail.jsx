import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useTicket } from "../hooks/useTickets";
import { ticketApi } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import Spinner, { PageSpinner } from "../components/Spinner";

const STATUSES = ["Open", "In Progress", "Closed"];

/* ── Trash icon ── */
const TrashIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function TicketDetail() {
  const { ticketId } = useParams();
  const navigate     = useNavigate();
  const { ticket, loading, error, refresh } = useTicket(ticketId);

  const [pendingStatus, setPendingStatus]   = useState("");
  const [noteText, setNoteText]             = useState("");
  const [savingStatus, setSavingStatus]     = useState(false);
  const [savingNote, setSavingNote]         = useState(false);
  const [deletingTicket, setDeletingTicket] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const currentStatus = pendingStatus || ticket?.status || "Open";

  /* ── handlers ── */
  async function handleStatusUpdate() {
    if (currentStatus === ticket?.status) { toast("Status unchanged", { icon: "ℹ️" }); return; }
    setSavingStatus(true);
    try {
      await ticketApi.update(ticketId, { status: currentStatus });
      toast.success(`Status updated to "${currentStatus}"`);
      setPendingStatus("");
      refresh();
    } catch (err) { toast.error(err.message); }
    finally { setSavingStatus(false); }
  }

  async function handleAddNote() {
    if (!noteText.trim()) { toast.error("Note cannot be empty"); return; }
    setSavingNote(true);
    try {
      await ticketApi.update(ticketId, { note: noteText.trim() });
      toast.success("Note added");
      setNoteText("");
      refresh();
    } catch (err) { toast.error(err.message); }
    finally { setSavingNote(false); }
  }

  async function handleDeleteTicket() {
    if (!window.confirm(`Permanently delete ticket ${ticketId}? This cannot be undone.`)) return;
    setDeletingTicket(true);
    try {
      await ticketApi.delete(ticketId);
      toast.success(`Ticket ${ticketId} deleted`);
      navigate("/tickets");
    } catch (err) {
      toast.error(err.message);
      setDeletingTicket(false);
    }
  }

  async function handleDeleteNote(noteId) {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    setDeletingNoteId(noteId);
    try {
      await ticketApi.deleteNote(ticketId, noteId);
      toast.success("Note deleted");
      refresh();
    } catch (err) { toast.error(err.message); }
    finally { setDeletingNoteId(null); }
  }

  /* ── render guards ── */
  if (loading) return <PageSpinner />;
  if (error)   return <ErrorState message={error}           onBack={() => navigate("/tickets")} />;
  if (!ticket) return <ErrorState message="Ticket not found" onBack={() => navigate("/tickets")} />;

  const notes = ticket.notes || [];

  return (
    <div className="space-y-5 animate-slideUp">

      {/* Top nav row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={() => navigate("/tickets")} className="btn-secondary text-xs">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tickets
        </button>

        {/* ── DELETE TICKET button ── */}
        <button
          onClick={handleDeleteTicket}
          disabled={deletingTicket}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                     border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: "rgba(239,68,68,0.35)",
            background:  "rgba(239,68,68,0.07)",
            color:       "#ef4444",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.14)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; }}
        >
          {deletingTicket
            ? <Spinner size="sm" />
            : <TrashIcon className="w-3.5 h-3.5" />
          }
          {deletingTicket ? "Deleting…" : "Delete Ticket"}
        </button>
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{ticket.subject}</h1>
          <p className="text-xs mt-1 font-mono" style={{ color: "var(--muted)" }}>
            {ticket.ticket_id} · Opened {format(new Date(ticket.created_at), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
        <StatusBadge status={ticket.status} size="md" />
      </div>

      {/* Main 2-col grid */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-4 items-start">

        {/* ── LEFT ── */}
        <div className="space-y-4">

          {/* Description */}
          <Panel title="Description">
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-2)" }}>
              {ticket.description}
            </p>
          </Panel>

          {/* Notes timeline */}
          <Panel title="Notes & Comments" badge={notes.length}>
            {notes.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: "var(--muted)" }}>
                No notes yet.
              </p>
            ) : (
              <div className="space-y-3 mb-4">
                {notes.map((n) => (
                  <NoteItem
                    key={n.id}
                    note={n}
                    deleting={deletingNoteId === n.id}
                    onDelete={() => handleDeleteNote(n.id)}
                  />
                ))}
              </div>
            )}

            {/* Add note form */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2"
                 style={{ color: "var(--muted-2)" }}>
                Add a Note
              </p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note, comment, or update…"
                rows={3}
                className="input resize-none mb-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAddNote();
                }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--muted-2)" }}>
                  Ctrl+Enter to submit
                </span>
                <button
                  onClick={handleAddNote}
                  disabled={savingNote || !noteText.trim()}
                  className="btn-primary text-xs px-3 py-2"
                >
                  {savingNote && <Spinner size="sm" />}
                  {savingNote ? "Saving…" : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                           stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Add Note
                    </>
                  )}
                </button>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── RIGHT ── */}
        <div className="space-y-4">

          {/* Ticket info */}
          <Panel title="Ticket Info">
            <dl className="space-y-0">
              <InfoRow label="Customer" value={ticket.customer_name} />
              <InfoRow
                label="Email"
                value={
                  <a href={`mailto:${ticket.customer_email}`}
                     className="text-[#4f8ef7] hover:underline break-all">
                    {ticket.customer_email}
                  </a>
                }
              />
              <InfoRow label="Priority" value={<PriorityBadge priority={ticket.priority} />} />
              <InfoRow label="Category" value={ticket.category} />
              <InfoRow label="Created"
                value={format(new Date(ticket.created_at), "MMM d, yyyy")} />
              <InfoRow label="Updated"
                value={format(new Date(ticket.updated_at), "MMM d, yyyy")} last />
            </dl>
          </Panel>

          {/* Status update */}
          <Panel title="Update Status">
            <select
              value={currentStatus}
              onChange={(e) => setPendingStatus(e.target.value)}
              className="input mb-3"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={savingStatus}
              className="w-full btn-primary justify-center"
            >
              {savingStatus && <Spinner size="sm" />}
              {savingStatus ? "Updating…" : "Update Status"}
            </button>
          </Panel>

          {/* ── Danger zone ── */}
          <div
            className="rounded-xl p-4"
            style={{
              border: "1px solid rgba(239,68,68,0.25)",
              background: "rgba(239,68,68,0.04)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-red-500">
              Danger Zone
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
              Permanently delete this ticket and all its notes.
            </p>
            <button
              onClick={handleDeleteTicket}
              disabled={deletingTicket}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2
                         rounded-lg text-sm font-medium border transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: "rgba(239,68,68,0.4)",
                background:  "rgba(239,68,68,0.08)",
                color:       "#ef4444",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.16)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            >
              {deletingTicket ? <Spinner size="sm" /> : <TrashIcon />}
              {deletingTicket ? "Deleting…" : "Delete This Ticket"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── sub-components ──────────────────────────────────────────────────────── */

function Panel({ title, badge, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--muted-2)" }}>
          {title}
        </h2>
        {badge !== undefined && (
          <span
            className="text-xs rounded-full px-2 py-0.5"
            style={{
              background: "var(--surface-2)",
              color:      "var(--muted)",
              border:     "1px solid var(--border)",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function NoteItem({ note, onDelete, deleting }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-lg p-3.5 transition-colors"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                        bg-[#4f8ef7]/10 border border-[#4f8ef7]/20">
          <svg className="w-3 h-3 text-[#4f8ef7]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
              clipRule="evenodd" />
          </svg>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            {note.note_text}
          </p>
          <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
            {format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>

        {/* ── DELETE NOTE button — visible on hover ── */}
        <button
          onClick={onDelete}
          disabled={deleting}
          title="Delete note"
          className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center
                      transition-all border
                      disabled:opacity-50 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{
            borderColor: "rgba(239,68,68,0.3)",
            background:  "rgba(239,68,68,0.08)",
            color:       "#ef4444",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
        >
          {deleting
            ? <span className="w-2.5 h-2.5 rounded-full border border-red-400 border-t-transparent animate-spin" />
            : <TrashIcon className="w-3 h-3" />
          }
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, last = false }) {
  return (
    <div
      className="flex items-start justify-between gap-3 py-2.5"
      style={last ? {} : { borderBottom: "1px solid var(--border)" }}
    >
      <dt className="text-xs flex-shrink-0" style={{ color: "var(--muted)", width: "4.5rem" }}>
        {label}
      </dt>
      <dd className="text-xs text-right" style={{ color: "var(--text)" }}>{value}</dd>
    </div>
  );
}

function ErrorState({ message, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
           style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
        ⚠️
      </div>
      <p className="text-sm text-red-500">{message}</p>
      <button onClick={onBack} className="btn-secondary text-xs">← Back to Tickets</button>
    </div>
  );
}
