const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { tmdbFetch, getTrailerKey, imageUrl } = require('../config/tmdb');

/**
 * Transform a TMDB movie/tv result into a consistent WatchWave content shape
 */
const formatContent = (item, type = 'movie') => ({
    id: `tmdb_${type[0]}${item.id}`,
    tmdbId: item.id,
    type,
    title: item.title || item.name,
    image: imageUrl(item.poster_path, 'w500'),
    backdrop: imageUrl(item.backdrop_path, 'original'),
    year: (item.release_date || item.first_air_date || '').substring(0, 4),
    match: Math.round((item.vote_average / 10) * 100),
    age: item.adult ? '18+' : item.vote_average > 8 ? 'TV-MA' : '13+',
    overview: item.overview,
    genres: item.genre_ids || [],
    popularity: item.popularity,
    voteCount: item.vote_count,
    source: 'tmdb'
});

/**
 * Transform Firestore custom content into consistent shape
 */
const formatCustomContent = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        source: 'custom'
    };
};

// GET /api/content/trending
router.get('/trending', async (req, res) => {
    try {
        const [movies, tv, customSnap] = await Promise.all([
            tmdbFetch('/trending/movie/week'),
            tmdbFetch('/trending/tv/week'),
            db.collection('content').orderBy('createdAt', 'desc').limit(5).get()
        ]);

        const customResults = customSnap.docs.map(formatCustomContent);
        
        const combined = [
            ...customResults,
            ...movies.results.slice(0, 10).map(m => formatContent(m, 'movie')),
            ...tv.results.slice(0, 10).map(t => formatContent(t, 'tv')),
        ];

        res.json({ success: true, results: combined });
    } catch (error) {
        console.error('Trending fetch error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/content/search?q=batman&type=movie
router.get('/search', async (req, res) => {
    const { q, type = 'multi', page = 1 } = req.query;

    if (!q || q.trim().length === 0) {
        return res.status(400).json({ success: false, error: 'Query parameter "q" is required.' });
    }

    try {
        const endpoint = type === 'movie' ? '/search/movie'
            : type === 'tv' ? '/search/tv'
            : '/search/multi';

        // Fetch custom content first (simple case-insensitive search isn't native, so we do startWith for title)
        const customSnap = await db.collection('content')
            .where('title', '>=', q)
            .where('title', '<=', q + '\uf8ff')
            .limit(10)
            .get();
        
        const customResults = customSnap.docs.map(formatCustomContent);
        
        const data = await tmdbFetch(endpoint, { query: q, page });

        const results = [
            ...customResults,
            ...data.results
                .filter(item => item.media_type !== 'person')
                .map(item => formatContent(item, item.media_type || type))
        ];

        res.json({ success: true, results, totalPages: data.total_pages, page: data.page });
    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/content/genres
router.get('/genres', async (req, res) => {
    try {
        const [movieGenres, tvGenres] = await Promise.all([
            tmdbFetch('/genre/movie/list'),
            tmdbFetch('/genre/tv/list'),
        ]);

        const merged = {};
        [...movieGenres.genres, ...tvGenres.genres].forEach(g => {
            merged[g.id] = g.name;
        });

        const genres = Object.entries(merged).map(([id, name]) => ({ id: parseInt(id), name }));
        res.json({ success: true, genres });
    } catch (error) {
        console.error('Genres fetch error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/content/genre/:genreId?type=movie
router.get('/genre/:genreId', async (req, res) => {
    const { genreId } = req.params;
    const { type = 'movie', page = 1 } = req.query;

    try {
        // Fetch matching custom content (genre is an array in Firestore)
        // Note: genreId from TMDB corresponds to name in some cases or IDs.
        // We'll try to find by string match if it's a genre name
        const customSnap = await db.collection('content')
            .where('type', '==', type)
            .where('genre', 'array-contains-any', [genreId]) // This works if genreId is a name or matching string
            .limit(20)
            .get();

        const customResults = customSnap.docs.map(formatCustomContent);

        const endpoint = type === 'tv' ? '/discover/tv' : '/discover/movie';
        const data = await tmdbFetch(endpoint, {
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page,
        });

        const results = [
            ...customResults,
            ...data.results.map(item => formatContent(item, type))
        ];

        res.json({ success: true, results, totalPages: data.total_pages, page: data.page });
    } catch (error) {
        console.error('Genre fetch error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/content/:id?type=movie
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { type = 'movie' } = req.query;

    try {
        // 1. First, check Firestore for custom content
        const customDoc = await db.collection('content').doc(id).get();
        if (customDoc.exists) {
            const data = customDoc.data();
            return res.json({
                success: true,
                content: {
                    ...data,
                    id: customDoc.id,
                    source: 'custom',
                    trailerUrl: data.trailerUrl || null,
                    cast: data.cast || [],
                    similar: [] // We could implement similar custom content later
                }
            });
        }

        // 2. Fallback to TMDB (if ID looks like a TMDB ID or starts with tmdb_)
        const cleanId = id.replace(/^tmdb_[mt]/, '');
        
        const [details, credits, videos, similar] = await Promise.all([
            tmdbFetch(`/${type}/${cleanId}`, { append_to_response: 'genres' }),
            tmdbFetch(`/${type}/${cleanId}/credits`),
            tmdbFetch(`/${type}/${cleanId}/videos`),
            tmdbFetch(`/${type}/${cleanId}/similar`),
        ]);

        // Get YouTube trailer
        const trailer = videos.results.find(
            v => v.type === 'Trailer' && v.site === 'YouTube'
        ) || videos.results[0];

        // Get seasons for TV shows
        let seasons = [];
        if (type === 'tv' && details.seasons) {
            seasons = details.seasons
                .filter(s => s.season_number > 0)
                .map(s => ({
                    seasonNumber: s.season_number,
                    name: s.name,
                    episodeCount: s.episode_count,
                    poster: imageUrl(s.poster_path, 'w500'),
                    airDate: s.air_date,
                }));
        }

        const response = {
            success: true,
            content: {
                id: `tmdb_${type[0]}${details.id}`,
                tmdbId: details.id,
                type,
                title: details.title || details.name,
                image: imageUrl(details.poster_path, 'w500'),
                backdrop: imageUrl(details.backdrop_path, 'original'),
                year: (details.release_date || details.first_air_date || '').substring(0, 4),
                runtime: details.runtime || details.episode_run_time?.[0],
                match: Math.round((details.vote_average / 10) * 100),
                age: details.adult ? '18+' : 'TV-14',
                overview: details.overview,
                genres: details.genres?.map(g => g.name) || [],
                trailerKey: trailer?.key || null,
                trailerUrl: trailer ? `https://www.youtube-nocookie.com/embed/${trailer.key}` : null,
                cast: credits.cast?.slice(0, 10).map(c => ({
                    id: c.id,
                    name: c.name,
                    character: c.character,
                    photo: imageUrl(c.profile_path, 'w185'),
                })) || [],
                director: credits.crew?.find(c => c.job === 'Director')?.name || null,
                similar: similar.results?.slice(0, 10).map(s => formatContent(s, type)) || [],
                seasons,
                source: 'tmdb'
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Content detail error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
