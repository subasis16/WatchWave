import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors, Play, Heart, Share2, MessageCircle,
  X, Clock, Type, Music, Sliders, Zap, Pause
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { getClips, saveClip } from '../services/firebase-services';
import { toast } from 'react-hot-toast';

const Clips = () => {
  const [clips, setClips] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [trimRange, setTrimRange] = useState([10, 40]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('trim');
  const [isLoading, setIsLoading] = useState(true);

  const sourceVideos = [
    { id: 'v1', title: 'Spider-Man: ATSV', image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', url: 'https://www.youtube.com/watch?v=shwG742_f8s' },
    { id: 'v2', title: 'The Dark Knight', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY' },
  ];

  useEffect(() => {
    const fetchClips = async () => {
      try {
        const data = await getClips();
        setClips(data);
      } catch (err) {
        console.error("Error fetching clips:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClips();
  }, []);

  const handleCreateOpen = () => {
    setIsCreating(true);
    setSelectedVideo(sourceVideos[0]);
  };

  const handlePostClip = async () => {
    setIsProcessing(true);
    try {
        const clipData = {
            title: `Clip from ${selectedVideo.title}`,
            image: selectedVideo.image,
            videoUrl: selectedVideo.url,
            startTime: trimRange[0],
            endTime: trimRange[1],
            duration: `${Math.floor((trimRange[1] - trimRange[0]) / 60)}:${(trimRange[1] - trimRange[0]) % 60}`
        };
        await saveClip(clipData);
        toast.success("Clip shared with the community!", {
          style: { background: 'rgba(255,255,255,0.05)', color: '#fff', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }
        });
        setIsCreating(false);
        // Refresh clips
        const data = await getClips();
        setClips(data);
    } catch (err) {
        toast.error(err.message || "Failed to save clip.");
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-24 px-8 md:px-16 lg:px-24 bg-transparent text-white selection:bg-accent-gold selection:text-black relative overflow-hidden">
      
      {/* Cinematic Grid Backdrop */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-white/[0.02] blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[length:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Movie Highlights / Community Feed</h3>
            <h1 className="text-8xl font-black tracking-tighter uppercase text-white leading-[0.8]">
              Trending <br/> Clips
            </h1>
          </div>

          <button
            onClick={handleCreateOpen}
            className="glass-pill-active py-6 px-14 flex items-center gap-4 transition-all duration-700 transform hover:scale-105 shadow-3xl text-[11px] font-black uppercase tracking-[0.4em]"
          >
            <Scissors size={20} /> Create Clip
          </button>
        </div>

        {/* Clips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {isLoading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="aspect-[9/16] rounded-[2.5rem] glass-card border-white/5 animate-pulse" />)
          ) : clips.length > 0 ? (
            clips.map((clip, index) => (
              <motion.div
                key={clip.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 1, ease: "circOut" }}
                className="group relative aspect-[9/16] rounded-[2.5rem] overflow-hidden glass-card border-white/5 shadow-3xl transition-all duration-1000 hover:border-white/10"
              >
                <img
                  src={clip.image}
                  alt={clip.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />

                {/* Interaction Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-8 space-y-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-1000">
                  <div className="space-y-2">
                     <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[8px] font-black">
                          {clip.userName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">@{clip.userName}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter line-clamp-2">{clip.title}</h3>
                  </div>

                  <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-100">
                     <div className="flex items-center gap-6">
                      <button className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2">
                          <Heart size={18} /> <span className="text-[10px] font-black">{clip.likes || 0}</span>
                      </button>
                      <button className="text-gray-400 hover:text-accent-gold transition-colors flex items-center gap-2">
                          <Zap size={18} /> <span className="text-[10px] font-black">{clip.views || 0}</span>
                      </button>
                    </div>
                    <button className="w-10 h-10 glass-pill flex items-center justify-center hover:bg-white/10 transition-all">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-6 right-6 glass-pill px-4 py-1.5 text-[9px] font-black text-accent-gold border-accent-gold/20 shadow-2xl">
                  {clip.duration}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass-card border-white/5 border-dashed">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">No community clips yet. Be the first!</p>
            </div>
          )}

          {/* Create Placeholder */}
          <motion.button
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleCreateOpen}
            className="aspect-[9/16] rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-accent-gold/20 bg-white/[0.01] hover:bg-accent-gold/[0.02] flex flex-col items-center justify-center p-12 text-center group transition-all duration-700 shadow-3xl"
          >
            <div className="w-20 h-20 rounded-[1.5rem] glass-card flex items-center justify-center mb-8 border-white/5 group-hover:border-accent-gold/40 transition-all duration-700">
              <Scissors size={28} className="text-gray-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">New Fragment</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] leading-relaxed">Deconstruct cinema into cinematic moments.</p>
          </motion.button>
        </div>
      </div>

      {/* Simplified Modal Theme */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-5xl glass-card relative overflow-hidden border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] grid lg:grid-cols-5 h-[80vh] lg:h-[600px]"
            >
               {/* Preview */}
               <div className="lg:col-span-3 bg-black relative flex items-center justify-center overflow-hidden group">
                <ReactPlayer 
                    url={selectedVideo?.url}
                    playing={isPlaying}
                    width="100%"
                    height="100%"
                    muted
                    style={{ opacity: isPlaying ? 1 : 0.6, transform: 'scale(1.05)' }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 rounded-full glass-card flex items-center justify-center border-white/20 hover:scale-110 transition-transform cursor-pointer shadow-3xl bg-black/20"
                    >
                        {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
                    </button>
                </div>
                
                {/* Trim Info Overlay */}
                <div className="absolute bottom-8 inset-x-8 flex justify-between items-center bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Selected Segment: {trimRange[1] - trimRange[0]}s</span>
                    <span className="text-[10px] font-black text-accent-gold uppercase tracking-widest">Entry: 00:{trimRange[0] < 10 ? '0'+trimRange[0] : trimRange[0]}</span>
                </div>
               </div>

                {/* Tools */}
               <div className="lg:col-span-2 p-10 flex flex-col justify-between h-full bg-[#050505]">
                <div className="space-y-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Capture Scene</h2>
                        <button onClick={() => setIsCreating(false)} className="text-gray-600 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex gap-6 border-b border-white/5 pb-4">
                        {['trim', 'text', 'audio'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-accent-gold' : 'text-gray-500 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-8 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {activeTab === 'trim' && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Trim Range</span>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{trimRange[0]}s - {trimRange[1]}s</span>
                                    </div>
                                    <div className="relative h-12 bg-white/5 rounded-xl border border-white/10 flex items-center px-2">
                                        <div 
                                            className="absolute h-8 bg-accent-gold/20 border-x-2 border-accent-gold rounded-sm transition-all shadow-[0_0_20px_rgba(255,215,0,0.15)]"
                                            style={{ left: `${trimRange[0]}%`, right: `${100 - trimRange[1]}%` }}
                                        />
                                        <input 
                                            type="range" 
                                            min="0" max="60" 
                                            value={trimRange[0]} 
                                            onChange={(e) => setTrimRange([parseInt(e.target.value), Math.max(parseInt(e.target.value) + 5, trimRange[1])])}
                                            className="absolute inset-x-0 opacity-0 cursor-pointer h-full z-10" 
                                        />
                                        <input 
                                            type="range" 
                                            min="0" max="100" 
                                            value={trimRange[1]} 
                                            onChange={(e) => setTrimRange([Math.min(parseInt(e.target.value) - 5, trimRange[0]), parseInt(e.target.value)])}
                                            className="absolute inset-x-0 opacity-0 cursor-pointer h-full z-10" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active Media</span>
                                    <div className="text-[11px] font-bold text-gray-300 uppercase tracking-widest p-5 glass-card border-white/5 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden">
                                            <img src={selectedVideo?.image} className="w-full h-full object-cover" />
                                        </div>
                                        {selectedVideo?.title}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'text' && (
                            <div className="space-y-6">
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Overlay Captions</span>
                                <input 
                                    type="text" 
                                    placeholder="Enter caption text..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white uppercase tracking-widest outline-none focus:border-accent-gold/40 transition-colors"
                                />
                                <div className="grid grid-cols-4 gap-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="aspect-square glass-card border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white cursor-pointer transition-colors">
                                            A{i+1}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button 
                    onClick={handlePostClip}
                    className="w-full glass-pill-active py-5 text-[11px] font-black uppercase tracking-[0.4em] relative overflow-hidden group shadow-3xl"
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center gap-4">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Encoding...</span>
                        </div>
                    ) : (
                        <span className="group-hover:scale-110 transition-transform">Post to Community</span>
                    )}
                </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clips;
