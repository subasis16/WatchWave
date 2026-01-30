import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Smile, MessageSquare, Users,
  Heart, ThumbsUp, Laugh, Flame, Play,
  Pause, Volume2, Settings, Maximize, Mic, MicOff,
  Video, VideoOff, PhoneOff, Share2, Frown, Coffee, Zap, Skull, Info
} from 'lucide-react';
import { movies, series, anime } from '../data/content';

const WatchRoom = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Arjun', text: 'Waiting for the stream to start! 🔥', avatar: 'https://i.pravatar.cc/150?u=1', time: '10:02' },
    { id: 2, user: 'Sarah', text: 'Any suggestions?', avatar: 'https://i.pravatar.cc/150?u=2', time: '10:03' },
    { id: 3, user: 'You', text: 'Lets checks the mood vibes.', avatar: 'https://i.pravatar.cc/150?u=3', time: '10:05', isMe: true },
  ]);
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const chatEndRef = useRef(null);

  // Mood / Content State
  const [currentMood, setCurrentMood] = useState(null);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);

  const participants = [
    { id: 1, name: 'You', avatar: 'https://i.pravatar.cc/150?u=3', isMuted: false, isVideoOff: false },
    { id: 2, name: 'Arjun', avatar: 'https://i.pravatar.cc/150?u=1', isMuted: true, isVideoOff: false },
    { id: 3, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2', isMuted: false, isVideoOff: true },
    { id: 4, name: 'Dev', avatar: 'https://i.pravatar.cc/150?u=4', isMuted: false, isVideoOff: false },
  ];

  const reactions = [
    { icon: Heart, color: 'text-red-500', id: 'heart' },
    { icon: ThumbsUp, color: 'text-blue-500', id: 'thumbsup' },
    { icon: Laugh, color: 'text-yellow-400', id: 'laugh' },
    { icon: Flame, color: 'text-orange-500', id: 'fire' },
  ];

  const moods = [
    {
      id: 'happy',
      name: 'Happy',
      icon: Smile,
      color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      description: 'Feel-good vibes',
      keywords: ['Spider-Man', 'One Piece', 'Naruto', 'Loki']
    },
    {
      id: 'sad',
      name: 'Sad',
      icon: Frown,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      description: 'Emotional hits',
      keywords: ['Interstellar', 'The Last of Us', 'Violet', 'Silent']
    },
    {
      id: 'relaxed',
      name: 'Relaxed',
      icon: Coffee,
      color: 'bg-gradient-to-br from-green-400 to-emerald-600',
      description: 'Chill mode',
      keywords: ['Wednesday', 'Harry Potter', 'Friends', 'Office']
    },
    {
      id: 'excited',
      name: 'Excited',
      icon: Zap,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      description: 'Hype Action',
      keywords: ['Avengers', 'Jujutsu', 'Demon Slayer', 'Titan', 'Solo Leveling', 'The Boys', 'Fight Club']
    },
    {
      id: 'romantic',
      name: 'Romantic',
      icon: Heart,
      color: 'bg-gradient-to-br from-red-400 to-rose-600',
      description: 'Love stories',
      keywords: ['Titanic', 'Notebook', 'La La Land', 'Your Name']
    },
    {
      id: 'thriller',
      name: 'Thriller',
      icon: Skull,
      color: 'bg-gradient-to-br from-gray-700 to-black',
      description: 'Suspense',
      keywords: ['Dark Knight', 'Breaking Bad', 'Death Note', 'Squid Game', 'Batman', 'Oppenheimer', 'Matrix']
    },
  ];

  const allContent = [...movies, ...series, ...anime];

  const getRecommendations = (mood) => {
    if (!mood) return [];
    let results = allContent.filter(item =>
      mood.keywords.some(k => item.title.toLowerCase().includes(k.toLowerCase()))
    );
    if (results.length < 5) {
      const remaining = allContent
        .filter(item => !results.includes(item))
        .sort(() => 0.5 - Math.random());
      results = [...results, ...remaining.slice(0, 5 - results.length)];
    }
    return results;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      user: 'You',
      text: input,
      avatar: 'https://i.pravatar.cc/150?u=3',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    }]);
    setInput('');
  };

  const triggerReaction = (ReactionIcon, color) => {
    const newReaction = {
      id: Date.now(),
      icon: ReactionIcon,
      color: color,
      x: Math.random() * 80 + 10,
    };
    setFloatingReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const recommendations = currentMood ? getRecommendations(currentMood) : [];

  const handleContentSelect = (item) => {
    setSelectedContent(item);
    setShowMoodSelector(false); // Close mood selector
    setIsPlaying(true);
    // Announce in chat
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: 'System',
      text: `Now playing: ${item.title}`,
      avatar: 'https://i.pravatar.cc/150?u=0',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false
    }]);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white pt-20 overflow-hidden flex flex-col h-screen">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

        {/* Main Content - Video Player */}
        <div className="flex-1 flex flex-col bg-black relative">

          {/* Mood Selector Overlay */}
          <AnimatePresence>
            {showMoodSelector && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 overflow-y-auto"
              >
                {!currentMood ? (
                  <div className="text-center w-full max-w-5xl">
                    <motion.h2
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-3xl md:text-4xl font-bold mb-8"
                    >
                      Set the Room Vibe
                    </motion.h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {moods.map((mood, idx) => (
                        <motion.button
                          key={mood.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentMood(mood)}
                          className={`group relative overflow-hidden rounded-xl p-6 h-32 flex flex-col justify-between items-center text-center transition-all ${mood.color}`}
                        >
                          <div className="bg-white/20 p-2 rounded-full text-white">
                            <mood.icon size={24} />
                          </div>
                          <span className="font-bold text-white text-lg">{mood.name}</span>
                        </motion.button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowMoodSelector(false)}
                      className="mt-12 text-gray-500 hover:text-white underline text-sm"
                    >
                      Skip & Just Hangout
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-6xl">
                    <button
                      onClick={() => setCurrentMood(null)}
                      className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
                    >
                      ← Back to vibes
                    </button>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      Top picks for <span className={`${currentMood.color} text-transparent bg-clip-text`}>{currentMood.name}</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {recommendations.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group relative cursor-pointer"
                          onClick={() => handleContentSelect(item)}
                        >
                          <div className="aspect-[2/3] rounded-xl overflow-hidden relative">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="bg-brand-red rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                                <Play size={24} fill="white" />
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur text-xs font-bold text-green-400 px-2 py-0.5 rounded">
                              {item.match}% Match
                            </div>
                          </div>
                          <h3 className="mt-2 text-sm font-bold text-gray-200 group-hover:text-white truncate">{item.title}</h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Regular Video Player Interface */}

          {/* Header Overlay */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-center pointer-events-none">
            <div className="pointer-events-auto">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-brand-red">Watching:</span> {selectedContent ? selectedContent.title : 'Nothing Playing'}
              </h2>
              <p className="text-gray-400 text-xs">
                {selectedContent ? '00:00:00 / 02:14:00' : '--:-- / --:--'}
              </p>
            </div>
            <div className="flex -space-x-2 pointer-events-auto">
              {participants.map((p) => (
                <div key={p.id} className="relative group">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className={`w-10 h-10 rounded-full border-2 border-deep-black ${!p.isVideoOff ? 'opacity-100' : 'opacity-50 grayscale'}`}
                  />
                  <div className="absolute bottom-0 right-0 p-0.5 bg-black rounded-full">
                    {p.isMuted ? <MicOff size={10} className="text-red-500" /> : <Mic size={10} className="text-green-500" />}
                  </div>
                </div>
              ))}
              <button className="w-10 h-10 rounded-full bg-rich-gray border-2 border-deep-black flex items-center justify-center text-xs font-bold hover:bg-gray-700 transition">
                +2
              </button>
            </div>
          </div>

          {/* Video Placeholder */}
          <div className="flex-1 relative flex items-center justify-center bg-gray-900 group">
            {selectedContent ? (
              <>
                <img
                  src={selectedContent.image.replace('w500', 'original')}
                  alt="Video Feed"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="z-10 bg-white/10 backdrop-blur-sm p-6 rounded-full cursor-pointer hover:bg-white/20 transition-all border border-white/20 shadow-2xl"
                >
                  {isPlaying ? <Pause size={48} fill="white" /> : <Play size={48} fill="white" className="ml-2" />}
                </motion.div>
              </>
            ) : (
              <div className="text-center z-10">
                <div className="bg-gray-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-gray-400 mb-4">No content selected</p>
                  <button
                    onClick={() => setShowMoodSelector(true)}
                    className="bg-brand-red px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    Pick a Movie
                  </button>
                </div>
              </div>
            )}

            {/* Floating Reactions */}
            <div className="absolute inset-x-0 bottom-20 z-20 pointer-events-none h-64 overflow-hidden">
              <AnimatePresence>
                {floatingReactions.map(reaction => (
                  <motion.div
                    key={reaction.id}
                    initial={{ y: 0, opacity: 1, scale: 0.5 }}
                    animate={{ y: -300, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className={`absolute ${reaction.color}`}
                    style={{ left: `${reaction.x}%` }}
                  >
                    <reaction.icon size={48} fill="currentColor" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Video Controls Bottom Bar */}
          <div className="p-4 bg-gradient-to-t from-zinc-900 to-zinc-900/0 z-20">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-700 rounded-full mb-4 cursor-pointer group">
              <div className="h-full bg-brand-red w-[28%] relative rounded-full">
                <div className="absolute right-0 -top-1.5 w-4 h-4 bg-brand-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
              </div>
            </div>

            <div className="flex justify-between items-center text-gray-200">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-white">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button className="hover:text-white flex items-center gap-2 group">
                  <Volume2 size={24} />
                  <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300">
                    <div className="h-1 bg-gray-500 rounded-full w-full ml-2">
                      <div className="h-full bg-white w-2/3" />
                    </div>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                {/* Reaction Dock */}
                <div className="flex items-center bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 gap-2 border border-white/10">
                  {reactions.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => triggerReaction(r.icon, r.color)}
                      className="p-2 hover:bg-white/10 rounded-full transition active:scale-90"
                    >
                      <r.icon size={20} className={r.color} />
                    </button>
                  ))}
                </div>

                <div className="h-6 w-px bg-white/20 mx-2" />

                {/* Mood Switcher Trigger */}
                <button
                  onClick={() => { setShowMoodSelector(true); setCurrentMood(null); }}
                  className="p-2 hover:bg-white/10 rounded-full text-brand-red hover:text-white transition"
                  title="Change Vibe"
                >
                  <Smile size={20} />
                </button>

                <button className="hover:text-white p-2 rounded-full hover:bg-white/10">
                  <Mic size={20} />
                </button>
                <button className="text-red-500 hover:text-red-400 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20">
                  <PhoneOff size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Chat & Participants */}
        <div className="w-full lg:w-96 bg-rich-gray/50 backdrop-blur-3xl border-l border-white/5 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <MessageSquare size={16} />
              <span>Live Chat</span>
            </div>
            <button className="text-brand-red text-xs hover:underline flex items-center gap-1">
              <Share2 size={12} /> Invite
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                <img src={msg.avatar} className="w-8 h-8 rounded-full flex-shrink-0" alt={msg.user} />
                <div className={`max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`flex items-baseline gap-2 mb-1 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-bold text-gray-300">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.isMe
                      ? 'bg-brand-red/90 text-white rounded-tr-none'
                      : 'bg-white/10 text-gray-200 rounded-tl-none'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-black/20">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say something..."
                className="w-full bg-black/40 text-white border border-white/10 rounded-full py-3 px-4 pr-12 text-sm focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 placeholder:text-gray-600"
              />
              <button
                type="submit"
                className={`absolute right-1.5 top-1.5 p-1.5 rounded-full transition-all ${input.trim()
                    ? 'bg-brand-red text-white'
                    : 'bg-transparent text-gray-500'
                  }`}
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchRoom;
