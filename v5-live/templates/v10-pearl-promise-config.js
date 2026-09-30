/* Pearl Promise config compatibility bridge.
   The current Creator Studio persists three spare text fields as mistake/repair/venue.
   For Pearl Promise only, normalize them into semantic proposalReasons before the
   flagship layer consumes the config. This keeps existing saved-project schema valid. */
const IS_PEARL=document.documentElement.dataset.template==='proposal-pearl';
const clean=v=>typeof v==='string'?v.trim():'';
if(IS_PEARL){
 const style=document.createElement('style');
 style.dataset.pearlLayoutFix='v1';
 style.textContent='.v10-proposal-pearl .pp-vow-video{position:relative!important;inset:auto!important;right:auto!important;bottom:auto!important;flex:0 1 auto}.v10-proposal-pearl .pp-vow-footer{position:relative;z-index:12;flex:0 0 auto}';
 document.head.append(style);

 // V11 locks stage transitions briefly. If a fast user taps the Pearl vow CTA
 // during that lock, replay the intent once the transition is free instead of
 // silently losing the tap. If the normal click already advanced, this does nothing.
 document.addEventListener('click',event=>{
  const button=event.target instanceof Element?event.target.closest('.pp-vow-footer .v10-cta'):null;
  if(!button)return;
  const active=document.querySelector('#main > .v11-stage-active');
  if(active?.id!=='chapter-4')return;
  setTimeout(()=>{
   if(document.querySelector('#main > .v11-stage-active')?.id!=='chapter-4')return;
   window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',code:'ArrowRight',bubbles:true,cancelable:true}));
  },950);
 },true);

 addEventListener('message',event=>{
  if(event.origin!==location.origin||!event.data||event.data.type==='emora:pearl-normalized'||!event.data.config)return;
  if(typeof event.data.type!=='string'||!event.data.type.startsWith('emora:'))return;
  const cfg=event.data.config;
  if(Array.isArray(cfg.proposalReasons))return;
  const proposalReasons=[clean(cfg.mistake),clean(cfg.repair),clean(cfg.venue)].slice(0,3);
  const normalized={...cfg,proposalReasons,promiseText:clean(cfg.promiseText)||clean(cfg.letter),finalQuestion:clean(cfg.finalQuestion)||clean(cfg.final)};
  postMessage({type:'emora:pearl-normalized',config:normalized},location.origin);
 });
}
