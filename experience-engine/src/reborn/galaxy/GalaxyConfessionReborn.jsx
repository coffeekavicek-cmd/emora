import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './galaxyConfessionReborn.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const FALLBACK='https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1400&q=80';

function StarCanvas({collapse=false,dawn=false}){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const ctx=c.getContext('2d');let raf=0,dead=false;
    const d=Math.min(devicePixelRatio||1,1.5),resize=()=>{c.width=c.clientWidth*d;c.height=c.clientHeight*d;ctx.setTransform(d,0,0,d,0,0)};resize();
    const stars=Array.from({length:150},()=>({x:Math.random(),y:Math.random(),z:.3+Math.random()*.9,r:.45+Math.random()*1.5,a:.3+Math.random()*.7,p:Math.random()*6.28}));
    const ro=new ResizeObserver(resize);ro.observe(c);
    const draw=now=>{if(dead)return;const w=c.clientWidth,h=c.clientHeight,t=now*.00035;ctx.clearRect(0,0,w,h);for(const s of stars){let x=s.x*w,y=s.y*h;if(collapse){const k=.965;x=w/2+(x-w/2)*k;y=h/2+(y-h/2)*k;s.x=(x/w);s.y=(y/h)}ctx.fillStyle=`rgba(${dawn?255:220},${dawn?226:232},255,${s.a*(.65+.35*Math.sin(t+s.p))})`;ctx.beginPath();ctx.arc(x,y,s.r*s.z,0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw);return()=>{dead=true;cancelAnimationFrame(raf);ro.disconnect()}
  },[collapse,dawn]);
  return <canvas ref={ref} className="gcr-stars" aria-hidden="true"/>;
}

export function GalaxyConfessionReborn({content:contentProp=null,media={},embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('love-galaxy'),[contentProp]);
  const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:[FALLBACK,FALLBACK,FALLBACK];
  const [phase,setPhase]=useState('void');const [found,setFound]=useState([]);const [videoDone,setVideoDone]=useState(false);
  const pick=i=>{if(found.includes(i)||phase!=='orbit')return;const next=[...found,i];setFound(next);try{navigator.vibrate?.([6])}catch{};if(next.length===3)setTimeout(()=>setPhase(assets.video?'signal':'collapse'),700)};
  useEffect(()=>{if(phase!=='collapse')return;const t=setTimeout(()=>setPhase('finale'),1800);return()=>clearTimeout(t)},[phase]);
  const continueFromVideo=()=>{setVideoDone(true);setPhase('collapse')};
  return <main className={'galaxy-confession-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <ExperienceSoundscape preset={content.musicPreset||'Dream'} customUrl={assets.music} startAt={content.musicStart||0}/>
    <StarCanvas collapse={phase==='collapse'} dawn={phase==='finale'}/><div className="gcr-nebula"/><div className="gcr-grain"/>
    <header className="gcr-chrome"><a href="?">emora<span>.</span></a><small>GALAXY CONFESSION · PRIVATE CONSTELLATION</small><b>{phase==='void'?'00':phase==='orbit'?'01':phase==='signal'?'02':phase==='collapse'?'03':'04'}</b></header>
    <section className="gcr-stage gcr-void"><article><p>ONE PERSON · THREE STARS</p><h1>{content.message||'Bu osmon tasodifan senga o‘xshab qolmagan.'}</h1><em>{content.recipient}</em><button onClick={()=>setPhase('orbit')}>Gravitatsiyani uyg‘otish →</button></article></section>
    <section className="gcr-stage gcr-orbit"><div className="gcr-orbit-copy"><p>01 · FIND THE SIGNALS</p><h2>Uchta yulduzni top.</h2><span>Har birida bitta xotira bor.</span></div>{[0,1,2].map((i)=><button key={i} className={'gcr-star s'+i+' '+(found.includes(i)?'found':'')} onClick={()=>pick(i)} aria-label={(i+1)+'-yulduzni ochish'}><i/><b/></button>)}<div className="gcr-memory-ring">{found.map(i=><figure key={i} className={'m'+i}><img src={photos[i%photos.length]} alt=""/><figcaption>{content.captions?.[i]||['Birinchi signal.','Ikkinchi signal.','Uchinchi signal.'][i]}</figcaption></figure>)}</div></section>
    <section className="gcr-stage gcr-signal"><div className="gcr-video-shell"><p>02 · HIDDEN TRANSMISSION</p><ExperienceVideo src={assets.video} poster={photos[1]} title="Private transmission" autoReveal onEnded={continueFromVideo}/><button onClick={continueFromVideo}>Signalni yopish →</button></div></section>
    <section className="gcr-stage gcr-collapse"><div className="gcr-core"><i/><b/><span/></div><p>GRAVITY IS PULLING EVERYTHING IN</p></section>
    <section className="gcr-stage gcr-finale"><div className="gcr-portrait"><img src={assets.portrait||photos[0]} alt=""/><i/></div><article><p>WHAT REMAINED AFTER THE COLLAPSE</p><h2>{content.recipient}</h2><span>{content.final||'Hamma narsa yo‘qolsa ham, men tanlaydigan markaz — sensan.'}</span><button onClick={()=>location.reload()}>Qayta ko‘rish ↺</button></article></section>
  </main>;
}
