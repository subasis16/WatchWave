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
    toast.success("Room link copied to clipboard!", { style: { background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' } });
    onClose();
  };

  const handleInvite = (name) => {
    console.log(`Invite sent to ${name}`);
    toast.success(`Invite sent to ${name}`, { icon: '✉️', style: { background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' } });
  };

  useEffect(() => {
    if (!isOpen) setShowInvites(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="w-full max-w-sm glass-card p-10 relative border-white/10"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>

        {!showInvites ? (
          <div className="flex flex-col gap-6 mt-4">
            <div className="text-center space-y-2">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Share Session</h3>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Share Screen</h2>
            </div>
            <div className="space-y-4">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl glass-card border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all transition-all duration-500"
                >
                  <Copy size={18} /> Copy Invite Key
                </button>
                <button
                  onClick={() => setShowInvites(true)}
                  className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl glass-pill-active text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-2xl"
                >
                  <UserPlus size={18} /> Target Contacts
                </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col mt-4">
            <div className="flex items-center gap-4 mb-10">
              <button onClick={() => setShowInvites(false)} className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </button>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Contacts</h3>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {mockFriends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-4 rounded-2xl glass-card border-white/5">
                  <div className="flex items-center gap-4">
                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-lg" />
                    <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">{friend.name}</span>
                  </div>
                  <button
                    onClick={() => handleInvite(friend.name)}
                    className="px-4 py-2 rounded-full glass-pill border-accent-gold/20 text-accent-gold text-[8px] font-black uppercase tracking-widest hover:bg-accent-gold hover:text-black transition-all"
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
  const [roomTitle, setRoomTitle] = useState('COZY GAMING & CHILL - RYU STREAMS');
  
  const [movieVol, setMovieVol] = useState(65);
  const [voiceVol, setVoiceVol] = useState(45);

  const CustomToggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500 focus:outline-none ${
        checked ? 'bg-accent-gold shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'bg-white/10'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-500 shadow-sm ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const handleReport = () => {
    toast.success("A moderation report has been filed directly to WatchWave Admin.", { icon: '🚩', style: { background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' }});
  };

  if (!isOwner) return null;

  return (
    <div className="glass-card p-6 pb-8 shrink-0 flex flex-col border-white/10 relative overflow-hidden group">
      <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 select-none relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl glass-card border-white/10 flex items-center justify-center text-white">
            <Settings size={20} />
          </div>
          <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Core Admin</h3>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
            <span>Media Gain</span>
            <span className="text-accent-gold">{movieVol}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={movieVol}
            onChange={(e) => setMovieVol(e.target.value)}
            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
            <span>Voice Chat</span>
            <span className="text-white">{voiceVol}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={voiceVol}
            onChange={(e) => setVoiceVol(e.target.value)}
            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Mute</span>
          <CustomToggle checked={banText} onChange={setBanText} />
        </div>
      </div>

      <button onClick={handleReport} className="mt-10 w-full flex items-center justify-center gap-3 py-4 rounded-xl glass-card border-white/5 hover:border-red-500/30 text-gray-400 hover:text-red-500 text-[10px] font-black tracking-[0.2em] transition-all uppercase relative z-10">
        <Flag size={16} /> Clear Room
      </button>
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
      keywords: ['Dark Knight', 'Breaking Bad', 'Death Note', 'Squid Game', 'Batman', 'Oppenheimer', 'Catalog']
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
      <div className="fixed inset-0 min-h-screen bg-transparent flex flex-col items-center justify-center z-[100] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 via-transparent to-white/5 opacity-50" />
        <div className="relative group">
            <div className="absolute inset-0 bg-accent-gold/20 blur-[100px] animate-pulse rounded-full" />
            <div className="w-24 h-24 border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin mb-10 relative z-10 shadow-[0_0_50px_rgba(255,215,0,0.2)]" />
        </div>
        <h2 className="text-[10px] font-black text-white tracking-[0.6em] uppercase mb-4 relative z-10">Encrypted Connection</h2>
        <h3 className="text-4xl font-black text-white tracking-tighter uppercase relative z-10">Waiting for Server</h3>
        <p className="text-gray-500 mt-6 text-[10px] font-black uppercase tracking-[0.2em] relative z-10 opacity-60">Handshaking via Global Servers</p>
      </div>
    );
  }

  const recommendations = currentMood ? getRecommendations(currentMood) : [];

  return (
    <div className="min-h-screen text-white pt-24 pb-4 overflow-hidden flex flex-col h-screen font-sans selection:bg-accent-gold selection:text-black">
      
      {/* Dev Toggles */}
      <div className="fixed top-28 left-8 z-[100] flex gap-3">
        <button 
          onClick={() => setIsOwner(!isOwner)} 
          className="glass-pill px-5 py-2.5 text-[8px] font-black uppercase tracking-[0.2em] border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
        >
          {isOwner ? 'Role: Host' : 'Role: Viewer'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative max-w-[1920px] mx-auto w-full px-6 gap-6 pb-6 mt-4">

        {/* =========================================
            LEFT COLUMN: MAIN STAGE 
            ========================================= */}
        <div className="flex-1 lg:w-[70%] flex flex-col relative overflow-hidden glass-card border-white/5 shadow-2xl">
          
          {/* Mood Selector Overlay */}
          <AnimatePresence>
            {showMoodSelector && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 overflow-y-auto custom-scrollbar"
              >
                {!currentMood ? (
                  <div className="text-center w-full max-w-5xl">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-16">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Sentiment Engine</h3>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Connect Room Vibe</h2>
                    </motion.div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      {moods.map((mood, idx) => (
                        <motion.button
                          key={mood.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.8, ease: "circOut" }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCurrentMood(mood)}
                          className="group relative overflow-hidden rounded-[2.5rem] glass-card p-10 aspect-video flex flex-col justify-between items-center text-center transition-all bg-white/[0.02] border-white/5 hover:border-white/20 shadow-2xl"
                        >
                          <div className={`p-4 rounded-2xl ${mood.color} text-white shadow-2xl brightness-90 group-hover:brightness-110 transition-all`}>
                            <mood.icon size={32} />
                          </div>
                          <span className="font-black text-white text-sm tracking-[0.3em] uppercase">{mood.name}</span>
                        </motion.button>
                      ))}
                    </div>
                    <button onClick={() => setShowMoodSelector(false)} className="mt-16 text-gray-500 hover:text-accent-gold text-[10px] font-black tracking-[0.3em] uppercase transition-all">Skip Connection</button>
                  </div>
                ) : (
                  <div className="w-full max-w-6xl">
                    <button onClick={() => setCurrentMood(null)} className="mb-12 text-gray-400 hover:text-white flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                        <ArrowLeft size={16} /> Back to Sentiment Catalog
                    </button>
                    <div className="mb-12">
                        <h3 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] mb-4">Recommended for {currentMood.name} Phase</h3>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Content Stream</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                      {recommendations.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group relative cursor-pointer"
                          onClick={() => handleContentSelect(item)}
                        >
                          <div className="aspect-[2/3] rounded-[1.5rem] overflow-hidden relative border border-white/5 shadow-2xl">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-white rounded-full p-5 shadow-[0_0_40px_rgba(255,255,255,0.3)] transform scale-0 group-hover:scale-100 transition-transform duration-500">
                                <Play size={24} fill="black" />
                              </div>
                            </div>
                            <div className="absolute top-4 right-4 glass-pill bg-black/60 border-accent-gold/20 text-[8px] font-black text-accent-gold px-3 py-1.5 uppercase tracking-widest">
                              {item.match}% SYNC
                            </div>
                          </div>
                          <h3 className="mt-5 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white truncate transition-colors">{item.title}</h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Bar inside Main Stage */}
          <div className="absolute top-0 w-full p-8 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 via-black/20 to-transparent">
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse shadow-[0_0_10px_#FFD700]" />
                <h2 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase">
                    <span className="opacity-40">Active Feed:</span> 
                    <span className="text-white ml-2">{selectedContent ? selectedContent.title : 'Idle'}</span>
                </h2>
            </div>
          </div>

          {/* Video Player Area */}
          <div className="flex-1 relative flex items-center justify-center bg-transparent group overflow-hidden">
            {selectedContent ? (
              <>
                <img
                  src={selectedContent.image.replace('w500', 'original')}
                  alt="Video Feed"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'opacity-70 scale-100' : 'opacity-30 scale-110 grayscale blur-xl'}`}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="z-10 glass-pill-active p-10 rounded-full cursor-pointer transition-all shadow-2xl relative"
                >
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full -z-10" />
                  {isPlaying ? <Pause size={48} fill="white" /> : <Play size={48} fill="white" className="ml-2" />}
                </motion.div>
              </>
            ) : (
              <div className="text-center z-10 p-12">
                <div className="glass-card p-16 rounded-[3rem] border-white/10 shadow-3xl">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-8">Screen Operational</h3>
                  <button
                    onClick={() => setShowMoodSelector(true)}
                    className="glass-pill-active px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-2xl"
                  >
                    Select Stream
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
                    animate={{ y: -500, opacity: 0, scale: 2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className={`absolute ${reaction.color}`}
                    style={{ left: `${reaction.x}%` }}
                  >
                    <reaction.icon size={48} fill="currentColor" className="drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-8 bg-black/60 backdrop-blur-3xl z-20 space-y-6">
             {/* Simple Progress Bar */}
             <div className="w-full h-1 bg-white/5 rounded-full cursor-pointer group relative overflow-hidden">
                <div className={`h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out ${isPlaying ? 'w-[34%]' : 'w-[28%]'}`} />
             </div>

             <div className="flex justify-between items-center">
                <div className="flex items-center gap-10">
                   <button onClick={() => setIsPlaying(!isPlaying)} className="text-gray-400 hover:text-white transition-all transform active:scale-90">
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                   </button>
                   <div className="flex items-center gap-4 group">
                       <Volume2 size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                       <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-accent-gold shadow-[0_0_10px_#FFD700]" />
                       </div>
                   </div>
                </div>

                <div className="flex items-center gap-6">
                   {/* Reaction Pool */}
                   <div className="flex items-center glass-pill px-6 py-3 gap-6 border-white/5 shadow-2xl">
                      {reactions.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => triggerReaction(r.icon, r.color)}
                          className="hover:scale-125 transition-transform active:scale-95 brightness-90 hover:brightness-110"
                        >
                          <r.icon size={20} className={r.color} />
                        </button>
                      ))}
                    </div>

                    <div className="w-px h-6 bg-white/5 mx-2" />

                    <div className="flex items-center gap-3">
                        <button onClick={() => { setShowMoodSelector(true); setCurrentMood(null); }} className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center text-gray-400 hover:text-white transition-all border-white/5">
                          <Smile size={20} />
                        </button>
                        <button className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center text-gray-400 hover:text-white transition-all border-white/5">
                          <Mic size={20} />
                        </button>
                        <button onClick={() => navigate('/party')} className="w-12 h-12 rounded-2xl glass-pill-active bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl">
                          <PhoneOff size={20} />
                        </button>
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: SOCIAL PANEL
            ========================================= */}
        <div className="w-full lg:w-[30%] lg:min-w-[400px] flex flex-col gap-6 shrink-0 overflow-y-auto custom-scrollbar">
          
          {/* Header Action Row */}
          <div className="flex items-center justify-between glass-pill p-4 border-white/5 shadow-2xl">
             <div className="flex gap-3">
                <button onClick={() => navigate('/party')} className="w-12 h-12 flex items-center justify-center rounded-2xl glass-pill border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                   <LogOut size={20} />
                </button>
                <button onClick={() => setIsShareModalOpen(true)} className="w-12 h-12 flex items-center justify-center rounded-2xl glass-pill border-white/10 text-gray-300 hover:border-accent-gold/50 hover:text-accent-gold transition-all">
                   <Share2 size={20} />
                </button>
             </div>

             <div className="flex -space-x-4">
               {participants.map((p) => (
                 <div key={p.id} className="relative group">
                   <img src={p.avatar} alt={p.name} className={`w-12 h-12 rounded-full border-2 object-cover transition-all ${p.isHost ? 'border-accent-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'border-[#050505]'}`} />
                   {p.isSpeaking && <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />}
                 </div>
               ))}
               <div className="w-12 h-12 rounded-full glass-card border-white/10 flex items-center justify-center text-[10px] font-black z-10">+2</div>
             </div>
          </div>

          {/* Social Chat */}
          <div className="flex-1 min-h-[500px] glass-card border-white/5 flex flex-col overflow-hidden shadow-3xl">
             <div className="px-8 py-6 border-b border-white/5 flex items-center gap-4 bg-white/[0.02] text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">
                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-pulse shadow-[0_0_10px_#FFD700]" />
                Live Chat
             </div>

             <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 custom-scrollbar scroll-smooth">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-5 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="relative shrink-0">
                        <img src={msg.avatar} className="w-12 h-12 rounded-2xl shadow-2xl border border-white/5 object-cover" alt={msg.user} />
                        {msg.isMe && <div className="absolute inset-0 rounded-2xl bg-accent-gold/10 pointer-events-none" />}
                    </div>
                    <div className={`flex flex-col max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                       <div className={`flex items-center gap-3 mb-2 opacity-40 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{msg.user}</span>
                          <span className="text-[8px] font-mono text-gray-600">{msg.time}</span>
                       </div>
                       <div className={`px-5 py-3 rounded-[1.5rem] text-[13px] font-medium leading-loose shadow-2xl transition-all ${msg.isMe
                           ? 'glass-pill-active border-accent-gold/20 rounded-tr-none'
                           : 'glass-card border-white/5 rounded-tl-none bg-white/[0.03]'
                         }`}>
                         {msg.text}
                       </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                <form onSubmit={handleSendMessage} className="relative group">
                   <div className="absolute inset-0 bg-white/5 blur-xl group-focus-within:bg-accent-gold/5 transition-all rounded-3xl" />
                   <input
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="Send message..."
                     className="w-full bg-black/50 backdrop-blur-md text-[13px] text-white rounded-[1.5rem] py-5 pl-8 pr-16 focus:outline-none border border-white/5 focus:border-white/20 transition-all shadow-2xl relative z-10 font-medium"
                   />
                   <button type="submit" disabled={!input.trim()} className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl transition-all relative z-20 ${input.trim() ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-gray-600'}`}>
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
