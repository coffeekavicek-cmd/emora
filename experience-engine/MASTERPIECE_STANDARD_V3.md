# EMORA Masterpiece Standard V3

Date: 2026-09-29
Branch: emora-pearl-masterpiece-v3

## Competitive benchmark

### Celamur
Strength to study: emotional interaction dramaturgy. The experience behaves like a ritual rather than a scroll: one meaningful object, a small number of gestures, physical consequence, and a computational/emotional payoff.
EMORA rule: borrow pacing discipline, never artwork, layout, wording, or implementation.

### e-invitation.uz
Strength to study: local art direction, mobile-first creation, clear free-preview -> publish conversion, Uzbek cultural material language, practical invitation details.
EMORA rule: keep local relevance and editing simplicity, but push every template into a distinct cinematic world rather than a decorated page.

### Bliss & Bone
Strength to study: luxury editorial restraint, typography, design consistency, polished creator experience, RSVP/guest utility.
EMORA rule: premium visual restraint must survive inside interactive templates; never let interaction turn into game-like UI.

### Joy / WithJoy
Strength to study: guest utility, connected RSVP, multiple events, privacy, guest-specific visibility, mobile/desktop preview, collaboration.
EMORA rule: emotional front-end and operational back-end must be one product, not separate products.

### Greenvelope
Strength to study: animated envelope as a delivery ritual, strong customization, delivery/open tracking, RSVP, messaging, QR/share flows.
EMORA rule: retain the emotional opening, but make each template's first object and transition language unique.

### Partiful
Strength to study: modern host/guest loop, privacy controls, guest uploads, event activity, tickets/check-in/reminders.
EMORA rule: celebration templates should feel alive after publication, but social utility must stay outside the recipient's emotional ritual.

## Non-negotiable quality bar

Every template MUST pass all 14 gates:
1. One recognizable world/object within the first 1.5 seconds.
2. No generic card UI inside recipient flow.
3. Maximum 3 core gestures.
4. Every gesture has visible physical consequence.
5. Previous state physically becomes the next state.
6. Personalized content is part of the composition, not overlaid text.
7. At least one material simulation: paper, silk, glass, ink, light, film, balloon, sky, metal, flora, etc.
8. 3D/WebGL is used only when it strengthens the metaphor.
9. A false ending / breath before the final emotional payoff.
10. Finale changes the entire scene, not just the text.
11. 390x844 mobile recipient view has zero document scrolling.
12. Reduced-motion fallback exists.
13. Sound/haptic is optional and gesture-driven.
14. Browser QA captures opening, interaction, transition, finale, and console errors.

## Engine policy

- GSAP: choreography, continuity, camera illusion, material transforms.
- PixiJS: particles, living worlds, composited 2D GPU effects.
- Three.js/Spline class engine: only for true hero-object spatial interaction (ring, box, sculptural object) where CSS 3D is insufficient.
- SVG/Rive-style vector motion: thread, ornament, handwriting, delicate mechanisms.
- Canvas shaders: rain, ink diffusion, film burn, fog, glass wipe.
- CSS 3D: envelopes, layered paper, simple textile depth, projector/reel perspective.
- Never use a heavy engine merely to claim "3D".

## 15 masterpiece blueprints

### 01 Rose Theatre — Love
Opening: black velvet stage; curtain fibers visible before any text.
Camera: subtle 2.5D dolly toward stage.
Gesture 1: drag curtain.
Consequence: cloth tension follows pointer, folds lag behind hand.
Reveal: recipient name writes under spotlight.
Memory: three 35mm frames projected onto moving scrim.
Gesture 2: pluck one rose petal.
False ending: lights cut; only projector dust remains.
Finale: thousands of petals reconstruct the portrait/name silhouette.
Engine: GSAP + Pixi petals + CSS 3D theatre depth.
Signature: theatre physically transforms into portrait stage.

### 02 Pearl Linen — Love
Opening: linen desk, breathing paper stack, handwriting.
Gesture 1: hold wax seal.
Consequence: real fracture pieces, crack sound/haptic.
Transition: same sheet rises from envelope into reading plane.
Gesture 2: touch/drag sequential polaroids.
False ending: memories collapse; clean back-side sheet appears.
Gesture 3: hold pearl 900ms.
Finale: real rendered particle count builds portrait/heart; final sentence writes after portrait resolves.
Engine: GSAP + Pixi + procedural seal.
Signature: one physical letter evolves continuously into a computational portrait.

### 03 Galaxy Confession — Love
Opening: silent void with one gravitational glow.
Gesture 1: drag galaxy.
Consequence: stars orbit with inertia and parallax.
Reveal: three bright stars contain private messages.
Gesture 2: discover all three stars.
Gesture 3: hold gravity core.
False ending: galaxy collapses to a near-black singularity.
Finale: particles rebound into recipient portrait/initial constellation.
Engine: Pixi/WebGL + GSAP.
Signature: interactive world physically collapses into the person.

### 04 Silk Heritage — Wedding
Opening: macro silk weave and one loose gold thread.
Camera: close textile macro -> editorial full composition.
Gesture 1: pull silk edge.
Consequence: fabric folds reveal names underneath.
Reveal: gold thread stitches date/location live.
False ending: thread stops before final motif.
Finale: final stitch closes a full ornamental frame, revealing complete invitation.
Engine: GSAP + SVG path drawing + layered textile depth.
Signature: invitation is literally embroidered into existence.

### 05 Night Garden — Wedding
Opening: moonlit dark garden with depth fog.
Gesture 1: light first lantern.
Consequence: fireflies wake locally.
Gesture 2: light remaining lanterns.
Reveal: fireflies sketch couple initials among flowers.
Gesture 3: slide garden gate.
False ending: gate opens into darkness.
Finale: garden blooms in depth, fireflies form names/date, invitation details appear inside living floral frame.
Engine: Pixi + GSAP + depth layers.
Signature: garden responds spatially to light.

### 06 Heritage Naqsh — Wedding
Opening: one gold point on dark textile.
Gesture 1: trace geometric path.
Consequence: geometry grows behind finger with precise snapping.
Reveal: names appear only when symmetry completes.
Gesture 2: rotate central medallion.
False ending: medallion clicks but scene goes dark.
Finale: all paths illuminate outward; complete naqsh becomes invitation architecture.
Engine: SVG + GSAP + optional Pixi glow.
Signature: guest completes the cultural geometry.

### 07 Aurora Paper — Birthday
Opening: sealed layered gift with aurora leaking through seams.
Gesture 1: untie ribbon.
Consequence: ribbon physics and paper tension.
Reveal: each paper layer holds one memory.
Gesture 2: tear final perforation.
False ending: black slit remains.
Finale: aurora erupts through tear, filling screen; paper fragments become confetti/name.
Engine: GSAP + Canvas/Pixi aurora + CSS 3D paper.
Signature: physical tear releases an impossible sky.

### 08 Balloon Dream — Birthday
Opening: dim room with ceiling balloons and string shadows.
Gesture 1: cut/release selected strings.
Consequence: balloons rise with weight/inertia; messages remain below.
Reveal: one hero balloon contains portrait reflection.
Gesture 2: hold hero balloon.
False ending: pop -> 450ms silence/blackout.
Finale: fragments become sky/confetti field spelling recipient name.
Engine: Pixi + GSAP.
Signature: room transforms into open sky.

### 09 Memory Reel — Birthday
Opening: projector leader 3-2-1, dust, sprocket sound.
Gesture 1: spin reel.
Consequence: speed controls frame movement.
Gesture 2: scrub film strip.
Reveal: memories arrive as real film frames with light leaks.
Gesture 3: hold favorite frame.
False ending: film jams.
Finale: authentic burn shader eats frame into "next chapter" message and credits.
Engine: GSAP + Canvas shader + CSS 3D reel.
Signature: chosen memory physically burns into the future.

### 10 After Rain — Apology
Opening: rain-covered glass with blurred scene behind.
Gesture 1: wipe glass.
Consequence: persistent clear trail follows finger with droplets displaced.
Reveal: first apology line exists behind the fog.
Gesture 2: draw one symbol/initial on fog.
False ending: rain becomes heavier for one beat.
Finale: storm stops; natural warm light enters; full message resolves in reflection.
Engine: Canvas/Pixi fluid mask + GSAP.
Signature: user literally clears the emotional barrier.

### 11 Ink of Regret — Apology
Opening: blank cotton paper and one black drop.
Gesture 1: touch drop.
Consequence: ink diffuses through fibers.
Reveal: first sentence writes from capillary flow.
Gesture 2: drag nib to rewrite crossed-out phrase.
False ending: ink spills and destroys page.
Finale: ink retreats into negative space leaving clean final apology + signature.
Engine: Canvas ink simulation + SVG/GSAP nib.
Signature: mistake becomes repaired writing through interaction.

### 12 Quiet Room — Apology
Opening: almost black room; room tone only.
Gesture 1: pull lamp chain.
Consequence: volumetric light reveals table/letter with real depth shadows.
Reveal: short lines appear with deliberate silence.
Gesture 2: bring/dim lamp physically.
False ending: light cuts completely.
Finale: one phosphor line survives, then room returns in warmer light with final apology.
Engine: CSS/WebGL light layers + GSAP.
Signature: light itself is the narrative.

### 13 Pearl Promise — Proposal
Opening: premium ring box barely visible in darkness.
Gesture 1: hold box.
Consequence: heartbeat + micro movement, lid releases.
Reveal: true 3D ring catches moving light and memory reflections.
Gesture 2: rotate ring.
False ending: engraving found; scene goes silent.
Finale: engraved name/date glows, ring light whites-out the scene into proposal question.
Engine: Three.js/Spline-grade true 3D + GSAP.
Signature: tactile hero object with real spatial inspection.

### 14 Cinema Proposal — Proposal
Opening: empty private theatre + projector motor.
Gesture 1: switch projector.
Consequence: beam appears through volumetric dust.
Reveal: personalized title card and memory montage.
Gesture 2: scrub film.
False ending: film jams, audio stutters.
Finale: burn-through transition destroys screen and reveals proposal question on clean light.
Engine: GSAP + Canvas film shader + CSS 3D theatre.
Signature: cinematic medium breaks to reveal reality.

### 15 Sky Promise — Proposal
Opening: deep night horizon, stars with true parallax.
Gesture 1: connect three stars.
Consequence: constellation reacts with magnetic line attraction.
Reveal: constellation becomes recipient initial.
Gesture 2: drag horizon upward.
False ending: dawn pauses before sun edge.
Finale: sunrise volumetric gradient reveals proposal question; stars fade into daylight particles.
Engine: Pixi/WebGL + GSAP.
Signature: user literally pulls night into a new day.

## Product layer across all templates

Creator:
- RU/UZ content switch; EN optional later.
- Live mobile preview.
- Draft autosave.
- Media readiness state.
- Template-specific content fields, never one generic editor schema.
- Preview before payment.
- Publish creates immutable versioned recipient link.

Recipient:
- zero creator controls.
- optional sound.
- replay only after payoff.
- share/save only after payoff.
- RSVP/response buttons never interrupt the emotional ritual.

Wedding utility:
- RSVP, map, calendar, guest-specific visibility, multilingual labels.

Birthday/love/apology/proposal utility:
- response capture, share, save keepsake, optional scheduled unlock.

## Performance budgets

- Initial JS target < 180 kB gzip before lazy engines.
- Heavy visual engine loads only after first user gesture.
- Mobile DPR cap 1.5-1.75 for GPU worlds.
- 60fps target on mid-range Android; degrade particle count before dropping choreography.
- No autoplay audio.
- No continuous high-cost shader when tab is hidden.

## QA gates per template

1. 390x844 mobile full ritual, zero scroll.
2. 1440x900 desktop composition.
3. keyboard path for core gestures when feasible.
4. pointer cancel / early hold cancel.
5. reduced motion.
6. no console/page errors.
7. screenshot set: opening, signature interaction, mid-reveal, false ending, finale.
8. bundle budget report.
9. no creator-only controls in recipient route.
10. fallback if WebGL unavailable.
