import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './silkHeritageReborn.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const FALLBACKS=[
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=80'
];
function pulse(strong=false){try{navigator.vibrate?.(strong?[10,16,12]:[5])}catch{}}

function GoldThread({progress}){
  return <svg className="shr-thread" viewBox="0 0 1000 620" aria-hidden="true"><defs><filter id="shrGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path pathLength="1" style={{strokeDashoffset:1-progress}} d="M75 485 C165 420 197 455 276 345 C355 236 433 214 522 248 C615 283 657 377 597 445 C539 511 440 490 399 418 C356 342 401 276 474 281 C544 286 575 351 545 398 C517 442 459 439 440 396 C422 355 450 325 483 330"/><path className="tail" pathLength="1" style={{strokeDashoffset:1-progress}} d="M483 330 C590 250 719 234 910 148"/></svg>;
}

export function SilkHeritageReborn({content:contentProp=null,media={},embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('wedding-silk'),[contentProp]);
  const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;
  const [phase,setPhase]=useState('loom');const [pull,setPull]=useState(0);const [stitch,setStitch]=useState(0);const [medallion,setMedallion]=useState(0);const drag=useRef(null);
  const beginPull=e=>{drag.current={x:e.clientX,p:pull};e.currentTarget.setPointerCapture?.(e.pointerId)};
  const movePull=e=>{if(!drag.current||phase!=='loom')return;const p=clamp(drag.current.p+(e.clientX-drag.current.x)/Math.max(240,innerWidth*.46),0,1);setPull(p);if(p>.97){drag.current=null;pulse(true);setPhase('stitch')}};
  useEffect(()=>{if(phase!=='stitch')return;let raf=0;const start=performance.now();const loop=now=>{const p=clamp((now-start)/4200,0,1);setStitch(p);if(p<1)raf=requestAnimationFrame(loop);else setTimeout(()=>setPhase('gallery'),500)};raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf)},[phase]);
  const nextMedallion=()=>{const n=Math.min(3,medallion+1);setMedallion(n);pulse();if(n===3)setTimeout(()=>setPhase(assets.video?'veil':'invitation'),650)};
  return <main className={'silk-heritage-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase} style={{'--pull':pull,'--stitch':stitch}}>
    <ExperienceSoundscape preset={content.musicPreset||'Heritage'} customUrl={assets.music} startAt={content.musicStart||0}/>
    <div className="shr-depth"><i/><i/><i/></div><div className="shr-grain"/><div className="shr-vignette"/>
    <header className="shr-chrome"><a href="?">emora<span>.</span></a><small>SILK HERITAGE · THE LOOM</small><b>{phase==='loom'?'00':phase==='stitch'?'01':phase==='gallery'?'02':phase==='veil'?'03':'04'}</b></header>

    <section className="shr-stage shr-loom"><div className="shr-drape"><div className="shr-weave"/><div className="shr-fold f1"/><div className="shr-fold f2"/><div className="shr-fold f3"/></div><article><p>ONE LOOSE THREAD · ONE CEREMONY</p><h1>{content.message||'Ba’zan butun naqsh bitta ipdan boshlanadi.'}</h1><em>{content.recipient}</em></article><button className="shr-pull" aria-label="Ipak ipini o‘ngga torting" onPointerDown={beginPull} onPointerMove={movePull} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><i/><b/><span>ipni torting →</span></button></section>

    <section className="shr-stage shr-stitch"><GoldThread progress={stitch}/><div className="shr-stitch-copy"><p>01 · GOLD THREAD</p><h2 className={stitch>.25?'show':''}>{content.recipient}</h2><span className={stitch>.58?'show':''}>{content.eventDate||'THE DATE WE BEGIN'}</span><em className={stitch>.82?'show':''}>{content.venueName||'TOSHKENT'}</em></div></section>

    <section className="shr-stage shr-gallery"><div className="shr-gallery-head"><p>02 · WOVEN MEMORIES</p><h2>Uch xotira naqshning ichida.</h2></div><div className="shr-medallions">{photos.slice(0,3).map((src,i)=><figure key={i} className={i<medallion?'open':''} style={{'--i':i}}><div><img src={src} alt=""/><i/></div><figcaption>{content.captions?.[i]||['Biz boshlagan joy.','Biz kulgan kun.','Biz tanlagan kelajak.'][i]}</figcaption></figure>)}</div><button onClick={nextMedallion}>{medallion<3?'Keyingi naqshni ochish':'Davom etish'} →</button></section>

    <section className="shr-stage shr-veil"><div className="shr-video-stage"><ExperienceVideo src={assets.video} poster={photos[1]} title="Couple film" autoReveal/><div className="shr-video-veil"/><button onClick={()=>setPhase('invitation')}>Ipak pardani ochish →</button></div></section>

    <section className="shr-stage shr-invitation"><GoldThread progress={1}/><article><p>WITH THE BLESSING OF OUR FAMILIES</p><h2>{content.recipient}</h2><span>{content.final||'Sizni hayotimizning eng muhim kuniga taklif qilamiz.'}</span><div className="shr-meta"><b>{content.eventDate||'28 · 09 · 2026'}</b><b>{content.venueName||'TOSHKENT'}</b></div><button onClick={()=>location.reload()}>Qayta ko‘rish ↺</button></article></section>
  </main>;
}
