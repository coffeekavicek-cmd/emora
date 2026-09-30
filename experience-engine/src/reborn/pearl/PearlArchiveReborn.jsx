import { useMemo, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import { PearlArchiveExperience } from './PearlArchiveExperience.jsx';
import './pearlArchiveMedia.css';
import './pearlFlagshipPolish.css';

export function PearlArchiveReborn({content:contentProp=null,media={},embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('love-pearl'),[contentProp]);
  const assets=useExperienceMedia(media);
  const [videoOpen,setVideoOpen]=useState(false);
  const photos=assets.photos;
  return <div className="pearl-archive-media">
    <PearlArchiveExperience content={content} embedded={embedded}/>
    <ExperienceSoundscape preset={content.musicPreset||'Nocturne'} customUrl={assets.music} startAt={content.musicStart||0}/>
    {!!photos.length&&<div className="pam-photos" aria-hidden="true">{photos.slice(0,4).map((src,i)=><figure key={src+i} style={{'--i':i}}><img src={src} alt=""/><i/></figure>)}</div>}
    {assets.video&&<button className="pam-video-open" onClick={()=>setVideoOpen(true)}><span>▶</span><b>private film</b></button>}
    {videoOpen&&<div className="pam-video-modal"><button className="pam-close" onClick={()=>setVideoOpen(false)}>×</button><div className="pam-video-frame"><ExperienceVideo src={assets.video} poster={photos[0]||assets.portrait} title="Private film" autoReveal/></div></div>}
  </div>;
}
