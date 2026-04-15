import React, { useState, useEffect, useCallback } from 'react';
import { Play, Download, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveVideo } from '../utils/offlineStorage';
import toast from 'react-hot-toast';
import { auth } from '../firebase';
import { useTranslation } from '../utils/i18n';

const HERO_DATA = [
  {
    id: 'm1',
    title: 'Avengers: Endgame',
    image: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
    genres: ['Action', 'Sci-Fi'],
    description: 'After the devastating events of Infinity War, the world is in ruins. With the help of remaining allies, the Avengers assemble once more in order to restore order to the world.',
  },
  {
    id: 'b1',
    title: '3 Idiots',
    image: 'https://image.tmdb.org/t/p/w1280/66A9MqXOyVFCssoloscw79z8Tew.jpg', // Confirmed wide backdrop for 3 Idiots
    genres: ['Comedy', 'Drama'],
    description: 'In college, Farhan and Raju form a great bond with Rancho due to his positive and refreshing outlook on life. Years later, a bet gives them a chance to look for their long-lost friend.',
  },
  {
    id: 't4',
    title: 'Oppenheimer',
    image: 'https://image.tmdb.org/t/p/w1280/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg',
    genres: ['Drama', 'History'],
    description: 'During World War II, Lt. Gen. Leslie Groves Jr. appoints physicist J. Robert Oppenheimer to work on the top-secret Manhattan Project.',
  },
  {
    id: 'cr1',
    title: 'The Dark Knight',
    image: 'https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // Wide backdrop for The Dark Knight
    genres: ['Action', 'Crime'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
  }
];

const Hero = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { t } = useTranslation();

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
    <div className="relative h-[78vh] md:h-[95vh] w-full overflow-hidden px-2 md:px-10 pt-20 md:pt-28">
      <div className="glass-card w-full h-full relative overflow-hidden group rounded-[2rem] md:rounded-[3rem]">
        
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

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-16 pb-16 md:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >

              <h1 className="text-4xl md:text-8xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none uppercase">
                {currentMovie.title}
              </h1>
              
              <p className="text-xs md:text-base text-gray-300 mb-6 md:mb-10 line-clamp-2 md:line-clamp-3 max-w-xl font-medium leading-relaxed opacity-80 md:opacity-100">
                {currentMovie.description}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => {
                    if (!auth.currentUser) {
                      toast.error("Please sign in to watch!", {
                        style: { background: 'rgba(0,0,0,0.8)', color: '#fff', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,215,0,0.3)' }
                      });
                      navigate('/auth');
                      return;
                    }
                    navigate(`/player/${currentMovie.id}`);
                  }} 
                  className="glass-pill-active px-6 md:px-10 py-3 md:py-3.5 flex items-center gap-2 md:gap-3 font-bold text-sm md:text-base transition hover:scale-105 active:scale-95 shadow-xl"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                  {t('Watch')}
                </button>
                <button 
                  onClick={async () => {
                    toast.loading(`Downloading ${currentMovie.title}...`, { id: 'download' });
                    const success = await saveVideo(currentMovie, "https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774336485/ONE_PIECE__Season_2___Official_Trailer___Netflix_1080P_HD_ee4vjb.mp4"); // Using Cloudinary Sample
                    if (success) {
                      toast.success(`${currentMovie.title} added to Vault!`, { id: 'download' });
                    } else {
                      toast.error(`Download failed.`, { id: 'download' });
                    }
                  }}
                  className="glass-pill px-8 py-3.5 flex items-center gap-3 font-bold text-base bg-white/10 hover:bg-white/20 transition hover:scale-105 active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  {t('Download')}
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
