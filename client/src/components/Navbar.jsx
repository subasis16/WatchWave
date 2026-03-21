import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Menu, X, Settings, Download } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import { toast } from 'react-hot-toast';

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
      toast.success(`Search initialized for: ${searchQuery}`, {
        icon: '🔍',
        style: { background: 'rgba(255,255,255,0.05)', color: '#fff', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }
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
    { name: 'Plans & Prices', path: '/plans' },
  ];

  return (
    <>
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300 ${isScrolled ? 'top-2' : 'top-4'}`}>
        <div className="glass-card px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-black text-white tracking-widest hover:opacity-80 transition-opacity">
              WATCHWAVE
            </Link>

            {/* SEARCH PILL */}
            <div className="hidden lg:flex items-center" ref={searchRef}>
              <form
                onSubmit={handleSearchSubmit}
                className="glass-pill flex items-center px-4 py-1.5 focus-within:bg-white/20 transition-all"
              >
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movies"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none ml-2 w-40"
                />
              </form>
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
          <div className="flex items-center gap-3">
            <Link to="/downloads" className="w-10 h-10 glass-pill flex items-center justify-center text-gray-400 hover:text-white hover:scale-110 transition-all active:scale-95" title="Offline Vault">
                <Download size={18} />
            </Link>

            <div className="relative flex items-center" ref={notifRef}>
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

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-4 w-[350px] glass-card overflow-hidden z-[100]"
                  >
                    <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                      <h3 className="text-white font-bold text-sm">Notifications</h3>
                      {unreadCount > 0 && <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <p className="text-xs">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-white/5 last:border-0 ${notif.read ? 'opacity-40' : 'bg-white/5 hover:bg-white/10'}`}
                          >
                            <div className="flex flex-col">
                              <p className={`text-[13px] leading-snug ${notif.read ? 'text-gray-400' : 'text-gray-100 font-medium'}`}>{notif.message}</p>
                              <span className="text-[10px] text-gray-500 mt-1">{notif.timestamp}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/settings" className="w-10 h-10 glass-pill flex items-center justify-center text-gray-400 hover:text-white hover:scale-110 transition-all active:scale-95" title="Settings">
                <Settings size={18} />
            </Link>

            {user ? (
              <Link to="/profile" className="flex items-center gap-3 glass-pill pl-1 pr-4 py-1 hover:scale-105 active:scale-95 transition-transform">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'U'}`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-white/20" 
                />
                <span className="text-sm font-bold hidden sm:inline">{user.displayName || 'User'}</span>
              </Link>
            ) : (
              <Link to="/auth" className="glass-pill-active px-6 py-2 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-transform">
                Sign In
              </Link>
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 glass-pill flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
