export const REBORN_SCENARIOS_V2={
  'love-pearl':{
    title:'Pearl Linen · The Private Archive',world:'A living linen archive lit by one pearl and one gold thread.',hook:'A pearl wakes in darkness and physically stitches the recipient name into the fabric.',mediaRole:'Photos become archive evidence; video is hidden inside the final folio page; music breathes with the material.',engine:['three','gsap','shader','audio'],secondary:'archive-scrub',finale:'particle-signature',
    beats:[
      {id:'wake',type:'opening',copy:'The pearl wakes over living linen; light follows it, not the cursor.'},
      {id:'stitch',type:'gesture',gesture:'drag-pearl',consequence:'gold-thread-stitches-name',copy:'Dragging the pearl physically stitches the recipient name into the cloth.'},
      {id:'folio',type:'reveal',copy:'The same thread pulls a linen folio out of the table surface.'},
      {id:'seal',type:'gesture',gesture:'hold-seal',consequence:'wax-fracture-and-folio-open',copy:'Holding the seal fractures it and opens the folio with camera and light choreography.'},
      {id:'letter',type:'memory',copy:'One sheet rises toward camera; ink reveals the message and photos become archive evidence.'},
      {id:'collapse',type:'turn',copy:'The folio closes itself and the whole room loses light for a deliberate breath.'},
      {id:'signature',type:'finale',copy:'The pearl returns and luminous points assemble the recipient initial + keepsake mark.'},
      {id:'keepsake',type:'afterglow',copy:'Only the signature, final sentence and replay/share remain.'}
    ]
  },
  'love-galaxy':{
    title:'Galaxy Confession · Gravity Letter',world:'A responsive star field where memories have mass and orbit.',hook:'The recipient name is not shown; its first letter exists only as missing stars.',mediaRole:'Photos are star cores; video is a hidden transmission; music controls star pulse and collapse.',engine:['pixi','three','gsap','shader','audio'],secondary:'gravity-core',finale:'constellation-portrait',
    beats:[
      {id:'void',type:'opening',copy:'A black void with only three unstable stars and a missing constellation.'},
      {id:'orbit',type:'gesture',gesture:'drag-orbit',consequence:'galaxy-inertia-and-camera-parallax',copy:'Dragging gives the galaxy inertia instead of moving a UI carousel.'},
      {id:'cores',type:'memory',copy:'Each unstable star opens into a photo core with a private line.'},
      {id:'transmission',type:'reveal',copy:'If video exists, one star becomes a moving transmission instead of a separate player card.'},
      {id:'gravity',type:'gesture',gesture:'hold-gravity-core',consequence:'all-orbits-collapse-inward',copy:'Holding the core bends every orbit toward the centre.'},
      {id:'singularity',type:'turn',copy:'Everything vanishes into a singularity; music drops to near silence.'},
      {id:'portrait',type:'finale',copy:'The singularity explodes into a constellation portrait or recipient initial.'},
      {id:'afterglow',type:'afterglow',copy:'A few stars keep orbiting the final sentence.'}
    ]
  },
  'love-rose':{
    title:'Rose Theatre · One Night Only',world:'A physical velvet theatre with rope, curtain, spotlight and falling petals.',hook:'The screen begins as a closed velvet curtain with audible room tone and no text.',mediaRole:'Photos are projected onto moving stage scrims; video is backstage footage; music behaves like a live score.',engine:['three','gsap','rapier','pixi','audio'],secondary:'pluck-live-petal',finale:'petal-portrait-stage',
    beats:[
      {id:'closed',type:'opening',copy:'A closed velvet curtain breathes under a narrow ceiling light.'},
      {id:'rope',type:'gesture',gesture:'pull-rope',consequence:'curtain-cloth-opens-with-tension',copy:'Pulling a physical rope opens both curtains with weight and overshoot.'},
      {id:'acts',type:'memory',copy:'Three memories appear as moving stage scrims, never as cards.'},
      {id:'backstage',type:'reveal',copy:'Video, if present, appears as forbidden backstage projection behind the set.'},
      {id:'petal',type:'gesture',gesture:'pluck-petal',consequence:'rose-dissembles-and-stage-blackout',copy:'Plucking one live petal causes the whole rose to lose petals and the stage to black out.'},
      {id:'blackout',type:'turn',copy:'Absolute blackout and one audible breath.'},
      {id:'encore',type:'finale',copy:'Spotlight returns; hundreds of petals reconstruct a portrait/name in mid-air.'},
      {id:'house-lights',type:'afterglow',copy:'House lights rise slightly; final line remains on stage.'}
    ]
  },
  'wedding-silk':{
    title:'Silk Heritage · Woven Vow',world:'Macro silk under directional light, woven into a ceremonial invitation.',hook:'A loose gold thread crosses black space and catches on silk.',mediaRole:'Couple photos are woven into translucent fabric panels; video lives inside the final textile window.',engine:['three','gsap','shader','rapier','audio'],secondary:'tie-real-knot',finale:'woven-invitation',
    beats:[
      {id:'thread',type:'opening',copy:'One loose gold thread searches across darkness and catches the fabric.'},
      {id:'unfold',type:'gesture',gesture:'pull-silk',consequence:'cloth-unfolds-with-weight-and-sheen',copy:'The user pulls actual cloth depth, not a panel.'},
      {id:'weave',type:'memory',copy:'Names, date and photos appear by being woven into the silk pattern.'},
      {id:'film',type:'reveal',copy:'Optional video appears inside a translucent textile window, with edges moving like fabric.'},
      {id:'knot',type:'gesture',gesture:'tie-knot',consequence:'two-threads-tighten-entire-composition',copy:'Joining two thread ends tightens the entire layout around the names.'},
      {id:'stillness',type:'turn',copy:'The cloth goes perfectly still for one beat; music loses percussion.'},
      {id:'ceremony',type:'finale',copy:'A full embroidered invitation grows outward from the knot with venue/date/map integrated.'},
      {id:'breath',type:'afterglow',copy:'Only subtle fabric breathing remains behind ceremony details.'}
    ]
  },
  'wedding-garden':{
    title:'Night Garden · The Path to Us',world:'A moonlit volumetric garden that grows only where the guest brings light.',hook:'The garden is almost invisible; one firefly lands on the guest name.',mediaRole:'Photos bloom inside flowers along the path; video is reflected in a dark garden pond.',engine:['three','pixi','gsap','shader','audio'],secondary:'open-iron-gate',finale:'garden-bloom-ceremony',
    beats:[
      {id:'dark',type:'opening',copy:'Moon, fog and a single firefly; the garden itself is hidden.'},
      {id:'lanterns',type:'gesture',gesture:'light-lanterns',consequence:'light-reveals-real-path-depth',copy:'Lighting lanterns reveals actual spatial layers of the path.'},
      {id:'path',type:'memory',copy:'Flowers open around each uploaded photo as the camera advances.'},
      {id:'pond',type:'reveal',copy:'Optional video appears only as a moving pond reflection.'},
      {id:'gate',type:'gesture',gesture:'open-iron-gate',consequence:'gate-parts-and-camera-crosses-threshold',copy:'The user physically opens the gate and the camera moves through it.'},
      {id:'no-light',type:'turn',copy:'Every lantern goes out at once; only fireflies remain.'},
      {id:'bloom',type:'finale',copy:'The entire garden blooms in one wave, revealing ceremony details in the living centre.'},
      {id:'moon',type:'afterglow',copy:'Bloom settles; moonlight and venue/date remain.'}
    ]
  },
  'wedding-naqsh':{
    title:'Heritage Naqsh · Living Geometry',world:'A dark architectural chamber generated from Uzbek geometric ornament.',hook:'One gold point emits a line that waits for the guest hand.',mediaRole:'Photos become tiled geometry fragments; video appears through the medallion centre.',engine:['svg','three','gsap','shader','audio'],secondary:'rotate-medallion',finale:'architectural-naqsh-reveal',
    beats:[
      {id:'point',type:'opening',copy:'One gold point pulses in a black architectural void.'},
      {id:'trace',type:'gesture',gesture:'trace-pattern',consequence:'geometry-grows-from-finger-path',copy:'The path creates real geometry instead of drawing on top of UI.'},
      {id:'architecture',type:'reveal',copy:'The ornament gains depth and becomes a chamber around the camera.'},
      {id:'memory-tiles',type:'memory',copy:'Photos occupy selected tile faces and appear as the geometry turns.'},
      {id:'medallion',type:'gesture',gesture:'rotate-medallion',consequence:'pattern-locks-and-room-reorients',copy:'Rotating the medallion reorients the whole chamber.'},
      {id:'lock',type:'turn',copy:'At alignment everything freezes and goes almost black.'},
      {id:'illumination',type:'finale',copy:'Gold illumination travels through every line and reveals the wedding invitation in the architecture.'},
      {id:'seal',type:'afterglow',copy:'The medallion keeps a slow ceremonial rotation behind details.'}
    ]
  },
  'birthday-aurora':{
    title:'Aurora Paper · Impossible Gift',world:'A tactile paper gift that contains an impossible aurora sky.',hook:'The box leaks moving coloured light through seams before it opens.',mediaRole:'Photos are printed into physical paper layers; video is a moving layer hidden among still paper.',engine:['three','gsap','shader','rapier','audio'],secondary:'tear-perforation',finale:'paper-world-becomes-sky',
    beats:[
      {id:'sealed',type:'opening',copy:'A heavy paper gift leaks aurora light through its seams.'},
      {id:'ribbon',type:'gesture',gesture:'drag-ribbon',consequence:'ribbon-unthreads-around-box',copy:'Dragging the ribbon unwraps it around the box with tension.'},
      {id:'paper-world',type:'memory',copy:'Three paper layers unfold in 3D; photos are printed into the material, not floating cards.'},
      {id:'moving-paper',type:'reveal',copy:'One “photo” unexpectedly moves because it is the uploaded video.'},
      {id:'tear',type:'gesture',gesture:'tear-perforation',consequence:'paper-rips-open-real-light-source',copy:'The final perforation tears and exposes impossible light behind the paper.'},
      {id:'slit',type:'turn',copy:'Everything compresses into one thin glowing tear in darkness.'},
      {id:'aurora',type:'finale',copy:'The tear expands until the paper room becomes a full aurora sky around the recipient name.'},
      {id:'snow-paper',type:'afterglow',copy:'Tiny paper fibres drift like snow around the final wish.'}
    ]
  },
  'birthday-balloon':{
    title:'Balloon Dream · Ceiling Break',world:'A believable dark birthday room whose ceiling slowly becomes sky.',hook:'Three balloons pull against strings in a room lit only by window moonlight.',mediaRole:'Photos are projected onto walls by released balloons; video becomes a floating cinema balloon.',engine:['three','rapier','gsap','pixi','audio'],secondary:'hold-hero-balloon',finale:'ceiling-break-to-sky',
    beats:[
      {id:'room',type:'opening',copy:'A dark room with three physically floating balloons and moving shadows.'},
      {id:'release',type:'gesture',gesture:'release-strings',consequence:'balloons-rise-and-room-light-changes',copy:'Each release changes room lighting and pulls a memory projection onto a wall.'},
      {id:'projections',type:'memory',copy:'Uploaded photos appear as imperfect wall projections with dust and perspective.'},
      {id:'cinema-balloon',type:'reveal',copy:'If video exists, one balloon descends carrying a translucent moving-film membrane.'},
      {id:'hero',type:'gesture',gesture:'hold-hero-balloon',consequence:'pressure-builds-before-pop',copy:'Holding the final balloon visibly stretches its skin and raises room pressure.'},
      {id:'silence',type:'turn',copy:'Pop. 450ms black silence. No confetti yet.'},
      {id:'ceiling-break',type:'finale',copy:'The ceiling cracks open upward; the room transforms into sky and the released balloons return around the recipient name.'},
      {id:'float',type:'afterglow',copy:'The room is gone; only slow sky drift, final wish and music remain.'}
    ]
  },
  'birthday-memory':{
    title:'Memory Reel · The Film That Refuses to End',world:'A physical projector room where the film strip is the timeline.',hook:'3…2…1 leader starts before any birthday text is visible.',mediaRole:'Photos are real film frames; uploaded video becomes the only moving frame; soundtrack drives projector rhythm.',engine:['three','gsap','canvas','shader','audio'],secondary:'hold-favourite-frame',finale:'film-burn-next-chapter',
    beats:[
      {id:'leader',type:'opening',copy:'A projector leader counts down in a dark room; mechanical sound establishes the world.'},
      {id:'reel',type:'gesture',gesture:'spin-reel',consequence:'film-speed-follows-gesture-inertia',copy:'The reel speed follows the user hand and controls the film.'},
      {id:'frames',type:'memory',copy:'Photos pass as genuine perforated film frames with light leakage and focus breathing.'},
      {id:'moving-frame',type:'reveal',copy:'The uploaded video is discovered as one frame that refuses to stay still.'},
      {id:'favourite',type:'gesture',gesture:'hold-favourite-frame',consequence:'projector-jams-on-selected-frame',copy:'Holding a frame physically jams the projector.'},
      {id:'burn',type:'turn',copy:'The jam burns the film from the centre; audio stutters and drops.'},
      {id:'next-chapter',type:'finale',copy:'The burn hole becomes white light and a brand-new reel labelled NEXT CHAPTER rolls in.'},
      {id:'credits',type:'afterglow',copy:'The final wish plays as quiet end credits.'}
    ]
  },
  'apology-rain':{
    title:'After Rain · The Window Between Us',world:'A cold rain-soaked window separating the viewer from a warm room outside.',hook:'The apology is physically present behind condensation but unreadable.',mediaRole:'Photos exist as reflections in drops; video appears as a distant room reflection after the glass clears.',engine:['canvas','shader','gsap','audio'],secondary:'trace-on-glass',finale:'weather-clears-world',
    beats:[
      {id:'storm',type:'opening',copy:'Rain and condensation hide a warm scene on the other side of glass.'},
      {id:'wipe',type:'gesture',gesture:'wipe-glass',consequence:'persistent-clear-trail-with-refraction',copy:'The finger clears real persistent glass and changes refraction.'},
      {id:'reflections',type:'memory',copy:'Photos appear only inside selected large droplets/reflections.'},
      {id:'room-reflection',type:'reveal',copy:'Uploaded video exists as a faint moving reflection in the distant room.'},
      {id:'trace',type:'gesture',gesture:'trace-on-glass',consequence:'condensation-follows-stroke-and-weather-reacts',copy:'Drawing the final symbol causes the storm itself to react.'},
      {id:'hard-rain',type:'turn',copy:'Rain suddenly intensifies for one short beat, then stops completely.'},
      {id:'sunbreak',type:'finale',copy:'Warm light crosses the glass; condensation disappears and the full apology becomes readable in the world.'},
      {id:'drops',type:'afterglow',copy:'Only a few slow droplets and room ambience remain.'}
    ]
  },
  'apology-ink':{
    title:'Ink of Regret · Rewrite the Sentence',world:'A fibrous paper surface where ink behaves like liquid, stain and eraser.',hook:'One black drop lands before any words exist.',mediaRole:'Photos emerge inside ink blooms; video is a moving ink-window; music becomes sparse pen/paper ambience.',engine:['canvas','shader','gsap','audio'],secondary:'drag-nib-rewrite',finale:'negative-space-apology',
    beats:[
      {id:'drop',type:'opening',copy:'A single ink drop lands and begins capillary diffusion through paper fibres.'},
      {id:'touch',type:'gesture',gesture:'touch-ink',consequence:'ink-diffuses-and-reveals-first-truth',copy:'Touching the drop changes the actual diffusion field.'},
      {id:'memories',type:'memory',copy:'Photos appear inside irregular ink blooms, then partially bleed away.'},
      {id:'moving-ink',type:'reveal',copy:'If video exists, one ink pool becomes a moving memory with unstable edges.'},
      {id:'rewrite',type:'gesture',gesture:'drag-nib-rewrite',consequence:'wrong-sentence-crosses-out-and-new-ink-writes',copy:'The nib physically crosses out the excuse and writes the accountable sentence.'},
      {id:'spill',type:'turn',copy:'A sudden spill destroys almost the entire page.'},
      {id:'retreat',type:'finale',copy:'Ink retreats from the centre, leaving the apology in clean negative space.'},
      {id:'dry',type:'afterglow',copy:'The paper dries; only a faint stain and final signature remain.'}
    ]
  },
  'apology-quiet':{
    title:'Quiet Room · Say It Without Hiding',world:'A nearly black room with one hanging lamp, a drawer and an old phone.',hook:'The room is invisible until the user pulls the lamp chain.',mediaRole:'Photos are physical polaroids from the drawer; video plays on the desk phone; music is mostly room tone.',engine:['three','gsap','rapier','audio'],secondary:'open-drawer',finale:'lamp-off-phosphor-line',
    beats:[
      {id:'dark',type:'opening',copy:'Pure darkness with only a hanging chain glint and room tone.'},
      {id:'lamp',type:'gesture',gesture:'pull-lamp-chain',consequence:'volumetric-light-reveals-room',copy:'Pulling the chain reveals actual room depth, table and drawer.'},
      {id:'drawer',type:'gesture',gesture:'open-drawer',consequence:'drawer-physics-releases-polaroids',copy:'The drawer resists, opens and physically releases uploaded photos onto the table.'},
      {id:'phone',type:'reveal',copy:'If video exists, the old phone screen wakes and plays the confession.'},
      {id:'letter',type:'memory',copy:'The apology sits under the photos and is read in deliberate lines, not a text dump.'},
      {id:'blackout',type:'turn',copy:'The lamp clicks off by itself; the room disappears.'},
      {id:'phosphor',type:'finale',copy:'A phosphorescent sentence remains in darkness, then warm light returns around it.'},
      {id:'quiet',type:'afterglow',copy:'No CTA movement; only room tone, replay and the final line.'}
    ]
  },
  'proposal-pearl':{
    title:'Pearl Promise · The Weight of Yes',world:'A velvet ring box in a black spatial stage with physically lit ring and gemstone.',hook:'The box is present but the ring is hidden; heartbeat exists before music.',mediaRole:'Photos are engraved/memory reflections inside the ring environment; video becomes a suspended vow before the question.',engine:['three','rapier','gsap','shader','audio'],secondary:'rotate-ring',finale:'whiteout-proposal-question',
    beats:[
      {id:'box',type:'opening',copy:'A velvet box floats in darkness with one heartbeat and grazing light.'},
      {id:'hold',type:'gesture',gesture:'hold-box',consequence:'hinge-opens-under-pressure',copy:'Holding the box loads hinge tension before it opens.'},
      {id:'ring',type:'reveal',copy:'The ring rises into true 3D light; camera orbits slowly around it.'},
      {id:'memories',type:'memory',copy:'Uploaded photos appear as curved reflections and engraved memory planes around the ring.'},
      {id:'rotate',type:'gesture',gesture:'rotate-ring',consequence:'engraving-aligns-with-camera',copy:'Rotating aligns the recipient name/date engraving with the viewer.'},
      {id:'vow',type:'turn',copy:'Optional video vow suspends in darkness; when it ends, everything disappears for one heartbeat.'},
      {id:'question',type:'finale',copy:'A whiteout expands from the gemstone and resolves into the proposal question.'},
      {id:'ring-light',type:'afterglow',copy:'The ring returns behind the final question with minimal motion.'}
    ]
  },
  'proposal-cinema':{
    title:'Cinema Proposal · The Last Frame',world:'A private analogue theatre with projector, physical film and screen burn.',hook:'The screen is blank; the projector must be started by the viewer.',mediaRole:'Photos are film frames; uploaded video becomes the third act; soundtrack is scored to projector/jam/burn.',engine:['three','canvas','gsap','audio'],secondary:'scrub-last-frame',finale:'burn-through-question',
    beats:[
      {id:'theatre',type:'opening',copy:'Empty private theatre, projector off, screen blank.'},
      {id:'projector',type:'gesture',gesture:'start-projector',consequence:'reels-spin-and-beam-crosses-room',copy:'Starting the projector creates the light beam and reel movement.'},
      {id:'acts',type:'memory',copy:'Uploaded photos run as first and second acts inside physical film.'},
      {id:'third-act',type:'reveal',copy:'Uploaded video becomes the moving third act instead of a separate embed.'},
      {id:'scrub',type:'gesture',gesture:'scrub-last-frame',consequence:'film-position-and-projector-pitch-follow-hand',copy:'Scrubbing changes physical reel position and audio pitch.'},
      {id:'jam',type:'turn',copy:'The film jams on one frame; image shakes, sound stutters, then silence.'},
      {id:'burn',type:'finale',copy:'Film burns through from the centre and the hole becomes the proposal question.'},
      {id:'credits',type:'afterglow',copy:'Tiny “to be continued?” credits remain below the question.'}
    ]
  },
  'proposal-sky':{
    title:'Sky Promise · Before Sunrise',world:'A parallax night horizon where stars form the recipient initial before dawn.',hook:'The horizon is almost black and the missing constellation is obvious but unreadable.',mediaRole:'Photos live inside selected stars; video becomes a cloud reflection at predawn; score moves from night ambience to sunrise.',engine:['pixi','three','gsap','shader','audio'],secondary:'drag-horizon',finale:'sunrise-question',
    beats:[
      {id:'night',type:'opening',copy:'Dark horizon, deep parallax stars and one incomplete constellation.'},
      {id:'connect',type:'gesture',gesture:'connect-stars',consequence:'lines-create-recipient-initial',copy:'Connecting stars physically draws the recipient initial in space.'},
      {id:'star-memories',type:'memory',copy:'Selected stars open into uploaded photo memories without leaving the sky.'},
      {id:'cloud-film',type:'reveal',copy:'Optional video appears as a moving predawn cloud reflection.'},
      {id:'horizon',type:'gesture',gesture:'drag-horizon',consequence:'night-sky-physically-pulled-into-dawn',copy:'Dragging upward moves the actual horizon and colour field, not a progress bar.'},
      {id:'predawn',type:'turn',copy:'The sun edge appears but pauses below the horizon in near silence.'},
      {id:'sunrise',type:'finale',copy:'Sunrise floods the world and the proposal question appears in the light.'},
      {id:'morning',type:'afterglow',copy:'Stars vanish; only morning haze, question and replay remain.'}
    ]
  }
};
