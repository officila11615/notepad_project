
"use client";

import React, { useEffect, useRef, useState } from 'react';

const TRAIL_LENGTH = 12;

export function OrbitalCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef(Array(TRAIL_LENGTH).fill({ x: 0, y: 0 }));

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const selector = 'button, a, input, textarea, [role=button], [tabindex]:not([tabindex="-1"])';
      if (target.closest(selector)) {
        ringRef.current?.classList.add('active');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      const selector = 'button, a, input, textarea, [role=button], [tabindex]:not([tabindex="-1"])';
      if (target.closest(selector)) {
        ringRef.current?.classList.remove('active');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    let animationFrameId: number;

    const animate = () => {
      // Animate Dot
      dotPos.current.x = mousePos.current.x;
      dotPos.current.y = mousePos.current.y;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px)`;
      }

      // Animate Ring
      ringPos.current.x += (dotPos.current.x - ringPos.current.x) * 0.19;
      ringPos.current.y += (dotPos.current.y - ringPos.current.y) * 0.19;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      
      // Animate Trail
      trailPos.current[0] = { ...dotPos.current };
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trailPos.current[i].x += (trailPos.current[i - 1].x - trailPos.current[i].x) * 0.4;
        trailPos.current[i].y += (trailPos.current[i - 1].y - trailPos.current[i].y) * 0.4;
      }
      
      trailRefs.current.forEach((ref, i) => {
        if(ref) {
            ref.style.transform = `translate(${trailPos.current[i].x}px, ${trailPos.current[i].y}px)`;
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  if (!isMounted) return null;

  return (
    <>
      <div ref={dotRef} className="comet-cursor-dot" style={{ transform: `translate(-100px, -100px)` }} />
      <div ref={ringRef} className="comet-cursor-ring" style={{ transform: `translate(-100px, -100px)` }} />
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el!)}
          className="comet-cursor-dot"
          style={{
            opacity: (1 - i / TRAIL_LENGTH).toFixed(2),
            transform: `translate(-100px, -100px)`,
          }}
        />
      ))}
    </>
  );
}
