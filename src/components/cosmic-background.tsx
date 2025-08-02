
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';

export function CosmicBackground() {
  const { isBackgroundGlowing } = useAppState();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return; 
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = (clientY / window.innerHeight) * 2 - 1;
      
      const container = document.getElementById('cosmic-background-container');
      if (container) {
        container.style.setProperty('--mouse-x', `${x * 100}`);
        container.style.setProperty('--mouse-y', `${y * 100}`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      id="cosmic-background-container"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background"
      style={{
        '--mouse-x': '0',
        '--mouse-y': '0',
      } as React.CSSProperties}
    >
      <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isBackgroundGlowing ? "opacity-30" : "opacity-100"
      )}>
        <div id="stars" className="absolute inset-0"></div>
        <div id="stars2" className="absolute inset-0"></div>
        <div id="stars3" className="absolute inset-0"></div>
        <div id="nebula" className="absolute inset-0"></div>
      </div>
       <div className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.3),rgba(var(--primary-rgb),0)_50%)] transition-opacity duration-1000",
          isBackgroundGlowing ? "opacity-100" : "opacity-0"
        )}>
      </div>
    </div>
  );
}
