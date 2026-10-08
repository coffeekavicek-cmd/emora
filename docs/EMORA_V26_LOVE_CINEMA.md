# Emora V26 — Original love confession acceptance notes

Owner story: "Ман сан учун кимман?" → nobody/friend → girl photos with distinct flirting → private video → tap to open envelope and personal love confession → thousands of real names drawn into heart, right-drag slider to reveal portrait.

Three languages: natural colloquial UZ/RU/EN. No competitor cloning; cinematic purple/ruby visual identity.

## Implemented
- New original five-scene full-screen experience at v5-live/templates/v26-love-confession.html.
- Separate high-DPI canvas generator at v5-live/templates/v26-love-heart.js. No thousands of DOM nodes.
- Photo, video, music and letter content passed from Studio; music starts only after visitor gesture.
- Sender answers are not coerced; nobody vs friend changes letter opening, optional video can be skipped.
- New creator drafts use experience_version 26; previously published Rose Theatre V10 experiences stay accessible unchanged.

## Verification
- UZ 390px, RU 360px, EN 1440px Playwright story flow + real name-heart and replay.
- Studio personal name, photo caption and UZ/RU/EN letter propagation.
- Existing flagship suite must remain green and manual Safari/Android visual review is still needed.

## Gates
- Click/Payme merchant sandbox, private-media access audit, and human device QA remain unfinished.
- Proposal and wedding scenario rewrites are not complete.
- Preview is sample-only and not a real payment release.