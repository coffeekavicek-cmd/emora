import { requireSupabase } from './supabaseClient.js';
import { splitPublishPayload } from './contentModel.js';

function cleanSlugPart(value=''){
  return String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,22)||'emora';
}
function safeName(value='file'){
  const raw=String(value).toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'');
  return (raw||'file').slice(-80);
}
function categoryFor(templateId='love-pearl'){
  if(templateId.startsWith('wedding-'))return 'wedding';
  if(templateId.startsWith('birthday-'))return 'birthday';
  if(templateId.startsWith('apology-'))return 'apology';
  if(templateId.startsWith('proposal-'))return 'proposal';
  return 'love';
}

const ERROR_COPY={
  unauthorized:'Sessiya tugagan. Email orqali qayta kiring.',
  forbidden:'Bu loyihaga kirish huquqi yo‘q.',
  site_not_found:'Loyiha topilmadi.',
  plan_not_found:'Tarif topilmadi yoki vaqtincha o‘chirilgan.',
  already_published:'Bu loyiha allaqachon publish qilingan.',
  already_paid:'Bu loyiha uchun to‘lov allaqachon tasdiqlangan.',
  payment_in_progress:'To‘lov jarayoni allaqachon boshlangan. Avval shu tranzaksiyani yakunlang.',
  checkout_conflict:'Checkout holati o‘zgardi. Loyihani qayta ochib urinib ko‘ring.',
  order_amount_stale:'Tarif narxi yangilangan. Checkout’ni qaytadan boshlang.',
  invalid_site_state:'Loyiha holati hozir checkout uchun mos emas.',
  payment_required:'Publish uchun tasdiqlangan to‘lov kerak.',
  publish_conflict:'Publish bir vaqtda boshqa so‘rov bilan yakunlangan. Sahifani qayta oching.',
  invalid_media_bucket:'Media holati noto‘g‘ri. Draftni qayta saqlab ko‘ring.',
  internal_error:'Serverda xatolik yuz berdi. Qayta urinib ko‘ring.',
};

async function functionErrorMessage(error,{provider=null,fallback='Server xatosi'}={}){
  let payload=null;
  try{
    const response=error?.context;
    if(response?.clone)payload=await response.clone().json();
    else if(response?.json)payload=await response.json();
  }catch{}
  const code=payload?.error;
  if(code==='merchant_not_configured')return `${String(provider||payload?.provider||'payment').toUpperCase()} merchant credentiallari hali ulanmagan.`;
  if(code==='media_incomplete'){
    const label={photo:'rasm',video:'video',music:'musiqa'};
    const missing=(payload?.missing||[]).map(x=>label[x]||x).join(', ');
    return `Davom etish uchun media yetishmayapti${missing?`: ${missing}`:''}.`;
  }
  return ERROR_COPY[code]||error?.message||fallback;
}

export async function getCloudSession(){
  const client=requireSupabase();
  const {data,error}=await client.auth.getSession();
  if(error)throw error;
  return data.session||null;
}

export function onCloudAuthChange(callback){
  const client=requireSupabase();
  const {data}=client.auth.onAuthStateChange((_event,session)=>callback(session));
  return ()=>data.subscription.unsubscribe();
}

export async function sendMagicLink(email){
  const client=requireSupabase();
  const normalized=String(email||'').trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(normalized))throw new Error('Email manzilini to‘g‘ri kiriting.');
  const {error}=await client.auth.signInWithOtp({email:normalized,options:{emailRedirectTo:location.href,shouldCreateUser:true}});
  if(error)throw error;
  return normalized;
}

export async function signOutCloud(){
  const client=requireSupabase();
  const {error}=await client.auth.signOut();
  if(error)throw error;
}

export async function loadPlans(){
  const client=requireSupabase();
  const {data,error}=await client.from('plans').select('code,name,price_uzs').eq('active',true).order('price_uzs');
  if(error)throw error;
  return data||[];
}

async function ensureSession(){
  const session=await getCloudSession();
  if(!session?.user?.id)throw new Error('Avval email orqali kiring.');
  return session;
}

function makeSlug(content,templateId){
  const category=categoryFor(templateId);
  const who=cleanSlugPart(content.recipient||content.title||'story');
  const suffix=crypto.randomUUID().replace(/-/g,'').slice(0,7);
  return `${category}-${who}-${suffix}`.slice(0,48).replace(/-+$/,'');
}

export async function saveDraft({siteId=null,templateId,content}){
  const client=requireSupabase();
  const session=await ensureSession();
  const {publicContent}=splitPublishPayload({...content,templateId});
  const payload={owner_id:session.user.id,category:categoryFor(templateId),edition:templateId,title:String(content.title||content.recipient||'EMORA').slice(0,160),content:{...publicContent,templateId},status:'draft'};
  const query=siteId
    ? client.from('sites').update(payload).eq('id',siteId).select('id,slug,status,updated_at').single()
    : client.from('sites').insert({...payload,slug:makeSlug(content,templateId)}).select('id,slug,status,updated_at').single();
  const {data,error}=await query;
  if(error)throw error;
  return data;
}

async function replaceKind({siteId,ownerId,kind,files}){
  const client=requireSupabase();
  if(!files.length)return [];
  const {data:oldRows,error:oldError}=await client.from('site_media').select('id,bucket_id,object_path').eq('site_id',siteId).eq('kind',kind);
  if(oldError)throw oldError;
  const oldDraftPaths=(oldRows||[]).filter(x=>x.bucket_id==='emora-drafts').map(x=>x.object_path);
  if(oldDraftPaths.length){const {error}=await client.storage.from('emora-drafts').remove(oldDraftPaths);if(error)throw error}
  if((oldRows||[]).length){const {error}=await client.from('site_media').delete().eq('site_id',siteId).eq('kind',kind);if(error)throw error}
  const stamp=Date.now();const created=[];
  for(let i=0;i<files.length;i++){
    const file=files[i];if(!(file instanceof File))continue;
    const path=`${ownerId}/${siteId}/${kind}/${stamp}-${i}-${safeName(file.name)}`;
    const {error:uploadError}=await client.storage.from('emora-drafts').upload(path,file,{cacheControl:'3600',contentType:file.type||undefined,upsert:false});if(uploadError)throw uploadError;
    const {data:row,error:rowError}=await client.from('site_media').insert({site_id:siteId,owner_id:ownerId,kind,bucket_id:'emora-drafts',object_path:path,sort_order:i}).select('id,kind,bucket_id,object_path,sort_order').single();if(rowError)throw rowError;
    created.push(row);
  }
  return created;
}

export async function saveDraftMedia({siteId,media}){
  const session=await ensureSession();const jobs=[];
  const photos=(Array.isArray(media.photos)?media.photos:[]).filter(x=>x instanceof File).slice(0,10);
  if(photos.length)jobs.push(replaceKind({siteId,ownerId:session.user.id,kind:'photo',files:photos}));
  if(media.portrait instanceof File)jobs.push(replaceKind({siteId,ownerId:session.user.id,kind:'portrait',files:[media.portrait]}));
  if(media.video instanceof File)jobs.push(replaceKind({siteId,ownerId:session.user.id,kind:'video',files:[media.video]}));
  if(media.music instanceof File)jobs.push(replaceKind({siteId,ownerId:session.user.id,kind:'music',files:[media.music]}));
  await Promise.all(jobs);
  return loadDraftMedia(siteId);
}

export async function loadDraftMedia(siteId){
  const client=requireSupabase();await ensureSession();
  const {data,error}=await client.from('site_media').select('kind,bucket_id,object_path,sort_order').eq('site_id',siteId).order('sort_order');if(error)throw error;
  const rows=data||[],draft=rows.filter(x=>x.bucket_id==='emora-drafts'),published=rows.filter(x=>x.bucket_id==='emora-published'),urlByPath=new Map();
  if(draft.length){
    const paths=[...new Set(draft.map(x=>x.object_path))];
    const {data:signed,error:signedError}=await client.storage.from('emora-drafts').createSignedUrls(paths,60*60*6);if(signedError)throw signedError;
    (signed||[]).forEach((x,i)=>urlByPath.set(paths[i],x.signedUrl));
  }
  for(const row of published){const {data:pub}=client.storage.from('emora-published').getPublicUrl(row.object_path);urlByPath.set(row.object_path,pub.publicUrl)}
  const media={photos:[],portrait:null,video:null,music:null};
  for(const row of rows){const url=urlByPath.get(row.object_path);if(!url)continue;if(row.kind==='photo')media.photos.push(url);else media[row.kind]=url}
  return media;
}

export async function loadDraft(siteId){
  const client=requireSupabase();await ensureSession();
  const {data,error}=await client.from('sites').select('id,slug,category,edition,title,content,status,updated_at,published_at').eq('id',siteId).single();if(error)throw error;
  const media=await loadDraftMedia(siteId);return {site:data,media};
}

export async function listOrders(siteId){
  const client=requireSupabase();await ensureSession();
  const {data,error}=await client.from('orders').select('id,site_id,plan_code,amount_uzs,currency,provider,status,created_at,paid_at').eq('site_id',siteId).order('created_at',{ascending:false});if(error)throw error;
  return data||[];
}

export async function beginCheckout({siteId,planCode,provider}){
  const client=requireSupabase();await ensureSession();
  if(!siteId)throw new Error('Avval draftni saqlang.');
  if(!['click','payme'].includes(provider))throw new Error('Payment provider noto‘g‘ri.');
  const {data,error}=await client.functions.invoke('checkout-create',{body:{siteId,planCode,provider}});
  if(error)throw new Error(await functionErrorMessage(error,{provider,fallback:'Checkout xatosi'}));
  if(!data?.checkoutUrl)throw new Error('Payment URL olinmadi.');
  return data;
}

export async function publishPaidSite(siteId){
  const client=requireSupabase();await ensureSession();
  const {data,error}=await client.functions.invoke('publish-site',{body:{siteId}});
  if(error)throw new Error(await functionErrorMessage(error,{fallback:'Publish xatosi'}));
  return data;
}
