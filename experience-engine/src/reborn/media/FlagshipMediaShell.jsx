import { useEffect, useMemo, useRef, useState } from 'react';
import { CinematicVideo, MediaChrome, useExperienceSoundtrack, useObjectUrl, useObjectUrls } from '../../system/ExperienceMedia.jsx';
import './flagshipMediaShell.css';

function useChildPhase(ref){
  const [phase,setPhase]=useState('');
  useEffect(()=>{
    const host=ref.current;if(!host)return;
    const read=()=>{
      const root=host.firstElementChild;if(!root)return;
      const token=[...root.classList].find(x=>x.startsWith('phase-'))||'';
      setPhase(token.replace('phase-',''));
    };
    read();
    const observer=new MutationObserver(read);observer.observe(host,{subtree:true,attributes:true,attributeFilter:['class']});
    return()=>observer.disconnect();
  },[]);
  return phase;
}

function FilmMemories({urls,kind,phase}){
  if(!urls.length)return null;
  const visible=kind==='memory'?['scrub','hold','finale'].includes(phase):kind==='ink'?['rewrite','finale'].includes(phase):['weave','knot','finale'].includes(phase);
  if(!visible)return null;
  return <div className={'fm-memory fm-'+kind+' phase-'+phase} aria-hidden="true">
    {urls.slice(0,4).map((src,i)=><figure key={src+i} style={{'--i':i}}><img src={src} alt=""/><i/><b/></figure>)}
  </div>;
}

function VideoPortal({kind,phase,onOpen,hasVideo}){
  if(!hasVideo)return null;
  const show=kind==='memory'?phase==='finale':kind==='ink'?phase==='finale':phase==='finale';
  if(!show)return null;
  const copy=kind==='memory'?'Yakuniy video':kind==='ink'?'Video xabar':'Wedding film';
  return <button className={'fm-video-portal '+kind} onClick={onOpen}><i/><span>▶</span><b>{copy}</b></button>;
}

export function FlagshipMediaShell({kind,content,media,children}){
  const host=useRef(null);const phase=useChildPhase(host);
  const videoUrl=useObjectUrl(media?.video||null);
  const photos=useObjectUrls(media?.photos||[]);
  const soundtrack=useExperienceSoundtrack({media,content,active:true});
  const [videoOpen,setVideoOpen]=useState(false);
  const poster=photos[0]||null;

  useEffect(()=>{
    const shouldStart=kind==='memory'?phase==='leader':kind==='ink'?phase==='diffuse':kind==='silk'?phase==='pull':false;
    if(shouldStart&&!soundtrack.playing)soundtrack.play();
  },[phase]);

  const title=useMemo(()=>kind==='memory'?'Memory Reel · private film':kind==='ink'?'Ink of Regret · private message':'Silk Heritage · wedding film',[kind]);

  return <div className={'flagship-media-shell kind-'+kind}>
    <div ref={host} className="fm-runtime">{children}</div>
    <FilmMemories urls={photos} kind={kind} phase={phase}/>
    <VideoPortal kind={kind} phase={phase} hasVideo={Boolean(videoUrl)} onOpen={()=>{soundtrack.stop();setVideoOpen(true)}}/>
    <MediaChrome soundtrack={soundtrack} videoUrl={videoUrl} onVideo={()=>{soundtrack.stop();setVideoOpen(true)}}/>
    <CinematicVideo src={videoUrl} poster={poster} open={videoOpen} onClose={()=>setVideoOpen(false)} title={title}/>
  </div>;
}
