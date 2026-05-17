import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Particle = ({ size, top, left, delay, duration }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: 'rgba(212, 175, 55, 0.4)',
        borderRadius: '50%',
        top: `${top}%`,
        left: `${left}%`,
        filter: 'blur(1px)',
        zIndex: -1,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
};

export default function InteractiveBackground() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}>
      <motion.div style={{ position: 'relative', width: '100%', height: '120%', y }}>
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </motion.div>
      
      {/* Light spots */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-10%', 
          left: '20%', 
          width: '600px', 
          height: '600px', 
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} 
      />
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '10%', 
          right: '5%', 
          width: '500px', 
          height: '500px', 
          background: 'radial-gradient(circle, rgba(22, 48, 107, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} 
      />
    </div>
  );
}
