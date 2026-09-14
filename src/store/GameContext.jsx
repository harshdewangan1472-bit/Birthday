import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Total levels in the game
const TOTAL_LEVELS = 6;

const GameContext = createContext(null);

const DEFAULT_STATE = {
  started: false,
  completedLevels: [], // array of level numbers (1-6) that are done
  unlockedWishes: [],  // wish ids unlocked
  achievements: [],    // achievement objects
  albumUnlocked: false,
  finalUnlocked: false,
};

export function GameProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_game_state');
      return saved ? JSON.parse(saved) : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  // Persist every state change
  useEffect(() => {
    try {
      localStorage.setItem('birthday_game_state', JSON.stringify(state));
    } catch { /* storage full */ }
  }, [state]);

  const startJourney = useCallback(() => {
    setState(s => ({ ...s, started: true }));
  }, []);

  const completeLevel = useCallback((level, wishId = null) => {
    setState(s => {
      const completedLevels = s.completedLevels.includes(level)
        ? s.completedLevels
        : [...s.completedLevels, level];

      const unlockedWishes = wishId && !s.unlockedWishes.includes(wishId)
        ? [...s.unlockedWishes, wishId]
        : s.unlockedWishes;

      const finalUnlocked = completedLevels.length >= TOTAL_LEVELS;
      const albumUnlocked = completedLevels.length >= 2;

      return { ...s, completedLevels, unlockedWishes, finalUnlocked, albumUnlocked };
    });
  }, []);

  const addAchievement = useCallback((achievement) => {
    setState(s => {
      if (s.achievements.find(a => a.id === achievement.id)) return s;
      return { ...s, achievements: [...s.achievements, { ...achievement, earnedAt: Date.now() }] };
    });
  }, []);

  const isLevelComplete = useCallback((level) => {
    return state.completedLevels.includes(level);
  }, [state.completedLevels]);

  const isLevelUnlocked = useCallback((level) => {
    if (level === 1) return true;
    return state.completedLevels.includes(level - 1);
  }, [state.completedLevels]);

  const progressPercent = Math.round((state.completedLevels.length / TOTAL_LEVELS) * 100);

  const resetGame = useCallback(() => {
    localStorage.removeItem('birthday_game_state');
    setState(DEFAULT_STATE);
  }, []);

  return (
    <GameContext.Provider value={{
      ...state,
      TOTAL_LEVELS,
      progressPercent,
      startJourney,
      completeLevel,
      addAchievement,
      isLevelComplete,
      isLevelUnlocked,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export default GameContext;
