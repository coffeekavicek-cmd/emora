import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './inkRegret.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function scratch(freq=180,d=.07,v=.01){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
    o.type='sawtooth';o.frequency.setValueAtTime(freq,c.currentTime);f.type='lowpass';f.frequency.value=760;
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(v,c.currentTime+.004);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
    o.connect(f).connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02);setTimeout(()=>c.close(),220);
  }catch{}
}

function InkCanvas({mode,onDone}){
  const ref=useRef(null);
  useEffect(()=>{
    if(!mode||!ref.current)return;
    const canvas=ref.current,ctx=canvas.getContext('2d');let raf=0,dead=false;
    const d=Math.min(devicePixelRatio||1,1.5),w=innerWidth,h=innerHeight;
    canvas.width=w*d;canvas.height=h*d;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(d,0,0,d,0,0);
    const seed=Array.from({length:mode==='spill'?170:105},(_,i)=>({
      a:i*2.399+(Math.random()-.5)*.7,
      k:.12+Math.random()*.88,
      r:.55+Math.random()*1.7,
      o:.08+Math.random()*.22
    }));
    const t0=performance.now(),duration=mode==='spill'?1750:2100;
    const draw=now=>{
      if(dead)return;
      const t=clamp((now-t0)/duration,0,1),ease=1-Math.pow(1-t,3);
      ctx.clearRect(0,0,w,h);
      const cx=w*(mode==='spill'?.52:.49),cy=h*(mode==='spill'?.48:.43),max=Math.hypot(w,h)*(mode==='spill'?1.03:.42);
      ctx.globalCompositeOperation='source-over';
      for(const p of seed){
        const dist=max*ease*p.k,rr=(8+46*ease)*p.r;
        const x=cx+Math.cos(p.a)*dist,y=cy+Math.sin(p.a)*dist*.72;
        const g=ctx.createRadialGradient(x,y,0,x,y,rr);
        g.addColorStop(0,`rgba(19,15,17,${mode==='spill'?.82:.66})`);g.addColorStop(.64,`rgba(28,19,22,${p.o+.18*ease})`);g.addColorStop(1,'rgba(20,15,17,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rr,0,Math.PI*2);ctx.fill();
      }
      const core=ctx.createRadialGradient(cx,cy,0,cx,cy,max*ease);
      core.addColorStop(0,'rgba(16,12,14,.88)');core.addColorStop(.76,mode==='spill'?'rgba(18,13,15,.92)':'rgba(25,17,20,.62)');core.addColorStop(1,'rgba(18,13,15,0)');
      ctx.fillStyle=core;ctx.fillRect(0,0,w,h);
      if(t<1)raf=requestAnimationFrame(draw);else onDone?.();
    };
    raf=requestAnimationFrame(draw);
    return()=>{dead=true;cancelAnimationFrame(raf)};
  },[mode,onDone]);
  return <canvas ref={ref} className="ir-ink-canvas" aria-hidden="true"/>;
}

function NibRewrite({onDone}){
  const start=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp((e.clientX-start.current)/230,0,1);setP(next);
    if(next>.95){done.current=true;scratch(96,.14,.022);try{navigator.vibrate?.([8,16,8])}catch{};setTimeout(onDone,420)}
  };
  return <div className="ir-rewrite" style={{'--p':p}}>
    <div className="ir-wrong"><span>Men shunchaki jahlim chiqdi.</span><i/></div>
    <div className="ir-right">Men seni og‘ritganimni tushunaman.</div>
    <button aria-label="Peroni o‘ngga sudrab gapni qayta yozing"
      onPointerDown={e=>{start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId);scratch(310,.04,.006)}}
      onPointerMove={move} onPointerUp={()=>start.current=null} onPointerCancel={()=>start.current=null}
      onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!done.current){e.preventDefault();done.current=true;setP(1);setTimeout(onDone,350)}}}>
      <b/><i/><span>peroni sudrang →</span>
    </button>
  </div>;
}

export function InkRegretExperience({content:contentProp=null,embedded=false}){
  const c=useMemo(()=>contentProp||readUrlContent('apology-ink'),[contentProp]);
  const [phase,setPhase]=useState('blank');
  const [inkMode,setInkMode]=useState(null);
  const spillTimer=useRef(null);
  const paragraphs=c.paragraphs?.length?c.paragraphs:['Avval xatoimni tan olaman.','Keyin seni tinglayman.','Va faqat keyin uzr so‘rayman.'];

  const touchDrop=()=>{if(phase!=='blank')return;scratch(120,.1,.015);setPhase('diffuse');setInkMode('diffuse')};
  const finishDiffuse=()=>{if(phase==='diffuse')setPhase('rewrite')};
  const beginSpill=()=>{setPhase('spill');setInkMode('spill');spillTimer.current=setTimeout(()=>setPhase('finale'),2050)};
  useEffect(()=>()=>clearTimeout(spillTimer.current),[]);

  return <main className={'ink-regret '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="ir-paper"/><div className="ir-fibers"/><div className="ir-vignette"/>
    <header className="ir-chrome"><a href="?">emora<span>.</span></a><small>INK OF REGRET · APOLOGY 02</small><b>{phase==='blank'?'00':phase==='diffuse'?'01':phase==='rewrite'?'02':phase==='spill'?'03':'04'}</b></header>
    {inkMode&&<InkCanvas mode={inkMode} onDone={inkMode==='diffuse'?finishDiffuse:undefined}/>}

    <section className="ir-layer ir-blank">
      <article><p>ONE DROP · ONE TRUTH</p><h1>{c.message||'Bir tomchi siyoh ichida aytilmagan uzr bor.'}</h1><em>{c.recipient}</em></article>
      <button className="ir-drop" aria-label="Siyoh tomchisiga teging" onClick={touchDrop}><i/><b/></button>
      <span className="ir-drop-label">siyoh tomchisiga teging</span>
    </section>

    <section className="ir-layer ir-writing">
      <div className="ir-letter">
        <p className="ir-to">{c.recipient},</p>
        {paragraphs.slice(0,3).map((x,i)=><p key={i} className={'ir-line l'+i}>{x}</p>)}
        <div className="ir-sign">rost gap bilan.</div>
      </div>
    </section>

    <section className="ir-layer ir-rewrite-layer">
      <div className="ir-rewrite-copy"><p>02 · REWRITE, DON’T EXPLAIN</p><h2>Bahona emas. To‘g‘ri gap.</h2></div>
      <NibRewrite onDone={beginSpill}/>
    </section>

    <section className="ir-layer ir-spill">
      <p>Ba’zan hamma gapni o‘chirib, faqat rostini qoldirish kerak.</p>
    </section>

    <section className="ir-layer ir-finale">
      <div className="ir-negative-space">
        <p>WHAT REMAINS IS TRUE</p>
        <h2>{c.final||'Kechir deb talab qilmayman. Lekin chin dildan uzr so‘rayman.'}</h2>
        <em>{c.recipient}</em>
        <button onClick={()=>location.reload()}>Boshidan ↺</button>
      </div>
    </section>
  </main>;
}
