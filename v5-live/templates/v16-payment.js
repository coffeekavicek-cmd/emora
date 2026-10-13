import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm';
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm';

const SUPABASE_URL='https://mfbpjlwyjuycfqdokbfp.supabase.co';
const SUPABASE_KEY='sb_publishable_7ylqOOjt3k79ORiWlx1a4Q_NhMYJfS7';
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat('ru-RU').format(Number(n||0))+' сум';
let currentProject=null,currentPlan='template',busy=false;

function status(text,bad=false){const n=$('#status');if(!n)return;n.textContent=text;n.style.color=bad?'#a33':'var(--sage)'}
function buildModal(){
 if($('#v16-payment-modal'))return;
 const wrap=document.createElement('div');wrap.id='v16-payment-modal';wrap.className='v16-payment-modal hidden';wrap.innerHTML=`<div class="v16-payment-card" role="dialog" aria-modal="true" aria-labelledby="v16-payment-title">
  <button class="v16-payment-close" type="button" aria-label="Закрыть">×</button>
  <div class="eyebrow">EMORA PAYMENT · SECURE PUBLISH</div><h3 id="v16-payment-title">Подарок готов. Отправим?</h3>
  <p class="v16-payment-copy">Посмотреть подарок можно бесплатно. После оплаты получишь ссылку, которую можно отправить ей.</p>
  <div class="v16-plans">
   <button type="button" class="v16-plan active" data-plan="template"><small></small><strong>Готовый шаблон</strong><b>49 990 сум</b><span>4 подарка · фото, видео и музыка · ссылка</span></button>
  </div>
  <div class="v16-order-note" id="v16-order-note">Сохраним твой подарок перед оплатой.</div>
  <div class="v16-provider-grid"><button type="button" data-provider="click"><strong>CLICK</strong><span>Оплатить через Click</span></button><button type="button" data-provider="payme"><strong>PAYME</strong><span>Оплатить через Payme</span></button></div>
  <div class="v16-payment-status" id="v16-payment-status"></div>
 </div>`;
 document.body.append(wrap);
 wrap.querySelector('.v16-payment-close').onclick=()=>wrap.classList.add('hidden');
 wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.classList.add('hidden')});
 wrap.querySelectorAll('[data-provider]').forEach(b=>b.addEventListener('click',()=>beginCheckout(b.dataset.provider)));
}
function openModal(project){currentProject=project;buildModal();$('#v16-order-note').textContent=`${project.template_slug} · /s/${project.slug}`;$('#v16-payment-status').textContent='';$('#v16-payment-modal').classList.remove('hidden');}
async function resolveProject(){
 if(document.documentElement.dataset.creatorReady!=='true'){
  status('Добавь её имя и свои слова.',true);return null
 }
 if(typeof window.__EMORA_ENSURE_TELEGRAM__==='function'&&!await window.__EMORA_ENSURE_TELEGRAM__())return null;
 const {data:{user},error:userError}=await supabase.auth.getUser();
 if(userError||!user){status('Открой подарок в Telegram, чтобы продолжить.',true);return null}
 const save=$('#saveBtn');
 if(!save||save.disabled){status('Подожди, файлы ещё загружаются.',true);return null}
 if(typeof window.__EMORA_SAVE_PROJECT__!=='function'){
  status('Редактор ещё загружается. Обнови страницу.',true);return null
 }
 let savedId;
 try{savedId=await window.__EMORA_SAVE_PROJECT__()}catch(e){
  status(e?.message||'Не удалось сохранить подарок. Попробуй ещё раз.',true);return null
 }
 if(typeof savedId!=='string'||!/^[0-9a-f-]{36}$/i.test(savedId)){
  status('Сначала сохраним подарок. Попробуй ещё раз.',true);return null
 }
 const slug=String($('#slug')?.value||'').trim(),template=String($('#type')?.value||'');
 if(!slug||!template){status('Добавь название ссылки и выбери подарок.',true);return null}
 const {data,error}=await supabase.from('projects')
  .select('id,slug,template_slug,status,owner_id,updated_at')
  .eq('id',savedId).eq('owner_id',user.id).eq('template_slug',template).eq('status','draft').maybeSingle();
 if(error||!data||data.slug!==slug){
  status(error?.message||'Не удалось найти сохранённый подарок. Сохрани ещё раз.',true);return null
 }
 return data
}
async function checkoutFlow(){if(busy)return;busy=true;try{const project=await resolveProject();if(project)openModal(project)}finally{busy=false}}
async function beginCheckout(provider){
 if(!currentProject||busy)return;busy=true;const out=$('#v16-payment-status');out.textContent='Готовим оплату…';document.querySelectorAll('#v16-payment-modal [data-provider]').forEach(b=>b.disabled=true);
 try{
  const {data:{session}}=await supabase.auth.getSession();if(!session?.access_token)throw new Error('Войди в аккаунт ещё раз.');
  const r=await fetch(SUPABASE_URL+'/functions/v1/emora-checkout',{method:'POST',headers:{'content-type':'application/json','authorization':'Bearer '+session.access_token,'apikey':SUPABASE_KEY},body:JSON.stringify({project_id:currentProject.id,provider,plan_slug:currentPlan,publish_slug:currentProject.slug})});
  const data=await r.json().catch(()=>({}));
  if(data.already_paid&&data.public_url){$('#v16-payment-modal').classList.add('hidden');await showPublished(data.public_url,'Bu project oldin to‘langan · yangi versiya publish qilindi ✓');return}
  if(!r.ok||!data.payment_url){if(data.error==='provider_not_configured')throw new Error('Оплата пока не подключена. Подарок сохранён, вернись к нему позже.');if(data.error==='slug_taken')throw new Error('Эта ссылка уже занята. Выбери другое название.');throw new Error(data.detail||data.error||'Не получилось открыть оплату. Попробуй ещё раз.')}
  sessionStorage.setItem('emora:last-payment-order',String(data.order_id||''));location.assign(data.payment_url);
 }catch(e){out.textContent=e.message||'Не удалось оплатить. Попробуй ещё раз.';out.dataset.bad='true'}finally{busy=false;document.querySelectorAll('#v16-payment-modal [data-provider]').forEach(b=>b.disabled=false)}
}
async function showPublished(url,text='Оплата прошла. Подарок готов ♡'){
 status(text);const box=$('#publishResult'),a=$('#publishLink'),qr=$('#qrImage');if(box)box.classList.remove('hidden');if(a){a.href=url;a.textContent=url}if(qr){try{qr.src=await QRCode.toDataURL(url,{width:220,margin:1})}catch{}}
}
async function inspectReturn(){
 const id=new URLSearchParams(location.search).get('payment_return')||sessionStorage.getItem('emora:last-payment-order');if(!id||!/^[0-9a-f-]{36}$/i.test(id))return;
 const {data:{user}}=await supabase.auth.getUser();if(!user)return;
 for(let i=0;i<4;i++){
  const {data}=await supabase.from('payment_orders').select('id,status,publish_slug,provider,amount_uzs').eq('id',id).maybeSingle();if(data?.status==='paid'){const url=location.origin+'/s/'+data.publish_slug;sessionStorage.removeItem('emora:last-payment-order');history.replaceState({},'',location.pathname+location.hash);await showPublished(url,`${data.provider.toUpperCase()} · ${money(data.amount_uzs)} · tasdiqlandi ✓`);return}if(data&&['cancelled','failed','expired','refunded'].includes(data.status)){status('To‘lov yakunlanmadi: '+data.status,true);sessionStorage.removeItem('emora:last-payment-order');return}await new Promise(r=>setTimeout(r,700));
 }
 status('Проверяем оплату. Обнови страницу через минуту.');
}
function boot(){
 if(!$('#publishBtn'))return;buildModal();$('#publishBtn').textContent='Оплатить и получить ссылку';$('#publishBtn').dataset.paymentGate='true';
 window.addEventListener('click',e=>{const b=e.target?.closest?.('#publishBtn');if(!b)return;e.preventDefault();e.stopImmediatePropagation();checkoutFlow()},true);
 window.__EMORA_V16_PAYMENT__={version:16,gate:true,providers:['click','payme'],activePlan:'template',priceUzs:49990};inspectReturn();
}
boot();

