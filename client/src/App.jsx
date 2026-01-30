import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import OpeningAnimation from './components/OpeningAnimation';

const App = () => {
  const { pathname } = useLocation();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = "Watch Wave | Premium Streaming";
  }, []);

  return (
    <div className="bg-deep-black min-h-screen font-sans text-white selection:bg-brand-red selection:text-white pb-10">
      {showIntro && <OpeningAnimation onComplete={() => setShowIntro(false)} />}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<Series />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/room" element={<WatchRoom />} />
        <Route path="/clips" element={<Clips />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plans" element={<Plans />} />
      </Routes>

      {/* Footer */}
      <footer className="mt-12 py-12 px-4 sm:px-6 lg:px-8 bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-brand-red tracking-tighter cursor-pointer">
                WATCH WAVE
              </span>
              <p className="mt-2 text-gray-500">Premium streaming experience.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a href="/" className="hover:text-brand-red transition">Home</a>
              <a href="/movies" className="hover:text-brand-red transition">Movies</a>
              <a href="/series" className="hover:text-brand-red transition">Series</a>
              <a href="#" className="hover:text-brand-red transition">My List</a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <p>&copy; 2026 Watch Wave Inc. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-gray-400">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
