/* EMORA V14 · competitor audit corrections.
   Removes the last redundant browse step, tightens creator essentials and improves accessible direct actions. */
const FLAGSHIPS={
 love:{slug:'love-rose-theatre',label:'Rose Theatre'},
 wedding:{slug:'wedding-silk-heritage',label:'Silk Heritage'},
 birthday:{slug:'birthday-aurora-paper',label:'Aurora Paper'},
 apology:{slug:'apology-quiet-room',label:'Quiet Room'},
 proposal:{slug:'proposal-pearl-promise',label:'Pearl Promise'}
};
const ESSENTIALS={
 'love-rose-theatre':['name1','headline','letter','finalQuestion'],
 'birthday-aurora-paper':['name1','headline','letter','finalQuestion'],
 'apology-quiet-room':['name1','mistake','repair','letter','finalQuestion'],
 'proposal-pearl-promise':['name1','mistake','repair','venue','letter','finalQuestion'],
 'wedding-silk-heritage':['name1','name2','date','eventClock','venue','letter']
};
const $=s=>document.querySelector(s);
const field=id=>$('#'+id)?.closest('.field');
let decorateQueued=false;
function clickAfterCategory(card,selector){
 card.click();
 let tries=0;const timer=setInterval(()=>{const target=$(selector);if(target){clearInterval(timer);target.click()}else if(++tries>20)clearInterval(timer)},25);
}
function decorateCategoryCards(){
 document.querySelectorAll('.category-card').forEach(card=>{
  const item=FLAGSHIPS[card.dataset.category];if(!item)return;
  card.setAttribute('role','group');card.setAttribute('aria-label',item.label+' flagship experience');
  const body=card.querySelector('.category-body');if(!body||body.querySelector('.v14-category-actions'))return;
  const actions=document.createElement('div');actions.className='v14-category-actions';
  const preview=document.createElement('button');preview.type='button';preview.className='v14-preview';preview.textContent='Ko‘rish';preview.setAttribute('aria-label',item.label+' ni to‘liq ko‘rish');
  const create=document.createElement('button');create.type='button';create.className='v14-create';create.textContent='Yaratish →';create.setAttribute('aria-label',item.label+' bilan yaratishni boshlash');
  preview.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();clickAfterCategory(card,'#templateCards [data-preview="'+item.slug+'"]')});
  create.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();clickAfterCategory(card,'#templateCards [data-use="'+item.slug+'"]')});
  actions.append(preview,create);body.append(actions);
 });
}
function textLabel(id){const wrap=field(id),label=wrap?.querySelector(':scope > label');if(!label)return id;return [...label.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join(' ').trim()||id}
function setBadge(id,required){
 if(id==='type'||id==='slug')return;
 const wrap=field(id),label=wrap?.querySelector(':scope > label');if(!label||wrap.classList.contains('v13-field-hidden'))return;
 const cls=required?'v13-required-badge':'v13-optional-badge',text=required?'KERAK':'IXTIYORIY';
 const badges=[...label.querySelectorAll('.v13-required-badge,.v13-optional-badge')];
 if(badges.length===1&&badges[0].classList.contains(cls)&&badges[0].textContent===text)return;
 badges.forEach(n=>n.remove());const badge=document.createElement('span');badge.className=cls;badge.textContent=text;label.append(' ',badge);
}
function filled(id){const n=$('#'+id);return !!n&&String(n.value||'').trim().length>0}
function refineCreator(){
 const slug=$('#type')?.value,ids=ESSENTIALS[slug];if(!ids)return;
 const visible=[...document.querySelectorAll('#studio .field')].filter(n=>!n.classList.contains('v13-field-hidden')&&!n.closest('.v13-group-hidden'));
 visible.forEach(w=>{const input=w.querySelector('input,textarea,select');if(input?.id)setBadge(input.id,ids.includes(input.id))});
 const done=ids.filter(filled).length,pct=Math.round(done/ids.length*100),missing=ids.find(id=>!filled(id));
 const text=$('#v13-completion-text'),bar=$('#v13-progress-bar'),hint=$('#v13-next-hint');if(text&&text.textContent!==pct+'%')text.textContent=pct+'%';if(bar&&bar.style.width!==pct+'%')bar.style.width=pct+'%';const hintText=pct===100?'Asosiy qism tayyor ✓ Previewni ko‘ring; media qo‘shsangiz yanada shaxsiy bo‘ladi.':missing?textLabel(missing)+' — keyingi kerakli qadam.':'Asosiy maydonlarni to‘ldiring.';if(hint&&hint.textContent!==hintText)hint.textContent=hintText;
 document.documentElement.dataset.creatorReady=pct===100?'true':'false';
 const date=$('#dateField');if(date)date.classList.toggle('v13-group-hidden',slug!=='wedding-silk-heritage');
 const name2=field('name2');if(name2&&slug!=='wedding-silk-heritage')name2.dataset.v14Optional='true';
}
function addCreatorPromise(){
 const fast=$('#v13-fast-path');if(!fast||$('#v14-creator-promise'))return;const note=document.createElement('div');note.id='v14-creator-promise';note.className='v14-creator-promise';note.innerHTML='<strong>Avval preview.</strong><span>Asosiy gaplarni kiriting → experience darrov yangilanadi. Surat, video va musiqa ixtiyoriy; recipientga editor yoki login ko‘rinmaydi.</span>';fast.insertAdjacentElement('afterend',note);
}
function accessibility(){
 const status=$('#status');if(status){status.setAttribute('role','status');status.setAttribute('aria-live','polite')}
 const auto=$('#v13-autosave-state');if(auto)auto.setAttribute('aria-live','polite');
 const progress=$('#v13-progress-bar');if(progress?.parentElement){const box=progress.parentElement,value=parseInt($('#v13-completion-text')?.textContent||'0',10);if(box.getAttribute('role')!=='progressbar')box.setAttribute('role','progressbar');if(box.getAttribute('aria-valuemin')!=='0')box.setAttribute('aria-valuemin','0');if(box.getAttribute('aria-valuemax')!=='100')box.setAttribute('aria-valuemax','100');const now=String(Number.isFinite(value)?value:0);if(box.getAttribute('aria-valuenow')!==now)box.setAttribute('aria-valuenow',now)}
}
function decorate(){decorateCategoryCards();addCreatorPromise();refineCreator();accessibility()}
function schedule(){if(decorateQueued)return;decorateQueued=true;setTimeout(()=>{decorateQueued=false;decorate()},0)}
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
document.addEventListener('input',schedule,true);document.addEventListener('change',schedule,true);document.addEventListener('DOMContentLoaded',schedule,{once:true});schedule();
window.__EMORA_V14_AUDIT__={version:14,flagships:Object.values(FLAGSHIPS).map(x=>x.slug),essentials:ESSENTIALS};
