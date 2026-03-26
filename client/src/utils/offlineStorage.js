import localforage from 'localforage';

// Single shared store instance — ALL reads and writes MUST use this object
const store = localforage.createInstance({
    name: 'WatchWave-Offline',
    storeName: 'videos',
    description: 'Storage for downloaded movies and episodes.'
});

/**
 * Downloads a video via streaming fetch with real-time progress, then saves it to IndexedDB.
 * @param {Object} movieObj - The content object (id, title, image/poster)
 * @param {string} videoUrl - Direct URL to the video file (must be a Cloudinary .mp4, not YouTube)
 * @param {Function} onProgress - Callback (percent: number) => void for progress updates (optional)
 * @returns {boolean} true on success, false on failure
 */
export const saveVideo = async (movieObj, videoUrl, onProgress = null) => {
    try {
        console.log(`⬇️ Starting download for ${movieObj.title}...`);

        const response = await fetch(videoUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        // Stream the response body so we can track progress
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;

            if (onProgress) {
                const percent = total > 0
                    ? Math.round((received / total) * 100)
                    : Math.min(95, Math.round((received / 50_000_000) * 100)); // rough estimate for unknown size
                onProgress(percent);
            }
        }

        // Combine all chunks into one Blob
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const sizeMB = (blob.size / (1024 * 1024)).toFixed(1) + ' MB';

        const item = {
            id: movieObj.id,
            title: movieObj.title,
            poster: movieObj.poster || movieObj.image || 'https://via.placeholder.com/300x450',
            size: sizeMB,
            blob: blob,
            timestamp: new Date().toISOString()
        };

        await store.setItem(String(movieObj.id), item);
        if (onProgress) onProgress(100);
        console.log(`✅ Saved ${movieObj.title} (${sizeMB}) to IndexedDB`);
        return true;
    } catch (error) {
        console.error('❌ Error saving video to offline storage:', error);
        return false;
    }
};

/**
 * Retrieves all saved video metadata + blobs from IndexedDB.
 * @returns {Array} sorted newest-first
 */
export const getOfflineVideos = async () => {
    try {
        const videos = [];
        await store.iterate((value) => {
            videos.push(value);
        });
        return videos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
        console.error('Error retrieving offline videos:', error);
        return [];
    }
};

/**
 * Checks if a video with the given id is already downloaded.
 * @returns {boolean}
 */
export const isVideoDownloaded = async (id) => {
    try {
        const item = await store.getItem(String(id));
        return !!item;
    } catch {
        return false;
    }
};

/**
 * Removes a video blob from IndexedDB.
 */
export const deleteVideo = async (id) => {
    try {
        await store.removeItem(String(id));
        console.log(`🗑️ Deleted video ID: ${id} from storage.`);
        return true;
    } catch (error) {
        console.error('Error deleting offline video:', error);
        return false;
    }
};
