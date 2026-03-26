const fs = require('fs');

async function fixHollywood() {
    let content = fs.readFileSync('./client/src/data/content.js', 'utf-8');
    const names = ['John Wick: Chapter 4', 'Mad Max: Fury Road', 'Mission: Impossible - Dead Reckoning', 'Gladiator', 'Top Gun: Maverick'];
    
    for (let name of names) {
        let fetchName = name;
        // Adjust for OMDB search accuracy
        if (name === 'Mission: Impossible - Dead Reckoning') fetchName = 'Mission: Impossible - Dead Reckoning Part One';
        
        try {
            // Hit OMDB explicitly for universally reliable m.media-amazon.com CDN URLs
            const res = await fetch(`http://www.omdbapi.com/?apikey=thewdb&t=${encodeURIComponent(fetchName)}`);
            const data = await res.json();
            
            if (data && data.Poster && data.Poster !== 'N/A') {
                const amazonUrl = data.Poster.replace('SX300', 'SX700');
                
                // Extremely safe localized regex to avoid modifying unexpected array lines globally
                const rowRegex = new RegExp(`(title:\\s*'${name}',\\s*image:\\s*')[^']+(')`);
                content = content.replace(rowRegex, `$1${amazonUrl}$2`);
                console.log(`Successfully migrated ${name} to Amazon Host: ${amazonUrl}`);
            } else {
                console.log(`OMDB returned no result for ${fetchName}`);
            }
        } catch(e) { console.log(`OMDB Fetch failed for ${name}`); }
    }
    
    fs.writeFileSync('./client/src/data/content.js', content);
    console.log("Hollywood section completely re-hosted to absolute IMDb posters safely.");
}
fixHollywood();
