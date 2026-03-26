const fs = require('fs');

async function getWikiImage(title) {
    try {
        // First try the movie title + (film) to skip disambiguation
        let res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title + ' (film)')}&prop=pageimages&format=json&pithumbsize=600&redirects=1`);
        let data = await res.json();
        let pages = data.query.pages;
        let pageId = Object.keys(pages)[0];
        
        if (pageId !== '-1' && pages[pageId].thumbnail) return pages[pageId].thumbnail.source;

        // Try exact title
        res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=600&redirects=1`);
        data = await res.json();
        pages = data.query.pages;
        pageId = Object.keys(pages)[0];
        
        if (pageId !== '-1' && pages[pageId].thumbnail) return pages[pageId].thumbnail.source;
        
    } catch(e) {}
    console.log("FAILED Wiki fetch for: " + title);
    return null;
}

// Aesthetic fallbacks just in case
const fallbackImages = [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&h=900&fit=crop'
];

async function fix() {
    let content = fs.readFileSync('./client/src/data/content.js', 'utf-8');
    const lines = content.split('\n');
    let fallbackIdx = 0;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        // Target specifically and solely ALL TMDB blocked links
        if (line.includes('image.tmdb.org')) {
            const match = line.match(/title:\s*'([^']+)'/);
            if (match) {
                const title = match[1];
                let wikiUrl = await getWikiImage(title);
                
                // Hard map edge-cases Wikipedia couldn't guess easily
                if (!wikiUrl) {
                    const literalMap = {
                        'Se7en': 'https://upload.wikimedia.org/wikipedia/en/6/68/Seven_%28movie%29_poster.jpg',
                        'It': 'https://upload.wikimedia.org/wikipedia/en/5/5a/It_%282017%29_poster.jpg',
                        'A Quiet Place': 'https://upload.wikimedia.org/wikipedia/en/a/a0/A_Quiet_Place_film_poster.png',
                        'Mission: Impossible - Dead Reckoning': 'https://upload.wikimedia.org/wikipedia/en/e/e0/Mission_Impossible_-_Dead_Reckoning_Part_One_poster.jpg',
                        'The Hangover': 'https://upload.wikimedia.org/wikipedia/en/b/b9/Hangoverposter09.jpg',
                        'John Wick: Chapter 4': 'https://upload.wikimedia.org/wikipedia/en/f/f9/John_Wick_Chapter_4_promotional_poster.jpg',
                        'Spider-Man: Across the Spider-Verse': 'https://upload.wikimedia.org/wikipedia/en/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg',
                        'Baahubali 2: The Conclusion': 'https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_the_Conclusion.jpg'
                    };
                    wikiUrl = literalMap[title];
                }
                
                if (!wikiUrl) {
                    wikiUrl = fallbackImages[fallbackIdx % fallbackImages.length];
                    fallbackIdx++;
                }

                lines[i] = line.replace(/image:\s*'https:\/\/image\.tmdb\.org[^']+'/, `image: '${wikiUrl}'`);
                console.log(`Swapped TMDB for ${title}`);
            }
        }
    }
    
    fs.writeFileSync('./client/src/data/content.js', lines.join('\n'));
    console.log("All TMDB hashes purged and replaced natively!");
}
fix();
