import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Play } from 'lucide-react';
import { movies } from '../../data/content';

const RoomGrid = () => {
    const navigate = useNavigate();

    // Mock active rooms based on movies data
    const activeRooms = movies.slice(0, 8).map((movie, index) => ({
        id: `room-${index}`,
        title: movie.title,
        host: ['Alex', 'Sarah', 'Dev', 'Sam'][index % 4] + "'s Party",
        viewers: Math.floor(Math.random() * 20) + 2,
        maxViewers: 20,
        image: movie.image,
        tags: ['Public', 'English']
    }));

    return (
        <div className="mt-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-[10px] font-black text-accent-gold tracking-[0.4em] uppercase mb-2">Live Screens</h3>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Public Theaters</h2>
                </div>
                <div className="flex gap-3 text-[10px] font-black tracking-widest uppercase">
                    <span className="text-white px-5 py-2 glass-pill-active cursor-pointer shadow-xl border-accent-gold/20">Trending</span>
                    <span className="px-5 py-2 glass-pill cursor-pointer hover:border-white/40 border-white/10 text-gray-400 hover:text-white transition-all">Newest</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {activeRooms.map((room) => (
                    <div
                        key={room.id}
                        className="group relative rounded-[1.5rem] overflow-hidden aspect-[16/10] glass-card cursor-pointer shadow-3xl hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all duration-700 transform hover:-translate-y-2 border-white/5 hover:border-accent-gold/30"
                        onClick={() => navigate('/room')}
                    >
                        {/* Poster */}
                        <img
                            src={room.image.replace('w500', 'original')}
                            alt={room.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s] ease-out opacity-80 group-hover:opacity-100"
                        />

                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        {/* Persistent Top Info */}
                        <div className="absolute top-4 left-4 flex gap-2 z-10 w-full pr-8 justify-between items-start">
                            <span className="bg-red-500/80 text-[9px] font-black tracking-[0.2em] text-white px-3 py-1 rounded-full backdrop-blur-md shadow-[0_0_15px_#ef4444] border border-red-400/50 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                LIVE
                            </span>
                            <span className="bg-black/60 border border-white/10 text-[9px] font-bold text-gray-300 px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 uppercase tracking-widest shadow-xl">
                                <Users size={12} className="text-accent-gold" /> {room.viewers}/{room.maxViewers}
                            </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 translate-y-4 group-hover:translate-y-0">
                            <h4 className="text-xl font-black text-white uppercase tracking-tighter line-clamp-1 mb-1 shadow-black drop-shadow-lg">
                                {room.host}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest line-clamp-1 mb-6 drop-shadow-md">
                                Streaming: <span className="text-accent-gold">{room.title}</span>
                            </p>

                            <button className="flex items-center justify-center gap-3 glass-pill-active py-4 rounded-xl w-full transition-all active:scale-95 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                                <Play size={14} fill="currentColor" />
                                Join Screen
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomGrid;
