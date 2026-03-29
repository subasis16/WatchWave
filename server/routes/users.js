const express = require('express');
const router = express.Router();
const { db, auth: adminAuth } = require('../firebase');
const { verifyToken } = require('../middleware/auth');
const admin = require('firebase-admin');

// POST /api/users/profile — Save/update user profile (public, called after signup)
router.post('/profile', async (req, res) => {
    try {
        const { uid, name, email, avatar, language } = req.body;
        if (!uid) return res.status(400).json({ error: 'UID is required.' });

        await db.collection('users').doc(String(uid)).set({
            name: name || 'Anonymous',
            email: email || '',
            avatar: avatar || null,
            language: language || 'English',
            lastActive: new Date().toISOString(),
        }, { merge: true });

        res.status(200).json({ success: true, message: 'Profile saved.', uid });
    } catch (error) {
        console.error('Profile save error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// All routes below require authentication
// ==========================================

// GET /api/users/all/profiles — Get basic user profiles for social
router.get('/all/profiles', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').limit(50).get();
        const users = [];
        snapshot.forEach(doc => {
            if (doc.id !== req.user.uid) {
                const data = doc.data();
                users.push({
                    id: doc.id,
                    name: data.name || 'User',
                    avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'U')}&background=random`,
                    isOnline: data.isOnline || false,
                    status: data.isOnline ? 'Online' : 'Offline',
                    lastActive: data.lastActive || null
                });
            }
        });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/users/myList
router.get('/myList', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').doc(req.user.uid)
            .collection('myList').orderBy('addedAt', 'desc').get();

        const list = snapshot.docs.map(doc => doc.data());
        res.json({ success: true, list });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/users/myList — Add to My List
router.post('/myList', verifyToken, async (req, res) => {
    try {
        const { contentId, title, image, type } = req.body;
        if (!contentId) return res.status(400).json({ error: 'contentId is required.' });

        await db.collection('users').doc(req.user.uid)
            .collection('myList').doc(String(contentId)).set({
                contentId: String(contentId),
                title: title || '',
                image: image || null,
                type: type || 'movie',
                addedAt: new Date().toISOString(),
            });

        res.json({ success: true, message: 'Added to My List.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/users/myList/:contentId
router.delete('/myList/:contentId', verifyToken, async (req, res) => {
    try {
        await db.collection('users').doc(req.user.uid)
            .collection('myList').doc(req.params.contentId).delete();

        res.json({ success: true, message: 'Removed from My List.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/users/watchHistory
router.get('/watchHistory', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').doc(req.user.uid)
            .collection('watchHistory').orderBy('updatedAt', 'desc').limit(20).get();

        const history = snapshot.docs.map(doc => doc.data());
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/users/watchHistory — Save/update watch progress
router.post('/watchHistory', verifyToken, async (req, res) => {
    try {
        const { contentId, title, image, progress, duration, type } = req.body;
        if (!contentId) return res.status(400).json({ error: 'contentId is required.' });

        await db.collection('users').doc(req.user.uid)
            .collection('watchHistory').doc(String(contentId)).set({
                contentId: String(contentId),
                title: title || '',
                image: image || null,
                progress: progress || 0,       // in seconds
                duration: duration || 0,        // in seconds
                type: type || 'movie',
                updatedAt: new Date().toISOString(),
            }, { merge: true });

        res.json({ success: true, message: 'Watch progress saved.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/users/watchHistory/:contentId
router.delete('/watchHistory/:contentId', verifyToken, async (req, res) => {
    try {
        await db.collection('users').doc(req.user.uid)
            .collection('watchHistory').doc(req.params.contentId).delete();

        res.json({ success: true, message: 'Removed from watch history.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/users/vault (Cross-Device Global Cinematic Vault Sync)
router.get('/vault', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').doc(req.user.uid)
            .collection('global_vault').orderBy('vaultedAt', 'desc').get();
        const list = snapshot.docs.map(doc => doc.data());
        res.json({ success: true, list });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/users/vault 
router.post('/vault', verifyToken, async (req, res) => {
    try {
        const { contentId, title, size } = req.body;
        if (!contentId) return res.status(400).json({ error: 'contentId is required.' });

        await db.collection('users').doc(req.user.uid)
            .collection('global_vault').doc(String(contentId)).set({
                contentId: String(contentId),
                title: title || '',
                size: size || 0,
                vaultedAt: new Date().toISOString(),
            });

        res.json({ success: true, message: 'Added to Global Vault Tracking.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/users/settings
router.get('/settings', verifyToken, async (req, res) => {
    try {
        const docRef = db.collection('users').doc(req.user.uid);
        const doc = await docRef.get();
        const settings = doc.exists ? (doc.data().settings || {}) : {};

        res.json({
            success: true,
            settings: {
                autoplay: true,
                language: 'English',
                subtitles: 'Off',
                contentRating: 2,
                pinEnabled: false,
                dailyLimit: 120,
                audioDesc: false,
                signLanguage: false,
                highContrast: false,
                ...settings,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/users/settings
router.put('/settings', verifyToken, async (req, res) => {
    try {
        const allowedFields = ['autoplay', 'language', 'subtitles', 'contentRating',
            'pinEnabled', 'dailyLimit', 'audioDesc', 'signLanguage', 'highContrast'];

        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        await db.collection('users').doc(req.user.uid).set(
            { settings: updates },
            { merge: true }
        );

        res.json({ success: true, message: 'Settings updated.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/users/notifications
router.get('/notifications', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').doc(req.user.uid)
            .collection('notifications').orderBy('createdAt', 'desc').limit(30).get();

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/users/notifications/:notifId/read
router.put('/notifications/:notifId/read', verifyToken, async (req, res) => {
    try {
        await db.collection('users').doc(req.user.uid)
            .collection('notifications').doc(req.params.notifId)
            .update({ read: true });

        res.json({ success: true, message: 'Notification marked as read.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/users/notifications/read-all
router.put('/notifications/read-all', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').doc(req.user.uid)
            .collection('notifications').where('read', '==', false).get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.update(doc.ref, { read: true }));
        await batch.commit();

        res.json({ success: true, message: 'All notifications marked as read.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/users/account — Delete account (data + Firebase Auth user)
router.delete('/account', verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;

        // Delete Firestore user document and all subcollections
        const collections = ['myList', 'watchHistory', 'notifications', 'friendRequests', 'friends'];
        for (const col of collections) {
            const snap = await db.collection('users').doc(uid).collection(col).get();
            const batch = db.batch();
            snap.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }

        await db.collection('users').doc(uid).delete();

        // Delete Firebase Auth user
        await adminAuth.deleteUser(uid);

        res.json({ success: true, message: 'Account deleted successfully.' });
    } catch (error) {
        console.error('Account delete error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
