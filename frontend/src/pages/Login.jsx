import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

/* ── tiny helpers ── */
const EyeIcon = ({ open }) => open ? (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

/* ── Firebase error codes → human messages ── */
function friendlyError(code) {
  const map = {
    "auth/user-not-found":    "No account found with this email.",
    "auth/wrong-password":    "Incorrect password. Please try again.",
    "auth/invalid-credential":"Invalid email or password.",
    "auth/invalid-email":     "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return map[code] || "Login failed. Please try again.";
}

export default function Login() {
  const { login }       = useAuth();
  const navigate        = useNavigate();
  const location        = useLocation();
  const from            = location.state?.from?.pathname || "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  /* ── validation ── */
  function validate() {
    if (!email.trim())    return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email.";
    if (!password)        return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (firebaseErr) {
      setError(friendlyError(firebaseErr.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your SupportCRM account"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Error banner */}
        {error && <ErrorBanner message={error} />}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide"
                 style={{ color: "var(--muted)" }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            placeholder="you@company.com"
            autoComplete="email"
            className="input"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide"
                 style={{ color: "var(--muted)" }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              autoComplete="current-password"
              className="input pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "var(--muted)" }}
              tabIndex={-1}
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary justify-center mt-2"
        >
          {loading ? <Spinner size="sm" /> : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          )}
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm mt-6" style={{ color: "var(--muted)" }}>
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="text-[#4f8ef7] hover:text-[#6fa4ff] font-medium transition-colors">
          Create one
        </Link>
      </p>
    </AuthShell>
  );
}

/* ── shared auth page shell ── */
export function AuthShell({ title, subtitle, children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f8ef7] to-[#7c5cfc]
                          flex items-center justify-center text-white font-bold text-base shadow-lg">
            S
          </div>
          <div>
            <p className="text-base font-semibold leading-none" style={{ color: "var(--text)" }}>
              SupportCRM
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              Ticket Platform
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold" style={{ color: "var(--text)" }}>{title}</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{subtitle}</p>
          </div>
          {children}
        </div>

        {/* Bottom decoration */}
        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-2)" }}>
          &copy; {new Date().getFullYear()} SupportCRM. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/* ── error banner ── */
export function ErrorBanner({ message }) {
  return (
    <div
      className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
      style={{
        background:  "rgba(239,68,68,0.08)",
        border:      "1px solid rgba(239,68,68,0.25)",
        color:       "#ef4444",
      }}
    >
      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
}
