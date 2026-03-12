import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Copy, Search, Share2, Video, Smile, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SocialSidebar from '../components/Party/SocialSidebar';

const mockLiveParties = [
    {
        id: 1,
        host: 'Arjun',
        avatar: 'https://i.pravatar.cc/150?u=1',
        roomName: 'Avengers Endgame Marathon',
        image: 'https://image.tmdb.org/t/p/w500/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
        year: '2019',
        age: 'U/A',
        quality: '4K',
        dominantColor: 'rgba(59, 130, 246, 0.5)' // Blue tint for Avengers
    },
    {
        id: 2,
        host: 'Sarah',
        avatar: 'https://i.pravatar.cc/150?u=2',
        roomName: 'Spider-Man: Spider-Verse',
        image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        year: '2007',
        age: '16+',
        quality: 'HD',
        dominantColor: 'rgba(249, 115, 22, 0.5)' // Orange tint for Naruto
    },
    {
        id: 3,
        host: 'Dev',
        avatar: 'https://i.pravatar.cc/150?u=4',
        roomName: 'Interstellar Watch Party',
        image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        year: '2023',
        age: '18+',
        quality: '4K',
        dominantColor: 'rgba(168, 85, 247, 0.5)' // Purple tint
    },
    {
        id: 4,
        host: 'Priya',
        avatar: 'https://i.pravatar.cc/150?u=5',
        roomName: 'Deadpool 2 Movie Night',
        image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop',
        year: '2025',
        age: 'U',
        quality: 'HD',
        dominantColor: 'rgba(234, 179, 8, 0.5)' // Yellow tint
    },
    {
        id: 5,
        host: 'Rohan',
        avatar: 'https://i.pravatar.cc/150?u=6',
        roomName: 'Joker (2019) Watch Party',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
        year: '2024',
        age: '13+',
        quality: '1080p',
        dominantColor: 'rgba(239, 68, 68, 0.5)' // Red tint
    },
    {
        id: 6,
        host: 'Elena',
        avatar: 'https://i.pravatar.cc/150?u=10',
        roomName: 'Dune: Part Two Experience',
        image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000&auto=format&fit=crop',
        year: '2022',
        age: 'U/A',
        quality: '4K',
        dominantColor: 'rgba(16, 185, 129, 0.5)' // Green tint
    }
];

const PartyHub = () => {
    const [isLive, setIsLive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [emotes, setEmotes] = useState([]);

    // AI Mock Color
    const [roomThemeColor, setRoomThemeColor] = useState('rgba(229, 9, 20, 0.5)'); // Default WatchWave Red
    const navigate = useNavigate();

    const handleGoLive = () => {
        setIsLive(true);
        // "AI" feature: Set room color to match a currently active/selected movie's dominant color.
        setRoomThemeColor(mockLiveParties[0].dominantColor);
    };

    const copyLink = () => {
        navigator.clipboard.writeText("https://watchwave.com/room/your-uid");
        alert("Invite link copied to clipboard!");
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
        <div className="relative h-screen flex flex-col pt-16 font-sans text-white overflow-hidden bg-[#0B0C10]">

            {/* Cinematic High-Blur Global Backdrop */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img
                    src={mockLiveParties[0].image}
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

            <div className="relative z-10 max-w-[1920px] mx-auto w-full flex flex-col lg:flex-row flex-1 h-[calc(100vh-64px)] overflow-hidden">

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
                                        <h3 className="text-3xl font-extrabold tracking-tight mb-4 text-white drop-shadow-md">Himanshu's Theater</h3>

                                        {!isLive ? (
                                            <button
                                                onClick={handleGoLive}
                                                className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 hover:from-red-500 hover:via-red-600 hover:to-red-700 text-white font-black py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(229,9,20,0.6)] text-sm uppercase tracking-widest relative overflow-hidden"
                                            >
                                                {/* Button Sheen Animation inner div */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[sheen_1.5s_ease-in-out_infinite]" />
                                                <Video size={20} className="fill-current" /> ENTER YOUR THEATER
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

                        {/* 2. "Live Now" High-Fidelity Cards Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="space-y-6"
                        >
                            {/* Search & Header Row */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-6 px-2">
                                    <h3 className="text-sm uppercase font-bold text-gray-400 tracking-widest hover:text-white transition-colors cursor-pointer">Suggested</h3>
                                    <div className="h-4 w-px bg-white/20"></div>
                                    <h3 className="text-sm uppercase font-bold text-white tracking-widest flex items-center gap-2 border-b-2 border-[#E50914] pb-1 cursor-pointer">
                                        Live Now
                                    </h3>
                                </div>
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search rooms or friends..."
                                        className="w-full bg-[#000]/40 backdrop-blur-md text-white rounded-xl pl-12 pr-6 py-3 focus:outline-none border border-white/10 focus:border-[#E50914]/50 placeholder:text-gray-500 text-sm transition-all shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Perspective Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: '1200px' }}>
                                {mockLiveParties.map((party, idx) => (
                                    <motion.div
                                        key={party.id}
                                        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                        transition={{ delay: 0.3 + (idx * 0.1), duration: 0.5 }}
                                        className="sheen-card bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 group flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.6)] cursor-pointer"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <div className="relative h-48 w-full overflow-hidden">
                                            {/* CSS Shine Sweep effect via sheen-card class */}
                                            <div className="sheen-layer absolute inset-0 z-20 pointer-events-none" />

                                            <img src={party.image} alt={party.roomName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />

                                            {/* Cinematic Image Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/90 via-transparent to-black/30 z-10" />

                                            {/* LIVE Indicator Pill */}
                                            <div className="absolute top-4 right-4 bg-red-600/20 backdrop-blur-md border border-red-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 z-20 shadow-[0_0_15px_rgba(229,9,20,0.2)]">
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
                                                <span className="text-[10px] font-black tracking-widest text-red-100 uppercase">Live</span>
                                            </div>

                                            {/* Pills Container */}
                                            <div className="absolute top-4 left-4 flex gap-2 z-20">
                                                <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">{party.quality}</span>
                                                <span className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">{party.age}</span>
                                            </div>

                                            <div className="absolute inset-x-0 bottom-0 p-5 flex items-end gap-4 z-20">
                                                {/* Simulated Spatial Audio border on Host Avatar */}
                                                <div className="relative group-hover:-translate-y-1 transition-transform">
                                                    <div className="absolute inset-0 rounded-full bg-white opacity-20 group-hover:animate-ping mix-blend-screen" />
                                                    <img src={party.avatar} alt={party.host} className="w-12 h-12 rounded-full border-2 border-white/20 shadow-[-5px_5px_15px_rgba(0,0,0,0.8)] object-cover relative z-10" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Host: {party.host}</p>
                                                    <h3 className="font-extrabold text-white text-base leading-tight truncate drop-shadow-md">{party.roomName}</h3>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-5 py-4 flex-1 flex flex-col justify-end bg-transparent border-t border-white/5 relative z-20">
                                            <button
                                                onClick={() => navigate('/room')}
                                                className="w-full bg-white/5 hover:bg-[#E50914] text-gray-300 hover:text-white border border-white/10 hover:border-[#E50914] font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                                            >
                                                <Users size={16} /> Join Party
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>

                {/* Right Column (Social Sidebar) */}
                <div className="w-full lg:w-[340px] h-full hidden lg:flex flex-col bg-transparent shrink-0">
                    <SocialSidebar />
                </div>
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
