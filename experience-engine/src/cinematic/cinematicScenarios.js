export const CINEMATIC_SCENARIOS={
'love-rose':{
 title:'Rose Theatre',
 beats:[
  {id:'cold-open',label:'00',type:'opening',copy:'Qorong‘i sahna. Faqat bitta nafas va parda ortidagi yorug‘lik.'},
  {id:'curtain',label:'01',type:'gesture',gesture:'drag-curtain',copy:'Pardani ikki barmoq bilan oching.'},
  {id:'spotlight',label:'02',type:'reveal',copy:'Spotlight ostida ism qo‘lda yoziladi, atirgul yaproqlari sahnaga tushadi.'},
  {id:'film',label:'03',type:'memory',copy:'Uchta xotira 35mm kadrlar kabi ketma-ket yonadi.'},
  {id:'rose-choice',label:'04',type:'gesture',gesture:'pluck-petal',copy:'Bitta yaproqni ushlab torting — u yashirin gapni ochadi.'},
  {id:'false-end',label:'05',type:'turn',copy:'Sahna qorong‘ilashadi. Go‘yo tugagandek.'},
  {id:'finale',label:'06',type:'finale',copy:'Parda qayta ochiladi: barcha yaproqlar bitta portret/ism konturiga yig‘iladi.'},
  {id:'afterglow',label:'07',type:'afterglow',copy:'Yorug‘lik pasayadi, final jumla va “yana ko‘rish” qoladi.'}
 ],
 secondary:'pluck-petal',finale:'petal-portrait'
},
'love-pearl':{
 title:'Pearl Linen',
 beats:[
  {id:'arrival',label:'00',type:'opening',copy:'Linen stol sokin turadi; recipient ismi qo‘lda yozilib, yopiq konvert nafas olgandek juda mayin harakat qiladi.'},
  {id:'seal',label:'01',type:'gesture',gesture:'hold-seal',copy:'Muhrning o‘zini 520ms bosib ushlang — WebGL wax fizik bo‘laklarga sinadi, haptic va crack faqat gesture’dan keyin keladi.'},
  {id:'paper-rise',label:'02',type:'transition',copy:'Kesish yo‘q: aynan shu qog‘oz konvertdan chiqib, kamera tomon ko‘tarilib xatga aylanadi.'},
  {id:'live-ink',label:'03',type:'reveal',copy:'Uch paragraf avtomatik dump bo‘lmaydi; har biri siyoh tolalarga singgandek paydo bo‘ladi va keyingisini recipient o‘zi chaqiradi.'},
  {id:'memories',label:'04',type:'gesture',gesture:'drag-memories',copy:'Faqat birinchi polaroid tushadi; unga tegish/drag ikkinchisini, ikkinchisi uchinchisini ochadi. Stol xotira kompozitsiyasiga aylanadi.'},
  {id:'afterword',label:'05',type:'turn',copy:'Uchala xotira joyiga tushgach sahna sokinlashadi. Toza teskari qog‘oz: “Yana bitta narsa bor.” Markazda bitta marvarid.'},
  {id:'pearl-finale',label:'06',type:'finale',gesture:'hold-final-pearl',copy:'Marvaridni 900ms ushlash qog‘oz dunyosini yo‘qotadi; real render qilinayotgan nuqtalar sanalib, portret yoki fallback yurakka yig‘iladi.'},
  {id:'afterglow',label:'07',type:'afterglow',copy:'Portret ostida final jumla va qo‘lda yozilgan ism qoladi; shundan keyingina ulashish, keepsake va replay paydo bo‘ladi.'}
 ],
 secondary:'hold-final-pearl',finale:'pearl-particle-portrait'
},
'love-galaxy':{
 title:'Galaxy Confession',
 beats:[
  {id:'void',label:'00',type:'opening',copy:'Qorong‘i bo‘shliq; yulduzlar bittadan uyg‘onadi.'},
  {id:'orbit',label:'01',type:'gesture',gesture:'drag-galaxy',copy:'Galaktikani barmoq bilan aylantiring.'},
  {id:'three-stars',label:'02',type:'reveal',copy:'Uch yorqin yulduz ichida uchta shaxsiy gap yashiringan.'},
  {id:'lock',label:'03',type:'gesture',gesture:'hold-center',copy:'Uch nuqta ochilgach markazni bosib ushlab turing.'},
  {id:'collapse',label:'04',type:'turn',copy:'Butun galaktika ichkariga tortiladi va belgilar foto konturiga yo‘l oladi.'},
  {id:'portrait',label:'05',type:'finale',copy:'Minglab nuqta/heart recipient portretiga yig‘iladi.'},
  {id:'silence',label:'06',type:'turn',copy:'Portret parchalanadi va ekran bir lahza qorayadi.'},
  {id:'afterglow',label:'07',type:'afterglow',copy:'Final jumla va qo‘lda yozilgan ism qoladi.'}
 ],secondary:'hold-center',finale:'particle-portrait'
},
'wedding-silk':{
 title:'Silk Heritage',
 beats:[
  {id:'thread',label:'00',type:'opening',copy:'Qora fon ustida oltin ip birinchi ornamentni tikadi.'},
  {id:'unfold',label:'01',type:'gesture',gesture:'pull-silk',copy:'Ipak qatlamini barmoq bilan chetga suring.'},
  {id:'names',label:'02',type:'reveal',copy:'Ikki ism ipak tolalari orasidan paydo bo‘ladi.'},
  {id:'date',label:'03',type:'memory',copy:'Sana oltin ip bilan tikilgandek yoziladi.'},
  {id:'knot',label:'04',type:'gesture',gesture:'tie-knot',copy:'Ikki ip uchini birlashtiring.'},
  {id:'blessing',label:'05',type:'turn',copy:'Tugun bog‘langach naqsh butun ekran bo‘ylab yoyiladi.'},
  {id:'invitation',label:'06',type:'finale',copy:'Naqsh markazidan to‘liq taklifnoma ochiladi.'},
  {id:'afterglow',label:'07',type:'afterglow',copy:'Yengil ipak harakati ostida venue va sana qoladi.'}
 ],secondary:'tie-knot',finale:'embroidered-invite'
},
'wedding-garden':{
 title:'Night Garden',
 beats:[
  {id:'dark-garden',label:'00',type:'opening',copy:'Bog‘ qorong‘i; faqat oy va shamol tovushi.'},
  {id:'lanterns',label:'01',type:'gesture',gesture:'light-three',copy:'Uchta fonarni alohida yoqing.'},
  {id:'fireflies',label:'02',type:'reveal',copy:'Har chiroq bilan firefly swarm ismning bir qismini chizadi.'},
  {id:'path',label:'03',type:'memory',copy:'Yorug‘ yo‘l bo‘ylab uch xotira gullar orasida ochiladi.'},
  {id:'gate',label:'04',type:'gesture',gesture:'open-gate',copy:'Bog‘ darvozasini ikki tomonga suring.'},
  {id:'bloom',label:'05',type:'turn',copy:'Darvoza ortida butun bog‘ birdan gullaydi.'},
  {id:'invite',label:'06',type:'finale',copy:'Gullar markazda taklifnoma ramkasini hosil qiladi.'},
  {id:'night',label:'07',type:'afterglow',copy:'Bog‘ yana sokinlashadi, faqat chiroqlar qoladi.'}
 ],secondary:'open-gate',finale:'garden-bloom'
},
'wedding-naqsh':{
 title:'Heritage Naqsh',
 beats:[
  {id:'single-dot',label:'00',type:'opening',copy:'Bitta oltin nuqta puls qiladi.'},
  {id:'trace',label:'01',type:'gesture',gesture:'trace-pattern',copy:'Barmoq bilan yo‘lni chizing; chiziq sizning gesture’ingizni kuzatadi.'},
  {id:'geometry',label:'02',type:'reveal',copy:'Chizilgan chiziqlar geometrik naqshga aylanadi.'},
  {id:'names',label:'03',type:'memory',copy:'Naqsh bo‘laklari ikki ismni navbat bilan ochadi.'},
  {id:'rotate',label:'04',type:'gesture',gesture:'rotate-medallion',copy:'Markaziy medalyonni aylantiring.'},
  {id:'lock',label:'05',type:'turn',copy:'To‘g‘ri burchakka kelganda naqsh “qulflanadi”.'},
  {id:'gold-burst',label:'06',type:'finale',copy:'Butun ornament oltin nurga aylanib to‘liq marosim kartasini ochadi.'},
  {id:'seal',label:'07',type:'afterglow',copy:'Naqsh sekin nafas oladi; venue/map CTA qoladi.'}
 ],secondary:'rotate-medallion',finale:'gold-pattern-burst'
},
'birthday-aurora':{
 title:'Aurora Paper',
 beats:[
  {id:'night-box',label:'00',type:'opening',copy:'Qorong‘i quti ichidan aurora nuri sizib chiqadi.'},
  {id:'ribbon',label:'01',type:'gesture',gesture:'untie-ribbon',copy:'Lentani barmoq bilan yeching.'},
  {id:'layers',label:'02',type:'reveal',copy:'Quti bir emas, uch qog‘oz qatlamiga ajraladi.'},
  {id:'wishes',label:'03',type:'memory',copy:'Har qatlam ostida bitta xotira/tilak.'},
  {id:'tear',label:'04',type:'gesture',gesture:'tear-paper',copy:'Oxirgi qog‘ozni chiziq bo‘ylab “yirting”.'},
  {id:'aurora',label:'05',type:'turn',copy:'Yirtiq ichidan aurora butun ekran bo‘ylab chiqadi.'},
  {id:'confetti',label:'06',type:'finale',copy:'Aurora ranglari confetti va recipient ismiga yig‘iladi.'},
  {id:'cake-glow',label:'07',type:'afterglow',copy:'Final tilak yengil shimmer bilan qoladi.'}
 ],secondary:'tear-paper',finale:'aurora-confetti'
},
'birthday-balloon':{
 title:'Balloon Dream',
 beats:[
  {id:'room',label:'00',type:'opening',copy:'Bo‘sh xona; shiftga bog‘langan sharlar silkinadi.'},
  {id:'release',label:'01',type:'gesture',gesture:'cut-strings',copy:'Uch ipni alohida uzing.'},
  {id:'messages',label:'02',type:'reveal',copy:'Har shar ko‘tarilganda pastidan yashirin tilak chiqadi.'},
  {id:'photo-balloon',label:'03',type:'memory',copy:'Bitta katta shar ichida foto paydo bo‘ladi.'},
  {id:'hold-pop',label:'04',type:'gesture',gesture:'hold-pop',copy:'Katta sharni bosib ushlab turing.'},
  {id:'silence',label:'05',type:'turn',copy:'Shar yoriladi — yarim soniya mutlaq jimlik.'},
  {id:'sky',label:'06',type:'finale',copy:'Portlash bo‘laklari osmonga chiqib ism + confetti yozadi.'},
  {id:'float',label:'07',type:'afterglow',copy:'Mayda sharlar fon bo‘ylab uchishda davom etadi.'}
 ],secondary:'hold-pop',finale:'balloon-sky'
},
'birthday-memory':{
 title:'Memory Reel',
 beats:[
  {id:'leader',label:'00',type:'opening',copy:'Film countdown 3…2…1 va projector flicker.'},
  {id:'spin',label:'01',type:'gesture',gesture:'spin-reel',copy:'Reelni barmoq bilan aylantiring.'},
  {id:'frames',label:'02',type:'reveal',copy:'Aylanish tezligiga qarab uchta foto frame oldinga keladi.'},
  {id:'scrub',label:'03',type:'memory',copy:'Filmni chap-o‘ng scrub qilib xotiralarni ko‘ring.'},
  {id:'burn',label:'04',type:'gesture',gesture:'hold-frame',copy:'Sevimli kadrni bosib ushlab turing.'},
  {id:'film-burn',label:'05',type:'turn',copy:'Kadr chetidan film burn boshlanadi.'},
  {id:'new-reel',label:'06',type:'finale',copy:'Burn ortidan “next year / next chapter” yangi reel paydo bo‘ladi.'},
  {id:'credits',label:'07',type:'afterglow',copy:'Final tilak credits kabi sekin yuradi.'}
 ],secondary:'hold-frame',finale:'film-burn-next-chapter'
},
'apology-rain':{
 title:'After Rain',
 beats:[
  {id:'storm',label:'00',type:'opening',copy:'Oynaga kuchli yomg‘ir uradi; tashqarida tasvir xira.'},
  {id:'wipe',label:'01',type:'gesture',gesture:'wipe-glass',copy:'Barmoq bilan oynani artib birinchi gapni oching.'},
  {id:'fog',label:'02',type:'reveal',copy:'Artgan joyingiz yana bug‘lanadi va ikkinchi gap yoziladi.'},
  {id:'drops',label:'03',type:'memory',copy:'Uch yirik tomchi ichida xotira fragmentlari.'},
  {id:'trace-heart',label:'04',type:'gesture',gesture:'trace-on-glass',copy:'Bug‘langan oynaga belgi/harf chizing.'},
  {id:'rain-stop',label:'05',type:'turn',copy:'Chizish tugashi bilan yomg‘ir birdan to‘xtaydi.'},
  {id:'sunbreak',label:'06',type:'finale',copy:'Bulut orasidan yorug‘lik kiradi va final uzr to‘liq o‘qiladi.'},
  {id:'droplets',label:'07',type:'afterglow',copy:'Faqat sekin oqayotgan tomchilar qoladi.'}
 ],secondary:'trace-on-glass',finale:'sunbreak'
},
'apology-ink':{
 title:'Ink of Regret',
 beats:[
  {id:'blank',label:'00',type:'opening',copy:'Bo‘sh qog‘oz. Faqat bitta qora tomchi.'},
  {id:'drop',label:'01',type:'gesture',gesture:'tap-ink',copy:'Tomchiga teging — siyoh qog‘oz tolalari bo‘ylab yuradi.'},
  {id:'sentence',label:'02',type:'reveal',copy:'Siyoh birinchi jumlani o‘zi yozadi.'},
  {id:'crossout',label:'03',type:'memory',copy:'Keyingi gap paydo bo‘ladi, so‘ng ayrim so‘zlar chizib tashlanadi.'},
  {id:'rewrite',label:'04',type:'gesture',gesture:'drag-nib',copy:'Pero uchini sudrab, to‘g‘ri gapni qayta yozing.'},
  {id:'spill',label:'05',type:'turn',copy:'Siyoh to‘kiladi va hamma matnni bir lahza yopib yuboradi.'},
  {id:'negative-space',label:'06',type:'finale',copy:'Siyoh chekinadi; oq negative-space ichida final uzr qoladi.'},
  {id:'dry',label:'07',type:'afterglow',copy:'Qog‘oz quriydi, imzo sekin paydo bo‘ladi.'}
 ],secondary:'drag-nib',finale:'ink-negative-space'
},
'apology-quiet':{
 title:'Quiet Room',
 beats:[
  {id:'blackout',label:'00',type:'opening',copy:'Ekran deyarli qora. Faqat xona ambiens.'},
  {id:'chain',label:'01',type:'gesture',gesture:'pull-chain',copy:'Chiroq zanjirini torting.'},
  {id:'pool',label:'02',type:'reveal',copy:'Yorug‘ doira ichida stol va bitta yopiq xat ko‘rinadi.'},
  {id:'listen',label:'03',type:'memory',copy:'Uch qisqa jumla navbat bilan o‘qiladi; oralig‘ida jimlik saqlanadi.'},
  {id:'dim',label:'04',type:'transition',copy:'Gaplar o‘qilgach yorug‘lik o‘zi sekin chekinadi; recipientdan ikkinchi gesture talab qilinmaydi.'},
  {id:'dark-again',label:'05',type:'turn',copy:'Chiroq o‘chadi — faqat qog‘ozdagi bir satr fosfor kabi qoladi.'},
  {id:'warm-return',label:'06',type:'finale',copy:'Chiroq iliq rangda qayta yonadi va final uzr paydo bo‘ladi.'},
  {id:'room-tone',label:'07',type:'afterglow',copy:'Hech narsa qimirlamaydi; faqat yengil xona tovushi.'}
 ],secondary:'pull-chain',finale:'warm-return'
},
'proposal-pearl':{
 title:'Pearl Promise',
 beats:[
  {id:'table',label:'00',type:'opening',copy:'Qorong‘i stol, faqat quti konturi.'},
  {id:'hold',label:'01',type:'gesture',gesture:'hold-box',copy:'Qutini bosib ushlab turing; yurak urish ritmi kuchayadi.'},
  {id:'open',label:'02',type:'reveal',copy:'Qopqoq sekin ochilib ring light yuzga uradi.'},
  {id:'memories',label:'03',type:'memory',copy:'Uzuk refleksida uchta xotira flash bo‘ladi.'},
  {id:'rotate',label:'04',type:'gesture',gesture:'rotate-ring',copy:'Uzukni 360° aylantiring.'},
  {id:'engraving',label:'05',type:'turn',copy:'Ichki gravirovka ko‘rinadi — recipient ismi yoki sana.'},
  {id:'question',label:'06',type:'finale',copy:'Ring light butun ekranni oq qiladi va savol paydo bo‘ladi.'},
  {id:'heartbeat',label:'07',type:'afterglow',copy:'Savol ostida juda sekin pulse qoladi.'}
 ],secondary:'rotate-ring',finale:'whiteout-question'
},
'proposal-cinema':{
 title:'Cinema Proposal',
 beats:[
  {id:'theatre',label:'00',type:'opening',copy:'Bo‘sh kinozal, projector motor ovozi.'},
  {id:'switch',label:'01',type:'gesture',gesture:'switch-projector',copy:'Proyektorni yoqing.'},
  {id:'leader',label:'02',type:'reveal',copy:'Film leader va title card: “Bizning hikoya”.'},
  {id:'montage',label:'03',type:'memory',copy:'Uch xotira 24fps montage kabi o‘tadi.'},
  {id:'scrub',label:'04',type:'gesture',gesture:'scrub-film',copy:'Film lentasini sudrab keyingi kadrni toping.'},
  {id:'jam',label:'05',type:'turn',copy:'Lenta “tiqilib” qoladi va ekran kuyayotgandek oq dog‘ paydo bo‘ladi.'},
  {id:'question',label:'06',type:'finale',copy:'Burn transition ortidan faqat final savol qoladi.'},
  {id:'credits',label:'07',type:'afterglow',copy:'Pastda “to be continued?” credits chiqadi.'}
 ],secondary:'scrub-film',finale:'film-burn-question'
},
'proposal-sky':{
 title:'Sky Promise',
 beats:[
  {id:'night',label:'00',type:'opening',copy:'Real vaqtga o‘xshash yulduzli tun; osmon sekin nafas oladi.'},
  {id:'constellation',label:'01',type:'gesture',gesture:'connect-stars',copy:'Uch yulduzni chiziq bilan ulang.'},
  {id:'name',label:'02',type:'reveal',copy:'Constellation recipient ismining bosh harfiga aylanadi.'},
  {id:'wishes',label:'03',type:'memory',copy:'Uch shooting star — uch xotira.'},
  {id:'horizon',label:'04',type:'gesture',gesture:'drag-horizon',copy:'Ufqqa barmoq bilan yuqoriga suring.'},
  {id:'dawn',label:'05',type:'turn',copy:'Tun real gradient bilan tongga aylanadi.'},
  {id:'sun',label:'06',type:'finale',copy:'Quyosh chiqishi ichida final savol paydo bo‘ladi.'},
  {id:'daybreak',label:'07',type:'afterglow',copy:'Yangi kun ranglari va ism qoladi.'}
 ],secondary:'drag-horizon',finale:'dawn-question'
}
};
