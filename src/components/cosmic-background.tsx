
"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';

interface Star {
  key: string;
  className: string;
  style: React.CSSProperties;
}

export function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const { isBackgroundGlowing } = useAppState();

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      // Small stars
      for (let i = 0; i < 50; i++) {
        newStars.push({
          key: `star-small-${i}`,
          className: 'absolute w-0.5 h-0.5 bg-gray-400 rounded-full animate-star-twinkle',
          style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 4 + 4}s`,
          },
        });
      }
      // Medium stars
      for (let i = 0; i < 25; i++) {
        newStars.push({
          key: `star-medium-${i}`,
          className: 'absolute w-1 h-1 bg-gray-300 rounded-full animate-star-twinkle',
          style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${Math.random() * 5 + 5}s`,
          },
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);


  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className={cn(
          "absolute inset-0 bg-background transition-opacity duration-1000",
          isBackgroundGlowing ? "opacity-0" : "opacity-100"
        )}>
      </div>
      <div className={cn(
          "absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.3),rgba(var(--primary-rgb),0)_50%)] transition-opacity duration-1000",
          isBackgroundGlowing ? "opacity-100" : "opacity-0"
        )}>
      </div>
      
      {/* Stars */}
      <div id="stars-container" className="absolute inset-0">
        {stars.map(star => (
          <div
            key={star.key}
            className={star.className}
            style={star.style}
          />
        ))}
      </div>
    </div>
  );
}
