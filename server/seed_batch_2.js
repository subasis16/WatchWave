const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'watchwave-5f306'
  });
}

const db = admin.firestore();

// ==========================================
// CLOUDINARY VIDEO BATCH 2
// ==========================================
const videoLibrary = {
  series: [
    {
      id: 'ts2',
      title: 'The Last of Us',
      category: 'series',
      genre: 'Sci-Fi/Thriller',
      year: '2023',
      match: '98',
      age: 'TV-MA',
      image: 'https://static.tvmaze.com/uploads/images/original_untouched/563/1409008.jpg',
      videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337981/The_Last_of_Us___Official_Trailer___Max_1080P_HD_cah7nd.mp4',
      trailerUrl: 'https://www.youtube-nocookie.com/embed/uLtkt8BonwM'
    },
    {
      id: 's4',
      title: 'The Boys',
      category: 'series',
      genre: 'Action/Superhero',
      year: '2019',
      match: '98',
      age: 'TV-MA',
      image: 'https://static.tvmaze.com/uploads/images/original_untouched/452/1131154.jpg',
      videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337964/The_Boys_Final_Season_Trailer___Prime_Video_1080P_HD_eejcg7.mp4',
      trailerUrl: 'https://www.youtube-nocookie.com/embed/w4VhCU2kyZ4'
    }
  ],
  anime: [
    {
      id: 'sa1',
      title: 'Blue Lock',
      category: 'anime',
      genre: 'Sports/Action',
      year: '2022',
      match: '96',
      age: 'TV-14',
      image: 'https://static.tvmaze.com/uploads/images/original_untouched/464/1160358.jpg',
      videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774335987/Blue_Lock_2nd_Season___OFFICIAL_HINDI_DUB_TRAILER___Crunchyroll_India_1080P_HD_bnwnrm.mp4',
      trailerUrl: 'https://www.youtube-nocookie.com/embed/yQxGZkLY32E'
    }
  ]
};

async function seedFirestore() {
  console.log('🔥 Seeding Batch 2 to Firestore...\n');

  const batch = db.batch();
  let total = 0;

  for (const [category, items] of Object.entries(videoLibrary)) {
    for (const item of items) {
      const docRef = db.collection('movies').doc(item.id);
      batch.set(docRef, item, { merge: true });
      console.log(`   ✅ ${item.title} -> ${item.videoUrl.substring(0, 50)}...`);
      total++;
    }
  }

  await batch.commit();
  console.log(`\n🎉 Successfully seeded ${total} new videos!`);
  process.exit(0);
}

seedFirestore().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
