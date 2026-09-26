/* EMORA private-draft → published-media flow. Draft files are owner-only until publication.
   Public URLs are stable (not expiring preview signatures). */
export const MEDIA_FIELDS={photo1:{types:['image/jpeg','image/png','image/webp'],max:8*1024*1024,ext:{'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}},photo2:{types:['image/jpeg','image/png','image/webp'],max:8*1024*1024,ext:{'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}},photo3:{types:['image/jpeg','image/png','image/webp'],max:8*1024*1024,ext:{'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}},musicUrl:{types:['audio/mpeg','audio/mp4'],max:15*1024*1024,ext:{'audio/mpeg':'mp3','audio/mp4':'m4a'}},videoUrl:{types:['video/mp4'],max:40*1024*1024,ext:{'video/mp4':'mp4'}}};
const privateBucket='emora-media',publicBucket='emora-published';
function secureId(v){return typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f-]{27,40}$/i.test(v)}
function entry(v){return v&&typeof v==='object'&&typeof v.path==='string'&&typeof v.mime==='string'}
export function validateFile(file,field){
 const rule=MEDIA_FIELDS[field];
 if(!rule)throw Error('Bu turdagi fayl qo‘llanmaydi.');
 if(!file||!rule.types.includes(file.type))throw Error('Fayl formati mos emas: JPEG, PNG, WebP, MP3, M4A yoki MP4 tanlang.');
 if(!file.size||file.size>rule.max)throw Error(field.startsWith('photo')?'Surat hajmi 8 MB dan oshmasin.':field==='videoUrl'?'Video hajmi 40 MB dan oshmasin.':'Musiqa hajmi 15 MB dan oshmasin.');
 return rule.ext[file.type];
}
export async function uploadPrivate(supabase,userId,field,file){
 const ext=validateFile(file,field);
 if(!secureId(userId))throw Error('Faylni yuklash uchun qayta kiring.');
 const id=globalThis.crypto?.randomUUID?.();
 if(!id)throw Error('Brauzer xavfsiz fayl identifikatorini yarata olmadi.');
 const path=userId+'/'+id+'.'+ext;
 const upload=await supabase.storage.from(privateBucket).upload(path,file,{contentType:file.type,upsert:false,cacheControl:'3600'});
 if(upload.error)throw Error(upload.error.message);
 const signed=await supabase.storage.from(privateBucket).createSignedUrl(path,60*60);
 if(signed.error||!signed.data?.signedUrl)throw Error('Yuklangan faylga vaqtinchalik preview havolasi yaratilmadi.');
 return {record:{path,mime:file.type,size:file.size,filename:String(file.name||'media').slice(0,160)},url:signed.data.signedUrl};
}
export async function refreshPrivate(supabase,userId,records){
 if(!secureId(userId))return {};
 const output={};
 for(const [field,rec] of Object.entries(records||{})){
  if(!MEDIA_FIELDS[field]||!entry(rec)||!rec.path.startsWith(userId+'/'))continue;
  const {data,error}=await supabase.storage.from(privateBucket).createSignedUrl(rec.path,60*60);
  if(!error&&data?.signedUrl)output[field]=data.signedUrl;
 }
 return output;
}
export async function publishPrivate(supabase,userId,projectId,content,records){
 if(!secureId(userId)||!secureId(projectId))throw Error('Nashr qilish uchun haqiqiy loyiha va akkaunt kerak.');
 const published={...content,photos:Array.isArray(content.photos)?[...content.photos]:[],music:content.music||'',video:content.video||''};
 delete published.media;
 const result={};
 for(const [field,rec] of Object.entries(records||{})){
  if(!MEDIA_FIELDS[field]||!entry(rec))continue;
  if(!rec.path.startsWith(userId+'/')||!MEDIA_FIELDS[field].types.includes(rec.mime))throw Error('Media egasi yoki formati mos emas.');
  const basename=rec.path.slice(userId.length+1);
  if(!/^[0-9a-f-]{36}\.(jpg|png|webp|mp3|m4a|mp4)$/i.test(basename))throw Error('Noto‘g‘ri media manzili.');
  const source=await supabase.storage.from(privateBucket).download(rec.path);
  if(source.error||!source.data)throw Error('Draft mediaga kirish imkoni yo‘q: '+(source.error?.message||'fayl topilmadi'));
  const dest=userId+'/'+projectId+'/'+basename;
  const target=await supabase.storage.from(publicBucket).upload(dest,source.data,{contentType:rec.mime,cacheControl:'3600',upsert:true});
  if(target.error)throw Error('Media nashri bajarilmadi: '+target.error.message);
  const url=supabase.storage.from(publicBucket).getPublicUrl(dest)?.data?.publicUrl;
  if(typeof url!=='string'||!url.startsWith('https://'))throw Error('Doimiy media havolasini olishda xato.');
  result[field]=url;
  if(field.startsWith('photo'))published.photos[Number(field.slice(-1))-1]=url;
  else if(field==='videoUrl')published.video=url;
  else if(field==='musicUrl')published.music=url;
 }
 return {publicContent:published,publicUrls:result};
}
