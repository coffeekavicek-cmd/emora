import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './auroraPaperReborn.css';

const FALLBACKS=['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80'];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function pulse(strong=false){try{navigator.vibrate?.(strong?[10,18,14]:[5])}catch{}}

function Ribbon({onDone}){const drag=useRef(null),done=useRef(false);const [p,setP]=useState(0);const down=e=>{drag.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};const move=e=>{if(drag.current==null||done.current)return;const n=clamp((e.clientX-drag.current)/210,0,1);setP(n);if(n>.95){done.current=true;pulse(true);setTimeout(onDone,280)}};return <button className="apr-ribbon" style={{'--r':p}} aria-label="Sovg‘a lentasini o‘ngga torting" onPointerDown={down} onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><i/><b/><span>lentani torting →</span></button>}
function Tear({onDone}){const drag=useRef(null),done=useRef(false);const [p,setP]=useState(0);const down=e=>{drag.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};const move=e=>{if(drag.current==null||done.current)return;const n=clamp((e.clientX-drag.current)/230,0,1);setP(n);if(n>.95){done.current=true;pulse(true);setTimeout(onDone,260)}};return <button className="apr-tear" style={{'--t':p}} aria-label="Oxirgi qog‘oz qatlamini yirting" onPointerDown={down} onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><i/><b/><span>oxirgi qatlamni yirting →</span></button>}

export function AuroraPaperReborn({content:contentProp=null,media={},embedded=false}){
 const content=useMemo(()=>contentProp||readUrlContent('birthday-aurora'),[contentProp]);const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;const [phase,setPhase]=useState('gift');const [layer,setLayer]=useState(0);
 const nextLayer=()=>{const n=Math.min(3,layer+1);setLayer(n);pulse();if(n===3)setTimeout(()=>setPhase(assets.video?'film':'tear'),600)};
 return <main className={'aurora-paper-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase}>
  <ExperienceSoundscape preset={content.musicPreset||'Dream'} customUrl={assets.music} startAt={content.musicStart||0}/><div className="apr-aurora-bg"><i/><i/><i/></div><div className="apr-grain"/><div className="apr-vignette"/>
  <header className="apr-chrome"><a href="?">emora<span>.</span></a><small>AURORA PAPER · BIRTHDAY OBJECT</small><b>{phase==='gift'?'00':phase==='layers'?'01':phase==='film'?'02':phase==='tear'?'03':'04'}</b></header>
  <section className="apr-stage apr-gift"><div className="apr-box"><div className="apr-lid"/><div className="apr-base"/><div className="apr-glow"/></div><article><p>NOT A GIFT · A SMALL UNIVERSE</p><h1>{content.message||'Bu sovg‘a ichida buyum emas, sen haqingdagi bir nechta yaxshi sabab bor.'}</h1><em>{content.recipient}</em></article><Ribbon onDone={()=>setPhase('layers')}/></section>
  <section className="apr-stage apr-layers"><div className="apr-layer-head"><p>01 · PAPER MEMORIES</p><h2>Har qatlam ichida bitta lahza.</h2></div><div className="apr-stack">{photos.slice(0,3).map((src,i)=><figure key={i} className={i<layer?'peeled':i===layer?'front':'behind'} style={{'--i':i}}><div className="apr-paper-frame"><img src={src} alt=""/><i/></div><figcaption><b>0{i+1}</b><span>{content.captions?.[i]||['Bugun eslash uchun.','Bugun kulish uchun.','Keyingi bob uchun.'][i]}</span></figcaption></figure>)}</div><button className="apr-next" onClick={nextLayer}>{layer<3?'Keyingi qatlamni ochish':'Davom etish'} →</button></section>
  <section className="apr-stage apr-film"><div className="apr-video"><ExperienceVideo src={assets.video} poster={photos[2]} title="Birthday film" autoReveal onEnded={()=>setPhase('tear')}/></div><p>ONE HIDDEN LAYER WAS MOVING</p><button onClick={()=>setPhase('tear')}>Oxirgi qatlam →</button></section>
  <section className="apr-stage apr-tear-stage"><div className="apr-last-paper"><p>{content.final||'Eng yaxshi boblaring hali oldinda.'}</p><i/></div><Tear onDone={()=>setPhase('finale')}/></section>
  <section className="apr-stage apr-finale"><div className="apr-sky"><i/><i/><i/><i/></div><div className="apr-confetti">{Array.from({length:44},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><article><p>THE PAPER ENDED · THE SKY DIDN’T</p><h2>{content.recipient}</h2><span>{content.final||'Tug‘ilgan kuning bilan. Eng yaxshi boblaring hali oldinda.'}</span><button onClick={()=>location.reload()}>Boshidan ↺</button></article></section>
 </main>
}
