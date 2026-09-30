import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TEMPLATE_BY_ID } from './system/templateManifest.js';
import { EXPERIENCE_MAP, selectedSlug } from './rituals/registry.js';
import './styles.css';
import './rituals/rituals.css';

const PearlArchiveExperience=lazy(()=>import('./reborn/pearl/PearlArchiveExperience.jsx').then(m=>({default:m.PearlArchiveExperience})));
const MemoryReelReborn=lazy(()=>import('./reborn/memory/MemoryReelReborn.jsx').then(m=>({default:m.MemoryReelReborn})));
const InkRegretReborn=lazy(()=>import('./reborn/ink/InkRegretReborn.jsx').then(m=>({default:m.InkRegretReborn})));
const SilkHeritageReborn=lazy(()=>import('./reborn/silk/SilkHeritageReborn.jsx').then(m=>({default:m.SilkHeritageReborn})));
const GalaxyExperience=lazy(()=>import('./galaxy/GalaxyExperience.jsx').then(m=>({default:m.GalaxyExperience})));
const PearlPromiseExperience=lazy(()=>import('./proposal/PearlPromiseExperience.jsx').then(m=>({default:m.PearlPromiseExperience})));
const CinemaProposalExperience=lazy(()=>import('./proposal/CinemaProposalExperience.jsx').then(m=>({default:m.CinemaProposalExperience})));
const SkyPromiseExperience=lazy(()=>import('./proposal/SkyPromiseExperience.jsx').then(m=>({default:m.SkyPromiseExperience})));
const AuroraPaperExperience=lazy(()=>import('./birthday/AuroraPaperExperience.jsx').then(m=>({default:m.AuroraPaperExperience})));
const BalloonDreamExperience=lazy(()=>import('./birthday/BalloonDreamExperience.jsx').then(m=>({default:m.BalloonDreamExperience})));
const QuietRoomExperience=lazy(()=>import('./apology/QuietRoomExperience.jsx').then(m=>({default:m.QuietRoomExperience})));
const AfterRainExperience=lazy(()=>import('./apology/AfterRainExperience.jsx').then(m=>({default:m.AfterRainExperience})));
const RoseTheatreExperience=lazy(()=>import('./love/RoseTheatreExperience.jsx').then(m=>({default:m.RoseTheatreExperience})));
const NightGardenExperience=lazy(()=>import('./wedding/NightGardenExperience.jsx').then(m=>({default:m.NightGardenExperience})));
const HeritageNaqshExperience=lazy(()=>import('./wedding/HeritageNaqshExperience.jsx').then(m=>({default:m.HeritageNaqshExperience})));
const CinematicExperience=lazy(()=>import('./cinematic/CinematicExperience.jsx').then(m=>({default:m.CinematicExperience})));
const ExperienceGallery=lazy(()=>import('./rituals/Gallery.jsx').then(m=>({default:m.ExperienceGallery})));
const RebornCreatorEditor=lazy(()=>import('./reborn/editor/RebornCreatorEditor.jsx').then(m=>({default:m.RebornCreatorEditor})));

function Loading(){
  return <div style={{position:'fixed',inset:0,display:'grid',placeItems:'center',background:'#0b0a0d',color:'#d8ccd2',font:'12px Inter,system-ui',letterSpacing:'.14em'}}>EMORA</div>;
}

function App(){
  const params=new URLSearchParams(location.search);
  const slug=selectedSlug();
  useEffect(()=>{
    const name=TEMPLATE_BY_ID[slug]?.name||(slug==='gallery'?'Experiences':'EMORA');
    document.title=`EMORA · ${name}`;
  },[slug]);
  if(params.get('mode')==='editor'){
    const templateId=TEMPLATE_BY_ID[slug]?slug:'love-pearl';
    return <RebornCreatorEditor templateId={templateId}/>;
  }
  if(slug==='gallery')return <ExperienceGallery/>;
  if(slug==='love-pearl')return <PearlArchiveExperience/>;
  if(slug==='birthday-memory')return <MemoryReelReborn/>;
  if(slug==='apology-ink')return <InkRegretReborn/>;
  if(slug==='wedding-silk')return <SilkHeritageReborn/>;
  if(slug==='proposal-pearl')return <PearlPromiseExperience/>;
  if(slug==='proposal-cinema')return <CinemaProposalExperience/>;
  if(slug==='proposal-sky')return <SkyPromiseExperience/>;
  if(slug==='birthday-aurora')return <AuroraPaperExperience/>;
  if(slug==='birthday-balloon')return <BalloonDreamExperience/>;
  if(slug==='apology-quiet')return <QuietRoomExperience/>;
  if(slug==='apology-rain')return <AfterRainExperience definition={EXPERIENCE_MAP[slug]}/>;
  if(slug==='love-rose')return <RoseTheatreExperience/>;
  if(slug==='wedding-garden')return <NightGardenExperience/>;
  if(slug==='wedding-naqsh')return <HeritageNaqshExperience/>;
  const definition=EXPERIENCE_MAP[slug];
  if(!definition)return <ExperienceGallery/>;
  if(definition.ritual==='galaxy')return <GalaxyExperience/>;
  return <CinematicExperience definition={definition}/>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Suspense fallback={<Loading/>}><App/></Suspense></StrictMode>
);
