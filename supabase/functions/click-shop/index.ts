import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";
import md5 from "npm:md5@2.3.0";

const headers={"Content-Type":"application/json; charset=UTF-8"};
const out=(body:Record<string,unknown>)=>new Response(JSON.stringify(body),{status:200,headers});
const note=(code:number)=>({0:"Success",[-1]:"SIGN CHECK FAILED!",[-2]:"Incorrect parameter amount",[-3]:"Action not found",[-4]:"Already paid",[-5]:"User does not exist",[-6]:"Transaction does not exist",[-8]:"Error in request from click",[-9]:"Transaction cancelled"} as Record<number,string>)[code]||"Error";
const response=(r:any,code:number,prepareId:number|string=0)=>out({click_trans_id:r.click_trans_id||"",merchant_trans_id:r.merchant_trans_id||"",merchant_prepare_id:prepareId,merchant_confirm_id:prepareId,error:code,error_note:note(code)});

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return out({error:-8,error_note:note(-8)});
  try{
    const form=await req.formData();const r:any={};for(const [k,v] of form.entries())r[k]=String(v);
    const required=["click_trans_id","service_id","merchant_trans_id","amount","action","error","error_note","sign_time","sign_string","click_paydoc_id"];
    if(required.some(k=>r[k]===undefined)||(!(r.action==="0"||r.action==="1"))||(r.action==="1"&&r.merchant_prepare_id===undefined))return response(r,-8);
    const serviceId=Deno.env.get("CLICK_SERVICE_ID")||"";
    const secret=Deno.env.get("CLICK_SECRET_KEY")||"";
    if(!serviceId||!secret||String(r.service_id)!==String(serviceId))return response(r,-1);
    const source=String(r.click_trans_id)+String(r.service_id)+secret+String(r.merchant_trans_id)+(r.action==="1"?String(r.merchant_prepare_id):"")+String(r.amount)+String(r.action)+String(r.sign_time);
    if(String(md5(source)).toLowerCase()!==String(r.sign_string).toLowerCase())return response(r,-1);

    const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:order}=await admin.from("orders").select("id,amount_uzs,status,provider").eq("id",String(r.merchant_trans_id)).maybeSingle();
    if(!order||order.provider!=="click")return response(r,-5);
    if(Math.abs(Number(order.amount_uzs)-Number(r.amount))>0.01)return response(r,-2);
    if(order.status==="cancelled"||order.status==="refunded")return response(r,-9);

    if(r.action==="0"){
      const {data:existing}=await admin.from("payments").select("*").eq("provider","click").eq("external_transaction_id",String(r.click_trans_id)).maybeSingle();
      if(existing)return response(r,existing.state==="performed"?-4:existing.state==="cancelled"||existing.state==="refunded"?-9:0,existing.provider_prepare_id);
      if(order.status==="paid")return response(r,-4);
      const {data:other}=await admin.from("payments").select("id,state,provider_prepare_id").eq("order_id",order.id).eq("provider","click").in("state",["created","processing","performed"]).maybeSingle();
      if(other)return response(r,other.state==="performed"?-4:-8,other.provider_prepare_id||0);
      const now=Date.now();
      const {data:payment,error}=await admin.from("payments").insert({order_id:order.id,provider:"click",external_transaction_id:String(r.click_trans_id),state:"processing",amount_uzs:order.amount_uzs,provider_created_at_ms:now,provider_account:r}).select("*").single();
      if(error)throw error;
      await admin.from("orders").update({status:"processing",provider_order_ref:String(r.click_trans_id)}).eq("id",order.id);
      return response(r,0,payment.provider_prepare_id);
    }

    const prepareId=Number(r.merchant_prepare_id);
    const {data:payment}=await admin.from("payments").select("*").eq("provider","click").eq("provider_prepare_id",prepareId).maybeSingle();
    if(!payment||String(payment.order_id)!==String(order.id)||String(payment.external_transaction_id)!==String(r.click_trans_id))return response(r,-6,prepareId||0);
    if(payment.state==="performed"||order.status==="paid")return response(r,-4,prepareId);
    if(payment.state==="cancelled"||payment.state==="refunded")return response(r,-9,prepareId);

    if(Number(r.error)<0){
      const now=Date.now();
      await admin.from("payments").update({state:"cancelled",provider_cancelled_at_ms:now,provider_reason:String(r.error)}).eq("id",payment.id);
      await admin.from("orders").update({status:"cancelled"}).eq("id",order.id);
      return response(r,-9,prepareId);
    }

    const now=Date.now();
    const {error:updateError}=await admin.from("payments").update({state:"performed",provider_performed_at_ms:now}).eq("id",payment.id);if(updateError)throw updateError;
    await admin.from("orders").update({status:"paid",paid_at:new Date(now).toISOString(),provider_order_ref:String(r.click_trans_id)}).eq("id",order.id);
    return response(r,0,prepareId);
  }catch(error){
    console.error(error);
    return out({error:-8,error_note:note(-8)});
  }
});
