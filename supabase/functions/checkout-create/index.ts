import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const cors={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const appUrl=Deno.env.get("EMORA_PUBLIC_URL")||"https://emora-reborn-v1-production.up.railway.app";

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
      admin.from("sites").select("id,owner_id,edition,status").eq("id",siteId).single(),
      admin.from("plans").select("code,name,price_uzs,active").eq("code",planCode).eq("active",true).single(),
    ]);
    if(siteError||!site)return json({error:"site_not_found"},404);
    if(site.owner_id!==userData.user.id)return json({error:"forbidden"},403);
    if(planError||!plan)return json({error:"plan_not_found"},404);
    if(site.status==="published")return json({error:"already_published"},409);

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

    const {data:activeOrders,error:activeError}=await admin.from("orders")
      .select("id,site_id,plan_code,amount_uzs,currency,provider,status")
      .eq("owner_id",userData.user.id)
      .eq("site_id",siteId)
      .eq("plan_code",plan.code)
      .eq("provider",provider)
      .in("status",["pending","processing"])
      .order("created_at",{ascending:false});
    if(activeError)throw activeError;

    const processing=(activeOrders||[]).find((x:any)=>x.status==="processing");
    if(processing)return json({error:"payment_in_progress",orderId:processing.id,provider},409);

    let order=(activeOrders||[]).find((x:any)=>x.status==="pending") as CheckoutOrder|undefined;
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
      if(orderError)throw orderError;
      order=created as CheckoutOrder;
      reused=false;
    }

    if(Number(order.amount_uzs)!==Number(plan.price_uzs))return json({error:"order_amount_stale"},409);
    const checkoutUrl=makeCheckoutUrl(provider,order,site.edition,siteId);
    return json({order,checkoutUrl,reused});
  }catch(error){
    console.error(error);
    return json({error:"internal_error"},500);
  }
});
