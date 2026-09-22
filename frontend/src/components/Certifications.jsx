import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  Play,
  Pause
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
    badge: 'IBM SkillsNetwork Certified',
    description: 'Mastered foundational and advanced generative AI prompt engineering techniques, contextual steering, and model alignment powered by IBM Developer Skills Network.',
    verifyUrl: 'https://courses.cognitiveclass.ai/certificates/60f80def27424bdf974247924172c50f',
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
    description: 'Successfully completed all rigorous university assessments for Semester 2 of Bachelor of Business Administration in the specialised Artificial Intelligence Enablement Program.',
    verifyUrl: '#',
  },
  {
    id: 3,
    title: 'AI Search Operating System',
    issuer: 'Semrush Academy',
    date: 'Certified through June 22, 2027',
    credentialId: 'c14132ff4e · Exam ID-37',
    image: '/cert_semrush.png',
    accent: '#b55fe6', // Neon violet
    badge: 'Industry Accredited',
    description: 'Awarded for proficiency in AI-driven search ecosystem mechanics, semantic search intelligence, algorithmic ranking factors, and modern digital visibility strategy.',
    verifyUrl: '#',
  },
];

export default function Certifications() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [animState, setAnimState] = useState('idle'); // 'lightning' | 'sword' | 'impact' | 'idle'
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxCert, setLightboxCert] = useState(null);
  const [cameraShake, setCameraShake] = useState(false);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);

  /* ── Master Trigger Function: Lightning → Sword Slash → Certificate Slam ── */
  const triggerBladeReveal = useCallback((nextIndex) => {
    // 1. Stage 1: Lightning Strike
    setAnimState('lightning');
    try { audioManager.playLightning(); } catch (_) {}

    // 2. Stage 2: Sword Dash with Speed Trails (after 260ms of lightning crackle)
    setTimeout(() => {
      setAnimState('sword');
      try { audioManager.playSwordSlash(); } catch (_) {}
    }, 260);

    // 3. Stage 3: Certificate Emerges on Blade Pass (after 700ms)
    setTimeout(() => {
      setCurrentIdx(nextIndex);
      setAnimState('impact');
      setCameraShake(true);
      try { audioManager.playImpact(); } catch (_) {}
      setTimeout(() => setCameraShake(false), 380);
    }, 720);

    // 4. Return to stable state
    setTimeout(() => {
      setAnimState('idle');
    }, 1250);
  }, []);

  /* ── Next / Previous Navigation ────────────────────────────── */
  const handleNext = useCallback(() => {
    try { audioManager.playClick(); } catch (_) {}
    const next = (currentIdx + 1) % CERTIFICATES.length;
    triggerBladeReveal(next);
  }, [currentIdx, triggerBladeReveal]);

  const handlePrev = useCallback(() => {
    try { audioManager.playClick(); } catch (_) {}
    const prev = (currentIdx - 1 + CERTIFICATES.length) % CERTIFICATES.length;
    triggerBladeReveal(prev);
  }, [currentIdx, triggerBladeReveal]);

  /* ── Auto-cycle logic ──────────────────────────────────────── */
  useEffect(() => {
    if (!isAutoPlaying || lightboxCert !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const next = (currentIdx + 1) % CERTIFICATES.length;
      triggerBladeReveal(next);
    }, 6200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, currentIdx, lightboxCert, triggerBladeReveal]);

  /* ── ESC key closes lightbox ───────────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && lightboxCert) {
        try { audioManager.playClick(); } catch (_) {}
        setLightboxCert(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxCert]);

  const current = CERTIFICATES[currentIdx];

  return (
    <section
      ref={sectionRef}
      id="certifications-section"
      onClick={(e) => {
        // Only trigger on section background clicks, not controls
        if (e.target.closest('button') || e.target.closest('.interactive-control')) return;
        handleNext();
      }}
      className="relative w-full min-h-screen py-24 bg-transparent text-white px-4 md:px-12 flex flex-col items-center justify-center portfolio-section overflow-hidden select-none cursor-pointer"
      title="Click anywhere in section to slash into the next certificate"
    >
      {/* ── CINEMATIC LIGHTNING OVERLAY ────────────────────────── */}
      <AnimatePresence>
        {animState === 'lightning' && (
          <div className="fixed inset-0 z-[120] pointer-events-none">
            {/* White flash */}
            <motion.div
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 bg-white mix-blend-screen"
            />
            {/* Cyan electric pulse */}
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 bg-cyan-400/30 mix-blend-color-dodge"
            />
            {/* SVG Lightning Bolts */}
            <svg className="w-full h-full absolute inset-0 stroke-cyan-200 fill-none filter drop-shadow-[0_0_20px_#00d2ff]" viewBox="0 0 1000 1000">
              <path
                d="M 500 0 L 480 200 L 530 220 L 460 450 L 520 480 L 440 750 L 510 780 L 480 1000"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 530 220 L 620 280 L 590 340 L 680 420"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 460 450 L 370 520 L 410 570 L 320 660"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </AnimatePresence>

      {/* ── CINEMATIC SWORD & SPEED TRAILS OVERLAY ─────────────── */}
      <AnimatePresence>
        {(animState === 'sword' || animState === 'impact') && (
          <div className="absolute inset-0 z-[110] pointer-events-none overflow-hidden">
            {/* Dynamic Speed Lines / Motion Blur Streaks */}
            <div className="absolute inset-0 flex flex-col justify-around opacity-75">
              {[...Array(14)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: i % 2 === 0 ? '-100%' : '100%', opacity: 0 }}
                  animate={{ x: i % 2 === 0 ? '120%' : '-120%', opacity: [0, 0.9, 0] }}
                  transition={{ duration: 0.38, delay: i * 0.015, ease: 'easeOut' }}
                  className="h-[2px] w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${current.accent}, #ffffff, ${current.accent}, transparent)`,
                    transform: `rotate(${i % 2 === 0 ? -12 : -15}deg) scaleY(${i % 3 === 0 ? 2 : 1})`,
                    filter: 'drop-shadow(0 0 12px #fff)',
                  }}
                />
              ))}
            </div>

            {/* Glowing Katana Blade Slicing Across Screen */}
            <motion.div
              initial={{ x: '120vw', y: '-30vh', rotate: -35, opacity: 0 }}
              animate={{ x: '-120vw', y: '120vh', rotate: -35, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-[180vw] h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 20%, #ffffff 50%, rgba(201,168,76,0.9) 70%, transparent 100%)',
                boxShadow: `0 0 50px #ffffff, 0 0 100px ${current.accent}, 0 0 150px ${current.accent}`,
                filter: 'blur(1px)',
              }}
            >
              {/* Blade cutting spark head */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #ffffff 30%, #c9a84c 70%, transparent 100%)',
                  boxShadow: '0 0 60px #ffffff',
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Section Header ───────────────────────────────────── */}
      <div className="text-center mb-10 relative z-30 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#c9a84c44] bg-black/60 mb-3">
          <Zap className="w-3.5 h-3.5 text-[#c9a84c] animate-pulse" />
          <span className="font-cinzel text-[9px] tracking-[0.45em] text-[#c9a84c] uppercase font-bold">
            ACCREDITED CREDENTIALS
          </span>
        </div>
        <h2 className="kgf-title text-4xl md:text-6xl text-white tracking-wide leading-none m-0">
          CERTIFICATIONS
        </h2>
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto my-4" />
        <p className="font-cinzel text-[10px] md:text-xs text-neutral-400 tracking-[0.25em] uppercase">
          [ CLICK ANYWHERE TO SLASH &amp; REVEAL NEXT CERTIFICATE ]
        </p>
      </div>

      {/* ── Main Stage Area: Certificate Card with Kinetic Impact ── */}
      <div
        className="w-full max-w-4xl relative z-30 flex flex-col items-center"
        style={{
          transform: cameraShake ? 'translate(-4px, 6px) scale(1.02)' : 'none',
          transition: 'transform 0.05s ease-out',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{
              opacity: 0,
              scale: 0.45,
              rotateX: 25,
              rotateY: -15,
              filter: 'brightness(3) blur(10px)',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              filter: 'brightness(1) blur(0px)',
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateX: -20,
              filter: 'brightness(2) blur(8px)',
            }}
            transition={{
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full relative group"
          >
            {/* Speed trail shadow glow */}
            <div
              className="absolute -inset-2 rounded-lg opacity-40 blur-2xl pointer-events-none transition-all duration-700"
              style={{ background: current.accent }}
            />

            {/* The Certificate Frame */}
            <div
              className="relative border-2 bg-[#050508] p-4 md:p-8 overflow-hidden shadow-2xl flex flex-col md:flex-row gap-6 md:gap-8 items-center"
              style={{
                borderColor: `${current.accent}88`,
                boxShadow: `0 0 60px ${current.accent}22, inset 0 0 40px rgba(0,0,0,0.8)`,
              }}
            >
              {/* Film corner marks */}
              <div className="absolute top-2 left-3 font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
                CERT 0{current.id} / 0{CERTIFICATES.length}
              </div>
              <div className="absolute top-2 right-3 font-mono text-[9px] tracking-widest text-[#c9a84c88] uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#c9a84c]" />
                <span>OFFICIAL VERIFIED</span>
              </div>

              {/* Certificate Image Canvas */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  try { audioManager.playClick(); } catch (_) {}
                  setLightboxCert(current);
                }}
                className="w-full md:w-1/2 aspect-[4/3] bg-neutral-950 border border-[#c9a84c33] overflow-hidden relative group/img cursor-pointer shadow-lg shrink-0"
              >
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-contain p-2 group-hover/img:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <div className="px-4 py-2 border border-[#c9a84c] bg-black/90 text-[#c9a84c] font-cinzel text-xs tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>VIEW FULLSCREEN</span>
                  </div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="w-full md:w-1/2 flex flex-col justify-between py-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 font-mono text-[10px] tracking-widest uppercase font-bold border"
                      style={{
                        borderColor: current.accent,
                        color: current.accent,
                        background: `${current.accent}15`,
                      }}
                    >
                      {current.badge}
                    </span>
                  </div>

                  <h3 className="font-bebas text-3xl md:text-4xl text-white tracking-wider m-0 leading-tight">
                    {current.title}
                  </h3>

                  <div className="w-12 h-[1px] bg-[#c9a84c55] my-3" />

                  <p className="font-cinzel text-xs text-[#c9a84c] tracking-widest uppercase font-semibold mb-2">
                    {current.issuer}
                  </p>

                  <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 mb-4">
                    {current.description}
                  </p>

                  <div className="space-y-1.5 font-mono text-[10px] text-neutral-400 border-t border-neutral-800/80 pt-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">VALIDITY / DATE:</span>
                      <span className="text-neutral-200">{current.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 uppercase">CREDENTIAL ID:</span>
                      <span className="text-[#c9a84c]">{current.credentialId}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[#c9a84c20]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      try { audioManager.playClick(); } catch (_) {}
                      setLightboxCert(current);
                    }}
                    className="flex-grow py-2.5 px-4 bg-[#c9a84c] text-black font-cinzel text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-[#b8953c] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>INSPECT FULL CERTIFICATE</span>
                  </button>

                  {current.verifyUrl !== '#' && (
                    <a
                      href={current.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="py-2.5 px-4 border border-[#c9a84c44] hover:border-[#c9a84c] text-neutral-300 hover:text-white font-cinzel text-[10px] tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3 text-[#c9a84c]" />
                      <span>VERIFY</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Interactive Controls Bar ──────────────────────────── */}
        <div className="interactive-control flex flex-wrap items-center justify-between gap-4 w-full mt-8 p-3 border border-[#c9a84c22] bg-black/80 backdrop-blur-md">
          {/* Previous Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#c9a84c44] hover:border-[#c9a84c] text-neutral-300 hover:text-[#c9a84c] font-cinzel text-xs tracking-widest uppercase transition-all cursor-pointer group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>PREVIOUS</span>
          </button>

          {/* Center Indicators and Slash Trigger */}
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {CERTIFICATES.map((c, i) => (
                <button
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    try { audioManager.playClick(); } catch (_) {}
                    triggerBladeReveal(i);
                  }}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    i === currentIdx
                      ? 'bg-[#c9a84c] scale-125 shadow-[0_0_12px_#c9a84c]'
                      : 'bg-neutral-800 hover:bg-neutral-600'
                  }`}
                  title={`View Certificate 0${i + 1}`}
                />
              ))}
            </div>

            {/* Quick Trigger Blade Slash */}
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c9a84c] bg-[#c9a84c18] hover:bg-[#c9a84c30] text-[#c9a84c] font-cinzel text-[10px] tracking-[0.2em] font-bold uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(201,168,76,0.2)]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SLASH BLADE</span>
            </button>

            {/* Play/Pause Auto-Cycle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                try { audioManager.playClick(); } catch (_) {}
                setIsAutoPlaying(p => !p);
              }}
              className="p-1.5 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pause Auto-Cycle' : 'Resume Auto-Cycle'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#c9a84c]" />}
            </button>
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#c9a84c44] hover:border-[#c9a84c] text-neutral-300 hover:text-[#c9a84c] font-cinzel text-xs tracking-widest uppercase transition-all cursor-pointer group"
          >
            <span>NEXT</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* ── FULLSCREEN LIGHTBOX WITH PROMINENT BACK ARROW ─────── */}
      <AnimatePresence>
        {lightboxCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9800] flex items-center justify-center bg-black/98 p-4 md:p-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                try { audioManager.playClick(); } catch (_) {}
                setLightboxCert(null);
              }
            }}
          >
            {/* Top Bar with BACK ARROW and Close */}
            <div className="fixed top-4 left-4 right-4 z-[9900] flex items-center justify-between pointer-events-none">
              {/* Prominent Back Button with Arrow */}
              <button
                onClick={() => {
                  try { audioManager.playClick(); } catch (_) {}
                  setLightboxCert(null);
                }}
                className="pointer-events-auto flex items-center gap-2 px-4 py-2 border border-[#c9a84c] bg-black/90 hover:bg-[#c9a84c20] text-[#c9a84c] transition-all cursor-pointer font-cinzel text-xs tracking-[0.25em] uppercase group shadow-[0_0_20px_rgba(201,168,76,0.35)]"
                title="Back to Certifications (Esc)"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>BACK</span>
                <span className="text-[9px] text-[#c9a84c88] ml-1 font-mono hidden sm:inline">[ESC]</span>
              </button>

              <button
                onClick={() => {
                  try { audioManager.playClick(); } catch (_) {}
                  setLightboxCert(null);
                }}
                className="pointer-events-auto p-2 border border-[#c9a84c33] hover:border-[#c9a84c] bg-black/90 text-neutral-400 hover:text-[#c9a84c] transition-colors cursor-pointer"
                title="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="w-full max-w-5xl max-h-[88vh] flex flex-col border border-[#c9a84c44] bg-[#07070a] shadow-[0_0_100px_rgba(201,168,76,0.2)] overflow-hidden relative"
            >
              {/* Full Image */}
              <div className="relative flex-grow flex items-center justify-center bg-black min-h-[50vh] max-h-[72vh] overflow-hidden p-4">
                <img
                  src={lightboxCert.image}
                  alt={lightboxCert.title}
                  className="w-full h-full object-contain filter contrast-[1.05]"
                />
              </div>

              {/* Lightbox Footer with Info & Return */}
              <div className="p-6 bg-[#050507] border-t border-[#c9a84c20] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-cinzel text-[9px] tracking-[0.4em] text-[#c9a84c] uppercase font-bold">
                      {lightboxCert.badge}
                    </span>
                    <span className="text-neutral-500 text-xs font-mono">{lightboxCert.credentialId}</span>
                  </div>
                  <h3 className="font-bebas text-2xl text-white tracking-wider mt-1 m-0">
                    {lightboxCert.title}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-1 m-0">{lightboxCert.issuer} · {lightboxCert.date}</p>
                </div>

                <button
                  onClick={() => {
                    try { audioManager.playClick(); } catch (_) {}
                    setLightboxCert(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#c9a84c] text-black hover:bg-[#b8953c] font-cinzel text-xs tracking-[0.25em] font-bold uppercase transition-all cursor-pointer shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK TO CERTIFICATIONS</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
