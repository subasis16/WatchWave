import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const OpeningAnimation = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide component after animation finishes (4s)
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 200);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: [1, 1, 0] }}
      transition={{ duration: 4, times: [0, 0.8, 1], ease: "easeInOut" }}
    >
      
      {/* Background Cinematic Glow that pulses */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
        className="absolute w-[60vw] h-[60vw] bg-accent-gold/[0.08] blur-[150px] rounded-full"
      />

      {/* The massive W that scales up like the Netflix N */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1, 8], opacity: [0, 1, 0] }}
        transition={{ 
          duration: 3.8, 
          times: [0, 0.4, 1], // Zoom out smoothly
          ease: "easeInOut" 
        }}
        className="relative flex items-center justify-center"
      >
        {/* The 'W' Text with specialized styling */}
        <h1 
          className="text-8xl md:text-[150px] font-black tracking-tighter text-transparent bg-clip-text"
          style={{ 
            backgroundImage: 'linear-gradient(to bottom right, #ffffff, rgba(255,215,0,0.8), #000000)',
            textShadow: '0 0 50px rgba(255,215,0,0.4)'
          }}
        >
          W
        </h1>
      </motion.div>

      {/* Subtext 'WATCHWAVE' that appears and then scales/fades with the main logo */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: [0, 1, 0], y: [50, 0, 0], scale: [1, 1, 2] }}
        transition={{ 
          duration: 3.8,
          times: [0, 0.4, 1],
          ease: "easeInOut" 
        }}
        className="absolute bottom-1/4"
      >
        <h2 className="text-[12px] font-black text-gray-500 uppercase tracking-[1em] drop-shadow-2xl ml-4">
          WatchWave
        </h2>
      </motion.div>
    </motion.div>
  );
};

export default OpeningAnimation;
