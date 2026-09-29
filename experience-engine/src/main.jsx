import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { TEMPLATE_BY_ID } from './system/templateManifest.js';
import { EXPERIENCE_MAP, selectedSlug } from './rituals/registry.js';
import './styles.css';
import './rituals/rituals.css';

const GalaxyExperience=lazy(()=>import('./galaxy/GalaxyExperience.jsx').then(m=>({default:m.GalaxyExperience})));
const PearlMotionExperience=lazy(()=>import('./pearl/PearlMotionExperience.jsx').then(m=>({default:m.PearlMotionExperience})));
const CinematicExperience=lazy(()=>import('./cinematic/CinematicExperience.jsx').then(m=>({default:m.CinematicExperience})));
const ExperienceGallery=lazy(()=>import('./rituals/Gallery.jsx').then(m=>({default:m.ExperienceGallery})));
const CreatorEditor=lazy(()=>import('./system/CreatorEditor.jsx').then(m=>({default:m.CreatorEditor})));

function Loading(){
  return <div style={{position:'fixed',inset:0,display:'grid',placeItems:'center',background:'#0b0a0d',color:'#d7cbd2',font:'11px Inter,system-ui',letterSpacing:'.16em'}}>EMORA</div>;
}

function App(){
  const params=new URLSearchParams(location.search);
  const slug=selectedSlug();

  let content;
  if(params.get('mode')==='editor'){
    const templateId=TEMPLATE_BY_ID[slug]?slug:'love-pearl';
    content=<CreatorEditor templateId={templateId}/>;
  }else if(slug==='gallery'){
    content=<ExperienceGallery/>;
  }else if(slug==='love-pearl'){
    content=<PearlMotionExperience/>;
  }else{
    const definition=EXPERIENCE_MAP[slug];
    if(!definition)content=<ExperienceGallery/>;
    else if(definition.ritual==='galaxy')content=<GalaxyExperience/>;
    else content=<CinematicExperience definition={definition}/>;
  }

  return <Suspense fallback={<Loading/>}>{content}</Suspense>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>);
