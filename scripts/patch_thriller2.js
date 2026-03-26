const fs = require('fs');

async function fixRemaining() {
    const movies = [
        { id: 'th1', imdbId: 'tt1375666', title: 'Inception' },
        { id: 'th2', imdbId: 'tt1392214', title: 'Prisoners' },
        { id: 'th4', imdbId: 'tt2267998', title: 'Gone Girl' },
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
    console.log('Remaining Thriller thumbnails patched!');
}
fixRemaining();
