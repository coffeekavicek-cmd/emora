import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { readUrlContent } from '../system/contentModel.js';
import './afterRain.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function rainTone(stop=false){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
    o.type='brown'; // ignored by browsers -> catch path below
    o.type='sine';
    o.frequency.setValueAtTime(stop?320:95,c.currentTime);
    if(stop)o.frequency.exponentialRampToValueAtTime(620,c.currentTime+.32);
    f.type='lowpass';f.frequency.value=stop?1100:420;
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(stop?.02:.008,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+(stop?.45:.18));
    o.connect(f).connect(g).connect(c.destination);o.start();o.stop(c.currentTime+(stop?.46:.19));setTimeout(()=>c.close(),650);
  }catch{}
}

function RainCanvas({stopped}){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext('2d');let raf=0;let dead=false;
    const drops=Array.from({length:stopped?22:78},()=>({
      x:Math.random(),y:Math.random(),l:.025+Math.random()*.085,s:.0025+Math.random()*.0055,a:.10+Math.random()*.32
    }));
    const resize=()=>{const d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.max(1,canvas.clientWidth*d);canvas.height=Math.max(1,canvas.clientHeight*d);ctx.setTransform(d,0,0,d,0,0)};
    const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
    const draw=()=>{
      if(dead)return;
      const w=canvas.clientWidth,h=canvas.clientHeight;
      ctx.clearRect(0,0,w,h);
      for(const d of drops){
        d.y+=d.s*(stopped?.22:1);
        if(d.y>1.08){d.y=-.08;d.x=Math.random()}
        const x=d.x*w,y=d.y*h,len=d.l*h;
        const g=ctx.createLinearGradient(x,y,x-2,y+len);
        g.addColorStop(0,'rgba(220,236,244,0)');
        g.addColorStop(.45,`rgba(220,236,244,${d.a})`);
        g.addColorStop(1,'rgba(220,236,244,0)');
        ctx.strokeStyle=g;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-2,y+len);ctx.stroke();
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{dead=true;cancelAnimationFrame(raf);ro.disconnect()};
  },[stopped]);
  return <canvas ref={ref} className="ar-rain" aria-hidden="true"/>;
}

function FogCanvas({onProgress,onComplete}){
  const ref=useRef(null),drawing=useRef(false),last=useRef(null),cells=useRef(new Set()),done=useRef(false);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext('2d',{willReadFrequently:false});
    const paint=()=>{
      const d=Math.min(devicePixelRatio||1,1.5);
      canvas.width=Math.max(1,canvas.clientWidth*d);canvas.height=Math.max(1,canvas.clientHeight*d);
      ctx.setTransform(d,0,0,d,0,0);
      const w=canvas.clientWidth,h=canvas.clientHeight;
      const g=ctx.createLinearGradient(0,0,w,h);
      g.addColorStop(0,'rgba(218,228,232,.78)');g.addColorStop(.48,'rgba(183,197,204,.69)');g.addColorStop(1,'rgba(219,225,229,.76)');
      ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
      ctx.globalAlpha=.17;ctx.fillStyle='#ffffff';
      for(let i=0;i<180;i++){ctx.beginPath();ctx.arc(Math.random()*w,Math.random()*h,1+Math.random()*5,0,Math.PI*2);ctx.fill()}
      ctx.globalAlpha=1;
    };
    const ro=new ResizeObserver(paint);ro.observe(canvas);paint();
    return()=>ro.disconnect();
  },[]);

  const erase=(x,y)=>{
    const canvas=ref.current;if(!canvas||done.current)return;
    const ctx=canvas.getContext('2d'),r=Math.max(34,Math.min(canvas.clientWidth,canvas.clientHeight)*.085);
    ctx.save();ctx.globalCompositeOperation='destination-out';
    const g=ctx.createRadialGradient(x,y,r*.12,x,y,r);g.addColorStop(0,'rgba(0,0,0,.92)');g.addColorStop(.7,'rgba(0,0,0,.72)');g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    if(last.current){ctx.lineWidth=r*1.18;ctx.lineCap='round';ctx.strokeStyle='rgba(0,0,0,.72)';ctx.beginPath();ctx.moveTo(last.current.x,last.current.y);ctx.lineTo(x,y);ctx.stroke()}
    ctx.restore();last.current={x,y};
    const gx=Math.floor(x/(canvas.clientWidth/8)),gy=Math.floor(y/(canvas.clientHeight/12));
    cells.current.add(gx+':'+gy);
    const p=clamp(cells.current.size/42,0,1);onProgress(p);
    if(p>=1&&!done.current){done.current=true;drawing.current=false;onComplete()}
  };

  const point=e=>{const r=ref.current.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
  return <canvas ref={ref} className="ar-fog" aria-label="Oynani barmoq bilan artib oching" role="button" tabIndex={0}
    onPointerDown={e=>{drawing.current=true;last.current=null;e.currentTarget.setPointerCapture?.(e.pointerId);const p=point(e);erase(p.x,p.y)}}
    onPointerMove={e=>{if(!drawing.current)return;const p=point(e);erase(p.x,p.y)}}
    onPointerUp={()=>{drawing.current=false;last.current=null}} onPointerCancel={()=>{drawing.current=false;last.current=null}}
    onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!done.current){e.preventDefault();cells.current=new Set(Array.from({length:42},(_,i)=>String(i)));onProgress(1);done.current=true;onComplete()}}}/>;
}

export function AfterRainExperience({content:contentProp=null,definition=null,embedded=false}){
  const c=useMemo(()=>contentProp||readUrlContent('apology-rain'),[contentProp]);
  const [phase,setPhase]=useState('storm');
  const [progress,setProgress]=useState(0);
  const [stopped,setStopped]=useState(false);
  const finalTimer=useRef(null);

  const complete=()=>{
    if(stopped)return;
    setStopped(true);setPhase('still');rainTone(true);
    try{navigator.vibrate?.([7,25,10])}catch{}
    finalTimer.current=setTimeout(()=>setPhase('finale'),1350);
  };
  useEffect(()=>()=>clearTimeout(finalTimer.current),[]);

  const messages=c.paragraphs?.length?c.paragraphs:[
    'Men noto‘g‘ri qildim.',
    'Bahona qidirmayman.',
    'Faqat tushunishingni va eshitishingni istayman.'
  ];

  return <main className={'after-rain '+(embedded?'is-embedded ':'')+'phase-'+phase} style={definition?.art?{'--ar-bg':`url("${definition.art}")`}:undefined}>
    <div className="ar-scene" aria-hidden="true"><div className="ar-world"/><div className="ar-light"/><div className="ar-reflection"/></div>
    <RainCanvas stopped={stopped}/>
    <div className="ar-droplets" aria-hidden="true">{[0,1,2].map(i=><i key={i} className={progress>(i+1)*.22?'lit':''} style={{'--i':i}}/>)}</div>
    <header className="ar-chrome"><a href="?">emora<span>.</span></a><small>AFTER RAIN · APOLOGY 01</small><b>{phase==='storm'?'00':phase==='wiping'?'01':phase==='still'?'02':'03'}</b></header>

    <section className="ar-copy">
      <p>BA’ZAN TO‘G‘RI GAP OYNANING NARIGI TOMONIDA BO‘LADI</p>
      <h1>{c.message||'Ba’zan to‘g‘ri gapni ko‘rish uchun oynani tozalash kerak.'}</h1>
      <em>{c.recipient}</em>
    </section>

    <section className="ar-reveal" aria-live="polite">
      {messages.slice(0,3).map((x,i)=><p key={i} className={progress>(i+1)*.22?'show':''}>{x}</p>)}
    </section>

    {phase!=='finale'&&<div className="ar-gesture">
      <span>{phase==='still'?'YOMG‘IR TO‘XTADI':'OYNA · '+Math.round(progress*100)+'%'}</span>
      <p>{phase==='still'?'Bir lahza jimlik.':'Oynani barmoq bilan artib oching.'}</p>
    </div>}

    {phase!=='finale'&&<FogCanvas onProgress={p=>{setProgress(p);if(p>.02&&phase==='storm')setPhase('wiping')}} onComplete={complete}/>}

    <section className="ar-finale">
      <div className="ar-sunbreak" aria-hidden="true"><i/><i/><i/></div>
      <article><p>THE RAIN HAS STOPPED</p><h2>{c.final||'Agar imkon bersang, bu safar gap bilan emas, harakat bilan tuzataman.'}</h2><em>{c.recipient}</em>
        <button onClick={()=>location.reload()}>Boshidan ↺</button>
      </article>
    </section>
  </main>;
}
