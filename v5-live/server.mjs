import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT||3000);
const assets=['cinematic.css','cinematic.js','silk-3d.css','silk-3d.js','silk-atelier.svg',...['love-rose','love-pearl','wedding-silk','wedding-garden','birthday-aurora','apology-rain','proposal-pearl'].map(n=>n+'.html')];
await Promise.all(assets.map(file=>fs.access(path.join(ROOT,'templates',file))));
const jsCheck=spawnSync(process.execPath,['--check',path.join(ROOT,'templates','cinematic.js')],{encoding:'utf8'});
if(jsCheck.status!==0)throw new Error('EMORA cinematic engine syntax check failed: '+(jsCheck.stderr||'unknown'));
const silkCheck=spawnSync(process.execPath,['--check',path.join(ROOT,'templates','silk-3d.js')],{encoding:'utf8'});
if(silkCheck.status!==0)throw new Error('EMORA Silk module syntax check failed: '+(silkCheck.stderr||'unknown'));
const css=await fs.readFile(path.join(ROOT,'templates','cinematic.css'),'utf8');
let depth=0,quote=null,comment=false;
for(let i=0;i<css.length;i++){
 const ch=css[i],next=css[i+1];
 if(comment){if(ch==='*'&&next==='/'){comment=false;i++}continue}
 if(quote){if(ch==='\\'){i++;continue}if(ch===quote)quote=null;continue}
 if(ch==='/'&&next==='*'){comment=true;i++;continue}
 if(ch==='"'||ch==="'"){quote=ch;continue}
 if(ch==='{')depth++;else if(ch==='}')depth--;
 if(depth<0)throw new Error('EMORA CSS contains an unexpected closing block');
}
if(depth!==0||quote||comment)throw new Error('EMORA CSS block or string not closed');
console.log('EMORA V10 startup checks: 7 pages, shared JS, Silk 3D JS and CSS checked');

const templates=new Set(['love-rose','love-pearl','wedding-silk','wedding-garden','birthday-aurora','apology-rain','proposal-pearl']);
http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/health'){res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});return res.end(JSON.stringify({ok:true,service:'emora-v9-cinematic-experiences',templates:7}));}
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'allow':'GET, HEAD'});return res.end('Method not allowed');}
 let target=path.join(ROOT,'index.html');
 let cache='no-cache';
 let robots='index,follow';
 const match=u.pathname.match(/^\/templates\/(love-rose|love-pearl|wedding-silk|wedding-garden|birthday-aurora|apology-rain|proposal-pearl)\.html$/);
 if(match){target=path.join(ROOT,'templates',match[1]+'.html');cache='public,max-age=120';robots='noindex,nofollow';}
 else if(['/templates/cinematic.css','/templates/cinematic.js','/templates/silk-3d.css','/templates/silk-3d.js','/templates/silk-atelier.svg'].includes(u.pathname)) {target=path.join(ROOT,'templates',path.basename(u.pathname));cache='public,max-age=3600';robots='noindex,nofollow';}
 else if(u.pathname!=='/'&&!/^\/s\/[a-z0-9-]{1,60}$/.test(u.pathname)){res.writeHead(404);return res.end('Not found');}
 try{const data=await fs.readFile(target);const mime=u.pathname.endsWith('.css')?'text/css; charset=utf-8':u.pathname.endsWith('.js')?'application/javascript; charset=utf-8':u.pathname.endsWith('.svg')?'image/svg+xml':'text/html; charset=utf-8';res.writeHead(200,{'content-type':mime,'cache-control':cache,'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','x-robots-tag':robots});if(req.method==='HEAD')return res.end();res.end(data)}
 catch{res.writeHead(500);res.end('Server error');}
}).listen(PORT,()=>console.log('EMORA V9 listening on '+PORT));