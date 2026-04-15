import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Info, Maximize, Play, Pause, Volume2, Subtitles, Loader2 } from 'lucide-react';
import { trending, anime, movies, bollywood, series } from '../data/content';
import { motion, AnimatePresence } from 'framer-motion';
import ReactPlayer from 'react-player';
import { useSettings } from '../context/SettingsContext';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addToRecentlyWatched } from '../services/firebase-services';
import LoginOverlay from '../components/LoginOverlay';

const VideoPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const { volume, updateSetting, captions, toggleSetting, autoplay, subtitles } = useSettings();
    const [isIdle, setIsIdle] = useState(false);
    const [isPlaying, setIsPlaying] = useState(autoplay !== false);
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
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', resetIdle);
        resetIdle();
        return () => window.removeEventListener('mousemove', resetIdle);
    }, []);

    if (authLoading) return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-sans">
            <Loader2 size={48} className="text-accent-gold animate-spin mb-6" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Authenticating Transmission...</p>
        </div>
    );
    
    if (!user) return <LoginOverlay />;

    // Find the item by ID in all data arrays
    const allContent = [...trending, ...anime, ...movies, ...bollywood, ...series];
    const item = allContent.find(c => c.id === id);

    useEffect(() => {
        if (user && item) {
            addToRecentlyWatched(item);
        }
    }, [user, item]);

    const trailerUrl = item?.trailerUrl || "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";

    return (
        <div 
            ref={containerRef}
            className="w-full h-screen bg-black relative flex items-center justify-center overflow-hidden group select-none"
        >
            
            {/* Header Overlay */}
            <AnimatePresence>
                {(!isIdle || !isPlaying) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-0 inset-x-0 p-6 md:p-10 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pb-32"
                    >
                        <div className="flex items-center gap-4 md:gap-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-12 h-12 md:w-14 md:h-14 glass-card border-white/10 flex items-center justify-center rounded-2xl text-white/50 hover:text-white hover:border-white/20 transition-all active:scale-95"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div className="space-y-1">
                                <h3 className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] md:tracking-[0.6em] mb-1">Cinematic Projection</h3>
                                <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter truncate max-w-[150px] md:max-w-none">{item?.title || "Stream"}</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex glass-pill px-6 py-2.5 text-[9px] font-black uppercase text-accent-gold border-accent-gold/20 items-center gap-3">
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
                        src={trailerUrl}
                        playing={isPlaying}
                        volume={volume / 100}
                        onProgress={(state) => setProgress(state.played * 100)}
                        width="100%"
                        height="100%"
                        style={{ transform: 'scale(1.03)', transition: 'all 1s' }}
                        config={{
                            youtube: {
                                playerVars: { 
                                    autoplay: autoplay !== false ? 1 : 0, 
                                    controls: 0, 
                                    modestbranding: 1, 
                                    rel: 0, 
                                    showinfo: 0, 
                                    disablekb: 1,
                                    cc_load_policy: (captions || subtitles !== 'Off') ? 1 : 0 
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
                {(!isIdle || !isPlaying) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-12 inset-x-6 md:inset-x-12 z-50 flex flex-col gap-6 pointer-events-none"
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
                            <div className="flex items-center gap-4 md:gap-6">
                                <button onClick={() => setIsPlaying(!isPlaying)} className="w-10 h-10 md:w-12 md:h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition-all border-white/5 shadow-xl">
                                    {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
                                </button>
                                
                                <div className="hidden sm:flex items-center gap-4 group">
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
                            
                            <div className="flex items-center gap-3 md:gap-4">
                                <button 
                                    onClick={() => toggleSetting('captions')}
                                    className={`w-10 h-10 md:w-12 md:h-12 glass-pill flex items-center justify-center transition border-white/5 ${captions ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-400'}`}
                                    title="Toggle Captions"
                                >
                                    <Subtitles size={18} />
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
                                    className="w-10 h-10 md:w-12 md:h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition-all border-white/5"
                                >
                                    <Maximize size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-10 mt-2">
                            <div className="glass-card p-3 md:p-4 border-white/5 flex items-center gap-4 md:gap-6 pointer-events-auto shadow-2xl rounded-[1.2rem] md:rounded-2xl">
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-500 rounded-full animate-ping" />
                                <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Live Room</span>
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
