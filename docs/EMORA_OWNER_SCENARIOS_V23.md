# EMORA · АСЛ СЦЕНАРИЙЛАР — owner-approved product contract

**Priority:** EXACTLY ONE polished, story-driven experience per direction in the first release. Prior 15-demo catalog is legacy and must not be presented as 15 finished flagships. Three user-facing languages: UZ / RU / EN. All copy must sound spontaneous, playful, emotionally warm and natural; no stiff/literary clichés. All stories are mobile-first, personalized with the recipient's photographs, video and optional music, and require creator preview before payment. The sender may edit copy.

## 1. Birthday — cake, candle ritual, name-heart finale

1. Open with a date-picker question, literally **«Туғилган кунинг қачон?»** in the selected language.
2. Only after selecting the date, start the personalized experience and try the chosen music after the visitor gesture; expose music toggle for platform autoplay restrictions.
3. Interactive 3D-feel birthday cake with individually extinguishable candles; one tap per candle.
4. New scene: private pictures of the birthday girl, **a different playful compliment for each picture**; photo slots are positional, never merge/reorder when one is missing.
5. New scene: personal video with honest optional/empty state.
6. New scene: sealed envelope to tap open, personalized warm/flirty birthday letter.
7. Final scene: repeatedly rendered recipient name visually composes a **heart**. Drag a visible horizontal slider **to the right** to reveal the recipient photo **inside the heart**. Finish with named playful copy featuring «133 848 383» as an expressive figure, not as a false rendering count.
8. Support mobile touch, desktop keyboard, replay, reduced-motion, portrait from creator Studio, UZ/RU/EN personalized copy.

**Implementation:** V19 has scenes 1–6; V23 adds real canvas text-heart and reveal slider. Mobile landscape/portrait QA required.

## 2. Apology — secret answer, teasing button, letter, Telegram meeting

1. Entry password question **«Мой любимый десерт?»** (naturally translated) and enigmatic clue (NOT the answer). The correct answer is the recipient's **name**, case-insensitive and tolerant of spaces. A wrong answer gets a playful retry; **do not reveal it directly**.
2. Ask **«Мендан ҳали ҳам хафамисан?»** with two answers in user-specified order. Playful escaping «Йўқ» (No) when being tapped, while maintaining a respectful and accessible exit/skip; don't trap anyone into consent.
3. Envelope opens on tap, starts with small joke about the earlier button, then honestly accepts fault, apologizes, promises effort and compliments the girl. Avoid pressuring her to forgive.
4. Ask **«Кечирдинг, энди қачон кўришамиз?»**; choose restaurant / walk / coffee, then date and time.
5. Deliver all chosen details to sender through a **configured Telegram bot/backend or explicitly user-confirmed share**, never assume a `t.me/` username link prepopulates a direct chat. Only after recipient intentionally submits, and display privacy notice.

## 3. Love confession — who am I, photos, video, letter, name-heart

1. Opening **«Ман сан учун кимман?»** → «Никто» / «Друг» (UZ/RU/EN equivalent).
2. Personalized recipient photographs with **a distinct playful compliment/confession by each**.
3. Personal video scene.
4. Tap to unseal letter; text starts «Ҳа, ҳозир сан учун ҳеч кимдирман, лекин…» and moves to authentic confession, respecting whatever option was selected.
5. Heart generated from repeated recipient name; slider-to-photo finale, like birthday but with separate artistic tone.

## 4. Marriage proposal — secret answer, timer, ring, location

1. Question **«Мани энг яхши кўрган десертим?»**; correct answer = girl's name, with a riddle clue that doesn't give it away.
2. Her photos with individual compliments/flirt; then private video.
3. Animated envelope and love letter; starts with **date first met** and accurately computed **years, months, days** in recipient timezone, not hard-coded approximate arithmetic. Proposes spending life together.
4. An impressive interactive ring box animation; wording **«Бунақа қарорни албатта кўришиб гаплашиб ҳал қиламиз…»** — do not treat tapping the ring as legal or emotional acceptance.
5. Select location and meeting day/time; send details to sender through configured Telegram bot after explicit recipient submission. No location permission without user action.

## 5. Wedding invitation — original cinematic invitation

- Study provided inspirations **e-invitation.uz** and **etaklifpro.uz** and follow proven invitation utility: invitation intro, animated letter, photo/video/music, wedding day/time, venue & map, programme, names, RSVP, private guest-link personalization.
- Premium original 3D cinematic visual language, no copying competitor assets/animations verbatim.
- Mobile layout, UZ/RU/EN labels and localized date/time; opt-in music only after user gesture.

## Strict release rules

- No real provider payment without Click/Payme sandbox callback/idempotency verification.
- Do not publish private uploaded media until payment-confirmed finalization.
- Maintain backwards compatibility for already paid guest links through versioned experience mapping.
- Every direction must pass scenario-specific mobile Playwright checks plus human iOS Safari/Android review.
- **Do not describe unfinished functionality as shipped.** Technical demo screenshots and tests prove only the code path they actually checked.
