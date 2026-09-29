const make=(render,camera,material,hero,finale,signature3d,lighting,sound,silenceBeat,antiGeneric)=>({
  render,camera,material,hero,finale,signature3d,lighting,sound,silenceBeat,antiGeneric,
});

export const ART_DIRECTION = {
  'love-rose': make('css3d+pixi','theatre-dolly','velvet+film+petals','curtain','petal-portrait','layered-curtain-depth+webgl-petals','single tungsten spotlight','cloth pull + petal pluck','blackout before second curtain open','never a pink card carousel'),
  'love-pearl': make('css3d+pixi','macro-seal-to-paper-to-dark','linen+paper+wax+pearl','sealed-letter','pearl-particle-portrait','wax fracture + paper continuity + particle portrait','warm desk light to wine-dark finale','wax crack + paper movement + soft tones','false ending on clean reverse sheet','never dump all text or photos at once'),
  'love-galaxy': make('webgl','orbit-collapse-portrait','light+depth-fog+word-particles','living-galaxy','galaxy-portrait','multi-plane galaxy with portrait morph','cold starlight with warm portrait bloom','sub-bass gravity + star chimes','portrait dissolves to darkness before final line','never a static star wallpaper'),
  'wedding-silk': make('css3d+svg+pixi-lite','textile-macro-unfold','silk+gold-thread','folded-silk','embroidered-invitation','cloth depth with tensioned SVG thread','museum-dark table with gold grazing light','thread pull + soft textile friction','still knot before pattern expansion','never a normal scrolling invitation during ritual'),
  'wedding-garden': make('webgl','garden-path-to-gate','foliage+fog+lantern-glass','lantern-garden','firefly-bloom-invitation','parallax garden planes + firefly volume','moonlight to lantern pools','night ambience + lantern ignition','quiet closed gate before bloom','never looping decorative flowers without consequence'),
  'wedding-naqsh': make('svg+css3d','macro-point-to-radial','lacquer+ivory+gold-relief','central-medallion','completed-naqsh-invite','relief geometry + rotating medallion','raking gold edge light','fine metal click at lock','held geometric lock before reveal','never paste ornament around a generic card'),
  'birthday-aurora': make('css3d+webgl','gift-macro-to-world','paper+ribbon+aurora-light','layered-gift','aurora-confetti-name','layered paper volume + aurora field','dark seams leaking spectral light','ribbon pull + paper tear','dark torn seam before aurora escape','never launch generic confetti on load'),
  'birthday-balloon': make('pixi','room-to-hero-balloon-to-sky','latex+string+soft-room-shadows','balloon-field','fragment-sky-message','buoyancy field + depth shadows','quiet room daylight to sky glow','string snap + tension + pop','short full silence immediately after pop','never emoji balloons'),
  'birthday-memory': make('css3d+canvas','projector-axis','film+metal+dust+emulsion','projector-reel','film-burn-next-chapter','reel depth + emulsion burn mask','projector beam + flicker','motor + reel ticks + burn','held favorite frame before burn','never a slideshow with a film frame overlay'),
  'apology-rain': make('webgl-canvas','fixed-glass-focus-pull','glass+water+fog','wet-window','sunbreak-apology','rain displacement + refraction','storm grey to natural window light','rain + fingertip wipe','rain stops completely before sunbreak','never a rain GIF behind text'),
  'apology-ink': make('canvas+svg+css3d','fiber-macro-to-page','ink+absorbent-paper+nib','ink-drop','negative-space-apology','capillary diffusion mask + nib path','soft neutral desk light','ink touch + nib scratch','page fully obscured before ink retreats','never a typewriter effect named ink'),
  'apology-quiet': make('css3d','dark-room-parallax','dark-room+paper+warm-lamp','lamp-chain','warm-room-return','room planes + volumetric light-cone illusion','near-black to narrow tungsten pool','chain click + room tone','true blackout before warm return','never over-animate the minimal scene'),
  'proposal-pearl': make('three','macro-product-orbit','velvet+metal+gem+engraving','ring-box','engraving-whiteout-question','true PBR ring + hinged box + adaptive DPR','controlled jewelry key/fill/rim','heartbeat + hinge + metal micro-ring','engraving held in silence before whiteout','never rotate a flat ring PNG'),
  'proposal-cinema': make('css3d+canvas','cinema-to-projector-to-screen','film+metal+beam+dust','projector-reel','film-burn-question','projector depth + film transport + burn shader','projector cone + screen bounce','motor + leader ticks + jam','jammed frozen frame before burn','never expose normal video-player controls'),
  'proposal-sky': make('webgl','sky-depth-to-horizon','atmosphere+stars+dawn','living-night-sky','sunrise-question','multi-layer star field + atmospheric horizon','night gradients physically drain into dawn','wind + shooting-star accents','pre-dawn horizon held before sunrise','never a static star gradient'),
};

export const QUALITY_CONTRACT = {
  maxMeaningfulGestures:3,
  mobileViewport:{width:390,height:844},
  noDocumentScroll:true,
  creatorControlsInRecipient:false,
  heavyEnginesLazy:true,
  finalSceneMustTransformWorld:true,
  genericCardsInEmotionalFlow:false,
  physicalConsequenceForEveryGesture:true,
  personalizedMediaInsideWorld:true,
  deliberateSilenceBeforeFinale:true,
  screenshotWorthyFinale:true,
  adaptivePerformance:true,
  reducedMotionRequired:true,
  truthfulBackendStates:true,
  uniqueMaterialGrammar:true,
};
