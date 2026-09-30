/* Cinema Proposal keeps the shared V10 cover contract for live editor patching.
   These nodes are intentionally hidden: the flagship ticket UI is the visible cover. */
if(document.documentElement.dataset.template==='proposal-cinema'){
 const sec=document.querySelector('#chapter-1');
 if(sec&&!document.getElementById('coverTitle')){
  const compat=document.createElement('div');compat.hidden=true;compat.setAttribute('aria-hidden','true');compat.dataset.cinemaCompat='cover';
  const title=document.createElement('h1');title.id='coverTitle';title.className='v10-cover-title';
  const name=document.createElement('p');name.className='v10-cover-name';
  const desc=document.createElement('p');desc.className='v10-cover-desc';
  compat.append(title,name,desc);sec.append(compat);
 }
}
