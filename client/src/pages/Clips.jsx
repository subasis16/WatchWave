import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors, Play, Heart, Share2, MessageCircle,
  MoreVertical, X, Check,
  Clock, Type, Music, Sliders
} from 'lucide-react';

const Clips = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [trimRange, setTrimRange] = useState([10, 40]); // Mock seconds

  const initialClips = [
    { id: 1, title: "Iron Man Snap", user: "MarvelFan99", views: "1.2M", likes: "45K", image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", duration: "0:58" },
    { id: 2, title: "Luffy Gear 5", user: "PirateKing", views: "850K", likes: "92K", image: "https://image.tmdb.org/t/p/w500/e3NBGiAifW9Xt8xD5tpARskjccO.jpg", duration: "0:30" },
    { id: 3, title: "Wednesday Dance", user: "GothGirl", views: "3.4M", likes: "150K", image: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg", duration: "0:45" },
    { id: 4, title: "Walter White Laugh", user: "Heisenberg", views: "500K", likes: "22K", image: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", duration: "0:35" },
  ];

  const sourceVideos = [
    { id: 'v1', title: 'Spider-Man: Across the Spider-Verse', image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
    { id: 'v2', title: 'The Dark Knight', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
  ];

  const handleCreateOpen = () => {
    setIsCreating(true);
    setSelectedVideo(sourceVideos[0]); // Default selection
  };

  const handleShare = () => {
    // Logic to add to list or notify
    setIsCreating(false);
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-deep-black">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-orange-500">
              Community Clips
            </h1>
            <p className="text-gray-400 mt-1">Capture, edit, and share iconic moments.</p>
          </div>
          <button
            onClick={handleCreateOpen}
            className="flex items-center gap-2 bg-brand-red text-white px-6 py-2.5 rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-brand-red/20"
          >
            <Scissors size={20} />
            Create Clip
          </button>
        </div>

        {/* Create Interface Overlay */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <div className="bg-rich-gray w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row h-[80vh] md:h-auto">

                {/* Preview Section */}
                <div className="flex-1 bg-black relative flex items-center justify-center p-4">
                  <div className="aspect-video w-full max-w-xl bg-gray-900 rounded-lg overflow-hidden relative group">
                    <img
                      src={selectedVideo?.image}
                      alt="Preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                    {/* Fake Play UI */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                        <Play size={32} fill="white" className="text-white" />
                      </div>
                    </div>
                    {/* Timestamp Overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 rounded text-xs font-mono">
                      00:{trimRange[0]} / 00:{trimRange[1]} (30s)
                    </div>
                  </div>
                </div>

                {/* Editor Tools Section */}
                <div className="w-full md:w-96 bg-rich-gray p-6 flex flex-col border-l border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Clip Editor</h2>
                    <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Movie Selector */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Source Media</label>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {sourceVideos.map(v => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVideo(v)}
                            className={`flex-shrink-0 w-24 rounded-lg overflow-hidden border-2 transition ${selectedVideo?.id === v.id ? 'border-brand-red' : 'border-transparent opacity-60'}`}
                          >
                            <img src={v.image} className="w-full h-16 object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Slider (Mock) */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span><Clock size={12} className="inline mr-1" /> Timeline</span>
                        <span>30s selected</span>
                      </div>
                      <div className="h-12 bg-gray-800 rounded-lg relative overflow-hidden flex items-center px-4 cursor-ew-resize">
                        {/* Fake Waveform */}
                        <div className="flex gap-0.5 items-end justify-center w-full h-full opacity-30">
                          {[...Array(40)].map((_, i) => (
                            <div key={i} className="bg-white w-1" style={{ height: `${Math.random() * 80 + 20}%` }} />
                          ))}
                        </div>
                        {/* Selector Box */}
                        <div className="absolute left-1/4 right-1/4 h-full border-2 border-brand-red bg-brand-red/10 flex justify-between items-center px-1">
                          <div className="w-1 h-6 bg-white rounded-full"></div>
                          <div className="w-1 h-6 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                        <Type size={16} className="text-blue-400" /> Text
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                        <Music size={16} className="text-green-400" /> Sound
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                        <Sliders size={16} className="text-orange-400" /> Filter
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                        <Scissors size={16} className="text-red-400" /> Crop
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <button
                      onClick={handleShare}
                      className="w-full bg-brand-red hover:bg-brand-dark-red text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition"
                    >
                      <Share2 size={18} /> Share Clip
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clips Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialClips.map((clip, index) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-rich-gray rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-brand-red/5 transition-all duration-300 group"
            >
              <div className="relative aspect-[9/16] overflow-hidden">
                <img
                  src={clip.image}
                  alt={clip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/30 transition">
                    <Play size={32} fill="white" className="text-white ml-1" />
                  </button>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded text-xs font-bold font-mono">
                  {clip.duration}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold">
                      {clip.user.charAt(0)}
                    </span>
                    <span className="text-xs font-medium text-gray-300">@{clip.user}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg leading-tight mb-3 line-clamp-2">{clip.title}</h3>

                  {/* Action Bar */}
                  <div className="flex justify-between items-center text-gray-400">
                    <button className="flex items-center gap-1 hover:text-red-500 transition">
                      <Heart size={18} /> <span className="text-xs">{clip.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400 transition">
                      <MessageCircle size={18} /> <span className="text-xs">240</span>
                    </button>
                    <button className="hover:text-white transition">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* New Clip Mock Placeholder (for aesthetic balance) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleCreateOpen}
            className="bg-rich-gray/30 border-2 border-dashed border-gray-700 rounded-xl overflow-hidden hover:bg-rich-gray/50 hover:border-gray-500 transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center group aspect-[9/16]"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scissors size={24} className="text-gray-400 group-hover:text-white" />
            </div>
            <h3 className="font-bold text-gray-300 text-lg">Create New</h3>
            <p className="text-gray-500 text-sm mt-2">Trim & Share your favorite scenes</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Clips;
