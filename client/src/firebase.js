import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy_api_key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy_project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy_project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy_project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abc123def456"
};

if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.warn("⚠️ VITE_FIREBASE_API_KEY is missing! Using dummy configuration. Auth and Database will NOT work until you add your real keys to client/.env.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services to export
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
