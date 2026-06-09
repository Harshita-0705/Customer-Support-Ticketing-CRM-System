import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { AuthShell, ErrorBanner } from "./Login";

/* ── Firebase error → human message ── */
function friendlyError(code) {
  const map = {
    "auth/email-already-in-use":  "An account with this email already exists.",
    "auth/invalid-email":         "Please enter a valid email address.",
    "auth/weak-password":         "Password must be at least 6 characters.",
    "auth/network-request-failed":"Network error. Check your connection.",
    "auth/operation-not-allowed": "Email/password sign-up is not enabled.",
  };
  return map[code] || "Sign-up failed. Please try again.";
}

/* ── password strength ── */
function strengthLabel(pw) {
  if (!pw) return null;
  if (pw.length < 6)  return { label: "Too short",  color: "#ef4444", width: "20%" };
  if (pw.length < 8)  return { label: "Weak",        color: "#f97316", width: "40%" };
  if (pw.length < 12 && /[^a-zA-Z0-9]/.test(pw))
                      return { label: "Good",        color: "#eab308", width: "65%" };
  if (pw.length >= 12 && /[^a-zA-Z0-9]/.test(pw))
                      return { label: "Strong",      color: "#22c55e", width: "100%" };
  return              { label: "Fair",               color: "#4f8ef7", width: "55%" };
}

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

export default function Signup() {
  const { signup }     = useAuth();
  const navigate       = useNavigate();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const strength = strengthLabel(password);

  /* ── validation ── */
  function validate() {
    if (!email.trim())    return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email.";
    if (!password)        return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setError("");
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/", { replace: true });
    } catch (firebaseErr) {
      setError(friendlyError(firebaseErr.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start managing support tickets today"
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
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              className="input pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted)" }}
              tabIndex={-1}
            >
              <EyeIcon open={showPw} />
            </button>
          </div>

          {/* Strength bar */}
          {strength && (
            <div className="space-y-1 pt-1">
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: strength.width, background: strength.color }}
                />
              </div>
              <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide"
                 style={{ color: "var(--muted)" }}>
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(""); }}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={`input pr-10 ${
                confirm && confirm !== password
                  ? "!border-red-400"
                  : confirm && confirm === password
                  ? "!border-green-500"
                  : ""
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted)" }}
              tabIndex={-1}
            >
              <EyeIcon open={showConfirm} />
            </button>
            {/* match indicator */}
            {confirm && (
              <span className={`absolute right-9 top-1/2 -translate-y-1/2 text-xs ${
                confirm === password ? "text-green-500" : "text-red-400"
              }`}>
                {confirm === password ? "✓" : "✗"}
              </span>
            )}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm mt-6" style={{ color: "var(--muted)" }}>
        Already have an account?{" "}
        <Link to="/login" className="text-[#4f8ef7] hover:text-[#6fa4ff] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
