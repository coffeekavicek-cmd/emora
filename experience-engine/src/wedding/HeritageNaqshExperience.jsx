import { useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './heritageNaqsh.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function ping(freq=440,d=.08,v=.012){try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(v,c.currentTime+.005);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02);setTimeout(()=>c.close(),230)}catch{}}
function fmt(value){if(!value)return {date:'Sana tez orada',time:''};const d=new Date(value);if(Number.isNaN(d.getTime()))return {date:value,time:''};return{date:new Intl.DateTimeFormat('uz-UZ',{day:'numeric',month:'long',year:'numeric'}).format(d),time:new Intl.DateTimeFormat('uz-UZ',{hour:'2-digit',minute:'2-digit'}).format(d)}}

function TracePattern({onComplete}){
 const last=useRef(null),distance=useRef(0),done=useRef(false);const [p,setP]=useState(0);
 const down=e=>{if(done.current)return;last.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture?.(e.pointerId);ping(180,.04,.006)};
 const move=e=>{if(!last.current||done.current)return;const dx=e.clientX-last.current.x,dy=e.clientY-last.current.y;distance.current+=Math.hypot(dx,dy);last.current={x:e.clientX,y:e.clientY};const next=clamp(distance.current/540,0,1);setP(next);if(next>.96){done.current=true;last.current=null;setP(1);ping(590,.15,.018);try{navigator.vibrate?.([6,18,6])}catch{};setTimeout(onComplete,420)}};
 const up=()=>{last.current=null};
 const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();done.current=true;setP(1);setTimeout(onComplete,360)};
 return <div className="hn-trace" style={{'--dash':String(1-p),'--trace-glow':String(.2+p*.8)}}>
   <svg viewBox="0 0 800 800" aria-hidden="true"><g className="hn-base">
    <circle cx="400" cy="400" r="292"/><circle cx="400" cy="400" r="224"/><rect x="240" y="240" width="320" height="320" transform="rotate(45 400 400)"/>
   </g><path className="hn-live" pathLength="1" d="M400 92 C438 196 520 218 625 175 C582 279 605 358 708 400 C605 442 582 521 625 625 C520 582 438 604 400 708 C362 604 280 582 175 625 C218 521 195 442 92 400 C195 358 218 279 175 175 C280 218 362 196 400 92Z"/></svg>
   <button aria-label="Naqsh yo‘lini barmoq bilan chizing" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}><i/><span>naqshni chizing</span><b>{Math.round(p*100)}%</b></button>
 </div>
}

function Medallion({onLock}){
 const start=useRef(null),done=useRef(false);const [angle,setAngle]=useState(-118);
 const down=e=>{if(done.current)return;start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};
 const move=e=>{if(start.current==null||done.current)return;const dx=e.clientX-start.current;start.current=e.clientX;const next=clamp(angle+dx*.72,-118,0);setAngle(next);if(next>-4){done.current=true;setAngle(0);ping(720,.18,.02);try{navigator.vibrate?.([8,28,10])}catch{};setTimeout(onLock,450)}};
 const up=()=>{start.current=null};
 const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();done.current=true;setAngle(0);setTimeout(onLock,360)};
 return <button className="hn-medallion" style={{'--angle':angle+'deg'}} aria-label="Markaziy medalyonni to‘g‘ri joyiga aylantiring" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
   <svg viewBox="0 0 300 300" aria-hidden="true"><circle cx="150" cy="150" r="132"/><path d="M150 20 L181 104 L270 150 L181 196 L150 280 L119 196 L30 150 L119 104Z"/><circle cx="150" cy="150" r="52"/></svg><span>LOCK</span>
 </button>
}

export function HeritageNaqshExperience({content:contentProp=null,embedded=false}){
 const content=useMemo(()=>contentProp||readUrlContent('wedding-naqsh'),[contentProp]);
 const [phase,setPhase]=useState('intro');const date=useMemo(()=>fmt(content.eventDate),[content.eventDate]);
 const q=[content.venueName,content.venueAddress,content.mapLocation].filter(Boolean).join(' '),map=q?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q):'';
 return <main className={'heritage-naqsh '+(embedded?'is-embedded ':'')+'phase-'+phase}>
  <div className="hn-paper"/><div className="hn-grain"/>
  <header className="hn-chrome"><a href="?">emora<span>.</span></a><small>HERITAGE NAQSH · WEDDING 03</small><b>{phase==='intro'?'00':phase==='trace'?'01':phase==='names'?'02':phase==='lock'?'03':'04'}</b></header>
  <section className="hn-layer hn-intro"><div className="hn-dot"/><div><p>ONE POINT · ONE PATTERN</p><h1>{content.message}</h1><em>{content.guestGreeting||content.recipient}</em><button onClick={()=>setPhase('trace')}>Naqshni boshlash →</button></div></section>
  <section className="hn-layer hn-trace-layer"><div className="hn-copy"><p>01 · TRACE</p><h2>Yo‘lni qo‘ling bilan qur.</h2></div><TracePattern onComplete={()=>setPhase('names')}/></section>
  <section className="hn-layer hn-names"><div className="hn-name-pattern" aria-hidden="true"><i/><b/><span/></div><p>THE PATTERN OPENS</p><h2>{content.recipient}</h2><span>{content.paragraphs[1]}</span><button onClick={()=>setPhase('lock')}>Markazni yakunlash →</button></section>
  <section className="hn-layer hn-lock"><div className="hn-copy"><p>03 · THE MEDALLION</p><h2>Naqsh faqat bitta burchakda qulflanadi.</h2></div><Medallion onLock={()=>setPhase('finale')}/></section>
  <section className="hn-layer hn-finale"><div className="hn-final-pattern" aria-hidden="true"><i/><b/><span/></div><article><p>THE PATTERN IS COMPLETE</p><h2>{content.final}</h2><div className="hn-event"><span><small>SANA</small><b>{date.date}</b><em>{date.time}</em></span><i/><span><small>JOY</small><b>{content.venueName||'Manzil tez orada'}</b><em>{content.venueAddress||''}</em></span></div><div className="hn-actions">{map&&<a href={map} target="_blank" rel="noreferrer">Xaritada ochish ↗</a>}<button onClick={()=>setPhase('intro')}>Boshidan ↺</button></div></article></section>
 </main>
}
