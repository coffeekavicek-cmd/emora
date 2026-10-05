/* EMORA V15.1 · targeted runtime hardening.
   Keeps the curated select clean after legacy category renders and makes auth magic-link-first. */
const ALLOWED=new Set(['love-rose-theatre','wedding-silk-heritage','birthday-aurora-paper','apology-quiet-room','proposal-pearl-promise']);
const $=s=>document.querySelector(s);
function filterType(){const select=$('#type');if(!select)return;for(const option of [...select.options])if(!ALLOWED.has(option.value))option.remove()}
function preferMagicLink(){const magic=$('.auth-tabs button[data-tab="magic"]'),password=$('.auth-tabs button[data-tab="password"]'),magicPane=$('#magicPane'),passwordPane=$('#passwordPane'),help=$('#authHelp');if(help)help.textContent='Preview uchun login kerak emas. Cloud save yoki publish paytida emailga bir martalik link olish eng oson yo‘l.';if(magic)magic.textContent='Email link · oson';if(password)password.textContent='Parol bilan';if(magic&&magicPane&&passwordPane&&!magic.dataset.v15Preferred){magic.dataset.v15Preferred='1';magic.classList.add('active');password?.classList.remove('active');magicPane.classList.remove('hidden');passwordPane.classList.add('hidden')}}
function sync(){filterType();preferMagicLink()}
const type=$('#type');if(type){new MutationObserver(sync).observe(type,{childList:true});type.addEventListener('change',()=>queueMicrotask(sync))}
const cards=$('#templateCards');if(cards)new MutationObserver(()=>queueMicrotask(sync)).observe(cards,{childList:true,subtree:true});
const modal=$('#accountModal');if(modal)new MutationObserver(()=>{if(!modal.classList.contains('hidden'))preferMagicLink()}).observe(modal,{attributes:true,attributeFilter:['class']});
document.addEventListener('DOMContentLoaded',sync,{once:true});sync();window.__EMORA_V15_FIXES__={version:1,curatedSelect:true,magicLinkFirst:true};
