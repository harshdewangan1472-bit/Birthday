import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useGame } from '../../store/GameContext';

const ACHIEVEMENT_CONFIGS = {
  level1: { icon: '🧩', title: 'Puzzle Master', desc: 'Completed the Memory Puzzle!' },
  level2: { icon: '🗺️', title: 'Treasure Hunter', desc: 'Discovered all memories!' },
  level3: { icon: '🎡', title: 'Lucky Spinner', desc: 'Spun the Love Wheel!' },
  level4: { icon: '💡', title: 'Love Expert', desc: 'Aced the Love Quiz!' },
  level5: { icon: '💝', title: 'Heart Collector', desc: 'Caught all the hearts!' },
  final: { icon: '✉️', title: 'Secret Unlocked', desc: 'Found the secret gift!' },
};

/**
 * Achievement toast notification — slides in from the right on level completion.
 */
export default function AchievementToast() {
  const { achievements } = useGame();
  const [shown, setShown] = useState(new Set());
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    const newest = achievements[achievements.length - 1];
    if (!newest || shown.has(newest.id)) return;

    const config = ACHIEVEMENT_CONFIGS[newest.id];
    if (!config) return;

    setShown(s => new Set([...s, newest.id]));
    setCurrent({ ...config, id: newest.id });
    setTimeout(() => setCurrent(null), 3500);
  }, [achievements]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-16 right-4 z-50 glass-strong rounded-2xl p-3 flex items-center gap-3 shadow-soft-lg max-w-[220px]"
        >
          <div className="text-3xl">{current.icon}</div>
          <div>
            <p className="text-xs font-bold text-pink-600 uppercase tracking-wide">Achievement!</p>
            <p className="text-sm font-semibold text-gray-800">{current.title}</p>
            <p className="text-xs text-gray-500">{current.desc}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
