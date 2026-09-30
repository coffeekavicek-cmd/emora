import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TEMPLATE_BY_ID } from './system/templateManifest.js';
import { EXPERIENCE_MAP, selectedSlug } from './rituals/registry.js';
import './styles.css';
import './rituals/rituals.css';

const PearlArchiveReborn=lazy(()=>import('./reborn/pearl/PearlArchiveReborn.jsx').then(m=>({default:m.PearlArchiveReborn})));
const MemoryReelReborn=lazy(()=>import('./reborn/memory/MemoryReelReborn.jsx').then(m=>({default:m.MemoryReelReborn})));
const AuroraPaperReborn=lazy(()=>import('./reborn/birthday/AuroraPaperReborn.jsx').then(m=>({default:m.AuroraPaperReborn})));
const BalloonDreamReborn=lazy(()=>import('./reborn/birthday/BalloonDreamReborn.jsx').then(m=>({default:m.BalloonDreamReborn})));
const InkRegretReborn=lazy(()=>import('./reborn/ink/InkRegretReborn.jsx').then(m=>({default:m.InkRegretReborn})));
const QuietRoomReborn=lazy(()=>import('./reborn/quiet/QuietRoomReborn.jsx').then(m=>({default:m.QuietRoomReborn})));
const AfterRainReborn=lazy(()=>import('./reborn/rain/AfterRainReborn.jsx').then(m=>({default:m.AfterRainReborn})));
const SilkHeritageReborn=lazy(()=>import('./reborn/silk/SilkHeritageReborn.jsx').then(m=>({default:m.SilkHeritageReborn})));
const HeritageNaqshReborn=lazy(()=>import('./reborn/wedding/HeritageNaqshReborn.jsx').then(m=>({default:m.HeritageNaqshReborn})));
const NightGardenReborn=lazy(()=>import('./reborn/wedding/NightGardenReborn.jsx').then(m=>({default:m.NightGardenReborn})));
const GalaxyConfessionReborn=lazy(()=>import('./reborn/galaxy/GalaxyConfessionReborn.jsx').then(m=>({default:m.GalaxyConfessionReborn})));
const RoseTheatreReborn=lazy(()=>import('./reborn/love/RoseTheatreReborn.jsx').then(m=>({default:m.RoseTheatreReborn})));
const PearlPromiseReborn=lazy(()=>import('./reborn/proposal/PearlPromiseReborn.jsx').then(m=>({default:m.PearlPromiseReborn})));
const CinemaProposalReborn=lazy(()=>import('./reborn/proposal/CinemaProposalReborn.jsx').then(m=>({default:m.CinemaProposalReborn})));
const SkyPromiseReborn=lazy(()=>import('./reborn/proposal/SkyPromiseReborn.jsx').then(m=>({default:m.SkyPromiseReborn})));
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
  if(slug==='love-pearl')return <PearlArchiveReborn/>;
  if(slug==='love-galaxy')return <GalaxyConfessionReborn/>;
  if(slug==='love-rose')return <RoseTheatreReborn/>;
  if(slug==='birthday-memory')return <MemoryReelReborn/>;
  if(slug==='birthday-aurora')return <AuroraPaperReborn/>;
  if(slug==='birthday-balloon')return <BalloonDreamReborn/>;
  if(slug==='apology-ink')return <InkRegretReborn/>;
  if(slug==='apology-quiet')return <QuietRoomReborn/>;
  if(slug==='apology-rain')return <AfterRainReborn/>;
  if(slug==='wedding-silk')return <SilkHeritageReborn/>;
  if(slug==='wedding-naqsh')return <HeritageNaqshReborn/>;
  if(slug==='wedding-garden')return <NightGardenReborn/>;
  if(slug==='proposal-pearl')return <PearlPromiseReborn/>;
  if(slug==='proposal-cinema')return <CinemaProposalReborn/>;
  if(slug==='proposal-sky')return <SkyPromiseReborn/>;
  const definition=EXPERIENCE_MAP[slug];
  if(!definition)return <ExperienceGallery/>;
  return <CinematicExperience definition={definition}/>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Suspense fallback={<Loading/>}><App/></Suspense></StrictMode>
);
