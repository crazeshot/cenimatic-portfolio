import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Menu, X, ArrowLeft } from 'lucide-react';
import audioManager from './utils/audio';
import { getStoredImage, setStoredImage, clearStoredImages } from './utils/db';

import CinematicTrailer from './components/CinematicTrailer';
import HeroReveal from './components/HeroReveal';
import TrailerMontage from './components/TrailerMontage';
import PhotoReel from './components/PhotoReel';
import WorkShowcase from './components/WorkShowcase';
import Certifications from './components/Certifications';
import EndCredits from './components/EndCredits';
import DirectorBay from './components/DirectorBay';

// ── Nav Items ──────────────────────────────────────────────────────
const NAV = [
  { label: 'WELCOME',        key: 'sec2' },
  { label: 'MONTAGE',        key: 'sec3' },
  { label: 'WHO I AM',       key: 'sec4' },
  { label: 'GALLERY',        key: 'sec5' },
  { label: 'SHOWCASE',       key: 'sec6' },
  { label: 'PORTFOLIO',      key: 'sec7' },
  { label: 'CERTIFICATIONS', key: 'secCert' },
  { label: 'CONTACT',        key: 'sec8' },
];

// ── Cinematic Taglines component for Section 4 ──────────────────────
function CinematicTaglines({ active }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [flash, setFlash] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (active && !triggered.current) {
      triggered.current = true;
      
      const lines = [
        { text: "Data Analyst by choice", color: "#c9a84c", delay: 400, sound: 'click' },
        { text: "Editor by passion", color: "#c0392b", delay: 1100, sound: 'click' },
        { text: "Creator by the Dream", color: "#ffffff", delay: 1800, sound: 'impact' }
      ];

      lines.forEach((line, index) => {
        setTimeout(() => {
          setVisibleLines(prev => [...prev, line]);
          setFlash(true);
          setTimeout(() => setFlash(false), 200); // short visual flash
          
          if (line.sound === 'impact') {
            audioManager.playImpact();
          } else {
            audioManager.playClick();
          }
        }, line.delay);
      });
    }
  }, [active]);

  return (
    <div className="flex flex-col gap-3 my-6 min-h-[120px] justify-center items-center relative overflow-hidden p-2 rounded">
      {/* Local flash filter */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay z-10"
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {visibleLines.map((line, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="kgf-title text-lg md:text-2xl tracking-[0.1em] font-bold"
          style={{ 
            color: line.color,
            textShadow: line.color === '#c9a84c' 
              ? '0 0 15px rgba(201,168,76,0.6), 0 0 45px rgba(201,168,76,0.2)' 
              : line.color === '#c0392b' 
              ? '0 0 15px rgba(192,57,43,0.7), 0 0 45px rgba(192,57,43,0.2)' 
              : '0 0 15px rgba(255,255,255,0.5), 0 0 45px rgba(255,255,255,0.1)'
          }}
        >
          {line.text.toUpperCase()}
        </motion.div>
      ))}
    </div>
  );
}

function ImageSlot({ label, description, imageKey, currentValue, onUpload, onClear }) {
  const fileInputRef = useRef(null);
  
  return (
    <div className="border border-[#c9a84c15] bg-black/40 p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <span className="font-oswald font-bold text-xs tracking-wider text-neutral-200 block uppercase">{label}</span>
          <span className="text-[10px] text-neutral-600 block mt-0.5">{description}</span>
        </div>
        {currentValue && !currentValue.startsWith('/') && (
          <button 
            type="button"
            onClick={() => onClear(imageKey)}
            className="text-[9px] font-mono text-red-500 hover:text-red-400 transition-colors uppercase"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <div className="w-16 h-12 shrink-0 border border-[#c9a84c22] bg-neutral-950 overflow-hidden relative group">
          <img src={currentValue} alt={label} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 border border-dashed border-[#c9a84c33] hover:border-[#c9a84c] text-[10px] font-mono text-neutral-400 hover:text-[#c9a84c] text-center transition-colors cursor-pointer"
          >
            SELECT IMAGE
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(imageKey, file);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [trailerDone, setTrailerDone] = useState(false);
  const [heroRevealDone, setHeroRevealDone] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(2);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [letterbox, setLetterbox] = useState(true);

  const [studioOpen, setStudioOpen] = useState(false);
  const [directorBayOpen, setDirectorBayOpen] = useState(false);
  const [images, setImages] = useState({
    hero: '/harsh_hero_art.png',
    editing: '/edited_page_ai.png',
    data: '/montage_data.png',
    camera: '/creative_camera.png',
    student: '/student.jpg',
    timeline: '/editing_timeline.png',
    dataAnalysis: '/data_analysis.png',
  });

  useEffect(() => {
    async function loadImages() {
      const keys = ['hero', 'editing', 'data', 'camera', 'student', 'timeline', 'dataAnalysis'];
      const loaded = {};
      for (const key of keys) {
        const val = await getStoredImage(key);
        if (val) {
          loaded[key] = val;
        }
      }
      if (Object.keys(loaded).length > 0) {
        setImages(prev => ({ ...prev, ...loaded }));
      }
    }
    loadImages();
  }, []);

  const handleImageUpload = async (key, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setImages(prev => ({ ...prev, [key]: base64 }));
      await setStoredImage(key, base64);
    };
    reader.readAsDataURL(file);
  };

  const handleResetImages = async () => {
    audioManager.playClick();
    await clearStoredImages();
    setImages({
      hero: '/harsh_hero_art.png',
      editing: '/edited_page_ai.png',
      data: '/montage_data.png',
      camera: '/creative_camera.png',
      student: '/student.jpg',
      timeline: '/editing_timeline.png',
      dataAnalysis: '/data_analysis.png',
    });
  };

  const portfolioReady = trailerDone && heroRevealDone;

  const refs = {
    sec2: useRef(null),
    sec3: useRef(null),
    sec4: useRef(null),
    sec5: useRef(null),
    sec6: useRef(null),
    sec7: useRef(null),
    secCert: useRef(null),
    sec8: useRef(null),
  };

  // ── Scroll tracker ─────────────────────────────────────────────
  useEffect(() => {
    if (!portfolioReady) return;
    const onScroll = () => {
      const y = window.scrollY, wh = window.innerHeight;
      const secList = Object.entries(refs).map(([key, ref]) => ({
        key,
        top: ref.current?.offsetTop ?? 0,
        h: ref.current?.offsetHeight ?? 0,
      }));
      const center = y + wh / 2;
      let cur = 'sec2';
      for (const s of secList) {
        if (center >= s.top && center <= s.top + s.h) { cur = s.key; break; }
      }
      setActiveSection(cur);
      const cs = secList.find(s => s.key === cur);
      if (cs) setScrollProgress(Math.max(0, Math.min(1, (y - cs.top) / Math.max(1, cs.h))));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [portfolioReady]);

  const scrollTo = key => {
    audioManager.playClick();
    setMenuOpen(false);
    refs[key]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMute = () => {
    const m = audioManager.toggleMute();
    setIsMuted(m);
  };

  // Close open drawer / menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (studioOpen) {
          try { audioManager.playClick(); } catch (_) {}
          setStudioOpen(false);
        } else if (menuOpen) {
          try { audioManager.playClick(); } catch (_) {}
          setMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [studioOpen, menuOpen]);



  return (
    <>
      {/* ── Trailer sequence (fixed, full-screen) ────────────────── */}
      <AnimatePresence>
        {!trailerDone && (
          <CinematicTrailer onComplete={() => setTrailerDone(true)} images={images} />
        )}
      </AnimatePresence>

      {/* ── Hero Reveal (cinematic image after trailer) ────────── */}
      <AnimatePresence>
        {trailerDone && !heroRevealDone && (
          <HeroReveal onComplete={() => setHeroRevealDone(true)} heroImage={images.hero} />
        )}
      </AnimatePresence>

      {/* ── Global FX Layers ─────────────────────────────────────── */}
      {portfolioReady && (
        <>
          {/* Film grain */}
          <div className="grain-overlay opacity-[0.055] pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="grainF">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#grainF)" />
            </svg>
          </div>
          <div className="cinema-vignette" />
          <div className="scanlines" />
          <div className="light-leak" />

          {/* Letterbox bars */}
          <div
            className="letterbox-top pointer-events-none"
            style={{ height: letterbox ? '8vh' : '0' }}
          />
          <div
            className="letterbox-bottom pointer-events-none"
            style={{ height: letterbox ? '8vh' : '0' }}
          />
        </>
      )}

      {/* ── Portfolio (scrollable) ────────────────────────────────── */}
      <AnimatePresence>
        {portfolioReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="relative w-full min-h-screen bg-transparent"
          >
            {/* Fixed background image after trailer ends */}
            <div 
              className="fixed inset-0 pointer-events-none z-[0] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/Screenshot 2026-04-25 at 11.23.30.png')",
              }}
            />
            {/* Dark overlay for readability */}
            <div className="fixed inset-0 pointer-events-none z-[1] bg-black/75" />
            {/* ── Top HUD ─────────────────────────────────────── */}
            <header className="fixed top-0 left-0 right-0 z-[900] flex items-center justify-between px-6 md:px-10 pointer-events-none"
              style={{ height: letterbox ? '8vh' : '0', minHeight: '0', transition: 'height 1s' }}
            >
              <div className="pointer-events-auto flex items-center gap-3">
                <span className="font-bebas text-[#c9a84c] tracking-[0.25em] text-sm leading-none">HARSH</span>
                <div className="w-[1px] h-4 bg-[#c9a84c33]" />
                <span className="font-mono text-[8px] tracking-[0.4em] text-neutral-600 uppercase hidden md:block">
                  Portfolio v2.6
                </span>
              </div>

              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  onClick={() => { audioManager.playClick(); setStudioOpen(true); }}
                  className="px-3 py-1.5 border border-[#c9a84c33] hover:border-[#c9a84c] text-[9px] font-mono text-[#c9a84c] hover:bg-[#c9a84c10] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>◆ STUDIO ◆</span>
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 border border-[#c9a84c22] hover:border-[#c9a84c66] text-neutral-500 hover:text-[#c9a84c] transition-colors cursor-pointer"
                >
                  {isMuted
                    ? <VolumeX className="w-3.5 h-3.5 text-red-600" />
                    : <Volume2 className="w-3.5 h-3.5" />
                  }
                </button>
                <button
                  onClick={() => { audioManager.playClick(); setMenuOpen(o => !o); }}
                  className="p-2 border border-[#c9a84c22] hover:border-[#c9a84c66] text-neutral-500 hover:text-[#c9a84c] transition-colors cursor-pointer"
                >
                  {menuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
                </button>
              </div>
            </header>

            {/* ── Side Nav (desktop) ───────────────────────────── */}
            <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-[800] hidden lg:flex flex-col gap-5">
              {NAV.map(({ label, key }) => {
                const active = activeSection === key || (typeof activeSection === 'number' && key === `sec${activeSection}`);
                return (
                  <button
                    key={key}
                    onClick={() => scrollTo(key)}
                    className={`flex items-center gap-2 cursor-pointer group text-right`}
                  >
                    <span className={`font-mono text-[9px] tracking-widest transition-colors duration-300 ${active ? 'text-[#c9a84c]' : 'text-neutral-700 group-hover:text-neutral-400'}`}>
                      {label}
                    </span>
                    <div className={`h-[1px] transition-all duration-300 ${active ? 'w-5 bg-[#c9a84c]' : 'w-2 bg-neutral-800 group-hover:w-4 group-hover:bg-neutral-600'}`} />
                  </button>
                );
              })}
            </nav>

            {/* ── Mobile menu ──────────────────────────────────── */}
            <AnimatePresence>
              {menuOpen && (
                 <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 bg-black/98 z-[850] flex flex-col items-center justify-center gap-8"
                >
                  {/* Top Bar with Back Arrow */}
                  <div className="absolute top-6 left-6 z-10">
                    <button
                      onClick={() => { audioManager.playClick(); setMenuOpen(false); }}
                      className="flex items-center gap-2 px-3.5 py-1.5 border border-[#c9a84c] bg-black/80 hover:bg-[#c9a84c20] text-[#c9a84c] font-cinzel text-xs tracking-widest uppercase cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>BACK</span>
                    </button>
                  </div>
                  <div className="absolute top-6 right-6 z-10">
                    <button
                      onClick={() => { audioManager.playClick(); setMenuOpen(false); }}
                      className="p-2 border border-[#c9a84c33] text-neutral-400 hover:text-[#c9a84c] cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {NAV.map(({ label, key }) => (
                    <button
                      key={key}
                      onClick={() => scrollTo(key)}
                      className="font-bebas text-3xl tracking-[0.2em] text-neutral-300 hover:text-[#c9a84c] transition-colors cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>



            {/* ═══════════════════════════════════════════════════
                SECTION 2 — 3D WELCOME
            ═══════════════════════════════════════════════════ */}
            <section
              ref={refs.sec2}
              className="relative w-full h-screen flex flex-col items-center justify-end pb-[18vh] px-6 text-center z-[60]"
            >
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16,1,0.3,1] }}
                className="max-w-2xl"
              >
                <p className="font-cinzel text-[9px] tracking-[0.7em] text-[#c9a84c] mb-4 uppercase">
                  THE DEBUT FRAME
                </p>
                <h1 className="kgf-title text-5xl md:text-7xl lg:text-8xl text-white leading-none glow-text-gold">
                  WELCOME TO THE<br />WORLD OF HARSH.
                </h1>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mt-6 mb-6" />
                <p className="font-mono text-[9px] tracking-[0.5em] text-neutral-600 uppercase animate-pulse">
                  ↓ Scroll to reveal
                </p>
              </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════
                SECTION 3 — TRAILER MONTAGE
            ═══════════════════════════════════════════════════ */}
            <section
              ref={refs.sec3}
              className="w-full h-screen relative z-[60]"
            >
              <TrailerMontage 
                isActive={activeSection === 'sec3' || activeSection === 3} 
                images={images} 
                onDirectorClick={() => {
                  try { audioManager.playImpact(); } catch (_) {}
                  setDirectorBayOpen(true);
                }}
              />
            </section>

            {/* ═══════════════════════════════════════════════════
                SECTION 4 — WHO I AM
            ═══════════════════════════════════════════════════ */}
            <section
              ref={refs.sec4}
              className="relative w-full h-screen flex items-end justify-center pb-[18vh] px-6 text-center z-[60]"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16,1,0.3,1] }}
                className="max-w-2xl"
              >
                <div
                  className="border border-[#c9a84c15] bg-black/70 backdrop-blur-md px-8 md:px-14 py-10 md:py-14"
                  style={{ boxShadow: '0 0 60px rgba(201,168,76,0.05), inset 0 0 40px rgba(0,0,0,0.5)' }}
                >
                  <p className="font-cinzel text-[9px] tracking-[0.7em] text-[#c9a84c] mb-5">
                    ACT I — CHARACTERS
                  </p>
                  <h2 className="kgf-title text-3xl md:text-5xl text-white leading-none mb-4">
                    CURRENTLY PURSUING<br />BBA IN DATA ANALYTICS.
                  </h2>
                  <div className="w-12 h-[1px] bg-[#c9a84c55] mx-auto my-5" />
                  <CinematicTaglines active={activeSection === 'sec4' || activeSection === 4} />
                  <p className="font-cinzel text-xs md:text-sm text-[#c9a84c88] tracking-[0.2em] italic">
                    "Also an editor who can't edit his own life."
                  </p>
                </div>
              </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════
                SECTION 5 — PHOTO REEL
            ═══════════════════════════════════════════════════ */}
            <div ref={refs.sec5} className="relative z-[60]">
              <PhotoReel images={images} />
            </div>

            {/* ═══════════════════════════════════════════════════
                SECTION 6 — PORTFOLIO INTRO (3D)
            ═══════════════════════════════════════════════════ */}
            <section
              ref={refs.sec6}
              className="relative w-full h-screen flex items-center justify-end pr-6 md:pr-24 z-[60]"
            >
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16,1,0.3,1] }}
                className="max-w-md text-right"
              >
                <div
                  className="border border-[#c9a84c15] bg-black/70 backdrop-blur-md px-8 md:px-12 py-10"
                  style={{ boxShadow: '0 0 60px rgba(201,168,76,0.05)' }}
                >
                  <p className="font-cinzel text-[9px] tracking-[0.7em] text-[#c9a84c] mb-5">
                    ACT II — PRESENTATION
                  </p>
                  <h2 className="kgf-title text-3xl md:text-5xl text-white leading-none mb-5">
                    LET ME SHOW YOU<br />WHAT I'VE BUILT.
                  </h2>
                  <p className="font-mono text-[9px] tracking-[0.4em] text-neutral-600 uppercase">
                    Portfolio Showcase Initialising...
                  </p>
                </div>
              </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════
                SECTION 7 — WORK SHOWCASE
            ═══════════════════════════════════════════════════ */}
            <div ref={refs.sec7} className="relative z-[60]">
              <WorkShowcase images={images} />
            </div>

            {/* ═══════════════════════════════════════════════════
                SECTION: CERTIFICATIONS — BLADE & LIGHTNING REVEAL
            ═══════════════════════════════════════════════════ */}
            <div ref={refs.secCert} className="relative z-[60]">
              <Certifications />
            </div>

            {/* ═══════════════════════════════════════════════════
                SECTION 8 — END CREDITS
            ═══════════════════════════════════════════════════ */}
            <div ref={refs.sec8} className="relative z-[60]">
              <EndCredits onOpenDirectorBay={() => { try { audioManager.playImpact(); } catch (_) {} setDirectorBayOpen(true); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Director's Studio Image Customizer Drawer ────────────────── */}
      <AnimatePresence>
        {studioOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setStudioOpen(false)}
              className="fixed inset-0 bg-black z-[990] cursor-pointer pointer-events-auto"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-black/95 backdrop-blur-lg border-l border-[#c9a84c22] p-6 flex flex-col justify-between overflow-y-auto no-scrollbar pointer-events-auto text-white"
            >
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-[#c9a84c22] pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { audioManager.playClick(); setStudioOpen(false); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c9a84c] bg-black/90 hover:bg-[#c9a84c20] text-[#c9a84c] font-cinzel text-[10px] tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(201,168,76,0.2)]"
                      title="Back to portfolio"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>BACK</span>
                    </button>
                    <div>
                      <h2 className="font-bebas text-2xl tracking-[0.1em] text-[#c9a84c]">MONTAGE STUDIO</h2>
                      <p className="font-mono text-[9px] tracking-wider text-neutral-500 uppercase mt-0.5">Customise Cinematic Assets</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { audioManager.playClick(); setStudioOpen(false); }}
                    className="p-1.5 border border-[#c9a84c22] hover:border-[#c9a84c] text-neutral-500 hover:text-[#c9a84c] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <ImageSlot
                    label="Hero Portrait"
                    description="Appears in intro trailer & hero reveal section"
                    imageKey="hero"
                    currentValue={images.hero}
                    onUpload={handleImageUpload}
                    onClear={async (k) => {
                      await setStoredImage(k, null);
                      setImages(prev => ({ ...prev, [k]: '/harsh_hero_art.png' }));
                    }}
                  />
                  <ImageSlot
                    label="Data Analyst (Dashboard)"
                    description="Primary data science visualization slide"
                    imageKey="data"
                    currentValue={images.data}
                    onUpload={handleImageUpload}
                    onClear={async (k) => {
                      await setStoredImage(k, null);
                      setImages(prev => ({ ...prev, [k]: '/montage_data.png' }));
                    }}
                  />
                  <ImageSlot
                    label="Data Analyst (Concept)"
                    description="Secondary data / Tableau background still"
                    imageKey="dataAnalysis"
                    currentValue={images.dataAnalysis}
                    onUpload={handleImageUpload}
                    onClear={async (k) => {
                      await setStoredImage(k, null);
                      setImages(prev => ({ ...prev, [k]: '/data_analysis.png' }));
                    }}
                  />
                  <ImageSlot
                    label="Video Editing (Full UI)"
                    description="Timeline preview during intro trailer"
                    imageKey="editing"
                    currentValue={images.editing}
                    onUpload={handleImageUpload}
                    onClear={async (k) => {
                      await setStoredImage(k, null);
                      setImages(prev => ({ ...prev, [k]: '/edited_page_ai.png' }));
                    }}
                  />
                  <ImageSlot
                    label="Video Editing (Timeline Scan)"
                    description="Timeline track scan in the montage section"
                    imageKey="timeline"
                    currentValue={images.timeline}
                    onUpload={handleImageUpload}
                    onClear={async (k) => {
                      await setStoredImage(k, null);
                      setImages(prev => ({ ...prev, [k]: '/editing_timeline.png' }));
                    }}
                  />
                  <ImageSlot
                    label="Creative Camera"
                    description="Symmetry camera lens focus asset"
                    imageKey="camera"
                    currentValue={images.camera}
                    onUpload={handleImageUpload}
                    onClear={async (k) => {
                      await setStoredImage(k, null);
                      setImages(prev => ({ ...prev, [k]: '/creative_camera.png' }));
                    }}
                  />
                  <ImageSlot
                    label="Student Photo"
                    description="Student/Director portrait frame"
                    imageKey="student"
                    currentValue={images.student}
                    onUpload={handleImageUpload}
                    onClear={async (k) => {
                      await setStoredImage(k, null);
                      setImages(prev => ({ ...prev, [k]: '/student.jpg' }));
                    }}
                  />
                </div>
              </div>

              <div className="border-t border-[#c9a84c12] pt-4 mt-6 flex flex-col gap-3">
                <button
                  onClick={handleResetImages}
                  className="w-full py-2.5 border border-red-900/40 hover:border-red-600 text-red-500 hover:bg-red-950/20 text-[10px] font-mono tracking-widest transition-all cursor-pointer text-center uppercase"
                >
                  RESET ALL TO DEFAULT
                </button>
                <button
                  onClick={() => { audioManager.playClick(); setStudioOpen(false); }}
                  className="w-full py-3 bg-[#c9a84c] text-black text-xs font-oswald tracking-[0.2em] hover:bg-[#b0913b] font-bold transition-colors cursor-pointer text-center uppercase"
                >
                  SAVE & CLOSE
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* ── Director Bay Modal ────────────────────────────────────── */}
      <AnimatePresence>
        {directorBayOpen && (
          <DirectorBay onClose={() => setDirectorBayOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
