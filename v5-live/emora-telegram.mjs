import crypto from 'node:crypto';
import {readFile} from 'node:fs/promises';
const json=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));};
export function createTelegramIntegration({env=process.env,fetcher=fetch,logger=console,clock=Date.now}={}){
 const origin=String(env.EMORA_PUBLIC_ORIGIN||'').replace(/\/$/,'');
 const token=env.EMORA_TELEGRAM_BOT_TOKEN;
 const base=String(env.EMORA_SUPABASE_URL||'').replace(/\/$/,'');
 const key=env.EMORA_SUPABASE_PUBLISHABLE_KEY;
 const secret=env.EMORA_BOT_BRIDGE_SECRET;
 let username='',displayName='',profilePhotoReady=false,miniAppReady=false,startupError='',ready=false,stopped=false,abort=null;
 const limits=new Map();
 async function telegram(method,data={},multipart=null){
  const r=await fetcher('https://api.telegram.org/bot'+token+'/'+method,{method:'POST',headers:multipart?{}:{'content-type':'application/json'},body:multipart||JSON.stringify(data),signal:AbortSignal.timeout(method==='getUpdates'?40000:12000)});
  const body=await r.json();
  if(!r.ok||!body.ok){const e=new Error('telegram_'+(body.error_code||r.status));e.definite=true;throw e;}
  return body.result;
 }
 async function rpc(action,data={},jwt){
  const headers={apikey:key,'content-type':'application/json'};
  if(jwt)headers.Authorization='Bearer '+jwt;
  const r=await fetcher(base+'/rest/v1/rpc/emora_bot_bridge',{method:'POST',headers,body:JSON.stringify({p_secret:secret,p_action:action,p_data:data}),signal:AbortSignal.timeout(12000)});
  const body=await r.json();if(!r.ok)throw new Error('storage_'+r.status);return body;
 }
 function permitted(k,max=10){
  const now=clock();for(const [id,v]of limits)if(now-v.at>60000)limits.delete(id);
  const v=limits.get(k)||{at:now,count:0};v.count++;limits.set(k,v);return v.count<=max;
 }
 function keyboard(){return {inline_keyboard:[[{text:'Создать подарок',web_app:{url:origin+'/?miniapp=1#studio'}}],[{text:'Подключить уведомления',web_app:{url:origin+'/?miniapp=1&telegram=connect#studio'}}],[{text:'Как это работает',callback_data:'help'}]]};}
 const welcome='Привет, это Emora ♡\n\nЗдесь можно сделать личный подарок: на день рождения, чтобы извиниться, признаться в любви или предложить выйти замуж.\n\nВыбери шаблон на сайте, добавь ваши фото, видео и пару слов от себя. Перед отправкой всё можно посмотреть.\n\nХочешь получать ответы сюда? Нажми «Подключить уведомления».';
 const help='Всё просто:\n\n1. Открой сайт и выбери подарок.\n2. Добавь имя, фото, видео и музыку.\n3. Посмотри, что получилось.\n\nСам сайт на русском. Язык подарка выбираешь отдельно: русский, узбекский или английский.\n\nВ шаблоне с извинением она сможет выбрать место и время встречи. После подключения Telegram её ответ придёт сюда.';
 async function handleUpdate(update){
  if(update.callback_query){const q=update.callback_query;if(q.message?.chat?.type!=='private')return;
   await telegram('answerCallbackQuery',{callback_query_id:q.id});
   if(q.data==='help')await telegram('sendMessage',{chat_id:q.message.chat.id,text:help,reply_markup:keyboard()});return;
  }
  const m=update.message;if(!m||m.chat?.type!=='private'||m.from?.is_bot)return;
  const chat=String(m.chat.id);if(!permitted('chat:'+chat,12))return;
  const text=String(m.text||'').trim();const command=text.split(/\s/)[0].split('@')[0];
  if(command==='/start'){
   const payload=text.split(/\s+/)[1]||'';
   if(/^link_[a-f0-9]{48}$/.test(payload)){
    const tokenHash=crypto.createHash('sha256').update(payload.slice(5)).digest('hex');
    let result;try{result=await rpc('link_consume',{token_hash:tokenHash,chat_id:chat});}catch{result={ok:false};}
    const response=result.ok?'Готово, Telegram подключён ♡\n\nОтветы о встрече будут приходить сюда. Можешь вернуться к своему подарку.':'Ссылка уже не работает. Открой свой аккаунт Emora и ещё раз нажми «Подключить Telegram».';
    await telegram('sendMessage',{chat_id:chat,text:response,reply_markup:keyboard()});return;
   }
   await telegram('sendMessage',{chat_id:chat,text:welcome,reply_markup:keyboard()});return;
  }
  await telegram('sendMessage',{chat_id:chat,text:command==='/help'?help:'Я помогу открыть Emora и подключить ответы о встрече. Выбери кнопку ниже ♡',reply_markup:keyboard()});
 }
 async function start(){
  if(!token||!origin||!base||!key||!secret){logger.error('EMORA Telegram: configuration incomplete');return;}
  try{
   const me=await telegram('getMe');username=me.username;
   const webhook=await telegram('getWebhookInfo');if(webhook.url)throw new Error('existing_webhook');
   await telegram('setMyName',{name:'Подарки с чувством'});
   displayName=(await telegram('getMyName')).name;
   try{
    const logo=new FormData();
    logo.set('photo',JSON.stringify({type:'static',photo:'attach://logo'}));
    logo.set('logo',new Blob([await readFile(new URL('./assets/emora-bot-logo.jpg',import.meta.url))],{type:'image/jpeg'}),'emora-bot-logo.jpg');
    await telegram('setMyProfilePhoto',{},logo);
    const currentPhoto=await telegram('getUserProfilePhotos',{user_id:me.id,limit:1});
    profilePhotoReady=currentPhoto.total_count>0;
   }catch{logger.error('EMORA Telegram avatar update unavailable');}
   await telegram('setMyDescription',{description:'Личный подарок для неё: день рождения, извинение, признание или предложение. Добавь ваши фото, музыку и слова от себя. Ответы о встрече — прямо сюда.'});
   await telegram('setMyShortDescription',{short_description:'Личные подарки и ответы о встрече ♡'});
   await telegram('setMyCommands',{commands:[{command:'start',description:'Открыть Emora'},{command:'help',description:'Как всё работает'}]});
   await telegram('setChatMenuButton',{menu_button:{type:'web_app',text:'Создать подарок',web_app:{url:origin+'/?miniapp=1'}}});
   const menu=await telegram('getChatMenuButton');
   miniAppReady=menu.type==='web_app'&&menu.web_app?.url===origin+'/?miniapp=1';
   let offset=Number((await rpc('offset_get')).offset)||0;
   ready=true;logger.log('EMORA Telegram ready @'+username);
   while(!stopped){
    try{
     const updates=await telegram('getUpdates',{offset,timeout:25,limit:30,allowed_updates:['message','callback_query']});
     for(const update of updates){await handleUpdate(update);offset=update.update_id+1;await rpc('offset_set',{offset});}
    }catch(e){logger.error('EMORA Telegram polling: '+(/telegram_\d+/.test(e.message)?e.message:'temporary_failure'));await new Promise(r=>{abort=setTimeout(r,5000);});}
   }
  }catch(e){ready=false;startupError=(e.cause?.code||e.name||'error');logger.error('EMORA Telegram startup: '+startupError);if(!stopped)abort=setTimeout(()=>void start(),5000);}
 }
 async function authenticated(req){
  const jwt=String(req.headers.authorization||'').match(/^Bearer (.{1,8192})$/)?.[1];if(!jwt)return null;
  const r=await fetcher(base+'/auth/v1/user',{headers:{apikey:key,Authorization:'Bearer '+jwt},signal:AbortSignal.timeout(12000)});
  const user=await r.json();return r.ok&&user.id?jwt:null;
 }
 async function connection(req,res,action){
  if(req.method!==(action==='connection_status'?'GET':'POST'))return json(res,405,{ok:false,error:'method'});
  if(action!=='connection_status'&&req.headers.origin!==origin)return json(res,403,{ok:false,error:'origin'});
  if(!ready)return json(res,503,{ok:false,error:'bot_unavailable'});
  try{
   const jwt=await authenticated(req);if(!jwt)return json(res,401,{ok:false,error:'login_required'});
   if(!permitted('user:'+crypto.createHash('sha256').update(jwt).digest('hex'),15))return json(res,429,{ok:false,error:'rate_limited'});
   if(action==='link_create'){
    const code=crypto.randomBytes(24).toString('hex');await rpc(action,{token_hash:crypto.createHash('sha256').update(code).digest('hex')},jwt);
    return json(res,200,{ok:true,url:'https://t.me/'+username+'?start=link_'+code});
   }
   return json(res,200,{ok:true,...await rpc(action,{},jwt)});
  }catch{return json(res,503,{ok:false,error:'connection_unavailable'});}
 }
 async function meeting(req,res){
  if(req.method!=='POST')return json(res,405,{ok:false,error:'method'});
  if(req.headers.origin!==origin)return json(res,403,{ok:false,error:'origin'});
  if(!ready)return json(res,503,{ok:false,error:'bot_not_configured'});
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return json(res,415,{ok:false,error:'content_type'});
  let input='',size=0;try{for await(const part of req){size+=part.length;if(size>2048)return json(res,413,{ok:false,error:'too_large'});input+=part.toString('utf8');}}catch{return json(res,400,{ok:false,error:'payload'});}
  let body;try{body=JSON.parse(input);}catch{return json(res,400,{ok:false,error:'json'});}
  const {slug,choice,date,time}=body||{};
  if(typeof slug!=='string'||!/^[a-z0-9-]{1,60}$/.test(slug)||!['restaurant','walk','coffee'].includes(choice)||typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||typeof time!=='string'||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))return json(res,422,{ok:false,error:'invalid_choice_or_time'});
  const t=Date.parse(date+'T00:00:00Z');const today=new Date(clock()+300*60000).toISOString().slice(0,10);
  if(!Number.isFinite(t)||new Date(t).toISOString().slice(0,10)!==date||date<today||date>new Date(clock()+300*60000+370*86400000).toISOString().slice(0,10))return json(res,422,{ok:false,error:'date_out_of_range'});
  if(!permitted('meeting:'+slug,3))return json(res,429,{ok:false,error:'rate_limited'});
  let claim;try{claim=await rpc('meeting_claim',{slug,choice,date,time});}catch{return json(res,503,{ok:false,error:'delivery_storage_unavailable'});}
  if(!claim.ok){if(claim.error==='already_submitted'&&claim.status==='sent')return json(res,200,{ok:true,delivery:'sent',meeting:{choice,date,time}});return json(res,claim.error==='already_submitted'?409:503,claim);}
  const places={restaurant:'Ресторан',walk:'Прогулка',coffee:'Кофе'};
  const formatted=date.split('-').reverse().join('.');
  const text='Она выбрала время для вас ♡\n\nОт: '+claim.recipient+'\nМесто: '+places[choice]+'\nДата: '+formatted+'\nВремя: '+time+' (Ташкент)';
  let sent,status='sent';
  try{sent=await telegram('sendMessage',{chat_id:claim.chat_id,text,reply_markup:{inline_keyboard:[[{text:'Открыть подарок',url:origin+'/s/'+slug}]]}});}catch(e){status=e.definite?'failed':'unknown';}
  try{await rpc('meeting_complete',{event_id:claim.event_id,status,message_id:sent?.message_id||null});}catch{logger.error('EMORA meeting delivery state could not be saved');}
  return status==='sent'?json(res,200,{ok:true,delivery:'sent',meeting:{choice,date,time}}):json(res,502,{ok:false,error:'telegram_delivery_failed'});
 }
 return {start,handleUpdate,meeting,connection,get status(){return {ready,username,displayName,profilePhotoReady,miniAppReady,startupError};},stop(){stopped=true;if(abort)clearTimeout(abort);}};
}
