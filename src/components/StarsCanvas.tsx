'use client';

import { useEffect, useRef } from 'react';

interface StaticStar {
  x: number;
  y: number;
  r: number;
  a: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  maxLife: number;
  life: number;
  opacity: number;
  width: number;
  reset: (initial: boolean, W: number, H: number) => void;
  update: (W: number, H: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export default function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const staticStarsRef = useRef<StaticStar[]>([]);
  const shootersRef = useRef<ShootingStar[]>([]);
  const rotationRef = useRef(0);
  const frameRef = useRef(0);
  const WRef = useRef(0);
  const HRef = useRef(0);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
      } else if (!animationRef.current) {
        // Only restart if not already running
        drawFrame();
      }
    };

    const resize = () => {
      WRef.current = canvas.width = window.innerWidth;
      HRef.current = canvas.height = window.innerHeight;
    };

    const createShootingStar = (initial = false): ShootingStar => {
      const star: ShootingStar = {
        x: 0,
        y: 0,
        len: 0,
        speed: 0,
        angle: 0,
        maxLife: 0,
        life: 0,
        opacity: 0,
        width: 0,
        reset(initial: boolean, W: number, H: number) {
          this.x = Math.random() * W * 1.5 - W * 0.25;
          this.y = Math.random() * H * 0.4;
          this.len = Math.random() * 200 + 80;
          this.speed = Math.random() * 12 + 5;
          this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.35;
          this.maxLife = (this.len / this.speed) * (1 + Math.random());
          this.life = initial ? Math.floor(Math.random() * this.maxLife) : 0;
          this.opacity = Math.random() * 0.7 + 0.3;
          this.width = Math.random() * 1.8 + 0.4;
        },
        update(W: number, H: number) {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;
          this.life++;
          if (this.life > this.maxLife || this.x > W + 200 || this.y > H + 200) {
            this.reset(false, W, H);
          }
        },
        draw(ctx: CanvasRenderingContext2D) {
          const progress = this.life / this.maxLife;
          const alpha = this.opacity * Math.sin(Math.PI * (1 - progress));
          const tailX = this.x - Math.cos(this.angle) * this.len * Math.min(progress * 2, 1);
          const tailY = this.y - Math.sin(this.angle) * this.len * Math.min(progress * 2, 1);

          const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
          grad.addColorStop(0, `rgba(255,255,255,0)`);
          grad.addColorStop(0.5, `rgba(200,255,220,${alpha * 0.3})`);
          grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(this.x, this.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = this.width;
          ctx.lineCap = 'round';
          ctx.stroke();

          // glowing head
          const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 4);
          grd.addColorStop(0, `rgba(255,255,255,${alpha})`);
          grd.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.width * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        },
      };
      star.reset(initial, WRef.current, HRef.current);
      return star;
    };

    const init = () => {
      resize();

      // Static stars (600)
      staticStarsRef.current = Array.from({ length: 600 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      // Shooting stars (10)
      shootersRef.current = Array.from({ length: 10 }, () => createShootingStar(true));

      rotationRef.current = 0;
      frameRef.current = 0;
      isInitializedRef.current = true;
    };

    const drawFrame = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, WRef.current, HRef.current);
      frameRef.current++;
      rotationRef.current += 0.00006;

      // Rotating static star field
      ctx.save();
      ctx.translate(WRef.current / 2, HRef.current / 2);
      ctx.rotate(rotationRef.current);
      ctx.translate(-WRef.current / 2, -HRef.current / 2);

      for (const s of staticStarsRef.current) {
        const twinkle = 0.5 + 0.5 * Math.sin(frameRef.current * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.a * (0.5 + 0.5 * twinkle);
        ctx.beginPath();
        ctx.arc(
          s.x * WRef.current * 1.5 - WRef.current * 0.25,
          s.y * HRef.current * 1.5 - HRef.current * 0.25,
          s.r,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
      ctx.restore();

      // Shooting stars
      for (const s of shootersRef.current) {
        s.update(WRef.current, HRef.current);
        s.draw(ctx);
      }

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    init();
    drawFrame();

    window.addEventListener('resize', () => {
      resize();
      // Reinitialize stars on resize
      staticStarsRef.current = Array.from({ length: 600 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.3 + 0.2,
        a: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
      shootersRef.current = Array.from({ length: 10 }, () => createShootingStar(true));
      rotationRef.current = 0;
      frameRef.current = 0;
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
      } else if (!animationRef.current) {
        drawFrame();
      }
    };
    mediaQuery.addEventListener?.('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', init);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mediaQuery.removeEventListener?.('change', handleMotionChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, []);

  return <canvas id="stars-canvas" ref={canvasRef} aria-hidden="true" />;
}