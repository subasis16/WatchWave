import React, { useEffect } from 'react';
import { Shield, Lock, EyeOff, Keyboard, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const DataPrivileges = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-40 pb-24 px-8 md:px-16 lg:px-24 bg-transparent text-white selection:bg-accent-gold selection:text-black relative overflow-hidden text-gray-300">
            
            {/* Cinematic Background Field */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-white/[0.02] blur-[150px] rounded-full" />
                <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:40px_40px] opacity-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Security Layers / Features</h3>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-white leading-[0.8]">
                            Privacy <br/> Shield
                        </h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-8 md:p-20 border-white/5 relative overflow-hidden group"
                    >
                         <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                             <Shield size={100} strokeWidth={1} />
                         </div>
                         <div className="relative z-10 space-y-8">
                             <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Identity Integrity</h2>
                             <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest leading-[2]">
                                WatchWave is built on the foundation of absolute privacy. We do not harvest viewing metadata for third-party optimization. Your digital footprint belongs exclusively to your local screen.
                             </p>
                             <div className="flex gap-4">
                                <div className="glass-pill px-6 py-2 text-[8px] font-black text-accent-gold border-accent-gold/20 uppercase tracking-[0.4em]">E2E Active</div>
                                <div className="glass-pill px-6 py-2 text-[8px] font-black text-gray-500 border-white/5 uppercase tracking-[0.4em]">Zero Knowledge</div>
                             </div>
                         </div>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        {[
                            { icon: Lock, title: 'Cinematic Encryption', desc: 'Symmetric encryption for all offline downloads.' },
                            { icon: EyeOff, title: 'Incognito Mode', desc: 'Private viewing sessions available everywhere.' },
                            { icon: Terminal, title: 'Data Honesty', desc: 'Complete transparency on trackable data usage.' },
                            { icon: Keyboard, title: 'Manual Controls', desc: 'Direct control over all tracking data.' }
                        ].map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 border-white/5 hover:border-white/10 transition-all duration-700"
                            >
                                <item.icon size={28} className="text-white mb-6" />
                                <h4 className="text-lg font-black text-white uppercase tracking-tighter mb-2">{item.title}</h4>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 md:p-20 border-white/5 text-center space-y-8 md:space-y-12"
                >
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Propagation Rights</h3>
                    <div className="grid md:grid-cols-3 gap-12 text-left">
                         {[
                             ['The Right to Access', 'Download a complete JSON archive of your cinematic history at any time.'],
                             ['The Right to Erasure', 'Instantly delete your entire account history from our secure servers.'],
                             ['Profile Portability', 'Seamlessly migrate your preferences between different cinematic devices.']
                         ].map(([title, desc], i) => (
                             <div key={i} className="space-y-4">
                                 <h4 className="text-xl font-black text-white uppercase tracking-tighter flex gap-3">
                                     <span className="text-accent-gold">{i + 1}.</span> {title}
                                 </h4>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-[1.8]">{desc}</p>
                             </div>
                         ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DataPrivileges;
