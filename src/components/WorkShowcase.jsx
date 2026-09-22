import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ExternalLink, X, BarChart2, Video, Award, ArrowLeft } from 'lucide-react';
import audioManager from '../utils/audio';

const PROJECTS = [
  {
    id: 1, title: 'Cyberpunk Cinematic Reel 2026', category: 'video-edits',
    desc: 'High-octane sound design and visual effects montage cut from raw street footage. Emphasises fast pacing, audio-visual sync, and custom colour grading.',
    thumbnail: '/edited_page_ai.png',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Audition'],
    date: 'March 2026', role: 'Lead Video Editor / Colorist',
  },
  {
    id: 2, title: 'Global Streaming Analytics Dashboard', category: 'data-analytics',
    desc: 'Analysed 1M+ streaming records to identify viewing demographics, content decay rates, and churn indicators. Built interactive dashboards and geo-maps.',
    thumbnail: '/montage_data.png',
    tools: ['Python', 'Pandas', 'SQL', 'Tableau', 'Seaborn'],
    date: 'January 2026', role: 'Data Analyst',
  },
  {
    id: 3, title: 'Premium Brand Film Commercial', category: 'video-edits',
    desc: "Director's cut for a streetwear launch commercial. Focused on speed ramp transitions, atmospheric neon light grading, and signature sound design.",
    thumbnail: '/creative_camera.png',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    tools: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    date: 'Nov 2025', role: 'Director / Editor',
  },
  {
    id: 4, title: 'Google Data Analytics Certificate', category: 'certifications',
    desc: 'Professional credentials verifying expertise in SQL, spreadsheet analysis, R programming, data cleaning, and Tableau dashboard visualisation.',
    thumbnail: '/data_analytics_concept.png',
    tools: ['SQL', 'Spreadsheets', 'R Programming', 'Tableau'],
    date: 'Sep 2025', role: 'Accredited by Google',
  },
];

const FILTERS = ['all', 'data-analytics', 'video-edits', 'certifications'];

export default function WorkShowcase() {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && active) {
        try { audioManager.playClick(); } catch (_) {}
        setActive(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  const list = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  return (
    <section className="relative w-full py-28 bg-transparent text-white px-6 md:px-14 portfolio-section">

      {/* Header */}
      <div className="text-center mb-12">
        <p className="font-cinzel text-[9px] tracking-[0.8em] text-[#c9a84c] uppercase mb-3">SELECTED PORTFOLIO</p>
        <h2 className="kgf-title text-4xl md:text-5xl tracking-wide">THE FEATURE FILMS</h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mt-5" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => { audioManager.playClick(); setFilter(f); }}
            className="px-6 py-2 border text-[10px] tracking-[0.4em] uppercase transition-all duration-300 cursor-pointer font-medium"
            style={{
              borderColor: filter === f ? '#c9a84c' : 'rgba(201,168,76,0.15)',
              color: filter === f ? '#c9a84c' : '#555',
              background: filter === f ? 'rgba(201,168,76,0.08)' : 'transparent',
              boxShadow: filter === f ? '0 0 20px rgba(201,168,76,0.12)' : 'none',
            }}
          >
            {f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {list.map(proj => (
            <motion.div
              layout key={proj.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              onClick={() => { audioManager.playClick(); setActive(proj); }}
              className="group cursor-pointer glow-card flex flex-col overflow-hidden"
            >
              {/* Thumb */}
              <div className="relative aspect-video overflow-hidden bg-neutral-900">
                <img
                  src={proj.thumbnail} alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: 'contrast(1.2) brightness(0.7) saturate(0.55)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                {/* Category icon */}
                <div className="absolute top-3 left-3 p-1.5 bg-black/80 border border-[#c9a84c22]">
                  {proj.category === 'video-edits'    && <Video    className="w-3.5 h-3.5 text-red-500" />}
                  {proj.category === 'data-analytics' && <BarChart2 className="w-3.5 h-3.5 text-[#c9a84c]" />}
                  {proj.category === 'certifications' && <Award     className="w-3.5 h-3.5 text-[#c9a84c]" />}
                </div>
                {/* Hover play */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full border border-[#c9a84c] flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.1)' }}>
                    <Play className="w-5 h-5 text-[#c9a84c] fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              {/* Info */}
              <div className="p-6 flex flex-col flex-grow bg-[#050507]">
                <span className="font-mono text-[9px] tracking-widest text-neutral-600 uppercase">{proj.date} — {proj.role}</span>
                <h3 className="font-oswald text-lg font-bold tracking-wide mt-2 text-neutral-200 group-hover:text-[#c9a84c] transition-colors duration-300 uppercase">
                  {proj.title}
                </h3>
                <p className="text-neutral-600 text-xs mt-2 leading-relaxed line-clamp-2">{proj.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {proj.tools.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-[#0a0a0a] border border-[#c9a84c15] text-[9px] font-mono text-neutral-500 uppercase">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox / Opened Project View */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/96 p-4 md:p-10"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                try { audioManager.playClick(); } catch (_) {}
                setActive(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }}
              transition={{ type: 'spring', damping: 22, stiffness: 160 }}
              className="w-full max-w-4xl max-h-[92vh] overflow-y-auto no-scrollbar border border-[#c9a84c30] bg-[#050507] relative flex flex-col"
              style={{ boxShadow: '0 0 100px rgba(201,168,76,0.12)' }}
            >
              {/* ── Top Bar with BACK ARROW and Close ─────────── */}
              <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-gradient-to-b from-black via-black/90 to-transparent">
                <button
                  onClick={() => { audioManager.playClick(); setActive(null); }}
                  className="flex items-center gap-2 px-3.5 py-1.5 border border-[#c9a84c] bg-black/90 hover:bg-[#c9a84c20] text-[#c9a84c] transition-all cursor-pointer font-cinzel text-[10px] tracking-[0.25em] uppercase group shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                  title="Back to portfolio (Esc)"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>BACK</span>
                  <span className="hidden sm:inline text-[9px] text-[#c9a84c88] ml-1 font-mono">[ESC]</span>
                </button>

                <button
                  onClick={() => { audioManager.playClick(); setActive(null); }}
                  className="p-2 border border-[#c9a84c22] hover:border-[#c9a84c] bg-black/80 text-neutral-400 hover:text-[#c9a84c] transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Media */}
              <div className="w-full aspect-video bg-black relative">
                {active.category === 'video-edits' && active.videoUrl ? (
                  <video src={active.videoUrl} controls autoPlay className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full relative">
                    <img src={active.thumbnail} alt={active.title}
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.65) contrast(1.2) saturate(0.6)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                  </div>
                )}
              </div>

              {/* Detail */}
              <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[9px] tracking-widest text-[#c9a84c] border border-[#c9a84c33] px-3 py-1 uppercase">
                      {active.category.replace('-', ' ')}
                    </span>
                    <span className="text-neutral-500 text-xs font-mono">{active.date}</span>
                  </div>
                  <h3 className="kgf-title text-2xl md:text-4xl text-white mt-1">{active.title}</h3>
                  <p className="text-neutral-400 text-sm mt-4 leading-relaxed">{active.desc}</p>
                  <div className="mt-6">
                    <span className="font-mono text-[9px] text-[#c9a84c88] uppercase tracking-widest block mb-1">Role & Responsibility</span>
                    <p className="text-neutral-200 text-sm font-medium">{active.role}</p>
                  </div>
                </div>

                <div className="w-full md:w-56 shrink-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-mono text-[9px] text-[#c9a84c88] uppercase tracking-widest mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {active.tools.map(t => (
                        <span key={t} className="px-2.5 py-1.5 bg-[#0a0a0a] border border-[#c9a84c20] text-xs font-mono text-neutral-300 uppercase">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => { audioManager.playClick(); setActive(null); }}
                      className="w-full py-2.5 border border-[#c9a84c] text-[#c9a84c] text-xs tracking-widest font-semibold uppercase hover:bg-[#c9a84c15] transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      BACK TO SHOWCASE
                    </button>
                    <button
                      onClick={() => audioManager.playClick()}
                      className="w-full py-2.5 border border-neutral-800 text-neutral-400 text-xs tracking-widest uppercase hover:text-white hover:border-neutral-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
