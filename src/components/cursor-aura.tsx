
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function CursorAura() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
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

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
  
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed -inset-40 z-50 transition-all duration-300",
        isHovering ? "opacity-100" : "opacity-50"
      )}
      style={{
        background: `radial-gradient(600px at ${position.x}px ${position.y}px, hsla(260, 100%, 70%, 0.15), transparent 80%)`,
      }}
    >
      <div 
         className={cn(
            "absolute rounded-full transition-all duration-300",
            isHovering ? "w-10 h-10 opacity-20" : "w-8 h-8 opacity-10"
         )}
         style={{
            left: position.x - (isHovering ? 20 : 16),
            top: position.y - (isHovering ? 20 : 16),
            background: 'hsl(var(--primary))',
            filter: 'blur(12px)',
         }}
      />
    </div>
  );
}
