import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Account');
  const tabs = ['Account', 'Subscription', 'Playback', 'Downloads'];

  const [autoplay, setAutoplay] = useState(true);

  // Custom Tailwind Toggle Switch
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

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B0C10] font-sans text-white selection:bg-[#E50914] selection:text-white">
      <div className="max-w-6xl mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Left Column - Sidebar (w-1/4) */}
          <div className="w-full md:w-1/4 shrink-0">
            <nav className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-left px-5 py-4 text-sm font-bold tracking-wider transition-all duration-200 border-l-4 uppercase ${
                    activeTab === tab
                      ? 'border-[#E50914] text-white bg-white/5'
                      : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Column - Content Area (w-3/4) */}
          <div className="w-full md:w-3/4">
            <h1 className="text-4xl font-bold text-white mb-10 tracking-tight">ACCOUNT SETTINGS</h1>
            
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
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 text-white">Playback Settings</h2>
                    <div className="flex items-center justify-between">
                      <div className="pr-6">
                        <h3 className="text-lg font-bold text-gray-100">Autoplay Next Episode</h3>
                        <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">Seamlessly play the next episode when the current one ends. Keeps the binge going without interruptions.</p>
                      </div>
                      <div className="shrink-0">
                        <CustomToggle checked={autoplay} onChange={setAutoplay} />
                      </div>
                    </div>
                  </div>
                )}

                {/* DOWNLOADS TAB */}
                {activeTab === 'Downloads' && (
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4 text-white">Offline Storage Usage (PWA)</h2>
                    <div className="w-full">
                      <div className="flex justify-between items-end mb-4">
                        <span className="text-gray-300 text-sm font-bold tracking-wide">12 GB of 30 GB Used</span>
                        <button className="text-[#E50914] hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-colors">
                          Clear All Downloads
                        </button>
                      </div>
                      {/* Horizontal Progress Bar */}
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
