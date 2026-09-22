/**
 * middleware/errorHandler.js
 *
 * Centralized Express error-handling middleware.
 * Catches any error passed via next(err) and returns a
 * consistent JSON error response.
 */

export default function errorHandler(err, _req, res, _next) {
  const status  = err.status  || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Don't expose internal stack traces in production
  const stack = process.env.NODE_ENV === 'production' ? undefined : err.stack;

  console.error(`[ERROR] ${status} — ${message}`);
  if (stack) console.error(stack);

  res.status(status).json({
    success: false,
    error:   message,
    ...(stack ? { stack } : {}),
  });
}
