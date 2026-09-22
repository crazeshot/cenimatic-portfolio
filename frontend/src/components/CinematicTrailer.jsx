import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import audioManager from '../utils/audio';

/**
 * CinematicTrailer
 * A full-screen, non-scrollable KGF-style trailer sequence.
 * Plays after user clicks "PLAY TRAILER".
 * Unlocks the portfolio scroll once done.
 *
 * Post-title flow:
 *   BBA → Bachelor by Choice → Data Analysing → Editor by Passion
 *   → An Editor Who Can't Edit His Own Life → Creator to Achieve Big
 */

// ── Scene definitions ────────────────────────────────────────────────
// Each scene: { id, start (seconds), end (seconds), type }
// Pre-title (same as before)
// Post-title: cinematic beat-synced identity reveal
const SCENES = [
  // ── ACT 1: Opening ──
  { id: 0,  start: 0,     end: 1.1,   type: 'black'            },
  { id: 1,  start: 1.1,   end: 2.4,   type: 'studio'           },
  { id: 2,  start: 2.4,   end: 3.5,   type: 'black'            },
  { id: 3,  start: 3.5,   end: 5.0,   type: 'tagline1'         },

  // ── ACT 2: Quick-cut montage ──
  { id: 4,  start: 5.0,   end: 6.5,   type: 'img_edit'         },
  { id: 5,  start: 6.5,   end: 7.0,   type: 'word1'            },
  { id: 6,  start: 7.0,   end: 7.5,   type: 'img_data'         },
  { id: 7,  start: 7.5,   end: 8.2,   type: 'word2'            },
  { id: 8,  start: 8.2,   end: 9.0,   type: 'img_cam'          },
  { id: 9,  start: 9.0,   end: 10.0,  type: 'word3'            },
  { id: 10, start: 10.0,  end: 11.0,  type: 'img_edit_anim'    },
  { id: 11, start: 11.0,  end: 12.0,  type: 'img_hero'         },
  { id: 12, start: 12.0,  end: 13.0,  type: 'word4'            },
  { id: 13, start: 13.0,  end: 14.0,  type: 'tagline2'         },

  // ── ACT 3: The Big Title ──
  { id: 14, start: 14.0,  end: 18.0,  type: 'title'            },

  // ── ACT 4: Beat-synced Identity Reveal ──
  // Beat 1: BBA card
  { id: 15, start: 18.0,  end: 19.3,  type: 'bba'              },
  // Beat 2: Black flash → "BACHELOR BY CHOICE"
  { id: 16, start: 19.3,  end: 19.5,  type: 'beat_flash'       },
  { id: 17, start: 19.5,  end: 20.8,  type: 'bachelor'         },
  // Beat 3: Black flash → "DATA ANALYSING"
  { id: 18, start: 20.8,  end: 21.0,  type: 'beat_flash'       },
  { id: 19, start: 21.0,  end: 22.3,  type: 'data_analysing'   },
  // Beat 4: Black flash → "EDITOR BY PASSION"
  { id: 20, start: 22.3,  end: 22.5,  type: 'beat_flash'       },
  { id: 21, start: 22.5,  end: 23.8,  type: 'editor_passion'   },
  // Beat 5: Black flash → Punchline
  { id: 22, start: 23.8,  end: 24.0,  type: 'beat_flash'       },
  { id: 23, start: 24.0,  end: 25.8,  type: 'punchline'        },
  // Beat 6: Black flash → "CREATOR TO ACHIEVE BIG"
  { id: 24, start: 25.8,  end: 26.0,  type: 'beat_flash'       },
  { id: 25, start: 26.0,  end: 27.8,  type: 'creator_big'      },

  // ── CTA ──
  { id: 26, start: 27.8,  end: 32.0,  type: 'cta'              },
];


// ═══════════════════════════════════════════════════════════════════
// ── Individual Scene Components ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

function SceneBlack() {
  return <div className="absolute inset-0 bg-black" />;
}

/** A brief white→black flash for hard beat cuts */
function SceneBeatFlash() {
  return (
    <div className="absolute inset-0 bg-black">
      <div
        className="absolute inset-0"
        style={{
          background: 'white',
          animation: 'beatFlashAnim 0.2s ease-out forwards',
        }}
      />
    </div>
  );
}

function SceneStudio() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
      <div
        className="text-center"
        style={{ animation: 'zoomReveal 0.6s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        <p
          className="font-cinzel text-[10px] md:text-xs tracking-[0.8em] text-[#c9a84c] mb-6"
          style={{ opacity: 0.7 }}
        >
          A HARSH PRODUCTIONS PRESENTATION
        </p>
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mb-6" />
        <h1
          className="font-bebas text-5xl md:text-7xl tracking-[0.2em] text-white"
          style={{ textShadow: '0 0 40px rgba(201,168,76,0.4)' }}
        >
          HARSH PRODUCTIONS
        </h1>
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mt-6" />
        <p className="font-cinzel text-[10px] tracking-[1.2em] text-[#c9a84c66] mt-4">
          PRESENTS
        </p>
      </div>
    </div>
  );
}

function SceneTagline({ text, sub }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-8">
      <div
        className="text-center overflow-hidden"
        style={{ animation: 'slideUpReveal 0.5s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >
        <p className="font-cinzel text-[9px] md:text-[11px] tracking-[0.6em] text-[#c9a84c] mb-4 uppercase">
          {sub || 'IN A WORLD WHERE DATA MEETS CINEMA'}
        </p>
        <h2 className="kgf-title text-3xl md:text-5xl lg:text-6xl text-white uppercase" style={{ textShadow: '0 0 30px rgba(201,168,76,0.2)' }}>
          {text}
        </h2>
      </div>
    </div>
  );
}

function SceneImage({ src, alt }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          animation: 'zoomReveal 0.3s ease-out forwards',
          filter: 'contrast(1.3) brightness(0.65) saturate(0.7)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
      <div className="absolute inset-0 mix-blend-color-burn bg-[rgba(40,20,0,0.4)]" />
    </div>
  );
}

function SceneImageEditAnim({ src }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <motion.img
        src={src || "/edited_page_ai.png"}
        alt="Animated Editing UI"
        className="w-full h-full object-cover"
        initial={{ scale: 1.25, x: -10, y: -10, filter: 'contrast(1.4) brightness(0.8) saturate(0.8)' }}
        animate={{ scale: 1.02, x: 0, y: 0, filter: 'contrast(1.2) brightness(0.65) saturate(0.7)' }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      <motion.div
        className="absolute inset-x-0 h-[2px] bg-red-600/40 shadow-[0_0_10px_rgba(220,38,38,0.5)] z-10"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 1.0, ease: 'linear' }}
      />
    </div>
  );
}

function SceneWord({ word, color = '#c9a84c', size = 'hero' }) {
  const sizeClass = size === 'hero'
    ? 'text-[20vw] md:text-[18vw] leading-none'
    : 'text-[12vw] leading-none';

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div style={{ overflow: 'hidden', textAlign: 'center' }}>
        <h2
          className={`kgf-title ${sizeClass} tracking-tight`}
          style={{
            color,
            textShadow: `0 0 45px ${color}aa, 0 0 120px ${color}33`,
            animation: 'slideUpReveal 0.2s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          {word}
        </h2>
      </div>
    </div>
  );
}

function SceneTitle() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[13vh] bg-black z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-[13vh] bg-black z-10" />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, black 70%)',
          animation: 'flashIn 1s ease-out forwards',
        }}
      />
      <div className="absolute top-[13vh] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />
      <div className="absolute bottom-[13vh] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

      <div className="relative z-20 text-center px-4">
        <p
          className="font-cinzel text-[8px] md:text-[10px] tracking-[1em] text-[#c9a84c] mb-6"
          style={{ animation: 'slideUpReveal 0.6s 0.2s both', opacity: 0 }}
        >
          THE CINEMATIC PORTFOLIO
        </p>
        <div style={{ overflow: 'hidden' }}>
          <h1
            className="kgf-title text-[22vw] md:text-[18vw] lg:text-[14vw] leading-none tracking-tight text-white"
            style={{
              animation: 'slideUpReveal 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
              textShadow: '0 0 60px rgba(201,168,76,0.5), 0 0 200px rgba(201,168,76,0.15)',
            }}
          >
            HARSH
          </h1>
        </div>
        <div
          className="w-full h-[3px] mt-4 mb-4 progress-line"
          style={{ animation: 'horizontalLine 1.2s 0.4s ease-out both' }}
        />
        <p
          className="font-oswald text-xs md:text-sm tracking-[0.5em] text-[#c9a84c88]"
          style={{ animation: 'slideUpReveal 0.5s 0.8s both', opacity: 0 }}
        >
          DATA ANALYST  ✦  VIDEO EDITOR  ✦  CREATOR
        </p>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// ── ACT 4 — Beat-Synced Identity Cards ───────────────────────────
// ═══════════════════════════════════════════════════════════════════

/** Scene: "BBA" — large institutional title with decorative underline */
function SceneBBA() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background pulse glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)',
          animation: 'pulseGlow 1.3s ease-in-out infinite',
        }}
      />

      {/* Top accent line */}
      <div
        className="w-32 md:w-48 h-[2px] mb-8"
        style={{
          background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
          animation: 'horizontalLine 0.4s 0.1s ease-out both',
        }}
      />

      {/* Main text: BBA */}
      <div style={{ overflow: 'hidden' }}>
        <h2
          className="kgf-title text-[28vw] md:text-[22vw] lg:text-[18vw] leading-none tracking-tight text-white"
          style={{
            animation: 'slamDown 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
            textShadow: '0 0 80px rgba(201,168,76,0.6), 0 4px 0 rgba(201,168,76,0.15)',
          }}
        >
          BBA
        </h2>
      </div>

      {/* Subtitle */}
      <p
        className="font-cinzel text-[10px] md:text-xs tracking-[0.8em] text-[#c9a84c] mt-6 uppercase"
        style={{ animation: 'fadeSlideUp 0.4s 0.2s both', opacity: 0 }}
      >
        BACHELOR OF BUSINESS ADMINISTRATION
      </p>

      {/* Bottom accent line */}
      <div
        className="w-32 md:w-48 h-[2px] mt-8"
        style={{
          background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
          animation: 'horizontalLine 0.4s 0.3s ease-out both',
        }}
      />
    </div>
  );
}

/** Scene: "BACHELOR BY CHOICE" — elegant gold serif */
function SceneBachelor() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Diagonal gold streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c33] to-transparent"
          style={{
            top: '35%', left: '-50%',
            transform: 'rotate(-15deg)',
            animation: 'streakSlide 0.8s ease-out forwards',
          }}
        />
        <div
          className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c22] to-transparent"
          style={{
            top: '65%', left: '-50%',
            transform: 'rotate(-15deg)',
            animation: 'streakSlide 0.8s 0.1s ease-out forwards',
          }}
        />
      </div>

      <p
        className="font-cinzel text-[9px] md:text-[11px] tracking-[1em] text-[#c9a84c66] mb-5 uppercase"
        style={{ animation: 'fadeSlideUp 0.3s both', opacity: 0 }}
      >
        NOT BY LUCK
      </p>

      <div style={{ overflow: 'hidden' }}>
        <h2
          className="kgf-title text-[12vw] md:text-[10vw] lg:text-[8vw] leading-none text-center px-4"
          style={{
            color: '#e8e0d0',
            textShadow: '0 0 50px rgba(201,168,76,0.5), 0 0 150px rgba(201,168,76,0.15)',
            animation: 'slideUpReveal 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          BACHELOR BY CHOICE
        </h2>
      </div>

      <div
        className="w-20 h-[1px] mt-6"
        style={{
          background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
          animation: 'horizontalLine 0.3s 0.2s ease-out both',
        }}
      />
    </div>
  );
}

/** Scene: "DATA ANALYSING" — digital/matrix blue aesthetic */
function SceneDataAnalysing() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Digital grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26,111,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,111,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridSlide 2s linear infinite',
        }}
      />

      {/* Blue radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(26,111,255,0.1) 0%, transparent 60%)',
        }}
      />

      <p
        className="font-mono text-[10px] md:text-xs tracking-[0.6em] text-[#1a6fff88] mb-4 uppercase"
        style={{ animation: 'fadeSlideUp 0.3s both', opacity: 0 }}
      >
        ◆ DECODING THE WORLD ◆
      </p>

      <div style={{ overflow: 'hidden' }}>
        <h2
          className="kgf-title text-[13vw] md:text-[10vw] lg:text-[8vw] leading-none text-center px-4"
          style={{
            color: '#1a6fff',
            textShadow: '0 0 60px rgba(26,111,255,0.7), 0 0 150px rgba(26,111,255,0.2)',
            animation: 'glitchReveal 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          DATA ANALYSING
        </h2>
      </div>

      {/* Animated data line */}
      <div
        className="w-48 h-[2px] mt-6"
        style={{
          background: 'linear-gradient(90deg, transparent, #1a6fff, #1a6fff, transparent)',
          animation: 'dataLineScan 1s 0.2s ease-out both',
        }}
      />

      <p
        className="font-mono text-[8px] tracking-[0.5em] text-[#1a6fff44] mt-4"
        style={{ animation: 'fadeSlideUp 0.3s 0.3s both', opacity: 0 }}
      >
        PYTHON · TABLEAU · SQL · EXCEL
      </p>
    </div>
  );
}

/** Scene: "EDITOR BY PASSION" — dramatic red/cinematic */
function SceneEditorPassion() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Red vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(192,57,43,0.12) 0%, transparent 60%)',
          animation: 'pulseGlow 1s ease-in-out infinite',
        }}
      />

      {/* Film strip lines */}
      <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-[#c0392b22]" />
      <div className="absolute top-[22%] left-0 right-0 h-[1px] bg-[#c0392b11]" />
      <div className="absolute bottom-[20%] left-0 right-0 h-[1px] bg-[#c0392b22]" />
      <div className="absolute bottom-[22%] left-0 right-0 h-[1px] bg-[#c0392b11]" />

      <p
        className="font-cinzel text-[9px] md:text-[11px] tracking-[0.8em] text-[#c0392b88] mb-5 uppercase"
        style={{ animation: 'fadeSlideUp 0.3s both', opacity: 0 }}
      >
        NOT A JOB — A CALLING
      </p>

      <div style={{ overflow: 'hidden' }}>
        <h2
          className="kgf-title text-[12vw] md:text-[10vw] lg:text-[8vw] leading-none text-center px-4"
          style={{
            color: '#c0392b',
            textShadow: '0 0 60px rgba(192,57,43,0.8), 0 0 150px rgba(192,57,43,0.25)',
            animation: 'slideUpReveal 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          EDITOR BY PASSION
        </h2>
      </div>

      <div
        className="w-20 h-[1px] mt-6"
        style={{
          background: 'linear-gradient(90deg, transparent, #c0392b, transparent)',
          animation: 'horizontalLine 0.3s 0.2s ease-out both',
        }}
      />

      <p
        className="font-mono text-[8px] tracking-[0.5em] text-[#c0392b44] mt-4"
        style={{ animation: 'fadeSlideUp 0.3s 0.3s both', opacity: 0 }}
      >
        PREMIERE PRO · AFTER EFFECTS · DAVINCI
      </p>
    </div>
  );
}

/** Scene: Punchline — "AN EDITOR WHO CAN'T EDIT HIS OWN LIFE" */
function ScenePunchline() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Very subtle warm glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 55%, rgba(201,168,76,0.04) 0%, transparent 50%)',
        }}
      />

      {/* Opening quote mark */}
      <div
        className="font-cinzel text-[80px] md:text-[120px] text-[#c9a84c15] leading-none mb-[-30px] md:mb-[-50px]"
        style={{ animation: 'fadeSlideUp 0.3s both', opacity: 0 }}
      >
        "
      </div>

      <div style={{ overflow: 'hidden' }}>
        <h2
          className="font-cinzel text-[5.5vw] md:text-[4vw] lg:text-[3vw] leading-[1.3] text-center px-6 md:px-16 italic"
          style={{
            color: '#e8e0d0',
            textShadow: '0 0 40px rgba(201,168,76,0.25)',
            animation: 'punchlineReveal 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
            fontWeight: 400,
          }}
        >
          AN EDITOR WHO CAN'T
          <br />
          <span style={{ color: '#c0392b', textShadow: '0 0 40px rgba(192,57,43,0.5)' }}>
            EDIT HIS OWN LIFE
          </span>
        </h2>
      </div>

      {/* Closing quote mark */}
      <div
        className="font-cinzel text-[80px] md:text-[120px] text-[#c9a84c15] leading-none mt-[-20px] md:mt-[-30px]"
        style={{ animation: 'fadeSlideUp 0.4s 0.3s both', opacity: 0 }}
      >
        "
      </div>

      <div
        className="w-12 h-[1px] mt-4"
        style={{
          background: 'linear-gradient(90deg, transparent, #c9a84c44, transparent)',
          animation: 'horizontalLine 0.4s 0.4s ease-out both',
        }}
      />
    </div>
  );
}

/** Scene: "CREATOR TO ACHIEVE BIG" — epic gold finale */
function SceneCreatorBig() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Epic gold radial burst */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.03) 30%, transparent 60%)',
          animation: 'epicBurst 1.5s ease-out forwards',
        }}
      />

      {/* Horizontal accent lines — top & bottom */}
      <div
        className="absolute top-[28%] left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, #c9a84c44 50%, transparent 90%)',
          animation: 'horizontalLine 0.5s ease-out both',
        }}
      />
      <div
        className="absolute bottom-[28%] left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, #c9a84c44 50%, transparent 90%)',
          animation: 'horizontalLine 0.5s 0.1s ease-out both',
        }}
      />

      <p
        className="font-cinzel text-[9px] md:text-[11px] tracking-[1em] text-[#c9a84c] mb-5 uppercase"
        style={{ animation: 'fadeSlideUp 0.3s both', opacity: 0 }}
      >
        THE FINAL ACT
      </p>

      <div style={{ overflow: 'hidden' }}>
        <h2
          className="kgf-title text-[11vw] md:text-[9vw] lg:text-[7vw] leading-none text-center px-4"
          style={{
            color: '#c9a84c',
            textShadow: '0 0 80px rgba(201,168,76,0.8), 0 0 200px rgba(201,168,76,0.3), 0 4px 0 rgba(201,168,76,0.15)',
            animation: 'epicSlamUp 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          CREATOR TO
          <br />
          ACHIEVE BIG
        </h2>
      </div>

      <div
        className="w-24 h-[2px] mt-6"
        style={{
          background: 'linear-gradient(90deg, transparent, #c9a84c, #c9a84c, transparent)',
          animation: 'horizontalLine 0.4s 0.3s ease-out both',
        }}
      />

      <p
        className="font-mono text-[8px] tracking-[0.5em] text-[#c9a84c55] mt-4 uppercase"
        style={{ animation: 'fadeSlideUp 0.3s 0.4s both', opacity: 0 }}
      >
        THIS IS JUST THE BEGINNING
      </p>
    </div>
  );
}

function SceneCTA({ onComplete }) {
  const [countdown, setCountdown] = useState(4);
  useEffect(() => {
    if (countdown <= 0) {
      onComplete();
      return;
    }
    const t = setTimeout(() => {
      setCountdown(c => c - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown, onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-6">
      <div className="absolute top-0 left-0 right-0 h-[12vh] bg-black" />
      <div className="absolute bottom-0 left-0 right-0 h-[12vh] bg-black" />
      <div className="text-center">
        <p
          className="font-cinzel text-[10px] tracking-[0.8em] text-[#c9a84c66] mb-4"
          style={{ animation: 'fadeSlideUp 0.5s forwards', opacity: 0 }}
        >
          NOW SHOWING
        </p>
        <h2
          className="kgf-title text-5xl md:text-7xl text-white mb-8"
          style={{
            animation: 'zoomReveal 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
            textShadow: '0 0 40px rgba(201,168,76,0.5)',
          }}
        >
          ENTER HIS WORLD
        </h2>
        <div className="relative w-20 h-20 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="2" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (countdown / 4)}`}
              style={{ transition: 'stroke-dashoffset 0.95s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bebas text-2xl text-[#c9a84c]">{countdown}</span>
          </div>
        </div>
        <p className="font-mono text-[9px] tracking-[0.4em] text-neutral-600 mt-6">
          PORTFOLIO LOADING...
        </p>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// ── Main CinematicTrailer Component ──────────────────────────────
// ═══════════════════════════════════════════════════════════════════

export default function CinematicTrailer({ onComplete, images }) {
  const customImages = images || {
    hero: '/harsh_hero_art.png',
    editing: '/edited_page_ai.png',
    data: '/montage_data.png',
    camera: '/creative_camera.png',
    student: '/student.jpg',
    timeline: '/editing_timeline.png',
    dataAnalysis: '/data_analysis.png',
  };

  const [phase, setPhase] = useState('prompt'); // prompt | playing | done
  const [currentSceneId, setCurrentSceneId] = useState(0);
  const [flashKey, setFlashKey] = useState(0);
  const [cameraShake, setCameraShake] = useState(false);
  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);
  const prevSceneTypeRef = useRef('');

  // Lock scrolling while trailer is playing
  useEffect(() => {
    if (phase === 'playing') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [phase]);

  // Types that trigger impact sound + camera shake on entry
  const impactTypes = new Set([
    'bba', 'bachelor', 'data_analysing', 'editor_passion', 'punchline', 'creator_big',
  ]);

  // Beat-synced scene switcher
  const tick = useCallback(() => {
    if (!startTimeRef.current) return;
    const elapsed = (performance.now() - startTimeRef.current) / 1000;

    let targetSceneId = SCENES[SCENES.length - 1].id;
    for (const sc of SCENES) {
      if (elapsed >= sc.start && elapsed < sc.end) {
        targetSceneId = sc.id;
        break;
      }
    }

    setCurrentSceneId(prev => {
      if (prev !== targetSceneId) {
        const newScene = SCENES.find(s => s.id === targetSceneId);
        const newType = newScene?.type || '';

        // Flash on every scene cut
        setFlashKey(k => k + 1);

        // Impact sound + camera shake on identity cards
        if (impactTypes.has(newType)) {
          audioManager.playImpact();
          setCameraShake(true);
          setTimeout(() => setCameraShake(false), 300);
        } else {
          audioManager.playClick();
        }

        prevSceneTypeRef.current = newType;
        return targetSceneId;
      }
      return prev;
    });

    if (elapsed < SCENES[SCENES.length - 1].end) {
      animFrameRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const handleStart = () => {
    audioManager.initAndPlay();
    audioManager.playWhoosh();
    setPhase('playing');
    startTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleTrailerComplete = useCallback(() => {
    setPhase('done');
    if (onComplete) onComplete();
  }, [onComplete]);

  // ── Render current scene ─────────────────────────────────────────
  const currentScene = SCENES.find(s => s.id === currentSceneId) || SCENES[0];

  const renderScene = () => {
    switch (currentScene.type) {
      case 'black':           return <SceneBlack />;
      case 'beat_flash':      return <SceneBeatFlash />;
      case 'studio':          return <SceneStudio />;
      case 'tagline1':        return <SceneTagline text="ONE MAN. INFINITE STORIES." sub="IN A WORLD WHERE DATA MEETS CINEMA" />;
      case 'tagline2':        return <SceneTagline text="PREPARE FOR IMPACT." sub="THE PORTFOLIO DROPS" />;
      case 'img_edit':        return <SceneImage src={customImages.editing} alt="editing" />;
      case 'img_edit_anim':   return <SceneImageEditAnim src={customImages.editing} />;
      case 'img_data':        return <SceneImage src={customImages.data} alt="data" />;
      case 'img_cam':         return <SceneImage src={customImages.camera} alt="camera" />;
      case 'img_hero':        return <SceneImage src={customImages.hero} alt="hero" />;
      case 'word1':           return <SceneWord word="AN STUDENT." color="#e8e0d0" />;
      case 'word2':           return <SceneWord word="A CREATOR." color="#c9a84c" />;
      case 'word3':           return <SceneWord word="AN EDITOR." color="#c0392b" />;
      case 'word4':           return <SceneWord word="THIS SEASON." color="#e8e0d0" />;
      case 'title':           return <SceneTitle />;
      // ── ACT 4: Identity Reveal ──
      case 'bba':             return <SceneBBA />;
      case 'bachelor':        return <SceneBachelor />;
      case 'data_analysing':  return <SceneDataAnalysing />;
      case 'editor_passion':  return <SceneEditorPassion />;
      case 'punchline':       return <ScenePunchline />;
      case 'creator_big':     return <SceneCreatorBig />;
      case 'cta':             return <SceneCTA onComplete={handleTrailerComplete} />;
      default:                return <SceneBlack />;
    }
  };

  if (phase === 'done') return null;

  return (
    <div className="trailer-sequence select-none">

      {/* Cut flash overlay */}
      <div
        key={flashKey}
        className="absolute inset-0 z-50 pointer-events-none"
        style={{
          background: '#fff',
          opacity: 0,
          animation: 'hardCutFlash 0.25s ease-out forwards',
        }}
      />

      {/* Letterbox bars */}
      <div className="absolute top-0 left-0 right-0 h-[12vh] bg-black z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[12vh] bg-black z-30 pointer-events-none" />

      {/* Grain overlay inside trailer */}
      <div className="grain-overlay opacity-[0.07] z-40 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="tf">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#tf)" />
        </svg>
      </div>

      {/* Scene rendering area — with camera shake */}
      <div
        className="absolute inset-0"
        key={currentSceneId}
        style={{
          animation: cameraShake ? 'cameraShake 0.3s ease-out' : 'none',
        }}
      >
        {phase === 'playing' ? renderScene() : null}
      </div>

      {/* PROMPT SCREEN */}
      {phase === 'prompt' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, black 70%)' }}
          />
          <div className="relative z-10 text-center px-6 flex flex-col items-center">
            <div className="mb-12">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mb-5" />
              <p className="font-cinzel text-[9px] md:text-[11px] tracking-[0.8em] text-[#c9a84c] uppercase">
                A Harsh Productions Film
              </p>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mt-5" />
            </div>
            <h1
              className="kgf-title text-[25vw] md:text-[18vw] lg:text-[14vw] leading-none tracking-tight text-white mb-4"
              style={{ textShadow: '0 0 80px rgba(201,168,76,0.3)' }}
            >
              HARSH
            </h1>
            <p className="font-oswald text-[10px] md:text-xs tracking-[0.5em] text-neutral-500 mb-14 uppercase">
              Data Analyst  ·  Video Editor  ·  Creator
            </p>
            <button
              onClick={handleStart}
              className="group relative px-12 py-4 border border-[#c9a84c33] hover:border-[#c9a84c] transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#c9a84c] opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <span className="relative font-oswald text-xs tracking-[0.8em] text-[#c9a84c] uppercase font-semibold">
                PLAY TRAILER
              </span>
            </button>
            <p className="font-mono text-[9px] text-neutral-700 tracking-widest mt-8 uppercase">
              Sound On  ·  Best Viewed Fullscreen
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
