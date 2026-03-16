import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Search, UserPlus, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';

const socket = io.connect('http://localhost:5000');

const SocialSidebar = () => {
    const [activeTab, setActiveTab] = useState('friends');
    const [idInput, setIdInput] = useState('');
    const [activeChatUser, setActiveChatUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [suggestedFriends, setSuggestedFriends] = useState([
        { id: 101, name: 'Elena', avatar: 'https://i.pravatar.cc/150?u=10' },
        { id: 102, name: 'Marcus', avatar: 'https://i.pravatar.cc/150?u=12' },
        { id: 103, name: 'Sophia', avatar: 'https://i.pravatar.cc/150?u=11' },
    ]);
    const [currentMessage, setCurrentMessage] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessages((prevList) => [...prevList, data]);
        });
        return () => {
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
        const roomId = `room_100_${friend.id}`;
        socket.emit("join_chat", roomId);
    };

    const sendMessage = async () => {
        if (currentMessage.trim() !== "") {
            const messageData = {
                room: `room_100_${activeChatUser.id}`,
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

    const friends = [
        { id: 1, name: 'Arjun', avatar: 'https://i.pravatar.cc/150?u=1', status: 'Watching Anime', isOnline: true },
        { id: 2, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2', status: 'In Lobby', isOnline: true },
        { id: 3, name: 'Dev', avatar: 'https://i.pravatar.cc/150?u=4', status: 'Watching Endgame', isOnline: false },
        { id: 4, name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=5', status: 'Browsing Catalog', isOnline: true },
        { id: 5, name: 'Rohan', avatar: 'https://i.pravatar.cc/150?u=6', status: 'Offline', isOnline: false },
    ];



    return (
        <div className="h-full w-full bg-black/80 backdrop-blur-xl border-l border-white/5 flex flex-col z-10 overflow-hidden relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gold/[0.04] blur-[120px] rounded-full pointer-events-none" />

            {/* Tab Navigation */}
            {activeTab !== 'chat' && (
                <div className="flex px-6 pt-8 shrink-0 relative z-10 gap-2">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all text-center rounded-xl ${activeTab === 'friends'
                            ? 'glass-pill-active shadow-xl'
                            : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        Network
                    </button>

                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all text-center rounded-xl ${activeTab === 'discover'
                            ? 'glass-pill-active shadow-xl'
                            : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        Discover
                    </button>
                </div>
            )}

            {/* Dynamic Subheader */}
            {activeTab !== 'chat' && (
                <div className="px-8 py-6 shrink-0 z-10">
                    <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        {activeTab === 'friends' ? (
                            <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" /> Online Connections ({friends.filter(f => f.isOnline).length})</>
                        ) : 'Find More Friends'}
                    </p>
                </div>
            )}

            {/* Content Area flex container */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-6 z-10">
                <AnimatePresence mode="wait">
                    {/* FRIENDS TAB CONTENT */}
                    {activeTab === 'friends' && (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                        >
                            {friends.map(friend => (
                                <div key={friend.id} className="flex items-center p-3.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 cursor-pointer transition-all duration-300 group hover:scale-[1.02] hover:shadow-xl">
                                    <div
                                        className="relative shrink-0 hover:scale-105 transition-transform cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/profile');
                                        }}
                                        title={`View ${friend.name}'s Profile`}
                                    >
                                        <img
                                            src={friend.avatar}
                                            alt={friend.name}
                                            className={`w-12 h-12 rounded-xl object-cover border border-white/10 shadow-lg ${!friend.isOnline ? 'grayscale opacity-50' : ''}`}
                                        />
                                        {friend.isOnline && (
                                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border border-[#050505] rounded-lg animate-pulse shadow-[0_0_8px_#22c55e]" />
                                        )}
                                    </div>

                                    <div
                                        className="ml-4 flex flex-col flex-1 cursor-pointer"
                                        onClick={() => joinChatSession(friend)}
                                        title={`Message ${friend.name}`}
                                    >
                                        <h4 className="text-[12px] font-black tracking-widest uppercase text-white group-hover:text-accent-gold transition-colors">{friend.name}</h4>
                                        <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-widest line-clamp-1">{friend.status}</p>
                                    </div>

                                    <button
                                        className="ml-auto text-gray-500 hover:text-white bg-white/5 hover:bg-accent-gold p-2.5 rounded-xl transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            joinChatSession(friend);
                                        }}
                                    >
                                        <MessageCircle size={16} strokeWidth={2} />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* DISCOVER TAB CONTENT */}
                    {activeTab === 'discover' && (
                        <motion.div
                            key="discover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={idInput}
                                        onChange={(e) => setIdInput(e.target.value)}
                                        placeholder="Enter Room ID..."
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-4 text-[11px] font-bold tracking-widest uppercase text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/40 focus:bg-white/5 transition-all shadow-inner"
                                    />
                                </div>
                                <button 
                                    onClick={() => {
                                        if (idInput.trim()) {
                                            toast.success(`Request sent to Room ID: ${idInput}`);
                                            setIdInput('');
                                        } else {
                                            toast.error("Enter Room ID first");
                                        }
                                    }}
                                    className="w-full glass-pill-active text-white text-[10px] font-black tracking-[0.3em] uppercase py-4 group hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all"
                                >
                                    Friend Request
                                </button>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <h4 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mb-6">
                                    Recommended Targets
                                </h4>
                                <div className="space-y-3">
                                    {suggestedFriends.map(user => (
                                        <div key={user.id} className="flex items-center p-3.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-all group hover:scale-[1.02] hover:shadow-xl cursor-pointer">
                                            <img src={user.avatar} className="w-10 h-10 rounded-xl border border-white/10 shrink-0" alt={user.name} />
                                            <div className="ml-4 flex flex-col">
                                                <h4 className="text-[11px] font-black text-white group-hover:text-white uppercase tracking-widest">{user.name}</h4>
                                                <p className="text-[8px] font-bold text-gray-600 mt-0.5 uppercase tracking-widest">Match Score</p>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    toast.success(`Request sent to ${user.name}`);
                                                    setSuggestedFriends(prev => prev.filter(f => f.id !== user.id));
                                                }}
                                                className="ml-auto text-[9px] font-black tracking-[0.2em] uppercase text-gray-400 hover:text-gray-900 bg-white/5 hover:bg-white px-4 py-2.5 rounded-xl transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* CHAT INTERFACE TAB */}
                    {activeTab === 'chat' && activeChatUser && (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col h-full pt-8"
                        >
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[1.5rem] border border-white/10 mb-6 shadow-2xl shrink-0 backdrop-blur-md">
                                <button
                                    onClick={() => setActiveTab('friends')}
                                    className="text-gray-500 hover:text-white transition-colors glass-card p-2 rounded-xl border-white/5"
                                    title="Back to Network"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
                                    <img src={activeChatUser.avatar} className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-md" />
                                    {activeChatUser.isOnline && (
                                        <span className="absolute -bottom-1 -right-0.5 w-3 h-3 bg-green-500 border border-[#050505] rounded-md shadow-[0_0_10px_#22c55e]" />
                                    )}
                                </div>
                                <div className="flex flex-col cursor-pointer" onClick={() => navigate('/profile')}>
                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-white leading-tight">{activeChatUser.name}</h4>
                                    <p className="text-[9px] text-accent-gold font-bold tracking-[0.2em] uppercase mt-1">{activeChatUser.status}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 py-2 px-2 flex flex-col relative z-10">
                                <div className="text-[9px] font-black tracking-[0.4em] text-center text-gray-700 uppercase mb-4 mt-2">
                                    Secure Transmission Line Open
                                </div>

                                {messages.map((msg, index) => {
                                    const isMe = msg.author === "Me";
                                    return (
                                        <div key={index} className={`flex gap-4 max-w-[90%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                            {!isMe && (
                                                <img src={activeChatUser.avatar} className="w-8 h-8 rounded-[0.8rem] shadow-lg shrink-0 border border-white/10 mt-auto" />
                                            )}
                                            <div className="flex flex-col">
                                                <div className={`${isMe ? 'bg-accent-gold/10 text-white border-accent-gold/30 rounded-br-sm' : 'bg-white/5 text-gray-300 border-white/10 rounded-bl-sm'} border backdrop-blur-md rounded-[1.2rem] px-5 py-3 text-[11px] font-bold tracking-wide shadow-2xl leading-relaxed break-words`}>
                                                    {msg.text}
                                                </div>
                                                <span className={`text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2 ${isMe ? 'text-right' : 'text-left'}`}>
                                                    {msg.time}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input Area */}
                            <div className="pt-6 border-t border-white/5 mt-4 shrink-0 relative bg-transparent z-10">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={currentMessage}
                                        onChange={(e) => setCurrentMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={`Log to ${activeChatUser.name}...`}
                                        className="w-full bg-black/60 border border-white/10 rounded-[1.5rem] pl-6 pr-14 py-4 text-[11px] font-bold uppercase tracking-widest text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/40 focus:bg-white/5 transition-all shadow-inner backdrop-blur-xl"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!currentMessage.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-accent-gold transition-all disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent cursor-pointer shadow-md"
                                    >
                                        <Send size={16} className="ml-0.5" />
                                    </button>
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
