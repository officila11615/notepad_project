
"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function OrbitalCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const moveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      setIsMoving(true);

      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }

      moveTimeout.current = setTimeout(() => setIsMoving(false), 300);
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

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-50 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
        )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
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
                animation: isMoving ? 'orbit 4s linear infinite' : 'none',
                boxShadow: `0 0 6px 0 hsl(var(--accent))`,
            }}
        />
      </div>
    </div>
  );
}
