import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Search, UserPlus, ArrowLeft, Send, Share2, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { auth } from '../../firebase';

const socket = io.connect('http://localhost:5000');

const SocialSidebar = () => {
    const [activeTab, setActiveTab] = useState('friends');
    const [isSearching, setIsSearching] = useState(false);
    const [activeChatUser, setActiveChatUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [friends, setFriends] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const fetchSocialData = async () => {
        try {
            setLoading(true);
            const user = auth.currentUser;
            if (!user) return;
            
            const token = await user.getIdToken();
            
            // Fetch Friends
            const friendsRes = await fetch('http://localhost:5000/api/friends', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const friendsData = await friendsRes.json();
            
            // Fetch All Users for Suggestions
            const usersRes = await fetch('http://localhost:5000/api/users/all/profiles', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const usersData = await usersRes.json();
            
            if (friendsData.success) {
                setFriends(friendsData.friends.map(f => ({
                    id: f.friendUid,
                    name: f.name,
                    avatar: f.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random`,
                    status: f.isOnline ? 'Watching Live' : 'Offline',
                    isOnline: f.isOnline || false
                })));
            }
            
            if (usersData.success) {
                const friendIds = new Set(friendsData.friends?.map(f => f.friendUid) || []);
                setSuggestedUsers(usersData.users.filter(u => !friendIds.has(u.id)).slice(0, 10));
            }
        } catch (error) {
            console.error("Error fetching social data:", error);
            toast.error("Failed to load connections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchSocialData();
            }
        });

        socket.on("receive_message", (data) => {
            setMessages((prevList) => [...prevList, data]);
        });

        return () => {
            unsubscribe();
            socket.off("receive_message");
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const joinChatSession = (friend) => {
        setActiveChatUser(friend);
        setActiveTab('chat');
        setMessages([]);
        const myUid = auth.currentUser?.uid;
        const friendUid = friend.id;
        // Deterministic roomId by sorting UIDs
        const roomId = [myUid, friendUid].sort().join('_');
        socket.emit("join_chat", `room_${roomId}`);
    };

    const sendMessage = async () => {
        if (currentMessage.trim() !== "" && activeChatUser) {
            const myUid = auth.currentUser?.uid;
            const friendUid = activeChatUser.id;
            const roomId = [myUid, friendUid].sort().join('_');
            
            const messageData = {
                room: `room_${roomId}`,
                author: "Me",
                text: currentMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            await socket.emit("send_message", messageData);
            setMessages((prevList) => [...prevList, messageData]);
            setCurrentMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const sendFriendRequest = async (targetUid, targetName) => {
        try {
            const user = auth.currentUser;
            const token = await user.getIdToken();
            
            const res = await fetch('http://localhost:5000/api/friends/request', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ targetUid })
            });
            
            const data = await res.json();
            if (data.success) {
                toast.success(`Request sent to ${targetName}`);
                fetchSocialData();
            } else {
                toast.error(data.error || "Failed to send request");
            }
        } catch (error) {
            toast.error("Error sending friend request");
        }
    };

    const filteredFriends = friends.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full w-full bg-[#050505]/95 backdrop-blur-2xl border-l border-white/5 flex flex-col z-20 overflow-hidden relative shadow-[-40px_0_100px_rgba(0,0,0,0.9)]">
            
            {/* Background Neural Accents */}
            <div className="absolute top-0 right-[-10%] w-[120%] h-80 bg-accent-gold/[0.03] blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-80 bg-white/[0.02] blur-[150px] rounded-full pointer-events-none" />

            <div className="px-8 pt-12 shrink-0 relative z-20 space-y-10">
                <div className="flex items-end justify-between">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h2 className="text-[16px] font-black uppercase tracking-[0.6em] text-white flex items-center gap-4">
                            <span className="w-1.5 h-6 bg-accent-gold rounded-full" />
                            Parties
                        </h2>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] ml-5">Neural Sync: Enabled</p>
                    </motion.div>
                    <div className="glass-pill px-6 py-2.5 text-[9px] font-black text-green-500 border-green-500/20 uppercase tracking-[0.3em] flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.2)] bg-white/[0.03] border backdrop-blur-3xl">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]" />
                        Active
                    </div>
                </div>

                <div className="space-y-5">
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Party Link Copied to Neural Interface");
                        }}
                        className="w-full flex items-center justify-between p-6 glass-card border-white/10 bg-white/[0.03] transition-all group relative overflow-hidden rounded-[2.5rem] shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="flex flex-col items-start relative z-10">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white group-hover:text-accent-gold transition-colors">Start Watch Party</span>
                            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest group-hover:text-white/40 transition-colors mt-2">Broadcast your session</span>
                        </div>
                        <div className="w-12 h-12 rounded-[1.5rem] bg-white/5 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-black transition-all duration-500 shadow-2xl">
                            <Share2 size={18} className="group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                    </motion.button>

                    <div className="relative group">
                        <Search size={16} className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-700 ${isSearching ? 'text-accent-gold scale-125' : 'text-gray-700'}`} />
                        <input
                            type="text"
                            value={searchQuery}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find connections..."
                            className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] pl-16 pr-14 py-5 text-[11px] font-bold tracking-[0.3em] uppercase text-white placeholder-gray-800 focus:outline-none focus:border-accent-gold/40 focus:bg-white/[0.05] transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar px-8 pb-12 mt-8 z-20">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 space-y-5"
                        >
                            <Loader2 className="animate-spin text-accent-gold" size={40} strokeWidth={2.5} />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-700 animate-pulse">Initializing Network...</span>
                        </motion.div>
                    ) : activeTab === 'friends' && (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between px-3">
                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">Network Peers</span>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 to-transparent mx-6" />
                            </div>

                            {filteredFriends.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredFriends.map((friend, idx) => (
                                        <motion.div 
                                            key={friend.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                            className="flex items-center p-5 rounded-[2.5rem] bg-transparent border border-white/5 hover:border-accent-gold/20 cursor-pointer transition-all duration-500 group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            
                                            <div className="relative shrink-0" onClick={(e) => { e.stopPropagation(); navigate('/profile'); }}>
                                                <div className="w-14 h-14 p-0.5 rounded-[1.5rem] glass-card border-white/10 group-hover:border-accent-gold/40 transition-all duration-700 rotate-0 group-hover:rotate-6 shadow-2xl">
                                                    <img
                                                        src={friend.avatar}
                                                        alt={friend.name}
                                                        className={`w-full h-full rounded-[1.3rem] object-cover ${!friend.isOnline ? 'grayscale opacity-30 scale-95' : 'grayscale-0 opacity-100 scale-100'} transition-all duration-1000`}
                                                    />
                                                </div>
                                                {friend.isOnline && (
                                                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[4px] border-[#050505] rounded-full shadow-[0_0_15px_#22c55e] z-10" />
                                                )}
                                            </div>

                                            <div
                                                className="ml-6 flex flex-col flex-1 cursor-pointer relative z-10"
                                                onClick={() => joinChatSession(friend)}
                                            >
                                                <h4 className="text-[16px] font-black tracking-[0.1em] text-white/90 group-hover:text-accent-gold transition-all duration-500">{friend.name}</h4>
                                                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1.5 ${friend.isOnline ? 'text-accent-gold/70' : 'text-gray-800'}`}>{friend.status}</p>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.1, rotate: -10 }}
                                                className="ml-auto w-12 h-12 flex items-center justify-center text-gray-700 hover:text-white bg-white/5 rounded-[1.2rem] border border-white/5 transition-all relative z-10 group-hover:border-white/20"
                                                onClick={(e) => { e.stopPropagation(); joinChatSession(friend); }}
                                            >
                                                <MessageCircle size={18} strokeWidth={2.5} />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 px-8 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.01] rounded-[3rem] border border-dashed border-white/10 backdrop-blur-sm">
                                    <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center shadow-inner">
                                        <Users size={32} className="text-gray-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em]">Isolation Detected</p>
                                        <p className="text-[9px] font-bold text-gray-800 uppercase tracking-widest leading-relaxed">Expand your network to<br/>begin collective viewing.</p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-16 space-y-10">
                                <div className="flex items-center justify-between px-3">
                                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em]">Neural Discovery</span>
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-white/5 to-transparent mx-6" />
                                </div>
                                
                                <div className="grid grid-cols-1 gap-5">
                                    {suggestedUsers.length > 0 ? suggestedUsers.map((user, idx) => (
                                        <motion.div 
                                            key={user.id} 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + idx * 0.1 }}
                                            className="flex items-center p-5 rounded-[2.2rem] bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/20 transition-all duration-700 group cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="relative">
                                                <img 
                                                    src={user.avatar} 
                                                    className="w-12 h-12 rounded-[1.2rem] border border-white/10 shrink-0 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110 shadow-xl" 
                                                    alt={user.name} 
                                                />
                                            </div>
                                            <div className="ml-6 flex flex-col">
                                                <h4 className="text-[12px] font-black text-white/50 group-hover:text-white uppercase tracking-[0.2em] transition-colors">{user.name}</h4>
                                                <p className="text-[8px] font-black text-gray-800 mt-2 uppercase tracking-[0.4em]">Potential Ally</p>
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.1, backgroundColor: '#fff', color: '#000' }}
                                                onClick={() => sendFriendRequest(user.id, user.name)}
                                                className="ml-auto w-10 h-10 flex items-center justify-center rounded-[1.2rem] bg-white/5 text-white/30 border border-white/5 transition-all shadow-2xl"
                                            >
                                                <UserPlus size={16} />
                                            </motion.button>
                                        </motion.div>
                                    )) : (
                                        <div className="text-center py-6">
                                            <p className="text-[9px] font-black text-gray-800 uppercase tracking-[0.6em] italic">Deep scan complete. Network saturated.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CHAT INTERFACE */}
                    {activeTab === 'chat' && activeChatUser && (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.95 }}
                            transition={{ type: "spring", damping: 30, stiffness: 250 }}
                            className="flex flex-col h-full pt-2"
                        >
                            <div className="flex items-center gap-6 bg-white/[0.04] p-6 rounded-[3rem] border border-white/10 mb-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] shrink-0 backdrop-blur-3xl relative overflow-hidden group">
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
                                <button
                                    onClick={() => setActiveTab('friends')}
                                    className="text-gray-500 hover:text-white transition-all glass-card p-4 rounded-[1.5rem] border-white/10 hover:border-white/20 relative z-10 shadow-xl"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="relative cursor-pointer z-10" onClick={() => navigate('/profile')}>
                                    <img src={activeChatUser.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                                    {activeChatUser.isOnline && (
                                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[4px] border-[#0c0c0c] rounded-full shadow-[0_0_20px_#22c55e]" />
                                    )}
                                </div>
                                <div className="flex flex-col cursor-pointer z-10" onClick={() => navigate('/profile')}>
                                    <h4 className="text-[18px] font-black uppercase tracking-[0.2em] text-white leading-tight">{activeChatUser.name}</h4>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                                        <p className="text-[10px] text-accent-gold font-black tracking-[0.4em] uppercase opacity-80">{activeChatUser.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-10 py-6 px-4 flex flex-col relative z-20">
                                <div className="flex items-center justify-center gap-6 mb-8 opacity-20">
                                    <div className="h-[1px] w-16 bg-white" />
                                    <div className="text-[10px] font-black tracking-[0.8em] text-center text-white uppercase">Neural Link Established</div>
                                    <div className="h-[1px] w-16 bg-white" />
                                </div>

                                {messages.map((msg, index) => {
                                    const isMe = msg.author === "Me";
                                    return (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className={`flex gap-6 max-w-[90%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                                        >
                                            {!isMe && (
                                                <img src={activeChatUser.avatar} className="w-10 h-10 rounded-[1.2rem] shadow-2xl shrink-0 border border-white/10 mt-auto shadow-black" />
                                            )}
                                            <div className="flex flex-col">
                                                <div className={`${isMe ? 'bg-accent-gold/15 text-white border-accent-gold/50 rounded-br-sm' : 'bg-white/5 text-gray-200 border-white/10 rounded-bl-sm'} border backdrop-blur-3xl rounded-[2.2rem] px-7 py-5 text-[14px] font-bold tracking-wide shadow-[0_20px_50px_rgba(0,0,0,0.8)] leading-relaxed relative`}>
                                                    {msg.text}
                                                </div>
                                                <span className={`text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] mt-4 px-2 ${isMe ? 'text-right' : 'text-left'}`}>
                                                    {msg.time}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="pt-10 border-t border-white/5 mt-8 shrink-0 relative bg-transparent z-10 px-2 pb-2">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={`Neural Pulse to ${activeChatUser.name.split(' ')[0]}...`}
                                        className="w-full bg-[#080808]/90 border border-white/10 rounded-[2.5rem] pl-10 pr-20 py-6 text-[13px] font-bold uppercase tracking-[0.3em] text-white placeholder-gray-800 focus:outline-none focus:border-accent-gold/60 focus:bg-black transition-all shadow-[inset_0_4px_30px_rgba(0,0,0,0.9)] backdrop-blur-3xl"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1, x: -4 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={sendMessage}
                                        disabled={!currentMessage.trim()}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-[1.8rem] flex items-center justify-center bg-accent-gold text-black shadow-[0_10px_30px_rgba(212,175,55,0.5)] hover:shadow-accent-gold/80 transition-all disabled:opacity-10 cursor-pointer border-none"
                                    >
                                        <Send size={20} strokeWidth={3} className="ml-1" />
                                    </motion.button>
                                </div>
                                <div className="mt-6 flex items-center justify-center gap-4 opacity-50">
                                    <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-ping" />
                                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.8em]">End-to-End Encrypted Trace</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `
            }} />
        </div>
    );
};

export default SocialSidebar;
