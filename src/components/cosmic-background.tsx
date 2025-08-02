
"use client";

import React, { useState, useEffect } from 'react';

interface Star {
  key: string;
  className: string;
  style: React.CSSProperties;
}

export function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);

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
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
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
