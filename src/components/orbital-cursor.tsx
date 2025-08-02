
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function OrbitalCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    document.documentElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.documentElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'cursor-container'
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className="cursor-dot" />
      <div className="cursor-ring" />
    </div>
  );
}
