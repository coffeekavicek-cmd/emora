/* EMORA V18 · shared ritual layer for the curated five. */
const template=document.documentElement.dataset.template||'';
if(template==='wedding-silk'&&!document.documentElement.dataset.group)document.documentElement.dataset.group='wedding';
const ambient=document.createElement('div');ambient.className='v18-ambient';ambient.setAttribute('aria-hidden','true');document.body.append(ambient);
const progress=document.createElement('div');progress.className='v18-ritual-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
let main=null,sections=[],observer=null,ready=false;
function resolveMain(){return document.querySelector('.v10-main,#silkExperience')||[...document.querySelectorAll('#experience > main')].find(n=>!n.classList.contains('v10-loading'))||null}
function activeIndex(){let i=sections.findIndex(n=>n.classList.contains('v11-stage-active')||n.classList.contains('silk-stage-active')||n.classList.contains('is-active'));if(i<0)i=sections.findIndex(n=>!n.inert&&n.getAttribute('aria-hidden')!=='true');return i<0?0:i}
function update(){if(!sections.length)return;const index=activeIndex();[...progress.children].forEach((dot,i)=>dot.classList.toggle('active',i===index));document.documentElement.dataset.v18Stage=String(index+1);document.documentElement.dataset.v18Stages=String(sections.length);window.__EMORA_V18_FLAGSHIP__={version:2,ready:true,ritualProgress:true,tactile:true,stages:sections.length,active:index+1,container:main?.id||main?.className||'main'}}
function attach(){const next=resolveMain();if(!next)return false;if(next!==main){observer?.disconnect();main=next;observer=new MutationObserver(()=>{const now=[...main.children].filter(n=>n.tagName==='SECTION');if(now.length!==sections.length)collect();else update()});observer.observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-hidden','inert']})}collect();return sections.length>0}
function collect(){if(!main)return;sections=[...main.children].filter(n=>n.tagName==='SECTION');progress.replaceChildren(...sections.map(()=>document.createElement('i')));if(sections.length){ready=true;update()}}
addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--v18-x',String(e.clientX/Math.max(innerWidth,1)));document.documentElement.style.setProperty('--v18-y',String(e.clientY/Math.max(innerHeight,1)))},{passive:true});
addEventListener('pointerdown',e=>{if(e.target.closest('button,[role="button"],a')){document.body.classList.add('v18-pressing');if(navigator.vibrate)try{navigator.vibrate(8)}catch{}}},{passive:true});
addEventListener('pointerup',()=>document.body.classList.remove('v18-pressing'),{passive:true});addEventListener('pointercancel',()=>document.body.classList.remove('v18-pressing'),{passive:true});
const timer=setInterval(()=>{if(attach()&&ready)clearInterval(timer)},40);
setTimeout(()=>{clearInterval(timer);attach();if(!ready)window.__EMORA_V18_FLAGSHIP__={version:2,ready:false,ritualProgress:true,tactile:true,stages:0,container:null}},7000);
