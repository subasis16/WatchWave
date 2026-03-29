import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
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
import Auth from './pages/Auth';
import OpeningAnimation from './components/OpeningAnimation';
import Downloads from './pages/Downloads';
import OfflinePlayer from './pages/OfflinePlayer';
import Admin from './pages/Admin';
import CtaBanner from './components/CtaBanner';

const App = () => {
  const { pathname } = useLocation();
  const [showIntro, setShowIntro] = useState(true);

  // Check if we are on the video player page, party hub, or watch room to adjust layout
  const isWatchPage = pathname.startsWith('/watch');
  const isPartyPage = pathname.startsWith('/party');
  const isRoomPage = pathname.startsWith('/room');
  const isOfflinePage = pathname.startsWith('/offline');
  
  const isAdminPage = pathname.startsWith('/admin');
  const hideNavbar = isWatchPage || isRoomPage || isAdminPage || isOfflinePage;
  const hideFooter = isWatchPage || isPartyPage || isRoomPage || isOfflinePage;
  const hidePadding = isWatchPage || isPartyPage || isRoomPage || isOfflinePage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = "Watch Wave | Premium Streaming";
  }, []);

  return (
    <div className={`selection:bg-white selection:text-black ${!hidePadding ? 'pb-10' : ''} overflow-x-hidden w-full relative`}>
      <Toaster position="top-right" reverseOrder={false} />
      {showIntro && <OpeningAnimation onComplete={() => setShowIntro(false)} />}

      {!hideNavbar && !showIntro && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/party" element={<PartyHub />} />
        <Route path="/room" element={<WatchRoom />} />
        <Route path="/room/:id" element={<WatchRoom />} />
        <Route path="/clips" element={<Clips />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/offline" element={<OfflinePlayer />} />
        <Route path="/player/:id" element={<VideoPlayer />} />
        <Route path="/watch/:id" element={<Player />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-privileges" element={<DataPrivileges />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Footer */}
      {!hideFooter && (
        <>
          <CtaBanner />
          <footer className="mt-16 md:mt-20 py-10 md:py-16 px-4 md:px-10">
          <div className="glass-card p-8 md:p-16 border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12">
              <div className="max-w-md w-full">
                <span className="text-xl md:text-2xl font-black text-white tracking-widest">
                  WATCHWAVE
                </span>
                <p className="mt-4 text-sm md:text-base text-gray-400 font-medium leading-relaxed">
                  Experience the future of entertainment with our streaming platform. Cinema-grade quality, anywhere you are.
                </p>
                <div className="flex gap-4 mt-6 md:mt-8">
                  <div className="w-10 h-10 glass-pill flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                    <span className="font-bold text-xs">FB</span>
                  </div>
                  <div className="w-10 h-10 glass-pill flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                    <span className="font-bold text-xs">X</span>
                  </div>
                  <div className="w-10 h-10 glass-pill flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                    <span className="font-bold text-xs">IG</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-20 w-full mt-8 md:mt-0">
                <div className="flex flex-col gap-3 md:gap-4">
                  <h4 className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">Discover</h4>
                  <Link to="/" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors">Home</Link>
                  <Link to="/movies" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors">Movies</Link>
                  <Link to="/party" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors">Parties</Link>
                </div>
                <div className="flex flex-col gap-3 md:gap-4">
                  <h4 className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">Experience</h4>
                  <Link to="/plans" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
                  <Link to="/downloads" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors">Off-line</Link>
                  <Link to="/contact" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
                </div>
                <div className="flex flex-col gap-3 md:gap-4">
                  <h4 className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">Legal</h4>
                  <Link to="/terms" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors">Terms</Link>
                  <Link to="/data-privileges" className="text-xs md:text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
                </div>
              </div>
            </div>
            
            <div className="mt-12 md:mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest gap-4">
              <p>&copy; 2026 WatchWave. All rights reserved.</p>
              <div className="flex gap-8">
                <Link to="/data-privileges" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
        </>
      )}
    </div>
  );
};

export default App;
