import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useStats } from "../hooks/useTickets";
import { useAuth } from "../context/AuthContext";

/* ── icons ── */
const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);
const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const navItems = [
  {
    to: "/", label: "Dashboard",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" /></svg>,
  },
  {
    to: "/tickets", label: "All Tickets",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  },
  {
    to: "/tickets/new", label: "New Ticket",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  },
];

/* ── get initials from email ── */
function initials(email) {
  if (!email) return "U";
  return email[0].toUpperCase();
}

/* ── theme toggle reads/writes the <html> class ── */
function useThemeToggle() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("crm-theme", next ? "dark" : "light");
  }
  return { dark, toggle };
}

export default function AppLayout({ children }) {
  const { stats }             = useStats();
  const { user, logout }      = useAuth();
  const { dark, toggle }      = useThemeToggle();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate              = useNavigate();

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to sign out");
    } finally {
      setLoggingOut(false);
    }
  }

  /* ── sidebar inner content ── */
  const sidebarContent = (
    <div className="flex flex-col h-full"
         style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5"
           style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f8ef7] to-[#7c5cfc]
                        flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          S
        </div>
        <div>
          <p className="text-sm font-semibold leading-none" style={{ color: "var(--text)" }}>SupportCRM</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Ticket Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest px-3 py-3"
           style={{ color: "var(--muted-2)" }}>
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-all border ${
                isActive
                  ? "bg-[#4f8ef7]/10 text-[#4f8ef7] border-[#4f8ef7]/25 font-medium"
                  : "border-transparent"
              }`
            }
            style={({ isActive }) => isActive ? {} : { color: "var(--muted)" }}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Status pills */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <StatPill label="Open"        count={stats.open}        dotColor="#4ade80" bg="rgba(74,222,128,0.08)" />
        <StatPill label="In Progress" count={stats.in_progress} dotColor="#fbbf24" bg="rgba(251,191,36,0.08)" />
        <StatPill label="Closed"      count={stats.closed}      dotColor="#94a3b8" bg="rgba(148,163,184,0.08)" />
      </div>

      {/* ── User info + logout (sidebar bottom) ── */}
      <div className="p-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg"
             style={{ background: "var(--surface-2)" }}>
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#7c5cfc]
                          flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials(user?.email)}
          </div>
          {/* Email */}
          <p className="text-xs truncate flex-1" style={{ color: "var(--muted)" }}>
            {user?.email}
          </p>
          {/* Logout icon btn */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign out"
            className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ color: "var(--muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            {loggingOut
              ? <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
              : <LogoutIcon />
            }
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden transition-colors"
         style={{ background: "var(--bg)" }}>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
             onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden
                    transform transition-transform duration-200
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-4 lg:px-6 py-3 flex-shrink-0"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: "var(--muted)" }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="theme-toggle"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* User email pill (desktop) */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                 style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#4f8ef7] to-[#7c5cfc]
                              flex items-center justify-center text-white text-[10px] font-bold">
                {initials(user.email)}
              </div>
              <span className="text-xs max-w-[140px] truncate" style={{ color: "var(--muted)" }}>
                {user.email}
              </span>
            </div>
          )}

          {/* Logout button (topbar) */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="btn-secondary text-xs px-3 py-2 gap-1.5"
            title="Sign out"
          >
            {loggingOut
              ? <span className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
              : <LogoutIcon />
            }
            <span className="hidden sm:inline">
              {loggingOut ? "Signing out…" : "Sign Out"}
            </span>
          </button>

          {/* New ticket */}
          <button onClick={() => navigate("/tickets/new")}
                  className="btn-primary text-xs px-3 py-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Ticket</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}

function StatPill({ label, count, dotColor, bg }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg mb-1"
         style={{ background: bg }}>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: dotColor }} />
        <span className="text-xs" style={{ color: "var(--muted)" }}>{label}</span>
      </div>
      <span className="text-xs font-semibold font-mono"
            style={{ color: dotColor }}>{count ?? 0}</span>
    </div>
  );
}
