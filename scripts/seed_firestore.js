/**
 * Firestore Seeder Script
 * Adds 12 movies/anime/series with their Cloudinary video URLs to the Firestore 'movies' collection.
 * Run with: node scripts/seed_firestore.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyCWRbgNBEiU6bLYXWfRAc6wD7bZl8PHMYY",
    authDomain: "watchwave-5f306.firebaseapp.com",
    projectId: "watchwave-5f306",
    storageBucket: "watchwave-5f306.firebasestorage.app",
    messagingSenderId: "140870264928",
    appId: "1:140870264928:web:4c48c3878d77204d92bb05"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contentToSeed = [
    // Movies
    {
        id: 'rm2',
        title: 'Titanic',
        type: 'movie',
        category: 'Romantic',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337936/Titanic_3D_Re-Release_Official_Trailer__1_-_Leonardo_DiCaprio__Kate_Winslet_Movie_2012_HD_1080P_HD_lyuxge.mp4',
        image: 'https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_SX300.jpg',
        year: '1997',
        match: '99',
        age: 'PG-13',
        genre: ['Romance', 'Drama']
    },
    {
        id: 'cr1',
        title: 'The Dark Knight',
        type: 'movie',
        category: 'Crime',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774336778/The_Dark_Knight_2008_Official_Trailer__1_-_Christopher_Nolan_Movie_HD_720P_HD_cwze2e.mp4',
        image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        year: '2008',
        match: '99',
        age: 'PG-13',
        genre: ['Action', 'Crime', 'Thriller']
    },
    {
        id: 'hr1',
        title: 'The Conjuring',
        type: 'movie',
        category: 'Horror',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337628/The_Conjuring__Last_Rites___Official_Trailer_1080P_HD_cz2yol.mp4',
        image: 'https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_SX300.jpg',
        year: '2013',
        match: '95',
        age: 'R',
        genre: ['Horror', 'Mystery', 'Thriller']
    },
    {
        id: 'hr6',
        title: 'The Nun',
        type: 'movie',
        category: 'Horror',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337110/THE_NUN_-_Official_Teaser_Trailer_HD_1080P_HD_lkyur4.mp4',
        image: 'https://m.media-amazon.com/images/M/MV5BMjM3NzQ5NDcxOF5BMl5BanBnXkFtZTgwNzM4MTQ5NTM@._V1_SX300.jpg',
        year: '2018',
        match: '90',
        age: 'R',
        genre: ['Horror', 'Mystery', 'Thriller']
    },
    // Series
    {
        id: 's5',
        title: 'Squid Game',
        type: 'series',
        category: 'Trending Series',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337928/Squid_Game___Official_Trailer___Netflix_1080P_HD_kpdxhv.mp4',
        image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F576%2F1440521.jpg',
        year: '2021',
        match: '96',
        age: 'TV-MA',
        genre: ['Thriller', 'Drama']
    },
    {
        id: 'ts4',
        title: 'Game of Thrones',
        type: 'series',
        category: 'Trending Series',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774336453/Game_of_Thrones___Official_Series_Trailer_HBO_1080P_HD_tfacgt.mp4',
        image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F498%2F1245274.jpg',
        year: '2011',
        match: '98',
        age: 'TV-MA',
        genre: ['Fantasy', 'Drama', 'Action']
    },
    {
        id: 'tc5',
        title: 'How I Met Your Mother',
        type: 'series',
        category: 'Comedy',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774336298/How_I_Met_Your_Mother___Trailer_1080P_60FPS_hwngnd.mp4',
        image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F281%2F702741.jpg',
        year: '2005',
        match: '96',
        age: 'TV-14',
        genre: ['Comedy', 'Romance']
    },
    // Anime
    {
        id: 't5',
        title: 'Solo Leveling',
        type: 'anime',
        category: 'Trending Anime',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337739/Solo_Leveling_-_Official_Trailer_English_Sub_1080P_HD_i6xyhx.mp4',
        image: 'https://cdn.myanimelist.net/images/anime/1807/136791.jpg',
        year: '2024',
        match: '96',
        age: '16+',
        genre: ['Action', 'Fantasy', 'Adventure']
    },
    {
        id: 'sf1',
        title: 'Steins;Gate',
        type: 'anime',
        category: 'Sci-Fi Anime',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337566/Steins_Gate___Anime_Trailer_HD___2011_1080P_HD_dtudag.mp4',
        image: 'https://cdn.myanimelist.net/images/anime/1935/127974.jpg',
        year: '2011',
        match: '99',
        age: 'TV-14',
        genre: ['Sci-Fi', 'Thriller', 'Drama']
    },
    {
        id: 't3',
        title: 'One Piece',
        type: 'anime',
        category: 'Trending Anime',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774336485/ONE_PIECE__Season_2___Official_Trailer___Netflix_1080P_HD_ee4vjb.mp4',
        image: 'https://wsrv.nl/?url=https%3A%2F%2Fstatic.tvmaze.com%2Fuploads%2Fimages%2Foriginal_untouched%2F617%2F1543011.jpg',
        year: '2024',
        match: '98',
        age: '14+',
        genre: ['Action', 'Adventure', 'Fantasy']
    },
    {
        id: 'ra4',
        title: 'Kimi no Na wa',
        type: 'anime',
        category: 'Romantic Anime',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774336472/Kimi_no_Na_wa_Your_Name_Trailer_1080P_60FPS_uhc1sv.mp4',
        image: 'https://cdn.myanimelist.net/images/anime/5/87048.jpg',
        year: '2016',
        match: '99',
        age: 'PG-13',
        genre: ['Romance', 'Fantasy', 'Drama']
    },
    {
        id: 'aa3',
        title: 'Attack on Titan',
        type: 'anime',
        category: 'Action Anime',
        videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774336292/Attack_on_Titan_Season_1_Trailer_1080P_HD_qolejg.mp4',
        image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
        year: '2013',
        match: '99',
        age: 'TV-MA',
        genre: ['Action', 'Dark Fantasy', 'Drama']
    }
];

async function seedFirestore() {
    console.log('🚀 Starting Firestore seeding...\n');

    for (const item of contentToSeed) {
        try {
            await setDoc(doc(db, 'movies', item.id), item, { merge: true });
            console.log(`✅ Seeded: ${item.title} (${item.id}) [${item.type}]`);
        } catch (error) {
            console.error(`❌ Failed to seed ${item.title}:`, error.message);
        }
    }

    console.log('\n🎉 Firestore seeding complete! All 12 items have been added.');
    process.exit(0);
}

seedFirestore();
