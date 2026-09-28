import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GalaxyExperience } from './galaxy/GalaxyExperience.jsx';
import { RitualExperience } from './rituals/RitualExperience.jsx';
import { ExperienceGallery } from './rituals/Gallery.jsx';
import { EXPERIENCE_MAP, selectedSlug } from './rituals/registry.js';
import './styles.css';
import './rituals/rituals.css';

function App(){
  const slug=selectedSlug();
  if(slug==='gallery')return <ExperienceGallery/>;
  const definition=EXPERIENCE_MAP[slug];
  if(!definition)return <ExperienceGallery/>;
  if(definition.ritual==='galaxy')return <GalaxyExperience/>;
  return <RitualExperience definition={definition}/>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode><App/></StrictMode>,
);
