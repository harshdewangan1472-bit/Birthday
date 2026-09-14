import { motion } from 'framer-motion';

/**
 * Floating animated hearts overlay.
 * Renders a given count of hearts that float upward from random positions.
 */
export default function FloatingHearts({ count = 12, className = '' }) {
  const hearts = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 90 + 5}%`,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.3,
  }));

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-0 ${className}`}>
      {hearts.map(h => (
        <motion.div
          key={h.id}
          style={{ left: h.left, bottom: '-10%', fontSize: h.size, opacity: h.opacity }}
          className="absolute select-none"
          animate={{ y: [0, -window.innerHeight - 100], opacity: [h.opacity, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeOut' }}
        >
          <HeartSVG size={h.size} />
        </motion.div>
      ))}
    </div>
  );
}

export function HeartSVG({ size = 24, color = '#FF85A2', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3
               19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}
