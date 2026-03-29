import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, ArrowRight, ShieldAlert } from 'lucide-react';

const LoginOverlay = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-3xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-lg glass-card p-12 relative border-white/10 text-center overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-accent-gold/5 blur-[100px] rounded-full -z-10" />

                <div className="mb-12">
                    <div className="inline-flex items-center justify-center p-5 rounded-3xl bg-white/5 border border-white/10 mb-8 shadow-2xl">
                        <LockKeyhole size={40} className="text-accent-gold animate-pulse" />
                    </div>
                    <h3 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.6em] mb-4">Transmission Locked</h3>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Join the Wave</h2>
                    <p className="mt-6 text-gray-400 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                        This cinematic experience is exclusive to WatchWave members. Sign in or create an account to unlock full access.
                    </p>
                </div>

                <div className="space-y-6">
                    <button 
                        onClick={() => navigate('/auth')}
                        className="w-full py-5 rounded-2xl glass-pill-active flex items-center justify-center gap-4 group transition-all transform active:scale-95 shadow-3xl"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] ml-2">Sign In or Join</span>
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-5 rounded-2xl glass-card border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
                    >
                        Return Home
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-4">
                    <ShieldAlert size={14} className="text-gray-600" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Secure AES-256 Connection</span>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginOverlay;
