import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Star, Disc } from 'lucide-react';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const builders = [
        {
            name: "Himanshu Shekhar Das",
            role: "Backend Head",
            bio: "Driving the core architecture and infrastructure behind WatchWave. Himanshu focuses on building scalable real-time systems, handling concurrent streams, and ensuring our backend services remain robust and lightning-fast."
        },
        {
            name: "Subasis Panigrahi",
            role: "Frontend Lead",
            bio: "Architecting the visual experience and user interface of WatchWave. Subasis is passionate about creating immersive, cinematic layouts where every animation and interaction feels premium and intentional."
        },
        {
            name: "Sumit Kumar Sahoo",
            role: "Frontend Developer",
            bio: "Bridging the gap between complex functionality and seamless design. Sumit ensures the player controls, party rooms, and navigation paths are intuitive, responsive, and visually cohesive."
        },
        {
            name: "Shoib Khan",
            role: "Backend Developer",
            bio: "Optimizing the server-side logic and database queries holding WatchWave together. Shoib specializes in crafting real-time synchronization features so watch parties stay perfectly in sync across the globe."
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 text-white selection:bg-brand-red selection:text-white relative overflow-hidden">
            {/* Cinematic Background Field - Keeping WatchWave's style */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-brand-red/[0.04] blur-[180px] rounded-full" />
                <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-white/[0.02] blur-[150px] rounded-full" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:60px_60px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">About WatchWave</h1>
                    <p className="text-lg md:text-xl text-gray-400 font-medium tracking-wide">
                        We are building the ultimate cinematic experience for the next generation of movie lovers.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Disc className="text-brand-red w-6 h-6" />
                        <h2 className="text-2xl font-black uppercase tracking-tight">Our Mission</h2>
                    </div>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed tracking-wide">
                        WatchWave was born from a simple idea: watching movies shouldn't be limited by distance. In a world of increasing physical separation, we believe that shared experiences are the only way forward. We're building tools that empower viewers to share not just screens, but emotions.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Star className="text-brand-red w-6 h-6 outline-none fill-brand-red/10" />
                        <h2 className="text-2xl font-black uppercase tracking-tight">Our Values</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">Premium by Default</h3>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide">
                                Quality matters when it's shared. We optimize for high-fidelity streaming and an immersive, theater-like atmosphere.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">Viewer First</h3>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide">
                                No clutter, no distractions. Just pure cinematic immersion for those who love movies.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Project Guide</h2>
                    <div className="bg-rich-gray/60 border border-white/5 rounded-xl p-6 md:p-8 hover:border-white/10 transition-colors">
                        <h3 className="text-lg font-bold mb-2 tracking-wide uppercase">
                            Prof. Biswaranjan Sarangi <span className="text-[#a855f7] text-sm font-bold ml-3 tracking-normal normal-case">Mentor & Guide</span>
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide">
                            Providing valuable mentorship, academic guidance, and direction for the successful development of the WatchWave project.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-3xl font-black mb-8 uppercase tracking-tight">Meet the Builders</h2>
                    <div className="flex flex-col gap-4 md:gap-6">
                        {builders.map((builder, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (idx * 0.1) }}
                                key={builder.name} 
                                className="bg-rich-gray/60 border border-white/5 rounded-xl p-6 md:p-8 hover:border-white/10 transition-colors group"
                            >
                                <h3 className="text-xl font-bold mb-3 tracking-wide uppercase">
                                    {builder.name} <span className="text-[#3b82f6] text-sm font-bold ml-3 tracking-normal normal-case">{builder.role}</span>
                                </h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed tracking-wide">
                                    {builder.bio}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
