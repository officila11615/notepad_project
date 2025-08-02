
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function OrbitalCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    document.documentElement.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'cursor-container',
        !isVisible && 'hidden'
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className="cursor-dot" />
    </div>
  );
}
