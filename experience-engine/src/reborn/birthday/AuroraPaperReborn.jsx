import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './auroraPaperReborn.css';
import './auroraPaperV2.css';

const FALLBACKS=['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80'];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function pulse(strong=false){try{navigator.vibrate?.(strong?[10,18,14]:[5])}catch{}}

function DragTrack({className,label,onDone,children}){const drag=useRef(null),done=useRef(false);const [p,setP]=useState(0);const down=e=>{drag.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};const move=e=>{if(drag.current==null||done.current)return;const n=clamp((e.clientX-drag.current)/220,0,1);setP(n);if(n>.94){done.current=true;pulse(true);setTimeout(onDone,240)}};const up=()=>{drag.current=null;if(!done.current)setP(0)};return <button className={className} style={{'--p':p,'--r':p,'--t':p}} aria-label={label} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>{children}</button>}

function PeelSheets({photos,captions,onDone}){const [layer,setLayer]=useState(0);const complete=i=>{if(i!==layer)return;const n=layer+1;setLayer(n);pulse();if(n===3)setTimeout(onDone,520)};return <div className="apr2-paper-world" data-layer={layer}>
 <div className="apr2-light-seam"/>
 {photos.slice(0,3).map((src,i)=><section key={i} className={'apr2-sheet '+(i<layer?'is-peeled ':i===layer?'is-live ':'is-waiting ')} style={{'--i':i}}>
   <div className="apr2-fibre"/><img src={src} alt=""/><div className="apr2-wash"/>
   <article><small>MEMORY 0{i+1}</small><p>{captions?.[i]||['Bir lahza — lekin esda qolgan.','Shu kulgi yana kerak.','Keyingi bob hali yozilmagan.'][i]}</p></article>
   {i===layer&&<DragTrack className="apr2-peel" label={`${i+1}-qog‘oz qatlamini chetga yirting`} onDone={()=>complete(i)}><i/><span>qatlamni yirting →</span></DragTrack>}
 </section>)}
 <div className="apr2-depth-index"><b>{String(Math.min(layer+1,3)).padStart(2,'0')}</b><span>/03</span></div>
 </div>}

export function AuroraPaperReborn({content:contentProp=null,media={},embedded=false}){
 const content=useMemo(()=>contentProp||readUrlContent('birthday-aurora'),[contentProp]);const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;const [phase,setPhase]=useState('gift');
 useEffect(()=>{const onMove=e=>{document.documentElement.style.setProperty('--aurora-x',`${(e.clientX/innerWidth-.5)*18}px`);document.documentElement.style.setProperty('--aurora-y',`${(e.clientY/innerHeight-.5)*12}px`)};addEventListener('pointermove',onMove,{passive:true});return()=>removeEventListener('pointermove',onMove)},[]);
 const afterLayers=()=>setPhase(assets.video?'film':'tear');
 const tearDone=()=>{setPhase('silence');setTimeout(()=>setPhase('finale'),520)};
 return <main className={'aurora-paper-reborn apr2 '+(embedded?'is-embedded ':'')+'phase-'+phase}>
  <ExperienceSoundscape preset={content.musicPreset||'Dream'} customUrl={assets.music} startAt={content.musicStart||0}/><div className="apr-aurora-bg"><i/><i/><i/></div><div className="apr2-orbit-glow"/><div className="apr-grain"/><div className="apr-vignette"/>
  <header className="apr-chrome"><a href="?">emora<span>.</span></a><small>AURORA PAPER · LIVING GIFT</small><b>{phase==='gift'?'00':phase==='layers'?'01':phase==='film'?'02':phase==='tear'?'03':phase==='silence'?'·':'04'}</b></header>
  <section className="apr-stage apr-gift"><div className="apr-box apr2-box"><div className="apr-lid"/><div className="apr-base"/><div className="apr-glow"/><div className="apr2-ribbon-wrap"/></div><article><p>NOT A GIFT · A SMALL UNIVERSE</p><h1>{content.message||'Bu sovg‘a ichida buyum emas. Sen haqingdagi uchta tirik xotira bor.'}</h1><em>{content.recipient}</em></article><DragTrack className="apr-ribbon" label="Sovg‘a lentasini o‘ngga torting" onDone={()=>setPhase('layers')}><i/><b/><span>lentani bo‘shating →</span></DragTrack></section>
  <section className="apr-stage apr-layers"><div className="apr-layer-head"><p>01 · LIVING PAPER</p><h2>Qog‘ozni ochmang. Uni his qilib ajrating.</h2></div><PeelSheets photos={photos} captions={content.captions} onDone={afterLayers}/></section>
  <section className="apr-stage apr-film"><div className="apr2-film-shell"><div className="apr2-film-edge"/><div className="apr-video"><ExperienceVideo src={assets.video} poster={photos[2]} title="Hidden moving layer" autoReveal onEnded={()=>setPhase('tear')}/></div></div><p>ONE LAYER WAS STILL ALIVE</p><button onClick={()=>setPhase('tear')}>Qog‘ozga qaytish →</button></section>
  <section className="apr-stage apr-tear-stage"><div className="apr-last-paper apr2-last-paper"><div className="apr2-rift"/><p>{content.final||'Eng yaxshi boblaring hali oldinda.'}</p></div><DragTrack className="apr-tear" label="Oxirgi qog‘oz qatlamini yirting" onDone={tearDone}><i/><b/><span>nurga yo‘l oching →</span></DragTrack></section>
  <section className="apr-stage apr2-silence"><i/><span>...</span></section>
  <section className="apr-stage apr-finale"><div className="apr-sky"><i/><i/><i/><i/></div><div className="apr2-aurora-ribbons">{Array.from({length:7},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><div className="apr-confetti">{Array.from({length:44},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><article><p>THE PAPER ENDED · THE SKY OPENED</p><h2>{content.recipient}</h2><span>{content.final||'Tug‘ilgan kuning bilan. Eng yaxshi boblaring hali oldinda.'}</span><button onClick={()=>location.reload()}>Boshidan ↺</button></article></section>
 </main>
}
