/* EMORA Quiet Room bootstrap: shared V10 runtime first, flagship layer second. */
await import('/templates/v10-main.js?v=14');
await import('/templates/v10-quiet-room.js?v=1');

addEventListener('message',event=>{
 if(event.origin!==location.origin||!event.data?.config)return;
 if(typeof event.data.type!=='string'||!event.data.type.startsWith('emora:'))return;
 const title=typeof event.data.config.memoryTitle==='string'?event.data.config.memoryTitle.trim():'';
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  const node=document.querySelector('.qr-gate-title');
  if(node&&title)node.textContent=title;
 }));
});
