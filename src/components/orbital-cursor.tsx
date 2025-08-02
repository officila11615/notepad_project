
"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function OrbitalCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const auraRef = useRef<HTMLDivElement>(null);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const auraPosition = useRef({ x: 0, y: 0 }).current;

  useEffect(() => {
    const resetIdleTimeout = () => {
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }
      setIsIdle(false);
      idleTimeout.current = setTimeout(() => setIsIdle(true), 1500);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      resetIdleTimeout();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        setIsHovering(true);
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        setIsHovering(false);
      }
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    const animateAura = () => {
        if (!auraRef.current) return;

        let targetX = position.x;
        let targetY = position.y;

        if (isIdle) {
            targetX = window.innerWidth / 2;
            targetY = window.innerHeight / 2;
        }

        const dx = targetX - auraPosition.x;
        const dy = targetY - auraPosition.y;

        auraPosition.x += dx * 0.1;
        auraPosition.y += dy * 0.1;

        auraRef.current.style.transform = `translate(${auraPosition.x}px, ${auraPosition.y}px)`;

        requestAnimationFrame(animateAura);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    
    resetIdleTimeout();
    requestAnimationFrame(animateAura);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }
    };
  }, [isVisible, isIdle, position.x, position.y, auraPosition]);

  const getDotPosition = () => {
    if (isIdle) {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
    return position;
  };
  
  const dotPosition = getDotPosition();

  return (
    <>
      <div
        className={cn(
          "cursor-dot",
          isHovering && "hovering",
          isIdle && "idle",
          !isVisible && "hidden"
        )}
        style={{
          transform: `translate(${dotPosition.x}px, ${dotPosition.y}px)`,
        }}
      />
      <div
        ref={auraRef}
        className={cn(
          "cursor-aura",
          isHovering && "hovering",
          isIdle && "idle",
          !isVisible && "hidden"
        )}
      />
    </>
  );
}
