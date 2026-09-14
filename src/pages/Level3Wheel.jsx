import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useGame } from '../store/GameContext';
import RealisticCake, { renderDecorationByType } from '../components/cake/RealisticCake';
import { DECORATION_CATALOG, TARGET_SLOTS } from '../components/cake/cakeConfig';
import { luxuryAudio } from '../utils/luxuryAudio';

export default function Level3Wheel() {
  const navigate = useNavigate();
  const { completeLevel, addAchievement } = useGame();

  // Placed items map: { [slotId]: itemType }
  const [placedItems, setPlacedItems] = useState({});
  // Action history for undo
  const [actionHistory, setActionHistory] = useState([]);
  // Currently selected item from palette (default to candle)
  const [selectedType, setSelectedType] = useState('candle');

  // Reference modal toggle
  const [showReferenceModal, setShowReferenceModal] = useState(false);

  // Hints (3 Max)
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintMessage, setHintMessage] = useState(null);
  const [highlightedSlotId, setHighlightedSlotId] = useState(null);
  const [misplacedSlotId, setMisplacedSlotId] = useState(null);

  // Success state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showCelebrationEffects, setShowCelebrationEffects] = useState(false);

  // Count placed items by type
  const placedCountsByType = useMemo(() => {
    const counts = {};
    Object.values(placedItems).forEach((type) => {
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [placedItems]);

  // Matching algorithm
  const { matchPercentage, correctCount, misplacedCount, missingSlots } = useMemo(() => {
    let correct = 0;
    let misplaced = 0;
    const missing = [];

    TARGET_SLOTS.forEach((slot) => {
      const placed = placedItems[slot.id];
      if (!placed) {
        missing.push(slot);
      } else if (placed === slot.type) {
        correct += 1;
      } else {
        misplaced += 1;
      }
    });

    const pct = Math.round((correct / TARGET_SLOTS.length) * 100);
    return {
      matchPercentage: pct,
      correctCount: correct,
      misplacedCount: misplaced,
      missingSlots: missing,
    };
  }, [placedItems]);

  const isComplete = matchPercentage === 100;

  // On 100% match, trigger celebration
  useEffect(() => {
    if (isComplete && !showCelebrationEffects) {
      setShowCelebrationEffects(true);
      luxuryAudio.playSuccess();

      confetti({
        particleCount: 85,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#FFE082', '#FF80AB', '#FFFFFF', '#FFD54F'],
      });

      completeLevel(3);
      addAchievement({
        id: 'master_cake_designer',
        title: 'Master Cake Designer',
        description: 'Recreated the 21st luxury birthday cake with 100% perfection!',
      });
    }
  }, [isComplete, showCelebrationEffects, completeLevel, addAchievement]);

  // Handle slot click
  const handleSlotClick = useCallback(
    (slot) => {
      if (isComplete) return;

      const activeType = selectedType || slot.type;
      const currentCount = placedCountsByType[activeType] || 0;
      const catalogItem = DECORATION_CATALOG.find((c) => c.type === activeType);
      const isAlreadyThisType = placedItems[slot.id] === activeType;

      if (!isAlreadyThisType && catalogItem && currentCount >= catalogItem.maxCount) {
        setHintMessage(`All ${catalogItem.shortName} have been placed!`);
        setTimeout(() => setHintMessage(null), 2500);
        return;
      }

      placeItemInSlot(slot.id, activeType);
    },
    [isComplete, selectedType, placedCountsByType, placedItems]
  );

  const placeItemInSlot = (slotId, type) => {
    const prevType = placedItems[slotId] || null;

    setPlacedItems((prev) => ({
      ...prev,
      [slotId]: type,
    }));

    setActionHistory((prev) => [
      ...prev,
      { slotId, previousType: prevType, newType: type },
    ]);

    luxuryAudio.playPlace();

    if (highlightedSlotId === slotId) setHighlightedSlotId(null);
    if (misplacedSlotId === slotId) setMisplacedSlotId(null);
  };

  // Remove item
  const handleItemRemove = useCallback(
    (slotId) => {
      if (isComplete) return;
      const prevType = placedItems[slotId];
      if (!prevType) return;

      setPlacedItems((prev) => {
        const next = { ...prev };
        delete next[slotId];
        return next;
      });

      setActionHistory((prev) => [
        ...prev,
        { slotId, previousType: prevType, newType: null },
      ]);

      luxuryAudio.playRemove();
      if (misplacedSlotId === slotId) setMisplacedSlotId(null);
    },
    [isComplete, placedItems, misplacedSlotId]
  );

  // Undo
  const handleUndo = () => {
    if (actionHistory.length === 0 || isComplete) return;

    const lastAction = actionHistory[actionHistory.length - 1];
    setActionHistory((prev) => prev.slice(0, -1));

    setPlacedItems((prev) => {
      const next = { ...prev };
      if (lastAction.previousType) {
        next[lastAction.slotId] = lastAction.previousType;
      } else {
        delete next[lastAction.slotId];
      }
      return next;
    });

    luxuryAudio.playRemove();
  };

  // Reset
  const handleReset = () => {
    if (Object.keys(placedItems).length === 0 || isComplete) return;
    setPlacedItems({});
    setActionHistory([]);
    setHighlightedSlotId(null);
    setMisplacedSlotId(null);
    luxuryAudio.playRemove();
  };

  // Hint
  const handleRequestHint = () => {
    if (hintsLeft <= 0 || isComplete) return;

    luxuryAudio.playHint();

    if (hintsLeft === 3) {
      const misplacedSlot = TARGET_SLOTS.find(
        (slot) => placedItems[slot.id] && placedItems[slot.id] !== slot.type
      );
      if (misplacedSlot) {
        setMisplacedSlotId(misplacedSlot.id);
        setHintMessage('Red glowing item is misplaced. Tap to remove!');
      } else {
        const nextMissing = missingSlots[0];
        if (nextMissing) {
          setHighlightedSlotId(nextMissing.id);
          setSelectedType(nextMissing.type);
          setHintMessage(`Next step: Tap glowing ring to place ${nextMissing.label}!`);
        }
      }
    } else if (hintsLeft === 2) {
      const nextMissing = missingSlots[0] || TARGET_SLOTS[0];
      setHighlightedSlotId(nextMissing.id);
      setSelectedType(nextMissing.type);
      setHintMessage(`Glowing ring highlights where ${nextMissing.label} goes!`);
    } else if (hintsLeft === 1) {
      const nextMissing = missingSlots[0];
      if (nextMissing) {
        placeItemInSlot(nextMissing.id, nextMissing.type);
        setHintMessage(`Auto-placed 1 missing item: ${nextMissing.label}!`);
      }
    }

    setHintsLeft((prev) => prev - 1);
    setTimeout(() => setHintMessage(null), 4000);
  };

  const handleUnlockNextLevel = () => {
    navigate('/journey', {
      state: {
        justCompleted: 3,
        newlyUnlocked: 4,
      },
    });
  };

  const activeCatalogItem = DECORATION_CATALOG.find((c) => c.type === selectedType);

  return (
    <div
      className="h-[100dvh] max-h-[100dvh] overflow-hidden px-2.5 pt-14 pb-2 relative select-none flex flex-col justify-between"
      style={{
        background: 'linear-gradient(135deg, #FFF6F9 0%, #FFF0F4 40%, #FDF4EB 80%, #FFF0F8 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="max-w-md mx-auto w-full h-full flex flex-col justify-between gap-1">
        {/* ── 1. ULTRA-CLEAN TOP HEADER BAR (Sits cleanly below Birthday Journey bar) ── */}
        <div className="flex items-center justify-between gap-2 px-1 py-0.5">
          {/* Back to map button */}
          <button
            onClick={() => navigate('/journey')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-pink-200 text-[11px] font-semibold text-neutral-700 shadow-2xs hover:bg-white cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Map</span>
          </button>

          {/* Title & Match Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-neutral-800">
              Cake Decorator
            </span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                isComplete
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {matchPercentage}% Match
            </span>
          </div>

          {/* Hint button */}
          <button
            onClick={handleRequestHint}
            disabled={hintsLeft <= 0 || isComplete}
            className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-900 text-[11px] font-bold shadow-2xs cursor-pointer disabled:opacity-30 border border-amber-300"
          >
            Hint ({hintsLeft})
          </button>
        </div>

        {/* Optional hint message toast */}
        {hintMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-1 px-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-semibold text-center shadow-xs"
          >
            {hintMessage}
          </motion.div>
        )}

        {/* ── 2. CENTERPIECE CAKE CARD (Compact & Perfectly Proportioned) ── */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 border border-pink-200 shadow-sm relative flex-1 flex flex-col items-center justify-between min-h-0 max-h-[300px] overflow-hidden my-0.5">
          {/* Card header: Instruction + Target Cake button */}
          <div className="w-full flex items-center justify-between gap-1 px-1">
            <div className="flex-1 truncate pr-1">
              {isComplete ? (
                <span className="text-[11px] font-black text-amber-600 animate-pulse">
                  ✨ 100% Masterpiece Complete! ✨
                </span>
              ) : (
                <span className="text-[10px] font-bold text-pink-600 truncate block">
                  👉 Tap glowing ring to place {activeCatalogItem?.shortName}
                </span>
              )}
            </div>

            <button
              onClick={() => setShowReferenceModal(true)}
              className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[10px] font-bold text-amber-900 flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Target Cake 👁️</span>
            </button>
          </div>

          {/* Realistic 2-tier Cake Canvas (Compact max-w-[250px]) */}
          <div className="w-full max-w-[250px] flex-1 flex items-center justify-center relative min-h-0 py-0.5">
            <RealisticCake
              isReference={false}
              placedItems={placedItems}
              onSlotClick={handleSlotClick}
              onItemRemove={handleItemRemove}
              highlightedSlotId={highlightedSlotId}
              misplacedSlotId={misplacedSlotId}
              selectedType={selectedType}
              isComplete={isComplete}
            />
          </div>

          {/* Action Row: Complete button OR Undo/Reset */}
          <div className="w-full pt-1 px-1 border-t border-pink-100 flex items-center justify-between">
            {isComplete ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSuccessModalOpen(true)}
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
              >
                <span>🎉 Claim Masterpiece & Unlock Next Surprise</span>
                <span>→</span>
              </motion.button>
            ) : (
              <>
                <button
                  onClick={handleUndo}
                  disabled={actionHistory.length === 0}
                  className="text-[10px] text-neutral-500 hover:text-pink-600 disabled:opacity-30 cursor-pointer font-medium flex items-center gap-1"
                >
                  <span>↺ Undo</span>
                </button>

                <span className="text-[9px] text-neutral-400">
                  Tap placed item to remove
                </span>

                <button
                  onClick={handleReset}
                  disabled={Object.keys(placedItems).length === 0}
                  className="text-[10px] text-neutral-500 hover:text-rose-600 disabled:opacity-30 cursor-pointer font-medium flex items-center gap-1"
                >
                  <span>✕ Reset</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── 3. MINIMALIST DECORATION PALETTE (Compact 5 + 4 Grid) ── */}
        <div className="bg-white/85 backdrop-blur-md rounded-2xl p-2 border border-pink-200 shadow-xs">
          <div className="flex items-center justify-between mb-1 px-1 text-[10px]">
            <span className="font-semibold text-neutral-500">
              Decorations ({Object.keys(placedItems).length}/19)
            </span>
            {selectedType && (
              <span className="font-bold text-pink-700 bg-pink-100/70 px-2 py-0.2 rounded-full">
                Ready: {activeCatalogItem?.shortName}
              </span>
            )}
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {DECORATION_CATALOG.map((item) => {
              const placedCount = placedCountsByType[item.type] || 0;
              const isMaxed = placedCount >= item.maxCount;
              const isSelected = selectedType === item.type;

              return (
                <button
                  key={item.type}
                  onClick={() => {
                    setSelectedType(item.type);
                    luxuryAudio.playPlace();
                  }}
                  className={`p-1 rounded-xl flex flex-col items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-2 border-amber-400 shadow-xs ring-1 ring-amber-300'
                      : isMaxed
                      ? 'bg-neutral-100 border border-neutral-200 opacity-40'
                      : 'bg-white border border-pink-200/80 hover:border-pink-300'
                  }`}
                >
                  <div className="h-6 flex items-center justify-center pointer-events-none">
                    {renderDecorationByType(item.type, 18)}
                  </div>
                  <span className="text-[8px] font-bold text-neutral-700 truncate w-full text-center mt-0.5">
                    {item.shortName}
                  </span>
                  <span
                    className={`text-[8px] font-extrabold px-1 rounded-full mt-0.5 ${
                      isMaxed
                        ? 'bg-emerald-100 text-emerald-800'
                        : isSelected
                        ? 'bg-amber-300 text-neutral-900'
                        : 'bg-pink-100 text-pink-700'
                    }`}
                  >
                    {placedCount}/{item.maxCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. REFERENCE CAKE POPUP MODAL (When player clicks "Target Cake") ── */}
      <AnimatePresence>
        {showReferenceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowReferenceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-5 max-w-sm w-full border-2 border-amber-300 shadow-2xl relative text-center"
            >
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1.5">
                <span>Target Reference Cake</span>
              </div>

              <h3 className="text-sm font-bold text-neutral-800 font-serif mb-1">
                This is what your cake should look like!
              </h3>
              <p className="text-[11px] text-neutral-500 mb-2">
                5 candles on top, 21 crown in center, roses, ribbon and base pearls.
              </p>

              <div className="w-full p-2 bg-gradient-to-b from-pink-50 to-amber-50/40 rounded-2xl border border-pink-100 mb-3">
                <RealisticCake isReference={true} />
              </div>

              <button
                onClick={() => setShowReferenceModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Got It! Return to Decorating
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 5. SUCCESS CELEBRATION MODAL (100% Match) ── */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="max-w-sm w-full text-center flex flex-col items-center relative z-10 px-5 py-6 rounded-3xl bg-gradient-to-b from-white to-pink-50 border-2 border-amber-300 shadow-2xl"
            >
              {/* Achievement Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-0.5 shadow-md mb-2.5 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-neutral-900 flex flex-col items-center justify-center text-amber-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
              </div>

              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider border border-amber-300 mb-1.5">
                Achievement Unlocked • Master Cake Designer
              </span>

              <h2 className="text-2xl font-extrabold text-neutral-900 font-serif mb-0.5">
                Perfect.
              </h2>

              <p className="text-sm font-medium text-pink-700 italic font-serif mb-1">
                "You created something beautiful."
              </p>

              {/* Complete Decorated Cake Display */}
              <div className="w-full max-w-[270px] p-2 my-1.5 rounded-2xl bg-gradient-to-b from-pink-50 to-amber-50/70 border border-amber-300 shadow-inner">
                <RealisticCake isReference={true} isComplete={true} />
              </div>

              <p className="text-neutral-600 text-[11px] max-w-xs mb-3 leading-relaxed">
                A new surprise is waiting for you along your romantic birthday journey.
              </p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleUnlockNextLevel}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-pink-500/30 border border-amber-200 cursor-pointer"
              >
                <span>UNLOCK NEXT LEVEL</span>
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
