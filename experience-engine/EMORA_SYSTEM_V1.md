# EMORA Ideal Experience System V1

## Goal

EMORA must stop behaving like a catalog of recolored web templates.

The product is an **experience atelier**: every template chooses the correct medium, navigation model, interaction depth, and functional invitation blocks for its idea.

The system is based on public product patterns studied from:

- https://e-invitation.uz/
- https://etaklifpro.uz/
- https://celamur.com/

We borrow product principles, not visual copies.

---

## 1. What the competitors prove

### e-invitation — art direction decides the format

Observed public patterns:

- Manor uses hand-drawn botanical watercolor, aged parchment, and scroll-based unfolding like pages of a poetry book.
- Islamic uses a living star canvas, Islamic geometry, gold/emerald styling, live animation and music.
- Osh deliberately puts essential information on one screen with restrained ivory/gold composition.
- The platform supports personal guest greetings, live preview, music, permanent share links, named guest links and edit-before-payment flows.
- Their Love Story product treats story sequence and animation style as custom creative direction instead of forcing one reusable web template.

**Lesson:** not every premium invitation should be a ritual and not every premium invitation should avoid scrolling. The visual metaphor chooses the navigation.

### etaklif Pro — format identity must be obvious

Public catalog examples include:

- opening flower card
- falling flower composition
- polaroid scrapbook / photos on rope
- rose wall + scroll opening
- cloud opening + luminous landscape + glass cards
- suzani / zardozi national composition
- star sky + wish + music
- watercolor garden + birds + seal
- seal + flowers
- slideshow with photos/music/text
- cinema/disc/music
- photo watercolor gallery
- luxe seal + map + card
- cinematic gold style

The product also advertises mobile-first rendering, live animation, music, RSVP, QR/share links, quick browser editing and view statistics.

**Lesson:** a template must be recognizable by mechanism, not just color.

### Celamur — one ritual can be deeper than eight scenes

Public patterns:

- handwritten recipient name
- wax seal fractures into pieces with tactile feedback
- text appears paragraph by paragraph like live ink
- up to three handwritten-caption polaroids live naturally inside the letter
- final portrait is constructed from thousands of hearts or repeated names
- custom music, opening timer, word lock, answer/share/save functions
- opening and response events can notify the creator
- the experience is intentionally short: one link, one small ritual, one screenshot-worthy payoff

**Lesson:** fewer beats with excellent physical continuity beats a generic multi-step slideshow.

---

## 2. New EMORA rule: templates do not share one narrative skeleton

A template chooses **one of six experience archetypes**.

### A. Ritual Object

A single physical object is the story.

Examples:
- Pearl Linen
- Pearl Promise
- Ink of Regret
- After Rain

Rules:
- 1 hero object
- 1–3 meaningful gestures maximum
- no generic cards
- continuous material transition
- strong tactile/sound response
- 20–60 second target experience
- screenshot-worthy finale

### B. Living World

The environment itself is interactive.

Examples:
- Galaxy Confession
- Night Garden
- Sky Promise

Rules:
- full-screen canvas/WebGL world
- user manipulates the environment, not UI controls
- discoveries are spatial
- text is subordinate to the world
- finale must transform the whole world

### C. Editorial Story

The page is a designed publication.

Examples:
- Silk Heritage
- Heritage Naqsh
- selected wedding/editorial designs

Rules:
- scrolling or paginated reading is allowed when the material metaphor requires it
- typography and illustration carry the experience
- animation is restrained
- sections unfold like paper/book/textile, not app cards
- functional details are integrated into the editorial composition

### D. Cinematic Memory

Photos, music, and time are the medium.

Examples:
- Memory Reel
- Cinema Proposal
- future Love Story templates

Rules:
- time-based sequence
- media is primary
- film/projector/reel/slideshow metaphor remains consistent
- user may scrub, pause, replay, or choose a frame
- no unrelated particle effects

### E. Formal One-Screen

Restraint is the premium feature.

Examples:
- future Osh / nikah / formal event designs
- Quiet Room can borrow this discipline

Rules:
- one decisive composition
- essential information visible immediately
- minimal motion
- impeccable spacing, typography and ornament
- no interaction added only to look “interactive”

### F. Atmospheric Minimal

Emotion comes from one environmental change.

Examples:
- Quiet Room
- some apology / thank-you experiences

Rules:
- one strong atmosphere
- one decisive gesture
- silence/lighting/spacing matter more than feature count
- no forced montage or multi-step flow

---

## 3. Every template has an Experience Contract

A template is not HTML.

It is a manifest that declares:

- archetype
- navigation mode
- visual metaphor
- signature moment
- primary media
- interaction budget
- required assets
- personalization fields
- invitation/product features
- performance budget
- accessibility fallback
- finale type

The runtime chooses an engine from this contract.

---

## 4. Navigation is per-template, not global

Allowed modes:

- `single` — one-screen formal composition
- `ritual` — stateful, no document scrolling
- `world` — full-screen canvas/WebGL
- `scroll` — editorial sections when scrolling is part of the metaphor
- `timeline` — cinematic media sequence

No global “all templates must scroll” or “all templates must not scroll” rule.

---

## 5. Interaction budget

Interaction is expensive. It must earn its place.

- Formal One-Screen: 0–1 gestures
- Editorial Story: 0–2 gestures
- Ritual Object: 1–3 gestures
- Atmospheric Minimal: exactly 1 dominant gesture
- Cinematic Memory: 1–3 transport controls
- Living World: continuous direct manipulation + up to 3 discoveries

A gesture must create a **physical consequence**. If removing the gesture changes nothing emotionally, remove it.

---

## 6. Signature-moment rule

Every design must have exactly one clearly describable signature moment.

Good:
- “the wax seal fractures and the same paper rises out of the envelope”
- “fireflies gather into the couple’s names”
- “the film burns through into the proposal question”
- “gold thread finishes the naqsh and reveals the invitation”
- “the rain stops after the user wipes the final line clear”

Bad:
- “nice transitions”
- “particles”
- “parallax”
- “smooth animations”

The signature moment must appear in:
1. gallery preview,
2. live experience,
3. product marketing screenshot/video.

---

## 7. Material continuity rule

Avoid scene cuts that reset the visual world.

Preferred:
envelope → letter → ink → photo → portrait

Avoid:
envelope screen → fade → text card → fade → photo card → fade → finale card

The previous material should physically become, reveal, frame, or cause the next state.

---

## 8. Content model: data is separate from choreography

Shared event data:

- creator
- recipient / guest
- title
- names
- event date/time
- venue
- map location
- main message
- optional paragraphs
- photos
- captions
- music
- RSVP settings
- language
- guest greeting
- share metadata

Template-specific content is declared by the manifest.

The editor renders fields from manifest capabilities instead of hard-coded template forms.

---

## 9. Product layer

### Creation
- choose experience
- instant live preview
- edit content on phone
- save draft
- upload media
- personalize guest link
- publish only when ready

### Guest
- short permanent link
- optional named greeting
- optional word lock / timed opening
- responsive media experience
- RSVP / response
- add-to-calendar / map when relevant
- save/share after finale

### Creator dashboard
- opens/views
- RSVP responses
- personal guest links
- publish state
- media management
- duplicate/remix an experience
- notifications for meaningful events

---

## 10. Visual system

EMORA does **not** have one global template aesthetic.

It has shared craftsmanship rules:

- strong typography pair per experience
- real material textures at controlled resolution
- no generic glass cards unless glass is the metaphor
- no default gradients as decoration
- no rounded SaaS panels inside emotional scenes
- no emoji as final artwork
- no “premium” gold unless supported by the concept
- whitespace is intentional
- photography treatment is template-specific
- ornaments must belong to the culture/material language

Shared brand chrome should disappear during the emotional core when appropriate.

---

## 11. Motion system

Three layers:

### Layer 1 — Object motion
Rive / authored SVG / GSAP
- envelope
- seal
- ribbon
- curtain
- lamp
- ring box
- textile fold
- handwriting

### Layer 2 — Environment
PixiJS / WebGL / Three.js when truly needed
- stars
- rain
- ink particles
- petals
- fireflies
- portrait particles
- atmosphere

### Layer 3 — Choreography
GSAP timelines/state machine
- timing
- continuity
- camera-like moves
- delays/silence
- gesture response
- finale sequencing

CSS is layout/support, not the primary animation authoring system.

---

## 12. Performance budgets

Mobile-first target:

- first useful visual < 1.5s on good 4G target
- lazy-load heavy engines per template
- DPR capped at 1.5–2
- no unnecessary Three.js scenes
- dispose GPU resources on exit
- no huge autoplay video unless the archetype requires it
- user media resized/compressed on upload
- reduced-motion fallback
- test at 390×844 first

---

## 13. Quality gate before a template can be called “ready”

A template fails if any answer below is “no”:

1. Can someone identify the template from one screenshot with the logo removed?
2. Does it have a unique signature moment?
3. Does every interaction change the physical/emotional state?
4. Is its navigation mode justified by the metaphor?
5. Are personalized names/photos/messages native to the composition?
6. Does the functional information remain easy to use?
7. Is the finale stronger than the opening?
8. Does it avoid generic SaaS/card UI inside the emotional core?
9. Does mobile feel authored, not merely scaled down?
10. Does it still make sense with reduced motion?
11. Is it meaningfully different from the other 14 experiences?
12. Would its best frame be worth screenshotting/sharing?

Build success does not equal visual approval.

---

## 14. EMORA 15 — archetype mapping V1

| Template | Archetype | Navigation | Signature moment |
|---|---|---|---|
| Rose Theatre | Ritual Object | ritual | velvet curtain opens into a living theatre/photo reveal |
| Pearl Linen | Ritual Object | ritual | seal fracture → same letter rises → portrait finale |
| Galaxy Confession | Living World | world | galaxy collapses into recipient portrait |
| Silk Heritage | Editorial Story | scroll/paginated | textile unfolds and gold thread reveals names/invite |
| Night Garden | Living World | world | fireflies/lantern light gathers into names |
| Heritage Naqsh | Editorial Story | scroll/paginated | pattern completes into invitation geometry |
| Aurora Paper | Ritual Object | ritual | layered paper/gift tears open into aurora |
| Balloon Dream | Living World | world | balloon field releases memories and final sky message |
| Memory Reel | Cinematic Memory | timeline | chosen film frame burns into next-chapter message |
| After Rain | Atmospheric Minimal | ritual | wiped glass clears as rain stops for final message |
| Ink of Regret | Ritual Object | ritual | ink consumes page then retreats into apology |
| Quiet Room | Atmospheric Minimal | single/ritual | one lamp gesture reveals the entire emotional scene |
| Pearl Promise | Ritual Object | ritual | ring rotation reveals engraving before the question |
| Cinema Proposal | Cinematic Memory | timeline | projector/film burn becomes proposal question |
| Sky Promise | Living World | world | manipulated night horizon becomes dawn + final promise |

This mapping is not permanent. A template may change archetype if the art direction proves a better medium.

---

## 15. Build order

Do not rebuild all 15 at once.

1. Pearl Linen — prove Ritual Object
2. Galaxy Confession — prove Living World
3. Silk Heritage — prove Editorial Story
4. Memory Reel — prove Cinematic Memory
5. Quiet Room — prove Atmospheric Minimal
6. Formal wedding/Osh concept — prove Formal One-Screen

Only after these six reference implementations pass the quality gate should the remaining experiences inherit the system.

---

## 16. Immediate next implementation

Pearl Linen remains the Ritual Object reference.

The next engineering task is to build the **system registry + manifest-driven editor/runtime contract**, while preserving Pearl as the first gold-standard implementation.

No more mass template generation before the system passes visual review.
