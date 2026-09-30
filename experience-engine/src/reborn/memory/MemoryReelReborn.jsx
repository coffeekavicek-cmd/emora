import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, MediaFilmstrip, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './memoryReelReborn.css';

const FALLBACKS=[
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function pulse(strong=false){try{navigator.vibrate?.(strong?[12,18,20]:[6])}catch{}}

function FilmBurn({active,onDone}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!active||!ref.current)return;
    const canvas=ref.current,ctx=canvas.getContext('2d');let raf=0,dead=false;
    const d=Math.min(devicePixelRatio||1,1.5),w=canvas.clientWidth,h=canvas.clientHeight;
    canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);
    const start=performance.now();
    const draw=now=>{
      if(dead)return;
      const t=clamp((now-start)/1900,0,1),r=Math.hypot(w,h)*(.035+t*.86),cx=w*.53,cy=h*.47;
      ctx.clearRect(0,0,w,h);
      const g=ctx.createRadialGradient(cx,cy,Math.max(0,r-90),cx,cy,r+70);
      g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,`rgba(255,236,180,${.12+t*.2})`);g.addColorStop(.66,`rgba(255,169,74,${.35+t*.55})`);g.addColorStop(.78,`rgba(113,32,8,${.45+t*.45})`);g.addColorStop(.91,'rgba(5,2,1,.95)');g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      for(let i=0;i<46;i++){const a=i*.77+t*4.2,rr=r*(.62+(i%9)*.032);ctx.fillStyle=`rgba(255,205,121,${.05+(1-t)*.13})`;ctx.beginPath();ctx.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,1+(i%3),0,Math.PI*2);ctx.fill()}
      if(t<1)raf=requestAnimationFrame(draw);else setTimeout(()=>onDone?.(),180);
    };
    raf=requestAnimationFrame(draw);return()=>{dead=true;cancelAnimationFrame(raf)};
  },[active,onDone]);
  return <canvas ref={ref} className="mrr-burn" aria-hidden="true"/>;
}

export function MemoryReelReborn({content:contentProp=null,media={},embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('birthday-memory'),[contentProp]);
  const assets=useExperienceMedia(media);
  const photos=assets.photos.length?assets.photos:FALLBACKS;
  const [phase,setPhase]=useState('leader');
  const [thread,setThread]=useState(0);
  const [scrub,setScrub]=useState(0);
  const [burn,setBurn]=useState(false);
  const drag=useRef(null);
  const activeIndex=Math.min(photos.length-1,Math.floor(scrub*Math.max(1,photos.length)));

  useEffect(()=>{const t=setTimeout(()=>setPhase('thread'),1200);return()=>clearTimeout(t)},[]);
  const threadDown=e=>{drag.current={x:e.clientX,p:thread};e.currentTarget.setPointerCapture?.(e.pointerId)};
  const threadMove=e=>{
    if(!drag.current||phase!=='thread')return;
    const p=clamp(drag.current.p+(e.clientX-drag.current.x)/Math.max(220,innerWidth*.48),0,1);setThread(p);
    if(p>.97){drag.current=null;pulse(true);setPhase('play')}
  };
  useEffect(()=>{if(phase!=='play')return;const t=setTimeout(()=>setPhase('archive'),2100);return()=>clearTimeout(t)},[phase]);
  const scrubDown=e=>{drag.current={x:e.clientX,p:scrub};e.currentTarget.setPointerCapture?.(e.pointerId)};
  const scrubMove=e=>{
    if(!drag.current||phase!=='archive')return;
    const p=clamp(drag.current.p+(e.clientX-drag.current.x)/Math.max(280,innerWidth*.6),0,1);setScrub(p);
    if(p>.98){drag.current=null;pulse(true);setPhase(assets.video?'lost-frame':'jam')}
  };
  const finishVideo=()=>setPhase('jam');
  useEffect(()=>{if(phase!=='jam')return;const t=setTimeout(()=>setBurn(true),650);return()=>clearTimeout(t)},[phase]);

  return <main className={'memory-reel-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase} style={{'--thread':thread,'--scrub':scrub}}>
    <ExperienceSoundscape preset={content.musicPreset||'Cinema'} customUrl={assets.music} startAt={content.musicStart||0} active={phase!=='finale'}/>
    <div className="mrr-grain"/><div className="mrr-vignette"/>
    <header className="mrr-chrome"><a href="?">emora<span>.</span></a><small>MEMORY REEL · PRIVATE CUT</small><b>{phase==='leader'?'00':phase==='thread'?'01':phase==='play'?'02':phase==='archive'?'03':phase==='lost-frame'?'04':'05'}</b></header>

    <section className="mrr-stage mrr-leader"><div className="mrr-count"><span>3</span><span>2</span><span>1</span></div><article><p>A FILM THAT ONLY ONE PERSON CAN WATCH</p><h1>{content.recipient}</h1></article></section>

    <section className="mrr-stage mrr-thread">
      <div className="mrr-projector"><div className="mrr-reel r1"><i/><i/><i/><i/><i/></div><div className="mrr-reel r2"><i/><i/><i/><i/><i/></div><div className="mrr-projector-body"/><div className="mrr-beam"/></div>
      <article><p>01 · THREAD THE REEL</p><h2>{content.message||'Bu film xotiralardan yig‘ilgan.'}</h2><span>Filmni proyektorga kiriting.</span></article>
      <button className="mrr-thread-track" aria-label="Film lentasini proyektorga torting" onPointerDown={threadDown} onPointerMove={threadMove} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><i/><b/><span>filmni torting →</span></button>
    </section>

    <section className="mrr-stage mrr-play">
      <div className="mrr-gate"><img src={photos[0]} alt=""/><i/><b/></div><div className="mrr-play-copy"><p>ROLLING · 24 FPS</p><h2>{content.captions?.[0]||'Birinchi kadr.'}</h2></div>
    </section>

    <section className="mrr-stage mrr-archive">
      <div className="mrr-archive-head"><p>03 · THE ARCHIVE</p><h2>Vaqtni o‘zing aylantir.</h2></div>
      <div className="mrr-strip-wrap" style={{transform:`translateX(${-scrub*46}vw)`}}><MediaFilmstrip photos={photos} captions={content.captions||[]} activeIndex={activeIndex} className="mrr-filmstrip"/></div>
      <button className="mrr-scrub" aria-label="Film xotiralarini o‘ngga suring" onPointerDown={scrubDown} onPointerMove={scrubMove} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><i/><b/><span>{Math.round(scrub*100)}%</span></button>
    </section>

    <section className="mrr-stage mrr-lost-frame"><div className="mrr-video-shell"><div className="mrr-perf top"/><ExperienceVideo src={assets.video} poster={photos[activeIndex]} title="Yashirin video kadr" autoReveal onEnded={finishVideo}/><div className="mrr-perf bottom"/></div><p>LOST FRAME · FOUND</p><button onClick={finishVideo}>Davom etish →</button></section>

    <section className="mrr-stage mrr-jam"><div className="mrr-jam-frame"><img src={photos[activeIndex]} alt=""/><i/></div><p>THE FILM STOPS HERE</p></section>
    {burn&&<FilmBurn active onDone={()=>setPhase('finale')}/>} 

    <section className="mrr-stage mrr-finale"><article><p>END CREDITS / NEW CHAPTER</p><h2>{content.recipient}</h2><span>{content.final||'Eng yaxshi kadr hali olinmagan.'}</span><button onClick={()=>location.reload()}>Qayta ko‘rish ↺</button></article></section>
  </main>;
}
