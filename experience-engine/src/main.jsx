import { StrictMode, Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TEMPLATE_BY_ID } from './system/templateManifest.js';
import { EXPERIENCE_MAP, selectedSlug } from './rituals/registry.js';
import './styles.css';
import './rituals/rituals.css';

const PearlMotionExperience=lazy(()=>import('./pearl/PearlMotionExperience.jsx').then(m=>({default:m.PearlMotionExperience})));
const GalaxyExperience=lazy(()=>import('./galaxy/GalaxyExperience.jsx').then(m=>({default:m.GalaxyExperience})));
const CinematicExperience=lazy(()=>import('./cinematic/CinematicExperience.jsx').then(m=>({default:m.CinematicExperience})));
const ExperienceGallery=lazy(()=>import('./rituals/Gallery.jsx').then(m=>({default:m.ExperienceGallery})));
const CreatorEditor=lazy(()=>import('./system/CreatorEditor.jsx').then(m=>({default:m.CreatorEditor})));

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
    return <CreatorEditor templateId={templateId}/>;
  }
  if(slug==='gallery')return <ExperienceGallery/>;
  if(slug==='love-pearl')return <PearlMotionExperience/>;
  const definition=EXPERIENCE_MAP[slug];
  if(!definition)return <ExperienceGallery/>;
  if(definition.ritual==='galaxy')return <GalaxyExperience/>;
  return <CinematicExperience definition={definition}/>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode><Suspense fallback={<Loading/>}><App/></Suspense></StrictMode>
);
