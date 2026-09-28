import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GalaxyExperience } from './galaxy/GalaxyExperience.jsx';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GalaxyExperience />
  </StrictMode>,
);
