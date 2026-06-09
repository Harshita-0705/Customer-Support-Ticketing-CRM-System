import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

/* Apply saved theme before first paint — no flash */
(function applyTheme() {
  const saved = localStorage.getItem("crm-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("dark");
  }
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <ThemedToaster />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

function ThemedToaster() {
  const isDark = document.documentElement.classList.contains("dark");
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background:  isDark ? "#1e2333" : "#ffffff",
          color:       isDark ? "#e8e9f0" : "#1e293b",
          border:      isDark ? "1px solid #2a3045" : "1px solid #e2e8f0",
          borderRadius: "10px",
          fontSize:    "13px",
          fontFamily:  "DM Sans, sans-serif",
          boxShadow:   isDark ? "0 4px 24px rgba(0,0,0,0.35)" : "0 4px 16px rgba(0,0,0,0.10)",
        },
        success: { iconTheme: { primary: "#22c55e", secondary: isDark ? "#1e2333" : "#fff" } },
        error:   { iconTheme: { primary: "#ef4444", secondary: isDark ? "#1e2333" : "#fff" } },
      }}
    />
  );
}
