import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2, DownloadCloud } from 'lucide-react';
import { getOfflineVideos, deleteVideo } from '../utils/offlineStorage';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Downloads = () => {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [storageUsed, setStorageUsed] = useState(15);
    const maxStorage = 50; 
    const percentage = (storageUsed / maxStorage) * 100;

    const fetchDownloads = async () => {
        setLoading(true);
        const data = await getOfflineVideos();
        setDownloads(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchDownloads();
    }, []);

    const handleDelete = async (id, title) => {
        const success = await deleteVideo(id);
        if (success) {
            toast.success(`Movie Deleted: ${title}`, {
                style: { background: 'rgba(255,255,255,0.05)', color: '#fff', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }
            });
            fetchDownloads(); 
        }
    };

    const handlePlayOffline = (item) => {
        if (!item.blob && !item.id) {
            toast.error(`No offline data found for "${item.title}". Please re-download it.`, {
                style: { background: 'rgba(255,255,255,0.05)', color: '#fff', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }
            });
            return;
        }
        toast.success(`Loading: ${item.title}`, {
            icon: '▶️',
            style: { background: 'rgba(255,255,255,0.05)', color: '#fff', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }
        });
        // Pass ONLY the id — OfflinePlayer will fetch the blob fresh from IndexedDB
        // This avoids blob URL invalidation during React Router navigation
        navigate('/offline', { state: { itemId: item.id, title: item.title } });
    };

    return (
        <div className="min-h-screen text-white pt-40 pb-24 px-8 md:px-16 lg:px-24 bg-transparent selection:bg-accent-gold selection:text-black overflow-hidden relative">
            
            {/* Cinematic Background Field */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-white/[0.03] blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header section with sleek storage tracking */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Storage Layer / Local Screen</h3>
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-white leading-none">Cinematic <br/> Vault</h2>
                    </div>

                    <div className="w-full lg:w-[450px] glass-card p-8 md:p-10 border-white/5 shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <DownloadCloud size={40} />
                        </div>
                        <div className="flex justify-between items-end mb-6 relative z-10">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Storage Allocation</span>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{storageUsed} GB <span className="text-gray-600 text-lg">/ {maxStorage} GB</span></h4>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative z-10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.5, ease: 'circOut' }}
                                className="h-full bg-white rounded-full shadow-[0_0_25px_white]"
                            />
                        </div>
                    </div>
                </div>

                {/* List Engine */}
                {loading ? (
                    <div className="space-y-10">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 w-full glass-card border-white/5 animate-pulse"></div>
                        ))}
                    </div>
                ) : downloads.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-40 text-center glass-card border-white/5 border-dashed shadow-3xl"
                    >
                        <div className="w-24 h-24 rounded-[2rem] glass-card flex items-center justify-center mb-10 border-white/10 opacity-20">
                            <DownloadCloud size={40} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Vault Empty</h2>
                        <p className="text-[10px] text-gray-600 mt-6 uppercase tracking-[0.4em] font-bold max-w-xs leading-relaxed">Encrypted offline objects will be indexed here for cinematic playback.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-10">
                        {downloads.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 1, ease: "circOut" }}
                                className="group flex flex-col lg:flex-row items-center justify-between p-6 md:p-10 glass-card border-white/5 hover:border-white/10 transition-all duration-1000 shadow-3xl gap-8 md:gap-12 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-accent-gold/40 opacity-0 group-hover:opacity-100 transition-all" />
                                
                                <div className="flex flex-col lg:flex-row items-center gap-12 overflow-hidden w-full">
                                    <div className="relative w-full lg:w-72 aspect-video shrink-0 rounded-[2rem] overflow-hidden shadow-3xl group/img">
                                        <div className="absolute inset-0 bg-accent-gold/10 opacity-0 group-hover/img:opacity-100 transition-opacity z-10" />
                                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 border border-white/5" />
                                    </div>
                                    <div className="flex flex-col truncate w-full text-center lg:text-left space-y-2 md:space-y-4">
                                        <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter truncate">{item.title}</h3>
                                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 items-center">
                                            <div className="glass-pill px-5 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-accent-gold border-accent-gold/20 shadow-xl">
                                                {item.size}
                                            </div>
                                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                                                Offline Screen &bull; {new Date(item.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 md:gap-8 shrink-0 lg:pl-12 lg:border-l border-white/5 w-full lg:w-auto justify-center">
                                    <button
                                        onClick={() => handlePlayOffline(item)}
                                        className="glass-pill-active p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center transition-all shadow-3xl hover:scale-105 active:scale-95 group/play"
                                        title="Watch Offline"
                                    >
                                        <Play className="w-5 h-5 md:w-6 md:h-6 ml-1" fill="white" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item.id, item.title)}
                                        className="text-gray-600 hover:text-red-400 p-4 md:p-6 glass-card border-white/5 hover:border-red-500/10 rounded-2xl md:rounded-[1.5rem] transition-all group/trash shadow-xl"
                                        title="Delete Movie"
                                    >
                                        <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Downloads;
