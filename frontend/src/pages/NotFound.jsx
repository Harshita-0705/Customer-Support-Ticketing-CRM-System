import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
      <p className="text-6xl font-mono text-brand">404</p>
      <p className="text-lg font-medium text-gray-200">Page not found</p>
      <p className="text-sm text-muted-DEFAULT">
        The page you're looking for doesn't exist.
      </p>
      <button onClick={() => navigate("/")} className="btn-primary">
        Go to Dashboard
      </button>
    </div>
  );
}
