/* V27: real photo-derived typographic portrait, not photo pasted onto text */
(()=>{
'use strict';
const canvas=document.getElementById('namesHeartCanvas'),slider=document.getElementById('heartSlider');
const rect=document.getElementById('heartRevealRect'),svg=document.getElementById('namesHeartPhoto');
const prompt=document.getElementById('heartSliderLabel'),output=document.getElementById('heartSliderValue');
const note=document.getElementById('namesHeartNote');
if(!canvas||!slider||!rect||!note)return;
const love=!!window.__EMORA_LOVE_V26__;
const api=()=>love?window.__EMORA_LOVE_V26__:window.__EMORA_BIRTHDAY_V19__;
const heart=new Path2D('M200 344 C171 318 43 240 27 149 C9 47 122 13 200 94 C278 13 391 47 373 149 C357 240 229 318 200 344 Z');
const dict={
 uz:{slide:'CHIZIQNI O‘NGGA SUR →',done:'Ana, yuragimdagi eng chiroyli inson ♡',sample:'Намунавий портрет. Ҳақиқий расмни Studio’да юкла.',birthday:n=>'“'+n+'” ismini 133 848 383 marta yozsam ham, sanga aytadigan gaplarim tugamaydi ♡',love:n=>'“'+n+'” ismini ming marta yozsam ham, sanga aytadigan gaplarim tugamaydi ♡'},
 ru:{slide:'ВЕДИ ПОЛЗУНОК ВПРАВО →',done:'Вот кто у меня в сердце ♡',sample:'Демо-портрет. Загрузить своё фото можно в Studio.',birthday:n=>'Имя «'+n+'» можно написать 133 848 383 раза… и всё равно не хватит слов ♡',love:n=>'Имя «'+n+'» можно написать тысячи раз… и всё равно не хватит слов ♡'},
 en:{slide:'SLIDE RIGHT TO REVEAL →',done:'And there you are — in my heart ♡',sample:'Sample portrait. Upload the real photo in Studio.',birthday:n=>'I could write “'+n+'” 133,848,383 times and still have more to say ♡',love:n=>'I could write “'+n+'” thousands of times and still have more to say ♡'}
};
const example='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="660" viewBox="0 0 600 660"><defs><linearGradient id="g" x2=".7" y2="1"><stop stop-color="#fff1e5"/><stop offset="1" stop-color="#dca4b5"/></linearGradient><linearGradient id="h" x2="1" y2="1"><stop stop-color="#25102a"/><stop offset="1" stop-color="#693450"/></linearGradient><linearGradient id="s" x2="1" y2=".7"><stop stop-color="#ffddc2"/><stop offset="1" stop-color="#c68985"/></linearGradient></defs><rect width="600" height="660" fill="url(#g)"/><circle cx="300" cy="270" r="250" fill="#f7d9d2"/><path d="M68 660Q85 418 139 227Q178 91 293 84Q450 60 480 222Q522 436 542 660Z" fill="url(#h)"/><path d="M50 660Q110 501 231 488H369Q491 507 558 660Z" fill="#6d3152"/><path d="M234 443L225 529Q291 571 372 521L357 445Z" fill="url(#s)"/><path d="M179 250Q172 132 299 115Q424 125 418 252Q409 427 300 489Q195 431 179 250" fill="url(#s)"/><path d="M165 339Q130 176 214 102Q311 55 398 133Q435 180 427 340Q405 228 369 172Q290 237 194 204Z" fill="url(#h)"/><path d="M222 297Q244 283 275 298M327 298Q349 280 379 297" stroke="#734452" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M223 308Q246 299 266 309M335 310Q356 299 379 309" stroke="#27192e" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M300 314Q291 352 297 367Q305 375 316 370" stroke="#b77776" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M266 406Q299 389 331 406Q301 437 266 406" fill="#a9556e"/><path d="M149 224Q116 369 171 463M427 205Q500 401 440 477" stroke="#53223e" stroke-width="46" fill="none" stroke-linecap="round"/><circle cx="181" cy="356" r="12" fill="#e2a870"/><circle cx="421" cy="352" r="12" fill="#e2a870"/></svg>';
const exampleUrl='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(example);
const help=document.createElement('p');help.id='portraitSourceNote';help.style.cssText='margin:0;font-size:10px;text-align:center;line-height:1.4;color:#e6c3d2;max-width:340px';
slider.closest('.heart-controls,.heart-reveal-controls')?.append(help);
if(svg)svg.style.display='none';
const oldPhoto=document.getElementById('heartRecipientPhoto');if(oldPhoto)oldPhoto.removeAttribute('href');
const dpr=Math.min(window.devicePixelRatio||1,2),ctx=canvas.getContext('2d');
if(!ctx)return;
let name='',selectedImage='',painted=0,version=0,base=null,portrait=null,source='demo';
const make=()=>{const can=document.createElement('canvas');can.width=400*dpr;can.height=380*dpr;const g=can.getContext('2d',{willReadFrequently:true});g.setTransform(dpr,0,0,dpr,0,0);return {can,g}};
function labels(){const l=api()?.lang;return dict[l]||dict.uz}
function input(){const a=api();return {name:String(a?.recipient||'Jasmina').trim().slice(0,46)||'Jasmina',image:a?.photos?.find(p=>typeof p==='string'&&p.trim())||''}}
function validImage(u){if(!u)return '';try{const parsed=new URL(u,location.href);return ['http:','https:'].includes(parsed.protocol)?parsed.href:''}catch{return ''}}
function load(src){return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(Error('photo unavailable'));img.src=src})}
function textGrid(g,color){
 const letters=name.replace(/\s+/g,' ')||'Jasmina';
 g.font='600 7.2px system-ui, Arial, sans-serif';g.textAlign='center';g.textBaseline='middle';
 let n=0;
 for(let y=47;y<346;y+=7.7){for(let x=31+(Math.floor(y)%2?3:0);x<373;x+=8.2){
   if(!g.isPointInPath(heart,x,y))continue;
   const char=letters[n%letters.length],fill=color(x,y,n);n++;
   if(fill){g.fillStyle=fill;g.fillText(char,x,y)}
 }}
 return n;
}
function makeBase(){
 const o=make(),g=o.g;g.save();g.clip(heart);
 const grad=g.createLinearGradient(40,45,370,340);grad.addColorStop(0,'#6c3552');grad.addColorStop(.6,'#48233e');grad.addColorStop(1,'#21152d');
 g.fillStyle=grad;g.fill(heart);
 painted=textGrid(g,(_x,_y,n)=>'rgba(255,228,232,'+(0.76+0.18*Math.abs(Math.sin(n*.31))).toFixed(2)+')');
 g.restore();base=o.can
}
function makePortrait(img){
 const scaled=make(),p=scaled.g,ratio=Math.max(400/img.naturalWidth,380/img.naturalHeight);
 const w=img.naturalWidth*ratio,h=img.naturalHeight*ratio;
 p.drawImage(img,(400-w)/2,(380-h)/2,w,h);
 const pixels=p.getImageData(0,0,scaled.can.width,scaled.can.height).data;
 const layer=make(),g=layer.g;g.save();g.clip(heart);g.fillStyle='#f9e8e1';g.fill(heart);
 textGrid(g,(x,y)=>{
  const px=Math.max(0,Math.min(scaled.can.width-1,Math.round(x*dpr)));
  const py=Math.max(0,Math.min(scaled.can.height-1,Math.round(y*dpr)));
  const idx=(py*scaled.can.width+px)*4;
  if(pixels[idx+3]<8)return '#d3adc0';
  const lum=(pixels[idx]*.299+pixels[idx+1]*.587+pixels[idx+2]*.114)/255;
  const c=Math.max(0,Math.min(1,(lum-.12)/.82));
  return 'rgb('+Math.round(27+c*198)+','+Math.round(13+c*168)+','+Math.round(31+c*166)+')';
 });
 g.restore();portrait=layer.can
}
function repaint(){
 if(!base)return;canvas.width=base.width;canvas.height=base.height;ctx.setTransform(1,0,0,1,0,0);
 ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(base,0,0);
 const pct=Math.max(0,Math.min(100,Number(slider.value)||0));
 if(portrait&&pct>0){ctx.save();ctx.beginPath();ctx.rect(0,0,canvas.width*pct/100,canvas.height);ctx.clip();ctx.drawImage(portrait,0,0);ctx.restore()}
 rect.setAttribute('width',String(pct*4));slider.setAttribute('aria-valuetext',pct+'%');
 output.textContent=pct===100?labels().done:pct+'%';
 canvas.setAttribute('aria-label',name+' — '+painted+' individual letters forming an image-sampled typographic portrait')
}
async function prepare(src){
 const id=++version;let img,gotPersonal=!!validImage(src);
 try{img=await load(gotPersonal?validImage(src):exampleUrl);if(id!==version)return;makePortrait(img)}
 catch{if(id!==version)return;gotPersonal=false;img=await load(exampleUrl);if(id!==version)return;makePortrait(img)}
 if(id!==version)return;source=gotPersonal?'personal':'demo';help.textContent=source==='demo'?labels().sample:'';repaint()
}
function update(){
 const v=input(),rename=v.name!==name,reimage=v.image!==selectedImage;
 name=v.name;selectedImage=v.image;
 const l=labels();note.textContent=(love?l.love:l.birthday)(name);prompt.textContent=l.slide;help.textContent=source==='demo'?l.sample:'';
 if(rename||!base){makeBase();if(portrait)prepare(selectedImage)}
 if(reimage||!portrait)prepare(selectedImage);
 repaint()
}
slider.addEventListener('input',repaint);
const scene=love?'love':'birthday';
window.addEventListener('emora:'+scene+'-update',update);
window.addEventListener('emora:'+scene+'-finale',()=>{slider.value=0;update()});
window.addEventListener('emora:'+scene+'-replay',()=>{slider.value=0;repaint()});
window.addEventListener('resize',repaint,{passive:true});
const exported={get ready(){return painted>1000&&!!portrait},get namesPainted(){return painted},get percent(){return Number(slider.value)},get recipient(){return name},get portraitSource(){return source},get algorithm(){return 'sampled-typographic-portrait-v27'}};
window.__EMORA_MOSAIC_V27__=exported;window[love?'__EMORA_HEART_V26__':'__EMORA_HEART_V23__']=exported;
update();
})();
