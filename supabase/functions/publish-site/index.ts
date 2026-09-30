import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const appUrl=Deno.env.get("EMORA_PUBLIC_URL")||"https://emora-reborn-v1-production.up.railway.app";

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"method_not_allowed"},405);
  try{
    const token=(req.headers.get("Authorization")||"").replace(/^Bearer\s+/i,"");
    if(!token)return json({error:"unauthorized"},401);
    const url=Deno.env.get("SUPABASE_URL")!;
    const anon=Deno.env.get("SUPABASE_ANON_KEY")!;
    const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authClient=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:userData,error:userError}=await authClient.auth.getUser(token);
    if(userError||!userData.user)return json({error:"unauthorized"},401);
    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const body=await req.json().catch(()=>null) as {siteId?:string}|null;
    const siteId=String(body?.siteId||"");if(!siteId)return json({error:"invalid_request"},400);

    const {data:site,error:siteError}=await admin.from("sites").select("id,owner_id,slug,status,edition,content,published_at").eq("id",siteId).single();
    if(siteError||!site)return json({error:"site_not_found"},404);
    if(site.owner_id!==userData.user.id)return json({error:"forbidden"},403);
    if(site.status==="published")return json({siteId:site.id,slug:site.slug,status:"published",publishedAt:site.published_at,url:`${appUrl}/?site=${encodeURIComponent(site.slug)}`,reused:true});
    if(site.status!=="draft")return json({error:"invalid_site_state"},409);

    const {data:paid,error:paidError}=await admin.from("orders").select("id,status,provider,amount_uzs,paid_at,plan_code").eq("site_id",siteId).eq("owner_id",userData.user.id).eq("status","paid").order("paid_at",{ascending:false}).limit(1).maybeSingle();
    if(paidError)throw paidError;
    if(!paid)return json({error:"payment_required"},402);

    const {data:media,error:mediaError}=await admin.from("site_media").select("id,kind,bucket_id,object_path,sort_order").eq("site_id",siteId).order("sort_order");
    if(mediaError)throw mediaError;
    const mediaKinds=new Set((media||[]).map((x:any)=>String(x.kind)));
    const content=(site.content||{}) as Record<string,unknown>;
    const missing:string[]=[];
    if(!mediaKinds.has("photo"))missing.push("photo");
    if(!mediaKinds.has("video"))missing.push("video");
    if(!mediaKinds.has("music")&&!String(content.musicPreset||"").trim())missing.push("music");
    if(missing.length)return json({error:"media_incomplete",missing},422);

    for(const row of media||[]){
      if(row.bucket_id==="emora-published")continue;
      if(row.bucket_id!=="emora-drafts")return json({error:"invalid_media_bucket",mediaId:row.id},409);
      const {data:blob,error:downloadError}=await admin.storage.from("emora-drafts").download(row.object_path);
      if(downloadError||!blob)throw downloadError||new Error("media_download_failed");
      const fileName=row.object_path.split("/").pop()||`${row.kind}-${row.id}`;
      const target=`${site.owner_id}/${site.id}/${row.kind}/${fileName}`;
      const {error:uploadError}=await admin.storage.from("emora-published").upload(target,blob,{contentType:blob.type||undefined,cacheControl:"31536000",upsert:true});
      if(uploadError)throw uploadError;
      const {error:updateError}=await admin.from("site_media").update({bucket_id:"emora-published",object_path:target}).eq("id",row.id);if(updateError)throw updateError;
      const {error:removeError}=await admin.storage.from("emora-drafts").remove([row.object_path]);if(removeError)console.warn("draft_cleanup_failed",row.object_path,removeError.message);
    }

    const publishedAt=new Date().toISOString();
    const {data:published,error:publishError}=await admin.from("sites").update({status:"published",published_at:publishedAt}).eq("id",site.id).eq("status","draft").select("id").maybeSingle();
    if(publishError)throw publishError;
    if(!published){
      const {data:current}=await admin.from("sites").select("status,published_at").eq("id",site.id).single();
      if(current?.status!=="published")return json({error:"publish_conflict"},409);
      return json({siteId:site.id,slug:site.slug,status:"published",publishedAt:current.published_at,url:`${appUrl}/?site=${encodeURIComponent(site.slug)}`,orderId:paid.id,reused:true});
    }
    return json({siteId:site.id,slug:site.slug,status:"published",publishedAt,url:`${appUrl}/?site=${encodeURIComponent(site.slug)}`,orderId:paid.id,reused:false});
  }catch(error){console.error(error);return json({error:"internal_error"},500)}
});
