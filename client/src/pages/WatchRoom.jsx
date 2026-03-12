import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Users, Play, Pause, Volume2, Settings, Mic, MicOff,
  Share2, Maximize, Subtitles, X, Copy, UserPlus, LogOut,
  Edit2, Lock, UserX, Clock, Flag, Star, Smile, Heart, ThumbsUp, Laugh, Flame, Frown, Coffee, Zap, Skull, Info, PhoneOff, MessageSquare
} from 'lucide-react';
import { movies, series, anime } from '../data/content';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = 'http://localhost:5000';

/* ====================================================
   SHARE MODAL COMPONENT
   ==================================================== */
const ShareModal = ({ isOpen, onClose }) => {
  const [showInvites, setShowInvites] = useState(false);

  const mockFriends = [
    { id: 1, name: 'Elena Rogers', avatar: 'https://i.pravatar.cc/150?u=11' },
    { id: 2, name: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?u=12' },
    { id: 3, name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=13' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Room link copied to clipboard!", { style: { background: '#141414', color: '#fff' } });
    onClose();
  };

  const handleInvite = (name) => {
    console.log(`Invite sent to ${name}`);
    toast.success(`Invite sent to ${name}`, { icon: '✉️', style: { background: '#141414', color: '#fff' } });
  };

  useEffect(() => {
    if (!isOpen) setShowInvites(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-sm bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {!showInvites ? (
          <div className="flex flex-col gap-4 mt-2">
            <h3 className="text-xl font-bold text-white mb-2 text-center">Share this Room</h3>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
            >
              <Copy size={18} /> Copy Link
            </button>
            <button
              onClick={() => setShowInvites(true)}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-[#E50914] hover:bg-red-700 text-white font-bold transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)]"
            >
              <UserPlus size={18} /> Invite Friend
            </button>
          </div>
        ) : (
          <div className="flex flex-col mt-2">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setShowInvites(false)} className="text-gray-400 hover:text-white transition-colors">
                ←
              </button>
              <h3 className="text-xl font-bold text-white">Invite Friends</h3>
            </div>
            
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {mockFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-bold text-gray-200">{friend.name}</span>
                  </div>
                  <button
                    onClick={() => handleInvite(friend.name)}
                    className="px-4 py-1.5 rounded-full bg-[#E50914]/20 text-[#E50914] text-xs font-bold border border-[#E50914]/30 hover:bg-[#E50914] hover:text-white transition-all"
                  >
                    Invite
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

/* ====================================================
   ROLE-BASED SETTINGS PANEL
   ==================================================== */
const RoomSettings = ({ isOwner }) => {
  const [banText, setBanText] = useState(false);
  const [banPhoto, setBanPhoto] = useState(false);
  const [announcement, setAnnouncement] = useState('Welcome, everyone! New emote drops today. Please be respectful!');
  const [roomTitle, setRoomTitle] = useState('COZY GAMING & CHILL - RYU STREAMS');
  
  const [movieVol, setMovieVol] = useState(65);
  const [voiceVol, setVoiceVol] = useState(45);

  const CustomToggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        checked ? 'bg-[#E50914]' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const handleEditTitle = () => {
    const newTitle = prompt("Enter new room title:", roomTitle);
    if (newTitle && newTitle.trim() !== '') {
      setRoomTitle(newTitle);
      toast.success("Room title updated!", { style: { background: '#141414', color: '#fff' }});
    }
  };

  const handleReport = () => {
    toast.success("A moderation report has been filed directly to WatchWave Admin.", { icon: '🚩', style: { background: '#141414', color: '#fff' }});
  };

  if (!isOwner) return null;

  return (
    <div className="bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shrink-0 flex flex-col shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-5 select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E50914]/20 flex items-center justify-center text-[#E50914]">
            <Settings size={18} />
          </div>
          <h3 className="text-sm font-bold text-white tracking-widest uppercase">Room Admin</h3>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-300">
            <span>Movie Volume</span>
            <span className="text-[#E50914]">{movieVol}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={movieVol}
            onChange={(e) => setMovieVol(e.target.value)}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#E50914] custom-slider-red"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-300">
            <span>Voice Chat level</span>
            <span className="text-gray-500">{voiceVol}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={voiceVol}
            onChange={(e) => setVoiceVol(e.target.value)}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white custom-slider-white"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300 uppercase">Ban Chat</span>
          <CustomToggle checked={banText} onChange={setBanText} />
        </div>
      </div>

      <button onClick={handleReport} className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#E50914]/50 hover:bg-[#E50914]/10 text-white text-sm font-bold tracking-wider transition-all">
        <Flag size={16} className="text-[#E50914]" /> REPORT ROOM
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-slider-red::-webkit-slider-thumb {
          appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #E50914; box-shadow: 0 0 10px #E50914;
        }
        .custom-slider-white::-webkit-slider-thumb {
          appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 0 10px #fff;
        }
      `}}/>
    </div>
  );
};

/* ====================================================
   MAIN WATCH ROOM COMPONENT
   ==================================================== */
const WatchRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const chatEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { id: 1, user: 'Arjun', text: 'Waiting for the stream to start! 🔥', avatar: 'https://i.pravatar.cc/150?u=1', time: '10:02' },
    { id: 2, user: 'Sarah', text: 'Any suggestions for the vibe?', avatar: 'https://i.pravatar.cc/150?u=2', time: '10:03' },
    { id: 3, user: 'You', text: 'Lets checks the mood vibes.', avatar: 'https://i.pravatar.cc/150?u=3', time: '10:05', isMe: true },
  ]);
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [floatingReactions, setFloatingReactions] = useState([]);
  
  // Mood / Content State
  const [currentMood, setCurrentMood] = useState(null);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isWaitingInLobby, setIsWaitingInLobby] = useState(false);
  const [isOwner, setIsOwner] = useState(true); 
  const [socket, setSocket] = useState(null);

  const participants = [
    { id: 1, name: 'You', avatar: 'https://i.pravatar.cc/150?u=3', isMuted: false, isHost: true, isSpeaking: false },
    { id: 2, name: 'Arjun', avatar: 'https://i.pravatar.cc/150?u=1', isMuted: true, isHost: false, isSpeaking: false },
    { id: 3, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2', isMuted: false, isHost: false, isSpeaking: true },
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('receive-entry-request', (data) => {
      if (isOwner) {
        toast((t) => (
          <div className="flex flex-col gap-3 w-full">
             <span className="font-bold text-sm">A user wants to enter the room</span>
             <div className="flex gap-2">
               <button 
                 onClick={() => {
                   newSocket.emit('entry-accepted', { userId: data.userId });
                   toast.dismiss(t.id);
                   toast.success("Entry Granted");
                 }} 
                 className="bg-[#E50914] text-white px-3 py-1.5 rounded text-xs font-bold"
               >
                 Accept
               </button>
               <button 
                 onClick={() => {
                   newSocket.emit('entry-declined', { userId: data.userId });
                   toast.dismiss(t.id);
                 }} 
                 className="bg-white/10 text-white px-3 py-1.5 rounded text-xs"
               >
                 Decline
               </button>
             </div>
          </div>
        ), { duration: 10000, style: { background: '#141414', color: '#fff', border: '1px solid #333' } });
      }
    });

    newSocket.on('entry-accepted', () => {
      if (!isOwner) {
        setIsWaitingInLobby(false);
        toast.success("Room owner granted you entry!");
      }
    });

    newSocket.on('entry-declined', () => {
      if (!isOwner) {
        toast.error("The room owner declined your request.");
        setTimeout(() => navigate('/party'), 2000);
      }
    });

    return () => newSocket.disconnect();
  }, [isOwner, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleContentSelect = (item) => {
    setSelectedContent(item);
    setShowMoodSelector(false);
    setIsPlaying(true);
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: 'System',
      text: `Now playing: ${item.title}`,
      avatar: 'https://i.pravatar.cc/150?u=0',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false
    }]);
  };

  if (isWaitingInLobby) {
    return (
      <div className="fixed inset-0 min-h-screen bg-[#050505] flex flex-col items-center justify-center z-[100]">
        <div className="w-16 h-16 border-4 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Waiting for Approval...</h2>
        <p className="text-gray-500 mt-2 text-sm italic">Knocking securely via Socket.io</p>
      </div>
    );
  }

  const recommendations = currentMood ? getRecommendations(currentMood) : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-4 overflow-hidden flex flex-col h-screen font-sans">
      
      {/* Dev Toggles */}
      <div className="absolute top-24 left-6 z-50 flex gap-2">
        <button onClick={() => setIsOwner(!isOwner)} className="bg-white/5 backdrop-blur-md text-[10px] px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all font-bold tracking-widest uppercase">
          {isOwner ? 'View: Owner' : 'View: Participant'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative max-w-[1920px] mx-auto w-full px-4 gap-4 pb-4">

        {/* =========================================
            LEFT COLUMN: MAIN STAGE 
            ========================================= */}
        <div className="flex-1 lg:w-[70%] flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl shadow-2xl">
          
          {/* Mood Selector Overlay */}
          <AnimatePresence>
            {showMoodSelector && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-[#050505]/95 flex flex-col items-center justify-center p-8 overflow-y-auto custom-scrollbar"
              >
                {!currentMood ? (
                  <div className="text-center w-full max-w-4xl">
                    <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-black mb-12 tracking-[0.2em] uppercase">Set the Room Vibe</motion.h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {moods.map((mood, idx) => (
                        <motion.button
                          key={mood.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentMood(mood)}
                          className={`group relative overflow-hidden rounded-2xl p-8 aspect-video flex flex-col justify-between items-center text-center transition-all ${mood.color} border border-white/10 shadow-lg`}
                        >
                          <div className="bg-white/20 p-3 rounded-full text-white shadow-inner">
                            <mood.icon size={32} />
                          </div>
                          <span className="font-black text-white text-xl tracking-widest uppercase">{mood.name}</span>
                        </motion.button>
                      ))}
                    </div>
                    <button onClick={() => setShowMoodSelector(false)} className="mt-12 text-gray-500 hover:text-white underline text-xs font-bold tracking-widest uppercase transition-colors">Skip & Just Hangout</button>
                  </div>
                ) : (
                  <div className="w-full max-w-5xl">
                    <button onClick={() => setCurrentMood(null)} className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors">&larr; Back to vibes</button>
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-wider">
                      Top picks for <span className="text-[#E50914]">{currentMood.name}</span> mood
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                      {recommendations.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group relative cursor-pointer"
                          onClick={() => handleContentSelect(item)}
                        >
                          <div className="aspect-[2/3] rounded-xl overflow-hidden relative border border-white/5 shadow-2xl">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-[#E50914] rounded-full p-4 shadow-[0_0_20px_rgba(229,9,20,0.6)] transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <Play size={24} fill="white" />
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-[10px] font-black text-[#E50914] px-2 py-1 rounded tracking-tighter border border-[#E50914]/20">
                              {item.match}% MATCH
                            </div>
                          </div>
                          <h3 className="mt-3 text-xs font-black text-gray-300 uppercase tracking-widest group-hover:text-white truncate transition-colors">{item.title}</h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Bar inside Main Stage */}
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div>
              <h2 className="text-sm font-black text-gray-400 tracking-[0.2em] uppercase">
                <span className="text-[#E50914] mr-2">Watching:</span> 
                <span className="text-white">{selectedContent ? selectedContent.title : 'Nothing Playing'}</span>
              </h2>
            </div>
          </div>

          {/* Video Player Area */}
          <div className="flex-1 relative flex items-center justify-center bg-[#050505] group">
            {selectedContent ? (
              <>
                <img
                  src={selectedContent.image.replace('w500', 'original')}
                  alt="Video Feed"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-80' : 'opacity-40 grayscale'}`}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="z-10 bg-white/5 backdrop-blur-xl p-8 rounded-full cursor-pointer hover:bg-white/10 transition-all border border-white/10 shadow-2xl"
                >
                  {isPlaying ? <Pause size={48} fill="white" /> : <Play size={48} fill="white" className="ml-2" />}
                </motion.div>
              </>
            ) : (
              <div className="text-center z-10">
                <div className="bg-white/5 p-12 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                  <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest text-sm">Room is ready. Choose a movie.</p>
                  <button
                    onClick={() => setShowMoodSelector(true)}
                    className="bg-[#E50914] px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)]"
                  >
                    Select Content
                  </button>
                </div>
              </div>
            )}

            {/* Floating Reactions overlay */}
            <div className="absolute inset-x-0 bottom-32 z-20 pointer-events-none h-96 overflow-hidden">
              <AnimatePresence>
                {floatingReactions.map(reaction => (
                  <motion.div
                    key={reaction.id}
                    initial={{ y: 0, opacity: 1, scale: 0.5 }}
                    animate={{ y: -400, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className={`absolute ${reaction.color}`}
                    style={{ left: `${reaction.x}%` }}
                  >
                    <reaction.icon size={48} fill="currentColor" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20 space-y-4">
             {/* Simple Progress Bar */}
             <div className="w-full h-1 bg-white/10 rounded-full cursor-pointer group relative overflow-hidden">
                <div className={`h-full bg-[#E50914] shadow-[0_0_10px_#E50914] transition-all duration-300 ${isPlaying ? 'w-[34%]' : 'w-[28%]'}`} />
             </div>

             <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                   <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[#E50914] transition-colors">
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                   </button>
                   <div className="flex items-center gap-2">
                       <Volume2 size={20} className="text-gray-400" />
                       <div className="w-20 h-1 bg-white/10 rounded-full">
                          <div className="w-2/3 h-full bg-white rounded-full shadow-[0_0_5px_white]" />
                       </div>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   {/* Reaction Pool */}
                   <div className="flex items-center bg-white/5 backdrop-blur-md rounded-full px-4 py-2 gap-3 border border-white/10 shadow-lg">
                      {reactions.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => triggerReaction(r.icon, r.color)}
                          className="hover:scale-125 transition-transform active:scale-95"
                        >
                          <r.icon size={20} className={r.color} />
                        </button>
                      ))}
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-2" />

                    <button onClick={() => { setShowMoodSelector(true); setCurrentMood(null); }} className="p-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                      <Smile size={22} />
                    </button>
                    <button className="p-2.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                      <Mic size={22} />
                    </button>
                    <button onClick={() => navigate('/party')} className="p-2.5 rounded-full bg-[#E50914]/10 text-[#E50914] hover:bg-[#E50914] hover:text-white transition-all">
                      <PhoneOff size={22} />
                    </button>
                </div>
             </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: SOCIAL PANEL
            ========================================= */}
        <div className="w-full lg:w-[30%] lg:min-w-[360px] flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar">
          
          {/* Header Action Row */}
          <div className="flex items-center justify-between bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl">
             <div className="flex gap-2">
                <button onClick={() => navigate('/party')} className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] hover:bg-[#E50914] hover:text-white transition-all">
                   <LogOut size={20} />
                </button>
                <button onClick={() => setIsShareModalOpen(true)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                   <Share2 size={20} />
                </button>
             </div>

             <div className="flex -space-x-3">
               {participants.map((p) => (
                 <div key={p.id} className="relative">
                   <img src={p.avatar} alt={p.name} className={`w-10 h-10 rounded-full border-2 object-cover ${p.isHost ? 'border-[#E50914]' : 'border-black'}`} />
                   {p.isSpeaking && <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping" />}
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full bg-rich-gray border-2 border-black flex items-center justify-center text-[10px] font-black">+2</div>
             </div>
          </div>

          {/* Social Chat */}
          <div className="flex-1 min-h-[400px] bg-[#141414]/80 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
             <div className="px-6 py-5 border-b border-white/5 flex items-center gap-3 bg-white/5 uppercase tracking-[0.2em] text-[10px] font-black text-gray-400">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" /> Live Chat Buffer
             </div>

             <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar scroll-smooth">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <img src={msg.avatar} className="w-10 h-10 rounded-2xl shadow-lg border border-white/10 object-cover" alt={msg.user} />
                    <div className={`flex flex-col max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                       <div className={`flex items-center gap-2 mb-1.5 opacity-60 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">{msg.user} {msg.isMe && '👤'}</span>
                          <span className="text-[10px] font-mono text-gray-500">{msg.time}</span>
                       </div>
                       <div className={`px-5 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-xl ${msg.isMe
                          ? 'bg-[#E50914] text-white rounded-tr-none shadow-[0_8px_20px_rgba(229,9,20,0.4)]'
                          : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/10'
                        }`}>
                         {msg.text}
                       </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             <div className="p-5 border-t border-white/10 bg-black/40">
                <form onSubmit={handleSendMessage} className="relative">
                   <input
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="Message room..."
                     className="w-full bg-[#050505] text-sm text-white rounded-2xl py-4 pl-6 pr-14 focus:outline-none border border-white/10 focus:border-[#E50914]/50 transition-all shadow-inner"
                   />
                   <button type="submit" disabled={!input.trim()} className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${input.trim() ? 'bg-[#E50914] text-white shadow-lg' : 'text-gray-600'}`}>
                      <Send size={16} />
                   </button>
                </form>
             </div>
          </div>

          <RoomSettings isOwner={isOwner} />
        </div>
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />

      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
        `
      }} />
    </div>
  );
};

export default WatchRoom;
