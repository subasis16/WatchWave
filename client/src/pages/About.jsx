import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Users, Box, Film } from 'lucide-react';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-40 pb-24 px-8 md:px-16 lg:px-24 bg-transparent text-white selection:bg-accent-gold selection:text-black relative overflow-hidden">
            
            {/* Cinematic Background Field */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
                <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-white/[0.02] blur-[150px] rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:60px_60px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">About / WatchWave</h3>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-white leading-[0.8]">
                            Beyond <br/> Streaming
                        </h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <p className="text-2xl font-black text-gray-400 uppercase tracking-tighter leading-snug">
                            WatchWave is the ultimate premium streaming destination, designed to bring a high-end, cinematic viewing experience straight to your modern devices.
                        </p>
                        <p className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.4em] leading-[2.2]">
                            Founded on the principle that modern streaming should be a premium, shared experience, WatchWave offers a pristine theater-styled UI fused with seamless movie-sharing features like <span className="text-white">Watch Party Rooms</span>, enabling you to enjoy movies together with friends worldwide.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        {[
                            { icon: PlayCircle, title: 'Cinema UI', desc: 'Clean, immersive viewing experience.' },
                            { icon: Users, title: 'Watch Together', desc: 'Real-time watch parties with friends.' },
                            { icon: Box, title: 'Downloads', desc: 'Save movies & shows for offline viewing.' },
                            { icon: Film, title: 'Curated Picks', desc: 'Personalized movie recommendations for you.' }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-10 border-white/5 hover:border-white/10 transition-all duration-700"
                            >
                                <item.icon size={28} className="text-gray-400 mb-6" />
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{item.title}</h3>
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-32 glass-card p-10 md:p-24 border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/[0.04] blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.6em] mb-6">Our Mission</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-8">
                            To bring the magic of the movie theater straight to your living room.
                        </h3>
                        <div className="h-1 w-24 bg-white/20 rounded-full" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
