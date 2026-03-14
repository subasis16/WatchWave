const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken } = require('../middleware/auth');

// POST /api/friends/request — Send a friend request
router.post('/request', verifyToken, async (req, res) => {
    try {
        const senderUid = req.user.uid;
        const { targetUid } = req.body;

        if (!targetUid) return res.status(400).json({ error: 'targetUid is required.' });
        if (senderUid === targetUid) return res.status(400).json({ error: 'Cannot send a request to yourself.' });

        // Check if already friends
        const friendDoc = await db.collection('users').doc(targetUid)
            .collection('friends').doc(senderUid).get();
        if (friendDoc.exists) return res.status(400).json({ error: 'Already friends.' });

        // Check if request already sent
        const existingReq = await db.collection('users').doc(targetUid)
            .collection('friendRequests').doc(senderUid).get();
        if (existingReq.exists) return res.status(400).json({ error: 'Friend request already sent.' });

        // Get sender's display info
        const senderDoc = await db.collection('users').doc(senderUid).get();
        const senderData = senderDoc.data() || {};

        await db.collection('users').doc(targetUid)
            .collection('friendRequests').doc(senderUid).set({
                from: senderUid,
                fromName: senderData.name || 'Unknown',
                fromAvatar: senderData.avatar || null,
                status: 'pending',
                timestamp: new Date().toISOString(),
            });

        // Send a notification to the target user
        await db.collection('users').doc(targetUid)
            .collection('notifications').add({
                message: `${senderData.name || 'Someone'} sent you a friend request!`,
                type: 'friend_request',
                avatar: senderData.avatar || null,
                fromUid: senderUid,
                read: false,
                createdAt: new Date().toISOString(),
            });

        res.json({ success: true, message: 'Friend request sent!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/friends/requests — Get pending incoming requests
router.get('/requests', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').doc(req.user.uid)
            .collection('friendRequests').where('status', '==', 'pending').get();

        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/friends/accept — Accept a friend request
router.post('/accept', verifyToken, async (req, res) => {
    try {
        const { fromUid } = req.body;
        const toUid = req.user.uid;

        if (!fromUid) return res.status(400).json({ error: 'fromUid is required.' });

        const reqDoc = await db.collection('users').doc(toUid)
            .collection('friendRequests').doc(fromUid).get();

        if (!reqDoc.exists) return res.status(404).json({ error: 'Friend request not found.' });

        const reqData = reqDoc.data();

        // Get both users' info
        const [meDoc, themDoc] = await Promise.all([
            db.collection('users').doc(toUid).get(),
            db.collection('users').doc(fromUid).get(),
        ]);
        const meData = meDoc.data() || {};
        const themData = themDoc.data() || {};

        // Add each other to friends subcollection (bidirectional)
        const batch = db.batch();

        batch.set(db.collection('users').doc(toUid).collection('friends').doc(fromUid), {
            friendUid: fromUid,
            name: themData.name || 'User',
            avatar: themData.avatar || null,
            addedAt: new Date().toISOString(),
        });

        batch.set(db.collection('users').doc(fromUid).collection('friends').doc(toUid), {
            friendUid: toUid,
            name: meData.name || 'User',
            avatar: meData.avatar || null,
            addedAt: new Date().toISOString(),
        });

        // Delete the friend request
        batch.delete(db.collection('users').doc(toUid).collection('friendRequests').doc(fromUid));

        await batch.commit();

        // Notify the original sender
        await db.collection('users').doc(fromUid).collection('notifications').add({
            message: `${meData.name || 'Someone'} accepted your friend request!`,
            type: 'friend_accepted',
            avatar: meData.avatar || null,
            read: false,
            createdAt: new Date().toISOString(),
        });

        res.json({ success: true, message: 'Friend request accepted!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/friends/reject — Reject a friend request
router.post('/reject', verifyToken, async (req, res) => {
    try {
        const { fromUid } = req.body;
        if (!fromUid) return res.status(400).json({ error: 'fromUid is required.' });

        await db.collection('users').doc(req.user.uid)
            .collection('friendRequests').doc(fromUid).delete();

        res.json({ success: true, message: 'Friend request rejected.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/friends — Get full friends list
router.get('/', verifyToken, async (req, res) => {
    try {
        const snapshot = await db.collection('users').doc(req.user.uid)
            .collection('friends').orderBy('addedAt', 'desc').get();

        const friends = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, friends });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/friends/:friendUid — Remove a friend
router.delete('/:friendUid', verifyToken, async (req, res) => {
    try {
        const { friendUid } = req.params;
        const uid = req.user.uid;

        const batch = db.batch();
        batch.delete(db.collection('users').doc(uid).collection('friends').doc(friendUid));
        batch.delete(db.collection('users').doc(friendUid).collection('friends').doc(uid));
        await batch.commit();

        res.json({ success: true, message: 'Friend removed.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
