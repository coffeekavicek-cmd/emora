import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './cinemaProposal.css';

const FALLBACK='https://emora-v10-fifteen-experiences-production.up.railway.app/assets/proposal-cinema.png';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function cue(freq=180,d=.08,v=.01){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='triangle';o.frequency.setValueAtTime(freq,c.currentTime);
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(v,c.currentTime+.005);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02);setTimeout(()=>c.close(),240);
  }catch{}
}

function usePhotos(media){
  const photos=media?.photos||[];
  const urls=useMemo(()=>{
    if(!photos.length)return [FALLBACK,FALLBACK,FALLBACK];
    return [0,1,2].map(i=>{const p=photos[i%photos.length];return typeof p==='string'?p:URL.createObjectURL(p)});
  },[photos]);
  useEffect(()=>()=>urls.forEach((u,i)=>{if(photos.length&&typeof photos[i%photos.length]!=='string'&&u!==FALLBACK)URL.revokeObjectURL(u)}),[photos,urls]);
  return urls;
}

function Projector({running=false}){
  return <div className={'cp-projector '+(running?'running':'')} aria-hidden="true">
    <div className="cp-reel r1">{Array.from({length:6},(_,i)=><i key={i}/>)}</div>
    <div className="cp-reel r2">{Array.from({length:6},(_,i)=><i key={i}/>)}</div>
    <div className="cp-body"><i/><b/><span/></div>
    <div className="cp-beam"/>
  </div>;
}

function Scrub({urls,captions,onDone}){
  const start=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const index=Math.min(2,Math.floor(p*2.999));
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp((e.clientX-start.current)/250,0,1);setP(next);
    if(next>.95){done.current=true;cue(110,.12,.018);try{navigator.vibrate?.([7,16,7])}catch{};setTimeout(onDone,420)}
  };
  return <div className="cp-scrub" style={{'--p':p}}>
    <div className="cp-film">
      {urls.map((url,i)=><figure key={i} className={i===index?'active':''}><img src={url} alt=""/><figcaption><b>0{i+1}</b><span>{captions?.[i]||['Seni uchratdim.','Seni sevib qoldim.','Qolganini birga yozmoqchiman.'][i]}</span></figcaption></figure>)}
    </div>
    <button aria-label="Film lentasini o‘ngga suring" onPointerDown={e=>{start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)}} onPointerMove={move} onPointerUp={()=>start.current=null} onPointerCancel={()=>start.current=null}
      onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!done.current){e.preventDefault();done.current=true;setP(1);setTimeout(onDone,350)}}}>
      <i style={{width:(p*100)+'%'}}/><span>filmni scrub qiling →</span>
    </button>
  </div>;
}

function Burn({active,onDone}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!active||!ref.current)return;
    const canvas=ref.current,ctx=canvas.getContext('2d');let raf=0,finished=false;
    const d=Math.min(devicePixelRatio||1,1.5),w=innerWidth,h=innerHeight;
    canvas.width=w*d;canvas.height=h*d;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(d,0,0,d,0,0);
    const t0=performance.now();
    const draw=now=>{
      const t=clamp((now-t0)/2050,0,1),max=Math.max(w,h),r=max*(.02+t*1.05),x=w*.54,y=h*.43;
      ctx.clearRect(0,0,w,h);
      const g=ctx.createRadialGradient(x,y,Math.max(0,r-100),x,y,r+60);
      g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.58,'rgba(255,246,213,'+(t*.22)+')');
      g.addColorStop(.69,'rgba(255,193,90,'+(.36+t*.5)+')');g.addColorStop(.78,'rgba(117,36,12,'+(.44+t*.48)+')');
      g.addColorStop(.9,'rgba(9,5,3,'+(.38+t*.55)+')');g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      for(let i=0;i<38;i++){const a=i*.61+t*3.1,rr=r*(.67+(i%8)*.028);ctx.fillStyle='rgba(255,206,112,'+(.04+.16*(1-t))+')';ctx.beginPath();ctx.arc(x+Math.cos(a)*rr,y+Math.sin(a)*rr,1+(i%3),0,Math.PI*2);ctx.fill()}
      if(t<1)raf=requestAnimationFrame(draw);else if(!finished){finished=true;cue(720,.18,.017);setTimeout(onDone,260)}
    };
    raf=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(raf);
  },[active,onDone]);
  return <canvas ref={ref} className="cp-burn" aria-hidden="true"/>;
}

export function CinemaProposalExperience({content:contentProp=null,media=null,embedded=false}){
  const c=useMemo(()=>contentProp||readUrlContent('proposal-cinema'),[contentProp]);
  const urls=usePhotos(media);
  const [phase,setPhase]=useState('theatre');
  const [frame,setFrame]=useState(0);

  useEffect(()=>{
    if(phase!=='montage')return;
    setFrame(0);cue(205,.06,.006);
    const a=setTimeout(()=>{setFrame(1);cue(260,.05,.006)},1250);
    const b=setTimeout(()=>{setFrame(2);cue(320,.05,.006)},2500);
    const d=setTimeout(()=>setPhase('scrub'),3900);
    return()=>[a,b,d].forEach(clearTimeout);
  },[phase]);

  useEffect(()=>{
    if(phase!=='jam')return;
    const t=setTimeout(()=>{cue(92,.12,.018);setPhase('burn')},950);return()=>clearTimeout(t);
  },[phase]);

  return <main className={'cinema-proposal '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="cp-grain"/><div className="cp-vignette"/>
    <header className="cp-chrome"><a href="?">emora<span>.</span></a><small>CINEMA PROPOSAL · PRIVATE SCREENING</small><b>{phase==='theatre'?'00':phase==='montage'?'01':phase==='scrub'?'02':phase==='jam'?'03':phase==='burn'?'04':'05'}</b></header>
    <Projector running={phase!=='theatre'}/>

    <section className="cp-layer cp-theatre">
      <div className="cp-seats" aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i}/>)}</div>
      <article><p>ONE NIGHT · ONE SCREEN</p><h1>{c.message||'Bugungi namoyishda faqat bitta film bor.'}</h1><em>{c.recipient}</em>
        <button onClick={()=>{cue(105,.13,.02);setPhase('montage')}}>Proyektorni yoqish →</button>
      </article>
    </section>

    <section className="cp-layer cp-montage">
      <div className="cp-screen">
        <p>BIZNING HIKOYA</p>
        <figure key={frame}><img src={urls[frame]} alt=""/><figcaption>{c.paragraphs?.[frame]||['1-akt: seni uchratdim.','2-akt: seni sevib qoldim.','3-akt: qolganini birga yozishni istayman.'][frame]}</figcaption></figure>
        <span>24 FPS · FRAME 0{frame+1}</span>
      </div>
    </section>

    <section className="cp-layer cp-scrub-layer">
      <div className="cp-heading"><p>FIND THE LAST FRAME</p><h2>Filmni o‘zing davom ettir.</h2></div>
      <Scrub urls={urls} captions={c.captions} onDone={()=>setPhase('jam')}/>
    </section>

    <section className="cp-layer cp-jam">
      <div className="cp-jam-frame"><img src={urls[2]} alt=""/><i/><b/></div>
      <p>FILM JAM · DO NOT LOOK AWAY</p>
    </section>

    <Burn active={phase==='burn'} onDone={()=>setPhase('question')}/>

    <section className="cp-layer cp-question">
      <div className="cp-question-light"/>
      <article><p>TO BE CONTINUED?</p><h2>{c.final||'Bu filmning davomiga “ha” deysanmi?'}</h2><em>{c.recipient}</em>
        <button onClick={()=>location.reload()}>Boshidan ↺</button>
      </article>
    </section>
  </main>;
}
