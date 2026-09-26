import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pages=[
  ['love-rose','rose'],
  ['love-pearl','pearl'],
  ['wedding-silk','silk'],
  ['wedding-garden','garden'],
  ['birthday-aurora','aurora'],
  ['apology-rain','rain'],
  ['proposal-pearl','promise']
];
test('all seven cinematic templates exist and use the shared engine',async()=>{
  for(const [slug,theme] of pages){
    const html=await fs.readFile(path.join(root,'templates',slug+'.html'),'utf8');
    assert.match(html,new RegExp('data-template="'+slug+'"'));
    assert.match(html,new RegExp('class="site '+theme+'"'));
    assert.ok(html.includes('/templates/cinematic.css?v=9'));
    assert.ok(html.includes('/templates/cinematic.js?v=9'));
    assert.ok(html.includes('viewport-fit=cover'));
    assert.ok(!html.includes('Bu blok mijozning'),'Do not ship internal placeholder copy');
  }
});
test('engine defines all seven scenes and safely handles personalized data',async()=>{
  const js=await fs.readFile(path.join(root,'templates','cinematic.js'),'utf8');
  for(const [slug] of pages)assert.ok(js.includes("'"+slug+"':{"),slug);
  assert.ok(js.includes("e.origin!==location.origin"),'Frame messages must be same-origin');
  assert.ok(js.includes('textContent'),'Never interpolate personalized text as HTML');
  assert.ok(js.includes('prefers-reduced-motion'),'Support reduced motion');
  assert.ok(js.includes('mapUrl'),'Whitelist map domains');
  assert.ok(js.includes('currentConfig=cfg'),'Live editor bindings');
});
test('CSS balanced without swallowing layout (regression)',async()=>{
  const css=await fs.readFile(path.join(root,'templates','cinematic.css'),'utf8');
  let depth=0,quote=null,comment=false;
  for(let i=0;i<css.length;i++){
    const ch=css[i],n=css[i+1];
    if(comment){if(ch==='*'&&n==='/'){comment=false;i++}continue}
    if(quote){if(ch==='\\'){i++;continue}if(ch===quote)quote=null;continue}
    if(ch==='/'&&n==='*'){comment=true;i++;continue}
    if(ch==="'"||ch==='"'){quote=ch;continue}
    if(ch==='{')depth++;
    else if(ch==='}'){depth--;assert.ok(depth>=0,'Unexpected } at '+i)}
  }
  assert.equal(depth,0,'CSS blocks must be balanced');
  assert.equal(quote,null,'Unclosed CSS quote');
  assert.ok(css.includes('.chapter{'),'Chapter layout exists');
  assert.ok(css.includes('.intro.playing'),'The cinematic opening animates');
});
const freePort=()=>new Promise((resolve,reject)=>{
  const s=net.createServer();
  s.once('error',reject);
  s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))});
});
test('runtime serves all templates, CSS, JS and blocks arbitrary paths',async()=>{
  const port=await freePort();
  const child=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:'pipe'});
  const base='http://127.0.0.1:'+port;
  try{
    let ready=false;
    for(let i=0;i<70;i++){
      if(child.exitCode!==null)throw Error('Server exited with '+child.exitCode);
      try{const r=await fetch(base+'/health');if(r.ok){ready=true;break}}catch{}
      await new Promise(r=>setTimeout(r,80));
    }
    assert.ok(ready,'Local server did not start');
    const health=await (await fetch(base+'/health')).json();
    assert.equal(health.templates,7);
    for(const [slug] of pages){
      const r=await fetch(base+'/templates/'+slug+'.html');
      assert.equal(r.status,200,slug);
      assert.match(r.headers.get('content-type'),/text\/html/);
      assert.ok((await r.text()).includes('data-template="'+slug+'"'));
    }
    for(const [asset,type] of [['cinematic.css','text/css'],['cinematic.js','javascript']]){
      const r=await fetch(base+'/templates/'+asset);
      assert.equal(r.status,200,asset);
      assert.ok(r.headers.get('content-type').includes(type),asset);
      assert.ok((await r.text()).length>4000,asset+' should not be empty');
    }
    assert.equal((await fetch(base+'/templates/../../server.mjs')).status,404);
    assert.equal((await fetch(base+'/templates/unknown.html')).status,404);
  }finally{child.kill('SIGTERM')}
});
