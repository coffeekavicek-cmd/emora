/* EMORA Cinema Proposal bootstrap.
   Install the shared-cover compatibility contract before V10 exposes its ready
   signal. Creator Studio and generic QA may react to __EMORA_V10_READY__ before
   later module imports finish, so the contract is created by a DOM observer as
   soon as chapter-1 appears. */
function ensureCinemaCover(){
 if(document.documentElement.dataset.template!=='proposal-cinema'||document.getElementById('coverTitle'))return;
 const sec=document.querySelector('#chapter-1');if(!sec)return;
 const compat=document.createElement('div');compat.hidden=true;compat.setAttribute('aria-hidden','true');compat.dataset.cinemaCompat='cover';
 const title=document.createElement('h1');title.id='coverTitle';title.className='v10-cover-title';
 const name=document.createElement('p');name.className='v10-cover-name';
 const desc=document.createElement('p');desc.className='v10-cover-desc';
 compat.append(title,name,desc);sec.append(compat);
}
const cinemaObserver=new MutationObserver(ensureCinemaCover);
cinemaObserver.observe(document.getElementById('experience')||document.body,{subtree:true,childList:true});
await import('/templates/v10-main.js?v=14');
ensureCinemaCover();
await import('/templates/v10-cinema-proposal.js?v=1');
ensureCinemaCover();
