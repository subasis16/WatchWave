import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Copy, Search, Share2, Video, Smile, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SocialSidebar from '../components/Party/SocialSidebar';
import { toast } from 'react-hot-toast';

const PartyHub = () => {
    const [isLive, setIsLive] = useState(false);
    const navigate = useNavigate();

    const handleGoLive = () => {
        setIsLive(true);
    };

    const copyLink = () => {
        navigator.clipboard.writeText("https://watchwave.com/room/your-uid");
        toast.info("Invite Key Sendted to Clipboard", {
            style: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
        });
    };

    return (
        <div className="relative h-screen flex flex-col pt-24 font-sans text-white overflow-hidden bg-transparent selection:bg-accent-gold selection:text-black">

            {/* Cinematic Grid Backdrop */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] opacity-20" />
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-gold/[0.04] blur-[180px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[150px] rounded-full" />
                
                {/* Floating Connection Lines Mockup */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full">
                        <motion.path 
                            d="M 100 100 Q 300 150 500 100" 
                            stroke="white" 
                            strokeWidth="0.5" 
                            fill="none" 
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                        <motion.path 
                            d="M 800 600 Q 600 400 400 600" 
                            stroke="white" 
                            strokeWidth="0.5" 
                            fill="none" 
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                        />
                    </svg>
                </div>
            </div>

            <div className="relative z-10 max-w-[1700px] mx-auto w-full flex flex-col lg:flex-row flex-1 h-[calc(100vh-96px)] overflow-hidden">

                {/* Main Stage */}
                <div className="flex-1 lg:w-[70%] p-8 lg:p-16 overflow-y-auto hide-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-20">

                        {/* 1. Primary Movie Lounge Card */}
                        <motion.section
                            initial={{ opacity: 0, scale: 0.98, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            className="glass-card p-12 md:p-20 relative overflow-hidden group border-white/5 shadow-3xl"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={copyLink} className="flex items-center gap-3 glass-pill px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all border-white/5 shadow-xl">
                                    <Share2 size={16} /> Transmission Key
                                </button>
                            </div>

                            <div className="relative flex flex-col md:flex-row items-center gap-16">
                                {/* Avatar Screen */}
                                <div className="relative group/avatar">
                                    <div className="w-48 h-48 rounded-[3.5rem] glass-card p-1.5 shadow-3xl relative overflow-hidden border-white/10 transition-all duration-1000 group-hover/avatar:-translate-y-2 group-hover/avatar:border-accent-gold/40">
                                        <div className="w-full h-full rounded-[3rem] overflow-hidden bg-white/5">
                                            <img src="https://i.pravatar.cc/300?u=subasis" alt="Avatar" className="w-full h-full object-cover grayscale group-hover/avatar:grayscale-0 transition-all duration-1000" />
                                        </div>
                                    </div>
                                    <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isLive ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' : 'bg-gray-800'}`}>
                                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                    </div>
                                </div>

                                <div className="space-y-8 flex-1">
                                    <div className="space-y-3">
                                        <h2 className="text-[10px] font-black tracking-[0.6em] uppercase text-gray-600">Cinematic Experience / Alpha</h2>
                                        <h3 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">Personal Theater</h3>
                                    </div>

                                    {!isLive ? (
                                        <button
                                            onClick={handleGoLive}
                                            className="glass-pill-active py-6 px-14 flex items-center justify-center gap-4 transition-all duration-700 transform hover:scale-105 shadow-3xl text-[11px] font-black uppercase tracking-[0.4em] relative overflow-hidden group/btn"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:animate-[sheen_1.5s_infinite]" />
                                            <Video size={20} /> Start Watching
                                        </button>
                                    ) : (
                                        <div className="flex flex-wrap gap-6">
                                            <div className="glass-pill border-green-500/20 text-white font-black py-5 px-10 flex items-center gap-4 shadow-2xl uppercase tracking-widest text-[10px]">
                                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
                                                Live Emission
                                            </div>
                                            <button
                                                onClick={() => navigate('/room')}
                                                className="glass-pill-active py-5 px-12 flex items-center gap-4 transition-all duration-700 transform hover:scale-105 shadow-3xl text-[11px] font-black uppercase tracking-[0.4em]"
                                            >
                                                <Play size={18} fill="white" /> Join Party
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.section>

                        {/* 2. Party Info */}
                        <div className="grid md:grid-cols-2 gap-10">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="glass-card p-12 relative overflow-hidden group border-white/5"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-3xl rounded-full" />
                                <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-8 border-white/10 group-hover:border-accent-gold/40 transition-all">
                                    <Users className="text-white" size={28} />
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Secure Connection</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-[1.8] max-w-sm">
                                    Broadcast your presence to verified screens only. Peer-to-peer encryption is active by default.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="glass-card p-12 relative overflow-hidden group border-white/5"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/[0.02] blur-3xl rounded-full" />
                                <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-8 border-white/10 group-hover:border-accent-gold/40 transition-all">
                                    <Settings className="text-white" size={28} />
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Core Features</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-[1.8] max-w-sm">
                                    Customize your cinematic domain. Manage audience permissions and watch party session.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Social Sidebar) */}
                <div className="w-full lg:w-[420px] h-full hidden lg:flex flex-col bg-transparent shrink-0 border-l border-white/5">
                    <SocialSidebar />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    
                    @keyframes sheen {
                        0% { transform: translateX(-100%) skewX(-15deg); }
                        100% { transform: translateX(200%) skewX(-15deg); }
                    }
                `
            }} />
        </div >
    );
};

export default PartyHub;
