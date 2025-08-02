
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function OrbitalCursor() {
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
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div 
        className={cn(
            "absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 transition-all duration-300",
            isHovering ? 'scale-150 border-accent' : 'border-accent/70'
        )}
        style={{
          boxShadow: `0 0 ${isHovering ? '12px' : '8px'} 0 hsl(var(--accent) / 0.8)`,
        }}
      >
        <div 
            className={cn(
                "absolute -left-[5px] -top-[5px] h-[10px] w-[10px] rounded-full bg-accent transition-all duration-300",
                 isHovering ? "scale-125" : "scale-100"
            )} 
            style={{
                animation: 'orbit 4s linear infinite',
                boxShadow: `0 0 6px 0 hsl(var(--accent))`,
            }}
        />
      </div>
    </div>
  );
}
