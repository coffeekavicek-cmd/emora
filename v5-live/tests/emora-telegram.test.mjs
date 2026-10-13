import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {createTelegramIntegration} from '../emora-telegram.mjs';
const origin='https://emora.example';
function response(){return {writeHead(status){this.status=status;},end(s){this.body=JSON.parse(s);}};}
function request(body={},headers={}){const req=Readable.from([Buffer.from(JSON.stringify(body))]);req.method='POST';req.headers={origin,'content-type':'application/json',...headers};return req;}
async function fixture({claim={ok:true,event_id:'event',chat_id:'123456789',recipient:'Jasmina'},sendError=false}={}){
 const calls=[];let app;
 const fetcher=async(url,init={})=>{
  const data=init.body?JSON.parse(init.body):{};calls.push({url,data});
  let result;
  if(url.endsWith('/getMe'))result={username:'emora_test_bot'};
  else if(url.endsWith('/getWebhookInfo'))result={url:''};
  else if(url.endsWith('/getUpdates')){app.stop();result=[];}
  else if(url.endsWith('/sendMessage')){if(sendError)throw Error('network failure');result={message_id:17};}
  else if(url.endsWith('/auth/v1/user'))return {ok:true,json:async()=>({id:'user'})};
  else if(url.endsWith('/emora_bot_bridge')){
   if(data.p_action==='offset_get')result={offset:0};
   else if(data.p_action==='meeting_claim')result=claim;
   else if(data.p_action==='connection_status')result={connected:true};
   else result={ok:true};
   return {ok:true,json:async()=>result};
  }else result=true;
  return {ok:true,json:async()=>({ok:true,result})};
 };
 app=createTelegramIntegration({env:{EMORA_PUBLIC_ORIGIN:origin,EMORA_TELEGRAM_BOT_TOKEN:'test',EMORA_SUPABASE_URL:'https://db.example',EMORA_SUPABASE_PUBLISHABLE_KEY:'public',EMORA_BOT_BRIDGE_SECRET:'secret'},fetcher,logger:{log(){},error(){}},clock:()=>Date.parse('2026-10-13T06:00:00Z')});
 await app.start();return {app,calls};
}
const valid={slug:'gift',choice:'coffee',date:'2026-10-15',time:'18:30'};
test('meeting delivers only to the database-verified owner and uses Russian text',async()=>{
 const {app,calls}=await fixture();const res=response();await app.meeting(request({...valid,chat_id:'attacker'}),res);
 assert.equal(res.status,200);const msg=calls.find(c=>c.url.endsWith('/sendMessage'));assert.equal(msg.data.chat_id,'123456789');assert.match(msg.data.text,/Место: Кофе/);assert.match(msg.data.text,/15.10.2026/);
 assert.equal(calls.find(c=>c.data.p_action==='meeting_complete').data.p_data.status,'sent');
});
test('already delivered bookings are idempotent',async()=>{
 const {app,calls}=await fixture({claim:{ok:false,error:'already_submitted',status:'sent'}});const res=response();await app.meeting(request(valid),res);assert.equal(res.status,200);assert.ok(!calls.some(c=>c.url.endsWith('/sendMessage')));
});
test('uncertain Telegram delivery is stored as unknown and not reported as sent',async()=>{
 const {app,calls}=await fixture({sendError:true});const res=response();await app.meeting(request(valid),res);assert.equal(res.status,502);assert.equal(calls.find(c=>c.data.p_action==='meeting_complete').data.p_data.status,'unknown');
});
test('wrong origin and impossible dates do not reach delivery storage',async()=>{
 const {app,calls}=await fixture();let res=response();await app.meeting(request(valid,{origin:'https://attacker.example'}),res);assert.equal(res.status,403);
 res=response();await app.meeting(request({...valid,date:'2026-02-30'}),res);assert.equal(res.status,422);assert.ok(!calls.some(c=>c.data.p_action==='meeting_claim'));
});
test('connection requires authentication and returns only a one-time Telegram link',async()=>{
 const {app,calls}=await fixture();let res=response();await app.connection(request(),res,'link_create');assert.equal(res.status,401);
 res=response();await app.connection(request({}, {authorization:'Bearer verified-session'}),res,'link_create');assert.equal(res.status,200);assert.match(res.body.url,/^https:\/\/t.me\/emora_test_bot\?start=link_[a-f0-9]{48}$/);
 const c=calls.find(c=>c.data.p_action==='link_create');assert.match(c.data.p_data.token_hash,/^[a-f0-9]{64}$/);assert.ok(!JSON.stringify(res.body).includes('secret'));
});
test('group messages cannot link a personal account or trigger a response',async()=>{
 const {app,calls}=await fixture();await app.handleUpdate({message:{chat:{id:-1,type:'group'},text:'/start link_'+'a'.repeat(48)}});assert.ok(!calls.some(c=>c.data.p_action==='link_consume'));assert.ok(!calls.some(c=>c.url.endsWith('/sendMessage')));
});
test('bot menu offers four gift categories and no wedding invitation',async()=>{
 const {app,calls}=await fixture();await app.handleUpdate({message:{chat:{id:123456789,type:'private'},from:{is_bot:false},text:'/start'}});const text=calls.find(c=>c.url.endsWith('/sendMessage')).data.text;assert.match(text,/день рождения/);assert.match(text,/извиниться/);assert.match(text,/признаться/);assert.match(text,/выйти замуж/);assert.ok(!text.includes('приглашение на свадьбу'));
});
