
'use strict';
/* EMORA / Signature Experiences. The public site and the Creator Studio use the same scenes. */
(function(){
 const key=document.documentElement.dataset.template||'love-rose';
 const artwork={"love-rose":"https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/83519852-0ec2-4ae1-ba7b-9554bbcaebdc/5ddf9823-eb2e-4fbb-b24e-607c34355867/A_cinematic_romantic_invitation_hero_for_a_premium_interacti.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMzczYThiMjY0YmQ5NTlhOSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDU4MzU5MH0.w_OXXHkRL64GKF4oegvuLTPAc8JMDjl-oiV-d1omB6I","love-pearl":"https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/bdcd566a-eb9d-4ab8-9fb1-939a6ead5a2c/5eda8b86-189b-4a9c-85c8-cddbe63c11ac/A_bright_romantic_editorial_invitation_scene_for_a_premium_l.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiZWVhYWMwNTViYmI0M2ZhOSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDU5OTc2NX0.L_QKHq_HxeOZdnEc80b0WwOxMeG-KrPEtuVrcr6AGsA","wedding-silk":"https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/ace7e109-56cb-4acb-af80-f4a5b2af5183/d3108dfe-585c-4c69-9e8e-91e519fa4c5e/A_premium_wedding_invitation_opening_scene_with_folded_ivory.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYmI1MTBjYWUwOGFlMjA5ZCIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDU3NzQ1NH0.nQcpB_QXgG9gccUIV061BWbzTDmEI-YPZmqWm8zUQ7M","wedding-garden":"https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/e3add90c-16e6-4c29-85bf-1373e6f7e26a/e730109b-081b-4d4f-88de-490f0aec7f93/A_luxurious_night_garden_wedding_invitation_opening_scene__D.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjEwMTIzOTk1MDQxMWY5ZiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDU4NzgwMX0.YTuWyNbHluseClmyaXw9Txv-2m8sNCXbPa0xPB7lTVM","birthday-aurora":"https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/9f704efa-49ad-4b64-b022-8d2e167d43cd/01e67d7f-e4d0-4a45-8ed2-a9162c453073/A_joyful_premium_birthday_invitation_scene__Warm_peach__apri.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNzk4NTkxMzljOGZkMWRkZSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDU2OTQwMX0.rsiVNiPivaPuMjYYq3uXTStgV8F7Bws1ph_jb-Fg1Q8","apology-rain":"https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/08738b24-fc16-4412-be52-7d7f243230ab/78a912dc-0df6-41b9-8bfd-d2c2371d6156/A_sophisticated_emotional_apology_story_opening_scene__Rain_.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiMWU2YjMyNmEwZGUzNTA2YiIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDUzMDUzOH0.AWlKN7okYIUaruMvOu7MzmhgwY8NLj9w9nyoizqI8PE","proposal-pearl":"https://dnznrvs05pmza.cloudfront.net/gemini/gemini-3-pro-image/images/997e449a-35f8-4d2b-8bda-48d8ebb995b4/db94fbaa-6721-43b4-80a4-c9262cdebd50/A_premium_marriage_proposal_invitation_opening_scene__Champa.png?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiYWQyODY0MDAxZDBjNWIzNSIsImJ1Y2tldCI6InJ1bndheS10YXNrLWFydGlmYWN0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTc5MDU0NTQwOH0.u4up2Knx6Xo1E9lBpJNSe3J55YN1GvawMYpalI1AhhQ"};
 const themes={
  'love-rose':{theme:'rose',family:'love',edition:'01 / LOVE CINEMA',name:'Rose Theatre',intro:'Kino boshlanmoqda',introCopy:'Bu hikoyada bosh qahramon — sen.',mode:'film',cover:'Senga aytolmagan bir gapim bor.',copy:'Bu film bitta insonga bag‘ishlanadi. Sen uni oxirigacha ko‘rasanmi?',story:'Birinchi kadrdan bugungacha',storyCopy:'Ba’zi insonlar hayotimizga kiradi — va oddiy kunlar ham xotiraga aylanadi.',captions:['Birinchi kadr','Eng iliq lahza','Davomi hali oldinda'],letterHead:'Senga aytolmaganlarim',letter:'Senga aytadigan gaplarim juda ko‘p. Lekin eng muhimi — sen hayotimdagi eng yorqin sahifasan.',details:'Uchta kichik sir',detailCards:[['01 / MEETING','Birinchi nigoh','Hammasi oddiy bir kundan boshlandi.'],['02 / FEELING','Sening kulging','Kundalik hayotimning eng sevimli ovoziga aylandi.'],['03 / FUTURE','Oldindagi kunlar','Hali birga yoziladigan sahifalar ko‘p.']],final:'Bu hikoyani davom ettiramizmi?',yes:'Ha, birga ♡',no:'O‘ylab ko‘raman',afterYes:'Yangi bob boshlandi ♡',afterNo:'Shoshilish shart emas. Hislaring muhim.',glyph:'♡'},
  'love-pearl':{theme:'pearl',family:'love',edition:'02 / LOVE CINEMA',name:'Pearl Linen',intro:'Sokin maktub',introCopy:'Ba’zi so‘zlar shoshilmasdan aytiladi.',mode:'envelope',cover:'Sen — mening eng sokin baxtim.',copy:'Yorug‘ kunlar, mayda xotiralar va faqat sen uchun yozilgan so‘zlar.',story:'Uchta yorug‘ lahza',storyCopy:'Bir qarash, bir kulgu, bir yurakda qolgan kun.',captions:['Birinchi uchrashuv','O‘sha tabassum','Bizning kelajagimiz'],letterHead:'Faqat senga',letter:'Sen bilan vaqt juda tez, xotiralar esa juda sekin o‘tadi. Shuning uchun eng chiroyli so‘zlarimni shu yerda saqlamoqchiman.',details:'O‘zing bilmagan uchta narsa',detailCards:[['01 / GRATITUDE','Minnatdorman','Doim yonimda bo‘lganing uchun.'],['02 / JOY','Quvonaman','Sening borliging oddiy kunlarga ham bayram olib kiradi.'],['03 / PROMISE','Va’da','Har kun yangi bir xotira yaratishga harakat qilaman.']],final:'Yana mingta xotira yaratamizmi?',yes:'Albatta ♡',no:'Vaqt kerak',afterYes:'Bu sahifa endi ikkingizniki.',afterNo:'Qaroringni hurmat qilaman.',glyph:'✧'},
  'wedding-silk':{theme:'silk',family:'wedding',edition:'03 / WEDDING',name:'Silk Heritage',intro:'Taklifnomangiz tayyor',introCopy:'Ipak ochiladi. Eng qadrli kunimiz boshlanadi.',mode:'envelope',cover:'Aziza & Jasur',copy:'Sizni hayotimizning eng qadrli kunida kutamiz.',story:'Muhabbat hikoyasining yangi bobi',storyCopy:'Bir hikoya, ikki yurak va biz bilan quvonchini bo‘lishadigan eng aziz insonlar.',captions:['Bizning hikoyamiz','Unutilmas xotira','Eng qadrli kun'],letterHead:'Aziz mehmonimiz',letter:'Sizning tashrifingiz biz uchun katta baxt. Birga quvonamiz, birga eslaymiz.',details:'Marosim dasturi',detailCards:[['17:00 / WELCOME','Mehmonlarni kutib olish','Kichik kutib olish marosimi va suratlar.'],['18:00 / CEREMONY','Nikoh marosimi','Yuraklar birlashadigan lahza.'],['19:00 / CELEBRATION','Bayram oqshomi','Tabriklar, kechki ovqat va raqs.']],final:'Bu kunni birga nishonlaymizmi?',yes:'RSVP orqali javob berish',no:'Havolani ulashish',afterYes:'Shaxsiy mehmon havolasida javob yuborish mumkin.',afterNo:'',glyph:'❦'},
  'wedding-garden':{theme:'garden',family:'wedding',edition:'04 / WEDDING',name:'Night Garden',intro:'Sirli bog‘ eshiklari',introCopy:'Shamlar yonadi. Yulduzlar ostida bir voqea boshlanadi.',mode:'garden',cover:'Aziza & Jasur',copy:'Yulduzlar ostidagi eng qadrli kunimizda sizni kutamiz.',story:'Ushbu kecha bizniki',storyCopy:'Yulduzlar, gullar va qadrli insonlar davrasida yangi hikoya boshlanadi.',captions:['Bog‘dagi lahza','Yorug‘ xotira','Yangi sahifa'],letterHead:'Kechamizning aziz mehmoni',letter:'Bu kechani siz bilan baham ko‘rish biz uchun sharaf. Eng yaxshi lahzalarni birga yaratamiz.',details:'Kechki dastur',detailCards:[['18:00 / ARRIVAL','Bog‘ga xush kelibsiz','Shamlar va mayin musiqa ostida kutib olish.'],['19:00 / CEREMONY','Marosim','Yulduzlar ostidagi orzumiz.'],['20:00 / DINNER','Garden dinner','Bayram oqshomi va tabriklar.']],final:'Biz bilan bog‘ga kirasizmi?',yes:'RSVP orqali javob berish',no:'Havolani ulashish',afterYes:'Shaxsiy mehmon havolasida javob yuborish mumkin.',afterNo:'',glyph:'✧'},
  'birthday-aurora':{theme:'aurora',family:'birthday',edition:'05 / BIRTHDAY',name:'Aurora Paper',intro:'Sovg‘ani oching',introCopy:'Bugun odatiy kun emas. Bugun sizning bayramingiz!',mode:'gift',cover:'Bugun sening kuning!',copy:'Ranglar, xotiralar va yurakdan chiqqan tilaklar. Barchasi sen uchun.',story:'Yana bir yil — yana ming xotira',storyCopy:'Kulganimiz, birga o‘tkazganimiz va oldimizda turgan barcha bayramlar uchun.',captions:['Eng quvnoq lahza','Birga kulgan kunlar','Yangi xotiralar'],letterHead:'Tug‘ilgan kuning muborak!',letter:'Bugun olamning eng yaxshi tilaklari faqat senga. Oldingdagi yangi yil yorug‘, mazmunli va unutilmas bo‘lsin!',details:'Bugungi bayramning uch siri',detailCards:[['01 / MEMORY','Xotiralar','Yaxshi lahzalar hech qachon eskirmaydi.'],['02 / WISH','Tilaklar','Eng chiroyli niyatlar sen tomon uchsin.'],['03 / SURPRISE','Syurpriz','Bayramning eng yaxshi qismi hali oldinda.']],final:'Bir tilak qil — shamlarni pufla!',yes:'Tilak bildirish ✦',no:'Do‘stimga ulashish',afterYes:'Tilaging osmon tomon uchdi! ✦',afterNo:'',glyph:'✦'},
  'apology-rain':{theme:'rain',family:'apology',edition:'06 / APOLOGY',name:'After Rain',intro:'Yomg‘irdan keyin',introCopy:'Ba’zi so‘zlarni aytish uchun jasorat kerak.',mode:'rain',cover:'Kechir. Gaplashsak bo‘ladimi?',copy:'Bu maktubda oqlanish emas, tushunish va hurmat bor.',story:'Bir narsani tushundim',storyCopy:'Xatoni tan olish — hammasi yaxshi degani emas. Lekin bu to‘g‘ri yo‘ldagi birinchi qadam.',captions:['Birga kulgan kun','O‘sha sokin kun','Oldindagi yorug‘lik'],letterHead:'Senga bir maktub',letter:'Senga og‘ir botgan gaplarim uchun uzr. Men seni eshitishga va yaxshiroq tushunishga tayyorman.',details:'Endi nimalar o‘zgaradi?',detailCards:[['01 / RESPECT','Tinglash','Sening fikring, hislaring va chegaralaring muhim.'],['02 / HONESTY','Mas’uliyat','Xatoni oqlamayman; undan saboq olaman.'],['03 / PATIENCE','Vaqt','Qachon gaplashishimizni faqat sen hal qilasan.']],final:'Qachondir gaplashishga tayyor bo‘lasanmi?',yes:'Gaplashamiz',no:'Menga vaqt kerak',afterYes:'Rahmat. Eshitishga tayyorman.',afterNo:'Tushunaman. Qaroringni hurmat qilaman.',glyph:'☼'},
  'proposal-pearl':{theme:'promise',family:'proposal',edition:'07 / PROPOSAL',name:'Pearl Promise',intro:'Bitta savolga yaqin',introCopy:'Bu safar oddiy xat emas — umr bo‘yi esda qoladigan lahza.',mode:'ring',cover:'Butun umrga yetadigan bitta savol.',copy:'Bu hikoyaning eng muhim sahnasi oldinda. Va u faqat sen uchun.',story:'Sen bilan boshlangan hamma narsa',storyCopy:'Hayotimdagi eng oddiy kunlar ham sen bilan alohida ma’no topadi.',captions:['Ilk uchrashuv','Birinchi sayohat','Eng katta orzu'],letterHead:'Nega aynan sen?',letter:'Sening yoningda kelajakka qo‘rqmasdan qaray olaman. Qolgan umrimni ham shunday his bilan o‘tkazmoqchiman.',details:'Senga atab uch xotira',detailCards:[['01 / BEGINNING','Birinchi salom','O‘sha kundan beri hayotim boshqacha.'],['02 / PROMISE','Birga o‘sganimiz','Har qiyinchilik ham sen bilan yengilroq tuyuladi.'],['03 / FUTURE','Bizning ertamiz','Yangi hikoyamizni birga yozsak deyman.']],final:'Men bilan abadiy qolasanmi?',yes:'Ha ♡',no:'O‘ylab ko‘raman',afterYes:'Bu lahza butun umr esda qoladi ♡',afterNo:'Shoshilma. Eng muhimi — sening xohishing.',glyph:'◇'}
 };
 const meta=themes[key]||themes['love-rose'],art=artwork[key],app=document.getElementById('experience');
 if(!app) return;
 app.className='site '+meta.theme;
 const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
 const $=sel=>app.querySelector(sel);
 const clean=x=>typeof x==='string'?x.trim():'';
 const text=(selector,val)=>{const el=$(selector);if(el&&clean(val))el.textContent=val};
 const safeUrl=url=>{try{const u=new URL(url,location.href);return u.protocol==='https:'?u.href:''}catch{return ''}};
 const mapUrl=url=>{try{const u=new URL(url);const allowed=['maps.google.com','maps.app.goo.gl','google.com','yandex.com','yandex.ru','yandex.uz','2gis.uz','2gis.com'];return u.protocol==='https:'&&allowed.some(h=>u.hostname===h||u.hostname.endsWith('.'+h))?u.href:''}catch{return ''}};
 const artBg=url=>'linear-gradient(180deg,transparent,color-mix(in srgb,var(--base) 44%,transparent)),url("'+url.replace(/"/g,'%22')+'")';
 const artGradient='radial-gradient(circle at 48% 27%,color-mix(in srgb,var(--accent) 42%,transparent),var(--base) 73%)';
 const introObject={
   film:'<div class="curtain left"></div><div class="curtain right"></div><div class="film" aria-hidden="true"></div>',
   envelope:'<div class="object-envelope" aria-hidden="true"><div class="env-body"></div><div class="env-flap"></div><div class="wax">e</div></div>',
   garden:'<div class="garden-door" aria-hidden="true"></div>',
   gift:'<div class="object-envelope" aria-hidden="true"><div class="env-body"></div><div class="env-flap"></div><div class="wax">✦</div></div>',
   rain:'<div class="object-envelope" aria-hidden="true"><div class="env-body"></div><div class="env-flap"></div><div class="wax">✧</div></div>',
   ring:'<div class="object-envelope" aria-hidden="true"><div class="env-body"></div><div class="env-flap"></div><div class="wax">◇</div></div>'
 };
 const intro='<div class="intro" id="intro" role="dialog" aria-modal="true" aria-label="Shablonning cinematic ochilishi"><div class="intro-art" id="introArt"></div><div class="rain-glass"></div><button type="button" class="intro-skip" id="skipIntro">O‘tkazib yuborish ↗</button><div class="intro-center"><div class="chapter-no">EMORA / '+meta.edition+'</div><div class="intro-object">'+introObject[meta.mode]+'</div><div class="intro-title">'+meta.intro+'</div><p class="intro-desc">'+meta.introCopy+'</p><button type="button" class="btn" id="startIntro">Sahnani boshlash ↗</button><div class="intro-footer">HANDCRAFTED DIGITAL MOMENTS · EMORA</div></div></div>';
 const chrome='<header class="chrome"><div class="logo">emora</div><div class="edition">'+meta.edition+' / '+meta.name+'</div><button class="music" type="button" id="music" hidden aria-pressed="false">♪ Musiqa</button></header><div class="progress"><i id="progress"></i></div>';
 const cover='<section class="chapter cover" id="opening"><div class="cover-art" id="coverArt"></div><div class="wrap"><div class="chapter-no">'+meta.edition+'</div><div class="ornament">'+meta.glyph+'</div><h1 class="cover-title" id="coverTitle">'+meta.cover+'</h1><p class="sub" id="coverCopy">'+meta.copy+'</p><div class="btn-row"><button class="btn" type="button" id="coverNext">Hikoyani ochish ↗</button><button class="btn btn-ghost" type="button" id="share">Ulashish ↗</button></div></div><div class="scroll-arrow">PASTGA SURING ↓</div></section>';
 const story='<section class="chapter story" id="story"><div class="wrap"><div class="chapter-no">02 / STORY</div><h2 class="story-heading reveal" id="storyTitle">'+meta.story+'</h2><p class="story-copy reveal" id="storyCopy">'+meta.storyCopy+'</p><div class="photo-rail" id="photos"></div><p class="smallnote" style="margin-top:32px">HAR BIR SURAT — ALOHIDA BIR XOTIRA</p></div></section>';
 const letter='<section class="chapter letter" id="letter"><div class="wrap"><div class="letter-side reveal"><div class="letter-symbol">'+meta.glyph+'</div></div><div class="letter-sheet reveal"><div class="chapter-no">03 / A LETTER FOR YOU</div><h2 id="letterTitle">'+meta.letterHead+'</h2><p class="letter-text" id="letterText">'+meta.letter+'</p><p class="smallnote" id="signature">EMORA · SHAXSIY MAKTUB</p></div></div></section>';
 const details='<section class="chapter details" id="details"><div class="wrap"><div class="detail-head reveal"><div class="chapter-no">04 / THE MOMENT</div><h2 id="detailsTitle">'+meta.details+'</h2></div><div id="detailBody"></div></div></section>';
 const final='<section class="chapter final" id="finale"><div class="wrap reveal"><div class="chapter-no">05 / GRAND FINALE</div><div class="final-graphic" id="finalGraphic">'+meta.glyph+'</div><h2 id="finalTitle">'+meta.final+'</h2><p class="sub" id="finalLine">'+(meta.family==='wedding'?'Sizning tashrifingiz biz uchun bebaho.':meta.family==='apology'?'Qanday javob bersang ham, men uni hurmat qilaman.':'Eng chiroyli lahzalar hali oldinda.')+'</p><div class="btn-row"><button type="button" class="btn" id="yes">'+meta.yes+'</button><button type="button" class="btn btn-ghost" id="no">'+meta.no+'</button></div><div class="final-message" id="finalMessage" role="status" aria-live="polite"></div></div></section>';
 app.innerHTML=intro+chrome+'<main id="main">'+cover+story+letter+details+final+'</main><dialog class="photo-dialog" id="photoDialog"><button class="dialog-close" id="closeDialog" type="button" aria-label="Yopish">×</button><img id="photoPreview" alt="Xotira suratining kattalashtirilgan ko‘rinishi"></dialog><audio id="audio" preload="none"></audio>';
 const coverArt=$('#coverArt'),introArt=$('#introArt');
 if(art){coverArt.style.backgroundImage=artBg(art)+','+artGradient;introArt.style.backgroundImage='linear-gradient(180deg,color-mix(in srgb,var(--base) 18%,transparent),color-mix(in srgb,var(--base) 70%,transparent)),url("'+art+'")'} 
 let currentConfig=null, eventTime=NaN, opened=false;
 function go(id){const el=$(id);if(el)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
 function dismissIntro(animate){
  if(opened)return;opened=true;const layer=$('#intro');
  const finish=()=>{layer.classList.add('dismissed');layer.setAttribute('aria-hidden','true');$('#coverTitle')?.setAttribute('tabindex','-1');$('#coverTitle')?.focus({preventScroll:true})};
  if(animate){layer.classList.add('playing');setTimeout(finish,key==='wedding-silk'?2220:1050)}else finish();
 }
 $('#startIntro').addEventListener('click',()=>dismissIntro(true));
 $('#skipIntro').addEventListener('click',()=>dismissIntro(false));
 $('#coverNext').addEventListener('click',()=>go('#story'));
 $('#share').addEventListener('click',async()=>{try{if(navigator.share){await navigator.share({title:document.title,url:location.href})}else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);$('#share').textContent='Havola nusxalandi ✓'}}catch{}});
 function applyPhoto(src,i){
   const el=$('#photos .photo:nth-child('+(i+1)+')');if(!el)return;
   const u=safeUrl(src)||art;
   if(!u)return;
   el.style.setProperty('--photo-image','url("'+u.replace(/"/g,'%22')+'")');
   el.dataset.src=u;
 }
 const rail=$('#photos');
 meta.captions.forEach((caption,i)=>{const figure=node('figure','photo reveal');figure.tabIndex=0;figure.setAttribute('role','button');figure.setAttribute('aria-label',caption+' suratini kattalashtirish');figure.appendChild(node('figcaption','',caption));figure.addEventListener('click',()=>openPhoto(figure));figure.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPhoto(figure)}});rail.appendChild(figure);if(art)applyPhoto(art,i)});
 function openPhoto(figure){const u=figure.dataset.src;if(!u)return;$('#photoPreview').src=u;$('#photoDialog').showModal()}
 $('#closeDialog').addEventListener('click',()=>$('#photoDialog').close());
 function detailCard(cards){
   const grid=node('div','detail-grid');cards.forEach(([k,h,p])=>{
     const d=node('details','detail-card reveal');const s=node('summary','',h);s.style.cssText='font:400 clamp(27px,3vw,43px) var(--serif);cursor:pointer;list-style:none';
     d.append(node('small','',k),s,node('p','',p));grid.appendChild(d);
   });$('#detailBody').appendChild(grid);
 }
 if(meta.family==='wedding'){
   const el=$('#detailBody');el.innerHTML='<div class="countdown" aria-label="Marosimgacha qolgan vaqt"><div><strong id="d">00</strong><small>KUN</small></div><div><strong id="h">00</strong><small>SOAT</small></div><div><strong id="m">00</strong><small>DAQ</small></div><div><strong id="s">00</strong><small>SONIYA</small></div></div><div class="venue"><div class="chapter-no">QAYERDA UCHRASHAMIZ?</div><strong id="venueName">The Garden, Toshkent</strong><div class="smallnote" id="weddingDate">25 IYUN 2027</div><div class="btn-row"><a class="btn btn-ghost" id="map" hidden target="_blank" rel="noopener noreferrer">Xaritada ko‘rish ↗</a></div></div>';
   detailCard(meta.detailCards);
 }else{
   detailCard(meta.detailCards);
   if(meta.family==='birthday'){$('#detailBody').appendChild(node('p','interactive-message','Bugun sizga atab yaratilgan xotiralar sahifasi.'))}
   if(meta.family==='proposal'){$('#detailBody').appendChild(node('div','ring-art'))}
   if(meta.family==='apology'){$('#detailBody').appendChild(node('p','interactive-message','Yomg‘irdan keyin havo ochiladi. Lekin vaqt va qaror seniki.'))}
 }
 function particles(n=24){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  for(let i=0;i<n;i++){const p=node('i','particle');p.style.setProperty('--left',Math.floor(Math.random()*100)+'vw');p.style.setProperty('--wind',(-35+Math.random()*70)+'vw');p.style.setProperty('--duration',(3+Math.random()*4)+'s');p.style.animationDelay=Math.random()*.6+'s';app.appendChild(p);setTimeout(()=>p.remove(),8500)}
 }
 function tick(){if(!Number.isFinite(eventTime))return;const ms=Math.max(0,eventTime-Date.now());const nums=[Math.floor(ms/86400000),Math.floor(ms/3600000)%24,Math.floor(ms/60000)%60,Math.floor(ms/1000)%60];['d','h','m','s'].forEach((id,i)=>{const el=$('#'+id);if(el)el.textContent=String(nums[i]).padStart(2,'0')})}
 function openRSVP(){if(window.parent&&window.parent!==window){window.parent.postMessage({type:'emora:open-rsvp'},location.origin)}$('#finalMessage').textContent='Shaxsiy mehmon havolangizdagi RSVP oynasida javob yuborishingiz mumkin.'}
 function share(){ $('#share').click(); }
 $('#yes').addEventListener('click',()=>{
   if(meta.family==='wedding'){openRSVP();return}
   particles(meta.family==='birthday'?42:24);
   if(meta.family==='proposal')$('#finalGraphic').innerHTML='<span class="ring-art" aria-label="Uzuk"></span>';
   $('#finalMessage').textContent=meta.afterYes;
 });
 $('#no').addEventListener('click',()=>{if(meta.family==='wedding'){share();return}$('#finalMessage').textContent=meta.afterNo});
 function update(cfg){
   if(!cfg||typeof cfg!=='object')return;
   currentConfig=cfg;
   if(meta.family==='wedding'){
      const b=clean(cfg.bride)||'Aziza',g=clean(cfg.groom)||'Jasur';
      text('#coverTitle',b+' & '+g);text('#coverCopy',cfg.invitation);text('#letterText',cfg.invitation);text('#letterTitle','Aziz mehmonimiz');
      text('#venueName',cfg.venue);
      const map=mapUrl(cfg.venueMap);const a=$('#map');if(map){a.hidden=false;a.href=map}else{a.hidden=true;a.removeAttribute('href')}
      const dt=new Date(cfg.eventAt);if(Number.isFinite(dt.getTime())){eventTime=dt.getTime();tick();text('#weddingDate',dt.toLocaleString('uz-UZ',{day:'numeric',month:'long',year:'numeric'}));}
   }else{
      text('#coverTitle',cfg.intro);
      text('#letterText',cfg.letter);
      if(meta.family==='love'){text('#storyTitle',cfg.memoryTitle);text('#finalTitle',cfg.finalHeading);text('#finalLine',cfg.finalLine);text('#signature',clean(cfg.sender)?'MUALLIF: '+cfg.sender:'EMORA · SHAXSIY MAKTUB');}
      else if(meta.family==='birthday'){text('#coverCopy',clean(cfg.recipient)?cfg.recipient+' uchun maxsus bayram hikoyasi.':meta.copy);text('#storyTitle',cfg.memoryTitle);if(clean(cfg.final)&&clean(cfg.final)!==clean(cfg.intro))text('#finalTitle',cfg.final);}
      else if(meta.family==='apology'){text('#storyTitle',cfg.memoryTitle);text('#letterText',cfg.letter||cfg.mistake);if(clean(cfg.repair))text('#finalLine',cfg.repair);}
      else if(meta.family==='proposal'){text('#letterTitle',clean(cfg.recipient)?cfg.recipient+' uchun maktub':meta.letterHead);if(clean(cfg.final)&&clean(cfg.final)!==clean(cfg.intro))text('#finalTitle',cfg.final);}
      if(Array.isArray(cfg.photos))cfg.photos.slice(0,3).forEach((p,i)=>applyPhoto(p,i));
   }
   const music=safeUrl(cfg.music);const control=$('#music'),audio=$('#audio');
   if(music){audio.src=music;control.hidden=false}else{audio.pause();audio.removeAttribute('src');control.hidden=true}
   const video=safeUrl(cfg.video);
   let box=$('#videoBox');
   if(video&&!box){box=node('div','venue');box.id='videoBox';const media=node('video');media.controls=true;media.preload='none';media.playsInline=true;media.style.cssText='max-width:100%;max-height:60vh;border-radius:15px';box.appendChild(media);$('#details .wrap').appendChild(box)}
   if(box){if(video){box.hidden=false;box.querySelector('video').src=video}else{box.hidden=true}}
 }
 $('#music').addEventListener('click',async()=>{const a=$('#audio'),b=$('#music');if(!a.src)return;if(!a.paused){a.pause();b.textContent='♪ Musiqa';b.setAttribute('aria-pressed','false');return}try{await a.play();b.textContent='Ⅱ To‘xtatish';b.setAttribute('aria-pressed','true')}catch{b.textContent='Musiqa ochilmadi'}});
 const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>{for(const e of es){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}},{threshold:.12}):null;
 app.querySelectorAll('.reveal').forEach(el=>{if(io)io.observe(el);else el.classList.add('in')});
 const chapters=[...app.querySelectorAll('.chapter')];const chaptersIO=('IntersectionObserver' in window)?new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){const i=chapters.indexOf(e.target);$('#progress').style.width=(100*(i+1)/chapters.length)+'%'}},{threshold:.43}):null;
 if(chaptersIO)chapters.forEach(el=>chaptersIO.observe(el));
 window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||typeof e.data.type!=='string'||!e.data.type.startsWith('emora:'))return;update(e.data.config)});
 setInterval(tick,1000);
 document.title='EMORA · '+meta.name;
 if(new URLSearchParams(location.search).get('editor')==='1')document.documentElement.dataset.editor='1';
})();
