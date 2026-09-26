# EMORA V9 · Cinematic Experiences
Seven fully reauthored interactive template pages use a shared accessible cinematic engine:
- Rose Theatre: velvet cinema reveal, animated film strip, memory gallery, personal letter, responsive finale.
- Pearl Linen: delicate 3D paper envelope and quiet romantic editorial typography.
- Silk Heritage: ivory wax-sealed 3D envelope, wedding schedule, live countdown, map and parent RSVP request.
- Night Garden: starlit botanical arch, luxury emerald palette, countdown, guest response.
- Aurora Paper: gift-box reveal, birthday memories and celebratory confetti.
- After Rain: letter behind rain glass, accountable apology, respectful response choices.
- Pearl Promise: jewelry box opening and ring finale.

Implementation: /v5-live/templates/cinematic.css and cinematic.js.
Category-first homepage/editor + Supabase Auth/Publish/Guest RSVP unchanged from V8.
All seven routes are exposed by /v5-live/server.mjs. Separate V9 Railway service; V8 remains undisturbed.

Important: cinematic opening uses browser CSS 3D, not a pre-rendered 3D video. The existing original Runway artwork still uses signed URLs and needs migration to permanent first-party storage before launch. Music/video blocks appear only when explicitly configured. Finale choices outside Wedding are local UI feedback, not a persisted messaging service. The Wedding RSVP itself runs through the published-site guest panel.
