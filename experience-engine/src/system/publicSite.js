import { requireSupabase } from './supabaseClient.js';

export async function loadPublishedSite(slug){
  const client=requireSupabase();
  const safeSlug=String(slug||'').trim().slice(0,80);
  if(!safeSlug)throw new Error('Link noto‘g‘ri.');
  const {data:site,error}=await client.from('sites').select('id,slug,category,edition,title,content,status,published_at').eq('slug',safeSlug).eq('status','published').single();
  if(error||!site)throw new Error('Bu EMORA link topilmadi yoki hali publish qilinmagan.');
  const {data:rows,error:mediaError}=await client.from('site_media').select('kind,bucket_id,object_path,sort_order').eq('site_id',site.id).eq('bucket_id','emora-published').order('sort_order');
  if(mediaError)throw mediaError;
  const media={photos:[],portrait:null,video:null,music:null};
  for(const row of rows||[]){
    const {data}=client.storage.from('emora-published').getPublicUrl(row.object_path);
    const url=data.publicUrl;if(!url)continue;
    if(row.kind==='photo')media.photos.push(url);else media[row.kind]=url;
  }
  return {site,content:{...(site.content||{}),templateId:site.edition,title:site.title},media};
}
