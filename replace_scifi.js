const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client', 'src');

const replacements = {
  "\\bSynchronize Room Vibe\\b": "Connect Room Vibe",
  "\\bBypass Synchronization\\b": "Skip Connection",
  "\\bLive Screen Sync Active\\b": "Live Room Active",
  "\\bUser Profile Synchronized\\b": "User Profile Updated",
  "\\bSynchronized\\b": "Connected",
  "\\bsynchronized\\b": "connected",
  "\\bSynchronize\\b": "Connect",
  "\\bsynchronize\\b": "connect",
  "\\bSynchronization\\b": "Connection",
  "\\bsynchronization\\b": "connection",
  "\\bSync Match %\\b": "Match %",
  "\\bCurated Sync\\b": "Curated Match",
  "\\bSynchronizing...\\b": "Connecting...",
  "\\bVocal Sync\\b": "Voice Chat",
  "\\bCross-Platform Sync\\b": "Cross-Platform Play",
  "\\bSocial Sync Clusters\\b": "Social Watch Parties",
  "\\bsocial sync layer\\b": "social watch layer",
  "\\bScreen Synchronization\\b": "Screen Connection",
  "\\bcollective connection\\b": "group watch experience" // "collective synchronization" becomes collective connection, then to group watch
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
    const regex = new RegExp(key, 'g');
    content = content.replace(regex, value);
  }

  // A couple more specific fixes:
  content = content.replace(/Cinematic Connection \/ Alpha/, 'Cinematic Experience / Alpha');
  content = content.replace(/collective Connected/, 'group watch experience');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
