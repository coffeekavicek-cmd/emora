/* EMORA V28: photographic portrait emerges from named letterpress without hard split.
   Portrait paint is client-side only; no photo data is sent to third parties.
   A local SVG fallback is used only when no user image has been supplied.
*/
(()=>{
'use strict';
const canvas=document.getElementById('namesHeartCanvas');
const slider=document.getElementById('heartSlider');
const label=document.getElementById('heartSliderLabel');
const output=document.getElementById('heartSliderValue');
const caption=document.getElementById('namesHeartNote');
const staleSvg=document.getElementById('namesHeartPhoto');
const legacyRect=document.getElementById('heartRevealRect');
if(!canvas||!slider||!label||!output||!caption)return;
const isLove=Boolean(window.__EMORA_LOVE_V26__);
const scene=()=>isLove?window.__EMORA_LOVE_V26__:window.__EMORA_BIRTHDAY_V19__;
const W=400,H=380,dpr=Math.min(Math.max(window.devicePixelRatio||1,1),2);
const heart=new Path2D('M200 344 C171 318 43 240 27 149 C9 47 122 13 200 94 C278 13 391 47 373 149 C357 240 229 318 200 344 Z');
const ctx=canvas.getContext('2d',{alpha:true});
if(!ctx)return;
const fallback='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="660" viewBox="0 0 600 660"><defs><linearGradient id="b" x2=".8" y2="1"><stop stop-color="#faeee2"/><stop offset="1" stop-color="#dca9bf"/></linearGradient><linearGradient id="h" x2="1" y2="1"><stop stop-color="#241129"/><stop offset="1" stop-color="#5f2c4c"/></linearGradient><linearGradient id="s" x2="1" y2=".7"><stop stop-color="#fce0c5"/><stop offset="1" stop-color="#c98a84"/></linearGradient></defs><rect width="600" height="660" fill="url(#b)"/><circle cx="302" cy="254" r="246" fill="#f5d8cf"/><path d="M58 660Q83 422 140 222Q190 83 294 87Q452 64 478 217Q528 442 550 660Z" fill="url(#h)"/><path d="M58 660Q120 492 231 481H359Q484 494 553 660Z" fill="#693755"/><path d="M231 449L220 523Q300 581 382 515L354 444Z" fill="url(#s)"/><path d="M178 240Q184 115 301 115Q419 117 420 247Q407 417 301 488Q196 430 178 240" fill="url(#s)"/><path d="M162 350Q126 161 218 102Q316 53 400 141Q441 197 421 335Q409 241 367 177Q301 232 189 208Z" fill="url(#h)"/><path d="M220 296Q245 281 273 298M328 296Q350 278 379 297" stroke="#68394a" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M229 307Q250 299 265 308M337 309Q361 301 378 310" stroke="#2b1830" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M298 318Q291 353 299 367Q308 372 319 368" stroke="#b77e7b" stroke-width="5" fill="none"/><path d="M264 407Q299 387 334 406Q302 435 264 407" fill="#ad546b"/><path d="M155 223Q118 376 169 465M429 208Q499 392 443 482" stroke="#46213c" stroke-width="45" fill="none" stroke-linecap="round"/></svg>';
const fallbackData='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(fallback);
// A known-valid Unsplash photo, optional demo only. Custom uploaded photos always win.
const demoPhoto='https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=640&h=720&fit=crop&auto=format&q=82';
const words={
uz:{instruction:'CHIZIQNI SEKIN SUR ♡',complete:'Mana, yuragimdagi inson ♡',sample:'Namuna',error:'Rasm ochilmadi. Studio’da boshqa suratni tanla.',love:n=>'“'+n+'” ismini ming marta yozsam ham, sanga aytadigan gapim tugamaydi ♡',birthday:n=>'“'+n+'” ismini 133 848 383 marta yozsam ham, baribir kam ♡'},
ru:{instruction:'ПЛАВНО ПРОВЕДИ ВПРАВО ♡',complete:'Вот кто у меня в сердце ♡',sample:'Пример',error:'Фото не открылось. Выбери другое в Studio.',love:n=>'Даже тысяча повторений имени «'+n+'» не заменит одну встречу с тобой ♡',birthday:n=>'Даже если написать «'+n+'» 133 848 383 раза — мало ♡'},
en:{instruction:'SLIDE GENTLY TO REVEAL ♡',complete:'You are the one in my heart ♡',sample:'Example',error:'Photo could not load. Choose another in Studio.',love:n=>'I could write “'+n+'” a thousand times and still have more to say ♡',birthday:n=>'Even 133,848,383 times writing “'+n+'” would not be enough ♡'}
};
let name='Jasmina',targetUrl='',source='loading',sampleKind='unknown',letters=0;
let baseline=null,photoCanvas=null,inkCanvas=null,started='',requestId=0;
const helper=document.createElement('span');
helper.id='portraitSourceNote';
helper.style.cssText='font-size:10px;color:#e1c4d2;text-align:center;line-height:1.2;min-height:11px';
slider.parentElement.appendChild(helper);
if(staleSvg)staleSvg.style.display='none';
const create=()=>{
 const node=document.createElement('canvas');node.width=W*dpr;node.height=H*dpr;
 const g=node.getContext('2d',{willReadFrequently:true});g.setTransform(dpr,0,0,dpr,0,0);
 return {canvas:node,g};
};
function locale(){return words[scene()?.lang]||words.uz}
function canvasImage(src){return new Promise((resolve,reject)=>{
 const image=new Image();if(!src.startsWith('data:'))image.crossOrigin='anonymous';
 image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('image load failed'));
 image.src=src;
})}
function safeUrl(raw){if(typeof raw!=='string'||!raw.trim())return '';
 try{const u=new URL(raw,location.origin);return ['https:','http:','data:'].includes(u.protocol)?u.href:''}catch{return ''}}
function sampleData(){
 const state=scene()||{};
 const photos=Array.isArray(state.photos)?state.photos:[];
 // The first usable uploaded picture is the recipient's portrait.
 return {person:String(state.recipient||'Jasmina').trim().slice(0,55)||'Jasmina',
         photo:safeUrl(photos.find(p=>typeof p==='string'&&p.trim())||'')};
}
function eachName(g,choose){
 let n=0;
 const text=name.replace(/\s+/g,' ').trim()||'Jasmina';
 g.font='600 9.6px system-ui,-apple-system,Arial,sans-serif';
 g.textBaseline='middle';g.textAlign='left';
 const stride=Math.max(34,g.measureText(text).width+6);
 for(let y=49;y<=344;y+=11.3){
  const shift=(Math.round(y/11.3)%2)*stride/2;
  for(let x=25-shift;x<=379;x+=stride){
   const fill=choose(x,y,n);
   if(fill){g.fillStyle=fill;g.fillText(text,x,y)}
   n+=text.length
  }
 }
 return n;
}
function baseArt(){
 const {canvas:layer,g}=create();g.save();g.clip(heart);
 const bg=g.createLinearGradient(55,55,350,345);
 bg.addColorStop(0,'#5c2f4b');bg.addColorStop(.6,'#3e2038');bg.addColorStop(1,'#291629');
 g.fillStyle=bg;g.fill(heart);
 letters=eachName(g,(_x,_y,i)=>'rgba(255,228,230,'+(0.78+(i%9)*.012).toFixed(3)+')');
 g.restore();baseline=layer;
}
function portraitLayers(image){
 const {canvas:raw,g:r}=create();
 // Move the vertical focal point upwards to keep eyes near the center of the heart.
 const scale=Math.max(W/image.naturalWidth,H/image.naturalHeight)*1.08;
 const dw=image.naturalWidth*scale,dh=image.naturalHeight*scale;
 const focalY=.37;
 r.drawImage(image,(W-dw)/2,H*.47-dh*focalY,dw,dh);
 // Normalize highlights without destroying natural face/eye contrast.
 const {canvas:photo,g:p}=create(),pixels=r.getImageData(0,0,raw.width,raw.height).data;
 const corrected=p.createImageData(raw.width,raw.height);
 for(let i=0;i<pixels.length;i+=4){
  const R=pixels[i],G=pixels[i+1],B=pixels[i+2];
  corrected.data[i]=Math.min(255,R*1.02+11);
  corrected.data[i+1]=Math.min(255,G*.99+5);
  corrected.data[i+2]=Math.min(255,B*.98+14);
  corrected.data[i+3]=255;
 }
 p.putImageData(corrected,0,0);
 const {canvas:masked,g:m}=create();m.save();m.clip(heart);
 m.fillStyle='#f7e4e2';m.fill(heart);m.drawImage(photo,0,0,W,H);
 m.restore();photoCanvas=masked;
 const {canvas:lettersLayer,g:k}=create();
 k.save();k.clip(heart);
 // Sample brightness beneath every repeated full name rather than scattering single letters.
 eachName(k,(x,y)=>{
  const px=Math.min(raw.width-1,Math.max(0,Math.round((x+14)*dpr)));
  const py=Math.min(raw.height-1,Math.max(0,Math.round(y*dpr)));
  const off=(py*raw.width+px)*4;
  const lum=(pixels[off]*.299+pixels[off+1]*.587+pixels[off+2]*.114)/255;
  if(lum>.53)return 'rgba(55,24,45,.75)';
  return 'rgba(255,227,238,.78)';
 });
 k.restore();inkCanvas=lettersLayer;
}
function draw(){
 if(!baseline)return;
 canvas.width=baseline.width;canvas.height=baseline.height;
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);
 const p=Math.min(1,Math.max(0,Number(slider.value||0)/100));
 ctx.drawImage(baseline,0,0);
 if(photoCanvas){
  // Crossfade over the ENTIRE heart — no sharp vertical line at 30 or 50%.
  const fade=p*p*(3-2*p); // smoothstep
  ctx.save();ctx.globalAlpha=fade*.98;ctx.drawImage(photoCanvas,0,0);ctx.restore();
  if(inkCanvas){ctx.save();ctx.globalAlpha=fade*.52;ctx.drawImage(inkCanvas,0,0);ctx.restore()}
 }
 if(legacyRect)legacyRect.setAttribute('width',String(p*W));
 label.textContent=locale().instruction;
 output.textContent=p===1?locale().complete:Math.round(p*100)+'%';
 slider.setAttribute('aria-valuetext',Math.round(p*100)+'%');
 canvas.setAttribute('aria-label',name+' — '+letters+' letters, smooth photo portrait reveal');
}
async function loadPhoto(url){
 const id=++requestId;source='loading';let img,origin='demo';
 try{
  if(url){img=await canvasImage(url);origin='personal';sampleKind='personal'}
  else {img=await canvasImage(demoPhoto);sampleKind='remote-photo'}
 }catch{
  if(url){origin='unavailable';img=await canvasImage(fallbackData);sampleKind='fallback'}
  else{origin='demo';img=await canvasImage(fallbackData);sampleKind='fallback'}
 }
 if(id!==requestId)return;
 portraitLayers(img);source=origin;
 helper.textContent=source==='unavailable'?locale().error:source==='demo'?locale().sample:'';
 draw();
}
function update(){
 const data=sampleData(),differentName=data.person!==name,differentUrl=data.photo!==targetUrl;
 name=data.person;
 if(differentName||!baseline)baseArt();
 caption.textContent=(isLove?locale().love:locale().birthday)(name);
 if(differentUrl||!photoCanvas){targetUrl=data.photo;loadPhoto(targetUrl)}
 draw();
}
slider.addEventListener('input',draw);
const kind=isLove?'love':'birthday';
window.addEventListener('emora:'+kind+'-update',update);
window.addEventListener('emora:'+kind+'-finale',()=>{slider.value='0';update()});
window.addEventListener('emora:'+kind+'-replay',()=>{slider.value='0';draw()});
window.addEventListener('resize',draw,{passive:true});
const state={get ready(){return letters>1000&&!!photoCanvas},get namesPainted(){return letters},get portraitSource(){return source},get percent(){return Number(slider.value)},get recipient(){return name},get algorithm(){return 'smooth-photo-typography-v28'},get sampleKind(){return sampleKind}};
window.__EMORA_MOSAIC_V28__=state;
window.__EMORA_MOSAIC_V27__=state;
window[isLove?'__EMORA_HEART_V26__':'__EMORA_HEART_V23__']=state;
if(staleSvg)staleSvg.style.display='none';
update();
})();
