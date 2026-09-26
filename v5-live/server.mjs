import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT||3000);
const templates=new Set(['love-rose','love-pearl','wedding-silk','wedding-garden','birthday-aurora','apology-rain','proposal-pearl']);
http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/health'){res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});return res.end(JSON.stringify({ok:true,service:'emora-v7-signature-experiences',templates:7}));}
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'allow':'GET, HEAD'});return res.end('Method not allowed');}
 let target=path.join(ROOT,'index.html');
 let cache='no-cache';
 let robots='index,follow';
 const match=u.pathname.match(/^\/templates\/(love-rose|love-pearl|wedding-silk|wedding-garden|birthday-aurora|apology-rain|proposal-pearl)\.html$/);
 if(match){target=path.join(ROOT,'templates',match[1]+'.html');cache='public,max-age=600';robots='noindex,nofollow';}
 else if(u.pathname!=='/'&&!/^\/s\/[a-z0-9-]{1,60}$/.test(u.pathname)){res.writeHead(404);return res.end('Not found');}
 try{const data=await fs.readFile(target);res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':cache,'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','x-robots-tag':robots});if(req.method==='HEAD')return res.end();res.end(data)}
 catch{res.writeHead(500);res.end('Server error');}
}).listen(PORT,()=>console.log('EMORA V7 listening on '+PORT));