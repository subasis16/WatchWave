const fs = require('fs');

const target = './client/src/data/content.js';
let content = fs.readFileSync(target, 'utf-8');

// Using Weserv.nl Image Proxy to instantly bypass Wikipedia's 403 Hotlink Protection natively.
const proxyPre = 'https://wsrv.nl/?url=';

let count = 0;
content = content.replace(/https:\/\/upload\.wikimedia\.org\/([^']+)/g, (match) => {
    // Prevent double-proxying
    if (match.includes('wsrv.nl')) return match; 
    
    count++;
    return proxyPre + encodeURIComponent(match);
});

fs.writeFileSync(target, content);
console.log(`Successfully proxied ${count} broken Wikipedia images to globally bypass 403 hotlink bans.`);
