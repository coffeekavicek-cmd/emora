/* Pearl Promise config compatibility bridge.
   The current Creator Studio persists three spare text fields as mistake/repair/venue.
   For Pearl Promise only, normalize them into semantic proposalReasons before the
   flagship layer consumes the config. This keeps existing saved-project schema valid. */
const IS_PEARL=document.documentElement.dataset.template==='proposal-pearl';
const clean=v=>typeof v==='string'?v.trim():'';
if(IS_PEARL){
 addEventListener('message',event=>{
  if(event.origin!==location.origin||!event.data||event.data.type==='emora:pearl-normalized'||!event.data.config)return;
  if(typeof event.data.type!=='string'||!event.data.type.startsWith('emora:'))return;
  const cfg=event.data.config;
  if(Array.isArray(cfg.proposalReasons))return;
  const proposalReasons=[clean(cfg.mistake),clean(cfg.repair),clean(cfg.venue)].filter(Boolean).slice(0,3);
  const normalized={...cfg,proposalReasons,promiseText:clean(cfg.promiseText)||clean(cfg.letter),finalQuestion:clean(cfg.finalQuestion)||clean(cfg.final)};
  postMessage({type:'emora:pearl-normalized',config:normalized},location.origin);
 });
}
