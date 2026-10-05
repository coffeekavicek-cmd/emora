/* EMORA V12 · product polish.
   Curates the public catalog to one flagship per category, removes internal
   implementation language, and keeps optional creator controls out of the fast path. */
const FLAGSHIPS={
 love:{slug:'love-rose-theatre',name:'Rose Theatre'},
 wedding:{slug:'wedding-silk-heritage',name:'Silk Heritage'},
 birthday:{slug:'birthday-aurora-paper',name:'Aurora Paper'},
 apology:{slug:'apology-quiet-room',name:'Quiet Room'},
 proposal:{slug:'proposal-pearl-promise',name:'Pearl Promise'}
};
const allowedSlugs=new Set(Object.values(FLAGSHIPS).map(x=>x.slug));
const allowedNames=new Set(Object.values(FLAGSHIPS).map(x=>x.name));
let scheduled=false;

function replaceMarketingCopy(){
 const root=document.body;if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){let v=node.nodeValue||'',n=v;
  n=n.replace(/5 yo‘nalishda 15 ta original cinematic shablon/gi,'5 yo‘nalishda 5 ta flagship cinematic experience');
  n=n.replace(/15 shablonni ko‘rish/gi,'5 flagshipni ko‘rish');n=n.replace(/15 SIGNATURE EXPERIENCES/g,'5 CURATED FLAGSHIPS');n=n.replace(/15 ta original/gi,'5 ta flagship');
  n=n.replace(/Shablonni haqiqiy loyihaga aylantiring\./g,"Experience'ni o‘zingizniki qiling.");
  n=n.replace(/Akkauntga kirgach draft Supabase’da saqlanadi, Publish esa public havola yaratadi\./g,'Preview darhol ishlaydi. Akkauntga kirgach draft saqlanadi, Publish esa shaxsiy havola yaratadi.');
  n=n.replace(/Draft Supabase’da saqlandi ✓/g,'Draft saqlandi ✓');
  n=n.replace(/uchun shablonlar/g,'uchun flagship experience');
  n=n.replace(/Shu uslubda yaratish/g,'Shu experience bilan yaratish');
  n=n.replace(/Photo sources: Wikimedia Commons \/ CC0 Unsplash archives · Click\/Payme keyin/g,'Visual references: Wikimedia Commons / CC0 Unsplash archives · EMORA');
  if(n!==v)node.nodeValue=n;
 }
 document.querySelectorAll('.category-count').forEach(n=>{if(n.textContent?.trim()!=='1 FLAGSHIP')n.textContent='1 FLAGSHIP'});
 const templateLabel=document.querySelector('#type')?.closest('.field')?.querySelector(':scope > label');if(templateLabel&&templateLabel.textContent!=='EXPERIENCE')templateLabel.textContent='EXPERIENCE';
 document.querySelector('.competitor-note')?.remove();
}
function addProofStrip(){
 const actions=document.querySelector('.hero .actions');if(!actions||document.querySelector('.v12-proof-strip'))return;
 const strip=document.createElement('div');strip.className='v12-proof-strip';
 ['Preview bepul','Preview uchun akkaunt shart emas','Recipient login qilmaydi','Mobile-first'].forEach(text=>{const span=document.createElement('span');span.textContent=text;strip.append(span)});actions.insertAdjacentElement('afterend',strip);
}
function filterCards(){
 document.querySelectorAll('#templateCards .card').forEach(card=>{const name=card.querySelector('h3')?.textContent?.trim();if(name&&!allowedNames.has(name))card.remove()});
 const visible=[...document.querySelectorAll('#templateCards .card')];if(visible.length===1){const p=document.querySelector('#selectedCategoryCopy');if(p&&!p.dataset.v12copy){p.dataset.v12copy='1';p.insertAdjacentHTML('afterend','<p class="v12-curated-note">Bitta yo‘nalish — bitta eng kuchli experience. Ko‘p variant emas, sifatga fokus.</p>')}}
}
function filterType(){const select=document.querySelector('#type');if(!select)return;[...select.options].forEach(opt=>{if(!allowedSlugs.has(opt.value))opt.remove()})}
function progressiveEditor(){
 const studio=document.querySelector('#studio .panel');if(!studio)return;
 if(!document.querySelector('#v12-translations')){
  const h=document.querySelector('#headlineRu')?.closest('.panel-row'),l=document.querySelector('#letterRu')?.closest('.panel-row');
  if(h&&l){const details=document.createElement('details');details.id='v12-translations';details.className='v12-editor-details';const summary=document.createElement('summary');summary.innerHTML='<strong>Tarjimalar</strong><span>RU / EN · ixtiyoriy</span>';const note=h.previousElementSibling?.classList.contains('lang-note')?h.previousElementSibling:null;h.before(details);details.append(summary);if(note)details.append(note);details.append(h,l)}
 }
 if(!document.querySelector('#v12-media')){
  const p1=document.querySelector('#photo1')?.closest('.field'),p2=document.querySelector('#photo2')?.closest('.field'),p3=document.querySelector('#photo3')?.closest('.field'),vm=document.querySelector('#videoUrl')?.closest('.panel-row');
  if(p1&&p2&&p3&&vm){const details=document.createElement('details');details.id='v12-media';details.className='v12-editor-details v12-media-details';const summary=document.createElement('summary');summary.innerHTML='<strong>Shaxsiy media</strong><span>3 surat · video · musiqa</span>';const note=p1.previousElementSibling?.classList.contains('lang-note')?p1.previousElementSibling:null;p1.before(details);details.append(summary);if(note)details.append(note);details.append(p1,p2,p3,vm)}
 }
}
function decorate(){
 replaceMarketingCopy();addProofStrip();filterCards();filterType();progressiveEditor();document.documentElement.dataset.emoraCatalog='five-flagships';
 if(!document.querySelector('#v12-product-style')){const style=document.createElement('style');style.id='v12-product-style';style.textContent=`
  .v12-proof-strip{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;max-width:760px}.v12-proof-strip span{border:1px solid var(--line,#e6d9cc);background:#fffdf9;padding:8px 11px;border-radius:999px;font-size:9px;letter-spacing:.08em;color:var(--sage,#647a6d);font-weight:800}.v12-curated-note{margin:8px 0 0;color:var(--rose,#b77d78);font-size:11px;letter-spacing:.04em}
  .v12-editor-details{margin:13px 0;border:1px solid var(--line,#e7ddd2);border-radius:18px;background:#fffdf9;overflow:hidden}.v12-editor-details>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 15px;cursor:pointer;user-select:none}.v12-editor-details>summary::-webkit-details-marker{display:none}.v12-editor-details>summary strong{font:600 12px/1.2 system-ui;letter-spacing:.04em;color:var(--ink,#34433c)}.v12-editor-details>summary span{font-size:9px;letter-spacing:.08em;color:var(--rose,#b77d78);font-weight:800}.v12-editor-details[open]>summary{border-bottom:1px solid var(--line,#e7ddd2);background:var(--ivory,#faf4eb)}.v12-editor-details>.field,.v12-editor-details>.panel-row,.v12-editor-details>.lang-note{margin-left:14px!important;margin-right:14px!important}.v12-editor-details>:last-child{margin-bottom:14px!important}
  @media(max-width:720px){.v12-proof-strip{gap:6px}.v12-proof-strip span{font-size:8px;padding:7px 9px}.v12-editor-details>summary{padding:13px}}
 `;document.head.append(style)}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;decorate()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
