const fs = require('fs');

const names = [
    'Godzilla Minus One', 'Poor Things', 'Mad Max: Fury Road', 'Mission: Impossible - Dead Reckoning Part One',
    'Se7en', 'The Hangover', 'Hereditary', 'A Quiet Place', 'It', 'Animal', 'Pathaan', 'K.G.F: Chapter 2',
    'Baahubali 2: The Conclusion', 'Kantara', '3 Idiots', 'RRR'
];

async function scan() {
    console.log('Fetching high-quality posters from OMDB...');
    const results = [];
    
    for (let name of names) {
        try {
            const res = await fetch(`http://www.omdbapi.com/?apikey=thewdb&t=${encodeURIComponent(name)}`);
            const data = await res.json();
            
            if (data && data.Poster && data.Poster !== 'N/A') {
                const hqPoster = data.Poster.replace('SX300', 'SX700');
                console.log(`✅  ${name}`);
                results.push({
                    title: name,
                    image: hqPoster,
                    year: data.Year,
                    genre: data.Genre
                });
            } else {
                console.log(`❌  ${name} -> NO POSTER FOUND`);
            }
        } catch(e) {
            console.log(`⚠️  ${name} -> ERROR FETCHING API`);
        }
        
        // Slight delay to prevent OMDB rate limiting
        await new Promise(resolve => setTimeout(resolve, 200)); 
    }
    
    fs.writeFileSync('./omdb_results.json', JSON.stringify(results, null, 2));
    console.log('\nSuccess! All high-quality posters saved to omdb_results.json');
}

scan();
