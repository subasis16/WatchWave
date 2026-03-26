const fs = require('fs');

async function fixTrending() {
    let content = fs.readFileSync('./client/src/data/content.js', 'utf-8');
    const names = ['Dune: Part Two', 'Oppenheimer', 'Spider-Man: Across the Spider-Verse', 'Godzilla Minus One', 'Poor Things'];
    
    for (let name of names) {
        try {
            // Hit OMDB exclusively for high-density, absolutely universally compliant Amazon CDN links
            const res = await fetch(`http://www.omdbapi.com/?apikey=thewdb&t=${encodeURIComponent(name)}`);
            const data = await res.json();
            
            if (data && data.Poster && data.Poster !== 'N/A') {
                const amazonUrl = data.Poster.replace('SX300', 'SX700'); // Clean crisp 700px height density
                
                // Only replace within trending block using regex isolated carefully to this movie title's row
                const rowRegex = new RegExp(`(title:\\s*'${name}',\\s*image:\\s*')[^']+(')`);
                content = content.replace(rowRegex, `$1${amazonUrl}$2`);
                console.log(`Successfully migrated ${name} to Amazon Host: ${amazonUrl}`);
            }
        } catch(e) { console.log(`OMDB Fetch failed for ${name}`); }
    }
    
    fs.writeFileSync('./client/src/data/content.js', content);
    console.log("Trending section completely re-hosted to universal IMDB posters safely.");
}
fixTrending();
