import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, ArrowLeft, Scissors,
  Share2, Heart, MessageCircle, Maximize, Settings,
  RotateCcw, SkipForward, Check
} from 'lucide-react';
import { movies, series, anime } from '../data/content';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showClipCreator, setShowClipCreator] = useState(false);
  const [volume, setVolume] = useState(80);

  // Find content
  const allContent = [...movies, ...series, ...anime];
  const content = allContent.find(c => c.id === id) || movies[0];

  // Clip Creator State
  const [clipRange, setClipRange] = useState([20, 50]); // % based for UI

  const handleCreateClip = () => {
    setShowClipCreator(true);
    setIsPlaying(false);
  };

  const closeClipCreator = () => {
    setShowClipCreator(false);
    setIsPlaying(true);
  }

  return (
    <div
      className="fixed inset-0 bg-black z-[100] flex items-center justify-center font-sans"
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(prev => !prev)}
    >
      {/* Back Button */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-0 right-0 p-6 z-50 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none"
          >
            <button
              onClick={() => navigate(-1)}
              className="pointer-events-auto p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="text-right pointer-events-auto">
              <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-2xl">{content.title}</h2>
              <div className="flex items-center justify-end gap-2 text-gray-300 text-sm font-medium mt-1">
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs border border-white/10">HD</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs border border-white/10">5.1</span>
                <span>S1:E1 • "Chapter One"</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Background Effect */}
      <div
        className="absolute inset-0 z-0 opacity-50 blur-3xl scale-110 pointer-events-none"
        style={{
          backgroundImage: `url(${content.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

      {/* Video Placeholder Area */}
      <div className="w-full h-full relative z-10 flex items-center justify-center overflow-hidden">
        {/* Simulated Buffering/Loading State when not playing */}
        <AnimatePresence>
          {!isPlaying && !showClipCreator && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 backdrop-blur-sm"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-brand-red blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
                <div className="bg-brand-red p-6 rounded-full shadow-2xl relative z-10 border border-white/20">
                  <Play size={48} fill="white" className="text-white ml-2" />
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The "Video" Content */}
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }} // Slow zoom effect while playing
          src={content.image.replace('w500', 'original')}
          alt={content.title}
          className="w-full h-full object-contain shadow-2xl"
        />

        {/* Cinematic Bars (Letterboxing) */}
        <div className="absolute top-0 left-0 right-0 h-[10vh] bg-black/90 z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black/90 z-20" />
      </div>

      {/* Clip Creator Overlay */}
      <AnimatePresence>
        {showClipCreator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing controls
            className="absolute inset-x-4 bottom-24 top-24 md:inset-x-20 md:bottom-32 md:top-32 bg-rich-gray/90 backdrop-blur-xl rounded-2xl border border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Scissors size={20} className="text-brand-red" /> Create Clip
              </h3>
              <button
                onClick={closeClipCreator}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {/* Timeline Area */}
            <div className="flex-1 p-8 flex flex-col justify-center items-center">
              <div className="w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg mb-8 group border border-white/5">
                <img src={content.image} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-mono text-brand-red bg-black/50 px-3 py-1 rounded">PREVIEW MODE</p>
                </div>
                {/* Trimmer UI */}
                <div className="absolute bottom-4 left-4 right-4 h-12 bg-gray-800/80 rounded border border-gray-600 flex items-center px-1">
                  <div
                    className="h-full bg-brand-red/20 border-x-4 border-brand-red absolute"
                    style={{ left: `${clipRange[0]}%`, right: `${100 - clipRange[1]}%` }}
                  >
                    <div className="absolute top-1/2 left-2 text-xs font-bold text-white -translate-y-1/2">Start</div>
                    <div className="absolute top-1/2 right-2 text-xs font-bold text-white -translate-y-1/2">End</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/clips')}
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  <Share2 size={18} /> Share to Feed
                </button>
                <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                  <Share2 size={18} /> Share to X
                </button>
                <button className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-700 transition">
                  <Share2 size={18} /> Share to Insta
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Controls Bar */}
      <AnimatePresence>
        {showControls && !showClipCreator && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-0 left-0 right-0 p-6 pt-24 bg-gradient-to-t from-black via-black/80 to-transparent z-40 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-auto max-w-7xl mx-auto w-full">
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-700 rounded-full mb-4 cursor-pointer group hover:h-2.5 transition-all">
                <div className="h-full bg-brand-red w-[45%] relative rounded-full">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-red rounded-full opacity-0 group-hover:opacity-100 shadow-lg scale-0 group-hover:scale-100 transition-all" />
                </div>
              </div>

              <div className="flex justify-between items-center bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-6">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-brand-red transition text-white hover:scale-110 active:scale-95 duration-200">
                    {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                  </button>

                  <div className="flex items-center gap-4 text-gray-400">
                    <button className="hover:text-white transition hover:bg-white/10 p-2 rounded-full"><RotateCcw size={20} /></button>
                    <button className="hover:text-white transition hover:bg-white/10 p-2 rounded-full"><SkipForward size={20} /></button>
                  </div>

                  <div className="flex items-center gap-3 group/vol relative">
                    <Volume2 size={24} className="text-white cursor-pointer" />
                    <div className="w-0 group-hover/vol:w-24 transition-all duration-300 overflow-hidden">
                      <div className="w-20 h-1.5 bg-gray-600 rounded-full ml-2 relative">
                        <div className="absolute inset-y-0 left-0 bg-white w-[80%] rounded-full" />
                      </div>
                    </div>
                  </div>

                  <span className="text-sm font-mono text-gray-300 border-l border-white/10 pl-6">12:43 / 45:00</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* CLIP BUTTON */}
                  <button
                    onClick={handleCreateClip}
                    className="flex items-center gap-2 bg-gradient-to-r from-brand-red to-red-600 text-white px-5 py-2 rounded-full hover:shadow-[0_0_15px_rgba(229,9,20,0.5)] transition font-bold text-sm border border-red-500/50"
                  >
                    <Scissors size={18} />
                    Clip That
                  </button>

                  <div className="w-px h-8 bg-white/20 mx-2" />

                  <button className="hover:text-white text-gray-400 transition hover:bg-white/10 p-2 rounded-full">
                    <Settings size={22} />
                  </button>
                  <button className="hover:text-white text-gray-400 transition hover:bg-white/10 p-2 rounded-full">
                    <Maximize size={22} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Player;
