const express = require("express");
const cors = require("cors");
const path = require("path");

const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const ticketsRouter = require("./routes/tickets");

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
  : "*";

app.use(cors({ origin: corsOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/tickets", ticketsRouter);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Serve React frontend (production) ────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "..", "frontend", "dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) =>
    res.sendFile(path.join(distPath, "index.html"))
  );
}

// ── Error handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
