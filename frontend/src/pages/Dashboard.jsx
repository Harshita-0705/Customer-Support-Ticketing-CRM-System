import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useStats, useTickets } from "../hooks/useTickets";
import { ticketApi } from "../services/api";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import { PageSpinner } from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const TrashIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, refresh: refreshStats } = useStats();
  const { tickets, loading, refresh }    = useTickets({ limit: 8 });
  const [deletingId, setDeletingId]      = useState(null);

  const recentOpen = tickets.filter((t) => t.status === "Open").slice(0, 5);

  const handleDelete = useCallback(async (e, ticketId) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ticket ${ticketId}? This cannot be undone.`)) return;
    setDeletingId(ticketId);
    try {
      await ticketApi.delete(ticketId);
      toast.success(`Ticket ${ticketId} deleted`);
      refresh();
      refreshStats();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  }, [refresh, refreshStats]);

  return (
    <div className="space-y-6 animate-slideUp">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
          Overview of your support queue
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets"  value={stats.total ?? 0}       sub="All time"        color="text-[#4f8ef7]" icon="🎫" />
        <StatCard label="Open"           value={stats.open ?? 0}        sub="Needs attention" color="text-green-500"  icon="🟢" />
        <StatCard label="In Progress"    value={stats.in_progress ?? 0} sub="Being handled"   color="text-amber-500"  icon="🔄" />
        <StatCard label="Closed"         value={stats.closed ?? 0}      sub="Resolved"        color="text-slate-400"  icon="✅" />
      </div>

      {/* Two-column */}
      <div className="grid lg:grid-cols-5 gap-4">

        {/* Recent tickets */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h2 className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Recent Tickets
            </h2>
            <button
              onClick={() => navigate("/tickets")}
              className="text-xs text-[#4f8ef7] hover:text-[#6fa4ff] transition-colors"
            >
              View all →
            </button>
          </div>

          {loading ? (
            <PageSpinner />
          ) : tickets.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No tickets yet"
              description="Create your first support ticket to get started."
              action={
                <button onClick={() => navigate("/tickets/new")} className="btn-primary text-xs">
                  Create Ticket
                </button>
              }
            />
          ) : (
            tickets.map((t) => (
              <RecentRow
                key={t.ticket_id}
                ticket={t}
                deleting={deletingId === t.ticket_id}
                onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                onDelete={(e) => handleDelete(e, t.ticket_id)}
              />
            ))
          )}
        </div>

        {/* Open tickets */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div
            className="px-5 py-4"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h2 className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Open Tickets
              <span
                className="ml-2 text-xs rounded-full px-2 py-0.5"
                style={{
                  background: "var(--surface-2)",
                  color:      "var(--muted)",
                  border:     "1px solid var(--border)",
                }}
              >
                {stats.open ?? 0}
              </span>
            </h2>
          </div>

          {loading ? (
            <PageSpinner />
          ) : recentOpen.length === 0 ? (
            <EmptyState icon="🎉" title="All clear!" description="No open tickets right now." />
          ) : (
            recentOpen.map((t) => (
              <OpenRow
                key={t.ticket_id}
                ticket={t}
                deleting={deletingId === t.ticket_id}
                onClick={() => navigate(`/tickets/${t.ticket_id}`)}
                onDelete={(e) => handleDelete(e, t.ticket_id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── row components ── */

function RecentRow({ ticket: t, onClick, onDelete, deleting }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 cursor-pointer group transition-colors relative"
      style={{ borderBottom: "1px solid var(--border)" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      bg-[#4f8ef7]/10 border border-[#4f8ef7]/20">
        <svg className="w-3.5 h-3.5 text-[#4f8ef7]" fill="none" viewBox="0 0 24 24"
             stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate group-hover:text-[#4f8ef7] transition-colors"
           style={{ color: "var(--text)" }}>
          {t.subject}
        </p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted)" }}>
          {t.customer_name} · {t.ticket_id}
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <StatusBadge status={t.status} />
        <span className="text-xs hidden sm:block" style={{ color: "var(--muted)" }}>
          {format(new Date(t.created_at), "MMM d")}
        </span>

        {/* ── DELETE button ── */}
        <button
          onClick={onDelete}
          disabled={deleting}
          title="Delete ticket"
          className={`w-6 h-6 rounded flex items-center justify-center border transition-all
                      disabled:opacity-50 ${hovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{
            borderColor: "rgba(239,68,68,0.3)",
            background:  "rgba(239,68,68,0.08)",
            color:       "#ef4444",
          }}
          onMouseEnter={(e) => { e.stopPropagation(); e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
        >
          {deleting
            ? <span className="w-2.5 h-2.5 rounded-full border border-red-400 border-t-transparent animate-spin" />
            : <TrashIcon />
          }
        </button>
      </div>
    </div>
  );
}

function OpenRow({ ticket: t, onClick, onDelete, deleting }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="px-5 py-3.5 cursor-pointer group transition-colors"
      style={{ borderBottom: "1px solid var(--border)" }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm truncate group-hover:text-[#4f8ef7] transition-colors"
             style={{ color: "var(--text)" }}>
            {t.subject}
          </p>
          <p className="text-xs mt-1 font-mono" style={{ color: "var(--muted)" }}>
            {t.ticket_id}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <PriorityBadge priority={t.priority} />

          {/* ── DELETE button ── */}
          <button
            onClick={onDelete}
            disabled={deleting}
            title="Delete ticket"
            className={`w-6 h-6 rounded flex items-center justify-center border transition-all
                        disabled:opacity-50 ${hovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={{
              borderColor: "rgba(239,68,68,0.3)",
              background:  "rgba(239,68,68,0.08)",
              color:       "#ef4444",
            }}
            onMouseEnter={(e) => { e.stopPropagation(); e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          >
            {deleting
              ? <span className="w-2.5 h-2.5 rounded-full border border-red-400 border-t-transparent animate-spin" />
              : <TrashIcon />
            }
          </button>
        </div>
      </div>

      <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>{t.customer_name}</p>
    </div>
  );
}
