import { TEMPLATE_BY_ID } from './templateManifest.js';

const DEFAULT_CONTENT={
  'love-pearl':{
    recipient:'Dilnoza',
    message:'Senga aytolmay yurgan bir nechta gapim bor.',
    paragraphs:[
      'Ba’zan odam hayotga shovqinsiz kiradi. Keyin esa hamma narsa undan oldin va undan keyin bo‘lib qoladi.',
      'Sen bilan oddiy kun ham xotiraga aylanadi. Men aynan shu oddiylikni eng ko‘p qadrlayman.',
      'Bu maktub ichida katta va murakkab gap yo‘q. Faqat rost gap bor.',
    ],
    captions:['bizning birinchi kulgimiz','hech qayerga shoshilmagan kun','yana qaytishni istaydigan lahza'],
    final:'Sening yoningda o‘zimni uyga qaytgandek his qilaman.',
  },
  'love-galaxy':{
    recipient:'Dilnoza',
    message:'Ba’zi tuyg‘ularni oddiy so‘z bilan aytib bo‘lmaydi.',
    paragraphs:[
      'Sening yoningda oddiy kunlar ham xotiraga aylanadi.',
      'Kulging — mening eng sevimli yulduzim.',
      'Bu olamda seni topganim eng go‘zal tasodif.',
    ],
    captions:['','',''],
    final:'Mening kichik olamimda eng yorqin nuqta — sensan.',
  },
};

export function readUrlContent(templateId='love-pearl'){
  const template=TEMPLATE_BY_ID[templateId];
  const defaults=DEFAULT_CONTENT[templateId]||DEFAULT_CONTENT['love-pearl'];
  const q=new URLSearchParams(location.search);
  const read=(key,fallback='',max=500)=>String(q.get(key)||'').trim().slice(0,max)||fallback;

  const base={
    templateId,
    title:read('title',template?.name||'Emora',90),
    recipient:read('name',defaults.recipient,60),
    message:read('intro',defaults.message,130),
    language:read('lang','uz',8),
    guestGreeting:read('greeting','Faqat sen uchun',120),
    paragraphs:[
      read('m1',defaults.paragraphs[0],240),
      read('m2',defaults.paragraphs[1],240),
      read('m3',defaults.paragraphs[2],220),
    ],
    captions:[
      read('c1',defaults.captions[0],90),
      read('c2',defaults.captions[1],90),
      read('c3',defaults.captions[2],90),
    ],
    final:read('final',defaults.final,220),
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
  if(content.responseEnabled===false)p.set('response','0');
  if(content.shareEnabled===false)p.set('share','0');
  if(content.saveEnabled===false)p.set('save','0');
  return p;
}


export function splitPublishPayload(content){
  const publicContent={
    title:content.title,
    recipient:content.recipient,
    message:content.message,
    language:content.language,
    guestGreeting:content.guestGreeting,
    paragraphs:content.paragraphs||[],
    captions:content.captions||[],
    final:content.final,
    responseEnabled:content.responseEnabled!==false,
    shareEnabled:content.shareEnabled!==false,
    saveEnabled:content.saveEnabled!==false,
  };
  const privateSettings={
    hasWordLock:Boolean(content.wordLock),
    // Raw lock value must be sent only to an authenticated server/edge function
    // for hashing or protected storage. It must never be embedded in public URLs.
  };
  const serverOnly={
    wordLock:content.wordLock||'',
  };
  return {publicContent,privateSettings,serverOnly};
}
