const fs = require('fs');

async function fixThriller() {
    const movies = [
        { id: 'th1', title: 'Inception', search: 'Inception 2010' },
        { id: 'th2', title: 'Prisoners', search: 'Prisoners 2013' },
        { id: 'th3', title: 'Shutter Island', search: 'Shutter Island' },
        { id: 'th4', title: 'Gone Girl', search: 'Gone Girl 2014' },
        { id: 'th5', title: 'The Silence of the Lambs', search: 'The Silence of the Lambs' }
    ];

    let content = fs.readFileSync('./client/src/data/content.js', 'utf-8');

    for (let movie of movies) {
        const r = await fetch(`http://www.omdbapi.com/?apikey=thewdb&t=${encodeURIComponent(movie.search)}`);
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
    console.log('All Dark Thriller section thumbnails updated!');
}
fixThriller();
