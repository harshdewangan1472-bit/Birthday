import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../store/GameContext';

// Target hearts to collect for 21st Birthday
const TARGET_HEARTS = 21;
const GAME_TIME = 90; // Generous 90 seconds for super relaxed, slow catching

// Melodic Web Audio Synthesizer for harp-like chimes
class HeartAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.pentatonic = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6
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

  pop(combo = 0) {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const noteIdx = (combo + Math.floor(Math.random() * 2)) % this.pentatonic.length;
      const freq = this.pentatonic[noteIdx];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // safe
    }
  }

  golden() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [659.25, 880.0, 1046.5, 1318.51]; // E5, A5, C6, E6 chime

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // safe
    }
  }

  win() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C major chord arpeggio
      chords.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + i * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.65);
      });
    } catch {
      // safe
    }
  }
}

const sfx = new HeartAudioSynthesizer();

// Heart Types
const HEART_TYPES = [
  {
    type: 'pink',
    points: 1,
    color: '#FF69B4',
    bg: 'linear-gradient(135deg, #FF9EBB 0%, #FF4081 50%, #E91E63 100%)',
    glow: 'rgba(255, 64, 129, 0.4)',
    label: '+1',
    symbol: '💖',
  },
  {
    type: 'gold',
    points: 2,
    color: '#FFD700',
    bg: 'linear-gradient(135deg, #FFF176 0%, #FFD54F 40%, #FFA000 100%)',
    glow: 'rgba(255, 215, 0, 0.5)',
    label: '+2 ✨',
    symbol: '💛',
  },
  {
    type: 'purple',
    points: 3,
    color: '#BA68C8',
    bg: 'linear-gradient(135deg, #E1BEE7 0%, #BA68C8 50%, #8E24AA 100%)',
    glow: 'rgba(186, 104, 200, 0.5)',
    label: '+3 💜',
    symbol: '💜',
  },
  {
    type: 'ruby',
    points: 1,
    color: '#FF1744',
    bg: 'linear-gradient(135deg, #FF8A80 0%, #FF1744 50%, #D50000 100%)',
    glow: 'rgba(255, 23, 68, 0.4)',
    label: '+1',
    symbol: '❤️',
  },
];

export default function Level5Hearts() {
  const navigate = useNavigate();
  const { completeLevel, addAchievement } = useGame();

  // Phases: 'ready' | 'playing' | 'victory'
  const [phase, setPhase] = useState('ready');

  // Game Stats
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [combo, setCombo] = useState(0);
  const [comboText, setComboText] = useState('');

  // Active Falling Hearts list
  const [fallingHearts, setFallingHearts] = useState([]);

  // Floating score tags from tapped position
  const [tapFloats, setTapFloats] = useState([]);

  // Confetti loop ref
  const confettiIntervalRef = useRef(null);
  const comboTimerRef = useRef(null);
  const nextHeartIdRef = useRef(0);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, []);

  // Continuous celebratory party poppers when won
  const triggerVictoryPoppers = () => {
    sfx.win();
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.8 },
      colors: ['#FF69B4', '#FFD700', '#FF80AB', '#00E676', '#FFFFFF'],
    });
    confetti({
      particleCount: 70,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.8 },
      colors: ['#FF69B4', '#FFD700', '#FF80AB', '#00E676', '#FFFFFF'],
    });

    let count = 0;
    confettiIntervalRef.current = setInterval(() => {
      count++;
      if (count > 6) {
        clearInterval(confettiIntervalRef.current);
        return;
      }
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { x: Math.random() * 0.6 + 0.2, y: 0.7 },
        colors: ['#FF69B4', '#FFD700', '#E91E63', '#FFFFFF'],
      });
    }, 1100);
  };

  // Start the Rain
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setCombo(0);
    setComboText('');
    setFallingHearts([]);
    setTapFloats([]);
    nextHeartIdRef.current = 0;
    setPhase('playing');
  };

  // Distinct horizontal lanes so hearts never overlap or cluster together
  const LANES = [10, 26, 42, 58, 74, 88];
  const lastLaneRef = useRef(-1);

  // Spawn heart helper
  const spawnHeart = useCallback(() => {
    const id = nextHeartIdRef.current++;

    // Weighted random type (70% 1-point, 20% gold 2-point, 10% purple 3-point)
    const rand = Math.random();
    let typeConfig;
    if (rand < 0.20) {
      typeConfig = HEART_TYPES[1]; // Gold (+2)
    } else if (rand < 0.32) {
      typeConfig = HEART_TYPES[2]; // Purple (+3)
    } else if (rand < 0.66) {
      typeConfig = HEART_TYPES[0]; // Pink (+1)
    } else {
      typeConfig = HEART_TYPES[3]; // Ruby (+1)
    }

    const size = Math.floor(Math.random() * 12) + 56; // 56px to 68px (comfortable tap target)

    // Pick a lane different from the previous heart so they are well spaced
    let laneIdx = Math.floor(Math.random() * LANES.length);
    if (laneIdx === lastLaneRef.current) {
      laneIdx = (laneIdx + 1 + Math.floor(Math.random() * (LANES.length - 1))) % LANES.length;
    }
    lastLaneRef.current = laneIdx;
    const baseLane = LANES[laneIdx];
    const leftPercent = Math.min(88, Math.max(8, baseLane + (Math.random() * 4 - 2)));

    // 5.2s to 6.7s provides a pleasant, gentle fall that travels the whole canvas smoothly
    const duration = (Math.random() * 1.5 + 5.2).toFixed(1);
    const sway = Math.random() * 18 - 9; // gentle horizontal sway

    const newHeart = {
      id,
      ...typeConfig,
      size,
      left: `${leftPercent}%`,
      duration: parseFloat(duration),
      sway,
    };

    setFallingHearts((prev) => [...prev, newHeart]);

    // Automatically remove heart after it completes full travel to bottom
    setTimeout(() => {
      setFallingHearts((prev) => prev.filter((h) => h.id !== id));
    }, (parseFloat(duration) + 0.5) * 1000);
  }, []);

  // Active game loop: Spawns heart rain & ticks timer
  useEffect(() => {
    if (phase !== 'playing') return;

    // Spawn 1 heart every 920ms for well-spaced, relaxing flow
    const spawnTimer = setInterval(spawnHeart, 920);

    // Initial first 2 hearts with a staggered delay
    spawnHeart();
    setTimeout(spawnHeart, 450);

    // Countdown Timer
    const countdownTimer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(countdownTimer);
    };
  }, [phase, spawnHeart]);

  // Check victory condition
  useEffect(() => {
    if (score >= TARGET_HEARTS && phase === 'playing') {
      setPhase('victory');
      triggerVictoryPoppers();
      completeLevel(5);
      addAchievement({
        id: 'heart_collector_queen',
        title: 'Queen of Hearts',
        description: 'Caught 21 magical hearts for your 21st birthday!',
      });
    }
  }, [score, phase, completeLevel, addAchievement]);

  // Catch / Tap Heart Handler
  const handleCatchHeart = (heart, e) => {
    e.stopPropagation();

    // Sound
    if (heart.points > 1) {
      sfx.golden();
    } else {
      sfx.pop(combo);
    }

    // Capture tap position for floating "+1"
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX || rect.left + rect.width / 2;
    const clickY = e.clientY || rect.top + rect.height / 2;

    const floatId = Date.now() + Math.random();
    setTapFloats((prev) => [
      ...prev,
      {
        id: floatId,
        x: clickX,
        y: clickY,
        label: heart.label,
        color: heart.color,
      },
    ]);
    setTimeout(() => {
      setTapFloats((prev) => prev.filter((f) => f.id !== floatId));
    }, 850);

    // Increase score
    setScore((prev) => Math.min(TARGET_HEARTS, prev + heart.points));

    // Remove tapped heart immediately
    setFallingHearts((prev) => prev.filter((h) => h.id !== heart.id));

    // Combo system
    setCombo((prev) => {
      const nextCombo = prev + 1;
      if (nextCombo >= 7) setComboText('💖 UNSTOPPABLE LOVE! 🔥');
      else if (nextCombo >= 4) setComboText('✨ MAGICAL COMBO! 💕');
      else if (nextCombo >= 2) setComboText('🌸 SWEET CATCH! ✨');

      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
        setCombo(0);
        setComboText('');
      }, 1400);

      return nextCombo;
    });
  };

  // Proceed to roadmap with walking transition 5 -> 6
  const handleUnlockFinalSurprise = () => {
    if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    navigate('/journey', {
      state: {
        justCompleted: 5,
        newlyUnlocked: 6,
      },
    });
  };

  const progressPercent = Math.min(100, (score / TARGET_HEARTS) * 100);

  return (
    <div
      className="h-[100dvh] max-h-[100dvh] overflow-hidden px-3 pt-14 pb-2 relative select-none flex flex-col justify-between"
      style={{
        background: 'linear-gradient(180deg, #FFF0F6 0%, #FCE4EC 35%, #F8BBD0 75%, #F48FB1 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Soft Ambient Clouds / Lights in Background ── */}
      <div className="absolute top-16 left-4 w-48 h-48 rounded-full bg-pink-300/30 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-4 w-60 h-60 rounded-full bg-rose-400/25 blur-3xl pointer-events-none -z-10" />

      {/* ── Floating Tap Indicators (+1, +2) ── */}
      <AnimatePresence>
        {tapFloats.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, scale: 0.7, y: 0 }}
            animate={{ opacity: 0, scale: 1.35, y: -45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 font-black text-sm drop-shadow-md flex items-center gap-1"
            style={{ left: f.x - 20, top: f.y - 20, color: f.color }}
          >
            <span className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-pink-200 shadow-sm">
              {f.label}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="max-w-md mx-auto w-full h-full flex flex-col justify-between gap-1 relative z-10">
        {/* ── 1. HEADER BAR ── */}
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
              Heart Rain Shower
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-pink-100 text-pink-900 border-pink-300">
              Level 5
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-extrabold text-pink-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-pink-200 shadow-2xs">
            <span>⏱️</span>
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* ── 2. SCORE & PROGRESS TRACKER ── */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border border-pink-200 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-1.5 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base animate-pulse">💖</span>
              <span className="text-xs font-black text-pink-600 tracking-wide">
                COLLECTED: {score} / {TARGET_HEARTS}
              </span>
            </div>

            {comboText ? (
              <motion.span
                key={comboText}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
              >
                {comboText}
              </motion.span>
            ) : (
              <span className="text-[10px] font-semibold text-neutral-500">
                21 Hearts for 21st Birthday ✨
              </span>
            )}
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden p-0.5 border border-pink-200 relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-sm relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
            >
              <div className="absolute inset-0 bg-white/25 w-full animate-pulse" />
            </motion.div>
          </div>
        </div>

        {/* ── 3. HEARTS RAIN CANVAS / PLAY AREA ── */}
        <div className="relative flex-1 rounded-2xl overflow-hidden my-1 bg-gradient-to-b from-white/30 via-pink-100/20 to-pink-200/30 border border-white/60 shadow-inner flex flex-col justify-between">
          {/* Falling Hearts Rain */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {fallingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ top: -75 }}
                animate={{
                  top: 'calc(100% + 40px)',
                }}
                transition={{
                  top: { duration: heart.duration, ease: 'linear' },
                }}
                style={{
                  position: 'absolute',
                  left: heart.left,
                  zIndex: 25,
                  pointerEvents: 'none',
                }}
              >
                <motion.button
                  animate={{
                    x: [-heart.sway, heart.sway, -heart.sway],
                    rotate: [-8, 8, -8],
                  }}
                  transition={{
                    x: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  onClick={(e) => handleCatchHeart(heart, e)}
                  style={{
                    width: heart.size,
                    height: heart.size,
                    pointerEvents: 'auto',
                  }}
                  className="cursor-pointer flex items-center justify-center p-1 rounded-full focus:outline-none filter drop-shadow-md active:scale-90 transition-transform"
                >
                  {/* 3D Heart SVG with Glowing Gradient */}
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center relative shadow-sm border border-white/70"
                    style={{
                      background: heart.bg,
                      boxShadow: `0 4px 14px ${heart.glow}`,
                    }}
                  >
                    <svg
                      width="60%"
                      height="60%"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="filter drop-shadow-xs"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>

                    {/* Bonus Badge on Gold / Purple Hearts */}
                    {heart.points > 1 && (
                      <span className="absolute -bottom-1 -right-1 px-1 rounded-full bg-amber-400 text-amber-950 font-black text-[9px] shadow-xs border border-white">
                        +{heart.points}
                      </span>
                    )}
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* INTRO SCREEN (Before Start) */}
          <AnimatePresence>
            {phase === 'ready' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="absolute inset-0 bg-white/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-5 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-3xl shadow-lg shadow-pink-500/30 mb-3 border-2 border-white"
                >
                  🌧️💖
                </motion.div>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-600 bg-pink-100 px-3 py-0.5 rounded-full mb-1 border border-pink-200">
                  Magical Heart Rain
                </span>

                <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-serif mb-1">
                  Catch the Falling Hearts!
                </h2>

                <p className="text-xs text-neutral-600 max-w-xs mb-3 leading-relaxed">
                  Upar se dher saare magical hearts ki baarish hogi. Screen par tap karke{' '}
                  <strong className="text-pink-600 font-extrabold">21 Hearts</strong> collect karo
                  apne 21st birthday ke liye!
                </p>

                {/* Heart Types Legend */}
                <div className="flex items-center justify-center gap-3 bg-pink-50/80 p-2 rounded-2xl border border-pink-200 mb-4 text-[11px] font-bold text-neutral-700">
                  <div className="flex items-center gap-1">
                    <span>💖</span>
                    <span>Pink (+1)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💛</span>
                    <span>Gold (+2)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💜</span>
                    <span>Magic (+3)</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={startGame}
                  className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 cursor-pointer border border-pink-200"
                >
                  START CATCHING HEARTS! 💖
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── 4. BOTTOM ACTION HINT BAR ── */}
        <div className="bg-white/85 backdrop-blur-md rounded-2xl py-2 px-3 border border-pink-200 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-neutral-700">
            <span className="animate-bounce">👆</span>
            <span>Tap falling hearts to collect</span>
          </div>

          <div className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
            Goal: {TARGET_HEARTS} Hearts
          </div>
        </div>
      </div>

      {/* ── 5. VICTORY POPUP MODAL (21 Hearts Celebration) ── */}
      <AnimatePresence>
        {phase === 'victory' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="max-w-sm w-full text-center flex flex-col items-center relative z-10 px-6 py-6 rounded-3xl bg-gradient-to-b from-white via-pink-50 to-rose-50 border-2 border-amber-300 shadow-2xl overflow-hidden"
            >
              {/* Radial Glow */}
              <div
                className="absolute inset-x-4 top-2 h-44 rounded-full blur-3xl pointer-events-none -z-10"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,105,180,0.5) 0%, rgba(255,215,0,0.4) 60%, transparent 80%)',
                }}
              />

              <span className="inline-block px-3 py-0.5 rounded-full bg-pink-100 text-pink-900 text-[10px] font-extrabold uppercase tracking-wider border border-pink-300 mb-2 shadow-2xs">
                ✨ Level 5 Complete! ✨
              </span>

              {/* Big Heart Badge */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-4xl shadow-xl shadow-pink-500/30 mb-3 border-4 border-white"
              >
                💖
              </motion.div>

              <h2 className="text-2xl font-black text-neutral-900 font-serif mb-1">
                21 Hearts Collected! 🎉
              </h2>

              <p className="text-xs sm:text-sm font-medium text-pink-700 italic font-serif mb-3 px-2">
                "21 magical hearts for your 21st birthday... each one holding a special reason why I love you unconditionally."
              </p>

              <div className="bg-white/85 backdrop-blur-xs rounded-2xl p-3 border border-pink-200 w-full mb-4 shadow-2xs">
                <div className="text-[11px] font-bold text-neutral-600 flex items-center justify-between">
                  <span>Score: {score} Hearts</span>
                  <span className="text-emerald-600 font-extrabold">All Cleared 🌟</span>
                </div>
              </div>

              {/* Unlock Grand Finale Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleUnlockFinalSurprise}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 border border-amber-200 cursor-pointer"
              >
                <span>UNLOCK GRAND FINALE SURPRISE 🎁</span>
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
