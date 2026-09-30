import { ARCHETYPE_RULES } from './archetypes.js';
import { TEMPLATE_MANIFEST } from './templateManifest.js';
import { contentToSearchParams, splitPublishPayload } from './contentModel.js';
import { ART_DIRECTION, QUALITY_CONTRACT } from './artDirectionManifest.js';
import { REBORN_SCENARIOS_V2 } from '../reborn/scenarios/rebornScenariosV2.js';
import { FLAGSHIP_IDS, FLAGSHIP_META } from '../reborn/flagships.js';

const errors=[];
const ids=new Set();
const signatureMoments=new Set();
const dbSlugs=new Set();
const releaseStates=new Set(['concept','art-directed','motion-alpha','review','approved','published']);

for(const t of TEMPLATE_MANIFEST){
  if(ids.has(t.id))errors.push(`Duplicate template id: ${t.id}`);
  ids.add(t.id);
  if(!releaseStates.has(t.releaseStatus))errors.push(`${t.id}: invalid releaseStatus ${t.releaseStatus}`);
  if(!t.dbSlug)errors.push(`${t.id}: missing dbSlug`);
  else if(dbSlugs.has(t.dbSlug))errors.push(`${t.id}: duplicate dbSlug ${t.dbSlug}`);
  else dbSlugs.add(t.dbSlug);

  if(!ARCHETYPE_RULES[t.archetype])errors.push(`${t.id}: unknown archetype ${t.archetype}`);
  const rule=ARCHETYPE_RULES[t.archetype];
  if(rule){
    if(!rule.preferredNavigation.includes(t.navigation))errors.push(`${t.id}: navigation ${t.navigation} conflicts with archetype ${t.archetype}`);
    const n=t.gestures?.length||0;
    if(n<rule.gestures.min||n>rule.gestures.max)errors.push(`${t.id}: ${n} gestures outside ${rule.gestures.min}-${rule.gestures.max} budget`);
  }

  if(!t.signatureMoment||t.signatureMoment.length<24)errors.push(`${t.id}: signature moment is missing/too vague`);
  const normalized=(t.signatureMoment||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  if(signatureMoments.has(normalized))errors.push(`${t.id}: duplicate signature moment`);
  signatureMoments.add(normalized);

  if(!t.metaphor)errors.push(`${t.id}: missing metaphor`);
  if(!t.primaryMedia)errors.push(`${t.id}: missing primaryMedia`);
  if(!Array.isArray(t.capabilities))errors.push(`${t.id}: capabilities must be an array`);
  if(!t.assets?.required?.length)errors.push(`${t.id}: at least one required asset is required`);
  if(!t.finale)errors.push(`${t.id}: missing finale`);
  if(!t.engine?.length)errors.push(`${t.id}: missing engine declaration`);

  const dpr=t.performance?.maxDpr;
  if(typeof dpr!=='number'||dpr>2)errors.push(`${t.id}: maxDpr must be <= 2`);

  const art=ART_DIRECTION[t.id];
  if(!art)errors.push(`${t.id}: missing art-direction contract`);
  else for(const key of ['render','camera','material','hero','finale','signature3d','lighting','sound','silenceBeat','antiGeneric']){
    if(!art[key])errors.push(`${t.id}: art-direction field ${key} is missing`);
  }
}

const expected=15;
const securityProbe={templateId:'love-pearl',recipient:'Test',message:'Hello',language:'uz',guestGreeting:'Hi',paragraphs:['a','b','c'],captions:['1','2','3'],final:'bye',wordLock:'secret-token'};
const publicParams=contentToSearchParams(securityProbe).toString();
if(publicParams.includes('secret-token'))errors.push('Sensitive word lock leaked into public URL');
const split=splitPublishPayload(securityProbe);
if(JSON.stringify(split.publicContent).includes('secret-token'))errors.push('Sensitive word lock leaked into public content');

if(Object.keys(ART_DIRECTION).length!==expected)errors.push(`Expected ${expected} art-direction entries, found ${Object.keys(ART_DIRECTION).length}`);
if(Object.keys(REBORN_SCENARIOS_V2).length!==expected)errors.push(`Expected ${expected} Reborn V2 scenarios, found ${Object.keys(REBORN_SCENARIOS_V2).length}`);
if(QUALITY_CONTRACT.maxMeaningfulGestures!==3)errors.push('Quality contract gesture budget must stay at 3');
if(QUALITY_CONTRACT.noDocumentScroll!==true)errors.push('Quality contract must forbid document scroll');
if(QUALITY_CONTRACT.finalSceneMustTransformWorld!==true)errors.push('Quality contract must require world-transforming finales');
if(QUALITY_CONTRACT.physicalConsequenceForEveryGesture!==true)errors.push('Quality contract must require physical consequences');
if(QUALITY_CONTRACT.deliberateSilenceBeforeFinale!==true)errors.push('Quality contract must require a silence/stillness beat');
if(QUALITY_CONTRACT.reducedMotionRequired!==true)errors.push('Quality contract must require reduced-motion support');

// Deep cinematic validation applies to the five product flagships. The other
// ten templates remain reference/prototype material and only keep base schema checks.
for(const id of FLAGSHIP_IDS){
  const t=TEMPLATE_MANIFEST.find(x=>x.id===id);
  const scenario=REBORN_SCENARIOS_V2[id];
  if(!t){errors.push(`Flagship ${id}: missing from template manifest`);continue}
  if(!scenario){errors.push(`${id}: missing Reborn V2 scenario`);continue}

  for(const key of ['title','world','hook','mediaRole','finale']){
    if(!scenario[key]||String(scenario[key]).length<12)errors.push(`${id}: Reborn V2 field ${key} is missing/too vague`);
  }
  if(!scenario.secondary||String(scenario.secondary).length<6)errors.push(`${id}: Reborn V2 field secondary is missing/too vague`);
  if(!Array.isArray(scenario.engine)||scenario.engine.length<2)errors.push(`${id}: Reborn V2 needs at least two declared engines`);
  if(scenario.beats?.length!==8)errors.push(`${id}: Reborn V2 scenario must contain exactly 8 beats`);

  const beatTypes=new Set((scenario.beats||[]).map(x=>x.type));
  for(const required of ['opening','gesture','turn','finale','afterglow']){
    if(!beatTypes.has(required))errors.push(`${id}: Reborn V2 scenario missing ${required} beat`);
  }

  const gestures=(scenario.beats||[]).filter(x=>x.type==='gesture');
  if(gestures.length<1||gestures.length>3)errors.push(`${id}: Reborn V2 must use 1-3 meaningful gestures`);
  for(const beat of gestures){
    if(!beat.gesture)errors.push(`${id}/${beat.id}: gesture id missing`);
    if(!beat.consequence||beat.consequence.length<12)errors.push(`${id}/${beat.id}: physical consequence missing/too vague`);
  }

  const turn=(scenario.beats||[]).find(x=>x.type==='turn');
  if(!turn?.copy||turn.copy.length<24)errors.push(`${id}: false-ending/turn beat is too weak`);
  const finale=(scenario.beats||[]).find(x=>x.type==='finale');
  if(!finale?.copy||finale.copy.length<28)errors.push(`${id}: world-transforming finale is too weak`);
  if(!/photo|video|media|uploaded|rasm|film|memory/i.test(scenario.mediaRole))errors.push(`${id}: mediaRole must explicitly integrate user media`);
}

if(TEMPLATE_MANIFEST.length!==expected)errors.push(`Expected ${expected} templates, found ${TEMPLATE_MANIFEST.length}`);

const flagshipCategories=new Set();
if(FLAGSHIP_IDS.length!==5)errors.push(`Flagship product must expose exactly 5 templates, found ${FLAGSHIP_IDS.length}`);
for(const id of FLAGSHIP_IDS){
  const t=TEMPLATE_MANIFEST.find(x=>x.id===id);
  const meta=FLAGSHIP_META[id];
  if(!t){errors.push(`Flagship ${id}: missing from template manifest`);continue}
  if(flagshipCategories.has(t.category))errors.push(`Flagship ${id}: duplicate category ${t.category}`);
  flagshipCategories.add(t.category);
  if(!meta?.promise||meta.promise.length<28)errors.push(`Flagship ${id}: flagship promise missing/too vague`);
  if(!Array.isArray(meta?.engine)||meta.engine.length<2)errors.push(`Flagship ${id}: flagship engine stack is incomplete`);
  if(!REBORN_SCENARIOS_V2[id])errors.push(`Flagship ${id}: no Reborn V2 scenario`);
}
if(flagshipCategories.size!==5)errors.push(`Flagship product must cover 5 unique categories, found ${flagshipCategories.size}`);

if(errors.length){
  console.error('\nEMORA Reborn V2 validation FAILED\n');
  for(const e of errors)console.error(' - '+e);
  process.exit(1);
}

const byArchetype=Object.groupBy
  ? Object.groupBy(TEMPLATE_MANIFEST,x=>x.archetype)
  : TEMPLATE_MANIFEST.reduce((a,x)=>((a[x.archetype]??=[]).push(x),a),{});

console.log('EMORA Reborn V2 validation OK');
console.log('templates:',TEMPLATE_MANIFEST.length);
console.log('flagships:',FLAGSHIP_IDS.join(', '));
for(const [key,value] of Object.entries(byArchetype))console.log(`  ${key}: ${value.length}`);
