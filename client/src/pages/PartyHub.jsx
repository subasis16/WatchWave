import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Share2, Video, Users, User, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SocialSidebar from '../components/Party/SocialSidebar';
import { toast } from 'react-hot-toast';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
                    console.error("Error fetching user data for PartyHub:", err);
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
            const token = await auth.currentUser.getIdToken();
            const res = await fetch('http://localhost:5000/api/party/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ room_code: code, room_password: '' })
            });
            const data = await res.json();
            setIsLoading(false);
            if (data.success) {
                setRoomCode(code);
                setIsLive(true);
                toast.success(`Party Room Created: ${code}`, {
                    icon: '🎬',
                    style: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }
                });
            } else {
                toast.error(data.error || "Failed to create room.");
            }
        } catch (err) {
            setIsLoading(false);
            toast.error("Connection failed. WatchWave server is busy.");
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
        <div className="relative min-h-screen flex flex-col pt-24 font-sans text-white overflow-hidden bg-black selection:bg-[#E50914] selection:text-white">
            {/* Cinematic Theater Backdrop */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] via-black to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.05)_1px,transparent_1px)] bg-[length:60px_60px] opacity-20" />
                <div className="absolute top-[-30%] left-[-10%] w-[80%] h-[80%] bg-[#E50914]/[0.08] blur-[220px] rounded-full animate-pulse" />
                <div className="absolute top-[-30%] right-[-10%] w-[80%] h-[80%] bg-accent-gold/[0.05] blur-[200px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
                <div className="absolute bottom-[-15%] inset-x-0 h-40 bg-gradient-to-t from-[#E50914]/10 to-transparent blur-3xl opacity-40" />
                <div className="absolute inset-0 opacity-20">
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0 }}
                            animate={{ y: "-10vh", opacity: [0, 1, 0] }}
                            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 15 }}
                            className="absolute w-[2px] h-20 bg-gradient-to-b from-transparent via-white/40 to-transparent blur-[2px]"
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10 max-w-[1700px] mx-auto w-full flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Main Stage */}
                <div className="flex-1 lg:w-[70%] p-8 lg:p-16 overflow-y-auto hide-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-20">
                        <motion.section initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="relative">
                            <div className="absolute -inset-10 border-[40px] border-black/80 rounded-[5rem] pointer-events-none z-10 hidden md:block opacity-20" />
                            <div className="glass-card p-10 md:p-24 relative overflow-hidden group border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-3xl rounded-[4rem]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#E50914]/5 via-transparent to-accent-gold/5" />
                                <div className="absolute top-8 right-8 z-30">
                                    <button onClick={copyLink} className="flex items-center gap-4 glass-pill px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all border-white/5 bg-black/60 hover:bg-black/90 group shadow-2xl">
                                        <Share2 size={18} className="text-[#E50914] group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">Invite Friends</span>
                                    </button>
                                </div>

                                <div className="relative flex flex-col md:flex-row items-center gap-16">
                                    <div className="relative group/avatar">
                                        <div className="w-56 h-56 rounded-[4rem] glass-card p-2 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden border-white/10 transition-all duration-1000 group-hover/avatar:-translate-y-4 group-hover/avatar:border-[#E50914]/40 bg-gradient-to-br from-white/10 to-transparent">
                                            <div className="w-full h-full rounded-[3.5rem] overflow-hidden bg-black/40 relative">
                                                {userProfile.avatar ? (
                                                    <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-all duration-1000" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User size={80} className="text-white/10 group-hover/avatar:text-[#E50914]/20 transition-all duration-1000" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`absolute -bottom-4 -right-4 w-14 h-14 rounded-3xl flex items-center justify-center shadow-[0_15px_30px_rgba(34,197,94,0.3)] transition-all duration-500 ${isLive ? 'bg-green-500' : 'bg-[#1a1a1a] border border-white/10'}`}>
                                            <div className={`w-4 h-4 rounded-full ${isLive ? 'bg-white animate-pulse shadow-[0_0_20px_#fff]' : 'bg-gray-800'}`} />
                                        </div>
                                    </div>

                                    <div className="space-y-6 md:space-y-10 flex-1 text-center md:text-left">
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="flex items-center justify-center md:justify-start gap-4">
                                                <div className="h-[2px] w-12 bg-[#E50914] shadow-[0_0_15px_#E50914]" />
                                                <h2 className="text-[12px] font-black tracking-[0.6em] uppercase text-[#E50914] drop-shadow-lg">WatchWave Studios Presents</h2>
                                            </div>
                                            <h3 className="text-4xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.85] italic drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                                                {userProfile.name.split(' ')[0]}<br /> Theater
                                            </h3>
                                            <div className="flex items-center justify-center md:justify-start gap-10 pt-4">
                                                <div className="flex items-center gap-3">
                                                    <Users className="w-4 h-4 text-[#E50914]" />
                                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">12 Spectators</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-accent-gold shadow-[0_0_10px_#FFD700] animate-pulse" />
                                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">Premium Lounge</span>
                                                </div>
                                            </div>
                                        </div>

                                        {!isLive ? (
                                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGoLive} disabled={isLoading} className="glass-pill-active py-6 px-16 flex items-center justify-center gap-5 transition-all duration-700 shadow-[0_20px_50px_rgba(255,255,255,0.1)] text-[12px] font-black uppercase tracking-[0.4em] relative overflow-hidden group/btn disabled:opacity-50 mt-4">
                                                <Video size={22} /> {isLoading ? "Initializing..." : "Start Watching"}
                                            </motion.button>
                                        ) : (
                                            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                                                <div className="glass-pill border-green-500/20 text-white font-black py-5 px-10 flex items-center gap-4 shadow-2xl uppercase tracking-widest text-[10px]">
                                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75" />
                                                    Party Live
                                                </div>
                                                <button onClick={() => navigate(`/room/${roomCode}`, { state: { roomCode } })} className="glass-pill-active py-5 px-12 flex items-center gap-4 transition-all duration-700 transform hover:scale-105 shadow-3xl text-[11px] font-black uppercase tracking-[0.4em]">
                                                    <Play size={18} fill="white" /> Join Party
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
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsSidebarOpen(true)} className="fixed bottom-8 right-8 w-16 h-16 bg-[#E50914] rounded-full flex items-center justify-center text-white shadow-[0_15px_30px_rgba(229,9,20,0.4)] z-50 lg:hidden border-none outline-none">
                <Users size={24} />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-gold rounded-full border-4 border-[#050505] animate-pulse" />
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
