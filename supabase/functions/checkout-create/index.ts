import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const cors={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const appUrl=Deno.env.get("EMORA_PUBLIC_URL")||"https://emora-reborn-v1-production.up.railway.app";
const PAYME_TIMEOUT_MS=43_200_000;

type CheckoutOrder={id:string;site_id:string;plan_code:string;amount_uzs:number;currency:string;provider:string;status:string};

function makeCheckoutUrl(provider:string,order:CheckoutOrder,edition:string,siteId:string){
  const returnUrl=`${appUrl}/?mode=editor&template=${encodeURIComponent(edition)}&site=${encodeURIComponent(siteId)}&checkout=return`;
  if(provider==="click"){
    const u=new URL("https://my.click.uz/services/pay");
    u.searchParams.set("service_id",Deno.env.get("CLICK_SERVICE_ID")!);
    u.searchParams.set("merchant_id",Deno.env.get("CLICK_MERCHANT_ID")!);
    u.searchParams.set("amount",String(order.amount_uzs));
    u.searchParams.set("transaction_param",order.id);
    u.searchParams.set("return_url",returnUrl);
    return u.toString();
  }
  const params=[
    `m=${Deno.env.get("PAYME_MERCHANT_ID")!}`,
    `ac.order_id=${order.id}`,
    `a=${order.amount_uzs*100}`,
    "l=uz",
    `c=${returnUrl}`,
    "ct=1500",
  ].join(";");
  return `https://checkout.paycom.uz/${btoa(params)}`;
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"method_not_allowed"},405);
  try{
    const auth=req.headers.get("Authorization")||"";
    const token=auth.replace(/^Bearer\s+/i,"");
    if(!token)return json({error:"unauthorized"},401);
    const url=Deno.env.get("SUPABASE_URL")!;
    const anon=Deno.env.get("SUPABASE_ANON_KEY")!;
    const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authClient=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:userData,error:userError}=await authClient.auth.getUser(token);
    if(userError||!userData.user)return json({error:"unauthorized"},401);
    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const body=await req.json().catch(()=>null) as {siteId?:string;planCode?:string;provider?:string}|null;
    const siteId=String(body?.siteId||"");
    const planCode=String(body?.planCode||"");
    const provider=String(body?.provider||"");
    if(!siteId||!planCode||!["click","payme"].includes(provider))return json({error:"invalid_request"},400);

    const [{data:site,error:siteError},{data:plan,error:planError}]=await Promise.all([
      admin.from("sites").select("id,owner_id,edition,status,content").eq("id",siteId).single(),
      admin.from("plans").select("code,name,price_uzs,active").eq("code",planCode).eq("active",true).single(),
    ]);
    if(siteError||!site)return json({error:"site_not_found"},404);
    if(site.owner_id!==userData.user.id)return json({error:"forbidden"},403);
    if(planError||!plan)return json({error:"plan_not_found"},404);
    if(site.status!=="draft")return json({error:site.status==="published"?"already_published":"invalid_site_state"},409);

    const {data:paidOrder,error:paidError}=await admin.from("orders")
      .select("id,status,provider,amount_uzs,plan_code")
      .eq("site_id",siteId)
      .eq("owner_id",userData.user.id)
      .eq("status","paid")
      .order("paid_at",{ascending:false})
      .limit(1)
      .maybeSingle();
    if(paidError)throw paidError;
    if(paidOrder)return json({error:"already_paid",orderId:paidOrder.id,planCode:paidOrder.plan_code,provider:paidOrder.provider},409);

    const {data:mediaRows,error:mediaError}=await admin.from("site_media").select("kind").eq("site_id",siteId);
    if(mediaError)throw mediaError;
    const mediaKinds=new Set((mediaRows||[]).map((x:any)=>String(x.kind)));
    const content=(site.content||{}) as Record<string,unknown>;
    const missing:string[]=[];
    if(!mediaKinds.has("photo"))missing.push("photo");
    if(!mediaKinds.has("video"))missing.push("video");
    if(!mediaKinds.has("music")&&!String(content.musicPreset||"").trim())missing.push("music");
    if(missing.length)return json({error:"media_incomplete",missing},422);

    if(provider==="click"){
      const serviceId=Deno.env.get("CLICK_SERVICE_ID");
      const merchantId=Deno.env.get("CLICK_MERCHANT_ID");
      const secret=Deno.env.get("CLICK_SECRET_KEY");
      if(!serviceId||!merchantId||!secret)return json({error:"merchant_not_configured",provider:"click"},503);
    }else{
      const merchantId=Deno.env.get("PAYME_MERCHANT_ID");
      const login=Deno.env.get("PAYME_LOGIN");
      const key=Deno.env.get("PAYME_KEY");
      if(!merchantId||!login||!key)return json({error:"merchant_not_configured",provider:"payme"},503);
    }

    const findActive=async()=>{
      const {data,error}=await admin.from("orders")
        .select("id,site_id,plan_code,amount_uzs,currency,provider,status")
        .eq("owner_id",userData.user.id)
        .eq("site_id",siteId)
        .in("status",["pending","processing"])
        .order("created_at",{ascending:false});
      if(error)throw error;
      return (data||[]) as CheckoutOrder[];
    };

    let activeOrders=await findActive();
    let processing=activeOrders.find(x=>x.status==="processing");
    if(processing?.provider==="payme"){
      const {data:payment,error:paymentError}=await admin.from("payments")
        .select("id,provider_created_at_ms,state")
        .eq("order_id",processing.id)
        .eq("provider","payme")
        .eq("state","processing")
        .order("created_at",{ascending:false})
        .limit(1)
        .maybeSingle();
      if(paymentError)throw paymentError;
      if(payment?.provider_created_at_ms&&Date.now()-Number(payment.provider_created_at_ms)>=PAYME_TIMEOUT_MS){
        const now=Date.now();
        const {data:expired,error:expireError}=await admin.from("payments")
          .update({state:"cancelled",provider_cancelled_at_ms:now,provider_reason:"4"})
          .eq("id",payment.id)
          .eq("state","processing")
          .select("id")
          .maybeSingle();
        if(expireError)throw expireError;
        if(expired)await admin.from("orders").update({status:"cancelled"}).eq("id",processing.id).eq("status","processing");
        activeOrders=await findActive();
        processing=activeOrders.find(x=>x.status==="processing");
      }
    }
    if(processing)return json({error:"payment_in_progress",orderId:processing.id,provider:processing.provider},409);

    let pending=activeOrders.find(x=>x.status==="pending");
    if(pending&&(pending.provider!==provider||pending.plan_code!==plan.code||Number(pending.amount_uzs)!==Number(plan.price_uzs))){
      const {error:cancelError}=await admin.from("orders").update({status:"cancelled"}).eq("id",pending.id).eq("status","pending");
      if(cancelError)throw cancelError;
      activeOrders=await findActive();
      pending=activeOrders.find(x=>x.status==="pending");
    }

    let order=pending;
    let reused=Boolean(order);
    if(!order){
      const {data:created,error:orderError}=await admin.from("orders").insert({
        owner_id:userData.user.id,
        site_id:siteId,
        plan_code:plan.code,
        amount_uzs:plan.price_uzs,
        provider,
        status:"pending",
      }).select("id,site_id,plan_code,amount_uzs,currency,provider,status").single();
      if(orderError?.code==="23505"){
        const raced=await findActive();
        const racedProcessing=raced.find(x=>x.status==="processing");
        if(racedProcessing)return json({error:"payment_in_progress",orderId:racedProcessing.id,provider:racedProcessing.provider},409);
        const racedPending=raced.find(x=>x.status==="pending");
        if(!racedPending||racedPending.provider!==provider||racedPending.plan_code!==plan.code)return json({error:"checkout_conflict"},409);
        order=racedPending;
        reused=true;
      }else if(orderError){
        throw orderError;
      }else{
        order=created as CheckoutOrder;
        reused=false;
      }
    }

    const checkoutUrl=makeCheckoutUrl(provider,order,site.edition,siteId);
    return json({order,checkoutUrl,reused});
  }catch(error){
    console.error(error);
    return json({error:"internal_error"},500);
  }
});
