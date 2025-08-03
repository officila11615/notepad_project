
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
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;
      
      const container = document.getElementById('cosmic-background-container');
      if (container) {
        container.style.setProperty('--mouse-x-sm', `-${x * 10}px`);
        container.style.setProperty('--mouse-y-sm', `-${y * 10}px`);
        container.style.setProperty('--mouse-x-md', `-${x * 20}px`);
        container.style.setProperty('--mouse-y-md', `-${y * 20}px`);
        container.style.setProperty('--mouse-x-lg', `-${x * 40}px`);
        container.style.setProperty('--mouse-y-lg', `-${y * 40}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div 
      id="cosmic-background-container"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-background"
      style={{
        '--mouse-x-sm': '0',
        '--mouse-y-sm': '0',
        '--mouse-x-md': '0',
        '--mouse-y-md': '0',
        '--mouse-x-lg': '0',
        '--mouse-y-lg': '0',
      } as React.CSSProperties}
    >
      <div className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isBackgroundGlowing ? "opacity-30" : "opacity-100"
      )}>
        <div className="stars"></div>
        <div className="stars-2"></div>
        <div className="stars-twinkle"></div>
        <div className="nebula"></div>
      </div>
       <div className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.3),rgba(var(--primary-rgb),0)_50%)] transition-opacity duration-1000",
          isBackgroundGlowing ? "opacity-100" : "opacity-0"
        )}>
      </div>
    </div>
  );
}

    