const fs = require('fs');

async function fixHorror() {
    // Using IMDb IDs for 100% accurate results
    const movies = [
        { id: 'hr1', imdbId: 'tt1457767', title: 'The Conjuring' },
        { id: 'hr2', imdbId: 'tt5052448', title: 'Get Out' },
        { id: 'hr3', imdbId: 'tt7784604', title: 'Hereditary' },
        { id: 'hr4', imdbId: 'tt6644200', title: 'A Quiet Place' },
        { id: 'hr5', imdbId: 'tt1396484', title: 'It' },
    ];

    let content = fs.readFileSync('./client/src/data/content.js', 'utf-8');

    for (let movie of movies) {
        const r = await fetch(`http://www.omdbapi.com/?apikey=thewdb&i=${movie.imdbId}`);
        const d = await r.json();
        if (d.Poster && d.Poster !== 'N/A') {
            const url = d.Poster.replace('SX300', 'SX700');
            const regex = new RegExp(`(id: '${movie.id}'[^}]*)image: '[^']+'`);
            content = content.replace(regex, `$1image: '${url}'`);
            console.log(`Fixed: ${movie.title} -> ${url}`);
        } else {
            console.log(`No result for: ${movie.title}`);
        }
    }

    fs.writeFileSync('./client/src/data/content.js', content);
    console.log('All Horror section thumbnails updated!');
}
fixHorror();
