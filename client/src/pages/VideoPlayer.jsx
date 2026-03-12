import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const VideoPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // A dummy placeholder video source since we don't have the real backend URLs yet.
    const videoSrc = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4";

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

            {/* Video Element */}
            <video
                className="w-full h-full object-contain"
                autoPlay
                controls
                src={videoSrc}
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
