
"use client";

import React, { useEffect, useRef, useState } from 'react';

export function OrbitalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Prevent server-side execution
    if (typeof window === 'undefined') {
      return;
    }

    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    
    const showActive = () => setActive(true);
    const hideActive = () => setActive(false);

    window.addEventListener('mousemove', move);

    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, [role=button], [tabindex]:not([tabindex="-1"])'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', showActive);
      el.addEventListener('mouseleave', hideActive);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', showActive);
        el.removeEventListener('mouseleave', hideActive);
      });
    };
  }, []);

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
