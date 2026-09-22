/**
 * routes/contact.js
 *
 * POST /api/contact
 *
 * Accepts a contact form submission:
 *   { name, email, subject?, message }
 *
 * Actions:
 *  1. Validates all required fields
 *  2. Saves message to data/messages.json (persistent log)
 *  3. Optionally sends an email via Nodemailer (if credentials are set in .env)
 */

import { Router }                from 'express';
import { readFile, writeFile }   from 'fs/promises';
import { existsSync }            from 'fs';
import { fileURLToPath }         from 'url';
import { dirname, join }         from 'path';
import nodemailer                from 'nodemailer';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const MSGS_PATH  = join(__dirname, '../data/messages.json');

const router = Router();

/* ── Helpers ─────────────────────────────────────────────────────── */

// Simple email regex check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Load existing messages (or return empty array)
async function loadMessages() {
  if (!existsSync(MSGS_PATH)) return [];
  try {
    const raw = await readFile(MSGS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Append a new message and persist
async function saveMessage(msg) {
  const msgs = await loadMessages();
  msgs.push(msg);
  await writeFile(MSGS_PATH, JSON.stringify(msgs, null, 2), 'utf-8');
}

// Build a Nodemailer transporter (returns null if credentials not set)
function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (
    !user || !pass ||
    user === 'your-email@gmail.com' ||
    pass === 'your-gmail-app-password'
  ) {
    return null;   // email not configured — skip silently
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

/* ── POST /api/contact ───────────────────────────────────────────── */
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    /* ── Validation ── */
    const errors = [];
    if (!name    || name.trim().length    < 2)  errors.push('Name must be at least 2 characters.');
    if (!email   || !isValidEmail(email))        errors.push('A valid email address is required.');
    if (!message || message.trim().length < 10)  errors.push('Message must be at least 10 characters.');

    if (errors.length) {
      return res.status(400).json({ success: false, errors });
    }

    /* ── Build message object ── */
    const newMsg = {
      id:        Date.now(),
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      subject:   subject?.trim() || '(No subject)',
      message:   message.trim(),
      receivedAt: new Date().toISOString(),
      read:      false,
    };

    /* ── Persist to JSON ── */
    await saveMessage(newMsg);

    /* ── Send email (optional) ── */
    const transporter = createTransporter();
    if (transporter) {
      const mailOptions = {
        from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to:      process.env.EMAIL_TO || process.env.EMAIL_USER,
        replyTo: newMsg.email,
        subject: `[Portfolio] ${newMsg.subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color: #c9a84c; border-bottom: 1px solid #c9a84c33; padding-bottom: 8px;">
              New Portfolio Message
            </h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color:#888; width:100px;">Name</td>
                  <td style="padding: 6px 0; font-weight: bold;">${newMsg.name}</td></tr>
              <tr><td style="padding: 6px 0; color:#888;">Email</td>
                  <td style="padding: 6px 0;">${newMsg.email}</td></tr>
              <tr><td style="padding: 6px 0; color:#888;">Subject</td>
                  <td style="padding: 6px 0;">${newMsg.subject}</td></tr>
            </table>
            <div style="background: #f9f9f9; border-left: 3px solid #c9a84c; padding: 12px 16px; margin-top: 16px;">
              <p style="margin:0; white-space: pre-wrap;">${newMsg.message}</p>
            </div>
            <p style="color:#aaa; font-size: 11px; margin-top: 16px;">
              Received at ${newMsg.receivedAt} · 3D Portfolio API
            </p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`[CONTACT] Email sent for message #${newMsg.id}`);
      } catch (mailErr) {
        // Log but don't fail the request — message is already saved
        console.warn(`[CONTACT] Email sending failed: ${mailErr.message}`);
      }
    }

    console.log(`[CONTACT] New message #${newMsg.id} from ${newMsg.email}`);

    res.status(201).json({
      success: true,
      message: 'Message received! Harsh will get back to you soon.',
      id:      newMsg.id,
    });
  } catch (err) {
    next(err);
  }
});

/* ── GET /api/contact (list all messages — dev only) ─────────────── */
router.get('/', async (_req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }
  try {
    const msgs = await loadMessages();
    res.json({ success: true, count: msgs.length, data: msgs });
  } catch (err) {
    next(err);
  }
});

export default router;
