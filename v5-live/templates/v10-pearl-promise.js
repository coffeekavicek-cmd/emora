/* EMORA V10 · Pearl Promise flagship layer.
   Keeps the shared V10 runtime/accessibility contract, but gives proposal-pearl
   its own dramaturgy: closed-box tease → memories → reasons → vow/video → ring reveal. */
const ROOT=document.getElementById('experience');
const TEMPLATE=document.documentElement.dataset.template;
if(TEMPLATE!=='proposal-pearl'||!ROOT) throw new Error('Pearl Promise layer loaded on the wrong template');

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n};
const clean=v=>typeof v==='string'?v.trim():'';
const FALLBACK_ART='/assets/proposal-pearl.png';
let pendingVideo=null;
let custom={reasons:[],promiseText:'',finalQuestion:''};

function advance(){
 window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',code:'ArrowRight',bubbles:true,cancelable:true}));
}
function sparkle(target,count=12){
 if(reduced||!target)return;
 const r=target.getBoundingClientRect(),wrap=el('span','pp-sparkles');
 wrap.style.setProperty('--sx',(r.left+r.width/2)+'px');wrap.style.setProperty('--sy',(r.top+r.height*.45)+'px');
 for(let i=0;i<count;i++){
  const p=el('i');const a=Math.PI*2*i/count+(Math.random()-.5)*.35,d=28+Math.random()*74;
  p.style.setProperty('--px',Math.cos(a)*d+'px');p.style.setProperty('--py',Math.sin(a)*d+'px');p.style.setProperty('--delay',(Math.random()*.12)+'s');wrap.append(p);
 }
 document.body.append(wrap);setTimeout(()=>wrap.remove(),1200);
}
function sceneHeading(inner,fallbackTitle,fallbackEyebrow){
 const oldEye=clean($('.v10-eyebrow',inner)?.textContent)||fallbackEyebrow;
 const oldTitle=clean($('.v10-scene-title',inner)?.textContent)||fallbackTitle;
 const eye=el('p','v10-eyebrow',oldEye),title=el('h2','v10-scene-title v10-reveal in',oldTitle);
 return {eye,title};
}
function makeRingBox(extra=''){
 const stage=el('div','pp-box-scene '+extra);stage.setAttribute('aria-hidden','true');
 const glow=el('span','pp-box-glow');
 const shadow=el('span','pp-box-shadow');
 const box=el('div','pp-box3d');
 const lid=el('div','pp-box-lid');lid.append(el('span','pp-lid-velvet'),el('span','pp-lid-rim'));
 const base=el('div','pp-box-base');
 const pillow=el('span','pp-pillow');
 const ring=el('span','pp-ring');ring.append(el('i','pp-band'),el('i','pp-prong p1'),el('i','pp-prong p2'),el('i','pp-gem'),el('i','pp-gem-flare'));
 base.append(pillow,ring);box.append(lid,base);stage.append(glow,shadow,box);
 return stage;
}
function enhanceIntro(){
 const frame=$('.ritual-ring .v10-visual-frame');
 if(!frame||frame.dataset.pearlFlagship==='1')return;
 frame.dataset.pearlFlagship='1';
 const silk=el('div','pp-intro-silk');silk.setAttribute('aria-hidden','true');
 const box=makeRingBox('pp-intro-box');
 frame.append(silk,box);
 const art=$('.ritual-ring .v10-intro-art');
 if(art&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced){
  art.addEventListener('pointermove',e=>{
   const r=art.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5),y=((e.clientY-r.top)/r.height-.5);
   box.style.setProperty('--rx',(-y*7)+'deg');box.style.setProperty('--ry',(x*11)+'deg');
  },{passive:true});
  art.addEventListener('pointerleave',()=>{box.style.removeProperty('--rx');box.style.removeProperty('--ry')},{passive:true});
 }
}
function enhanceTease(){
 const sec=$('.v10-proposal-pearl .scene-box'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.pearlFlagship==='1')return;
 sec.dataset.pearlFlagship='1';sec.classList.add('pp-tease');
 pendingVideo=$('.v10-video-box',inner)||pendingVideo;
 if(pendingVideo)pendingVideo.remove();
 const {eye,title}=sceneHeading(inner,'Eng qadrli sir','02 / THE RING BOX');
 const lead=el('p','v10-scene-intro pp-lead','Hali savolni bermayman. Avval seni nega aynan shu lahzaga olib kelganimni ko‘rsatmoqchiman.');
 const stage=makeRingBox('pp-tease-box');
 const copy=el('p','pp-box-caption','Quti yopiq. Faqat unga tegib, hikoyani boshlang.');
 const action=el('button','v10-cta pp-peek-button','Qutiga tegish  ✦');action.type='button';
 action.addEventListener('click',()=>{
  if(stage.classList.contains('is-peeked'))return;
  stage.classList.add('is-peeked');action.disabled=true;action.textContent='Bu savolga hali biroz bor…';
  copy.textContent='Uzuk hozircha yashirin qoladi. Avval bizning uchta eng muhim xotiramiz.';
  sparkle(stage,10);setTimeout(advance,reduced?150:1350);
 });
 inner.replaceChildren(eye,title,lead,stage,copy,action);
}
function extractMemories(sec){
 const cards=$$('.v10-memory-card',sec).slice(0,3);
 return [0,1,2].map(i=>{
  const card=cards[i],img=card&&$('img',card);
  return {src:img?.currentSrc||img?.src||FALLBACK_ART,caption:clean(card&&$('.v10-memory-caption',card)?.textContent)||['Birinchi kun','Bizning yo‘limiz','Mening va’dam'][i]};
 });
}
function reasonTexts(memories){
 const defaults=[
  'Sen bilan oddiy kun ham xotiraga aylanadi.',
  'Yonimda o‘zim bo‘la oladigan inson — sensan.',
  'Kelajagimni tasavvur qilganimda, unda doim sen borsan.'
 ];
 return defaults.map((d,i)=>clean(custom.reasons[i])||d||memories[i]?.caption);
}
function enhanceMemories(){
 const sec=$('.v10-proposal-pearl .scene-memories'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.pearlFlagship==='1')return;
 const memories=extractMemories(sec),reasons=reasonTexts(memories);
 sec.dataset.pearlFlagship='1';sec.classList.add('pp-story');
 const {eye,title}=sceneHeading(inner,'Bu savolgacha bosib o‘tgan yo‘limiz','03 / OUR STORY');
 const lead=el('p','v10-scene-intro pp-lead','Har bir suratni och. Uchinchisidan keyin men senga nega aynan seni tanlaganimni aytaman.');
 const deck=el('div','pp-memory-deck');
 const opened=new Set();
 memories.forEach((m,i)=>{
  const card=el('button','pp-memory-card card-'+(i+1));card.type='button';card.setAttribute('aria-label',(i+1)+'-xotirani ochish');
  const media=el('span','pp-memory-media'),img=el('img','pp-memory-image');img.src=m.src;img.alt=m.caption;img.loading='lazy';img.onerror=()=>{img.onerror=null;img.src=FALLBACK_ART};media.append(img);
  const meta=el('span','pp-memory-meta');meta.append(el('small','pp-memory-index','0'+(i+1)),el('strong','pp-memory-caption',m.caption));card.append(media,meta);
  card.addEventListener('click',()=>{
   if(opened.has(i)){card.classList.toggle('is-front');return}
   opened.add(i);card.classList.add('is-open','is-front');deck.dataset.active=String(i);sparkle(card,6);
   if(opened.size===3){setTimeout(()=>{reasonsPanel.hidden=false;requestAnimationFrame(()=>reasonsPanel.classList.add('is-visible'));$('.pp-reason-button',reasonsPanel)?.focus({preventScroll:true})},reduced?50:650)}
  });deck.append(card);
 });
 const reasonsPanel=el('div','pp-reasons');reasonsPanel.hidden=true;
 reasonsPanel.append(el('p','v10-eyebrow','WHY YOU'),el('h3','pp-reasons-title','Nega aynan sen?'));
 const reasonList=el('div','pp-reason-list'),reasonOpened=new Set();
 reasons.forEach((reason,i)=>{
  const item=el('button','pp-reason-button');item.type='button';item.setAttribute('aria-expanded','false');
  item.append(el('span','pp-reason-num','0'+(i+1)),el('span','pp-reason-label','Sababni ochish'),el('strong','pp-reason-text',reason));
  item.addEventListener('click',()=>{
   reasonOpened.add(i);item.classList.add('is-open');item.setAttribute('aria-expanded','true');sparkle(item,5);
   if(reasonOpened.size===3){continueBtn.hidden=false;requestAnimationFrame(()=>continueBtn.classList.add('is-visible'))}
  });reasonList.append(item);
 });
 const continueBtn=el('button','v10-cta pp-story-continue','Va’damni eshitish  →');continueBtn.type='button';continueBtn.hidden=true;continueBtn.addEventListener('click',advance);
 reasonsPanel.append(reasonList,continueBtn);
 inner.replaceChildren(eye,title,lead,deck,reasonsPanel);
}
function enhanceVow(){
 const sec=$('.v10-proposal-pearl .scene-vows'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.pearlFlagship==='1')return;
 const existing=clean($('.v10-letter-body',inner)?.textContent);
 const vow=clean(custom.promiseText)||existing||'Men mukammal hayotni emas, sen bilan haqiqiy hayotni tanlayman — quvonchida ham, qiyin kunida ham yoningda bo‘lishni.';
 sec.dataset.pearlFlagship='1';sec.classList.add('pp-vow');
 const {eye,title}=sceneHeading(inner,'Mening va’dam','04 / A PROMISE');
 const lead=el('p','v10-scene-intro pp-lead','Bu qismni shoshilmay o‘qi. Quti keyingi sahnada ochiladi.');
 const paper=el('blockquote','pp-vow-paper');
 const mark=el('span','pp-vow-mark','“'),text=el('p','pp-vow-text',vow),sign=el('footer','pp-vow-sign',clean($('.v10-letter-sign',inner)?.textContent)||'Samimiyat bilan');
 paper.append(mark,text,sign);
 const footer=el('div','pp-vow-footer');
 const next=el('button','v10-cta','Eng muhim lahzaga  →');next.type='button';next.addEventListener('click',advance);footer.append(next);
 inner.replaceChildren(eye,title,lead,paper);
 if(pendingVideo){pendingVideo.classList.add('pp-vow-video');inner.append(pendingVideo);pendingVideo=null}
 inner.append(footer);
}
function enhanceFinale(){
 const sec=$('.v10-proposal-pearl.v10-app .v10-finale.proposal'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.pearlFlagship==='1')return;
 sec.dataset.pearlFlagship='1';sec.classList.add('pp-proposal-finale');
 const eye=$('.v10-eyebrow',inner),title=$('.v10-scene-title',inner),copy=$('.v10-finale-copy',inner),actions=$('.v10-final-actions',inner),feedback=$('.v10-final-feedback',inner),again=$('.v10-final-repeat',inner);
 if(!title||!actions)return;
 if(clean(custom.finalQuestion))title.textContent=custom.finalQuestion;
 const stage=el('div','pp-final-ring');
 const box=makeRingBox('pp-final-box');
 const whisper=el('p','pp-final-whisper','Endi qutini ochishing mumkin.');
 const open=el('button','v10-cta pp-open-ring','Qutini ochish  ✦');open.type='button';
 stage.append(box,whisper,open);
 const question=el('div','pp-question-wrap');question.hidden=true;
 title.classList.add('pp-question-title','in');copy?.classList.add('pp-question-copy');actions.classList.add('pp-question-actions');
 if(eye)question.append(eye);question.append(title);if(copy)question.append(copy);question.append(actions);if(feedback)question.append(feedback);if(again)question.append(again);
 inner.replaceChildren(stage,question);
 open.addEventListener('click',()=>{
  if(stage.classList.contains('is-open'))return;
  stage.classList.add('is-open');open.disabled=true;open.textContent='Ha, shu lahza…';sparkle(box,18);
  setTimeout(()=>{
   question.hidden=false;requestAnimationFrame(()=>question.classList.add('is-visible'));stage.classList.add('is-question');title.tabIndex=-1;title.focus({preventScroll:true});
  },reduced?120:1750);
 });
 const yes=$('.v10-cta',actions);if(yes)yes.addEventListener('click',()=>{stage.classList.add('is-accepted');sparkle(box,22)});
}
function enhanceAll(){
 enhanceIntro();enhanceTease();enhanceMemories();enhanceVow();enhanceFinale();
 document.body.classList.add('pp-flagship-ready');
 window.__EMORA_PEARL_PROMISE__={version:1,flagship:true,sequence:['tease','memories','reasons','vow','ring','proposal']};
}

addEventListener('message',event=>{
 if(event.origin!==location.origin||!event.data||typeof event.data.type!=='string'||!event.data.type.startsWith('emora:')||!event.data.config)return;
 const cfg=event.data.config;
 const rawReasons=Array.isArray(cfg.proposalReasons)?cfg.proposalReasons:Array.isArray(cfg.reasons)?cfg.reasons:[];
 custom.reasons=rawReasons.map(clean).filter(Boolean).slice(0,3);
 custom.promiseText=clean(cfg.promiseText)||clean(cfg.promise)||clean(cfg.letter);
 custom.finalQuestion=clean(cfg.finalQuestion)||clean(cfg.final);
 requestAnimationFrame(()=>requestAnimationFrame(enhanceAll));
});

enhanceAll();
