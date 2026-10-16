/* The same name glyphs move through rectangle → heart → rectangular portrait.
   Photos are sampled offscreen; the visible canvas paints glyphs only. */
(()=>{
'use strict';
const canvas=document.getElementById('namesHeartCanvas'),slider=document.getElementById('heartSlider'),label=document.getElementById('heartSliderLabel'),output=document.getElementById('heartSliderValue'),caption=document.getElementById('namesHeartNote');
if(!canvas||!slider||!label||!output||!caption)return;
const isLove=Boolean(window.__EMORA_LOVE_V26__),kind=isLove?'love':'birthday';
const scene=()=>isLove?window.__EMORA_LOVE_V26__:window.__EMORA_BIRTHDAY_V19__;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
const W=400,H=480,DPR=Math.min(window.devicePixelRatio||1,2),demo='/assets/demo-'+kind+'-1-v46.webp';
canvas.width=W*DPR;canvas.height=H*DPR;canvas.style.cssText='position:relative;inset:auto;display:block;width:100%;height:auto;aspect-ratio:5/6;object-fit:contain;margin-inline:auto;clip-path:none;border-radius:0';
canvas.parentElement.style.cssText='position:relative;width:min(400px,82vw,35svh);aspect-ratio:5/6;height:auto;max-height:44svh;margin-inline:auto;filter:none;clip-path:none;border-radius:0';
canvas.setAttribute('role','img');
document.getElementById('namesHeartPhoto')?.remove();
document.getElementById('heartRevealRect')?.setAttribute('width','0');
const note=document.getElementById('portraitSourceNote')||document.createElement('span');note.id='portraitSourceNote';note.style.cssText='font-size:12px;text-align:center;line-height:1.4;display:block';if(!note.parentNode)slider.parentElement.append(note);
slider.min='0';slider.max='100';slider.step='0.2';slider.value='0';slider.setAttribute('aria-label','Rectangle, heart, portrait');
const copy={ru:{first:'Сдвинь до середины — собери сердце ♡',second:'Ещё дальше — и увидишь себя ♡',stages:['Имена','Сердце','Это ты ♡'],demo:'Пример · в твоём подарке будет её фото',error:'Фото не открылось. Выбери другое в редакторе.',wait:'Собираем портрет…',line:n=>n+', столько раз твоё имя. И всё равно мало ♡'},uz:{first:'O‘rtagacha sur — yurak yig‘iladi ♡',second:'Yana sur — endi o‘zingni ko‘rasan ♡',stages:['Ismlar','Yurak','Bu — san ♡'],demo:'Namuna · sovg‘ada uning surati bo‘ladi',error:'Rasm ochilmadi. Boshqa surat tanla.',wait:'Portret yig‘ilyapti…',line:n=>n+', ismingni shuncha yozdim. Baribir kam ♡'},en:{first:'Slide halfway — make a heart ♡',second:'Keep going — there you are ♡',stages:['Names','Heart','That’s you ♡'],demo:'Example · your gift will use her photo',error:'Could not open the photo. Choose another in the editor.',wait:'Putting your portrait together…',line:n=>n+', your name, over and over. Still not enough ♡'}};
const t=()=>copy[scene()?.lang]||copy.ru;
let name='',url='',particles=[],colors=null,source='loading',frame=0,request=0,letterFont=4,completeNames=0;
const smooth=x=>x*x*(3-2*x);
function heartInside(x,y){const a=(x-200)/162,b=-(y-250)/170;return (a*a+b*b-1)**3-a*a*b*b*b<=0;}
function makeParticles(person){
 name=person;const chars=Array.from(name.replace(/\s+/g,' ').trim()||'♡');
 const count=Math.max(12000,Math.min(36000,2400*chars.length));completeNames=Math.floor(count/chars.length);
 const cols=40,rows=Math.ceil(count/chars.length/cols),wordW=352/cols,rowH=410/rows;
 letterFont=Math.max(2,Math.min(4.6,wordW/(chars.length*.64)));
 const finalCols=Math.ceil(Math.sqrt(count*352/422)),finalRows=Math.ceil(count/finalCols);
 const points=[];const step=Math.sqrt(92000/count)*.7;
 for(let y=5;y<456;y+=step)for(let x=4;x<397;x+=step)if(heartInside(x,y))points.push([x,y]);
 particles=Array.from({length:count},(_,i)=>{
  const word=Math.floor(i/chars.length),c=i%chars.length,p=points[Math.min(points.length-1,Math.floor(i*points.length/count))];
  return {char:chars[c],x:24+(word%cols)*wordW+c*(wordW*.91/chars.length),y:34+Math.floor(word/cols)*rowH,hx:p[0],hy:p[1],px:24+(i%finalCols)*352/finalCols,py:30+Math.floor(i/finalCols)*422/finalRows,bend:(Math.sin(i*12.9898)*43758.5453%1)*24};
 });
 colors=null;
}
function safePhoto(s){if(typeof s!=='string'||!s.trim())return '';try{const u=new URL(s,location.origin);return ['https:','http:','blob:'].includes(u.protocol)||(u.protocol==='data:'&&/^data:image\/(png|jpeg|webp);/i.test(s))?u.href:'';}catch{return '';}}
async function samplePhoto(photo){
 const id=++request;source='loading';paint();
 try{
  const image=await new Promise((resolve,reject)=>{const im=new Image();if(!photo.startsWith('blob:')&&!photo.startsWith('data:'))im.crossOrigin='anonymous';im.onload=()=>resolve(im);im.onerror=reject;im.src=photo||demo;});
  if(id!==request)return;
  const off=document.createElement('canvas');off.width=W;off.height=H;const g=off.getContext('2d',{willReadFrequently:true});
  const scale=Math.max(W/image.naturalWidth,H/image.naturalHeight),dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;
  g.drawImage(image,(W-dw)/2,(H-dh)/2,dw,dh);
  const pixels=g.getImageData(0,0,W,H).data;
  colors=particles.map(p=>{const i=(Math.round(p.py)*W+Math.round(p.px))*4;const lum=(pixels[i]*.2126+pixels[i+1]*.7152+pixels[i+2]*.0722)/255;return {lum,r:24+pixels[i]*.90,g:12+pixels[i+1]*.90,b:25+pixels[i+2]*.87};});
  source=photo?'personal':'demo';
 }catch{if(id!==request)return;source='unavailable';colors=null;}
 paint();
}
function draw(){
 frame=0;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.clearRect(0,0,W,H);ctx.textAlign='left';ctx.textBaseline='middle';
 const value=Math.max(0,Math.min(100,Number(slider.value)||0)),first=value<=50,p=smooth(first?value/50:(value-50)/50),arch=Math.sin(p*Math.PI);
 ctx.font='600 '+(first?letterFont:letterFont+(4.8-letterFont)*p)+'px system-ui,Arial,sans-serif';
 for(let i=0;i<particles.length;i++){
  const q=particles[i];const x=first?q.x+(q.hx-q.x)*p:q.hx+(q.px-q.hx)*p;const y=first?q.y+(q.hy-q.y)*p:q.hy+(q.py-q.hy)*p;
  const portrait=colors?.[i];ctx.globalAlpha=(!first&&portrait)?1-p+p*(.32+portrait.lum*.68):1;
  ctx.fillStyle=!first&&portrait?'rgb('+Math.round(245+(portrait.r-245)*p)+','+Math.round(223+(portrait.g-223)*p)+','+Math.round(232+(portrait.b-232)*p)+')':'#f5dfe8';
  ctx.fillText(q.char,x+q.bend*arch,y+q.bend*.6*arch);
 }
 ctx.globalAlpha=1;
 const stage=value<49?t().stages[0]:value<51?t().stages[1]:value>=99.8?t().stages[2]:t().stages[1]+' → '+t().stages[2];
 label.textContent=value<50?t().first:t().second;output.textContent=stage+' · '+Math.round(value)+'%';
 note.textContent=source==='loading'?t().wait:source==='demo'?t().demo:source==='unavailable'?t().error:'';
 caption.textContent=t().line(name);slider.setAttribute('aria-valuetext',stage);canvas.setAttribute('aria-label',name+' · '+completeNames+' names · '+stage);
 const title=document.getElementById('finalTitle');if(isLove&&title&&value>=99.8)title.textContent=name+' ♡';
}
function paint(){if(!frame)frame=requestAnimationFrame(draw);}
function update(){
 const state=scene()||{},person=String(state.recipient||'Jasmina').trim().slice(0,55)||'Jasmina',photo=safePhoto((state.photos||[]).find(x=>typeof x==='string'&&x.trim())||'');
 const changed=person!==name;if(changed||!particles.length)makeParticles(person);
 if(changed||photo!==url||source==='loading'&&!request){url=photo;void samplePhoto(url);}paint();
}
slider.addEventListener('input',paint);slider.addEventListener('change',()=>{if(Math.abs(Number(slider.value)-50)<3)slider.value='50';paint();});
window.addEventListener('emora:'+kind+'-update',update);window.addEventListener('emora:'+kind+'-finale',()=>{slider.value='0';update();});window.addEventListener('emora:'+kind+'-replay',()=>{slider.value='0';paint();});
const state={get ready(){return !!colors;},get namesPainted(){return completeNames;},get portraitSource(){return source;},get percent(){return Number(slider.value);},get recipient(){return name;},get algorithm(){return 'rectangle-heart-rectangular-glyph-portrait-v29';},get sampleKind(){return source;},get particleCount(){return particles.length;},get stage(){return Number(slider.value)<50?'rectangle':Number(slider.value)===50?'heart':'portrait';}};
window.__EMORA_MOSAIC_V28__=window.__EMORA_MOSAIC_V27__=state;window[isLove?'__EMORA_HEART_V26__':'__EMORA_HEART_V23__']=state;
update();
})();
