# EMORA Experience Engine

A clean-room interactive engine for EMORA's next generation of single-screen emotional experiences.

## Galaxy Confession V1

The first gold-standard experience is built as a real-time canvas ritual instead of a scrolling HTML page:

1. cinematic intro
2. draggable/inertial galaxy
3. three interactive stars
4. three personal message reveals
5. galaxy particles morph into an uploaded portrait
6. portrait explodes into the emotional finale

No page scrolling is used.

## Stack

- React 19
- Vite 8
- PixiJS 8 (WebGL canvas)
- GSAP 3

## Personalization query params

- name
- intro
- m1, m2, m3
- final

The portrait is selected locally in the experience. The image is sampled in-browser and is not uploaded by this prototype.

## Local development

npm install
npm run dev

Production validation:

npm run build

## Preview

This branch is deployed as an isolated Railway preview service. Production EMORA remains untouched.

## All 15 ritual preview

This branch expands the engine to all fifteen EMORA experiences with a no-scroll, interaction-first architecture.

## Benchmark V2

Pearl Linen now runs as a dedicated flagship ritual informed by the public interaction patterns of e-invitation.uz, etaklifpro.uz and celamur.com. The remaining experiences inherit upgraded artwork layers and finale transforms; see BENCHMARK.md for the quality gate.

## Pearl storyboard motion

Pearl Linen now follows the approved six-frame Figma storyboard as one continuous material transition: handwriting → seal fracture → letter rise → ink reveal → draggable polaroids → particle portrait.
