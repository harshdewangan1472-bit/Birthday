import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GameProvider } from './store/GameContext';
import ProgressBar from './components/ui/ProgressBar';
import AchievementToast from './components/ui/AchievementToast';

import Intro from './pages/Intro';
import Journey from './pages/Journey';
import Level1Puzzle from './pages/Level1Puzzle';
import Level2Hunt from './pages/Level2Hunt';
import Level3Wheel from './pages/Level3Wheel';
import Level4Quiz from './pages/Level4Quiz';
import Level5Hearts from './pages/Level5Hearts';
import FinalGift from './pages/FinalGift';
import Album from './pages/Album';

function AnimatedRoutes() {
  const location = useLocation();
  const showChrome = location.pathname !== '/' && location.pathname !== '/final';

  return (
    <>
      {/* Global overlays (only when not on intro/final) */}
      {showChrome && <ProgressBar />}
      <AchievementToast />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<Intro />} />
          <Route path="/journey"  element={<Journey />} />
          <Route path="/level1"   element={<Level1Puzzle />} />
          <Route path="/level2"   element={<Level2Hunt />} />
          <Route path="/level3"   element={<Level3Wheel />} />
          <Route path="/level4"   element={<Level4Quiz />} />
          <Route path="/level5"   element={<Level5Hearts />} />
          <Route path="/final"    element={<FinalGift />} />
          <Route path="/album"    element={<Album />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </GameProvider>
  );
}
