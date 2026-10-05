/* EMORA V18 · shared ritual layer for the curated five. */
const root=document.getElementById('experience');
const main=document.getElementById('main');
if(root){
 const ambient=document.createElement('div');ambient.className='v18-ambient';ambient.setAttribute('aria-hidden','true');document.body.append(ambient);
 const progress=document.createElement('div');progress.className='v18-ritual-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let sections=[];
 function collect(){sections=main?[...main.children].filter(n=>n.tagName==='SECTION'):[];progress.replaceChildren(...sections.map(()=>document.createElement('i')));update()}
 function update(){if(!sections.length)return;let index=sections.findIndex(n=>n.classList.contains('v11-stage-active'));if(index<0)index=0;[...progress.children].forEach((dot,i)=>dot.classList.toggle('active',i===index));document.documentElement.dataset.v18Stage=String(index+1);document.documentElement.dataset.v18Stages=String(sections.length)}
 const observer=new MutationObserver(()=>{if(!sections.length)collect();else update()});if(main)observer.observe(main,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--v18-x',String(e.clientX/Math.max(innerWidth,1)));document.documentElement.style.setProperty('--v18-y',String(e.clientY/Math.max(innerHeight,1)))},{passive:true});
 addEventListener('pointerdown',e=>{if(e.target.closest('button,[role="button"],a')){document.body.classList.add('v18-pressing');if(navigator.vibrate)try{navigator.vibrate(8)}catch{}}},{passive:true});
 addEventListener('pointerup',()=>document.body.classList.remove('v18-pressing'),{passive:true});addEventListener('pointercancel',()=>document.body.classList.remove('v18-pressing'),{passive:true});
 const timer=setInterval(()=>{if(window.__EMORA_V10_READY__||main?.children?.length){clearInterval(timer);collect();window.__EMORA_V18_FLAGSHIP__={version:1,ready:true,ritualProgress:true,tactile:true,stages:sections.length}}},30);setTimeout(()=>{clearInterval(timer);collect();window.__EMORA_V18_FLAGSHIP__={version:1,ready:true,ritualProgress:true,tactile:true,stages:sections.length}},4000);
}
