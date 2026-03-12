require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db, auth } = require('./firebase');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Real-Time Chat WebSocket Handlers
io.on("connection", (socket) => {
    console.log(`🔌 User Connected: ${socket.id}`);

    // Join a unique 1-on-1 private room for chatting
    socket.on("join_chat", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    // Listen for incoming messages and broadcast to the specific room
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// ==========================================
// 1. PAYMENT ROUTES (RAZORPAY)
// ==========================================

// Create Razorpay Order
app.post('/api/payments/create-order', async (req, res) => {
    try {
        const { amount, currency = "INR", receipt } = req.body;

        // Razorpay requires amount in smallest currency unit (paise)
        const options = {
            amount: amount * 100,
            currency,
            receipt: receipt || `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Order creation failed" });
        }

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error("Razorpay Order Error: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Razorpay Webhook for secure payment verification
app.post('/api/payments/webhook', async (req, res) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // Create exactly what Razorpay expects using crypto
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (expectedSignature === webhookSignature) {
            // Signature is valid. Payment is authentic!
            const paymentEntity = req.body.payload.payment.entity;
            const eventType = req.body.event;

            if (eventType === 'payment.captured') {
                const firebaseUid = paymentEntity.notes.firebase_uid; // Read custom notes passed from frontend
                const planId = paymentEntity.notes.plan_id;

                if (firebaseUid) {
                    // Update the user's document in Firestore via the Admin SDK
                    const userRef = db.collection('users').doc(firebaseUid);

                    // Add 30 days to current date for premium expiration
                    const premiumUntil = new Date();
                    premiumUntil.setDate(premiumUntil.getDate() + 30);

                    await userRef.update({
                        subscriptionStatus: 'active',
                        subscriptionPlan: planId,
                        premiumUntil: premiumUntil.toISOString(),
                        subscriptionId: paymentEntity.order_id
                    });

                    console.log(`Successfully upgraded user ${firebaseUid} to Premium!`);
                }
            }
            res.status(200).json({ success: true });
        } else {
            // Bad signature! Attempted spoofing!
            res.status(400).json({ success: false, message: 'Invalid Webhook Signature' });
        }
    } catch (error) {
        console.error("Razorpay Webhook Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ==========================================
// 2. ROOT & HEALTH
// ==========================================
app.get('/', (req, res) => {
    res.json({ message: 'WatchWave API is running with Firebase Admin Backend!' });
});

// 2. Watch Party Management API
app.post('/api/party/create', async (req, res) => {
    try {
        const { room_code, room_password, host_id } = req.body;

        if (!room_code) {
            return res.status(400).json({ message: 'Room code is required' });
        }

        // Save room data to Firestore
        const roomRef = db.collection('rooms').doc(room_code);
        const doc = await roomRef.get();

        if (doc.exists) {
            return res.status(400).json({ message: 'Room already exists' });
        }

        // Add to Firebase Firestore Database via Admin SDK
        await roomRef.set({
            room_password: room_password || '',
            host_id: host_id || 'anonymous',
            created_at: new Date().toISOString(),
            status: 'active',
            participants: [] // Empty array by default
        });

        res.status(201).json({ message: 'Room created successfully', room_code });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({
            message: 'Server error while creating room',
            error: error.message,
            details: error
        });
    }
});

// 3. User Profile Sync (Using the 8-digit UIDs generated in Profile.jsx)
app.post('/api/users/profile', async (req, res) => {
    try {
        const { uid, name, email, avatar, language } = req.body;

        if (!uid) {
            return res.status(400).json({ error: "Client-side UID is required" });
        }

        // Merge Data safely into the Users collection
        await db.collection('users').doc(String(uid)).set({
            name: name || 'Anonymous',
            email: email || '',
            avatar: avatar || null,
            language: language || 'English',
            lastActive: new Date().toISOString()
        }, { merge: true });

        res.status(200).json({ message: "Profile saved securely", uid });
    } catch (error) {
        console.error('Error synchronizing profile:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Friend Request System (Via Add UID functionality in Sidebar)
app.post('/api/friends/request', async (req, res) => {
    try {
        const { senderUid, targetUid } = req.body;

        if (!senderUid || !targetUid) {
            return res.status(400).json({ error: "Both sender and target UIDs are required" });
        }

        if (String(senderUid) === String(targetUid)) {
            return res.status(400).json({ error: "Cannot send a friend request to yourself" });
        }

        // Add a document inside the target user's "friendRequests" Sub-collection
        await db.collection('users')
            .doc(String(targetUid))
            .collection('friendRequests')
            .doc(String(senderUid)).set({
                from: String(senderUid),
                status: 'pending',
                timestamp: new Date().toISOString()
            });

        res.status(200).json({ message: "Friend request physically sent to user!" });
    } catch (error) {
        console.error('Error posting friend request:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 WatchWave Backend & Socket.io are actively running on port ${PORT}`);
});
