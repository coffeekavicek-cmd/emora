# EMORA — interaktiv hikoyalar

Node.js 20+ bilan ishlaydigan, GitHub'ga yuklashga tayyor loyiha. Hozir uch yo‘nalish ishlaydi: **tug‘ilgan kun**, **uzr so‘rash**, **turmush qurish taklifi**. Sevgi izhori va to‘y taklifnomasi keyingi bosqich uchun ajratilgan.

## Boshlash

```bash
npm run dev
```

`http://localhost:3000` ni oching. Ishlab chiqishda faqat shu kompyuterdan yozishga ruxsat beriladi. `npm run build` fayllarni tekshiradi, `npm test` server API va uch hikoya yo‘lini tekshiradi. Kutubxona o‘rnatish shart emas.

Internetga qo‘yishdan oldin `.env.example` nusxasini `.env` deb saqlang va kamida `EMORA_ADMIN_KEY` hamda `PUBLIC_ORIGIN` ni to‘ldiring. So‘ng:

```bash
node --env-file=.env server.mjs
```

Ishlab chiqarish muhitida `NODE_ENV=production` bo‘lsin. Kalitni repoga kiritmang; `.env` Git tomonidan e’tiborga olinmaydi. `DATA_DIR` papkasi doimiy diskda saqlanishi kerak. GitHub Pages faqat statik fayllarga xizmat qiladi, hikoyalar va media uchun bu Node serveri kerak. Reverse proxy orqali HTTPS bilan oching va server jarayonini qayta ishga tushadigan xizmatda saqlang.

## Jonli demo

`http://localhost:3000/demo/` da uchta ishlaydigan namuna ochiladi. Ular xayoliy qahramonning suratlari va qisqa video bilan keladi. Demodagi javoblar serverga yoki Telegramga yuborilmaydi.

## Hikoyalarni yaratish

1. Yo‘nalish va besh ko‘rinishdan birini tanlang; ismlar va xabarni to‘ldiring.
2. Kamida bitta foto va bir video yuklang. Har bir suratga alohida yozuv yozish mumkin.
3. To‘rtta original instrumental fon musiqasidan birini yoki 20 MB gacha o‘z audio faylingizni tanlang.
4. “Oldindan ko‘rish” orqali voqeani ko‘ring. “Havola yaratish” media va hikoyani saqlaydi. Hosil bo‘lgan `/s/...` havolani yuboring.

Tug‘ilgan kun hikoyasi laqab bilan ochiladi va foto mozaikasining avtomatik yig‘ilishi bilan yakunlanadi. Uzr so‘rash hikoyasida xat, video, uchrashuv joyi, kun va vaqt tanlanadi. Taklif hikoyasida video, suratdagi komplimentlar, xat va qutidan ochiladigan uzuk ketma-ket ko‘rsatiladi. Har qanday javob qabul qilinadi.

## Telegram javoblari

Bot orqali avtomatik xabar olish uchun o‘zingizning Telegram bot tokeningizni `TELEGRAM_BOT_TOKEN` ga, xabar boradigan suhbat ID raqamini `TELEGRAM_CHAT_ID` ga yozing. Bot oldin shu chatda ishga tushirilgan bo‘lishi kerak. Javob serverda `data/responses/*.jsonl` ga saqlanadi, keyin bot xabar yuboradi.

Bot ulanmagan yoki vaqtincha ishlamagan bo‘lsa, javob baribir serverda saqlanadi va oluvchiga Telegramda yuborishni **o‘zi tasdiqlashi** uchun tayyorlangan havola ko‘rsatiladi. Bu holatda avtomatik yetkazilgan deb ko‘rsatilmaydi. Admin kaliti bilan `GET /api/stories/{id}/responses` dan yozilgan javoblarni ko‘rish mumkin.

Sirli so‘z boshqa odamdan himoyalovchi login emas: URL va laqabni bilgan kishi hikoyani ko‘ra oladi. Javoblar bir marta bilan cheklanmagan, shu sababli muhim qarorni boshqa yo‘l bilan ham tasdiqlang.

## Joylashuv

- `public/`: editor, sahnalar, 15 ta ko‘rinish uchun art, uzuk rasmi, to‘rtta musiqa.
- `server.mjs`: yuklash, hikoya havolasi, javoblarni saqlash va Telegram xabari.
- `data/`: siz yaratgan shaxsiy surat, video va javoblar. Git'ga kirmaydi.
- `tests/`: API sinovi.

Shaxsiy media faqat sizning serveringizdagi `data` ga yoziladi. Bir hikoya media faylini 64 MB gacha qabul qiladi, surat 8 MB va audio 20 MB gacha. Disk joyi va zaxira nusxasini hostingda sozlang.
