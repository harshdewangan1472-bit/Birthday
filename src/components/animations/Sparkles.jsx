import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Twinkling sparkle overlay — small star-shaped SVGs scattered across the screen.
 */
export default function Sparkles({ count = 20, className = '' }) {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    setSparkles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${Math.random() * 95}%`,
        left: `${Math.random() * 95}%`,
        size: Math.random() * 12 + 6,
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        color: ['#FF85A2', '#FFEAA7', '#DFF9FB', '#FFB6C1', '#F3E5F5', '#FFD700'][
          Math.floor(Math.random() * 6)
        ],
      }))
    );
  }, [count]);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-10 ${className}`}>
      {sparkles.map(s => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ top: s.top, left: s.left }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180, 360] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <StarSVG size={s.size} color={s.color} />
        </motion.div>
      ))}
    </div>
  );
}

function StarSVG({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l2.09 6.26L20 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l5.91-.91z" />
    </svg>
  );
}

export { StarSVG };
