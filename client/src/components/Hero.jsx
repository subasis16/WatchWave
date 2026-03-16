import React, { useState, useEffect, useCallback } from 'react';
import { Play, Download, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { saveVideo } from '../utils/offlineStorage';
import toast from 'react-hot-toast';

const HERO_DATA = [
  {
    id: 'h1',
    title: 'Avengers: Endgame',
    image: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    genres: ['Action', 'Sci-Fi'],
    description: 'After the devastating events of Infinity War, the world is in ruins. With the help of remaining allies, the Avengers assemble once more in order to restore order to the world.',
  },
  {
    id: 'h3',
    title: '3 Idiots',
    image: 'https://image.tmdb.org/t/p/w1280/66A9MqXOyVFCssoloscw79z8Tew.jpg', // Confirmed wide backdrop for 3 Idiots
    genres: ['Comedy', 'Drama'],
    description: 'In college, Farhan and Raju form a great bond with Rancho due to his positive and refreshing outlook on life. Years later, a bet gives them a chance to look for their long-lost friend.',
  },
  {
    id: 'h4',
    title: 'Oppenheimer',
    image: 'https://image.tmdb.org/t/p/w1280/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
    genres: ['Drama', 'History'],
    description: 'During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project.',
  },
  {
    id: 'h5',
    title: 'The Dark Knight',
    image: 'https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // Wide backdrop for The Dark Knight
    genres: ['Action', 'Crime'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_DATA.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_DATA.length) % HERO_DATA.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000); // 8-second auto-slide
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.4, 0, 0.2, 1] }
    },
    exit: (direction) => ({
      x: direction < 0 ? '50%' : '-50%',
      opacity: 0,
      transition: { duration: 0.8, ease: "easeInOut" }
    })
  };

  const currentMovie = HERO_DATA[currentIndex];

  return (
    <div className="relative h-[95vh] w-full overflow-hidden px-4 md:px-10 pt-28">
      <div className="glass-card w-full h-full relative overflow-hidden group">
        
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentMovie.image}
              alt={currentMovie.title}
              className="w-full h-full object-cover object-center transition-transform duration-[10s] group-hover:scale-105"
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 pb-24 md:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="glass-pill px-3 py-1 flex items-center gap-1.5 text-[10px] font-bold text-white uppercase tracking-widest bg-white/10">
                  <span className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-pulse"></span>
                  Trending Now
                </span>
                <div className="flex gap-2">
                  {currentMovie.genres.map((genre, idx) => (
                    <span key={idx} className="glass-pill px-3 py-1 text-[10px] font-bold bg-white/5 border-white/5 uppercase">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none uppercase">
                {currentMovie.title}
              </h1>
              
              <p className="text-sm md:text-base text-gray-300 mb-10 line-clamp-3 max-w-xl font-medium leading-relaxed">
                {currentMovie.description}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to={`/player/${currentMovie.id}`} className="glass-pill-active px-10 py-3.5 flex items-center gap-3 font-bold text-base transition hover:scale-105 active:scale-95 shadow-xl">
                  <Play className="w-5 h-5 fill-current" />
                  Watch
                </Link>
                <button 
                  onClick={async () => {
                    toast.loading(`Downloading ${currentMovie.title}...`, { id: 'download' });
                    const success = await saveVideo(currentMovie, "https://www.youtube.com/watch?v=dQw4w9WgXcQ"); // Mock URL
                    if (success) {
                      toast.success(`${currentMovie.title} added to Vault!`, { id: 'download' });
                    } else {
                      toast.error(`Download failed.`, { id: 'download' });
                    }
                  }}
                  className="glass-pill px-8 py-3.5 flex items-center gap-3 font-bold text-base bg-white/10 hover:bg-white/20 transition hover:scale-105 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button 
                  onClick={() => toast.success("Options synchronized")}
                  className="w-14 h-14 glass-pill flex items-center justify-center hover:bg-white/20 transition hover:rotate-90"
                >
                  <MoreHorizontal size={24} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute right-10 bottom-10 hidden md:flex gap-4 z-20">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 glass-pill flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 glass-pill flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110 active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-2 z-20">
          {HERO_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-10 bg-white shadow-[0_0_15px_white]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
