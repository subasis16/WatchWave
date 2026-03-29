import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, X, Settings, Download, Clock, TrendingUp, Flame, Star } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import { movies, series, anime, bollywood, trending } from '../data/content';

// Combine all content into one searchable pool
const ALL_CONTENT = [
  ...movies.map(i => ({ ...i, type: 'Movie' })),
  ...series.map(i => ({ ...i, type: 'Series' })),
  ...anime.map(i => ({ ...i, type: 'Anime' })),
  ...bollywood.map(i => ({ ...i, type: 'Bollywood' })),
  ...trending.map(i => ({ ...i, type: 'Trending' })),
].reduce((acc, item) => {
  // Deduplicate by title
  if (!acc.find(x => x.title === item.title)) acc.push(item);
  return acc;
}, []);

const RECENT_KEY = 'watchwave_recent_searches';
const MAX_RECENT = 8;

const TYPE_COLORS = {
  Movie:     'bg-blue-500/20 text-blue-300 border-blue-500/20',
  Series:    'bg-purple-500/20 text-purple-300 border-purple-500/20',
  Anime:     'bg-orange-500/20 text-orange-300 border-orange-500/20',
  Bollywood: 'bg-pink-500/20 text-pink-300 border-pink-500/20',
  Trending:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/20',
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);

  const { notifications, markAsRead } = useNotification();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth & Firestore live sync
  useEffect(() => {
    let unsubscribeDoc = null;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          unsubscribeDoc = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
            if (docSnap.exists()) setDbUser(docSnap.data());
          });
        } catch (e) {}
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

  // Live search results filtered from all content
  const searchResults = searchQuery.trim().length > 0
    ? ALL_CONTENT.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  // Smart recommendations when no query: trending + top rated
  const recommendations = ALL_CONTENT
    .filter(item => parseInt(item.match) >= 97)
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);

  const saveSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const handleSelectResult = (item) => {
    saveSearch(item.title);
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/watch/${item.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    saveSearch(searchQuery);
    setIsSearchFocused(false);
    navigate(`/movies?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  const handleClickRecent = (q) => {
    setSearchQuery(q);
    searchInputRef.current?.focus();
  };

  const removeRecent = (q, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(r => r !== q);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const showDropdown = isSearchFocused;
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Series', path: '/series' },
    { name: 'Movies', path: '/movies' },
    { name: 'Anime', path: '/anime' },
    { name: 'Party', path: '/party' },
    { name: 'Plans & Prices', path: '/plans' },
  ];

  return (
    <>
      <nav className={`fixed top-2 md:top-4 left-1/2 -translate-x-1/2 w-[96%] md:w-[95%] max-w-7xl z-50 transition-all duration-300 ${isScrolled ? 'top-1 md:top-2' : ''}`}>
        <div className="glass-card px-3 md:px-8 py-2 md:py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-black text-white tracking-widest hover:opacity-80 transition-opacity">
              WATCHWAVE
            </Link>

            {/* -------- SMART SEARCH -------- */}
            <div className="hidden lg:flex items-center relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className={`glass-pill flex items-center px-4 py-1.5 transition-all duration-300 ${isSearchFocused ? 'bg-white/15 ring-1 ring-white/20 w-72' : 'w-52'}`}>
                <Search size={16} className={`shrink-0 transition-colors ${isSearchFocused ? 'text-white' : 'text-gray-400'}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search movies, anime, series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none ml-2 w-full"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-white transition-colors ml-1 shrink-0">
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* -------- SMART DROPDOWN -------- */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute left-0 top-full mt-3 w-[440px] glass-card border-white/10 shadow-2xl overflow-hidden z-[200]"
                  >
                    {/* --- Live Search Results --- */}
                    {searchResults.length > 0 ? (
                      <div>
                        <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                          <Search size={12} className="text-gray-500" />
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Search Results</span>
                        </div>
                        <div className="max-h-[360px] overflow-y-auto">
                          {searchResults.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              className="w-full flex items-center gap-4 px-5 py-3 hover:bg-white/10 transition-colors text-left group"
                            >
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-10 h-14 rounded-lg object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate group-hover:text-accent-gold transition-colors">{item.title}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${TYPE_COLORS[item.type] || 'bg-white/10 text-gray-300'}`}>{item.type}</span>
                                  <span className="text-[10px] text-gray-500">{item.year}</span>
                                  <span className="text-[10px] text-accent-gold font-bold flex items-center gap-1"><Star size={9} fill="currentColor" />{item.match}%</span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="px-5 py-3 border-t border-white/5">
                          <button onClick={handleSearchSubmit} className="text-[10px] font-black text-accent-gold hover:text-white uppercase tracking-[0.3em] transition-colors">
                            See all results for "{searchQuery}" →
                          </button>
                        </div>
                      </div>
                    ) : searchQuery.trim().length > 0 ? (
                      /* No results */
                      <div className="px-5 py-10 text-center">
                        <p className="text-gray-500 text-sm">No results for <span className="text-white font-bold">"{searchQuery}"</span></p>
                        <p className="text-gray-600 text-[10px] mt-2 uppercase tracking-widest">Try a different title or genre</p>
                      </div>
                    ) : (
                      /* Empty query - show recent + recommendations */
                      <div>
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                          <div className="border-b border-white/5 pb-3">
                            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock size={12} className="text-gray-500" />
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Recent Searches</span>
                              </div>
                              <button onClick={clearAllRecent} className="text-[9px] text-gray-600 hover:text-red-400 uppercase tracking-widest transition-colors font-bold">Clear All</button>
                            </div>
                            <div className="px-4 flex flex-wrap gap-2">
                              {recentSearches.map((q) => (
                                <button
                                  key={q}
                                  onClick={() => handleClickRecent(q)}
                                  className="group flex items-center gap-2 glass-pill px-3 py-1.5 text-[11px] text-gray-300 hover:text-white hover:bg-white/10 transition-all border-white/5"
                                >
                                  <Clock size={10} className="text-gray-500" />
                                  {q}
                                  <X size={10} className="text-gray-600 group-hover:text-red-400 transition-colors" onClick={(e) => removeRecent(q, e)} />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Trending / Personalized Recommendations */}
                        <div>
                          <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                            <Flame size={12} className="text-orange-400" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Recommended For You</span>
                          </div>
                          <div className="grid grid-cols-3 gap-3 px-4 pb-4">
                            {recommendations.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleSelectResult(item)}
                                className="group relative aspect-[2/3] rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all shadow-lg"
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                                  <p className="text-[10px] font-black text-white truncate leading-tight">{item.title}</p>
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border mt-1 inline-block ${TYPE_COLORS[item.type] || 'bg-white/10 text-gray-300'}`}>{item.type}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Browse by Category Shortcuts */}
                        <div className="border-t border-white/5 px-5 py-3 flex gap-2 flex-wrap">
                          {[{label:'🎬 Movies', path:'/movies'},{label:'📺 Series', path:'/series'},{label:'⛩️ Anime', path:'/anime'},{label:'🎉 Party', path:'/party'}].map(cat => (
                            <Link
                              key={cat.path}
                              to={cat.path}
                              onClick={() => setIsSearchFocused(false)}
                              className="text-[10px] font-black glass-pill px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 border-white/5 transition-all uppercase tracking-widest"
                            >
                              {cat.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CENTER NAVIGATION */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${location.pathname.startsWith(item.path)
                  ? 'glass-pill-active'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* RIGHT TOOLS */}
            <Link to="/downloads" className="hidden md:flex w-10 h-10 glass-pill items-center justify-center text-gray-400 hover:text-white hover:scale-110 transition-all active:scale-95" title="Offline Vault">
              <Download size={18} />
            </Link>

            <div className="hidden md:flex relative items-center" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-10 h-10 glass-pill flex items-center justify-center relative hover:scale-110 active:scale-95"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="bg-[#E50914] text-white absolute top-0 right-0 rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <Link to="/settings" className="hidden md:flex w-10 h-10 glass-pill items-center justify-center text-gray-400 hover:text-white hover:scale-110 transition-all active:scale-95" title="Settings">
              <Settings size={18} />
            </Link>

            {user ? (
              <Link to="/profile" className="hidden md:flex items-center gap-3 glass-pill pl-1 pr-4 py-1 hover:scale-105 active:scale-95 transition-transform">
                <img
                  src={dbUser?.avatar || user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'U'}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border border-white/20 object-cover"
                />
                <span className="text-sm font-bold hidden sm:inline">{user.displayName || 'User'}</span>
              </Link>
            ) : (
              <Link to="/auth" className="hidden md:flex glass-pill-active px-6 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-transform">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 glass-pill flex items-center justify-center ml-auto"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 glass-card overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="glass-pill flex items-center px-4 py-2 mb-4">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none ml-2 w-full"
                  />
                </form>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block px-4 py-3 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                    {user ? (
                        <>
                            <Link
                                to="/profile"
                                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-white hover:bg-white/5 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <img
                                    src={dbUser?.avatar || user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'U'}`}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full border border-white/20 object-cover"
                                />
                                <div>
                                    <p className="text-sm font-bold">{user.displayName || 'User'}</p>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">View Profile</p>
                                </div>
                            </Link>
                            <Link
                                to="/downloads"
                                className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Download size={20} />
                                <span>Offline Vault</span>
                            </Link>
                            <div 
                                className="flex items-center justify-between px-4 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => {
                                    setIsNotifOpen(!isNotifOpen);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <Bell size={20} />
                                    <span>Notifications</span>
                                </div>
                                {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>}
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/auth"
                            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-accent-gold hover:bg-white/5 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <User size={20} />
                            <span>Sign In / Create Account</span>
                        </Link>
                    )}
                    <Link
                        to="/settings"
                        className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
