const fs = require('fs');

async function fixRomantic() {
    const movies = [
        { id: 'rm1', title: 'La La Land', search: 'La La Land' },
        { id: 'rm2', title: 'Titanic', search: 'Titanic' },
        { id: 'rm3', title: 'The Notebook', search: 'The Notebook' },
        { id: 'rm4', title: 'Before Sunrise', search: 'Before Sunrise' },
        { id: 'rm5', title: 'Pride & Prejudice', search: 'Pride and Prejudice 2005' }
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
        }
    }

    fs.writeFileSync('./client/src/data/content.js', content);
    console.log('All Romantic section thumbnails updated!');
}
fixRomantic();
