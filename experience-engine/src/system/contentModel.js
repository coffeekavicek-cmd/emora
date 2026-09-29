import { TEMPLATE_BY_ID } from './templateManifest.js';

export function readUrlContent(templateId='love-pearl'){
  const template=TEMPLATE_BY_ID[templateId];
  const q=new URLSearchParams(location.search);
  const read=(key,fallback='',max=500)=>String(q.get(key)||'').trim().slice(0,max)||fallback;

  const base={
    templateId,
    title:read('title',template?.name||'Emora',90),
    recipient:read('name','Dilnoza',60),
    message:read('intro','Senga aytolmay yurgan bir nechta gapim bor.',130),
    language:read('lang','uz',8),
    guestGreeting:read('greeting','Faqat sen uchun',120),
    paragraphs:[
      read('m1','Ba’zan odam hayotga shovqinsiz kiradi. Keyin esa hamma narsa undan oldin va undan keyin bo‘lib qoladi.',240),
      read('m2','Sen bilan oddiy kun ham xotiraga aylanadi. Men aynan shu oddiylikni eng ko‘p qadrlayman.',240),
      read('m3','Bu maktub ichida katta va murakkab gap yo‘q. Faqat rost gap bor.',220),
    ],
    captions:[
      read('c1','bizning birinchi kulgimiz',90),
      read('c2','hech qayerga shoshilmagan kun',90),
      read('c3','yana qaytishni istaydigan lahza',90),
    ],
    final:read('final','Sening yoningda o‘zimni uyga qaytgandek his qilaman.',220),
    wordLock:read('lock','',64),
    responseEnabled:q.get('response')!=='0',
    shareEnabled:q.get('share')!=='0',
    saveEnabled:q.get('save')!=='0',
  };

  return base;
}

export function contentToSearchParams(content){
  const p=new URLSearchParams();
  const put=(key,value)=>{if(value!=null&&String(value).trim()!=='')p.set(key,String(value).trim())};
  put('template',content.templateId);
  put('title',content.title);
  put('name',content.recipient);
  put('intro',content.message);
  put('lang',content.language);
  put('greeting',content.guestGreeting);
  (content.paragraphs||[]).forEach((x,i)=>put('m'+(i+1),x));
  (content.captions||[]).forEach((x,i)=>put('c'+(i+1),x));
  put('final',content.final);
  put('lock',content.wordLock);
  if(content.responseEnabled===false)p.set('response','0');
  if(content.shareEnabled===false)p.set('share','0');
  if(content.saveEnabled===false)p.set('save','0');
  return p;
}
