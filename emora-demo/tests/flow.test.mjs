import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import net from 'node:net';
const photo=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Uob8NQAAAAASUVORK5CYII=','base64');
const video=Buffer.concat([Buffer.from([0,0,0,24]),Buffer.from('ftypisom00000000')]);
async function openPort(){const sock=net.createServer();await new Promise(r=>sock.listen(0,'127.0.0.1',r));const port=sock.address().port;await new Promise(r=>sock.close(r));return port}
test('editor, uploads, three story routes and recipient choices',async()=>{
 const data=await mkdtemp(path.join(tmpdir(),'emora-test-')),port=await openPort(),origin=`http://127.0.0.1:${port}`,key='test-key-secret';
 const server=spawn(process.execPath,['server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),DATA_DIR:data,EMORA_ADMIN_KEY:key,PUBLIC_ORIGIN:origin,NODE_ENV:'production'},stdio:['ignore','pipe','pipe']});
 let stderr='';server.stderr.on('data',x=>stderr+=x);
 try{
  for(let i=0;i<70;i++){if(server.exitCode!==null)throw Error(stderr);try{const r=await fetch(origin+'/api/config');if(r.ok)break}catch{}await new Promise(r=>setTimeout(r,40))}
  const request=(url,options)=>fetch(origin+url,options),auth={Authorization:`Bearer ${key}`};
  assert.match(await(await request('/')).text(),/EMORA/);
  assert.equal((await request('/app.js')).status,200);
  assert.equal((await request('/assets/ring.webp')).status,200);
  assert.equal((await request('/api/config')).status,200);
  assert.equal((await request('/api/media?kind=photo',{method:'POST',headers:{'Content-Type':'image/png'},body:photo})).status,401);
  async function upload(kind,type,body){const r=await request('/api/media?kind='+kind,{method:'POST',headers:{...auth,'Content-Type':type},body});const result=await r.json();assert.equal(r.status,201,JSON.stringify(result));return result.url}
  const img=await upload('photo','image/png',photo),vid=await upload('video','video/mp4',video);
  assert.equal((await request(img)).status,200);
  const base={variant:0,recipient:'Madina',sender:'Aziza',message:'Sizga atalgan xabar',nickname:'Quyoshim',photos:[{url:img,caption:'Tabassum'}],video:vid,music:'sokin',meetingOptions:['Bog‘','Qahvaxona','Kutubxona']};
  async function create(type){const r=await request('/api/stories',{method:'POST',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify({...base,type})});assert.equal(r.status,201);return (await r.json()).id}
  for(const type of ['birthday','apology','proposal']){
   const id=await create(type);assert.equal((await request('/s/'+id)).status,200);const story=await(await request('/api/stories/'+id)).json();assert.equal(story.type,type);
   if(type==='birthday')continue;
   const payload=type==='apology'?{choice:'yes',place:'Bog‘',date:'2099-01-01',time:'18:30'}:{choice:'no'};
   const r=await request(`/api/stories/${id}/respond`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   assert.equal(r.status,200);const result=await r.json();assert.equal(result.saved,true);assert.match(result.shareUrl,/t\.me\/share\/url/);
   const responses=await(await request(`/api/stories/${id}/responses`,{headers:auth})).json();assert.equal(responses.items[0].choice,payload.choice);
   if(type==='apology')assert.equal(responses.items[0].time,'18:30');
  }
 }finally{server.kill();await rm(data,{recursive:true,force:true})}
});

test('public Railway demo redirects safely and rejects private writes',async()=>{
 const data=await mkdtemp(path.join(tmpdir(),'emora-demo-test-')),port=await openPort(),origin=`http://127.0.0.1:${port}`;
 const server=spawn(process.execPath,['server.mjs'],{cwd:process.cwd(),env:{...process.env,PORT:String(port),DATA_DIR:data,EMORA_DEMO_ONLY:'1',NODE_ENV:'production'},stdio:'ignore'});
 try{
  for(let i=0;i<70;i++){try{if((await fetch(origin+'/health')).ok)break}catch{}await new Promise(r=>setTimeout(r,40))}
  const root=await fetch(origin+'/',{redirect:'manual'});assert.equal(root.status,302);assert.equal(root.headers.get('location'),'/demo/');
  assert.equal((await fetch(origin+'/demo/')).status,200);
  assert.equal((await fetch(origin+'/demo/demo.js')).status,200);
  assert.equal((await fetch(origin+'/demo/video/proposal.mp4')).status,200);
  const blocked=await fetch(origin+'/api/stories',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(blocked.status,403);
 }finally{server.kill();await rm(data,{recursive:true,force:true})}
});
