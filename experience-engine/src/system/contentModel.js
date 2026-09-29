import { TEMPLATE_BY_ID } from './templateManifest.js';
import { contentDefaultsFor } from './templateDefaults.js';

export function readUrlContent(templateId='love-pearl'){
  const template=TEMPLATE_BY_ID[templateId];
  const defaults=contentDefaultsFor(templateId);
  const q=new URLSearchParams(location.search);
  const read=(key,fallback='',max=500)=>String(q.get(key)||'').trim().slice(0,max)||fallback;

  const base={
    templateId,
    title:read('title',template?.name||'Emora',90),
    recipient:read('name','Dilnoza',60),
    message:read('intro',defaults.message,180),
    language:read('lang','uz',8),
    guestGreeting:read('greeting','Faqat sen uchun',120),
    paragraphs:[
      read('m1',defaults.paragraphs[0],240),
      read('m2',defaults.paragraphs[1],240),
      read('m3',defaults.paragraphs[2],240),
    ],
    captions:[
      read('c1',defaults.captions[0],90),
      read('c2',defaults.captions[1],90),
      read('c3',defaults.captions[2],90),
    ],
    final:read('final',defaults.final,240),
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
