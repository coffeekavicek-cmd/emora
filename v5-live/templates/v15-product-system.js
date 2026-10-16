/* Emora: four gifts, one language per gift, a short guided creator. */
const GIFTS={
 love:{slug:'love-rose-theatre',name:'Признание в любви',art:'/assets/love-rose.png',copy:'Ваши фото, личное видео, письмо и портрет из её имени.'},
 birthday:{slug:'birthday-aurora-paper',name:'С днём рождения',art:'/assets/birthday-aurora.png',copy:'Свечи на торте, её фото, видео и поздравление в конверте.'},
 apology:{slug:'apology-quiet-room',name:'Хочу извиниться',art:'/assets/apology-quiet.png',copy:'Маленький секрет, письмо и возможность выбрать встречу.'},
 proposal:{slug:'proposal-pearl-promise',name:'Будь моей женой',art:'/assets/proposal-pearl.png',copy:'Ваши воспоминания, обещание и тот самый вопрос.'}
};
const $=s=>document.querySelector(s),field=id=>$('#'+id)?.closest('.field');
const KEY='emora:creator-local-draft:v4';let timer=0,restored=false;
const ids=['type','templateLang','name1','name2','headline','letter','headlineRu','headlineEn','letterRu','letterEn','memoryTitle','caption1','caption2','caption3','finalQuestion','mistake','repair','venue','date','eventClock'];
function sync(){
 const slug=$('#type')?.value,gift=Object.values(GIFTS).find(x=>x.slug===slug);if(!gift)return;
 const needed=['name1','letter'];const done=needed.filter(id=>$('#'+id)?.value.trim()).length;
 document.documentElement.dataset.creatorReady=String(done===needed.length);
 $('#v15-next-hint').textContent=done===needed.length?'Всё готово. Посмотри подарок перед отправкой.':!$('#name1').value.trim()?'Начни с её имени.':'Напиши ей пару слов от себя.';
 const lang=$('#templateLang')?.value||'ru';
 for(const id of ['headlineRu','headlineEn','letterRu','letterEn'])field(id)?.classList.add('v15-hidden');
 $('#v15-translations')?.classList.add('v15-group-hidden');
 $('#weddingExtra')?.classList.add('v15-group-hidden');$('#guestBox')?.classList.add('v15-group-hidden');
 const birthday=slug==='birthday-aurora-paper';$('#dateField')?.classList.toggle('v15-group-hidden',!birthday);if(birthday)$('#dateField')?.classList.remove('hidden');$('#eventClock')?.classList.add('hidden');
 field('date')?.querySelector('label')?.replaceChildren(document.createTextNode('День рождения · можно пропустить'));
 const labels={name1:'Как её зовут?',name2:'От кого подарок?',headline:'Первая фраза · необязательно',letter:'Что хочешь ей сказать?',finalQuestion:'Последняя фраза · необязательно',memoryTitle:slug==='apology-quiet-room'?'Подсказка к секрету · необязательно':'Название вашей истории · необязательно',caption1:'Подпись к первому фото',caption2:'Подпись ко второму фото',caption3:'Подпись к третьему фото',photo1:'Её портрет · первое фото',photo2:'Второе фото',photo3:'Третье фото',videoUrl:'Ваше видео',musicUrl:'Музыка',mistake:slug==='proposal-pearl-promise'?'За что я тебя люблю · первая причина':'За что хочешь извиниться?',repair:slug==='proposal-pearl-promise'?'За что я тебя люблю · вторая причина':'Что теперь сделаешь иначе?',venue:'За что я тебя люблю · третья причина',slug:'Название ссылки'};
 for(const [id,text]of Object.entries(labels)){const node=field(id)?.querySelector(':scope > label');if(node&&node.textContent!==text)node.textContent=text;}
 field('venue')?.classList.toggle('v15-hidden',slug!=='proposal-pearl-promise');
 const letter=$('#letter');if(letter)letter.placeholder=lang==='ru'?'Напиши так, как сказал бы ей сам.':lang==='uz'?'Unga o‘zing aytadigan gaplaringni yoz.':'Write it like you would say it to her.';
 document.querySelectorAll('.v13-required-badge,.v13-optional-badge,.v14-authoritative-optional,.v15-required,.v15-optional').forEach(x=>x.remove());
}
function persist(){clearTimeout(timer);timer=setTimeout(()=>{try{const values={};for(const id of ids)if($('#'+id))values[id]=$('#'+id).value;localStorage.setItem(KEY,JSON.stringify({savedAt:Date.now(),values}));$('#v15-autosave').textContent='Изменения сохранены на этом устройстве';}catch{$('#v15-autosave').textContent='Не удалось сохранить на устройстве. Сохрани в аккаунт.';}},220);}
function decorate(){
 if(!$('#studio .panel')||$('#v15-fast-path'))return;
 const head=document.createElement('div');head.id='v15-fast-path';head.className='v15-fast-path';head.innerHTML='<strong>Сделай подарок своим</strong><span>Имя → твои слова → фото и музыка → посмотреть</span>';field('type').before(head);
 const hint=document.createElement('p');hint.id='v15-next-hint';hint.className='v15-privacy';head.after(hint);
 const media=document.createElement('details');media.id='v15-media';media.className='v15-editor-details';media.innerHTML='<summary><strong>Добавить фото, видео и музыку</strong><span>Для вашего настроения</span></summary>';
 const photo=field('photo1'),row=$('#videoUrl')?.closest('.panel-row');if(photo){photo.before(media);for(const id of ['photo1','photo2','photo3'])if(field(id))media.append(field(id));if(row)media.append(row);}
 const extra=document.createElement('details');extra.className='v15-editor-details';extra.innerHTML='<summary><strong>Ещё пара личных деталей</strong><span>Можно пропустить</span></summary>';
 const story=$('#storyExtras');if(story){story.prepend(extra);for(const id of ['memoryTitle','caption1','caption2','caption3','finalQuestion'])if(field(id))extra.append(field(id));}
 const autosave=document.createElement('small');autosave.id='v15-autosave';autosave.className='v15-autosave';autosave.textContent='Изменения сохраняются на этом устройстве';$('#status')?.before(autosave);
 if(!restored){restored=true;try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&Date.now()-saved.savedAt<30*86400000){for(const [id,v]of Object.entries(saved.values||{})){if($('#'+id)&&typeof v==='string')$('#'+id).value=v;}$('#type')?.dispatchEvent(new Event('change',{bubbles:true}));}}catch{}}
 const share=document.createElement('div');share.className='v15-share-panel';share.innerHTML='<strong>Подарок готов</strong><span>Она откроет его по ссылке. Входить в аккаунт не нужно.</span>';
 $('#publishResult')?.append(share);
 document.addEventListener('input',()=>{sync();persist();},true);document.addEventListener('change',()=>{sync();persist();},true);document.addEventListener('emora:creator-fields',sync);
 $('#publishBtn')?.addEventListener('click',e=>{sync();if(document.documentElement.dataset.creatorReady!=='true'){e.preventDefault();e.stopImmediatePropagation();$('#status').textContent='Добавь её имя и свои слова. Потом посмотрим подарок.';hint.scrollIntoView({behavior:'smooth',block:'center'});}else if(!$('#slug').value.trim()){const name=String($('#name1').value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,22)||'gift';const random=crypto.getRandomValues(new Uint32Array(1))[0].toString(36);$('#slug').value=name+'-'+random;}},true);
 window.__EMORA_V15__={version:29,flagships:Object.values(GIFTS).map(x=>x.slug),essentials:Object.fromEntries(Object.values(GIFTS).map(x=>[x.slug,['name1','letter']]))};sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',decorate,{once:true});else decorate();
