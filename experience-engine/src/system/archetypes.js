export const EXPERIENCE_ARCHETYPES = Object.freeze({
  RITUAL_OBJECT: 'ritual-object',
  LIVING_WORLD: 'living-world',
  EDITORIAL_STORY: 'editorial-story',
  CINEMATIC_MEMORY: 'cinematic-memory',
  FORMAL_ONE_SCREEN: 'formal-one-screen',
  ATMOSPHERIC_MINIMAL: 'atmospheric-minimal',
});

export const NAVIGATION_MODES = Object.freeze({
  RITUAL: 'ritual',
  WORLD: 'world',
  SCROLL: 'scroll',
  PAGINATED: 'paginated',
  TIMELINE: 'timeline',
  SINGLE: 'single',
});

export const ARCHETYPE_RULES = Object.freeze({
  [EXPERIENCE_ARCHETYPES.RITUAL_OBJECT]: {
    gestures: { min: 1, max: 3 },
    preferredNavigation: [NAVIGATION_MODES.RITUAL],
    heavyEngine: 'optional',
    principle: 'One hero object; every gesture has a physical consequence.',
  },
  [EXPERIENCE_ARCHETYPES.LIVING_WORLD]: {
    gestures: { min: 1, max: 4 },
    preferredNavigation: [NAVIGATION_MODES.WORLD],
    heavyEngine: 'required',
    principle: 'Manipulate the environment, not UI controls.',
  },
  [EXPERIENCE_ARCHETYPES.EDITORIAL_STORY]: {
    gestures: { min: 0, max: 2 },
    preferredNavigation: [NAVIGATION_MODES.SCROLL, NAVIGATION_MODES.PAGINATED],
    heavyEngine: 'avoid',
    principle: 'Typography, illustration and material carry the story.',
  },
  [EXPERIENCE_ARCHETYPES.CINEMATIC_MEMORY]: {
    gestures: { min: 1, max: 3 },
    preferredNavigation: [NAVIGATION_MODES.TIMELINE],
    heavyEngine: 'optional',
    principle: 'Media and time are the primary narrative medium.',
  },
  [EXPERIENCE_ARCHETYPES.FORMAL_ONE_SCREEN]: {
    gestures: { min: 0, max: 1 },
    preferredNavigation: [NAVIGATION_MODES.SINGLE],
    heavyEngine: 'avoid',
    principle: 'Restraint, hierarchy and ornament are the experience.',
  },
  [EXPERIENCE_ARCHETYPES.ATMOSPHERIC_MINIMAL]: {
    gestures: { min: 1, max: 1 },
    preferredNavigation: [NAVIGATION_MODES.RITUAL, NAVIGATION_MODES.SINGLE],
    heavyEngine: 'avoid',
    principle: 'One environmental change delivers the emotion.',
  },
});

export const PRODUCT_CAPABILITIES = Object.freeze({
  GUEST_GREETING: 'guestGreeting',
  RSVP: 'rsvp',
  MAP: 'map',
  CALENDAR: 'calendar',
  MUSIC: 'music',
  PHOTOS: 'photos',
  VIDEO: 'video',
  PORTRAIT: 'portrait',
  SAVE: 'save',
  SHARE: 'share',
  OPEN_TIMER: 'openTimer',
  WORD_LOCK: 'wordLock',
  RESPONSE: 'response',
  VIEW_EVENTS: 'viewEvents',
  GUEST_LINKS: 'guestLinks',
});
