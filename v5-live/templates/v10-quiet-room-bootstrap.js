/* EMORA Quiet Room bootstrap: shared V10 runtime first, flagship layer second. */
await import('/templates/v10-main.js?v=14');
await import('/templates/v10-quiet-room.js?v=1');

/* Static photos are decorative inside the ritual and must never cover the
   navigation choices. Video controls remain interactive. */
const guard=document.createElement('style');
guard.dataset.quietInteractionGuard='v1';
guard.textContent='.v10-apology-quiet .qr-memory-photo{pointer-events:none!important}.v10-apology-quiet .qr-unsaid-actions{position:relative!important;z-index:30!important}.v10-apology-quiet .qr-video-wrap,.v10-apology-quiet .qr-video,.v10-apology-quiet .qr-video video{position:relative;z-index:10;pointer-events:auto}';
document.head.append(guard);

addEventListener('message',event=>{
 if(event.origin!==location.origin||!event.data?.config)return;
 if(typeof event.data.type!=='string'||!event.data.type.startsWith('emora:'))return;
 const title=typeof event.data.config.memoryTitle==='string'?event.data.config.memoryTitle.trim():'';
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  const node=document.querySelector('.qr-gate-title');
  if(node&&title)node.textContent=title;
 }));
});
