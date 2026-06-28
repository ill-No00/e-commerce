export function errorHandler(err, req, res, _next) {
  console.error("[Error]", err.message || err);

  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Validation failed",
      details: err.errors,
    });
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
}
