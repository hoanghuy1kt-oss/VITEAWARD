import React from 'react';
import { motion } from 'framer-motion';

export default function StaggeredText({ text, delay = 0, className = '' }) {
  // Split text into words, then characters, to maintain spacing
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)',
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-flex', flexWrap: 'wrap' }}
    >
      {words.map((word, index) => (
        <span key={index} style={{ display: 'inline-flex', whiteSpace: 'nowrap', marginRight: '0.25em' }}>
          {Array.from(word).map((char, charIndex) => (
            <motion.span variants={child} key={charIndex} style={{ display: 'inline-block' }}>
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}
