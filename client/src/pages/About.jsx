import React, { useEffect } from 'react';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto min-h-screen text-gray-200">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-b border-white/10 pb-4">About WatchWave</h1>
            <div className="space-y-6 text-lg leading-relaxed">
                <p>
                    WatchWave is the ultimate premium streaming destination, designed specifically to bring a high-end, cinematic viewing experience straight to your modern devices.
                </p>
                <p>
                    Founded on the principle that streaming should be a shared, social, and ultra-luxurious experience, WatchWave offers an unparalleled visual UI fused with cutting-edge real-time features like the <strong>Room Dashboard</strong>, enabling you to sync watches with your friends anywhere across the globe.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mt-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 blur-[80px] pointer-events-none rounded-full" />
                    <h2 className="text-2xl font-bold text-brand-red mb-4 relative z-10">Our Mission</h2>
                    <p className="relative z-10 text-gray-300">
                        To revolutionize the way people consume and share premium digital content through beautiful design, frictionless interactivity, and next-generation "Spatial Web" features.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
