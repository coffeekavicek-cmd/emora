/* EMORA V18 · experience-first navigation and focused creator shell */
const V18_DIRECT={
 love:'/templates/v10-love-rose.html',
 birthday:'/templates/v10-birthday-aurora.html',
 apology:'/templates/v10-apology-quiet.html',
 proposal:'/templates/v10-proposal-pearl.html',
 wedding:'/templates/wedding-silk.html'
};
function v18StudioIntro(){
 const grid=document.querySelector('#studio .studio-grid');
 if(!grid||grid.querySelector('.v18-studio-intro'))return;
 const box=document.createElement('section');box.className='v18-studio-intro';
 box.innerHTML='<div><h3>Avval his qil. Keyin o‘zingniki qil.</h3><p>Shablon — oddiy sahifa emas. Full-screen experience’ni alohida ko‘ring, keyin bu studio’da faqat kerakli gap va media’ni almashtiring.</p></div><div class="v18-studio-points"><span>Full-screen demo</span><span>Live update</span><span>Media ixtiyoriy</span><span>Private link</span></div>';
 grid.prepend(box)
}
function v18OpenExperience(category){const u=V18_DIRECT[category];if(!u)return;window.open(u,'_blank','noopener,noreferrer')}
function v18FocusStudio(){const s=document.querySelector('#studio');if(!s)return;s.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>document.querySelector('#name1')?.focus({preventScroll:true}),650)}
/* Capture preview before legacy card handlers: preview must be a real full-screen ritual, not the phone mockup. */
document.addEventListener('click',e=>{
 const preview=e.target.closest('.v15-preview');if(preview){const cat=preview.closest('.category-card')?.dataset.category;if(cat){e.preventDefault();e.stopImmediatePropagation();v18OpenExperience(cat);return}}
 const create=e.target.closest('.v15-create');if(create){setTimeout(v18FocusStudio,80)}
},true);
function v18Relabel(){
 const previewLabel=document.querySelector('#previewLabel');if(previewLabel&&!previewLabel.dataset.v18){previewLabel.dataset.v18='1';previewLabel.textContent=previewLabel.textContent.replace(' / LIVE EXPERIENCE',' · LIVE')}
 document.querySelectorAll('.v15-preview').forEach(b=>{b.title='Full-screen experience’ni yangi oynada ochish';b.setAttribute('aria-label','Full-screen demo ochish')});
 document.querySelectorAll('.v15-create').forEach(b=>{b.title='Shu experience bilan yaratish'})
}
const obs=new MutationObserver(()=>{v18StudioIntro();v18Relabel()});
obs.observe(document.documentElement,{subtree:true,childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{v18StudioIntro();v18Relabel()},{once:true});else{v18StudioIntro();v18Relabel()}
window.__EMORA_V18__={experienceFirst:true,directFullScreenPreview:true,studio:'focused'};
