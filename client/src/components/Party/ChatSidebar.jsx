import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Send } from 'lucide-react';

const ChatSidebar = ({ roomId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!roomId) return;

        const q = query(
            collection(db, 'messages'),
            where('roomId', '==', String(roomId)),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedMessages = [];
            querySnapshot.forEach((doc) => {
                fetchedMessages.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setMessages(fetchedMessages);
        }, (error) => {
            // Silently ignore to prevent red error overlay
        });

        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                roomId: String(roomId),
                senderName: currentUser?.name || 'Anonymous',
                senderId: currentUser?.uid || 'unknown',
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error writing new message to Firebase: ", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/80 backdrop-blur-xl border-l border-white/5 w-full lg:w-96 shadow-[0_0_50px_rgba(0,0,0,1)] z-20 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/[0.03] blur-[100px] rounded-full pointer-events-none" />

            {/* Minimal Header */}
            <div className="px-6 py-5 border-b border-white/5 shrink-0 bg-white/[0.02] flex items-center justify-between z-10">
                <div className="space-y-1">
                    <h3 className="text-[10px] font-black tracking-[0.4em] text-white uppercase flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                        Live Comms
                    </h3>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Screen: {roomId}</p>
                </div>
            </div>

            {/* Scrollable Chat History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth hide-scrollbar relative z-10">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                        <div className="w-12 h-12 glass-card flex items-center justify-center rounded-2xl border-white/5 disabled">
                            <Send size={16} className="text-gray-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Channel Empty</p>
                            <p className="text-[8px] font-bold text-gray-600 mt-1 uppercase tracking-widest leading-relaxed">Initiate transmission.</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUser?.uid;

                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {!isMe && (
                                    <span className="text-[8px] font-black text-gray-500 mb-2 ml-2 uppercase tracking-[0.2em]">
                                        {msg.senderName}
                                    </span>
                                )}

                                <div
                                    className={`
                                        px-5 py-3 max-w-[85%] text-[11px] font-bold tracking-wide rounded-2xl leading-relaxed shadow-2xl backdrop-blur-md border
                                        ${isMe
                                            ? 'bg-accent-gold/10 text-white rounded-br-sm border-accent-gold/20' 
                                            : 'bg-white/5 text-gray-300 rounded-bl-sm border-white/5' 
                                        }
                                    `}
                                    style={{ wordBreak: 'break-word' }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Area */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] shrink-0 z-10">
                <form
                    onSubmit={handleSendMessage}
                    className="relative flex items-center group"
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); 
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Send..."
                        className="w-full bg-black/40 border border-white/10 rounded-full pl-6 pr-14 py-4 text-[11px] font-bold text-white placeholder-gray-600 focus:outline-none focus:border-accent-gold/40 focus:bg-white/5 transition-all shadow-inner uppercase tracking-widest"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-accent-gold hover:bg-white/5 transition-all disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent cursor-pointer"
                        title="Send"
                    >
                        <Send size={16} className="ml-0.5" />
                    </button>
                </form>
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

export default ChatSidebar;
