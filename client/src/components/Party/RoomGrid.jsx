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
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="text-sm font-semibold text-red-600 tracking-wider uppercase mb-1">Live Now</h3>
                    <h2 className="text-2xl font-bold text-white">Public Watch Parties</h2>
                </div>
                <div className="flex gap-2 text-sm text-gray-400">
                    <span className="font-semibold text-white px-3 py-1 bg-neutral-800 rounded-full cursor-pointer hover:bg-neutral-700">Trending</span>
                    <span className="px-3 py-1 rounded-full cursor-pointer hover:bg-neutral-800">Newest</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeRooms.map((room) => (
                    <div
                        key={room.id}
                        className="group relative rounded-xl overflow-hidden aspect-[16/10] bg-neutral-800 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => navigate('/room')}
                    >
                        {/* Poster */}
                        <img
                            src={room.image.replace('w500', 'original')}
                            alt={room.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />

                        {/* Persistent Top Info */}
                        <div className="absolute top-2 left-2 flex gap-1 z-10">
                            <span className="bg-red-600/90 text-[10px] font-bold text-white px-2 py-0.5 rounded backdrop-blur">LIVE</span>
                            <span className="bg-black/80 text-[10px] text-gray-200 px-2 py-0.5 rounded backdrop-blur flex items-center gap-1">
                                <Users size={10} /> {room.viewers}/{room.maxViewers}
                            </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                            <h4 className="text-lg font-bold text-white line-clamp-1 group-hover:-translate-y-1 transition-transform duration-300">
                                {room.host}
                            </h4>
                            <p className="text-sm text-gray-300 line-clamp-1 mb-3 group-hover:-translate-y-1 transition-transform duration-300 delay-75">
                                Watching: <span className="text-red-400">{room.title}</span>
                            </p>

                            <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg w-full transition-colors active:scale-95">
                                <Play size={16} fill="currentColor" />
                                Join Party
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomGrid;
