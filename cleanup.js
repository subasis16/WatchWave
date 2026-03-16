const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src');

const replacements = {
  "Playback Content Flow": "Content Stream",
  "Playback Series": "Limited Series",
  "Playback Annotations": "Viewing History",
  "Playback Fragment": "Movie Clip",
  "Playback Offline Storage": "Offline Storage",
  "Playback Offline Hub": "Offline Hub",
  "Playback Key": "Invite Key",
  "Playback Sci-Fi": "Classic Sci-Fi",
  "Playback Screen": "Offline Screen",
  "playback downloads": "offline downloads",
  "secure playback link": "secure invite link",
  "playback connection": "watch party session"
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
    // using split join for exact string match replacement across the file
    content = content.split(key).join(value);
  }

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
