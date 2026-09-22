import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../utils/audio';

// ─────────────────────────────────────────────────────────────────────────────
// Scene definitions — beat-synced, auto-cycling
// Sequence: AN EDITOR (tagline) → editing image → AN ANALYST (tagline) →
//           data image → AN STUDENT (tagline) → student image → loop
// ─────────────────────────────────────────────────────────────────────────────
const getDynamicScenes = (customImages) => [
  {
    id: 0,
    type: 'tagline',
    word: 'AN EDITOR.',
    sub: 'NOT A JOB — A CALLING',
    color: '#c0392b',
    glow: 'rgba(192,57,43,0.9)',
    bg: 'rgba(192,57,43,0.14)',
    theme: 'red',
    duration: 1100,
  },
  {
    id: 1,
    type: 'image',
    src: customImages.timeline,
    alt: 'Editing Timeline',
    label: 'THE EDIT BAY',
    accent: '#c0392b',
    duration: 1400,
  },
  {
    id: 2,
    type: 'tagline',
    word: 'AN ANALYST.',
    sub: 'DECODING THE WORLD',
    color: '#1a6fff',
    glow: 'rgba(26,111,255,0.9)',
    bg: 'rgba(26,111,255,0.13)',
    theme: 'blue',
    duration: 1100,
  },
  {
    id: 3,
    type: 'image',
    src: customImages.dataAnalysis,
    alt: 'Data Analysing',
    label: 'DATA DOMAIN',
    accent: '#1a6fff',
    duration: 1400,
  },
  {
    id: 4,
    type: 'tagline',
    word: 'AN STUDENT.',
    sub: 'BACHELOR BY CHOICE',
    color: '#c9a84c',
    glow: 'rgba(201,168,76,0.9)',
    bg: 'rgba(201,168,76,0.12)',
    theme: 'gold',
    duration: 1100,
  },
  {
    id: 5,
    type: 'image',
    src: customImages.student,
    alt: 'Harsh — Student',
    label: 'THE DIRECTOR',
    accent: '#c9a84c',
    duration: 1400,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tagline Scene
// ─────────────────────────────────────────────────────────────────────────────
function TaglineScene({ scene }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${scene.bg} 0%, transparent 65%)`,
          animation: 'pulseGlow 1.8s ease-in-out infinite',
        }}
      />

      {/* Blue grid — only for analyst */}
      {scene.theme === 'blue' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(${scene.bg} 1px, transparent 1px),
              linear-gradient(90deg, ${scene.bg} 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px',
            animation: 'gridSlide 4s linear infinite',
          }}
        />
      )}

      {/* Red film strip lines — for editor */}
      {scene.theme === 'red' && (
        <>
          <div className="absolute top-[22%] inset-x-0 h-[1px]" style={{ background: `${scene.color}22` }} />
          <div className="absolute bottom-[22%] inset-x-0 h-[1px]" style={{ background: `${scene.color}22` }} />
        </>
      )}

      {/* Top accent line — slides in */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-[1px] w-32 md:w-48 mb-8"
        style={{ background: `linear-gradient(90deg, transparent, ${scene.color}, transparent)` }}
      />

      {/* Main word — slams up from below */}
      <div style={{ overflow: 'hidden' }}>
        <motion.h2
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="kgf-title text-[17vw] md:text-[11vw] lg:text-[8.5vw] leading-none tracking-tight text-center px-4"
          style={{
            color: scene.color,
            textShadow: `0 0 60px ${scene.glow}, 0 0 180px ${scene.bg}`,
          }}
        >
          {scene.word}
        </motion.h2>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 0.75, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="font-cinzel text-[9px] md:text-[11px] tracking-[0.65em] text-neutral-400 mt-5 uppercase text-center px-4"
      >
        {scene.sub}
      </motion.p>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="h-[1px] w-32 md:w-48 mt-8"
        style={{ background: `linear-gradient(90deg, transparent, ${scene.color}, transparent)` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Scene
// ─────────────────────────────────────────────────────────────────────────────
function ImageScene({ scene, onClick }) {
  const isDirector = scene.label === 'THE DIRECTOR';
  return (
    <div 
      className={`absolute inset-0 overflow-hidden bg-black ${isDirector ? 'cursor-pointer group' : ''}`}
      onClick={isDirector ? onClick : undefined}
    >

      {/* Image — Ken Burns hard zoom-in on entry */}
      <motion.img
        key={scene.src}
        src={scene.src}
        alt={scene.alt}
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.18, filter: 'brightness(0.35) saturate(0.5) contrast(1.3)' }}
        animate={{ scale: 1.03, filter: 'brightness(0.62) saturate(0.7) contrast(1.2)' }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{
          objectPosition: scene.src.includes('student') ? 'center 15%' : 'center'
        }}
      />

      {/* Top-to-bottom gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/55 pointer-events-none" />
      {/* Radial edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.88) 100%)' }}
      />

      {/* KGF-style colour grade overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-color-burn"
        style={{ background: 'rgba(30,15,0,0.38)' }}
      />

      {/* Special scan-line for editing timeline */}
      {scene.src.includes('editing_timeline') && (
        <motion.div
          className="absolute inset-x-0 h-[2px] z-10"
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${scene.accent} 50%, transparent 95%)`,
            boxShadow: `0 0 14px ${scene.accent}, 0 0 28px ${scene.accent}66`,
          }}
          initial={{ top: '-2px' }}
          animate={{ top: '102%' }}
          transition={{ duration: 1.4, ease: 'linear' }}
        />
      )}

      {/* Blue matrix line overlay for data image */}
      {scene.src.includes('data_analysis') && (
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.055]"
          style={{
            backgroundImage: `linear-gradient(rgba(26,111,255,0.9) 1px, transparent 1px)`,
            backgroundSize: '100% 5px',
            animation: 'gridSlide 12s linear infinite',
          }}
        />
      )}

      {/* Warm gold vignette for student photo */}
      {scene.src.includes('student') && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.08) 0%, transparent 55%)' }}
        />
      )}

      {/* Click interaction overlay for Director image */}
      {isDirector && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-30">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="border border-[#c9a84c] bg-black/80 px-6 py-3 text-[10px] font-mono text-[#c9a84c] tracking-[0.2em] uppercase"
          >
            ✦ ENTER DIRECTORS BAY ✦
          </motion.div>
        </div>
      )}

      {/* Scene label — slides up from bottom-left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.2 }}
        className="absolute bottom-[13vh] left-0 right-0 text-center z-20 pointer-events-none"
      >
        <p
          className="font-cinzel text-[9px] tracking-[0.85em] uppercase"
          style={{ color: scene.accent, textShadow: `0 0 20px ${scene.accent}88` }}
        >
          {scene.label}
        </p>
        <div
          className="w-10 h-[1px] mx-auto mt-2"
          style={{ background: `linear-gradient(90deg, transparent, ${scene.accent}66, transparent)` }}
        />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main TrailerMontage — beat-synced auto-cycle
// ─────────────────────────────────────────────────────────────────────────────
export default function TrailerMontage({ isActive, images, onDirectorClick }) {
  const customImages = useMemo(() => images || {
    hero: '/harsh_hero_art.png',
    editing: '/edited_page_ai.png',
    data: '/montage_data.png',
    camera: '/creative_camera.png',
    student: '/student.jpg',
    timeline: '/editing_timeline.png',
    dataAnalysis: '/data_analysis.png',
  }, [images]);

  const dynamicScenes = useMemo(() => getDynamicScenes(customImages), [customImages]);

  const [sceneIdx, setSceneIdx]   = useState(0);
  const [flashKey, setFlashKey]   = useState(0);
  const [shake, setShake]         = useState(false);
  const [isTwisting, setIsTwisting] = useState(false);
  const timerRef                  = useRef(null);

  // Reset index on activation
  useEffect(() => {
    if (isActive) {
      setSceneIdx(0);
      setFlashKey(k => k + 1);
      audioManager.playImpact();
      setIsTwisting(false);
    }
  }, [isActive]);

  // Main timing loop
  useEffect(() => {
    if (!isActive || isTwisting) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentScene = dynamicScenes[sceneIdx];
    timerRef.current = setTimeout(() => {
      const next = (sceneIdx + 1) % dynamicScenes.length;
      const nextScene = dynamicScenes[next];

      // Hard cut flash
      setFlashKey(k => k + 1);

      // SFX + shake
      if (nextScene.type === 'tagline') {
        audioManager.playImpact();
        setShake(true);
        setTimeout(() => setShake(false), 320);
      } else {
        audioManager.playWhoosh();
      }

      setSceneIdx(next);
    }, currentScene.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, sceneIdx, dynamicScenes, isTwisting]);

  const handleDirectorClick = () => {
    setIsTwisting(true);
    audioManager.playWhoosh();
    setTimeout(() => {
      if (onDirectorClick) onDirectorClick();
    }, 800);
  };

  const current = dynamicScenes[sceneIdx];

  return (
    <div 
      className="relative w-full h-full bg-black overflow-hidden select-none"
      style={{ perspective: '1200px' }}
    >

      {/* ── Hard Cut White Flash ────────────────────────────────── */}
      <div
        key={`flash-${flashKey}`}
        className="absolute inset-0 z-50 pointer-events-none"
        style={{
          background: '#ffffff',
          opacity: 0,
          animation: 'hardCutFlash 0.22s ease-out forwards',
        }}
      />

      {/* ── Film Grain ───────────────────────────────────────────── */}
      <div className="grain-overlay opacity-[0.07] z-40 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="mGrain2">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#mGrain2)" />
        </svg>
      </div>

      {/* ── Scene Viewport with Camera Shake & 3D Twist ─────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={sceneIdx}
          className="absolute inset-0 z-10"
          style={{ animation: shake ? 'cameraShake 0.32s ease-out' : 'none' }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            rotateY: isTwisting ? 180 : 0,
            scale: isTwisting ? 0.3 : 1,
            filter: isTwisting ? 'blur(10px) brightness(2)' : 'none',
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 0.12 },
            rotateY: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            filter: { duration: 0.8 },
          }}
        >
          {current.type === 'tagline'
            ? <TaglineScene scene={current} />
            : <ImageScene scene={current} onClick={handleDirectorClick} />
          }
        </motion.div>
      </AnimatePresence>

      {/* ── Cinematic Letterbox Bars ─────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 h-[11vh] bg-black z-30 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[11vh] bg-black z-30 pointer-events-none" />

      {/* ── Beat-progress dots ───────────────────────────────────── */}
      <div className="absolute bottom-[12vh] inset-x-0 flex justify-center gap-[10px] z-40 pointer-events-none">
        {dynamicScenes.map((s, i) => {
          const isOn = i === sceneIdx;
          const color = s.type === 'tagline' ? s.color : (dynamicScenes[i - 1]?.color ?? '#c9a84c');
          return (
            <div
              key={s.id}
              className="rounded-full transition-all duration-200"
              style={{
                width:  isOn ? '28px' : '7px',
                height: '3px',
                borderRadius: '2px',
                background: isOn ? color : 'rgba(255,255,255,0.15)',
                boxShadow: isOn ? `0 0 10px ${color}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* ── Scene counter ────────────────────────────────────────── */}
      <div className="absolute top-[12vh] right-6 z-40 pointer-events-none text-right">
        <span className="font-mono text-[9px] tracking-[0.4em] text-neutral-600">
          {String(sceneIdx + 1).padStart(2, '0')} / {String(dynamicScenes.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
