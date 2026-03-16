import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility, Globe, HandMetal, Eye, Lock, Crown,
  ShieldAlert, Clock, BarChart3, Moon, Volume2,
  Bell, Check, User, CreditCard, PlayCircle, Download, ShieldCheck, HeartPulse
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Account');
  const { 
    autoplay, updateSetting, toggleSetting,
    audioDesc, rating, pinEnabled, dailyLimit,
    highContrast, motionReduction
  } = useSettings();

  const tabs = [
    { id: 'Account', icon: User },
    { id: 'Subscription', icon: CreditCard },
    { id: 'Playback', icon: PlayCircle },
    { id: 'Safety', icon: ShieldCheck },
    { id: 'Wellbeing', icon: HeartPulse },
    { id: 'Accessibility', icon: Accessibility },
    { id: 'Downloads', icon: Download }
  ];

  const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  const weekData = [45, 120, 90, 60, 200, 150, 80];
  const maxTime = Math.max(...weekData);

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
          <div className="w-full lg:w-[320px] shrink-0">
            <nav className="flex flex-col space-y-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-5 text-left px-8 py-5 rounded-[1.5rem] transition-all duration-700 group relative overflow-hidden border ${
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
          <div className="flex-1">
            <div className="mb-20 space-y-4">
                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.6em]">Account Settings</h3>
                <h2 className="text-7xl font-black text-white tracking-tighter uppercase leading-none">{activeTab}</h2>
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
                  <div className="glass-card p-12 md:p-16 border-white/5 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                       <User size={120} />
                    </div>
                    <h2 className="text-[10px] font-black mb-12 text-gray-500 uppercase tracking-[0.4em]">Identity Authentication</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                      <div className="flex items-center gap-10">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-[2rem] glass-card p-1 border-white/10 group-hover:scale-105 transition-all duration-700 shadow-3xl">
                                <img 
                                  src="https://i.pravatar.cc/200?u=subasis" 
                                  alt="User Avatar" 
                                  className="w-full h-full rounded-[1.8rem] object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 rounded-[2.5rem] bg-accent-gold/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-all -z-10" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                              <h3 className="text-4xl font-black text-white uppercase tracking-tight">Subasis Screen</h3>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                          </div>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] font-mono">subasis@watchwave.io</p>
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
                  <div className="glass-card p-12 md:p-16 border-white/5 shadow-3xl overflow-hidden relative">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent-gold/5 blur-[100px] rounded-full" />
                    <h2 className="text-[10px] font-black mb-12 text-gray-500 uppercase tracking-[0.4em]">Resource Allocation</h2>
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

                {/* PLAYBACK TAB */}
                {activeTab === 'Playback' && (
                  <div className="glass-card p-12 md:p-16 border-white/5 space-y-12 shadow-3xl">
                    <div className="flex items-center justify-between">
                      <div className="pr-10 space-y-3">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Auto-Play Next Episode</h2>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-loose">Automatically play the next episode in a series.</p>
                      </div>
                      <CustomToggle checked={autoplay} onChange={() => toggleSetting('autoplay')} />
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-12">
                      <div className="pr-10 space-y-3">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Audio Description</h2>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-loose">Audio description for visually impaired viewers.</p>
                      </div>
                      <CustomToggle checked={audioDesc} onChange={() => toggleSetting('audioDesc')} />
                    </div>
                  </div>
                )}

                {/* SAFETY TAB */}
                {activeTab === 'Safety' && (
                  <div className="glass-card p-12 md:p-16 border-white/5 space-y-16 shadow-3xl">
                    <div className="space-y-10">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Age Filter</h2>
                        <div className="glass-card px-6 py-2.5 font-black text-accent-gold border-accent-gold/10 text-[12px] shadow-2xl">
                          {ratings[rating]}
                        </div>
                      </div>
                      <div className="relative h-2 bg-white/5 rounded-full">
                        <div className="absolute inset-y-0 left-0 bg-accent-gold rounded-full shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all duration-500" style={{ width: `${(rating / 4) * 100}%` }} />
                        <input
                          type="range"
                          min="0"
                          max="4"
                          step="1"
                          value={rating}
                          onChange={(e) => updateSetting('rating', parseInt(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-16">
                      <div className="pr-10 space-y-3">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Profile Lock</h2>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-loose">Require a PIN to access this profile.</p>
                      </div>
                      <CustomToggle checked={pinEnabled} onChange={() => toggleSetting('pinEnabled')} />
                    </div>
                  </div>
                )}

                {/* WELLBEING TAB */}
                {activeTab === 'Wellbeing' && (
                  <div className="glass-card p-12 md:p-16 border-white/5 space-y-20 shadow-3xl">
                    <div className="space-y-12">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Playback Dynamics</h2>
                      <div className="flex items-end justify-between h-56 gap-6">
                        {weekData.map((mins, i) => (
                          <div key={i} className="flex flex-col items-center flex-1 group relative">
                            <div className="w-full flex justify-end flex-col h-full rounded-[1.2rem] bg-white/[0.03] overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(mins / maxTime) * 100}%` }}
                                transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                                className={`w-full ${mins > dailyLimit ? 'bg-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]'} transition-all`}
                              />
                            </div>
                            <span className="text-[10px] text-gray-600 mt-6 font-black tracking-widest">
                              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-16 space-y-10">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Quota Threshold</h2>
                        <span className="text-accent-gold font-black tracking-[0.2em] text-[14px] font-mono">{Math.floor(dailyLimit / 60)}H {dailyLimit % 60}M</span>
                      </div>
                      <div className="relative h-2 bg-white/5 rounded-full">
                        <div className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_20px_white] transition-all duration-300" style={{ width: `${(dailyLimit / 300) * 100}%` }} />
                        <input
                          type="range"
                          min="30"
                          max="300"
                          step="15"
                          value={dailyLimit}
                          onChange={(e) => updateSetting('dailyLimit', parseInt(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ACCESSIBILITY TAB */}
                {activeTab === 'Accessibility' && (
                  <div className="glass-card p-12 md:p-16 border-white/5 shadow-3xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-12">Accessibility Core</h2>
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

                {/* DOWNLOADS TAB */}
                {activeTab === 'Downloads' && (
                  <div className="glass-card p-12 md:p-16 border-white/5 shadow-3xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-12">Storage Screen Cache</h2>
                    <div className="space-y-8">
                      <div className="flex justify-between items-end">
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Offline Storage: 12GB / 30GB</span>
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to wipe local index? Offline movies will be purged.")) {
                              toast.success("Cache Purged. 12GB Recovered.");
                            }
                          }}
                          className="text-accent-gold hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all"
                        >
                          Wipe Screen Cache
                        </button>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '40%' }}
                          transition={{ duration: 1.5, ease: 'circOut' }}
                          className="h-full bg-white rounded-full shadow-[0_0_25px_white]"
                        />
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
