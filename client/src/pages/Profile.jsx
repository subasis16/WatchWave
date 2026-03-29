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



  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
          toast.error("Image too large. Please use an image under 20MB.", { style: { background: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(20px)' }});
          return;
      }
      toast("Uploading Profile Photo...", { icon: '⚙️', id: 'img-upload', style: { background: 'rgba(255,255,255,0.1)', color: '#fff' }});
      
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

  const handleSaveBio = async () => {
    try {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { bio: tempBio });
        setProfileData({ ...profileData, bio: tempBio });
        setIsEditingBio(false);
        toast.success("Bio updated successfully.");
      }
    } catch (err) {
      console.error("Error saving bio:", err);
      toast.error("Failed to update bio.");
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

      <div className="max-w-5xl mx-auto space-y-8 md:space-y-16 relative z-10 w-full px-2 md:px-0">
        
        {/* Header Component */}
        <div className="flex flex-col items-center text-center space-y-8 md:space-y-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-accent-gold/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-[2.5rem] md:rounded-[3rem] glass-card flex items-center justify-center overflow-hidden border border-white/10 shadow-3xl group-hover:-translate-y-2 transition-all duration-700 p-1.5">
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
              className="absolute bottom-2 right-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-[1.5rem] cursor-pointer transition-all duration-500 transform hover:scale-110 shadow-[0_8px_32px_rgba(0,0,0,0.5)] group flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <Upload className="w-5 h-5 text-white/70 group-hover:text-white relative z-10 transition-all duration-500" />
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-white uppercase text-center">{profileData.name}</h1>
              <div className="glass-pill border-accent-gold/20 text-accent-gold px-4 py-1.5 text-[7px] md:text-[8px] font-black tracking-[0.2em] flex items-center gap-2">
                <Crown size={12} /> PRO Member
              </div>
            </div>
            <div className="flex items-center gap-6">
            </div>

            <div className="flex items-center justify-center gap-4 w-full max-w-xl mx-auto pt-4">
              {isEditingBio ? (
                <div className="flex w-full items-center gap-3 glass-card p-2 border-white/10 rounded-2xl md:rounded-[1.5rem] shadow-2xl">
                  <input
                    type="text"
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    maxLength={150}
                    className="flex-1 bg-transparent px-3 md:px-4 py-2 md:py-3 text-[11px] md:text-[13px] text-white focus:outline-none placeholder:text-gray-700 font-medium"
                    autoFocus
                  />
                  <button onClick={handleSaveBio} className="w-8 h-8 md:w-10 md:h-10 glass-pill-active rounded-lg md:rounded-xl transition-all shadow-xl flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </button>
                </div>
              ) : (
                <div 
                    onClick={() => setIsEditingBio(true)}
                    className="group glass-card px-4 md:px-10 py-3 md:py-4 border-white/5 cursor-pointer hover:border-white/20 transition-all flex items-center gap-4 md:gap-5 shadow-2xl max-w-full overflow-hidden"
                >
                  <p className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] truncate group-hover:text-white transition-all">{profileData.bio}</p>
                  <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4 text-white opacity-20 group-hover:opacity-100 transition-all shrink-0" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Actions */}
         <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 md:gap-8 pt-6 md:pt-10">
          <button onClick={() => navigate('/settings')} className="glass-card bg-white/[0.01] hover:bg-white/[0.06] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-700 flex flex-col items-center justify-center gap-3 md:gap-4 group border-white/5 shadow-2xl">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl glass-card flex items-center justify-center border-white/10 group-hover:border-accent-gold/40 transition-all">
                <Globe size={18} className="text-gray-500 group-hover:text-accent-gold transition-all" />
            </div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 group-hover:text-white transition-all text-center">Settings</span>
          </button>

          <button onClick={handleLogout} className="glass-card bg-white/[0.01] hover:bg-white/[0.06] p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-700 flex flex-col items-center justify-center gap-3 md:gap-4 group border-white/5 shadow-2xl">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl glass-card flex items-center justify-center border-white/10 group-hover:border-red-500/40 transition-all">
                <LogOut size={18} className="text-gray-500 group-hover:text-red-500 transition-all" />
            </div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 group-hover:text-white transition-all text-center">Logout</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
