import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility, Globe, HandMetal, Eye, Lock, Crown,
  ShieldAlert, Clock, BarChart3, Moon, Volume2,
  Bell, Check, User, CreditCard, PlayCircle, Download, ShieldCheck, HeartPulse, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect } from 'react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Account');
  const [showMenu, setShowMenu] = useState(true); // Mobile menu toggle
  const [dbUser, setDbUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    let unsubscribeDoc = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setAuthUser(currentUser);
      if (currentUser) {
         unsubscribeDoc = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
            if (docSnap.exists()) setDbUser(docSnap.data());
         }, (err) => {});
      } else {
         setDbUser(null);
         if (unsubscribeDoc) unsubscribeDoc();
      }
    });
    return () => {
        unsubscribeAuth();
        if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);
  const { 
    autoplay, updateSetting, toggleSetting,
    audioDesc, rating, pinEnabled, dailyLimit,
    highContrast, motionReduction
  } = useSettings();

  const tabs = [
    { id: 'Account', icon: User },
    { id: 'Subscription', icon: CreditCard },
    { id: 'Accessibility', icon: Accessibility },
    { id: 'Language', icon: Globe }
  ];


  const CustomToggle = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-700 focus:outline-none border border-white/5 ${
        checked ? 'bg-accent-gold shadow-[0_0_25px_rgba(255,215,0,0.3)]' : 'bg-white/5'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-500 shadow-xl ${
          checked ? 'translate-x-8' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen pt-32 pb-24 px-8 font-sans text-white bg-transparent selection:bg-accent-gold selection:text-black overflow-hidden relative">
      {/* Dynamic Background Field */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-white/[0.03] blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-accent-gold/[0.06] blur-[180px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar */}
          <div className={`w-full lg:w-[320px] shrink-0 ${!showMenu ? 'hidden lg:block' : 'block'}`}>
            <nav className="flex flex-col space-y-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowMenu(false);
                  }}
                  className={`flex items-center gap-5 text-left px-8 py-5 rounded-[2.5rem] transition-all duration-700 group relative overflow-hidden border ${
                    activeTab === tab.id
                      ? 'glass-pill-active border-white/20 shadow-3xl'
                      : 'text-gray-600 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={20} className={`${activeTab === tab.id ? 'text-white' : 'text-gray-600 group-hover:text-white'} transition-colors duration-700`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">{tab.id}</span>
                  {activeTab === tab.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-gold rounded-full" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Configuration Screen */}
          <div className={`flex-1 ${showMenu ? 'hidden lg:block' : 'block'}`}>
            <div className="mb-20 space-y-8">
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setShowMenu(true)}
                  className="lg:hidden flex items-center gap-4 text-gray-500 hover:text-white transition-all group mb-8"
                >
                  <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center border-white/5 group-hover:border-white/20">
                    <ArrowLeft size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Menu</span>
                </button>

                <div className="mb-12 lg:mb-20 space-y-4">
                <h3 className="text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Account Settings</h3>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">{activeTab}</h2>
            </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="space-y-10"
              >
                {/* ACCOUNT TAB */}
                {activeTab === 'Account' && (
                  <div className="glass-card p-8 md:p-16 border-white/5 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 hidden md:block">
                       <User size={120} />
                    </div>
                    <h2 className="text-[9px] md:text-[10px] font-black mb-8 md:mb-12 text-gray-500 uppercase tracking-[0.4em]">Identity Authentication</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                      <div className="flex items-center gap-10">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-[2rem] glass-card p-1 border-white/10 group-hover:scale-105 transition-all duration-700 shadow-3xl">
                                <img 
                                  src={dbUser?.avatar || authUser?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser?.displayName || 'User'}`}
                                  alt="User Avatar" 
                                  className="w-full h-full rounded-[1.8rem] object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 rounded-[2.5rem] bg-accent-gold/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-all -z-10" />
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex items-center gap-3 md:gap-4">
                              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight truncate max-w-[200px] md:max-w-sm">{dbUser?.name || authUser?.displayName || 'User Screen'}</h3>
                              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                          </div>
                          <p className="text-[8px] md:text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] font-mono">{authUser?.email || 'user@watchwave.io'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/profile')}
                        className="glass-pill-active px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all transform hover:scale-105 shadow-3xl"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                )}

                {/* SUBSCRIPTION TAB */}
                {activeTab === 'Subscription' && (
                  <div className="glass-card p-8 md:p-16 border-white/5 shadow-3xl overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent-gold/5 blur-[100px] rounded-full" />
                    <h2 className="text-[9px] md:text-[10px] font-black mb-8 md:mb-12 text-gray-500 uppercase tracking-[0.4em]">Resource Allocation</h2>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                      <div className="space-y-6">
                        <div className="glass-pill border-accent-gold/30 text-accent-gold text-[12px] font-black uppercase tracking-[0.3em] px-8 py-3 shadow-[0_0_30px_rgba(255,215,0,0.1)] inline-flex items-center gap-3">
                          <Crown size={16} /> Resolution [8K]
                        </div>
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] max-w-sm leading-relaxed">Admin Privileges Active until Cycle 2027. Multi-screen streaming active.</p>
                      </div>
                      <button 
                        onClick={() => navigate('/plans')}
                        className="glass-pill-active px-12 py-5 text-[11px] font-black uppercase tracking-[0.4em] transition-all hover:border-accent-gold shadow-3xl"
                      >
                        Recalibrate Tier
                      </button>
                    </div>
                  </div>
                )}




                {/* ACCESSIBILITY TAB */}
                {activeTab === 'Accessibility' && (
                  <div className="glass-card p-8 md:p-16 border-white/5 shadow-3xl">
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-8 md:mb-12">Accessibility Core</h2>
                    <div className="space-y-12">
                      <div className="flex items-center justify-between border-b border-white/5 pb-12">
                        <div className="pr-10 space-y-3">
                          <h2 className="text-xl font-black text-white uppercase tracking-tighter">High Contrast Screen</h2>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-loose">Maximize legibility across cinematic interfaces.</p>
                        </div>
                        <CustomToggle checked={highContrast} onChange={() => toggleSetting('highContrast')} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="pr-10 space-y-3">
                          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Motion Reduction</h2>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-loose">Disable auto-play for easier viewing and less motion.</p>
                        </div>
                        <CustomToggle checked={motionReduction} onChange={() => toggleSetting('motionReduction')} />
                      </div>
                    </div>
                  </div>
                )}



                {/* LANGUAGE TAB */}
                {activeTab === 'Language' && (
                  <div className="glass-card p-8 md:p-16 border-white/5 space-y-10 md:space-y-12 shadow-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 hidden md:block">
                       <Globe size={120} />
                    </div>
                    <div className="relative z-10 space-y-8 md:space-y-12">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Primary Interface Language</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['English', 'Hindi'].map((lang) => (
                            <button
                              key={lang}
                              onClick={async () => {
                                updateSetting('language', lang);
                                if (authUser) {
                                  await updateDoc(doc(db, 'users', authUser.uid), { language: lang });
                                }
                                toast.success(`Language set to ${lang}`);
                              }}
                              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                (dbUser?.language || 'English') === lang 
                                  ? 'bg-accent-gold text-black border-accent-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]' 
                                  : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-12 border-t border-white/5">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Subtitles & Captions</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {['Off', 'English', 'Hindi'].map((opt) => (
                            <button
                              key={opt}
                              onClick={async () => {
                                updateSetting('subtitles', opt);
                                if (authUser) {
                                  await updateDoc(doc(db, 'users', authUser.uid), { subtitles: opt });
                                }
                                toast.success(`Subtitles set to ${opt}`);
                              }}
                              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                (dbUser?.subtitles || 'Off') === opt 
                                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                  : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
