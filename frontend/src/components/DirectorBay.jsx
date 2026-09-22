import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  X,
  Play,
  Pause,
  Copy,
  Check,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Film,
  Sparkles,
  Globe,
  Car,
  Code
} from 'lucide-react';
import audioManager from '../utils/audio';

/* ── Full Cinematic Credit Data ────────────────────────────────── */
const CREDITS = [
  { type: 'spacer' },
  { type: 'spacer' },
  { type: 'studio',   text: 'HARSH SHROTI PRODUCTIONS' },
  { type: 'presents', text: 'PRESENTS' },
  { type: 'spacer' },

  { type: 'title',    text: 'THE DIRECTOR' },
  { type: 'spacer' },

  { type: 'label',    text: 'NAME' },
  { type: 'value',    text: 'HARSH SHROTI' },
  { type: 'spacer' },

  { type: 'label',    text: 'COURSE / SPECIALIZATION' },
  { type: 'value',    text: 'BBA ARTIFICIAL INTELLIGENCE AND DATA ANALYST' },
  { type: 'spacer' },

  { type: 'label',    text: 'COLLEGE / INSTITUTION' },
  { type: 'value',    text: 'GEETA UNIVERISITY' },
  { type: 'spacer' },

  { type: 'label',    text: 'CONTACT NUMBER' },
  { type: 'value',    text: '9119797696' },
  { type: 'spacer' },

  { type: 'label',    text: 'DIRECT INQUIRIES & EMAIL' },
  { type: 'value',    text: 'Harshshroti9676@gmail.com' },
  { type: 'spacer' },

  { type: 'divider' },
  { type: 'spacer' },

  { type: 'section',  text: '— MASTERED SKILLS & ARSENAL —' },
  { type: 'spacer' },
  {
    type: 'skills_grid',
    skills: [
      'editing',
      'prompt enginnering',
      'website development',
      'Data Analysing',
      'data Visualization',
      'Marketing Strategist',
      'Digital Marketing'
    ]
  },
  { type: 'spacer' },

  { type: 'divider' },
  { type: 'spacer' },

  { type: 'section',  text: '— SPOKEN LANGUAGES —' },
  { type: 'spacer' },
  { type: 'label',    text: 'FLUENT IN' },
  { type: 'value',    text: 'HINDI, ENGLISH' },
  { type: 'spacer' },

  { type: 'divider' },
  { type: 'spacer' },

  { type: 'section',  text: '— OFF-SCREEN PASSION —' },
  { type: 'spacer' },
  { type: 'label',    text: 'HOBBIES' },
  { type: 'value',    text: 'CARS & BIKES ENTHUASIST' },
  { type: 'spacer' },

  { type: 'divider' },
  { type: 'spacer' },

  { type: 'section',  text: '— AMBITION —' },
  { type: 'spacer' },
  { type: 'label',    text: 'DREAM TO BE' },
  { type: 'dream',    text: '"A MAN WHO OWNS EVERYTHING"' },
  { type: 'spacer' },

  { type: 'divider' },
  { type: 'spacer' },

  { type: 'section',  text: '— THE POST-CREDIT SCENE —' },
  { type: 'spacer' },
];

export default function DirectorBay({ onClose }) {
  const audioRef     = useRef(null);
  const rafRef       = useRef(null);
  const scrollRef    = useRef(null);
  const postCreditRef = useRef(null);
  const posYRef      = useRef(0);

  const [isPaused, setIsPaused] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState('crawl'); // 'crawl' | 'postcredit'

  /* ── Background cinematic audio ────────────────────────────── */
  useEffect(() => {
    try {
      audioRef.current = new Audio('/raga_of_revenge.mp3');
      audioRef.current.loop   = true;
      audioRef.current.volume = 0.42;
      audioRef.current.play().catch(() => {});
    } catch (_) {}

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Close with sound & cleanup ────────────────────────────── */
  const handleClose = useCallback(() => {
    try { audioManager.playClick(); } catch (_) {}
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    onClose();
  }, [onClose]);

  /* ── Keyboard shortcut: Escape to close ─────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        setIsPaused(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  /* ── Auto-scroll loop with pause and user sync ───────────────── */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || activeTab === 'postcredit') return;

    const tick = () => {
      if (!isPaused && el) {
        posYRef.current += 1.6; // smooth cinematic crawl speed
        el.scrollTop = posYRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const startTimer = setTimeout(() => {
      if (el) posYRef.current = el.scrollTop;
      rafRef.current = requestAnimationFrame(tick);
    }, 350);

    return () => {
      clearTimeout(startTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPaused, activeTab]);

  /* ── Sync manual scroll with auto-scroll position ──────────── */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      posYRef.current = el.scrollTop;
    }
  };

  /* ── Copy helper ───────────────────────────────────────────── */
  const copyToClipboard = (text, key) => {
    try { audioManager.playClick(); } catch (_) {}
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  /* ── Jump directly to Post-Credit Scene ─────────────────────── */
  const jumpToPostCredits = () => {
    try { audioManager.playClick(); } catch (_) {}
    setActiveTab('postcredit');
    setIsPaused(true);
    if (postCreditRef.current) {
      postCreditRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jumpToCrawl = () => {
    try { audioManager.playClick(); } catch (_) {}
    setActiveTab('crawl');
    setIsPaused(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      posYRef.current = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-0 z-[2000] bg-black overflow-hidden select-none"
    >
      {/* ── Film grain overlay ─────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/></svg>")',
          opacity: 0.05,
        }}
      />

      {/* ── Top & Bottom Cinema Fades ─────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-[18vh] bg-gradient-to-b from-black via-black/80 to-transparent z-[15] pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-[22vh] bg-gradient-to-t from-black via-black/85 to-transparent z-[15] pointer-events-none" />

      {/* ── Top HUD Control Bar ───────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-8 py-4 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/90 to-transparent backdrop-blur-[2px]">
        {/* BACK BUTTON WITH ARROW */}
        <button
          onClick={handleClose}
          id="editor-bay-back-btn"
          className="flex items-center gap-2.5 px-3.5 md:px-5 py-2 border border-[#c9a84c] bg-black/90 text-[#c9a84c] hover:bg-[#c9a84c1a] hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all cursor-pointer font-cinzel text-xs tracking-[0.25em] uppercase group"
          title="Return to portfolio (Esc)"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK</span>
          <span className="hidden sm:inline text-[9px] text-[#c9a84c88] ml-1 font-mono">[ESC]</span>
        </button>

        {/* CENTER VIEW CONTROLS */}
        <div className="flex items-center gap-2 bg-black/80 border border-[#c9a84c2a] p-1">
          <button
            onClick={jumpToCrawl}
            className={`px-3 py-1 font-cinzel text-[10px] tracking-[0.2em] uppercase transition-all cursor-pointer ${
              activeTab === 'crawl'
                ? 'bg-[#c9a84c] text-black font-bold shadow-[0_0_12px_rgba(201,168,76,0.4)]'
                : 'text-neutral-400 hover:text-[#c9a84c]'
            }`}
          >
            CREDITS ROLL
          </button>
          <button
            onClick={jumpToPostCredits}
            className={`px-3 py-1 font-cinzel text-[10px] tracking-[0.2em] uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'postcredit'
                ? 'bg-[#c9a84c] text-black font-bold shadow-[0_0_12px_rgba(201,168,76,0.4)]'
                : 'text-neutral-400 hover:text-[#c9a84c]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>POST-CREDIT SCENE</span>
          </button>
        </div>

        {/* RIGHT CONTROLS: PAUSE & CLOSE */}
        <div className="flex items-center gap-2">
          {activeTab === 'crawl' && (
            <button
              onClick={() => {
                try { audioManager.playClick(); } catch (_) {}
                setIsPaused(p => !p);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#c9a84c33] bg-black/80 text-neutral-400 hover:text-[#c9a84c] hover:border-[#c9a84c] font-mono text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
              title="Toggle auto-scroll [Space]"
            >
              {isPaused ? <Play className="w-3 h-3 text-[#c9a84c]" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
            </button>
          )}

          <button
            onClick={handleClose}
            className="p-2 border border-[#c9a84c33] hover:border-[#c9a84c] bg-black/80 text-neutral-400 hover:text-[#c9a84c] transition-colors cursor-pointer"
            title="Close Editor Bay"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main Scroll Viewport ──────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-scroll overflow-x-hidden no-scrollbar cursor-default"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Breathing space before the crawl starts */}
        <div className="h-[75vh]" />

        {/* ── THE CRAWL LIST ─────────────────────────────────── */}
        <div className="flex flex-col items-center w-full px-6 max-w-3xl mx-auto box-border text-center">
          {CREDITS.map((item, i) => {
            if (item.type === 'spacer') {
              return <div key={i} className="h-8" />;
            }

            if (item.type === 'divider') {
              return (
                <div
                  key={i}
                  className="w-24 h-[1px] my-3"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #c9a84c77, transparent)',
                  }}
                />
              );
            }

            if (item.type === 'studio') {
              return (
                <p
                  key={i}
                  className="font-cinzel text-sm md:text-base tracking-[0.45em] text-[#c9a84c] uppercase m-0 leading-relaxed font-bold"
                >
                  {item.text}
                </p>
              );
            }

            if (item.type === 'presents') {
              return (
                <p
                  key={i}
                  className="font-cinzel text-[10px] tracking-[0.65em] text-white/40 uppercase m-0 mt-2"
                >
                  {item.text}
                </p>
              );
            }

            if (item.type === 'title') {
              return (
                <h1
                  key={i}
                  className="font-bebas text-6xl md:text-8xl lg:text-9xl text-white tracking-[0.12em] m-0 leading-none"
                  style={{ textShadow: '0 0 80px rgba(201,168,76,0.5)' }}
                >
                  {item.text}
                </h1>
              );
            }

            if (item.type === 'section') {
              return (
                <p
                  key={i}
                  className="font-cinzel text-xs md:text-sm tracking-[0.45em] text-[#c9a84caa] uppercase m-0 font-semibold"
                >
                  {item.text}
                </p>
              );
            }

            if (item.type === 'label') {
              return (
                <p
                  key={i}
                  className="font-cinzel text-[10px] md:text-xs tracking-[0.55em] text-[#c9a84c88] uppercase mb-1.5"
                >
                  {item.text}
                </p>
              );
            }

            if (item.type === 'value') {
              return (
                <p
                  key={i}
                  className="font-bebas text-2xl md:text-4xl text-[#f3ebd7] tracking-[0.14em] m-0 leading-tight"
                >
                  {item.text}
                </p>
              );
            }

            if (item.type === 'skills_grid') {
              return (
                <div key={i} className="flex flex-wrap justify-center gap-2.5 max-w-xl my-2">
                  {item.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3.5 py-1.5 border border-[#c9a84c35] bg-black/60 text-[#c9a84c] font-mono text-xs tracking-wider uppercase hover:border-[#c9a84c] transition-colors"
                      style={{ boxShadow: '0 0 15px rgba(201,168,76,0.06)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              );
            }

            if (item.type === 'dream') {
              return (
                <p
                  key={i}
                  className="font-cinzel text-xl md:text-2xl italic text-white tracking-wide m-0 max-w-lg leading-relaxed"
                  style={{ textShadow: '0 0 50px rgba(201,168,76,0.45)' }}
                >
                  {item.text}
                </p>
              );
            }

            return null;
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════
            THE MOVIE POST-CREDIT SCENE // DOSSIER SECTION
        ═══════════════════════════════════════════════════════ */}
        <div ref={postCreditRef} className="w-full px-4 md:px-8 py-20 relative z-20">
          <div className="max-w-4xl mx-auto">
            
            {/* Clapper header banner */}
            <div className="border border-[#c9a84c44] bg-black/95 p-6 md:p-10 relative overflow-hidden shadow-[0_0_80px_rgba(201,168,76,0.12)]">
              {/* Corner film markers */}
              <div className="absolute top-2 left-2 text-[#c9a84c44] font-mono text-[9px] tracking-widest uppercase">
                SCENE: POST-CREDIT // TAKE: 01
              </div>
              <div className="absolute top-2 right-2 text-[#c9a84c44] font-mono text-[9px] tracking-widest uppercase">
                CLASSIFIED PERSONNEL DOSSIER
              </div>

              {/* Glowing film seal */}
              <div className="flex flex-col items-center text-center mt-4 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#c9a84c66] bg-[#c9a84c10] mb-3">
                  <Film className="w-3.5 h-3.5 text-[#c9a84c]" />
                  <span className="font-cinzel text-[10px] tracking-[0.35em] text-[#c9a84c] uppercase font-bold">
                    OFFICIAL MOVIE POST-CREDIT
                  </span>
                </div>
                <h2 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-white tracking-[0.1em] m-0 leading-none">
                  HARSH SHROTI
                </h2>
                <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent my-4" />
                <p className="font-cinzel text-xs md:text-sm text-neutral-400 tracking-[0.2em] italic max-w-xl">
                  "Data Analyst by choice. Editor by passion. Creator by the dream."
                </p>
              </div>

              {/* Data Grid: Name, Course, College, Contact, Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-8">
                
                {/* Name */}
                <div className="border border-[#c9a84c22] bg-[#07070a] p-4 flex flex-col justify-between group hover:border-[#c9a84c66] transition-colors">
                  <span className="font-cinzel text-[9px] tracking-[0.35em] text-[#c9a84c88] uppercase block mb-1">
                    FULL NAME
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bebas text-2xl text-white tracking-wider">
                      Harsh Shroti
                    </span>
                    <button
                      onClick={() => copyToClipboard('Harsh Shroti', 'name')}
                      className="p-1.5 text-neutral-500 hover:text-[#c9a84c] transition-colors cursor-pointer"
                      title="Copy Name"
                    >
                      {copiedKey === 'name' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Course */}
                <div className="border border-[#c9a84c22] bg-[#07070a] p-4 flex flex-col justify-between group hover:border-[#c9a84c66] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span className="font-cinzel text-[9px] tracking-[0.35em] text-[#c9a84c88] uppercase">
                      COURSE & DEGREE
                    </span>
                  </div>
                  <span className="font-oswald text-base text-[#f3ebd7] uppercase tracking-wide font-medium">
                    BBA Artificial Intelligence and Data Analyst
                  </span>
                </div>

                {/* College */}
                <div className="border border-[#c9a84c22] bg-[#07070a] p-4 flex flex-col justify-between group hover:border-[#c9a84c66] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span className="font-cinzel text-[9px] tracking-[0.35em] text-[#c9a84c88] uppercase">
                      COLLEGE / UNIVERSITY
                    </span>
                  </div>
                  <span className="font-bebas text-2xl text-white tracking-wider">
                    Geeta Univerisity
                  </span>
                </div>

                {/* Contact Number */}
                <div className="border border-[#c9a84c22] bg-[#07070a] p-4 flex flex-col justify-between group hover:border-[#c9a84c66] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span className="font-cinzel text-[9px] tracking-[0.35em] text-[#c9a84c88] uppercase">
                      CONTACT NUMBER
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <a
                      href="tel:9119797696"
                      className="font-mono text-lg text-[#c9a84c] hover:underline tracking-wider"
                    >
                      +91 9119797696
                    </a>
                    <button
                      onClick={() => copyToClipboard('9119797696', 'phone')}
                      className="flex items-center gap-1 px-2 py-1 border border-[#c9a84c33] text-[9px] font-mono text-neutral-400 hover:text-[#c9a84c] transition-colors cursor-pointer"
                    >
                      {copiedKey === 'phone' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'phone' ? 'COPIED' : 'COPY'}</span>
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="border border-[#c9a84c22] bg-[#07070a] p-4 md:col-span-2 flex flex-col justify-between group hover:border-[#c9a84c66] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span className="font-cinzel text-[9px] tracking-[0.35em] text-[#c9a84c88] uppercase">
                      DIRECT EMAIL
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a
                      href="mailto:Harshshroti9676@gmail.com"
                      className="font-mono text-sm md:text-base text-neutral-200 hover:text-[#c9a84c] transition-colors break-all"
                    >
                      Harshshroti9676@gmail.com
                    </a>
                    <button
                      onClick={() => copyToClipboard('Harshshroti9676@gmail.com', 'email')}
                      className="flex items-center gap-1 px-2.5 py-1 border border-[#c9a84c33] text-[9px] font-mono text-neutral-400 hover:text-[#c9a84c] transition-colors cursor-pointer"
                    >
                      {copiedKey === 'email' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'email' ? 'COPIED' : 'COPY EMAIL'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills Arsenal */}
              <div className="my-8 border-t border-[#c9a84c22] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#c9a84c]" />
                    <span className="font-cinzel text-xs tracking-[0.35em] text-[#c9a84c] uppercase font-bold">
                      SKILLS &amp; CAPABILITIES
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-neutral-500 uppercase">
                    7 Production Disciplines
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {[
                    'editing',
                    'prompt enginnering',
                    'website development',
                    'Data Analysing',
                    'data Visualization',
                    'Marketing Strategist',
                    'Digital Marketing'
                  ].map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3.5 py-2 border border-[#c9a84c3a] bg-black/70 hover:border-[#c9a84c] hover:bg-[#c9a84c12] transition-all group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] group-hover:scale-125 transition-transform" />
                      <span className="font-mono text-xs tracking-wider text-neutral-200 group-hover:text-white uppercase font-medium">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Hobbies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#c9a84c22] pt-6">
                {/* Languages */}
                <div className="border border-[#c9a84c18] bg-[#07070a] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span className="font-cinzel text-[9px] tracking-[0.35em] text-[#c9a84c88] uppercase">
                      LANGUAGE
                    </span>
                  </div>
                  <p className="font-bebas text-2xl text-white tracking-wider m-0">
                    Hindi, English
                  </p>
                </div>

                {/* Hobbies */}
                <div className="border border-[#c9a84c18] bg-[#07070a] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-3.5 h-3.5 text-[#c9a84c]" />
                    <span className="font-cinzel text-[9px] tracking-[0.35em] text-[#c9a84c88] uppercase">
                      HOBBIES
                    </span>
                  </div>
                  <p className="font-bebas text-2xl text-[#c9a84c] tracking-wider m-0">
                    Cars &amp; Bikes Enthuasist
                  </p>
                </div>
              </div>

              {/* Action Buttons in Post-Credit */}
              <div className="mt-10 pt-6 border-t border-[#c9a84c25] flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Prominent Back Button with Arrow */}
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-[#c9a84c] text-black font-cinzel text-xs tracking-[0.3em] font-bold uppercase hover:bg-[#b5943d] transition-all cursor-pointer shadow-[0_0_30px_rgba(201,168,76,0.35)] group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>BACK TO PORTFOLIO</span>
                </button>

                {/* Copy All Details Button */}
                <button
                  onClick={() => {
                    const fullDossier = [
                      'Name: Harsh Shroti',
                      'Course: BBA Artificial Intelligence and Data Analyst',
                      'College: Geeta Univerisity',
                      'Contact number: 9119797696',
                      'email: Harshshroti9676@gmail.com',
                      'Skills: editing, prompt enginnering, website development, Data Analysing, data Visualization, Marketing Strategist, Digital Marketing',
                      'Language: Hindi, English',
                      'Hobbies: Cars & Bikes Enthuasist'
                    ].join('\n');
                    copyToClipboard(fullDossier, 'all');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 border border-[#c9a84c66] hover:border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c15] font-cinzel text-xs tracking-[0.2em] uppercase transition-all cursor-pointer"
                >
                  {copiedKey === 'all' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'all' ? 'DOSSIER COPIED' : 'COPY DOSSIER'}</span>
                </button>
              </div>

              {/* Footer Stamp */}
              <div className="mt-8 text-center text-neutral-600 font-mono text-[9px] tracking-[0.4em] uppercase">
                © 2026 HARSH PRODUCTIONS · ALL CREDITS RECORDED
              </div>
            </div>

          </div>
        </div>

        {/* Extra bottom spacing so users can scroll past the bottom cleanly */}
        <div className="h-[25vh]" />
      </div>
    </motion.div>
  );
}
