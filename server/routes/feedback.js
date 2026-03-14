const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/auth');

// POST /api/feedback — Submit user feedback
router.post('/feedback', async (req, res) => {
    try {
        const { rating, category, message, email } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required.' });

        await db.collection('feedback').add({
            rating: rating || 0,
            category: category || 'General',
            message,
            email: email || null,
            timestamp: new Date().toISOString(),
            status: 'unread',
        });

        res.json({ success: true, message: 'Feedback submitted. Thank you!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/contact — Submit contact form
router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required.' });
        }

        await db.collection('contactMessages').add({
            name,
            email,
            message,
            timestamp: new Date().toISOString(),
            status: 'unread',
        });

        res.json({ success: true, message: 'Message received! We\'ll get back to you shortly.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/feedback — Admin: get all feedback
router.get('/feedback', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection('feedback')
            .orderBy('timestamp', 'desc').limit(100).get();
        const feedbackList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, feedback: feedbackList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/contact — Admin: get all contact messages
router.get('/contact', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection('contactMessages')
            .orderBy('timestamp', 'desc').limit(100).get();
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
