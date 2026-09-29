import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './roseTheatre.css';

const FALLBACK='https://emora-v10-fifteen-experiences-production.up.railway.app/assets/love-rose.png';
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function cue(freq=280,duration=.08,volume=.012){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.value=freq;
    g.gain.setValueAtTime(.0001,c.currentTime);
    g.gain.exponentialRampToValueAtTime(volume,c.currentTime+.006);
    g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+duration+.02);
    setTimeout(()=>c.close(),260);
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

function CurtainGesture({onComplete}){
  const start=useRef(null),done=useRef(false);
  const [progress,setProgress]=useState(0);
  const down=e=>{if(done.current)return;start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId);cue(120,.05,.007)};
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp(Math.abs(e.clientX-start.current)/190,0,1);setProgress(next);
    if(next>.95){done.current=true;start.current=null;setProgress(1);cue(430,.16,.018);try{navigator.vibrate?.([7,22,8])}catch{};setTimeout(onComplete,420)}
  };
  const up=()=>{start.current=null;if(!done.current&&progress<.28)setProgress(0)};
  const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();done.current=true;setProgress(1);cue(430,.16,.018);setTimeout(onComplete,360)};
  return <div className="rt-curtain-rig" style={{
    '--left':(-progress*47)+'%','--right':(progress*47)+'%',
    '--fold':String(1-progress*.34),'--stage-glow':String(.12+progress*.88)
  }}>
    <div className="rt-curtain rt-left"/><div className="rt-curtain rt-right"/><div className="rt-stage-glow"/>
    <button className="rt-curtain-handle" aria-label="Velvet pardani oching"
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
      <span>Pardani oching</span><b>{Math.round(progress*100)}%</b>
    </button>
  </div>;
}

function PetalGesture({onComplete}){
  const start=useRef(null),done=useRef(false);
  const [progress,setProgress]=useState(0);
  const down=e=>{if(done.current)return;start.current=e.clientY;e.currentTarget.setPointerCapture?.(e.pointerId);cue(260,.04,.007)};
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp((e.clientY-start.current)/115,0,1);setProgress(next);
    if(next>.92){done.current=true;start.current=null;setProgress(1);cue(610,.13,.018);try{navigator.vibrate?.([5,16,8])}catch{};setTimeout(onComplete,360)}
  };
  const up=()=>{start.current=null;if(!done.current&&progress<.3)setProgress(0)};
  const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();done.current=true;setProgress(1);setTimeout(onComplete,320)};
  return <button className="rt-petal" style={{'--pluck':(progress*86)+'px','--fade':String(1-progress*.55)}} aria-label="Atirgul yaprog‘ini uzing"
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
    <i/><span>yaproqni pastga torting</span>
  </button>;
}

function PetalCanvas({active}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!active||!ref.current)return;
    const canvas=ref.current,ctx=canvas.getContext('2d');if(!ctx)return;
    let raf=0,dead=false;
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    const resize=()=>{
      const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
      canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);
      canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize();
    const petals=Array.from({length:150},(_,i)=>{
      const a=(i/150)*Math.PI*2+(Math.random()-.5)*.22,ring=1+(i%5)*.055;
      return{x:Math.random()*innerWidth,y:-40-Math.random()*innerHeight*.8,
        tx:innerWidth*.5+Math.cos(a)*innerWidth*.27*ring,ty:innerHeight*.44+Math.sin(a)*innerHeight*.31*ring,
        r:2.7+Math.random()*5.8,rot:Math.random()*Math.PI,s:Math.random()*2-1,alpha:.38+Math.random()*.55,delay:Math.random()*.65};
    });
    const started=performance.now();
    const draw=now=>{
      if(dead)return;
      const t=(now-started)/1000,w=innerWidth,h=innerHeight;ctx.clearRect(0,0,w,h);
      for(const p of petals){
        const q=clamp((t-p.delay)/2.1,0,1),eased=1-Math.pow(1-q,3);
        const x=p.x+(p.tx-p.x)*eased+Math.sin(t*2+p.rot)*(1-q)*18,y=p.y+(p.ty-p.y)*eased;
        ctx.save();ctx.translate(x,y);ctx.rotate(p.rot+t*p.s*.6);ctx.globalAlpha=p.alpha*(.25+.75*q);
        const g=ctx.createLinearGradient(-p.r,0,p.r,0);g.addColorStop(0,'#5b081c');g.addColorStop(.52,'#bd3150');g.addColorStop(1,'#6d0b27');
        ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,p.r*1.3,p.r*.68,.38,0,Math.PI*2);ctx.fill();ctx.restore();
      }
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    return()=>{dead=true;cancelAnimationFrame(raf)};
  },[active]);
  return <canvas ref={ref} className="rt-petal-canvas" aria-hidden="true"/>;
}

export function RoseTheatreExperience({content:contentProp=null,media=null,embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('love-rose'),[contentProp]);
  const urls=usePhotoUrls(media);
  const [phase,setPhase]=useState('intro');
  const [memory,setMemory]=useState(0);

  useEffect(()=>{
    if(phase!=='memories')return;
    setMemory(0);
    const timers=[450,1550,2650].map((ms,i)=>setTimeout(()=>{setMemory(i+1);cue(220+i*55,.045,.006)},ms));
    const ready=setTimeout(()=>setPhase('petal'),3900);
    return()=>{timers.forEach(clearTimeout);clearTimeout(ready)};
  },[phase]);

  const finale=()=>{setPhase('blackout');setTimeout(()=>setPhase('finale'),820)};

  return <main className={'rose-theatre '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="rt-stage" aria-hidden="true"><div className="rt-proscenium"/><div className="rt-floor"/><div className="rt-spotlight"/></div>
    <div className="rt-grain"/>
    <header className="rt-chrome"><a href="?">emora<span>.</span></a><small>ROSE THEATRE · LOVE 01</small><b>{phase==='intro'?'00':phase==='curtain'?'01':phase==='memories'?'02':phase==='petal'?'03':phase==='blackout'?'04':'05'}</b></header>

    <section className="rt-layer rt-intro">
      <div className="rt-intro-copy"><p>TONIGHT · ONE SEAT · ONE PERSON</p><h1>{content.message}</h1><em>{content.recipient}</em><button onClick={()=>setPhase('curtain')}>Sahnani ochish →</button></div>
      <div className="rt-ticket" aria-hidden="true"><span>PRIVATE</span><b>01</b><i>{content.recipient}</i></div>
    </section>

    <section className="rt-layer rt-curtain-layer">
      <div className="rt-stage-label"><p>01 · THE CURTAIN</p><h2>Pardani o‘zing och.</h2></div>
      <CurtainGesture onComplete={()=>setPhase('memories')}/>
    </section>

    <section className="rt-layer rt-memories">
      <div className="rt-stage-name"><p>THE CAST</p><h2>{content.recipient}</h2></div>
      <div className="rt-filmline">{urls.map((url,i)=><figure key={i} className={memory>i?'show':''}>
        <div><img src={url} alt=""/><i/></div><figcaption><b>0{i+1}</b><span>{content.captions[i]}</span></figcaption>
      </figure>)}</div>
    </section>

    <section className="rt-layer rt-petal-layer">
      <div className="rt-petal-copy"><p>ONE PETAL · ONE TRUE LINE</p><h2>{content.paragraphs[2]}</h2><span>Bu gap parda ortida qolmasin.</span></div>
      <PetalGesture onComplete={finale}/>
    </section>

    <section className="rt-layer rt-blackout"><span>·</span></section>

    <section className="rt-layer rt-finale">
      <PetalCanvas active={phase==='finale'}/>
      <div className="rt-portrait"><img src={urls[0]} alt=""/><i/></div>
      <div className="rt-finale-copy"><p>THE CURTAIN OPENS AGAIN</p><h2>{content.final}</h2><em>{content.recipient}</em><button onClick={()=>{setMemory(0);setPhase('intro')}}>Encore ↺</button></div>
    </section>
  </main>;
}
