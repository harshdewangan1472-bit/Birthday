import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../store/GameContext';

/**
 * Top progress bar showing level completion across all 6 levels.
 */
export default function ProgressBar() {
  const { completedLevels, TOTAL_LEVELS, progressPercent } = useGame();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2 glass-strong">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-pink-500 font-body">Birthday Journey</span>
          <span className="text-xs font-bold text-pink-600">{completedLevels.length}/{TOTAL_LEVELS}</span>
        </div>
        <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFB6C1, #FF69B4, #FF85A2)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex gap-1 mt-1.5 justify-between">
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => {
            const level = i + 1;
            const done = completedLevels.includes(level);
            return (
              <motion.div
                key={level}
                initial={{ scale: 0.8 }}
                animate={{ scale: done ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className={`flex-1 h-1.5 rounded-full transition-colors duration-500 ${
                  done ? 'bg-pink-400' : 'bg-pink-100'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
