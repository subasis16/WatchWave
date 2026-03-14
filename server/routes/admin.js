const express = require('express');
const router = express.Router();
const { db, auth: adminAuth } = require('../firebase');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// All admin routes require both verifyToken AND verifyAdmin
router.use(verifyToken, verifyAdmin);

// ==========================================
// DASHBOARD STATS
// ==========================================

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const [usersSnap, feedbackSnap, roomsSnap, contentSnap] = await Promise.all([
            db.collection('users').count().get(),
            db.collection('feedback').where('status', '==', 'unread').count().get(),
            db.collection('rooms').where('status', '==', 'active').count().get(),
            db.collection('content').count().get(),
        ]);

        // Count active subscriptions
        const activeSubsSnap = await db.collection('users')
            .where('subscriptionStatus', '==', 'active').count().get();

        res.json({
            success: true,
            stats: {
                totalUsers: usersSnap.data().count,
                activeSubscriptions: activeSubsSnap.data().count,
                activeRooms: roomsSnap.data().count,
                unreadFeedback: feedbackSnap.data().count,
                customContent: contentSnap.data().count,
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// USER MANAGEMENT
// ==========================================

// GET /api/admin/users?page=1&limit=20&search=
router.get('/users', async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        let query = db.collection('users').orderBy('lastActive', 'desc').limit(parseInt(limit));

        const snapshot = await query.get();
        const users = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
            // Don't send sensitive data
            settings: undefined,
        }));

        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/users/:uid — Get a single user's full profile
router.get('/users/:uid', async (req, res) => {
    try {
        const doc = await db.collection('users').doc(req.params.uid).get();
        if (!doc.exists) return res.status(404).json({ error: 'User not found.' });

        res.json({ success: true, user: { uid: doc.id, ...doc.data() } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/users/:uid/ban — Ban or unban a user
router.put('/users/:uid/ban', async (req, res) => {
    try {
        const { banned } = req.body;
        const uid = req.params.uid;

        await db.collection('users').doc(uid).update({
            banned: !!banned,
            bannedAt: banned ? new Date().toISOString() : null,
        });

        // Disable/enable Firebase Auth account
        await adminAuth.updateUser(uid, { disabled: !!banned });

        res.json({ success: true, message: banned ? 'User banned.' : 'User unbanned.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/users/:uid/subscription — Manually update subscription
router.put('/users/:uid/subscription', async (req, res) => {
    try {
        const { status, plan, days = 30 } = req.body;
        const uid = req.params.uid;

        const premiumUntil = new Date();
        premiumUntil.setDate(premiumUntil.getDate() + parseInt(days));

        await db.collection('users').doc(uid).update({
            subscriptionStatus: status || 'active',
            subscriptionPlan: plan || 'premium',
            premiumUntil: status === 'active' ? premiumUntil.toISOString() : null,
        });

        // Notify the user
        await db.collection('users').doc(uid).collection('notifications').add({
            message: status === 'active'
                ? `🎉 Your ${plan || 'premium'} subscription has been activated by admin.`
                : '⚠️ Your subscription status has been updated by admin.',
            type: 'subscription',
            read: false,
            createdAt: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Subscription updated.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// CONTENT MANAGEMENT
// ==========================================

// GET /api/admin/content — Get all custom content
router.get('/content', async (req, res) => {
    try {
        const snapshot = await db.collection('content')
            .orderBy('createdAt', 'desc').get();
        const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/admin/content — Add new content
router.post('/content', async (req, res) => {
    try {
        const {
            title, description, image, backdrop, trailerUrl,
            type, genre, year, age, match
        } = req.body;

        if (!title || !type) {
            return res.status(400).json({ error: 'Title and type are required.' });
        }

        const docRef = await db.collection('content').add({
            title,
            description: description || '',
            image: image || null,
            backdrop: backdrop || null,
            trailerUrl: trailerUrl || null,
            type: type || 'movie',
            genre: genre || [],
            year: year || new Date().getFullYear(),
            age: age || 'TV-14',
            match: match || 85,
            source: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        res.status(201).json({ success: true, message: 'Content added!', id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/admin/content/:id — Edit content
router.put('/content/:id', async (req, res) => {
    try {
        const {
            title, description, image, backdrop, trailerUrl,
            type, genre, year, age, match
        } = req.body;

        const updateData = {
            updatedAt: new Date().toISOString(),
        };

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (backdrop !== undefined) updateData.backdrop = backdrop;
        if (trailerUrl !== undefined) updateData.trailerUrl = trailerUrl;
        if (type !== undefined) updateData.type = type;
        if (genre !== undefined) updateData.genre = genre;
        if (year !== undefined) updateData.year = year;
        if (age !== undefined) updateData.age = age;
        if (match !== undefined) updateData.match = match;

        await db.collection('content').doc(req.params.id).update(updateData);
        res.json({ success: true, message: 'Content updated.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/admin/content/:id — Delete content
router.delete('/content/:id', async (req, res) => {
    try {
        await db.collection('content').doc(req.params.id).delete();
        res.json({ success: true, message: 'Content deleted.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// NOTIFICATIONS
// ==========================================

// POST /api/admin/notifications/broadcast — Send to all users
router.post('/notifications/broadcast', async (req, res) => {
    try {
        const { message, type = 'announcement' } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required.' });

        // Get all user UIDs
        const usersSnap = await db.collection('users').select().get();

        const notification = {
            message,
            type,
            read: false,
            createdAt: new Date().toISOString(),
        };

        // Write in batches of 500 (Firestore limit)
        const batchSize = 500;
        const userDocs = usersSnap.docs;

        for (let i = 0; i < userDocs.length; i += batchSize) {
            const batch = db.batch();
            const chunk = userDocs.slice(i, i + batchSize);

            chunk.forEach(userDoc => {
                const notifRef = db.collection('users').doc(userDoc.id)
                    .collection('notifications').doc();
                batch.set(notifRef, notification);
            });

            await batch.commit();
        }

        res.json({
            success: true,
            message: `Broadcast sent to ${userDocs.length} users.`,
            userCount: userDocs.length,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ADMIN ROLE MANAGEMENT
// ==========================================

// POST /api/admin/set-admin — Grant admin role (requires existing admin)
router.post('/set-admin', async (req, res) => {
    try {
        const { uid, remove = false } = req.body;
        if (!uid) return res.status(400).json({ error: 'uid is required.' });

        if (remove) {
            await db.collection('admins').doc(uid).delete();
            res.json({ success: true, message: 'Admin role removed.' });
        } else {
            const userDoc = await db.collection('users').doc(uid).get();
            await db.collection('admins').doc(uid).set({
                uid,
                grantedBy: req.user.uid,
                grantedAt: new Date().toISOString(),
                name: userDoc.exists ? (userDoc.data().name || '') : '',
            });
            res.json({ success: true, message: 'Admin role granted.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
