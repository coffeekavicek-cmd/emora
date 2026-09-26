import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT||3000);
const premiumKeys=["love-rose","love-pearl","love-galaxy","wedding-garden","wedding-naqsh","birthday-aurora","birthday-balloon","birthday-memory","apology-rain","apology-ink","apology-quiet","proposal-pearl","proposal-cinema","proposal-sky"];
const mediaNames=new Set(["site-hero","love-rose","love-pearl","love-galaxy","wedding-garden","wedding-naqsh","birthday-aurora","birthday-balloon","birthday-memory","apology-rain","apology-ink","apology-quiet","proposal-pearl","proposal-cinema","proposal-sky"]);
const legacy={"love-rose":"love-rose","love-pearl":"love-pearl","wedding-garden":"wedding-garden","birthday-aurora":"birthday-aurora","apology-rain":"apology-rain","proposal-pearl":"proposal-pearl"};
const templateFiles=['wedding-silk.html',...premiumKeys.map(k=>'v10-'+k+'.html')];
const jsFiles=['silk-heritage.js','v10-data.js','v10-main.js'];
const cssFiles=['silk-heritage.css','v10-core.css','v10-love.css','v10-wedding.css','v10-birthday.css','v10-apology.css','v10-proposal.css'];
await Promise.all([...templateFiles,...jsFiles,...cssFiles].map(f=>fs.access(path.join(ROOT,'templates',f))));
await Promise.all(['silk-heritage-original.jpg',...mediaNames].map(f=>fs.access(path.join(ROOT,'assets',f.endsWith('.jpg')?f:f+'.png'))));
for(const name of jsFiles){
 const c=spawnSync(process.execPath,['--check',path.join(ROOT,'templates',name)],{encoding:'utf8'});
 if(c.status!==0)throw new Error('EMORA V10 JS syntax check failed: '+name+' '+c.stderr);
}
for(const name of cssFiles){
 const css=await fs.readFile(path.join(ROOT,'templates',name),'utf8');
 let depth=0,quote=null,comment=false;
 for(let i=0;i<css.length;i++){const x=css[i],y=css[i+1];
  if(comment){if(x==='*'&&y==='/'){comment=false;i++}continue}
  if(quote){if(x==='\\'){i++;continue}if(x===quote)quote=null;continue}
  if(x==='/'&&y==='*'){comment=true;i++;continue}
  if(x==='"'||x==="'"){quote=x;continue}
  if(x==='{')depth++;else if(x==='}')depth--;
  if(depth<0)throw new Error('Unexpected CSS } in '+name);
 }
 if(depth!==0||quote||comment)throw new Error('Malformed CSS in '+name);
}
console.log('EMORA V10 boot passed: 15 HTML templates, 16 local original images, JS and CSS verified');
http.createServer(async(req,res)=>{
 let url;
 try{url=new URL(req.url,'http://localhost')}catch{res.writeHead(400);return res.end('Bad URL')}
 const pathname=url.pathname;
 const headers={'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin'};
 if(pathname==='/health'){
  res.writeHead(200,{'content-type':'application/json','cache-control':'no-store',...headers});
  return res.end(JSON.stringify({ok:true,version:10,categories:5,templates:15,localOriginalMedia:16}));
 }
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'allow':'GET, HEAD',...headers});return res.end('Method not allowed')}
 let target=path.join(ROOT,'index.html'),cache='no-cache',robots='index,follow',mime='text/html; charset=utf-8';
 const template=pathname.match(/^\/templates\/(v10-[a-z0-9-]+|wedding-silk)\.html$/);
 const file=template?.[1]+'.html';
 if(templateFiles.includes(file)){target=path.join(ROOT,'templates',file);cache='public,max-age=120';robots='noindex,nofollow'}
 else {
  const old=pathname.match(/^\/templates\/(love-rose|love-pearl|wedding-garden|birthday-aurora|apology-rain|proposal-pearl)\.html$/);
  if(old&&legacy[old[1]]){res.writeHead(302,{location:'/templates/v10-'+legacy[old[1]]+'.html'+url.search,'cache-control':'no-cache',...headers});return res.end()}
  const jsOrCss=pathname.match(/^\/templates\/([a-z0-9-]+\.(?:js|css))$/);
  if(jsOrCss&&(jsFiles.includes(jsOrCss[1])||cssFiles.includes(jsOrCss[1]))){
   target=path.join(ROOT,'templates',jsOrCss[1]);mime=pathname.endsWith('.js')?'application/javascript; charset=utf-8':'text/css; charset=utf-8';cache='public,max-age=3600';robots='noindex,nofollow'
  }else{
   const asset=pathname.match(/^\/assets\/([a-z0-9-]+)\.png$/);
   if(asset&&mediaNames.has(asset[1])){target=path.join(ROOT,'assets',asset[1]+'.png');mime='image/png';cache='public,max-age=86400';robots='noindex,nofollow'}
   else if(pathname==='/assets/silk-heritage-original.jpg'){target=path.join(ROOT,'assets','silk-heritage-original.jpg');mime='image/jpeg';cache='public,max-age=86400';robots='noindex,nofollow'}
   else if(pathname!=='/'&&!/^\/s\/[a-z0-9-]{1,60}$/.test(pathname)){res.writeHead(404,headers);return res.end('Not found')}
  }
 }
 try{
  const data=await fs.readFile(target);
  res.writeHead(200,{'content-type':mime,'cache-control':cache,'x-robots-tag':robots,...headers});
  return res.end(req.method==='HEAD'?undefined:data);
 }catch(e){console.error('EMORA missing route '+pathname+' '+e.code);res.writeHead(e.code==='ENOENT'?404:500,headers);res.end('Unavailable')}
}).listen(PORT,()=>console.log('EMORA V10 listening on '+PORT));
