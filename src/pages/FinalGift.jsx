import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import Confetti from '../components/animations/Confetti';
import Fireworks from '../components/animations/Fireworks';
import letterData from '../data/letter.json';
import FlipMagazine from './magazine/FlipMagazine';

/* ─────────────────────────────────────────────
   ICONS (SVG, no emojis)
───────────────────────────────────────────── */
function HeartIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
function CameraIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function BookOpenIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function SparkleIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function FinalGift() {
  const navigate = useNavigate();
  const { completeLevel, addAchievement } = useGame();

  // Phases: magazine → stars → envelope → letter → finale
  const [phase, setPhase] = useState('magazine');
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [typedText, setTypedText] = useState({});
  const [confetti, setConfetti] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [starHeart, setStarHeart] = useState(false);
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const rafRef = useRef(null);

  // Mark level complete once
  useEffect(() => {
    completeLevel(6);
    addAchievement({ id: 'final' });
  }, []);

  // Star field canvas
  useEffect(() => {
    if (phase !== 'stars') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    starsRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
    }));

    const heartStars = [];
    const N = 40;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      heartStars.push({
        x: canvas.width / 2 + hx * 12,
        y: canvas.height / 2 + hy * 12,
        r: 2.5, alpha: 0, heart: true, progress: 0,
      });
    }

    let frame = 0;
    function draw() {
      frame++;
      ctx.fillStyle = 'rgba(10, 0, 32, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.save(); ctx.globalAlpha = Math.abs(s.alpha);
        ctx.fillStyle = 'white'; ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });

      if (frame > 80) {
        heartStars.forEach(s => {
          s.progress = Math.min(1, s.progress + 0.02);
          ctx.save(); ctx.globalAlpha = s.progress;
          ctx.fillStyle = '#FF85A2'; ctx.shadowBlur = 8; ctx.shadowColor = '#FF69B4';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.progress, 0, Math.PI * 2);
          ctx.fill(); ctx.restore();
        });
        if (frame === 180 && !starHeart) setStarHeart(true);
      }
      rafRef.current = requestAnimationFrame(draw);
    }
    ctx.fillStyle = '#0a0020';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase]);

  const handleEnvelopeOpen = () => {
    setEnvelopeOpen(true);
    setTimeout(() => { setPhase('letter'); startTyping(); }, 900);
  };

  const startTyping = () => {
    const paragraphs = letterData.paragraphs;
    let pIdx = 0, charIdx = 0;
    function typeNext() {
      if (pIdx >= paragraphs.length) { setTimeout(() => setPhase('finale'), 1000); return; }
      const para = paragraphs[pIdx];
      if (charIdx <= para.length) {
        setTypedText(prev => ({ ...prev, [pIdx]: para.slice(0, charIdx) }));
        charIdx++;
        setTimeout(typeNext, 22);
      } else { pIdx++; charIdx = 0; setTimeout(typeNext, 600); }
    }
    setTimeout(typeNext, 500);
  };

  useEffect(() => {
    if (phase === 'finale') {
      setConfetti(true); setFireworks(true);
      setTimeout(() => setFireworks(false), 8000);
      setTimeout(() => setConfetti(false), 4000);
    }
  }, [phase]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Confetti active={confetti} />
      <Fireworks active={fireworks} />

      {/* ── PHASE: MAGAZINE ── */}
      <AnimatePresence>
        {phase === 'magazine' && (
          <motion.div
            className="fixed inset-0 z-10"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FlipMagazine onFinish={() => setPhase('stars')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: STARS ── */}
      <AnimatePresence>
        {phase === 'stars' && (
          <motion.div className="fixed inset-0 z-10" exit={{ opacity: 0 }} transition={{ duration: 1 }}>
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center">
              <AnimatePresence>
                {starHeart && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <motion.p
                      className="font-heading text-white text-3xl mb-4"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      One Last Surprise...
                    </motion.p>
                    <motion.button
                      className="bg-white/20 backdrop-blur-md border border-white/40 text-white font-semibold rounded-full px-8 py-3 shadow-glow"
                      onClick={() => setPhase('envelope')}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,105,180,0.8)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Open Your Letter
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: ENVELOPE ── */}
      <AnimatePresence>
        {phase === 'envelope' && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center px-6"
            style={{ background: 'linear-gradient(180deg, #0a0020 0%, #2d0060 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div key={i} className="absolute"
                style={{ left: `${10 + i * 12}%`, bottom: '10%' }}
                animate={{ y: [0, -300], opacity: [0.6, 0] }}
                transition={{ duration: 4 + i, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}>
                <HeartIcon size={16 + i * 4} color="#FF85A2" />
              </motion.div>
            ))}
            <div className="text-center">
              <motion.p className="font-heading text-pink-300 text-2xl mb-8"
                animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
                A letter just for you...
              </motion.p>
              <motion.div
                onClick={handleEnvelopeOpen}
                className="cursor-pointer mx-auto"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <EnvelopeSVG open={envelopeOpen} />
              </motion.div>
              <motion.p className="text-pink-400 text-sm mt-6"
                animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }}>
                Tap the envelope to open
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: LETTER ── */}
      <AnimatePresence>
        {phase === 'letter' && (
          <motion.div
            className="fixed inset-0 z-20 overflow-y-auto"
            style={{ background: 'linear-gradient(135deg, #FFF4F8 0%, #FFE8F2 50%, #FFF0D6 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <div className="max-w-md mx-auto px-6 py-20">
              <motion.div className="bg-white/80 backdrop-blur-sm rounded-4xl shadow-soft-lg p-8 border border-pink-100"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}>
                <div className="text-center mb-6">
                  <HeartIcon size={32} color="#FF69B4" />
                  <p className="font-display text-pink-400 text-xl mt-2">{letterData.greeting}</p>
                </div>
                <div className="w-full h-px bg-pink-100 mb-6" />
                {letterData.paragraphs.map((_, i) => (
                  <p key={i} className="font-body text-gray-700 text-sm leading-relaxed mb-4">
                    {typedText[i] || ''}
                    {typedText[i] !== undefined && typedText[i].length < letterData.paragraphs[i].length && (
                      <span className="typing-cursor" />
                    )}
                  </p>
                ))}
                {Object.keys(typedText).length >= letterData.paragraphs.length && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <div className="w-full h-px bg-pink-100 mt-6 mb-4" />
                    <p className="font-display text-pink-400 text-base">{letterData.closing}</p>
                    <p className="font-heading text-pink-500 text-xl mt-1">{letterData.signature}</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: FINALE ── */}
      <AnimatePresence>
        {phase === 'finale' && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
            style={{ background: 'linear-gradient(135deg, #FFF4F8 0%, #FFE8F2 50%, #F3E5F5 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div key={i} className="absolute"
                style={{ left: `${Math.random() * 90}%`, bottom: '-5%' }}
                animate={{ y: -window.innerHeight - 100, opacity: [0.8, 0] }}
                transition={{ duration: 4 + Math.random() * 4, delay: Math.random() * 3, repeat: Infinity }}>
                <HeartIcon size={20 + Math.random() * 20} color="#FF85A2" />
              </motion.div>
            ))}

            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <HeartIcon size={100} color="#FF69B4" />
            </motion.div>

            <motion.h1 className="font-heading text-pink-500 text-4xl mt-6"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              I Love You
            </motion.h1>
            <motion.p className="font-display text-pink-400 text-2xl mt-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              Happy 21st Birthday
            </motion.p>
            <motion.p className="text-gray-500 text-sm mt-4 max-w-xs"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              You have completed your birthday adventure. Every level, every memory, every word — all for you.
            </motion.p>


            <motion.button
              className="btn-secondary text-sm px-6 py-2.5 flex items-center justify-center gap-2 mt-3 cursor-pointer"
              onClick={() => navigate('/journey')}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
            >
              <BookOpenIcon size={14} color="currentColor" />
              <span>Back to Adventure Map</span>
            </motion.button>

            <motion.div className="flex flex-wrap justify-center gap-1.5 mt-8 max-w-xs"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
              {Array.from({ length: 21 }, (_, i) => (
                <motion.div key={i}
                  className="w-2.5 h-2.5 rounded-full bg-pink-300"
                  animate={{ scale: [1, 1.5, 1], backgroundColor: ['#FFB6C1', '#FF69B4', '#FFB6C1'] }}
                  transition={{ delay: 2 + i * 0.1, duration: 1.5, repeat: Infinity }} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── SVG Components ── */
function EnvelopeSVG({ open }) {
  return (
    <svg width="200" height="140" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="40" width="180" height="90" rx="8" fill="#FFD6E8" stroke="#FF85A2" strokeWidth="2" />
      <path d="M10 130 L100 80 L190 130 Z" fill="#FFB6C1" stroke="#FF85A2" strokeWidth="1" />
      <path d="M10 40 L100 90 L190 40" stroke="#FF85A2" strokeWidth="1.5" fill="none" />
      <path d="M10 40 L70 90" stroke="#FF85A2" strokeWidth="1" opacity="0.5" />
      <path d="M190 40 L130 90" stroke="#FF85A2" strokeWidth="1" opacity="0.5" />
      <motion.path
        d="M10 40 Q100 10 190 40 L100 90 Z"
        fill="#FF85A2"
        stroke="#FF69B4"
        strokeWidth="1.5"
        style={{ transformOrigin: '100px 40px' }}
        animate={open ? { rotateX: 180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />
      {!open && <circle cx="100" cy="70" r="12" fill="#FF69B4" stroke="#fff" strokeWidth="2" />}
      {!open && <path d="M100 62 Q104 66 100 70 Q96 74 100 78" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />}
    </svg>
  );
}
