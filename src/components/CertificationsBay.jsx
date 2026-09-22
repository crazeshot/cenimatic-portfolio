import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  Zap,
  Sparkles,
  Maximize2
} from 'lucide-react';
import audioManager from '../utils/audio';

/* ── Certificate Data with Corner Coordinates & Details ────────── */
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
    corner1Label: 'CORNER 1 // IBM & COGNITIVE CLASS CREDENTIAL HEADER',
    corner2Label: 'CORNER 2 // AUTHENTICITY QR CODE & VERIFICATION HASH',
    // Camera zoom origins
    corner1Origin: { x: '24%', y: '22%' }, // Top-left logo/seal
    corner2Origin: { x: '78%', y: '80%' }, // Bottom-right verification & QR
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
    corner1Label: 'CORNER 1 // GEETA UNIVERSITY OFFICIAL SEAL & CREST',
    corner2Label: 'CORNER 2 // VICE CHANCELLOR SIGNATURE & ASSESSMENT ID',
    // Camera zoom origins
    corner1Origin: { x: '22%', y: '20%' }, // Top-left crest & header
    corner2Origin: { x: '76%', y: '82%' }, // Bottom-right signature
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
    badge: 'Industry Accredited Examination',
    corner1Label: 'CORNER 1 // SEMRUSH ACADEMY HONORS & RECIPIENT TITLE',
    corner2Label: 'CORNER 2 // EXECUTIVE SIGNATURES & ACCREDITATION BADGE',
    // Camera zoom origins
    corner1Origin: { x: '26%', y: '24%' }, // Top-left honors
    corner2Origin: { x: '82%', y: '78%' }, // Bottom-right signatures
    description: 'Awarded for proficiency in AI-driven search ecosystem mechanics, semantic search intelligence, algorithmic ranking factors, and modern digital visibility strategy.',
    verifyUrl: '#',
  },
];

export default function CertificationsBay({ onClose, initialIndex = 0 }) {
  const [currentIdx, setCurrentIdx] = useState(initialIndex);
  // 'lightning' -> 'corner1' -> 'corner2' -> 'full'
  const [zoomPhase, setZoomPhase] = useState('lightning');
  const [isPaused, setIsPaused] = useState(false);
  const [sheenKey, setSheenKey] = useState(0);

  const audioRef = useRef(null);
  const stepTimerRef = useRef(null);
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  /* ── Background music (metallic cinematic atmosphere) ──────── */
  useEffect(() => {
    try {
      audioRef.current = new Audio('/raga_of_revenge.mp3');
      audioRef.current.loop   = true;
      audioRef.current.volume = 0.35;
      audioRef.current.play().catch(() => {});
    } catch (_) {}

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, []);

  /* ── Close handler ─────────────────────────────────────────── */
  const handleClose = useCallback(() => {
    try { audioManager.playClick(); } catch (_) {}
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    onClose();
  }, [onClose]);

  /* ── ESC key to close ──────────────────────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  /* ── Corner-to-Corner Metallic Zoom Choreography ───────────── */
  const runCinematicZoomTour = useCallback((targetIndex) => {
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);

    setCurrentIdx(targetIndex);

    // 1. Initial Lightning Strike & thunder
    setZoomPhase('lightning');
    try { audioManager.playLightning(); } catch (_) {}

    // 2. Zoom into Corner 1 (Top-Left Seal) after 300ms
    stepTimerRef.current = setTimeout(() => {
      setZoomPhase('corner1');
      try { audioManager.playSwordSlash(); } catch (_) {}

      // 3. Pan Diagonally to Corner 2 (Bottom-Right Signature) after 1600ms
      stepTimerRef.current = setTimeout(() => {
        setZoomPhase('corner2');
        try { audioManager.playSwordSlash(); } catch (_) {}

        // 4. Zoom out to Full Certificate with metallic sheen & bass impact after 1800ms
        stepTimerRef.current = setTimeout(() => {
          setZoomPhase('full');
          setSheenKey(k => k + 1);
          try { audioManager.playImpact(); } catch (_) {}

          // 5. Hold full view for viewers, then advance to next certificate
          stepTimerRef.current = setTimeout(() => {
            if (!isPausedRef.current) {
              const next = (targetIndex + 1) % CERTIFICATES.length;
              runCinematicZoomTour(next);
            }
          }, 4200);
        }, 1800);
      }, 1600);
    }, 300);
  }, []);

  // Run on mount
  useEffect(() => {
    runCinematicZoomTour(initialIndex);
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [runCinematicZoomTour, initialIndex]);

  /* ── Next / Previous Navigation ────────────────────────────── */
  const handleNext = () => {
    try { audioManager.playClick(); } catch (_) {}
    const next = (currentIdx + 1) % CERTIFICATES.length;
    runCinematicZoomTour(next);
  };

  const handlePrev = () => {
    try { audioManager.playClick(); } catch (_) {}
    const prev = (currentIdx - 1 + CERTIFICATES.length) % CERTIFICATES.length;
    runCinematicZoomTour(prev);
  };

  const current = CERTIFICATES[currentIdx];

  // Camera transform calculations based on phase
  let cameraScale = 1.0;
  let cameraOrigin = '50% 50%';

  if (zoomPhase === 'corner1') {
    cameraScale = 2.75;
    cameraOrigin = `${current.corner1Origin.x} ${current.corner1Origin.y}`;
  } else if (zoomPhase === 'corner2') {
    cameraScale = 2.75;
    cameraOrigin = `${current.corner2Origin.x} ${current.corner2Origin.y}`;
  } else if (zoomPhase === 'full') {
    cameraScale = 1.0;
    cameraOrigin = '50% 50%';
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[2500] bg-black overflow-hidden select-none"
    >
      {/* ── Film grain & dark metallic vignette ─────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/></filter><rect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/></svg>")',
          opacity: 0.045,
        }}
      />
      <div className="fixed inset-0 pointer-events-none z-[6] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.92)_100%)]" />

      {/* ── Lightning Strike Overlay ───────────────────────────── */}
      <AnimatePresence>
        {zoomPhase === 'lightning' && (
          <div className="fixed inset-0 z-[120] pointer-events-none">
            <motion.div
              initial={{ opacity: 0.95 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-white mix-blend-screen"
            />
            <svg className="w-full h-full absolute inset-0 stroke-cyan-200 fill-none filter drop-shadow-[0_0_25px_#00d2ff]" viewBox="0 0 1000 1000">
              <path d="M 500 0 L 480 220 L 540 250 L 460 480 L 520 510 L 440 780 L 500 810 L 480 1000" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 540 250 L 630 310 L 600 370 L 690 450" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </AnimatePresence>

      {/* ── TOP HUD HEADER WITH PROMINENT BACK ARROW ───────────── */}
      <header className="fixed top-0 left-0 right-0 z-[200] px-4 md:px-8 py-4 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black via-black/85 to-transparent backdrop-blur-[2px]">
        {/* PROMINENT BACK BUTTON WITH ARROW */}
        <button
          onClick={handleClose}
          id="cert-bay-back-btn"
          className="flex items-center gap-2.5 px-4 md:px-6 py-2 border border-[#c9a84c] bg-black/90 text-[#c9a84c] hover:bg-[#c9a84c1a] hover:shadow-[0_0_20px_rgba(201,168,76,0.35)] transition-all cursor-pointer font-cinzel text-xs tracking-[0.25em] uppercase group"
          title="Return to portfolio (Esc)"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>BACK</span>
          <span className="hidden sm:inline text-[9px] text-[#c9a84c88] ml-1 font-mono">[ESC]</span>
        </button>

        {/* CENTER STEPPER TABS */}
        <div className="hidden md:flex items-center gap-2 bg-black/80 border border-[#c9a84c2a] p-1">
          {CERTIFICATES.map((cert, idx) => {
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={cert.id}
                onClick={() => {
                  try { audioManager.playClick(); } catch (_) {}
                  runCinematicZoomTour(idx);
                }}
                className={`px-3 py-1 font-cinzel text-[10px] tracking-[0.2em] uppercase transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#c9a84c] text-black font-bold shadow-[0_0_12px_rgba(201,168,76,0.4)]'
                    : 'text-neutral-400 hover:text-[#c9a84c]'
                }`}
              >
                0{cert.id}. {cert.title.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* RIGHT CONTROLS: REPLAY, PAUSE, CLOSE */}
        <div className="flex items-center gap-2">
          {/* Replay Zoom Tour */}
          <button
            onClick={() => {
              try { audioManager.playClick(); } catch (_) {}
              runCinematicZoomTour(currentIdx);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#c9a84c33] bg-black/80 text-neutral-300 hover:text-[#c9a84c] hover:border-[#c9a84c] font-cinzel text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
            title="Replay cinematic corner-to-corner zoom tour"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#c9a84c]" />
            <span className="hidden sm:inline">REPLAY ZOOM</span>
          </button>

          {/* Pause / Play */}
          <button
            onClick={() => {
              try { audioManager.playClick(); } catch (_) {}
              setIsPaused(p => !p);
            }}
            className="p-2 border border-[#c9a84c33] hover:border-[#c9a84c] bg-black/80 text-neutral-400 hover:text-[#c9a84c] transition-colors cursor-pointer"
            title={isPaused ? 'Resume tour (Space)' : 'Pause tour (Space)'}
          >
            {isPaused ? <Play className="w-4 h-4 text-[#c9a84c]" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            className="p-2 border border-[#c9a84c33] hover:border-[#c9a84c] bg-black/80 text-neutral-400 hover:text-[#c9a84c] transition-colors cursor-pointer"
            title="Close Certifications Bay"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── THE METALLIC CINEMATIC STAGE ───────────────────────── */}
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-12 pt-16 pb-20">
        
        {/* Dynamic Phase HUD Indicator */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#c9a84c44] bg-black/70 mb-2">
            <Zap className="w-3.5 h-3.5 text-[#c9a84c] animate-pulse" />
            <span className="font-cinzel text-[10px] tracking-[0.35em] text-[#c9a84c] uppercase font-bold">
              {zoomPhase === 'corner1'
                ? current.corner1Label
                : zoomPhase === 'corner2'
                ? current.corner2Label
                : 'METALLIC CINEMATIC EDITION // FULL CERTIFICATE SHOWN'}
            </span>
          </div>

          <p className="font-mono text-[9px] tracking-[0.4em] text-neutral-500 uppercase">
            CERTIFICATE {currentIdx + 1} OF {CERTIFICATES.length} · {current.issuer}
          </p>
        </div>

        {/* ── METALLIC BEVELED CHASSIS WITH SPEED TRAILS & CAMERA PAN ── */}
        <div className="relative w-full max-w-4xl aspect-[16/10] md:aspect-[16/9] max-h-[62vh] overflow-hidden rounded-sm border-2 shadow-2xl flex items-center justify-center bg-neutral-950"
          style={{
            borderColor: `${current.accent}aa`,
            boxShadow: `0 0 60px ${current.accent}33, inset 0 0 40px rgba(0,0,0,0.85)`,
          }}
        >
          {/* Metallic brushed border overlay */}
          <div className="absolute inset-0 pointer-events-none z-30 border border-white/20" />

          {/* Speed blur lines active during corner sweeps */}
          {(zoomPhase === 'corner1' || zoomPhase === 'corner2') && (
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-60">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: '-100%' }}
                  animate={{ x: '120%' }}
                  transition={{ duration: 0.35, delay: i * 0.02, repeat: Infinity, ease: 'linear' }}
                  className="h-[2px] w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${current.accent}, #fff, transparent)`,
                    transform: `translateY(${i * 24}px) rotate(-14deg)`,
                  }}
                />
              ))}
            </div>
          )}

          {/* ── THE ZOOMING CERTIFICATE CONTAINER ──────────────── */}
          <div
            className="w-full h-full relative overflow-hidden flex items-center justify-center p-3 md:p-6"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              animate={{
                scale: cameraScale,
                transformOrigin: cameraOrigin,
              }}
              transition={{
                duration: zoomPhase === 'corner2' ? 1.6 : zoomPhase === 'full' ? 1.2 : 1.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full h-full relative flex items-center justify-center"
            >
              <img
                src={current.image}
                alt={current.title}
                className="max-w-full max-h-full object-contain filter contrast-[1.08] brightness-[0.98] drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]"
              />

              {/* ── METALLIC SHEEN SWEEP (Passes across when full certificate is shown) ── */}
              {zoomPhase === 'full' && (
                <motion.div
                  key={sheenKey}
                  initial={{ x: '-150%' }}
                  animate={{ x: '150%' }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 pointer-events-none mix-blend-color-dodge z-10"
                  style={{
                    background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.7) 48%, #ffffff 50%, rgba(201,168,76,0.8) 52%, transparent 75%)',
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Corner Chrome Bolts */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/40 shadow-[0_0_6px_#fff]" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/40 shadow-[0_0_6px_#fff]" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-white/40 shadow-[0_0_6px_#fff]" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/40 shadow-[0_0_6px_#fff]" />
        </div>

        {/* ── CERTIFICATE INTEL FOOTER ─────────────────────────── */}
        <div className="w-full max-w-4xl mt-4 p-4 border border-[#c9a84c22] bg-[#07070a]/90 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c9a84c]" />
              <span className="font-mono text-[9px] tracking-widest text-[#c9a84c] uppercase font-bold">
                {current.badge}
              </span>
              <span className="text-neutral-600 text-xs">·</span>
              <span className="font-mono text-[9px] text-neutral-400">{current.credentialId}</span>
            </div>
            <h3 className="font-bebas text-2xl text-white tracking-wider m-0 leading-tight">
              {current.title}
            </h3>
            <p className="text-neutral-400 text-xs mt-0.5 m-0 leading-relaxed font-sans max-w-xl">
              {current.description}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <button
              onClick={handlePrev}
              className="p-2.5 border border-[#c9a84c33] hover:border-[#c9a84c] text-neutral-300 hover:text-[#c9a84c] transition-colors cursor-pointer"
              title="Previous certificate"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => runCinematicZoomTour(currentIdx)}
              className="px-3.5 py-2 border border-[#c9a84c] bg-[#c9a84c18] hover:bg-[#c9a84c30] text-[#c9a84c] font-cinzel text-[10px] tracking-widest font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
              title="Re-run corner zoom"
            >
              <Zap className="w-3 h-3" />
              <span>ZOOM CORNERS</span>
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 border border-[#c9a84c33] hover:border-[#c9a84c] text-neutral-300 hover:text-[#c9a84c] transition-colors cursor-pointer"
              title="Next certificate"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Back to portfolio direct link */}
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-[#c9a84c] text-black font-cinzel text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-[#b8953c] transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(201,168,76,0.3)] ml-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
