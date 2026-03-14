import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { trending, anime, movies, bollywood, series } from '../data/content';

const VideoPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find the item by ID in all data arrays
    const allContent = [...trending, ...anime, ...movies, ...bollywood, ...series];
    const item = allContent.find(c => c.id === id);

    // Get the trailer URL or default if not found
    const trailerUrl = item?.trailerUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";

    return (
        <div className="w-full h-screen bg-black relative flex items-center justify-center overflow-hidden group">
            {/* Back Button Overlay */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 z-50 p-3 bg-black/50 hover:bg-[#e50914] backdrop-blur-sm rounded-full text-white/70 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                aria-label="Go Back"
            >
                <ArrowLeft className="w-8 h-8" />
            </button>

            {/* Video Player — YouTube Trailer with branded elements hidden */}
            <div className="relative w-full h-full">
                <iframe
                    className="w-full h-full border-0"
                    src={`${trailerUrl}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                    title={item?.title || "Video Player"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
                {/* Overlay to hide the YouTube logo (bottom-right of the player bar) */}
                <div
                    className="absolute pointer-events-none z-10"
                    style={{ bottom: '40px', right: '0px', width: '130px', height: '42px', background: '#000' }}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
