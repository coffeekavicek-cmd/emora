import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.117.2";

const headers={"Content-Type":"text/json; charset=UTF-8","Connection":"keep-alive"};
const respond=(body:unknown)=>new Response(JSON.stringify(body),{status:200,headers});
const msg=(ru:string,uz:string,en:string)=>({ru,uz,en});
const rpcError=(id:unknown,code:number,message=msg("Ошибка","Xatolik","Error"),data?:unknown)=>respond({error:{code,message,...(data!==undefined?{data}:{})},id:id??null});
const rpcResult=(id:unknown,result:unknown)=>respond({result,id:id??null});
const toMs=(iso?:string|null)=>iso?Date.parse(iso):0;
const paymeState=(p:any)=>{
  if(p.state==="performed")return 2;
  if(p.state==="cancelled"||p.state==="refunded")return p.provider_performed_at_ms?-2:-1;
  return 1;
};

Deno.serve(async(req:Request)=>{
  if(req.method!=="POST")return rpcError(null,-32300,msg("Метод запроса должен быть POST","So‘rov metodi POST bo‘lishi kerak","Request method must be POST"));
  let body:any;
  try{body=await req.json()}catch{return rpcError(null,-32700,msg("Ошибка разбора JSON","JSON o‘qishda xatolik","JSON parse error"))}
  const id=body?.id??null;
  try{
    const login=Deno.env.get("PAYME_LOGIN")||"";
    const key=Deno.env.get("PAYME_KEY")||"";
    const expected="Basic "+btoa(`${login}:${key}`);
    if(!login||!key||req.headers.get("Authorization")!==expected){
      return rpcError(id,-32504,msg("Недостаточно привилегий","Ruxsat yetarli emas","Insufficient privileges"));
    }
    const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false,autoRefreshToken:false}});
    const method=String(body?.method||"");
    const p=body?.params||{};

    const orderByAccount=async()=>{
      const orderId=String(p?.account?.order_id||"");
      if(!orderId)return {error:rpcError(id,-31050,msg("Заказ не найден","Buyurtma topilmadi","Order not found"),"order_id")};
      const {data:order}=await admin.from("orders").select("id,amount_uzs,status,provider,site_id,owner_id").eq("id",orderId).maybeSingle();
      if(!order||order.provider!=="payme")return {error:rpcError(id,-31050,msg("Заказ не найден","Buyurtma topilmadi","Order not found"),"order_id")};
      if(Number(p.amount)!==Number(order.amount_uzs)*100)return {error:rpcError(id,-31001,msg("Неверная сумма","Noto‘g‘ri summa","Incorrect amount"))};
      return {order};
    };
    const paymentByExternal=async(tx:string)=>{
      const {data}=await admin.from("payments").select("*").eq("provider","payme").eq("external_transaction_id",tx).maybeSingle();return data;
    };

    if(method==="CheckPerformTransaction"){
      const x=await orderByAccount();if(x.error)return x.error;
      if(["cancelled","refunded"].includes(x.order!.status))return rpcError(id,-31008,msg("Невозможно выполнить операцию","Operatsiyani bajarib bo‘lmaydi","Operation cannot be performed"));
      return rpcResult(id,{allow:true});
    }

    if(method==="CreateTransaction"){
      const tx=String(p.id||"");if(!tx)return rpcError(id,-32600,msg("Неверный запрос","Noto‘g‘ri so‘rov","Invalid request"));
      const existing=await paymentByExternal(tx);
      if(existing)return rpcResult(id,{create_time:toMs(existing.created_at),transaction:String(existing.id),state:paymeState(existing)});
      const x=await orderByAccount();if(x.error)return x.error;const order=x.order!;
      if(order.status==="paid"||order.status==="refunded"||order.status==="cancelled")return rpcError(id,-31008,msg("Невозможно выполнить операцию","Operatsiyani bajarib bo‘lmaydi","Operation cannot be performed"));
      const {data:other}=await admin.from("payments").select("id").eq("order_id",order.id).eq("provider","payme").in("state",["created","processing","performed"]).maybeSingle();
      if(other)return rpcError(id,-31008,msg("Транзакция уже создана","Tranzaksiya allaqachon yaratilgan","Transaction already exists"));
      const {data:payment,error}=await admin.from("payments").insert({order_id:order.id,provider:"payme",external_transaction_id:tx,state:"processing",amount_uzs:order.amount_uzs,provider_created_at_ms:Number(p.time)||Date.now(),provider_account:p.account||{}}).select("*").single();
      if(error)throw error;
      await admin.from("orders").update({status:"processing",provider_order_ref:tx}).eq("id",order.id);
      return rpcResult(id,{create_time:toMs(payment.created_at),transaction:String(payment.id),state:1});
    }

    if(method==="PerformTransaction"){
      const tx=String(p.id||"");const payment=await paymentByExternal(tx);
      if(!payment)return rpcError(id,-31003,msg("Транзакция не найдена","Tranzaksiya topilmadi","Transaction not found"));
      if(payment.state==="performed")return rpcResult(id,{transaction:String(payment.id),perform_time:payment.provider_performed_at_ms||toMs(payment.updated_at),state:2});
      if(payment.state==="cancelled"||payment.state==="refunded")return rpcError(id,-31008,msg("Невозможно выполнить операцию","Operatsiyani bajarib bo‘lmaydi","Operation cannot be performed"));
      const now=Date.now();
      const {error}=await admin.from("payments").update({state:"performed",provider_performed_at_ms:now}).eq("id",payment.id);if(error)throw error;
      await admin.from("orders").update({status:"paid",paid_at:new Date(now).toISOString(),provider_order_ref:tx}).eq("id",payment.order_id);
      return rpcResult(id,{transaction:String(payment.id),perform_time:now,state:2});
    }

    if(method==="CancelTransaction"){
      const tx=String(p.id||"");const payment=await paymentByExternal(tx);
      if(!payment)return rpcError(id,-31003,msg("Транзакция не найдена","Tranzaksiya topilmadi","Transaction not found"));
      if(payment.state==="cancelled"||payment.state==="refunded")return rpcResult(id,{transaction:String(payment.id),cancel_time:payment.provider_cancelled_at_ms||toMs(payment.updated_at),state:paymeState(payment)});
      const wasPerformed=payment.state==="performed";
      const now=Date.now();const nextState=wasPerformed?"refunded":"cancelled";const orderState=wasPerformed?"refunded":"cancelled";
      const {error}=await admin.from("payments").update({state:nextState,provider_cancelled_at_ms:now,provider_reason:String(p.reason??"")}).eq("id",payment.id);if(error)throw error;
      await admin.from("orders").update({status:orderState}).eq("id",payment.order_id);
      return rpcResult(id,{transaction:String(payment.id),cancel_time:now,state:wasPerformed?-2:-1});
    }

    if(method==="CheckTransaction"){
      const tx=String(p.id||"");const payment=await paymentByExternal(tx);
      if(!payment)return rpcError(id,-31003,msg("Транзакция не найдена","Tranzaksiya topilmadi","Transaction not found"));
      return rpcResult(id,{create_time:toMs(payment.created_at),perform_time:payment.provider_performed_at_ms||0,cancel_time:payment.provider_cancelled_at_ms||0,transaction:String(payment.id),state:paymeState(payment),reason:payment.provider_reason?Number(payment.provider_reason):null});
    }

    if(method==="GetStatement"){
      const from=Number(p.from)||0,to=Number(p.to)||Date.now();
      const {data,error}=await admin.from("payments").select("*").eq("provider","payme").gte("provider_created_at_ms",from).lte("provider_created_at_ms",to).order("provider_created_at_ms");if(error)throw error;
      const transactions=(data||[]).map((payment:any)=>({id:payment.external_transaction_id,time:payment.provider_created_at_ms,amount:Number(payment.amount_uzs)*100,account:payment.provider_account||{},create_time:toMs(payment.created_at),perform_time:payment.provider_performed_at_ms||0,cancel_time:payment.provider_cancelled_at_ms||0,transaction:String(payment.id),state:paymeState(payment),reason:payment.provider_reason?Number(payment.provider_reason):null}));
      return rpcResult(id,{transactions});
    }

    return rpcError(id,-32601,msg("Метод не найден","Metod topilmadi","Method not found"),method);
  }catch(error){
    console.error(error);
    return rpcError(id,-32400,msg("Системная ошибка","Tizim xatosi","System error"));
  }
});
