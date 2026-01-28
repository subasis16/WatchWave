import React from 'react';
import { movies } from '../data/content';
import { Play, Plus } from 'lucide-react';

const Movies = () => {
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center">
        <span className="w-1.5 h-10 bg-brand-red mr-4 rounded-full"></span>
        Movies
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((item) => (
          <div
            key={item.id}
            className="relative w-full aspect-[2/3] rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:z-30 hover:shadow-[0_10px_40px_rgba(229,9,20,0.2)] cursor-pointer group/card border border-white/5 bg-rich-gray"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              loading="lazy"
            />

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
                <button className="flex-1 py-2 bg-white rounded-lg text-black hover:bg-brand-red hover:text-white transition flex items-center justify-center font-bold text-sm">
                  <Play size={16} className="mr-1 fill-current" /> Play
                </button>
                <button className="p-2 border border-gray-500 rounded-full hover:border-white hover:bg-white/10 transition text-white">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Movies;
