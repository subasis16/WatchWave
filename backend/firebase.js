const admin = require('firebase-admin');
require('dotenv').config();

try {
    // 1. Try to load the local 'serviceAccountKey.json' file
    let serviceAccount;
    try {
        serviceAccount = require('./serviceAccountKey.json');
    } catch (err) {
        console.warn("⚠️ serviceAccountKey.json not found in backend/ directory. Attempting to use default credentials...");
    }

    if (serviceAccount) {
        // Initialize with explicit JSON file
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Admin initialized using serviceAccountKey.json!');
    } else {
        // Fallback to application default (requires GOOGLE_APPLICATION_CREDENTIALS)
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
        console.log('✅ Firebase Admin initialized using Default Credentials!');
    }

} catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.message);
}

// Initialize Firestore & Auth Services
const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
