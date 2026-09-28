/* EMORA Silk Heritage — dedicated, data-driven wedding experience. */
(function(){
 'use strict';
 const $=s=>document.querySelector(s),intro=$('#silkIntro');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!document.querySelector('link[href*="/templates/silk-motion.css"]')){const motionSheet=document.createElement('link');motionSheet.rel='stylesheet';motionSheet.href='/templates/silk-motion.css?v=13';document.head.append(motionSheet);}
 if(!document.querySelector('link[href*="/templates/silk-stage.css"]')){const stageSheet=document.createElement('link');stageSheet.rel='stylesheet';stageSheet.href='/templates/silk-stage.css?v=1';document.head.append(stageSheet);}
 const sample={bride:'Malika',groom:'Aziz',eventAt:'2027-06-25T18:00:00+05:00',venue:'The Garden, Toshkent',venueMap:'',invitation:'Hayotimizning eng qadrli kuni quvonchini siz bilan baham ko‘rishdan baxtiyormiz. To‘yimizga tashrif buyurishingizni kutamiz.',photos:[],music:'',program:[],guestName:''};
 let state={...sample},eventTime=new Date(sample.eventAt).getTime(),opened=false,shareUrl=location.href,guestName='',configured=false,chapters=[],chapterIndex=0,chapterLocked=false,chapterToken=0;
 const clean=v=>typeof v==='string'?v.trim():'';
 function touchBurst(target,count=10){
  if(reduced||!target)return;const r=target.getBoundingClientRect(),wrap=document.createElement('span');wrap.className='silk-touch-burst';wrap.style.left=(r.left+r.width/2)+'px';wrap.style.top=(r.top+r.height/2)+'px';
  for(let i=0;i<count;i++){const p=document.createElement('i'),a=Math.PI*2*i/count,d=32+Math.random()*46;p.style.setProperty('--tx',Math.cos(a)*d+'px');p.style.setProperty('--ty',Math.sin(a)*d+'px');wrap.append(p)}
  document.body.append(wrap);setTimeout(()=>wrap.remove(),850);
 }
 function decorateSilkIntro(){
  if(reduced)return;const motes=document.createElement('div');motes.className='silk-motion-motes';motes.setAttribute('aria-hidden','true');
  for(let i=0;i<22;i++){const m=document.createElement('i');m.style.setProperty('--x',(4+Math.random()*92)+'%');m.style.setProperty('--y',(4+Math.random()*88)+'%');m.style.setProperty('--s',(1+Math.random()*3)+'px');m.style.setProperty('--o',(.12+Math.random()*.48).toFixed(2));m.style.setProperty('--d',(4+Math.random()*6)+'s');m.style.setProperty('--delay',(-Math.random()*6)+'s');m.style.setProperty('--dx',((Math.random()-.5)*45)+'px');m.style.setProperty('--dy',((Math.random()-.5)*42)+'px');motes.append(m)}
  intro.append(motes);const stage=$('#introStage');
  if(stage&&matchMedia('(hover:hover) and (pointer:fine)').matches)intro.addEventListener('pointermove',e=>{stage.style.setProperty('--mx',((e.clientX/innerWidth-.5)*9)+'px');stage.style.setProperty('--my',((e.clientY/innerHeight-.5)*7)+'px')},{passive:true});
 }
 let finalCelebrated=false;
 function celebrateSilkFinale(){
  if(reduced||finalCelebrated)return;finalCelebrated=true;const sec=$('#finale'),layer=document.createElement('div');layer.className='silk-final-petals';layer.setAttribute('aria-hidden','true');
  for(let i=0;i<30;i++){const p=document.createElement('i');p.style.setProperty('--x',(Math.random()*100)+'%');p.style.setProperty('--d',(3+Math.random()*2.7)+'s');p.style.setProperty('--delay',(Math.random()*.8)+'s');p.style.setProperty('--dx',((Math.random()-.5)*180)+'px');p.style.setProperty('--rot',((Math.random()-.5)*800)+'deg');layer.append(p)}
  sec.append(layer);setTimeout(()=>layer.remove(),6200);
 }
 function decorateChapterControls(){
  document.querySelectorAll('#story,#date,#schedule,#place,#rsvp').forEach(sec=>{if(sec.querySelector('.silk-stage-next'))return;const inner=sec.querySelector('.inner');if(!inner)return;const b=document.createElement('button');b.type='button';b.className='silk-stage-next';b.textContent=sec.id==='rsvp'?'Finale  →':'Davom etish  →';b.onclick=()=>stageNext();inner.append(b)});
 }
 function refreshStage(){
  chapters=[...document.querySelectorAll('#silkExperience > .chapter')].filter(x=>!x.hidden);
  chapterIndex=Math.min(chapterIndex,Math.max(0,chapters.length-1));
  chapters.forEach((sec,i)=>{const active=i===chapterIndex;sec.classList.toggle('silk-stage-active',active);sec.classList.toggle('is-active',active);sec.classList.remove('silk-stage-out','silk-stage-back');sec.setAttribute('aria-hidden',active?'false':'true');sec.inert=!active;if(active)sec.querySelectorAll('.reveal').forEach(x=>x.classList.add('visible'))});
  const bar=$('#progressBar');if(bar)bar.style.width=chapters.length?(((chapterIndex+1)/chapters.length)*100)+'%':'0%';
 }
 function showChapter(target,direction='forward'){
  refreshStage();const next=typeof target==='number'?target:chapters.findIndex(x=>x.id===String(target).replace(/^#/,''));
  if(next<0||next===chapterIndex||chapterLocked)return;const old=chapters[chapterIndex],incoming=chapters[next],token=++chapterToken;chapterLocked=true;
  if(old){old.classList.remove('silk-stage-active','is-active');old.classList.add(direction==='back'?'silk-stage-back':'silk-stage-out');old.inert=true;old.setAttribute('aria-hidden','true')}
  chapterIndex=next;incoming.classList.remove('silk-stage-out','silk-stage-back');incoming.classList.add('silk-stage-active','is-active');incoming.inert=false;incoming.setAttribute('aria-hidden','false');incoming.querySelectorAll('.reveal').forEach(x=>x.classList.add('visible'));
  const bar=$('#progressBar');if(bar)bar.style.width=(((chapterIndex+1)/chapters.length)*100)+'%';if(incoming.id==='finale')celebrateSilkFinale();
  setTimeout(()=>{if(token!==chapterToken)return;if(old)old.classList.remove('silk-stage-out','silk-stage-back');chapterLocked=false},reduced?10:850);
 }
 function stageNext(){if(chapterIndex<chapters.length-1)showChapter(chapterIndex+1,'forward')}
 function stagePrev(){if(chapterIndex>0)showChapter(chapterIndex-1,'back')}
 const set=(id,value)=>{const el=$(id);if(el&&value!==undefined&&value!==null)el.textContent=String(value)};
 const safeUrl=value=>{try{const u=new URL(value,location.origin);return u.protocol==='https:'?u.href:null}catch{return null}};
 const safeMap=value=>{const u=safeUrl(value);if(!u)return null;try{const h=new URL(u).hostname.toLowerCase();return ['google.com','maps.app.goo.gl','2gis.uz','2gis.com','yandex.com','yandex.ru','yandex.uz','maps.apple.com'].some(d=>h===d||h.endsWith('.'+d))?u:null}catch{return null}};
 function initials(a,b){return ((clean(a)[0]||'E')+(clean(b)[0]||'M')).toLocaleUpperCase('uz-UZ')}
 function announceGuest(){
  const label=guestName?guestName+', siz uchun maxsus':'Aziz mehmonimiz uchun';
  set('#introGuest',label.toLocaleUpperCase('uz-UZ'));
  set('#heroGuest',guestName?guestName+', SIZGA SHAXSIY TAKLIFNOMA':'AZIZ MEHMONIMIZGA');
  set('#rsvpHeading',guestName?guestName+', siz bilan uchrashamizmi?':'Biz bilan birga bo‘lasizmi?');
  set('#rsvpHint',guestName?'Javobingiz mezbonlarga yuboriladi.':'Mehmon nomingiz yozilgan shaxsiy havola orqali javob berishingiz mumkin.');
 }
 function addPetals(n){
  if(reduced)return;
  for(let i=0;i<n;i++){const p=document.createElement('i');p.className='petal';
   p.style.setProperty('--x',(Math.random()*100)+'vw');
   p.style.setProperty('--dx',((Math.random()-.5)*260)+'px');
   p.style.setProperty('--d',(4+Math.random()*3)+'s');
   document.body.appendChild(p);setTimeout(()=>p.remove(),8500)}
 }
 function dismiss(animated){
  if(opened)return;opened=true;
  const finish=()=>{intro.classList.add('dismissed');intro.setAttribute('aria-hidden','true');refreshStage();$('#coupleNames')?.focus({preventScroll:true})};
  if(animated&&!reduced){intro.classList.add('opening');setTimeout(()=>{finish();addPetals(8)},1350)}
  else{intro.classList.add('opening');finish()}
 }
 decorateSilkIntro();
 $('#openInvite').addEventListener('click',()=>{touchBurst($('#openInvite'),12);dismiss(true)});
 $('#skipIntro').addEventListener('click',()=>dismiss(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!opened){dismiss(false);return}if(!opened)return;const tag=document.activeElement?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();stageNext()}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();stagePrev()}});
 function go(id){refreshStage();const idx=chapters.findIndex(x=>x.id===String(id).replace(/^#/,''));if(idx>=0)showChapter(idx,idx<chapterIndex?'back':'forward')}
 $('#beginStory').onclick=()=>go($('#story').hidden?'#date':'#story');
 $('#backTop').onclick=()=>go('#opening');
 async function share(){
  try{if(navigator.share){await navigator.share({title:document.title,url:shareUrl});return}
   if(navigator.clipboard){await navigator.clipboard.writeText(shareUrl);for(const sel of ['#shareTop','#shareFinal'])set(sel,'Havola nusxalandi ✓')}
  }catch{}
 }
 $('#shareTop').onclick=()=>{touchBurst($('#shareTop'),8);share()};$('#shareFinal').onclick=()=>{touchBurst($('#shareFinal'),10);celebrateSilkFinale();share()};
 function tick(){
  const box=$('#countdown'),status=$('#dayStatus');
  if(!Number.isFinite(eventTime)){$('#addCalendar').hidden=true;box.hidden=true;status.hidden=false;status.textContent='Sana tez orada e’lon qilinadi';return}
  $('#addCalendar').hidden=false;const now=Date.now(),diff=eventTime-now;
  if(diff<0){box.hidden=true;status.hidden=false;status.textContent='Quvonchli kunimiz uchun rahmat!';return}
  if(diff<86400000&&new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Tashkent'}).format(new Date(eventTime))===new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Tashkent'}).format(new Date(now))){box.hidden=true;status.hidden=false;status.textContent='Bugun bizning kunimiz!';return}
  box.hidden=false;status.hidden=true;
  const t=Math.max(0,diff),vals=[Math.floor(t/86400000),Math.floor(t/3600000)%24,Math.floor(t/60000)%60,Math.floor(t/1000)%60];
  ['d','h','m','s'].forEach((key,i)=>set('#'+key,String(vals[i]).padStart(2,'0')));
 }
 function renderSchedule(items){
  const list=$('#timeline');list.replaceChildren();
  const valid=Array.isArray(items)?items.filter(x=>x&&typeof x==='object').slice(0,6):[];
  if(configured&&!valid.length){$('#schedule').hidden=true;return}$('#schedule').hidden=false;
  const agenda=valid.length?valid:[
   {time:'17:00',title:'Mehmonlarni kutib olish',note:'Kelgan mehmonlar bilan iliq uchrashuv.'},
   {time:'18:00',title:'Nikoh marosimi',note:'Yangi hayotimizning tantanali boshlanishi.'},
   {time:'19:00',title:'Bayram oqshomi',note:'Tabriklar, ziyofat va quvonch.'}
  ];
  for(const item of agenda){const li=document.createElement('li'),tm=document.createElement('time'),h=document.createElement('strong'),p=document.createElement('p');
   tm.textContent=clean(item.time)||'—';h.textContent=clean(item.title)||'Marosim';p.textContent=clean(item.note)||clean(item.description)||'';
   li.append(tm,h,p);list.append(li)}
 }
 function renderStory(cfg){
  const imgs=Array.isArray(cfg.photos)?cfg.photos.filter(v=>safeUrl(v)).slice(0,3):[];
  const points=Array.isArray(cfg.milestones)?cfg.milestones.filter(v=>v&&typeof v==='object').slice(0,3):[];
  if(configured&&!imgs.length&&!points.length){$('#story').hidden=true;return}
  $('#story').hidden=false;
  const dest=$('#storyPoints');dest.replaceChildren();
  const templates=points.length?points:[
   {title:'Birinchi uchrashuv',note:'Hammasi bir uchrashuvdan boshlandi.'},
   {title:'Bizning baxtimiz',note:'Birga o‘tkazgan bebaho lahzalar.'},
   {title:'Yangi hayotimiz',note:'Oldimizda eng go‘zal kunlar turibdi.'}
  ];
  templates.forEach((m,i)=>{const row=document.createElement('div');row.className='story-point reveal';
   const k=document.createElement('small'),h=document.createElement('strong'),p=document.createElement('p');
   k.textContent=String(i+1).padStart(2,'0')+' / XOTIRA';
   h.textContent=clean(m.title)||'Unutilmas lahza';p.className='lead';p.style.cssText='margin:4px 0 0;font-size:13px';p.textContent=clean(m.note)||clean(m.text)||'';
   row.append(k,h,p);
   const photo=safeUrl(imgs[i]);if(photo){const image=document.createElement('img');image.src=photo;image.alt=clean(m.title)||'Juftlik xotirasi';image.loading='lazy';image.style.cssText='width:100%;height:170px;object-fit:cover;border-radius:8px;margin-top:12px';row.append(image)}
   dest.append(row)});
 }
 function apply(cfg){
  if(!cfg||typeof cfg!=='object')return;
  configured=true;state={...sample,...cfg};
  const b=clean(state.bride)||'Malika',g=clean(state.groom)||'Aziz',mon=initials(b,g);
  document.title='EMORA · '+b+' & '+g+' · Silk Heritage';
  set('#introCardNames',b+' & '+g);set('#stageNames',b+' & '+g);set('#introSeal',mon);set('#heroInitials',mon);set('#finalInitials',mon);
  const h=$('#coupleNames');h.replaceChildren(document.createTextNode(b+' '));const and=document.createElement('i');and.textContent='&';and.style.cssText='font-weight:400;color:#b59a70';h.append(and,document.createTextNode(' '+g));h.tabIndex=-1;
  set('#finalNames',b+' & '+g);set('#heroInvitation',clean(state.invitation)||sample.invitation);
  set('#finalBlessing',clean(state.blessing)||'Baxtimizga sherik bo‘lishingiz biz uchun eng katta sovg‘a. Uchrashguncha!');
  set('#venueName',clean(state.venue)||'Manzil keyinroq e’lon qilinadi');
  const map=safeMap(state.venueMap),link=$('#mapLink');
  link.hidden=!map;if(map)link.href=map;else link.removeAttribute('href');
  eventTime=NaN;const raw=clean(state.eventAt);
  if(raw){const dt=new Date(raw);if(Number.isFinite(dt.getTime())){eventTime=dt.getTime();set('#eventDate',dt.toLocaleDateString('uz-UZ',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Tashkent'}));set('#eventTime',dt.toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Tashkent'})+' · Toshkent vaqti')}}
  if(!Number.isFinite(eventTime)){set('#eventDate','Sana tez orada');set('#eventTime','')}
  guestName=clean(state.guestName)||guestName;announceGuest();tick();renderSchedule(state.program||state.schedule);
  renderStory(state);
  const music=safeUrl(state.music),control=$('#musicButton'),audio=$('#audio');
  if(music){audio.src=music;control.hidden=false}else{audio.pause();audio.removeAttribute('src');control.hidden=true}
  const cover=safeUrl(state.cover);
  if(cover){$('.hero-memento').style.backgroundImage='linear-gradient(#f9f0e42b,#f9f0e46b),url("'+cover.replace(/"/g,'%22')+'")';$('.hero-memento').style.backgroundSize='cover';$('.hero-memento .floral').style.opacity='.4'}
  decorateChapterControls();refreshStage();
 }
 function observeReveals(){decorateChapterControls();refreshStage()}
 function calendar(){
  if(!Number.isFinite(eventTime))return;
  const utc=t=>new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const text=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//EMORA//Wedding Invitation//UZ','BEGIN:VEVENT','UID:'+Math.floor(eventTime)+'@emora','DTSTAMP:'+utc(Date.now()),'DTSTART:'+utc(eventTime),'DTEND:'+utc(eventTime+4*3600000),'SUMMARY:'+text(state.bride+' & '+state.groom+' — to‘y'),'LOCATION:'+text(state.venue),'DESCRIPTION:'+text(state.invitation),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a'),u=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
  a.href=u;a.download='emora-toy-taklifnomasi.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);
 }
 $('#addCalendar').onclick=calendar;
 $('#rsvpButton').onclick=()=>{if(parent!==window&&guestName){parent.postMessage({type:'emora:open-rsvp'},location.origin)}else set('#rsvpHint','RSVP faqat sizga yuborilgan shaxsiy mehmon havolasida ishlaydi.');};
 $('#musicButton').onclick=async()=>{const a=$('#audio'),b=$('#musicButton');if(!a.src)return;if(!a.paused){a.pause();b.textContent='♪ Musiqa';b.setAttribute('aria-pressed','false');return}try{await a.play();b.textContent='Ⅱ To‘xtatish';b.setAttribute('aria-pressed','true')}catch{b.textContent='Musiqa ochilmadi'}};
 decorateChapterControls();refreshStage();
 window.addEventListener('message',e=>{
  if(e.origin!==location.origin||!e.data||typeof e.data.type!=='string'||!e.data.type.startsWith('emora:'))return;
  if(e.data.type==='emora:guest'){guestName=clean(e.data.name);announceGuest();return}
  if(e.data.config)apply(e.data.config);
 });
 if(parent!==window){try{shareUrl=parent.location.origin+parent.location.pathname}catch{}}
 renderSchedule(sample.program);renderStory(sample);tick();setInterval(tick,1000);decorateChapterControls();refreshStage();
})();
//# sourceURL=silk-heritage.js
