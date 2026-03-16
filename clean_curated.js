const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src');

const replacements = {
  "Cinematic Curated Grid": "Cinematic Grid",
  "Curated <br/> Clips": "Trending <br/> Clips",
  "Curated \n Clips": "Trending \n Clips",
  "Curated Clips": "Trending Clips",
  "Curated Match": "Perfect Match",
  "curated privacy": "absolute privacy",
  "Curated Lounge": "Movie Lounge",
  "Curated Handshake": "Secure Connection",
  "Curated Sharing Features": "Advanced Sharing Features",
  "Curated Map Sidebar": "Sidebar",
  "Curated Audio Guidance": "Immersive Audio",
  "curated access keys": "personal access keys",
  "4K Curated Precision": "4K Ultra Precision",
  "Curated Chat Buffer": "Live Chat Buffer",
  "Curated Grid Stats": "Watch Stats",
  "Curated Visibility": "Profile Visibility",
  "Destroy Curated Link": "Unlink Account",
  "Curated Network Screens": "Active Network Users",
  "Curated Broadcast Propagated!": "Global Broadcast Sent!",
  "Curated Broadcast": "Global Broadcast",
  "Broaden Curated Net": "Find More Friends"
};

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(filePath));
    } else {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walkDir(directoryPath);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
