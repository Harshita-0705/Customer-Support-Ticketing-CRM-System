import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AppLayout      from "../layouts/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import Dashboard    from "../pages/Dashboard";
import TicketList   from "../pages/TicketList";
import CreateTicket from "../pages/CreateTicket";
import TicketDetail from "../pages/TicketDetail";
import NotFound     from "../pages/NotFound";
import Login        from "../pages/Login";
import Signup       from "../pages/Signup";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* ── Protected routes (wrapped in AppLayout) ── */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TicketList />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/new"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateTicket />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TicketDetail />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
