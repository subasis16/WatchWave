import localforage from 'localforage';

// Initialize the IndexedDB store
const store = localforage.createInstance({
    name: 'WatchWave-Offline',
    storeName: 'videos',
    description: 'Storage for downloaded movies and episodes.'
});

/**
 * Fetches a video via URL entirely as a Blob, and saves it to IndexedDB alongside its metadata.
 */
export const saveVideo = async (movieObj, videoUrl) => {
    try {
        console.log(`Starting download for ${movieObj.title}...`);
        
        // Fetch the video file as a blob
        const response = await fetch(videoUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        
        // Calculate size in MB for display
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(1) + ' MB';

        // Save into IndexedDB using the movie ID as the key
        const item = {
            id: movieObj.id,
            title: movieObj.title,
            poster: movieObj.poster || movieObj.image || 'https://via.placeholder.com/300x450',
            size: sizeMB,
            blob: blob,
            timestamp: new Date().toISOString()
        };

        await store.setItem(String(movieObj.id), item);
        console.log(`Successfully downloaded and saved ${movieObj.title}!`);
        return true;
    } catch (error) {
        console.error('Error saving video to offline storage:', error);
        return false;
    }
};

/**
 * Retrieves all saved movie objects.
 */
export const getOfflineVideos = async () => {
    try {
        const videos = [];
        await store.iterate((value) => {
            videos.push(value);
        });
        // Sort newest first
        return videos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
        console.error('Error retrieving offline videos:', error);
        return [];
    }
};

/**
 * Removes the blob from IndexedDB using the unique movie ID.
 */
export const deleteVideo = async (id) => {
    try {
        await store.removeItem(String(id));
        console.log(`Deleted video ID: ${id} from storage.`);
        return true;
    } catch (error) {
        console.error('Error deleting offline video:', error);
        return false;
    }
};
