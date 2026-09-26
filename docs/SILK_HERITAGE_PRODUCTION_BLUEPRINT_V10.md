# EMORA · SILK HERITAGE
## Flagship Wedding Experience — Production Blueprint V10
**Branch:** emora-v10-silk-flagship  
**Stable template slug:** wedding-silk-heritage  
**Category:** To‘y taklifnomasi (birinchi navbatda 5 yo‘nalishdan bittasi tanlanadi).  
**Status:** ishlab chiqish hujjati; quyidagi sifat mezonlari to‘liq sinovdan o‘tmaguncha «tayyor» deyilmaydi.

### Mahsulot maqsadi
Mehmon linkni ochganidan keyin birinchi 2 soniyada o‘zbek premium atelyesi uslubidagi ko‘zga tashlanadigan vizual ko‘radi. Keyin foydalanuvchining bitta ixtiyoriy bosishi bilan real 3D konvert ochiladi; yorug‘lik, atlas parda va oq gullar uyg‘unligida haqiqiy taklifnoma paydo bo‘ladi. Bu dekor emas — voqea sanasi, manzil va mehmon ismi bilan moslashuvchi marosimdir.

## 1. ART DIRECTION
| Element | Ishlab chiqish sharti |
|---|---|
| Mood | zamonaviy o‘zbekona premium atelye, dekorativ lekin gavjum emas |
| Ranglar | Ivory #FBF8F0 · Champagne #C6AC7F · Sage #405348 · Blush #EEDFD7 |
| Tipografiya | Cormorant Garamond/Cormorant yoki mavjud serif + DM Sans; uzun ismlarda 2 qatordan oshmaydi |
| Material | ipak parda, handmade cotton paper, oltin emboss, wax seal, marble arch, oq gul |
| Kadr | 9:16 mobil hero, keyin 16:9 desktop adaptatsiya |
| Suv belgisi | demo va personal havolada kichik EMORA footer; mijoz surati va maxfiy ma’lumot demo asset bo‘lmaydi |
| Kirish CTA | «Taklifnomani ochish»; ikkinchi CTA «Animatsiyasiz ko‘rish» |
| Ovoz | default OFF; user bosganda original/litsenziyali yumshoq instrumental |

## 2. SEKVENS — SONIYAMA-SONIYA
**T=0–0.8s | Establishing frame.** Ivory ark va yumshoq volumetrik nur darhol ko‘rinadi. Qog‘oz tuzilmasi va mayda oq gullar statik tasvir yordamida 3D yuklanguncha ham bo‘sh ekran qoldirmaydi. Oldindagi DOM’da: «Aziz mehmonimiz», logotip va ochish tugmasi. FPS past bo‘lsa renderer ishga tushmasligi mumkin.

**T=0.8–2.0s | Invitation awaits.** Yopiq 3D konvert, real 3D chuqurlik va oltin mum muhr markazda. Atlas qatlamlarida sekin shamol tebranishi; foydalanish uchun tugma darhol faol. Hech qanday avtomatik audio va avtomatik sahna o‘tishi yo‘q.

**Foydalanuvchi «Taklifnomani ochish»ni bosadi — T=0–0.3s.** Oltin mum muhr yengil nur chiqarib ikki qismga ajraladi. Yengil foley faqat audio yoqilgan bo‘lsa. Tugma bir marta bosilganda qayta ijro boshlanmaydi.

**T=0.3–1.1s | Real 3D envelope.** Qog‘oz flap o‘z o‘qida buklanadi (joint rotation), qog‘oz yengil oldinga chiqadi, kamera taxminan 12° buriladi. Perspektiva chalg‘itmaydi.

**T=1.1–1.9s | Silk reveal.** Ikkala parda yon tomonlarga silliq ochiladi. 12–20 dona yengil gul bargi yuqoridan emas, yorug‘lik ortidan kiradi. Mobile-low rejimda barglar soni kamayadi.

**T=1.9–2.2s | Names.** Shaxsiy taklifnoma ustiga kelin-kuyov ismlari DOM matni sifatida chiqadi, 3D tekstura ichiga pishirib qo‘yilmaydi — kirill, lotin va uzun ismlarni real tahrirlash shart. Mijoz kiritgan ismlar o‘zgarganida ham renderer qayta yig‘ilmaydi.

**T=2.2s+ | Keyingi sahna.** Semantik DOM hikoyaga to‘liq o‘tiladi. 3D GPU resurslari tozalashga yuboriladi, intro matni screen reader tomonidan qayta o‘qilmaydi. Reduced-motion uchun 3D kadr bo‘lmaydi, darhol taklif sarlavhasi ko‘rsatiladi.

## 3. SAHNALAR
### S1 · Invitation / Kelin-kuyov
*Doimiy ism va manzilli taklif, qog‘ozda bosma element.*

Data: bride, groom, guestDisplayName (faqat tekshirilgan guest token bo‘lsa), introText, optional heroPhoto. Ikki ustunli desktop, markaziy mobil layout. Public umumiy havolada «Aziz mehmonimiz», guest tokenli havolada «Aziz [mehmon ismi]»; tasdiqlanmagan query-string ism sifatida ko‘rsatilmaydi. Bosish: «Tafsilotlarni ko‘rish».

### S2 · The Moment / Sana
*Yirik sana, hafta kuni, vaqt, countdown va matn.*

Data: eventAt + timezone (IANA), optional secondaryDate. Default sample sana preview deb belgilanadi; real public loyihada sana kiritilmasa publish bloklanadi. Countdown vaqtni backendga taxmin qilmaydi: foydalanuvchi local UI timezone’iga emas, event timezone’iga nisbatan hisoblaydi. O‘tib ketgan sana uchun manfiy timer yo‘q. «Taqvimga qo‘shish» uchun ICS event yaratish taklif etiladi.

### S3 · The Celebration / Marosim dasturi
*3–6 original timeline kartalari, yirik ikki qatorli kompozitsiya.*

Data: schedule [{time,title,description,optionalIcon}]. Default sample: 17:00 mehmon kutib olish / 18:00 nikoh marosimi / 19:00 bayram oqshomi. Editor’da vaqt va qatordan qo‘shish/o‘chirish. Animatsiya: har vaqt ortidan ingichka oltin chiziq chiziladi, DOM o‘qilishi scroll animatsiyasiga bog‘liq emas.

### S4 · The Place / Manzil
*To‘yxona nomi, manzil, kichik 3D o‘yma arkdan o‘tish efekti va xarita.*

Data: venue, address, venueMap (https va allowlist), optional secondVenue. Map nuqsonli bo‘lsa tugma yashiriladi, manzil matni qoladi. Uzun manzil yangi qatordan chiqariladi. CTA: «Xaritada ko‘rish» tashqi yangi tab; «Taqvimga qo‘shish» ICS.

### S5 · Guest RSVP / Javob
*Oq qog‘oz kartasi va shaxsiy guest havolasi orqali haqiqiy javob.*

Data: verified guest token and partySize. «Boraman / Balki / Bormayman», boruvchi soni 0–partySize, izoh; server guest_token tekshiradi, bir token bitta RSVP row’ni yangilaydi (double click duplication yo‘q). Generic public havolada RSVP formasi ochiq ko‘rsatilmaydi; «Shaxsiy taklifnoma havolangizdan foydalaning» ko‘rinadi. Stats faqat loyiha egasiga RLS/RPC orqali. Xatolikda foydalanuvchiga aniq qayta urinish.

### S6 · Blessing / Yakun
*Yorug‘ gullar bilan bir marta namoyon bo‘ladigan oltin zarra va rahmat yozuvi.*

Data: familySignoff, optional blessing, share title, cover image. «Havolani ulashish», optional screenshot share card, original brand attribution. «Boraman» javobi atrofida bezak bor, «Bormayman» javobi uchun boshqa bosim yo‘q.

## 4. 3D & ANIMATION PRODUCTION
**3D obyektlar:** arch, ikkita silk curtain mesh, envelope body, envelope flap on pivot, extruded wax seal, 2–3 oq floral groups. Blender’da GLB/GLTF PBR teksturali final modellar; birinchi iteratsiyada protsedurali Three.js geometriya va CSS fallback. 3D ishlayotganini «CSS illusion» bilan tenglashtirmaslik.

**Renderer:** max pixel ratio 1.5, alpha transparent, bir intro canvasi, ResizeObserver, matchMedia reduced motion, tab hidden’da RAF pause, intro yopilgach geometry/material/texture dispose. 3D kutubxonasi faqat flagship template sahifasiga lazy-load qilinadi; boshqa 14 templatega tushmaydi.

**Animation curves:** easeInOutCubic (opening camera), cubic-bezier(.22,.61,.36,1) (silk curtains), muhr uchun easeOutBack juda cheklangan. Harakat qisqa, foydalanuvchini charchatmaydi; playback 1.5–2.2s.

**Fallback:** WebGL yoki CDN yo‘q bo‘lsa mavjud DOM preserve-3d konvert + CSS curtain ochiladi. Foydalanuvchi ma’lumotlariga bog‘liq sahnalar 3D obyekt yuklanishini kutmaydi.

**Mahalliy media:** original hero rasmlari va 3D GLB’lar self-host qilinadi. Muddati tugaydigan Runway JWT URL’lar production hero uchun qabul qilinmaydi. Preview’da suratlarga maxfiy foydalanuvchi yuklamalari aralashmaydi.

## 5. INTEGRATSIYA
- Template slug o‘zgarmaydi: wedding-silk-heritage → /templates/wedding-silk.html.
- Parent studio postMessage «emora:wedding-preview», origin = location.origin; iframe dynamic config: bride, groom, eventAt, venue, venueMap, invitation, optional cover, style, allowRsvp. V10 kengaytma maydonlari backwards-compatible.
- Public /s/:slug faqat RLS’da faol e’lon qilingan ma’lumotni oladi. Guest tokenli RPC orqali tasdiqlanmagan ism HTML ichiga hech qachon joylashtirilmaydi.
- Signup/login/o‘z loyihasini saqlash V10 wedding animation ishidan mustaqil; auth/saving ishlamay qolganda animatsiya release qilinmaydi.
- Publish chiqarilishidan oldin ikki real test hisobida owner save → publish → shaxsiy guest havola → RSVP → owner analytics E2E.

## 6. QABUL SINOVI
1. iPhone SE (375 px), 390 px Android, 430 px mobile, 768 px tablet, 1440 px desktop.
2. Default, uzun ism, kirillcha ism, apostrofli o‘zbek ism, bo‘sh optional photo, juda uzun taklif xati.
3. WebGL on/off, GSAP/JS kutubxonasi yuklanmaganda CSS fallback, internet sekin va offline return.
4. «O‘tkazib yuborish» bosilganda intro bir marta yopiladi; audio user ishorasisiz boshlanmaydi.
5. Reduced-motion: animatsiyasiz asosiy matn va qolgan sahnalar to‘liq ishlaydi; keyboard focus intro’dan kontentga ko‘chadi.
6. Sana o‘zgarsa countdown to‘g‘ri; o‘tib ketgan sana manfiy emas; timezone event bilan mos.
7. RSVP faqat token bilan, dublikat yo‘q, anonim analytics chiqmaydi.
8. 3D 2.2 sekunddan ko‘proq kutishga majbur qilmaydi, scene tanlanganda renderer tozalanadi.
9. Preview, draft, publish, guest-token URL, QR va map real qurilmalarda screenshot/video orqali ko‘riladi.
10. **Release sharti:** tugallanmagan yangi shablon katalogda ishlaydi deb belgilanmaydi; mavjud V9 production yangi V10 validatsiya qilinmaguncha saqlanadi.

## 7. DELIVERABLE & STATUS
- D1: production blueprint (ushbu hujjat).
- D2: original self-hosted texture + GLB asset pack (alohida yaratish).
- D3: Silk-specific renderer, motion controller, CSS fallback, media preload.
- D4: schedule/timezone editor form, ICS va real guest RSVP integratsiyasi.
- D5: mobile accessibility/performance/E2E testlari va haqiqiy Railway demo.
**Har deliverable o‘z commit va test dalili bilan belgilanadi.**
