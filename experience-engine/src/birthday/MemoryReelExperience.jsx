import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './memoryReel.css';

const FALLBACK='https://emora-v10-fifteen-experiences-production.up.railway.app/assets/birthday-memory.png';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function cue(freq=340,d=.08,v=.012){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='triangle';o.frequency.setValueAtTime(freq,c.currentTime);
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(v,c.currentTime+.005);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02);setTimeout(()=>c.close(),250);
  }catch{}
}

function usePhotoUrls(media){
  const photos=media?.photos||[];
  const urls=useMemo(()=>{
    if(!photos.length)return [FALLBACK,FALLBACK,FALLBACK];
    return [0,1,2].map(i=>{
      const item=photos[i%photos.length];
      return typeof item==='string'?item:URL.createObjectURL(item);
    });
  },[photos]);
  useEffect(()=>()=>urls.forEach((u,i)=>{
    if(photos.length&&typeof photos[i%photos.length]!=='string'&&u!==FALLBACK)URL.revokeObjectURL(u);
  }),[photos,urls]);
  return urls;
}

function ReelSpin({onComplete}){
  const start=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const down=e=>{if(done.current)return;start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId);cue(190,.05,.008)};
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp(Math.abs(e.clientX-start.current)/210,0,1);setP(next);
    if(next>.94){done.current=true;cue(440,.1,.018);try{navigator.vibrate?.([7])}catch{};setTimeout(onComplete,350)}
  };
  const up=()=>{start.current=null;if(!done.current&&p<.25)setP(0)};
  const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();done.current=true;setP(1);setTimeout(onComplete,320)};
  return <div className="mr-reel-rig" style={{'--turn':(p*820)+'deg','--feed':(p*100)+'%'}}>
    <div className="mr-reel left">{Array.from({length:6},(_,i)=><i key={i}/>)}</div>
    <div className="mr-projector"><i/><b/><span/></div>
    <div className="mr-reel right">{Array.from({length:6},(_,i)=><i key={i}/>)}</div>
    <div className="mr-film-line"><i/></div>
    <button aria-label="Reelni aylantiring" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
      reelni aylantiring <span>{Math.round(p*100)}%</span>
    </button>
  </div>;
}

function FilmScrub({urls,captions,onComplete}){
  const drag=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const index=Math.min(2,Math.floor(p*2.999));
  useEffect(()=>{cue(230+index*70,.045,.006)},[index]);
  const down=e=>{if(done.current)return;drag.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{
    if(drag.current==null||done.current)return;
    const next=clamp((e.clientX-drag.current+20)/245,0,1);setP(next);
    if(next>.96){done.current=true;try{navigator.vibrate?.([5])}catch{};setTimeout(onComplete,420)}
  };
  const up=()=>{drag.current=null};
  const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();const next=clamp(p+.5,0,1);setP(next);if(next>.96){done.current=true;setTimeout(onComplete,350)}};
  return <div className="mr-scrub" style={{'--scrub':(-p*66.666)+'%'}}>
    <div className="mr-film-strip">
      {urls.map((url,i)=><figure key={i} className={i===index?'active':''}><img src={url} alt=""/><figcaption><b>0{i+1}</b><span>{captions[i]}</span></figcaption></figure>)}
    </div>
    <button aria-label="Filmni chapdan o‘ngga suring" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
      <i style={{width:(p*100)+'%'}}/><span>filmni scrub qiling</span>
    </button>
  </div>;
}

function HoldFrame({src,caption,onComplete}){
  const start=useRef(null);const [holding,setHolding]=useState(false);
  const down=e=>{if(start.current!=null)return;start.current=Number(e.timeStamp)||performance.now();setHolding(true);cue(118,.06,.01)};
  const up=e=>{
    if(start.current==null)return;
    const duration=(Number(e.timeStamp)||performance.now())-start.current;start.current=null;setHolding(false);
    if(duration>=780){cue(690,.15,.018);try{navigator.vibrate?.([8,18,8])}catch{};onComplete()}
  };
  return <div className="mr-held-frame">
    <figure><img src={src} alt=""/><figcaption>{caption}</figcaption><i/></figure>
    <button className={holding?'holding':''} aria-label="Tanlangan kadrni bosib ushlab turing"
      onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}
      onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();down(e)}}}
      onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();up(e)}}}>
      <i/><span>kadrni ushlab turing</span><b>800ms</b>
    </button>
  </div>;
}

function BurnCanvas({active,onDone}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!active||!ref.current)return;
    const canvas=ref.current,ctx=canvas.getContext('2d');if(!ctx)return;
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    const resize=()=>{canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0)};
    resize();
    const started=performance.now();
    let raf=0,finished=false;
    const draw=now=>{
      const t=clamp((now-started)/1850,0,1),w=innerWidth,h=innerHeight;
      ctx.clearRect(0,0,w,h);
      const radius=(Math.max(w,h)*.04)+(Math.max(w,h)*.95*t);
      const x=w*.58,y=h*.44;
      const g=ctx.createRadialGradient(x,y,Math.max(0,radius-75),x,y,radius+45);
      g.addColorStop(0,'rgba(255,255,255,0)');
      g.addColorStop(.62,'rgba(255,249,225,'+(0.06+0.32*t)+')');
      g.addColorStop(.73,'rgba(255,188,84,'+(0.34+0.5*t)+')');
      g.addColorStop(.82,'rgba(132,42,15,'+(0.45+0.45*t)+')');
      g.addColorStop(.9,'rgba(17,8,4,'+(0.4+0.55*t)+')');
      g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      for(let i=0;i<28;i++){
        const a=i*.77+t*2.4,rr=radius*(.72+(i%7)*.025);
        ctx.fillStyle='rgba(255,205,116,'+(0.06+.18*(1-t))+')';
        ctx.beginPath();ctx.arc(x+Math.cos(a)*rr,y+Math.sin(a)*rr,1+(i%3),0,Math.PI*2);ctx.fill();
      }
      if(t<1)raf=requestAnimationFrame(draw);
      else if(!finished){finished=true;setTimeout(onDone,260)}
    };
    raf=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(raf);
  },[active,onDone]);
  return <canvas ref={ref} className="mr-burn-canvas" aria-hidden="true"/>;
}

export function MemoryReelExperience({content:contentProp=null,media=null,embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('birthday-memory'),[contentProp]);
  const urls=usePhotoUrls(media);
  const [phase,setPhase]=useState('intro');
  const [countdown,setCountdown]=useState(3);

  useEffect(()=>{
    if(phase!=='leader')return;
    let n=3;setCountdown(n);cue(180,.08,.008);
    const timer=setInterval(()=>{n-=1;if(n<=0){clearInterval(timer);setPhase('reel');return}setCountdown(n);cue(180+n*45,.07,.008)},650);
    return()=>clearInterval(timer);
  },[phase]);

  return <main className={'memory-reel '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="mr-grain"/><div className="mr-flicker"/>
    <header className="mr-chrome"><a href="?">emora<span>.</span></a><small>MEMORY REEL · BIRTHDAY FILM</small><b>{phase==='intro'?'00':phase==='leader'?'01':phase==='reel'?'02':phase==='scrub'?'03':phase==='hold'?'04':phase==='burn'?'05':'06'}</b></header>

    <section className="mr-layer mr-intro">
      <div className="mr-projector-hero" aria-hidden="true"><div className="mr-big-reel a">{Array.from({length:6},(_,i)=><i key={i}/>)}</div><div className="mr-big-reel b">{Array.from({length:6},(_,i)=><i key={i}/>)}</div><b/><span/></div>
      <div className="mr-intro-copy"><p>PRIVATE SCREENING · ONE BIRTHDAY</p><h1>{content.message}</h1><em>{content.recipient}</em><button onClick={()=>setPhase('leader')}>Filmni boshlash →</button></div>
    </section>

    <section className="mr-layer mr-leader"><div className="mr-countdown"><span>{countdown}</span><i/><b/></div></section>

    <section className="mr-layer mr-reel-layer"><div className="mr-heading"><p>02 · THE TRANSPORT</p><h2>Xotiralarni harakatga keltir.</h2></div><ReelSpin onComplete={()=>setPhase('scrub')}/></section>

    <section className="mr-layer mr-scrub-layer"><div className="mr-heading"><p>03 · THREE FRAMES</p><h2>Film ichidan o‘t.</h2></div><FilmScrub urls={urls} captions={content.captions} onComplete={()=>setPhase('hold')}/></section>

    <section className="mr-layer mr-hold-layer"><div className="mr-heading"><p>04 · KEEP THIS FRAME</p><h2>Shu kadrni tanla.</h2></div><HoldFrame src={urls[2]} caption={content.paragraphs[2]} onComplete={()=>setPhase('burn')}/></section>

    <section className="mr-layer mr-burn"><div className="mr-burn-frame"><img src={urls[2]} alt=""/><i/></div><BurnCanvas active={phase==='burn'} onDone={()=>setPhase('finale')}/></section>

    <section className="mr-layer mr-finale">
      <div className="mr-final-film" aria-hidden="true">{urls.map((u,i)=><img key={i} src={u} alt=""/>)}</div>
      <div className="mr-finale-copy"><p>NEXT REEL · NEXT CHAPTER</p><h2>{content.final}</h2><em>{content.recipient}</em><button onClick={()=>setPhase('intro')}>Yana ko‘rish ↺</button></div>
    </section>
  </main>;
}
