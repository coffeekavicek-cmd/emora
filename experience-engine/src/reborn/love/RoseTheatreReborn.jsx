import { useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './roseTheatreReborn.css';
import './roseTheatreV2.css';

const FALLBACKS=['https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80'];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function pulse(strong=false){try{navigator.vibrate?.(strong?[8,20,12]:[4])}catch{}}
function CurtainPull({onDone}){const start=useRef(null),done=useRef(false),[p,setP]=useState(0);const down=e=>{start.current=e.clientY;e.currentTarget.setPointerCapture?.(e.pointerId)};const move=e=>{if(start.current==null||done.current)return;const n=clamp((e.clientY-start.current)/170,0,1);setP(n);if(n>.95){done.current=true;pulse(true);setTimeout(onDone,340)}};return <button className="rtr-rope" style={{'--p':p}} aria-label="Teatr pardasi arqonini pastga torting" onPointerDown={down} onPointerMove={move} onPointerUp={()=>start.current=null} onPointerCancel={()=>start.current=null}><i/><b/><span>pardani oching</span></button>}
function PetalPull({onDone}){const start=useRef(null),done=useRef(false),[p,setP]=useState(0);const down=e=>{start.current=e.clientY;e.currentTarget.setPointerCapture?.(e.pointerId)};const move=e=>{if(start.current==null||done.current)return;const n=clamp((e.clientY-start.current)/145,0,1);setP(n);if(n>.95){done.current=true;pulse(true);setTimeout(onDone,260)}};return <button className="rtr-live-petal" style={{'--petal':p}} aria-label="Atirgul yaprog‘ini pastga torting" onPointerDown={down} onPointerMove={move} onPointerUp={()=>start.current=null} onPointerCancel={()=>start.current=null}><i/><b/><span>yaproqni torting ↓</span></button>}

export function RoseTheatreReborn({content:contentProp=null,media={},embedded=false}){
 const content=useMemo(()=>contentProp||readUrlContent('love-rose'),[contentProp]);const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;const [phase,setPhase]=useState('closed');const [act,setAct]=useState(0);
 const nextAct=()=>{const n=Math.min(3,act+1);setAct(n);pulse();if(n===3)setTimeout(()=>setPhase(assets.video?'backstage':'petal'),650)};
 const pluck=()=>{setPhase('blackout');setTimeout(()=>setPhase('finale'),720)};
 return <main className={'rose-theatre-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase}>
  <ExperienceSoundscape preset={content.musicPreset||'Nocturne'} customUrl={assets.music} startAt={content.musicStart||0}/>
  <div className="rtr-theatre"><div className="rtr-stage"/><div className="rtr-curtain left"/><div className="rtr-curtain right"/><div className="rtr-balcony"/><div className="rtr-spot"/><div className="rtr-dust">{Array.from({length:28},(_,i)=><i key={i} style={{'--i':i}}/>)}</div></div><div className="rtr-grain"/><div className="rtr-vignette"/>
  <header className="rtr-chrome"><a href="?">emora<span>.</span></a><small>ROSE THEATRE · ONE NIGHT ONLY</small><b>{phase==='closed'?'00':phase==='acts'?'01':phase==='backstage'?'02':phase==='petal'?'03':phase==='blackout'?'04':'05'}</b></header>
  <section className="rtr-layer rtr-closed"><article><p>ONE STAGE · ONE AUDIENCE</p><h1>{content.message||'Bugun sahnada faqat bitta hikoya bor.'}</h1><em>{content.recipient}</em></article><CurtainPull onDone={()=>setPhase('acts')}/></section>
  <section className="rtr-layer rtr-acts"><div className="rtr-head"><p>ACT {Math.min(act+1,3)} · MOVING SCRIMS</p><h2>Xotiralar sahnaga kartochka bo‘lib emas, dekor bo‘lib kiradi.</h2></div><div className="rtr-scrims">{photos.slice(0,3).map((src,i)=><figure key={i} className={i<act?'passed':i===act?'current':''} style={{'--i':i}}><div><img src={src} alt=""/><i/><b/></div><figcaption>{content.captions?.[i]||['Birinchi qarash.','Bizning eng sokin baxtimiz.','Hali yozilmagan akt.'][i]}</figcaption></figure>)}</div><button onClick={nextAct}>{act<3?'Keyingi akt':'Final aktga o‘tish'} →</button></section>
  <section className="rtr-layer rtr-backstage"><div className="rtr-video"><ExperienceVideo src={assets.video} poster={photos[2]} title="Backstage film" autoReveal onEnded={()=>setPhase('petal')}/></div><p>BACKSTAGE · NOT FOR EVERYONE</p><button onClick={()=>setPhase('petal')}>Sahnaga qaytish →</button></section>
  <section className="rtr-layer rtr-petal-scene"><div className="rtr-single-rose"><i/><i/><i/><i/><i/><i/><i/></div><article><p>ONE PETAL · NO SCRIPT</p><h2>Oxirgi gapni sahna emas, sen ochasan.</h2></article><PetalPull onDone={pluck}/></section>
  <section className="rtr-layer rtr-blackout"><span>…</span></section>
  <section className="rtr-layer rtr-finale"><div className="rtr-bloom">{Array.from({length:32},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><article><p>ENCORE · THE PETALS REMEMBERED</p><h2>{content.final||'Men bu hikoyaning keyingi aktlarini ham sen bilan yozishni xohlayman.'}</h2><em>{content.recipient}</em><button onClick={()=>location.reload()}>Encore ↺</button></article></section>
 </main>
}
