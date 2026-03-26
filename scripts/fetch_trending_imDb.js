const names = ['Dune: Part Two', 'Oppenheimer', 'Spider-Man: Across the Spider-Verse', 'Godzilla Minus One', 'Poor Things'];

async function getOmdb() {
    for (let name of names) {
        try {
            const res = await fetch(`http://www.omdbapi.com/?apikey=thewdb&t=${encodeURIComponent(name)}`);
            const data = await res.json();
            if (data && data.Poster) {
                // Return high-quality 700px density for clean UI scaling
                console.log(data.Poster.replace('SX300', 'SX700'));
            } else {
                console.log('N/A');
            }
        } catch(e) {}
    }
}
getOmdb();
