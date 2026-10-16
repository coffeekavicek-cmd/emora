/* One shared transport, including gesture activation and video/background suspension. */
(()=>{'use strict';
const root=document.getElementById('experience');if(!root)return;
const kind=document.documentElement.dataset.template==='birthday-cake-v19'?'birthday':document.documentElement.dataset.emoraExperience==='apology-v24'?'apology':document.documentElement.dataset.emoraExperience==='love-v26'?'love':'proposal';
const tracks={birthday:'Carefree',apology:'Thinking of You',love:'Heartwarming',proposal:'There is Romance'};
let wanted=true,started=false,videoPlaying=false,audio=null,custom=false;
const control=document.createElement('button');control.type='button';control.className='v42-sound';control.setAttribute('aria-pressed','false');
const credit=document.createElement('details');credit.className='v42-credit';
credit.innerHTML='<summary></summary><p><span></span> — <a href="https://incompetech.com/music/" target="_blank" rel="noopener">Kevin MacLeod</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a><br><small>65-second edit · fade in/out · mono</small></p>';
document.body.append(control,credit);credit.querySelector('span').textContent=tracks[kind];
function labels(){const l=document.documentElement.lang;const on=audio&&!audio.paused&&!audio.muted;control.textContent=l==='uz'?(on?'Ovoz yoqilgan':'Ovozni yoqish'):l==='en'?(on?'Sound on':'Sound off'):(on?'Звук включён':'Включить звук');control.setAttribute('aria-label',l==='uz'?(on?'Ovozni o‘chirish':'Ovozni yoqish'):l==='en'?(on?'Mute music':'Play music'):(on?'Выключить музыку':'Включить музыку'));control.setAttribute('aria-pressed',String(on));credit.querySelector('summary').textContent=l==='uz'?'Musiqa':l==='en'?'Music':'Музыка';credit.hidden=custom;}
function bind(){const next=window.__EMORA_AUDIO__||document.getElementById('audio');if(!next)return;if(audio!==next){audio?.pause();audio=next;audio.loop=true;audio.volume=.32;audio.preload='metadata';for(const ev of ['play','pause','error'])audio.addEventListener(ev,labels);}if(!audio.getAttribute('src'))audio.src='/assets/theme-'+kind+'-v42.mp3';audio.muted=!wanted;labels();}
async function play(){bind();if(!audio||!wanted||document.hidden||videoPlaying)return;try{await audio.play();started=true;}catch{}labels();}
control.onclick=()=>{bind();wanted=!(audio&&!audio.paused&&!audio.muted);if(audio){audio.muted=!wanted;if(wanted)play();else audio.pause();}labels();};
document.addEventListener('pointerdown',e=>{if(e.target.closest('.v42-sound,.v42-credit')||started)return;play();},{passive:true});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!started)play();});
document.addEventListener('play',e=>{if(e.target.tagName==='VIDEO'){videoPlaying=true;audio?.pause();}},true);
function videoStop(e){if(e.target.tagName!=='VIDEO')return;videoPlaying=[...document.querySelectorAll('video')].some(v=>!v.paused&&!v.ended);if(started&&!videoPlaying)play();}
document.addEventListener('pause',videoStop,true);document.addEventListener('ended',videoStop,true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio?.pause();else if(started)play();});
window.addEventListener('pagehide',()=>audio?.pause());
window.addEventListener('message',e=>{if(e.origin!==location.origin)return;const c=e.data?.config||e.data;if(!c||typeof c!=='object')return;if('music'in c||'musicUrl'in c)custom=!!(c.music||c.musicUrl);setTimeout(()=>{bind();if(started)play();},0);});
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;bind();});}).observe(root,{childList:true,subtree:true});bind();
})();
