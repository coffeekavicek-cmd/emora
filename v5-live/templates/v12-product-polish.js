/* EMORA V12 · product polish.
   Curates the public catalog to one flagship per category while keeping the
   older ten experiences reachable for backwards compatibility and regression QA. */
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
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  let v=node.nodeValue||'',n=v;
  n=n.replace(/5 yo‘nalishda 15 ta original cinematic shablon/gi,'5 yo‘nalishda 5 ta flagship cinematic experience');
  n=n.replace(/15 shablonni ko‘rish/gi,'5 flagshipni ko‘rish');
  n=n.replace(/15 SIGNATURE EXPERIENCES/g,'5 CURATED FLAGSHIPS');
  n=n.replace(/15 ta original/gi,'5 ta flagship');
  if(n!==v)node.nodeValue=n;
 }
 document.querySelectorAll('.category-count').forEach(n=>n.textContent='1 FLAGSHIP');
}
function addProofStrip(){
 const actions=document.querySelector('.hero .actions');
 if(!actions||document.querySelector('.v12-proof-strip'))return;
 const strip=document.createElement('div');strip.className='v12-proof-strip';
 ['Preview bepul','Preview uchun akkaunt shart emas','Recipient login qilmaydi','Mobile-first'].forEach(text=>{const span=document.createElement('span');span.textContent=text;strip.append(span)});
 actions.insertAdjacentElement('afterend',strip);
}
function filterCards(){
 document.querySelectorAll('#templateCards .card').forEach(card=>{
  const name=card.querySelector('h3')?.textContent?.trim();
  if(name&&!allowedNames.has(name))card.remove();
 });
 const visible=[...document.querySelectorAll('#templateCards .card')];
 if(visible.length===1){
  const p=document.querySelector('#selectedCategoryCopy');
  if(p&&!p.dataset.v12copy){p.dataset.v12copy='1';p.insertAdjacentHTML('afterend','<p class="v12-curated-note">Bitta yo‘nalish — bitta eng kuchli experience. Ko‘p variant emas, sifatga fokus.</p>')}
 }
}
function filterType(){
 const select=document.querySelector('#type');if(!select)return;
 [...select.options].forEach(opt=>{if(!allowedSlugs.has(opt.value))opt.remove()});
}
function decorate(){
 replaceMarketingCopy();addProofStrip();filterCards();filterType();
 document.documentElement.dataset.emoraCatalog='five-flagships';
 if(!document.querySelector('#v12-product-style')){
  const style=document.createElement('style');style.id='v12-product-style';style.textContent=`
   .v12-proof-strip{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;max-width:760px}
   .v12-proof-strip span{border:1px solid var(--line,#e6d9cc);background:#fffdf9;padding:8px 11px;border-radius:999px;font-size:9px;letter-spacing:.08em;color:var(--sage,#647a6d);font-weight:800}
   .v12-curated-note{margin:8px 0 0;color:var(--rose,#b77d78);font-size:11px;letter-spacing:.04em}
   @media(max-width:720px){.v12-proof-strip{gap:6px}.v12-proof-strip span{font-size:8px;padding:7px 9px}}
  `;document.head.append(style);
 }
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;decorate()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
