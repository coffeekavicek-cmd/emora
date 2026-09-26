/* EMORA V10 · 14 distinct accessible cinematic experiences · Original local artwork. */
import {BY_KEY} from '/templates/v10-data.js?v=1';
const KEY=document.documentElement.dataset.template;
const T=BY_KEY[KEY];
const ROOT=document.getElementById('experience');
if(!T){ROOT.textContent='Shablon topilmadi.';throw Error('Unknown EMORA template '+KEY)}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const S={recipient:'',sender:'',bride:'',groom:'',intro:'',letter:'',final:'',eventAt:'',metAt:'',venue:'',venueMap:'',guestName:'',photos:[],program:[],music:'',video:'',memoryTitle:'',captions:[],blessing:'',repair:'',mistake:''};
let opened=false,guestName='',eventTime=NaN,editMode=new URLSearchParams(location.search).get('editor')==='1';
const $=s=>document.querySelector(s), create=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=String(txt);return x};
const safe=v=>typeof v==='string'?v.trim():'';
function publicAsset(v){try{const u=new URL(v,location.origin);return ['https:','http:'].includes(u.protocol)&&(!u.username&&!u.password)?u.href:null}catch{return null}}
function mapLink(v){const url=publicAsset(v);if(!url)return null;const u=new URL(url);return u.protocol==='https:'&&['google.com','maps.app.goo.gl','maps.apple.com','2gis.uz','2gis.com','yandex.com','yandex.ru','yandex.uz'].some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?url:null}
function title(){const labels={theatre:'Senga atalgan film',envelope:'Senga yozilgan maktub',galaxy:'Bizning kichik olam',garden:'Aziz mehmonimiz',naqsh:'Qadrli mehmonimiz',gift:'Yorqin kuningga',balloon:'Orzularing uchun',reel:'Sening xotiralaring',rain:'Eshitishingni istayman',ink:'Yurakdan uzr',lamp:'Sokin suhbat',ring:'Sen bilan bir umr',cinema:'Bizning filmimiz',sky:'Bir osmon ostida'};return T.group==='wedding'?((safe(S.bride)||'Malika')+' & '+(safe(S.groom)||'Aziz')):(safe(S.recipient)||labels[T.introType]||'Sen uchun')}
function picture(i){return publicAsset((Array.isArray(S.photos)&&S.photos[i])||'')||'/assets/'+T.art}
function text(id,v){const e=document.getElementById(id);if(e)e.textContent=v}
function jump(id){document.getElementById(id)?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'})}
function setImage(img,url){img.src=url;img.onerror=()=>{img.onerror=null;img.src='/assets/'+T.art}}
function info(k,v){const d=create('div','v10-information');d.append(create('span','v10-information-k',k),create('strong','v10-information-v',v));return d}
function sceneShell(id,n,heading,eyebrow){const sec=create('section','v10-scene scene-'+id);sec.id='chapter-'+n;const inner=create('div','v10-scene-inner');inner.append(create('p','v10-eyebrow',String(n).padStart(2,'0')+' / '+eyebrow),create('h2','v10-scene-title v10-reveal',heading));sec.append(inner);return [sec,inner]}
function image(url,cls,alt){const img=create('img',cls);img.alt=alt||'EMORA original tasvir';img.loading='lazy';setImage(img,url);return img}
function introMarkup(){
 const intro=create('div','v10-intro ritual-'+T.introType+(T.dark?' theme-dark':' theme-light'));
 intro.id='intro';intro.setAttribute('role','dialog');intro.setAttribute('aria-modal','true');intro.setAttribute('aria-label',T.name+' — kirish');
 const nav=create('div','v10-intro-nav'),brand=create('a','v10-logo','emora.');brand.href='#chapter-1';
 const edition=create('span','v10-edition',T.motif);
 const skip=create('button','v10-skip','O‘tkazib yuborish ↗');skip.type='button';skip.id='skipIntro';
 nav.append(brand,edition,skip);
 const layout=create('div','v10-intro-layout'),copy=create('div','v10-intro-copy');
 copy.append(create('span','v10-topline','EMORA · '+T.group.toUpperCase()+' · '+T.code),create('p','v10-guest','SIZ UCHUN ALOHIDA'));
 const headline=create('h1','v10-intro-headline',T.opening);headline.id='introHeadline';
 const name=create('p','v10-intro-name',title());name.id='introName';
 const desc=create('p','v10-intro-subtitle',T.subtitle);desc.id='introSubtitle';
 const btn=create('button','v10-cta',T.action+'   ↗');btn.id='openIntro';btn.type='button';
 copy.append(headline,name,desc,btn,create('p','v10-attribution','HANDCRAFTED DIGITAL MOMENTS · EMORA'));
 const art=create('div','v10-intro-art'),frame=create('div','v10-visual-frame');
 const photo=image('/assets/'+T.art,'v10-hero-image',T.name+' — original cinematic artwork');photo.fetchPriority='high';photo.loading='eager';
 const motif=create('div','v10-ritual-object');
 motif.setAttribute('aria-hidden','true');
 if(T.introType==='theatre')motif.innerHTML='<span class="velvet left"></span><span class="velvet right"></span><span class="light-beam"></span>';
 if(T.introType==='envelope')motif.innerHTML='<span class="pearl-seal">✦</span><span class="pearl-ribbon"></span>';
 if(T.introType==='galaxy'||T.introType==='sky')motif.innerHTML='<span class="orbit orbit-a"></span><span class="orbit orbit-b"></span><span class="orbit orbit-c"></span>';
 if(T.introType==='garden')motif.innerHTML='<i class="lantern lantern-a"></i><i class="lantern lantern-b"></i><i class="lantern lantern-c"></i>';
 if(T.introType==='naqsh')motif.innerHTML='<span class="naqsh-medallion">✺</span>';
 if(T.introType==='gift')motif.innerHTML='<span class="gift-ribbon">✧</span>';
 if(T.introType==='balloon')motif.innerHTML='<span class="balloon-one"></span><span class="balloon-two"></span><span class="balloon-three"></span>';
 if(T.introType==='reel'||T.introType==='cinema')motif.innerHTML='<span class="sprockets left"></span><span class="sprockets right"></span>';
 if(T.introType==='rain')motif.innerHTML='<span class="glass-mist"></span><span class="rain-streaks"></span>';
 if(T.introType==='ink')motif.innerHTML='<span class="ink-bloom"></span>';
 if(T.introType==='lamp')motif.innerHTML='<span class="lamplight"></span>';
 if(T.introType==='ring')motif.innerHTML='<span class="ring-glint">✧</span><span class="ring-glint second">✧</span>';
 frame.append(photo,motif,create('div','v10-image-border'),create('p','v10-image-caption','AN ORIGINAL EMORA EXPERIENCE · '+T.code));
 art.append(frame);layout.append(copy,art);
 intro.append(nav,layout,create('div','v10-intro-footer','EMORA   ✧   '+T.name+'   ✧   A STORY JUST FOR YOU'));
 skip.onclick=()=>dismiss(false);btn.onclick=()=>dismiss(true);
 if(T.introType==='rain'){art.addEventListener('pointermove',e=>{const b=frame.getBoundingClientRect();frame.style.setProperty('--wipe',Math.round(Math.max(0,Math.min(100,(e.clientX-b.left)/b.width*100)))+'%')},{passive:true})}
 return intro;
}
function dismiss(animate){
 if(opened)return;opened=true;const intro=$('#intro');intro.classList.add('opening');
 const duration=animate&&!reduced?1300:0;
 setTimeout(()=>{intro.classList.add('dismissed');intro.setAttribute('aria-hidden','true');$('#main').inert=false;$('.v10-chrome').inert=false;$('.v10-footer').inert=false;document.querySelector('#chapter-1 h1')?.focus({preventScroll:true});document.body.classList.add('intro-finished')},duration);
}
function paintCard(src,caption,n,cls){
 const c=create('div','v10-memory-card '+(cls||''));const real=publicAsset(Array.isArray(S.photos)?S.photos[n-1]:'');if(real){c.append(image(real,'v10-memory-image',caption))}else if(n<3){c.classList.add('editorial-crop-'+n);c.append(image('/assets/'+T.art,'v10-memory-image',T.name+' art detail'))}else{const abstract=create('div','v10-memory-abstract');abstract.append(create('span','v10-memory-symbol',T.group==='love'?'♡':T.group==='wedding'?'❦':T.group==='birthday'?'✦':T.group==='apology'?'✧':'◇'),create('span','v10-memory-art-text',T.motif));c.append(abstract)}
 const l=create('span','v10-memory-counter',String(n).padStart(2,'0'));const p=create('p','v10-memory-caption',caption);c.append(l,p);return c;
}
function namesFromConfig(cfg){
 return T.group==='wedding'?((safe(cfg.bride)||safe(cfg.name1)||'Malika')+' & '+(safe(cfg.groom)||safe(cfg.name2)||'Aziz')):(safe(cfg.recipient)||safe(cfg.name1)||'Sen uchun');
}
function caption(i){return (Array.isArray(S.captions)&&safe(S.captions[i]))||T.caption[i]||'Xotiramiz'}
function threeCards(type){
 const grid=create('div','v10-memory-layout layout-'+type);
 for(let i=0;i<3;i++)grid.append(paintCard(picture(i),caption(i),i+1,type));
 return grid;
}
function playVideo(){
 const box=create('div','v10-video-box'),v=publicAsset(S.video);
 if(!v)return null;const vid=create('video','v10-video');vid.src=v;vid.controls=true;vid.preload='none';vid.playsInline=true;box.append(vid);return box;
}
function timeInfo(sec,inner){
 const raw=safe(S.eventAt),date=new Date(raw);
 const valid=raw&&Number.isFinite(date.getTime());
 const block=create('div','v10-event-date');
 if(valid){eventTime=date.getTime();block.textContent=date.toLocaleDateString('uz-UZ',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Tashkent'});}
 else{eventTime=NaN;block.textContent=editMode?'Sanani muharrirda kiriting':'Sana tez orada e’lon qilinadi';}
 inner.append(block);
 if(valid){const countdown=create('div','v10-countdown');countdown.id='eventCountdown';const num=create('span','v10-countdown-numbers');num.id='counterNumbers';countdown.append(num,create('small','','KUN · SOAT · DAQIQA · SONIYA'));inner.append(countdown)}
 const add=create('button','v10-soft-button','Taqvimga qo‘shish +');add.type='button';add.disabled=!valid;
 add.onclick=()=>{if(!valid)return;const fmt=t=>new Date(t).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const cleanI=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//EMORA//PERSONAL INVITATION//UZ','BEGIN:VEVENT','UID:'+eventTime+'@emora','DTSTAMP:'+fmt(Date.now()),'DTSTART:'+fmt(eventTime),'DTEND:'+fmt(eventTime+14400000),'SUMMARY:'+cleanI(T.group==='wedding'?title()+' to‘yi':'Bayram'),'LOCATION:'+cleanI(S.venue),'END:VEVENT','END:VCALENDAR'].join('\r\n');const u=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));const a=create('a');a.href=u;a.download='emora-taklifnoma.ics';a.click();setTimeout(()=>URL.revokeObjectURL(u),1200)};
 inner.append(add);
}
function renderSegment(mode,n){
 const headings={
 projector:['Birinchi kadrdan boshlab','THE OPENING FRAME'],filmstrip:['Bizning eng qadrli kadrlarimiz','OUR FRAMES'],subtitles:['Senga aytolmagan gaplarim','THE WORDS'],
 seal:['Muhr ostidagi so‘zlar','OPEN THE LETTER'],polaroid:['Stoldagi uchta xotira','THREE MEMORIES'],letter:['Faqat sen uchun yozilgan','PERSONAL LETTER'],stars:['Uch yulduz — uchta sabab','THREE STARS'],orbit:['Sening atrofingdagi olam','OUR LITTLE GALAXY'],constellation:['Bir osmondagi so‘zlarimiz','A CONSTELLATION'],
 lantern:['Chiroqlar yongan oqshom','THE GARDEN'],schedule:['Har bir lahza qadrli','EVENING PROGRAM'],venue:['Qayerda uchrashamiz?','OUR MEETING PLACE'],medallion:['An’ana va muhabbat','OUR HERITAGE'],families:['Qadrli oilalar davrasida','FAMILY GREETINGS'],
 ribbon:['Sovg‘aning ichidagi tilak','THE GIFT'],wishes:['Sen uchun uchta tilak','THREE WISHES'],gallery:['Unutilmas lahzalar','MEMORY GALLERY'],balloons:['Uchta shar, uchta orzu','THREE DREAMS'],milestones:['Bir yilning go‘zal kadrlaridan','THE YEAR'],event:['Bayram tafsilotlari','CELEBRATION'],
 eras:['Kecha, bugun va ertaga','OUR FILM'],voices:['Senga atalgan tabrik','VOICES'],credits:['Davomi oldinda','THE CREDITS'],
 fog:['Bu so‘zlarni yashirmayman','BEYOND THE RAIN'],acknowledge:['Xatomni tan olaman','ACCOUNTABILITY'],ink:['Bir tomchi, bir haqiqat','THE INK'],accountability:['Bahona emas — javobgarlik','OWNING MY MISTAKE'],repair:['Buni qanday tuzataman?','THE NEXT STEP'],lamp:['Sukut ichidagi suhbat','A QUIET MOMENT'],listen:['Men seni tinglashga tayyorman','LISTENING'],
 box:['Eng qadrli sir','THE RING BOX'],memories:['Bu savolgacha bosib o‘tgan yo‘limiz','OUR STORY'],vows:['Mening va’dam','A PROMISE'],trailer:['Bizning filmimiz','THE TRAILER'],frames:['Uchta unutilmas kadr','THE SCENES'],voice:['Eng samimiy gapim','MY WORDS'],dusk:['Kun botishi — yangi boshlanish','AT DUSK'],dreams:['Uchta umumiy orzu','OUR FUTURE']
 };
 const [sec,inner]=sceneShell(mode,n,...(headings[mode]||[T.name,'EMORA MOMENT']));
 const lead=create('p','v10-scene-intro',S.memoryTitle||T.defaultNote);inner.append(lead);
 if(['filmstrip','polaroid','orbit','gallery','eras','frames','memories','milestones'].includes(mode)){inner.append(threeCards(mode));return sec}
 if(['stars','wishes','dreams','balloons','constellation'].includes(mode)){
  const sky=create('div','v10-interact-layout interact-'+mode);
  for(let i=0;i<3;i++){const b=create('button','v10-interact-point point-'+i,'✧');b.type='button';b.setAttribute('aria-label','Tilak '+(i+1)+' ni ochish');const captionText=caption(i);b.onclick=()=>{text('interactLabel-'+n,captionText);sky.dataset.active=String(i)};sky.append(b)}
  const word=create('p','v10-interact-label',T.defaultNote);word.id='interactLabel-'+n;sky.append(word);inner.append(sky);return sec
 }
 if(['seal','ribbon','ink','lamp','box','medallion','fog','lantern','projector','trailer','dusk'].includes(mode)){
  const media=create('div','v10-artifact artifact-'+mode);media.append(image('/assets/'+T.art,'v10-artifact-image',T.name));
  const veil=create('div','v10-artifact-veil');veil.setAttribute('aria-hidden','true');
  if(mode==='seal'||mode==='medallion')veil.textContent=mode==='seal'?'✦':'✺';
  if(mode==='box')veil.textContent='◇';if(mode==='lamp')veil.textContent='◉';
  if(mode==='ink')veil.textContent='•';
  if(mode==='ribbon')veil.textContent='✧';if(mode==='lantern')veil.textContent='✺';
  const action=create('button','v10-artifact-button','Ochish ✦');action.type='button';action.onclick=()=>{media.classList.toggle('activated');action.textContent=media.classList.contains('activated')?'Yana ko‘rish ↶':'Ochish ✦'};media.append(veil,action);inner.append(media);return sec
 }
 if(['subtitles','letter','accountability','acknowledge','repair','listen','vows','voice','voices','credits'].includes(mode)){
  const note=create('blockquote','v10-letter-panel');
  const txt=safe(S.letter)||safe(S.mistake)||T.defaultNote;
  const quote=create('p','v10-letter-body',mode==='repair'?(safe(S.repair)||T.defaultNote):txt);
  note.append(create('span','v10-letter-mark','“'),quote,create('p','v10-letter-sign',safe(S.sender)||'Samimiyat bilan'));
  inner.append(note);return sec
 }
 if(mode==='families'){inner.append(create('p','v10-serif-big',safe(S.blessing)||T.defaultNote));return sec}
 if(mode==='schedule'){const list=create('ol','v10-schedule-list');const data=Array.isArray(S.program)?S.program.filter(x=>x&&typeof x==='object').slice(0,6):[];if(data.length){for(const row of data){const li=create('li');li.append(create('time','',safe(row.time)||'—'),create('strong','',safe(row.title)||'Marosim'),create('p','',safe(row.note)||''));list.append(li)}}else list.append(create('li','v10-empty-state','Marosim dasturi tez orada e’lon qilinadi.'));inner.append(list);timeInfo(sec,inner);return sec}
 if(mode==='venue'){inner.append(create('h3','v10-serif-big',safe(S.venue)||'Manzil keyinroq e’lon qilinadi'));const link=mapLink(S.venueMap);if(link){const a=create('a','v10-soft-button','Xaritada ko‘rish ↗');a.href=link;a.target='_blank';a.rel='noopener noreferrer';inner.append(a)}else inner.append(create('p','v10-smallcopy','Xarita havolasi hozircha kiritilmagan.'));return sec}
 if(mode==='event'){timeInfo(sec,inner);if(safe(S.venue))inner.append(create('h3','v10-serif-big',S.venue));return sec}
 return sec
}
const IS_FINAL=new Set(['choice','rsvp','confetti','response','proposal']);
function finale(n){
 const [sec,inner]=sceneShell('finale',n,T.group==='wedding'?'Siz bilan bu kun yanada go‘zal.':(safe(S.final)||T.finalQuestion),'THE FINAL MOMENT');
 sec.classList.add('v10-finale',T.group);
 inner.append(create('p','v10-finale-copy',T.group==='apology'?'Javob berishga majbur emassan. Qaroringni hurmat qilaman.':T.group==='wedding'?'Qadrli mehmonimiz, tashrifingiz biz uchun baxt.':T.defaultNote));
 const choices=create('div','v10-final-actions'),yes=create('button','v10-cta',T.yes+' ↗'),later=create('button','v10-outline',T.later);
 yes.type='button';later.type='button';const out=create('p','v10-final-feedback');out.id='finalFeedback';out.setAttribute('aria-live','polite');
 const share=async()=>{const link=location.href.split('?')[0];try{if(navigator.share)await navigator.share({title:document.title,url:link});else if(navigator.clipboard){await navigator.clipboard.writeText(link);out.textContent='Havola nusxalandi ✓'}else out.textContent=link}catch{}};
 yes.onclick=()=>{
  if(T.group==='wedding'){if(guestName&&parent!==window){parent.postMessage({type:'emora:open-rsvp'},location.origin);out.textContent='Shaxsiy RSVP oynasi ochiladi.'}else out.textContent='Javob yuborish uchun ismingiz yozilgan shaxsiy mehmon havolasidan foydalaning.'}
  else if(T.group==='birthday'){sec.classList.add('celebrate');out.textContent='Yangi kuning muborak ✦'}
  else{out.textContent=T.group==='apology'?'Rahmat. Bu tanlov faqat shu ekranda ko‘rsatiladi; xabar yuborilmadi.':'Javobingiz faqat shu ekranda aks etdi; xabar yuborilmadi.';sec.classList.add('accepted')}
 };
 later.onclick=()=>{if(T.group==='wedding'||T.group==='birthday')share();else{sec.classList.remove('accepted');out.textContent='Qaroringni hurmat qilaman. Javob yuborilmadi.'}};
 choices.append(yes,later);inner.append(choices,out);
 const again=create('button','v10-final-repeat','Boshidan ko‘rish ↑');again.type='button';again.onclick=()=>jump('chapter-1');inner.append(again);
 return sec
}
function build(){
 const chrome=create('header','v10-chrome');const logo=create('a','v10-logo','emora.');logo.href='#chapter-1';
 chrome.append(logo,create('span','v10-chrome-edition',T.name.toUpperCase()+' / '+T.motif));
 const sound=create('button','v10-sound','♪ Musiqa');sound.id='soundToggle';sound.type='button';sound.hidden=true;sound.setAttribute('aria-pressed','false');
 const audio=create('audio');audio.id='audio';audio.preload='none';
 sound.onclick=async()=>{if(audio.paused){try{await audio.play();sound.textContent='Ⅱ To‘xtatish';sound.setAttribute('aria-pressed','true')}catch{sound.textContent='Musiqa ochilmadi'}}else{audio.pause();sound.textContent='♪ Musiqa';sound.setAttribute('aria-pressed','false')}};
 chrome.append(sound);const bar=create('div','v10-progress'),fill=create('i');fill.id='progress';bar.append(fill);
 const main=create('main','v10-main');main.id='main';
 const hero=create('section','v10-story-cover');hero.id='chapter-1';
 const inner=create('div','v10-story-cover-inner'),copy=create('div','v10-story-cover-copy');
 copy.append(create('p','v10-eyebrow',T.motif),create('h1','v10-cover-title',T.opening));
 copy.querySelector('h1').id='coverTitle';copy.querySelector('h1').tabIndex=-1;
 copy.append(create('p','v10-cover-name',title()),create('p','v10-cover-desc',T.subtitle));
 const go=create('button','v10-cta','Hikoyani davom ettirish ↓');go.type='button';go.onclick=()=>jump('chapter-2');copy.append(go);
 const art=create('div','v10-story-cover-art');art.append(image('/assets/'+T.art,'v10-story-cover-img',T.name+' original cover'));
 inner.append(copy,art);hero.append(inner);main.append(hero);
 for(let i=0;i<T.scenes.length;i++){
  const id=T.scenes[i];if(IS_FINAL.has(id)){main.append(finale(i+2));break}
  const segment=renderSegment(id,i+2);
  if(i===0){const clip=playVideo();if(clip)segment.querySelector('.v10-scene-inner')?.append(clip);
   if(T.group==='birthday'&&!T.scenes.includes('event')&&safe(S.eventAt)&&Number.isFinite(new Date(S.eventAt).getTime())){
    timeInfo(segment,segment.querySelector('.v10-scene-inner'));
   }
  }
  main.append(segment)
 }
 if(!T.scenes.some(x=>IS_FINAL.has(x)))main.append(finale(T.scenes.length+2));
 const footer=create('footer','v10-footer','EMORA · '+T.name+' · Barcha huquqlar himoyalangan');
 main.inert=true;chrome.inert=true;footer.inert=true;ROOT.replaceChildren(introMarkup(),chrome,bar,main,footer,audio);
 const sections=[...main.querySelectorAll('section')];
 if('IntersectionObserver' in window){
  const inObs=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.querySelectorAll('.v10-reveal').forEach(n=>n.classList.add('in'));const n=sections.indexOf(e.target);fill.style.width=((n+1)/sections.length*100)+'%'}},{threshold:.12});sections.forEach(sec=>inObs.observe(sec))
 }else document.querySelectorAll('.v10-reveal').forEach(x=>x.classList.add('in'));
 let prev=window.scrollY;window.addEventListener('scroll',()=>{const now=window.scrollY;if(now>prev+12)chrome.classList.add('compact');if(now<prev-12)chrome.classList.remove('compact');prev=now},{passive:true});
}
function tick(){
 if(!Number.isFinite(eventTime))return;
 const n=$('#counterNumbers');if(!n)return;
 const delta=eventTime-Date.now();
 if(delta<=0){n.textContent='Bayram kuni ✦';return}
 const pad=v=>String(v).padStart(2,'0');
 n.textContent=[Math.floor(delta/86400000),Math.floor(delta/3600000)%24,Math.floor(delta/60000)%60,Math.floor(delta/1000)%60].map(pad).join(' : ');
}
function patch(cfg){
 if(!cfg||typeof cfg!=='object')return;
 const co=cfg;
 const field=(name,previous)=>Object.prototype.hasOwnProperty.call(co,name)?safe(co[name]):previous;
 S.recipient=Object.prototype.hasOwnProperty.call(co,'recipient')?safe(co.recipient):field('name1',S.recipient);
 S.sender=Object.prototype.hasOwnProperty.call(co,'sender')?safe(co.sender):field('name2',S.sender);
 S.bride=Object.prototype.hasOwnProperty.call(co,'bride')?safe(co.bride):field('name1',S.bride);
 S.groom=Object.prototype.hasOwnProperty.call(co,'groom')?safe(co.groom):field('name2',S.groom);
 S.intro=Object.prototype.hasOwnProperty.call(co,'intro')?safe(co.intro):field('headline',S.intro);
 S.letter=field('letter',S.letter);S.final=field('final',S.final);
 S.eventAt=field('eventAt',S.eventAt);S.metAt=field('metAt',S.metAt);
 S.venue=field('venue',S.venue);S.venueMap=field('venueMap',S.venueMap);
 S.memoryTitle=field('memoryTitle',S.memoryTitle);S.mistake=field('mistake',S.mistake);
 S.repair=field('repair',S.repair);S.blessing=field('blessing',S.blessing);
 S.music=safe(co.music)||'';S.video=safe(co.video)||'';
 if(Array.isArray(co.photos))S.photos=co.photos.slice(0,3);
 if(Array.isArray(co.program))S.program=co.program.slice(0,6);
 if(Array.isArray(co.captions))S.captions=co.captions.slice(0,3);
 if(safe(co.guestName))guestName=co.guestName;
 text('introName',title());document.querySelector('.v10-cover-name').textContent=title();
 const personalized=safe(S.intro),lead=personalized||T.opening;text('introHeadline',lead);text('coverTitle',lead);
 if(T.group==='wedding'&&Object.prototype.hasOwnProperty.call(co,'invitation')){S.letter=safe(co.invitation);document.querySelector('.v10-cover-desc').textContent=S.letter||T.subtitle}
 if(safe(S.letter)&&T.group!=='wedding')document.querySelector('.v10-cover-desc').textContent=T.subtitle;
 if(guestName)document.querySelector('.v10-guest').textContent=guestName+' · SIZ UCHUN MAXSUS';
 const old=ROOT.querySelectorAll('.v10-scene,.v10-finale');old.forEach(x=>x.remove());
 const main=$('#main');
 for(let i=0;i<T.scenes.length;i++){const id=T.scenes[i];if(IS_FINAL.has(id)){main.append(finale(i+2));break}
 const segment=renderSegment(id,i+2);
 if(i===0){const clip=playVideo();if(clip)segment.querySelector('.v10-scene-inner')?.append(clip);
  if(T.group==='birthday'&&!T.scenes.includes('event')&&safe(S.eventAt)&&Number.isFinite(new Date(S.eventAt).getTime()))timeInfo(segment,segment.querySelector('.v10-scene-inner'))}
 main.append(segment)}
 if(!T.scenes.some(x=>IS_FINAL.has(x)))main.append(finale(T.scenes.length+2));
 document.querySelectorAll('.v10-reveal').forEach(e=>e.classList.add('in'));
 const a=$('#audio'),b=$('#soundToggle'),url=publicAsset(S.music);if(url){a.src=url;b.hidden=false}else{a.pause();a.removeAttribute('src');b.hidden=true}
 tick();
}
build();tick();setInterval(tick,1000);
addEventListener('keydown',e=>{if(e.key==='Escape'&&!opened)dismiss(false)});
addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||typeof e.data.type!=='string'||!e.data.type.startsWith('emora:'))return;if(e.data.type==='emora:guest'){guestName=safe(e.data.name);document.querySelector('.v10-guest').textContent=guestName?guestName+' · SIZ UCHUN MAXSUS':'SIZ UCHUN ALOHIDA';return}if(e.data.config)patch(e.data.config)});
document.title='EMORA · '+T.name;
window.__EMORA_V10_READY__={template:T.slug,group:T.group,version:10};
