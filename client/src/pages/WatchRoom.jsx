import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Users, Play, Pause, Volume2, Settings, Mic, MicOff,
  Share2, Maximize, Subtitles, X, Copy, UserPlus, LogOut,
  Edit2, Lock, UserX, Clock, Flag, Star, Smile, Heart, ThumbsUp, Laugh, Flame, Frown, Coffee, Zap, Skull, Info, PhoneOff, MessageSquare, ArrowLeft
} from 'lucide-react';
import { movies, series, anime } from '../data/content';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { auth, db } from '../firebase';
import { API_URL } from '../utils/api';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

const SOCKET_URL = API_URL;

/* ====================================================
   SHARE MODAL COMPONENT
   ==================================================== */
const ShareModal = ({ isOpen, onClose }) => {
  const [showInvites, setShowInvites] = useState(false);

  const mockFriends = [];

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
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Invite Friends</h3>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Bring the Squad</h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl glass-card border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white transition-all transition-all duration-500"
              >
                <Copy size={18} /> Copy Invite Link
              </button>
              <button
                onClick={() => setShowInvites(true)}
                className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl glass-pill-active text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-2xl"
              >
                <UserPlus size={18} /> From My Friends
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
const RoomSettings = ({ isOwner, socket, roomCode }) => {
  const [banText, setBanText] = useState(false);
  const [banPhoto, setBanPhoto] = useState(false);
  const [roomTitle, setRoomTitle] = useState('COZY GAMING & CHILL - RYU STREAMS');

  const [movieVol, setMovieVol] = useState(65);
  const [voiceVol, setVoiceVol] = useState(45);

  useEffect(() => {
    if (!socket) return;
    const handleMovieSync = ({ gain }) => setMovieVol(gain);
    const handleVoiceSync = ({ gain }) => setVoiceVol(gain);
    const handleMuteSync = ({ mute }) => setBanText(mute);

    socket.on('sync_media_gain', handleMovieSync);
    socket.on('sync_voice_chat', handleVoiceSync);
    socket.on('sync_global_mute', handleMuteSync);

    return () => {
      socket.off('sync_media_gain', handleMovieSync);
      socket.off('sync_voice_chat', handleVoiceSync);
      socket.off('sync_global_mute', handleMuteSync);
    };
  }, [socket]);

  const handleMovieChange = (e) => {
    setMovieVol(e.target.value);
    if (socket && isOwner) socket.emit('sync_media_gain', { roomCode, gain: e.target.value });
  };

  const handleVoiceChange = (e) => {
    setVoiceVol(e.target.value);
    if (socket && isOwner) socket.emit('sync_voice_chat', { roomCode, gain: e.target.value });
  };

  const handleMuteChange = (checked) => {
    setBanText(checked);
    if (socket && isOwner) socket.emit('sync_global_mute', { roomCode, mute: checked });
  };

  const CustomToggle = ({ checked, onChange, disabled }) => (
    <button
      onClick={() => { if (!disabled) onChange(!checked); }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${checked ? 'bg-accent-gold shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'bg-white/10'
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-500 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  );

  const handleReport = async () => {
    try {
      if (!auth.currentUser) throw new Error("Unauthenticated");
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_URL}/api/feedback/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          roomCode: roomCode || 'unknown',
          reason: 'Violation of Community Guidelines / Toxicity Flag',
          reportedUser: 'Room Aggregate'
        })
      });
      if (!res.ok) throw new Error("Failed to file report");
      toast.success("Moderation report securely filed with WatchWave Management.", { icon: '🚩', style: { background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' } });
    } catch (err) {
      toast.error("Network error filing moderation report.", { icon: '⚠️' });
    }
  };

  return (
    <div className="glass-card p-6 pb-8 shrink-0 flex flex-col border-white/10 relative overflow-hidden group">
      <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-white/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="flex items-center justify-between mb-8 select-none relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl glass-card border-white/10 flex items-center justify-center text-white">
            <Settings size={20} />
          </div>
          <h3 className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Room Settings</h3>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">
            <span>Movie Volume</span>
            <span className="text-accent-gold">{movieVol}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={movieVol}
            onChange={handleMovieChange}
            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
            disabled={!isOwner}
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
            onChange={handleVoiceChange}
            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
            disabled={!isOwner}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Mute</span>
          <CustomToggle checked={banText} onChange={handleMuteChange} disabled={!isOwner} />
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
  const chatScrollContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
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
  const [currentUserData, setCurrentUserData] = useState(null);
  const [localVol, setLocalVol] = useState(65);
  const [micActive, setMicActive] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const video = playerRef.current;
    if (!video || !video.play) return;
    if (isPlaying) {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.volume !== undefined) {
      playerRef.current.volume = localVol / 100;
    }
  }, [localVol]);

  useEffect(() => {
    let unsubscribeDoc = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        unsubscribeDoc = onSnapshot(doc(db, 'users', currentUser.uid), snap => {
          if (snap.exists()) setCurrentUserData(snap.data());
        });
      } else {
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const participants = [
    { id: 1, name: currentUserData?.name || 'You', avatar: currentUserData?.avatar || auth.currentUser?.photoURL || 'https://i.pravatar.cc/150?u=3', isMuted: false, isHost: true, isSpeaking: false },
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
      keywords: ['Interstellar', 'The Last of Us', 'Violet', 'Silent', 'Titanic']
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
      keywords: ['Avengers', 'Jujutsu', 'Demon Slayer', 'Titan', 'Solo Leveling', 'The Boys', 'Gladiator', 'John Wick']
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

    const currentRoomCode = location.pathname.split('/').pop() || 'lobby';
    newSocket.emit('join_watch_room', {
      roomCode: currentRoomCode,
      userId: auth.currentUser?.uid || 'anon',
      username: auth.currentUser?.displayName || 'Guest'
    });

    // Realtime Sync Listeners
    newSocket.on('room_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('sync_play', ({ progress }) => {
      setIsPlaying(true);
      if (progress !== undefined && playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(progress);
      }
    });
    newSocket.on('sync_pause', ({ progress }) => {
      setIsPlaying(false);
      if (progress !== undefined && playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(progress);
      }
    });

    newSocket.on('sync_content', ({ content }) => {
      setSelectedContent(content);
      setShowMoodSelector(false);
      setIsPlaying(true);
      toast(`Host switched playing to: ${content.title}`, {
        icon: '🍿',
        style: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }
      });
    });

    newSocket.on('receive_reaction', (reaction) => {
      const floatReaction = { ...reaction, id: Date.now() + Math.random() };
      setFloatingReactions(prev => [...prev, floatReaction]);
      setTimeout(() => {
        setFloatingReactions(prev => prev.filter(r => r.id !== floatReaction.id));
      }, 2000);
    });

    newSocket.on('receive-entry-request', (data) => {
      if (isOwner) {
        toast((t) => (
          <div className="flex flex-col gap-3 w-full">
            <span className="font-bold text-sm">A user wants to enter the room</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  newSocket.emit('entry-accepted', { socketId: data.socketId });
                  toast.dismiss(t.id);
                  toast.success("Entry Granted");
                }}
                className="bg-accent-gold text-black px-3 py-1.5 rounded text-xs font-bold shadow-[0_0_15px_rgba(255,215,0,0.5)]"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  newSocket.emit('entry-declined', { socketId: data.socketId });
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

    newSocket.on('sync_seek', ({ progress }) => {
      if (!isOwner && playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(progress);
        setPlayed(progress);
      }
    });

    newSocket.on('entry-declined', () => {
      if (!isOwner) {
        toast.error("The room owner declined your request.");
        setTimeout(() => navigate('/party'), 2000);
      }
    });

    return () => newSocket.disconnect();
  }, [isOwner, navigate, location]);

  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePlayToggle = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    if (socket) {
      const currentRoomCode = location.pathname.split('/').pop();
      let currentProgress = 0;
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function' && duration > 0) {
        currentProgress = playerRef.current.getCurrentTime() / duration;
      }
      if (newState) {
        socket.emit('sync_play', { roomCode: currentRoomCode, progress: currentProgress });
      } else {
        socket.emit('sync_pause', { roomCode: currentRoomCode, progress: currentProgress });
      }
    }
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    const newPlayed = parseFloat(e.target.value);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(newPlayed);
    }
    if (socket && isOwner) {
      const currentRoomCode = location.pathname.split('/').pop();
      socket.emit('sync_seek', { roomCode: currentRoomCode, progress: newPlayed });
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msgData = {
      id: Date.now(),
      user: currentUserData?.name || auth.currentUser?.displayName || 'You',
      text: input,
      avatar: currentUserData?.avatar || auth.currentUser?.photoURL || 'https://i.pravatar.cc/150?u=3',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false
    };

    if (socket) {
      const currentRoomCode = location.pathname.split('/').pop();
      socket.emit('room_message', { roomCode: currentRoomCode, message: msgData });
    }

    setMessages([...messages, { ...msgData, user: 'You', isMe: true }]);
    setInput('');
  };

  const triggerReaction = (ReactionIcon, color, reactionId) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      iconId: reactionId,
      color: color,
      x: Math.random() * 80 + 10,
    };

    setFloatingReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);

    if (socket) {
      const currentRoomCode = location.pathname.split('/').pop();
      socket.emit('send_reaction', { roomCode: currentRoomCode, reaction: { iconId: reactionId, color: color, x: newReaction.x } });
    }
  };

  const handleContentSelect = async (item) => {
    let enrichedItem = { ...item };

    // If no local videoUrl, try Firestore
    if (!enrichedItem.videoUrl) {
      try {
        const movieDocRef = doc(db, 'movies', item.id);
        const movieSnap = await getDoc(movieDocRef);
        if (movieSnap.exists() && movieSnap.data().videoUrl) {
          enrichedItem.videoUrl = movieSnap.data().videoUrl;
          console.log(`🎬 WatchRoom: Found Firestore video for ${item.title}`);
        }
      } catch (e) {
        console.warn('WatchRoom Firestore fetch failed:', e.message);
      }
    }

    // YouTube fallbacks removed as per request
    if (!enrichedItem.videoUrl) {
      enrichedItem.videoUrl = ''; // Clear to prevent attempts to play YT
    }

    setSelectedContent(enrichedItem);
    setShowMoodSelector(false);
    setIsPlaying(true);

    if (socket) {
      const currentRoomCode = location.pathname.split('/').pop();
      socket.emit('sync_content', { roomCode: currentRoomCode, content: enrichedItem });
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      user: 'Bot',
      text: `Now playing: ${item.title}`,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=WatchWave',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: false
    }]);
  };

  const handleMicToggle = async () => {
    try {
      if (!micActive) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicActive(true);
        toast.success("Voice Chat Live", { icon: '🎙️', style: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
      } else {
        setMicActive(false);
        toast("Voice Muted", { icon: '🔇', style: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
      }
    } catch (err) {
      toast.error("Microphone access denied or unavailable.");
    }
  };

  if (isWaitingInLobby) {
    return (
      <div className="fixed inset-0 min-h-screen bg-transparent flex flex-col items-center justify-center z-[100] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 via-transparent to-white/5 opacity-50" />
        <div className="relative group">
          <div className="absolute inset-0 bg-accent-gold/20 blur-[100px] animate-pulse rounded-full" />
          <div className="w-24 h-24 border-2 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin mb-10 relative z-10 shadow-[0_0_50px_rgba(255,215,0,0.2)]" />
        </div>
        <h2 className="text-[10px] font-black text-white tracking-[0.6em] uppercase mb-4 relative z-10">Joining the Party</h2>
        <h3 className="text-4xl font-black text-white tracking-tighter uppercase relative z-10">Getting ready...</h3>
        <p className="text-gray-500 mt-6 text-[10px] font-black uppercase tracking-[0.2em] relative z-10 opacity-60">Connecting with your friends</p>
      </div>
    );
  }

  const recommendations = currentMood ? getRecommendations(currentMood) : [];

  return (
    <div className="min-h-screen text-white pt-24 pb-4 overflow-hidden flex flex-col h-screen font-sans selection:bg-accent-gold selection:text-black">


      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative max-w-[1920px] mx-auto w-full px-6 gap-6 pb-6 mt-4">

        {/* =========================================
            LEFT COLUMN: MAIN STAGE (Cinema Screen)
            ========================================= */}
        <div className="flex-1 lg:w-[84%] flex flex-col relative overflow-hidden glass-card border-white/5 shadow-2xl">

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
                  <div className="text-center w-full max-w-4xl">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-12">
                      <h3 className="text-sm font-semibold text-accent-gold mb-2">Pick Your Mood</h3>
                      <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">Set the Party<br/>Vibe</h2>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {moods.map((mood) => (
                        <motion.button
                          key={mood.id}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentMood(mood)}
                          className="glass-card p-8 flex flex-col items-center gap-4 group hover:border-accent-gold/40 shadow-xl relative overflow-hidden bg-white/[0.01] rounded-3xl"
                        >
                          <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${mood.color}`} />
                          <div className={`w-16 h-16 rounded-2xl ${mood.color} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-all duration-300`}>
                            <mood.icon size={32} strokeWidth={2.5} />
                          </div>
                          <div className="text-center relative z-10">
                            <h4 className="text-base font-semibold text-white mb-1 group-hover:text-accent-gold transition-colors">{mood.name}</h4>
                            <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-[150px] mx-auto">{mood.description}</p>
                          </div>
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Play size={12} fill="white" />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <button onClick={() => setShowMoodSelector(false)} className="mt-16 text-gray-500 hover:text-accent-gold text-[10px] font-black tracking-[0.3em] uppercase transition-all">Skip for Now</button>
                  </div>
                ) : (
                  <div className="w-full max-w-6xl">
                    <button onClick={() => setCurrentMood(null)} className="mb-12 text-gray-400 hover:text-white flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-colors">
                      <ArrowLeft size={16} /> Back to Genres
                    </button>
                    <div className="mb-12">
                      <h3 className="text-[10px] font-black text-accent-gold uppercase tracking-[0.4em] mb-4">Perfect for a {currentMood.name} night</h3>
                      <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Pick a Movie</h2>
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
                              {item.match}% MATCH
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
                <span className="opacity-40">Now Playing:</span>
                <span className="text-white ml-2">{selectedContent ? selectedContent.title : 'Waiting...'}</span>
              </h2>
            </div>
          </div>

          {/* Video Player Area */}
          <div className="flex-1 relative flex items-center justify-center bg-transparent group overflow-hidden">
            {selectedContent ? (
              <>
                {selectedContent.videoUrl ? (
                  /* Real Cloudinary Video Player */
                  <div className="absolute inset-0 w-full h-full bg-black">
                    <video
                      ref={(el) => {
                         if (el) {
                           el.seekTo = (fraction) => { 
                             if (el.duration) el.currentTime = fraction * el.duration; 
                           };
                           el.getCurrentTime = () => el.currentTime;
                         }
                         playerRef.current = el;
                      }}
                      src={selectedContent.videoUrl}
                      className="w-full h-full object-cover"
                      style={{ transform: 'scale(1.03)', transition: 'all 1s' }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={(e) => {
                        if (!seeking && e.currentTarget.duration) {
                          setPlayed(e.currentTarget.currentTime / e.currentTarget.duration);
                        }
                      }}
                      onLoadedMetadata={(e) => {
                        setDuration(e.currentTarget.duration);
                      }}
                      playsInline
                    />
                  </div>
                ) : (
                  /* Poster Image Fallback */
                  <>
                    <img
                      src={selectedContent.image?.includes('w500') ? selectedContent.image.replace('w500', 'original') : selectedContent.image}
                      alt="Video Feed"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'opacity-70 scale-100' : 'opacity-30 scale-110 grayscale blur-xl'}`}
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayToggle}
                      className="z-10 glass-pill-active p-10 rounded-full cursor-pointer transition-all shadow-2xl relative"
                    >
                      <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full -z-10" />
                      {isPlaying ? <Pause size={48} fill="white" /> : <Play size={48} fill="white" className="ml-2" />}
                    </motion.div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center z-10 p-8">
                <div className="glass-card p-12 rounded-3xl border-white/10 shadow-2xl">
                  <h3 className="text-sm font-medium text-gray-400 mb-6">Theater Screen Ready</h3>
                  <button
                    onClick={() => setShowMoodSelector(true)}
                    className="glass-pill-active px-8 py-3 text-sm font-semibold transition-all shadow-lg"
                  >
                    Select Stream
                  </button>
                </div>
              </div>
            )}

            {/* Floating Reactions overlay */}
            <div className="absolute inset-x-0 bottom-32 z-20 pointer-events-none h-96 overflow-hidden">
              <AnimatePresence>
                {floatingReactions.map(reaction => {
                  const Icon = reactions.find(r => r.id === reaction.iconId)?.icon || Heart;
                  return (
                    <motion.div
                      key={reaction.id}
                      initial={{ y: 0, opacity: 1, scale: 0.5 }}
                      animate={{ y: -500, opacity: 0, scale: 2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 3, ease: "easeOut" }}
                      className={`absolute ${reaction.color}`}
                      style={{ left: `${reaction.x}%` }}
                    >
                      <Icon size={48} fill="currentColor" className="drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-8 bg-black/60 backdrop-blur-3xl z-20 space-y-6">
            {/* Real-time Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                <span>{formatTime(played * duration)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="relative w-full h-1.5 group">
                <input
                  type="range"
                  min={0}
                  max={0.999999}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={!isOwner}
                />
                <div className="absolute inset-0 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent-gold shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                    style={{ width: `${played * 100}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  />
                </div>
                {isOwner && (
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ left: `calc(${played * 100}% - 6px)` }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-10">
                <button onClick={handlePlayToggle} className="text-gray-400 hover:text-white transition-all transform active:scale-90">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="flex items-center gap-4 group">
                  <Volume2 size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={localVol}
                    onChange={(e) => setLocalVol(e.target.value)}
                    className="w-24 h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Reaction Pool */}
                <div className="flex items-center glass-pill px-6 py-3 gap-6 border-white/5 shadow-2xl">
                  {reactions.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => triggerReaction(r.icon, r.color, r.id)}
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
                  <button onClick={handleMicToggle} className={`w-12 h-12 rounded-2xl glass-pill flex items-center justify-center transition-all border-white/5 ${micActive ? 'text-accent-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'text-gray-400 hover:text-white'}`}>
                    {micActive ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button onClick={() => {
                    if (socket) socket.emit('leave_watch_room', { roomCode: location.pathname.split('/').pop(), username: currentUserData?.name });
                    navigate('/party');
                  }}
                    className="w-12 h-12 rounded-2xl glass-pill-active flex items-center justify-center bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                  >
                    <PhoneOff size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN: SOCIAL PANEL (Compact Edition)
            ========================================= */}
        <div className="w-full lg:w-[16%] flex flex-col gap-6 shrink-0 overflow-y-auto custom-scrollbar">

          {/* Header Action Row */}
          <div className="flex items-center justify-between glass-pill p-3 border-white/5 shadow-2xl gap-3 flex-wrap">
            <div className="flex gap-2">
              <button onClick={() => navigate('/party')} className="w-10 h-10 flex items-center justify-center rounded-xl glass-pill border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                <LogOut size={16} />
              </button>
              <button onClick={() => setIsShareModalOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl glass-pill border-white/10 text-gray-300 hover:border-accent-gold/50 hover:text-accent-gold transition-all">
                <Share2 size={16} />
              </button>
            </div>

            <div className="flex -space-x-2.5">
              {participants.slice(0, 3).map((p) => (
                <div key={p.id} className="relative group shrink-0">
                  <img src={p.avatar} alt={p.name} className={`w-9 h-9 rounded-full border-2 object-cover transition-all ${p.isHost ? 'border-accent-gold shadow-[0_0_10px_rgba(255,215,0,0.3)]' : 'border-[#050505]'}`} />
                </div>
              ))}
              {participants.length > 3 && (
                <div className="w-9 h-9 rounded-full glass-card border-white/10 flex items-center justify-center text-[7px] font-black z-10 bg-black/40">+{participants.length - 3}</div>
              )}
            </div>
          </div>

          {/* Social Chat */}
          <div className="flex-1 min-h-[500px] glass-card border-white/5 flex flex-col overflow-hidden shadow-2xl rounded-3xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-r from-accent-gold/10 to-transparent text-sm font-semibold text-accent-gold shadow-sm">
              <div className="w-2 h-2 bg-accent-gold rounded-full animate-pulse shadow-[0_0_10px_#FFD700]" />
              Live Chat
            </div>

            <div ref={chatScrollContainerRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-3">
                  <div className="h-px w-16 bg-white/20" />
                  <span className="text-xs font-medium text-gray-300">Join the Conversation</span>
                  <div className="h-px w-16 bg-white/20" />
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="relative shrink-0">
                      <img src={msg.avatar} className="w-10 h-10 rounded-full shadow-md border border-white/10 object-cover" alt={msg.user} />
                    </div>
                    <div className={`flex flex-col max-w-[85%] ${msg.isMe ? 'items-end text-right' : 'items-start text-left'}`}>
                      <div className={`flex items-center gap-2 mb-1 opacity-60 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="text-xs font-semibold text-white">{msg.user}</span>
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.isMe
                        ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] text-white border border-white/20 rounded-tr-none'
                        : 'bg-white/[0.04] text-gray-200 border border-white/10 rounded-tl-none'
                        } backdrop-blur-xl`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl">
              <form onSubmit={handleSendMessage} className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Say something..."
                  className="w-full bg-black/50 backdrop-blur-sm text-sm text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none border border-white/10 focus:border-accent-gold/40 transition-all shadow-inner font-medium"
                />
                <button type="submit" disabled={!input.trim()} className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${input.trim() ? 'bg-accent-gold text-black' : 'text-gray-500'}`}>
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
          <RoomSettings isOwner={isOwner} socket={socket} roomCode={location.pathname.split('/').pop() || 'lobby'} />
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
