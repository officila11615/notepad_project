
"use client";

import React, { useEffect, useRef, useState } from 'react';

const TRAIL_LENGTH = 12;

export function OrbitalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const animationFrameId = useRef<number>();
  const [isMounted, setIsMounted] = useState(false);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef(Array(TRAIL_LENGTH).fill({ x: 0, y: 0 }).map(() => ({x: 0, y: 0})));

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Animate dot
      if (dotRef.current) {
        dotRef.current.style.left = `${mousePos.current.x}px`;
        dotRef.current.style.top = `${mousePos.current.y}px`;
      }
      
      // Animate trailing ring
      if (ringRef.current) {
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.19;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.19;
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      
      // Animate trail
      let lastPos = { ...mousePos.current };
      trailRefs.current.forEach((dot, index) => {
        if (dot) {
          const currentPos = trailPos.current[index];
          const nextPos = index === 0 ? lastPos : trailPos.current[index - 1];
          currentPos.x += (nextPos.x - currentPos.x) * 0.4;
          currentPos.y += (nextPos.y - currentPos.y) * 0.4;
          dot.style.left = `${currentPos.x}px`;
          dot.style.top = `${currentPos.y}px`;
        }
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    const selector = "a, button, input, textarea, .comet-chip, .comet-btn-social, [role=button]";
    
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(selector)) {
        ringRef.current?.classList.add("active");
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
       if ((e.target as Element)?.closest(selector)) {
        ringRef.current?.classList.remove("active");
      }
    };
      
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    mousePos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    ringPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    trailPos.current.forEach(pos => {
        pos.x = window.innerWidth / 2;
        pos.y = window.innerHeight / 2;
    });

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="comet-cursor-dot" />
      <div ref={ringRef} className="comet-cursor-ring" />
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el!)}
          className="comet-cursor-dot"
          style={{ opacity: (1 - i / TRAIL_LENGTH).toFixed(2) }}
        />
      ))}
    </>
  );
}
