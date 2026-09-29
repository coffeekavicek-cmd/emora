# EMORA Masterpiece System V3

## Product position

EMORA is not a catalogue of animated cards. Each template is a short, personalized digital ritual: a unique physical world, a small number of meaningful gestures, a personalized reveal, and a finale worth saving or sharing.

The benchmark is not “more effects”. The benchmark is:
- stronger emotional pacing than Celamur;
- stronger local art direction than Uzbek invitation catalogues;
- stronger creator/editor ergonomics than bespoke invitation studios;
- stronger guest utility than a static invitation;
- no two templates may feel like recolours of the same engine.

## Competitor findings converted into product rules

### Celamur
Strength: one-link dramaturgy. Handwriting → wax fracture → live ink → polaroids → computational finale. Visible effort makes the finale feel earned.
EMORA response: preserve ritual pacing, but diversify worlds, materials, camera language and endings. Never repeat envelope/polaroid mechanics across unrelated templates.

### e-invitation
Strength: premium local visual language, mobile creation, live preview before publish, guest-specific links, practical wedding details.
EMORA response: every wedding experience must preserve art direction while supporting date/time, venue, map, RSVP, guest-specific copy and publish preview.

### etaklif Pro
Strength: broad visual catalogue, quick customization, mobile-first creation, video/link formats.
EMORA response: fewer generic variants, more recognizable signature mechanisms. Every catalogue thumbnail must promise a different interaction, not merely a different palette.

### Bliss & Bone / Joy
Strength: design flexibility plus RSVP, guest management, privacy and communication.
EMORA response: emotional ritual first; utility appears only after the emotional payoff. Weddings get RSVP, map, calendar, privacy and guest routing without turning the ritual into dashboard UI.

### Partiful
Strength: fast creation, social guest loop, questions, updates and event activity.
EMORA response: frictionless share/publish, reaction loop and event updates after the artifact is created.

## Non-negotiable Masterpiece Gate

Every template must pass all of these:
1. Unique world/object in the first 2 seconds.
2. No generic card UI in the recipient emotional flow.
3. 1–3 meaningful gestures only.
4. Every gesture visibly changes material, light, camera or geometry.
5. The previous state physically becomes the next; avoid arbitrary scene swaps.
6. Personal content must be integrated into the world, not pasted on top.
7. One deliberate silence / stillness beat before the finale.
8. Finale changes the whole scene.
9. Finale must be screenshot-worthy without UI chrome.
10. Mobile recipient flow is 100svh with no document scroll.
11. 60fps target; graceful quality scaling on weak devices.
12. Reduced-motion mode remains beautiful and understandable.
13. Sound/haptic only follows user gesture and has a mute path.
14. Creator controls never leak into recipient mode.
15. No fake backend state: no fake sent/opened/RSVP claims.
16. Media upload, privacy and publish states must be truthful.
17. Each template owns a unique typography/material/motion grammar.
18. No repeated hero gesture between adjacent templates in the same category.
19. WebGL/3D is used only when it strengthens the metaphor.
20. Browser QA must cover opening, core gesture, turn, finale and restart.

## Rendering strategy

Use the lightest engine that can deliver the illusion:
- GSAP + CSS 3D: camera, paper, textile, theatre, projector, room.
- SVG/Rive-style vector motion: handwriting, thread, ornament, ribbon, line drawing.
- Pixi/WebGL: particles, rain, ink masks, fireflies, stars, aurora, confetti.
- Three.js: true hero objects where rotation, refraction or lighting is the story — especially Pearl Promise ring/box.
- Audio: short procedural cues or licensed/uploaded music only after gesture.

The rule is not “3D everywhere”. The rule is “physical consequence everywhere”.

# 15 experience bibles

## LOVE 01 — Rose Theatre
World: black-box theatre, burgundy velvet, warm tungsten spotlight.
Camera: audience seat → slow dolly toward stage → macro petal.
Gestures: drag curtain; pluck one petal.
3D/depth: layered velvet folds with perspective and light falloff; petals use WebGL depth.
Story:
00 blackout and breathing room tone;
01 curtain responds elastically to drag;
02 spotlight handwrites recipient name;
03 three memories appear as 35mm frames in the stage depth;
04 recipient plucks one physical petal;
05 petal reveals a hidden private line;
06 theatre falls to blackout for 700ms;
07 curtain opens again and every petal converges into recipient portrait/name.
Finale: petal portrait under a single spotlight.
Never: generic carousel, pink gradient, floating hearts as filler.

## LOVE 02 — Pearl Linen
World: linen desk, warm paper, imperfect wax.
Camera: top-down editorial → macro seal → paper rise → full-screen dark finale.
Gestures: hold seal; touch/drag memories; hold final pearl.
Depth: WebGL wax fracture, CSS 3D envelope/paper continuity, Pixi portrait.
Story:
00 handwritten arrival;
01 520ms wax fracture;
02 the same sheet rises from the envelope;
03 three paragraphs reveal only when the reader asks for more;
04 first memory drops, then unlocks second, then third;
05 memories settle into a false ending;
06 clean reverse sheet: “Yana bitta narsa bor.”;
07 900ms pearl hold destroys the paper world and builds the real particle portrait/heart.
Finale: live particle count uses the actual rendered particle budget, never a fake decorative number.
Never: auto-dump all paragraphs, show all photos at once, creator inputs in recipient view.

## LOVE 03 — Galaxy Confession
World: interactive deep-space confession.
Camera: orbit → collapse through center → portrait plane.
Gestures: rotate galaxy; discover 3 stars; hold core.
Depth: Pixi/WebGL parallax, depth fog, bloom-like glows.
Story: galaxy wakes; three stars reveal three personal truths; core becomes touchable; hold creates gravitational collapse; words/points become portrait; portrait evaporates; handwritten final remains.
Finale: galaxy-to-portrait morph.
Never: static star background.

## WEDDING 01 — Silk Heritage
World: dark atelier table with real textile depth.
Camera: macro embroidery → cloth fold → ceremonial full composition.
Gesture: pull silk edge; join two gold threads.
Depth: layered CSS 3D cloth mesh illusion; SVG gold thread with tension.
Story: first stitch draws ornament; silk is physically pulled open; names are woven rather than faded in; date is stitched; two thread ends meet; knot triggers full pattern spread; invitation emerges from embroidery.
Finale: living embroidered invitation; utility dock appears only afterward.
Never: ordinary scrolling wedding page during the ritual.

## WEDDING 02 — Night Garden
World: moonlit garden with lanterns, foliage layers, fog and fireflies.
Camera: low garden path → gate → bloom.
Gestures: light lanterns; open gate.
Depth: Pixi firefly field + layered parallax foliage.
Story: dark garden; each lantern reveals one layer/name fragment; illuminated path reveals memories; gate opens with resistance; whole garden blooms; fireflies form names/date.
Finale: floral frame becomes the usable invitation.
Never: looping decorative flowers with no interaction.

## WEDDING 03 — Heritage Naqsh
World: dark lacquer / ivory paper and mathematical ornament.
Camera: macro point → expanding geometry → medallion.
Gestures: trace path; rotate central medallion.
Depth: SVG geometry with subtle relief/shadow.
Story: one gold point; trace creates geometry; names are revealed through negative spaces; central medallion unlocks at exact angle; pattern flashes into complete ceremonial layout.
Finale: completed naqsh becomes invitation border.
Never: generic Uzbek ornament pasted around a card.

## BIRTHDAY 01 — Aurora Paper
World: sculptural gift made from paper layers with trapped aurora light.
Camera: closed object → layer peel → inside light.
Gestures: untie ribbon; tear final paper seam.
Depth: CSS 3D paper stack + Pixi aurora field.
Story: light leaks through seams; ribbon responds to pull; each layer carries one memory; final tear releases volumetric aurora; aurora turns into personalized confetti/name.
Finale: room-filling aurora/confetti composition.
Never: basic confetti on page load.

## BIRTHDAY 02 — Balloon Dream
World: quiet room filled with physically weighted balloons.
Camera: room perspective → hero balloon macro → sky.
Gestures: cut/release strings; hold hero balloon.
Depth: Pixi physics-lite buoyancy, parallax shadows.
Story: three balloons reveal messages; one larger balloon carries photo; hold builds tension; pop creates a short silence; fragments become sky typography.
Finale: balloon fragments write the name/age while memories float behind.
Never: random bouncing emoji balloons.

## BIRTHDAY 03 — Memory Reel
World: 35mm projector and tactile film transport.
Camera: projector mechanism → frame gate → burn-through.
Gestures: spin reel; scrub strip; hold selected frame.
Depth: CSS 3D reel + canvas grain/burn mask.
Story: 3-2-1 leader; reel speed controls frames; memories can be scrubbed; hold favorite frame; emulsion burns from edge; new reel appears as “next chapter”.
Finale: burn transition into birthday title/portrait.
Never: slideshow pretending to be cinema.

## APOLOGY 01 — After Rain
World: rain-covered glass with blurred memory behind it.
Camera: close glass → focus behind glass → sunlight.
Gestures: wipe glass; trace one mark on fog.
Depth: WebGL/canvas rain displacement and glass refraction.
Story: heavy rain; wipe reveals first words; glass slowly fogs again; three droplets contain memories; trace mark; rain stops instantly; daylight reveals full apology.
Finale: natural light and clean glass.
Never: blue rain GIF behind text.

## APOLOGY 02 — Ink of Regret
World: absorbent paper and one unstable ink drop.
Camera: macro fibers → nib → full negative-space composition.
Gestures: touch ink; drag nib.
Depth: WebGL/canvas diffusion mask.
Story: drop spreads; first sentence grows with capillary motion; wrong words cross themselves out; user drags nib to rewrite; ink spills; it retreats leaving apology in white negative space.
Finale: repaired clean sentence and signature.
Never: typewriter effect called “ink”.

## APOLOGY 03 — Quiet Room
World: nearly black room, desk, lamp and sealed note.
Camera: darkness → narrow light pool → close paper.
Gesture: pull lamp chain once.
Depth: CSS 3D room planes + volumetric light cone illusion.
Story: darkness/room tone; chain physically swings; warm pool reveals note; three lines arrive with deliberate silence; the light retreats by itself; blackout; one phosphor line remains; warm light returns.
Finale: intimate final apology, no spectacle.
Never: over-animate an emotional minimal scene.

## PROPOSAL 01 — Pearl Promise
World: cinematic jewelry table with true 3D ring box and ring.
Camera: macro product cinematography.
Gestures: hold box; rotate ring.
True 3D: Three.js PBR materials, HDR-like procedural lighting, soft shadow plane, adaptive DPR.
Story: box outline; hold increases heartbeat/light; lid opens with hinge physics; ring reflections flash memories; user rotates ring; inner engraving becomes readable; light blooms into proposal question.
Finale: engraving → whiteout → question.
Never: fake flat ring PNG rotating in 2D.

## PROPOSAL 02 — Cinema Proposal
World: private cinema and projector mechanics.
Camera: empty seats → projector beam → screen.
Gestures: switch projector; scrub film.
Depth: CSS 3D projector/reel, canvas burn.
Story: projector starts; leader/title “Bizning hikoya”; 24fps-style montage; user scrubs to chosen frame; film jams; burn consumes frame; behind the burn is only the question.
Finale: proposal question on silent screen, then “to be continued?”
Never: normal video player controls.

## PROPOSAL 03 — Sky Promise
World: living night horizon that becomes dawn.
Camera: star field → horizon → sunrise.
Gestures: connect stars; lift horizon.
Depth: Pixi star layers and atmospheric gradient.
Story: recipient connects three stars; constellation becomes initial; three shooting stars reveal memories; user lifts horizon; night physically drains into dawn; sunrise exposes question.
Finale: sun-edge question with subtle lens atmosphere.
Never: static gradient with stars.

# Category differentiation

Love = intimacy and discovery.
Wedding = heritage, ceremony and useful guest actions.
Birthday = play, memory and surprise.
Apology = restraint, consequence and repair.
Proposal = tension, reveal and irreversible question.

# Production order

1. Pearl Linen — quality reference / mobile ritual
2. Galaxy Confession — WebGL living-world reference
3. Pearl Promise — true-3D hero-object reference
4. Silk Heritage — editorial/material reference
5. Memory Reel — cinematic-memory reference
6. Quiet Room — atmospheric-minimal reference
7. Rose Theatre
8. Night Garden
9. Heritage Naqsh
10. Aurora Paper
11. Balloon Dream
12. After Rain
13. Ink of Regret
14. Cinema Proposal
15. Sky Promise

A template may move to `review` only after its own browser QA proves the signature interaction, no-scroll mobile fit, restart, reduced-motion behavior, and final screenshot.
