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
let syncing=false,last='',labelRepairing=false;
function wanted(){const slug=type?.value;return PATHS[slug]?slug:'love-rose-theatre'}
function pathOf(url){try{return new URL(url,location.origin).pathname}catch{return ''}}
function sendRefresh(){const probe=$('#name1')||type;if(probe)probe.dispatchEvent(new Event('input',{bubbles:true}))}
function addControls(){
 if(!label||labelRepairing)return;
 const slug=wanted();
 if(label.querySelector('.v18-preview-actions')){const n=[...label.childNodes].find(x=>x.nodeType===Node.TEXT_NODE);if(n)n.nodeValue=(NAMES[slug]||'EMORA')+' · LIVE EXPERIENCE ';return}
 labelRepairing=true;
 const box=document.createElement('div');box.className='v18-preview-actions';
 const full=document.createElement('button'),reload=document.createElement('button');full.type=reload.type='button';
 full.textContent='BUTUN EKRAN ↗';reload.textContent='QAYTA YUKLA';
 full.onclick=()=>window.open(PATHS[wanted()]+'?v=18','_blank','noopener');
 reload.onclick=()=>{frame.dataset.template='';syncFrame('manual-reload')};box.append(full,reload);
 label.replaceChildren(document.createTextNode((NAMES[slug]||'EMORA')+' · LIVE EXPERIENCE '),box);
 labelRepairing=false;
}
function syncFrame(reason='sync'){
 if(syncing||!type||!frame)return;
 const slug=wanted(),path=PATHS[slug],current=pathOf(frame.getAttribute('src')||frame.src);
 addControls();
 if(current===path&&frame.dataset.template===slug){last=slug;return}
 syncing=true;last=slug;frame.dataset.template=slug;frame.src=path+'?editor=1&v=18';
 const done=()=>{syncing=false;addControls();sendRefresh();frame.removeEventListener('load',done)};
 frame.addEventListener('load',done);setTimeout(()=>{syncing=false;if(wanted()===slug){addControls();sendRefresh()}},1200);
 document.documentElement.dataset.v18Preview=slug;document.documentElement.dataset.v18Reason=reason;
}
function sync(reason){addControls();syncFrame(reason)}
if(type){type.addEventListener('change',()=>{queueMicrotask(()=>sync('change'));setTimeout(()=>sync('change-80'),80);setTimeout(()=>sync('change-280'),280)});type.addEventListener('input',()=>queueMicrotask(()=>sync('input')));new MutationObserver(()=>queueMicrotask(()=>sync('options'))).observe(type,{childList:true,subtree:true})}
if(frame)new MutationObserver(()=>queueMicrotask(()=>sync('frame-attr'))).observe(frame,{attributes:true,attributeFilter:['src','data-template']});
if(label)new MutationObserver(()=>{if(!labelRepairing&&!label.querySelector('.v18-preview-actions'))queueMicrotask(()=>addControls())}).observe(label,{childList:true,subtree:false,characterData:true});
window.addEventListener('pageshow',()=>sync('pageshow'));
document.addEventListener('DOMContentLoaded',()=>sync('dom'),{once:true});
setTimeout(()=>sync('boot-50'),50);setTimeout(()=>sync('boot-500'),500);setTimeout(()=>sync('boot-1500'),1500);
window.__EMORA_V18_STUDIO__={version:2,paths:PATHS,authoritativePreview:true,fullscreenCanvas:true,stableControls:true,get current(){return wanted()},get last(){return last}};
