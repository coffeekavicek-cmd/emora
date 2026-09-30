import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './balloonDreamReborn.css';

const FALLBACKS=['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80'];
function pulse(strong=false){try{navigator.vibrate?.(strong?[10,20,16]:[5])}catch{}}
function HoldPop({onDone}){const timer=useRef(null),start=useRef(0),[holding,setHolding]=useState(false);const down=()=>{if(timer.current)return;start.current=performance.now();setHolding(true);timer.current=setTimeout(()=>{timer.current=null;setHolding(false);pulse(true);onDone()},900)};const up=()=>{if(timer.current){clearTimeout(timer.current);timer.current=null}setHolding(false)};useEffect(()=>()=>clearTimeout(timer.current),[]);return <button className={'bdr-hold '+(holding?'holding':'')} aria-label="Katta sharni bosib ushlab yoring" onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}><i/><span>bosib ushlab turing</span><b>900ms</b></button>}

export function BalloonDreamReborn({content:contentProp=null,media={},embedded=false}){
 const content=useMemo(()=>contentProp||readUrlContent('birthday-balloon'),[contentProp]);const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;const [phase,setPhase]=useState('room');const [released,setReleased]=useState([]);const [memory,setMemory]=useState(0);
 const release=i=>{if(released.includes(i))return;const n=[...released,i];setReleased(n);pulse();setMemory(Math.max(memory,i+1));if(n.length===3)setTimeout(()=>setPhase(assets.video?'film':'hero'),850)};
 const pop=()=>{setPhase('silence');setTimeout(()=>setPhase('sky'),500)};
 return <main className={'balloon-dream-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase}>
  <ExperienceSoundscape preset={content.musicPreset||'Dream'} customUrl={assets.music} startAt={content.musicStart||0}/><div className="bdr-room" aria-hidden="true"><div className="bdr-wall back"/><div className="bdr-wall left"/><div className="bdr-wall right"/><div className="bdr-floor"/><div className="bdr-window"/></div><div className="bdr-grain"/><div className="bdr-vignette"/>
  <header className="bdr-chrome"><a href="?">emora<span>.</span></a><small>BALLOON DREAM · BIRTHDAY ROOM</small><b>{phase==='room'?'00':phase==='film'?'01':phase==='hero'?'02':'03'}</b></header>
  <section className="bdr-stage bdr-room-stage"><article><p>THREE BALLOONS · THREE REASONS</p><h1>{content.message||'Uchta shar ichida uchta xotira yashiringan.'}</h1><em>{content.recipient}</em></article><div className="bdr-balloons">{[0,1,2].map(i=><button key={i} className={'bdr-balloon '+(released.includes(i)?'released':'')} style={{'--i':i}} aria-label={(i+1)+'-sharni qo‘yib yuboring'} onClick={()=>release(i)}><i/><b/><span>{String(i+1).padStart(2,'0')}</span></button>)}</div><div className="bdr-memories">{photos.slice(0,3).map((src,i)=><figure key={i} className={memory>i?'show':''} style={{'--i':i}}><img src={src} alt=""/><figcaption>{content.captions?.[i]||['Shu kulgi.','Shu sarguzasht.','Shu inson.'][i]}</figcaption></figure>)}</div></section>
  <section className="bdr-stage bdr-film"><div className="bdr-video"><ExperienceVideo src={assets.video} poster={photos[2]} title="Birthday surprise film" autoReveal onEnded={()=>setPhase('hero')}/></div><button onClick={()=>setPhase('hero')}>Oxirgi shar →</button></section>
  <section className="bdr-stage bdr-hero"><div className="bdr-hero-balloon"><div><img src={assets.portrait||photos[0]} alt=""/><i/></div><span/></div><article><p>ONE LAST WISH</p><h2>{content.recipient}</h2><span>Bu sharni yorish uchun shoshilma.</span></article><HoldPop onDone={pop}/></section>
  <section className="bdr-stage bdr-silence"><span>…</span></section>
  <section className="bdr-stage bdr-sky"><div className="bdr-clouds"><i/><i/><i/></div><div className="bdr-confetti">{Array.from({length:48},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><article><p>ALL WISHES ARE ABOVE US NOW</p><h2>{content.recipient}</h2><span>{content.final||'Tug‘ilgan kuning bilan. Eng yaxshi osmon hali oldinda.'}</span><button onClick={()=>location.reload()}>Boshidan ↺</button></article></section>
 </main>
}
