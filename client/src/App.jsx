import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Anime from './pages/Anime';
import Plans from './pages/Plans';
import Profile from './pages/Profile';
import WatchRoom from './pages/WatchRoom';
import Clips from './pages/Clips';
import Player from './pages/Player';
import Settings from './pages/Settings';
import VideoPlayer from './pages/VideoPlayer';
import PartyHub from './pages/PartyHub';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import DataPrivileges from './pages/DataPrivileges';
import Feedback from './pages/Feedback';
import Auth from './pages/Auth';
import OpeningAnimation from './components/OpeningAnimation';
import Downloads from './pages/Downloads';

const App = () => {
  const { pathname } = useLocation();
  const [showIntro, setShowIntro] = useState(true);

  // Check if we are on the video player page, party hub, or watch room to adjust layout
  const isWatchPage = pathname.startsWith('/watch');
  const isPartyPage = pathname.startsWith('/party');
  const isRoomPage = pathname.startsWith('/room');
  
  const hideNavbar = isWatchPage || isRoomPage;
  const hideFooter = isWatchPage || isPartyPage || isRoomPage;
  const hidePadding = isWatchPage || isPartyPage || isRoomPage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = "Watch Wave | Premium Streaming";
  }, []);

  return (
    <div className={`bg-deep-black min-h-screen font-sans text-white selection:bg-brand-red selection:text-white ${!hidePadding ? 'pb-10' : ''}`}>
      <Toaster position="top-right" reverseOrder={false} />
      {showIntro && <OpeningAnimation onComplete={() => setShowIntro(false)} />}

      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/party" element={<PartyHub />} />
        <Route path="/room" element={<WatchRoom />} />
        <Route path="/clips" element={<Clips />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/watch/:id" element={<VideoPlayer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-privileges" element={<DataPrivileges />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>

      {/* Footer */}
      {!hideFooter && (
        <footer className="mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-black/50 border-t border-white/5 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-gray-400 text-sm gap-8 md:gap-0">
              <div className="mb-4 md:mb-0">
                <span className="text-xl font-black text-brand-red tracking-tighter cursor-pointer">
                  WATCH WAVE
                </span>
                <p className="mt-2 text-gray-500 max-w-xs leading-relaxed">The ultimate premium spatial streaming experience for world-class entertainment.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full md:w-auto">
                <div className="flex flex-col gap-3">
                  <h4 className="text-white font-bold mb-1">Company</h4>
                  <a href="/about" className="hover:text-brand-red transition-colors">About Us</a>
                  <a href="/contact" className="hover:text-brand-red transition-colors">Contact</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-white font-bold mb-1">Support</h4>
                  <a href="/feedback" className="hover:text-brand-red transition-colors">Submit Feedback</a>
                  <a href="/plans" className="hover:text-brand-red transition-colors">Billing & Plans</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-white font-bold mb-1">Legal</h4>
                  <a href="/terms" className="hover:text-brand-red transition-colors">Terms of Service</a>
                  <a href="/data-privileges" className="hover:text-brand-red transition-colors">Data Privileges</a>
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-white font-bold mb-1">Categories</h4>
                  <a href="/" className="hover:text-brand-red transition-colors">Home</a>
                  <a href="/movies" className="hover:text-brand-red transition-colors">Movies</a>
                  <a href="/party" className="hover:text-brand-red transition-colors">Watch Party</a>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 gap-4">
              <p>&copy; 2026 WatchWave Incorporated. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="/data-privileges" className="hover:text-gray-400 transition-colors">Privacy Shield</a>
                <a href="/terms" className="hover:text-gray-400 transition-colors">Terms of Use</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
