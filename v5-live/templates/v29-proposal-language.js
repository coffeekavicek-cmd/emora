/* Localize the retained 3D ring experience; authored personal words stay intact. */
let language=new URLSearchParams(location.search).get('lang')||'ru';
const lex={
'3 xotirani oching':['Открой три фото','Open three photos'],
'3 nuqtani oching':['Коснись трёх огоньков','Tap the three lights'],
'Davom etish →':['Дальше →','Continue →'],
'Tuman ortini oching':['Посмотри, что там','See what’s inside'],
'Tozalash ✦':['Открыть','Reveal'],
'Chiroqni yoqish ✦':['Включить свет','Turn on the light'],
'Muhr ostidagi so‘zlar':['Письмо только для тебя','A letter just for you'],
'Faqat sen uchun yozilgan':['Это всё — для тебя','All of this is for you'],
'Stoldagi uchta xotira':['Три наших момента','Three moments of us'],
'Namuna':['Пример','Sample'],
'SIZ UCHUN ALOHIDA':['Только для тебя','Just for you'],
'SIZ UCHUN ALOHIDA':['Только для тебя','Just for you'],
'Sen bilan bir umr':['Всю жизнь — рядом с тобой','A lifetime by your side'],
'Hikoyani ochish ↗':['Открыть нашу историю ↗','Open our story ↗'],
'FOREVER BEGINS':['Здесь начинается наше «навсегда»','Forever begins'],
'PEARL PROMISE / FOREVER BEGINS':['Наше «навсегда»','Our forever'],
'HANDCRAFTED DIGITAL MOMENTS · EMORA':['Подарок с чувством · EMORA','Made with feeling · EMORA'],
'AN ORIGINAL EMORA EXPERIENCE · 13':['Только для нас · EMORA','Just for us · EMORA'],
'EMORA · PROPOSAL · 13':['Наш момент · EMORA','Our moment · EMORA'],
'EMORA ✧ Pearl Promise ✧ A STORY JUST FOR YOU':['EMORA ✧ Наша история','EMORA ✧ Our story'],
'Mening eng muhim savolim…':['У меня к тебе один важный вопрос…','There’s one thing I really want to ask you…'],
'Bu savolgacha yetish uchun har bir xotiramiz, har bir va’dam kerak bo‘ldi.':['Все наши моменты привели меня сюда. К тебе.','All our little moments brought me here. To you.'],
'Hikoyani ochish':['Открыть нашу историю','Open our story'],
'Kelajagimdagi eng go‘zal kadrlarni sen bilan tasavvur qilaman.':['Когда думаю о будущем, рядом всегда ты.','When I picture my future, you’re always there.'],
'Menga turmushga chiqasanmi?':['Ты выйдешь за меня?','Will you marry me?'],
'Ha ♡ ↗':['Да ♡','Yes ♡'],'Ha ♡':['Да ♡','Yes ♡'],'Birga gaplashaylik':['Давай поговорим','Let’s talk'],
'Birinchi kun':['С самого первого дня','From the very first day'],'Bizning yo‘limiz':['Всё, что мы прошли вместе','Our story so far'],'Mening va’dam':['Моё обещание тебе','My promise to you'],
'Eng qadrli sir':['Кое-что только для тебя','Something just for you'],
'Hali savolni bermayman. Avval seni nega aynan shu lahzaga olib kelganimni ko‘rsatmoqchiman.':['Чуть-чуть подожди. Сначала покажу, почему я выбрал тебя.','Just a little longer. First, let me show you why it’s you.'],
'Quti yopiq. Faqat unga tegib, hikoyani boshlang.':['Коснись коробочки. Наша история начнётся.','Tap the box. Our story starts here.'],
'Qutiga tegish  ✦':['Коснуться коробочки','Tap the box'],
'Bu savolga hali biroz bor…':['Сначала кое-что вспомним…','Let’s remember a few things first…'],
'Uzuk hozircha yashirin qoladi. Avval bizning uchta eng muhim xotiramiz.':['Кольцо пока подождёт. Давай вспомним нас.','The ring can wait. Let’s look back at us.'],
'Sen bilan oddiy kun ham xotiraga aylanadi.':['С тобой даже обычный день хочется запомнить.','Even an ordinary day with you is worth remembering.'],
'Yonimda o‘zim bo‘la oladigan inson — sensan.':['Рядом с тобой мне не нужно притворяться.','With you, I can just be myself.'],
'Kelajagimni tasavvur qilganimda, unda doim sen borsan.':['В любом моём «потом» есть ты.','You’re in every future I imagine.'],
'Bu savolgacha bosib o‘tgan yo‘limiz':['Помнишь нас такими?','Remember us like this?'],
'Har bir suratni och. Uchinchisidan keyin men senga nega aynan seni tanlaganimni aytaman.':['Открой наши фото. А потом скажу кое-что важное.','Open our photos. Then I’ll tell you something important.'],
'Nega aynan sen?':['Почему именно ты?','Why you?'],
'Sababni ochish':['Узнать почему','Find out why'],
'Va’damni eshitish  →':['А теперь моё обещание →','And now, my promise →'],
'Men mukammal hayotni emas, sen bilan haqiqiy hayotni tanlayman — quvonchida ham, qiyin kunida ham yoningda bo‘lishni.':['Я не обещаю идеальную жизнь. Я обещаю быть рядом — и в хорошие дни, и в те, когда всё сложно.','I can’t promise a perfect life. But I promise to be beside you, on the good days and the hard ones.'],
'Bu qismni shoshilmay o‘qi. Quti keyingi sahnada ochiladi.':['Прочитай не спеша. Это для тебя.','Take your time. This is for you.'],
'Samimiyat bilan':['От того, кто тебя любит','From someone who loves you'],
'Eng muhim lahzaga  →':['К самому важному →','To the big moment →'],
'Endi qutini ochishing mumkin.':['Теперь можешь открыть коробочку.','Now you can open the box.'],
'Qutini ochish  ✦':['Открыть коробочку','Open the box'],'Qutini ochish ✦':['Открыть коробочку','Open the box'],
'Ha, shu lahza…':['Вот он, этот момент…','This is the moment…'],
'Hikoyani boshlash →':['Начнём нашу историю →','Let’s start our story →'],
'Davom etish':['Дальше','Continue'],'O‘tkazib yuborish ↗':['Пропустить','Skip'],
'Boshidan ko‘rish ↑':['Посмотреть сначала','Start again'],'♪ Musiqa':['♪ Музыка','♪ Music'],'Ⅱ To‘xtatish':['Ⅱ Пауза','Ⅱ Pause'],'Musiqa ochilmadi':['Музыка не открылась','Could not play the music'],
'Ochildi ✦':['Открыто','Opened'],'Ochish ✦':['Открыть','Open'],'Qutini oching':['Открой коробочку','Open the box'],'Tegib oching':['Коснись, чтобы открыть','Tap to open'],
'Javobingiz faqat shu ekranda aks etdi; xabar yuborilmadi.':['Это «да» останется в вашем подарке ♡','Your “yes” stays in this gift ♡'],
'Qaroringni hurmat qilaman. Javob yuborilmadi.':['Без спешки. Поговорим, когда захочешь.','No rush. We can talk when you’re ready.'],
'Havola nusxalandi ✓':['Ссылка скопирована','Link copied'],
'Pearl Promise · Sahna tayyorlanmoqda…':['Готовим ваш момент…','Getting your moment ready…'],
'WHY YOU':['Почему ты','Why you'],'THE RING BOX':['Коробочка','The box'],'OUR STORY':['Наша история','Our story'],'A PROMISE':['Моё обещание','My promise'],'THE FINAL MOMENT':['Наш момент','Our moment'],
};
document.documentElement.lang=['ru','en','uz'].includes(language)?language:'ru';
const aliases=new Map();Object.entries(lex).forEach(([original,values])=>{aliases.set(original.replace(/\s+/g,' '),original);values.forEach(v=>aliases.set(v.replace(/\s+/g,' '),original))});
let scheduled=false;
function translate(){scheduled=false;document.documentElement.lang=language;
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){if(['SCRIPT','STYLE'].includes(node.parentElement?.tagName))continue;const raw=node.nodeValue.trim(),key=aliases.get(raw.replace(/\s+/g,' ')),value=key?(language==='uz'?[key,key]:lex[key]):null;if(value){const translated=node.nodeValue.replace(raw,value[language==='en'?1:0]);if(translated!==node.nodeValue)node.nodeValue=translated;}else if(raw.endsWith(' · Barcha huquqlar himoyalangan'))node.nodeValue=raw.replace('Barcha huquqlar himoyalangan',language==='en'?'Made for you':'Создано для тебя');}
 document.querySelectorAll('[aria-label]').forEach(n=>{const s=n.getAttribute('aria-label');if(/^[1-3]-xotirani ochish$/.test(s))n.setAttribute('aria-label',language==='en'?'Open memory '+s[0]:'Открыть фото '+s[0]);});
}
const observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(translate);}});
addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.config&&['ru','en','uz'].includes(e.data.config.lang)){language=e.data.config.lang;translate()}});
if(document.body){observer.observe(document.body,{childList:true,subtree:true,characterData:true});translate();}else document.addEventListener('DOMContentLoaded',()=>{observer.observe(document.body,{childList:true,subtree:true,characterData:true});translate();},{once:true});
