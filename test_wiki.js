const https = require('https');

const urls = [
    'https://upload.wikimedia.org/wikipedia/en/e/ed/Godzilla_Minus_One_teaser_poster.jpg',
    'https://upload.wikimedia.org/wikipedia/en/2/29/Poor_Things_%28film%29.png',
    'https://upload.wikimedia.org/wikipedia/en/6/6e/Mad_Max_Fury_Road.jpg',
    'https://upload.wikimedia.org/wikipedia/en/e/e0/Mission_Impossible_-_Dead_Reckoning_Part_One_poster.jpg',
    'https://upload.wikimedia.org/wikipedia/en/6/68/Seven_%28movie%29_poster.jpg',
    'https://upload.wikimedia.org/wikipedia/en/b/b9/Hangoverposter09.jpg',
    'https://upload.wikimedia.org/wikipedia/en/d/d9/Hereditary_%28film%29.png',
    'https://upload.wikimedia.org/wikipedia/en/a/a0/A_Quiet_Place_film_poster.png',
    'https://upload.wikimedia.org/wikipedia/en/5/5a/It_%282017%29_poster.jpg',
    'https://upload.wikimedia.org/wikipedia/en/5/52/SlamDunk-Kanzenban01.jpg',
    'https://upload.wikimedia.org/wikipedia/en/9/90/Animal_%282023_film%29_poster.jpg',
    'https://upload.wikimedia.org/wikipedia/en/c/c3/Pathaan_film_poster.jpg',
    'https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg',
    'https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_the_Conclusion.jpg',
    'https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg',
    'https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg',
    'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg'
];

async function run() {
    for (let u of urls) {
        await new Promise(r => {
            https.get(u, res => {
                if (res.statusCode >= 400) console.log(`BROKEN [${res.statusCode}]: ${u}`);
                r();
            }).on('error', () => { console.log(`ERR: ${u}`); r(); });
        });
    }
    console.log("Done testing");
}
run();
