import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Search, UserPlus, ArrowLeft, Send, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { toast } from 'react-hot-toast';

const socket = io.connect('http://localhost:5000');

const SocialSidebar = () => {
    const [activeTab, setActiveTab] = useState('friends');
    const [idInput, setIdInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [activeChatUser, setActiveChatUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [suggestedFriends] = useState([
        { id: 101, name: 'Elena', avatar: 'https://i.pravatar.cc/150?u=10' },
        { id: 102, name: 'Marcus', avatar: 'https://i.pravatar.cc/150?u=12' },
        { id: 103, name: 'Sophia', avatar: 'https://i.pravatar.cc/150?u=11' },
    ]);
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

                <div className="px-6 pt-8 shrink-0 relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h2 className="text-[13px] font-black uppercase tracking-[0.4em] text-white">Socials</h2>
                            <p className="text-[7px] font-black text-gray-700 uppercase tracking-widest">Connect & Watch</p>
                        </div>
                        <div className="glass-pill px-4 py-1.5 text-[8px] font-black text-green-500 border-green-500/20 uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)] bg-white/[0.01]">
                            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                            Live
                        </div>
                    </div>

                    {/* Networking Interface */}
                    <div className="space-y-3">
                        <motion.button 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success("Invite Link Copied");
                            }}
                            className="w-full flex items-center justify-between p-4 glass-card border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/80 group-hover:text-white transition-colors">Invite Link</span>
                                <span className="text-[7px] font-black text-gray-700 uppercase tracking-widest group-hover:text-accent-gold/50 transition-colors">Click to copy</span>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:border-accent-gold/20 border border-white/5 transition-all">
                                <Share2 size={14} className="text-gray-600 group-hover:text-accent-gold transition-colors" />
                            </div>
                        </motion.button>

                        <div className="relative group">
                            <Search size={12} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-accent-gold' : 'text-gray-700'}`} />
                            <input
                                type="text"
                                value={idInput}
                                onFocus={() => setIsSearching(true)}
                                onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                                onChange={(e) => setIdInput(e.target.value)}
                                placeholder="Find connections..."
                                className="w-full bg-white/[0.01] border border-white/5 rounded-xl pl-10 pr-10 py-3 text-[9px] font-bold tracking-[0.15em] uppercase text-white placeholder-gray-800 focus:outline-none focus:border-white/10 focus:bg-white/[0.02] transition-all shadow-inner"
                            />
                            {idInput && (
                                <button 
                                    onClick={() => {
                                        toast.success(`Request sent to: ${idInput}`);
                                        setIdInput('');
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-accent-gold hover:text-white transition-all"
                                >
                                    <UserPlus size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>



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
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between px-2 pb-2">
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Active Now</span>
                                <div className="h-[1px] flex-1 bg-white/5 mx-4" />
                            </div>

                            {friends.map(friend => (
                                <motion.div 
                                    key={friend.id} 
                                    whileHover={{ x: 4 }}
                                    className="flex items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] cursor-pointer transition-all duration-500 group"
                                >
                                    <div
                                        className="relative shrink-0 transition-transform cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate('/profile');
                                        }}
                                        title={`View ${friend.name}'s Profile`}
                                    >
                                        <div className="w-11 h-11 p-0.5 rounded-xl glass-card border-white/10 group-hover:border-accent-gold/30 transition-colors">
                                            <img
                                                src={friend.avatar}
                                                alt={friend.name}
                                                className={`w-full h-full rounded-[0.5rem] object-cover ${!friend.isOnline ? 'grayscale opacity-30' : 'grayscale-0 opacity-100'} transition-all duration-700`}
                                            />
                                        </div>
                                        {friend.isOnline && (
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#0c0c0c] rounded-full shadow-[0_0_8px_#22c55e]" />
                                        )}
                                    </div>

                                    <div
                                        className="ml-4 flex flex-col flex-1 cursor-pointer"
                                        onClick={() => joinChatSession(friend)}
                                    >
                                        <h4 className="text-[12px] font-black tracking-tight text-white/90 group-hover:text-white transition-colors">{friend.name}</h4>
                                        <p className="text-[8px] font-black text-gray-700 mt-0.5 uppercase tracking-widest line-clamp-1 group-hover:text-gray-500 transition-colors">{friend.status}</p>
                                    </div>

                                    <button
                                        className="ml-auto w-8 h-8 flex items-center justify-center text-gray-700 hover:text-white bg-white/5 hover:bg-white/[0.05] rounded-lg transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            joinChatSession(friend);
                                        }}
                                    >
                                        <MessageCircle size={14} strokeWidth={2.5} />
                                    </button>
                                </motion.div>
                            ))}

                            <div className="pt-10 space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Connect More</span>
                                    <div className="h-[1px] flex-1 bg-white/5 mx-4" />
                                </div>
                                
                                <div className="space-y-3">
                                    {suggestedFriends.map(user => (
                                        <div key={user.id} className="flex items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.01] transition-all group cursor-pointer relative overflow-hidden">
                                            <img src={user.avatar} className="w-8 h-8 rounded-lg border border-white/5 shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700" alt={user.name} />
                                            <div className="ml-3 flex flex-col">
                                                <h4 className="text-[10px] font-black text-white/50 group-hover:text-white uppercase tracking-widest transition-colors">{user.name}</h4>
                                                <p className="text-[7px] font-black text-gray-800 mt-0.5 uppercase tracking-widest">Connect</p>
                                            </div>
                                            <button 
                                                onClick={() => toast.success(`Request sent to ${user.name}`)}
                                                className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white hover:text-black transition-all"
                                            >
                                                <UserPlus size={12} />
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
                                    title="Back to Socials"
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
