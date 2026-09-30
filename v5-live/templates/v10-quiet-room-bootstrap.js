/* EMORA Quiet Room bootstrap: shared V10 runtime first, flagship layer second. */
await import('/templates/v10-main.js?v=14');
await import('/templates/v10-quiet-room.js?v=1');

/* Static photos are decorative inside the ritual and must never cover the
   navigation choices. Video controls remain interactive. */
const guard=document.createElement('style');
guard.dataset.quietInteractionGuard='v1';
guard.textContent='.v10-apology-quiet .qr-memory-photo{pointer-events:none!important}.v10-apology-quiet .qr-unsaid-actions{position:relative!important;z-index:30!important}.v10-apology-quiet .qr-video-wrap,.v10-apology-quiet .qr-video,.v10-apology-quiet .qr-video video{position:relative;z-index:10;pointer-events:auto}';
document.head.append(guard);

const clean=v=>typeof v==='string'?v.trim():'';
function syncQuietConfig(cfg){
 const set=(selector,value)=>{const node=document.querySelector(selector);if(node&&clean(value))node.textContent=clean(value)};
 set('.qr-gate-title',cfg.memoryTitle);
 set('.qr-person',cfg.recipient||cfg.name1);
 set('.qr-honest-text',cfg.mistake);
 set('.qr-repair-text',cfg.repair);
 set('.qr-unsaid-text',cfg.letter);
 set('.qr-final-title',cfg.finalQuestion||cfg.final);
 set('.qr-sign',cfg.sender||cfg.name2);
 if(Array.isArray(cfg.captions))document.querySelectorAll('.qr-listen-line').forEach((node,i)=>{const value=clean(cfg.captions[i]);if(value)node.textContent=value});
}
addEventListener('message',event=>{
 if(event.origin!==location.origin||!event.data?.config)return;
 if(typeof event.data.type!=='string'||!event.data.type.startsWith('emora:'))return;
 const cfg=event.data.config;
 requestAnimationFrame(()=>requestAnimationFrame(()=>syncQuietConfig(cfg)));
});
