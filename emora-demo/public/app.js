import {renderEditor} from './editor.js';
import {playStory} from './story.js';
const root=document.querySelector('#app');
const match=/^\/s\/([a-f0-9]{24})\/?$/.exec(location.pathname);
if(match){
  fetch(`/api/stories/${match[1]}`).then(async response=>{
    const data=await response.json();
    if(!response.ok)throw Error(data.error||'Hikoya ochilmadi');
    if(!['birthday','apology','proposal'].includes(data.type))throw Error('Bu hikoya qo‘llanmaydi');
    playStory(data);
  }).catch(error=>{
    root.innerHTML=`<main class="scene-error"><div><h1>Hikoya ochilmadi.</h1><p id="load-error"></p><p><a href="/">EMORA bosh sahifasiga qaytish →</a></p></div></main>`;
    document.querySelector('#load-error').textContent=error.message;
  });
}else renderEditor().catch(error=>{
  root.innerHTML=`<main class="scene-error"><div><h1>Studio ochilmadi.</h1><p id="load-error"></p></div></main>`;
  document.querySelector('#load-error').textContent=error.message;
});
