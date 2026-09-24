import fs from 'node:fs/promises';
import path from 'node:path';
const required=['public/index.html','public/app.js','public/editor.js','public/story.js','public/music.js','public/style.css','public/assets/ring.webp',...['yulduz','sokin','quvonch','va-da'].map(x=>`public/audio/${x}.ogg`)];
for(const type of ['birthday','apology','proposal'])for(let i=0;i<5;i++)required.push(`public/assets/${type}-${i}.webp`);
for(const file of required){const stat=await fs.stat(path.resolve(file));if(!stat.isFile()||!stat.size)throw Error(`Missing or empty: ${file}`)}
console.log(`Checked ${required.length} source and media files.`);
