/**
 * Central error handler middleware.
 * Must be the last middleware registered in Express.
 */
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}`, err);

  // SQLite constraint violations
  if (err.code === "SQLITE_CONSTRAINT") {
    return res.status(409).json({ error: "Database constraint violation", detail: err.message });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(status).json({ error: message });
}

module.exports = errorHandler;
