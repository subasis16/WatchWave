/**
 * Additive Firestore Seeder — Batch 3
 * 
 * Adds new video URLs for 12 titles. Uses { merge: true } so existing
 * movies, series, and anime in Firestore are NEVER removed or replaced.
 * 
 * Run with: node server/seed_batch_3.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'watchwave-5f306'
  });
}

const db = admin.firestore();

// ==========================================
// NEW / UPDATED CONTENT (additive only)
// ==========================================
const newContent = [
  // ─── BOLLYWOOD ───
  {
    id: 'bh1',
    title: 'Animal',
    type: 'movie',
    category: 'Bollywood',
    genre: ['Action', 'Crime', 'Drama'],
    year: '2023',
    match: '98',
    age: 'PG-13',
    image: 'https://m.media-amazon.com/images/M/MV5BZThmNDg1NjUtNWJhMC00YjA3LWJiMjItNmM4ZDQ5ZGZiN2Y2XkEyXkFqcGc@._V1_SX300.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776215093/ANIMAL_OFFICIAL_TRAILER___Ranbir_Kapoor___Rashmika_M__Anil_K__Bobby_D___Sandeep_Vanga___Bhushan_K_1080P_HD_lu8h2f.mp4'
  },

  // ─── ANIME ───
  {
    id: 'a3',
    title: 'Demon Slayer',
    type: 'anime',
    category: 'Anime',
    genre: ['Action', 'Fantasy', 'Adventure'],
    year: '2019',
    match: '99',
    age: 'TV-MA',
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776215089/Demon_Slayer__Kimetsu_no_Yaiba_Infinity_Castle___MAIN_TRAILER_1080P_HD_qrnzdv.mp4'
  },
  {
    id: 'aa2',
    title: 'Demon Slayer',
    type: 'anime',
    category: 'Action Anime',
    genre: ['Action', 'Fantasy', 'Adventure'],
    year: '2019',
    match: '98',
    age: 'TV-MA',
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776215089/Demon_Slayer__Kimetsu_no_Yaiba_Infinity_Castle___MAIN_TRAILER_1080P_HD_qrnzdv.mp4'
  },
  {
    id: 'pw5',
    title: 'Mob Psycho 100',
    type: 'anime',
    category: 'Super Power Anime',
    genre: ['Action', 'Comedy', 'Supernatural'],
    year: '2016',
    match: '97',
    age: 'TV-14',
    image: 'https://cdn.myanimelist.net/images/anime/8/80356.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776215078/Trailer_Mob_Psycho_100_720P_HD_laiy6g.mp4'
  },
  {
    id: 'aa4',
    title: 'Chainsaw Man',
    type: 'anime',
    category: 'Action Anime',
    genre: ['Action', 'Dark Fantasy', 'Horror'],
    year: '2022',
    match: '97',
    age: 'TV-MA',
    image: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776215070/CHAINSAW_MAN_THE_MOVIE__REZE_ARC_-_New_Trailer___SUB_HD_1080P_HD_mfh2se.mp4'
  },
  {
    id: 'a5',
    title: 'Attack on Titan',
    type: 'anime',
    category: 'Anime',
    genre: ['Action', 'Dark Fantasy', 'Drama'],
    year: '2013',
    match: '99',
    age: 'TV-MA',
    image: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184122/Attack_on_Titan_Season_1_Trailer_1080P_HD_u4uhi4.mp4'
  },
  {
    id: 'aa3',
    title: 'Attack on Titan',
    type: 'anime',
    category: 'Action Anime',
    genre: ['Action', 'Dark Fantasy', 'Drama'],
    year: '2013',
    match: '99',
    age: 'TV-MA',
    image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184122/Attack_on_Titan_Season_1_Trailer_1080P_HD_u4uhi4.mp4'
  },
  {
    id: 'ra4',
    title: 'Kimi no Na wa',
    type: 'anime',
    category: 'Romantic Anime',
    genre: ['Romance', 'Fantasy', 'Drama'],
    year: '2016',
    match: '99',
    age: 'PG-13',
    image: 'https://cdn.myanimelist.net/images/anime/5/87048.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184114/Kimi_no_Na_wa_Your_Name_Trailer_1080P_60FPS_b739vp.mp4'
  },

  // ─── HOLLYWOOD ───
  {
    id: 'ha5',
    title: 'Top Gun: Maverick',
    type: 'movie',
    category: 'Hollywood Action',
    genre: ['Action', 'Drama'],
    year: '2022',
    match: '99',
    age: 'PG-13',
    image: 'https://m.media-amazon.com/images/M/MV5BMDBkZDNjMWEtOTdmMi00NmExLTg5MmMtNTFlYTJlNWY5YTdmXkEyXkFqcGc@._V1_SX300.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776215074/Top_Gun__Maverick_-_Official_Trailer_2022_-_Paramount_Pictures_1080P_HD_swejhq.mp4'
  },

  // ─── SERIES ───
  {
    id: 'is5',
    title: 'Scam 1992',
    type: 'series',
    category: 'Indian Series',
    genre: ['Crime', 'Drama', 'Biography'],
    year: '2020',
    match: '99',
    age: 'TV-14',
    image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F277%2F693891.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184137/Scam_1992_The_Harshad_Mehta_Story___Official_Trailer___Streaming_from_09-10-2020_1080P_HD_expkco.mp4'
  },
  {
    id: 't1',
    title: 'Stranger Things',
    type: 'series',
    category: 'Trending',
    genre: ['Sci-Fi', 'Horror', 'Drama'],
    year: '2022',
    match: '99',
    age: '16+',
    image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F595%2F1489169.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184127/Stranger_Things_5___Official_Trailer___Netflix_2K_HD_hphbg7.webm'
  },
  {
    id: 'cs1',
    title: 'Stranger Things',
    type: 'series',
    category: 'Hollywood Crime Series',
    genre: ['Sci-Fi', 'Horror', 'Drama'],
    year: '2016',
    match: '98',
    age: 'TV-14',
    image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F595%2F1489169.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184127/Stranger_Things_5___Official_Trailer___Netflix_2K_HD_hphbg7.webm'
  },
  {
    id: 'as5',
    title: 'The Witcher',
    type: 'series',
    category: 'Hollywood Action Series',
    genre: ['Fantasy', 'Action', 'Adventure'],
    year: '2019',
    match: '95',
    age: 'TV-MA',
    image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F465%2F1163459.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184120/The_Witcher___Season_4___Official_Hindi_Trailer___Netflix_Original_Series_1080P_HD_x6n8xx.mp4'
  },
  {
    id: 'is4',
    title: 'Panchayat',
    type: 'series',
    category: 'Indian Series',
    genre: ['Comedy', 'Drama'],
    year: '2020',
    match: '98',
    age: 'TV-14',
    image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F517%2F1293627.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184117/Panchayat_Season_4_-_Official_Trailer___Jitendra_Kumar__Neena_Gupta__Raghubir_Yadav___Prime_Video_IN_1080P_HD_nkxdmq.mp4'
  },
  {
    id: 'ts5',
    title: 'Succession',
    type: 'series',
    category: 'Trending Series',
    genre: ['Drama', 'Comedy'],
    year: '2018',
    match: '97',
    age: 'TV-MA',
    image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F469%2F1174900.jpg',
    videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/q_auto/f_auto/v1776184110/Succession_-_Own_the_Complete_Series_Today____Official_Trailer___Warner_Bros._Entertainment_1080P_HD_oxur3z.mp4'
  }
];

async function seedNewContent() {
  console.log('🔥 Adding Batch 3 to Firestore (existing content is NOT removed)...\n');

  const batch = db.batch();
  let count = 0;

  for (const item of newContent) {
    const docRef = db.collection('movies').doc(item.id);
    batch.set(docRef, item, { merge: true });
    console.log(`   ✅ ${item.title} (${item.id})`);
    count++;
  }

  await batch.commit();
  console.log(`\n🎉 Successfully added/updated ${count} item(s) in Firestore 'movies' collection!`);
  console.log('📺 All other existing content is UNTOUCHED.\n');

  // Verify
  console.log('🔍 Verification:');
  for (const item of newContent) {
    const snap = await db.collection('movies').doc(item.id).get();
    const data = snap.data();
    console.log(`   ${data.title} (${item.id}): videoUrl ${data.videoUrl ? '✅' : '❌'}`);
  }

  const allDocs = await db.collection('movies').get();
  console.log(`\n📊 Total documents in 'movies' collection: ${allDocs.size}`);

  process.exit(0);
}

seedNewContent().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
