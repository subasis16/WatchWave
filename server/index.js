require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const { generalLimiter } = require('./middleware/rateLimit');

// ==========================================
// ROUTE IMPORTS
// ==========================================
const contentRoutes = require('./routes/content');
const userRoutes = require('./routes/users');
const friendRoutes = require('./routes/friends');
const paymentRoutes = require('./routes/payments');
const partyRoutes = require('./routes/party');
const feedbackRoutes = require('./routes/feedback');
const adminRoutes = require('./routes/admin');
const recommendationsRoutes = require('./routes/recommendations');

// ==========================================
// APP SETUP
// ==========================================
const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
}));

app.use(cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Raw body for Razorpay webhook signature verification
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON body parser for all other routes
app.use(express.json({ limit: '5mb' }));

// General rate limiter for all routes
app.use(generalLimiter);

// ==========================================
// ROUTES
// ==========================================
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/party', partyRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({
        message: '≡ƒÄ¼ WatchWave API is running.',
        version: '2.0.0',
        endpoints: {
            content: '/api/content',
            users: '/api/users',
            friends: '/api/friends',
            payments: '/api/payments',
            party: '/api/party',
            feedback: '/api/feedback',
            admin: '/api/admin',
        }
    });
});

// 404 handler
app.use((req, res, next) => {
    // Check if it's one of our custom endpoints that wasn't modularized
    if (req.path.startsWith('/api/users/') || req.path.startsWith('/api/notifications/')) {
        return next();
    }
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
});

// ==========================================
// SOCKET.IO ΓÇö Real-Time Features
// ==========================================
const io = new Server(server, {
    cors: {
        origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

io.on('connection', (socket) => {
    console.log(`≡ƒöî Connected: ${socket.id}`);

    // ---- Private 1-on-1 Chat ----
    socket.on('join_chat', (room) => {
        socket.join(room);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data);
    });

    // ---- Watch Party Room ----
    socket.on('join_watch_room', ({ roomCode, userId, username }) => {
        socket.join(`room_${roomCode}`);
        socket.to(`room_${roomCode}`).emit('user_joined', { userId, username });
        console.log(`≡ƒÄ¼ ${username} joined room ${roomCode}`);
    });

    socket.on('leave_watch_room', ({ roomCode, userId, username }) => {
        socket.leave(`room_${roomCode}`);
        socket.to(`room_${roomCode}`).emit('user_left', { userId, username });
    });

    // Sync: play/pause/seek/content change
    socket.on('sync_play', ({ roomCode, progress }) => {
        socket.to(`room_${roomCode}`).emit('sync_play', { progress });
    });

    socket.on('sync_pause', ({ roomCode, progress }) => {
        socket.to(`room_${roomCode}`).emit('sync_pause', { progress });
    });

    socket.on('sync_seek', ({ roomCode, progress }) => {
        socket.to(`room_${roomCode}`).emit('sync_seek', { progress });
    });

    socket.on('sync_content', ({ roomCode, content }) => {
        socket.to(`room_${roomCode}`).emit('sync_content', { content });
    });

    // Watch Party Chat message
    socket.on('room_message', ({ roomCode, message }) => {
        socket.to(`room_${roomCode}`).emit('room_message', message);
    });

    // Entry request (knock-to-enter system)
    socket.on('entry-request', ({ roomCode, userId }) => {
        socket.to(`room_${roomCode}`).emit('receive-entry-request', { userId, socketId: socket.id });
    });

    socket.on('entry-accepted', ({ socketId }) => {
        io.to(socketId).emit('entry-accepted');
    });

    socket.on('entry-declined', ({ socketId }) => {
        io.to(socketId).emit('entry-declined');
    });

    // Reactions
    socket.on('send_reaction', ({ roomCode, reaction }) => {
        socket.to(`room_${roomCode}`).emit('receive_reaction', reaction);
    });

    // ---- Notifications ----
    // Admin can emit 'send-notification' to a user's personal room
    socket.on('join_user_room', (uid) => {
        socket.join(`user_${uid}`);
    });

    // Admin broadcast (server-side only, kept for reference)
    socket.on('broadcast_notification', (notification) => {
        io.emit('receive-notification', notification);
    });

    socket.on('disconnect', () => {
        console.log(`≡ƒöî Disconnected: ${socket.id}`);
    });
});

// Export io so routes can emit notifications
module.exports.io = io;

// ==========================================
// CUSTOM ENDPOINTS (Feature/Watch-Party-UI)
// ==========================================
const { db } = require('./firebase');

// GET User Setup (Minimal Profile)
app.get('/api/users/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();
        if (!doc.exists) return res.status(404).json({ error: 'User not found' });
        const data = doc.data();
        res.status(200).json({
            uid,
            name: data.name,
            avatar: data.avatar,
            bio: data.bio,
            isOnline: data.isOnline,
            badges: data.badges,
            language: data.language
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Online Status & Broadcast
app.post('/api/users/:uid/status', async (req, res) => {
    try {
        const { uid } = req.params;
        const { isOnline } = req.body;
        await db.collection('users').doc(uid).update({
            isOnline: Boolean(isOnline),
            lastActive: new Date().toISOString()
        });
        io.emit('user-status-change', { uid, isOnline: Boolean(isOnline) });
        res.status(200).json({ message: 'Status updated', isOnline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send Custom Socket Notification
app.post('/api/notifications/send', async (req, res) => {
    try {
        const { targetSocketId, message, avatar, type } = req.body;
        const notification = {
            message,
            avatar: avatar || null,
            type: type || 'info',
            timestamp: new Date().toLocaleTimeString()
        };
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive-notification', notification);
        } else {
            io.emit('receive-notification', notification);
        }
        res.status(200).json({ message: 'Notification sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`≡ƒÜÇ WatchWave API & Socket.io running on port ${PORT}`);
    console.log(`   CLIENT_URL: ${CLIENT_URL}`);
    console.log(`   TMDB API:   ${process.env.TMDB_API_KEY ? 'Γ£à Configured' : 'Γ¥î Missing TMDB_API_KEY'}`);
    console.log(`   Razorpay:   ${process.env.RAZORPAY_KEY_ID ? 'Γ£à Configured' : 'ΓÜá∩╕Å  Missing (payments disabled)'}`);
});
