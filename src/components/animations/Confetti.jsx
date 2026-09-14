import { useEffect, useRef } from 'react';

/**
 * Canvas-based confetti burst effect.
 * Call trigger() to fire a confetti explosion at the given origin point.
 */
export default function Confetti({ active = false, origin = { x: 0.5, y: 0.5 } }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  const COLORS = ['#FFB6C1', '#FF69B4', '#FFEAA7', '#DFF9FB', '#F3E5F5', '#FF85A2', '#FFD700', '#ffffff'];

  function createParticle(canvas) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    return {
      x: canvas.width * origin.x,
      y: canvas.height * origin.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    };
  }

  function animate(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter(p => p.opacity > 0.01);

    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.015;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (particlesRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(() => animate(canvas, ctx));
    }
  }

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Spawn 150 particles
    particlesRef.current = Array.from({ length: 150 }, () => createParticle(canvas));
    cancelAnimationFrame(rafRef.current);
    animate(canvas, ctx);

    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ display: active ? 'block' : 'none' }}
    />
  );
}
