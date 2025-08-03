
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const TRAIL_LENGTH = 12;

export function OrbitalCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef(Array(TRAIL_LENGTH).fill(0).map(() => ({ x: 0, y: 0 })));
  
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const selector = 'button, a, input, textarea, [role=button], [tabindex]:not([tabindex="-1"])';
      if (target.closest(selector)) {
        setIsActive(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
       const selector = 'button, a, input, textarea, [role=button], [tabindex]:not([tabindex="-1"])';
       if (target.closest(selector)) {
        setIsActive(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    let animationFrameId: number;

    const animate = () => {
      // Animate Dot (comet head)
      const { x, y } = mousePos.current;
      dotPos.current.x = x;
      dotPos.current.y = y;
       if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x}px, ${dotPos.current.y}px) translate(-50%, -50%)`;
      }

      // Animate Ring
      ringPos.current.x += (x - ringPos.current.x) * 0.19;
      ringPos.current.y += (y - ringPos.current.y) * 0.19;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }
      
      // Animate Trail
      let prevPos = { ...dotPos.current };
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const currentTrailPos = { ...trailPos.current[i] };
        trailPos.current[i].x += (prevPos.x - trailPos.current[i].x) * 0.4;
        trailPos.current[i].y += (prevPos.y - trailPos.current[i].y) * 0.4;
        prevPos = currentTrailPos;
        
        const ref = trailRefs.current[i];
        if(ref) {
          ref.style.transform = `translate(${trailPos.current[i].x}px, ${trailPos.current[i].y}px) translate(-50%, -50%)`;
        }
      }
      
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
      <div ref={dotRef} className="comet-cursor-dot" style={{ left: 0, top: 0, willChange: 'transform' }} />
      <div ref={ringRef} className={cn("comet-cursor-ring", { active: isActive })} style={{ left: 0, top: 0, willChange: 'transform' }}/>
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          className="comet-cursor-dot"
          style={{
            left: 0,
            top: 0,
            opacity: (1 - i / TRAIL_LENGTH).toFixed(2),
            transition: 'none',
            animation: 'none',
            willChange: 'transform'
          }}
        />
      ))}
    </>
  );
}
