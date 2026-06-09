import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useTickets, useDebounce } from "../hooks/useTickets";
import { ticketApi } from "../services/api";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const STATUS_OPTIONS = [
  { value: "",            label: "All Status" },
  { value: "Open",        label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Closed",      label: "Closed" },
];

export default function TicketList() {
  const navigate = useNavigate();
  const [search, setSearch]         = useState("");
  const [status, setStatus]         = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const debouncedSearch             = useDebounce(search, 280);

  const { tickets, total, loading, error, refresh } = useTickets({
    status,
    search: debouncedSearch,
  });

  const handleDelete = useCallback(async (e, ticketId) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ticket ${ticketId}? This cannot be undone.`)) return;
    setDeletingId(ticketId);
    try {
      await ticketApi.delete(ticketId);
      toast.success(`Ticket ${ticketId} deleted`);
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  }, [refresh]);

  return (
    <div className="space-y-5 animate-slideUp">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">
            All Tickets
            <span className="ml-2 text-sm bg-[#1e2333] text-[#7a8299] border border-[#2a3045] rounded-full px-2.5 py-0.5 font-normal">
              {total}
            </span>
          </h1>
          <p className="text-sm text-[#7a8299] mt-0.5">Manage and track all support requests</p>
        </div>
        <button onClick={() => navigate("/tickets/new")} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Filters bar */}
      <div className="card p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8299] pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, customers, IDs…"
            className="input pl-9 pr-3"
            aria-label="Search tickets"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7a8299] hover:text-gray-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                status === opt.value
                  ? "bg-[#4f8ef7]/10 border-[#4f8ef7]/30 text-[#4f8ef7]"
                  : "bg-[#1e2333] border-[#2a3045] text-[#7a8299] hover:border-[#4f8ef7]/30 hover:text-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="card p-4 border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
          Failed to load tickets: {error}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Table header — desktop */}
        <div className="hidden md:grid grid-cols-[110px_1fr_180px_130px_105px_90px] gap-4 px-5 py-3 border-b border-[#2a3045] bg-[#1e2333]/50">
          {["Ticket ID","Subject","Customer","Status","Created","Actions"].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-[#4a5268] uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>
        ) : tickets.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No tickets found"
            description={search || status ? "Try adjusting your search or filter." : "Create your first support ticket."}
            action={
              !search && !status ? (
                <button onClick={() => navigate("/tickets/new")} className="btn-primary text-xs">Create Ticket</button>
              ) : (
                <button onClick={() => { setSearch(""); setStatus(""); }} className="btn-secondary text-xs">Clear filters</button>
              )
            }
          />
        ) : (
          <div className="divide-y divide-[#2a3045]">
            {tickets.map((t) => (
              <TicketRow
                key={t.ticket_id}
                ticket={t}
                deleting={deletingId === t.ticket_id}
                onView={() => navigate(`/tickets/${t.ticket_id}`)}
                onDelete={(e) => handleDelete(e, t.ticket_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TicketRow({ ticket: t, onView, onDelete, deleting }) {
  return (
    <div
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onView()}
      className="group cursor-pointer hover:bg-[#1e2333] transition-colors"
    >
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[110px_1fr_180px_130px_105px_90px] gap-4 items-center px-5 py-4">
        <span className="text-xs font-mono text-[#4f8ef7] font-medium">{t.ticket_id}</span>
        <div className="min-w-0">
          <p className="text-sm text-gray-200 truncate group-hover:text-[#4f8ef7] transition-colors">{t.subject}</p>
          <p className="text-xs text-[#7a8299] mt-0.5 truncate">{t.description}</p>
        </div>
        <div className="min-w-0">
          <p className="text-sm truncate">{t.customer_name}</p>
          <p className="text-xs text-[#7a8299] truncate">{t.customer_email}</p>
        </div>
        <div><StatusBadge status={t.status} /></div>
        <span className="text-xs text-[#7a8299]">{format(new Date(t.created_at), "MMM d, yyyy")}</span>
        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onView}
            title="View ticket"
            className="w-7 h-7 rounded-md border border-[#2a3045] bg-[#1e2333] text-[#7a8299] hover:text-[#4f8ef7] hover:border-[#4f8ef7]/30 flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            title="Delete ticket"
            className="w-7 h-7 rounded-md border border-[#2a3045] bg-[#1e2333] text-[#7a8299] hover:text-red-400 hover:border-red-500/30 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            {deleting ? (
              <span className="w-3 h-3 rounded-full border border-red-400 border-t-transparent animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#4f8ef7]">{t.ticket_id}</span>
            <StatusBadge status={t.status} />
          </div>
          <p className="text-sm font-medium text-gray-200 truncate">{t.subject}</p>
          <p className="text-xs text-[#7a8299] mt-0.5">{t.customer_name}</p>
          <p className="text-xs text-[#4a5268] mt-0.5">{format(new Date(t.created_at), "MMM d, yyyy")}</p>
        </div>
        <div className="flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button onClick={onView} className="w-7 h-7 rounded-md border border-[#2a3045] bg-[#1e2333] text-[#7a8299] hover:text-[#4f8ef7] flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={onDelete} disabled={deleting} className="w-7 h-7 rounded-md border border-[#2a3045] bg-[#1e2333] text-[#7a8299] hover:text-red-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
