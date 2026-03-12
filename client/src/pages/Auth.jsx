import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldCheck, User, Eye, EyeOff, Crown, ArrowRight, Fingerprint, LockKeyhole } from 'lucide-react';
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
                // Password strict constraints: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(formData.password)) {
                    setError('Password must be 8+ chars and contain an uppercase, lowercase, number, and special character.');
                    setLoading(false);
                    return;
                }
            }

            if (isLogin) {
                // Sign In
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                navigate('/profile');
            } else {
                // Sign Up
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                // Update auth profile
                await updateProfile(user, { displayName: formData.name });

                // Create user document in firestore
                await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    name: formData.name,
                    email: formData.email,
                    createdAt: new Date().toISOString(),
                    bio: 'New explorer in the cinematic universe.',
                    isOnline: true,
                    badges: ['b1'] // Give default VIP badge
                });

                navigate('/profile');
            }
        } catch (err) {
            console.error(err);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Try signing in.');
                    break;
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    setError('Invalid email or password.');
                    break;
                case 'auth/weak-password':
                    setError('Password must be at least 6 characters.');
                    break;
                case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
                case 'auth/invalid-api-key':
                    setError('CRITICAL: Firebase API Keys are missing or invalid in your .env file! Please connect your database.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Check your connection or Firebase config.');
                    break;
                default:
                    setError(err.message || 'Failed to authenticate. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center py-20 px-4 relative overflow-hidden">
            {/* Ultra-Premium Ambient Spatial Background */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <img src="https://image.tmdb.org/t/p/original/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg" alt="Atmosphere" className="w-full h-full object-cover opacity-[0.15]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-transparent to-[#020202]" />
                {/* Huge Gold/Red spatial ambient glow */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E50914]/15 blur-[160px] rounded-full mix-blend-screen" />
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/10 blur-[180px] rounded-full mix-blend-screen" />
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[440px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            >
                {/* Premium Inner Sheen */}
                <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)' }} />

                <div className="flex justify-center mb-10 relative">
                    <div className="absolute inset-0 bg-brand-red/30 blur-[40px] rounded-full pointer-events-none" />
                    <div className="bg-gradient-to-br from-[#E50914] to-red-900 p-4 rounded-2xl shadow-[0_0_30px_rgba(229,9,20,0.4)] relative z-10 border border-red-500/50">
                        <Crown size={32} className="text-white drop-shadow-md" />
                    </div>
                </div>

                <div className="text-center relative z-10 mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                        {isLogin ? 'Premium Access' : 'Create Account'}
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">
                        {isLogin ? 'Authenticate spatial identity.' : 'Join the elite streaming class.'}
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl mb-6 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <AnimatePresence mode="wait">
                        {!isLogin && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="relative group">
                                    <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#E50914] transition-colors" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        required={!isLogin}
                                        className="w-full bg-[#0a0a0a]/60 backdrop-blur-md border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#E50914]/50 focus:bg-[#0a0a0a]/80 transition-all placeholder:text-gray-600 shadow-inner"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#E50914] transition-colors" size={20} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            className="w-full bg-[#0a0a0a]/60 backdrop-blur-md border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#E50914]/50 focus:bg-[#0a0a0a]/80 transition-all placeholder:text-gray-600 shadow-inner"
                        />
                    </div>

                    <div className="relative group">
                        <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#E50914] transition-colors" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className="w-full bg-[#0a0a0a]/60 backdrop-blur-md border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-[#E50914]/50 focus:bg-[#0a0a0a]/80 transition-all placeholder:text-gray-600 shadow-inner"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {isLogin && (
                        <div className="flex justify-end pt-1">
                            <a href="#" className="text-xs text-[#E50914] hover:text-white font-bold transition-colors">Emergency Protocol (Reset Config)?</a>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#E50914] to-red-800 hover:from-red-600 hover:to-red-900 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_5px_20px_rgba(229,9,20,0.4)] hover:shadow-[0_8px_30px_rgba(229,9,20,0.6)] flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group border border-red-500/30"
                    >
                        {loading ? 'Authenticating...' : (isLogin ? 'Initialize Session' : 'Claim Premium Account')}
                        {!loading && <ShieldCheck size={20} className="group-hover:scale-110 transition-transform text-red-200" />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({ name: '', email: '', password: '' });
                            }}
                            className="ml-2 text-white font-bold hover:text-[#E50914] transition-colors"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
