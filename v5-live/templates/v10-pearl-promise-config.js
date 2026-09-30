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
