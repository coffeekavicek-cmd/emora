import http from 'node:http';
import assert from 'node:assert/strict';
import {createMeetingBotHandler} from '../meeting-bot.mjs';
const owner='eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',proj='ffffffff-ffff-4fff-8fff-ffffffffffff';
const slug='qa-apology-v25', origin='http://localhost:5005';
const env={EMORA_PUBLIC_ORIGIN:origin,EMORA_BOT_DELIVERY_MODE:'enabled',EMORA_SUPABASE_URL:'https://qa.supabase.co',EMORA_SUPABASE_SERVICE_ROLE_KEY:'fake-key-only',EMORA_TELEGRAM_BOT_TOKEN:'mock-telegram-token',EMORA_TELEGRAM_OWNER_CHAT_MAP:JSON.stringify({[owner]:'123456789'})};
let telegramSends=[],claims=new Set(),calls=[],failure=false;
const fetcher=async(url,options)=>{
 const u=new URL(url);calls.push({path:u.pathname,method:options.method||'GET'});
 if(u.hostname==='api.telegram.org'){telegramSends.push(JSON.parse(options.body));return Response.json({ok:!failure,result:{message_id:999}},{status:failure?502:200})}
 if(u.pathname.endsWith('/published_sites'))return Response.json([{project_id:proj,template_slug:'apology-quiet-room',public_content:{experience_version:24,name1:'Jasmina'}}]);
 if(u.pathname.endsWith('/projects'))return Response.json([{id:proj,owner_id:owner,status:'published'}]);
 if(u.pathname.endsWith('/emora_meeting_events')){
  if(options.method==='POST'){
   const k=JSON.parse(options.body).dedupe_key;
   if(claims.has(k))return Response.json({code:'23505'},{status:409});
   claims.add(k);return Response.json([{dedupe_key:k}],{status:201})
  }
  if(options.method==='PATCH')return Response.json([],{status:200});
 }
 return Response.json({code:'not_found'},{status:404})
};
async function serve(handler){const server=http.createServer(handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));return {server,url:'http://127.0.0.1:'+server.address().port}}
async function runCase(url,data,opts={}){const res=await fetch(url+'/api/apology-meeting',{method:'POST',headers:{origin:opts.origin||origin,'content-type':'application/json'},body:JSON.stringify(data)});return {status:res.status,data:await res.json()}}
const req={slug,choice:'coffee',date:'2026-10-14',time:'19:30'};
const report=[];
{
 const h=createMeetingBotHandler({env,fetcher,clock:()=>Date.parse('2026-10-08T08:00:00Z'),logger:{error:()=>{}}});
 const {server,url}=await serve(h);
 try{
  const wrongOrigin=await runCase(url,req,{origin:'https://attacker.invalid'});
  assert.equal(wrongOrigin.status,403);report.push('cross-origin rejected');
  const invalid=await runCase(url,{...req,choice:'shell'});
  assert.equal(invalid.status,422);report.push('invalid choice rejected');
  const result=await runCase(url,req);
  assert.equal(result.status,200);
  assert.equal(telegramSends.length,1);
  assert.equal(telegramSends[0].chat_id,'123456789');
  assert.match(telegramSends[0].text,/Jasmina/);
  assert.match(telegramSends[0].text,/19:30/);
  report.push('only verified owner chat receives personal date/time');
  const duplicate=await runCase(url,req);
  assert.equal(duplicate.status,409);assert.equal(telegramSends.length,1);report.push('durable dedupe stops replay');
 }finally{server.close()}
}
{
 const disabled=createMeetingBotHandler({env:{...env,EMORA_BOT_DELIVERY_MODE:'off'},fetcher,logger:{error:()=>{}}});
 const {server,url}=await serve(disabled);try{const result=await runCase(url,req);assert.equal(result.status,503);assert.equal(result.data.error,'bot_not_configured');report.push('missing activation fails closed')}finally{server.close()}
}
{
 const missingOwner=createMeetingBotHandler({env:{...env,EMORA_TELEGRAM_OWNER_CHAT_MAP:'{}'},fetcher,clock:()=>Date.parse('2026-10-08T08:00:00Z'),logger:{error:()=>{}}});
 const {server,url}=await serve(missingOwner);try{const result=await runCase(url,{...req,choice:'walk'});assert.equal(result.status,503);assert.equal(result.data.error,'owner_not_connected');report.push('missing sender bot subscription fails closed')}finally{server.close()}
}
console.log(JSON.stringify({passed:true,checks:report,telegramDeliveries:telegramSends.length,dbCalls:calls.length},null,2));
