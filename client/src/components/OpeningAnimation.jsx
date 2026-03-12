import React, { useEffect, useState } from 'react';

const OpeningAnimation = ({ onComplete }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500); // Allow time for exit transition if any, or just unmount immediately
    }, 2500); // Match animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <div className="animate-intro-scale flex flex-col items-center">
        <h1 className="text-4xl md:text-7xl font-black text-brand-red tracking-[0.2em] shadow-2xl uppercase">
          Watch Wave
        </h1>
      </div>
    </div>
  );
};

export default OpeningAnimation;
