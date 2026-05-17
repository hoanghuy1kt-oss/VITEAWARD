import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState('default');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = () => {
      const interactives = document.querySelectorAll('a, button, .interactive');
      
      const onMouseEnter = (e) => {
        const target = e.currentTarget;
        if (target.classList.contains('btn-primary')) {
          setCursorType('large');
        } else {
          setCursorType('medium');
        }
      };

      const onMouseLeave = () => setCursorType('default');

      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });

      return () => {
        interactives.forEach((el) => {
          el.removeEventListener('mouseenter', onMouseEnter);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      };
    };

    window.addEventListener('mousemove', moveMouse);
    
    // Initial attachment and also re-attach on DOM changes (simple version)
    const observer = new MutationObserver(handleHover);
    observer.observe(document.body, { childList: true, subtree: true });
    
    const cleanup = handleHover();

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      observer.disconnect();
      if (cleanup) cleanup();
    };
  }, [mouseX, mouseY]);

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: 'rgba(212, 175, 55, 0.8)',
      mixBlendMode: 'normal'
    },
    medium: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(212, 175, 55, 0.15)',
      border: '1px solid rgba(212, 175, 55, 0.4)',
      mixBlendMode: 'screen'
    },
    large: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(212, 175, 55, 0.6)',
      mixBlendMode: 'difference'
    }
  };

  return (
    <motion.div
      className="custom-cursor"
      style={{
        translateX: cursorX,
        translateY: cursorY,
        x: '-50%',
        y: '-50%',
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        borderRadius: '50%',
      }}
      animate={cursorType}
      variants={variants}
      transition={{ type: 'spring', damping: 20, stiffness: 200, mass: 0.5 }}
    />
  );
}
