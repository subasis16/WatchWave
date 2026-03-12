import React, { useState, useEffect } from 'react';
import { User, Upload, Sparkles, Hash, Copy, Pencil, Check, Award, ShieldAlert, Lock, Eye, EyeOff, Star, Crown, Zap, Shield, Heart, Gem, LogOut } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
  });

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');

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
              bio: data.bio || 'New explorer in the cinematic universe.',
              isOnline: data.isOnline ?? true,
            };
            setProfileData(loadedData);
            setTempBio(loadedData.bio);
          } else {
            const fallbackData = {
              name: user.displayName || 'Cinema Fanatic',
              email: user.email,
              avatar: user.photoURL || null,
              uid: user.uid,
              bio: 'New explorer in the cinematic universe.',
              isOnline: true,
            };
            setProfileData(fallbackData);
            setTempBio(fallbackData.bio);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        navigate('/auth'); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const badges = [
    { id: 'b1', title: 'Premium VIP', desc: 'Active Subscription', icon: Crown, unlocked: true, style: 'bg-gradient-to-r from-neutral-900 to-black border border-yellow-500/50 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]', iconColor: 'text-yellow-500' },
    { id: 'b2', title: 'Shining Shot', desc: 'Hosted 50 Parties', icon: Sparkles, unlocked: true, style: 'bg-gradient-to-r from-cyan-400 to-blue-600 border border-cyan-300 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]', iconColor: 'text-white' },
    { id: 'b3', title: 'Popular Idol', desc: '100+ Friends', icon: Star, unlocked: true, style: 'bg-gradient-to-r from-indigo-500 to-purple-600 border border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]', iconColor: 'text-white' },
    { id: 'b4', title: 'Richie Rich', desc: 'Gifted 10 times', icon: Gem, unlocked: true, style: 'bg-gradient-to-r from-yellow-400 to-orange-500 border border-yellow-300 text-white shadow-[0_0_15px_rgba(250,204,21,0.4)]', iconColor: 'text-white' },
    { id: 'b5', title: 'Vast Wealth', desc: 'Top 1% Watcher', icon: Zap, unlocked: true, style: 'bg-gradient-to-r from-fuchsia-500 to-pink-500 border border-fuchsia-400 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)]', iconColor: 'text-yellow-300' },
    { id: 'b6', title: 'The General', desc: 'Room Moderator', icon: Shield, unlocked: false, style: 'bg-gradient-to-r from-teal-700 to-emerald-900 border border-teal-500 text-yellow-400 shadow-[0_0_15px_rgba(20,184,166,0.4)]', iconColor: 'text-yellow-400' },
    { id: 'b7', title: 'Love U Forever', desc: 'Watch a romance movie', icon: Heart, unlocked: false, style: 'bg-gradient-to-r from-blue-400 to-purple-400 border border-blue-300 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]', iconColor: 'text-white' },
  ];

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
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
          avatar: profileData.avatar
        });
        alert("Premium Profile successfully updated to Firebase!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to sync profile changes.");
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Profile Hub...</div>;

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 min-h-screen pb-16 bg-black text-white">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Public Identity Section */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative group cursor-pointer inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#E50914] to-red-900 flex items-center justify-center overflow-hidden border-4 border-[#1A1A1A] shadow-[0_0_30px_rgba(229,9,20,0.3)] group-hover:shadow-[0_0_40px_rgba(229,9,20,0.5)] transition-all">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-1 bg-[#1A1A1A] border border-neutral-700 hover:bg-neutral-800 text-white p-2.5 rounded-full cursor-pointer transition-all transform hover:scale-110 shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-3">{profileData.name}</h1>

            <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
              {isEditingBio ? (
                <div className="flex w-full items-center gap-2">
                  <input
                    type="text"
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    maxLength={150}
                    className="flex-1 bg-[#1A1A1A] border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#E50914] transition-colors"
                    autoFocus
                  />
                  <button onClick={handleSaveBio} className="p-2 bg-[#E50914] rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                    <Check className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <p className="text-gray-400 text-sm max-w-[300px] break-words leading-relaxed">{profileData.bio}</p>
                  <button onClick={() => setIsEditingBio(true)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wave Prestige & Titles (Modern Pill Badges) */}
        <div className="bg-[#1A1A1A] border border-neutral-800/50 rounded-2xl p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E50914]/5 blur-[100px] rounded-full pointer-events-none"></div>

          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <Award className="w-5 h-5 text-[#E50914]" />
            Prestige & Titles
          </h2>

          <div className="flex flex-wrap gap-3 relative z-10">
            {badges.map((badge) => (
              <div
                key={badge.id}
                title={badge.desc}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-[13px] tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer hover:z-20
                  ${badge.unlocked
                    ? badge.style
                    : 'bg-neutral-900 text-neutral-500 border border-neutral-800 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                  }`}
              >
                {!badge.unlocked && (
                  <div className="absolute -top-1 -right-1 bg-black rounded-full p-0.5 border border-neutral-700 z-10">
                    <Lock className="w-2.5 h-2.5 text-neutral-400" />
                  </div>
                )}

                <badge.icon className={`w-4 h-4 ${badge.unlocked ? badge.iconColor : 'text-neutral-500'}`} fill={badge.unlocked ? 'currentColor' : 'none'} />
                <span className="drop-shadow-md whitespace-nowrap">{badge.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-[#1A1A1A] border border-neutral-800/50 rounded-2xl p-8 backdrop-blur-md shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <User className="w-5 h-5 text-[#E50914]" />
            Account Details
          </h2>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {/* Email (Read Only) */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E50914]" /> Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                readOnly
                className="w-full bg-black/50 border border-neutral-800/80 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed focus:outline-none shadow-inner"
              />
            </div>

            {/* Unique User ID */}
            <div>
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-[#E50914]" /> Unique User ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.uid}
                  readOnly
                  className="w-full bg-black/50 border border-neutral-700/80 rounded-xl px-4 py-3 text-[#E50914] font-bold font-mono tracking-[0.2em] cursor-not-allowed focus:outline-none shadow-inner"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profileData.uid);
                    alert("UID copied to clipboard!");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer bg-neutral-800 p-1.5 rounded-md border border-neutral-700 hover:border-neutral-500 shadow-sm"
                  title="Copy UID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Plan Status */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gradient-to-r from-neutral-900 to-black border border-neutral-800/50 rounded-xl shadow-inner">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Subscription Plan</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20 shadow-[0_0_10px_rgba(229,9,20,0.1)]">
                  <Star className="w-3.5 h-3.5 fill-[#E50914]" /> WatchWave Premium
                </span>
              </div>
              <button className="mt-4 sm:mt-0 text-sm font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                Manage Plan
              </button>
            </div>

            {/* Online Status Toggle */}
            <div className="md:col-span-2 flex items-center justify-between p-5 bg-black/30 border border-neutral-800/50 rounded-xl shadow-inner">
              <div>
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  {profileData.isOnline ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-neutral-500" />}
                  Online Status
                </h3>
                <p className="text-xs text-gray-500">Show your status in the Wave Lounge globally</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={profileData.isOnline}
                  onChange={(e) => setProfileData({ ...profileData, isOnline: e.target.checked })}
                />
                <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E50914]"></div>
              </label>
            </div>

          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveProfile}
              className="bg-[#E50914] hover:bg-red-700 active:bg-red-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] flex items-center gap-2"
            >
              Update Profile
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#1A1A1A] border border-red-900/30 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none"></div>

          <h2 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2 relative z-10">
            <ShieldAlert className="w-5 h-5" />
            Danger Zone
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button onClick={handleLogout} className="flex-1 bg-black hover:bg-neutral-900 text-white border border-neutral-800 hover:border-neutral-700 font-semibold px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
              <LogOut size={18} /> Sign Out securely
            </button>
            <button className="flex-1 bg-black/50 hover:bg-red-950/40 text-red-500 border border-red-500/30 hover:border-red-500 font-semibold px-6 py-3.5 rounded-xl transition-all shadow-sm">
              Delete Account
            </button>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default Profile;
