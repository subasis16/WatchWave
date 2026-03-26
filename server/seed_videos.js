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
// CLOUDINARY VIDEO LIBRARY - Organized by Category
// ==========================================
const videoLibrary = {
  // ─── SERIES ───
  series: [
    {
      id: 't1',
      title: 'Stranger Things',
      category: 'series',
      genre: 'Sci-Fi/Thriller',
      year: '2022',
      match: '99',
      age: '16+',
      image: 'https://static.tvmaze.com/uploads/images/original_untouched/595/1489169.jpg',
      videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774338448/Stranger_Things_5___Official_Trailer___Netflix_2K_HD_dxdrjv.webm',
      trailerUrl: 'https://www.youtube-nocookie.com/embed/b9EkMc79ZSU'
    },
    {
      id: 'is1',
      title: 'The Family Man',
      category: 'series',
      genre: 'Action/Thriller',
      year: '2019',
      match: '97',
      age: 'TV-MA',
      image: 'https://static.tvmaze.com/uploads/images/original_untouched/599/1498893.jpg',
      videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774338088/The_Family_Man_S3_-_Official_Trailer___Raj___DK___Manoj_Bajpayee__Jaideep_Ahlawat___Prime_Video_IN_1080P_HD_k0ehea.mp4',
      trailerUrl: 'https://www.youtube-nocookie.com/embed/XatRGqtcAOk'
    }
  ],

  // ─── ANIME ───
  anime: [
    {
      id: 'ra2',
      title: 'Violet Evergarden',
      category: 'anime',
      genre: 'Drama/Romance',
      year: '2018',
      match: '97',
      age: 'TV-14',
      image: 'https://cdn.myanimelist.net/images/anime/1795/95088.jpg',
      videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774338203/Violet_Evergarden__the_Movie___Official_Trailer___Netflix_Anime_1080P_HD_gwahjn.mp4',
      trailerUrl: 'https://www.youtube-nocookie.com/embed/0CDeEUY81K8'
    },
    {
      id: 'ra1',
      title: 'Your Lie in April',
      category: 'anime',
      genre: 'Romance/Drama',
      year: '2014',
      match: '98',
      age: 'TV-14',
      image: 'https://cdn.myanimelist.net/images/anime/3/67177.jpg',
      videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774338077/Your_lie_in_April_Trailer_1080P_HD_gczizb.mp4',
      trailerUrl: 'https://www.youtube-nocookie.com/embed/WbX2y7iG2Xw'
    }
  ],

  // ─── MOVIES ───
  movies: [
    {
      id: 'rm3',
      title: 'The Notebook',
      category: 'movies',
      genre: 'Romance/Drama',
      year: '2004',
      match: '95',
      age: 'PG-13',
      image: 'https://m.media-amazon.com/images/M/MV5BMjcxNjk0MTk4MF5BMl5BanBnXkFtZTgwMjM0MTkzMDE@._V1_SX700.jpg',
      videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774338136/The_Notebook_2004_Official_Trailer_-_Ryan_Gosling_Movie_1080P_HD_kljwfr.mp4',
      trailerUrl: 'https://www.youtube-nocookie.com/embed/FC6biTjEyZw'
    }
  ]
};

async function seedFirestore() {
  console.log('🔥 Seeding Firestore with Cloudinary video library...\n');

  const batch = db.batch();
  let total = 0;

  for (const [category, items] of Object.entries(videoLibrary)) {
    console.log(`📂 Category: ${category.toUpperCase()}`);
    for (const item of items) {
      const docRef = db.collection('movies').doc(item.id);
      batch.set(docRef, item, { merge: true });
      console.log(`   ✅ ${item.title} (${item.id}) → ${item.videoUrl.substring(0, 60)}...`);
      total++;
    }
    console.log('');
  }

  await batch.commit();
  console.log(`\n🎉 Successfully seeded ${total} videos into Firestore 'movies' collection!`);
  console.log('📺 These are now accessible via /player/:id and WatchRoom.\n');
  
  // Verify
  console.log('🔍 Verification:');
  for (const [category, items] of Object.entries(videoLibrary)) {
    for (const item of items) {
      const snap = await db.collection('movies').doc(item.id).get();
      const data = snap.data();
      console.log(`   ${data.title}: videoUrl ${data.videoUrl ? '✅' : '❌'}`);
    }
  }

  process.exit(0);
}

seedFirestore().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
