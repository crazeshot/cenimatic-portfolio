import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Zap,
  ShieldCheck,
  Maximize2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame
} from 'lucide-react';
import audioManager from '../utils/audio';

/* ── Certificate Data ─────────────────────────────────────────── */
const CERTIFICATES = [
  {
    id: 1,
    title: 'Prompt Engineering for Everyone',
    issuer: 'Cognitive Class · IBM Developer Skills Network',
    date: 'March 17, 2026',
    credentialId: 'AI0117EN',
    image: '/cert_prompt_engineering.png',
    accent: '#00d2ff', // Electric cyan
    badge: 'IBM Developer Skills Network Verified',
    highlight: 'Corner Zoom: IBM Seal → Authenticity QR Code',
    description: 'Generative AI prompt engineering, contextual steering & model alignment.',
  },
  {
    id: 2,
    title: 'BBA in AI Enablement Program - Level II',
    issuer: 'Geeta University · Geeta Technical Hub',
    date: 'May 12, 2026',
    credentialId: 'GU0e5237404efb450290',
    image: '/cert_geeta_university.png',
    accent: '#c9a84c', // Imperial gold
    badge: 'Academic Distinction · Level II',
    highlight: 'Corner Zoom: Official Crest → Vice Chancellor Seal',
    description: 'Comprehensive business administration & applied enterprise artificial intelligence.',
  },
  {
    id: 3,
    title: 'AI Search Operating System',
    issuer: 'Semrush Academy',
    date: 'Certified through June 22, 2027',
    credentialId: 'c14132ff4e · Exam ID-37',
    image: '/cert_semrush.png',
    accent: '#b55fe6', // Neon violet
    badge: 'Industry Accredited Examination',
    highlight: 'Corner Zoom: Honors Ribbon → Executive Accreditation',
    description: 'AI-driven semantic search intelligence & modern digital visibility strategy.',
  },
];

export default function Certifications({ onOpenBay }) {
  const handleOpen = (index = 0) => {
    try {
      audioManager.playImpact();
      audioManager.playLightning();
    } catch (_) {}
    if (onOpenBay) onOpenBay(index);
  };

  return (
    <section className="relative w-full py-24 md:py-32 px-4 md:px-12 bg-black text-white overflow-hidden border-t border-[#c9a84c1a]">
      {/* ── Background cinematic lighting & film grain ────────── */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_75%)]" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/></svg>")',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        {/* ── CLAPPERBOARD SCENE HEADER ──────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#c9a84c44] bg-black/80 mb-4 shadow-[0_0_15px_rgba(201,168,76,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-ping" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-[#c9a84c] uppercase font-bold">
              SCENE // CREDENTIALS & ACADEMIC RECOGNITION
            </span>
          </div>

          <h2 className="kgf-title text-4xl sm:text-5xl md:text-6xl text-[#c9a84c] tracking-wider leading-none">
            THE CERTIFICATIONS BAY
          </h2>

          <p className="font-cinzel text-xs md:text-sm tracking-[0.3em] text-neutral-400 uppercase mt-3 max-w-2xl mx-auto">
            METALLIC CINEMATIC EDITION · CORNER-TO-CORNER ZOOM & FULL REVEAL
          </p>
        </motion.div>

        {/* ── 3 CERTIFICATES PREVIEW CARDS (CLICKABLE) ────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {CERTIFICATES.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{
                y: -6,
                boxShadow: `0 0 35px ${cert.accent}33, 0 10px 30px rgba(0,0,0,0.8)`,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpen(idx)}
              className="group relative bg-[#09090d] border border-neutral-800 hover:border-[#c9a84c] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden p-4 rounded-sm"
              style={{
                background: 'linear-gradient(180deg, rgba(20,20,26,0.8) 0%, rgba(9,9,13,0.95) 100%)',
              }}
            >
              {/* Metallic corner bolts */}
              <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/30" />

              {/* Certificate Image Frame with Hover Sheen */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 border border-white/10 mb-4 group-hover:border-[#c9a84c66] transition-colors">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover filter contrast-[1.05] brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                {/* Corner Zoom badge indicator */}
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/85 border border-[#c9a84c44] text-[8px] font-mono text-[#c9a84c] tracking-wider uppercase">
                  ZOOM TOUR #0{cert.id}
                </div>

                <div className="absolute bottom-2 right-2 p-1.5 bg-black/80 text-white/80 group-hover:text-[#c9a84c] transition-colors rounded">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Certificate Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#c9a84c] mb-1 uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3 text-[#c9a84c]" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>

                  <h3 className="font-bebas text-xl text-white tracking-wider leading-tight group-hover:text-[#c9a84c] transition-colors">
                    {cert.title}
                  </h3>

                  <p className="text-neutral-400 text-xs mt-1.5 font-sans line-clamp-2">
                    {cert.description}
                  </p>
                </div>

                {/* Tour preview tag */}
                <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400 group-hover:text-[#c9a84c] transition-colors">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#c9a84c]" />
                    <span>LAUNCH METALLIC TOUR</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── MASTER GATEWAY BUTTON (STYLED EXACTLY LIKE THE EDITOR BAY) ── */}
        <motion.button
          type="button"
          id="open-certifications-bay-btn"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 60px rgba(201,168,76,0.4), 0 0 120px rgba(201,168,76,0.15)',
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleOpen(0)}
          className="w-full max-w-2xl cursor-pointer select-none"
          style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(10,10,14,0.9) 100%)',
            border: '2px solid rgba(201,168,76,0.6)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 35px rgba(201,168,76,0.15), inset 0 0 30px rgba(201,168,76,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-[#c9a84c] animate-pulse" />
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 24,
                letterSpacing: '0.2em',
                color: '#c9a84c',
              }}
            >
              ENTER CERTIFICATIONS BAY · METALLIC CINEMATIC EDITION
            </span>
            <span style={{ color: '#c9a84c', fontSize: 22, lineHeight: 1 }}>▶</span>
          </div>

          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: '0.3em',
              color: '#a0a0a0',
              textTransform: 'uppercase',
            }}
          >
            Corner-to-Corner Camera Zoom · Metallic Sheen Reflection · Sequential Full Reveals
          </span>
        </motion.button>
      </div>
    </section>
  );
}
