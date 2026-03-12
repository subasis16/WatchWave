import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Search, UserPlus, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

const SocialSidebar = () => {
    const [activeTab, setActiveTab] = useState('friends');
    const [idInput, setIdInput] = useState('');
    const [activeChatUser, setActiveChatUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for incoming messages from Socket.io server
        socket.on("receive_message", (data) => {
            setMessages((prevList) => [...prevList, data]);
        });

        // Cleanup listener on unmount
        return () => {
            socket.off("receive_message");
        };
    }, []);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const joinChatSession = (friend) => {
        setActiveChatUser(friend);
        setActiveTab('chat');
        // Clear previous messages when opening a new chat for demo purposes
        setMessages([]);

        // Define a unique room string combining IDs (Mocking 'myId_friendId' for now)
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

    // 4. The 'Friends' View - 5 Mock Friends
    const friends = [
        { id: 1, name: 'Arjun', avatar: 'https://i.pravatar.cc/150?u=1', status: 'Watching Anime', isOnline: true },
        { id: 2, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2', status: 'In Lobby', isOnline: true },
        { id: 3, name: 'Dev', avatar: 'https://i.pravatar.cc/150?u=4', status: 'Watching Endgame', isOnline: false },
        { id: 4, name: 'Priya', avatar: 'https://i.pravatar.cc/150?u=5', status: 'Browsing Catalog', isOnline: true },
        { id: 5, name: 'Rohan', avatar: 'https://i.pravatar.cc/150?u=6', status: 'Offline', isOnline: false },
    ];

    const suggestedFriends = [
        { id: 101, name: 'Elena', avatar: 'https://i.pravatar.cc/150?u=10' },
        { id: 102, name: 'Marcus', avatar: 'https://i.pravatar.cc/150?u=12' },
        { id: 103, name: 'Sophia', avatar: 'https://i.pravatar.cc/150?u=11' },
    ];

    return (
        <div className="h-full w-full bg-[#0B0C10]/80 backdrop-blur-md border-l border-white/5 flex flex-col z-10 overflow-hidden">

            {/* 3. The Tab Navigation (Top Header) - Hide if in Chat mode */}
            {activeTab !== 'chat' && (
                <div className="flex px-6 pt-6 shrink-0">
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`flex-1 py-4 text-xs font-bold tracking-widest transition-all text-center ${activeTab === 'friends'
                            ? 'text-white border-b-2 border-red-600 shadow-[0_4px_15px_-3px_rgba(229,9,20,0.5)]'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        FRIENDS
                    </button>

                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`flex-1 py-4 text-xs font-bold tracking-widest transition-all text-center ${activeTab === 'discover'
                            ? 'text-white border-b-2 border-red-600 shadow-[0_4px_15px_-3px_rgba(229,9,20,0.5)]'
                            : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        DISCOVER
                    </button>
                </div>
            )}

            {/* Dynamic Subheader */}
            {activeTab !== 'chat' && (
                <div className="px-6 py-4 shrink-0">
                    <p className="text-gray-400 text-sm font-medium">
                        {activeTab === 'friends' ? `Online (${friends.filter(f => f.isOnline).length})` : 'Find new friends'}
                    </p>
                </div>
            )}

            {/* Content Area flex container */}
            <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-6">
                <AnimatePresence mode="wait">

                    {/* FRIENDS TAB CONTENT */}
                    {activeTab === 'friends' && (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2"
                        >
                            {friends.map(friend => (
                                <div key={friend.id} className="flex items-center p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                                    {/* Link to Profile Zone */}
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
                                            className={`w-10 h-10 rounded-full object-cover border border-white/10 ${!friend.isOnline ? 'grayscale opacity-50' : ''}`}
                                        />
                                        {friend.isOnline && (
                                            <span className="absolute bottom-0 right-[-2px] w-3 h-3 bg-green-500 border-2 border-[#0B0C10] rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                        )}
                                    </div>

                                    {/* Link to Chat Zone (Clicking Name/Status) */}
                                    <div
                                        className="ml-4 flex flex-col flex-1 cursor-pointer"
                                        onClick={() => joinChatSession(friend)}
                                        title={`Message ${friend.name}`}
                                    >
                                        <h4 className="text-sm font-bold text-white group-hover:text-red-100 transition-colors">{friend.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-400 transition-colors">{friend.status}</p>
                                    </div>

                                    {/* Message Action Icon */}
                                    <button
                                        className="ml-auto text-red-500 hover:text-red-400 p-2 cursor-pointer transition-colors hover:scale-110"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            joinChatSession(friend);
                                        }}
                                    >
                                        <MessageCircle size={20} strokeWidth={1.5} />
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
                            className="space-y-6"
                        >
                            {/* Search Input Area */}
                            <div className="px-2">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        value={idInput}
                                        onChange={(e) => setIdInput(e.target.value)}
                                        placeholder="Enter Friend ID#"
                                        className="w-full bg-white/5 text-white placeholder-gray-500 text-sm pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E50914] transition-all border border-transparent hover:border-white/10"
                                    />
                                </div>
                                <button className="mt-3 w-full bg-[#E50914] hover:bg-red-700 text-white text-sm font-bold py-3 rounded-md transition-colors shadow-[0_0_10px_rgba(229,9,20,0.3)] hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                                    Send Request
                                </button>
                            </div>

                            {/* Suggested Friends */}
                            <div className="pt-4 border-t border-white/5">
                                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
                                    Suggested to Follow
                                </h4>
                                <div className="space-y-2">
                                    {suggestedFriends.map(user => (
                                        <div key={user.id} className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                            <img src={user.avatar} className="w-10 h-10 rounded-full border border-white/10 shrink-0" alt={user.name} />
                                            <div className="ml-4 flex flex-col">
                                                <h4 className="text-sm font-bold text-white group-hover:text-red-100 transition-colors">{user.name}</h4>
                                                <p className="text-[10px] text-gray-500 mt-0.5">Suggested Account</p>
                                            </div>
                                            {/* Add + Button substituted for the chat bubble */}
                                            <button className="ml-auto text-xs font-bold text-gray-300 hover:text-white bg-white/10 hover:bg-[#E50914] px-3 py-1.5 rounded-md transition-all flex items-center justify-center gap-1 group-hover:shadow-[0_0_10px_rgba(229,9,20,0.4)]">
                                                <UserPlus size={14} /> Add
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
                            className="flex flex-col h-full pt-6"
                        >
                            {/* Chat Header */}
                            <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 mb-4 shadow-lg shrink-0">
                                <button
                                    onClick={() => setActiveTab('friends')}
                                    className="text-gray-400 hover:text-white transition-colors p-1"
                                    title="Back to Friends"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="relative cursor-pointer" onClick={() => navigate('/profile')}>
                                    <img src={activeChatUser.avatar} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                                    {activeChatUser.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-[#0B0C10] rounded-full" />
                                    )}
                                </div>
                                <div className="flex flex-col cursor-pointer" onClick={() => navigate('/profile')}>
                                    <h4 className="text-sm font-bold text-white leading-tight">{activeChatUser.name}</h4>
                                    <p className="text-[10px] text-[#E50914] font-medium tracking-wide uppercase">{activeChatUser.status}</p>
                                </div>
                            </div>

                            {/* Chat Messages Area */}
                            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 py-2 px-2 flex flex-col">
                                <div className="text-[10px] font-bold tracking-widest text-center text-gray-600 uppercase mb-4 mt-2">Today Chat Started</div>

                                {/* Mapping Real-Time Socket.io messages */}
                                {messages.map((msg, index) => {
                                    const isMe = msg.author === "Me";
                                    return (
                                        <div key={index} className={`flex gap-3 max-w-[90%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                            {!isMe && (
                                                <img src={activeChatUser.avatar} className="w-8 h-8 rounded-full shadow-md shrink-0 border border-white/10" />
                                            )}
                                            <div className="flex flex-col">
                                                <div className={`${isMe ? 'bg-[#E50914] text-white rounded-2xl rounded-tr-sm' : 'bg-[#1C1D21] text-gray-200 border border-white/5 rounded-2xl rounded-tl-sm'} px-4 py-2.5 text-sm shadow-sm leading-relaxed max-w-[200px] break-words`}>
                                                    {msg.text}
                                                </div>
                                                <span className={`text-[9px] text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                    {msg.time}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input Area */}
                            <div className="pt-4 border-t border-white/5 mt-2 shrink-0 relative">
                                <input
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={`Message ${activeChatUser.name}...`}
                                    className="w-full bg-[#1C1D21] text-white placeholder-gray-500 text-sm pl-4 pr-12 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#E50914]/50 transition-all shadow-inner"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-red hover:text-red-400 p-2 transition-colors cursor-pointer"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Custom Scrollbar CSS hiding */}
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
