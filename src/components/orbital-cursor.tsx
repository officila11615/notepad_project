
"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function OrbitalCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      
      setIsMoving(true);
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }
      idleTimeout.current = setTimeout(() => setIsMoving(false), 200);
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
    
    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    }

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);

      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }
    };
  }, [isVisible]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'cursor-container',
        isHovering && 'hovering',
        !isVisible && 'hidden',
        isMoving && 'moving'
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <div className="cursor-dot" />
      <div className="cursor-ring" />
      <div className="cursor-particle" />
    </div>
  );
}
