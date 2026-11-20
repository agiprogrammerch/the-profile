'use client';

import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const checkPointer = () => {
      const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      setIsFinePointer(mediaQuery.matches);
    };

    checkPointer();
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    mediaQuery.addEventListener?.('change', checkPointer);

    return () => mediaQuery.removeEventListener?.('change', checkPointer);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isFinePointer]);

  useEffect(() => {
    if (!isFinePointer) return;

    const animateRing = () => {
      const dx = mouseRef.current.x - ringPosRef.current.x;
      const dy = mouseRef.current.y - ringPosRef.current.y;
      ringPosRef.current.x += dx * 0.15;
      ringPosRef.current.y += dy * 0.15;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosRef.current.x}px`;
        ringRef.current.style.top = `${ringPosRef.current.y}px`;
      }

      animationRef.current = requestAnimationFrame(animateRing);
    };

    animateRing();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isFinePointer]);

  useEffect(() => {
    if (!isFinePointer) return;

    const interactiveSelector = 'a, button, .skill-card, .project-card, .quick-command, .stat-box, .lock-visual, .terminal-window, .sandbox-terminal, input, textarea, select';

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(interactiveSelector);
      if (interactive && ringRef.current) {
        ringRef.current.style.transform = 'translate(-50%, -50%) scale(1.6)';
        ringRef.current.style.borderColor = 'rgba(0,255,65,0.8)';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(interactiveSelector);
      // Only reset if we're actually leaving an interactive element
      if (interactive && ringRef.current) {
        // Check if the related target is also inside an interactive element
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!relatedTarget || !relatedTarget.closest(interactiveSelector)) {
          ringRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
          ringRef.current.style.borderColor = 'rgba(0,255,65,0.5)';
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
      <div id="cursor" ref={cursorRef} aria-hidden="true" />
      <div id="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}