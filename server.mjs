import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=resolve(fileURLToPath(new URL('./public/',import.meta.url)));
const PORT=Number(process.env.PORT||3000);
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
const ROUTES={'/':'/index.html','/love':'/EMORA_V4_Love_Rose_preview.html','/wedding':'/EMORA_V4_Wedding_Ivory_preview.html','/birthday':'/EMORA_V4_Birthday_preview.html','/apology':'/EMORA_V4_Apology_preview.html','/proposal':'/EMORA_V4_Proposal_preview.html','/lookbook':'/EMORA_V4_Interactive_Showcase.html','/EMORA_V4_Interactive_Lookbook.html':'/EMORA_V4_Interactive_Showcase.html'};
const server=http.createServer(async(req,res)=>{
try{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 const raw=new URL(req.url,'http://localhost').pathname;
 if(raw==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({ok:true,app:'emora-v4-light-atelier',mode:'public-showcase',payments:false}));return;}
 const pathname=ROUTES[raw]||raw;
 if(!/^\/[a-zA-Z0-9_./-]+$/.test(pathname)||pathname.includes('..')){res.writeHead(400);res.end();return;}
 const filename=resolve(ROOT,'.'+pathname);
 if(!filename.startsWith(ROOT+sep)){res.writeHead(403);res.end();return;}
 const info=await stat(filename).catch(()=>null);
 if(!info?.isFile()){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end('<h1>EMORA · Sahifa topilmadi</h1><a href="/">Bosh sahifa</a>');return;}
 res.writeHead(200,{'Content-Type':MIME[extname(filename)]||'application/octet-stream','Cache-Control':'.html'===extname(filename)?'no-cache':'public, max-age=86400','X-Content-Type-Options':'nosniff','Content-Length':info.size});
 res.end(req.method==='HEAD'?undefined:await readFile(filename));
}catch(e){console.error(e);if(!res.headersSent)res.writeHead(500);res.end();}
});
server.listen(PORT,'0.0.0.0',()=>console.log('EMORA Light Atelier showcase listening on '+PORT));
