/* EMORA Silk Heritage — dedicated, data-driven wedding experience. */
(function(){
 'use strict';
 const $=s=>document.querySelector(s),intro=$('#silkIntro');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const sample={bride:'Malika',groom:'Aziz',eventAt:'2027-06-25T18:00:00+05:00',venue:'The Garden, Toshkent',venueMap:'',invitation:'Hayotimizning eng qadrli kuni quvonchini siz bilan baham ko‘rishdan baxtiyormiz. To‘yimizga tashrif buyurishingizni kutamiz.',photos:[],music:'',program:[],guestName:''};
 let state={...sample},eventTime=new Date(sample.eventAt).getTime(),opened=false,shareUrl=location.href,guestName='',configured=false;
 const clean=v=>typeof v==='string'?v.trim():'';
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
  if(animated&&!reduced){intro.classList.add('opening');setTimeout(()=>{intro.classList.add('dismissed');intro.setAttribute('aria-hidden','true');$('#coupleNames')?.focus({preventScroll:true});addPetals(14)},2100)}
  else{intro.classList.add('opening','dismissed');intro.setAttribute('aria-hidden','true');$('#coupleNames')?.focus({preventScroll:true})}
 }
 $('#openInvite').addEventListener('click',()=>dismiss(true));
 $('#skipIntro').addEventListener('click',()=>dismiss(false));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!opened)dismiss(false)});
 function go(id){const target=$(id);if(target)target.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'})}
 $('#beginStory').onclick=()=>go($('#story').hidden?'#date':'#story');
 $('#backTop').onclick=()=>go('#opening');
 async function share(){
  try{if(navigator.share){await navigator.share({title:document.title,url:shareUrl});return}
   if(navigator.clipboard){await navigator.clipboard.writeText(shareUrl);for(const sel of ['#shareTop','#shareFinal'])set(sel,'Havola nusxalandi ✓')}
  }catch{}
 }
 $('#shareTop').onclick=share;$('#shareFinal').onclick=share;
 function tick(){
  const box=$('#countdown'),status=$('#dayStatus');
  if(!Number.isFinite(eventTime)){box.hidden=true;status.hidden=false;status.textContent='Sana tez orada e’lon qilinadi';return}
  const now=Date.now(),diff=eventTime-now;
  if(diff<0){box.hidden=true;status.hidden=false;status.textContent='Quvonchli kunimiz uchun rahmat!';return}
  if(diff<86400000&&new Date(eventTime).toDateString()===new Date(now).toDateString()){box.hidden=true;status.hidden=false;status.textContent='Bugun bizning kunimiz!';return}
  box.hidden=false;status.hidden=true;
  const t=Math.max(0,diff),vals=[Math.floor(t/86400000),Math.floor(t/3600000)%24,Math.floor(t/60000)%60,Math.floor(t/1000)%60];
  ['d','h','m','s'].forEach((key,i)=>set('#'+key,String(vals[i]).padStart(2,'0')));
 }
 function renderSchedule(items){
  const list=$('#timeline');list.replaceChildren();
  const valid=Array.isArray(items)?items.filter(x=>x&&typeof x==='object').slice(0,6):[];
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
  set('#introCardNames',b+' & '+g);set('#introSeal',mon);set('#heroInitials',mon);set('#finalInitials',mon);
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
  observeReveals();
 }
 function observeReveals(){
  const elements=[...document.querySelectorAll('.reveal:not(.visible)')];
  if(!('IntersectionObserver' in window)||reduced){elements.forEach(x=>x.classList.add('visible'));return}
  const obs=new IntersectionObserver(entries=>{for(const x of entries)if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}},{threshold:.13});
  elements.forEach(x=>obs.observe(x));
 }
 function calendar(){
  if(!Number.isFinite(eventTime))return;
  const utc=t=>new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const text=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//EMORA//Wedding Invitation//UZ','BEGIN:VEVENT','UID:'+Math.floor(eventTime)+'@emora','DTSTAMP:'+utc(Date.now()),'DTSTART:'+utc(eventTime),'DTEND:'+utc(eventTime+4*3600000),'SUMMARY:'+text(state.bride+' & '+state.groom+' — to‘y'),'LOCATION:'+text(state.venue),'DESCRIPTION:'+text(state.invitation),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a'),u=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
  a.href=u;a.download='emora-toy-taklifnomasi.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);
 }
 $('#addCalendar').onclick=calendar;
 $('#rsvpButton').onclick=()=>{if(parent!==window){parent.postMessage({type:'emora:open-rsvp'},location.origin)}else set('#rsvpHint','RSVP faqat sizga yuborilgan shaxsiy mehmon havolasida ishlaydi.');};
 $('#musicButton').onclick=async()=>{const a=$('#audio'),b=$('#musicButton');if(!a.src)return;if(!a.paused){a.pause();b.textContent='♪ Musiqa';b.setAttribute('aria-pressed','false');return}try{await a.play();b.textContent='Ⅱ To‘xtatish';b.setAttribute('aria-pressed','true')}catch{b.textContent='Musiqa ochilmadi'}};
 if('IntersectionObserver' in window){const sections=[...document.querySelectorAll('.chapter')],obs=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const i=sections.indexOf(e.target);$('#progressBar').style.width=((i+1)/sections.length*100)+'%'}},{threshold:.3});sections.forEach(s=>obs.observe(s))}
 window.addEventListener('message',e=>{
  if(e.origin!==location.origin||!e.data||typeof e.data.type!=='string'||!e.data.type.startsWith('emora:'))return;
  if(e.data.type==='emora:guest'){guestName=clean(e.data.name);announceGuest();return}
  if(e.data.config)apply(e.data.config);
 });
 if(parent!==window){try{shareUrl=parent.location.href}catch{}}
 tick();setInterval(tick,1000);observeReveals();
})();
//# sourceURL=silk-heritage.js
