import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentRow = ({ title, data, ranked = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-8 px-4 sm:px-6 lg:px-8 relative group z-20"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
        <span className="w-1.5 h-8 bg-brand-red mr-4 rounded-full shadow-[0_0_15px_rgba(229,9,20,0.5)]"></span>
        {title}
      </h2>

      <div className="relative">

        {/* Cards Container */}
        {ranked ? (
          <div className="flex flex-nowrap overflow-x-visible gap-4 pb-8 px-1 scroll-smooth no-scrollbar">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="relative min-w-[300px] h-[180px] flex items-center group cursor-pointer"
              >
                <span className="text-[12rem] font-bold text-transparent leading-none -mb-8 z-0 translate-y-2 font-outline-2"
                  style={{ WebkitTextStroke: '4px #595959' }}>
                  {index + 1}
                </span>
                <div className="absolute left-[70px] top-0 bottom-0 right-0 z-10 rounded-lg overflow-hidden border border-white/10 shadow-lg transition-transform duration-300 group-hover:border-white/30">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8 px-1">
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative w-full aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group/card border border-white/5 bg-rich-gray hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] transition-shadow duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg mb-1 leading-tight">{item.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-300 mb-3 font-medium">
                    <span className="text-brand-red">{item.match}% Match</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span>{item.year}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="border border-gray-500 px-1 rounded text-gray-400">{item.age}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Link to={`/player/${item.id}`} className="flex-1 py-2 bg-white rounded-lg text-black hover:bg-brand-red hover:text-white transition flex items-center justify-center font-bold text-sm transform hover:scale-105 duration-200">
                      <Play size={16} className="mr-1 fill-current" /> Play
                    </Link>
                    <button className="p-2 border border-gray-500 rounded-full hover:border-white hover:bg-white/10 transition text-white hover:scale-110">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentRow;
