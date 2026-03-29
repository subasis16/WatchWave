const { auth, db } = require('../firebase');

/**
 * Middleware: Verify Firebase ID Token
 * Attaches decoded user to req.user on success
 */
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.warn('Token verification failed (Firebase Admin might be missing service account):', error.message);
        try {
            // Fallback for local dev: decode JWT explicitly
            const payload = Buffer.from(idToken.split('.')[1], 'base64').toString('utf-8');
            const decoded = JSON.parse(payload);
            req.user = { ...decoded, uid: decoded.user_id || decoded.sub };
            console.log('✅ Fallback: Decoded JWT payload for uid:', req.user.uid);
            next();
        } catch (fallbackError) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token format.' });
        }
    }
};

/**
 * Middleware: Verify Admin Role
 * Must be AFTER verifyToken. Checks Firestore 'admins' collection for the user's UID.
 */
const verifyAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: Token not verified.' });
    }

    // Explicit whitelist for the lead developer
    if (req.user.email === 'subasis16007@gmail.com') {
        return next();
    }

    try {
        const adminDoc = await db.collection('admins').doc(req.user.uid).get();
        if (!adminDoc.exists) {
            return res.status(403).json({ error: 'Forbidden: Admin access required.' });
        }
        next();
    } catch (error) {
        console.error('Admin check failed:', error.message);
        return res.status(500).json({ error: 'Server error during admin verification.' });
    }
};

module.exports = { verifyToken, verifyAdmin };
