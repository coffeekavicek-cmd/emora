import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, MediaFilmstrip, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './cinemaProposalReborn.css';

const FALLBACKS=[
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=80'
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function pulse(strong=false){try{navigator.vibrate?.(strong?[10,20,14]:[5])}catch{}}

function TicketTear({onDone}){
  const start=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const down=e=>{if(done.current)return;start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{if(start.current==null||done.current)return;const n=clamp((e.clientX-start.current)/210,0,1);setP(n);if(n>.95){done.current=true;pulse(true);setTimeout(onDone,280)}};
  const up=()=>{start.current=null;if(!done.current&&p<.3)setP(0)};
  return <div className="cpr-ticket" style={{'--tear':p}}><div className="cpr-ticket-main"><small>EMORA PRIVATE SCREENING</small><b>ROW 01 · SEAT 01</b><span>FOR ONE PERSON ONLY</span></div><div className="cpr-ticket-stub"><b>♡</b><span>ADMIT ONE</span></div><button aria-label="Biletni yirtib kinoni boshlang" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><i/><span>biletni torting →</span></button></div>;
}

function Burn({active,onDone}){
  const ref=useRef(null);
  useEffect(()=>{if(!active||!ref.current)return;const c=ref.current,ctx=c.getContext('2d');let raf=0,dead=false;const d=Math.min(devicePixelRatio||1,1.5),w=c.clientWidth,h=c.clientHeight;c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);const start=performance.now();const draw=now=>{if(dead)return;const t=clamp((now-start)/1700,0,1),r=Math.hypot(w,h)*(.02+t*.83),x=w*.52,y=h*.48;ctx.clearRect(0,0,w,h);const g=ctx.createRadialGradient(x,y,Math.max(0,r-85),x,y,r+55);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.57,`rgba(255,241,187,${.08+.28*t})`);g.addColorStop(.69,`rgba(255,160,62,${.38+.5*t})`);g.addColorStop(.8,`rgba(101,24,6,${.48+.45*t})`);g.addColorStop(.92,'rgba(4,1,0,.96)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);if(t<1)raf=requestAnimationFrame(draw);else setTimeout(()=>onDone?.(),180)};raf=requestAnimationFrame(draw);return()=>{dead=true;cancelAnimationFrame(raf)}},[active,onDone]);
  return <canvas ref={ref} className="cpr-burn" aria-hidden="true"/>;
}

export function CinemaProposalReborn({content:contentProp=null,media={},embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('proposal-cinema'),[contentProp]);const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;
  const [phase,setPhase]=useState('ticket');const [scrub,setScrub]=useState(0);const [burn,setBurn]=useState(false);const drag=useRef(null);const activeIndex=Math.min(photos.length-1,Math.floor(scrub*Math.max(1,photos.length)));
  useEffect(()=>{if(phase!=='projector')return;const t=setTimeout(()=>setPhase('reel'),1800);return()=>clearTimeout(t)},[phase]);
  const down=e=>{drag.current={x:e.clientX,p:scrub};e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{if(!drag.current||phase!=='reel')return;const n=clamp(drag.current.p+(e.clientX-drag.current.x)/Math.max(260,innerWidth*.58),0,1);setScrub(n);if(n>.98){drag.current=null;pulse(true);setPhase(assets.video?'film':'jam')}};
  useEffect(()=>{if(phase!=='jam')return;const t=setTimeout(()=>setBurn(true),620);return()=>clearTimeout(t)},[phase]);
  return <main className={'cinema-proposal-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase} style={{'--scrub':scrub}}>
    <ExperienceSoundscape preset={content.musicPreset||'Cinema'} customUrl={assets.music} startAt={content.musicStart||0}/><div className="cpr-room" aria-hidden="true"><div className="cpr-curtain left"/><div className="cpr-curtain right"/><div className="cpr-screen"/><div className="cpr-seats"/><div className="cpr-projector"><i/><b/><span/></div><div className="cpr-beam"/></div><div className="cpr-grain"/><div className="cpr-vignette"/>
    <header className="cpr-chrome"><a href="?">emora<span>.</span></a><small>CINEMA PROPOSAL · PRIVATE CUT</small><b>{phase==='ticket'?'00':phase==='projector'?'01':phase==='reel'?'02':phase==='film'?'03':phase==='jam'?'04':'05'}</b></header>

    <section className="cpr-stage cpr-ticket-stage"><article><p>TONIGHT · ONE SCREENING</p><h1>{content.message||'Bu filmning oxiri faqat sen bilan yoziladi.'}</h1><em>{content.recipient}</em></article><TicketTear onDone={()=>setPhase('projector')}/></section>
    <section className="cpr-stage cpr-projector-stage"><div className="cpr-count"><span>3</span><span>2</span><span>1</span></div><p>PROJECTOR ONLINE</p></section>
    <section className="cpr-stage cpr-reel"><div className="cpr-reel-head"><p>02 · OUR FILM</p><h2>Vaqtni o‘zing aylantir.</h2></div><div className="cpr-film-wrap" style={{transform:`translateX(${-scrub*46}vw)`}}><MediaFilmstrip photos={photos} captions={content.captions||[]} activeIndex={activeIndex} className="cpr-filmstrip"/></div><button className="cpr-scrub" aria-label="Film xotiralarini o‘ngga suring" onPointerDown={down} onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><i/><b/><span>{Math.round(scrub*100)}%</span></button></section>
    <section className="cpr-stage cpr-film"><div className="cpr-private-film"><ExperienceVideo src={assets.video} poster={photos[activeIndex]} title="Our private film" autoReveal onEnded={()=>setPhase('jam')}/></div><p>THE SCENE WE NEVER POSTED</p><button onClick={()=>setPhase('jam')}>Oxirgi kadrga o‘tish →</button></section>
    <section className="cpr-stage cpr-jam"><div className="cpr-freeze"><img src={photos[activeIndex]} alt=""/><i/></div><p>FILM JAMMED · DO NOT LEAVE</p></section>{burn&&<Burn active onDone={()=>setPhase('question')}/>} 
    <section className="cpr-stage cpr-question"><div className="cpr-ring-light"/><article><p>THE FILM WAS NEVER THE QUESTION</p><h2>{content.final||'Qolgan barcha sahnalarni birga suratga olishga rozimisan?'}</h2><em>{content.recipient}</em><div><button>HA</button><button onClick={()=>location.reload()}>Qayta ko‘rish ↺</button></div></article></section>
  </main>;
}
