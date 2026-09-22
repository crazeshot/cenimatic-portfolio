/**
 * routes/projects.js
 *
 * GET  /api/projects          → list all projects
 * GET  /api/projects/featured  → list featured projects only
 * GET  /api/projects/:id       → get a single project by ID
 *
 * Data is served from data/projects.json.
 * In a future iteration this can be backed by a database.
 */

import { Router }   from 'express';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join }  from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../data/projects.json');

const router = Router();

// Helper — load projects from JSON file
async function loadProjects() {
  const raw = await readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

/* ── GET /api/projects ─────────────────────────────────────────────── */
router.get('/', async (_req, res, next) => {
  try {
    const projects = await loadProjects();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/projects/featured ────────────────────────────────────── */
router.get('/featured', async (_req, res, next) => {
  try {
    const projects  = await loadProjects();
    const featured  = projects.filter(p => p.featured);
    res.json({ success: true, count: featured.length, data: featured });
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/projects/:id ─────────────────────────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const id       = parseInt(req.params.id, 10);
    const projects = await loadProjects();
    const project  = projects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ success: false, error: `Project with id ${id} not found` });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
});

export default router;
