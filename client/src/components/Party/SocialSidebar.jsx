import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Search, UserPlus, ArrowLeft, Send, Share2, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth, db } from '../../firebase';
import { collection, doc, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getFriendsList, getAllUsers, sendFriendRequest } from '../../services/firebase-services';

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
    let chatUnsubscribe = useRef(null);

    const fetchSocialData = async () => {
        try {
            setLoading(true);
            const user = auth.currentUser;
            if (!user) return;
            
            // Fetch Friends
            const friendsData = await getFriendsList();
            setFriends(friendsData.map(f => ({
                id: f.friendUid,
                name: f.name,
                avatar: f.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name)}&background=random`,
                status: f.isOnline ? 'Watching Live' : 'Offline',
                isOnline: f.isOnline || false
            })));
            
            // Fetch All Users for Suggestions
            const usersData = await getAllUsers();
            const friendIds = new Set(friendsData.map(f => f.friendUid));
            setSuggestedUsers(usersData.filter(u => !friendIds.has(u.id)).slice(0, 10));
        } catch (error) {
            // Silently ignore to prevent red error overlay
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

        return () => {
            unsubscribe();
            if (chatUnsubscribe.current) chatUnsubscribe.current();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const joinChatSession = (friend) => {
        setActiveChatUser(friend);
        setActiveTab('chat');
        setMessages([]);
        
        // Listen to Firestore chat collection
        const myUid = auth.currentUser?.uid;
        const friendUid = friend.id;
        const roomId = [myUid, friendUid].sort().join('_');
        
        if (chatUnsubscribe.current) chatUnsubscribe.current();
        
        const q = query(
            collection(db, 'chats', roomId, 'messages'),
            orderBy('timestamp', 'asc')
        );
        chatUnsubscribe.current = onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => ({
                ...d.data(),
                isMe: d.data().authorUid === myUid
            }));
            setMessages(msgs);
        }, (err) => {
            // Silently ignore onSnapshot permission errors
        });
    };

    const sendMessage = async () => {
        if (currentMessage.trim() !== "" && activeChatUser) {
            const myUid = auth.currentUser?.uid;
            const friendUid = activeChatUser.id;
            const roomId = [myUid, friendUid].sort().join('_');
            
            const messageData = {
                authorUid: myUid,
                author: "Me",
                text: currentMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date().toISOString(),
            };

            await addDoc(collection(db, 'chats', roomId, 'messages'), messageData);
            setCurrentMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleSendFriendRequest = async (targetUid, targetName) => {
        try {
            await sendFriendRequest(targetUid);
            toast.success(`Request sent to ${targetName}`);
            fetchSocialData();
        } catch (error) {
            toast.error(error.message || "Error sending friend request");
        }
    };

    const filteredFriends = friends.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full w-full bg-[#050505]/95 backdrop-blur-2xl border-l border-white/5 flex flex-col z-20 overflow-hidden relative shadow-[-40px_0_100px_rgba(0,0,0,0.9)]">
            
            {/* Background Theater Accents */}
            <div className="absolute top-0 right-[-10%] w-[120%] h-80 bg-accent-gold/[0.04] blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-80 bg-accent-gold/[0.02] blur-[150px] rounded-full pointer-events-none" />

            <div className="px-8 pt-12 shrink-0 relative z-20 space-y-10">
                <div className="flex items-end justify-between">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <h2 className="text-base font-semibold text-accent-gold flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-accent-gold rounded-full shadow-[0_0_15px_#FFD700]" />
                            Watching Together
                        </h2>
                        <p className="text-xs font-medium text-gray-500 ml-5">Social Hub: Active</p>
                    </motion.div>
                    <div className="glass-pill px-4 py-2 text-xs font-bold text-accent-gold border-accent-gold/20 flex items-center gap-2 shadow-sm bg-black/40 border backdrop-blur-xl">
                        <span className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
                        Party Live
                    </div>
                </div>

                <div className="space-y-5">
                    <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Party Link Copied");
                        }}
                        className="w-full flex items-center justify-between p-4 glass-card border-white/10 bg-black/40 transition-all group relative overflow-hidden rounded-3xl shadow-lg"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex flex-col items-start relative z-10">
                            <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">Invite More Friends</span>
                            <span className="text-xs font-medium text-gray-500 group-hover:text-accent-gold transition-colors mt-1">Send your party link</span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-accent-gold group-hover:text-black transition-all duration-300 shadow-md">
                            <Share2 size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                        </div>
                    </motion.button>

                    <div className="relative group">
                        <Search size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isSearching ? 'text-accent-gold scale-110' : 'text-gray-500'}`} />
                        <input
                            type="text"
                            value={searchQuery}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find connections..."
                            className="w-full bg-white/[0.02] border border-white/10 rounded-full pl-12 pr-6 py-3 text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold/40 focus:bg-white/[0.05] transition-all shadow-inner backdrop-blur-md"
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
                            className="flex flex-col items-center justify-center py-24 space-y-6"
                        >
                            <Loader2 className="animate-spin text-accent-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" size={40} strokeWidth={2.5} />
                            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/40 animate-pulse">Finding Friends...</span>
                        </motion.div>
                    ) : activeTab === 'friends' && (
                        <motion.div
                            key="friends"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-semibold text-accent-gold uppercase tracking-wider">Your Friends</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-accent-gold/20 to-transparent mx-4" />
                            </div>

                            {filteredFriends.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredFriends.map((friend, idx) => (
                                        <motion.div 
                                            key={friend.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.02)' }}
                                            className="flex items-center p-3 rounded-2xl bg-transparent border border-white/5 hover:border-accent-gold/20 cursor-pointer transition-all duration-300 group relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            
                                            <div className="relative shrink-0" onClick={(e) => { e.stopPropagation(); navigate('/profile'); }}>
                                                <div className="w-12 h-12 p-0.5 rounded-2xl border border-white/10 group-hover:border-accent-gold/40 transition-all duration-300 shadow-sm bg-white/[0.01]">
                                                    <img
                                                        src={friend.avatar}
                                                        alt={friend.name}
                                                        className={`w-full h-full rounded-[14px] object-cover ${!friend.isOnline ? 'grayscale opacity-50' : 'grayscale-0 opacity-100'} transition-all`}
                                                    />
                                                </div>
                                                {friend.isOnline && (
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#050505] rounded-full z-10" />
                                                )}
                                            </div>

                                            <div
                                                className="ml-4 flex flex-col flex-1 cursor-pointer relative z-10"
                                                onClick={() => joinChatSession(friend)}
                                            >
                                                <h4 className="text-sm font-semibold text-white/90 group-hover:text-accent-gold transition-colors">{friend.name}</h4>
                                                <p className={`text-xs font-medium mt-0.5 ${friend.isOnline ? 'text-accent-gold/80' : 'text-gray-500'}`}>{friend.status}</p>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                className="ml-auto w-10 h-10 flex items-center justify-center text-gray-500 hover:text-white bg-white/5 rounded-xl border border-white/5 transition-colors relative z-10"
                                                onClick={(e) => { e.stopPropagation(); joinChatSession(friend); }}
                                            >
                                                <MessageCircle size={16} />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <Users size={24} className="text-gray-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-gray-400">No Friends Yet</p>
                                        <p className="text-xs font-medium text-gray-600">Invite some friends to start watching together.</p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-10 space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested Friends</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-4" />
                                </div>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    {suggestedUsers.length > 0 ? suggestedUsers.map((user, idx) => (
                                        <motion.div 
                                            key={user.id} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                            className="flex items-center p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
                                        >
                                            <div className="relative shrink-0">
                                                <img 
                                                    src={user.avatar} 
                                                    className="w-10 h-10 rounded-xl border border-white/5 object-cover grayscale group-hover:grayscale-0 transition-all" 
                                                    alt={user.name} 
                                                />
                                            </div>
                                            <div className="ml-4 flex flex-col flex-1">
                                                <h4 className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors">{user.name}</h4>
                                                <p className="text-xs font-medium text-gray-600 mt-0.5">Suggested Friend</p>
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => handleSendFriendRequest(user.id, user.name)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white/50 hover:bg-white hover:text-black transition-colors"
                                            >
                                                <UserPlus size={14} />
                                            </motion.button>
                                        </motion.div>
                                    )) : (
                                        <div className="text-center py-6">
                                            <p className="text-[9px] font-black text-gray-800 uppercase tracking-[0.6em] italic">No more suggestions for now.</p>
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
                            <div className="flex items-center gap-4 bg-white/[0.04] p-4 rounded-3xl border border-white/10 mb-6 shadow-xl shrink-0 backdrop-blur-3xl relative overflow-hidden group">
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
                                <button
                                    onClick={() => { setActiveTab('friends'); if (chatUnsubscribe.current) chatUnsubscribe.current(); }}
                                    className="text-gray-500 hover:text-white transition-all glass-card p-2.5 rounded-xl border-white/10 hover:border-white/20 relative z-10 shadow-sm"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="relative cursor-pointer z-10 shrink-0" onClick={() => navigate('/profile')}>
                                    <img src={activeChatUser.avatar} className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-md group-hover:scale-105 transition-transform duration-300" />
                                    {activeChatUser.isOnline && (
                                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#0c0c0c] rounded-full shadow-[0_0_10px_#22c55e]" />
                                    )}
                                </div>
                                <div className="flex flex-col cursor-pointer z-10" onClick={() => navigate('/profile')}>
                                    <h4 className="text-base font-semibold text-white leading-tight">{activeChatUser.name}</h4>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                                        <p className="text-xs text-accent-gold font-medium uppercase tracking-wider">{activeChatUser.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 py-4 px-2 flex flex-col relative z-20">
                                <div className="flex items-center justify-center gap-4 mb-4 opacity-30">
                                    <div className="h-px w-12 bg-white" />
                                    <div className="text-xs font-semibold tracking-wider text-center text-white uppercase">Conversation Started</div>
                                    <div className="h-px w-12 bg-white" />
                                </div>

                                {messages.map((msg, index) => {
                                    const isMe = msg.isMe;
                                    return (
                                            <motion.div 
                                                key={index}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={`flex gap-3 max-w-[85%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                                            >
                                                {!isMe && (
                                                    <img src={activeChatUser.avatar} className="w-8 h-8 rounded-full shadow-sm shrink-0 border border-white/10 mt-auto" />
                                                )}
                                                <div className="flex flex-col">
                                                    <div className={`${isMe ? 'bg-accent-gold/15 text-white border-accent-gold/30 rounded-br-sm' : 'bg-white/5 text-gray-200 border-white/10 rounded-bl-sm'} border backdrop-blur-xl rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-lg relative`}>
                                                        {msg.text}
                                                    </div>
                                                    <span className={`text-[10px] font-medium text-gray-500 mt-1 px-2 ${isMe ? 'text-right' : 'text-left'}`}>
                                                        {msg.time}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="pt-4 border-t border-white/5 mt-4 shrink-0 relative bg-transparent z-10 px-2 pb-2">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={currentMessage}
                                            onChange={(e) => setCurrentMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder={`Message ${activeChatUser.name.split(' ')[0]}...`}
                                            className="w-full bg-[#080808]/90 border border-white/10 rounded-2xl pl-5 pr-14 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/40 focus:bg-black transition-all shadow-inner backdrop-blur-md"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={sendMessage}
                                            disabled={!currentMessage.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center bg-accent-gold text-black shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer border-none"
                                        >
                                            <Send size={16} className="ml-0.5" />
                                        </motion.button>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-2 opacity-50">
                                        <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-ping" />
                                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Secure Chat Enabled</span>
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
