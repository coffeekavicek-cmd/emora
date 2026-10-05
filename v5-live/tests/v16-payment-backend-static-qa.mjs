import fs from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve('.');
const failures=[];
const read=async p=>fs.readFile(path.join(root,p),'utf8');
const checkout=await read('supabase/functions/emora-checkout/index.ts');
const click=await read('supabase/functions/emora-click/index.ts');
const payme=await read('supabase/functions/emora-payme/index.ts');

function need(src,re,label){if(!re.test(src))failures.push(label)}
function forbid(src,re,label){if(re.test(src))failures.push(label)}

need(checkout,/auth\.getUser\(token\)/,'Checkout must validate bearer user server-side');
need(checkout,/\.eq\('owner_id',user\.id\)/,'Checkout must enforce project ownership');
need(checkout,/from\('payment_plans'\).*amount_uzs/s,'Checkout must source price from server-side payment_plans');
need(checkout,/\['click','payme'\]\.includes\(provider\)/,'Checkout must allow only CLICK/Payme');
need(checkout,/provider_not_configured/,'Checkout must fail closed when merchant config is missing');
need(checkout,/\.eq\('status','paid'\)/,'Checkout must reuse paid entitlement instead of charging twice');
need(checkout,/\.update\(\{status:'expired'/,'Checkout must expire previous pending order before a new one');
forbid(checkout,/body\?\.amount|body\.amount/,'Checkout must never trust client amount');
forbid(checkout,/sb_secret_|service_role[^'"\n]*['"][A-Za-z0-9_-]{20,}/i,'Checkout contains a hard-coded backend secret');

need(click,/CLICK_SECRET_KEY/,'CLICK callback must require merchant secret');
need(click,/md5\(raw\)/,'CLICK callback must verify provider signature');
need(click,/Number\(amountRaw\)-Number\(o\.amount_uzs\)/,'CLICK callback must verify amount against stored order');
need(click,/provider_transaction_id&&o\.provider_transaction_id!==tx/,'CLICK must reject a second provider transaction for the same order');
need(click,/emora_finalize_paid_order/,'CLICK success must use atomic paid-order finalizer');
need(click,/action===0/,'CLICK must implement prepare action');
need(click,/Number\(p\.error\)<0/,'CLICK must handle cancellation/error callback');
forbid(click,/sb_secret_|service_role[^'"\n]*['"][A-Za-z0-9_-]{20,}/i,'CLICK function contains a hard-coded backend secret');

need(payme,/PAYME_LOGIN/,'Payme callback must require merchant login');
need(payme,/PAYME_KEY/,'Payme callback must require merchant key');
need(payme,/safeEqual\(got,expected\)/,'Payme callback must verify Basic authorization');
for(const method of ['CheckPerformTransaction','CreateTransaction','PerformTransaction','CancelTransaction','CheckTransaction','GetStatement']) need(payme,new RegExp(`method==='${method}'`),`Payme missing ${method}`);
need(payme,/Number\(p\.amount\)!==Number\(o\.amount_tiyin\)/,'Payme must verify tiyin amount against stored order');
need(payme,/emora_finalize_paid_order/,'Payme success must use atomic paid-order finalizer');
forbid(payme,/sb_secret_|service_role[^'"\n]*['"][A-Za-z0-9_-]{20,}/i,'Payme function contains a hard-coded backend secret');

// Critical privacy rule: draft private media may be copied to public storage only in
// provider-confirmed success handlers (or an already-paid entitlement republish), never
// merely because a fresh checkout order was created.
const freshCheckoutSlice=checkout.slice(checkout.indexOf("const need=provider==='payme'"));
if(/materialize\(/.test(freshCheckoutSlice.split("return json({ok:true,order_id:")[0])) failures.push('Fresh checkout materializes private media before payment confirmation');
need(click,/if\(action===0\)[\s\S]*?return response\(p,0,[\s\S]*?\}\n if\(String\(o\.provider_prepare_id\)/,'CLICK prepare path must return before paid media materialization');
need(payme,/if\(method==='PerformTransaction'\)[\s\S]*?materialize\(admin,o\)/,'Payme must materialize private media only on PerformTransaction');

const result={passed:failures.length===0,failures,checks:{checkout:'owner+server-price+idempotency',click:'signature+amount+atomic-finalize',payme:'basic-auth+amount+atomic-finalize',privacy:'private-media-after-provider-confirmation'}};
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;
