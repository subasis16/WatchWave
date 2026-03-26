import React, { useEffect, useState, useRef } from 'react';
import { X, Play, Download, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveVideo, isVideoDownloaded } from '../utils/offlineStorage';
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const MovieModal = ({ movie, isOpen, onClose }) => {
    const navigate = useNavigate();
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setDownloadProgress(0);
            setIsDownloading(false);
            // Check if already downloaded
            if (movie) {
                isVideoDownloaded(movie.id).then(setDownloadComplete);
            }
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, movie]);

    if (!movie) return null;

    const handlePlayVideo = () => {
        onClose();
        navigate(`/watch/${movie.id}`);
    };

    /**
     * Resolves the best downloadable video URL for this movie.
     * Priority: local videoUrl → Firestore videoUrl → null (no YouTube, not downloadable)
     */
    const resolveVideoUrl = async () => {
        // 1. Local content has videoUrl
        if (movie.videoUrl) return movie.videoUrl;

        // 2. Try Firestore
        try {
            const movieSnap = await getDoc(doc(db, 'movies', movie.id));
            if (movieSnap.exists() && movieSnap.data().videoUrl) {
                return movieSnap.data().videoUrl;
            }
        } catch (e) {
            console.warn('Firestore fetch for download failed:', e.message);
        }

        return null;
    };

    const handleDownload = async () => {
        if (isDownloading || downloadComplete) return;

        const toastId = toast.loading(`Preparing download: ${movie.title}...`, {
            style: { background: 'rgba(255,255,255,0.05)', color: '#fff', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }
        });

        const videoUrl = await resolveVideoUrl();

        if (!videoUrl) {
            toast.error(`No downloadable video source for "${movie.title}". Only Cloudinary-hosted content can be downloaded.`, { id: toastId });
            return;
        }

        setIsDownloading(true);
        setDownloadProgress(1);

        // Use the single shared saveVideo from offlineStorage (ensures Downloads page can read it)
        const success = await saveVideo(movie, videoUrl, (percent) => {
            setDownloadProgress(percent);
            toast.loading(`Downloading ${movie.title}... ${percent}%`, { id: toastId });
        });

        if (success) {
            setDownloadComplete(true);
            setIsDownloading(false);
            setDownloadProgress(100);
            toast.success(`✅ ${movie.title} ready for offline playback!`, {
                id: toastId,
                duration: 4000,
                style: { background: 'rgba(255,255,255,0.05)', color: '#fff', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,215,0,0.3)' }
            });
        } else {
            setIsDownloading(false);
            setDownloadProgress(0);
            toast.error(`Download failed for ${movie.title}`, { id: toastId });
        }
    };

    const description = movie.description || "In the early 2000s, an undercover operative infiltrates Karachi's underworld, breaking into its inner circle to dismantle a violent network from within. A gripping tale of espionage and betrayal.";
    const genres = Array.isArray(movie.genre) ? movie.genre : (movie.genres || ['Action', 'Thrillers', 'Drama']);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                    {/* Blur Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                        className="relative w-full max-w-4xl bg-transparent rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)] z-10 border border-white/5"
                    >
                        {/* Cinematic Background Field Inside Modal */}
                        <div className="absolute inset-0 z-0 opacity-50">
                            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent-gold/[0.04] blur-[120px] rounded-full" />
                            <div className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-white/[0.02] blur-[100px] rounded-full" />
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 w-12 h-12 glass-pill flex items-center justify-center text-gray-400 hover:text-white transition-all shadow-2xl"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 flex flex-col lg:flex-row h-full max-h-[85vh] overflow-y-auto no-scrollbar">
                            {/* Visual Asset */}
                            <div className="w-full lg:w-[45%] h-[300px] lg:h-auto relative shrink-0">
                                <img
                                    src={movie.image.replace('w500', 'original')}
                                    alt={movie.title}
                                    className="w-full h-full object-cover lg:rounded-r-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-transparent to-transparent" />
                                <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 p-8 md:p-12 space-y-10">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Movie Details</h3>
                                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                        {movie.title}
                                    </h2>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="glass-pill px-4 py-1.5 text-[10px] font-black text-accent-gold border-accent-gold/20 uppercase tracking-widest">
                                        {movie.match || 98}% Match
                                    </span>
                                    <span className="glass-pill px-4 py-1.5 text-[10px] font-black text-gray-500 border-white/5 uppercase tracking-widest">
                                        {movie.year || '2025'}
                                    </span>
                                    <div className="flex gap-2">
                                        {genres.map((genre, idx) => (
                                            <span key={idx} className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                                                {genre}{idx < genres.length - 1 ? <span className="ml-2 opacity-30">/</span> : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed max-w-lg">
                                        {description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        {/* Watch Now */}
                                        <button
                                            id={`watch-btn-${movie.id}`}
                                            onClick={handlePlayVideo}
                                            className="glass-pill-active px-10 py-4 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3 shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                                        >
                                            <Play size={16} className="fill-current" />
                                            Watch Now
                                        </button>

                                        {/* Download Button */}
                                        <button
                                            id={`download-btn-${movie.id}`}
                                            onClick={handleDownload}
                                            disabled={isDownloading}
                                            className={`relative overflow-hidden glass-pill px-10 py-4 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3 transition-all shadow-xl ${
                                                downloadComplete
                                                    ? 'text-emerald-400 border-emerald-400/30'
                                                    : isDownloading
                                                        ? 'text-accent-gold border-accent-gold/30 cursor-wait'
                                                        : 'text-gray-400 hover:text-white hover:border-white/20'
                                            }`}
                                        >
                                            {/* Animated fill bar */}
                                            {isDownloading && (
                                                <motion.div
                                                    className="absolute inset-y-0 left-0 bg-accent-gold/15 rounded-[inherit]"
                                                    initial={{ width: '0%' }}
                                                    animate={{ width: `${downloadProgress}%` }}
                                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                                />
                                            )}
                                            <span className="relative z-10 flex items-center gap-3">
                                                {downloadComplete ? (
                                                    <><Check size={16} /> Downloaded</>
                                                ) : isDownloading ? (
                                                    <><Loader2 size={16} className="animate-spin" /> {downloadProgress}%</>
                                                ) : (
                                                    <><Download size={16} /> Download</>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MovieModal;
