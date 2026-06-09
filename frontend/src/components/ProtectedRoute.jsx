import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageSpinner } from "./Spinner";

/**
 * Wraps a route so only authenticated users can see it.
 * Unauthenticated users are redirected to /login with the
 * original URL saved in location state so we can redirect back
 * after a successful login.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location          = useLocation();

  if (loading) return <PageSpinner />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
