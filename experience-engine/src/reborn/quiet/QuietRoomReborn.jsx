import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './quietRoomReborn.css';

const FALLBACKS=[
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80'
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function pulse(strong=false){try{navigator.vibrate?.(strong?[8,18,12]:[5])}catch{}}

function Chain({onDone}){
  const start=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const down=e=>{if(done.current)return;start.current=e.clientY;e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{if(start.current==null||done.current)return;const n=clamp((e.clientY-start.current)/140,0,1);setP(n);if(n>.94){done.current=true;pulse(true);setTimeout(onDone,220)}};
  const up=()=>{start.current=null;if(!done.current&&p<.35)setP(0)};
  return <button className="qrr-chain" style={{'--pull':p}} aria-label="Lampochka zanjirini pastga torting" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><i/><b/><span>pastga torting</span></button>;
}

export function QuietRoomReborn({content:contentProp=null,media={},embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('apology-quiet'),[contentProp]);
  const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;
  const [phase,setPhase]=useState('dark');const [memory,setMemory]=useState(0);
  const [line,setLine]=useState(0);

  useEffect(()=>{if(phase!=='letter')return;const timers=[550,1900,3300].map((t,i)=>setTimeout(()=>setLine(i+1),t));const next=setTimeout(()=>setPhase('negatives'),4700);return()=>{timers.forEach(clearTimeout);clearTimeout(next)}},[phase]);
  const nextMemory=()=>{const n=Math.min(3,memory+1);setMemory(n);pulse();if(n===3)setTimeout(()=>setPhase(assets.video?'confession':'blackout'),650)};
  useEffect(()=>{if(phase!=='blackout')return;const t=setTimeout(()=>setPhase('phosphor'),1200);return()=>clearTimeout(t)},[phase]);
  useEffect(()=>{if(phase!=='phosphor')return;const t=setTimeout(()=>setPhase('finale'),1800);return()=>clearTimeout(t)},[phase]);

  return <main className={'quiet-room-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <ExperienceSoundscape preset={content.musicPreset||'Nocturne'} customUrl={assets.music} startAt={content.musicStart||0}/>
    <div className="qrr-room" aria-hidden="true"><div className="qrr-wall back"/><div className="qrr-wall left"/><div className="qrr-wall right"/><div className="qrr-floor"/><div className="qrr-desk"><i/><b/></div><div className="qrr-lamp"><i/><b/><span/></div><div className="qrr-beam"/></div>
    <div className="qrr-grain"/><div className="qrr-vignette"/>
    <header className="qrr-chrome"><a href="?">emora<span>.</span></a><small>QUIET ROOM · THE LAST LIGHT</small><b>{phase==='dark'?'00':phase==='light'?'01':phase==='letter'?'02':phase==='negatives'?'03':phase==='confession'?'04':'05'}</b></header>

    <section className="qrr-stage qrr-dark"><article><p>NO EXCUSES · NO NOISE</p><h1>{content.message||'Ba’zi gaplarni baland aytish kerak emas.'}</h1><em>{content.recipient}</em></article><Chain onDone={()=>{setPhase('light');setTimeout(()=>setPhase('letter'),900)}}/></section>

    <section className="qrr-stage qrr-letter"><div className="qrr-photo"><img src={photos[0]} alt=""/><i/></div><article><p>{content.recipient},</p><div>{(content.paragraphs||[]).slice(0,3).map((x,i)=><span key={i} className={line>i?'show':''}>{x||['Men xato qilganimni bilaman.','Bahona qilishni istamayman.','Faqat seni yana ehtiyot qilishni xohlayman.'][i]}</span>)}</div><em className={line>=3?'show':''}>— rost gap bilan</em></article></section>

    <section className="qrr-stage qrr-negatives"><div className="qrr-negative-head"><p>03 · WHAT I DON’T WANT TO LOSE</p><h2>Uchta xotira. Bitta sabab.</h2></div><div className="qrr-negatives-stack">{photos.slice(0,3).map((src,i)=><figure key={i} className={i<memory?'show':''} style={{'--i':i}}><img src={src} alt=""/><figcaption>{content.captions?.[i]||['Shu lahza.','Shu kulgi.','Shu inson.'][i]}</figcaption></figure>)}</div><button onClick={nextMemory}>{memory<3?'Keyingi negativni yoritish':'Davom etish'} →</button></section>

    <section className="qrr-stage qrr-confession"><div className="qrr-video"><ExperienceVideo src={assets.video} poster={photos[2]} title="Video confession" autoReveal onEnded={()=>setPhase('blackout')}/></div><button onClick={()=>setPhase('blackout')}>Chiroqni o‘chirish →</button></section>

    <section className="qrr-stage qrr-blackout"><span>…</span></section>
    <section className="qrr-stage qrr-phosphor"><p>men hali shu yerdaman.</p></section>
    <section className="qrr-stage qrr-finale"><article><p>THE ROOM IS QUIET AGAIN</p><h2>{content.final||'Kechir deb talab qilmayman. Lekin chin dildan uzr so‘rayman.'}</h2><em>{content.recipient}</em><button onClick={()=>location.reload()}>Boshidan ↺</button></article></section>
  </main>;
}
