/* EMORA V10 · 14 separate story engines + Silk Heritage flagship. */
export const TEMPLATES=[
  {
    "key": "love-rose",
    "slug": "love-rose-theatre",
    "group": "love",
    "name": "Rose Theatre",
    "code": "01",
    "art": "love-rose.png",
    "motif": "THE LOVE FILM",
    "opening": "Senga aytolmagan bir gapim bor…",
    "subtitle": "Bu film faqat sen uchun. Har kadrida bir xotira, yakunida esa yuragimdagi eng muhim savol.",
    "action": "Filmni boshlash",
    "introType": "theatre",
    "scenes": [
      "projector",
      "filmstrip",
      "subtitles",
      "choice"
    ],
    "accent": "#d8a9a6",
    "dark": true,
    "defaultNote": "Bizning hikoyamiz endi boshlanmoqda.",
    "finalQuestion": "Bu hikoyani birga davom ettiramizmi?",
    "yes": "Ha, birga ♡",
    "later": "Menga vaqt kerak",
    "caption": [
      "Birinchi kadr",
      "Sevimli lahzam",
      "Davomi oldinda"
    ]
  },
  {
    "key": "love-pearl",
    "slug": "love-pearl-linen",
    "group": "love",
    "name": "Pearl Linen",
    "code": "02",
    "art": "love-pearl.png",
    "motif": "THE PRIVATE LETTER",
    "opening": "Eng sokin baxtim — sen.",
    "subtitle": "Ba’zi hislarni shoshilmay aytish kerak. Bu maktubda faqat sen uchun saqlangan so‘zlar bor.",
    "action": "Muhrni ochish",
    "introType": "envelope",
    "scenes": [
      "seal",
      "polaroid",
      "letter",
      "choice"
    ],
    "accent": "#b6968e",
    "dark": false,
    "defaultNote": "Uchta yorug‘ xotira va bitta samimiy maktub.",
    "finalQuestion": "Yana mingta xotira yaratamizmi?",
    "yes": "Albatta ♡",
    "later": "Shoshilmaylik",
    "caption": [
      "Birinchi uchrashuv",
      "O‘sha tabassum",
      "Ertangi kun"
    ]
  },
  {
    "key": "love-galaxy",
    "slug": "love-galaxy-confession",
    "group": "love",
    "name": "Galaxy Confession",
    "code": "03",
    "art": "love-galaxy.png",
    "motif": "A SKY OF WORDS",
    "opening": "Sen mening butun olamimsan.",
    "subtitle": "Har bir yulduz ortida bir so‘z. Olamning eng go‘zal sirini shu osmondan izla.",
    "action": "Osmonga kirish",
    "introType": "galaxy",
    "scenes": [
      "stars",
      "orbit",
      "constellation",
      "choice"
    ],
    "accent": "#d6b7d6",
    "dark": true,
    "defaultNote": "Uchta yulduzda uchta unutilmas sabab.",
    "finalQuestion": "Yangi yulduzimizni birga yoqamizmi?",
    "yes": "Ha ♡",
    "later": "O‘ylab ko‘raman",
    "caption": [
      "Mening quvonchim",
      "Mening ilhomim",
      "Mening ertam"
    ]
  },
  {
    "key": "wedding-garden",
    "slug": "wedding-night-garden",
    "group": "wedding",
    "name": "Night Garden",
    "code": "05",
    "art": "wedding-garden.png",
    "motif": "A NIGHT TO REMEMBER",
    "opening": "Yulduzlar ostida uchrashamiz.",
    "subtitle": "Shamlar, gullar va eng aziz insonlar davrasida yangi hayotimiz boshlanadi.",
    "action": "Bog‘ga kirish",
    "introType": "garden",
    "scenes": [
      "lantern",
      "schedule",
      "venue",
      "rsvp"
    ],
    "accent": "#d1b67a",
    "dark": true,
    "defaultNote": "Sizni yulduzli kechamizning bir qismi bo‘lishga taklif qilamiz.",
    "finalQuestion": "Bu oqshomni birga nishonlaymizmi?",
    "yes": "Mehmon javobini yuborish",
    "later": "Havolani ulashish",
    "caption": [
      "Kutib olish",
      "Marosim",
      "Bayram"
    ]
  },
  {
    "key": "wedding-naqsh",
    "slug": "wedding-heritage-naqsh",
    "group": "wedding",
    "name": "Heritage Naqsh",
    "code": "06",
    "art": "wedding-naqsh.png",
    "motif": "AN'ANA VA MUHABBAT",
    "opening": "Bir naqsh. Ikki qalb. Bir oila.",
    "subtitle": "Zardo‘zi va atlas nafisligi bilan bezalgan, sizga atalgan shaxsiy taklifnoma.",
    "action": "Naqshni ochish",
    "introType": "naqsh",
    "scenes": [
      "medallion",
      "families",
      "schedule",
      "rsvp"
    ],
    "accent": "#c9a06d",
    "dark": false,
    "defaultNote": "Qadrli mehmonimiz, oilamiz quvonchiga sherik bo‘ling.",
    "finalQuestion": "Biz bilan birga bo‘lasizmi?",
    "yes": "Javob berish",
    "later": "Havolani ulashish",
    "caption": [
      "Oila duosi",
      "Birgalikdagi kun",
      "Qadrli mehmonlar"
    ]
  },
  {
    "key": "birthday-aurora",
    "slug": "birthday-aurora-paper",
    "group": "birthday",
    "name": "Aurora Paper",
    "code": "07",
    "art": "birthday-aurora.png",
    "motif": "A LITTLE CELEBRATION",
    "opening": "Bugun hamma nur seniki!",
    "subtitle": "Bitta sovg‘a ichida juda ko‘p tilak, rang-barang xotiralar va alohida tabrik yashiringan.",
    "action": "Sovg‘ani ochish",
    "introType": "gift",
    "scenes": [
      "ribbon",
      "wishes",
      "gallery",
      "confetti"
    ],
    "accent": "#cc826b",
    "dark": false,
    "defaultNote": "Hayotingning har bir kuni yangi bayram bo‘lsin.",
    "finalQuestion": "Bugun sening eng yaxshi kuning!",
    "yes": "Bayramni boshlash ✦",
    "later": "Ulashish",
    "caption": [
      "Sevimli lahza",
      "Chiroyli xotira",
      "Yangi orzu"
    ]
  },
  {
    "key": "birthday-balloon",
    "slug": "birthday-balloon-dream",
    "group": "birthday",
    "name": "Balloon Dream",
    "code": "08",
    "art": "birthday-balloon.png",
    "motif": "THREE WISHES",
    "opening": "Orzularing osmonga yetsin!",
    "subtitle": "Uchta shar. Uchta tilak. Va senga bag‘ishlangan bir kun.",
    "action": "Sharlarni uchirish",
    "introType": "balloon",
    "scenes": [
      "balloons",
      "milestones",
      "event",
      "confetti"
    ],
    "accent": "#a99db1",
    "dark": false,
    "defaultNote": "Har bir yangi yil o‘zing orzu qilgan hayotga bir qadam yaqinlashtirsin.",
    "finalQuestion": "Yangi orzular sari!",
    "yes": "Sharni uchirish ✦",
    "later": "Ulashish",
    "caption": [
      "Quvonch",
      "Muhabbat",
      "Yangi ufqlar"
    ]
  },
  {
    "key": "birthday-memory",
    "slug": "birthday-memory-reel",
    "group": "birthday",
    "name": "Memory Reel",
    "code": "09",
    "art": "birthday-memory.png",
    "motif": "A LIFE IN FRAMES",
    "opening": "Sening hayoting — chiroyli film.",
    "subtitle": "Eng yaxshi kadrlarni bitta lentaga jamladik. Premyera faqat senga bag‘ishlanadi.",
    "action": "Premyerani boshlash",
    "introType": "reel",
    "scenes": [
      "projector",
      "eras",
      "voices",
      "credits"
    ],
    "accent": "#cba77b",
    "dark": true,
    "defaultNote": "Har kadrda samimiy xotiralar, har bobda alohida sen.",
    "finalQuestion": "Davomi hali oldinda.",
    "yes": "Yangi bobga ✦",
    "later": "Ulashish",
    "caption": [
      "Bir paytlar",
      "Bugun",
      "Ertaga"
    ]
  },
  {
    "key": "apology-rain",
    "slug": "apology-after-rain",
    "group": "apology",
    "name": "After Rain",
    "code": "10",
    "art": "apology-rain.png",
    "motif": "AFTER THE RAIN",
    "opening": "Bir gapimni eshitasanmi?",
    "subtitle": "Oynadagi tumanni art. Men aytishga qiynalgan, ammo aytishim kerak bo‘lgan so‘zlar shu yerda.",
    "action": "Oynani artish",
    "introType": "rain",
    "scenes": [
      "fog",
      "acknowledge",
      "letter",
      "response"
    ],
    "accent": "#b7ced0",
    "dark": true,
    "defaultNote": "Seni ranjitganim uchun uzr. Men seni tinglashga tayyorman.",
    "finalQuestion": "Gaplashishga tayyormisan?",
    "yes": "Gaplashamiz",
    "later": "Menga vaqt kerak",
    "caption": [
      "Tan olish",
      "Tushunish",
      "Tuzatish"
    ]
  },
  {
    "key": "apology-ink",
    "slug": "apology-ink-of-regret",
    "group": "apology",
    "name": "Ink of Regret",
    "code": "11",
    "art": "apology-ink.png",
    "motif": "WORDS WITH WEIGHT",
    "opening": "Siyoh izsiz qolmaydi.",
    "subtitle": "Har bir so‘zimning javobgarligi bor. Bu xat bahona emas, kechirim so‘rash.",
    "action": "Maktubni o‘qish",
    "introType": "ink",
    "scenes": [
      "ink",
      "accountability",
      "repair",
      "response"
    ],
    "accent": "#aa9b91",
    "dark": false,
    "defaultNote": "Qilgan xatomni tan olaman va qanday tuzatishimni aniq aytmoqchiman.",
    "finalQuestion": "Bir kun gaplashishga tayyor bo‘lsang…",
    "yes": "Gaplashamiz",
    "later": "Hozir emas",
    "caption": [
      "Men qilgan ish",
      "Seni tushunish",
      "Keyingi qadam"
    ]
  },
  {
    "key": "apology-quiet",
    "slug": "apology-quiet-room",
    "group": "apology",
    "name": "Quiet Room",
    "code": "12",
    "art": "apology-quiet.png",
    "motif": "ROOM FOR YOUR FEELINGS",
    "opening": "Shovqinsiz bir suhbat.",
    "subtitle": "Ba’zi so‘zlar uchun shovqin kerak emas. Faqat halollik va tinglashga tayyorlik.",
    "action": "Chiroqni yoqish",
    "introType": "lamp",
    "scenes": [
      "lamp",
      "listen",
      "letter",
      "response"
    ],
    "accent": "#d1ad7d",
    "dark": true,
    "defaultNote": "Men eshitishga, o‘rganishga va qaroringni hurmat qilishga tayyorman.",
    "finalQuestion": "Sening vaqting va qaroring muhim.",
    "yes": "Gaplashamiz",
    "later": "Vaqt kerak",
    "caption": [
      "Sukut",
      "Eshitish",
      "Hurmat"
    ]
  },
  {
    "key": "proposal-pearl",
    "slug": "proposal-pearl-promise",
    "group": "proposal",
    "name": "Pearl Promise",
    "code": "13",
    "art": "proposal-pearl.png",
    "motif": "FOREVER BEGINS",
    "opening": "Mening eng muhim savolim…",
    "subtitle": "Bu savolgacha yetish uchun har bir xotiramiz, har bir va’dam kerak bo‘ldi.",
    "action": "Hikoyani ochish",
    "introType": "ring",
    "scenes": [
      "box",
      "memories",
      "vows",
      "proposal"
    ],
    "accent": "#dbc4a0",
    "dark": true,
    "defaultNote": "Kelajagimdagi eng go‘zal kadrlarni sen bilan tasavvur qilaman.",
    "finalQuestion": "Menga turmushga chiqasanmi?",
    "yes": "Ha ♡",
    "later": "Birga gaplashaylik",
    "caption": [
      "Birinchi kun",
      "Bizning yo‘limiz",
      "Mening va’dam"
    ]
  },
  {
    "key": "proposal-cinema",
    "slug": "proposal-cinema",
    "group": "proposal",
    "name": "Cinema Proposal",
    "code": "14",
    "art": "proposal-cinema.png",
    "motif": "A PREMIERE FOR TWO",
    "opening": "Bugun eng muhim premyera.",
    "subtitle": "Bizning filmimizning eng katta savoli oxirgi kadrga yashirilgan.",
    "action": "Treylerni boshlash",
    "introType": "cinema",
    "scenes": [
      "trailer",
      "frames",
      "voice",
      "proposal"
    ],
    "accent": "#d3b279",
    "dark": true,
    "defaultNote": "Biz birga yaratgan barcha hikoyalar eng muhim kadrga olib keldi.",
    "finalQuestion": "Yangi filmimizni birga boshlaymizmi?",
    "yes": "Ha ♡",
    "later": "Birga gaplashaylik",
    "caption": [
      "Birinchi uchrashuv",
      "Sevimli sahnam",
      "Eng katta savol"
    ]
  },
  {
    "key": "proposal-sky",
    "slug": "proposal-sky-promise",
    "group": "proposal",
    "name": "Sky Promise",
    "code": "15",
    "art": "proposal-sky.png",
    "motif": "UNDER THE SAME SKY",
    "opening": "Bir osmon ostida — abadiy.",
    "subtitle": "Quyosh botishidan yulduzlargacha har bir lahzada sen bilan bitta kelajakni orzu qilaman.",
    "action": "Osmonga qarash",
    "introType": "sky",
    "scenes": [
      "dusk",
      "stars",
      "dreams",
      "proposal"
    ],
    "accent": "#cbb5c3",
    "dark": true,
    "defaultNote": "Uch yulduz, uch orzu, bir umrga atalgan bir savol.",
    "finalQuestion": "Kelajagimizni birga quramizmi?",
    "yes": "Ha ♡",
    "later": "Birga gaplashaylik",
    "caption": [
      "Birga",
      "Ishonch",
      "Abadiy"
    ]
  }
];
export const BY_KEY=Object.fromEntries(TEMPLATES.map(t=>[t.key,t]));
export const GROUPS={love:{name:'Sevgi izhori',label:'LOVE STORIES'},wedding:{name:'To‘y taklifnomasi',label:'WEDDING'},birthday:{name:'Tug‘ilgan kun',label:'BIRTHDAY'},apology:{name:'Uzr so‘rash',label:'APOLOGY'},proposal:{name:'Turmush taklifi',label:'PROPOSAL'}};
