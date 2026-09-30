/* EMORA Creator Studio · Pearl Promise field adapter.
   Reuses persisted legacy text slots without changing the projects table contract.
   Pearl gets 3 reasons + promise-oriented labels; Apology/Wedding restore instantly. */
const $=s=>document.querySelector(s);
const type=$('#type'),storyExtras=$('#storyExtras'),apology=$('#apologyExtra'),wedding=$('#weddingExtra'),previewLabel=$('#previewLabel');
const mistake=$('#mistake'),repair=$('#repair'),venue=$('#venue'),letter=$('#letter'),finalQuestion=$('#finalQuestion'),dateField=$('#dateField');
if(type&&storyExtras&&apology&&wedding&&mistake&&repair&&venue&&letter&&finalQuestion){
 const mistakeField=mistake.closest('.field'),repairField=repair.closest('.field'),venueField=venue.closest('.field');
 const mistakeMarker=document.createComment('emora-mistake-home'),repairMarker=document.createComment('emora-repair-home'),venueMarker=document.createComment('emora-venue-home');
 mistakeField.before(mistakeMarker);repairField.before(repairMarker);venueField.before(venueMarker);
 const proposal=document.createElement('div');proposal.id='proposalPearlExtra';proposal.className='hidden';
 const note=document.createElement('div');note.className='lang-note';note.textContent='PEARL PROMISE · 3 ta sabab savoldan oldin alohida ochiladi. Umumiy “Maktub” maydoni bu shablonda sizning haqiqiy va’dangiz sifatida ishlaydi.';
 proposal.append(note);storyExtras.after(proposal);
 const labels={
  mistake:{label:mistakeField.querySelector('label')?.textContent||'XATONI TAN OLISH',placeholder:mistake.placeholder},
  repair:{label:repairField.querySelector('label')?.textContent||'AMALIY TUZATISH REJASI',placeholder:repair.placeholder},
  venue:{label:venueField.querySelector('label')?.textContent||'TO‘Y MANZILI',placeholder:venue.placeholder},
  letter:{label:letter.closest('.field')?.querySelector('label')?.textContent||'MAKTUB / ASOSIY HIKOYA · UZ',placeholder:letter.placeholder},
  final:{label:finalQuestion.closest('.field')?.querySelector('label')?.textContent||'YAKUNIY SAVOL / TABRIK',placeholder:finalQuestion.placeholder}
 };
 function setField(field,label,placeholder){const l=field.closest('.field')?.querySelector('label');if(l)l.textContent=label;if(placeholder!==undefined)field.placeholder=placeholder}
 function home(field,marker){if(marker.parentNode)marker.parentNode.insertBefore(field,marker.nextSibling)}
 function restore(){
  home(mistakeField,mistakeMarker);home(repairField,repairMarker);home(venueField,venueMarker);
  setField(mistake,labels.mistake.label,labels.mistake.placeholder);setField(repair,labels.repair.label,labels.repair.placeholder);setField(venue,labels.venue.label,labels.venue.placeholder);
  setField(letter,labels.letter.label,labels.letter.placeholder);setField(finalQuestion,labels.final.label,labels.final.placeholder);
  proposal.classList.add('hidden');
 }
 function sync(){
  const pearl=type.value==='proposal-pearl-promise';
  if(!pearl){restore();return}
  proposal.classList.remove('hidden');proposal.append(mistakeField,repairField,venueField);
  setField(mistake,'NEGA SEN? · 1-SABAB','Masalan: Sen bilan oddiy kun ham xotiraga aylanadi.');
  setField(repair,'NEGA SEN? · 2-SABAB','Masalan: Yonimda o‘zim bo‘la oladigan inson — sensan.');
  setField(venue,'NEGA SEN? · 3-SABAB','Masalan: Kelajagimni tasavvur qilganimda, unda doim sen borsan.');
  setField(letter,'MENING VA’DAM · UZ','Unga aytmoqchi bo‘lgan haqiqiy va’dangizni yozing...');
  setField(finalQuestion,'ENG MUHIM SAVOL','Masalan: Dilnoza, menga turmushga chiqasanmi?');
  if(dateField)dateField.classList.add('hidden');
 }
 const schedule=()=>queueMicrotask(sync);
 document.addEventListener('input',schedule,true);document.addEventListener('change',schedule,true);
 type.addEventListener('change',schedule);
 if(previewLabel)new MutationObserver(schedule).observe(previewLabel,{childList:true,subtree:true,characterData:true});
 sync();
}
