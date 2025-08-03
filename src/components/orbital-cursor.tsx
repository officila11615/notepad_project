
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function OrbitalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Using refs for position to avoid re-renders on every mouse move
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Move dot directly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      }

      // Animate ring with a delay
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.19;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.19;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    const showActive = () => setIsActive(true);
    const hideActive = () => setIsActive(false);

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, [role=button], [tabindex]:not([tabindex="-1"])'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', showActive);
      el.addEventListener('mouseleave', hideActive);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', showActive);
        el.removeEventListener('mouseleave', hideActive);
      });
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="comet-cursor-dot" />
      <div ref={ringRef} className={cn('comet-cursor-ring', isActive && 'active')} />
    </>
  );
}
