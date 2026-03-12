import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Users, Play, Pause, Volume2, Settings, Mic, MicOff,
  Share2, Maximize, Subtitles, X, Copy, UserPlus, LogOut,
  Edit2, Lock, UserX, Clock, Flag, Star
} from 'lucide-react';
import { movies, series, anime } from '../data/content';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

// Setup socket outside to avoid unnecessary reconnects (or inside useEffect in a real app)
// We'll initialize it in the component to manage lifecycle properly.
const SOCKET_URL = 'http://localhost:5000';

/* ====================================================
   SHARE MODAL COMPONENT (PHASE 1)
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

  // Reset state when closed
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
   ROLE-BASED SETTINGS PANEL (PHASE 2)
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

  // --- Handlers for mock functionality ---
  const handleEditTitle = () => {
    const newTitle = prompt("Enter new room title:", roomTitle);
    if (newTitle && newTitle.trim() !== '') {
      setRoomTitle(newTitle);
      toast.success("Room title updated!", { style: { background: '#141414', color: '#fff' }});
    }
  };

  const handleEditAvatar = () => {
    toast.success("Avatar upload modal opened (Mock)", { icon: '🖼️', style: { background: '#141414', color: '#fff' }});
  };

  const handleSaveAnnouncement = () => {
    toast.success("Announcement saved successfully!", { icon: '📢', style: { background: '#141414', color: '#fff' }});
  };

  const handleBanTextToggle = (val) => {
    setBanText(val);
    toast(val ? "Text chatting banned!" : "Text chatting unbanned", { icon: val ? '🛑' : '✅', style: { background: '#141414', color: '#fff' } });
  };

  const handleBanPhotoToggle = (val) => {
    setBanPhoto(val);
    toast(val ? "Photo chatting banned!" : "Photo chatting unbanned", { icon: val ? '🛑' : '✅', style: { background: '#141414', color: '#fff' } });
  };

  const handleSetPassword = () => {
    const pwd = prompt("Enter new room password to lock the room:");
    if (pwd) toast.success("Room password updated and locked!", { icon: '🔐', style: { background: '#141414', color: '#fff' }});
  };

  const handleBlacklist = () => {
    toast("No users currently blacklisted.", { icon: '📋', style: { background: '#141414', color: '#fff' } });
  };

  const handleOperationsRecord = () => {
    toast("No recent operations to display.", { icon: '⏳', style: { background: '#141414', color: '#fff' } });
  };

  const handleReport = () => {
    toast.success("A moderation report has been filed directly to WatchWave Admin.", { icon: '🚩', style: { background: '#141414', color: '#fff' }});
  };

  const handleClosePanel = () => {
    toast("Settings panel collapse logic goes here.", { icon: 'ℹ️', style: { background: '#141414', color: '#fff' }});
  };

  if (isOwner) {
    return (
      <div className="bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shrink-0 flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header styling matching room_BA.jpg */}
        <div className="flex items-center justify-between mb-5 select-none">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={handleEditAvatar}>
              <div className="w-12 h-12 rounded-full border-2 border-[#E50914] overflow-hidden flex items-center justify-center bg-black">
                <span className="font-black text-xl text-white">RS</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-full shadow-md">
                <Edit2 size={10} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium tracking-wide">Room Title</span>
              <div className="flex items-center gap-2 group cursor-pointer" onClick={handleEditTitle}>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{roomTitle}</h3>
                <Edit2 size={12} className="text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
          <button onClick={handleClosePanel} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2">General Settings</h4>
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-1 block">Room Announcements</label>
              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-gray-300 focus:outline-none focus:border-gray-500 resize-none h-20 shadow-inner custom-scrollbar"
              />
              <button onClick={handleSaveAnnouncement} className="w-full mt-2 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-full transition-colors">
                Save
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white flex items-center gap-2"><Send size={14} className="text-gray-400"/> Ban Text Chatting</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">Toggle: ON to ban text chatting</span>
                </div>
                <CustomToggle checked={banText} onChange={handleBanTextToggle} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white flex items-center gap-2"><Maximize size={14} className="text-gray-400"/> Ban Photo Chatting</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">Toggle: ON to ban photo chatting</span>
                </div>
                <CustomToggle checked={banPhoto} onChange={handleBanPhotoToggle} />
              </div>
            </div>
          </div>

          {/* Moderation & Safety */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Moderation & Safety</h4>
            <div className="space-y-2">
              <button onClick={handleSetPassword} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 transition-colors text-left group">
                <Lock size={16} className="text-[#E50914] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-gray-200 group-hover:text-white">Set Password</span>
              </button>
              <button onClick={handleBlacklist} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 transition-colors text-left group">
                <UserX size={16} className="text-[#E50914] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-gray-200 group-hover:text-white">Blacklist</span>
              </button>
              <button onClick={handleOperationsRecord} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 transition-colors text-left group">
                <Clock size={16} className="text-[#E50914] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-gray-200 group-hover:text-white">Operations Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Participant View (isOwner === false) matching room_BA1.jpg
  return (
    <div className="bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shrink-0 flex flex-col gap-6 shadow-2xl relative overflow-hidden min-h-[350px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-white tracking-wide">ROOM SETTINGS</h3>
        <button onClick={handleClosePanel} className="text-gray-400 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-6 flex-1">
        {/* Movie Volume */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-300">
            <span>Movie Volume</span>
            <span className="text-gray-500">{movieVol}%</span>
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

        {/* Voice Chat Level */}
        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-300">
            <span>Voice Chat Level</span>
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
      </div>

      {/* Moderation Ghost Button */}
      <button onClick={handleReport} className="mt-auto w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#E50914]/50 hover:bg-[#E50914]/10 text-white text-sm font-bold tracking-wider transition-all">
        <Flag size={16} className="text-[#E50914]" /> REPORT ROOM/USER
      </button>

      {/* Inline styles for custom slider thumbs */}
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
  const [messages, setMessages] = useState([
    { id: 1, user: 'Arjun', text: 'Waiting for the stream to start!', avatar: 'https://i.pravatar.cc/150?u=1', time: '10:02' },
    { id: 2, user: 'Sarah', text: 'Any suggestions?', avatar: 'https://i.pravatar.cc/150?u=2', time: '10:03' },
    { id: 3, user: 'You', text: 'Lets checks the mood vibes.', avatar: 'https://i.pravatar.cc/150?u=3', time: '10:05', isMe: true },
  ]);
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);

  const vibes = ['MOVIES', 'ANIME', 'SPORTS', 'TV SHOW', 'SERIES'];
  const moods = ['HAPPY', 'ROMANTIC', 'SAD', 'EXCITED', 'RELAXED', 'SCARE'];

  const mockRecommendations = [
    { id: 1, title: 'Comedy is Porty', thumbnailUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=500', category: 'MOVIES', rating: '4.5' },
    { id: 2, title: 'Anime Series', thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=500', category: 'ANIME', rating: '4.8' },
    { id: 3, title: 'Sports Game', thumbnailUrl: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg', category: 'SPORTS', rating: '4.2' },
    { id: 4, title: 'Sitcom Fun', thumbnailUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', category: 'SITCOM', rating: '4.5' },
    { id: 5, title: 'Feel Good', thumbnailUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', category: 'MOVIES', rating: '4.9' },
    { id: 6, title: 'The Bigboy', thumbnailUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500', category: 'MOVIES', rating: '4.5' },
    { id: 7, title: 'Now Core', thumbnailUrl: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', category: 'ANIME', rating: '4.5' },
    { id: 8, title: 'Prototyping Fights', thumbnailUrl: 'https://image.tmdb.org/t/p/w500/mY7SeH4HFFxW1hiI6cWuwCRKptN.jpg', category: 'SPORTS', rating: '4.5' },
    { id: 9, title: 'Show Tries', thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500', category: 'MOVIES', rating: '4.5' },
    { id: 10, title: 'Feel Good', thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500', category: 'FEEL-GOOD', rating: '4.5' },
  ];
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // High-Security Entry Flow States
  const [isWaitingInLobby, setIsWaitingInLobby] = useState(false);
  
  // For demo, we can toggle this to see both views. 
  // In reality, this comes from auth context/room data.
  const [isOwner, setIsOwner] = useState(true); 
  const [socket, setSocket] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Initialize Socket Connection for this room
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Set up mock IDs
    const userId = "user_" + Math.floor(Math.random() * 10000);
    const roomId = "room_123";

    // Scenario: User is joining as a participant, knocking on the door
    // If we want to simulate a participant joining, we set isOwner to false and trigger entry request
    // Uncomment the condition below to simulate a participant automatically knocking
    /*
    if (!isOwner) {
       setIsWaitingInLobby(true);
       newSocket.emit('request-entry', { userId, roomId });
    }
    */

    // Event: Owner receives an entry request
    newSocket.on('receive-entry-request', (data) => {
      // If I'm the owner, show the toast to accept/decline
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

    // Event: Participant gets accepted
    newSocket.on('entry-accepted', () => {
      if (!isOwner) {
        setIsWaitingInLobby(false);
        toast.success("Room owner granted you entry!", { style: { background: '#141414', color: '#fff' }});
      }
    });

    // Event: Participant gets declined
    newSocket.on('entry-declined', () => {
      if (!isOwner) {
        toast.error("The room owner declined your request.", { duration: 5000, style: { background: '#141414', border: '1px solid #E50914', color: '#fff' }});
        setTimeout(() => navigate('/party'), 2000);
      }
    });

    return () => newSocket.disconnect();
  }, [isOwner, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const participants = [
    { id: 1, name: 'You', avatar: 'https://i.pravatar.cc/150?u=3', isMuted: false, isHost: true, isSpeaking: false },
    { id: 2, name: 'Arjun', avatar: 'https://i.pravatar.cc/150?u=1', isMuted: true, isHost: false, isSpeaking: false },
    { id: 3, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2', isMuted: false, isHost: false, isSpeaking: true },
  ];

  const topPicks = [...movies, ...anime].slice(0, 4);

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

  // Helper to trigger knock for testing
  const manuallyRequestEntry = () => {
    setIsOwner(false);
    setIsWaitingInLobby(true);
    if (socket) {
      socket.emit('request-entry', { userId: "tester_1", roomId: "room_123" });
    }
  };

  // Lobby Full Screen Overlay
  if (isWaitingInLobby) {
    return (
      <div className="fixed inset-0 min-h-screen bg-[#050505] flex flex-col items-center justify-center z-[100]">
        <div className="w-16 h-16 border-4 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin mb-8" />
        <h2 className="text-2xl font-bold text-white tracking-widest uppercase shadow-black drop-shadow-md">Waiting for Owner's Approval...</h2>
        <p className="text-gray-500 mt-2">Knocking on the door securely via Socket.io</p>
        
        {/* Helper button to cancel or self-accept for demo purposes */}
        <button 
          onClick={() => setIsWaitingInLobby(false)} 
          className="mt-8 text-xs text-gray-500 hover:text-white underline"
        >
           Cancel Request
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-4 pb-4 overflow-hidden flex flex-col h-screen font-sans">
      
      {/* Dev Toggle for testing the two views visually */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <button onClick={() => setIsOwner(!isOwner)} className="bg-white/10 text-[10px] px-2 py-1 rounded hover:bg-white/20">
          Toggle View: {isOwner ? 'Owner' : 'Participant'}
        </button>
        {isOwner && (
          <button onClick={manuallyRequestEntry} className="bg-[#E50914]/20 text-[10px] px-2 py-1 rounded text-[#E50914] border border-[#E50914]/50">
            Simulate Knock Entry
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative max-w-[1920px] mx-auto w-full px-4 gap-4 pb-4">

        {/* =========================================
            LEFT COLUMN: MAIN STAGE (70%) 
            ========================================= */}
        <div className="flex-1 lg:w-[70%] flex flex-col relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/5 rounded-3xl shadow-2xl">
          {/* Header Bar inside Main Stage */}
          <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => navigate('/party')} className="text-gray-300 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
              &larr; Back to vibes
            </button>
            <div className="text-lg font-bold text-gray-400">
              <span className="text-[#E50914] mr-2">Watching:</span> Nothing Playing
            </div>
          </div>

          {/* Void Glow */}
          <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[80%] h-[50%] bg-[#E50914]/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Multi-Step Content Discovery Interface */}
          <div className="w-full h-full p-8 overflow-y-auto custom-scrollbar z-10 flex flex-col pt-24">
            
            {/* Panel 1: "WHAT'S THE VIBE TODAY?" */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-6 shadow-xl w-full max-w-4xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl font-bold tracking-wide text-white mb-8 uppercase">What's the vibe today?</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {vibes.map(vibe => (
                  <button
                    key={vibe}
                    onClick={() => setSelectedVibe(vibe)}
                    className={`px-8 py-2.5 rounded-full border transition-all text-sm font-bold tracking-wide ${
                      selectedVibe === vibe
                        ? 'border-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] bg-[#E50914]/10'
                        : 'border-gray-500 text-gray-300 hover:text-white hover:border-gray-400'
                    }`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel 2: "TELL US YOUR MOOD" */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-6 shadow-xl w-full max-w-4xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl font-bold tracking-wide text-white mb-8 uppercase">Tell us your mood</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
                {moods.map(mood => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-6 py-3 rounded-full border transition-all text-sm font-bold tracking-wide ${
                      selectedMood === mood
                        ? 'border-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] bg-[#E50914]/10'
                        : 'border-gray-500 text-gray-300 hover:text-white hover:border-gray-400'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel 3: Suggestions */}
            {selectedMood && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-6 shadow-xl w-full max-w-5xl mx-auto flex flex-col">
                <h2 className="text-2xl font-bold tracking-wide text-white mb-8 uppercase text-center">
                  Top suggestions from <span className="text-[#E50914]">{selectedMood}</span> mood
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                  {mockRecommendations.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="aspect-[2/3] rounded-lg overflow-hidden relative group cursor-pointer border border-white/5 shadow-lg transition-all duration-300 hover:border-[#E50914]/50 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Top-Left Category Badge */}
                      <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider shadow-md">
                        {item.category}
                      </div>
                      
                      {/* Top-Right Rating Badge */}
                      <div className="absolute top-2 right-2 bg-black/80 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-md">
                        <Star size={10} fill="currentColor" /> {item.rating}
                      </div>

                      {/* Bottom Title Sheen */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 w-full p-3">
                          <h3 className="text-white text-sm font-bold truncate tracking-wide">{item.title}</h3>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: SOCIAL PANE (30%)
            ========================================= */}
        <div className="w-full lg:w-[30%] lg:min-w-[360px] flex flex-col gap-4 shrink-0 overflow-y-auto custom-scrollbar pr-1">

          {/* 1. Header Row (Leave, Share, Avatars) */}
          <div className="flex items-center justify-between shrink-0 bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 shadow-lg">
            <div className="flex gap-2">
               <button onClick={() => navigate('/party')} className="flex flex-col items-center justify-center w-12 h-12 rounded-xl border border-white/10 hover:border-[#E50914] hover:bg-[#E50914]/10 hover:text-[#E50914] text-xs font-bold text-gray-300 transition-all bg-black/20">
                 <LogOut size={16} className="mb-0.5" />
               </button>
               {/* THE NEW SHARE BUTTON (Phase 1) */}
               <button onClick={() => setIsShareModalOpen(true)} className="flex flex-col items-center justify-center w-12 h-12 rounded-xl border border-white/10 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400 text-xs font-bold text-gray-300 transition-all bg-black/20">
                 <Share2 size={16} className="mb-0.5" />
               </button>
            </div>

            <div className="flex items-center gap-2">
              {participants.map((p) => (
                <div key={p.id} className="relative group cursor-pointer">
                  <div className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all duration-300 
                                ${p.isHost ? 'border-[#E50914] shadow-[0_0_10px_rgba(229,9,20,0.4)]' :
                      p.isSpeaking ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'border-white/10'}`}>
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  {p.isSpeaking && (
                    <div className="absolute -top-1 -right-1 p-0.5 bg-black rounded-full text-green-400 animate-pulse">
                      <Mic size={10} />
                    </div>
                  )}
                  {p.isMuted && (
                    <div className="absolute -top-1 -right-1 p-0.5 bg-black rounded-full text-[#E50914]">
                      <MicOff size={10} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Live Chat */}
          <div className="flex-1 min-h-[400px] bg-[#141414]/95 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-black/40 shrink-0">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-wide uppercase">
                <span className="w-2 h-2 bg-[#E50914] rounded-full shadow-[0_0_8px_#E50914]" /> Live Chat
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 hide-scrollbar scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                  <img src={msg.avatar} className="w-8 h-8 rounded-full shadow-md shrink-0 border border-white/10" alt={msg.user} />
                  <div className={`flex flex-col max-w-[85%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-baseline gap-2 mb-1 opacity-70 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                      <span className="text-[10px] font-bold text-white tracking-wider">{msg.user}</span>
                      <span className="text-[10px] text-gray-500">{msg.time}</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-md ${msg.isMe
                      ? 'bg-[#E50914] text-white rounded-tr-sm shadow-[0_4px_15px_rgba(229,9,20,0.3)]'
                      : 'bg-white/10 text-gray-200 rounded-tl-sm border border-white/5'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 shrink-0 bg-black/40 mt-auto border-t border-white/5">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Send a message..."
                  className="w-full bg-white/5 text-sm text-white rounded-full py-3.5 pl-5 pr-12 focus:outline-none focus:bg-white/10 transition-colors border border-white/10 focus:border-[#E50914]/50 placeholder:text-gray-500 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${input.trim() ? 'bg-[#E50914] text-white hover:bg-red-700 shadow-md' : 'text-gray-600'
                    }`}
                >
                  <Send size={14} className="-ml-0.5" />
                </button>
              </form>
            </div>
          </div>

          {/* 3. Room Settings (Phase 2 - Conditional Rendering) */}
          <RoomSettings isOwner={isOwner} />

        </div>
      </div>

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />

      <style dangerouslySetInnerHTML={{
        __html: `
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          /* Custom scrollbar for invite list */
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
        `
      }} />
    </div>
  );
};

export default WatchRoom;
