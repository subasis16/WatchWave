import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import {
    LayoutDashboard, Users, Film, Bell, Shield, Search,
    Plus, Pencil, Trash2, Ban, CheckCircle, Send, X,
    TrendingUp, Activity, Tv, Star, ChevronDown, Save,
    ArrowLeft, RefreshCw, AlertTriangle, Crown
} from 'lucide-react';
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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/8 transition-all">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">{label}</p>
            <p className="text-3xl font-black text-white mt-1">{value ?? '—'}</p>
            {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ============================================
// DASHBOARD TAB
// ============================================
const DashboardTab = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch('/api/admin/stats')
            .then(data => setStats(data.stats))
            .catch(err => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="bg-blue-500/20 border border-blue-500/30" />
                <StatCard label="Active Subs" value={stats?.activeSubscriptions} icon={Crown} color="bg-[#E50914]/20 border border-[#E50914]/30" sub="paying members" />
                <StatCard label="Live Rooms" value={stats?.activeRooms} icon={Tv} color="bg-green-500/20 border border-green-500/30" sub="watch parties" />
                <StatCard label="Custom Content" value={stats?.customContent} icon={Film} color="bg-purple-500/20 border border-purple-500/30" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={16} className="text-[#E50914]" /> System Status
                </h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    {[
                        { label: 'API Server', status: 'Operational', ok: true },
                        { label: 'Firebase/Firestore', status: 'Connected', ok: true },
                        { label: 'Socket.io', status: 'Live', ok: true },
                    ].map(item => (
                        <div key={item.label} className="flex items-center justify-between px-4 py-3 bg-black/30 rounded-xl border border-white/5">
                            <span className="text-gray-400">{item.label}</span>
                            <span className={`flex items-center gap-1.5 font-bold text-xs ${item.ok ? 'text-green-400' : 'text-red-400'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.ok ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {stats?.unreadFeedback > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center gap-3">
                    <AlertTriangle size={18} className="text-yellow-400 shrink-0" />
                    <p className="text-yellow-300 text-sm">
                        You have <strong>{stats.unreadFeedback}</strong> unread feedback submissions.
                    </p>
                </div>
            )}
        </div>
    );
};

// ============================================
// CONTENT TAB
// ============================================
const ContentTab = () => {
    const [content, setContent] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        title: '', description: '', image: '', backdrop: '',
        trailerUrl: '', type: 'movie', genre: '', year: new Date().getFullYear(), age: 'TV-14', match: 85
    });
    const [loading, setLoading] = useState(false);

    const fetchContent = async () => {
        try {
            const data = await adminFetch('/api/admin/content');
            setContent(data.content || []);
        } catch (err) { toast.error(err.message); }
    };

    useEffect(() => { fetchContent(); }, []);

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
            fetchContent();
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
            fetchContent();
        } catch (err) { toast.error(err.message); }
    };

    const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#E50914] focus:outline-none transition-colors";
    const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5";

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{content.length} custom titles in your Firestore catalog</p>
                <button
                    onClick={() => { setShowForm(!showForm); setEditing(null); }}
                    className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                    <Plus size={14} /> Add Content
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
                    >
                        <h3 className="text-white font-bold">{editing ? 'Edit Content' : 'Add New Content'}</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div><label className={labelClass}>Title *</label><input required className={inputClass} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Spider-Man" /></div>
                            <div>
                                <label className={labelClass}>Type *</label>
                                <select className={inputClass} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option value="movie">Movie</option>
                                    <option value="series">Series</option>
                                    <option value="anime">Anime</option>
                                </select>
                            </div>
                            <div><label className={labelClass}>Poster Image URL</label><input className={inputClass} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
                            <div><label className={labelClass}>Backdrop Image URL</label><input className={inputClass} value={form.backdrop} onChange={e => setForm({ ...form, backdrop: e.target.value })} placeholder="https://..." /></div>
                            <div className="sm:col-span-2"><label className={labelClass}>YouTube Trailer URL (Embed)</label><input className={inputClass} value={form.trailerUrl} onChange={e => setForm({ ...form, trailerUrl: e.target.value })} placeholder="https://www.youtube.com/embed/VIDEO_ID" /></div>
                            <div><label className={labelClass}>Genres (comma separated)</label><input className={inputClass} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder="Action, Drama, Sci-Fi" /></div>
                            <div><label className={labelClass}>Age Rating</label>
                                <select className={inputClass} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })}>
                                    {['G', 'PG', 'PG-13', 'TV-14', 'TV-MA', '18+'].map(r => <option key={r}>{r}</option>)}
                                </select>
                            </div>
                            <div><label className={labelClass}>Year</label><input type="number" className={inputClass} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></div>
                            <div><label className={labelClass}>Match % (1-100)</label><input type="number" min="1" max="100" className={inputClass} value={form.match} onChange={e => setForm({ ...form, match: e.target.value })} /></div>
                            <div className="sm:col-span-2"><label className={labelClass}>Description</label><textarea rows="3" className={inputClass} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short overview..." /></div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50">
                                <Save size={14} /> {loading ? 'Saving...' : (editing ? 'Update' : 'Add Content')}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-400 hover:text-white text-sm px-4 py-2.5 rounded-xl border border-white/10 transition-all">
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {content.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    <Film size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No custom content yet. Add your first title above.</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-400 font-bold text-xs uppercase tracking-wider">Title</th>
                                <th className="text-left px-4 py-3 text-gray-400 font-bold text-xs uppercase tracking-wider hidden sm:table-cell">Type</th>
                                <th className="text-left px-4 py-3 text-gray-400 font-bold text-xs uppercase tracking-wider hidden md:table-cell">Year</th>
                                <th className="text-right px-4 py-3 text-gray-400 font-bold text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {content.map((item, i) => (
                                <tr key={item.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {item.image && <img src={item.image} alt="" className="w-8 h-12 object-cover rounded-md shrink-0" />}
                                            <span className="text-white font-medium truncate max-w-[160px]">{item.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-full capitalize">{item.type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{item.year}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 transition-all">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all">
                                                <Trash2 size={14} />
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
const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        adminFetch('/api/admin/users')
            .then(data => setUsers(data.users || []))
            .catch(err => toast.error(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleBan = async (uid, currentBanned) => {
        setActionLoading(uid);
        try {
            await adminFetch(`/api/admin/users/${uid}/ban`, {
                method: 'PUT',
                body: JSON.stringify({ banned: !currentBanned })
            });
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, banned: !currentBanned } : u));
            toast.success(currentBanned ? 'User unbanned.' : 'User banned.');
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
            toast.success('Subscription granted (30 days)!');
        } catch (err) { toast.error(err.message); }
        finally { setActionLoading(null); }
    };

    const filtered = users.filter(u =>
        !search || (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:border-[#E50914] focus:outline-none transition-colors"
                />
            </div>
            <p className="text-gray-500 text-xs">{filtered.length} users shown</p>

            <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="text-left px-4 py-3 text-gray-400 font-bold text-xs uppercase tracking-wider">User</th>
                            <th className="text-left px-4 py-3 text-gray-400 font-bold text-xs uppercase tracking-wider hidden md:table-cell">Plan</th>
                            <th className="text-left px-4 py-3 text-gray-400 font-bold text-xs uppercase tracking-wider hidden lg:table-cell">Last Active</th>
                            <th className="text-right px-4 py-3 text-gray-400 font-bold text-xs uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((user, i) => (
                            <tr key={user.uid} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                            alt=""
                                            className="w-9 h-9 rounded-full object-cover border border-white/10"
                                        />
                                        <div>
                                            <p className="text-white font-medium leading-tight flex items-center gap-1.5">
                                                {user.name || 'Unknown'}
                                                {user.banned && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full">Banned</span>}
                                            </p>
                                            <p className="text-gray-500 text-xs truncate max-w-[160px]">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${user.subscriptionStatus === 'active' ? 'bg-[#E50914]/20 text-[#E50914]' : 'bg-white/10 text-gray-400'}`}>
                                        {user.subscriptionStatus === 'active' ? (user.subscriptionPlan || 'Premium') : 'Free'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : '—'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        {user.subscriptionStatus !== 'active' && (
                                            <button
                                                onClick={() => handleSubscription(user.uid)}
                                                disabled={actionLoading === user.uid + '_sub'}
                                                title="Grant 30-day Premium"
                                                className="p-2 rounded-lg bg-white/5 hover:bg-yellow-500/20 text-gray-400 hover:text-yellow-400 transition-all disabled:opacity-50"
                                            >
                                                <Crown size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleBan(user.uid, user.banned)}
                                            disabled={actionLoading === user.uid}
                                            title={user.banned ? "Unban User" : "Ban User"}
                                            className={`p-2 rounded-lg transition-all disabled:opacity-50 ${user.banned ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400'}`}
                                        >
                                            {user.banned ? <CheckCircle size={14} /> : <Ban size={14} />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Users size={32} className="mx-auto mb-2 opacity-30" />
                        <p>No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

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
            toast.success(data.message || 'Broadcast sent!');
            setHistory(prev => [{ message, type, sentAt: new Date().toISOString(), users: data.userCount }, ...prev]);
            setMessage('');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleBroadcast} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Bell size={16} className="text-[#E50914]" /> Broadcast to All Users
                </h3>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Notification Type</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#E50914] focus:outline-none"
                    >
                        <option value="announcement">📢 Announcement</option>
                        <option value="new_content">🎬 New Content</option>
                        <option value="promotion">🎁 Promotion</option>
                        <option value="maintenance">🔧 Maintenance</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Message</label>
                    <textarea
                        required
                        rows="3"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="e.g. New movies added to WatchWave this week! 🎉 Check them out now."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#E50914] focus:outline-none resize-none transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="flex items-center gap-2 bg-[#E50914] hover:bg-red-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all"
                >
                    <Send size={14} /> {sending ? 'Sending...' : 'Send to All Users'}
                </button>
            </form>

            {history.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-sm mb-4">Sent This Session</h3>
                    <div className="space-y-3">
                        {history.map((item, i) => (
                            <div key={i} className="p-4 bg-black/20 rounded-xl border border-white/5">
                                <p className="text-white text-sm">{item.message}</p>
                                <p className="text-gray-500 text-xs mt-1.5">
                                    {item.type} • {item.users} users • {new Date(item.sentAt).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// MAIN ADMIN PAGE
// ============================================
const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: Film },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
];

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAdmin, setIsAdmin] = useState(null); // null = loading, false = denied, true = granted
    const [adminName, setAdminName] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        // Verify admin status on mount
        const checkAdmin = async () => {
            try {
                const token = await getToken();
                const res = await fetch(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.status === 403 || res.status === 401) {
                    setIsAdmin(false);
                } else {
                    setIsAdmin(true);
                    setAdminName(auth.currentUser?.displayName || auth.currentUser?.email || 'Admin');
                }
            } catch {
                setIsAdmin(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) { setIsAdmin(false); return; }
            checkAdmin();
        });
        return () => unsubscribe();
    }, []);

    // Loading state
    if (isAdmin === null) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-2 border-[#E50914]/30 border-t-[#E50914] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Verifying admin access...</p>
            </div>
        </div>
    );

    // Access denied
    if (isAdmin === false) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <Shield size={32} className="text-red-400" />
                </div>
                <h1 className="text-2xl font-black text-white mb-3">Access Denied</h1>
                <p className="text-gray-400 mb-6">You don't have admin privileges. Contact a super-admin to get access.</p>
                <button onClick={() => navigate('/')} className="bg-[#E50914] text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-all">
                    Go Home
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-6 pb-10">
            {/* Admin Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-gray-400 hover:text-white"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className="w-7 h-7 bg-[#E50914]/20 rounded-lg flex items-center justify-center">
                                    <Shield size={14} className="text-[#E50914]" />
                                </div>
                                <h1 className="text-xl font-black tracking-tight">WatchWave Admin</h1>
                            </div>
                            <p className="text-gray-500 text-xs pl-9">Signed in as <span className="text-gray-300">{adminName}</span></p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Live
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5 mb-8 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-1 justify-center ${activeTab === tab.id
                                ? 'bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={15} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                    >
                        {activeTab === 'dashboard' && <DashboardTab />}
                        {activeTab === 'content' && <ContentTab />}
                        {activeTab === 'users' && <UsersTab />}
                        {activeTab === 'notifications' && <NotificationsTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Admin;
