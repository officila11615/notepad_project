
"use client";

import React, { useEffect, useRef, useState } from 'react';

export function OrbitalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    
    const showActive = () => setActive(true);
    const hideActive = () => setActive(false);
    
    window.addEventListener('mousemove', move);

    const selector = 'button, a, input, textarea, [role=button], [tabindex]:not([tabindex="-1"])';
    
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(selector)) {
        setActive(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest(selector)) {
        setActive(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor${active ? ' active' : ''}`}
      aria-hidden
    >
      <div className="cursor-core" />
      <div className="cursor-glow glow-blue" />
      <div className="cursor-glow glow-purple" />
      <div className="cursor-glow glow-pink" />
      <div className="cursor-glow glow-orange" />
    </div>
  );
}

    