/* EMORA V12 · Silk Heritage optional personal film.
   Keeps the dedicated wedding engine intact while making the shared Studio video
   field visible inside the love-story chapter. */
const clean=v=>typeof v==='string'?v.trim():'';
function safeMedia(value){
 const raw=clean(value);if(!raw)return '';
 try{const u=new URL(raw,location.origin);if(u.protocol==='https:'||(u.origin===location.origin&&u.pathname.startsWith('/assets/')))return u.href}catch{}
 return '';
}
function render(cfg){
 const points=document.querySelector('#storyPoints');if(!points)return;
 points.parentElement?.querySelector('.v12-silk-video')?.remove();
 const src=safeMedia(cfg?.video);if(!src)return;
 const wrap=document.createElement('section');wrap.className='v12-silk-video reveal visible';wrap.setAttribute('aria-label','Shaxsiy to‘y videosi');
 const meta=document.createElement('div');meta.className='v12-silk-video-meta';meta.innerHTML='<small>PERSONAL FILM · OPTIONAL</small><strong>Bizning hikoyamiz, harakatda.</strong><p>Video faqat mehmon bosganda ijro etiladi.</p>';
 const video=document.createElement('video');video.className='v12-silk-video-player';video.src=src;video.controls=true;video.playsInline=true;video.preload='metadata';video.autoplay=false;
 wrap.append(meta,video);points.insertAdjacentElement('afterend',wrap);document.querySelector('#story')?.removeAttribute('hidden');
}
addEventListener('message',event=>{if(event.origin!==location.origin)return;const data=event.data;if(!data||typeof data.type!=='string'||!data.type.startsWith('emora:')||!data.config)return;render(data.config)});
