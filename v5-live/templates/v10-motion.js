/* EMORA V10 motion director — lightweight Web Animations/CSS choreography.
   Every ritual receives a different opening language. Reduced-motion keeps all content accessible. */
const PARTICLES={theatre:10,galaxy:26,sky:22,garden:18,balloon:9,rain:22,gift:12,ring:9,cinema:10,reel:8,naqsh:10,envelope:8,ink:7,lamp:6};
const DURATIONS={theatre:1650,envelope:1500,galaxy:1750,garden:1600,naqsh:1550,gift:1450,balloon:1650,reel:1450,rain:1550,ink:1500,lamp:1450,ring:1700,cinema:1500,sky:1750};
const qs=(root,s)=>root?.querySelector(s);
function particle(i,type){
 const p=document.createElement('i');p.className='v10-motion-particle p-'+type;
 const x=(11+(i*37)%84),y=(8+(i*53)%81),d=(4.7+(i%7)*.63),delay=-(i%9)*.57,size=2+(i%4)*1.25;
 p.style.cssText=`--x:${x}%;--y:${y}%;--d:${d}s;--delay:${delay}s;--size:${size}px;--drift:${-22+(i*19)%47}px`;
 return p;
}
export function installIntroMotion(root,type,reduced=false){
 const intro=qs(root,'#intro');if(!intro)return;
 intro.dataset.motion='ready';
 if(reduced){intro.classList.add('motion-reduced');return}
 intro.classList.add('motion-live');
 const frame=qs(intro,'.v10-visual-frame'),object=qs(intro,'.v10-ritual-object');
 const layer=document.createElement('div');layer.className='v10-motion-layer';layer.setAttribute('aria-hidden','true');
 for(let i=0;i<(PARTICLES[type]||7);i++)layer.append(particle(i,type));
 (object||frame||intro).append(layer);
 const image=qs(intro,'.v10-hero-image');
 requestAnimationFrame(()=>requestAnimationFrame(()=>intro.dataset.motion='idle'));
 if(frame){
  const pointer=e=>{
   if(intro.classList.contains('opening'))return;
   const b=frame.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-b.left)/b.width*2-1)),y=Math.max(-1,Math.min(1,(e.clientY-b.top)/b.height*2-1));
   intro.style.setProperty('--mx',(x*7).toFixed(2)+'px');intro.style.setProperty('--my',(y*5).toFixed(2)+'px');
  };
  frame.addEventListener('pointermove',pointer,{passive:true});
  frame.addEventListener('pointerleave',()=>{intro.style.setProperty('--mx','0px');intro.style.setProperty('--my','0px')},{passive:true});
 }
 if(image){
  image.addEventListener('load',()=>intro.classList.add('motion-image-ready'),{once:true});
  if(image.complete&&image.naturalWidth)intro.classList.add('motion-image-ready');
 }
}
export function playOpening(root,type,reduced=false){
 const intro=qs(root,'#intro');if(!intro)return 0;
 intro.dataset.motion='opening';intro.classList.add('opening','motion-opening');
 if(reduced)return 0;
 const btn=qs(intro,'#openIntro');if(btn){btn.disabled=true;btn.setAttribute('aria-busy','true')}
 return DURATIONS[type]||1500;
}
export function installStoryMotion(main,reduced=false){
 if(!main)return;
 const targets=[...main.querySelectorAll('.v10-memory-card,.v10-letter-panel,.v10-artifact,.v10-interact-layout,.v10-information,.v10-schedule-list li,.v10-story-cover-copy,.v10-story-cover-art,.v10-scene-intro,.v10-finale-copy')];
 if(reduced||!('IntersectionObserver' in window)){targets.forEach(x=>x.classList.add('motion-in'));return}
 targets.forEach((x,i)=>{x.classList.add('motion-target');x.style.setProperty('--motion-order',String(i%6))});
 const io=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('motion-in');io.unobserve(e.target)}},{threshold:.12,rootMargin:'0px 0px -4% 0px'});
 targets.forEach(x=>io.observe(x));
}
export function animateArtifact(media,mode,reduced=false){
 if(!media||reduced)return;
 const image=media.querySelector('.v10-artifact-image');
 if(image&&media.classList.contains('activated')){
  const frames=mode==='box'?[{transform:'scale(1)'},{transform:'scale(1.04) translateY(-4px)'},{transform:'scale(1.095)'}]:
   mode==='lamp'?[{filter:'brightness(.72)'},{filter:'brightness(1.16)'},{filter:'brightness(1)'}]:
   mode==='ink'?[{transform:'scale(.98)',filter:'contrast(.9)'},{transform:'scale(1.08)',filter:'contrast(1.14)'},{transform:'scale(1.06)'}]:
   [{transform:'scale(1)'},{transform:'scale(1.1)'}];
  image.animate(frames,{duration:950,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
 }
}
export function animateChoice(layout,index,reduced=false){
 if(!layout||reduced)return;
 const points=[...layout.querySelectorAll('.v10-interact-point')];
 points.forEach((p,i)=>p.animate([{transform:'scale(1)'},{transform:`scale(${i===index?1.22:.88})`},{transform:'scale(1)'}],{duration:620,delay:i*45,easing:'cubic-bezier(.2,.8,.2,1)'}));
}
