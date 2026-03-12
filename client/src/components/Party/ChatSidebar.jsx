import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Send } from 'lucide-react';

const ChatSidebar = ({ roomId, currentUser }) => {
    // State to hold the array of message objects from Firestore
    const [messages, setMessages] = useState([]);
    // State to hold the current draft of a new message
    const [newMessage, setNewMessage] = useState('');

    // Reference to the bottom of the chat container to auto-scroll when a new message arrives
    const messagesEndRef = useRef(null);

    // Auto-scroll function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // --- Firebase Real-time Data Flow Listener ---
    useEffect(() => {
        if (!roomId) return;

        // 1. Create a query against the "messages" collection.
        // We filter by the specific 'roomId' and order by 'createdAt' to ensure temporal accuracy.
        console.log("Current Room ID:", roomId);
        const q = query(
            collection(db, 'messages'),
            where('roomId', '==', String(roomId)),
            orderBy('createdAt', 'asc')
        );

        // 2. Attach an onSnapshot listener which instantly pushes database updates to our local state.
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
            console.error("Error fetching real-time messages: ", error);
        });

        // 3. Return the unsubscribe function to prevent memory leaks when the component unmounts.
        return () => unsubscribe();
    }, [roomId]);

    // Trigger auto-scroll whenever the messages array updates
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- Send Message Handler ---
    const handleSendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Prevent sending empty messages
        if (!newMessage.trim()) return;

        try {
            // Push the new message document to the top-level "messages" collection
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                roomId: String(roomId),
                senderName: currentUser?.name || 'Anonymous',
                senderId: currentUser?.uid || 'unknown',
                createdAt: serverTimestamp() // Let Firestore handle the exact unified timestamp
            });

            // Clear out the input field immediately after the promise resolves
            setNewMessage('');
        } catch (error) {
            console.error("Error writing new message to Firebase: ", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1A1A1A] border-l border-neutral-800 w-full lg:w-96 shadow-2xl z-20">
            {/* Minimal Header */}
            <div className="px-5 py-4 border-b border-neutral-800 shrink-0 bg-black/20">
                <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Room Chat
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Room ID: {roomId}</p>
            </div>

            {/* Scrollable Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth hide-scrollbar bg-[#1A1A1A]">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <p className="text-gray-400 text-sm">No messages yet.</p>
                        <p className="text-xs text-gray-500 mt-1">Be the first to say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUser?.uid;

                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {/* Display Sender Name for incoming messages */}
                                {!isMe && (
                                    <span className="text-xs text-gray-400 mb-1 ml-1 font-medium">
                                        {msg.senderName}
                                    </span>
                                )}

                                {/* The Message Bubble */}
                                <div
                                    className={`
                                        px-4 py-2.5 max-w-[85%] text-sm rounded-2xl leading-relaxed shadow-sm
                                        ${isMe
                                            ? 'bg-[#E50914] text-white rounded-br-sm' // Current User 
                                            : 'bg-neutral-700 text-white rounded-bl-sm' // Other User
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
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Area */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-900 shrink-0">
                <form
                    onSubmit={handleSendMessage}
                    className="relative flex items-center"
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevent default new-line behavior
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Type your message..."
                        className="w-full bg-neutral-800 border border-transparent rounded-full pl-5 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-1.5 p-2 rounded-full text-neutral-400 hover:text-[#E50914] transition-colors disabled:opacity-50 disabled:hover:text-neutral-400 cursor-pointer"
                        title="Send Message"
                    >
                        <Send size={18} />
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
