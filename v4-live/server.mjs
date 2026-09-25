import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT||3000);
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/health'){res.writeHead(200,{'content-type':'application/json'});return res.end(JSON.stringify({ok:true,service:'emora-v4'}));}
  if(req.method!=='GET'){res.writeHead(405);return res.end('Method Not Allowed');}
  const file=path.join(ROOT,'index.html');
  const body=await fs.readFile(file);
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-cache','x-content-type-options':'nosniff'});
  res.end(body);
});
server.listen(PORT,()=>console.log('EMORA V4 listening on '+PORT));
