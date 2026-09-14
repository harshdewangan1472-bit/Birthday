import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../store/GameContext';
import level4Photo from '/assets/images/level_4.jpeg';

// Helper sound generator using Web Audio API
class ShuffleSoundPlayer {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  tick() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 + Math.random() * 200, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // safe
    }
  }
  open() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // safe
    }
  }
  wrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // safe
    }
  }
  hint() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // safe
    }
  }
}

const sfx = new ShuffleSoundPlayer();

// Initial 9 boxes (Center box ID 4 has the prize initially)
const INITIAL_BOXES = [
  { id: 0, hasPrize: false },
  { id: 1, hasPrize: false },
  { id: 2, hasPrize: false },
  { id: 3, hasPrize: false },
  { id: 4, hasPrize: true }, // Center box is winning box initially
  { id: 5, hasPrize: false },
  { id: 6, hasPrize: false },
  { id: 7, hasPrize: false },
  { id: 8, hasPrize: false },
];

export default function Level4Quiz() {
  const navigate = useNavigate();
  const { completeLevel, addAchievement } = useGame();

  // Current array order of 9 boxes
  const [boxes, setBoxes] = useState(INITIAL_BOXES);

  // Game Phases: 'preview' | 'shuffling' | 'guessing' | 'wrong' | 'correct'
  const [phase, setPhase] = useState('preview');

  // Hint active status
  const [hintActive, setHintActive] = useState(false);

  // Currently selected box during guess
  const [selectedBoxId, setSelectedBoxId] = useState(null);

  // Number of shuffles completed in current animation
  const [shuffleStep, setShuffleStep] = useState(0);
  const totalShuffleSteps = 5; // Relaxed from 8 down to 5 for easy tracking

  // Winning popup modal
  const [showWinModal, setShowWinModal] = useState(false);

  // Confetti continuous loop ref
  const confettiIntervalRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    };
  }, []);

  // Fire celebratory party poppers from left & right corners
  const triggerPartyPoppers = () => {
    // Initial blast
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ['#FF69B4', '#FFD700', '#FF80AB', '#00E676', '#FFFFFF']
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: ['#FF69B4', '#FFD700', '#FF80AB', '#00E676', '#FFFFFF']
    });

    // Repeating poppers every 1.2 seconds while celebrating
    let count = 0;
    confettiIntervalRef.current = setInterval(() => {
      count++;
      if (count > 5) {
        clearInterval(confettiIntervalRef.current);
        return;
      }
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 50,
        origin: { x: 0, y: 0.75 },
        colors: ['#FF69B4', '#FFD700', '#FF4081', '#FFFFFF']
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 0.75 },
        colors: ['#FF69B4', '#FFD700', '#FF4081', '#FFFFFF']
      });
    }, 1200);
  };

  // Start the 3x3 shuffle animation
  const startShuffle = () => {
    setPhase('shuffling');
    setSelectedBoxId(null);
    setShuffleStep(0);
    setHintActive(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setShuffleStep(step);
      sfx.tick();

      // Perform a random swap between 2 boxes in the 9-array
      setBoxes((prev) => {
        const next = [...prev];
        const idx1 = Math.floor(Math.random() * 9);
        let idx2 = Math.floor(Math.random() * 9);
        while (idx2 === idx1) {
          idx2 = Math.floor(Math.random() * 9);
        }
        const temp = next[idx1];
        next[idx1] = next[idx2];
        next[idx2] = temp;
        return next;
      });

      if (step >= totalShuffleSteps) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase('guessing');
        }, 500);
      }
    }, 580);
  };

  // Handle player clicking a gift box
  const handleBoxClick = (box) => {
    if (phase !== 'guessing') return;

    setSelectedBoxId(box.id);

    if (box.hasPrize) {
      // ── CORRECT GUESS! ──
      sfx.open();
      setPhase('correct');

      setTimeout(() => {
        setShowWinModal(true);
        triggerPartyPoppers();
        completeLevel(4);
        addAchievement({
          id: 'mystery_gift_found',
          title: 'Sharp Eyed Lover',
          description: 'Tracked the secret surprise gift with eagle eyes!',
        });
      }, 700);
    } else {
      // ── WRONG GUESS ──
      sfx.wrong();
      setPhase('wrong');

      // Show where the correct box was, then automatically re-shuffle
      setTimeout(() => {
        // Reshuffle after 2.6 seconds so user can try again!
        startShuffle();
      }, 2600);
    }
  };

  // Proceed to Roadmap
  const handleUnlockNext = () => {
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    navigate('/journey', {
      state: {
        justCompleted: 4,
        newlyUnlocked: 5,
      },
    });
  };

  return (
    <div
      className="h-[100dvh] max-h-[100dvh] overflow-hidden px-3 pt-14 pb-2 relative select-none flex flex-col justify-between"
      style={{
        background: 'linear-gradient(135deg, #FFF0F6 0%, #FDF4F8 35%, #F4EAFF 70%, #FFF5F9 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="max-w-md mx-auto w-full h-full flex flex-col justify-between gap-1">
        {/* ── 1. CLEAN TOP HEADER BAR ── */}
        <div className="flex items-center justify-between gap-2 px-1 py-0.5">
          <button
            onClick={() => navigate('/journey')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-pink-200 text-[11px] font-semibold text-neutral-700 shadow-2xs hover:bg-white cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Map</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-neutral-800">
              Mystery Gift Box
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-purple-100 text-purple-900 border-purple-300">
              Level 4
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              sfx.hint();
              setHintActive((prev) => !prev);
            }}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold border shadow-2xs cursor-pointer transition-all ${
              hintActive
                ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300 animate-pulse'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <span>💡</span>
            <span>{hintActive ? 'Hint ON' : 'Hint'}</span>
          </motion.button>
        </div>

        {/* ── 2. GUIDANCE BANNER (Tells user what to do in each phase) ── */}
        <motion.div
          key={`${phase}-${hintActive}`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-2 rounded-xl border text-center shadow-xs transition-colors ${
            phase === 'preview'
              ? 'bg-amber-50/90 border-amber-300 text-amber-900'
              : phase === 'shuffling'
              ? 'bg-purple-50/90 border-purple-300 text-purple-900'
              : phase === 'wrong'
              ? 'bg-rose-50/90 border-rose-300 text-rose-900'
              : phase === 'correct'
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
              : hintActive
              ? 'bg-amber-50/95 border-amber-400 text-amber-900'
              : 'bg-pink-50/90 border-pink-300 text-pink-900'
          }`}
        >
          {phase === 'preview' && (
            <div className="text-xs font-semibold leading-tight">
              <span className="font-extrabold text-amber-700">👀 Memorize This Box!</span>
              <span className="block text-[11px] text-amber-800 mt-0.5">
                Notice the golden 💛 charm on it! Tap below to shuffle.
              </span>
            </div>
          )}

          {phase === 'shuffling' && (
            <div className="text-xs font-semibold leading-tight flex items-center justify-center gap-1.5">
              <span className="animate-spin text-purple-600">🔀</span>
              <span className="font-extrabold text-purple-700">
                Shuffling Gifts... ({shuffleStep}/{totalShuffleSteps})
              </span>
            </div>
          )}

          {phase === 'guessing' && (
            <div className="text-xs font-semibold leading-tight">
              {hintActive ? (
                <>
                  <span className="font-extrabold text-amber-700 animate-pulse">
                    💡 HINT ACTIVE: Golden glowing box has the surprise photo! 💖
                  </span>
                  <span className="block text-[11px] text-amber-900 mt-0.5">
                    Tap the glowing box below to open it!
                  </span>
                </>
              ) : (
                <>
                  <span className="font-extrabold text-pink-600 animate-pulse">
                    👉 Where is the secret photo hiding?
                  </span>
                  <span className="block text-[11px] text-neutral-600 mt-0.5">
                    Clue: Watch for the gold heart 💛 charm or tap "💡 Hint" below!
                  </span>
                </>
              )}
            </div>
          )}

          {phase === 'wrong' && (
            <div className="text-xs font-semibold leading-tight">
              <span className="font-extrabold text-rose-600">
                Oops! Not in this box 💭
              </span>
              <span className="block text-[11px] text-rose-800 mt-0.5">
                Look at the green glowing box! Reshuffling in a moment...
              </span>
            </div>
          )}

          {phase === 'correct' && (
            <div className="text-xs font-black text-emerald-600 leading-tight">
              🎉 YOU FOUND IT! UNLOCKING SURPRISE...
            </div>
          )}
        </motion.div>

        {/* ── 3. 3×3 MYSTERY GIFT MATRIX CANVAS ── */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-pink-200 shadow-sm relative flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden my-1">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute inset-x-8 top-8 bottom-8 rounded-full blur-2xl pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(circle, rgba(255,105,180,0.2) 0%, rgba(212,175,55,0.15) 50%, transparent 80%)',
            }}
          />

          {/* 3×3 Grid with Framer Motion Layout animations for physical sliding */}
          <div className="w-full max-w-[310px] aspect-square grid grid-cols-3 gap-2.5 p-1 relative">
            {boxes.map((box) => {
              const isPrize = box.hasPrize;
              const isSelected = selectedBoxId === box.id;

              // When should the lid be open?
              const isOpen =
                (phase === 'preview' && isPrize) ||
                (phase === 'wrong' && (isSelected || isPrize)) ||
                (phase === 'correct' && isPrize);

              const isWinningRevealed =
                (phase === 'preview' && isPrize) ||
                (phase === 'correct' && isPrize) ||
                (phase === 'wrong' && isPrize);

              const isHinted = hintActive && isPrize;
              const isDimmed = hintActive && !isPrize && phase === 'guessing';

              return (
                <motion.div
                  key={box.id}
                  layout
                  transition={{
                    type: 'spring',
                    stiffness: 170,
                    damping: 22,
                  }}
                  whileHover={phase === 'guessing' ? { scale: 1.06, y: -2 } : {}}
                  whileTap={phase === 'guessing' ? { scale: 0.94 } : {}}
                  onClick={() => handleBoxClick(box)}
                  className={`relative aspect-square rounded-2xl flex items-center justify-center transition-all ${
                    phase === 'guessing'
                      ? 'cursor-pointer hover:shadow-md'
                      : phase === 'shuffling'
                      ? 'cursor-wait pointer-events-none'
                      : 'cursor-default'
                  } ${isDimmed ? 'opacity-35 grayscale-[50%]' : 'opacity-100'}`}
                >
                  {/* Floating badge over hinted winning box */}
                  {isHinted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, y: [-4, 2, -4] }}
                      transition={{ y: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } }}
                      className="absolute -top-3.5 z-40 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[9px] font-black shadow-lg border border-amber-300 flex items-center gap-1 whitespace-nowrap pointer-events-none"
                    >
                      <span>💖</span>
                      <span>It's Here!</span>
                    </motion.div>
                  )}

                  {/* Permanent Subtle Clue: Golden charm on the secret box */}
                  {isPrize && (
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-1 right-1 z-30 pointer-events-none flex items-center justify-center"
                    >
                      <span className="text-[12px] filter drop-shadow-[0_1px_3px_rgba(255,215,0,0.8)]">
                        💛
                      </span>
                    </motion.div>
                  )}

                  {/* ── GIFT BOX BASE CONTAINER ── */}
                  <div
                    className={`w-full h-full rounded-2xl relative flex items-center justify-center overflow-hidden border shadow-md transition-all duration-300 ${
                      isHinted
                        ? 'border-amber-400 ring-4 ring-amber-400 shadow-xl shadow-amber-400/60 scale-102'
                        : isWinningRevealed
                        ? 'border-amber-400 ring-2 ring-amber-300/80 shadow-amber-500/25'
                        : isSelected && !isPrize && phase === 'wrong'
                        ? 'border-rose-400 ring-2 ring-rose-300/80'
                        : 'border-pink-300/90'
                    }`}
                    style={{
                      background: isWinningRevealed || isHinted
                        ? 'linear-gradient(135deg, #FFE082 0%, #FFD54F 50%, #FFA000 100%)'
                        : 'linear-gradient(135deg, #FF80AB 0%, #F06292 40%, #E91E63 80%, #C2185B 100%)',
                    }}
                  >
                    {/* Metallic Ribbon Stripes Across Base */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-500 shadow-xs opacity-90" />
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 shadow-xs opacity-90" />

                    {/* Inside Surprise Content (Revealed when open) */}
                    {isOpen && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute inset-1 rounded-xl bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center overflow-hidden z-10 border border-amber-300"
                      >
                        {isPrize ? (
                          <div className="relative w-full h-full flex items-center justify-center p-1">
                            {/* Photo Thumbnail */}
                            <img
                              src={level4Photo}
                              alt="Secret Surprise"
                              className="w-full h-full object-cover rounded-lg shadow-md border border-amber-200"
                            />
                            {/* Golden Sparkle Glow */}
                            <motion.div
                              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute -top-1 -right-1 text-sm pointer-events-none"
                            >
                              ✨
                            </motion.div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-white/80 text-[10px] font-bold">
                            <span className="text-base">💨</span>
                            <span>Empty!</span>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── GIFT BOX TOP LID (Flips/Tilts when open) ── */}
                    <motion.div
                      animate={
                        isOpen
                          ? { y: -18, rotate: -12, scale: 0.92, opacity: 0.92 }
                          : { y: 0, rotate: 0, scale: 1, opacity: 1 }
                      }
                      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                      className="absolute inset-0 rounded-2xl flex items-center justify-center pointer-events-none z-20"
                      style={{
                        background:
                          'linear-gradient(135deg, #FF9EBB 0%, #FF4081 50%, #D81B60 100%)',
                        border: '2px solid rgba(255, 215, 0, 0.6)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      }}
                    >
                      {/* Ribbon cross on lid */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-3.5 bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-500 shadow-xs" />
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3.5 bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 shadow-xs" />

                      {/* 3D Gold Ribbon Bow in center of lid */}
                      <div className="relative z-10 flex items-center justify-center">
                        <svg width="28" height="24" viewBox="0 0 40 32" fill="none">
                          <defs>
                            <linearGradient id="bowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FFF9C4" />
                              <stop offset="40%" stopColor="#FFD54F" />
                              <stop offset="100%" stopColor="#D4AF37" />
                            </linearGradient>
                          </defs>
                          <ellipse cx="14" cy="14" rx="9" ry="6" fill="url(#bowGrad)" stroke="#B28900" strokeWidth="0.8" />
                          <ellipse cx="26" cy="14" rx="9" ry="6" fill="url(#bowGrad)" stroke="#B28900" strokeWidth="0.8" />
                          <circle cx="20" cy="14" r="4" fill="#FFE082" stroke="#B28900" strokeWidth="0.8" />
                        </svg>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── 4. ACTION BAR (Start Shuffle or Guidance) ── */}
        <div className="bg-white/85 backdrop-blur-md rounded-2xl p-2 border border-pink-200 shadow-xs text-center">
          {phase === 'preview' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={startShuffle}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-extrabold text-xs shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
            >
              <span>🔀 Start Shuffle & Hide Gift</span>
              <span>→</span>
            </motion.button>
          )}

          {phase === 'shuffling' && (
            <div className="py-2 text-xs font-bold text-neutral-600 animate-pulse">
              Shuffling in progress... Follow the golden heart 💛!
            </div>
          )}

          {phase === 'guessing' && (
            <div className="flex flex-col gap-1.5 py-0.5">
              <div className="text-[11px] font-extrabold text-pink-600">
                Tap any of the 9 gift boxes above to open it! 🎁
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sfx.hint();
                  setHintActive((prev) => !prev);
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer border shadow-2xs ${
                  hintActive
                    ? 'bg-amber-400 border-amber-500 text-amber-950 ring-2 ring-amber-300'
                    : 'bg-gradient-to-r from-amber-50 to-pink-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <span>💡</span>
                <span>
                  {hintActive ? '✨ Hint Active: Open glowing box!' : 'Tap for Hint (Bhai kisme hai?)'}
                </span>
              </motion.button>
            </div>
          )}

          {phase === 'wrong' && (
            <div className="py-2 text-xs font-bold text-rose-600">
              Not this one! Reshuffling automatically in a moment... 🔄
            </div>
          )}

          {phase === 'correct' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowWinModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🎉 View Found Surprise!</span>
              <span>→</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* ── 5. SURPRISE PHOTO POPUP MODAL (Big Zoom In + Confetti) ── */}
      <AnimatePresence>
        {showWinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="max-w-sm w-full text-center flex flex-col items-center relative z-10 px-5 py-6 rounded-3xl bg-gradient-to-b from-white to-pink-50 border-2 border-amber-300 shadow-2xl overflow-hidden"
            >
              {/* Radial Golden Aura */}
              <div
                className="absolute inset-x-4 top-2 h-44 rounded-full blur-3xl pointer-events-none -z-10"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,105,180,0.3) 60%, transparent 80%)',
                }}
              />

              {/* Achievement Badge */}
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider border border-amber-300 mb-2 shadow-2xs">
                ✨ Secret Mystery Gift Found! ✨
              </span>

              {/* The Photo Pops Up Big */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.95, 1.02, 1] }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-amber-300/80 mb-3 bg-neutral-100 relative"
              >
                <img
                  src={level4Photo}
                  alt="Our Beautiful Memory"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-serif mb-0.5">
                You Found Us! ❤️
              </h2>

              <p className="text-xs sm:text-sm font-medium text-pink-700 italic font-serif mb-1 px-2">
                "No matter how many times things shuffle, my heart will always find you."
              </p>

              <p className="text-neutral-500 text-[11px] max-w-xs mb-4 leading-relaxed">
                Level 4 Complete! The journey continues towards your grand birthday finale.
              </p>

              {/* Unlock Next Surprise Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleUnlockNext}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 border border-amber-200 cursor-pointer"
              >
                <span>UNLOCK NEXT SURPRISE</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
