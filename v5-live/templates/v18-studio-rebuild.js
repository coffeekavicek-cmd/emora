/* EMORA V18 · reported-preview fix + fullscreen-first creator canvas. */
const PATHS={
 'love-rose-theatre':'/templates/v10-love-rose.html',
 'birthday-aurora-paper':'/templates/v10-birthday-aurora.html',
 'apology-quiet-room':'/templates/v10-apology-quiet.html',
 'proposal-pearl-promise':'/templates/v10-proposal-pearl.html',
 'wedding-silk-heritage':'/templates/wedding-silk.html'
};
const NAMES={
 'love-rose-theatre':'Rose Theatre',
 'birthday-aurora-paper':'Aurora Paper',
 'apology-quiet-room':'Quiet Room',
 'proposal-pearl-promise':'Pearl Promise',
 'wedding-silk-heritage':'Silk Heritage'
};
const $=s=>document.querySelector(s);
const type=$('#type'),frame=$('#studioIframe'),label=$('#previewLabel');
let syncing=false,last='';
function wanted(){const slug=type?.value;return PATHS[slug]?slug:'love-rose-theatre'}
function pathOf(url){try{return new URL(url,location.origin).pathname}catch{return ''}}
function sendRefresh(){const probe=$('#name1')||type;if(probe)probe.dispatchEvent(new Event('input',{bubbles:true}))}
function syncFrame(reason='sync'){
 if(syncing||!type||!frame)return;
 const slug=wanted(),path=PATHS[slug],current=pathOf(frame.getAttribute('src')||frame.src);
 if(label){const actions=label.querySelector('.v18-preview-actions');label.firstChild&&label.firstChild.nodeType===Node.TEXT_NODE&&(label.firstChild.nodeValue=NAMES[slug]+' · LIVE EXPERIENCE ');if(!actions){} }
 if(current===path&&frame.dataset.template===slug){last=slug;return}
 syncing=true;last=slug;frame.dataset.template=slug;frame.src=path+'?editor=1&v=18';
 const done=()=>{syncing=false;sendRefresh();frame.removeEventListener('load',done)};
 frame.addEventListener('load',done);setTimeout(()=>{syncing=false;if(wanted()===slug)sendRefresh()},1200);
 document.documentElement.dataset.v18Preview=slug;document.documentElement.dataset.v18Reason=reason;
}
function addControls(){if(!label||label.querySelector('.v18-preview-actions'))return;const txt=document.createTextNode((NAMES[wanted()]||'EMORA')+' · LIVE EXPERIENCE ');label.textContent='';label.append(txt);const box=document.createElement('div');box.className='v18-preview-actions';const full=document.createElement('button'),reload=document.createElement('button');full.type=reload.type='button';full.textContent='BUTUN EKRAN ↗';reload.textContent='QAYTA YUKLA';full.onclick=()=>window.open(PATHS[wanted()]+'?v=18','_blank','noopener');reload.onclick=()=>{frame.dataset.template='';syncFrame('manual-reload')};box.append(full,reload);label.append(box)}
function updateLabel(){if(!label)return;const node=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(node)node.nodeValue=(NAMES[wanted()]||'EMORA')+' · LIVE EXPERIENCE '}
function sync(reason){addControls();updateLabel();syncFrame(reason)}
if(type){type.addEventListener('change',()=>{queueMicrotask(()=>sync('change'));setTimeout(()=>sync('change-80'),80);setTimeout(()=>sync('change-280'),280)});type.addEventListener('input',()=>queueMicrotask(()=>sync('input')));new MutationObserver(()=>queueMicrotask(()=>sync('options'))).observe(type,{childList:true,subtree:true})}
if(frame)new MutationObserver(()=>queueMicrotask(()=>sync('frame-attr'))).observe(frame,{attributes:true,attributeFilter:['src','data-template']});
window.addEventListener('pageshow',()=>sync('pageshow'));
document.addEventListener('DOMContentLoaded',()=>sync('dom'),{once:true});
setTimeout(()=>sync('boot-50'),50);setTimeout(()=>sync('boot-500'),500);setTimeout(()=>sync('boot-1500'),1500);
window.__EMORA_V18_STUDIO__={version:1,paths:PATHS,authoritativePreview:true,fullscreenCanvas:true,get current(){return wanted()},get last(){return last}};
