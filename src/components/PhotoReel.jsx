import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import audioManager from '../utils/audio';

const PHOTOS = [
  { src: '/Screenshot 2026-04-25 at 11.23.30.png', title: 'THE DIRECTOR',      desc: 'Harsh — BBA Data Analytics & Media Editing.' },
  { src: '/edited_page_ai.png',         title: 'THE EDIT BAY',      desc: 'Crafting pacing, cuts, and colour timelines.' },
  { src: '/data_analytics_concept.png', title: 'DATA DOMAIN',       desc: 'Mining structure, predictive insight, stories.' },
  { src: '/creative_camera.png',        title: 'THE CAPTURE',       desc: 'Finding symmetry and light in everyday frames.' },
];

export default function PhotoReel({ images = {} }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Close on Escape key or navigate with Left/Right
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIdx === null) return;
      if (e.key === 'Escape') {
        try { audioManager.playClick(); } catch (_) {}
        setSelectedIdx(null);
      } else if (e.key === 'ArrowRight') {
        try { audioManager.playClick(); } catch (_) {}
        setSelectedIdx((idx) => (idx + 1) % PHOTOS.length);
      } else if (e.key === 'ArrowLeft') {
        try { audioManager.playClick(); } catch (_) {}
        setSelectedIdx((idx) => (idx - 1 + PHOTOS.length) % PHOTOS.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  return (
    <section className="relative w-full py-28 bg-transparent text-white px-6 md:px-14 portfolio-section">

      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="font-cinzel text-[9px] tracking-[0.8em] text-[#c9a84c] uppercase mb-3"
        >
          PRODUCTION STILLS
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.7 }}
          className="kgf-title text-4xl md:text-5xl text-white tracking-wide"
        >
          BEHIND THE SCENES
        </motion.h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mt-5" />
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PHOTOS.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 + (i % 2 === 0 ? 0 : 20) }}
            whileInView={{ opacity: 1, y: i % 2 === 0 ? 0 : 20 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16,1,0.3,1], delay: i * 0.08 }}
            onClick={() => {
              try { audioManager.playClick(); } catch (_) {}
              setSelectedIdx(i);
            }}
            className="group glow-card overflow-hidden flex flex-col cursor-pointer"
          >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[4/3] bg-neutral-950">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />
              <img
                src={p.src} alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                style={{ filter: 'contrast(1.2) brightness(0.75) saturate(0.65)' }}
              />
              {/* Film corner marks */}
              <div className="absolute top-3 left-3 z-20 font-mono text-[9px] tracking-widest text-[#c9a84c88]">
                F/{i + 2}.8 · ISO 400
              </div>
              {/* Enlarge badge */}
              <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-[#c9a84c44] p-1.5 flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-[#c9a84c]" />
                <span className="font-cinzel text-[8px] tracking-widest text-[#c9a84c] uppercase">EXPAND</span>
              </div>
            </div>
            {/* Caption */}
            <div className="p-6 bg-[#050507] border-t border-[#c9a84c12] flex items-center justify-between">
              <div>
                <h3 className="font-oswald font-bold text-base tracking-[0.1em] text-neutral-200 group-hover:text-[#c9a84c] transition-colors duration-300 uppercase">
                  {p.title}
                </h3>
                <p className="text-neutral-500 text-xs mt-1 leading-relaxed">{p.desc}</p>
              </div>
              <span className="text-[#c9a84c66] group-hover:text-[#c9a84c] transition-colors text-sm font-mono ml-4">
                0{i + 1}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox / Opened Photo View */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/98 p-4 md:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                try { audioManager.playClick(); } catch (_) {}
                setSelectedIdx(null);
              }
            }}
          >
            {/* Top Bar with BACK ARROW and Close */}
            <div className="fixed top-4 left-4 right-4 z-[9600] flex items-center justify-between pointer-events-none">
              <button
                onClick={() => {
                  try { audioManager.playClick(); } catch (_) {}
                  setSelectedIdx(null);
                }}
                className="pointer-events-auto flex items-center gap-2 px-4 py-2 border border-[#c9a84c] bg-black/90 hover:bg-[#c9a84c20] text-[#c9a84c] transition-all cursor-pointer font-cinzel text-xs tracking-[0.25em] uppercase group shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                title="Back to reel (Esc)"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>BACK</span>
                <span className="text-[9px] text-[#c9a84c88] ml-1 font-mono hidden sm:inline">[ESC]</span>
              </button>

              <button
                onClick={() => {
                  try { audioManager.playClick(); } catch (_) {}
                  setSelectedIdx(null);
                }}
                className="pointer-events-auto p-2 border border-[#c9a84c33] hover:border-[#c9a84c] bg-black/90 text-neutral-400 hover:text-[#c9a84c] transition-colors cursor-pointer"
                title="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prev / Next controls */}
            <button
              onClick={() => {
                try { audioManager.playClick(); } catch (_) {}
                setSelectedIdx((idx) => (idx - 1 + PHOTOS.length) % PHOTOS.length);
              }}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-[9600] p-3 border border-[#c9a84c33] hover:border-[#c9a84c] bg-black/80 text-neutral-400 hover:text-[#c9a84c] transition-all cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                try { audioManager.playClick(); } catch (_) {}
                setSelectedIdx((idx) => (idx + 1) % PHOTOS.length);
              }}
              className="fixed right-4 top-1/2 -translate-y-1/2 z-[9600] p-3 border border-[#c9a84c33] hover:border-[#c9a84c] bg-black/80 text-neutral-400 hover:text-[#c9a84c] transition-all cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Photo Card */}
            <motion.div
              key={selectedIdx}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-5xl max-h-[85vh] flex flex-col border border-[#c9a84c33] bg-[#07070a] overflow-hidden shadow-[0_0_80px_rgba(201,168,76,0.15)]"
            >
              <div className="relative flex-grow flex items-center justify-center bg-black min-h-[50vh] max-h-[70vh] overflow-hidden">
                <img
                  src={PHOTOS[selectedIdx].src}
                  alt={PHOTOS[selectedIdx].title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Caption Footer */}
              <div className="p-6 bg-[#050507] border-t border-[#c9a84c20] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-cinzel text-[9px] tracking-[0.4em] text-[#c9a84c] uppercase font-bold">
                      FRAME 0{selectedIdx + 1} / 0{PHOTOS.length}
                    </span>
                    <span className="text-neutral-600 text-xs font-mono">F/2.8 · 35MM CINEMA LENS</span>
                  </div>
                  <h3 className="font-oswald text-xl font-bold tracking-wider text-white uppercase mt-1">
                    {PHOTOS[selectedIdx].title}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-1">{PHOTOS[selectedIdx].desc}</p>
                </div>

                <button
                  onClick={() => {
                    try { audioManager.playClick(); } catch (_) {}
                    setSelectedIdx(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c18] font-cinzel text-[10px] tracking-[0.25em] uppercase transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK TO GALLERY</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
