import { EXPERIENCE_ARCHETYPES as A } from './archetypes.js';

export const ENGINE_FAMILY = Object.freeze({
  RITUAL:'ritual-runtime',
  WORLD:'world-runtime',
  EDITORIAL:'editorial-runtime',
  CINEMATIC:'cinematic-runtime',
  FORMAL:'formal-runtime',
  ATMOSPHERIC:'atmospheric-runtime',
});

export function engineFamilyFor(template){
  switch(template.archetype){
    case A.RITUAL_OBJECT:return ENGINE_FAMILY.RITUAL;
    case A.LIVING_WORLD:return ENGINE_FAMILY.WORLD;
    case A.EDITORIAL_STORY:return ENGINE_FAMILY.EDITORIAL;
    case A.CINEMATIC_MEMORY:return ENGINE_FAMILY.CINEMATIC;
    case A.FORMAL_ONE_SCREEN:return ENGINE_FAMILY.FORMAL;
    case A.ATMOSPHERIC_MINIMAL:return ENGINE_FAMILY.ATMOSPHERIC;
    default:throw new Error('Unknown archetype: '+template.archetype);
  }
}

export function runtimePlan(template){
  return {
    templateId:template.id,
    family:engineFamilyFor(template),
    navigation:template.navigation,
    engines:template.engine,
    assets:template.assets,
    performance:template.performance,
    gestures:template.gestures,
    finale:template.finale,
  };
}
