import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Eye, EyeOff, ArrowRight, Film, LockKeyhole } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!isLogin) {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(formData.password)) {
                    setError('Password must be 8+ chars and contain an uppercase, lowercase, number, and special character.');
                    setLoading(false);
                    return;
                }
            }

            if (isLogin) {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                navigate('/profile');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;
                await updateProfile(user, { displayName: formData.name });
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    name: formData.name,
                    email: formData.email,
                    createdAt: new Date().toISOString(),
                    lastActive: new Date().toISOString(),
                    bio: 'Lover of great movies.',
                    isOnline: true,
                    subscriptionStatus: 'free',
                    badges: ['b1']
                });
                navigate('/profile');
            }
        } catch (err) {
            console.error(err);
            switch (err.code) {
                case 'auth/email-already-in-use': setError('This email is already registered.'); break;
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found': setError('Incorrect email or password. Please try again.'); break;
                default: setError(err.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen flex items-start justify-center pt-24 md:pt-32 pb-20 px-4 md:px-8 relative overflow-hidden bg-transparent selection:bg-accent-gold selection:text-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/[0.04] blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-gold/[0.06] blur-[150px] rounded-full" />
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative z-10 w-full max-w-[500px] glass-card p-8 md:p-16 border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center p-4 md:p-5 rounded-3xl glass-card mb-6 md:mb-8 border-white/10 shadow-3xl bg-white/5">
                <Film size={32} className={`transition-colors duration-500 ${isLogin ? 'text-white' : 'text-accent-gold'}`} />
            </div>
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em] mb-4">WatchWave / {isLogin ? 'Sign In' : 'Sign Up'}</h3>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
            {isLogin ? 'Welcome Back' : 'Join Now'}
          </h2>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest p-4 rounded-2xl mb-10 text-center shadow-xl"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence initial={false}>
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="overflow-hidden"
              >
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-all">
                      <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required={!isLogin}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-6 text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-gray-700 font-bold text-[13px] shadow-inner"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-white transition-all">
                <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-6 text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-gray-700 font-bold text-[13px]"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-accent-gold transition-all">
                <LockKeyhole size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-14 text-white focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all placeholder:text-gray-700 font-bold text-[13px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-all"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-pill-active py-5 flex items-center justify-center gap-4 group transition-all transform active:scale-95 disabled:opacity-50 relative overflow-hidden shadow-3xl mt-6"
          >
            {loading ? (
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Signing in...</span>
                </div>
            ) : (
                <>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] ml-2">Continue</span>
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center space-y-4">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            {isLogin ? "New to WatchWave?" : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
            className="text-[11px] text-white font-black uppercase tracking-[0.4em] hover:text-accent-gold transition-all pb-1 border-b border-white/5 hover:border-accent-gold/40"
          >
            {isLogin ? "Create an Account" : "Sign In Instead"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
