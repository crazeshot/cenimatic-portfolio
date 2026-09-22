/**
 * server.js — Entry point for the 3D Portfolio backend API
 *
 * Starts an Express server with:
 *   - Security headers (helmet)
 *   - Request logging (morgan)
 *   - CORS configured for the Vite frontend
 *   - JSON body parsing
 *   - Mounted API routers
 *   - Centralized error handling
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRouter   from './routes/health.js';
import contactRouter  from './routes/contact.js';
import projectsRouter from './routes/projects.js';
import errorHandler   from './middleware/errorHandler.js';

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Security ──────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:4173',   // vite preview
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Logging ───────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ── Body parsing ──────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/health',   healthRouter);
app.use('/api/contact',  contactRouter);
app.use('/api/projects', projectsRouter);

// ── 404 catch-all ─────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ── Centralized error handler ─────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎬  3D Portfolio API running at http://localhost:${PORT}`);
  console.log(`    ↳ Health:   GET  /api/health`);
  console.log(`    ↳ Projects: GET  /api/projects`);
  console.log(`    ↳ Contact:  POST /api/contact\n`);
});

export default app;
