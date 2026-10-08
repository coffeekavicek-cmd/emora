/* EMORA V23 — personalized name-text heart (canvas, not thousands of DOM nodes). */
(()=>{
 'use strict';
 const canvas=document.getElementById('namesHeartCanvas');
 const svg=document.getElementById('namesHeartPhoto');
 const slider=document.getElementById('heartSlider');
 const reveal=document.getElementById('heartRevealRect');
 const photo=document.getElementById('heartRecipientPhoto');
 const note=document.getElementById('namesHeartNote');
 const prompt=document.getElementById('heartSliderLabel');
 if(!canvas||!slider||!reveal||!photo)return;
 const api=()=>window.__EMORA_BIRTHDAY_V19__;
 const heartPath=new Path2D('M200 344 C171 318 43 240 27 149 C9 47 122 13 200 94 C278 13 391 47 373 149 C357 240 229 318 200 344 Z');
 let name='',image='',timer=0,renderedNames=0;
 const strings={
  uz:{instruction:'CHIZIQNI O‘NGGA SUR →',counter:n=>'“'+n+'” ismini 133 848 383 marta yozsam ham… baribir senga aytadigan gaplarim tugamaydi ♡',reveal:'Mana, yuragimdagi eng chiroyli surat ♡'},
  ru:{instruction:'ВЕДИ ПОЛЗУНОК ВПРАВО →',counter:n=>'Я бы написал имя «'+n+'» 133 848 383 раза… и всё равно мне было бы мало. ♡',reveal:'Ну вот, кто у меня в самом сердце ♡'},
  en:{instruction:'SLIDE TO THE RIGHT →',counter:n=>'I could write “'+n+'” 133,848,383 times… and still have so much to tell you. ♡',reveal:'There you are. Right where my heart is. ♡'}
 };
 function safeImage(url){if(typeof url!=='string'||!url.trim())return '';try{const u=new URL(url,location.origin);return (['http:','https:'].includes(u.protocol)&&!u.username&&!u.password)?u.href:''}catch{return ''}}
 function language(){return ['uz','ru','en'].includes(api()?.lang)?api().lang:'uz'}
 function content(){const current=api();return {name:String(current?.recipient||'Jasmina').trim().slice(0,50)||'Jasmina',src:safeImage(current?.photos?.find(p=>typeof p==='string'&&p.trim()))||location.origin+'/assets/birthday-aurora.png'}}
 function seedNumber(n){let v=n|0;v=(v+0x6D2B79F5)|0;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return ((v^(v>>>14))>>>0)/4294967296}
 function draw(){
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  const scale=Math.min(window.devicePixelRatio||1,2);
  canvas.width=Math.floor(400*scale);canvas.height=Math.floor(380*scale);ctx.setTransform(scale,0,0,scale,0,0);
  ctx.clearRect(0,0,400,380);
  ctx.save();ctx.clip(heartPath);
  const gradient=ctx.createLinearGradient(80,60,345,365);
  gradient.addColorStop(0,'#ffe6d4');gradient.addColorStop(.5,'#e8a9b2');gradient.addColorStop(1,'#b96889');
  ctx.fillStyle=gradient;ctx.globalAlpha=.24;ctx.fill(heartPath);ctx.globalAlpha=.86;
  const label=name.slice(0,16)||'Jasmina';
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 5.7px system-ui, sans-serif';ctx.fillStyle='#fff0e1';
  renderedNames=0;
  for(let y=42;y<340;y+=6.6){
   for(let x=29;x<374;x+=10.5){
    const dx=(seedNumber(renderedNames+71)-.5)*5;
    const dy=(seedNumber(renderedNames+721)-.5)*4;
    if(ctx.isPointInPath(heartPath,x+dx,y+dy)){
     ctx.fillText(label,x+dx,y+dy,29);
     renderedNames++;
    }
   }
  }
  ctx.restore();
  canvas.setAttribute('aria-label',label+' — '+renderedNames+' names composing a heart');
 }
 function update(){
  const lang=language(),t=strings[lang]||strings.uz,c=content(),redrawn=c.name!==name;
  name=c.name;image=c.src;
  if(photo.getAttribute('href')!==image)photo.setAttribute('href',image);
  note.textContent=t.counter(name);prompt.textContent=t.instruction;
  if(redrawn||!renderedNames)draw();
  apply();
 }
 function apply(){
  const percent=Math.min(100,Math.max(0,Number(slider.value)||0));
  reveal.setAttribute('width',String(400*percent/100));
  slider.setAttribute('aria-valuetext',percent+'%');
  const t=strings[language()]||strings.uz;
  const output=document.getElementById('heartSliderValue');if(output)output.textContent=percent===100?t.reveal:percent+'%';
  svg.style.opacity='1';
 }
 slider.addEventListener('input',apply);
 window.addEventListener('emora:birthday-update',update);
 window.addEventListener('emora:birthday-finale',()=>{slider.value=0;update()});
 window.addEventListener('emora:birthday-replay',()=>{slider.value=0;apply()});
 window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(draw,120)},{passive:true});
 update();
 window.__EMORA_HEART_V23__={get ready(){return renderedNames>1000},get namesPainted(){return renderedNames},get percent(){return Number(slider.value)},get recipient(){return name}};
})();
