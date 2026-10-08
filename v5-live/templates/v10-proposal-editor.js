/* EMORA Creator Studio · flagship field adapters.
   The five current flagship experiences reuse the persisted schema with
   template-specific labels. Proposal variants stay supported without DB migration. */
const $=s=>document.querySelector(s);
const type=$('#type'),storyExtras=$('#storyExtras'),apology=$('#apologyExtra'),wedding=$('#weddingExtra'),previewLabel=$('#previewLabel');
const mistake=$('#mistake'),repair=$('#repair'),venue=$('#venue'),letter=$('#letter'),finalQuestion=$('#finalQuestion'),dateField=$('#dateField');
const memoryTitle=$('#memoryTitle'),captions=[$('#caption1'),$('#caption2'),$('#caption3')],videoUrl=$('#videoUrl');
if(type&&storyExtras&&apology&&wedding&&mistake&&repair&&venue&&letter&&finalQuestion&&memoryTitle&&captions.every(Boolean)){
 const mistakeField=mistake.closest('.field'),repairField=repair.closest('.field'),venueField=venue.closest('.field');
 const mistakeMarker=document.createComment('emora-mistake-home'),repairMarker=document.createComment('emora-repair-home'),venueMarker=document.createComment('emora-venue-home');
 mistakeField.before(mistakeMarker);repairField.before(repairMarker);venueField.before(venueMarker);
 const pearl=document.createElement('div');pearl.id='proposalPearlExtra';pearl.className='hidden';
 const pearlNote=document.createElement('div');pearlNote.className='lang-note';pearlNote.textContent='PEARL PROMISE · 3 ta sabab savoldan oldin alohida ochiladi. “Maktub” maydoni bu shablonda haqiqiy va’da sifatida ishlaydi.';pearl.append(pearlNote);storyExtras.after(pearl);
 const cinema=document.createElement('div');cinema.id='proposalCinemaExtra';cinema.className='hidden';
 const cinemaNote=document.createElement('div');cinemaNote.className='lang-note';cinemaNote.textContent='CINEMA PROPOSAL · Film nomi, 3 ta sahna, personal trailer/video, voice-over va final savol private-premiere ssenariysiga ulanadi.';cinema.append(cinemaNote);pearl.after(cinema);
 const sky=document.createElement('div');sky.id='proposalSkyExtra';sky.className='hidden';
 const skyNote=document.createElement('div');skyNote.className='lang-note';skyNote.textContent='SKY PROMISE · Osmon nomi, 3 ta kelajak orzusi, optional video, constellation va’da va final savol sunset-to-stars ritualiga ulanadi.';sky.append(skyNote);cinema.after(sky);
 const quiet=document.createElement('div');quiet.id='apologyQuietExtra';quiet.className='hidden';
 const quietNote=document.createElement('div');quietNote.className='lang-note';quietNote.textContent='QUIET ROOM · Bosimsiz apology ritual: aniq xato → tinglash → yozilmay qolgan gap → konkret tuzatish → 3 ta teng final javob. Video ixtiyoriy va autoplay qilinmaydi.';quiet.append(quietNote);sky.after(quiet);
 const originals=new Map();
 const remember=(field,fallback)=>{if(!field)return;const label=field.closest('.field')?.querySelector('label');originals.set(field,{label:label?.textContent||fallback,placeholder:field.placeholder})};
 remember(mistake,'XATONI TAN OLISH');remember(repair,'AMALIY TUZATISH REJASI');remember(venue,'TO‘Y MANZILI');remember(letter,'MAKTUB / ASOSIY HIKOYA · UZ');remember(finalQuestion,'YAKUNIY SAVOL / TABRIK');remember(memoryTitle,'XOTIRALAR BO‘LIMI NOMI');captions.forEach((f,i)=>remember(f,(i+1)+'-XOTIRA MATNI'));remember(videoUrl,'VIDEO URL · IXTIYORIY');
 function setField(field,label,placeholder){if(!field)return;const l=field.closest('.field')?.querySelector('label');if(l)l.textContent=label;if(placeholder!==undefined)field.placeholder=placeholder}
 function resetField(field){const o=originals.get(field);if(o)setField(field,o.label,o.placeholder)}
 function home(field,marker){if(marker.parentNode&&field.parentNode!==marker.parentNode)marker.parentNode.insertBefore(field,marker.nextSibling)}
 function resetCommon(){[letter,finalQuestion,memoryTitle,...captions,videoUrl].forEach(resetField)}
 function restoreExtras(){home(mistakeField,mistakeMarker);home(repairField,repairMarker);home(venueField,venueMarker);[mistake,repair,venue].forEach(resetField);pearl.classList.add('hidden')}
 function sync(){
  const value=type.value,proposal=value.startsWith('proposal-');
  resetCommon();cinema.classList.add('hidden');sky.classList.add('hidden');quiet.classList.add('hidden');
  if(dateField)dateField.classList.toggle('hidden',value.startsWith('apology-')||proposal);
  if(value==='proposal-pearl-promise'){
   pearl.classList.remove('hidden');
   if(mistakeField.parentNode!==pearl)pearl.append(mistakeField);
   if(repairField.parentNode!==pearl)pearl.append(repairField);
   if(venueField.parentNode!==pearl)pearl.append(venueField);
   setField(mistake,'NEGA SEN? · 1-SABAB','Masalan: Sen bilan oddiy kun ham xotiraga aylanadi.');
   setField(repair,'NEGA SEN? · 2-SABAB','Masalan: Yonimda o‘zim bo‘la oladigan inson — sensan.');
   setField(venue,'NEGA SEN? · 3-SABAB','Masalan: Kelajagimni tasavvur qilganimda, unda doim sen borsan.');
   setField(letter,'MENING VA’DAM · UZ','Unga aytmoqchi bo‘lgan haqiqiy va’dangizni yozing...');
   setField(finalQuestion,'ENG MUHIM SAVOL','Masalan: Dilnoza, menga turmushga chiqasanmi?');return;
  }
  restoreExtras();
  if(value==='love-rose-theatre'){
   setField(memoryTitle,'SPEKTAKL / HIKOYA NOMI','Masalan: Bizning hikoyamiz');
   setField(captions[0],'ACT I · BIRINCHI KADR','Masalan: Birinchi uchrashuv — hammasi oddiy boshlangan edi.');
   setField(captions[1],'ACT II · SEVIMLI LAHZA','Masalan: Shu kadrni yana ko‘rishni istayman.');
   setField(captions[2],'ACT III · DAVOMI','Masalan: Eng yaxshi sahnalar hali yozilmagan.');
   setField(videoUrl,'PRIVATE SCREENING · VIDEO','https://...mp4');
   setField(letter,'LIVE CONFESSION · UZ','Ssenariysiz, chin dildan aytiladigan shaxsiy gap...');
   setField(finalQuestion,'ENCORE · FINAL SAVOL','Masalan: Bu hikoyani birga davom ettiramizmi?');return;
  }
  if(value==='birthday-aurora-paper'){
   setField(memoryTitle,'MEMORY CONTACT SHEET · NOMI','Masalan: Sening eng chiroyli kadrlaring');
   setField(captions[0],'01-SURAT · FLIRT','Bu rasm yoniga tabiiy, shirin gap yozing…');setField(captions[1],'02-SURAT · FLIRT','Masalan: Kulgingni ko‘rgan odam chalg‘ib qoladi.');setField(captions[2],'03-SURAT · FLIRT','Masalan: Bu kadrda ham asosiy qahramon — sen.');
   setField(videoUrl,'PRIVATE BIRTHDAY FILM · VIDEO','https://...mp4');setField(letter,'BIRTHDAY LETTER · UZ','Template gap emas — aynan shu odamga yozilgan tabrik...');setField(finalQuestion,'FINAL WISH · OXIRGI SATR','Masalan: Bugun hamma nur seniki.');return;
  }
  if(value==='apology-quiet-room'){
   quiet.classList.remove('hidden');setField(memoryTitle,'XONA / KIRISH SATRI','Masalan: Shovqinsiz bir suhbat');setField(mistake,'ANIQ TAN OLISH · BAHONASIZ','Nimani noto‘g‘ri qilganingizni bitta aniq fikr bilan yozing.');setField(repair,'MEN BOSHQA NIMA QILAMAN','Keyingi safar amalda nimani boshqacha qilishingizni yozing.');setField(captions[0],'TINGLASH SATRI · 01','Masalan: Sening hislaringni inkor qilmayman.');setField(captions[1],'TINGLASH SATRI · 02','Masalan: Javobni hozir berishing shart emas.');setField(captions[2],'TINGLASH SATRI · 03','Masalan: Chegaralaringni hurmat qilaman.');setField(letter,'YOZILMAY QOLGAN GAPLAR · UZ','Ko‘ndirish emas — aytilishi kerak bo‘lgan samimiy gaplarni yozing...');setField(videoUrl,'IXTIYORIY VIDEO · AUTOPLAY YO‘Q','https://...mp4');setField(finalQuestion,'FINAL · HURMATLI YAKUN','Masalan: Sening vaqting va qaroring muhim.');return;
  }
  if(value==='wedding-silk-heritage'){
   setField(memoryTitle,'LOVE STORY / BO‘LIM NOMI','Masalan: Bizning hikoyamiz');setField(captions[0],'01-XOTIRA','Birinchi uchrashuv yoki muhim sana...');setField(captions[1],'02-XOTIRA','Ikkinchi muhim lahza...');setField(captions[2],'03-XOTIRA','To‘ygacha olib kelgan lahza...');setField(videoUrl,'LOVE STORY VIDEO · IXTIYORIY','https://...mp4');setField(letter,'MEHMON UCHUN SHAXSIY TAKLIF · UZ','Mehmoningizga atalgan samimiy taklif matni...');setField(finalQuestion,'OILA DUOSI / YAKUNIY SATR','Masalan: Quvonchimizga sherik bo‘ling.');return;
  }
  if(value==='proposal-cinema'){
   cinema.classList.remove('hidden');setField(memoryTitle,'FILM NOMI / TAGLINE','Masalan: Bizning filmimiz');setField(captions[0],'01-KADR NOMI','Masalan: Birinchi uchrashuv');setField(captions[1],'02-KADR NOMI','Masalan: Sevimli sahnam');setField(captions[2],'03-KADR NOMI','Masalan: Men tanlagan kelajak');setField(videoUrl,'PERSONAL TRAILER / VIDEO · IXTIYORIY','https://...mp4');setField(letter,'VOICE-OVER / SHAXSIY MONOLOG · UZ','Final sahnadan oldin aytiladigan eng shaxsiy gaplaringiz...');setField(finalQuestion,'FINAL SCENE · ENG MUHIM SAVOL','Masalan: Dilnoza, menga turmushga chiqasanmi?');return;
  }
  if(value==='proposal-sky-promise'){
   sky.classList.remove('hidden');setField(memoryTitle,'OSMON / CONSTELLATION NOMI','Masalan: Bizning osmonimiz');setField(captions[0],'01-KELAJAK ORZUSI','Masalan: Birga uyg‘onadigan oddiy tonglar.');setField(captions[1],'02-KELAJAK ORZUSI','Masalan: Birga ko‘radigan yangi shaharlar.');setField(captions[2],'03-KELAJAK ORZUSI','Masalan: Birga qarib boradigan sokin uy.');setField(videoUrl,'SKY MEMORY / VIDEO · IXTIYORIY','https://...mp4');setField(letter,'CONSTELLATION VA’DA · UZ','Birga qurmoqchi bo‘lgan hayotingiz haqidagi eng samimiy va’dani yozing...');setField(finalQuestion,'OXIRGI YULDUZ · ENG MUHIM SAVOL','Masalan: Dilnoza, kelajagimizni birga quramizmi?');
  }
 }
 const schedule=()=>queueMicrotask(sync);
 document.addEventListener('input',schedule,true);document.addEventListener('change',schedule,true);type.addEventListener('change',schedule);
 if(previewLabel)new MutationObserver(schedule).observe(previewLabel,{childList:true,subtree:true,characterData:true});
 sync();
}