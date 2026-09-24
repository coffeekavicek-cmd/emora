import fs from 'node:fs/promises';
import path from 'node:path';
const required=['public/index.html','public/app.js','public/editor.js','public/story.js','public/music.js','public/style.css','public/assets/ring.webp','public/demo/index.html','public/demo/demo.js','public/demo/style.css','public/demo/story.js','public/demo/music.js',...['yulduz','sokin','quvonch','va-da'].map(x=>`public/audio/${x}.ogg`),...['birthday','apology','proposal'].map(x=>`public/demo/video/${x}.mp4`),...[1,2,3].map(i=>`public/demo/photos/madina-${i}.webp`)];
for(const type of ['birthday','apology','proposal'])for(let i=0;i<5;i++)required.push(`public/assets/${type}-${i}.webp`);
for(const file of required){const stat=await fs.stat(path.resolve(file));if(!stat.isFile()||!stat.size)throw Error(`Missing or empty: ${file}`)}
console.log(`Checked ${required.length} source and media files.`);
