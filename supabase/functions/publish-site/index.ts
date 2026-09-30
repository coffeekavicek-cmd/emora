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

    const {data:site,error:siteError}=await admin.from("sites").select("id,owner_id,slug,status,edition").eq("id",siteId).single();
    if(siteError||!site)return json({error:"site_not_found"},404);
    if(site.owner_id!==userData.user.id)return json({error:"forbidden"},403);
    const {data:paid}=await admin.from("orders").select("id,status,provider,amount_uzs,paid_at").eq("site_id",siteId).eq("owner_id",userData.user.id).eq("status","paid").order("paid_at",{ascending:false}).limit(1).maybeSingle();
    if(!paid)return json({error:"payment_required"},402);

    const {data:media,error:mediaError}=await admin.from("site_media").select("id,kind,bucket_id,object_path,sort_order").eq("site_id",siteId).order("sort_order");
    if(mediaError)throw mediaError;
    for(const row of media||[]){
      if(row.bucket_id==="emora-published")continue;
      if(row.bucket_id!=="emora-drafts")continue;
      const {data:blob,error:downloadError}=await admin.storage.from("emora-drafts").download(row.object_path);
      if(downloadError||!blob)throw downloadError||new Error("media_download_failed");
      const fileName=row.object_path.split("/").pop()||`${row.kind}-${row.id}`;
      const target=`${site.owner_id}/${site.id}/${row.kind}/${fileName}`;
      const {error:uploadError}=await admin.storage.from("emora-published").upload(target,blob,{contentType:blob.type||undefined,cacheControl:"31536000",upsert:true});
      if(uploadError)throw uploadError;
      const {error:updateError}=await admin.from("site_media").update({bucket_id:"emora-published",object_path:target}).eq("id",row.id);if(updateError)throw updateError;
      await admin.storage.from("emora-drafts").remove([row.object_path]);
    }
    const publishedAt=new Date().toISOString();
    const {error:publishError}=await admin.from("sites").update({status:"published",published_at:publishedAt}).eq("id",site.id);if(publishError)throw publishError;
    return json({siteId:site.id,slug:site.slug,status:"published",publishedAt,url:`${appUrl}/?site=${encodeURIComponent(site.slug)}`,orderId:paid.id});
  }catch(error){console.error(error);return json({error:"internal_error"},500)}
});
