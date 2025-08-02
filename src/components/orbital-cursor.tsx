
"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function OrbitalCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [auraPosition, setAuraPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  const animationFrame = useRef<number | null>(null);

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
      if ((e.target as HTMLElement).closest('a, button, [role="button"]')) {
        setIsHovering(true);
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [role="button"]')) {
        setIsHovering(false);
      }
    };
    
    const handleMouseLeave = () => setIsVisible(false);
    
    const animate = () => {
      let targetX = position.x;
      let targetY = position.y;

      if (isIdle) {
        targetX = window.innerWidth / 2;
        targetY = window.innerHeight / 2;
      }
      
      const dx = targetX - auraPosition.x;
      const dy = targetY - auraPosition.y;

      setAuraPosition({
        x: auraPosition.x + dx * 0.1,
        y: auraPosition.y + dy * 0.1
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    
    resetIdleTimeout();
    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [position, auraPosition, isIdle, isVisible]);

  const dotPos = isIdle ? auraPosition : position;

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
          transform: `translate(${dotPos.x}px, ${dotPos.y}px)`,
        }}
      />
      <div
        className={cn(
          "cursor-aura",
          isHovering && "hovering",
          isIdle && "idle",
          !isVisible && "hidden"
        )}
        style={{
          transform: `translate(${auraPosition.x}px, ${auraPosition.y}px)`,
        }}
      />
    </>
  );
}

    