# EMORA — PREMIUM SCENARIO BIBLE
## V10 · 5 yo‘nalish · 15 mustaqil cinematic experience
**Status:** tasdiqlash va ishlab chiqish uchun master-spetsifikatsiya. Bu fayl 15 shablon ishga tushirilganini anglatmaydi.  
**Asos:** mavjud EMORA V9, avval kelishilgan besh yo‘nalish va raqobatchilardan olingan umumiy UX tamoyillari.  
**Estetika:** zamonaviy o‘zbek premium atelyesi: nafis, zamonaviy, mobilga mo‘ljallangan, hissiy, ixtiyoriy ovozli.

---

# 0. Mahsulot va farqlanish

EMORA oddiy bir sahifaga har xil surat qo‘yadigan generator emas: har bir shablon o‘z **kirish marosimi, hikoya mexanikasi, bosh 3D obyekti, foydalanuvchi harakati va yakuniga** ega mustaqil mini-tajriba. Tizim beshta yo‘nalishdan boshlanadi; tanlangan yo‘nalishdagina uchta shablon ko‘rinadi. So‘ng «To‘liq ko‘rish» → «Shu shablonda yaratish» → ma’lumot/media tahriri → telefon/desktop preview → saqlash → nashr → havola va QR.

**Raqobatchilar bo‘yicha ishlatilgan tamoyillar (vizual yoki kod nusxasi emas):**
- Celamur: hissiy ssenariy, interaktiv ochilish, qo‘lda yozilgandek maktub, suratlar, tanlovli final va ixtiyoriy maxsus vizual effektlar. https://celamur.com/
- e-invitation: marosimga mos ajratilgan dizaynlar, telefonda preview, o‘zbek marosimlariga moslik; Love Story uchun voqealar asosidagi animatsion hikoya. https://e-invitation.uz/ va https://e-invitation.uz/love-story/
- etaklif Pro: bir-biridan farqli kartochka, gul, scrapbook, osmon, milliy naqsh, musiqa va video taklifnoma yo‘nalishlari. https://etaklifpro.uz/
- Invitate: interaktiv veb-taklifnoma bilan video-taklifnomani ajratish, ko‘p tilli matn, RSVP, xarita va qulay tayyorlash oqimi. https://invitate.uz/

Barcha sahnalar EMORA uchun qaytadan yoziladi va original tasvir/animatsiya bilan tayyorlanadi. Maxfiy mijoz surati yoki litsenziyasiz musiqa default shablonga joylashtirilmaydi.

## 0.1 Dizayn va muhandislikning majburiy mezonlari
1. Yetti mavjud shablonning nomlari va saqlangan loyihalaridagi identifikatorlar buzilmaydi; yangi sakkiztasi yangi slug oladi.
2. Bir oiladagi uchta shablon shunchaki fon yoki rang o‘zgarishi bo‘la olmaydi: kompozitsiya, sahna ritmi, animatsiya va final UX alohida quriladi.
3. Mobil birinchi: 360 × 800 va kichikroq ekranda barcha CTA ko‘rinadi; 44px touch target; keyingi sahnaga o‘tish bir qo‘l bilan qulay.
4. Intro 0–2 soniyada ilk tasvirni ko‘rsatadi; «O‘tkazib yuborish» va reduced-motion varianti majburiy. Musiqa foydalanuvchi bosmaguncha boshlanmaydi.
5. Real vaqt, sana, joylashuv, map, ism, xat va media mijoz loyihasidan keladi; soxta 57-kun countdown yoki soxta javoblar bo‘lmaydi.
6. «Yo‘q», «Menga vaqt kerak», «Qatnashmayman» javoblari odobli va har doim bosiladigan bo‘ladi. Majburlovchi yoki qochadigan rad etish tugmasi EMORA standartida yo‘q.
7. Ko‘rish uchun akkaunt shart emas; loyiha saqlash/nashr qilishda akkaunt so‘raladi. Preview’da boshqa odamning shaxsiy kontenti namoyish etilmaydi.
8. Ijtimoiy video eksport va haqiqiy 3D video rendering mustaqil imkoniyatlar; ularning ishlashini CSS intro bilan chalkashtirmaymiz.

# 1. SEVGI IZHORI — uch xil dramaturgiya

## L1 — Rose Theatre
- **Slug:** love-rose-theatre · mavjud shablon, V10’da qayta ishlanadi.
- **Logline:** qalbdagi gap ekranda bo‘layotgan mini-filmga aylanadi.
- **Material/palitra:** to‘q bordo, qora ipak, iliq kinoprojektor nuri, pushti atirgul; editorial serif + qisqa kino subtitrlari.
- **Signature 3D:** kamera oldidan ochiladigan baxmal kino pardasi, chuqurlikdagi atirgul sahnasi va aylanuvchi film kadrlarining yupqa 3D qatlamlari.
- **Ochilish 0–7 s:** qora ekran → proyektor nuri → pardalar ajraladi → «Senga aytolmagan bir gapim bor…» → «Filmni boshlash» (ixtiyoriy musiqa).
- **1-sahna — Boshlanish:** oluvchi ismi kadrda paydo bo‘ladi; «Bu film faqat sen uchun»; bosilganda keyingi kadr.
- **2-sahna — Tanishuv:** foydalanuvchi yozgan qachon/qayerda tanishgan matni; o‘sha kundan beri kun hisoblagichi. Sana bo‘lmasa hisoblagich ko‘rsatilmaydi.
- **3-sahna — Uchta kadr:** 3 ta fotosurat vertikal film lentasi bo‘ylab suriladi; har rasmning o‘z caption va vaqt belgisi bor.
- **4-sahna — Ovoz va maktub:** video yoki faqat xat; uzun xat kino subtitriga emas, o‘qishga qulay maktub blokiga joylanadi.
- **Final:** «Bu hikoyani birga davom ettiramizmi?» → «Ha, birga» yoki «Menga vaqt kerak». «Ha»da atirgul barglari parvozi; boshqa javobda hurmatli sokin ekran.
- **Gesture/motion:** parda touch-to-open, kino kadrlari swipe, nozik rack-focus, grain, yorug‘lik nurlari; foydalanuvchi rad javobidan qochirilmaydi.
- **Audio:** yumshoq piano va film-proyektor foley; mute har ekranda.
- **Editor:** qabul qiluvchi, yuboruvchi, tanishgan sana, intro, 3 surat/caption, video (ixtiyoriy), xat, final savol.
- **Texnik fallback:** 3D sahna yuklanmasa statik teatr kadri + CSS parallax.

## L2 — Pearl Linen
- **Slug:** love-pearl-linen · mavjud.
- **Logline:** nafis maktub birin-ketin ochilgan qog‘oz qatlarida asta hikoya bo‘lib ketadi.
- **Material/palitra:** tabiiy ivory, marvarid, oq zig‘ir, blush, xira oltin; nozik qo‘lyozma aksenti.
- **Signature 3D:** stol ustidagi konvert, haqiqiy qalinligi bor qog‘oz, mum muhr, bo‘shashuvchi ipak lenta.
- **Ochilish:** ism konvert ustida ko‘rinadi; finger-press bilan mum muhr ajraladi va qog‘oz chiqadi. Skip tugmasi bilan matnga o‘tish mumkin.
- **1-sahna — Birinchi satr:** maktubdan bir gap qog‘oz ustiga birma-bir yozilgandek chiqadi.
- **2-sahna — Xotiralar:** uchta polaroid stol ustiga tashlangandek joylashadi; barmoq bilan bittasini ko‘tarish/aylantirish.
- **3-sahna — Minnatdorchilik:** uchta qisqa sabab minimal kartalar sifatida bosilganda ochiladi; standartdan ortiq kompliment to‘ldirish talab qilinmaydi.
- **4-sahna — Xat:** asosiy xatning to‘liq, o‘qiladigan blokini ochish; matn animatsiyasi xohlaganda darhol tugaydi.
- **Final:** qog‘oz buklanib «Yana yangi xotiralar yaratamizmi?» savoliga aylanish; ikki teng ko‘rinadigan javob.
- **Gesture/motion:** muhr bosish, varaq buklash, qog‘oz soyasi, sekin stol parallax; tez kamera kesimlari yo‘q.
- **Audio:** yengil arfa / pianino, muhr «click» efekti.
- **Editor:** ism, qo‘lyozma uslubi, 3 rasm, kichik kartalar, xat va yakuniy savol.
- **Fallback:** 3D konvert o‘rniga accessible CSS envelope; qog‘oz holati bir marta o‘zgaradi.

## L3 — Galaxy Confession
- **Slug:** love-galaxy-confession · yangi.
- **Logline:** muhabbatning kichik so‘zlari yulduz turkumidan shaxsiy osmon suratiga aylanadi.
- **Material/palitra:** midnight indigo, sovuq marvarid, rose-gold nur, sokin nebula.
- **Signature 3D:** WebGL yulduz maydoni, mayda harflardan tuzilgan 3D yurak/konstellatsiya; ixtiyoriy suratdan portret-siluet.
- **Ochilish:** barmoq harakati bilan galaktika sekin buriladi; «Bir joyda to‘xtat» bosilganda yulduzlar oluvchi ismini hosil qiladi.
- **1-sahna — Uchta yulduz:** 3 sabab, har bir yulduz bosilganda shaxsiy matn ochiladi.
- **2-sahna — Bizning orbitamiz:** xotiralar orbitadagi 3 tasvir «sayyorasi»da chiqadi; swipe bilan navbatdagisi keladi.
- **3-sahna — So‘zlar:** o‘zingiz yozgan 20 tagacha kichik jumla osmonda harakatlanadi.
- **4-sahna — Portret (ixtiyoriy):** rozilik bilan yuklangan suratdan yulduzli siluet. Surat bo‘lmasa abstrakt yurak shakli.
- **Final:** yulduzlar bitta jumlaga yig‘iladi: «Men seni sevaman» yoki mijozning o‘z jumlasi; shareable still rasm.
- **Gesture/motion:** drag-to-orbit, WebGL instancing, tuman volumetrik effektining arzon imitasiya varianti; kameraga cheksiz animatsiya yuklanmaydi.
- **Audio:** ambient synth + sekin piano; mute.
- **Editor:** ism, uch sabab, uch xotira, qisqa jumlalar, ixtiyoriy portret, final matn.
- **Fallback:** WebGL yo‘q bo‘lsa oldindan renderlangan yulduzli video/still va CSS matn.

# 2. TO‘Y TAKLIFNOMASI — uch xil marosim

## W1 — Silk Heritage
- **Slug:** wedding-silk-heritage · mavjud.
- **Logline:** atlas pardasi ortidan ochilgan nafis konvert mehmonni marosimga chorlaydi.
- **Material/palitra:** ivory, champagne-gold, sage, ipak, qog‘oz relyefi, oq gullar.
- **Signature 3D:** ikki atlas parda + ark + buklangan konvert + bosiladigan oltin mum muhr; kamera muloyim oldinga siljiydi.
- **Ochilish:** «Aziz mehmon» yozuvi → muhr bosiladi → parda ochiladi → kelin-kuyov ismlari.
- **1-sahna — Taklif:** ismli mehmon linkida aynan mehmon ismi; public umumiy linkda «Aziz mehmonimiz». Ismlar katta editorial tipografiyada.
- **2-sahna — Marosim:** haqiqiy sana, soat, timezone va countdown; sana o‘tgan bo‘lsa «Bugun bizning kunimiz» / «Bayram bo‘lib o‘tdi» holati.
- **3-sahna — Dastur:** muharrir to‘ldiradigan 3–6 qadamli timeline; default vaqtlar sample sifatida aniq belgilanadi.
- **4-sahna — Manzil:** joy nomi, Google/2GIS/Yandex URL sanitizatsiyasi, ochiladigan map va yo‘l-yo‘riq.
- **5-sahna — RSVP:** haqiqiy guest token bilan «Boraman / Bilmadim / Bormayman», kishi soni, izoh; bitta guest javobini qayta tahrirlash mumkin.
- **Final:** oila nomidan qisqa duo/tilak; QR public havola bilan ulash.
- **Gesture/motion:** 3D parda, konvert flip, gold shimmer, sekin botanika parallax; og‘ir sahna yuklanganda statik rasm.
- **Audio:** mayin tor/piano; faqat user bosganda.
- **Editor:** ismlar, sana/soat/timezone, dastur, joy, xarita, dress-code (ixtiyoriy), asosiy surat, mehmon CSV/qo‘lda qo‘shish.
- **Asosiy tekshiruv:** sanani o‘zgartirish countdown, sahna va public sahifada birday yangilanadi; anonim RSVP faqat haqiqiy token bilan.

## W2 — Night Garden
- **Slug:** wedding-night-garden · mavjud.
- **Logline:** yulduzli tunda chiroqlar ketma-ket yonib, mehmon kechki bog‘ga qadam qo‘yadi.
- **Material/palitra:** midnight emerald, bronza, yumshoq candlelight, qora ipak, nozik islimiy bezak.
- **Signature 3D:** bog‘ arki, gullar, chiroqlar va parallax qatlamlar; chiroqlar animatsiyasi foydalanuvchi harakatiga javob beradi.
- **Ochilish:** qorong‘u → birinchi sham → yo‘l bo‘ylab chiroqlar yonadi → oltin eshik ochiladi.
- **1-sahna — Taklif:** er-xotin ismi ark ostida yulduzlar nurida paydo bo‘ladi.
- **2-sahna — Kecha boshlanishi:** sana/soat, jonli countdown, fon yoritishi quyosh botish kayfiyatiga mos, lekin haqiqiy astronomik ma’lumot deb ko‘rsatilmaydi.
- **3-sahna — Bog‘ ichida:** 3D mikrosahna bilan dastur bosqichlari: kutib olish, nikoh, bayram.
- **4-sahna — Manzil va dress-code:** joy, xarita, optional rang palitrasi; user tanlagan marshrut ilovasi alohida ochiladi.
- **5-sahna — Mehmon javobi:** RSVP overlay’ga o‘tish va sanani taqvimga qo‘shish (.ics).
- **Final:** yulduzlar fonida shaxsiy salom; uslubli static share card.
- **Gesture/motion:** kamera 0.5–1 m sezgir parallax taassuroti, shamlarning alohida flicker ritmi, fireflies; reduced-motion’da statik oltin ark.
- **Audio:** yumshoq strings/jazz ambient; mute.
- **Editor:** W1’ning real wedding logic’i; qora/o‘tkir kontrast media validatsiyasi.

## W3 — Heritage Naqsh
- **Slug:** wedding-heritage-naqsh · yangi.
- **Logline:** milliy atlas va zardo‘zi detallari mehmonni zamonaviy o‘zbek marosimining yuragiga olib kiradi.
- **Material/palitra:** iliq ivory, to‘q ko‘k, old gold, atlas/suzani naqshi; naqshlarning original varianti ishlab chiqiladi.
- **Signature 3D:** aylanuvchi naqshli medalyon, material relyefi va bo‘shab ochiluvchi zardo‘zi bezakli taklifnoma.
- **Ochilish:** turli naqsh segmentlari birlashib medalyon hosil qiladi; uni bosganda taklifnoma varag‘i ochiladi.
- **1-sahna — Oilalar taklifi:** muallif kiritgan ota-onalar/oila nomlari; ortiqcha majburiy diniy yoki madaniy matn yo‘q.
- **2-sahna — Marosim turi:** nikoh, nahor oshi yoki odatiy to‘y; turi tanlanganda ko‘rinadigan modul o‘zgaradi.
- **3-sahna — Sana va dastur:** marosim jadvali, timezone va optional ikki manzil (masalan, nikoh va ziyofat).
- **4-sahna — An’ana va yo‘l-yo‘riq:** dress-code, izoh, xarita, tashrifni tasdiqlash.
- **Final:** original naqshlardan shakllangan duo/tilak kartasi; ijtimoiy ulash.
- **Gesture/motion:** medalyonni 15–25° aylantirish, ip/zar chiziqlari ketma-ket chizilishi, zoom-in; takroriy naqshlar harakatdan ko‘ngil aynishini keltirmaydi.
- **Audio:** milliy cholg‘u kayfiyatidagi original litsenziyali instrumental, mute.
- **Editor:** oila ismi, marosim turi, bitta/ikki joy, dastur, xarita, mehmon va RSVP.
- **Muhim:** diniy bezak yoki matn aniq tanlov bo‘lsin, barcha foydalanuvchiga majburlanmasin.

# 3. TUG‘ILGAN KUN — uch xil hissiy ritm

## B1 — Aurora Paper
- **Slug:** birthday-aurora-paper · mavjud.
- **Logline:** sovg‘a qutisi ochilganda atrofga xotiralar va tilaklar tarqaladi.
- **Material/palitra:** peach, apricot, champagne, krem va qo‘lda kesilgan qog‘oz.
- **Signature 3D:** atrofida qog‘oz gullar aylanuvchi sovg‘a qutisi; ribbon touch-to-untie.
- **Ochilish:** shaxsiy ism yozilgan sovg‘a qutisi; lenta yechiladi va tabrik chiqadi.
- **1-sahna — Bugun:** tug‘ilgan kun tabrigi va optional yosh; yoshni ko‘rsatish default’da o‘chiq.
- **2-sahna — Xotiralar:** 3–5 rasm birma-bir stoldagi kartaga aylanishi; swipe.
- **3-sahna — Tilaklar:** tanlangan yaqin insonlardan oldindan tasdiqlangan, moderatsiyalanadigan maxsus kartalar.
- **4-sahna — Surprise:** ixtiyoriy video yoki ovozli tabrik; user bosganda.
- **Final:** original confetti va katta tabrik, screenshot/share.
- **Gesture/motion:** lenta uzish, quti ochish, slow-motion qog‘oz barglari; kichik ekranda elementlar yopilib qolmaydi.
- **Audio:** iliq quvnoq instrumental; mute.
- **Editor:** ism, sana, yoshni ko‘rsatish, media, kartalar va video.

## B2 — Balloon Dream
- **Slug:** birthday-balloon-dream · yangi.
- **Logline:** osmondagi uchta shar uchta orzuni ochib, finalda bayramga olib keladi.
- **Material/palitra:** champagne, lilac, mint, pale blue, glossy shishadek yumshoq aks.
- **Signature 3D:** 12–20 ta past poligonli shar (instanced geometry), tabiiy easing va yengil shamol simulyatsiyasi.
- **Ochilish:** «Sharni ushla»; eng yaqin 3D shar bosilganda qabul qiluvchining ismi paydo bo‘ladi.
- **1-sahna — Uchta tilak:** sharlar bosilganda matn kartochkasi va bir tasvir chiqadi.
- **2-sahna — Bir yil ichida:** optional foto/achievement timeline.
- **3-sahna — Bayramga taklif (ixtiyoriy):** sana/vaqt/manzil va RSVP; shunchaki tabrik formatida ushbu sahna bo‘lmaydi.
- **Final:** sharlar yuqoriga ko‘tarilib taqvim sanasi yoki tabrikni ochib beradi.
- **Gesture/motion:** swipe-to-pop o‘rniga touch-to-reveal; fotosensitiv xavfli chaqnashlar yo‘q.
- **Audio:** yengil neo-soul/piano; mute.
- **Editor:** yoshi/nomi, uch tilak, 3 ta rasm, event toggle va event data.

## B3 — Memory Reel
- **Slug:** birthday-memory-reel · yangi.
- **Logline:** hayotdagi eng yaxshi kadrlar qisqa sentimental treylerga aylanadi.
- **Material/palitra:** to‘q umbra, vintage sepia, sariq projektor nuri, issiq terakota.
- **Signature 3D:** aylanuvchi kino barabani va qog‘ozli film lentasi; CSS/video fallback.
- **Ochilish:** eski proyektor ishga tushadi, sarlavha «[Ism] haqidagi kichik film».
- **1-sahna — Birinchi kadr:** muallif tanlagan eng eski surat va izoh.
- **2-sahna — Uch bo‘lim:** bolalik / bugun / kelajak yoki erkin tartib; har biri 1–3 media.
- **3-sahna — Yaqinlardan gap:** faqat ruxsatli yuklangan audio/video xabarlar.
- **4-sahna — Premyera:** foydalanuvchi tanlagan 20–60 s umumiy mini-rolikning bir marta ijrosi (video mavjud bo‘lsa).
- **Final:** «Davomi albatta bo‘ladi» deb film titrlari yuradi; screenshot/share.
- **Gesture/motion:** film lintasini qo‘l bilan surish, projektor flicker juda yumshoq.
- **Audio:** copyright-safe custom soundtrack, mute.
- **Editor:** o‘zgartiriladigan davrlar, surat, video, ovoz, caption, musiqa.

# 4. UZR SO‘RASH — uch xil halol hikoya

**Etik qoida:** adresat «Menga vaqt kerak» yoki «Gaplashishni xohlamayman» deb tanlasa sahifa bunga hurmat bilan javob beradi; his-tuyg‘uni bosim bilan boshqarmaydi. «Yo‘q» tugmasi qochmaydi.

## A1 — After Rain
- **Slug:** apology-after-rain · mavjud.
- **Logline:** namlangan oynadagi tuman artilganda so‘zlar emas, javobgarlik ko‘rinadi.
- **Material/palitra:** slate blue, mist, pale sage, sovuq shisha va tongning yumshoq nuri.
- **Signature 3D:** oynadagi yomg‘ir tomchilari shader’i; swipe bilan ochiladigan tuman qatlamlari.
- **Ochilish:** yomg‘ir; «Bir gap aytsam bo‘ladimi?»; «O‘qish» / «Hozir emas». Ikkinchisi darhol sokin yakunga o‘tadi.
- **1-sahna — Tan olish:** muallif xatoni aniq bitta jumlada aytadi; matn atrofida dramatik manipulyativ effekt yo‘q.
- **2-sahna — Tushunish:** zarar yoki ranjish nimadan kelganini muallifning o‘z so‘zlari.
- **3-sahna — Xotira (ixtiyoriy):** surat faqat mos bo‘lsa; asosiy rolni aybni oqlashga aylanmaydi.
- **4-sahna — Tuzatish:** «Men boshqacha nima qilaman» bitta konkret amal.
- **Final:** «Gaplashamiz» / «Menga vaqt kerak» / «Javob bermayman»; natija muallifga faqat ochiq rozilik bilan yuboriladi.
- **Gesture/motion:** barmoq bilan tumanni artish, tomchi yo‘li, sahnalar qorong‘ilikdan yorug‘ga; reduced-motion’da statik shisha.
- **Audio:** ixtiyoriy tinch rain ambience; mute.
- **Editor:** aniq uzr, nimani tushundi, tuzatish rejasi, bir surat (ixtiyoriy), final matn.

## A2 — Ink of Regret
- **Slug:** apology-ink-of-regret · yangi.
- **Logline:** tushgan bitta siyoh tomchisi vaqt o‘tgan sayin ochiq, ravshan maktubga aylanadi.
- **Material/palitra:** o‘q rang qog‘oz, dark ink, smoke-grey, iliq xira oltin.
- **Signature 3D:** qog‘ozdagi volumetrik siyoh tomchisi; asosiy effekt tejamkor 2D mask/shader.
- **Ochilish:** siyoh tomchisi qog‘ozga tushadi; uchta satr sekin paydo bo‘ladi; o‘qish uchun alohida to‘xtatish.
- **1-sahna — Men qilgan ish:** yozish uchun uch jumlali aniq joy; javobgarlik boshqa odamlarga yuklanmaydi.
- **2-sahna — Bu seni qanday ranjitdi:** foydalanuvchi yozgan sezgirlik matni.
- **3-sahna — Izoh emas, amal:** maksimal uchta real keyingi qadam yoziladi.
- **4-sahna — To‘liq maktub:** foydalanuvchi to‘liq o‘qish yoki darhol finalga o‘tishni tanlaydi.
- **Final:** «Hozir javob beraman» / «Keyinroq» / «Javob bermayman»; hech qaysi variantni yashirmaymiz.
- **Gesture/motion:** siyoh mask reveal, qog‘oz nafasidek shadow, rasm majburiy emas.
- **Audio:** minimal piano yoki sukut (default sukut).
- **Editor:** action-oriented apology, xat, ixtiyoriy sana va javob variantlari.

## A3 — Quiet Room
- **Slug:** apology-quiet-room · yangi.
- **Logline:** shovqinsiz xonada bir lampaning nuri faqat aytilishi kerak bo‘lgan so‘zlarni yoritadi.
- **Material/palitra:** dark cocoa, walnut, amber tungsten, warm ivory.
- **Signature 3D:** stol, buklangan varaq, bitta chiroq va yumshoq spotlight (low-poly PBR).
- **Ochilish:** qora-yumshoq xona, chiroqni «Yoqish» tugmasi; sahna ustida so‘z paydo bo‘ladi.
- **1-sahna — Haqiqiy gap:** xat qisqa; uzun ma’ruza emas.
- **2-sahna — Tinglash:** oluvchi «Davom etish» yoki «Bu yetarli»ni tanlaydi.
- **3-sahna — Yozilmagan gaplar:** bir qator yondashuv, ixtiyoriy surat yoki ovoz, hech qachon avtomatik video yo‘q.
- **4-sahna — Vaqt:** foydalanuvchi hozir, keyinroq yoki umuman javob bermaslikni tanlaydi.
- **Final:** sokin nur pasayadi, hurmatli tugash; qabul qiluvchi tanlovini o‘zgartira oladi.
- **Gesture/motion:** lampani bosish, yengil dust motes, yumshoq fokus; slow UX va ko‘zga qulay kontrast.
- **Audio:** sukut default; ixtiyoriy atrof-muhit ovozi.
- **Editor:** xat, qisqa kirish, audio opt-in, rasm opt-in, javob siyosati.

# 5. TURMUSH TAKLIFI — uch xil final

## P1 — Pearl Promise
- **Slug:** proposal-pearl-promise · mavjud.
- **Logline:** quti ichidagi uzuk ochilishidan oldin eng muhim xotiralar sahifalab namoyon bo‘ladi.
- **Material/palitra:** pearl silk, candle gold, blush, wine-black velvet.
- **Signature 3D:** real geometriyali zargarlik qutisi, hinge, uzuk, toshda PBR/reflection; past qurilma uchun oldindan renderlangan fallback.
- **Ochilish:** quti stolda yopiq; «Boshlash»da 45° atrofida burilib aks etadi, ammo uzuk hozircha ochilmaydi.
- **1-sahna — Bizning hikoyamiz:** 3 muhim xotira alohida surat va kichik caption bilan.
- **2-sahna — Nega sen?:** 3 samimiy qisqa sabab; bu yerda takroriy generic «compliments» ishlatilmaydi.
- **3-sahna — Mening va’dam:** foydalanuvchi yozgan haqiqiy so‘zlar, optional video.
- **4-sahna — Quti ochiladi:** nihoyat uzuk qutisi bosilganda ochiladi, kamera nozik dolly-in.
- **Final:** «Menga turmushga chiqasanmi?» / sozlanadigan savol va «Ha» / «Buni birga gaplashaylik»; boshqa javobni bloklash yo‘q.
- **Gesture/motion:** touch-to-open hinge, diamond light sparkle bir martalik, nozik depth-of-field.
- **Audio:** pianino + yengil strings; mute.
- **Editor:** qabul qiluvchi, 3 xotira, 3 sabab, va’da, final savol, optional video.

## P2 — Cinema Proposal
- **Slug:** proposal-cinema · yangi.
- **Logline:** hayotdagi epizodlardan yig‘ilgan treyler eng so‘nggi katta savolga olib keladi.
- **Material/palitra:** cinema black, warm ivory, champagne credits, rangli foto kadrlar.
- **Signature 3D:** boshida 3D projektor, keyingi sahnalarda 2.5D film kadrlar.
- **Ochilish:** «Tonight's premiere: [Ism]» kartasi; ekran qirralari yorishadi.
- **1-sahna — Birinchi epizod:** uchrashuv sahnasi foto/video bilan 5–10 soniyada.
- **2-sahna — Montage:** foydalanuvchi tanlagan 3–6 bo‘lak, tanishuv/turmush rejalari.
- **3-sahna — Ovoz:** yuboruvchi o‘z ovozida 10–30 sekundli gap aytishi mumkin.
- **4-sahna — Oxirgi kadr:** oq ekran emas, oldingi barcha foto kadrlar orqaga chekinib, bitta markaziy kartaga yig‘iladi.
- **Final:** savol yirik ekranga chiqadi, qabul qiluvchi bosganida alohida confetti yoki sokin yakun; share uchun spoiler-free thumbnail.
- **Gesture/motion:** scroll-to-film-edit, cinematic wipes, text subtitle sync (video bo‘lsa), foydalanuvchi qulay pauza.
- **Audio:** original cinematic score, muallif yuklagan musiqaga ruxsat mavjud bo‘lsa.
- **Editor:** footage, short voice, captions, sahna tartibi, final savol.

## P3 — Sky Promise
- **Slug:** proposal-sky-promise · yangi.
- **Logline:** kun botib, osmon yulduzlarga to‘lganda bitta shaxsiy savol porlaydi.
- **Material/palitra:** periwinkle dusk, rose cloud, night indigo, warm starlight.
- **Signature 3D:** osmon gumbazi, yupqa bulut qatlamlari va kamera orbitasi; astronomik aniqlik da’vosi yo‘q.
- **Ochilish:** tongdan shomga o‘tish 3D gradient sky-dome; «Bitta yulduzni tanla».
- **1-sahna — Xotira yulduzlari:** uchta tanlangan yulduz bir surat/hikoyani ochadi.
- **2-sahna — Orzular:** kelajakka oid 3 haqiqiy niyat; bulutlar orqasidan ko‘rinadi.
- **3-sahna — Uchrashuvga qaytish:** muallif kiritgan tanishgan sana yoki joy ixtiyoriy.
- **4-sahna — Osmon xaritasi:** yulduzlar qalbga yaqin geometrik konstellatsiya yasaydi, xuddi «bizning kelajagimiz».
- **Final:** yulduzlar orasidagi savol va ikkita hurmatli javob; «Ha»da yengil aurora, boshqa javobda shaffof sokin osmon.
- **Gesture/motion:** swipe-to-rotate, yulduz soft trails, reduced-motion’da statik gradient/konstellatsiya.
- **Audio:** ambient piano, soft pads; mute.
- **Editor:** sana/joy, 3 xotira, 3 niyat, final savol, optional audio.

---

# 6. HAMMA SHABLONLARGA UMUMIY FUNKSIONAL SHARTNOMA

## 6.1 Mijoz oqimi
**Yo‘nalish → faqat unga oid 3 shablon → haqiqiy demo → Creator Studio → Save draft → Publish → QR/link → javob va statistika.** Yangi shablonlar tayyor bo‘lmaguncha «Yaqinda» statusi bilan ko‘rsatiladi; ishlamaydigan «Ishlatish» tugmasi qo‘yilmaydi. Eski loyiha shablon ID’lari saqlanadi.

## 6.2 Ma’lumot modeli
Umumiy maydonlar: templateSlug, recipient, sender, language (UZ/RU/EN), intro, storyBlocks, letter, photoAssets, optional videoAsset, optional musicAsset, theme, coverPosition, finaleQuestion, finalChoiceLabels, accessibilityMode, publishSlug. Barcha matn DOM textContent orqali chiqariladi; foydalanuvchi kiritgan HTML ishlatilmaydi.

Wedding qo‘shimchalari: coupleNames, eventAt (timezone bilan), venue, venueMap, schedule[], dressCode, guestList, guestToken, RSVP state, optional calendar ICS. Apology qo‘shimchalari: admittedMistake, impactAcknowledgment, repairPlan, consentToRespond. Love: metAt, memoryCaptions[], optional portrait permission. Birthday: optional age, guestWishes[], birthdayEventMode. Proposal: promiseText, optional voice, finalQuestion.

Ommaviy sahifa ma’lumoti shaxsiy tahrir draftidan ajratiladi; private suratlar ommaviy sahifaga faqat loyiha muallifi publish qilganidan keyin kerakli o‘qish siyosati asosida chiqariladi. Guest token raw SQL orqali tarqatilmaydi; faqat mo‘ljallangan RPC orqali.

## 6.3 Animatsiya arxitekturasi
- **Three.js:** 3D sahna kerak bo‘lsa, umumiy renderer va har shablonning alohida scene module’i; 15 sahnani bitta katta bundle’ga joylamaslik.
- **GSAP:** timeline, scene orchestration va state transition; scroll’ga bog‘langan elementlar uchun ScrollTrigger; animation o‘chiq bo‘lganda ham kontent to‘liq o‘qiladi.
- **Blender:** uzuk, quti, atlas parda, konvert, naqshli medalyon, shar, projektor kabi original GLB/GLTF assetlar; Draco/KTX2 optimizatsiyasi.
- **Rive/Lottie:** UI micro-animatsiya (progress, CTA, sound toggle), og‘ir hero 3D bilan almashtirilmaydi.
- **Audio:** unlock first tap, mute default, sound cues optional, audio mavjud bo‘lmasa sahnalar baribir ishlaydi.
- **Fallback:** WebGL yo‘q; sekin tarmoq; low-memory Android; reduced motion; autoplay bloklanishi — barchasida 2D/rasm varianti. “Loading” abadiy aylanmaydi.

## 6.4 Ishlash va sifat byudjeti (maqsad, o‘lchov bilan tekshiriladi)
- Mobile preview 360/390/430px, desktop 1440px va planshet.
- Birinchi sahna tasviri taxminan 2 sekund ichida ko‘rinishga intiladi; 3D lazy-load; font fallback; jank kuzatilsa sifat darajasi avtomatik pasayadi.
- 3D animatsiya mos qurilmalarda 30fps dan past tushmasligi maqsad qilinadi; flagship’da tez qurilmada 60fps maqsad.
- GPU xotirasini tejash: bir vaqtning o‘zida bitta asosiy WebGL scene, sahna tark etilganda dispose.
- Tasvirlar original yoki litsenziyasi aniqlangan, muddati o‘tuvchi imzolangan tashqi URL’lar emas; o‘zimizda yoki to‘g‘ri sozlangan media storage’da saqlanadi. Surat/ovoz yuklash uchun format, hajm va EXIF xavfsizligi tekshiriladi.
- Full mobile accessibility: kontrast, semantik tugmalar, klaviatura, ARIA dialog, sukut va reduced-motion.
- Invalid URL yoki 404 media butun template’ni yiqitmaydi; ko‘rinadigan fallback mavjud.

## 6.5 Yakuniy qabul qilish testlari
1. O‘z kategoriyasidan boshqa template ko‘rinmaydi. Tanlovdan keyin 3 ta variant bor (ishga tushmaganlari «Yaqinda»).
2. 15 ta shablonning opening, asosiy 3D obyekt, sahna ketma-ketligi va finali qo‘lda ko‘rilganda haqiqatan alohida.
3. Intro skip/reduced motion/past qurilma fallback ishlaydi; ovoz avtomatik boshlanmaydi.
4. Xavfsiz photo/audio/video upload, delete, storage read rights, public va private rejim sinovdan o‘tadi.
5. Kirish, ro‘yxatdan o‘tish, session restore, save/edit/publish/slug collision/QR real foydalanish testidan o‘tadi.
6. RSVP: haqiqiy guest token, 2 marta bosilganda duplicate yo‘q, yangilash, qabul qiluvchi soni limitga mos, statistikada to‘g‘ri.
7. Barcha shablonlarda uzun ism, uzun xat, bo‘sh foto, invalid sana, uzoq xarita, UZ/RU/EN layout, keng telefon ekranlari sinovdan o‘tadi.
8. 15/15 ochilish marosimi va finale uchun screen recording qayd qilinadi. Test videosiz «tayyor» deyilmaydi.

## 6.6 Ishlab chiqish navbati va ochiq status
**Phase A — flagship (5):** Silk Heritage, Rose Theatre, After Rain, Pearl Promise, Aurora Paper. Har biri alohida sahna engine’iga o‘tib, oldindan tayyorlangan original media + real editor data + mobile QA oladi.  
**Phase B — ikkinchi beshta:** Night Garden, Pearl Linen, Heritage Naqsh, Cinema Proposal, Memory Reel.  
**Phase C — oxirgi beshta:** Galaxy Confession, Balloon Dream, Ink of Regret, Quiet Room, Sky Promise.  
Har phase oxirida mavjud production’ni almashtirmasdan alohida preview/deploy tekshiriladi; tasdiqlangandan keyin merge qilinadi.

**Tijoriy holat:** hozir Click/Payme integratsiyasi qilinmaydi. Publish/analytics/media va barcha mavjud ishlash mezonlari pul to‘lashga bog‘lanmaydi. Video eksport kelgusidagi alohida imkoniyat.

---

# 7. MASTER CHECKLIST — har bir shablon uchun to‘ldiriladi

- [ ] Original storyboard: opening → hissiy cho‘qqi → finale, vaqtlar ko‘rsatilgan.
- [ ] Original 3D asset yoki 3D bo‘lmasa aniq belgilangan 2.5D alternativ.
- [ ] Mobilga mos cinematic intro va ishlaydigan skip.
- [ ] Data-driven barcha matnlar, sana, media va final.
- [ ] Hissiy javob variantlari hurmatli va accessibility’ga mos.
- [ ] Original/licensed media lokal yoki ishonchli storage’da.
- [ ] Desktop va mobile: screenshot/recording review.
- [ ] 404/slow network/reduced motion/keyboard testlari.
- [ ] Supabase auth, owner permissions, publish, personal guest RSVP end-to-end testlari.
- [ ] Muallif oldindan ko‘rib, tahrir qiladi; demo ma’lumoti haqiqiy loyiha ma’lumotiga alishadi.

**Natija talabi:** 5 yo‘nalish, 15 nom, 15 original storyboard, 15 alohida opening, 15 alohida interaction, 15 alohida finale. “Bir xil sahifa + boshqa rang” EMORA standarti bo‘la olmaydi.
