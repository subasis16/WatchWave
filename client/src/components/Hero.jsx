import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          src="http://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
          alt="Avengers Endgame Background"
          className="w-full h-full object-cover"
        />
        {/* Adjusted Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/50 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mt-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-brand-red/20 border border-brand-red/50 text-brand-red text-xs font-bold tracking-wider mb-4 backdrop-blur-sm">
            #1 IN THE WORLD
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg leading-tight">
            AVENGERS: <span className="text-brand-red">ENDGAME</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3 max-w-2xl drop-shadow-md">
            After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/player/m1" className="flex items-center px-8 py-3.5 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 transition transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Play className="w-5 h-5 mr-2 fill-current" />
              Watch Now
            </Link>
            <button className="flex items-center px-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition hover:border-white/40">
              <Info className="w-5 h-5 mr-2" />
              Details
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
