const express = require("express");
const cors    = require("cors");

const requestLogger = require("./middleware/requestLogger");
const errorHandler  = require("./middleware/errorHandler");
const ticketsRouter = require("./routes/tickets");

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow localhost dev + any Vercel frontend domain
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
    : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/tickets", ticketsRouter);

// ── 404 for unknown API routes ────────────────────────────────────────────────
app.use("/api/*", (_req, res) =>
  res.status(404).json({ error: "API route not found" })
);

// NOTE: No express.static / no frontend/dist serving.
// Frontend is deployed separately on Vercel.

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
