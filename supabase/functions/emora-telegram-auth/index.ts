import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const reply=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
Deno.serve(async(req:Request)=>{
 if(req.method!=='POST')return reply(405,{ok:false});
 const secret=req.headers.get('x-emora-bridge')||'';
 if(!/^[a-f0-9]{64}$/.test(secret))return reply(403,{ok:false});
 const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
 try{
  // The server-only bridge credential is verified by the guarded database RPC.
  const guardClient=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
  const checked=await guardClient.rpc('emora_bot_bridge',{p_secret:secret,p_action:'offset_get',p_data:{}});
  if(checked.error)return reply(403,{ok:false});
  const text=await req.text();if(text.length>8192)return reply(413,{ok:false});
  const {telegram}=JSON.parse(text);
  if(!telegram||!Number.isSafeInteger(telegram.id)||telegram.id<=0)return reply(422,{ok:false});
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(secret+':telegram:'+telegram.id));
  const suffix=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,32);
  const email='tg_'+telegram.id+'_'+suffix+'@telegram.emora.invalid';
  const created=await admin.auth.admin.createUser({email,password:crypto.randomUUID()+crypto.randomUUID(),email_confirm:true,app_metadata:{auth_provider:'telegram',telegram_user_id:String(telegram.id)},user_metadata:{display_name:String(telegram.first_name||'').slice(0,80)}});
  if(created.error&&!['email_exists','user_already_exists'].includes(created.error.code||''))return reply(503,{ok:false,error:'account_unavailable'});
  // generateLink only creates credentials; no email is sent or requested from the user.
  const link=await admin.auth.admin.generateLink({type:'magiclink',email});
  if(link.error||!link.data.user||!link.data.properties.hashed_token)return reply(503,{ok:false,error:'session_unavailable'});
  if(link.data.user.app_metadata?.telegram_user_id!==String(telegram.id))return reply(403,{ok:false});
  const client=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_ANON_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
  const verified=await client.auth.verifyOtp({token_hash:link.data.properties.hashed_token,type:'email'});
  if(verified.error||!verified.data.session)return reply(503,{ok:false,error:'session_unavailable'});
  const {access_token,refresh_token}=verified.data.session;
  return reply(200,{ok:true,access_token,refresh_token});
 }catch{return reply(503,{ok:false,error:'session_unavailable'});}
});
