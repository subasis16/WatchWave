import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import MovieModal from './MovieModal';

const ContentRow = ({ title, data, ranked = false }) => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const trailerTimerRef = useRef(null);

  const handleMouseEnter = (id) => {
    setHoveredId(id);
    trailerTimerRef.current = setTimeout(() => {
      setShowTrailer(true);
    }, 1500); // Start trailer after 1.5s hover
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setShowTrailer(false);
    if (trailerTimerRef.current) {
      clearTimeout(trailerTimerRef.current);
    }
  };

  const handleCardClick = (item) => {
    setSelectedMovie(item);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-4 px-4 md:px-10"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-4">
          <span className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></span>
          {title}
        </h2>
        {!ranked && (
          <button 
            onClick={() => toast.success(`Browsing all ${title}`)}
            className="glass-pill px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-white"
          >
            See all
          </button>
        )}
      </div>

      <div className="relative">
        {ranked ? (
          <div className="flex flex-nowrap overflow-x-auto gap-12 pb-14 no-scrollbar pt-4 px-4 md:px-10 -mx-4 md:-mx-10 items-end">
            {data.map((item, index) => (
              <div
                key={item.id}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleCardClick(item)}
                className="relative shrink-0 w-[160px] md:w-[240px] aspect-[2/3] group cursor-pointer"
              >
                <div className="glass-card w-full h-full p-1.5 relative z-10 hover:scale-105 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                   {showTrailer && hoveredId === item.id && item.trailerUrl ? (
                    <div className="w-full h-full rounded-2xl overflow-hidden">
                      <iframe
                        src={`${item.trailerUrl}?autoplay=1&mute=1&controls=0&loop=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playlist=${item.trailerUrl.split('/').pop()}`}
                        className="w-full h-full object-cover scale-150"
                        title={item.title}
                        frameBorder="0"
                        allow="autoplay"
                      ></iframe>
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        if (e.target.src.includes('SX700')) {
                          e.target.src = e.target.src.replace('SX700', 'SX300');
                        }
                      }}
                    />
                  )}
                </div>

                {/* Number Overlay - Bottom Right Solid White Style */}
                <span className="absolute -bottom-8 -right-4 text-7xl md:text-9xl font-black italic text-white z-20 select-none pointer-events-none drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={() => handleCardClick(item)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-card p-2 group cursor-pointer hover:scale-105 active:scale-95 transition-all duration-500"
              >
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      if (e.target.src.includes('SX700')) {
                        e.target.src = e.target.src.replace('SX700', 'SX300');
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                
                <div className="px-2 pb-2">
                  <h3 className="text-sm font-bold text-white mb-1 truncate">{item.title}</h3>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] text-gray-400 font-bold">{item.year}</span>
                     <div className="w-6 h-6 glass-pill flex items-center justify-center group-hover:glass-pill-active transition-all">
                       <Play size={10} className="fill-current" />
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
      />
    </motion.div>
  );
};

export default ContentRow;
