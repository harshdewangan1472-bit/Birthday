import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import easterEggs from '../../data/easter_eggs.json';

/**
 * Floating Dudu & Bubu companion that appears in the corner
 * and randomly shows speech bubbles with cute messages.
 */
export default function Companion() {
  const [visible, setVisible] = useState(true);
  const [bubble, setBubble] = useState(null);
  const [wiggle, setWiggle] = useState(false);

  // Show a random message bubble periodically
  useEffect(() => {
    const show = () => {
      const msg = easterEggs.messages[Math.floor(Math.random() * easterEggs.messages.length)];
      setBubble(msg);
      setTimeout(() => setBubble(null), 4000);
    };

    // Show first bubble after 8s, then every 20-35s
    const first = setTimeout(show, 8000);
    const interval = setInterval(show, Math.random() * 15000 + 20000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  const handleTap = useCallback(() => {
    setWiggle(true);
    setTimeout(() => setWiggle(false), 600);
    const msg = easterEggs.messages[Math.floor(Math.random() * easterEggs.messages.length)];
    setBubble(msg);
    setTimeout(() => setBubble(null), 3500);
  }, []);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2 select-none">
      {/* Speech bubble */}
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="glass-strong rounded-2xl rounded-br-sm px-4 py-3 max-w-[200px] text-sm text-pink-700 font-medium shadow-soft-lg"
            style={{ fontSize: '13px', lineHeight: '1.4' }}
          >
            {bubble}
            {/* Tail */}
            <div className="absolute bottom-[-8px] right-4 w-0 h-0"
              style={{ borderLeft: '8px solid transparent', borderRight: '4px solid transparent', borderTop: '8px solid rgba(255,255,255,0.7)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Companion avatar */}
      <motion.button
        onClick={handleTap}
        animate={wiggle ? { rotate: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="companion-float cursor-pointer focus:outline-none"
        aria-label="Tap for a surprise message"
      >
        <CompanionSVG />
      </motion.button>
    </div>
  );
}

function CompanionSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <ellipse cx="40" cy="48" rx="22" ry="20" fill="#FFB6C1"/>
      {/* Head */}
      <circle cx="40" cy="28" r="20" fill="#FFD6E8"/>
      {/* Ears */}
      <ellipse cx="21" cy="22" rx="7" ry="9" fill="#FFB6C1"/>
      <ellipse cx="59" cy="22" rx="7" ry="9" fill="#FFB6C1"/>
      <ellipse cx="21" cy="22" rx="4" ry="6" fill="#FF85A2"/>
      <ellipse cx="59" cy="22" rx="4" ry="6" fill="#FF85A2"/>
      {/* Eyes */}
      <ellipse cx="33" cy="27" rx="4" ry="4.5" fill="#3d2b1f"/>
      <ellipse cx="47" cy="27" rx="4" ry="4.5" fill="#3d2b1f"/>
      {/* Eye shine */}
      <circle cx="34.5" cy="25.5" r="1.5" fill="white"/>
      <circle cx="48.5" cy="25.5" r="1.5" fill="white"/>
      {/* Blush */}
      <ellipse cx="27" cy="33" rx="5" ry="3" fill="#FF85A2" opacity="0.5"/>
      <ellipse cx="53" cy="33" rx="5" ry="3" fill="#FF85A2" opacity="0.5"/>
      {/* Nose */}
      <ellipse cx="40" cy="32" rx="2.5" ry="1.5" fill="#FF85A2"/>
      {/* Smile */}
      <path d="M34 36 Q40 42 46 36" stroke="#3d2b1f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Arms */}
      <ellipse cx="18" cy="50" rx="5" ry="8" fill="#FFB6C1" transform="rotate(-20 18 50)"/>
      <ellipse cx="62" cy="50" rx="5" ry="8" fill="#FFB6C1" transform="rotate(20 62 50)"/>
      {/* Small heart */}
      <path d="M38 58 Q40 56 42 58 Q44 60 40 63 Q36 60 38 58Z" fill="#FF69B4"/>
    </svg>
  );
}
