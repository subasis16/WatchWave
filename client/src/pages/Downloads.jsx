import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2, DownloadCloud } from 'lucide-react';
import { getOfflineVideos, deleteVideo } from '../utils/offlineStorage';
import toast from 'react-hot-toast';

const Downloads = () => {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simulate complex calculation or quota loading
    const [storageUsed, setStorageUsed] = useState(15);
    const maxStorage = 50; // Mock Max 50 GB
    const percentage = (storageUsed / maxStorage) * 100;

    const fetchDownloads = async () => {
        setLoading(true);
        const data = await getOfflineVideos();
        setDownloads(data);

        // Calculate dynamic storage from the blob sizes if desired (mocked here for cinematic UI constraint)
        setLoading(false);
    };

    useEffect(() => {
        fetchDownloads();
    }, []);

    const handleDelete = async (id, title) => {
        const success = await deleteVideo(id);
        if (success) {
            toast.success(`Removed ${title} from Offline Storage`, {
                style: { background: '#1C1D21', color: '#fff', border: '1px solid #141414' }
            });
            fetchDownloads(); // Refresh list
        }
    };

    const handlePlayOffline = (blob, title) => {
        if (!blob) return toast.error("Could not read local file.");

        // Generate Object URL for the HTML5 Video component to parse
        const videoPlayerURL = URL.createObjectURL(blob);

        // In a real app we'd link to the player or overlay a cinematic modal. 
        // For now, we mock success state indicating offline streaming starts
        toast.success(`Playing ${title} (Offline Mode)`, {
            icon: '▶️',
            style: { background: '#1C1D21', color: '#fff' }
        });

        // Note: Make sure to revoke object URLs after playback to free memory!
        // URL.revokeObjectURL(videoPlayerURL);
    };

    return (
        <div className="min-h-screen bg-[#0B0C10] text-white pt-28 pb-20 px-4 md:px-8 lg:px-16 selection:bg-[#E50914] selection:text-white">

            {/* Header section with sleek storage tracking */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-8 gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 shadow-black drop-shadow-lg">MY DOWNLOADS</h1>
                    <p className="text-gray-400 font-medium tracking-wide">Watch anytime, absolutely anywhere.</p>
                </div>

                <div className="w-full md:w-64 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Storage</span>
                        <span className="text-xs text-brand-red font-bold">{storageUsed} GB Used</span>
                    </div>
                    {/* Glowing Progress Bar */}
                    <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-red-800 to-[#E50914] rounded-full shadow-[0_0_10px_#E50914]"
                        />
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 text-right">{maxStorage} GB Total Offline Quota</div>
                </div>
            </div>

            {/* List Engine */}
            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 w-full bg-white/5 rounded-2xl"></div>
                    ))}
                </div>
            ) : downloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border border-white/5">
                    <DownloadCloud size={80} className="text-gray-600 mb-6 opacity-50" strokeWidth={1} />
                    <h2 className="text-2xl font-bold text-gray-300">Your vault is empty</h2>
                    <p className="text-gray-500 mt-2 max-w-sm">When you download movies or series to watch offline, they'll be elegantly organized right here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {downloads.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex items-center justify-between p-4 bg-[#141414]/80 backdrop-blur-lg rounded-2xl border border-white/5 hover:border-white/20 hover:bg-[#1C1D21] transition-all duration-300 shadow-xl"
                        >
                            <div className="flex items-center gap-6 overflow-hidden">
                                <div className="relative w-40 h-24 shrink-0 rounded-xl overflow-hidden shadow-lg border border-black/50">
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col truncate pr-4">
                                    <h3 className="text-2xl font-bold text-gray-100 truncate mb-1">{item.title}</h3>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                        <span className="text-brand-red font-bold">{item.size}</span> &bull; Available Offline &bull; Downloaded {new Date(item.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-white/10">
                                <button
                                    onClick={() => handlePlayOffline(item.blob, item.title)}
                                    className="bg-[#E50914] hover:bg-red-700 text-white p-3 rounded-full flex items-center justify-center transition-all shadow-[0_0_15px_rgba(229,9,20,0.5)] hover:shadow-[0_0_25px_rgba(229,9,20,0.7)] hover:scale-105"
                                    title="Play Offline"
                                >
                                    <Play size={24} fill="currentColor" className="ml-1" />
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id, item.title)}
                                    className="text-gray-500 hover:text-red-500 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
                                    title="Delete from Device"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Downloads;
