# EMORA Scenario Bible V12 — 15 authored rituals

Date: 2026-09-29

## Global rule

No template may be implemented as a recolor or layout variant of another template.

Every experience needs:
1. a unique opening object/world,
2. one primary tactile gesture,
3. a material transition into the story,
4. personalized media integrated into the physical scene,
5. a false ending or escalation beat where appropriate,
6. a finale that changes the whole rendered world,
7. a clean post-payoff utility layer.

Gesture budget: 2-3 meaningful gestures per experience.

---

## LOVE

### 01 · Rose Theatre
**Emotional thesis:** love as a private performance staged for one person.

**Opening:** closed burgundy velvet curtains in a dark theatre. Dust in a narrow spotlight. Recipient name appears as foil lettering on a physical ticket.

**Ritual:**
1. Drag both curtain edges apart.
2. Stage depth appears; footlights wake from center outward.
3. Three memories arrive as floating framed “acts”, never generic cards.
4. Recipient plucks one rendered rose petal; the petal becomes a glowing cue that moves through the stage.
5. All frames rotate into a single cinema-like composition.

**3D / motion:** CSS 3D curtains + Pixi petal field + GSAP camera push. Fabric normals simulated with gradients and displacement-like strips.

**Finale:** curtains reopen much wider than before; hundreds of petals trace the recipient portrait, then fall away leaving the final line in a single spotlight.

**Never:** carousel, heart confetti, static red background.

### 02 · Pearl Linen
**Emotional thesis:** a letter with physical memory and visible effort.

**Opening:** linen desk, stacked papers, signature writing itself.

**Ritual:**
1. Hold wax seal; Pixi/WebGL fracture + haptic.
2. Same sheet rises from envelope and becomes the readable letter.
3. Paragraphs reveal one at a time through paper fibers.
4. Drag first polaroid to unlock second, second to unlock third.
5. False ending: paper world gathers back into one final sheet.
6. Hold a pearl for 900ms.
7. Real rendered particle count builds while portrait/heart forms.

**3D / motion:** CSS paper depth + WebGL seal + GSAP material continuity + Pixi portrait particles.

**Finale:** entire paper world falls to darkness; actual particle system forms portrait or heart; final sentence appears only after form settles.

**Never:** fixed decorative fake counter, all photos visible at once, automatic paragraph dump.

### 03 · Galaxy Confession
**Emotional thesis:** a private universe whose stars are personal memories.

**Opening:** black space with one faint star carrying the recipient's name.

**Ritual:**
1. Drag to rotate a true WebGL galaxy.
2. Discover three luminous stars; each star opens a memory in-world.
3. Hold the central star after all three are found.

**3D / motion:** Pixi or Three.js spatial particle field, inertia, depth-scaled stars, bloom kept performance-safe.

**Finale:** galaxy arms collapse toward camera, then reassemble into recipient portrait; orbiting dust writes the final line.

**Never:** starry CSS background with modal cards.

---

## WEDDING

### 04 · Silk Heritage
**Emotional thesis:** the invitation is embroidered into existence.

**Opening:** folded silk textile occupying the full stage; real-looking weave, weight and edge shadow.

**Ritual:**
1. Pull one gold thread.
2. Thread travels through embroidery paths, progressively constructing ornament.
3. Textile unfolds physically into names/date.
4. A second pull finishes the central motif.
5. Ornament lines extend outward and become functional venue/map framing.

**3D / motion:** CSS 3D cloth panels + SVG path drawing + GSAP tension/spring response + subtle WebGL shimmer only for metallic thread.

**Finale:** completed embroidery glows once, fabric lifts like a ceremonial banner, revealing the complete invitation beneath.

**Never:** standard landing-page wedding sections during ritual.

### 05 · Night Garden
**Emotional thesis:** guests are invited by walking into a living night garden.

**Opening:** near-dark garden with three fireflies and a distant lantern.

**Ritual:**
1. Move/touch to attract fireflies.
2. Guide them into lantern; lantern ignites.
3. Light reveals botanical layers and names.
4. Tap a flower bud; it blooms into venue/date details.

**3D / motion:** Three.js or Pixi parallax garden layers, volumetric-style light sprite, firefly swarm behavior.

**Finale:** camera pushes through lantern light into a dawn garden; fireflies become gold points around the couple names.

**Never:** generic floral wallpaper + scrolling.

### 06 · Heritage Naqsh
**Emotional thesis:** geometry becomes ceremony.

**Opening:** one floating central tile in darkness.

**Ritual:**
1. Rotate central tile until pattern locks.
2. Locked geometry propagates outward.
3. Drag a compass-like ring to complete symmetry.
4. Pattern lines become borders, dividers and map route.

**3D / motion:** SVG geometric construction + CSS 3D tile depth + GSAP radial sequencing.

**Finale:** finished naqsh lifts in layers, camera passes through its center, and the invitation appears as if carved into luminous stone/paper.

**Never:** ornamental background pasted behind conventional UI.

---

## BIRTHDAY

### 07 · Aurora Paper
**Emotional thesis:** a quiet paper gift opens into an impossible sky.

**Opening:** small folded paper object on a dark desk, edges catching colored light.

**Ritual:**
1. Tap to unfold one panel.
2. Pull tab; layered paper opens mechanically.
3. Photos appear as cut-paper windows.
4. Last fold opens beyond physical paper into aurora depth.

**3D / motion:** CSS 3D origami + GSAP fold choreography + WebGL aurora shader/particle fallback.

**Finale:** paper boundaries disappear; aurora surrounds the viewport and writes the birthday line with light.

**Never:** confetti-first birthday trope.

### 08 · Balloon Dream
**Emotional thesis:** memories physically lift the recipient into celebration.

**Opening:** three grounded balloons with strings attached to photo tags.

**Ritual:**
1. Hold a balloon to inflate it.
2. Release; it lifts a hidden memory into view.
3. Pop only one special balloon to release the next beat.
4. Remaining balloons pull the whole scene upward.

**3D / motion:** WebGL/Pixi balloon field with buoyancy, string simulation simplified for mobile, depth fog.

**Finale:** camera rises above clouds; balloons align into recipient age/name constellation, then sunrise.

**Never:** random balloon rain over static content.

### 09 · Memory Reel
**Emotional thesis:** their year plays like recovered film.

**Opening:** projector in darkness with film leader jitter.

**Ritual:**
1. Drag reel to thread film.
2. Tap projector switch.
3. Frames advance as photos physically through the gate.
4. Scrub one short section to find a hidden frame.

**3D / motion:** CSS/Three.js projector assembly, GSAP film transport, shaders/grain for projected image.

**Finale:** film burns white at the gate, the burn expands to full screen and resolves into the birthday message/photo.

**Never:** slideshow controls disguised as cinema.

---

## APOLOGY

### 10 · After Rain
**Emotional thesis:** clarity appears only when the recipient chooses to clear the glass.

**Opening:** rain-covered window, blurred light behind it.

**Ritual:**
1. Finger-wipe condensation.
2. Cleared path reveals handwritten words beneath.
3. Three wipes expose fragments of one shared image.
4. Hold the last droplet.

**3D / motion:** WebGL fluid/rain mask or performant canvas simulation + refractive blur approximation.

**Finale:** rain stops, droplets reverse upward, window becomes perfectly clear and the final apology line appears in reflection.

**Never:** sad blue gradient with text cards.

### 11 · Ink of Regret
**Emotional thesis:** damage can be acknowledged, not hidden; the page can be repaired without pretending it was untouched.

**Opening:** clean paper; one dark ink drop falls.

**Ritual:**
1. Touch drop; ink diffuses into the first sentence.
2. Drag torn paper edge toward its pair.
3. Stitch line follows the drag and repairs the tear.
4. Final ink wash recedes, revealing a photo beneath fibers.

**3D / motion:** canvas/Pixi diffusion + SVG stitched path + CSS paper tear depth.

**Finale:** repaired page folds once, showing the apology on one side and a quiet “if you want” response action on the back.

**Never:** dramatic guilt manipulation or forced response.

### 12 · Quiet Room
**Emotional thesis:** apology as stillness and attention.

**Opening:** almost-black room; only a hanging lamp chain is visible.

**Ritual:**
1. Pull chain.
2. Lamp illuminates one table and letter.
3. Recipient turns over 2-3 small objects tied to specific memories.
4. Put the objects back / tap the letter to finish.

**3D / motion:** Three.js-lite/CSS 3D room with camera parallax, physically motivated lamp cone, soft shadows.

**Finale:** light widens from one table to the whole room, then fades to dawn through a window.

**Never:** busy motion or gamified apology.

---

## PROPOSAL

### 13 · Pearl Promise
**Emotional thesis:** anticipation is concentrated into one object.

**Opening:** ring box in darkness, only edge light visible.

**Ritual:**
1. Rotate box slightly with drag to discover engraved initials.
2. Hold clasp.
3. Lid opens with controlled resistance.
4. Gem light refracts into memories around the box.

**3D / motion:** Three.js ring box + physically based lighting kept low-poly/mobile-safe; GSAP camera and light rig.

**Finale:** ring reflection becomes the final question; answer UI appears only after the question settles.

**Never:** fake 3D image spin.

### 14 · Cinema Proposal
**Emotional thesis:** the relationship has been a film whose final title is the question.

**Opening:** dark theatre/projector booth, countdown leader.

**Ritual:**
1. Insert/drag a film reel.
2. Start projector.
3. Three title-card memories play as film sections.
4. Projector appears to jam; recipient taps to fix it.

**3D / motion:** 3D projector/reel, film transport, lens glow, projected texture, film-gate shake.

**Finale:** image burns out, silence, then one clean title card: the proposal question. Answer scene changes the projector beam into a celebratory environment.

**Never:** embedded video player chrome.

### 15 · Sky Promise
**Emotional thesis:** a promise moves the world from night to dawn.

**Opening:** deep night sky with one horizon line.

**Ritual:**
1. Drag sky to find three constellations.
2. Connect each with one stroke.
3. Hold horizon star.

**3D / motion:** WebGL sky dome/particle field + atmospheric gradient + parallax clouds.

**Finale:** stars accelerate toward horizon, sky transitions continuously into sunrise, and the final promise/question appears with the first light.

**Never:** generic star background plus text.

---

## Cross-template production contract

### Render tiers
**Tier A — Full:** WebGL/3D + particles + sound/haptic.
**Tier B — Balanced:** reduced particle count, same choreography.
**Tier C — Fallback:** CSS/SVG version retaining the same story and gestures.

Runtime chooses tier from:
- viewport
- DPR
- hardwareConcurrency
- reduced-motion preference
- WebGL availability

### Performance targets
- critical JS before first interaction: as small as practical; heavy engines lazy-loaded
- mobile DPR capped per template
- no more than one heavy rendering engine active at once
- destroy canvases/observers/tickers between scenes
- no unbounded particle systems
- media prefetch only for the next beat
- 390×844 browser QA for every release candidate

### QA screenshots
Every template must generate at least:
1. opening
2. signature gesture
3. personalized content
4. pre-finale
5. finale

A template cannot move to review merely because tests pass. Screenshots must be manually inspected for composition and visual hierarchy.
