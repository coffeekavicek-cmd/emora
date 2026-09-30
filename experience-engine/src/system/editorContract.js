import { PRODUCT_CAPABILITIES as C } from './archetypes.js';

const FIELD_LIBRARY = Object.freeze({
  core: [
    {key:'title',type:'text',label:'Sarlavha',max:90},
    {key:'recipient',type:'text',label:'Qabul qiluvchi / mehmon',max:60},
    {key:'message',type:'textarea',label:'Asosiy matn',max:1200},
    {key:'language',type:'language',label:'Til'},
  ],
  universalMedia: [
    {key:'musicPreset',type:'select',label:'Musiqa preset',options:['Nocturne','Cinema','Dream','Heritage']},
    {key:'music',type:'audio',label:'Custom musiqa'},
    {key:'musicStart',type:'number',label:'Musiqa boshlanish nuqtasi',min:0},
    {key:'photos',type:'images',label:'Rasmlar',maxItems:10},
    {key:'video',type:'video',label:'Asosiy video'},
  ],
  event: [
    {key:'eventDate',type:'datetime',label:'Sana va vaqt'},
    {key:'venueName',type:'text',label:'Joy nomi',max:100},
    {key:'venueAddress',type:'text',label:'Manzil',max:180},
  ],
  [C.GUEST_GREETING]: [
    {key:'guestGreeting',type:'text',label:'Shaxsiy salomlashuv',max:120},
  ],
  [C.PHOTOS]: [
    {key:'photoCaptions',type:'text-list',label:'Rasm izohlari',maxItems:10,max:90},
  ],
  [C.PORTRAIT]: [
    {key:'portrait',type:'image',label:'Final portret uchun rasm'},
    {key:'portraitParticle',type:'select',label:'Portret materiali',options:['hearts','name','dots']},
  ],
  [C.MUSIC]: [],
  [C.VIDEO]: [],
  [C.RSVP]: [
    {key:'rsvpEnabled',type:'boolean',label:'RSVP yoqilsin'},
    {key:'rsvpQuestion',type:'text',label:'RSVP savoli',max:140},
  ],
  [C.MAP]: [
    {key:'mapLocation',type:'location',label:'Xarita joylashuvi'},
  ],
  [C.CALENDAR]: [
    {key:'calendarEnabled',type:'boolean',label:'Kalendar tugmasi'},
  ],
  [C.OPEN_TIMER]: [
    {key:'openAt',type:'datetime',label:'Ochish vaqti'},
  ],
  [C.WORD_LOCK]: [
    {key:'wordLock',type:'text',label:'Maxfiy so‘z',max:64,sensitive:true},
  ],
  [C.RESPONSE]: [
    {key:'responseEnabled',type:'boolean',label:'Javob yuborish'},
    {key:'responsePrompt',type:'text',label:'Javob savoli',max:180},
  ],
  [C.SAVE]: [
    {key:'saveEnabled',type:'boolean',label:'Saqlab olish'},
  ],
  [C.SHARE]: [
    {key:'shareEnabled',type:'boolean',label:'Ulashish'},
  ],
  [C.GUEST_LINKS]: [
    {key:'guestLinksEnabled',type:'boolean',label:'Har mehmon uchun alohida link'},
  ],
});

const WEDDING_CATEGORIES=new Set(['wedding']);

export function editorFieldsFor(template){
  const fields=[...FIELD_LIBRARY.core,...FIELD_LIBRARY.universalMedia];
  if(WEDDING_CATEGORIES.has(template.category))fields.push(...FIELD_LIBRARY.event);

  for(const cap of template.capabilities||[]){
    const extra=FIELD_LIBRARY[cap];
    if(extra)fields.push(...extra);
  }

  const seen=new Set();
  return fields.filter(field=>{
    if(seen.has(field.key))return false;
    seen.add(field.key);
    return true;
  });
}

export function editorSectionsFor(template){
  const fields=editorFieldsFor(template);
  const mediaKeys=new Set(['photos','photoCaptions','portrait','portraitParticle','music','musicPreset','musicStart','video']);
  const accessKeys=new Set(['openAt','wordLock','guestLinksEnabled']);
  const guestKeys=new Set(['rsvpEnabled','rsvpQuestion','responseEnabled','responsePrompt','mapLocation','calendarEnabled']);

  return {
    content:fields.filter(x=>!mediaKeys.has(x.key)&&!accessKeys.has(x.key)&&!guestKeys.has(x.key)),
    media:fields.filter(x=>mediaKeys.has(x.key)),
    guests:fields.filter(x=>guestKeys.has(x.key)),
    access:fields.filter(x=>accessKeys.has(x.key)),
  };
}
