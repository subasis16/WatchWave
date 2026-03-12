import React, { useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MovieModal = ({ movie, isOpen, onClose }) => {
    const navigate = useNavigate();

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!movie) return null;

    const handlePlayVideo = () => {
        // Close modal first to prevent artifact scrolling, then route to player
        onClose();
        navigate(`/watch/${movie.id}`);
    };

    // Mocking description/genres if not present in the data
    const description = movie.description || "In the early 2000s, an undercover operative infiltrates Karachi's underworld, breaking into its inner circle to dismantle a violent nexus from within. A gripping tale of espionage and betrayal.";
    const genres = movie.genres || ['Action', 'Thrillers', 'Drama'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Blur Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full max-w-3xl bg-[#141414] rounded-xl overflow-y-auto max-h-[90vh] shadow-[0_0_40px_rgba(0,0,0,0.8)] z-10 no-scrollbar border border-white/10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 hover:text-white rounded-full text-gray-300 transition-all"
                        >
                            <X size={24} />
                        </button>

                        {/* Hero Section (Top 40-50%) */}
                        <div className="relative h-[300px] sm:h-[400px] w-full">
                            <img
                                src={movie.image.replace('w500', 'original')} // Try to fetch high-res if TMDB
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlay perfectly blending into background */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />

                            {/* Title resting on the gradient */}
                            <div className="absolute bottom-6 left-8 right-8">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
                                    {movie.title}
                                </h2>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-8 pb-8 -mt-2">

                            {/* Metadata Row */}
                            <div className="flex items-center flex-wrap gap-3 mb-6">
                                <span className="text-green-400 font-bold">{movie.match || 98}% Match</span>
                                <span className="text-gray-300 border border-gray-600 px-1.5 py-0.5 rounded text-sm bg-white/5">
                                    {movie.year || '2025'}
                                </span>
                                <span className="text-gray-300 border border-gray-600 px-1.5 py-0.5 rounded text-sm bg-white/5">
                                    {movie.age || 'U/A 16+'}
                                </span>
                                {genres.map((genre, idx) => (
                                    <span key={idx} className="text-gray-400 text-sm">
                                        {genre}{idx < genres.length - 1 ? <span className="mx-2 text-gray-600">•</span> : ''}
                                    </span>
                                ))}
                            </div>

                            {/* Synopsis */}
                            <p className="text-gray-300 leading-relaxed mb-8 text-sm md:text-base max-w-2xl">
                                {description}
                            </p>

                            {/* Call to Action */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handlePlayVideo}
                                    className="bg-[#E50914] hover:bg-red-700 hover:scale-105 transition-all text-white font-bold py-3 px-8 rounded-md flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                                >
                                    <Play size={20} className="fill-current" />
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MovieModal;
