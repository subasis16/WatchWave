import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import {
    LayoutDashboard, Users, Film, Bell, Shield, Search,
    Plus, Pencil, Trash2, Ban, CheckCircle, Send, X,
    TrendingUp, Activity, Tv, Star, ChevronDown, Save,
    ArrowLeft, RefreshCw, AlertTriangle, Crown, MessageSquare,
    Mail, ExternalLink, Filter, Eye, Hash
} from 'lucide-react';
import { onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper to get auth token
const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    return user.getIdToken();
};

// API helper
const adminFetch = async (endpoint, options = {}) => {
    const token = await getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
};

// ============================================
// STAT CARD
// ============================================
const StatCard = ({ label, value, icon: Icon, color, sub }) => (
    <div className="glass-card border-white/5 p-8 flex items-center gap-6 hover:border-white/10 transition-all group relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Icon size={48} />
        </div>
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-3xl ${color} border border-white/5`}>
            <Icon size={24} className="text-white" />
        </div>
        <div className="relative z-10">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black mb-1">{label}</p>
            <p className="text-4xl font-black text-white tracking-tighter">{value ?? '—'}</p>
            {sub && <p className="text-[9px] text-gray-600 mt-2 uppercase tracking-widest font-bold">{sub}</p>}
        </div>
    </div>
);

// ============================================
// DASHBOARD TAB
// ============================================

const DashboardTab = ({ stats, users, content, feedback, messages }) => {
    return (
        <div className="space-y-12 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard label="Total Identities" value={users?.length || stats?.totalUsers} icon={Users} color="bg-blue-500/10" sub="Registered Entities" />
                <StatCard label="Active Subs" value={users?.filter(u => u.subscriptionStatus === 'active').length || stats?.activeSubscriptions} icon={Crown} color="bg-accent-gold/10" sub="Premium Access Hubs" />
                <StatCard label="Live Buffers" value={stats?.activeRooms} icon={Tv} color="bg-green-500/10" sub="Active Watch Parties" />
                <StatCard label="Media Artifacts" value={content?.length || stats?.customContent} icon={Film} color="bg-purple-500/10" sub="Custom Content Docs" />
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* System Integrity */}
                <div className="glass-card border-white/5 p-10 relative overflow-hidden h-fit">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02]">
                        <Activity size={80} />
                    </div>
                    <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                        <Activity size={14} className="text-accent-gold" /> Core System Integrity
                    </h3>
                    <div className="grid gap-6">
                        {[
                            { label: 'Primary API Hub', status: 'Operational', ok: true },
                            { label: 'Direct Firestore Link', status: 'Established', ok: true },
                            { label: 'Cloud Transmission', status: 'Connected', ok: true },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between px-8 py-5 glass-card border-white/5 bg-white/[0.01] hover:border-white/10 transition-all">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">{item.label}</span>
                                <span className={`flex items-center gap-3 font-black text-[9px] uppercase tracking-widest ${item.ok ? 'text-green-400' : 'text-red-400'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${item.ok ? 'bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]' : 'bg-red-400 shadow-[0_0_10px_#f87171]'}`} />
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Feed (Real-time Activity) */}
                <div className="glass-card border-white/5 p-10 relative overflow-hidden">
                    <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                        <TrendingUp size={14} className="text-accent-gold" /> Live Activity Feed
                    </h3>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                        {[
                            ...(users?.slice(0, 3).map(u => ({ type: 'user', name: u.name || u.email, msg: 'Joined the network', icon: Users, time: u.lastActive })) || []),
                            ...(content?.slice(0, 3).map(c => ({ type: 'content', name: c.title, msg: 'New artifact published', icon: Film, time: c.createdAt })) || []),
                            ...(feedback?.slice(0, 3).map(f => ({ type: 'feedback', name: f.email, msg: 'Transmission received', icon: MessageSquare, time: f.timestamp })) || []),
                        ].sort((a, b) => new Date(b.time) - new Date(a.time)).map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center shrink-0">
                                    <item.icon size={16} className="text-gray-500" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white">
                                        <span className="text-accent-gold">{item.name}</span> — {item.msg}
                                    </p>
                                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{new Date(item.time).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// CONTENT TAB
// ============================================
const ContentTab = ({ initialContent }) => {
    const [content, setContent] = useState(initialContent || []);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        title: '', description: '', image: '', backdrop: '',
        trailerUrl: '', type: 'movie', genre: '', year: new Date().getFullYear(), age: 'TV-14', match: 85
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => { setContent(initialContent); }, [initialContent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                genre: form.genre.split(',').map(g => g.trim()).filter(Boolean),
                year: parseInt(form.year),
                match: parseInt(form.match),
            };

            if (editing) {
                await adminFetch(`/api/admin/content/${editing}`, { method: 'PUT', body: JSON.stringify(payload) });
                toast.success('Content updated!');
            } else {
                await adminFetch('/api/admin/content', { method: 'POST', body: JSON.stringify(payload) });
                toast.success('Content added!');
            }

            setShowForm(false);
            setEditing(null);
            setForm({ title: '', description: '', image: '', backdrop: '', trailerUrl: '', type: 'movie', genre: '', year: new Date().getFullYear(), age: 'TV-14', match: 85 });
        } catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    };

    const handleEdit = (item) => {
        setEditing(item.id);
        setForm({
            title: item.title || '',
            description: item.description || '',
            image: item.image || '',
            backdrop: item.backdrop || '',
            trailerUrl: item.trailerUrl || '',
            type: item.type || 'movie',
            genre: Array.isArray(item.genre) ? item.genre.join(', ') : (item.genre || ''),
            year: item.year || new Date().getFullYear(),
            age: item.age || 'TV-14',
            match: item.match || 85,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this content? This cannot be undone.')) return;
        try {
            await adminFetch(`/api/admin/content/${id}`, { method: 'DELETE' });
            toast.success('Deleted!');
        } catch (err) { toast.error(err.message); }
    };

    const handleTrailerUrlChange = (val) => {
        let finalUrl = val;
        // Basic pattern matching for YouTube URLs
        const ytPatterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^#&?]*)/,
            /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^#&?]*)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^#&?]*)/,
            /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([^#&?]*)/
        ];

        for (const pattern of ytPatterns) {
            const match = val.match(pattern);
            if (match && match[1]) {
                finalUrl = `https://www.youtube-nocookie.com/embed/${match[1]}`;
                break;
            }
        }
        setForm({ ...form, trailerUrl: finalUrl });
    };

    const inputClass = "w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white text-[11px] font-bold uppercase tracking-widest focus:border-accent-gold/40 focus:outline-none transition-all placeholder:text-gray-600 shadow-inner";
    const labelClass = "block text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2 pl-1";

    return (
        <div className="space-y-10 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Movie Database</h3>
                    <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase tracking-[0.2em]">{content.length} Custom Movies Added</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditing(null); }}
                    className="flex items-center gap-3 glass-pill-active px-8 py-4 font-black text-[10px] uppercase tracking-[0.4em] transition-all transform hover:scale-105 shadow-2xl"
                >
                    <Plus size={16} /> Add New Content
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        onSubmit={handleSubmit}
                        className="glass-card border-white/10 p-10 space-y-8 relative overflow-hidden shadow-3xl"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-accent-gold/20" />
                        
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent-gold">{editing ? 'Modification Mode' : 'Creation Mode'}</h3>
                            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-12">
                            {/* Left Col: Metadata */}
                            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Movie Name *</label>
                                    <input required className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter content title" />
                                </div>
                                <div>
                                    <label className={labelClass}>Content Type *</label>
                                    <select className={inputClass} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                        <option value="movie">Cinematic (Movie)</option>
                                        <option value="series">Episodic (Series)</option>
                                        <option value="anime">Illustrated (Anime)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Age Rating</label>
                                    <select className={inputClass} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}>
                                        {['G', 'PG', 'PG-13', 'TV-14', 'TV-MA', '18+'].map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Visual Upload (Poster) URL</label>
                                    <input className={inputClass} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://external-screen/poster.jpg" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Backdrop Horizon URL</label>
                                    <input className={inputClass} value={form.backdrop} onChange={e => setForm({ ...form, backdrop: e.target.value })} placeholder="https://external-screen/backdrop.jpg" />
                                </div>
                                
                                <div className="sm:col-span-2">
                                    <label className={labelClass}>YouTube Stream Path *</label>
                                    <input 
                                        required 
                                        className={inputClass} 
                                        value={form.trailerUrl} 
                                        onChange={e => handleTrailerUrlChange(e.target.value)} 
                                        placeholder="Paste standard YT link" 
                                    />
                                    <p className="text-[10px] text-gray-600 mt-3 font-bold uppercase tracking-widest pl-1 italic">Cinematic conversion active.</p>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Descriptive Metadata</label>
                                    <textarea rows="4" className={inputClass} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Enter movie description..." />
                                </div>

                                <div><label className={labelClass}>Genre Tags (CSV)</label><input className={inputClass} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder="Action, Sci-Fi" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className={labelClass}>Release Year</label><input type="number" className={inputClass} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                                    <div><label className={labelClass}>Match %</label><input type="number" min="1" max="100" className={inputClass} value={form.match} onChange={e => setForm({ ...form, match: e.target.value })} /></div>
                                </div>
                            </div>

                            {/* Right Col: Video Preview */}
                            <div className="space-y-6">
                                <label className={labelClass}>Preview Feed</label>
                                <div className="aspect-video bg-black rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center relative shadow-3xl">
                                    {form.trailerUrl ? (
                                        <iframe
                                            src={form.trailerUrl}
                                            className="w-full h-full"
                                            title="Preview"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        ></iframe>
                                    ) : (
                                        <div className="text-gray-600 text-center px-8 space-y-4">
                                            <Tv size={40} className="mx-auto opacity-10" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting cinematic upload...</p>
                                        </div>
                                    )}
                                </div>
                                <div className="glass-card border-accent-gold/20 p-6 flex items-center gap-4 bg-accent-gold/[0.02]">
                                    <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                                    <span className="text-[10px] text-accent-gold font-black uppercase tracking-[0.2em]">Live Validation Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 pt-10 border-t border-white/5">
                            <button type="submit" disabled={loading} className="flex items-center gap-4 glass-pill-active px-10 py-5 font-black text-[10px] uppercase tracking-[0.4em] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100">
                                <Save size={16} /> {loading ? 'Processing...' : (editing ? 'Update Movie' : 'Publish Movie')}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-500 hover:text-white font-black text-[10px] uppercase tracking-[0.4em] px-10 py-5 rounded-full border border-white/5 transition-all hover:bg-white/5">
                                Abort
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {content.length === 0 ? (
                <div className="glass-card border-white/5 border-dashed py-32 text-center shadow-3xl">
                    <Film size={48} className="mx-auto mb-8 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Database is empty. No custom movies added yet.</p>
                </div>
            ) : (
                <div className="glass-card border-white/5 overflow-hidden shadow-3xl">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Designation</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden sm:table-cell">Classification</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden md:table-cell">Playback</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {content.map((item, i) => (
                                <tr key={item.id} className="group hover:bg-white/[0.01] transition-all duration-500">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            {item.image && (
                                                <div className="w-12 h-16 rounded-xl overflow-hidden shadow-2xl shrink-0 group-hover:scale-110 transition-transform duration-700">
                                                    <img src={item.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                                                </div>
                                            )}
                                            <div className="truncate">
                                                <p className="text-lg font-black text-white uppercase tracking-tighter truncate max-w-[250px]">{item.title}</p>
                                                <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1">ID: {item.id.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 hidden sm:table-cell">
                                        <span className="glass-pill px-4 py-1 text-[9px] font-black uppercase tracking-widest text-accent-gold border-accent-gold/20">
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-[10px] font-black text-gray-500 uppercase tracking-widest hidden md:table-cell">{item.year}</td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center justify-end gap-6">
                                            <button onClick={() => handleEdit(item)} className="text-gray-600 hover:text-white transition-colors" title="Edit Metadata">
                                                <Pencil size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="text-gray-600 hover:text-red-500 transition-colors" title="Delete Movie">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ============================================
// USERS TAB
// ============================================
const UsersTab = ({ initialUsers }) => {
    const [users, setUsers] = useState(initialUsers || []);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => { setUsers(initialUsers); }, [initialUsers]);

    const handleBan = async (uid, currentBanned) => {
        setActionLoading(uid);
        try {
            await adminFetch(`/api/admin/users/${uid}/ban`, {
                method: 'PUT',
                body: JSON.stringify({ banned: !currentBanned })
            });
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, banned: !currentBanned } : u));
            toast.success(currentBanned ? 'User Profile Restored' : 'User Profile Queried / Banned');
        } catch (err) { toast.error(err.message); }
        finally { setActionLoading(null); }
    };

    const handleDeleteUser = async (uid) => {
        if (!confirm('PERMANENTLY SEVER ACCESS? This will delete the user profile from the database forever.')) return;
        setActionLoading(uid + '_del');
        try {
            await adminFetch(`/api/admin/users/${uid}`, { method: 'DELETE' });
            setUsers(prev => prev.filter(u => u.uid !== uid));
            toast.success('Identity Database Purged');
        } catch (err) { toast.error(err.message); }
        finally { setActionLoading(null); }
    };

    const handleSubscription = async (uid) => {
        setActionLoading(uid + '_sub');
        try {
            await adminFetch(`/api/admin/users/${uid}/subscription`, {
                method: 'PUT',
                body: JSON.stringify({ status: 'active', plan: 'premium', days: 30 })
            });
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, subscriptionStatus: 'active' } : u));
            toast.success('Certificate Granted: Pro Screen (30d)');
        } catch (err) { toast.error(err.message); }
        finally { setActionLoading(null); }
    };

    const filtered = users.filter(u =>
        !search || (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
        </div>
    );

    return (
        <div className="space-y-10 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">User Database</h3>
                    <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase tracking-[0.2em]">{filtered.length} Active Screens Polled</p>
                </div>
                <div className="relative w-full sm:w-80 group">
                    <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-gold transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Identity Database..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white text-[11px] font-bold uppercase tracking-widest focus:border-accent-gold/40 focus:outline-none transition-all placeholder:text-gray-600 shadow-inner"
                    />
                </div>
            </div>

            <div className="glass-card border-white/5 overflow-hidden shadow-3xl">
                <table className="w-full text-left">
                    <thead className="bg-white/[0.02] border-b border-white/5">
                        <tr>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">User Profile</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden md:table-cell">Certificate</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 hidden lg:table-cell">Last Ping</th>
                            <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {filtered.map((user, i) => (
                            <tr key={user.uid} className="group hover:bg-white/[0.01] transition-all duration-500">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                        <div className="relative shrink-0">
                                            <img
                                                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                                alt=""
                                                className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-2xl"
                                            />
                                            {user.banned && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050505] flex items-center justify-center">
                                                    <X size={8} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-lg font-black text-white uppercase tracking-tighter truncate max-w-[200px] flex items-center gap-2">
                                                {user.name || 'Anonymous Screen'}
                                                {user.subscriptionStatus === 'active' && <Crown size={14} className="text-accent-gold" />}
                                            </p>
                                            <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1 truncate max-w-[200px]">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 hidden md:table-cell">
                                    <span className={`glass-pill px-4 py-1 text-[9px] font-black uppercase tracking-widest border transition-all ${user.subscriptionStatus === 'active' ? 'text-accent-gold border-accent-gold/20 bg-accent-gold/5 shadow-xl' : 'text-gray-600 border-white/5'}`}>
                                        {user.subscriptionStatus === 'active' ? (user.subscriptionPlan || 'Pro Screen') : 'Free Tier'}
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-[10px] font-black text-gray-600 uppercase tracking-widest hidden lg:table-cell">
                                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Unknown'}
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center justify-end gap-6">
                                        {user.subscriptionStatus !== 'active' && (
                                            <button
                                                onClick={() => handleSubscription(user.uid)}
                                                disabled={actionLoading === user.uid + '_sub'}
                                                className="text-gray-600 hover:text-accent-gold transition-colors disabled:opacity-30"
                                                title="Elevate To Pro"
                                            >
                                                <Crown size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleBan(user.uid, user.banned)}
                                            disabled={actionLoading === user.uid}
                                            className={`transition-colors disabled:opacity-30 ${user.banned ? 'text-green-500/60 hover:text-green-400' : 'text-gray-600 hover:text-red-500'}`}
                                            title={user.banned ? "Restore Screen" : "Sever Screen Access"}
                                        >
                                            {user.banned ? <CheckCircle size={18} /> : <Ban size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.uid)}
                                            disabled={actionLoading === user.uid + '_del'}
                                            className="text-gray-600 hover:text-red-700 transition-colors disabled:opacity-30"
                                            title="Permanent Deletion"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-20 text-center">
                        <Users size={40} className="mx-auto mb-4 opacity-10" />
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">No users match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ============================================
// FEEDBACK TAB
// ============================================
const FeedbackTab = ({ feedbacks }) => (
    <div className="space-y-10 animate-slide-up">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Transmission Feed</h3>
                <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase tracking-[0.2em]">{feedbacks.length} Feedback Packets Intercepted</p>
            </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedbacks.map(f => (
                <div key={f.id} className="glass-card border-white/5 p-8 space-y-6 hover:border-white/10 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-1 text-accent-gold">
                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < f.rating ? 'currentColor' : 'none'} className={i < f.rating ? '' : 'text-gray-700'} />)}
                        </div>
                        <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{new Date(f.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed">"{f.message}"</p>
                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{f.email || 'Anonymous Agent'}</div>
                        <span className="glass-pill px-3 py-1 text-[8px] font-black text-accent-gold border-accent-gold/20">{f.category}</span>
                    </div>
                </div>
            ))}
            {feedbacks.length === 0 && (
                <div className="col-span-full py-20 text-center glass-card border-white/5 border-dashed">
                    <MessageSquare size={32} className="mx-auto mb-4 opacity-10" />
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Archive Empty. No feedback found.</p>
                </div>
            )}
        </div>
    </div>
);

// ============================================
// MESSAGES TAB (Contact)
// ============================================
const MessagesTab = ({ messages }) => (
    <div className="space-y-10 animate-slide-up">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Direct Signals</h3>
                <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase tracking-[0.2em]">{messages.length} Priority Encounters Logged</p>
            </div>
        </div>

        <div className="glass-card border-white/5 overflow-hidden shadow-3xl">
            <table className="w-full text-left">
                <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Origin</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Transmission Payload</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 text-right">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                    {messages.map((m) => (
                        <tr key={m.id} className="group hover:bg-white/[0.01] transition-all duration-500">
                            <td className="px-10 py-8">
                                <p className="text-sm font-black text-white uppercase tracking-tight">{m.name}</p>
                                <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1">{m.email}</p>
                            </td>
                            <td className="px-10 py-8 text-sm text-gray-400 font-medium leading-relaxed max-w-xl">{m.message}</td>
                            <td className="px-10 py-8 text-right text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                {m.timestamp ? new Date(m.timestamp).toLocaleString() : 'Just now'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {messages.length === 0 && (
                <div className="py-20 text-center">
                    <Mail size={32} className="mx-auto mb-4 opacity-10" />
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Communication Hub Silent.</p>
                </div>
            )}
        </div>
    </div>
);

// ============================================
// NOTIFICATIONS TAB
// ============================================
const NotificationsTab = () => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('announcement');
    const [sending, setSending] = useState(false);
    const [history, setHistory] = useState([]);

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setSending(true);
        try {
            const data = await adminFetch('/api/admin/notifications/broadcast', {
                method: 'POST',
                body: JSON.stringify({ message, type }),
            });
            toast.success('Global Message Sent!');
            setHistory(prev => [{ message, type, sentAt: new Date().toISOString(), users: data.userCount }, ...prev]);
            setMessage('');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-12 animate-slide-up">
            <div className="grid lg:grid-cols-2 gap-12">
                <form onSubmit={handleBroadcast} className="glass-card border-white/5 p-10 space-y-8 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02]">
                        <Bell size={60} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Global Message</h3>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">Send notifications to all online watch parties</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className={labelClass}>Signal Classification</label>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className={inputClass}
                            >
                                <option value="announcement">📢 Standard Announcement</option>
                                <option value="new_content">🎬 High-Value Artifact Added</option>
                                <option value="promotion">🎁 Network Incentive</option>
                                <option value="maintenance">🔧 Screen Connection</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Transmission Payload</label>
                            <textarea
                                required
                                rows="4"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Enter message for broadcast..."
                                className={inputClass + " resize-none"}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sending || !message.trim()}
                            className="w-full flex items-center justify-center gap-4 glass-pill-active p-5 font-black text-[10px] uppercase tracking-[0.4em] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 shadow-2xl"
                        >
                            <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>

                <div className="space-y-8">
                    <h3 className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] mb-4 pl-2">Session Log / Signal History</h3>
                    <div className="space-y-6 max-h-[600px] overflow-y-auto no-scrollbar pr-4">
                        {history.length === 0 ? (
                            <div className="glass-card border-white/5 border-dashed p-10 text-center">
                                <Activity size={32} className="mx-auto mb-4 opacity-10" />
                                <p className="text-[9px] text-gray-600 uppercase tracking-widest font-black">Buffer Clean. No messages found.</p>
                            </div>
                        ) : (
                            history.map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="glass-card border-white/5 p-6 space-y-3 bg-white/[0.01] hover:border-white/10 transition-all shadow-xl relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-accent-gold">{item.type}</div>
                                        <div className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">{new Date(item.sentAt).toLocaleTimeString()}</div>
                                    </div>
                                    <p className="text-sm text-gray-300 font-medium leading-relaxed">{item.message}</p>
                                    <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest pt-2 border-t border-white/[0.03]">
                                        Impact: {item.users} Screens Synergized
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// MAIN ADMIN PAGE
// ============================================
const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'content', label: 'Content', icon: Film },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'messages', label: 'Messages', icon: Mail },
];

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAdmin, setIsAdmin] = useState(null); 
    const [adminName, setAdminName] = useState('');
    
    // Real-time Data States
    const [users, setUsers] = useState([]);
    const [content, setContent] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const checkAdmin = async () => {
            if (auth.currentUser?.email === 'subasis16007@gmail.com') {
                setIsAdmin(true);
                setAdminName(auth.currentUser.displayName || auth.currentUser.email);
            } else {
                try {
                    const token = await getToken();
                    const res = await fetch(`${API_URL}/api/admin/stats`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.status === 403 || res.status === 401) setIsAdmin(false);
                    else {
                        setIsAdmin(true);
                        setAdminName(auth.currentUser?.displayName || auth.currentUser?.email || 'Admin Operator');
                    }
                } catch { setIsAdmin(false); }
            }
        };

        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (!user) { setIsAdmin(false); return; }
            checkAdmin();
        });

        // Initialize Real-time Listeners once admin status is confirmed
        let unsubUsers, unsubContent, unsubFeedback, unsubMessages, statsInterval;
        
        if (isAdmin) {
             unsubUsers = onSnapshot(query(collection(db, 'users'), orderBy('lastActive', 'desc'), limit(100)), (snapshot) => {
                setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })));
            });
            unsubContent = onSnapshot(query(collection(db, 'content'), orderBy('createdAt', 'desc')), (snapshot) => {
                setContent(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            unsubFeedback = onSnapshot(query(collection(db, 'feedback'), orderBy('timestamp', 'desc')), (snapshot) => {
                setFeedback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            unsubMessages = onSnapshot(query(collection(db, 'contactMessages'), orderBy('timestamp', 'desc')), (snapshot) => {
                setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });

            // Initial stats fetch
            const fetchStats = () => {
                adminFetch('/api/admin/stats')
                    .then(data => setStats(data.stats))
                    .catch(err => console.warn('Stats sync skipped:', err.message));
            };

            fetchStats();
            const statsInterval = setInterval(fetchStats, 30000); // 30s polling for server-side metrics
        }

        return () => {
            unsubscribeAuth();
            if (unsubUsers) unsubUsers();
            if (unsubContent) unsubContent();
            if (unsubFeedback) unsubFeedback();
            if (unsubMessages) unsubMessages();
            if (statsInterval) clearInterval(statsInterval);
        };
    }, [isAdmin]);

    if (isAdmin === null) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-2 border-white/5 border-t-white rounded-full animate-spin mx-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Verifying Authorization Features...</p>
            </div>
        </div>
    );

    if (isAdmin === false) return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-8 overflow-hidden relative">
            <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-red-500/[0.03] blur-[150px] rounded-full" />
            <div className="text-center max-w-sm relative z-10">
                <div className="w-24 h-24 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-3xl">
                    <Shield size={40} className="text-gray-600" />
                </div>
                <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Access Denied</h1>
                <p className="text-[10px] text-gray-500 mb-10 font-bold uppercase tracking-[0.2em] leading-relaxed">Your screen does not possess the required administrative certificates for this sector.</p>
                <button onClick={() => navigate('/')} className="glass-pill-active px-10 py-5 font-black text-[10px] uppercase tracking-[0.4em] transition-all transform hover:scale-105">
                    Return to Mission Hub
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-24 selection:bg-accent-gold selection:text-black relative overflow-hidden">
            {/* Cinematic Background Field */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-accent-gold/[0.03] blur-[180px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-white/[0.02] blur-[150px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Admin Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20 animate-slide-up">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => navigate('/')}
                            className="p-5 rounded-[1.5rem] glass-card border-white/5 hover:border-white/20 transition-all text-gray-600 hover:text-white shadow-2xl group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-8 h-8 glass-card border-white/10 rounded-xl flex items-center justify-center shadow-inner">
                                    <Shield size={16} className="text-accent-gold" />
                                </div>
                                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Command Center</h1>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 pl-12 flex items-center gap-2">
                                Operator: <span className="text-gray-400">{adminName}</span>
                            </p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-accent-gold glass-card border-accent-gold/20 px-8 py-4 rounded-full shadow-3xl">
                        <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse shadow-[0_0_10px_#FFD700]" />
                        Secure Tunnel Established
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 glass-card border-white/5 rounded-[2.5rem] p-3 mb-20 overflow-x-auto no-scrollbar shadow-3xl max-w-6xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 whitespace-nowrap justify-center relative overflow-hidden group shrink-0
                                ${activeTab === tab.id
                                    ? 'glass-pill-active border-white/20 shadow-2xl'
                                    : 'text-gray-600 hover:text-white hover:bg-white/[0.02]'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {activeTab === tab.id && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-accent-gold" />}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                    >
                        {activeTab === 'dashboard' && <DashboardTab stats={stats} users={users} content={content} feedback={feedback} messages={messages} />}
                        {activeTab === 'content' && <ContentTab initialContent={content} />}
                        {activeTab === 'users' && <UsersTab initialUsers={users} />}
                        {activeTab === 'feedback' && <FeedbackTab feedbacks={feedback} />}
                        {activeTab === 'messages' && <MessagesTab messages={messages} />}
                        {activeTab === 'notifications' && <NotificationsTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Admin;
