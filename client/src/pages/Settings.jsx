import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accessibility, Globe, HandMetal, Eye, Lock,
  ShieldAlert, Clock, BarChart3, Moon, Volume2,
  Bell, Check, User, CreditCard, PlayCircle, Download, ShieldCheck, HeartPulse
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const tabs = [
    { id: 'Account', icon: User },
    { id: 'Subscription', icon: CreditCard },
    { id: 'Playback', icon: PlayCircle },
    { id: 'Safety', icon: ShieldCheck },
    { id: 'Wellbeing', icon: HeartPulse },
    { id: 'Accessibility', icon: Accessibility },
    { id: 'Downloads', icon: Download }
  ];

  // State for toggles and values from both versions
  const [autoplay, setAutoplay] = useState(true);
  const [signLanguage, setSignLanguage] = useState(false);
  const [audioDesc, setAudioDesc] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(true);
  const [rating, setRating] = useState(2); // 0: G, 1: PG, 2: PG-13, 3: R, 4: NC-17
  const [dailyLimit, setDailyLimit] = useState(120); // minutes

  const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  const weekData = [45, 120, 90, 60, 200, 150, 80]; // Mock screen time data
  const maxTime = Math.max(...weekData);

  // Custom Toggle Switch
  const CustomToggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        checked ? 'bg-[#E50914]' : 'bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B0C10] font-sans text-white selection:bg-[#E50914] selection:text-white">
      <div className="max-w-6xl mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Column - Sidebar */}
          <div className="w-full md:w-1/4 shrink-0">
            <nav className="flex flex-col space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 text-left px-5 py-4 text-sm font-bold tracking-wider transition-all duration-200 border-l-4 uppercase ${
                    activeTab === tab.id
                      ? 'border-[#E50914] text-white bg-white/5'
                      : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.id}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Column - Content Area */}
          <div className="w-full md:w-3/4">
            <h1 className="text-4xl font-bold text-white mb-10 tracking-tight uppercase">{activeTab} Settings</h1>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* ACCOUNT TAB */}
                {activeTab === 'Account' && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 text-white">Profile Information</h2>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <img 
                          src="https://i.pravatar.cc/150?u=watchwave_user" 
                          alt="User Avatar" 
                          className="w-24 h-24 rounded-full object-cover border-2 border-white/10 shadow-lg"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-2xl font-bold text-gray-100">Alex Mercer</h3>
                          <p className="text-gray-400 mt-1 font-medium">alex.mercer@watchwave.com</p>
                        </div>
                      </div>
                      <button className="text-white border border-gray-600 rounded-md px-5 py-2.5 hover:border-white transition-colors text-sm font-bold tracking-wide mt-4 sm:mt-0 whitespace-nowrap">
                        Change Password
                      </button>
                    </div>
                  </div>
                )}

                {/* SUBSCRIPTION TAB */}
                {activeTab === 'Subscription' && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 text-white">Watch Plan</h2>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                      <div className="flex flex-col items-start">
                        <div className="inline-block px-3 py-1.5 bg-red-900/30 border border-[#E50914] rounded text-[#E50914] font-black tracking-widest text-xs mb-3 shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                          WATCHWAVE PREMIUM HD
                        </div>
                        <p className="text-gray-400 text-sm font-medium">Active since 2024</p>
                      </div>
                      <button className="bg-[#E50914] hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-md transition-all shadow-[0_4px_15px_rgba(229,9,20,0.4)] hover:shadow-[0_6px_20px_rgba(229,9,20,0.6)] text-sm tracking-wide w-full sm:w-auto text-center">
                        MANAGE BILLING (Razorpay)
                      </button>
                    </div>
                  </div>
                )}

                {/* PLAYBACK TAB */}
                {activeTab === 'Playback' && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="pr-6">
                        <h2 className="text-xl font-bold text-gray-100">Autoplay Next Episode</h2>
                        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Seamlessly play the next episode when the current one ends.</p>
                      </div>
                      <div className="shrink-0">
                        <CustomToggle checked={autoplay} onChange={setAutoplay} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-8">
                      <div className="pr-6">
                        <h2 className="text-xl font-bold text-gray-100">Audio Description</h2>
                        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Narrate visual details for the blind and visually impaired.</p>
                      </div>
                      <div className="shrink-0">
                        <CustomToggle checked={audioDesc} onChange={setAudioDesc} />
                      </div>
                    </div>
                  </div>
                )}

                {/* SAFETY TAB */}
                {activeTab === 'Safety' && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-10">
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Maximum Content Rating</h2>
                        <span className="px-3 py-1 bg-red-900/30 rounded font-bold text-[#E50914] border border-[#E50914]/30">
                          {ratings[rating]}
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-800 rounded-full mb-8">
                        <div className="absolute inset-y-0 left-0 bg-[#E50914] rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" style={{ width: `${(rating / 4) * 100}%` }} />
                        <input
                          type="range"
                          min="0"
                          max="4"
                          step="1"
                          value={rating}
                          onChange={(e) => setRating(parseInt(e.target.value))}
                          className="absolute inset-x-0 -top-1 w-full h-4 opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex justify-between mt-6 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                          {ratings.map((r, i) => (
                            <span key={r} onClick={() => setRating(i)} className={`cursor-pointer transition-colors ${i <= rating ? 'text-gray-300' : 'hover:text-white'}`}>{r}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-8">
                      <div className="pr-6">
                        <h2 className="text-xl font-bold text-white">Profile PIN</h2>
                        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Require a 4-digit PIN to access this profile.</p>
                      </div>
                      <div className="shrink-0">
                        <CustomToggle checked={pinEnabled} onChange={setPinEnabled} />
                      </div>
                    </div>
                  </div>
                )}

                {/* WELLBEING TAB */}
                {activeTab === 'Wellbeing' && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-12">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-8">Screen Time (Last 7 Days)</h2>
                      <div className="flex items-end justify-between h-48 gap-3">
                        {weekData.map((mins, i) => (
                          <div key={i} className="flex flex-col items-center w-full group relative">
                            <div className="w-full flex justify-end flex-col h-full rounded-t-lg bg-white/5 overflow-hidden border border-white/5">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(mins / maxTime) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`w-full ${mins > dailyLimit ? 'bg-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.5)]' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]'} opacity-80 group-hover:opacity-100 transition-all`}
                              />
                            </div>
                            <span className="text-[10px] text-gray-500 mt-3 font-black tracking-widest">
                              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black border border-white/10 text-[10px] font-bold px-2 py-1 rounded transition-opacity pointer-events-none whitespace-nowrap">
                              {Math.floor(mins / 60)}H {mins % 60}M
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-8">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Daily Watch Limit</h2>
                        <span className="text-[#E50914] font-black tracking-widest">{Math.floor(dailyLimit / 60)}H {dailyLimit % 60}M</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="300"
                        step="15"
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#E50914]"
                      />
                    </div>
                  </div>
                )}

                {/* ACCESSIBILITY TAB */}
                {activeTab === 'Accessibility' && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="pr-6">
                        <h2 className="text-xl font-bold text-white">Subtitle Style</h2>
                        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Customize how subtitles appear on your screen.</p>
                      </div>
                      <select className="bg-black border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#E50914] focus:outline-none transition-colors">
                        <option>English (CC)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>Hindi</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-8">
                      <div className="pr-6">
                        <h2 className="text-xl font-bold text-white">Sign Language Overlay</h2>
                        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Show sign language interpreter where available.</p>
                      </div>
                      <div className="shrink-0">
                        <CustomToggle checked={signLanguage} onChange={setSignLanguage} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-8">
                      <div className="pr-6">
                        <h2 className="text-xl font-bold text-white">High Contrast UI</h2>
                        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Increase contrast for better readability.</p>
                      </div>
                      <div className="shrink-0">
                        <CustomToggle checked={highContrast} onChange={setHighContrast} />
                      </div>
                    </div>
                  </div>
                )}

                {/* DOWNLOADS TAB */}
                {activeTab === 'Downloads' && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-8 border-b border-white/10 pb-4 text-white">Offline Storage Usage</h2>
                    <div className="w-full">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-gray-300 text-sm font-bold tracking-wide uppercase">12 GB of 30 GB Used</span>
                        <button className="text-[#E50914] hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                          Clear Cache
                        </button>
                      </div>
                      <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '40%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-red-800 to-[#E50914] rounded-full shadow-[0_0_10px_rgba(229,9,20,0.8)]"
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
