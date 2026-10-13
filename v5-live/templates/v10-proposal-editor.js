/* Move the shared reason fields into the active four-gift editor. */
const $=s=>document.querySelector(s),type=$('#type');
if(type){
 const ids=['mistake','repair','venue'],nodes=ids.map(id=>$('#'+id)?.closest('.field'));
 const homes=nodes.map(n=>{const marker=document.createComment('emora-field-home');n?.before(marker);return marker;});
 const box=document.createElement('details');box.id='proposalPearlExtra';box.className='v15-editor-details hidden';box.innerHTML='<summary><strong>Три причины любить её</strong><span>Можно оставить слова из примера</span></summary>';$('#storyExtras')?.after(box);
 function sync(){const proposal=type.value==='proposal-pearl-promise';box.classList.toggle('hidden',!proposal);
  nodes.forEach((n,i)=>{if(!n)return;if(proposal)box.append(n);else if(homes[i].parentNode&&n.parentNode!==homes[i].parentNode)homes[i].after(n);});
  $('#apologyExtra')?.classList.toggle('hidden',type.value!=='apology-quiet-room');
  document.dispatchEvent(new Event('emora:creator-fields'));
 }
 type.addEventListener('change',sync);sync();
}
