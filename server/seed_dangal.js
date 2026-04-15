/**
 * Additive Firestore Seeder — Dangal
 * 
 * This script ONLY ADDS the new Dangal movie to the Firestore 'movies' collection.
 * It uses { merge: true } so it will NOT overwrite or remove any existing documents.
 * 
 * Run with: node server/seed_dangal.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'watchwave-5f306'
  });
}

const db = admin.firestore();

// ==========================================
// NEW CONTENT TO ADD (additive only)
// ==========================================
const newContent = [
  {
    id: 'bh4',
    title: 'Dangal',
    type: 'movie',
    category: 'Bollywood',
    genre: ['Drama', 'Sports', 'Biography'],
    year: '2016',
    match: '99',
    age: 'PG',
    image: 'https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776215095/Dangal___Main_Trailer___Netflix_1080P_HD_aztdha.mp4',
    trailerUrl: 'https://www.youtube-nocookie.com/embed/x_7YlGv9u1g'
  }
];

async function seedNewContent() {
  console.log('🔥 Adding NEW content to Firestore (existing content is NOT touched)...\n');

  const batch = db.batch();
  let added = 0;

  for (const item of newContent) {
    const docRef = db.collection('movies').doc(item.id);
    // merge: true ensures we only add/update fields — never delete existing documents
    batch.set(docRef, item, { merge: true });
    console.log(`   ✅ ${item.title} (${item.id}) → ${item.videoUrl.substring(0, 70)}...`);
    added++;
  }

  await batch.commit();
  console.log(`\n🎉 Successfully added ${added} new item(s) to Firestore 'movies' collection!`);
  console.log('📺 Existing movies, series, and anime are UNTOUCHED.\n');

  // Verify the new additions
  console.log('🔍 Verification:');
  for (const item of newContent) {
    const snap = await db.collection('movies').doc(item.id).get();
    const data = snap.data();
    console.log(`   ${data.title}: videoUrl ${data.videoUrl ? '✅' : '❌'}`);
  }

  // Quick sanity check — show total document count
  const allDocs = await db.collection('movies').get();
  console.log(`\n📊 Total documents in 'movies' collection: ${allDocs.size}`);

  process.exit(0);
}

seedNewContent().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
