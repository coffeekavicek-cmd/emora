import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GalaxyExperience } from './galaxy/GalaxyExperience.jsx';
import { PearlMotionExperience } from './pearl/PearlMotionExperience.jsx';
import { CinematicExperience } from './cinematic/CinematicExperience.jsx';
import { ExperienceGallery } from './rituals/Gallery.jsx';
import { CreatorEditor } from './system/CreatorEditor.jsx';
import { TEMPLATE_BY_ID } from './system/templateManifest.js';
import { EXPERIENCE_MAP, selectedSlug } from './rituals/registry.js';
import './styles.css';
import './rituals/rituals.css';

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

createRoot(document.getElementById('root')).render(<StrictMode><App/></StrictMode>);
