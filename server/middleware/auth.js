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
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
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
