import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Info, Maximize, Play, Pause, Volume2, Subtitles } from 'lucide-react';
import { trending, anime, movies, bollywood, series } from '../data/content';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { useSettings } from '../context/SettingsContext';

const VideoPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { volume, updateSetting, captions, toggleSetting } = useSettings();
    const [isIdle, setIsIdle] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const playerRef = React.useRef(null);
    const containerRef = React.useRef(null);
    let idleTimer;

    const resetIdle = () => {
        setIsIdle(false);
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => setIsIdle(true), 3000);
    };

    useEffect(() => {
        window.addEventListener('mousemove', resetIdle);
        resetIdle();
        return () => window.removeEventListener('mousemove', resetIdle);
    }, []);

    // Find the item by ID in all data arrays
    const allContent = [...trending, ...anime, ...movies, ...bollywood, ...series];
    const item = allContent.find(c => c.id === id);

    const trailerUrl = item?.trailerUrl || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";

    return (
        <div 
            ref={containerRef}
            className="w-full h-screen bg-black relative flex items-center justify-center overflow-hidden group select-none"
        >
            
            {/* Header Overlay */}
            <AnimatePresence>
                {!isIdle && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-0 inset-x-0 p-10 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pb-32"
                    >
                        <div className="flex items-center gap-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-14 h-14 glass-card border-white/10 flex items-center justify-center rounded-2xl text-white/50 hover:text-white hover:border-white/20 transition-all active:scale-95"
                            >
                                <ArrowLeft size={28} />
                            </button>
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em] mb-1">Cinematic Projection</h3>
                                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">{item?.title || "Stream"}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="glass-pill px-6 py-2.5 text-[9px] font-black uppercase text-accent-gold border-accent-gold/20 flex items-center gap-3">
                                <Shield size={14} /> 4K Ultra Precision
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Player */}
            <div className="w-full h-full relative z-0 overflow-hidden" onClick={() => setIsPlaying(!isPlaying)}>
                <div className="w-[110%] h-[110%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <ReactPlayer 
                        ref={playerRef}
                        url={trailerUrl}
                        playing={isPlaying}
                        volume={volume / 100}
                        onProgress={(state) => setProgress(state.played * 100)}
                        width="100%"
                        height="100%"
                        style={{ transform: 'scale(1.03)', transition: 'all 1s' }}
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
                
                {!isPlaying && (
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

            {/* Bottom Info Overlay */}
            <AnimatePresence>
                {!isIdle && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-12 inset-x-12 z-50 flex flex-col gap-6 pointer-events-none"
                    >
                        {/* Custom Progress Bar */}
                        <div 
                            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden pointer-events-auto shadow-xl"
                            onClick={(e) => {
                                if(playerRef.current) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const percent = (e.clientX - rect.left) / rect.width;
                                    playerRef.current.seekTo(percent);
                                    setProgress(percent * 100);
                                }
                            }}
                        >
                            <div className="h-full bg-accent-gold shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all duration-300 pointer-events-none" style={{ width: `${progress}%` }} />
                        </div>

                        <div className="flex items-center justify-between pointer-events-auto">
                            <div className="flex items-center gap-6">
                                <button onClick={() => setIsPlaying(!isPlaying)} className="w-12 h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition-all border-white/5 shadow-xl">
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                
                                <div className="flex items-center gap-4 group">
                                    <Volume2 size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                                    <div 
                                        className="w-24 h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const newVol = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                                            updateSetting('volume', newVol);
                                        }}
                                    >
                                        <div className="h-full bg-white shadow-[0_0_10px_white] pointer-events-none" style={{ width: `${volume}%` }} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => toggleSetting('captions')}
                                    className={`w-12 h-12 glass-pill flex items-center justify-center transition border-white/5 ${captions ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                                    title="Toggle Captions"
                                >
                                    <Subtitles size={20} />
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
                                    className="w-12 h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition-all border-white/5"
                                >
                                    <Maximize size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-10 mt-2">
                            <div className="glass-card p-4 border-white/5 flex items-center gap-6 pointer-events-auto shadow-2xl rounded-2xl">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Room Active</span>
                            </div>
                            <div className="glass-card p-4 border-white/5 hidden md:flex items-center gap-4 cursor-help group/info pointer-events-auto shadow-2xl rounded-2xl">
                                <Info size={16} className="text-gray-500 group-hover/info:text-white transition-colors" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/info:text-white transition-colors">Stream Metadata</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Screen Fade */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-black opacity-20" />
        </div>
    );
};

export default VideoPlayer;
