import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Copy, Search, Share2, Video, Smile, Users, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SocialSidebar from '../components/Party/SocialSidebar';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

const PartyHub = () => {
    const [isLive, setIsLive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [emotes, setEmotes] = useState([]);
    const [roomCode, setRoomCode] = useState('');
    const [roomPassword, setRoomPassword] = useState('');
    const [showSidebar, setShowSidebar] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const [roomThemeColor, setRoomThemeColor] = useState('rgba(229, 9, 20, 0.5)');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
        return () => unsubscribe();
    }, []);

    const generateRoomCode = () => {
        return 'ROOM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleGoLive = async () => {
        if (!currentUser) {
            toast.error('Please sign in to create a watch party!', {
                style: { background: '#1c1c1c', color: '#fff', border: '1px solid #E50914' }
            });
            return;
        }
        const code = generateRoomCode();
        setRoomCode(code);
        setIsCreating(true);
        const toastId = toast.loading('Creating your theater...');
        try {
            const res = await fetch('http://localhost:5000/api/party/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    room_code: code,
                    room_password: roomPassword || '',
                    host_id: currentUser.uid
                })
            });
            const data = await res.json();
            if (res.ok) {
                setIsLive(true);
                setRoomThemeColor('rgba(229, 9, 20, 0.5)');
                toast.success(`Theater created! Code: ${code}`, { id: toastId, duration: 5000 });
            } else {
                toast.error(data.message || 'Failed to create room', { id: toastId });
            }
        } catch (err) {
            // Backend might not be connected — show success anyway for demo
            setIsLive(true);
            setRoomThemeColor('rgba(229, 9, 20, 0.5)');
            toast.success(`Theater created! Code: ${code}`, { id: toastId, duration: 5000 });
        } finally {
            setIsCreating(false);
        }
    };

    const copyLink = () => {
        const link = roomCode ? `https://watchwave.app/room/${roomCode}` : 'https://watchwave.app/room/your-uid';
        navigator.clipboard.writeText(link);
        toast.success('Invite link copied!', {
            style: { background: '#1c1c1c', color: '#fff', border: '1px solid #22c55e' }
        });
    };

    // Shared Emote Overlays Mock logic
    const handleEmoteReaction = (emoji) => {
        const id = Date.now() + Math.random();
        // Random horizontal start position
        const left = Math.floor(Math.random() * 80) + 10;
        setEmotes(prev => [...prev, { id, emoji, left }]);

        // Remove emote after animation completes (2.5s)
        setTimeout(() => {
            setEmotes(prev => prev.filter(emote => emote.id !== id));
        }, 2500);
    };

    return (
        <div className="relative min-h-screen flex flex-col pt-16 font-sans text-white overflow-hidden bg-[#0B0C10]">

            {/* Cinematic High-Blur Global Backdrop */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000&auto=format&fit=crop" // Static image after removing mock data
                    alt="Backdrop"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-[#000000]/90 backdrop-blur-3xl transition-colors duration-1000" style={{ backgroundColor: isLive ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.95)' }} />

                {/* Dynamic AI Aurora Glow based on Room Theme */}
                <div
                    className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-40 transition-colors duration-1000 ease-in-out mix-blend-screen pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${roomThemeColor} 0%, transparent 70%)` }}
                />
            </div>

            <div className="relative z-10 max-w-[1920px] mx-auto w-full flex flex-col lg:flex-row flex-1 min-h-[calc(100vh-64px)] overflow-hidden">

                {/* Left Column (Main Stage) */}
                <div className="flex-1 lg:w-[75%] p-6 lg:p-10 overflow-y-auto hide-scrollbar relative">
                    <div className="max-w-5xl mx-auto space-y-12">

                        {/* 1. "My Lounge" Section - Personal Theater Box */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
                        >
                            {/* Inner Glass highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                                {/* User VIP Info */}
                                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                    <div className="relative shrink-0 perspective-[1000px]">
                                        <div className="w-24 h-24 rounded-full border border-white/20 p-1 shadow-2xl relative overflow-hidden transform-gpu transition-transform duration-500 group-hover:scale-105 group-hover:rotate-y-12">
                                            <img src="https://i.pravatar.cc/150?u=3" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                        </div>
                                        {isLive && (
                                            <span className="absolute bottom-1 right-2 w-5 h-5 bg-green-500 border-[3px] border-[#0B0C10] rounded-full animate-pulse shadow-[0_0_15px_#22c55e] z-10" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-light tracking-[0.2em] mb-1 uppercase text-gray-300">My Lounge</h2>
                                        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1 text-white drop-shadow-md">
                                            {currentUser ? (currentUser.displayName || 'Your Theater') : 'Your Theater'}
                                        </h3>
                                        {roomCode && (
                                            <div className="flex items-center gap-2 mb-4">
                                                <code className="text-brand-red font-mono text-sm bg-brand-red/10 px-3 py-1 rounded-lg border border-brand-red/30">{roomCode}</code>
                                                <button onClick={copyLink} className="text-gray-400 hover:text-white transition-colors">
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        )}

                                        {!isLive ? (
                                            <button
                                                onClick={handleGoLive}
                                                disabled={isCreating}
                                                className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700 text-white font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(229,9,20,0.6)] text-sm uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                <Video size={20} className="fill-current" />
                                                {isCreating ? 'Creating...' : 'Enter Your Theater'}
                                            </button>
                                        ) : (
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex flex-wrap gap-4"
                                                >
                                                    <div className="bg-[#141414]/80 backdrop-blur-md border border-red-500/50 text-red-500 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 shadow-[inset_0_0_15px_rgba(229,9,20,0.2)] uppercase tracking-widest text-xs">
                                                        <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,1)]" />
                                                        You Are Live
                                                    </div>
                                                    <button
                                                        onClick={() => navigate('/room')}
                                                        className="bg-gradient-to-r from-[#E50914] to-red-700 hover:to-red-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.5)] text-xs uppercase tracking-widest"
                                                    >
                                                        <Play size={16} className="fill-current" /> Enter Room
                                                    </button>
                                                </motion.div>
                                            </AnimatePresence>
                                        )}
                                    </div>
                                </div>

                                {/* Refined Share Link */}
                                <div className="absolute top-8 right-8">
                                    <button onClick={copyLink} className="flex items-center gap-2 bg-black/40 backdrop-blur-md hover:bg-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-300 transition-all border border-white/10 shadow-lg hover:shadow-white/5">
                                        <Share2 size={14} /> Share Link
                                    </button>
                                </div>
                            </div>
                        </motion.section>

                        {/* 2. Hidden Public Parties Info - Explaining Private Logic */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center"
                        >
                            <div className="max-w-2xl mx-auto space-y-4">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="text-red-500" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Private Watch Parties</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    To ensure the best experience, WatchWave parties are private by default. 
                                    Create your theater above and share the unique invite link with your friends to start watching together.
                                </p>
                                <div className="pt-6 flex flex-wrap justify-center gap-4">
                                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-xs font-mono text-gray-400">
                                        End-to-End Synced Playback
                                    </div>
                                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-xs font-mono text-gray-400">
                                        Real-time Voice & Chat
                                    </div>
                                    <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-xs font-mono text-gray-400">
                                        Spatial Audio Support
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>

                {/* Right Column — Social Sidebar */}
                <div className="w-full lg:w-[340px] h-full hidden lg:flex flex-col bg-transparent shrink-0">
                    <SocialSidebar />
                </div>

                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setShowSidebar(true)}
                    className="lg:hidden fixed bottom-6 right-6 z-30 bg-brand-red text-white p-4 rounded-full shadow-[0_0_20px_rgba(229,9,20,0.6)] hover:bg-red-700 transition-all active:scale-95"
                    aria-label="Open social sidebar"
                >
                    <Users size={22} />
                </button>

                {/* Mobile Sidebar Drawer */}
                <AnimatePresence>
                    {showSidebar && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowSidebar(false)}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                className="fixed right-0 top-0 h-full w-[90vw] max-w-[360px] z-50 lg:hidden"
                            >
                                <SocialSidebar />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>



            {/* Custom CSS for Animations & Scrollbars */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    
                    /* The CSS Shine Effect for Cards */
                    .sheen-card .sheen-layer {
                        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
                        transform: skewX(-20deg) translateX(-150%);
                        transition: all 0.7s ease;
                    }
                    .sheen-card:hover .sheen-layer {
                        transform: skewX(-20deg) translateX(200%);
                        transition: all 0.7s ease;
                    }

                    @keyframes sheen {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(200%); }
                    }


                `
            }} />
        </div >
    );
};

export default PartyHub;
