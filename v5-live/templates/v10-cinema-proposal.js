/* EMORA V10 · Cinema Proposal flagship layer.
   Premiere ticket → projector countdown/trailer → 3 film frames → voice-over → final scene. */
const ROOT=document.getElementById('experience');
const TEMPLATE=document.documentElement.dataset.template;
if(TEMPLATE!=='proposal-cinema'||!ROOT) throw new Error('Cinema Proposal layer loaded on the wrong template');

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n};
const clean=v=>typeof v==='string'?v.trim():'';
const FALLBACK='/assets/proposal-cinema.png';
let pendingVideo=null;
let custom={recipient:'',sender:'',movieTitle:'',captions:[],voiceText:'',finalQuestion:''};

function activeStage(){return $('#main > .v11-stage-active')?.id||''}
function advanceSafe(expected){
 const fire=()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',code:'ArrowRight',bubbles:true,cancelable:true}));
 fire();
 setTimeout(()=>{if(activeStage()===expected)fire()},reduced?80:950);
}
function spark(target,count=12){
 if(reduced||!target)return;
 const r=target.getBoundingClientRect(),wrap=el('span','cp-sparks');
 wrap.style.setProperty('--cx',(r.left+r.width/2)+'px');wrap.style.setProperty('--cy',(r.top+r.height/2)+'px');
 for(let i=0;i<count;i++){const p=el('i');const a=(Math.PI*2*i/count)+(Math.random()-.5)*.3,d=32+Math.random()*85;p.style.setProperty('--x',Math.cos(a)*d+'px');p.style.setProperty('--y',Math.sin(a)*d+'px');p.style.setProperty('--delay',(Math.random()*.12)+'s');wrap.append(p)}
 document.body.append(wrap);setTimeout(()=>wrap.remove(),1050);
}
function heading(inner,titleFallback,eyebrowFallback){
 return {
  eye:el('p','v10-eyebrow',clean($('.v10-eyebrow',inner)?.textContent)||eyebrowFallback),
  title:el('h2','v10-scene-title v10-reveal in',clean($('.v10-scene-title',inner)?.textContent)||titleFallback)
 };
}
function makeFilmstrip(){
 const strip=el('div','cp-strip');strip.setAttribute('aria-hidden','true');
 for(let i=0;i<14;i++)strip.append(el('i'));
 return strip;
}
function updateCustom(){
 $$('.cp-frame-caption').forEach((node,i)=>{const v=clean(custom.captions[i]);if(v)node.textContent=v});
 const voice=$('.cp-voice-text');if(voice&&clean(custom.voiceText))voice.textContent=custom.voiceText;
 const final=$('.cp-final-title');if(final&&clean(custom.finalQuestion))final.textContent=custom.finalQuestion;
 const movie=$('.cp-movie-title');if(movie)movie.textContent=clean(custom.movieTitle)||'Bizning filmimiz';
 const guest=$('.cp-ticket-name');if(guest)guest.textContent=clean(custom.recipient)||'SIZ UCHUN';
 const by=$('.cp-ticket-by');if(by)by.textContent=clean(custom.sender)?'PREMIERE BY '+custom.sender.toUpperCase():'EMORA PRIVATE PREMIERE';
}

function enhanceIntro(){
 const intro=$('.v10-proposal-cinema .v10-intro'),frame=intro&&$('.v10-visual-frame',intro);
 if(!intro||!frame||intro.dataset.cinemaFlagship==='1')return;
 intro.dataset.cinemaFlagship='1';
 const curtains=el('div','cp-intro-curtains');curtains.setAttribute('aria-hidden','true');curtains.append(el('i','left'),el('i','right'));
 const marquee=el('div','cp-marquee');marquee.setAttribute('aria-hidden','true');
 marquee.append(el('span','','EMORA'),el('b','','PRIVATE PREMIERE'),el('span','','ONE NIGHT · TWO HEARTS'));
 const beam=el('div','cp-projector-beam');beam.setAttribute('aria-hidden','true');
 frame.append(beam,curtains,marquee);
}

function enhanceTicket(){
 const sec=$('.v10-proposal-cinema #chapter-1'),inner=sec&&$('.v10-story-cover-inner',sec);
 if(!sec||!inner||sec.dataset.cinemaFlagship==='1')return;
 sec.dataset.cinemaFlagship='1';sec.classList.add('cp-ticket-stage');
 const ticket=el('div','cp-ticket');ticket.tabIndex=0;ticket.setAttribute('role','group');ticket.setAttribute('aria-label','Cinema Proposal premiere ticket');
 const stub=el('div','cp-ticket-stub');stub.append(el('small','','ADMIT'),el('strong','','01'),el('span','','PRIVATE'));
 const body=el('div','cp-ticket-body');body.append(el('small','cp-ticket-by','EMORA PRIVATE PREMIERE'),el('h1','cp-movie-title','Bizning filmimiz'),el('p','cp-ticket-name','SIZ UCHUN'));
 const meta=el('div','cp-ticket-meta');meta.innerHTML='<span>ROW ∞</span><span>SEAT 02</span><span>RATING ♡</span>';
 body.append(meta);ticket.append(stub,body);
 const copy=el('div','cp-ticket-copy');copy.append(el('p','v10-eyebrow','01 / PREMIERE TICKET'),el('h2','cp-ticket-heading','Bugun zalda faqat ikkita joy bor.'),el('p','cp-ticket-lead','Biletni uzganingdan keyin film boshlanadi. Oxirgi kadrni esa men ataylab yashirdim.'));
 const enter=el('button','v10-cta cp-ticket-enter','Biletni uzish  ✦');enter.type='button';
 enter.addEventListener('click',()=>{
  if(ticket.classList.contains('is-torn'))return;
  ticket.classList.add('is-torn');enter.disabled=true;enter.textContent='PREMIERE STARTING…';spark(ticket,9);setTimeout(()=>advanceSafe('chapter-1'),reduced?100:950);
 });
 copy.append(enter);inner.replaceChildren(copy,ticket);updateCustom();
}

function enhanceTrailer(){
 const sec=$('.v10-proposal-cinema #chapter-2'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.cinemaFlagship==='1')return;
 sec.dataset.cinemaFlagship='1';sec.classList.add('cp-trailer-stage');
 pendingVideo=$('.v10-video-box',inner)||pendingVideo;if(pendingVideo)pendingVideo.remove();
 const {eye,title}=heading(inner,'Premyera boshlanadi','02 / THE TRAILER');
 title.textContent='Chiroqlar o‘chadi. Film boshlanadi.';
 const booth=el('div','cp-projector');booth.setAttribute('aria-hidden','true');booth.innerHTML='<span class="cp-reel reel-a"></span><span class="cp-reel reel-b"></span><span class="cp-lens"></span><span class="cp-beam"></span>';
 const screen=el('div','cp-screen');
 const countdown=el('div','cp-countdown','3');
 const titleCard=el('div','cp-title-card');titleCard.hidden=true;titleCard.append(el('small','','EMORA ORIGINAL'),el('strong','cp-movie-title','Bizning filmimiz'),el('span','','A FILM ABOUT TWO PEOPLE'));
 const videoSlot=el('div','cp-video-slot');videoSlot.hidden=true;
 if(pendingVideo){pendingVideo.classList.add('cp-trailer-video');videoSlot.append(pendingVideo);pendingVideo=null}
 screen.append(countdown,titleCard,videoSlot,makeFilmstrip());
 const start=el('button','v10-cta cp-projector-start','Proyektorni yoqish  ▶');start.type='button';
 const next=el('button','v10-cta cp-trailer-next','Kadrlarimizni ko‘rish  →');next.type='button';next.hidden=true;next.addEventListener('click',()=>advanceSafe('chapter-2'));
 start.addEventListener('click',()=>{
  if(sec.classList.contains('is-playing'))return;sec.classList.add('is-playing');start.disabled=true;start.textContent='ROLLING…';
  const seq=['3','2','1'];let i=0;countdown.textContent=seq[0];
  const tick=()=>{i++;if(i<seq.length){countdown.textContent=seq[i];spark(screen,4);setTimeout(tick,reduced?90:620);return}
   setTimeout(()=>{countdown.hidden=true;if(videoSlot.children.length){videoSlot.hidden=false}else{titleCard.hidden=false}next.hidden=false;requestAnimationFrame(()=>next.classList.add('is-visible'));spark(screen,13)},reduced?80:650)};
  setTimeout(tick,reduced?90:620);
 });
 inner.replaceChildren(eye,title,el('p','v10-scene-intro cp-lead','Bu treyler mukammal film haqida emas. Bu — bizning haqiqiy hikoyamiz haqida.'),booth,screen,start,next);updateCustom();
}

function extractFrames(sec){
 const cards=$$('.v10-memory-card',sec).slice(0,3);
 return [0,1,2].map((_,i)=>{const card=cards[i],img=card&&$('img',card);return {src:img?.currentSrc||img?.src||FALLBACK,caption:clean(card&&$('.v10-memory-caption',card)?.textContent)||['Birinchi uchrashuv','Sevimli sahnam','Eng katta savol'][i]}})
}
function enhanceFrames(){
 const sec=$('.v10-proposal-cinema #chapter-3'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.cinemaFlagship==='1')return;
 const frames=extractFrames(sec);sec.dataset.cinemaFlagship='1';sec.classList.add('cp-frames-stage');
 const {eye,title}=heading(inner,'Bizning uchta sahnamiz','03 / OUR SCENES');title.textContent='Uchta kadr. Bitta hikoya.';
 const rail=el('div','cp-frame-rail');const opened=new Set();
 frames.forEach((f,i)=>{
  const card=el('button','cp-frame-card frame-'+(i+1));card.type='button';card.setAttribute('aria-label',(i+1)+'-film kadrini ochish');
  const media=el('span','cp-frame-media'),img=el('img','cp-frame-image');img.src=f.src;img.alt=f.caption;img.loading='lazy';img.onerror=()=>{img.onerror=null;img.src=FALLBACK};media.append(img,el('i','cp-frame-grain'));
  const info=el('span','cp-frame-info');info.append(el('small','','SCENE 0'+(i+1)),el('strong','cp-frame-caption',clean(custom.captions[i])||f.caption),el('span','cp-frame-play','▶ OPEN FRAME'));
  card.append(media,info);card.addEventListener('click',()=>{opened.add(i);card.classList.add('is-open');rail.dataset.active=String(i);spark(card,6);if(opened.size===3){continueBtn.hidden=false;requestAnimationFrame(()=>continueBtn.classList.add('is-visible'))}});rail.append(card);
 });
 const continueBtn=el('button','v10-cta cp-frames-next','Ovoz ortidagi gapni eshitish  →');continueBtn.type='button';continueBtn.hidden=true;continueBtn.addEventListener('click',()=>advanceSafe('chapter-3'));
 inner.replaceChildren(eye,title,el('p','v10-scene-intro cp-lead','Har bir kadrni och. Uchinchi sahnadan keyin filmning eng shaxsiy qismi boshlanadi.'),rail,continueBtn);updateCustom();
}

function enhanceVoice(){
 const sec=$('.v10-proposal-cinema #chapter-4'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.cinemaFlagship==='1')return;
 const existing=clean($('.v10-letter-body',inner)?.textContent);
 sec.dataset.cinemaFlagship='1';sec.classList.add('cp-voice-stage');
 const {eye,title}=heading(inner,'Ovoz ortidagi eng muhim gap','04 / VOICE OVER');title.textContent='Bu yerda ssenariy tugaydi. Men gapiraman.';
 const monitor=el('div','cp-voice-monitor');
 const lines=el('div','cp-sound-lines');for(let i=0;i<28;i++)lines.append(el('i'));
 const quote=el('blockquote','cp-voice-card');quote.append(el('span','cp-quote-mark','“'),el('p','cp-voice-text',clean(custom.voiceText)||existing||'Men seni faqat eng chiroyli sahnalarda emas, oddiy kunlarda ham yonimda tasavvur qilaman. Men uchun eng yaxshi film — sen bilan davom etadigan hayot.'),el('footer','cp-voice-sign',clean(custom.sender)||'Samimiyat bilan'));
 monitor.append(lines,quote);
 const next=el('button','v10-cta cp-voice-next','Final sahnaga o‘tish  →');next.type='button';next.addEventListener('click',()=>advanceSafe('chapter-4'));
 inner.replaceChildren(eye,title,el('p','v10-scene-intro cp-lead','Treyler tugadi. Endi faqat bitta sahna qoldi.'),monitor,next);updateCustom();
}

function enhanceFinale(){
 const sec=$('.v10-proposal-cinema #chapter-5'),inner=sec&&$('.v10-scene-inner',sec);
 if(!sec||!inner||sec.dataset.cinemaFlagship==='1')return;
 sec.dataset.cinemaFlagship='1';sec.classList.add('cp-final-stage');
 const eye=$('.v10-eyebrow',inner),title=$('.v10-scene-title',inner),copy=$('.v10-finale-copy',inner),actions=$('.v10-final-actions',inner),feedback=$('.v10-final-feedback',inner),again=$('.v10-final-repeat',inner);
 if(!title||!actions)return;title.classList.add('cp-final-title');if(clean(custom.finalQuestion))title.textContent=custom.finalQuestion;
 const curtain=el('div','cp-final-curtain');curtain.setAttribute('aria-hidden','true');curtain.append(el('i','left'),el('i','right'));
 const slate=el('div','cp-clapper');slate.innerHTML='<span class="top"></span><div><small>EMORA PICTURE</small><strong>FINAL SCENE</strong><p>TAKE: FOREVER · ROLL: 02</p></div>';
 const screen=el('div','cp-final-screen');screen.append(curtain,slate);
 const reveal=el('button','v10-cta cp-final-reveal','FINAL SCENE  ▶');reveal.type='button';
 const question=el('div','cp-question');question.hidden=true;if(eye)question.append(eye);question.append(title);if(copy)question.append(copy);question.append(actions);if(feedback)question.append(feedback);if(again)question.append(again);
 inner.replaceChildren(screen,reveal,question);
 reveal.addEventListener('click',()=>{
  if(sec.classList.contains('is-revealed'))return;sec.classList.add('is-revealed');reveal.disabled=true;reveal.textContent='THIS IS THE SCENE…';spark(screen,16);
  setTimeout(()=>{question.hidden=false;requestAnimationFrame(()=>question.classList.add('is-visible'));title.tabIndex=-1;title.focus({preventScroll:true})},reduced?120:1450);
 });
 const yes=$('.v10-cta',actions);if(yes)yes.addEventListener('click',()=>{sec.classList.add('is-accepted');spark(question,24)});
 updateCustom();
}

function enhanceAll(){
 enhanceIntro();enhanceTicket();enhanceTrailer();enhanceFrames();enhanceVoice();enhanceFinale();updateCustom();
 document.body.classList.add('cp-flagship-ready');
 window.__EMORA_CINEMA_PROPOSAL__={version:1,flagship:true,sequence:['ticket','countdown','trailer','frames','voiceover','final-scene','proposal']};
}

addEventListener('message',event=>{
 if(event.origin!==location.origin||!event.data||typeof event.data.type!=='string'||!event.data.type.startsWith('emora:')||!event.data.config)return;
 const cfg=event.data.config;custom={
  recipient:clean(cfg.recipient)||clean(cfg.name1),sender:clean(cfg.sender)||clean(cfg.name2),movieTitle:clean(cfg.memoryTitle)||clean(cfg.movieTitle),
  captions:Array.isArray(cfg.captions)?cfg.captions.slice(0,3).map(clean):[],voiceText:clean(cfg.voiceText)||clean(cfg.letter),finalQuestion:clean(cfg.finalQuestion)||clean(cfg.final)
 };
 requestAnimationFrame(()=>requestAnimationFrame(()=>{enhanceAll();updateCustom()}));
});

enhanceAll();
