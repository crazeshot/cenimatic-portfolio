import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../utils/audio';

/**
 * HeroReveal — A cinematic full-screen character reveal.
 * Shows the comic-art hero image with dramatic scale / opacity / blur
 * transitions, emulating a KGF-style title card → hero reveal.
 */

export default function HeroReveal({ onComplete, heroImage }) {
  const currentHeroImage = heroImage || '/harsh_hero_art.png';
  const [phase, setPhase] = useState('curtain');   // curtain → reveal → hold → exit
  const timerRef = useRef(null);

  useEffect(() => {
    // Phase 1: Black curtain with gold text (1.2s)
    timerRef.current = setTimeout(() => {
      setPhase('reveal');
      audioManager.playImpact();
    }, 1200);

    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (phase === 'reveal') {
      // Phase 2: Hold the hero image for 3.5s then exit
      timerRef.current = setTimeout(() => {
        setPhase('exit');
      }, 3500);
      return () => clearTimeout(timerRef.current);
    }
    if (phase === 'exit') {
      timerRef.current = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
      return () => clearTimeout(timerRef.current);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[999] bg-black overflow-hidden select-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          onAnimationComplete={() => {
            if (phase === 'exit') {
              setPhase('done');
              if (onComplete) onComplete();
            }
          }}
          style={{ pointerEvents: phase === 'exit' ? 'none' : 'auto' }}
        >
          {/* Letterbox bars */}
          <div className="absolute top-0 left-0 right-0 h-[10vh] bg-black z-30" />
          <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black z-30" />

          {/* Gold line accents */}
          <div className="absolute top-[10vh] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent z-30" />
          <div className="absolute bottom-[10vh] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent z-30" />

          {/* Phase 1: Curtain text */}
          <AnimatePresence>
            {phase === 'curtain' && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.p
                  className="font-cinzel text-[9px] md:text-[11px] tracking-[1em] text-[#c9a84c] uppercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  INTRODUCING
                </motion.p>
                <motion.div
                  className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent my-4"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
                <motion.p
                  className="font-cinzel text-[9px] tracking-[0.8em] text-[#c9a84c55] uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  THE MAN BEHIND THE LENS
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2 & 3: Hero Image Reveal */}
          <AnimatePresence>
            {(phase === 'reveal' || phase === 'exit') && (
              <motion.div
                className="absolute inset-0 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Background image & radial glow for The Director */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
                  style={{
                    backgroundImage: "url('/Screenshot 2026-04-25 at 11.23.30.png')",
                    filter: 'grayscale(0.3) brightness(0.4)',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(180,40,20,0.2) 0%, black 85%)',
                  }}
                />

                {/* The hero image — cinematic zoom-in reveal */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 1.3, opacity: 0, filter: 'blur(20px) brightness(0.3)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px) brightness(1)' }}
                  transition={{
                    duration: 2.0,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <img
                    src={currentHeroImage}
                    alt="Harsh — The Director"
                    className="w-full h-full object-contain md:object-cover"
                    style={{
                      maxHeight: '80vh',
                      filter: 'contrast(1.15) saturate(1.1)',
                    }}
                  />

                  {/* Cinematic vignette over image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.8) 100%)',
                    }}
                  />
                </motion.div>

                {/* Name overlay at bottom */}
                <motion.div
                  className="absolute bottom-[12vh] left-0 right-0 z-20 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2
                    className="kgf-title text-6xl md:text-8xl lg:text-9xl text-white tracking-tight"
                    style={{
                      textShadow: '0 0 60px rgba(201,168,76,0.5), 0 0 200px rgba(201,168,76,0.15)',
                    }}
                  >
                    HARSH
                  </h2>
                  <motion.p
                    className="font-oswald text-[10px] md:text-xs tracking-[0.5em] text-[#c9a84c88] uppercase mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    DATA ANALYST  ✦  VIDEO EDITOR  ✦  CREATOR
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Film grain */}
          <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.06]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <filter id="heroGrain">
                <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#heroGrain)" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
