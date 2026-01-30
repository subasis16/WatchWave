import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Accessibility, Globe, HandMetal, Eye, Lock,
  ShieldAlert, Clock, BarChart3, Moon, Volume2,
  Bell, Check
} from 'lucide-react';

const Settings = () => {
  // State for toggles
  const [signLanguage, setSignLanguage] = useState(false);
  const [audioDesc, setAudioDesc] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(true);
  const [rating, setRating] = useState(2); // 0: G, 1: PG, 2: PG-13, 3: R, 4: NC-17
  const [dailyLimit, setDailyLimit] = useState(120); // minutes

  const ratings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  const weekData = [45, 120, 90, 60, 200, 150, 80]; // Mock screen time data
  const maxTime = Math.max(...weekData);

  const Toggle = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-brand-red' : 'bg-gray-700'}`}
    >
      <motion.div
        className="bg-white w-6 h-6 rounded-full shadow-md"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-rich-gray rounded-2xl p-6 md:p-8 mb-8 border border-white/5">
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="p-2 bg-brand-red/10 rounded-lg text-brand-red">
          <Icon size={24} />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-deep-black text-gray-200">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your preferences, safety, and viewing habits.</p>
        </header>

        {/* Accessibility Section */}
        <Section title="Accessibility" icon={Accessibility}>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <Globe className="mt-1 text-gray-400" />
              <div>
                <h3 className="font-semibold text-white">Subtitle Language</h3>
                <p className="text-sm text-gray-400">Default language for content subtitles</p>
              </div>
            </div>
            <select className="bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-red focus:outline-none">
              <option>English (CC)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>Hindi</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <HandMetal className="mt-1 text-gray-400" />
              <div>
                <h3 className="font-semibold text-white">Sign Language Overlay</h3>
                <p className="text-sm text-gray-400">Show sign language interpreter where available</p>
              </div>
            </div>
            <Toggle checked={signLanguage} onChange={setSignLanguage} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <Volume2 className="mt-1 text-gray-400" />
              <div>
                <h3 className="font-semibold text-white">Audio Description</h3>
                <p className="text-sm text-gray-400">Narrate visual details for the blind and visually impaired</p>
              </div>
            </div>
            <Toggle checked={audioDesc} onChange={setAudioDesc} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <Eye className="mt-1 text-gray-400" />
              <div>
                <h3 className="font-semibold text-white">High Contrast UI</h3>
                <p className="text-sm text-gray-400">Increase contrast for better readability</p>
              </div>
            </div>
            <Toggle checked={highContrast} onChange={setHighContrast} />
          </div>
        </Section>

        {/* Parental Controls */}
        <Section title="Parental Controls" icon={ShieldAlert}>
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Maximum Content Rating</h3>
              <span className="px-3 py-1 bg-gray-800 rounded font-bold text-brand-red border border-gray-700">
                {ratings[rating]}
              </span>
            </div>
            <div className="relative h-2 bg-gray-800 rounded-full mb-8">
              <div className="absolute inset-y-0 left-0 bg-brand-red rounded-full" style={{ width: `${(rating / 4) * 100}%` }} />
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex justify-between mt-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
                {ratings.map((r, i) => (
                  <span key={r} onClick={() => setRating(i)} className="cursor-pointer hover:text-white transition">{r}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 pt-6">
            <div className="flex items-start gap-4">
              <Lock className="mt-1 text-gray-400" />
              <div>
                <h3 className="font-semibold text-white">Profile PIN</h3>
                <p className="text-sm text-gray-400">Require a 4-digit PIN to access this profile</p>
              </div>
            </div>
            <Toggle checked={pinEnabled} onChange={setPinEnabled} />
          </div>
        </Section>

        {/* Digital Wellbeing */}
        <Section title="Digital Wellbeing" icon={BarChart3}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-white mb-6">Screen Time (Last 7 Days)</h3>
              <div className="flex items-end justify-between h-40 gap-2">
                {weekData.map((mins, i) => (
                  <div key={i} className="flex flex-col items-center w-full group">
                    <div className="relative w-full flex justify-end flex-col h-full rounded-t-lg bg-gray-800/50 overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(mins / maxTime) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`w-full ${mins > dailyLimit ? 'bg-brand-red' : 'bg-blue-500'} opacity-80 group-hover:opacity-100 transition-opacity`}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 mt-2 font-mono">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -mt-8 bg-black border border-gray-700 text-xs px-2 py-1 rounded transition-opacity pointer-events-none">
                      {Math.floor(mins / 60)}h {mins % 60}m
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" /> Within Limit
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-red" /> Over Limit
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Clock size={16} /> Daily Watch Limit
                  </h3>
                  <span className="text-brand-red font-bold">{Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="15"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-red"
                />
                <p className="text-xs text-gray-500 mt-2">
                  We'll notify you when you reach this limit for the day.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <Moon className="mt-1 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-white">Bedtime Reminder</h3>
                    <p className="text-sm text-gray-400">Dim screen and remind me to sleep at 11:00 PM</p>
                  </div>
                </div>
                <Toggle checked={true} onChange={() => { }} />
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Settings;
