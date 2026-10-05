import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const json=(body:unknown,status=200,origin='*')=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','access-control-allow-origin':origin,'access-control-allow-headers':'authorization, apikey, content-type','access-control-allow-methods':'POST, OPTIONS','cache-control':'no-store'}});
const secretKey=()=>{const raw=Deno.env.get('SUPABASE_SECRET_KEYS');if(raw){try{const o=JSON.parse(raw);if(o.default)return o.default;const first=Object.values(o)[0];if(typeof first==='string')return first}catch{}}return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||''};
const cleanSlug=(v:unknown)=>String(v||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,56);
const allowedMimes=new Set(['image/jpeg','image/png','image/webp','audio/mpeg','audio/mp4','video/mp4']);
const mediaFields=new Set(['photo1','photo2','photo3','musicUrl','videoUrl']);
const secureId=(v:string)=>/^[0-9a-f]{8}-[0-9a-f-]{27,40}$/i.test(v);

Deno.serve(async(req)=>{
 const origin=req.headers.get('origin')||'*';
 if(req.method==='OPTIONS')return json({ok:true},200,origin);
 if(req.method!=='POST')return json({error:'method_not_allowed'},405,origin);
 const url=Deno.env.get('SUPABASE_URL')||'',sk=secretKey();if(!url||!sk)return json({error:'server_not_configured'},503,origin);
 const admin=createClient(url,sk,{auth:{persistSession:false,autoRefreshToken:false}});
 const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
 const {data:{user},error:userErr}=await admin.auth.getUser(token);if(userErr||!user)return json({error:'unauthorized'},401,origin);
 let body:any;try{body=await req.json()}catch{return json({error:'invalid_json'},400,origin)}
 const projectId=String(body?.project_id||''),provider=String(body?.provider||''),planSlug=String(body?.plan_slug||'template'),publishSlug=cleanSlug(body?.publish_slug);
 if(!secureId(projectId)||!['click','payme'].includes(provider)||!/^[a-z0-9][a-z0-9-]{3,55}$/.test(publishSlug))return json({error:'invalid_checkout'},400,origin);
 const [{data:plan,error:planErr},{data:project,error:projectErr}]=await Promise.all([
  admin.from('payment_plans').select('slug,name,amount_uzs,is_active').eq('slug',planSlug).maybeSingle(),
  admin.from('projects').select('id,owner_id,template_slug,content,slug').eq('id',projectId).eq('owner_id',user.id).maybeSingle()
 ]);
 if(planErr||!plan||!plan.is_active)return json({error:'plan_unavailable'},409,origin);if(projectErr||!project)return json({error:'project_not_found'},404,origin);
 const {data:slugOwner}=await admin.from('published_sites').select('project_id').eq('slug',publishSlug).maybeSingle();if(slugOwner&&slugOwner.project_id!==projectId)return json({error:'slug_taken'},409,origin);
 const content=structuredClone(project.content||{}),records=(content.media&&typeof content.media==='object')?content.media:{};delete content.media;
 if(Array.isArray(content.photos))content.photos=content.photos.map((v:any)=>String(v||'').includes('/object/sign/emora-media/')?'':v);if(String(content.music||'').includes('/object/sign/emora-media/'))content.music='';if(String(content.video||'').includes('/object/sign/emora-media/'))content.video='';
 for(const [field,rec] of Object.entries(records as Record<string,any>)){
  if(!mediaFields.has(field)||!rec||typeof rec.path!=='string'||typeof rec.mime!=='string')continue;if(!rec.path.startsWith(user.id+'/')||!allowedMimes.has(rec.mime))return json({error:'invalid_private_media'},400,origin);const basename=rec.path.slice(user.id.length+1);if(!/^[0-9a-f-]{36}\.(jpg|png|webp|mp3|m4a|mp4)$/i.test(basename))return json({error:'invalid_private_media_path'},400,origin);
  const dl=await admin.storage.from('emora-media').download(rec.path);if(dl.error||!dl.data)return json({error:'private_media_unavailable',detail:dl.error?.message},409,origin);const dest=user.id+'/'+projectId+'/'+basename;const up=await admin.storage.from('emora-published').upload(dest,dl.data,{contentType:rec.mime,cacheControl:'3600',upsert:true});if(up.error)return json({error:'media_publish_failed',detail:up.error.message},500,origin);const pub=admin.storage.from('emora-published').getPublicUrl(dest).data.publicUrl;
  if(field.startsWith('photo')){if(!Array.isArray(content.photos))content.photos=[];content.photos[Number(field.slice(-1))-1]=pub}else if(field==='videoUrl')content.video=pub;else if(field==='musicUrl')content.music=pub;
 }
 const returnBase=(origin!=='*'&&/^https?:\/\//i.test(origin))?origin:(Deno.env.get('EMORA_PUBLIC_ORIGIN')||'');
 const {data:paid}=await admin.from('payment_orders').select('id,provider,plan_slug').eq('project_id',projectId).eq('owner_id',user.id).eq('status','paid').maybeSingle();
 if(paid){await admin.from('payment_orders').update({publish_slug:publishSlug,template_slug:project.template_slug,public_content:content,updated_at:new Date().toISOString()}).eq('id',paid.id);const now=new Date().toISOString();const {error:pubErr}=await admin.from('published_sites').upsert({project_id:projectId,slug:publishSlug,template_slug:project.template_slug,public_content:content,is_active:true,published_at:now,updated_at:now},{onConflict:'project_id'});if(pubErr)return json({error:'republish_failed',detail:pubErr.message},500,origin);await admin.from('projects').update({status:'published',slug:publishSlug,published_at:now,updated_at:now}).eq('id',projectId);await admin.from('payment_events').insert({order_id:paid.id,provider:paid.provider,event_type:'entitled_republish',payload:{publish_slug:publishSlug}});return json({ok:true,already_paid:true,order_id:paid.id,public_url:(returnBase||'')+'/s/'+publishSlug},200,origin)}
 const need=provider==='payme'?['PAYME_MERCHANT_ID']:['CLICK_SERVICE_ID','CLICK_MERCHANT_ID'];const missing=need.filter(k=>!Deno.env.get(k));if(missing.length)return json({error:'provider_not_configured',provider,missing},503,origin);
 await admin.from('payment_orders').update({status:'expired',updated_at:new Date().toISOString()}).eq('project_id',projectId).eq('owner_id',user.id).eq('status','pending');const amountUzs=Number(plan.amount_uzs),amountTiyin=amountUzs*100;
 const {data:order,error:orderErr}=await admin.from('payment_orders').insert({owner_id:user.id,project_id:projectId,provider,plan_slug:plan.slug,amount_uzs:amountUzs,amount_tiyin:amountTiyin,publish_slug:publishSlug,template_slug:project.template_slug,public_content:content,status:'pending'}).select('id,provider,amount_uzs,amount_tiyin,publish_slug,expires_at').single();if(orderErr||!order)return json({error:'order_create_failed',detail:orderErr?.message},500,origin);
 const callback=returnBase?returnBase+'/?payment_return='+encodeURIComponent(order.id):'';let paymentUrl='';if(provider==='payme'){const merchant=Deno.env.get('PAYME_MERCHANT_ID')!;const raw=`m=${merchant};ac.order_id=${order.id};a=${amountTiyin};l=uz${callback?`;c=${callback};ct=1500`:''}`;paymentUrl='https://checkout.paycom.uz/'+btoa(raw)}else{const u=new URL('https://my.click.uz/services/pay');u.searchParams.set('service_id',Deno.env.get('CLICK_SERVICE_ID')!);u.searchParams.set('merchant_id',Deno.env.get('CLICK_MERCHANT_ID')!);u.searchParams.set('amount',String(amountUzs));u.searchParams.set('transaction_param',order.id);if(callback)u.searchParams.set('return_url',callback);paymentUrl=u.toString()}
 await admin.from('payment_events').insert({order_id:order.id,provider,event_type:'checkout_created',payload:{plan_slug:plan.slug,amount_uzs:amountUzs}});return json({ok:true,order_id:order.id,provider,plan:{slug:plan.slug,name:plan.name,amount_uzs:amountUzs},payment_url:paymentUrl,expires_at:order.expires_at},200,origin);
});
