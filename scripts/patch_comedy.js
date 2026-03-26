const fs = require('fs');

async function fixComedy() {
    const movies = [
        { id: 'co1', title: 'The Hangover', search: 'The Hangover 2009' },
        { id: 'co2', title: 'Superbad', search: 'Superbad' },
        { id: 'co3', title: 'Step Brothers', search: 'Step Brothers' },
        { id: 'co4', title: 'Tropic Thunder', search: 'Tropic Thunder' },
        { id: 'co5', title: '21 Jump Street', search: '21 Jump Street' }
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
    console.log('All Comedy section thumbnails updated!');
}
fixComedy();
