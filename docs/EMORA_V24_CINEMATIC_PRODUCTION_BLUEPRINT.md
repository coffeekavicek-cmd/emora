# EMORA — Celamur-level original cinematic production blueprint (V24)

**Owner-approved concept:** 5 directions × **one premium flagship per direction**, rather than presenting 15 legacy pages as the product. Creative inspiration means polished *pacing*, immersive scenes, 3D-feel objects, tactile gestures, audio, intimacy; do **not** reproduce Celamur illustrations/code/assets or clone its layout. Mobile 360–430px first, tablet/desktop second. Uzbek (conversational Tashkent), Russian (native casual), English (natural) throughout. Flirt warmly with recipient consent and personalization; never pressure a “yes”.

## Global experience engine and acceptance standard

Every scene has (1) visual hook, (2) maximum ~two short paragraphs, (3) one meaningful interaction, (4) exit/continue, (5) one cinematic transition. Scene controls meet 44px touch targets; high-quality visuals at mobile widths; keyboard and reduced-motion fallback. Audio begins only after a user gesture. Content fields from Studio use same-origin preview messaging; guest pages load server-confirmed published media only. All five accept creator photos, optional video, background music and authored letter; no broken or silently autoplaying media.

**Visual language:** aubergine/pink-blush for apology; warm candlelight/cream for birthday; midnight plum and ruby for love confession; champagne/burgundy for proposal; silk ivory/gold for wedding. Shared quality standards, **different identity and motion vocabulary for each story**. All templates remain meaningfully different even without user-uploaded media.

**Backend:** Creator preview → draft saving → owner-bound checkout → verified Click/Payme webhook → versioned published guest link. Telegram booking receipt should be sent by a dedicated, authenticated backend bot after user confirms; until bot configured, **open Telegram share composer** with prefilled text and explicitly ask recipient to send. No claim of automatic transmission. Do not expose unapproved guest location or customer photos.

## Story 1 — Birthday (flagship implemented V19/V23; refinement ongoing)

1. DATE: “Туғилган кунинг қачон?” with date picker.
2. CAKE: after interaction, music; one visually distinct candle extinguishes per tap, smoke/glow and progress; stage unlocks after all candles.
3. GALLERY: each of three images gets its own playful, **different** caption and subtle parallax; never shifts image/caption slots.
4. FILM: private optional video with manual playback; skip available.
5. ENVELOPE: realistic wax seal, opening flap, sliding letter, personal text from sender.
6. REVEAL: actual recipient-name text renders heart. Horizontal slider moves right to reveal recipient photo inside text-heart; “133 848 383” is poetic caption, **not falsely claimed literal render count**. Restart resets progress and stops media.

**Visual test:** test at 360,390,430,768,1440; keyboard slider, image fallback, no layout overflow, fallback without media.

## Story 2 — Apology (new V24 flagship in progress)

1. SECRET: “Мой любимый десерт?” answer = personalized recipient name. Private clue is affectionate riddle without direct name reveal. Wrong entry gets playful retry. Not a security/authentication boundary.
2. YES/NO: “Мендан ҳали ҳам хафамисан?” Two decisions; “Йўқ” dodges pointer/tap as a light joke; **always retain an accessible option to leave**. Don't claim that tapping “Ҳа” means forgiveness.
3. LETTER: wax-sealed envelope opens on tap; short teasing joke, direct sincere admission of error, promise to change, gentle compliment. Optional private photos and video with explicit play. Honor creator's authored UZ/RU/EN versions.
4. MEETING: restaurant / walk / coffee → future date → exact time → recipient intentionally shares confirmation. Automatic direct bot delivery only after backend bot and privacy gates. Preserve messages for preview, never actually post to Telegram without intent.

**UI quality tests:** secret wrong/right, escaping button accessible alternative, opening letter, language switching, photo/video fallbacks, date validation, Telegram share URL content, no unrequested send, no horizontal scroll.

## Story 3 — Love confession (next engineering milestone)

1. “Ман сан учун кимман?” → “Никто” and “Друг” (localized to RU/UZ/EN).
2. Recipient photos arrive as portrait fragments with **separate** natural flirting by image.
3. Private video scene (preview/manual play) then immersive envelope opens.
4. Confession begins “Ҳа, ҳозир сан учун ҳеч кимдирман, лекин…” as appropriate to the first response; never demand reciprocation.
5. Thousands of actual recipient-name text strokes form a heart and reveal the girl's photo through swipe; reuse V23 heart renderer module with new ruby/purple staging, but no identical full-page scene design.

## Story 4 — Marriage proposal (next engineering milestone)

1. Mystery “Мани энг яхши кўрган десертим?” secret-answer recipient name and unique riddle clue.
2. Photo sequence with flattering, varied captions → optional personal video.
3. Tactile real letter: “Сени 09.09.2026 дан бери танийман…” plus **correct calendar-based years/months/days**, not simple milliseconds divided by months.
4. Cinematic ring box opens, metal/glass-light reflections with device-responsible quality. Ask about a future together but add “Буни албатта кўришиб гаплашиб ҳал қиламиз…”; a tap is **not binding consent**.
5. Recipient chooses place (map with manual fallback) + date + time, confirms before configured Telegram bot sends to sender; current share-composer fallback must be clearly labeled.

## Story 5 — Wedding invitation (next engineering milestone)

1. Cinematic personal silk reveal, custom names and welcome.
2. Premium interactive letter and photo story.
3. Video/music with user gesture, responsive ceremony countdown.
4. Localized wedding date, start time, address, interactive map opening on explicit choice.
5. Programme details and RSVP: guest identity, attendance and optional message; backend checks ownership and invitation token.
6. Wedding personalized guest share link/QR, an elegant closing. Inspiration from owner-provided e-invitation.uz and etaklifpro.uz must remain original, with licensed/user-provided media only.

## Production readiness and definition of done

- Each of five flagship journeys has scene-by-scene Playwright mobile + desktop flow with saved screenshot artifacts, **plus manual iPhone Safari and Android Chrome visual checks**.
- Creator Studio fields actually populate every recipient scene, including RU/EN per-language authored copy.
- All code, assets, and payment gates are authenticated; no public raw video/photo URLs until owner-approved publication.
- All public URL versions preserve prior experiences; do not silently repoint purchased links.
- Bot delivery requires test bot credentials and test receiver ID configured server-side (not in frontend; never user private tokens in chat).
- Payment integration can only be called production-ready after a real provider sandbox handshake, webhook signature verification, replay/idempotency and failure retry tests.
- Document gaps as gaps; never call an incomplete experience “ideal/finished”.
