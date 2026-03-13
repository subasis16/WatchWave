import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, X, Settings, LogOut, Home, Film, Tv, Users, Download, CreditCard, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import toast from 'react-hot-toast';

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast(`🔍 Searching for: "${searchQuery}"`, {
        style: { background: '#1c1c1c', color: '#fff', border: '1px solid #E50914' }
      });
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Series', path: '/series', icon: Tv },
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'Anime', path: '/anime', icon: Tv },
    { name: 'Party', path: '/party', icon: Users },
    { name: 'Downloads', path: '/downloads', icon: Download },
    { name: 'Plans & Prices', path: '/plans', icon: CreditCard },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-deep-black/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl md:text-2xl font-black text-brand-red tracking-tighter hover:opacity-80 transition-opacity">
                WATCH WAVE
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-baseline space-x-6 lg:space-x-8 ml-8">
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
                      ? 'text-white font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Right Icons */}
            <div className="hidden md:flex items-center ml-4 space-x-5">
              {/* Search */}
              <div className="relative flex items-center" ref={searchRef}>
                <form
                  onSubmit={handleSearchSubmit}
                  className={`flex items-center transition-all duration-300 ${
                    isSearchOpen ? 'bg-[#1C1D21] border border-white/20 rounded-full px-3 py-1.5' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="text-gray-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer p-1"
                    aria-label="Search"
                  >
                    <Search size={20} className={isSearchOpen ? 'text-brand-red' : ''} />
                  </button>
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.input
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 150, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        type="text"
                        autoFocus
                        placeholder="Search titles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none ml-2 w-full"
                      />
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="text-gray-300 hover:text-white transition-colors relative p-1"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-brand-red text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(229,9,20,0.8)]">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-[340px] bg-[#141414]/98 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-white font-bold text-sm">Notifications</h3>
                        {unreadCount > 0 && <span className="text-[10px] bg-brand-red text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                      </div>
                      <div className="max-h-[320px] overflow-y-auto hide-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500 flex flex-col items-center gap-2">
                            <Bell size={22} className="opacity-20" />
                            <p className="text-xs">You're all caught up!</p>
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-white/5 last:border-0 ${
                                notif.read ? 'opacity-50 hover:opacity-70' : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              {notif.avatar && <img src={notif.avatar} className="w-9 h-9 rounded-full object-cover shrink-0 border border-white/10" alt="" />}
                              <div className="flex-1 min-w-0">
                                <p className={`text-[13px] leading-snug ${notif.read ? 'text-gray-400' : 'text-gray-100 font-medium'}`}>{notif.message}</p>
                                <span className="text-[10px] text-gray-500 mt-1 block">{notif.timestamp}</span>
                              </div>
                              {!notif.read && <span className="w-2 h-2 rounded-full bg-brand-red shrink-0 mt-1 shadow-[0_0_6px_#E50914]" />}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings */}
              <Link to="/settings" className="text-gray-300 hover:text-white transition-colors p-1" aria-label="Settings">
                <Settings size={20} />
              </Link>

              {/* User Avatar / Sign In */}
              {user ? (
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-brand-red/50 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center">
                      <User size={16} className="text-brand-red" />
                    </div>
                  )}
                </Link>
              ) : (
                <Link to="/auth" className="bg-brand-red hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl transition-all text-sm shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)]">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Right — bell + hamburger */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative text-gray-300 hover:text-white p-2"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-red rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ============ MOBILE MENU DRAWER ============ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-menu-overlay md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-[320px] bg-[#0d0d0d] border-l border-white/10 z-50 flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
                <span className="text-xl font-black text-brand-red tracking-tighter">WATCH WAVE</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* User Info */}
              {user ? (
                <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-brand-red/50 object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center">
                      <User size={18} className="text-brand-red" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm truncate max-w-[180px]">{user.displayName || 'User'}</p>
                    <p className="text-gray-400 text-xs truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="px-5 py-4 border-b border-white/10">
                  <Link
                    to="/auth"
                    className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                  >
                    Sign In to WatchWave
                  </Link>
                </div>
              )}

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto py-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-4 px-5 py-3.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-white bg-brand-red/15 border-r-2 border-brand-red'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-brand-red' : ''} />
                      {item.name}
                      <ChevronRight size={14} className="ml-auto opacity-40" />
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-white/10 mx-5 my-3" />

                <Link to="/settings" className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  <Settings size={18} />
                  Settings
                  <ChevronRight size={14} className="ml-auto opacity-40" />
                </Link>
                {user && (
                  <Link to="/profile" className="flex items-center gap-4 px-5 py-3.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <User size={18} />
                    My Profile
                    <ChevronRight size={14} className="ml-auto opacity-40" />
                  </Link>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-white/10 px-5 py-4 pb-safe">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 transition-colors text-sm font-semibold"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                ) : (
                  <p className="text-center text-xs text-gray-600">© 2026 WatchWave Inc.</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
