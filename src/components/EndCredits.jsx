import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Film } from 'lucide-react';
import audioManager from '../utils/audio';

const Github = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const CREDITS = [
  { role: 'DIRECTOR / LEAD PRODUCER', name: 'HARSH SHROTI' },
  { role: 'COURSE & SPECIALIZATION', name: 'BBA AI & DATA ANALYST' },
  { role: 'COLLEGE & INSTITUTION', name: 'GEETA UNIVERISITY' },
  { role: 'CORE SKILLS', name: 'EDITING · PROMPT ENG · WEB DEV · DATA ANALYTICS' },
  { role: 'LANGUAGES & PASSIONS', name: 'HINDI, ENGLISH · CARS & BIKES' },
  { role: 'SCREENPLAY & DEVELOPER', name: 'HARSH SHROTI' },
  { role: '3D GRAPHICS DESIGNER', name: 'REACT THREE FIBER' },
  { role: 'CHIEF AUDIO COMPOSER', name: 'WEB AUDIO SYNTHESIZER' },
  { role: 'CAST: PYTHON & SQL', name: 'AS "THE DATA CRUNCHERS"' },
  { role: 'CAST: PREMIERE PRO', name: 'AS "THE TIME SCULPTOR"' },
  { role: 'SPECIAL THANKS', name: 'GEETA UNIVERSITY & RECLINING OFFICE CHAIR' },
  { role: 'COFFEE CONSUMED IN PRODUCTION', name: '142 CUPS' }
];

export default function EndCredits({ onOpenDirectorBay }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    audioManager.playImpact();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInputFocus = () => {
    audioManager.playClick();
  };

  return (
    <section className="relative w-full min-h-screen bg-transparent text-neutral-400 py-24 px-4 flex flex-col items-center justify-start overflow-hidden portfolio-section">
      
      {/* Film Strip Border Marks */}
      <div className="w-full max-w-4xl border-t border-[#c9a84c15] border-dashed my-8" />

      {/* Credit Roll Container (Scrolling up automatically when visible or on scroll) */}
      <div className="w-full max-w-2xl relative flex flex-col items-center text-center my-12 min-h-[40vh] overflow-hidden">
        
        {/* Widescreen bars overlay */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

        {/* Animated scrolling credits */}
        <motion.div
          initial={{ y: 280 }}
          whileInView={{ y: -260 }}
          viewport={{ margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
          className="flex flex-col items-center space-y-6 w-full font-mono text-xs select-none"
        >
          <div className="font-cinzel text-xl text-[#c9a84c] tracking-[0.4em] uppercase font-bold mb-6">
            CREDITS
          </div>

          {CREDITS.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row w-full max-w-lg justify-between items-center px-4 md:space-x-12 py-1">
              <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-semibold text-center md:text-right md:w-1/2">
                {item.role}
              </span>
              <span className="text-neutral-200 tracking-wider font-bold uppercase text-center md:text-left md:w-1/2 mt-1 md:mt-0">
                {item.name}
              </span>
            </div>
          ))}

          <div className="text-[9px] text-neutral-600 tracking-widest uppercase pt-12">
            © 2026 Harsh Productions. All Rights Reserved.
          </div>
        </motion.div>
      </div>

      {/* ── DIRECTOR BAY ENTRY BUTTON ─────────────────────────── */}
      <motion.button
        type="button"
        id="director-bay-btn"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(201,168,76,0.3), 0 0 120px rgba(201,168,76,0.1)' }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          try { audioManager.playClick(); } catch (_) {}
          if (onOpenDirectorBay) onOpenDirectorBay();
        }}
        className="w-full max-w-lg mt-2 mb-4 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(0,0,0,0) 100%)',
          border: '1px solid rgba(201,168,76,0.45)',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 0 30px rgba(201,168,76,0.08), inset 0 0 30px rgba(201,168,76,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Film className="w-5 h-5" style={{ color: '#c9a84c' }} />
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 22,
            letterSpacing: '0.2em',
            color: '#c9a84c',
          }}>
            EDITOR BAY &amp; POST-CREDITS
          </span>
          <span style={{ color: '#c9a84c', fontSize: 20, lineHeight: 1 }}>▶</span>
        </div>
        <span style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 9,
          letterSpacing: '0.5em',
          color: 'rgba(201,168,76,0.5)',
          textTransform: 'uppercase',
        }}>
          Click to enter · Post-Credits Scene &amp; Director Dossier
        </span>
      </motion.button>

      {/* Contact Form / Director's Box */}
      <div className="w-full max-w-lg bg-[#050507] border border-[#c9a84c18] p-8 mt-4 relative glow-card" style={{ boxShadow: '0 0 60px rgba(201,168,76,0.05)' }}>
        

        {/* Lens mark */}
        <div className="absolute top-4 left-4 text-[9px] font-mono text-neutral-600 tracking-widest uppercase flex items-center">
          <Film className="w-3.5 h-3.5 text-[#c9a84c] mr-1.5" />
          DIRECTOR'S CORNER
        </div>

        <h3 className="font-oswald text-2xl font-bold uppercase text-neutral-200 tracking-wide mt-6 mb-6">
          COMMISSION A NEW PROJECTS
        </h3>

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <span className="font-oswald text-lg font-bold text-[#c9a84c] tracking-wider block uppercase">
              TRANSMISSION RECEIVED.
            </span>
            <span className="text-xs text-neutral-500 mt-2 block uppercase">
              Harsh will contact you in the next frame.
            </span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            <div>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={handleInputFocus}
                placeholder="YOUR NAME"
                className="w-full bg-[#0a0a0a] border border-[#c9a84c18] text-neutral-200 placeholder-neutral-700 px-4 py-3 rounded-none focus:outline-none focus:border-[#c9a84c] transition-colors font-mono uppercase text-xs"
              />
            </div>
            <div>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleInputFocus}
                placeholder="EMAIL ADDRESS"
                className="w-full bg-[#0a0a0a] border border-[#c9a84c18] text-neutral-200 placeholder-neutral-700 px-4 py-3 rounded-none focus:outline-none focus:border-[#c9a84c] transition-colors font-mono uppercase text-xs"
              />
            </div>
            <div>
              <textarea
                required
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={handleInputFocus}
                placeholder="PROPOSAL DETAILS..."
                className="w-full bg-[#0a0a0a] border border-[#c9a84c18] text-neutral-200 placeholder-neutral-700 px-4 py-3 rounded-none focus:outline-none focus:border-[#c9a84c] transition-colors font-mono uppercase text-xs resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 border border-[#c9a84c] text-[#c9a84c] flex items-center justify-center text-xs tracking-widest font-semibold uppercase hover:bg-[#c9a84c10] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 mr-2" />
              SEND TRANSMISSION
            </button>
          </form>
        )}
      </div>

      {/* Social Billboard Footer */}
      <div className="flex flex-col items-center mt-24 space-y-6">
        <div className="text-[10px] font-mono text-neutral-700 tracking-[0.5em] uppercase">
          FOLLOW THE TIMELINE
        </div>
        <div className="flex items-center space-x-6 text-neutral-600">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" onClick={() => audioManager.playClick()} className="hover:text-[#c9a84c] transition-colors duration-300">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" onClick={() => audioManager.playClick()} className="hover:text-[#c9a84c] transition-colors duration-300">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" onClick={() => audioManager.playClick()} className="hover:text-[#c9a84c] transition-colors duration-300">
            <Instagram className="w-5 h-5" />
          </a>
          <a href="mailto:harsh@email.com" onClick={() => audioManager.playClick()} className="hover:text-[#c9a84c] transition-colors duration-300">
            <Mail className="w-5 h-5" />
          </a>
        </div>
        <p className="font-mono text-[8px] tracking-[0.5em] text-neutral-800 uppercase mt-4">
          © 2026 HARSH PRODUCTIONS · ALL RIGHTS RESERVED
        </p>
      </div>
    </section>
  );
}
