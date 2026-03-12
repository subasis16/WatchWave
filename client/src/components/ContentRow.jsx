import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
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
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-8 px-4 sm:px-6 lg:px-8 relative z-20 group"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
        <span className="w-1.5 h-8 bg-brand-red mr-4 rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)]"></span>
        {title}
      </h2>

      <div className="relative">
        {/* Cards Container */}
        {ranked ? (
          <div className="flex flex-nowrap overflow-x-visible gap-2 md:gap-4 pb-12 px-2 md:px-6 scroll-smooth no-scrollbar">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={() => handleCardClick(item)}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                className="relative shrink-0 h-[180px] sm:h-[220px] md:h-[260px] flex items-end group cursor-pointer pr-4 md:pr-6"
              >
                {/* Number Overlay Layer */}
                <span
                  className="absolute left-[-10px] md:left-[-15px] bottom-[-20px] md:bottom-[-25px] text-[120px] sm:text-[150px] md:text-[190px] font-black leading-none z-20 pointer-events-none tracking-tighter drop-shadow-2xl"
                  style={{
                    WebkitTextStroke: '4px #808080',
                    color: '#0B0C10',
                    textShadow: '3px 3px 10px rgba(0,0,0,0.8)'
                  }}>
                  {index + 1}
                </span>

                {/* Portrait Image Container */}
                <div className="ml-[45px] sm:ml-[60px] md:ml-[85px] h-full aspect-[2/3] z-10 rounded-md overflow-hidden relative shadow-[8px_0_20px_rgba(0,0,0,0.8)] bg-zinc-900 border border-transparent group-hover:border-white/20 transition-colors">
                  {showTrailer && hoveredId === item.id && item.trailerUrl ? (
                    <iframe
                      src={`${item.trailerUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.trailerUrl.split('/').pop()}`}
                      className="w-full h-full object-cover pointer-events-none scale-110"
                      title={item.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Subtle hover play overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-black/50 border-2 border-white rounded-full flex items-center justify-center pt-0.5 pl-0.5 md:pl-1 shadow-[0_0_15px_rgba(255,255,255,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300 group-hover:bg-[#e50914] group-hover:border-[#e50914]">
                      <Play className="w-4 h-4 md:w-6 md:h-6 text-white fill-current" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8 px-1">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={() => handleCardClick(item)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                className="relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group/card border border-white/5 bg-rich-gray hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-shadow duration-300"
              >
                {showTrailer && hoveredId === item.id && item.trailerUrl ? (
                  <div className="absolute inset-0 z-0">
                    <iframe
                      src={`${item.trailerUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${item.trailerUrl.split('/').pop()}`}
                      className="w-full h-full object-cover pointer-events-none scale-[1.5]"
                      title={item.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                    loading="lazy"
                  />
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                  <h3 className="text-white font-bold text-lg mb-1 leading-tight">{item.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-300 mb-3 font-medium">
                    <span className="text-brand-red">{item.match}% Match</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span>{item.year}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="border border-gray-500 px-1 rounded text-gray-400">{item.age}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/player/${item.id}`); }}
                      className="flex-1 py-2 bg-white rounded-lg text-black hover:bg-[#e50914] hover:text-white transition flex items-center justify-center font-bold text-sm transform hover:scale-105 duration-200"
                    >
                      <Play size={16} className="mr-1 fill-current" /> Play
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="p-2 border border-gray-500 rounded-full hover:border-white hover:bg-white/10 transition text-white hover:scale-110">
                      <Plus size={18} />
                    </button>
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
