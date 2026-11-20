'use client';

import { useEffect, useRef } from 'react';

export default function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dropsRef = useRef<number[]>([]);
  const colsRef = useRef(0);
  const charSet = 'ARUSH010xFFΩΨ∇△◇EB905056';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        animate();
      }
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      colsRef.current = Math.floor(canvas.width / 16);
      dropsRef.current = Array(colsRef.current).fill(1);
    };

    const draw = () => {
      if (!ctx) return;

      ctx.fillStyle = 'rgba(2,11,2,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = '13px "Share Tech Mono", monospace';

      for (let i = 0; i < colsRef.current; i++) {
        const c = charSet[Math.floor(Math.random() * charSet.length)];
        const x = i * 16;
        const y = dropsRef.current[i] * 16;
        ctx.fillText(c, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i]++;
      }
    };

    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      } else {
        animate();
      }
    };
    mediaQuery.addEventListener?.('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', init);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener?.('change', handleMotionChange);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas id="matrix-canvas" ref={canvasRef} aria-hidden="true" />;
}