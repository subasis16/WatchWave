import React, { useState, useEffect } from 'react';
import { 
  User, Upload, Sparkles, Hash, Copy, Pencil, Check, Award, ShieldAlert, 
  Lock, Eye, EyeOff, Star, Crown, Zap, Shield, Heart, Gem, LogOut, 
  Globe, Subtitles, Play, Users, Scissors, ChevronDown 
} from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: null,
    uid: '',
    bio: '',
    isOnline: true,
    language: 'English',
    subtitles: 'English',
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Korean'];
  const subtitleOptions = ['Off', 'English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Korean'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const loadedData = {
              name: data.name || user.displayName || 'Cinema Fanatic',
              email: user.email,
              avatar: data.avatar || user.photoURL || null,
              uid: user.uid,
              bio: data.bio || 'New explorer in the cinematic world.',
              isOnline: data.isOnline ?? true,
              language: data.language || 'English',
              subtitles: data.subtitles || 'English',
            };
            setProfileData(loadedData);
            setTempBio(loadedData.bio);
          } else {
            const fallbackData = {
              name: user.displayName || 'Cinema Fanatic',
              email: user.email,
              avatar: user.photoURL || null,
              uid: user.uid,
              bio: 'New explorer in the cinematic world.',
              isOnline: true,
              language: 'English',
              subtitles: 'English',
            };
            setProfileData(fallbackData);
            setTempBio(fallbackData.bio);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        navigate('/auth');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const badges = [
    { id: 'b1', title: 'Premium VIP', desc: 'Active Subscription', icon: Crown, unlocked: true },
    { id: 'b2', title: 'Shining Shot', desc: 'Hosted 50 Parties', icon: Sparkles, unlocked: true },
    { id: 'b3', title: 'Popular Idol', desc: '100+ Friends', icon: Star, unlocked: true },
    { id: 'b4', title: 'Richie Rich', desc: 'Gifted 10 times', icon: Gem, unlocked: true },
    { id: 'b5', title: 'Vast Wealth', desc: 'Top 1% Watcher', icon: Zap, unlocked: true },
    { id: 'b6', title: 'The General', desc: 'Room Moderator', icon: Shield, unlocked: false },
    { id: 'b7', title: 'Love U Forever', desc: 'Watch a romance movie', icon: Heart, unlocked: false },
  ];

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
          toast.error("Image too large. Please use an image under 20MB.", { style: { background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' }});
          return;
      }
      toast("Syncing Image Engine...", { icon: '⚙️', id: 'img-upload', style: { background: 'rgba(255,255,255,0.1)', color: '#fff' }});
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 500; // Perfect, retina crisp compression size
          
          // Math calc aspect ratio down-sampler
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Drop payload safely to 80% JPEG compression (often <100kb payload!)
          const compressedData = canvas.toDataURL('image/jpeg', 0.8);
          
          setProfileData(prev => ({ ...prev, avatar: compressedData }));
          
          if (auth.currentUser) {
              try {
                  const userRef = doc(db, 'users', auth.currentUser.uid);
                  await updateDoc(userRef, { avatar: compressedData });
                  toast.success("Profile Uploaded & Database Synced!", { id: 'img-upload', icon: '📸', style: { background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' }});
              } catch (err) {
                  console.error("Error saving optimized avatar:", err);
                  toast.error("Database Payload Reject limit hit.", { id: 'img-upload' });
              }
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBio = () => {
    setProfileData({ ...profileData, bio: tempBio });
    setIsEditingBio(false);
  };

  const handleSaveProfile = async () => {
    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          bio: profileData.bio,
          isOnline: profileData.isOnline,
          avatar: profileData.avatar,
          language: profileData.language,
          subtitles: profileData.subtitles
        });
        toast.success("User Profile Updated", { style: { background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' } });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Connection Failed");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-white">
        <div className="relative">
            <div className="w-16 h-16 border-2 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin shadow-2xl" />
            <div className="absolute inset-0 bg-accent-gold/10 blur-xl animate-pulse rounded-full" />
        </div>
    </div>
  );

  return (
    <div className="pt-32 px-8 min-h-screen pb-24 relative overflow-hidden text-white bg-transparent selection:bg-accent-gold selection:text-black">
      {/* Dynamic Background Field */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] right-[-5%] w-[45%] h-[45%] bg-white/[0.03] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[5%] left-[-5%] w-[35%] h-[35%] bg-accent-gold/[0.08] blur-[130px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        
        {/* Header Component */}
        <div className="flex flex-col items-center text-center space-y-10">
          <div className="relative group">
            {/* Premium Glow Profile */}
            <div className="absolute inset-0 bg-accent-gold/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
            <div className="w-48 h-48 rounded-[3rem] glass-card flex items-center justify-center overflow-hidden border border-white/10 shadow-3xl group-hover:-translate-y-2 transition-all duration-700 p-1.5">
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <User className="w-20 h-20 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
            
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-4 right-4 glass-pill-active p-3.5 rounded-2xl cursor-pointer transition-all transform hover:scale-110 shadow-2xl"
            >
              <Upload className="w-5 h-5 text-white" />
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-6xl font-black tracking-tighter text-white uppercase">{profileData.name}</h1>
                    <div className="glass-pill border-accent-gold/20 text-accent-gold px-4 py-1.5 text-[8px] font-black tracking-[0.2em] flex items-center gap-2">
                        <Crown size={12} /> PRO Screen
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-500 font-black text-[10px] uppercase tracking-widest">
                        <Hash size={12} className="text-accent-gold" />
                        screen-0034-alpha
                    </div>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
              {isEditingBio ? (
                <div className="flex w-full items-center gap-3 glass-card p-3 border-white/10 rounded-[1.5rem] shadow-2xl">
                  <input
                    type="text"
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    maxLength={150}
                    className="flex-1 bg-transparent px-5 py-3 text-[13px] text-white focus:outline-none placeholder:text-gray-700 font-medium"
                    autoFocus
                  />
                  <button onClick={handleSaveBio} className="w-10 h-10 glass-pill-active rounded-xl transition-all shadow-xl flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div 
                    onClick={() => setIsEditingBio(true)}
                    className="group glass-pill-active px-10 py-4 border-white/5 cursor-pointer hover:border-white/20 transition-all flex items-center gap-5 shadow-2xl"
                >
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{profileData.bio}</p>
                  <Pencil className="w-4 h-4 text-white opacity-40 group-hover:opacity-100 transition-all" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Watch Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[ 
                { label: 'Connected', value: '1,240m', icon: Play },
                { label: 'Session Screens', value: '48', icon: Users },
                { label: 'Captured Clips', value: '23', icon: Scissors },
                { label: 'Transmission', value: 'Live', icon: Globe }
            ].map((stat, i) => (
                <div key={i} className="glass-card p-8 border-white/5 group hover:border-white/10 transition-all cursor-default relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-white/5 blur-2xl rounded-full" />
                    <stat.icon className="text-gray-600 mb-6 group-hover:text-white transition-all" size={20} />
                    <div className="text-white text-3xl font-black tracking-tighter mb-2">{stat.value}</div>
                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.3em]">{stat.label}</div>
                </div>
            ))}
        </div>

        {/* Global Achievement Catalog */}
        <div className="glass-card p-12 relative overflow-hidden border-white/5 shadow-3xl">
          <div className="absolute top-[-40%] right-[-15%] w-96 h-96 bg-accent-gold/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] flex items-center gap-4">
                <div className="w-1.5 h-1.5 bg-accent-gold rounded-full" />
                Prestige Catalog
            </h2>
            <span className="text-[12px] font-black text-accent-gold">5 / 7 UNLOCKED</span>
          </div>

          <div className="flex flex-wrap gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`group relative flex items-center gap-5 px-6 py-4 rounded-[1.5rem] transition-all duration-700 cursor-pointer overflow-hidden
                  ${badge.unlocked
                    ? 'glass-card border-white/5 text-white hover:border-white/20'
                    : 'bg-white/[0.01] text-gray-700 border border-white/[0.02]'
                  }`}
              >
                {badge.unlocked && <div className="absolute inset-0 bg-accent-gold/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />}
                <div className={`${badge.unlocked ? 'text-accent-gold' : 'text-gray-800'} transition-all group-hover:scale-110`}>
                    <badge.icon size={20} />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-1">{badge.title}</div>
                    <div className={`text-[8px] font-black uppercase tracking-widest ${badge.unlocked ? 'text-gray-500' : 'text-gray-800'}`}>
                        {badge.unlocked ? badge.desc : 'RESTRICTED'}
                    </div>
                </div>
                {!badge.unlocked && <Lock size={12} className="absolute top-4 right-4 text-gray-800" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Cinematic Prefs */}
          <div className="glass-card p-12 relative overflow-hidden border-white/5 shadow-2xl">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
              <Globe className="w-5 h-5 text-white" />
              Language Core
            </h2>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Interpreted Identity</label>
                <div className="relative">
                    <select
                    value={profileData.language}
                    onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                    className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 text-[11px] font-black uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-white/20 transition-all shadow-inner relative z-10"
                    >
                    {languages.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                        <ChevronDown size={14} />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Viewing History</label>
                <div className="relative">
                    <select
                    value={profileData.subtitles}
                    onChange={(e) => setProfileData({ ...profileData, subtitles: e.target.value })}
                    className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 text-[11px] font-black uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-white/20 transition-all shadow-inner relative z-10"
                    >
                    {subtitleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                        <ChevronDown size={14} />
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Screen */}
          <div className="glass-card p-12 relative overflow-hidden border-white/5 shadow-2xl">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
              <Lock className="w-5 h-5 text-white" />
              Access Vector
            </h2>

            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Communication Screen</label>
                <div className="w-full glass-card border-white/5 rounded-2xl p-5 text-[11px] font-black uppercase tracking-widest text-gray-500">
                  {profileData.email}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">Transmission Key</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={profileData.uid}
                    readOnly
                    className="w-full bg-[#0c0c0c] border border-white/5 rounded-2xl p-5 text-[9px] font-black text-white/30 tracking-[0.3em] uppercase cursor-not-allowed"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profileData.uid);
                      toast.success("Key Copied");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 glass-pill p-2 rounded-xl border-white/10 hover:bg-accent-gold hover:text-black transition-all"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Sync */}
        <div className="glass-card p-12 flex flex-col md:flex-row items-center justify-between gap-10 border-white/5 shadow-3xl group">
          <div className="flex items-center gap-8">
            <div className={`p-6 rounded-[2rem] glass-card border-white/10 transition-all duration-1000 ${profileData.isOnline ? 'shadow-[0_0_50px_rgba(34,197,94,0.3)] border-green-500/30' : ''}`}>
              {profileData.isOnline ? <Eye className="w-8 h-8 text-green-500" /> : <EyeOff className="w-8 h-8 text-gray-600" />}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Profile Visibility</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Show my online status to all users</p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={profileData.isOnline}
                onChange={(e) => setProfileData({ ...profileData, isOnline: e.target.checked })}
              />
              <div className="w-20 h-10 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-10 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 after:border-white/10 after:border after:rounded-full after:h-8 after:w-8 after:transition-all duration-500 peer-checked:bg-green-500/20"></div>
            </label>
            <button
              onClick={handleSaveProfile}
              className="glass-pill-active px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl"
            >
              Force Sync
            </button>
          </div>
        </div>

        {/* Destruction Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <button onClick={handleLogout} className="glass-card bg-white/[0.01] hover:bg-white/[0.06] p-8 rounded-[2.5rem] transition-all duration-700 flex items-center justify-center gap-5 group border-white/5">
            <LogOut size={24} className="text-gray-600 group-hover:text-white transition-all transform group-hover:-translate-x-2" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-white transition-all">Log Out</span>
          </button>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to unlink this account? Your data will be wiped.")) {
                toast.success("Account unlinked successfully.");
                handleLogout();
              }
            }}
            className="glass-card border-red-500/10 bg-red-500/[0.01] hover:bg-red-500/[0.05] p-8 rounded-[2.5rem] transition-all duration-700 group"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/30 group-hover:text-red-500 transition-all">Unlink Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
