import crypto from 'node:crypto';

const TYPES=new Set(['restaurant','walk','coffee']);
const isoDate=/^\d{4}-\d{2}-\d{2}$/;
const localTime=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
function respond(res,status,data){res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data))}
function validDate(date){if(!isoDate.test(date))return false;const t=Date.parse(date+'T00:00:00Z');return Number.isFinite(t)&&new Date(t).toISOString().slice(0,10)===date}
function validSlug(slug){return typeof slug==='string'&&/^[a-z0-9-]{1,60}$/.test(slug)}
function expectedDate(date,offsetMinutes=300){return new Date(Date.now()+offsetMinutes*60_000).toISOString().slice(0,10)}
function redacted(err){return String(err?.message||err).slice(0,120).replace(/[a-zA-Z0-9_-]{35,}/g,'[REDACTED]')}
export function createMeetingBotHandler({env=process.env,fetcher=fetch,logger=console,clock=()=>Date.now()}={}){
 const used=new Map();
 let busy=Promise.resolve();
 function guard(slug){
  const t=clock();for(const [k,v] of used){if(t-v>3600000)used.delete(k)}
  const k=slug;let n=0;for(const [key] of used)if(key.startsWith(k+':'))n++;
  if(n>=3)return false;
  used.set(k+':'+crypto.randomUUID(),t);return true
 }
 async function requestPostgrest(table,query,key,init={}){
  const base=String(env.EMORA_SUPABASE_URL||'').replace(/\/$/,'');
  const url=base+'/rest/v1/'+table+(query?'?'+query:'');
  const response=await fetcher(url,{...init,headers:{apikey:key,Authorization:'Bearer '+key,'content-type':'application/json',...init.headers},signal:AbortSignal.timeout(12000)});
  const text=await response.text();let data;try{data=text?JSON.parse(text):null}catch{data:null}
  return {status:response.status,ok:response.ok,data}
 }
 return async function handleMeeting(req,res){
  if(req.method!=='POST')return respond(res,405,{ok:false,error:'method'});
  const origin=String(req.headers.origin||'');
  const publicOrigin=String(env.EMORA_PUBLIC_ORIGIN||'').replace(/\/$/,'');
  if(!publicOrigin)return respond(res,503,{ok:false,error:'bot_not_configured'});
  if(origin!==publicOrigin)return respond(res,403,{ok:false,error:'origin'});
  if(!env.EMORA_SUPABASE_URL||!env.EMORA_SUPABASE_SERVICE_ROLE_KEY||!env.EMORA_TELEGRAM_BOT_TOKEN||!env.EMORA_TELEGRAM_OWNER_CHAT_MAP||env.EMORA_BOT_DELIVERY_MODE!=='enabled')
   return respond(res,503,{ok:false,error:'bot_not_configured'});
  const ct=String(req.headers['content-type']||'');if(!ct.startsWith('application/json'))return respond(res,415,{ok:false,error:'content_type'});
  let chunks='',n=0;
  try{for await(const chunk of req){n+=chunk.length;if(n>2048)return respond(res,413,{ok:false,error:'too_large'});chunks+=chunk.toString('utf8')}}catch{return respond(res,400,{ok:false,error:'payload'})}
  let body;try{body=JSON.parse(chunks)}catch{return respond(res,400,{ok:false,error:'json'})}
  const {slug,choice,date,time}=body||{};
  if(!validSlug(slug)||!TYPES.has(choice)||!validDate(date)||!localTime.test(time))
   return respond(res,422,{ok:false,error:'invalid_choice_or_time'});
  const today=new Date(clock()+5*60*60000).toISOString().slice(0,10);
  if(date<today||date>new Date(clock()+5*60*60000+370*86400000).toISOString().slice(0,10))
   return respond(res,422,{ok:false,error:'date_out_of_range'});
  if(!guard(slug))return respond(res,429,{ok:false,error:'rate_limited'});
  let chatMap;try{chatMap=JSON.parse(env.EMORA_TELEGRAM_OWNER_CHAT_MAP);if(!chatMap||Array.isArray(chatMap)||typeof chatMap!=='object')throw Error('map')}catch{return respond(res,503,{ok:false,error:'owner_not_connected'})}
  const key=env.EMORA_SUPABASE_SERVICE_ROLE_KEY;
  let site,project;
  try{
   const sites=await requestPostgrest('published_sites','select=project_id,slug,template_slug,is_active,public_content&slug=eq.'+encodeURIComponent(slug)+'&is_active=eq.true&limit=1',key);
   if(!sites.ok||!Array.isArray(sites.data)||!sites.data.length)return respond(res,404,{ok:false,error:'published_site_not_found'});
   site=sites.data[0];if(site.template_slug!=='apology-quiet-room'||Number(site.public_content?.experience_version)<24)return respond(res,403,{ok:false,error:'not_current_apology'});
   const projects=await requestPostgrest('projects','select=id,owner_id,status&status=eq.published&id=eq.'+encodeURIComponent(site.project_id)+'&limit=1',key);
   if(!projects.ok||!Array.isArray(projects.data)||projects.data.length!==1)return respond(res,403,{ok:false,error:'owner_not_verified'});
   project=projects.data[0];
  }catch(e){logger.error('Emora recipient lookup failed',redacted(e));return respond(res,503,{ok:false,error:'verify_unavailable'})}
  const chat=String(chatMap[project.owner_id]||'');
  if(!/^\d{5,18}$/.test(chat))return respond(res,503,{ok:false,error:'owner_not_connected'});
  const dedupe=crypto.createHash('sha256').update([site.project_id,slug,choice,date,time].join('|')).digest('hex');
  try{
   const claimed=await requestPostgrest('emora_meeting_events','',key,{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({dedupe_key:dedupe,project_id:project.id,owner_id:project.owner_id,site_slug:slug,choice,meet_date:date,meet_time:time,status:'pending'})});
   if(claimed.status===409)return respond(res,409,{ok:false,error:'already_submitted'});
   if(!claimed.ok)return respond(res,503,{ok:false,error:'delivery_storage_unavailable'});
  }catch(e){logger.error('Emora booking storage failed',redacted(e));return respond(res,503,{ok:false,error:'delivery_storage_unavailable'})}
  const names={restaurant:'🍽 Ресторан',walk:'🌙 Сайр',coffee:'☕ Кофе'};
  const recipient=String(site.public_content?.name1||'Меҳмон').slice(0,80);
  const message=['💌 EMORA · Янги учрашув','', 'Кимдан: '+recipient,'Йўналиш: Узр сўраш','Жой: '+names[choice],'Сана: '+date,'Вақт: '+time+' (Тошкент вақти)','', 'Emora ID: '+dedupe.slice(0,10)].join('\n');
  let delivered=false,msgId=null;
  try{
   const sent=await fetcher('https://api.telegram.org/bot'+env.EMORA_TELEGRAM_BOT_TOKEN+'/sendMessage',{
    method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chat,text:message,disable_web_page_preview:true}),signal:AbortSignal.timeout(12000)});
   const body=await sent.json();delivered=sent.ok&&body?.ok===true;msgId=body?.result?.message_id||null;
  }catch(e){logger.error('Emora Telegram bot send failed',redacted(e))}
  try{await requestPostgrest('emora_meeting_events','dedupe_key=eq.'+dedupe,key,{method:'PATCH',body:JSON.stringify({status:delivered?'sent':'failed',telegram_message_id:msgId})})}catch(e){logger.error('Emora delivery update failed',redacted(e))}
  if(!delivered)return respond(res,502,{ok:false,error:'telegram_delivery_failed'});
  return respond(res,200,{ok:true,delivery:'sent',meeting:{choice,date,time}});
 }
}
