
"use client";

import React from 'react';

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      
      {/* Stars */}
      <div id="stars-container" className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-small-${i}`}
            className="absolute w-0.5 h-0.5 bg-gray-400 rounded-full animate-star-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          />
        ))}
        {[...Array(25)].map((_, i) => (
          <div
            key={`star-medium-${i}`}
            className="absolute w-1 h-1 bg-gray-300 rounded-full animate-star-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 5 + 5}s`,
            }}
          />
        ))}
      </div>

      {/* Planets and Orbits */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-px h-px">
          {/* Planet 1 */}
          <div className="absolute animate-planet-orbit-1">
             <div className="relative w-20 h-20">
               <div className="absolute inset-0 rounded-full bg-purple-500 opacity-50 blur-2xl"></div>
               <div
                className="absolute inset-2.5 rounded-full"
                style={{ background: 'radial-gradient(circle at 30% 30%, hsl(260, 100%, 80%), hsl(260, 90%, 50%))' }}
              ></div>
             </div>
          </div>
          {/* Planet 2 */}
          <div className="absolute animate-planet-orbit-2">
            <div className="relative w-12 h-12">
               <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-50 blur-xl"></div>
              <div
                className="absolute inset-2 rounded-full"
                style={{ background: 'radial-gradient(circle at 70% 70%, hsl(180, 100%, 70%), hsl(180, 90%, 40%))' }}
              ></div>
            </div>
          </div>
           {/* Planet 3 */}
           <div className="absolute animate-planet-orbit-3">
             <div className="relative w-16 h-16">
               <div className="absolute inset-0 rounded-full bg-pink-500 opacity-50 blur-2xl"></div>
               <div
                 className="absolute inset-2 rounded-full"
                 style={{ background: 'radial-gradient(circle at 20% 80%, hsl(300, 100%, 80%), hsl(300, 90%, 50%))' }}
               ></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
