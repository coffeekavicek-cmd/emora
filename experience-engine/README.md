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
