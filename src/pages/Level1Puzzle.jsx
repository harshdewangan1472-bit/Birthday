import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../store/GameContext';
import confetti from 'canvas-confetti';
import puzzleData from '../data/puzzle.json';

const GRID = puzzleData.puzzle.grid || 5; // 5x5 Grid
const TOTAL = GRID * GRID; // 25 pieces

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Level1Puzzle() {
  const navigate = useNavigate();
  const { completeLevel, addAchievement, isLevelComplete } = useGame();
  const [pieces, setPieces] = useState(() =>
    shuffleArray(Array.from({ length: TOTAL }, (_, i) => i))
  );
  const [solved, setSolved] = useState(false);
  const [dragging, setDragging] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const containerRef = useRef(null);
  const touchStart = useRef(null);

  // Check if already completed
  useEffect(() => {
    if (isLevelComplete(1)) setSolved(true);
  }, []);

  // Continuous side party poppers when puzzle is solved
  useEffect(() => {
    if (!solved) return;

    const fireSidePoppers = () => {
      // Left side cannon
      confetti({
        particleCount: 35,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.72 },
        colors: ['#FF69B4', '#FFD700', '#FF80AB', '#C084FC', '#FFFFFF'],
      });
      // Right side cannon
      confetti({
        particleCount: 35,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.72 },
        colors: ['#FF69B4', '#FFD700', '#FF80AB', '#C084FC', '#FFFFFF'],
      });
    };

    fireSidePoppers();
    const interval = setInterval(fireSidePoppers, 900);
    return () => clearInterval(interval);
  }, [solved]);

  const isSolved = (arr) => arr.every((v, i) => v === i);

  const swapPieces = (idxA, idxB) => {
    if (idxA === idxB) return;
    setPieces(prev => {
      const next = [...prev];
      [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
      if (isSolved(next)) {
        setTimeout(() => {
          setSolved(true);
          completeLevel(1);
          addAchievement({ id: 'level1' });
        }, 250);
      }
      return next;
    });
  };

  // Click / Tap to Swap handler (Friendly for mobile screens)
  const handlePieceClick = (slotIdx) => {
    if (solved) return;
    if (selectedPiece === null) {
      setSelectedPiece(slotIdx);
    } else if (selectedPiece === slotIdx) {
      setSelectedPiece(null);
    } else {
      swapPieces(selectedPiece, slotIdx);
      setSelectedPiece(null);
    }
  };

  // HTML5 Drag and drop handlers
  const handleDragStart = (e, slotIdx) => {
    setDragging(slotIdx);
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (dragging === null || dragging === targetIdx) return;
    swapPieces(dragging, targetIdx);
    setDragging(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Mobile Touch drag support
  const handleTouchStart = (e, slotIdx) => {
    touchStart.current = { idx: slotIdx, x: e.touches[0].clientX, y: e.touches[0].clientY };
    setDragging(slotIdx);
  };

  const handleTouchEnd = (e) => {
    if (touchStart.current && dragging !== null) {
      const touch = e.changedTouches[0];
      const elem = document.elementFromPoint(touch.clientX, touch.clientY);
      const slotElem = elem?.closest('[data-slot-idx]');
      if (slotElem) {
        const targetIdx = parseInt(slotElem.getAttribute('data-slot-idx'), 10);
        if (!isNaN(targetIdx) && targetIdx !== dragging) {
          swapPieces(dragging, targetIdx);
        }
      }
    }
    setDragging(null);
    touchStart.current = null;
  };

  const handleReset = () => {
    setPieces(shuffleArray(Array.from({ length: TOTAL }, (_, i) => i)));
    setSolved(false);
    setSelectedPiece(null);
  };

  // Navigate to Roadmap with transition state so Dudu & Bubu walk to Level 2
  const handleGoToNextLevel = () => {
    navigate('/journey', { state: { justCompleted: 1, newlyUnlocked: 2 } });
  };

  const correctCount = pieces.filter((p, i) => p === i).length;

  return (
    <div
      className="min-h-screen pt-16 pb-24 flex flex-col items-center select-none"
      style={{
        background: 'linear-gradient(135deg, #FFF4F8 0%, #FFE8F2 60%, #FFF0D6 100%)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <div className="max-w-md w-full px-4">

        {/* ── Top Header Bar ── */}
        <motion.div
          className="text-center mt-4 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 bg-pink-100/90 border border-pink-200 rounded-full px-4 py-1 mb-2 shadow-2xs">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wide">
              Level 1 • 5×5 Puzzle
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: 'clamp(2rem, 7vw, 2.4rem)',
              color: '#D81B60',
              fontWeight: 700,
              lineHeight: 1.1,
              margin: '0 0 4px 0'
            }}
          >
            Puzzle of Memories
          </h1>

          <p className="text-gray-500 text-xs">
            Tap a piece to select, then tap another to swap (or drag & drop)
          </p>
        </motion.div>

        {/* ── Puzzle Board Card ── */}
        <motion.div
          ref={containerRef}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-3.5 shadow-lg border border-pink-200/80"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Reference Image Thumbnail & Progress Status */}
          <div className="mb-3 flex items-center justify-between gap-2 px-1">
            <button
              onClick={() => setShowFullImage(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors border border-pink-200 cursor-pointer"
            >
              <img
                src={puzzleData.puzzle.image}
                alt="Reference Thumbnail"
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-pink-400"
              />
              <div className="text-left">
                <span className="text-[11px] font-bold text-pink-600 block leading-tight">View Photo</span>
                <span className="text-[9px] text-gray-400 block">Tap to preview</span>
              </div>
            </button>

            {/* Pieces correct meter */}
            <div className="text-right">
              <div className="text-xs font-bold text-pink-600">
                {correctCount} / {TOTAL} Correct
              </div>
              <div className="w-24 h-2 bg-pink-100 rounded-full overflow-hidden mt-1 border border-pink-200">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${(correctCount / TOTAL) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── 5x5 Grid Board ── */}
          <div
            className="grid gap-1 select-none p-1 bg-pink-100/50 rounded-2xl border border-pink-200"
            style={{
              gridTemplateColumns: `repeat(${GRID}, 1fr)`,
              aspectRatio: '1/1',
              touchAction: 'none'
            }}
          >
            {pieces.map((pieceIdx, slotIdx) => {
              const isSelected = selectedPiece === slotIdx;
              const isCorrect = pieceIdx === slotIdx;

              return (
                <div
                  key={slotIdx}
                  data-slot-idx={slotIdx}
                  draggable={!solved}
                  onClick={() => handlePieceClick(slotIdx)}
                  onDragStart={e => handleDragStart(e, slotIdx)}
                  onDrop={e => handleDrop(e, slotIdx)}
                  onDragOver={handleDragOver}
                  onTouchStart={e => handleTouchStart(e, slotIdx)}
                  onTouchEnd={handleTouchEnd}
                  className={`relative overflow-hidden rounded-md cursor-pointer transition-transform duration-150 ${
                    dragging === slotIdx
                      ? 'opacity-40 scale-90'
                      : isSelected
                      ? 'scale-105 ring-3 ring-pink-500 shadow-md z-20'
                      : isCorrect
                      ? 'ring-1 ring-emerald-400/80'
                      : 'hover:scale-102 ring-1 ring-white/60'
                  }`}
                  style={{ aspectRatio: '1/1' }}
                >
                  {/* Puzzle Slice Image */}
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${puzzleData.puzzle.image})`,
                      backgroundSize: `${GRID * 100}%`,
                      backgroundPosition: `${(pieceIdx % GRID) * (100 / (GRID - 1))}% ${Math.floor(pieceIdx / GRID) * (100 / (GRID - 1))}%`,
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: '#FFD6E8',
                    }}
                  />

                  {/* Selected Indicator overlay */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-pink-500/25 border-2 border-pink-500 rounded-md pointer-events-none" />
                  )}

                  {/* Correct piece subtle check dot */}
                  {isCorrect && !solved && (
                    <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-2xs pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Controls: Reset & Hint */}
          <div className="mt-3 flex gap-2">
            {!solved && (
              <button
                onClick={handleReset}
                className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1.5 rounded-xl border border-pink-200 cursor-pointer"
              >
                <RefreshIcon size={14} />
                <span>Shuffle Again</span>
              </button>
            )}

            <button
              onClick={() => setShowFullImage(true)}
              className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1.5 rounded-xl border border-pink-200 cursor-pointer"
            >
              <span>🖼️ Preview Full Image</span>
            </button>
          </div>
        </motion.div>

        {/* ── Reference Full Image Preview Modal (During solving) ── */}
        <AnimatePresence>
          {showFullImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullImage(false)}
            >
              <motion.div
                className="bg-white rounded-3xl p-4 max-w-sm w-full shadow-2xl relative"
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-bold text-sm text-gray-800">Reference Photo</h3>
                  <button
                    onClick={() => setShowFullImage(false)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold hover:bg-gray-200 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-inner border border-pink-100 aspect-square">
                  <img
                    src={puzzleData.puzzle.image}
                    alt="Full Reference"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  onClick={() => setShowFullImage(false)}
                  className="btn-primary w-full mt-3 py-2 text-xs cursor-pointer"
                >
                  Close Preview
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── GRAND SOLVED CELEBRATION POPUP WITH BIG COMPLETE IMAGE & PARTY POPPERS ── */}
        <AnimatePresence>
          {solved && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-4.5 text-center relative z-10 max-w-[340px] w-full border-2 border-pink-300 shadow-2xl overflow-hidden"
                initial={{ scale: 0.7, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                {/* Top Celebration Pill */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-extrabold uppercase tracking-wide mb-2.5 shadow-2xs"
                >
                  <span>🎉</span>
                  <span>Level 1 Complete!</span>
                  <span>🎉</span>
                </motion.div>

                {/* ── Bada Sa Complete Solved Image ── */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.45, type: 'spring' }}
                  className="w-full max-h-[340px] rounded-2xl overflow-hidden shadow-xl border-2 border-pink-400 relative group"
                  style={{ aspectRatio: '1/1' }}
                >
                  <img
                    src={puzzleData.puzzle.image}
                    alt="Solved Memory"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle celebratory shimmer */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                  />
                </motion.div>

                {/* Heartfelt Quote */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-pink-600 font-display text-sm mt-3 mb-1 italic font-medium leading-snug px-1"
                >
                  "Every piece of this puzzle reminds me how perfectly you fit into my life. ❤️"
                </motion.p>

                {/* ── Next Level Button (Navigates to roadmap with walking transition) ── */}
                <motion.button
                  onClick={handleGoToNextLevel}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  className="btn-primary w-full py-3.5 mt-3 text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 cursor-pointer"
                >
                  <span>Next Level</span>
                  <span className="text-lg">→</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function RefreshIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  );
}
