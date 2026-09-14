import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import confetti from 'canvas-confetti';
import FloatingHearts from '../components/animations/FloatingHearts';
import Sparkles from '../components/animations/Sparkles';
import dudububFront from '/dudu_bubu_front.png';

/* ── 8 Sweet Nicknames (Ordered from tutorial/easy to tricky boss level) ── */
const NICKNAMES = [
  {
    id: 1,
    word: 'Baby',
    // Pre-filled letters: 'B' at 0, 'b' at 2
    initialSlots: [
      { char: 'B', fixed: true },
      { char: null, fixed: false },
      { char: 'b', fixed: true },
      { char: null, fixed: false }
    ],
    availableLetters: ['a', 'y', 'e', 'm'],
    message: 'Mera sabse pyara Baby! 🥰',
    subtext: 'You will always be my little baby no matter how old you get ❤️',
    hintText: "Mera sabse favourite aur sweet naam... B _ b _",
  },
  {
    id: 2,
    word: 'Motu',
    initialSlots: [
      { char: 'M', fixed: true },
      { char: null, fixed: false },
      { char: 't', fixed: true },
      { char: null, fixed: false }
    ],
    availableLetters: ['o', 'u', 'a', 'p', 'i'],
    message: 'Meri sabse cute Motu! 🐻❤️',
    subtext: 'Bolo ya na bolo, meri sabse pyari aur cute motu tum hi ho!',
    hintText: "Chhota sa, golu sa naam jo main pyaar se bolta hoon... M _ t _",
  },
  {
    id: 3,
    word: 'AAloo',
    initialSlots: [
      { char: null, fixed: false },
      { char: 'A', fixed: true },
      { char: null, fixed: false },
      { char: 'o', fixed: true },
      { char: null, fixed: false }
    ],
    availableLetters: ['A', 'l', 'o', 'k', 'u', 'm'],
    message: 'Mera pyara sa AAloo! 🥔✨',
    subtext: 'Round and cute, exactly like my favorite aloo.',
    hintText: "Sabki pasandida sabji jaisi gol matol... _ A _ o _",
  },
  {
    id: 4,
    word: 'Rasgulla',
    initialSlots: [
      { char: 'R', fixed: true },
      { char: null, fixed: false },
      { char: 's', fixed: true },
      { char: null, fixed: false },
      { char: 'u', fixed: true },
      { char: null, fixed: false },
      { char: 'l', fixed: true },
      { char: null, fixed: false }
    ],
    availableLetters: ['a', 'g', 'l', 'a', 'm', 'e', 'o'],
    message: 'Mera meetha sa Rasgulla! 🍬🤍',
    subtext: 'White, soft, aur itna sweet ki saara din khushi se bhar jaye!',
    hintText: "Bengal ki sabse meethi mithai... R _ s _ u _ l _",
  },
  {
    id: 5,
    word: 'Rasmalai',
    initialSlots: [
      { char: null, fixed: false },
      { char: 'a', fixed: true },
      { char: null, fixed: false },
      { char: 'm', fixed: true },
      { char: null, fixed: false },
      { char: 'l', fixed: true },
      { char: null, fixed: false },
      { char: 'i', fixed: true }
    ],
    availableLetters: ['R', 's', 'a', 'a', 'e', 'k', 'y', 'u'],
    message: 'Meri royal Rasmalai! 🍮✨',
    subtext: 'Soft, delicate, aur pure sweetness in my life.',
    hintText: "Rabdi me doobi hui royal mithai... _ a _ m _ l _ i",
  },
  {
    id: 6,
    word: 'Gol gappa',
    initialSlots: [
      { char: 'G', fixed: true },
      { char: null, fixed: false },
      { char: 'l', fixed: true },
      { char: ' ', fixed: true, isSpace: true },
      { char: null, fixed: false },
      { char: 'a', fixed: true },
      { char: null, fixed: false },
      { char: 'p', fixed: true },
      { char: null, fixed: false }
    ],
    availableLetters: ['o', 'g', 'p', 'a', 'r', 'm', 'i', 't'],
    message: 'Meri chatpati Gol gappa! 😋❤️',
    subtext: 'Full of fun, teekhi-meethi, aur unstoppable laughter!',
    hintText: "Pani puri ka dusra chatpata naam... G _ l   _ a _ p _",
  },
  {
    id: 7,
    word: 'Golu Molu',
    initialSlots: [
      { char: 'G', fixed: true },
      { char: null, fixed: false },
      { char: 'l', fixed: true },
      { char: null, fixed: false },
      { char: ' ', fixed: true, isSpace: true },
      { char: 'M', fixed: true },
      { char: null, fixed: false },
      { char: 'l', fixed: true },
      { char: null, fixed: false }
    ],
    availableLetters: ['o', 'u', 'o', 'u', 'a', 'e', 'p', 'r'],
    message: 'Mera Golu sa Molu sa bacha! 🌸🤗',
    subtext: 'The softest cheeks, cutest pout, and warmest hugs in this world.',
    hintText: "Dono gaal jisse kheenchne ka mann kare... G _ l _   M _ l _",
  },
  {
    id: 8,
    word: 'kuchhupuchhu',
    initialSlots: [
      { char: 'k', fixed: true },
      { char: null, fixed: false },
      { char: 'c', fixed: true },
      { char: null, fixed: false },
      { char: null, fixed: false },
      { char: 'u', fixed: true },
      { char: null, fixed: false },
      { char: 'u', fixed: true },
      { char: null, fixed: false },
      { char: 'h', fixed: true },
      { char: null, fixed: false },
      { char: null, fixed: false }
    ],
    availableLetters: ['u', 'h', 'h', 'p', 'c', 'h', 'u', 'a', 'e', 'm', 'o'],
    message: 'Mera ultimate kuchhupuchhu! 👑💖',
    subtext: 'My most special secret nickname that is reserved ONLY for you forever!',
    hintText: "Sabse special aur tricky naam jo sirf main bolta hoon!",
  },
];

export default function Level2Hunt() {
  const navigate = useNavigate();
  const { completeLevel, addAchievement, isLevelComplete } = useGame();

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentNick = NICKNAMES[currentIndex];

  // Current state of slots: copy of initialSlots with filled values
  const [slots, setSlots] = useState(() =>
    currentNick.initialSlots.map(s => ({ ...s }))
  );

  // Pool of available letter chips: array of { id, letter, used }
  const [letterPool, setLetterPool] = useState(() =>
    currentNick.availableLetters.map((l, i) => ({ id: i, letter: l, used: false }))
  );

  const [shakeError, setShakeError] = useState(false);
  const [showNickSuccess, setShowNickSuccess] = useState(false);
  const [allFinished, setAllFinished] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  // Check if Level 2 is already complete
  useEffect(() => {
    if (isLevelComplete(2)) {
      // If already done, let user still play or jump to end
    }
  }, []);

  // When moving to the next nickname, reinitialize slots and letter pool
  useEffect(() => {
    setSlots(currentNick.initialSlots.map(s => ({ ...s })));
    setLetterPool(
      currentNick.availableLetters.map((l, i) => ({ id: i, letter: l, used: false }))
    );
    setShowNickSuccess(false);
    setShakeError(false);
  }, [currentIndex]);

  // Handle clicking an available letter chip from the pool
  const handleSelectLetter = (poolItem) => {
    if (poolItem.used || showNickSuccess) return;

    // Find the first empty slot
    const firstEmptyIndex = slots.findIndex(s => !s.fixed && s.char === null && !s.isSpace);
    if (firstEmptyIndex === -1) return;

    // Place letter into slot and record poolItemId so we can return it
    const updatedSlots = [...slots];
    updatedSlots[firstEmptyIndex] = {
      ...updatedSlots[firstEmptyIndex],
      char: poolItem.letter,
      poolItemId: poolItem.id,
    };
    setSlots(updatedSlots);

    // Mark letter in pool as used
    setLetterPool(prev =>
      prev.map(item => (item.id === poolItem.id ? { ...item, used: true } : item))
    );

    // Check if word is now fully filled
    const allFilled = updatedSlots.every(s => s.char !== null || s.isSpace);
    if (allFilled) {
      checkWord(updatedSlots);
    }
  };

  // Handle clicking a placed letter in a slot to return it to the pool
  const handleRemoveSlot = (slotIdx) => {
    const slot = slots[slotIdx];
    if (slot.fixed || slot.char === null || slot.isSpace || showNickSuccess) return;

    // Return letter to pool
    const returnedPoolId = slot.poolItemId;
    setLetterPool(prev =>
      prev.map(item => (item.id === returnedPoolId ? { ...item, used: false } : item))
    );

    // Clear slot
    const updatedSlots = [...slots];
    updatedSlots[slotIdx] = {
      ...updatedSlots[slotIdx],
      char: null,
      poolItemId: undefined,
    };
    setSlots(updatedSlots);
    setShakeError(false);
  };

  // Verify whether the formed word matches the target nickname
  const checkWord = (formedSlots) => {
    const spelled = formedSlots.map(s => s.char || '').join('');
    const target = currentNick.word;

    if (spelled.toLowerCase() === target.toLowerCase()) {
      // Correct!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FF69B4', '#FFA000', '#FF80AB', '#FFD700', '#FFFFFF']
      });

      setTimeout(() => {
        setShowNickSuccess(true);
        if (currentIndex === NICKNAMES.length - 1) {
          // All 8 completed!
          completeLevel(2);
          addAchievement({ id: 'level2' });
          setAllFinished(true);
        }
      }, 350);
    } else {
      // Wrong word! Shake and notify
      setShakeError(true);
      setTimeout(() => setShakeError(false), 700);
    }
  };

  // Clear all non-fixed slots
  const handleClearSlots = () => {
    setSlots(currentNick.initialSlots.map(s => ({ ...s })));
    setLetterPool(prev => prev.map(item => ({ ...item, used: false })));
    setShakeError(false);
  };

  // Next Nickname
  const handleNextNickname = () => {
    if (currentIndex < NICKNAMES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Return to Adventure Map with walking transition to Level 3!
  const handleReturnToMap = () => {
    navigate('/journey', { state: { justCompleted: 2, newlyUnlocked: 3 } });
  };

  return (
    <div
      className="min-h-screen pt-16 pb-24 flex flex-col items-center select-none"
      style={{
        background: 'linear-gradient(135deg, #FFF6E8 0%, #FFF0F8 50%, #FFE4F2 100%)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <FloatingHearts count={6} />
      <Sparkles count={6} />

      <div className="max-w-md w-full px-4 relative z-10">

        {/* ── Top Header Bar ── */}
        <motion.div
          className="text-center mt-3 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-300 shadow-2xs">
            <span>Level 2 • Nickname Quest</span>
          </div>

          <h1
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(2rem, 7.5vw, 2.5rem)',
              color: '#C2185B',
              fontWeight: 700,
              lineHeight: 1.15,
              margin: '0 0 4px 0',
              textShadow: '0 2px 10px rgba(194, 24, 91, 0.15)'
            }}
          >
            Secret Nicknames
          </h1>

          <p className="text-gray-600 text-xs max-w-xs mx-auto">
            Find the missing letters to complete the sweet names I call you with love ❤️
          </p>

          {/* Progress Indicator (1 to 8) */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {NICKNAMES.map((n, idx) => (
              <motion.div
                key={n.id}
                animate={{
                  scale: idx === currentIndex ? [1, 1.25, 1] : 1,
                }}
                transition={{ duration: 1, repeat: idx === currentIndex ? Infinity : 0 }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx < currentIndex
                    ? 'w-4 bg-emerald-400'
                    : idx === currentIndex
                    ? 'w-6 bg-pink-500 shadow-xs'
                    : 'w-2 bg-pink-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-pink-600 mt-1 block">
            Nickname {currentIndex + 1} of {NICKNAMES.length}
          </span>
        </motion.div>

        {/* ── First-Time Tutorial Box (For 'Baby') ── */}
        <AnimatePresence>
          {currentIndex === 0 && showTutorial && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3.5 p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm flex items-start gap-2.5 relative"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-200 flex items-center justify-center text-lg flex-shrink-0">
                💡
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-xs font-bold text-amber-900">How to Play Tutorial:</h4>
                <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                  Some letters are already placed! Look at the missing empty boxes below, then <strong>tap the correct letters from the bottom</strong> to spell the nickname!
                </p>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-amber-700 hover:text-amber-900 text-xs font-bold px-1.5 py-0.5 rounded-md hover:bg-amber-100"
              >
                Got it!
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Puzzle Card ── */}
        <motion.div
          className="bg-white/85 backdrop-blur-md rounded-3xl p-5 shadow-xl border border-pink-200/90 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Cute Hint Banner */}
          <div className="mb-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
              Hint 💭
            </span>
            <p className="text-xs font-medium text-gray-600 mt-1 italic">
              "{currentNick.hintText}"
            </p>
          </div>

          {/* ── The Word Slot Boxes (Target Area) ── */}
          <motion.div
            animate={shakeError ? { x: [-8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-1.5 min-h-[58px] p-2 bg-pink-50/70 rounded-2xl border border-pink-200/80 mb-5"
          >
            {slots.map((slot, idx) => {
              if (slot.isSpace) {
                return (
                  <div key={idx} className="w-3 flex items-center justify-center text-pink-300 font-bold">
                    ♥
                  </div>
                );
              }

              const isFilled = slot.char !== null;

              return (
                <motion.div
                  key={idx}
                  whileTap={!slot.fixed && isFilled ? { scale: 0.9 } : {}}
                  onClick={() => handleRemoveSlot(idx)}
                  className={`w-10 h-12 rounded-xl flex flex-col items-center justify-center font-extrabold text-lg relative transition-all duration-200 ${
                    slot.fixed
                      ? 'bg-white text-gray-800 border-2 border-pink-300 shadow-xs'
                      : isFilled
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md cursor-pointer ring-2 ring-pink-300'
                      : 'border-2 border-dashed border-pink-300 bg-white/60 text-pink-300'
                  }`}
                >
                  <span>{slot.char || ''}</span>

                  {/* Fixed indicator lock dot */}
                  {slot.fixed && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-400" />
                  )}

                  {/* Tap to remove indicator */}
                  {!slot.fixed && isFilled && (
                    <span className="text-[8px] absolute -bottom-1 text-pink-200 leading-none">×</span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Shake Error message */}
          <AnimatePresence>
            {shakeError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-rose-500 font-bold text-center mb-2"
              >
                Oops! Not quite right. Tap a letter to take it back and try again! 💭
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── Available Letters Pool (Pick from below) ── */}
          <div className="mt-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2.5">
              Available Letters (Tap to place)
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {letterPool.map(item => (
                <motion.button
                  key={item.id}
                  whileHover={!item.used ? { scale: 1.1 } : {}}
                  whileTap={!item.used ? { scale: 0.9 } : {}}
                  onClick={() => handleSelectLetter(item)}
                  disabled={item.used || showNickSuccess}
                  className={`w-11 h-11 rounded-xl font-extrabold text-base flex items-center justify-center transition-all duration-200 ${
                    item.used
                      ? 'bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed opacity-40 scale-95'
                      : 'bg-white text-pink-600 border-2 border-pink-300 shadow-sm hover:shadow-md hover:border-pink-400 cursor-pointer active:bg-pink-50'
                  }`}
                >
                  {item.letter}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Reset / Clear Buttons */}
          <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between text-xs">
            <button
              onClick={handleClearSlots}
              className="text-gray-400 hover:text-pink-600 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>↺</span>
              <span>Clear Letters</span>
            </button>

            <span className="text-[10px] text-gray-400">
              Tap any placed letter to remove it
            </span>
          </div>
        </motion.div>

        {/* ── SUCCESS MODAL (Borderless floating celebration over heavy blurred background) ── */}
        <AnimatePresence>
          {showNickSuccess && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center max-w-sm w-full flex flex-col items-center relative z-10"
                initial={{ scale: 0.8, opacity: 0, y: 25 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {/* Companion avatar */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-24 h-24 mb-3"
                >
                  <img
                    src={dudububFront}
                    alt="Celebration"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                  />
                </motion.div>

                {/* Nickname completed pill */}
                <motion.span
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-pink-500/80 text-white text-xs font-bold uppercase tracking-wider mb-2.5 border border-pink-300/50 shadow-md backdrop-blur-sm"
                >
                  <span>✨ Nickname #{currentIndex + 1} Cleared! ⭐</span>
                </motion.span>

                {/* Nickname title */}
                <h3
                  className="font-heading text-white text-3xl sm:text-4xl font-extrabold mb-1 tracking-wide"
                  style={{
                    textShadow: '0 4px 16px rgba(0,0,0,0.6), 0 0 20px rgba(255, 105, 180, 0.4)'
                  }}
                >
                  {currentNick.word}
                </h3>

                {/* Sweet message */}
                <p
                  className="font-display text-pink-200 text-xl font-bold mb-2 italic"
                  style={{
                    textShadow: '0 2px 10px rgba(0,0,0,0.7)'
                  }}
                >
                  "{currentNick.message}"
                </p>

                {/* Subtext */}
                <p
                  className="text-white/85 text-xs sm:text-sm mb-6 max-w-xs leading-relaxed"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.7)'
                  }}
                >
                  {currentNick.subtext}
                </p>

                {/* Next button */}
                {currentIndex < NICKNAMES.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextNickname}
                    className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-[0_6px_25px_rgba(236,72,153,0.5)] border border-pink-300/40 cursor-pointer transition-all"
                  >
                    <span>Next Nickname ({currentIndex + 2}/{NICKNAMES.length})</span>
                    <span>→</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReturnToMap}
                    className="w-full max-w-xs py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white text-base font-bold flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(236,72,153,0.6)] border border-pink-200/50 cursor-pointer transition-all"
                  >
                    <span>🎉 All 8 Nicknames Solved! Go to Map</span>
                    <span>→</span>
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
