const express = require("express");
const cors    = require("cors");

const requestLogger = require("./middleware/requestLogger");
const errorHandler  = require("./middleware/errorHandler");
const ticketsRouter = require("./routes/tickets");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      const allowed = [
        // Local dev
        "http://localhost:5173",
        "http://localhost:3000",
        // All Vercel deployments for this project (main + preview branches)
        /https:\/\/customer-support-ticketi.*\.vercel\.app$/,
        /https:\/\/.*harshitas-projects.*\.vercel\.app$/,
      ];

      // Also allow any origins from CORS_ORIGINS env var (comma separated)
      const extra = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(",").map((s) => s.trim())
        : [];

      const isAllowed =
        allowed.some((rule) =>
          rule instanceof RegExp ? rule.test(origin) : rule === origin
        ) || extra.includes(origin);

      if (isAllowed) return callback(null, true);

      console.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false); // silently block, don't throw
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

// NOTE: No express.static / no frontend serving.
// Frontend is deployed separately on Vercel.

// ── Error handler (must be last) ──────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
