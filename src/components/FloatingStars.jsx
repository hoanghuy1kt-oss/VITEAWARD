import React, { useState } from 'react';

export default function FloatingStars() {
  // Generate static stars once
  const [stars] = useState(() => 
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1.5}px`,
      delay: `${Math.random() * 4}s`,
      duration: `${Math.random() * 3 + 2}s`
    }))
  );

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: '#fff',
            borderRadius: '50%',
            boxShadow: '0 0 6px #fff, 0 0 12px var(--gold-200)',
            animation: `twinkleStar ${star.duration} ease-in-out ${star.delay} infinite`,
            opacity: 0
          }}
        />
      ))}
      <style>{`
        @keyframes twinkleStar {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
