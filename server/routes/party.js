const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken } = require('../middleware/auth');

// POST /api/party/create — Create a new watch room
router.post('/create', verifyToken, async (req, res) => {
    try {
        const { room_code, room_password } = req.body;
        const host_id = req.user.uid;

        if (!room_code) return res.status(400).json({ error: 'Room code is required.' });

        const roomRef = db.collection('rooms').doc(room_code);
        const doc = await roomRef.get();

        if (doc.exists) return res.status(400).json({ error: 'Room code already taken. Try a different one.' });

        await roomRef.set({
            room_password: room_password || '',
            host_id,
            created_at: new Date().toISOString(),
            status: 'active',
            participants: [host_id],
            currentContent: null,
            syncState: { playing: false, progress: 0 },
        });

        res.status(201).json({ success: true, message: 'Room created!', room_code });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/party/join — Join a room (verify password if set)
router.post('/join', verifyToken, async (req, res) => {
    try {
        const { room_code, password } = req.body;
        const uid = req.user.uid;

        if (!room_code) return res.status(400).json({ error: 'Room code is required.' });

        const roomRef = db.collection('rooms').doc(room_code);
        const doc = await roomRef.get();

        if (!doc.exists) return res.status(404).json({ error: 'Room not found.' });

        const room = doc.data();

        if (room.status !== 'active') return res.status(400).json({ error: 'This room is no longer active.' });

        if (room.room_password && room.room_password !== password) {
            return res.status(403).json({ error: 'Incorrect room password.' });
        }

        // Add participant
        if (!room.participants.includes(uid)) {
            await roomRef.update({
                participants: [...room.participants, uid],
            });
        }

        res.json({ success: true, message: 'Joined room!', room_code, hostId: room.host_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/party/:roomCode — Get room info
router.get('/:roomCode', verifyToken, async (req, res) => {
    try {
        const doc = await db.collection('rooms').doc(req.params.roomCode).get();
        if (!doc.exists) return res.status(404).json({ error: 'Room not found.' });

        const data = doc.data();
        // Don't expose the password
        const { room_password, ...safeData } = data;

        res.json({ success: true, room: { ...safeData, hasPassword: !!room_password } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/party/:roomCode — Close a room (host only)
router.delete('/:roomCode', verifyToken, async (req, res) => {
    try {
        const roomRef = db.collection('rooms').doc(req.params.roomCode);
        const doc = await roomRef.get();

        if (!doc.exists) return res.status(404).json({ error: 'Room not found.' });
        if (doc.data().host_id !== req.user.uid) return res.status(403).json({ error: 'Only the host can close this room.' });

        await roomRef.update({ status: 'closed' });
        res.json({ success: true, message: 'Room closed.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
