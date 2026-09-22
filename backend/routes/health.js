/**
 * routes/health.js
 *
 * GET /api/health
 *
 * Simple liveness-check endpoint.
 * Useful for uptime monitors, deployment checks, and debugging.
 */

import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    success:   true,
    status:    'ok',
    service:   '3D Portfolio API',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
    uptime:    `${Math.floor(process.uptime())}s`,
  });
});

export default router;
