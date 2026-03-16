import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, ArrowLeft, Scissors,
  Share2, Heart, MessageCircle, Maximize, Settings as SettingsIcon,
  RotateCcw, SkipForward, Check, Subtitles, X
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { trending, anime, movies, bollywood, series } from '../data/content';
import { useSettings } from '../context/SettingsContext';

const ClipCreator = ({ isOpen, onClose, content }) => {
  const [range, setRange] = useState([20, 50]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [clipSaved, setClipSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
        setIsCapturing(false);
        setClipSaved(true);
        setTimeout(() => {
            setClipSaved(false);
            onClose();
        }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-2xl glass-card p-12 relative border-white/10"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all">
          <X size={24} />
        </button>

        <div className="mb-12 space-y-4">
            <h3 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.6em]">Scene Selector</h3>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Forge Highlight Clip</h2>
            
            {/* Real Video Preview for Clip */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden glass-card border-white/10 mt-6 relative group">
                <ReactPlayer 
                    url={content.trailerUrl}
                    playing={isPlaying}
                    muted
                    width="100%"
                    height="100%"
                    style={{ transform: 'scale(1.15)' }} 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 rounded-full glass-card border-white/20 flex items-center justify-center">
                        {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                    </button>
                </div>
            </div>
        </div>

        <div className="space-y-12">
            {/* Timeline Selection */}
            <div className="relative h-20 bg-white/5 rounded-[1.5rem] border border-white/10 overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-between px-1 opacity-20">
                    {[...Array(40)].map((_, i) => (
                        <div key={i} className="w-[1px] h-8 bg-white" style={{ height: `${Math.random() * 40 + 20}%` }} />
                    ))}
                </div>
                
                {/* Active Selector Range */}
                <div 
                    className="absolute inset-y-0 bg-accent-gold/20 border-x-2 border-accent-gold backdrop-blur-sm transition-all duration-300"
                    style={{ left: `${range[0]}%`, right: `${100 - range[1]}%` }}
                >
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-10 bg-accent-gold rounded-full cursor-ew-resize shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-10 bg-accent-gold rounded-full cursor-ew-resize shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                <div className="space-y-1">
                    <span className="opacity-40">Entry Screen</span>
                    <div className="text-white text-base font-mono">00:43:12</div>
                </div>
                <div className="text-center font-black text-accent-gold">
                    {(range[1] - range[0]) / 2}s Fragment
                </div>
                <div className="space-y-1 text-right">
                    <span className="opacity-40">Exit Screen</span>
                    <div className="text-white text-base font-mono">00:43:24</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={onClose}
                  className="py-5 rounded-2xl glass-card border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                >
                  Discard Fragment
                </button>
                <button 
                  disabled={isCapturing || clipSaved}
                  onClick={handleCapture}
                  className="py-5 rounded-2xl glass-pill-active shadow-2xl transition-all relative overflow-hidden group"
                >
                  {isCapturing ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Processing Screen...</span>
                    </div>
                  ) : clipSaved ? (
                    <div className="flex items-center justify-center gap-3 text-white">
                        <Check size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Connected!</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest">Forge Sequence</span>
                  )}
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { volume, updateSetting, captions, toggleSetting, autoplay } = useSettings();
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showClipCreator, setShowClipCreator] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = React.useRef(null);
  const containerRef = React.useRef(null);

  // Find content in all arrays
  const allContent = [...trending, ...anime, ...movies, ...bollywood, ...series];
  const content = allContent.find(c => c.id === id) || movies[0];
  const trailerUrl = content.trailerUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";

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
      ref={containerRef}
      className="fixed inset-0 bg-transparent z-[100] flex items-center justify-center font-sans overflow-hidden selection:bg-accent-gold selection:text-black"
      onMouseMove={() => setShowControls(true)}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-0 right-0 p-12 z-50 flex items-center justify-between pointer-events-none"
          >
            <button
              onClick={() => navigate(-1)}
              className="pointer-events-auto w-14 h-14 glass-pill flex items-center justify-center hover:bg-white/10 transition-all border-white/5 shadow-2xl group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform text-white" />
            </button>
            <div className="text-right pointer-events-auto glass-card px-8 py-5 border-white/5 space-y-1 shadow-2xl">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase whitespace-nowrap">{content.title}</h2>
              <div className="flex items-center justify-end gap-3 opacity-40">
                <span className="text-[10px] font-black uppercase tracking-widest">S1 : E01</span>
                <div className="w-1 h-1 bg-white rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-accent-gold">Transmission Alpha</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Background Effect */}
      <div
        className="absolute inset-0 z-0 opacity-20 blur-[120px] scale-150 pointer-events-none"
        style={{
          backgroundImage: `url(${content.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Video Player Area */}
      <div className="w-[94%] h-[84%] relative z-10 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.9)] rounded-[3rem] border border-white/5 bg-black ring-1 ring-white/10" onClick={() => setIsPlaying(!isPlaying)}>
        <div className="w-[112%] h-[112%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <ReactPlayer 
            ref={playerRef}
            url={trailerUrl}
            playing={isPlaying}
            volume={volume / 100}
            onProgress={(state) => setProgress(state.played * 100)}
            width="100%"
            height="100%"
            style={{ transform: 'scale(1.03)', transition: 'all 1s', opacity: isPlaying ? 1 : 0.4, filter: isPlaying ? 'none' : 'grayscale(100%) blur(4px)' }}
            config={{
              youtube: {
                playerVars: { 
                  autoplay: 1, 
                  controls: 0, 
                  modestbranding: 1, 
                  rel: 0, 
                  showinfo: 0, 
                  disablekb: 1,
                  cc_load_policy: captions ? 1 : 0 
                }
              }
            }}
          />
        </div>
        
        {/* Cinematic Subtitle Overlay */}
        <AnimatePresence>
            {captions && isPlaying && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-12 inset-x-0 flex justify-center z-20 pointer-events-none"
                >
                    <div className="bg-black/60 backdrop-blur-md px-10 py-5 rounded-2xl border border-white/10 shadow-2xl">
                        <p className="text-xl font-medium text-white tracking-wide text-center drop-shadow-lg">
                            "The world is changed by your example, not by your opinion."
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        
        {!isPlaying && !showClipCreator && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <motion.button 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-full glass-pill-active flex items-center justify-center shadow-3xl transform transition-all"
                >
                    <Play size={40} fill="white" className="ml-2" />
                </motion.button>
            </div>
        )}
      </div>

      {/* Controls Area */}
      <AnimatePresence>
        {showControls && !showClipCreator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 px-12 py-10 glass-card border-white/5 shadow-3xl"
          >
            {/* Progress Bar */}
            <div 
                className="w-full h-1 bg-white/5 rounded-full mb-10 relative group cursor-pointer overflow-hidden"
                onClick={(e) => {
                    if(playerRef.current) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        playerRef.current.seekTo(percent);
                        setProgress(percent * 100);
                    }
                }}
            >
                <div className="h-full bg-white shadow-[0_0_20px_white] transition-all duration-300 pointer-events-none" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-10">
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 glass-pill flex items-center justify-center hover:bg-white/10 transition-all border-white/5 transform active:scale-90 shadow-xl">
                  {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
                </button>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (playerRef.current) {
                        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
                      }
                    }}
                    className="w-12 h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition border-white/5"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      if (playerRef.current) {
                        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
                      }
                    }}
                    className="w-12 h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition border-white/5"
                  >
                    <SkipForward size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-5 group">
                  <Volume2 size={22} className="text-gray-500 group-hover:text-white transition-colors" />
                  <div 
                    className="w-32 h-1 bg-white/5 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const newVol = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                        updateSetting('volume', newVol);
                    }}
                  >
                    <div className="h-full bg-white shadow-[0_0_10px_white] pointer-events-none" style={{ width: `${volume}%` }} />
                  </div>
                </div>

                <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] ml-6 font-mono">12:43 / 45:00</span>
              </div>

              <div className="flex items-center gap-5">
                <button
                  onClick={handleCreateClip}
                  className="glass-pill px-8 py-4 flex items-center gap-3 text-[10px] font-black tracking-widest uppercase hover:bg-accent-gold hover:text-black hover:border-accent-gold transition-all duration-500 text-accent-gold shadow-2xl border-accent-gold/20"
                >
                  <Scissors size={18} />
                  Split Timeline
                </button>
                <div className="w-px h-8 bg-white/5 mx-2" />
                <button 
                  onClick={() => toggleSetting('captions')}
                  className={`w-12 h-12 glass-pill flex items-center justify-center transition border-white/5 ${captions ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                  title="Toggle Captions"
                >
                  <Subtitles size={20} />
                </button>
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-12 h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition border-white/5"
                >
                  <SettingsIcon size={20} />
                </button>
                <button 
                  onClick={() => {
                    if (containerRef.current) {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        containerRef.current.requestFullscreen();
                      }
                    }
                  }}
                  className="w-12 h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition border-white/5"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ClipCreator isOpen={showClipCreator} onClose={closeClipCreator} content={content} />
    </div>
  );
};

export default Player;
