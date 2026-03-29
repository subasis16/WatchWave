import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import localforage from 'localforage';

// Use the exact same store config as offlineStorage.js
const store = localforage.createInstance({
    name: 'WatchWave-Offline',
    storeName: 'videos',
});

const OfflinePlayer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { itemId, title } = location.state || {};

    const [videoSrc, setVideoSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const objectUrlRef = useRef(null);

    useEffect(() => {
        // If no id was passed, go back to downloads
        if (!itemId) {
            navigate('/downloads');
            return;
        }

        let cancelled = false;

        const loadBlob = async () => {
            setLoading(true);
            try {
                const item = await store.getItem(String(itemId));

                if (cancelled) return;

                if (!item || !item.blob) {
                    setError('This video is no longer in offline storage. Please re-download it.');
                    setLoading(false);
                    return;
                }

                // Ensure the blob has the right MIME type
                const mimeType = item.blob.type || 'video/mp4';
                const safeBlob = item.blob.type
                    ? item.blob
                    : new Blob([item.blob], { type: mimeType });

                const url = URL.createObjectURL(safeBlob);
                objectUrlRef.current = url;

                console.log(`▶️ OfflinePlayer: Loaded "${item.title}" | ${mimeType} | ${item.size}`);
                setVideoSrc(url);
                setLoading(false);
            } catch (err) {
                if (!cancelled) {
                    console.error('OfflinePlayer load error:', err);
                    setError(`Failed to load video: ${err.message}`);
                    setLoading(false);
                }
            }
        };

        loadBlob();

        return () => {
            cancelled = true;
            // Revoke the object URL only when leaving the page
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [itemId, navigate]);

    // Autoplay once src is set
    useEffect(() => {
        if (videoRef.current && videoSrc) {
            videoRef.current.play().catch((e) => {
                console.warn('Autoplay blocked:', e.message);
            });
        }
    }, [videoSrc]);

    return (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center overflow-hidden">
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-6 z-50 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/downloads')}
                        className="w-12 h-12 glass-pill flex items-center justify-center text-white hover:bg-white/10 transition-colors rounded-2xl border-white/10 shadow-2xl"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/80 truncate max-w-[60vw]">
                        {title || 'Offline Playback'}
                    </h2>
                </div>
                <div className="glass-pill px-6 py-2 border-accent-gold/20 text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                    Offline Mode
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center gap-6 z-10">
                    <Loader2 size={48} className="text-accent-gold animate-spin" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                        Loading your movie...
                    </p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="flex flex-col items-center gap-6 z-10 p-8 text-center">
                    <p className="text-red-400 font-bold text-sm max-w-md">{error}</p>
                    <button
                        onClick={() => navigate('/downloads')}
                        className="glass-pill px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white border-white/20 hover:bg-white/10 transition-all"
                    >
                        Back to Downloads
                    </button>
                </div>
            )}

            {/* Video Player */}
            {videoSrc && !loading && (
                <video
                    ref={videoRef}
                    src={videoSrc}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                    controlsList="nodownload"
                    onError={(e) => {
                        console.error('Video element error:', e.target.error);
                        setError(`Playback error: ${e.target.error?.message || 'Unknown error'}`);
                    }}
                />
            )}
        </div>
    );
};

export default OfflinePlayer;
