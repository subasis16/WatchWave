import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, ArrowLeft, Scissors,
  Share2, Heart, MessageCircle, Maximize, Settings as SettingsIcon,
  RotateCcw, SkipForward, Check, Subtitles, X, Loader2
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { trending, anime, movies, bollywood, series, allSiteContent } from '../data/content';
import { useSettings } from '../context/SettingsContext';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import LoginOverlay from '../components/LoginOverlay';

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
            <h3 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.6em]">Pick a Scene</h3>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Create a Fan Clip</h2>
            
            {/* Real Video Preview for Clip */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden glass-card border-white/10 mt-6 relative group">
                <ReactPlayer 
                    url={content.videoUrl || content.trailerUrl}
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
                    {(range[1] - range[0]) / 2}s Clip
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
                  Discard Clip
                </button>
                <button 
                  disabled={isCapturing || clipSaved}
                  onClick={handleCapture}
                  className="py-5 rounded-2xl glass-pill-active shadow-2xl transition-all relative overflow-hidden group"
                >
                  {isCapturing ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Saving Clip...</span>
                    </div>
                  ) : clipSaved ? (
                    <div className="flex items-center justify-center gap-3 text-white">
                        <Check size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Saved!</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest">Save Clip</span>
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showClipCreator, setShowClipCreator] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  const [durationStr, setDurationStr] = useState("00:00");
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState(null);
  const [resolution, setResolution] = useState('Auto');
  const [showResolutions, setShowResolutions] = useState(false);
  const seekTimeRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const activeUrl = React.useMemo(() => {
    if (!videoUrl) return null;
    // Only apply resolution transformations to Cloudinary URLs
    if (resolution === 'Auto' || !videoUrl.includes('res.cloudinary.com')) return videoUrl;
    
    // Convert https://res.cloudinary.com/.../video/upload/v123... 
    // to -> https://res.cloudinary.com/.../video/upload/q_auto,h_720/v123...
    const parts = videoUrl.split('/upload/');
    if (parts.length === 2 && parts[1].startsWith('v')) {
        return `${parts[0]}/upload/q_auto,h_${resolution}/${parts[1]}`;
    }
    return videoUrl;
  }, [videoUrl, resolution]);

  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = React.useRef(null);

  const resetIdle = React.useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isPlaying) {
      idleTimerRef.current = setTimeout(() => setIsIdle(true), 2000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleMouseMove = () => resetIdle();
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdle]);

  useEffect(() => {
    if (!isPlaying) {
      setIsIdle(false);
    } else {
        resetIdle();
    }
  }, [isPlaying, resetIdle]);

  useEffect(() => {
    const video = playerRef.current;
    if (!video) return;

    if (isPlaying) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("⚠️ playback pre-empted check:", error);
            });
        }
    } else {
        video.pause();
    }
  }, [isPlaying]);

  const shouldShowUI = !isIdle || !isPlaying;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firebase Firestore: fetch videoUrl, then fallback to local content data
  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      let resolvedUrl = null;

      try {
        const movieDocRef = doc(db, 'movies', id);
        const movieSnap = await getDoc(movieDocRef);

        if (movieSnap.exists() && movieSnap.data().videoUrl) {
          resolvedUrl = movieSnap.data().videoUrl;
        }
      } catch (error) {
        console.warn('⚠️ Firebase fetch failed, using fallback:', error.message);
      }

      if (!resolvedUrl) {
        const localContent = allSiteContent.find(c => c.id === id) || movies[0];
        if (localContent?.videoUrl) {
          resolvedUrl = localContent.videoUrl;
        }
      }

      console.log(`🎬 Player resolved URL for [${id}]:`, resolvedUrl);
      setVideoUrl(resolvedUrl);
      setIsLoading(false);
    };

    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (activeUrl) {
        console.log('🎥 Active Playback URL:', activeUrl);
    }
  }, [activeUrl]);

  if (authLoading) return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-sans">
      <Loader2 size={48} className="text-accent-gold animate-spin mb-6" />
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Authenticating User...</p>
    </div>
  );

  if (!user) return <LoginOverlay />;

  // Find content accurately using allSiteContent (fallback to movies[0] if completely unfound)
  const content = allSiteContent.find(c => c.id === id) || movies[0];

  const handleResolutionChange = (newRes) => {
    if (newRes === resolution) {
        setShowResolutions(false);
        return;
    }
    
    // Save current time to seek back after resolution swap
    if (playerRef.current) {
        seekTimeRef.current = playerRef.current.currentTime;
    }
    
    setResolution(newRes);
    setShowResolutions(false);
  };

  const resolutionsList = [
    { label: 'Auto', value: 'Auto' },
    { label: '1080p', value: '1080' },
    { label: '720p', value: '720' },
    { label: '480p', value: '480' }
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-sans">
        <Loader2 size={48} className="text-accent-gold animate-spin mb-6" />
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Loading Movie...</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-sans">
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-6">Video source not found.</h2>
        <button onClick={() => navigate(-1)} className="glass-pill px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white border-white/20 hover:bg-white/10 transition-all">Go Back</button>
      </div>
    );
  }

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
    >
      <AnimatePresence>
        {shouldShowUI && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-8 z-50 flex items-center justify-between pointer-events-none bg-gradient-to-b from-black/80 to-transparent pb-20"
          >
            <button
              onClick={() => navigate(-1)}
              className="pointer-events-auto w-14 h-14 glass-pill flex items-center justify-center hover:bg-white/10 transition-all border-white/5 shadow-2xl group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform text-white" />
            </button>
            <div className="text-right pointer-events-auto flex flex-col items-end gap-1">
              <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase mb-1 drop-shadow-2xl">{content.title}</h2>
              <div className="flex items-center gap-4 opacity-60">
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Season 1 : Episode 01</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent-gold">4K ULTRA HD</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Background Effect */}
      <div
        className="absolute inset-0 z-0 opacity-20 blur-[120px] scale-150 pointer-events-none"
        style={{
          backgroundImage: `url(${content?.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="w-full h-full relative z-10 overflow-hidden bg-black">
        {/* Click to Pause/Play Overlay (behind controls) */}
        <div 
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => {
                const nextPlaying = !isPlaying;
                setIsPlaying(nextPlaying);
                if (nextPlaying) setIsIdle(true);
            }}
        />

        <div className={`w-full h-full absolute inset-0 flex items-center justify-center`}>
            <video 
              ref={playerRef}
              src={activeUrl}
              autoPlay={false}
              playsInline
              muted={volume === 0}
              className="w-full h-full object-cover"
              style={{ transform: 'scale(1.03)', transition: 'all 1s' }}
              onPlay={() => console.log('▶️ Native Video: started playing')}
              onPause={() => console.log('⏸️ Native Video: paused')}
              onTimeUpdate={(e) => {
                const video = e.currentTarget;
                const p = (video.currentTime / video.duration) * 100;
                if (!isNaN(p)) setProgress(p);
                setCurrentSeconds(video.currentTime);
                setCurrentTimeStr(new Date(video.currentTime * 1000).toISOString().substr(14, 5));
              }}
              onLoadedMetadata={(e) => {
                const dur = e.currentTarget.duration;
                if (dur && !isNaN(dur)) {
                  setTotalDuration(dur);
                  setDurationStr(new Date(dur * 1000).toISOString().substr(14, 5));
                }
                
                // Seek back to the saved time after resolution changes
                if (seekTimeRef.current !== null && playerRef.current) {
                    playerRef.current.currentTime = seekTimeRef.current;
                    seekTimeRef.current = null;
                }
              }}
              onWaiting={() => console.log('⏳ Native Video: buffering')}
              onCanPlay={() => console.log('✅ Native Video: ready to play')}
              onError={(e) => console.log('🆘 Native Video Error:', e)}
            />
        </div>
        
        {/* Cinematic Subtitle Overlay */}
        <AnimatePresence>
            {captions && isPlaying && false && (
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
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <motion.button 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(true);
                    }}
                    className="w-24 h-24 rounded-full glass-pill flex items-center justify-center shadow-3xl transform transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
                >
                    <Play size={40} fill="white" className="ml-2 text-white" />
                </motion.button>
            </div>
        )}
      </div>

      {/* Controls Area (Hidden for YouTube embeds since they have native controls) */}
      <AnimatePresence>
        {shouldShowUI && !showClipCreator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.98, y: 20, x: "-50%" }}
            className="absolute bottom-6 md:bottom-10 left-1/2 w-[95%] md:w-[98%] max-w-6xl z-50 px-4 md:px-8 py-4 md:py-6 glass-card border-white/5 shadow-3xl bg-black/60 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem]"
          >
            <div 
                className="w-full h-1 bg-white/5 rounded-full mb-6 md:mb-10 relative group cursor-pointer overflow-hidden"
                onClick={(e) => {
                    e.stopPropagation();
                    if(playerRef.current) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        if (playerRef.current) {
                            playerRef.current.currentTime = percent * playerRef.current.duration;
                        }
                        setProgress(percent * 100);
                    }
                }}
            >
                <div className="h-full bg-white shadow-[0_0_20px_white] transition-all duration-300 pointer-events-none" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
              <div className="flex items-center gap-4 md:gap-10">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const nextPlaying = !isPlaying;
                    setIsPlaying(nextPlaying);
                    if (nextPlaying) setIsIdle(true);
                  }} 
                  className="w-10 h-10 md:w-14 md:h-14 glass-pill flex items-center justify-center hover:bg-white/10 transition-all border-white/5 transform active:scale-90 shadow-xl"
                >
                  {isPlaying ? <Pause size={20} className="fill-current md:w-7 md:h-7" /> : <Play size={20} className="fill-current ml-1 md:w-7 md:h-7" />}
                </button>

                <div className="flex items-center gap-2 md:gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playerRef.current) {
                        playerRef.current.currentTime = Math.max(0, playerRef.current.currentTime - 10);
                      }
                    }}
                    className="w-10 h-10 glass-pill flex items-center justify-center hover:bg-white/10 transition border-white/5"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (playerRef.current) {
                        playerRef.current.currentTime = Math.min(playerRef.current.duration, playerRef.current.currentTime + 10);
                      }
                    }}
                    className="w-10 h-10 glass-pill flex items-center justify-center hover:bg-white/10 transition border-white/5"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-5 group">
                  <Volume2 size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                  <div 
                    className="w-24 md:w-32 h-1 bg-white/5 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const newVol = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                        updateSetting('volume', newVol);
                    }}
                  >
                    <div className="h-full bg-white shadow-[0_0_10px_white] pointer-events-none" style={{ width: `${volume}%` }} />
                  </div>
                </div>

                <span className="text-[9px] md:text-[10px] font-black text-gray-400 tracking-[0.2em] font-mono whitespace-nowrap">{currentTimeStr} / {durationStr}</span>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={handleCreateClip}
                  className="hidden md:flex glass-pill px-6 py-3.5 items-center gap-2.5 text-[9px] font-black tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all duration-500 text-gray-400 shadow-2xl border-white/5"
                >
                  <Scissors size={16} />
                  Clip Fragment
                </button>
                
                {/* Resolution Picker */}
                <div className="relative">
                    <button 
                      onClick={() => setShowResolutions(!showResolutions)}
                      className={`glass-pill px-4 md:px-6 py-3 md:py-4 flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
                          resolution !== 'Auto' ? 'text-accent-gold border-accent-gold/20' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {resolution === 'Auto' ? 'Auto' : `${resolution}p`}
                    </button>
                    
                    <AnimatePresence>
                        {showResolutions && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full right-0 mb-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 min-w-[120px] shadow-2xl"
                            >
                                {resolutionsList.map(r => (
                                    <button
                                        key={r.value}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleResolutionChange(r.value);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                            resolution === r.value 
                                            ? 'bg-accent-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]' 
                                            : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <button 
                  onClick={() => toggleSetting('captions')}
                  className={`w-10 h-10 md:w-12 md:h-12 glass-pill flex items-center justify-center transition border-white/5 ${captions ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-gray-400'}`}
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
                  className="w-10 h-10 md:w-12 md:h-12 glass-pill flex items-center justify-center hover:bg-white/10 transition border-white/5"
                >
                  <Maximize size={18} />
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
