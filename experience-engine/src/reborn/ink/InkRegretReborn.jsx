import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './inkRegretReborn.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const FALLBACK='https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80';
function tap(strong=false){try{navigator.vibrate?.(strong?[10,18,10]:[5])}catch{}}

function InkDiffusion({active,onDone}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!active||!ref.current)return;
    const c=ref.current,ctx=c.getContext('2d');let raf=0,dead=false;
    const d=Math.min(devicePixelRatio||1,1.5),w=c.clientWidth,h=c.clientHeight;c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);
    const drops=Array.from({length:150},(_,i)=>({a:i*2.399,r:.1+Math.random()*.9,s:.5+Math.random()*1.6,o:.06+Math.random()*.22}));
    const start=performance.now();
    const draw=now=>{if(dead)return;const t=clamp((now-start)/2200,0,1),ease=1-Math.pow(1-t,3),cx=w*.5,cy=h*.46,max=Math.hypot(w,h)*.45;ctx.clearRect(0,0,w,h);
      for(const p of drops){const rr=max*ease*p.r,x=cx+Math.cos(p.a)*rr,y=cy+Math.sin(p.a)*rr*.58,R=(10+50*ease)*p.s;const g=ctx.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,`rgba(24,16,20,${.58+p.o})`);g.addColorStop(.7,`rgba(40,22,31,${.12+p.o})`);g.addColorStop(1,'rgba(20,10,15,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,Math.PI*2);ctx.fill()}
      if(t<1)raf=requestAnimationFrame(draw);else onDone?.();};raf=requestAnimationFrame(draw);return()=>{dead=true;cancelAnimationFrame(raf)};
  },[active,onDone]);
  return <canvas ref={ref} className="irr-ink"/>;
}

export function InkRegretReborn({content:contentProp=null,media={},embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('apology-ink'),[contentProp]);
  const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:[FALLBACK,FALLBACK,FALLBACK];
  const [phase,setPhase]=useState('lab');const [scratch,setScratch]=useState(0);const [memory,setMemory]=useState(0);const drag=useRef(null);
  const startInk=()=>{tap();setPhase('diffuse')};
  const startScratch=e=>{drag.current={x:e.clientX,p:scratch};e.currentTarget.setPointerCapture?.(e.pointerId)};
  const moveScratch=e=>{if(!drag.current||phase!=='rewrite')return;const p=clamp(drag.current.p+(e.clientX-drag.current.x)/240,0,1);setScratch(p);if(p>.97){drag.current=null;tap(true);setTimeout(()=>setPhase('memories'),380)}};
  const revealMemory=()=>{if(phase!=='memories')return;const n=Math.min(3,memory+1);setMemory(n);tap();if(n===3)setTimeout(()=>setPhase(assets.video?'confession':'finale'),700)};
  return <main className={'ink-regret-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <ExperienceSoundscape preset={content.musicPreset||'Nocturne'} customUrl={assets.music} startAt={content.musicStart||0}/>
    <div className="irr-paper"/><div className="irr-fibers"/><div className="irr-grain"/>
    <header className="irr-chrome"><a href="?">emora<span>.</span></a><small>INK REGRET · RESTORATION LAB</small><b>{phase==='lab'?'00':phase==='diffuse'?'01':phase==='rewrite'?'02':phase==='memories'?'03':'04'}</b></header>
    <section className="irr-stage irr-lab"><article><p>RESTORE / DON’T EXPLAIN</p><h1>{content.message||'Ba’zi gaplarni qayta yozib bo‘lmaydi. Lekin rostini yozish mumkin.'}</h1><em>{content.recipient}</em></article><button className="irr-vial" onClick={startInk} aria-label="Siyoh idishini oching"><i/><b/><span>ochish</span></button></section>
    <section className="irr-stage irr-diffuse"><InkDiffusion active onDone={()=>setPhase('rewrite')}/><article><p>{content.paragraphs?.[0]||'Men xato qildim.'}</p><p>{content.paragraphs?.[1]||'Bahona qilmayman.'}</p><p>{content.paragraphs?.[2]||'Seni tinglashim kerak edi.'}</p></article></section>
    <section className="irr-stage irr-rewrite"><div className="irr-sheet"><p className="wrong">Men shunchaki jahlim chiqdi.<i style={{width:(scratch*100)+'%'}}/></p><p className="right" style={{clipPath:`inset(0 ${(1-scratch)*100}% 0 0)`}}>Men seni og‘ritganimni tushunaman.</p></div><button className="irr-nib" aria-label="Gapni pero bilan qayta yozing" onPointerDown={startScratch} onPointerMove={moveScratch} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><i style={{left:(scratch*100)+'%'}}/><span>peroni torting →</span></button></section>
    <section className="irr-stage irr-memories"><div className="irr-memory-stack">{photos.slice(0,3).map((src,i)=><figure key={i} className={i<memory?'revealed':''} style={{'--i':i}}><img src={src} alt=""/><figcaption>{content.captions?.[i]||['Eslash kerak bo‘lgan narsa.','Yo‘qotishni istamagan lahza.','Qayta ehtiyot qilish kerak bo‘lgan narsa.'][i]}</figcaption></figure>)}</div><button onClick={revealMemory}>{memory<3?'Keyingi negativni yoritish':'Davom etish'} →</button></section>
    <section className="irr-stage irr-confession"><div className="irr-video-frame"><ExperienceVideo src={assets.video} poster={photos[2]} title="Video confession" autoReveal onEnded={()=>setPhase('finale')}/></div><button onClick={()=>setPhase('finale')}>Finalga o‘tish →</button></section>
    <section className="irr-stage irr-finale"><article><p>WHAT REMAINS AFTER THE INK</p><h2>{content.final||'Kechirishni talab qilmayman. Faqat chin dildan uzr so‘rayman.'}</h2><em>{content.recipient}</em><button onClick={()=>location.reload()}>Boshidan ↺</button></article></section>
  </main>;
}
