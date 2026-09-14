import { useEffect, useRef } from 'react';

/**
 * Canvas fireworks animation for celebration moments.
 */
export default function Fireworks({ active = false }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const rocketsRef = useRef([]);

  const COLORS = ['#FFB6C1', '#FF69B4', '#FFEAA7', '#DFF9FB', '#FF85A2', '#FFD700', '#ffffff', '#F3E5F5'];

  function createExplosion(canvas, x, y) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return Array.from({ length: 60 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1;
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        opacity: 1,
        size: Math.random() * 4 + 1,
        color,
        type: 'particle',
      };
    });
  }

  function launch(canvas) {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height,
      vy: -(Math.random() * 8 + 10),
      targetY: Math.random() * canvas.height * 0.5,
      exploded: false,
      type: 'rocket',
      particles: [],
    };
  }

  function animate(canvas, ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Randomly launch new rockets
    if (Math.random() < 0.05) {
      rocketsRef.current.push(launch(canvas));
    }

    rocketsRef.current = rocketsRef.current.filter(r => {
      if (!r.exploded) {
        r.y += r.vy;
        if (r.y <= r.targetY) {
          r.exploded = true;
          r.particles = createExplosion(canvas, r.x, r.y);
        }
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      }

      // Update particles
      r.particles = r.particles.filter(p => p.opacity > 0.01);
      r.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.vx *= 0.98;
        p.opacity -= 0.018;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      return r.particles.length > 0;
    });

    if (active) {
      rafRef.current = requestAnimationFrame(() => animate(canvas, ctx));
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (active) {
      rocketsRef.current = [];
      animate(canvas, ctx);
    } else {
      cancelAnimationFrame(rafRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      style={{ display: active ? 'block' : 'none' }}
    />
  );
}
