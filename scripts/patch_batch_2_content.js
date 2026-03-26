const fs = require('fs');

async function patchContent() {
    let content = fs.readFileSync('./client/src/data/content.js', 'utf-8');

    const patches = [
        {
            id: 'ts2',
            title: 'The Last of Us',
            videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337981/The_Last_of_Us___Official_Trailer___Max_1080P_HD_cah7nd.mp4'
        },
        {
            id: 's4',
            title: 'The Boys',
            videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774337964/The_Boys_Final_Season_Trailer___Prime_Video_1080P_HD_eejcg7.mp4'
        },
        {
            id: 'sa1',
            title: 'Blue Lock',
            videoUrl: 'https://res.cloudinary.com/dvxvc4mbz/video/upload/v1774335987/Blue_Lock_2nd_Season___OFFICIAL_HINDI_DUB_TRAILER___Crunchyroll_India_1080P_HD_bnwnrm.mp4'
        }
    ];

    for(let patch of patches) {
        // Find line correctly without destroying formatting
        const regex = new RegExp(`(id:\\s*'${patch.id}',\\s*title:\\s*'${patch.title}'[^\\}]*)(?=\\})`, 'g');
        content = content.replace(regex, (match) => {
            if(!match.includes('videoUrl')) {
                return match.trim() + `, videoUrl: '${patch.videoUrl}' `;
            }
            return match;
        });
        console.log(`✅ Patched videoUrl for: ${patch.title}`);
    }

    fs.writeFileSync('./client/src/data/content.js', content);
    console.log('All new videos locally wired to content.js!');
}
patchContent();
