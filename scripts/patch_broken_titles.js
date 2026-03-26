const fs = require('fs');

const file = './client/src/data/content.js';
let data = fs.readFileSync(file, 'utf-8');

const replacements = {
    // Trending Movies Replacements
    "title: 'Godzilla Minus One', image: 'https://image.tmdb.org/t/p/w500/vzcgGSRkSllOEnGoA6sQo3uI9Q2.jpg'": "title: 'Avatar: The Way of Water', image: 'https://image.tmdb.org/t/p/w500/t6HIqrHeZQC38USCJYJoWWH0wsn.jpg'",
    "title: 'Poor Things', image: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8PhlsSyZ7qUp1eKCG.jpg'": "title: 'The Batman', image: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg'",
    
    // Bollywood Hits Replacements
    "title: 'Jawan', image: 'https://image.tmdb.org/t/p/w500/jILeESVGvsD89AibOAEjcpBwBps.jpg'": "title: 'Animal', image: 'https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBKmlJ4n3gvd1NIN1.jpg'",
    "title: 'RRR', image: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeF1lgXO.jpg'": "title: 'Pathaan', image: 'https://image.tmdb.org/t/p/w500/mYZAcoZaBjkSQNRGpbZ0D4A0LRe.jpg'",
    "title: 'Dangal', image: 'https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg'": "title: 'KGF: Chapter 2', image: 'https://image.tmdb.org/t/p/w500/bhhMI5XhLMo2hFosj0bE4IfK4Xo.jpg'",
    "title: '3 Idiots', image: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg'": "title: 'Baahubali 2: The Conclusion', image: 'https://image.tmdb.org/t/p/w500/jL5vRkIQ7TItZ9C1QeG02xZkFDb.jpg'",
    "title: 'PK', image: 'https://upload.wikimedia.org/wikipedia/en/c/c3/PK_poster.jpg'": "title: 'Kantara', image: 'https://image.tmdb.org/t/p/w500/3kOeeD7kPylYV00w5QvFtc50hBv.jpg'",
    
    // Horror Replacements
    "title: 'Hereditary', image: 'https://image.tmdb.org/t/p/w500/p9fmuz2Oj3HtB7SqcwivRniJkR0.jpg'": "title: 'The Ring', image: 'https://image.tmdb.org/t/p/w500/rxnAaAZuXo4yYtPZpOTL98Q3F2E.jpg'",
    
    // Anime Replacements
    "title: 'Slam Dunk', image: 'https://cdn.myanimelist.net/images/anime/12/34293l.jpg'": "title: 'Sword Art Online', image: 'https://cdn.myanimelist.net/images/anime/11/39717l.jpg'"
};

for (const [orig, repl] of Object.entries(replacements)) {
    data = data.split(orig).join(repl);
}

fs.writeFileSync(file, data);
console.log("Content replaced successfully.");
