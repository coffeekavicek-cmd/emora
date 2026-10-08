import fs from 'node:fs/promises';
import path from 'node:path';
const payment=await fs.readFile(path.resolve('v5-live/templates/v16-payment.js'),'utf8');
const begin=payment.indexOf('async function resolveProject(){'),end=payment.indexOf('async function checkoutFlow(){');
if(begin<0||end<begin)throw Error('Payment resolver not found');
const source=payment.slice(begin,end);
const construct=new Function('$','status','document','window','supabase',source+';return resolveProject');
const report=[];
const ID='3f152f8a-504f-49cf-8a7b-c4586494911f';
for(const x of [
 {name:'incomplete creator',ready:false,savedId:ID,success:false,reads:0},
 {name:'save returns null',ready:true,savedId:null,success:false,reads:0},
 {name:'save throws error',ready:true,savedId:'throw',success:false,reads:0},
 {name:'different owner project',ready:true,savedId:ID,rowOwner:'wrong-user',success:false,reads:1},
 {name:'old project slug',ready:true,savedId:ID,rowSlug:'another-slug',success:false,reads:1},
 {name:'published project not a draft',ready:true,savedId:ID,rowStatus:'published',success:false,reads:1},
 {name:'correct last saved draft',ready:true,savedId:ID,success:true,reads:1}
]){
 let dbReads=0,saveCalls=0,btnCalls=0;
 const events=[];
 const $=k=>k==='#saveBtn'?{disabled:false}:k==='#slug'?{value:'qa-birthday'}:k==='#type'?{value:'birthday-aurora-paper'}:k==='#accountBtn'?{click:()=>btnCalls++}:null;
 const status=(msg,bad)=>events.push({msg,bad});
 const document={documentElement:{dataset:{creatorReady:x.ready?'true':'false'}}};
 const window={__EMORA_SAVE_PROJECT__:async()=>{saveCalls++;if(x.savedId==='throw')throw Error('Save unavailable');return x.savedId}};
 const expected={id:ID,slug:x.rowSlug||'qa-birthday',status:x.rowStatus||'draft',owner_id:x.rowOwner||'owner-qa',template_slug:'birthday-aurora-paper',updated_at:'2026-10-08T00:00:00Z'};
 const filters={};
 const supabase={auth:{getUser:async()=>({data:{user:{id:'owner-qa'}},error:null})},from:table=>{
  if(table!=='projects')throw Error('Unexpected table access');
  dbReads++;return {select:()=>({eq:function(k,v){filters[k]=v;return this},maybeSingle:async()=>({data:filters.owner_id===expected.owner_id&&filters.status===expected.status?expected:null,error:null})})};
 }};
 const result=await construct($,status,document,window,supabase)();
 const checks=[Boolean(result)===x.success,dbReads===x.reads,(!x.ready?saveCalls===0:true)];
 if(x.name==='correct last saved draft')checks.push(filters.id===ID,filters.owner_id==='owner-qa',filters.status==='draft',filters.template_slug==='birthday-aurora-paper');
 report.push({name:x.name,passed:checks.every(Boolean),details:{dbReads,saveCalls,filters,errors:events.map(e=>e.msg)}});
}
if(/function waitForSave\(/.test(payment))report.push({name:'no status-text heuristic',passed:false});
const passed=report.every(r=>r.passed);
console.log(JSON.stringify({passed,report},null,2));
if(!passed)process.exitCode=1;
