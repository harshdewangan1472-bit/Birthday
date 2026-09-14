import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import FloatingHearts from '../components/animations/FloatingHearts';
import Sparkles from '../components/animations/Sparkles';
import dudububFront from '/dudu_bubu_front.png';

/* ── Custom High-Quality SVG Icons ── */

const HeartIcon = ({ size = 18, color1 = "#FF4081", color2 = "#E91E8C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <defs>
      <linearGradient id="heartGradSolid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color1} />
        <stop offset="100%" stopColor={color2} />
      </linearGradient>
    </defs>
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="url(#heartGradSolid)" />
  </svg>
);

const AdventureIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <defs>
      <linearGradient id="advCompassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF4081" />
        <stop offset="100%" stopColor="#9C27B0" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="9" stroke="url(#advCompassGrad)" strokeWidth="2" fill="rgba(255,182,193,0.18)" />
    <polygon points="12,5.5 14.5,12 12,10.5 9.5,12" fill="#E91E8C" />
    <polygon points="12,18.5 14.5,12 12,13.5 9.5,12" fill="#BA68C8" />
    <circle cx="12" cy="12" r="1.8" fill="#fff" />
  </svg>
);

const SparkleIcon = ({ size = 18, color1 = "#FFD54F", color2 = "#FF8F00" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <defs>
      <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color1} />
        <stop offset="100%" stopColor={color2} />
      </linearGradient>
    </defs>
    <path d="M12 2C12.4 7.2 16.8 11.6 22 12C16.8 12.4 12.4 16.8 12 22C11.6 16.8 7.2 12.4 2 12C7.2 11.6 11.6 7.2 12 2Z" fill="url(#sparkleGrad)" />
    <circle cx="19" cy="4" r="1.8" fill={color1} />
  </svg>
);

const ButtonHeartIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#FFFFFF" />
    <path d="M19 2L19.8 4.2L22 5L19.8 5.8L19 8L18.2 5.8L16 5L18.2 4.2L19 2Z" fill="#FFE082" />
  </svg>
);

const MiniHeartIcon = ({ size = 14, color = "#FF69B4" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
  </svg>
);

export default function Intro() {
  const [started, setStarted] = useState(false);
  const { startJourney } = useGame();
  const navigate = useNavigate();

  const handleStart = () => {
    setStarted(true);
    startJourney();
    // Navigate at peak of portal gate opening and flash
    setTimeout(() => navigate('/journey'), 2000);
  };

  return (
    <div style={{
      height: '100dvh',
      maxHeight: '100dvh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(8px, 1.6vh, 14px) clamp(12px, 3.5vw, 18px)',
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #FFF0F8 0%, #FFE4F2 28%, #FFF8EA 65%, #F5E8FF 100%)',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Ambient background glows */}
      <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,182,193,0.45) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '230px', height: '230px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(216,180,254,0.4) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0 }} />

      <FloatingHearts count={10} />
      <Sparkles count={12} />

      {/* ── Main Content Container ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '430px',
        height: '100%',
        maxHeight: '100%',
        zIndex: 10,
        gap: 'clamp(8px, 1.4vh, 14px)',
      }}>

        {/* ── 1. Dudu Bubu Image (Cute & Prominent) ── */}
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 180 }}
          style={{ flexShrink: 0 }}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src={dudububFront}
              alt="Dudu Bubu"
              style={{
                width: 'clamp(160px, 45vw, 215px)',
                height: 'clamp(135px, 22vh, 175px)',
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 24px rgba(255,105,180,0.35))',
                display: 'block',
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── 2. Headings Group ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'clamp(2px, 0.5vh, 5px)',
          width: '100%',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(1.32rem, 5.6vw, 1.82rem)',
              color: '#D81B60',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
              textShadow: '0 2px 14px rgba(216,27,96,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <span>A Very Special Surprise Awaits You...</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{
              fontSize: 'clamp(0.74rem, 2.9vw, 0.88rem)',
              color: '#9C27B0',
              fontStyle: 'italic',
              fontWeight: 500,
              lineHeight: 1.3,
              margin: 0,
              padding: '0 6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>For the girl who made every ordinary day feel extraordinary.</span>
          </motion.p>
        </div>

        {/* ── 3. Message Glass Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.75, duration: 0.55, type: 'spring' }}
          style={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 250, 253, 0.76) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 182, 193, 0.55)',
            borderRadius: '20px',
            padding: 'clamp(12px, 2.2vh, 18px) clamp(14px, 3.8vw, 20px)',
            boxShadow: '0 10px 30px rgba(255, 105, 180, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          {/* Title Line */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.35 }}
            style={{
              fontSize: 'clamp(0.86rem, 3.5vw, 1.02rem)',
              fontWeight: 700,
              color: '#C2185B',
              margin: 0,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}
          >
            Today isn't just your birthday.
          </motion.p>

          {/* Birthday special dedication */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.95, duration: 0.35 }}
            style={{
              fontSize: 'clamp(0.76rem, 3.0vw, 0.88rem)',
              color: '#4A2545',
              lineHeight: 1.48,
              margin: 0,
            }}
          >
            It's the celebration of a beautiful soul who entered this world on{' '}
            <span style={{
              fontWeight: 700,
              color: '#D81B60',
              background: 'rgba(255, 182, 193, 0.28)',
              padding: '1px 6px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
            }}>
              15 September 2005
            </span>{' '}
            and unknowingly made countless moments brighter just by being herself.{' '}
            <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '3px' }}>
              <HeartIcon size={17} />
            </span>
          </motion.p>

          {/* Adventure teaser */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.05, duration: 0.35 }}
            style={{
              fontSize: 'clamp(0.76rem, 3.0vw, 0.88rem)',
              color: '#4A2545',
              lineHeight: 1.48,
              margin: 0,
            }}
          >
            Behind this button lies a little adventure filled with surprises, memories, laughter, challenges, and something straight from my heart.
          </motion.p>

          {/* Discovery teaser */}
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.15, duration: 0.35 }}
            style={{
              fontSize: 'clamp(0.76rem, 3.0vw, 0.88rem)',
              color: '#5C1D48',
              lineHeight: 1.48,
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 700, color: '#D81B60', fontStyle: 'italic' }}>
              But here's the thing...
            </span>{' '}
            You'll have to discover everything one step at a time.{' '}
            <span style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '3px', gap: '3px' }}>
              <AdventureIcon size={18} />
              <SparkleIcon size={14} />
            </span>
          </motion.p>

          {/* Prompt / Call to begin */}
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.25, duration: 0.35 }}
            style={{
              fontSize: 'clamp(0.82rem, 3.3vw, 0.95rem)',
              fontWeight: 700,
              color: '#D81B60',
              textAlign: 'center',
              margin: 0,
              paddingTop: '2px',
              letterSpacing: '0.01em',
            }}
          >
            Are you ready to begin the journey?
          </motion.p>
        </motion.div>

        {/* ── 4. CTA Button (Eye-catching & interactive) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(4px, 0.8vh, 8px)', flexShrink: 0, width: '100%' }}>
          <AnimatePresence>
            <motion.button
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ delay: 1.8, duration: 0.45, type: 'spring', stiffness: 200 }}
              onClick={handleStart}
              disabled={started}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              style={{
                padding: 'clamp(10px, 1.6vh, 13px) clamp(22px, 5.5vw, 34px)',
                borderRadius: '50px',
                border: 'none',
                cursor: started ? 'default' : 'pointer',
                background: 'linear-gradient(135deg, #FF6EB4 0%, #E91E8C 55%, #C2185B 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 'clamp(0.82rem, 3.4vw, 0.98rem)',
                letterSpacing: '0.02em',
                boxShadow: '0 5px 22px rgba(233, 30, 140, 0.38)',
                position: 'relative',
                overflow: 'hidden',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {/* Shimmer sweep effect */}
              <motion.span
                animate={{ x: ['-100%', '220%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)',
                  pointerEvents: 'none'
                }}
              />
              {started ? (
                <>
                  <SparkleIcon size={18} color1="#FFFFFF" color2="#FFE082" />
                  <span>Opening Adventure Gate...</span>
                </>
              ) : (
                <>
                  <ButtonHeartIcon size={20} />
                  <span>Start My Birthday Adventure</span>
                </>
              )}
            </motion.button>
          </AnimatePresence>

          {/* ── Mini pulsing heart indicator ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            {['#FF85A2', '#FF69B4', '#C084FC'].map((color, i) => (
              <motion.span
                key={i}
                animate={{ scale: [1, 1.3, 1], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                style={{ display: 'inline-flex' }}
              >
                <MiniHeartIcon size={13} color={color} />
              </motion.span>
            ))}
          </motion.div>
        </div>

      </div>

      {/* ── MAGICAL ADVENTURE GATE & PORTAL FLASH TRANSITION ── */}
      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              perspective: '1400px',
              overflow: 'hidden',
              pointerEvents: 'all',
            }}
          >
            {/* 1. Behind the Gates: Intense White-Golden Radial Blast */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0.3, 0.8, 1, 1],
                scale: [0.8, 1.1, 1.8, 2.6, 3.2],
              }}
              transition={{ duration: 2.0, times: [0, 0.3, 0.6, 0.85, 1], ease: "easeInOut" }}
              style={{
                position: 'absolute',
                inset: '-30%',
                background: 'radial-gradient(circle at center, #FFFFFF 0%, #FFFDE7 25%, #FFE082 48%, #FF80AB 72%, #E91E8C 100%)',
                zIndex: 1,
              }}
            />

            {/* 2. Rotating Celestial Light Rays */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: [0, 0.4, 0.85, 1], rotate: 140 }}
              transition={{ duration: 2.0, times: [0, 0.35, 0.65, 1], ease: "linear" }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '220vmax',
                height: '220vmax',
                transform: 'translate(-50%, -50%)',
                background: 'conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.95) 0deg, transparent 15deg, rgba(255,235,150,0.9) 30deg, transparent 45deg, rgba(255,255,255,0.95) 60deg, transparent 75deg, rgba(255,235,150,0.9) 90deg, transparent 105deg, rgba(255,255,255,0.95) 120deg, transparent 135deg, rgba(255,255,255,0.95) 150deg, transparent 165deg, rgba(255,235,150,0.9) 180deg, transparent 195deg, rgba(255,255,255,0.95) 210deg, transparent 225deg, rgba(255,255,255,0.95) 240deg, transparent 255deg, rgba(255,235,150,0.9) 270deg, transparent 285deg, rgba(255,255,255,0.95) 300deg, transparent 315deg, rgba(255,255,255,0.95) 330deg, transparent 345deg, rgba(255,255,255,0.95) 360deg)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            {/* 3. Left Gate Door */}
            <motion.div
              initial={{ x: '0%', rotateY: 0 }}
              animate={{
                x: ['0%', '0%', '-105%'],
                rotateY: [0, -6, -85],
              }}
              transition={{ duration: 1.9, times: [0, 0.42, 1], ease: [0.65, 0, 0.35, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                transformOrigin: 'left center',
                background: 'linear-gradient(135deg, #2D0826 0%, #5E1446 50%, #20042A 100%)',
                borderRight: '3px solid #FFD54F',
                boxShadow: '18px 0 40px rgba(0,0,0,0.7), inset -6px 0 28px rgba(255,215,0,0.45)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '12px',
                boxSizing: 'border-box',
              }}
            >
              {/* Gate Ornaments */}
              <div style={{
                position: 'absolute',
                inset: '16px 8px 16px 16px',
                border: '2px solid rgba(255, 215, 0, 0.65)',
                borderRadius: '16px 0 0 16px',
                background: 'radial-gradient(circle at 100% 50%, rgba(255,105,180,0.25) 0%, transparent 65%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '12px',
              }}>
                {/* Left Heart Seal Half */}
                <div style={{
                  width: '38px',
                  height: '76px',
                  border: '3px solid #FFE082',
                  borderRight: 'none',
                  borderRadius: '76px 0 0 76px',
                  background: 'linear-gradient(90deg, #FF4081, #FFD54F)',
                  boxShadow: '-4px 0 20px rgba(255,215,0,0.9)',
                }} />
              </div>
            </motion.div>

            {/* 4. Right Gate Door */}
            <motion.div
              initial={{ x: '0%', rotateY: 0 }}
              animate={{
                x: ['0%', '0%', '105%'],
                rotateY: [0, 6, 85],
              }}
              transition={{ duration: 1.9, times: [0, 0.42, 1], ease: [0.65, 0, 0.35, 1] }}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                transformOrigin: 'right center',
                background: 'linear-gradient(225deg, #2D0826 0%, #5E1446 50%, #20042A 100%)',
                borderLeft: '3px solid #FFD54F',
                boxShadow: '-18px 0 40px rgba(0,0,0,0.7), inset 6px 0 28px rgba(255,215,0,0.45)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '12px',
                boxSizing: 'border-box',
              }}
            >
              {/* Gate Ornaments */}
              <div style={{
                position: 'absolute',
                inset: '16px 16px 16px 8px',
                border: '2px solid rgba(255, 215, 0, 0.65)',
                borderRadius: '0 16px 16px 0',
                background: 'radial-gradient(circle at 0% 50%, rgba(255,105,180,0.25) 0%, transparent 65%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '12px',
              }}>
                {/* Right Heart Seal Half */}
                <div style={{
                  width: '38px',
                  height: '76px',
                  border: '3px solid #FFE082',
                  borderLeft: 'none',
                  borderRadius: '0 76px 76px 0',
                  background: 'linear-gradient(270deg, #FF4081, #FFD54F)',
                  boxShadow: '4px 0 20px rgba(255,215,0,0.9)',
                }} />
              </div>
            </motion.div>

            {/* 5. Center Golden Heart Crest Flash */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.3, 3, 7],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.6, times: [0, 0.35, 0.6, 1], ease: "easeOut" }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
                pointerEvents: 'none',
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FFFFFF 0%, #FFE082 40%, #FF4081 70%, transparent 100%)',
                boxShadow: '0 0 70px 35px rgba(255, 225, 120, 0.95), 0 0 120px 70px rgba(255, 64, 129, 0.7)',
              }} />
            </motion.div>

            {/* 6. Blinding White-Gold Flash (Washes screen at transition point) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.25, 0.95, 1] }}
              transition={{ duration: 2.0, times: [0, 0.45, 0.7, 0.9, 1], ease: "easeIn" }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, #FFFFFF 60%, #FFF8E7 100%)',
                zIndex: 50,
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}