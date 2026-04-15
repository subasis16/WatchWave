import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Share2, Video, Users, User, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SocialSidebar from '../components/Party/SocialSidebar';
import { toast } from 'react-hot-toast';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createPartyRoom } from '../services/firebase-services';

const PartyHub = () => {
    const [isLive, setIsLive] = useState(false);
    const [roomCode, setRoomCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userProfile, setUserProfile] = useState({ name: 'Cinema Fanatic', avatar: null });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserProfile({
                            name: data.name || user.displayName || 'Cinema Fanatic',
                            avatar: data.avatar || user.photoURL || null
                        });
                    } else {
                        setUserProfile({
                            name: user.displayName || 'Cinema Fanatic',
                            avatar: user.photoURL || null
                        });
                    }
                } catch (err) {
                    // Silently ignore to prevent red error overlay
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleGoLive = async () => {
        try {
            if (!auth.currentUser) return toast.error("Must be logged in to host.");
            setIsLoading(true);
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            
            const result = await createPartyRoom(code, '');
            
            setIsLoading(false);
            if (result.success) {
                setRoomCode(code);
                setIsLive(true);
                toast.success(`Party Room Created: ${code}`, {
                    icon: '🎬',
                    style: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
                });
            }
        } catch (err) {
            setIsLoading(false);
            toast.error(err.message || "Failed to create room.");
        }
    };

    const copyLink = () => {
        if (!roomCode) return toast.error("Start Watching first to generate a key.");
        const link = `${window.location.origin}/room/${roomCode}`;
        navigator.clipboard.writeText(link);
        toast.info("Party Link Copied", {
            style: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
        });
    };

    return (
        <div className="relative min-h-screen flex flex-col pt-24 font-sans text-white overflow-hidden bg-black selection:bg-accent-gold selection:text-black">
            {/* Cinematic Theater Backdrop */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a0a]" />
                
                {/* Theatre Spotlights */}
                <div className="absolute top-0 left-1/4 w-[50%] h-[100%] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(255,215,0,0)_0deg,rgba(255,215,0,0.03)_180deg,rgba(255,215,0,0)_360deg)] blur-2xl transform -translate-x-1/2 pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-[50%] h-[100%] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(255,215,0,0)_0deg,rgba(255,215,0,0.03)_180deg,rgba(255,215,0,0)_360deg)] blur-2xl transform translate-x-1/2 pointer-events-none" />

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[length:60px_60px] opacity-30" />
                <div className="absolute top-[-30%] left-[-10%] w-[80%] h-[80%] bg-accent-gold/[0.04] blur-[220px] rounded-full animate-pulse" />
                <div className="absolute top-[-30%] right-[-10%] w-[80%] h-[80%] bg-accent-gold/[0.03] blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                
                {/* Stage Floor Glow */}
                <div className="absolute bottom-[-20%] inset-x-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.05),transparent_70%)] blur-2xl opacity-60" />
            </div>

            <div className="relative z-10 max-w-[1700px] mx-auto w-full flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Main Stage */}
                <div className="flex-1 lg:w-[70%] p-8 lg:p-16 overflow-y-auto hide-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-20">
                        <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="relative">
                            <div className="absolute -inset-10 border-[40px] border-black/50 border-t-white/5 rounded-[5rem] pointer-events-none z-10 hidden md:block opacity-40 shadow-[inset_0_-40px_100px_rgba(0,0,0,1)]" />
                            <div className="glass-card p-10 md:p-24 relative overflow-hidden group border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-3xl rounded-[4rem]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-accent-gold/5" />
                                <div className="absolute top-8 right-8 z-30">
                                    <button onClick={copyLink} className="flex items-center gap-3 glass-pill px-6 py-2.5 text-xs font-semibold text-gray-400 hover:text-white transition-all border-white/5 bg-black/60 hover:bg-white/5 group shadow-xl">
                                        <Share2 size={16} className="text-accent-gold group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">Invite Friends</span>
                                    </button>
                                </div>

                                <div className="relative flex flex-col md:flex-row items-center gap-10">
                                    <div className="relative group/avatar">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl glass-card p-2 shadow-2xl relative overflow-hidden border-white/5 transition-all duration-1000 bg-gradient-to-br from-white/5 to-transparent">
                                            <div className="w-full h-full rounded-2xl overflow-hidden bg-black/60 relative">
                                                {userProfile.avatar ? (
                                                    <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:scale-105 transition-all duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User size={48} className="text-white/10 group-hover/avatar:text-accent-gold/30 transition-all duration-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${isLive ? 'bg-accent-gold' : 'bg-[#1a1a1a] border border-white/10'}`}>
                                            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-black animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'bg-gray-800'}`} />
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex-1 text-center md:text-left">
                                            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-xl">
                                                {userProfile.name.split(' ')[0]} Theater
                                            </h3>

                                        {!isLive ? (
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGoLive} disabled={isLoading} className="glass-pill-active py-3 px-8 flex items-center justify-center gap-3 transition-all duration-300 shadow-lg text-sm font-semibold relative overflow-hidden group/btn disabled:opacity-50 mt-2">
                                                <Video size={18} /> {isLoading ? "Preparing Theater..." : "Start Watching"}
                                            </motion.button>
                                        ) : (
                                            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-2">

                                                <button onClick={() => navigate(`/room/${roomCode}`, { state: { roomCode } })} className="glass-pill-active py-3 px-8 flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm font-semibold">
                                                    <Play size={16} fill="white" /> Join Party
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                    </div>
                </div>

                {/* Right Column (Social Sidebar) - Desktop */}
                <div className="w-full lg:w-[380px] h-full hidden lg:flex flex-col bg-[#050505]/60 backdrop-blur-3xl shrink-0 border-l border-white/5 overflow-hidden">
                    <SocialSidebar />
                </div>
            </div>

            {/* MOBILE SOCIAL DRAWER */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-[400px] z-[110] lg:hidden shadow-[-20px_0_100px_rgba(0,0,0,1)] bg-black">
                            <div className="h-full relative">
                                <SocialSidebar />
                                <button onClick={() => setIsSidebarOpen(false)} className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-20 bg-accent-gold rounded-full flex items-center justify-center text-black shadow-3xl">
                                    <Users size={16} className="rotate-90" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MOBILE TOGGLE BUTTON */}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsSidebarOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-accent-gold rounded-full flex items-center justify-center text-black shadow-[0_15px_30px_rgba(255,215,0,0.3)] z-50 lg:hidden border-none outline-none">
                <Users size={24} />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border-4 border-[#050505] animate-pulse" />
            </motion.button>

            <style dangerouslySetInnerHTML={{
                __html: `
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `
            }} />
        </div>
    );
};

export default PartyHub;
