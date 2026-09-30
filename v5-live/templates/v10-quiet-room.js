/* EMORA V10 · Quiet Room flagship layer.
   Door → lamp/accountability → listening choice → unsaid words/repair → respectful response. */
const ROOT=document.getElementById('experience');
const TEMPLATE=document.documentElement.dataset.template;
if(TEMPLATE!=='apology-quiet'||!ROOT) throw new Error('Quiet Room layer loaded on the wrong template');

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n};
const clean=v=>typeof v==='string'?v.trim():'';
const FALLBACK='/assets/apology-quiet.png';
let pendingVideo=null;
let earlyExit=false;
let custom={recipient:'',sender:'',roomTitle:'',mistake:'',repair:'',letter:'',finalQuestion:'',captions:[],photos:[]};

function activeStage(){return $('#main > .v11-stage-active')?.id||''}
function advanceSafe(expected){
 const fire=()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',code:'ArrowRight',bubbles:true,cancelable:true}));
 fire();setTimeout(()=>{if(activeStage()===expected)fire()},reduced?80:950);
}
function jumpToFinal(from='chapter-3'){
 earlyExit=true;updateFinalCopy();advanceSafe(from);
 setTimeout(()=>{if(activeStage()==='chapter-4')advanceSafe('chapter-4')},reduced?140:1020);
}
function softDust(target,count=9){
 if(reduced||!target)return;
 const r=target.getBoundingClientRect(),wrap=el('span','qr-dust-burst');
 wrap.style.setProperty('--dx0',(r.left+r.width/2)+'px');wrap.style.setProperty('--dy0',(r.top+r.height/2)+'px');
 for(let i=0;i<count;i++){
  const p=el('i'),a=Math.PI*2*i/count+(Math.random()-.5)*.5,d=22+Math.random()*65;
  p.style.setProperty('--x',Math.cos(a)*d+'px');p.style.setProperty('--y',Math.sin(a)*d+'px');p.style.setProperty('--delay',(Math.random()*.14)+'s');wrap.append(p);
 }
 document.body.append(wrap);setTimeout(()=>wrap.remove(),1150);
}
function hiddenCompat(copy){
 const compat=el('div','qr-compat');compat.setAttribute('aria-hidden','true');
 const title=el('span','');title.id='coverTitle';title.textContent=clean(custom.roomTitle)||'Shovqinsiz bir suhbat';
 compat.append(title,el('span','v10-cover-name',clean(custom.recipient)||'SIZ UCHUN'),el('span','v10-cover-desc','Faqat halollik va tinglashga tayyorlik.'));
 copy.append(compat);
}
function roomScene(cls=''){
 const room=el('div','qr-room '+cls);room.setAttribute('aria-hidden','true');
 const wall=el('i','qr-wall'),floor=el('i','qr-floor'),window=el('i','qr-window'),curtain=el('i','qr-curtain');
 const desk=el('div','qr-desk');desk.append(el('i','qr-desk-top'),el('i','qr-desk-leg left'),el('i','qr-desk-leg right'));
 const lamp=el('div','qr-lamp');lamp.append(el('i','qr-lamp-shade'),el('i','qr-lamp-neck'),el('i','qr-lamp-base'),el('i','qr-lamp-bulb'),el('i','qr-light-cone'));
 const paper=el('i','qr-paper');
 const chair=el('i','qr-chair');
 const dust=el('div','qr-dust');for(let i=0;i<18;i++){const p=el('i');p.style.setProperty('--x',(8+Math.random()*84)+'%');p.style.setProperty('--y',(8+Math.random()*70)+'%');p.style.setProperty('--d',(4+Math.random()*6)+'s');p.style.setProperty('--delay',(-Math.random()*6)+'s');dust.append(p)}
 room.append(wall,floor,window,curtain,chair,desk,lamp,paper,dust);return room;
}
function updateCustom(){
 const name=$('.qr-person');if(name)name.textContent=clean(custom.recipient)||'SIZ UCHUN';
 const honest=$('.qr-honest-text');if(honest)honest.textContent=clean(custom.mistake)||'Men qilgan ishim seni ranjitganini tan olaman. Buni bahona bilan yumshatmoqchi emasman.';
 const unsaid=$('.qr-unsaid-text');if(unsaid)unsaid.textContent=clean(custom.letter)||'Men bu gaplarni seni ko‘ndirish uchun emas, o‘zimning javobgarligimni aniq aytish uchun yozdim.';
 const repair=$('.qr-repair-text');if(repair)repair.textContent=clean(custom.repair)||'Keyingi safar gapirishdan oldin tinglayman va chegaralaringni hurmat qilaman.';
 const sender=$('.qr-sign');if(sender)sender.textContent=clean(custom.sender)||'Samimiyat bilan';
 const final=$('.qr-final-title');if(final)final.textContent=clean(custom.finalQuestion)||'Sening vaqting va qaroring muhim.';
 $$('.qr-listen-line').forEach((n,i)=>{const v=clean(custom.captions[i]);if(v)n.textContent=v});
 const photo=$('.qr-memory-photo');if(photo){const src=clean(custom.photos[0]);photo.src=src||FALLBACK;photo.hidden=!src;}
 updateFinalCopy();
}
function updateFinalCopy(){
 const copy=$('.qr-final-copy');if(!copy)return;
 copy.textContent=earlyExit?'Bu yerda to‘xtashingni tanlading. O‘qiganing uchun rahmat. Javob berishga majbur emassan.':'Uchala javob ham teng. Hozir, keyinroq yoki umuman javob bermaslik — qaroringni hurmat qilaman.';
}

function enhanceIntro(){
 const intro=$('.v10-apology-quiet .v10-intro'),frame=intro&&$('.v10-visual-frame',intro);
 if(!intro||!frame||intro.dataset.quietFlagship==='1')return;
 intro.dataset.quietFlagship='1';
 const wash=el('div','qr-intro-wash');wash.setAttribute('aria-hidden','true');
 wash.append(el('i','qr-intro-lamp'),el('i','qr-intro-table'),el('i','qr-intro-light'));
 frame.append(wash);
}
function enhanceGate(){
 const sec=$('.v10-apology-quiet #chapter-1'),inner=sec&&$('.v10-story-cover-inner',sec);
 if(!sec||!inner||sec.dataset.quietFlagship==='1')return;
 sec.dataset.quietFlagship='1';sec.classList.add('qr-gate');
 const copy=el('div','qr-gate-copy');
 copy.append(el('p','v10-eyebrow','01 / THE QUIET ROOM'),el('h1','qr-gate-title','Shovqinsiz bir suhbat.'),el('p','qr-gate-lead','Bu sahifada seni ko‘ndirishga urinmayman. Faqat aytilishi kerak bo‘lgan gaplar va sening tanloving uchun joy bor.'));
 const card=el('div','qr-room-card');card.append(el('small','','PRIVATE · NO PRESSURE'),el('strong','qr-person',clean(custom.recipient)||'SIZ UCHUN'),el('span','','Chiroq yoqilmaguncha hech narsa boshlanmaydi.'));
 const action=el('button','v10-cta qr-enter','Xonaga kirish  →');action.type='button';action.addEventListener('click',()=>{sec.classList.add('is-entering');action.disabled=true;softDust(action,7);setTimeout(()=>advanceSafe('chapter-1'),reduced?100:720)});
 copy.append(card,action);hiddenCompat(copy);
 const room=roomScene('qr-room-dark');inner.replaceChildren(copy,room);updateCustom();
}
function enhanceLamp(){
 const sec=$('.v10-apology-quiet #chapter-2'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.quietFlagship==='1')return;
 sec.dataset.quietFlagship='1';sec.classList.add('qr-lamp-stage');
 pendingVideo=$('.v10-video-box',inner)||null;if(pendingVideo)pendingVideo.remove();
 const room=roomScene('qr-room-lamp');
 const honest=el('div','qr-honest');honest.hidden=true;honest.append(el('small','','HAQIQIY GAP'),el('p','qr-honest-text',clean(custom.mistake)||'Men qilgan ishim seni ranjitganini tan olaman. Buni bahona bilan yumshatmoqchi emasman.'),el('span','qr-no-excuse','Bahona emas. Javobgarlik.'));
 const switcher=el('button','qr-lamp-switch','Chiroqni yoqish');switcher.type='button';switcher.setAttribute('aria-pressed','false');
 const next=el('button','v10-cta qr-lamp-next','Davom etish  →');next.type='button';next.hidden=true;next.addEventListener('click',()=>advanceSafe('chapter-2'));
 switcher.addEventListener('click',()=>{
  if(sec.classList.contains('is-lit'))return;sec.classList.add('is-lit');switcher.setAttribute('aria-pressed','true');switcher.textContent='Chiroq yoqildi';switcher.disabled=true;softDust(room,10);
  honest.hidden=false;next.hidden=false;requestAnimationFrame(()=>{honest.classList.add('is-visible');next.classList.add('is-visible')});
 });
 inner.replaceChildren(el('p','v10-eyebrow','02 / TURN ON THE LIGHT'),el('h2','v10-scene-title qr-scene-title','Avval aniq gap.'),el('p','v10-scene-intro qr-lead','Chiroqni yoqmaguningcha matn ko‘rinmaydi. Bu sahnada faqat xato tan olinadi — izoh emas.'),room,switcher,honest,next);updateCustom();
}
function enhanceListen(){
 const sec=$('.v10-apology-quiet #chapter-3'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.quietFlagship==='1')return;
 sec.dataset.quietFlagship='1';sec.classList.add('qr-listen-stage');
 const defaults=['Sening hislaringni inkor qilmayman.','Javobni hozir berishing shart emas.','Chegaralaringni hurmat qilaman.'];
 const panel=el('div','qr-listen-panel');
 defaults.forEach((d,i)=>{const row=el('div','qr-listen-row');row.append(el('span','qr-listen-num','0'+(i+1)),el('p','qr-listen-line',clean(custom.captions[i])||d));panel.append(row)});
 const choice=el('div','qr-listen-actions'),cont=el('button','qr-choice qr-continue','Davom etish'),stop=el('button','qr-choice qr-stop','Bu yetarli');cont.type=stop.type='button';
 cont.addEventListener('click',()=>advanceSafe('chapter-3'));stop.addEventListener('click',()=>jumpToFinal('chapter-3'));choice.append(cont,stop);
 inner.replaceChildren(el('p','v10-eyebrow','03 / LISTENING'),el('h2','v10-scene-title qr-scene-title','Endi tanlov senda.'),el('p','v10-scene-intro qr-lead','Davom etishni xohlasang — davom et. Shu yerning o‘zi yetarli bo‘lsa — shu yerda to‘xtash mumkin.'),panel,choice);updateCustom();
}
function enhanceUnsaid(){
 const sec=$('.v10-apology-quiet #chapter-4'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.quietFlagship==='1')return;
 sec.dataset.quietFlagship='1';sec.classList.add('qr-unsaid-stage');
 const paper=el('blockquote','qr-letter');paper.append(el('span','qr-letter-mark','“'),el('p','qr-unsaid-text',clean(custom.letter)||'Men bu gaplarni seni ko‘ndirish uchun emas, o‘zimning javobgarligimni aniq aytish uchun yozdim.'),el('footer','qr-sign',clean(custom.sender)||'Samimiyat bilan'));
 const repair=el('div','qr-repair');repair.append(el('small','','MEN BOSHQA NIMA QILAMAN'),el('p','qr-repair-text',clean(custom.repair)||'Keyingi safar gapirishdan oldin tinglayman va chegaralaringni hurmat qilaman.'));
 const media=el('div','qr-media');
 const photo=el('img','qr-memory-photo');photo.alt='Ixtiyoriy shaxsiy xotira';photo.loading='lazy';const src=clean(custom.photos[0]);photo.src=src||FALLBACK;photo.hidden=!src;photo.onerror=()=>{photo.hidden=true};media.append(photo);
 if(pendingVideo){pendingVideo.classList.add('qr-video');const label=el('div','qr-video-wrap');label.append(el('small','','IXTIYORIY VIDEO · FAQAT SIZ BOSSANGIZ ISHLAYDI'),pendingVideo);media.append(label);pendingVideo=null}
 if(media.children.length===1&&photo.hidden)media.hidden=true;
 const actions=el('div','qr-unsaid-actions'),next=el('button','qr-choice','Javob variantlariga o‘tish'),stop=el('button','qr-choice','Bu yerda to‘xtash');next.type=stop.type='button';next.addEventListener('click',()=>advanceSafe('chapter-4'));stop.addEventListener('click',()=>{earlyExit=true;updateFinalCopy();advanceSafe('chapter-4')});actions.append(next,stop);
 inner.replaceChildren(el('p','v10-eyebrow','04 / UNSAID WORDS'),el('h2','v10-scene-title qr-scene-title','Yozilmay qolgan gaplar.'),el('p','v10-scene-intro qr-lead','Bu yerda his emas, keyingi amal ham aniq aytiladi. Video bo‘lsa ham avtomatik boshlanmaydi.'),paper,repair,media,actions);updateCustom();
}
function responseFeedback(choice){
 const map={now:'Rahmat. Suhbatni sen boshlagan paytda men tinglashga tayyorman.',later:'Mayli. Hech qanday shoshilish yo‘q. Vaqtingni ol.',no:'Qaroringni hurmat qilaman. Bu javobni o‘zgartirishga bosim qilmayman.'};
 return map[choice]||'';
}
function enhanceFinale(){
 const sec=$('.v10-apology-quiet #chapter-5'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.quietFlagship==='1')return;
 sec.dataset.quietFlagship='1';sec.classList.add('qr-final-stage');
 const room=roomScene('qr-room-final');
 const content=el('div','qr-final-content');content.append(el('p','v10-eyebrow','05 / YOUR CHOICE'),el('h2','v10-scene-title qr-final-title',clean(custom.finalQuestion)||'Sening vaqting va qaroring muhim.'),el('p','qr-final-copy','Uchala javob ham teng. Hozir, keyinroq yoki umuman javob bermaslik — qaroringni hurmat qilaman.'));
 const actions=el('div','qr-response-actions');
 const options=[['now','Hozir gaplashamiz'],['later','Menga vaqt kerak'],['no','Javob bermayman']];
 const feedback=el('p','qr-response-feedback');feedback.setAttribute('aria-live','polite');
 options.forEach(([value,label])=>{const b=el('button','qr-response',label);b.type='button';b.dataset.choice=value;b.addEventListener('click',()=>{actions.dataset.selected=value;$$('.qr-response',actions).forEach(x=>x.classList.toggle('is-selected',x===b));feedback.textContent=responseFeedback(value);sec.classList.add('has-response');softDust(b,6);window.parent?.postMessage?.({type:'emora:quiet-response',choice:value,template:'apology-quiet-room'},location.origin)});actions.append(b)});
 const note=el('small','qr-change-note','Tanlovni istalgan payt shu sahifada o‘zgartirish mumkin.');content.append(actions,feedback,note);inner.replaceChildren(room,content);updateCustom();
}
function enhanceAll(){
 pendingVideo=null;
 enhanceIntro();enhanceGate();enhanceLamp();enhanceListen();enhanceUnsaid();enhanceFinale();updateCustom();
 document.body.classList.add('qr-flagship-ready');
 window.__EMORA_QUIET_ROOM__={version:1,flagship:true,sequence:['room','lamp','listen','unsaid','response'],pressureFree:true};
}

addEventListener('message',event=>{
 if(event.origin!==location.origin||!event.data||!event.data.config)return;
 if(typeof event.data.type!=='string'||!event.data.type.startsWith('emora:'))return;
 const cfg=event.data.config;
 custom={
  recipient:clean(cfg.recipient)||clean(cfg.name1),sender:clean(cfg.sender)||clean(cfg.name2),roomTitle:clean(cfg.memoryTitle),
  mistake:clean(cfg.mistake),repair:clean(cfg.repair),letter:clean(cfg.letter),finalQuestion:clean(cfg.finalQuestion)||clean(cfg.final),
  captions:Array.isArray(cfg.captions)?cfg.captions.map(clean).slice(0,3):[],photos:Array.isArray(cfg.photos)?cfg.photos.map(clean).slice(0,3):[]
 };
 earlyExit=false;
 requestAnimationFrame(()=>requestAnimationFrame(enhanceAll));
});

enhanceAll();
