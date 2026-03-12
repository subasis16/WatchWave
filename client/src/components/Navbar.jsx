import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, X, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { notifications, markAsRead } = useNotification();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Handle clicking outside the notification and search dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Series', path: '/series' },
    { name: 'Movies', path: '/movies' },
    { name: 'Anime', path: '/anime' },
    { name: 'Party', path: '/party' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Plans & Prices', path: '/plans' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-deep-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="text-2xl font-bold text-brand-red tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
                  WATCH WAVE
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${location.pathname.startsWith(item.path) ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-6">
                {/* SEARCH BAR (EXPANDING) */}
                <div className="relative flex items-center" ref={searchRef}>
                  <form
                    onSubmit={handleSearchSubmit}
                    className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'bg-[#1C1D21] border border-white/20 rounded-full px-3 py-1.5 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className="text-gray-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Search size={22} className={isSearchOpen ? 'text-brand-red' : ''} />
                    </button>

                    <AnimatePresence>
                      {isSearchOpen && (
                        <motion.input
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 160, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          type="text"
                          autoFocus
                          placeholder="Search titles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none ml-2"
                        />
                      )}
                    </AnimatePresence>
                  </form>
                </div>

                {/* NOTIFICATION BELL & DROPDOWN */}
                <div className="relative flex items-center" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="text-gray-300 hover:text-white transition-colors relative flex items-center"
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="bg-[#E50914] text-white absolute -top-1.5 -right-1.5 rounded-full text-[10px] w-4 h-4 flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(229,9,20,0.8)]">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-4 w-[350px] bg-[#141414]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden"
                        style={{ zIndex: 100 }}
                      >
                        <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center bg-black/20">
                          <h3 className="text-white font-bold text-sm tracking-wide">Notifications</h3>
                          {unreadCount > 0 && <span className="text-[10px] bg-[#E50914] text-white px-2 py-0.5 rounded-full font-bold">{unreadCount} Unread</span>}
                        </div>
                        <div className="max-h-[350px] overflow-y-auto hide-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center flex flex-col items-center justify-center text-gray-500">
                              <Bell size={24} className="mb-2 opacity-20" />
                              <p className="text-xs">You're all caught up!</p>
                            </div>
                          ) : (
                            notifications.map(notif => (
                              <div
                                key={notif.id}
                                onClick={() => markAsRead(notif.id)}
                                className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-white/5 last:border-0 ${notif.read ? 'hover:bg-white/5 opacity-60' : 'bg-white/5 hover:bg-white/10'}`}
                              >
                                {notif.avatar && (
                                  <img src={notif.avatar} className="w-10 h-10 rounded-full border border-white/20 shrink-0 object-cover" alt="Avatar" />
                                )}
                                <div className="flex flex-col">
                                  <p className={`text-[13px] leading-snug ${notif.read ? 'text-gray-400' : 'text-gray-100 font-medium'}`}>{notif.message}</p>
                                  <span className="text-[10px] text-gray-500 mt-1.5 font-medium">{notif.timestamp}</span>
                                </div>
                                {!notif.read && (
                                  <span className="w-2 h-2 rounded-full bg-[#E50914] shrink-0 mt-1 ml-auto shadow-[0_0_8px_#E50914]"></span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/settings" className="text-gray-300 hover:text-white transition-colors">
                  <Settings size={20} />
                </Link>
                {user ? (
                   <Link to="/profile" className="text-gray-300 hover:text-brand-red transition-colors flex items-center gap-2">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" />
                    ) : (
                      <div className="bg-brand-red/20 p-1.5 rounded-full border border-brand-red/30">
                        <User size={18} className="text-brand-red" />
                      </div>
                    )}
                  </Link>
                ) : (
                  <Link to="/auth" className="bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] text-sm">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-deep-black/95 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
