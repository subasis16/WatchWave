import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Wand2, Users, Play, Radio, Shield } from 'lucide-react';
import { createPartyRoom, joinPartyRoom } from '../../services/firebase-services';
import { toast } from 'react-hot-toast';

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
        setCreationError(null);
        try {
            const result = await createPartyRoom(
                String(hostRoomId).trim(),
                hostPassword ? String(hostPassword).trim() : ''
            );

            if (result.success) {
                navigate(`/room/${hostRoomId}`, { state: { isOwner: true } });
            }
        } catch (error) {
            setCreationError(error.message || "Failed to create room");
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!joinRoomId) return;
        setIsJoining(true);
        try {
          const result = await joinPartyRoom(joinRoomId.trim(), joinPassword.trim());
          if (result.success) {
             navigate(`/room/${joinRoomId}`, { state: { isOwner: false } });
          }
        } catch (error) {
          toast.error(error.message || "Room not found or access denied.");
        } finally {
          setIsJoining(false);
        }
    };

    return (
        <div className="glass-card mb-12 shadow-3xl relative overflow-hidden border-white/5 p-2">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/[0.03] blur-[120px] rounded-full pointer-events-none z-0"></div>
            
            <div className="flex flex-col lg:flex-row relative z-10 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                {/* Host a Room */}
                <div className="flex-1 p-8 lg:p-12 space-y-10 group/host">
                    <div className="space-y-4">
                        <div className="w-16 h-16 rounded-[1.5rem] glass-card flex items-center justify-center border-white/10 shadow-2xl group-hover/host:border-accent-gold/40 transition-all">
                            <Radio size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Start Room
                        </h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-sm">
                            Generate a cinematic theater for verified group watch experience.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="relative group">
                            <input
                                type="text"
                                value={hostRoomId}
                                onChange={(e) => setHostRoomId(e.target.value)}
                                placeholder="Screen ID"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-6 pr-14 py-5 text-[12px] font-black tracking-[0.2em] text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/40 focus:bg-white/5 transition-all shadow-inner uppercase"
                            />
                            <button
                                onClick={() => setHostRoomId(generateRoomID())}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors glass-card p-2 rounded-xl border-white/5"
                                title="Regenerate"
                            >
                                <RefreshCw size={14} />
                            </button>
                        </div>

                        <div className="relative group">
                            <input
                                type="text"
                                value={hostPassword}
                                onChange={(e) => setHostPassword(e.target.value)}
                                placeholder="Decryption Key (Opt)"
                                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-6 pr-14 py-5 text-[12px] font-black tracking-[0.2em] text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/40 focus:bg-white/5 transition-all shadow-inner uppercase"
                            />
                            <button
                                onClick={() => setHostPassword(generatePassword())}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent-gold transition-colors glass-card p-2 rounded-xl border-white/5"
                                title="Auto-Generate"
                            >
                                <Wand2 size={14} />
                            </button>
                        </div>

                        <div>
                            <button
                                onClick={handleCreateRoom}
                                disabled={isCreating}
                                className="w-full glass-pill-active py-5 mt-2 flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all transform active:scale-95 disabled:opacity-50 shadow-3xl"
                            >
                                {isCreating ? 'Synchronizing...' : (
                                    <>
                                        <Play size={16} fill="white" /> Host Transmission
                                    </>
                                )}
                            </button>
                            {creationError && (
                                <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-4 text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                                    {creationError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Join a Room */}
                <div className="flex-1 p-8 lg:p-12 space-y-10 group/join bg-white/[0.01]">
                    <div className="space-y-4">
                        <div className="w-16 h-16 rounded-[1.5rem] glass-card flex items-center justify-center border-white/10 shadow-2xl group-hover/join:border-white/40 transition-all">
                            <Shield size={24} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Access Screen
                        </h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-sm">
                            Connect to an active cinematic domain via secure invite link.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <input
                            type="text"
                            value={joinRoomId}
                            onChange={(e) => setJoinRoomId(e.target.value)}
                            placeholder="Target Screen ID"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-[12px] font-black tracking-[0.2em] text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all shadow-inner uppercase"
                        />

                        <input
                            type="password"
                            value={joinPassword}
                            onChange={(e) => setJoinPassword(e.target.value)}
                            placeholder="Decryption Key (If Locked)"
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-[12px] font-black tracking-[0.2em] text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all shadow-inner uppercase"
                        />

                        <button
                            onClick={handleJoinRoom}
                            disabled={isJoining || !joinRoomId.trim()}
                            className="w-full glass-card hover:bg-white/10 border-white/10 text-gray-400 hover:text-white font-black py-5 rounded-2xl mt-2 transition-all transform active:scale-95 disabled:opacity-30 text-[11px] uppercase tracking-[0.4em] shadow-xl"
                        >
                            {isJoining ? 'Authenticating...' : 'Connect to Screen'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HeroActionPanel;
