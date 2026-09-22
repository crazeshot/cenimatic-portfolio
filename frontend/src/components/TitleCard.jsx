import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../utils/audio';

export default function TitleCard({ onEnterComplete }) {
  const [step, setStep] = useState('prompt'); // 'prompt', 'intro', 'done'

  const handleStart = () => {
    // 1. Initialize audio and unmute
    audioManager.initContext();
    audioManager.setMute(false);
    
    // 2. Play initial atmospheric audio swoosh & sub boom
    audioManager.playWhoosh();
    setTimeout(() => {
      audioManager.playImpact();
    }, 400);

    // 3. Start background tension soundtrack
    audioManager.startSoundtrack();

    // 4. Progress to studio logo intro
    setStep('intro');
  };

  useEffect(() => {
    if (step === 'intro') {
      // Studio intro animation duration is 4.5 seconds, then transition out
      const timer = setTimeout(() => {
        setStep('done');
        if (onEnterComplete) onEnterComplete();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [step, onEnterComplete]);

  return (
    <AnimatePresence>
      {step !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black select-none"
        >
          {/* Cinema Letterbox Bars (Top / Bottom) */}
          <div className="absolute top-0 left-0 w-full h-[12vh] bg-black border-bottom border-neutral-900" />
          <div className="absolute bottom-0 left-0 w-full h-[12vh] bg-black border-top border-neutral-900" />

          {/* Vignette & subtle ambient light reflection */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,15,20,0.4)_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

          {/* Interactive Start Overlay to satisfy Autoplay requirements */}
          {step === 'prompt' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="z-10 text-center px-4"
            >
              <h2 className="font-cinzel text-neutral-400 text-sm tracking-[0.4em] mb-8 font-medium">
                A CINEMATIC PORTFOLIO EXPERIENCE
              </h2>
              
              <button
                onClick={handleStart}
                className="group relative px-10 py-4 bg-transparent border border-neutral-800 text-neutral-200 text-xs tracking-[0.5em] font-medium uppercase transition-all duration-500 hover:border-cinema-blue hover:text-white hover:scale-105 cursor-pointer outline-none"
              >
                {/* Glow layer */}
                <div className="absolute inset-0 bg-cinema-blue opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500" />
                PLAY TRAILER
              </button>
              
              <p className="text-neutral-600 text-[10px] tracking-widest mt-6 uppercase">
                Best experienced with sound enabled
              </p>
            </motion.div>
          )}

          {/* Studio-Logo Style Text Reveal ("HARSH PRODUCTIONS PRESENTS") */}
          {step === 'intro' && (
            <div className="z-10 text-center flex flex-col items-center justify-center">
              {/* Animated Line 1 */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.95, letterSpacing: '0.4em' }}
                animate={{ 
                  opacity: [0, 1, 1, 0], 
                  scale: [0.95, 1, 1.02, 1.05],
                  letterSpacing: ['0.4em', '0.5em', '0.52em', '0.55em']
                }}
                transition={{ duration: 4, times: [0, 0.25, 0.75, 1], ease: 'easeInOut' }}
                className="font-oswald text-2xl md:text-4xl text-neutral-300 font-bold uppercase select-none tracking-[0.5em] glow-text-blue"
              >
                HARSH PRODUCTIONS
              </motion.h1>

              {/* Animated Line 2 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 1, 1, 0] }}
                transition={{ duration: 4, times: [0, 0.35, 0.45, 0.75, 1] }}
                className="w-24 h-[1px] bg-cinema-blue my-6 opacity-60"
              />

              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.6em' }}
                animate={{ 
                  opacity: [0, 0, 0.8, 0.8, 0], 
                  letterSpacing: ['0.6em', '0.6em', '0.7em', '0.72em', '0.8em']
                }}
                transition={{ duration: 4, times: [0, 0.3, 0.45, 0.75, 1], ease: 'easeInOut' }}
                className="font-cinzel text-[10px] md:text-xs text-neutral-400 tracking-[0.7em] uppercase"
              >
                PRESENTS
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
