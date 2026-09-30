/* EMORA Creator Studio · proposal flagship field adapter.
   Pearl reuses three persisted text slots as reasons. Cinema keeps the base schema
   but gives the shared fields film-specific meaning. No database migration needed. */
const $=s=>document.querySelector(s);
const type=$('#type'),storyExtras=$('#storyExtras'),apology=$('#apologyExtra'),wedding=$('#weddingExtra'),previewLabel=$('#previewLabel');
const mistake=$('#mistake'),repair=$('#repair'),venue=$('#venue'),letter=$('#letter'),finalQuestion=$('#finalQuestion'),dateField=$('#dateField');
const memoryTitle=$('#memoryTitle'),captions=[$('#caption1'),$('#caption2'),$('#caption3')],videoUrl=$('#videoUrl');
if(type&&storyExtras&&apology&&wedding&&mistake&&repair&&venue&&letter&&finalQuestion&&memoryTitle&&captions.every(Boolean)){
 const mistakeField=mistake.closest('.field'),repairField=repair.closest('.field'),venueField=venue.closest('.field');
 const mistakeMarker=document.createComment('emora-mistake-home'),repairMarker=document.createComment('emora-repair-home'),venueMarker=document.createComment('emora-venue-home');
 mistakeField.before(mistakeMarker);repairField.before(repairMarker);venueField.before(venueMarker);
 const pearl=document.createElement('div');pearl.id='proposalPearlExtra';pearl.className='hidden';
 const pearlNote=document.createElement('div');pearlNote.className='lang-note';pearlNote.textContent='PEARL PROMISE · 3 ta sabab savoldan oldin alohida ochiladi. Umumiy “Maktub” maydoni bu shablonda sizning haqiqiy va’dangiz sifatida ishlaydi.';pearl.append(pearlNote);storyExtras.after(pearl);
 const cinema=document.createElement('div');cinema.id='proposalCinemaExtra';cinema.className='hidden';
 const cinemaNote=document.createElement('div');cinemaNote.className='lang-note';cinemaNote.textContent='CINEMA PROPOSAL · Film nomi, 3 ta sahna, personal trailer/video, voice-over matni va final savol bitta private-premiere ssenariysiga ulanadi.';cinema.append(cinemaNote);pearl.after(cinema);
 const originals=new Map();
 const remember=(field,fallback)=>{if(!field)return;const label=field.closest('.field')?.querySelector('label');originals.set(field,{label:label?.textContent||fallback,placeholder:field.placeholder})};
 remember(mistake,'XATONI TAN OLISH');remember(repair,'AMALIY TUZATISH REJASI');remember(venue,'TO‘Y MANZILI');remember(letter,'MAKTUB / ASOSIY HIKOYA · UZ');remember(finalQuestion,'YAKUNIY SAVOL / TABRIK');remember(memoryTitle,'XOTIRALAR BO‘LIMI NOMI');captions.forEach((f,i)=>remember(f,(i+1)+'-XOTIRA MATNI'));remember(videoUrl,'VIDEO URL · IXTIYORIY');
 function setField(field,label,placeholder){if(!field)return;const l=field.closest('.field')?.querySelector('label');if(l)l.textContent=label;if(placeholder!==undefined)field.placeholder=placeholder}
 function resetField(field){const o=originals.get(field);if(o)setField(field,o.label,o.placeholder)}
 function home(field,marker){if(marker.parentNode)marker.parentNode.insertBefore(field,marker.nextSibling)}
 function resetCommon(){[letter,finalQuestion,memoryTitle,...captions,videoUrl].forEach(resetField)}
 function restoreExtras(){home(mistakeField,mistakeMarker);home(repairField,repairMarker);home(venueField,venueMarker);[mistake,repair,venue].forEach(resetField);pearl.classList.add('hidden')}
 function sync(){
  const value=type.value,proposal=value.startsWith('proposal-');
  resetCommon();cinema.classList.add('hidden');
  if(dateField)dateField.classList.toggle('hidden',value.startsWith('apology-')||proposal);
  if(value==='proposal-pearl-promise'){
   pearl.classList.remove('hidden');pearl.append(mistakeField,repairField,venueField);
   setField(mistake,'NEGA SEN? · 1-SABAB','Masalan: Sen bilan oddiy kun ham xotiraga aylanadi.');
   setField(repair,'NEGA SEN? · 2-SABAB','Masalan: Yonimda o‘zim bo‘la oladigan inson — sensan.');
   setField(venue,'NEGA SEN? · 3-SABAB','Masalan: Kelajagimni tasavvur qilganimda, unda doim sen borsan.');
   setField(letter,'MENING VA’DAM · UZ','Unga aytmoqchi bo‘lgan haqiqiy va’dangizni yozing...');
   setField(finalQuestion,'ENG MUHIM SAVOL','Masalan: Dilnoza, menga turmushga chiqasanmi?');
   return;
  }
  restoreExtras();
  if(value==='proposal-cinema'){
   cinema.classList.remove('hidden');
   setField(memoryTitle,'FILM NOMI / TAGLINE','Masalan: Bizning filmimiz');
   setField(captions[0],'01-KADR NOMI','Masalan: Birinchi uchrashuv');setField(captions[1],'02-KADR NOMI','Masalan: Sevimli sahnam');setField(captions[2],'03-KADR NOMI','Masalan: Men tanlagan kelajak');
   setField(videoUrl,'PERSONAL TRAILER / VIDEO · IXTIYORIY','https://...mp4');
   setField(letter,'VOICE-OVER / SHAXSIY MONOLOG · UZ','Final sahnadan oldin aytiladigan eng shaxsiy gaplaringiz...');
   setField(finalQuestion,'FINAL SCENE · ENG MUHIM SAVOL','Masalan: Dilnoza, menga turmushga chiqasanmi?');
  }
 }
 const schedule=()=>queueMicrotask(sync);
 document.addEventListener('input',schedule,true);document.addEventListener('change',schedule,true);type.addEventListener('change',schedule);
 if(previewLabel)new MutationObserver(schedule).observe(previewLabel,{childList:true,subtree:true,characterData:true});
 sync();
}
