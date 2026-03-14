/**
 * TMDB API Helper
 * Base URL: https://api.themoviedb.org/3
 * Docs: https://developer.themoviedb.org/docs
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

/**
 * Generic TMDB fetch function
 * @param {string} endpoint - e.g. '/movie/popular'
 * @param {object} params - extra query params
 * @returns {Promise<object>} - parsed JSON response
 */
const tmdbFetch = async (endpoint, params = {}) => {
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        throw new Error('TMDB_API_KEY is not set in environment variables.');
    }

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('language', 'en-US');

    // Append any extra parameters
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
};

/**
 * Get a YouTube trailer key for a movie/tv show by its TMDB ID
 * @param {number} id - TMDB content ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {string|null} - YouTube video key or null
 */
const getTrailerKey = async (id, type = 'movie') => {
    try {
        const data = await tmdbFetch(`/${type}/${id}/videos`);
        const trailer = data.results.find(
            v => v.type === 'Trailer' && v.site === 'YouTube'
        ) || data.results[0];
        return trailer ? trailer.key : null;
    } catch {
        return null;
    }
};

/**
 * Build TMDB image URL
 * @param {string} path - e.g. '/abc123.jpg'
 * @param {string} size - e.g. 'w500', 'original'
 */
const imageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

module.exports = { tmdbFetch, getTrailerKey, imageUrl, TMDB_IMAGE_BASE };
