import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Wand2, Users, Play } from 'lucide-react';

const HeroActionPanel = () => {
    const navigate = useNavigate();

    // Host Room State
    const [hostRoomId, setHostRoomId] = useState('');
    const [hostPassword, setHostPassword] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [creationError, setCreationError] = useState(null);

    // Join Room State
    const [joinRoomId, setJoinRoomId] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    const generateRoomID = () => Math.floor(10000000 + Math.random() * 90000000).toString();
    const generatePassword = () => Math.random().toString(36).substring(2, 8);

    useEffect(() => {
        setHostRoomId(generateRoomID());
    }, []);

    const handleCreateRoom = async () => {
        if (!hostRoomId) return;
        setIsCreating(true);
        setCreationError(null); // Clear previous errors
        try {
            const payload = {
                room_code: String(hostRoomId).trim(),
                room_password: hostPassword ? String(hostPassword).trim() : '',
                host_id: '84920156'
            };

            const response = await fetch('http://localhost:5000/api/party/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/room');
            } else {
                // Exposing details to the dev console
                console.error("Backend Error Object:", data);
                setCreationError(data.error || data.message || "Server rejected the request");
            }
        } catch (error) {
            // Exposing network-layer or parsing errors to the console
            console.error("Network/Fetch Error:", error.message, error);
            setCreationError("Network Error: " + error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!joinRoomId) return;
        setIsJoining(true);
        // Simulate backend connection
        setTimeout(() => {
            setIsJoining(false);
            navigate('/room');
        }, 800);
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-8 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-neutral-800">

                {/* Host a Room */}
                <div className="flex-1 p-8">
                    <div className="mb-6 flex items-center justify-between pointer-events-none">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Play size={20} className="text-red-600" fill="currentColor" />
                                HOST A ROOM
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">Start a new private or public watch party</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={hostRoomId}
                                onChange={(e) => setHostRoomId(e.target.value)}
                                placeholder="Room ID"
                                className="w-full bg-black/50 border border-neutral-700 rounded-xl pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-mono"
                            />
                            <button
                                onClick={() => setHostRoomId(generateRoomID())}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white hover:bg-neutral-800 p-1.5 rounded-md transition-colors"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={hostPassword}
                                onChange={(e) => setHostPassword(e.target.value)}
                                placeholder="Password (Optional)"
                                className="w-full bg-black/50 border border-neutral-700 rounded-xl pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-mono"
                            />
                            <button
                                onClick={() => setHostPassword(generatePassword())}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 hover:bg-neutral-800 p-1.5 rounded-md transition-colors"
                            >
                                <Wand2 size={16} />
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={handleCreateRoom}
                                disabled={isCreating}
                                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-red-600/20"
                            >
                                {isCreating ? 'Creating Room...' : 'Create & Get Link'}
                            </button>
                            {creationError && (
                                <p className="text-red-500 text-sm mt-3 text-center bg-red-900/20 p-2 rounded border border-red-500/30">
                                    {creationError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Join a Room */}
                <div className="flex-1 p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Users size={20} className="text-indigo-500" />
                            JOIN A ROOM
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Have an invite code? Enter it below to join.</p>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                            placeholder="Enter Room ID"
                            className="w-full bg-black/50 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                        />

                        <input
                            type="password"
                            value={joinPassword}
                            onChange={(e) => setJoinPassword(e.target.value)}
                            placeholder="Room Password (if required)"
                            className="w-full bg-black/50 border border-neutral-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                        />

                        <button
                            onClick={handleJoinRoom}
                            disabled={isJoining || !joinRoomId.trim()}
                            className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-bold py-3.5 rounded-xl transition-all"
                        >
                            {isJoining ? 'Joining...' : 'Join Room'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HeroActionPanel;
