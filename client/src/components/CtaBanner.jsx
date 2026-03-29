import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const CtaBanner = () => {
    // Curated posters from the existing data to populate the background
    const posters = [
        'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', // Stranger Things
        'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', // Avengers
        'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg', // Arcane
        'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', // Breaking Bad
        'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg', // 3 Idiots
        'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', // GoT
        'https://image.tmdb.org/t/p/w500/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg', // The Boys
        'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg', // Squid Game
        'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg', // TLOU
        'https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg', // Loki
    ];

    const { scrollYProgress } = useScroll();
    
    // Transform values based on scroll progress
    // We target the section when it enters view (approx 0.7 to 1.0 of page height)
    const grayscale = useTransform(scrollYProgress, [0.4, 0.7], ["grayscale(100%)", "grayscale(0%)"]);
    const brightness = useTransform(scrollYProgress, [0.4, 0.7], ["brightness(0.4)", "brightness(1)"]);
    const scale = useTransform(scrollYProgress, [0.4, 0.7], [1.1, 1]);
    const opacity = useTransform(scrollYProgress, [0.4, 0.7], [0.3, 0.5]);

    return (
        <section className="w-full mt-28 px-4 md:px-0 overflow-hidden">
            <motion.div 
                style={{ filter: grayscale }}
                className="relative h-64 md:h-72 rounded-3xl md:rounded-[2.5rem] overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.4)] md:mx-10"
            >
                {/* Background Poster Collage (Tilted for Netflix-style look) */}
                <motion.div 
                    style={{ filter: brightness, scale, opacity }}
                    animate={{ 
                        x: [0, -20, 0],
                        y: [0, 10, 0],
                    }}
                    transition={{ 
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 -inset-x-20 grid grid-cols-5 md:grid-cols-10 gap-2"
                >
                    {posters.map((img, i) => (
                        <div key={i} className="relative h-full overflow-hidden rounded-xl border border-white/5">
                            <img 
                                src={img} 
                                alt="" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    ))}
                </motion.div>

                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
                <div className="absolute inset-0 rounded-none md:rounded-[2.5rem] border border-white/5 pointer-events-none" />

                {/* Content Section */}
                <div className="relative h-full flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-8 md:py-0 gap-6 md:gap-8">
                    <div className="space-y-3 text-center md:text-left">
                        <h2 className="text-lg md:text-3xl font-black text-white tracking-tight leading-snug md:leading-none">
                            Discover your next favourites, plus new <br className="hidden lg:block" /> releases every week
                        </h2>
                    </div>
                    
                    <Link 
                        to="/about"
                        className="glass-pill px-8 md:px-10 py-3.5 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-white hover:bg-white/20 transition-all whitespace-nowrap border-white/10 hover:border-white/20 active:scale-95"
                    >
                        More About WatchWave
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

export default CtaBanner;
