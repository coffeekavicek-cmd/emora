import { ARCHETYPE_RULES } from './archetypes.js';
import { TEMPLATE_MANIFEST } from './templateManifest.js';
import { editorFieldsFor } from './editorContract.js';
import { runtimePlan } from './runtimeContract.js';
import { contentToSearchParams, splitPublishPayload } from './contentModel.js';
import { ART_DIRECTION, QUALITY_CONTRACT } from './artDirectionManifest.js';

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
    if(!rule.preferredNavigation.includes(t.navigation)){
      errors.push(`${t.id}: navigation ${t.navigation} conflicts with archetype ${t.archetype}`);
    }
    const n=t.gestures?.length||0;
    if(n<rule.gestures.min||n>rule.gestures.max){
      errors.push(`${t.id}: ${n} gestures outside ${rule.gestures.min}-${rule.gestures.max} budget`);
    }
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
  else{
    for(const key of ['render','camera','material','hero','finale']){
      if(!art[key])errors.push(`${t.id}: art-direction field ${key} is missing`);
    }
  }
}

const expected=15;
const securityProbe={
  templateId:'love-pearl',recipient:'Test',message:'Hello',language:'uz',guestGreeting:'Hi',
  paragraphs:['a','b','c'],captions:['1','2','3'],final:'bye',wordLock:'secret-token',
};
const publicParams=contentToSearchParams(securityProbe).toString();
if(publicParams.includes('secret-token'))errors.push('Sensitive word lock leaked into public URL');
const split=splitPublishPayload(securityProbe);
if(JSON.stringify(split.publicContent).includes('secret-token'))errors.push('Sensitive word lock leaked into public content');

if(Object.keys(ART_DIRECTION).length!==expected){
  errors.push(`Expected ${expected} art-direction entries, found ${Object.keys(ART_DIRECTION).length}`);
}
if(QUALITY_CONTRACT.maxMeaningfulGestures!==3)errors.push('Quality contract gesture budget must stay at 3');
if(QUALITY_CONTRACT.noDocumentScroll!==true)errors.push('Quality contract must forbid document scroll');
if(QUALITY_CONTRACT.finalSceneMustTransformWorld!==true)errors.push('Quality contract must require world-transforming finales');

if(TEMPLATE_MANIFEST.length!==expected){
  errors.push(`Expected ${expected} templates, found ${TEMPLATE_MANIFEST.length}`);
}

if(errors.length){
  console.error('\nEMORA System V1 validation FAILED\n');
  for(const e of errors)console.error(' - '+e);
  process.exit(1);
}

const byArchetype=Object.groupBy
  ? Object.groupBy(TEMPLATE_MANIFEST,x=>x.archetype)
  : TEMPLATE_MANIFEST.reduce((a,x)=>((a[x.archetype]??=[]).push(x),a),{});

console.log('EMORA System V1 validation OK');
console.log('templates:',TEMPLATE_MANIFEST.length);
for(const [key,value] of Object.entries(byArchetype)){
  console.log(`  ${key}: ${value.length}`);
}
