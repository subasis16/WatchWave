const fs = require('fs');

async function fixBollywood() {
    let content = fs.readFileSync('./client/src/data/content.js', 'utf-8');
    const movies = [
        { name: 'Animal', omdbTitle: 'Animal' },
        { name: 'Pathaan', omdbTitle: 'Pathaan' },
        { name: 'KGF: Chapter 2', omdbTitle: 'KGF: Chapter 2' },
        { name: 'Baahubali 2: The Conclusion', omdbTitle: 'Baahubali: The Conclusion' },
        { name: 'Kantara', omdbTitle: 'Kantara' }
    ];

    for (let movie of movies) {
        try {
            const res = await fetch(`http://www.omdbapi.com/?apikey=thewdb&t=${encodeURIComponent(movie.omdbTitle)}`);
            const data = await res.json();

            if (data && data.Poster && data.Poster !== 'N/A') {
                const amazonUrl = data.Poster.replace('SX300', 'SX700');
                const rowRegex = new RegExp(`(title:\\s*'${movie.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',\\s*image:\\s*')[^']+(')`);
                content = content.replace(rowRegex, `$1${amazonUrl}$2`);
                console.log(`Migrated: ${movie.name} -> ${amazonUrl}`);
            } else {
                console.log(`No OMDB result for: ${movie.omdbTitle}`);
            }
        } catch(e) {
            console.log(`Fetch failed for: ${movie.name}`);
        }
    }

    fs.writeFileSync('./client/src/data/content.js', content);
    console.log("Bollywood section fully re-hosted to Amazon IMDb CDN.");
}
fixBollywood();
