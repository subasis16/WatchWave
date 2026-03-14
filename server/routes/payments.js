const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { verifyToken } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimit');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/create-order — Create a Razorpay order (protected)
router.post('/create-order', paymentLimiter, verifyToken, async (req, res) => {
    try {
        const { amount, currency = 'INR', planId } = req.body;

        if (!amount) return res.status(400).json({ success: false, message: 'Amount is required.' });

        const options = {
            amount: amount * 100, // paise
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                firebase_uid: req.user.uid,
                plan_id: planId || 'basic',
            }
        };

        const order = await razorpay.orders.create(options);
        if (!order) throw new Error('Order creation failed.');

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/payments/webhook — Razorpay webhook (public, verified via signature)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(req.body)
            .digest('hex');

        if (expectedSignature !== webhookSignature) {
            return res.status(400).json({ success: false, message: 'Invalid Webhook Signature.' });
        }

        const body = JSON.parse(req.body.toString());
        const eventType = body.event;

        if (eventType === 'payment.captured') {
            const paymentEntity = body.payload.payment.entity;
            const firebaseUid = paymentEntity.notes?.firebase_uid;
            const planId = paymentEntity.notes?.plan_id;

            if (firebaseUid) {
                const premiumUntil = new Date();
                premiumUntil.setDate(premiumUntil.getDate() + 30);

                await db.collection('users').doc(firebaseUid).update({
                    subscriptionStatus: 'active',
                    subscriptionPlan: planId,
                    premiumUntil: premiumUntil.toISOString(),
                    subscriptionId: paymentEntity.order_id,
                });

                // Send notification to user
                await db.collection('users').doc(firebaseUid)
                    .collection('notifications').add({
                        message: `🎉 Your ${planId} subscription is now active! Enjoy unlimited streaming.`,
                        type: 'subscription',
                        read: false,
                        createdAt: new Date().toISOString(),
                    });

                console.log(`✅ User ${firebaseUid} upgraded to Premium (${planId}).`);
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/payments/status — Get user subscription status
router.get('/status', verifyToken, async (req, res) => {
    try {
        const doc = await db.collection('users').doc(req.user.uid).get();
        if (!doc.exists) return res.json({ success: true, status: 'free' });

        const { subscriptionStatus, subscriptionPlan, premiumUntil } = doc.data();

        // Check if premium has expired
        const isExpired = premiumUntil && new Date(premiumUntil) < new Date();

        res.json({
            success: true,
            status: (subscriptionStatus === 'active' && !isExpired) ? 'active' : 'free',
            plan: subscriptionPlan || null,
            premiumUntil: premiumUntil || null,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
