import crypto from 'node:crypto';
export function validateTelegramInitData(raw,token,now=Date.now()){
 if(typeof raw!=='string'||raw.length>8192||!token)return null;
 const params=new URLSearchParams(raw),seen=new Set();for(const [key]of params){if(seen.has(key))return null;seen.add(key);}
 const hash=params.get('hash')||'';if(!/^[a-f0-9]{64}$/i.test(hash))return null;
 params.delete('hash');const check=[...params.entries()].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>k+'='+v).join('\n');
 const secret=crypto.createHmac('sha256','WebAppData').update(token).digest();
 const expected=crypto.createHmac('sha256',secret).update(check).digest();if(!crypto.timingSafeEqual(expected,Buffer.from(hash,'hex')))return null;
 const date=Number(params.get('auth_date'));if(!Number.isInteger(date)||date>now/1000+30||now/1000-date>3600)return null;
 try{const user=JSON.parse(params.get('user')||'null');if(!user||!Number.isSafeInteger(user.id)||user.id<=0||user.is_bot)return null;return {id:user.id,first_name:String(user.first_name||'').slice(0,80)};}catch{return null;}
}
export function createTelegramAuthHandler({env=process.env,fetcher=fetch,clock=Date.now}={}){
 const pending=new Map(),attempts=new Map();
 const answer=(res,status,data)=>{res.writeHead(status,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify(data));};
 async function bridge(action,data,jwt){const h={apikey:env.EMORA_SUPABASE_PUBLISHABLE_KEY,'content-type':'application/json'};if(jwt)h.Authorization='Bearer '+jwt;
  const r=await fetcher(env.EMORA_SUPABASE_URL+'/rest/v1/rpc/emora_bot_bridge',{method:'POST',headers:h,body:JSON.stringify({p_secret:env.EMORA_BOT_BRIDGE_SECRET,p_action:action,p_data:data}),signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('bridge');return r.json();
 }
 return async function(req,res){
  if(req.method!=='POST')return answer(res,405,{ok:false,error:'method'});
  if(req.headers.origin!==env.EMORA_PUBLIC_ORIGIN)return answer(res,403,{ok:false,error:'origin'});
  if(!String(req.headers['content-type']||'').startsWith('application/json'))return answer(res,415,{ok:false,error:'content_type'});
  let text='',bytes=0;try{for await(const chunk of req){bytes+=chunk.length;if(bytes>10000)return answer(res,413,{ok:false});text+=chunk.toString('utf8');}}catch{return answer(res,400,{ok:false});}
  let data;try{data=JSON.parse(text);}catch{return answer(res,400,{ok:false});}
  const user=validateTelegramInitData(data.initData,env.EMORA_TELEGRAM_BOT_TOKEN,clock());if(!user)return answer(res,401,{ok:false,error:'invalid_telegram_session'});
  const now=clock();for(const [k,v]of attempts)if(now-v.at>60000)attempts.delete(k);const count=attempts.get(user.id)||{at:now,n:0};count.n++;attempts.set(user.id,count);if(count.n>10)return answer(res,429,{ok:false});
  const fingerprint=crypto.createHash('sha256').update(data.initData).digest('hex');
  try{
   if(!pending.has(fingerprint))pending.set(fingerprint,(async()=>{
    const r=await fetcher(env.EMORA_SUPABASE_URL+'/functions/v1/emora-telegram-auth',{method:'POST',headers:{apikey:env.EMORA_SUPABASE_PUBLISHABLE_KEY,'content-type':'application/json','x-emora-bridge':env.EMORA_BOT_BRIDGE_SECRET},body:JSON.stringify({telegram:user}),signal:AbortSignal.timeout(20000)});
    const session=await r.json();if(!r.ok||!session.ok||!session.access_token||!session.refresh_token)throw Error('auth');
    let notifications=false;
    try{const hash=crypto.createHash('sha256').update(crypto.randomBytes(24)).digest('hex');await bridge('link_create',{token_hash:hash},session.access_token);const connected=await bridge('link_consume',{token_hash:hash,chat_id:String(user.id)});notifications=connected.ok===true;}catch{}
    return {...session,notifications};
   })());
   const session=await pending.get(fingerprint);return answer(res,200,session);
  }catch{return answer(res,503,{ok:false,error:'telegram_login_unavailable'});}
  finally{pending.delete(fingerprint);}
 };
}
