import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { EXPERIENCE_MAP, selectedSlug } from './rituals/registry.js';
import { TEMPLATE_BY_ID } from './system/templateManifest.js';
import './styles.css';
import './rituals/rituals.css';

const ExperienceGallery=lazy(()=>import('./rituals/Gallery.jsx').then(m=>({default:m.ExperienceGallery})));
const CreatorEditor=lazy(()=>import('./system/CreatorEditor.jsx').then(m=>({default:m.CreatorEditor})));
const PearlMotionExperience=lazy(()=>import('./pearl/PearlMotionExperience.jsx').then(m=>({default:m.PearlMotionExperience})));
const GalaxyExperience=lazy(()=>import('./galaxy/GalaxyExperience.jsx').then(m=>({default:m.GalaxyExperience})));
const CinematicExperience=lazy(()=>import('./cinematic/CinematicExperience.jsx').then(m=>({default:m.CinematicExperience})));

function Loading(){
  return <div style={{
    position:'fixed',inset:0,display:'grid',placeItems:'center',
    background:'#0b0a0d',color:'#d7cbd2',
    fontFamily:'Georgia,serif',fontStyle:'italic',letterSpacing:'.04em'
  }}>emora.</div>;
}

function App(){
  const params=new URLSearchParams(location.search);
  const slug=selectedSlug();

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
