import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        { title: 'Playback License', content: 'WatchWave grants you a revocable, non-exclusive, non-transferable, limited license to stream content for personal, non-commercial purposes within our cinematic ecosystem.' },
        { title: 'User Propagation', content: 'You are responsible for maintaining the security of your personal access keys. Any activity originating from your screen is your legal responsibility.' },
        { title: 'Cinematic Boundaries', content: 'Our services are geographically restricted based on regional licensing agreements. Attempting to bypass these cinematic boundaries via proxy screens is prohibited.' },
        { title: 'Content Integrity', content: 'Reproduction or redistribution of the cinematic stream is strictly forbidden. We employ forensic watermarking to protect cinematic integrity.' }
    ];

    return (
        <div className="min-h-screen pt-40 pb-24 px-8 md:px-16 lg:px-24 bg-transparent text-white selection:bg-accent-gold selection:text-black relative overflow-hidden">
            
            {/* Cinematic Background Field */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/[0.02] blur-[150px] rounded-full" />
                <div className="absolute bottom-[20%] left-[-5%] w-[50%] h-[50%] bg-accent-gold/[0.04] blur-[180px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="space-y-6 mb-24">
                    <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Legal Features / v2.6.0</h3>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-white leading-[0.8]">
                        Cinematic <br/> Terms
                    </h1>
                </div>

                <div className="space-y-12">
                    {sections.map((section, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 md:p-12 border-white/5 hover:border-white/10 transition-all duration-700"
                        >
                            <div className="flex flex-col md:flex-row gap-8 md:gap-20">
                                <div className="md:w-64 shrink-0">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-4">{section.title}</h2>
                                    <div className="h-1 w-12 bg-accent-gold rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-[2]">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 p-8 md:p-12 glass-card border-dashed border-white/10 text-center">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.6em]">
                        Last Propagation: March 14, 2026 &bull; Encryption Active
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
