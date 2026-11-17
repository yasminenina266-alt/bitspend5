import React, { useEffect, useRef } from 'react';

interface StripeMeshCanvasProps {
  className?: string;
}

export const StripeMeshCanvas: React.FC<StripeMeshCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let t = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = 0.25;
      canvas.width = Math.max(160, Math.floor(rect.width * scale));
      canvas.height = Math.max(120, Math.floor(rect.height * scale));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Clean warm base matching Stripe's signature ribbon palette
      ctx.fillStyle = '#FF9A44';
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        {
          x: w * (0.15 + 0.16 * Math.sin(t * 0.45)),
          y: h * (0.18 + 0.14 * Math.cos(t * 0.35)),
          r: Math.max(w, h) * 0.72,
          color: 'rgba(139, 92, 246, 0.92)', // Luminous violet-indigo
        },
        {
          x: w * (0.58 + 0.18 * Math.cos(t * 0.4)),
          y: h * (0.42 + 0.16 * Math.sin(t * 0.5)),
          r: Math.max(w, h) * 0.75,
          color: 'rgba(244, 63, 142, 0.9)', // Vivid magenta-coral
        },
        {
          x: w * (0.82 + 0.12 * Math.sin(t * 0.55 + 1.2)),
          y: h * (0.22 + 0.15 * Math.cos(t * 0.45 + 0.7)),
          r: Math.max(w, h) * 0.65,
          color: 'rgba(255, 195, 77, 0.92)', // Warm amber-gold highlight
        },
        {
          x: w * (0.42 + 0.2 * Math.sin(t * 0.3 + 2.1)),
          y: h * (0.82 + 0.12 * Math.cos(t * 0.4 + 1.5)),
          r: Math.max(w, h) * 0.68,
          color: 'rgba(99, 91, 255, 0.92)', // Stripe blurple
        },
      ];

      for (const b of blobs) {
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      if (!prefersReduced) {
        t += 0.01;
        animId = window.requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`w-full h-full object-cover ${className}`}
    />
  );
};
