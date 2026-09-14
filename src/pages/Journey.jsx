import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import confetti from 'canvas-confetti';
import FloatingHearts from '../components/animations/FloatingHearts';
import Sparkles from '../components/animations/Sparkles';
import dudububFront from '/dudu_bubu_front.png';

/* ── Checkpoint / Level Definitions ── */
const LEVELS = [
  {
    id: 1,
    title: 'Puzzle of Memories',
    desc: 'Piece together a special photo',
    icon: PuzzleIcon,
    route: '/level1',
    themeColor: '#FF69B4',
    zone: 'Meadow of Beginnings'
  },
  {
    id: 2,
    title: 'Secret Nicknames',
    desc: 'Solve the cute names I call you with love',
    icon: LettersPuzzleIcon,
    route: '/level2',
    themeColor: '#FFA000',
    zone: 'Whispering Forest'
  },
  {
    id: 3,
    title: 'Cake Decoration Challenge',
    desc: 'Recreate the luxury 21st birthday cake',
    icon: LuxuryCakeIcon,
    route: '/level3',
    themeColor: '#D4AF37',
    zone: 'Royal Atelier'
  },
  {
    id: 4,
    title: 'Mystery Gift Box',
    desc: 'Track the shuffled box with the secret surprise',
    icon: MysteryBoxIcon,
    route: '/level4',
    themeColor: '#9C27B0',
    zone: 'Starry Ridge'
  },
  {
    id: 5,
    title: 'Heart Collection',
    desc: 'Catch falling magical hearts!',
    icon: HeartGameIcon,
    route: '/level5',
    themeColor: '#E91E8C',
    zone: 'Cupid Lake'
  },
  {
    id: 6,
    title: 'The Secret Gift',
    desc: 'Love Letter & Secret Photo Album await inside...',
    icon: GiftFinalIcon,
    route: '/final',
    themeColor: '#D81B60',
    zone: 'Royal Treasure Peak',
    isGrandFinale: true
  },
];

export default function Journey() {
  const { completedLevels, isLevelComplete, isLevelUnlocked, progressPercent } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if navigating freshly after completing Level 1, 2, 3, 4, or 5
  const justCompleted = location.state?.justCompleted;
  const newlyUnlocked = location.state?.newlyUnlocked;
  const isWalkingTransition =
    (justCompleted === 1 && newlyUnlocked === 2) ||
    (justCompleted === 2 && newlyUnlocked === 3) ||
    (justCompleted === 3 && newlyUnlocked === 4) ||
    (justCompleted === 4 && newlyUnlocked === 5) ||
    (justCompleted === 5 && newlyUnlocked === 6);
  const walkingFrom = isWalkingTransition ? justCompleted : null;

  const [walkingState, setWalkingState] = useState(isWalkingTransition ? 'walking' : 'idle');

  // Trigger smooth walking & sliding along roadmap curve
  useEffect(() => {
    if (!isWalkingTransition) return;

    // Smooth scroll to focus on the trail
    const scrollTarget =
      walkingFrom === 5 ? 680 : walkingFrom === 4 ? 520 : walkingFrom === 3 ? 340 : walkingFrom === 2 ? 180 : 30;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });

    // Step 1: Slide along the curve to next level (2.6s)
    const walkTimer = setTimeout(() => {
      setWalkingState('unlocking');

      // Step 2: Arrival at Next Level -> Celebration confetti blast!
      const confettiOrigin =
        walkingFrom === 5
          ? { x: 0.5, y: 0.9 }
          : walkingFrom === 4
          ? { x: 0.24, y: 0.8 }
          : walkingFrom === 3
          ? { x: 0.78, y: 0.65 }
          : walkingFrom === 2
          ? { x: 0.24, y: 0.48 }
          : { x: 0.78, y: 0.32 };

      const confettiColors =
        walkingFrom === 5
          ? ['#D81B60', '#FFD700', '#FF80AB', '#FF4081', '#FFFFFF']
          : walkingFrom === 4
          ? ['#E91E8C', '#FF80AB', '#FFD700', '#D4AF37', '#FFFFFF']
          : walkingFrom === 3
          ? ['#9C27B0', '#E1BEE7', '#FF69B4', '#D4AF37', '#FFFFFF']
          : walkingFrom === 2
          ? ['#00BCD4', '#4DD0E1', '#FF69B4', '#FFD700', '#FFFFFF']
          : ['#FFA000', '#FFD700', '#FF69B4', '#FF4081', '#FFFFFF'];

      confetti({
        particleCount: 50,
        spread: 75,
        origin: confettiOrigin,
        colors: confettiColors,
      });

      // Step 3: Transition to normal idle state with level fully active
      const idleTimer = setTimeout(() => {
        setWalkingState('idle');
        // Clear location state so browser refresh doesn't re-trigger walk
        window.history.replaceState({}, document.title);
      }, 1300);

      return () => clearTimeout(idleTimer);
    }, 2600);

    return () => clearTimeout(walkTimer);
  }, [isWalkingTransition, walkingFrom]);

  // Find the current active (playable) level
  const currentActiveLevel = useMemo(() => {
    for (const lvl of LEVELS) {
      if (isLevelUnlocked(lvl.id) && !isLevelComplete(lvl.id)) {
        return lvl.id;
      }
    }
    return 6;
  }, [completedLevels, isLevelComplete, isLevelUnlocked]);

  const handleLevelClick = (level) => {
    if (level.id === 2 && walkingState === 'walking') return; // Wait until unlocked
    if (!isLevelUnlocked(level.id)) return;
    navigate(level.route);
  };

  return (
    <div
      className="min-h-screen pb-24 pt-16 relative overflow-x-hidden select-none"
      style={{
        background: 'linear-gradient(180deg, #FFF0F8 0%, #FFEBF3 18%, #FFF6E8 45%, #F4EAFF 75%, #FFE7F1 100%)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* ── Entrance Portal Flash Dissolution ── */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'radial-gradient(circle at center, #FFFFFF 0%, #FFFDE7 40%, rgba(255,182,193,0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      <FloatingHearts count={6} />
      <Sparkles count={8} />

      {/* ── Top Fixed Navigation & HUD Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-40 px-4 py-2.5 bg-white/75 backdrop-blur-md border-b border-pink-100 flex items-center justify-between shadow-xs">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer border border-pink-200"
        >
          <span>←</span>
          <span>Intro</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-pink-500 uppercase tracking-wide">
            {completedLevels.length} / 6 Cleared
          </span>
          <div className="w-20 h-2.5 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* ── Main Map Content ── */}
      <div className="max-w-md mx-auto px-4 relative z-10 pt-4">

        {/* ── Header Title & Quest Tracker ── */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-semibold text-pink-600 mb-2">
            <SparkleIcon size={14} />
            <span>Birthday Adventure Roadmap</span>
            <SparkleIcon size={14} />
          </div>

          <h1
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(2rem, 8vw, 2.5rem)',
              color: '#D81B60',
              fontWeight: 700,
              lineHeight: 1.15,
              margin: '0 0 6px 0',
              textShadow: '0 2px 12px rgba(216, 27, 96, 0.15)'
            }}
          >
            Quest for Surprises
          </h1>

          <p className="text-gray-600 text-xs max-w-xs mx-auto">
            Follow the magical winding trail to unlock each level and reveal your surprises!
          </p>
        </motion.div>

        {/* ── Winding Adventure Roadmap Track Container ── */}
        <div className="relative py-4" style={{ minHeight: '990px' }}>

          {/* ── SVG Winding Road Path ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 380 990"
            preserveAspectRatio="none"
            style={{ zIndex: 0 }}
          >
            <defs>
              {/* Outer Path Glow */}
              <linearGradient id="roadBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF80AB" stopOpacity="0.45" />
                <stop offset="35%" stopColor="#FFA000" stopOpacity="0.4" />
                <stop offset="65%" stopColor="#C084FC" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FF4081" stopOpacity="0.55" />
              </linearGradient>

              {/* Dashed Adventure Line Gradient */}
              <linearGradient id="roadDashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF4081" />
                <stop offset="25%" stopColor="#FFA000" />
                <stop offset="50%" stopColor="#00BCD4" />
                <stop offset="75%" stopColor="#9C27B0" />
                <stop offset="100%" stopColor="#D81B60" />
              </linearGradient>

              {/* Glowing Active Trail Gradient */}
              <linearGradient id="goldenTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="50%" stopColor="#FFD54F" />
                <stop offset="100%" stopColor="#FF80AB" />
              </linearGradient>
            </defs>

            {/* 1. Base Ribbon Road */}
            <path
              d="M 190 20
                 C 190 60, 95 60, 95 102
                 C 95 180, 285 180, 285 262
                 C 285 340, 95 340, 95 430
                 C 95 500, 285 500, 285 590
                 C 285 660, 95 660, 95 750
                 C 95 820, 190 820, 190 890"
              fill="none"
              stroke="url(#roadBaseGrad)"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* 2. Dashed Golden Adventure Trail */}
            <path
              d="M 190 20
                 C 190 60, 95 60, 95 102
                 C 95 180, 285 180, 285 262
                 C 285 340, 95 340, 95 430
                 C 95 500, 285 500, 285 590
                 C 285 660, 95 660, 95 750
                 C 95 820, 190 820, 190 890"
              fill="none"
              stroke="url(#roadDashGrad)"
              strokeWidth="4"
              strokeDasharray="8 10"
              strokeLinecap="round"
            />

            {/* 3. Dynamic Illuminated Sliding Path Under Feet (Draws while walking) */}
            {walkingState === 'walking' && (
              <motion.path
                d={
                  walkingFrom === 5
                    ? 'M 95 750 C 95 820, 190 820, 190 890'
                    : walkingFrom === 4
                    ? 'M 285 590 C 285 660, 95 660, 95 750'
                    : walkingFrom === 3
                    ? 'M 95 430 C 95 500, 285 500, 285 590'
                    : walkingFrom === 2
                    ? 'M 285 262 C 285 340, 95 340, 95 430'
                    : 'M 95 102 C 95 180, 285 180, 285 262'
                }
                fill="none"
                stroke="url(#goldenTrailGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.6, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.95))' }}
              />
            )}

            {/* Start Flag Marker */}
            <circle cx="190" cy="20" r="7" fill="#FF4081" />
            <circle cx="190" cy="20" r="3.5" fill="#fff" />
          </svg>

          {/* ── Trailhead Start Badge ── */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[-10px] z-10 px-3 py-1 rounded-full bg-white/90 border border-pink-300 shadow-xs flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span className="text-[11px] font-bold text-pink-600">START TRAIL</span>
          </div>

          {/* ── DUDU & BUBU EXACT ROADMAP SLIDING ANIMATION (Follows the curve) ── */}
          <AnimatePresence>
            {walkingState === 'walking' && (
              <motion.div
                initial={
                  walkingFrom === 5
                    ? { top: '750px', left: '25.0%', rotate: 0 }
                    : walkingFrom === 4
                    ? { top: '590px', left: '75.0%', rotate: 0 }
                    : walkingFrom === 3
                    ? { top: '430px', left: '25.0%', rotate: 0 }
                    : walkingFrom === 2
                    ? { top: '262px', left: '75.0%', rotate: 0 }
                    : { top: '102px', left: '25.0%', rotate: 0 }
                }
                animate={
                  walkingFrom === 5
                    ? {
                        top: [
                          '750px',
                          '764px',
                          '782px',
                          '802px',
                          '822px',
                          '844px',
                          '862px',
                          '876px',
                          '884px',
                          '888px',
                          '890px'
                        ],
                        left: [
                          '25.0%',
                          '26.2%',
                          '28.5%',
                          '31.8%',
                          '36.0%',
                          '40.5%',
                          '44.8%',
                          '47.8%',
                          '49.2%',
                          '49.8%',
                          '50.0%'
                        ],
                        rotate: [0, 6, 12, 16, 14, 10, 6, 3, 1, 0],
                      }
                    : walkingFrom === 4
                    ? {
                        top: [
                          '590px',
                          '606px',
                          '625px',
                          '646px',
                          '668px',
                          '690px',
                          '712px',
                          '728px',
                          '740px',
                          '746px',
                          '750px'
                        ],
                        left: [
                          '75.0%',
                          '73.6%',
                          '69.8%',
                          '64.2%',
                          '57.4%',
                          '50.0%',
                          '42.6%',
                          '35.8%',
                          '30.2%',
                          '26.4%',
                          '25.0%'
                        ],
                        rotate: [0, -8, -14, -18, -20, -18, -14, -8, -4, 0],
                      }
                    : walkingFrom === 3
                    ? {
                        top: [
                          '430px',
                          '446px',
                          '465px',
                          '486px',
                          '508px',
                          '530px',
                          '552px',
                          '570px',
                          '584px',
                          '588px',
                          '590px'
                        ],
                        left: [
                          '25.0%',
                          '26.4%',
                          '30.2%',
                          '35.8%',
                          '42.6%',
                          '50.0%',
                          '57.4%',
                          '64.2%',
                          '69.8%',
                          '73.6%',
                          '75.0%'
                        ],
                        rotate: [0, 8, 14, 18, 20, 18, 14, 8, 4, 0],
                      }
                    : walkingFrom === 2
                    ? {
                        top: [
                          '262px',
                          '278px',
                          '297px',
                          '318px',
                          '340px',
                          '362px',
                          '384px',
                          '402px',
                          '416px',
                          '425px',
                          '430px'
                        ],
                        left: [
                          '75.0%',
                          '73.6%',
                          '69.8%',
                          '64.2%',
                          '57.4%',
                          '50.0%',
                          '42.6%',
                          '35.8%',
                          '30.2%',
                          '26.4%',
                          '25.0%'
                        ],
                        rotate: [0, -8, -14, -18, -20, -18, -14, -8, -4, 0],
                      }
                    : {
                        top: [
                          '102px',
                          '123px',
                          '141px',
                          '155px',
                          '168px',
                          '182px',
                          '193px',
                          '206px',
                          '221px',
                          '240px',
                          '262px'
                        ],
                        left: [
                          '25.0%',
                          '26.4%',
                          '30.2%',
                          '35.8%',
                          '42.6%',
                          '50.0%',
                          '57.4%',
                          '64.2%',
                          '69.8%',
                          '73.6%',
                          '75.0%'
                        ],
                        rotate: [0, 8, 14, 18, 20, 18, 14, 8, 4, 0],
                      }
                }
                transition={{
                  duration: 2.6,
                  ease: 'easeInOut',
                  times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                }}
                className="absolute z-40 flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-1/2"
              >
                {/* Speech Bubble */}
                <motion.div
                  animate={{ scale: [0.94, 1.06, 0.94] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="bg-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md mb-0.5 border border-pink-300 flex items-center gap-1"
                >
                  <span>
                    {walkingFrom === 5
                      ? 'To The Grand Finale! 🎁👑'
                      : walkingFrom === 4
                      ? 'Sliding to Level 5! 💖✨'
                      : walkingFrom === 3
                      ? 'Sliding to Level 4! 🎁✨'
                      : walkingFrom === 2
                      ? 'Sliding to Level 3! 🎂✨'
                      : 'Sliding to Level 2! 🐾✨'}
                  </span>
                </motion.div>

                {/* Hopping Character while sliding */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.32, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <img
                    src={dudububFront}
                    alt="Dudu Bubu Sliding Along Road"
                    className="w-12 h-12 object-contain filter drop-shadow-md"
                  />
                </motion.div>

                {/* Sparkling footprint trail */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="text-[10px] text-pink-500 font-bold"
                >
                  ✨ 🐾
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── LEVEL 1: Puzzle of Memories ── */}
          <LevelCheckpointNode
            level={LEVELS[0]}
            top={70}
            align="left"
            done={isLevelComplete(1)}
            unlocked={isLevelUnlocked(1)}
            // Hide static avatar on Level 1 if walking is happening
            isActive={walkingState === 'idle' && currentActiveLevel === 1}
            onClick={() => handleLevelClick(LEVELS[0])}
          />

          {/* ── LEVEL 2: Secret Nicknames ── */}
          <LevelCheckpointNode
            level={LEVELS[1]}
            top={230}
            align="right"
            done={isLevelComplete(2)}
            // During walking from 1, level 2 is shown locked until arrival!
            unlocked={walkingFrom === 1 && walkingState === 'walking' ? false : isLevelUnlocked(2)}
            isActive={walkingState === 'idle' && currentActiveLevel === 2}
            isUnlockingNow={walkingFrom === 1 && walkingState === 'unlocking'}
            onClick={() => handleLevelClick(LEVELS[1])}
          />

          {/* ── LEVEL 3: Cake Decoration Challenge ── */}
          <LevelCheckpointNode
            level={LEVELS[2]}
            top={390}
            align="left"
            done={isLevelComplete(3)}
            // During walking from 2, level 3 is shown locked until arrival!
            unlocked={walkingFrom === 2 && walkingState === 'walking' ? false : isLevelUnlocked(3)}
            isActive={walkingState === 'idle' && currentActiveLevel === 3}
            isUnlockingNow={walkingFrom === 2 && walkingState === 'unlocking'}
            onClick={() => handleLevelClick(LEVELS[2])}
          />

          {/* ── LEVEL 4: Mystery Gift Box ── */}
          <LevelCheckpointNode
            level={LEVELS[3]}
            top={550}
            align="right"
            done={isLevelComplete(4)}
            // During walking from 3, level 4 is shown locked until arrival!
            unlocked={walkingFrom === 3 && walkingState === 'walking' ? false : isLevelUnlocked(4)}
            isActive={walkingState === 'idle' && currentActiveLevel === 4}
            isUnlockingNow={walkingFrom === 3 && walkingState === 'unlocking'}
            onClick={() => handleLevelClick(LEVELS[3])}
          />

          {/* ── LEVEL 5: Heart Collection ── */}
          <LevelCheckpointNode
            level={LEVELS[4]}
            top={710}
            align="left"
            done={isLevelComplete(5)}
            // During walking from 4, level 5 is shown locked until arrival!
            unlocked={walkingFrom === 4 && walkingState === 'walking' ? false : isLevelUnlocked(5)}
            isActive={walkingState === 'idle' && currentActiveLevel === 5}
            isUnlockingNow={walkingFrom === 4 && walkingState === 'unlocking'}
            onClick={() => handleLevelClick(LEVELS[4])}
          />

          {/* ── LEVEL 6: The Secret Gift Grand Finale ── */}
          <div
            style={{
              position: 'absolute',
              top: '865px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '94%',
              maxWidth: '370px',
              zIndex: 25,
            }}
          >
            <motion.div
              whileHover={isLevelUnlocked(6) && (walkingFrom !== 5 || walkingState !== 'walking') ? { scale: 1.03 } : {}}
              whileTap={isLevelUnlocked(6) && (walkingFrom !== 5 || walkingState !== 'walking') ? { scale: 0.96 } : {}}
              onClick={() => handleLevelClick(LEVELS[5])}
              className={`p-4 rounded-3xl relative overflow-hidden transition-all duration-300 border-2 ${
                isLevelComplete(6)
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-xl shadow-pink-500/30 border-yellow-300'
                  : isLevelUnlocked(6) && (walkingFrom !== 5 || walkingState !== 'walking')
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xl shadow-pink-500/30 border-yellow-300 cursor-pointer animate-pulse'
                  : 'bg-white/70 backdrop-blur-md text-gray-500 border-pink-200/80 opacity-75 cursor-not-allowed'
              }`}
            >
              {/* Grand finale aura shimmer */}
              {isLevelUnlocked(6) && (walkingFrom !== 5 || walkingState !== 'walking') && (
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                />
              )}

              {/* Dudu Bubu at Grand Finale if unlocked */}
              {currentActiveLevel === 6 && (
                <motion.div
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-10 right-4 z-30"
                >
                  <img
                    src={dudububFront}
                    alt="Dudu Bubu"
                    className="w-14 h-14 object-contain filter drop-shadow-md"
                  />
                  <span className="absolute -bottom-1 -left-2 bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-xs">
                    FINAL SURPRISE! 👑
                  </span>
                </motion.div>
              )}

              <div className="flex items-center gap-3.5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                    isLevelUnlocked(6)
                      ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-pink-900'
                      : 'bg-pink-100 text-pink-400'
                  }`}
                >
                  <GiftFinalIcon size={30} color={isLevelUnlocked(6) ? '#C2185B' : '#FF85A2'} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-400/30 text-yellow-800">
                      FINAL QUEST 👑
                    </span>
                    {isLevelComplete(6) && <span className="text-yellow-200 text-xs">⭐⭐⭐</span>}
                  </div>
                  <h3 className="font-bold text-base mt-0.5 leading-snug">
                    The Secret Birthday Gift
                  </h3>
                  <p className={`text-xs mt-0.5 ${isLevelUnlocked(6) ? 'text-pink-100' : 'text-gray-400'}`}>
                    {isLevelUnlocked(6)
                      ? 'Contains Love Letter & Secret Photo Album! 📸💌'
                      : 'Complete all 5 levels to unlock the secret gift'}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {isLevelComplete(6) ? (
                    <StarIcon size={24} color="#FFD700" />
                  ) : isLevelUnlocked(6) ? (
                    <motion.div
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="w-9 h-9 rounded-full bg-white text-pink-600 font-bold flex items-center justify-center text-sm shadow-md"
                    >
                      ▶
                    </motion.div>
                  ) : (
                    <LockIcon size={20} color="#FF85A2" />
                  )}
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ── 21 Years Milestone Celebration Banner ── */}
        <motion.div
          className="mt-6 bg-white/70 backdrop-blur-md rounded-3xl p-4 text-center border border-pink-200/80 shadow-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-sm">👑</span>
            <p className="font-heading text-pink-500 text-xl font-bold">21 Years of Awesome</p>
            <span className="text-sm">✨</span>
          </div>

          <p className="text-gray-500 text-xs">
            15 September 2005 • Making the world infinitely brighter
          </p>

          <div className="flex justify-center flex-wrap gap-1 mt-3 max-w-[280px] mx-auto">
            {Array.from({ length: 21 }, (_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-pink-400"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ delay: i * 0.05, duration: 1.4, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ── Checkpoint Node Component (Adventure Pin + Quest Info Card) ── */
function LevelCheckpointNode({ level, top, align, done, unlocked, isActive, isUnlockingNow, onClick }) {
  const Icon = level.icon;
  const isLeft = align === 'left';

  return (
    <div
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: 0,
        right: 0,
        zIndex: 15,
      }}
      className="flex items-center justify-between px-2"
    >
      {/* If align is LEFT: [Island Node] -> [Quest Card] */}
      {/* If align is RIGHT: [Quest Card] -> [Island Node] */}

      {/* ── 1. Left Component (Island or Card) ── */}
      {isLeft ? (
        <IslandPin
          level={level}
          done={done}
          unlocked={unlocked}
          isActive={isActive}
          isUnlockingNow={isUnlockingNow}
          onClick={onClick}
          Icon={Icon}
        />
      ) : (
        <QuestInfoCard
          level={level}
          done={done}
          unlocked={unlocked}
          isActive={isActive}
          isUnlockingNow={isUnlockingNow}
          onClick={onClick}
        />
      )}

      {/* ── 2. Right Component (Card or Island) ── */}
      {isLeft ? (
        <QuestInfoCard
          level={level}
          done={done}
          unlocked={unlocked}
          isActive={isActive}
          isUnlockingNow={isUnlockingNow}
          onClick={onClick}
        />
      ) : (
        <IslandPin
          level={level}
          done={done}
          unlocked={unlocked}
          isActive={isActive}
          isUnlockingNow={isUnlockingNow}
          onClick={onClick}
          Icon={Icon}
        />
      )}
    </div>
  );
}

/* ── 3D Adventure Island Checkpoint Pin ── */
function IslandPin({ level, done, unlocked, isActive, isUnlockingNow, onClick, Icon }) {
  return (
    <div className="relative flex-shrink-0">

      {/* Shockwave ripple when unlocking now */}
      {isUnlockingNow && (
        <motion.div
          initial={{ scale: 0.8, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute -inset-3 rounded-full border-4 border-yellow-400 pointer-events-none"
        />
      )}

      {/* Radar beacon waves if Active */}
      {isActive && (
        <>
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            className="absolute -inset-2.5 rounded-full bg-pink-400 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            className="absolute -inset-4 rounded-full bg-pink-300 pointer-events-none"
          />
        </>
      )}

      {/* Mini Dudu Bubu Companion avatar on active level */}
      {isActive && (
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
        >
          <span className="bg-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-xs mb-0.5">
            {isUnlockingNow ? 'Level 2 Unlocked! 🎉' : 'You are here! 🐾'}
          </span>
          <img
            src={dudububFront}
            alt="Dudu Bubu"
            className="w-10 h-10 object-contain filter drop-shadow-sm"
          />
        </motion.div>
      )}

      {/* Circular Pin Base */}
      <motion.button
        whileHover={unlocked ? { scale: 1.1 } : {}}
        whileTap={unlocked ? { scale: 0.92 } : {}}
        onClick={onClick}
        disabled={!unlocked}
        className={`w-16 h-16 rounded-full flex flex-col items-center justify-center relative shadow-md transition-all duration-300 ${
          done
            ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white ring-4 ring-yellow-300 shadow-pink-500/25 cursor-pointer'
            : isActive
            ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white ring-4 ring-pink-300 shadow-pink-500/40 cursor-pointer animate-pulse'
            : unlocked
            ? 'bg-white text-pink-600 ring-4 ring-pink-200 cursor-pointer'
            : 'bg-white/50 text-gray-400 ring-4 ring-gray-200/60 cursor-not-allowed opacity-60 backdrop-blur-xs'
        }`}
      >
        {/* Level Tag on Top of Pin */}
        <span
          className={`absolute -top-2 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase shadow-2xs ${
            done
              ? 'bg-yellow-400 text-pink-900'
              : isActive
              ? 'bg-pink-700 text-white'
              : 'bg-pink-100 text-pink-600'
          }`}
        >
          Lvl {level.id}
        </span>

        {/* Icon in Pin Center */}
        <Icon size={24} color={done || isActive ? '#FFFFFF' : unlocked ? level.themeColor : '#A0AEC0'} />

        {/* Star Badge on Completed */}
        {done && (
          <span className="absolute -bottom-1.5 bg-yellow-400 text-pink-900 rounded-full px-1 text-[9px] font-bold shadow-2xs">
            ⭐ Done
          </span>
        )}

        {/* Padlock Icon if locked */}
        {!unlocked && (
          <div className="absolute inset-0 rounded-full bg-black/10 flex items-center justify-center">
            <LockIcon size={16} color="#718096" />
          </div>
        )}
      </motion.button>
    </div>
  );
}

/* ── Quest Information Card (Beside the island) ── */
function QuestInfoCard({ level, done, unlocked, isActive, isUnlockingNow, onClick }) {
  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.02 } : {}}
      whileTap={unlocked ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`p-3 rounded-2xl border transition-all duration-300 w-[68%] max-w-[235px] ${
        done
          ? 'bg-white/85 backdrop-blur-md border-pink-200 shadow-sm cursor-pointer'
          : isActive || isUnlockingNow
          ? 'bg-white/95 backdrop-blur-md border-pink-400 shadow-md shadow-pink-500/15 ring-2 ring-pink-200 cursor-pointer'
          : unlocked
          ? 'bg-white/80 backdrop-blur-md border-pink-200 shadow-xs cursor-pointer'
          : 'bg-white/45 backdrop-blur-xs border-gray-200/60 opacity-65 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
          style={{ background: `${level.themeColor}20`, color: level.themeColor }}
        >
          {level.zone}
        </span>
        {done && <CheckBadge />}
      </div>

      <h3 className="font-bold text-gray-800 text-xs leading-tight">
        {level.title}
      </h3>

      <p className="text-gray-500 text-[11px] leading-tight mt-0.5 line-clamp-1">
        {level.desc}
      </p>

      {/* Action status button */}
      <div className="mt-2 pt-1.5 border-t border-pink-100/60 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-400">
          {done ? 'Cleared' : unlocked ? 'Ready' : `Lock (Lvl ${level.id - 1})`}
        </span>

        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            done
              ? 'bg-pink-100 text-pink-600'
              : isActive || isUnlockingNow
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
              : unlocked
              ? 'bg-pink-50 text-pink-600 border border-pink-200'
              : 'text-gray-400'
          }`}
        >
          {done ? 'Replay ↻' : isActive || isUnlockingNow ? 'PLAY NOW ▶' : unlocked ? 'Start →' : 'Locked 🔒'}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── SVG Icons ─── */
function PuzzleIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <circle cx="7" cy="7" r="1.5" fill={color}/>
    </svg>
  );
}

function MapIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/>
      <line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  );
}

function LettersPuzzleIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <path d="M6 9l1-4 1 4" />
      <path d="M6.5 8h1" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <path d="M15 5h2a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1h-2v2h2a1 1 0 0 1 1 1v0a1 1 0 0 1-1 1h-2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <path d="M5 17h4" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill={color} fillOpacity="0.15" />
      <path d="M17 15.5l.5-.5a1 1 0 0 1 1.4 1.4l-1.9 1.9-1.9-1.9a1 1 0 0 1 1.4-1.4l.5.5z" fill={color} />
    </svg>
  );
}

function LuxuryCakeIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16v-4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4z" />
      <path d="M7 14v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
      <path d="M12 4v4" />
      <circle cx="12" cy="3" r="1" fill={color} />
      <line x1="2" y1="20" x2="22" y2="20" strokeWidth="2" />
    </svg>
  );
}

function WheelIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="2" x2="12" y2="9"/>
      <line x1="12" y1="15" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="9" y2="12"/>
      <line x1="15" y1="12" x2="22" y2="12"/>
    </svg>
  );
}

function MysteryBoxIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5" rx="1"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

function QuizIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function HeartGameIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function GiftFinalIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5" rx="1"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  );
}

function LockIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function StarIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l5.91-.91z"/>
    </svg>
  );
}

function SparkleIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFB300">
      <path d="M12 2C12.4 7.2 16.8 11.6 22 12C16.8 12.4 12.4 16.8 12 22C11.6 16.8 7.2 12.4 2 12C7.2 11.6 11.6 7.2 12 2Z"/>
    </svg>
  );
}

function CheckBadge() {
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  );
}
