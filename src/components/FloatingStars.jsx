import React, { useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function FloatingStars() {
  // Generate static stars once
  const [stars] = useState(() => 
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 140 - 20}%`, // Spread stars over 140% of the height
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1.5}px`,
      delay: `${Math.random() * 4}s`,
      duration: `${Math.random() * 3 + 2}s`
    }))
  );

  const { scrollY } = useScroll();
  // Parallax effect: moves up slightly as you scroll down
  const y = useTransform(scrollY, [0, 2000], [0, -300]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 15, mass: 0.1 });

  return (
    <motion.div style={{ 
      position: 'fixed', 
      top: '-20%', left: 0, right: 0, bottom: '-20%', // Larger than viewport to prevent empty edges
      overflow: 'hidden', 
      pointerEvents: 'none', 
      zIndex: 0,
      y: smoothY,
      willChange: "transform"
    }}>
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
    </motion.div>
  );
}
