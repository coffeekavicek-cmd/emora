import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './silkHeritage.css';

function read(definition){
  const q=new URLSearchParams(location.search);
  const get=(k,f,m=180)=>String(q.get(k)||'').trim().slice(0,m)||f;
  return{
    ...definition,
    recipient:get('name','Aziz mehmon',48),
    intro:get('intro',definition.intro||'Ikki yo‘l bir kun kelib bitta naqshga aylanadi.',150),
    messages:[
      get('m1',definition.messages?.[0]||'Ikki ism. Bitta hikoya.',160),
      get('m2',definition.messages?.[1]||'Sana — yuraklar eslab qoladigan belgi.',160),
      get('m3',definition.messages?.[2]||'Yaqinlar duosi bilan yangi bob boshlanadi.',160),
    ],
    final:get('final',definition.final||'Sizni bu kunning eng qadrli guvohi sifatida kutamiz.',220),
  };
}

function pulse(strong=false){
  try{navigator.vibrate?.(strong?[14,18,22]:[7])}catch{}
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C(),o=ctx.createOscillator(),g=ctx.createGain();
    o.type='sine';o.frequency.setValueAtTime(strong?170:510,ctx.currentTime);
    if(strong)o.frequency.exponentialRampToValueAtTime(92,ctx.currentTime+.17);
    g.gain.setValueAtTime(.0001,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(strong?.035:.018,ctx.currentTime+.008);
    g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.2);
    o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.21);setTimeout(()=>ctx.close(),330);
  }catch{}
}

function GoldThread({progress=1}){
  return <svg className="silk-thread" viewBox="0 0 800 800" aria-hidden="true">
    <path className="silk-thread-shadow" pathLength="1" style={{strokeDashoffset:1-progress}} d="M109 591 C180 521 220 535 280 438 C343 335 377 278 474 249 C553 225 632 269 660 342 C696 437 638 524 546 553 C458 580 368 546 326 479 C282 408 315 333 386 303 C450 277 520 299 552 353 C582 405 558 459 511 481 C461 504 404 482 387 436 C371 391 401 347 442 345 C487 344 511 377 500 411"/>
    <path className="silk-thread-line" pathLength="1" style={{strokeDashoffset:1-progress}} d="M109 591 C180 521 220 535 280 438 C343 335 377 278 474 249 C553 225 632 269 660 342 C696 437 638 524 546 553 C458 580 368 546 326 479 C282 408 315 333 386 303 C450 277 520 299 552 353 C582 405 558 459 511 481 C461 504 404 482 387 436 C371 391 401 347 442 345 C487 344 511 377 500 411"/>
  </svg>;
}

function Layer({children,className=''}) {
  const ref=useRef(null);
  useLayoutEffect(()=>{
    if(!ref.current)return;
    gsap.fromTo(ref.current,{autoAlpha:0,scale:1.02,filter:'blur(11px)'},{autoAlpha:1,scale:1,filter:'blur(0px)',duration:.85,ease:'power3.out'});
  },[]);
  return <section ref={ref} className={'silk-layer '+className}>{children}</section>;
}

export function SilkHeritageExperience({definition}){
  const cfg=useMemo(()=>read(definition),[definition]);
  const [phase,setPhase]=useState('arrival');
  const [drag,setDrag]=useState(0);
  const [stitch,setStitch]=useState(0);
  const [knot,setKnot]=useState(false);
  const start=useRef(null);
  const stitchTimer=useRef(null);

  const move=next=>{
    const active=document.querySelector('.silk-layer');
    if(!active){setPhase(next);return}
    gsap.to(active,{autoAlpha:0,scale:.985,filter:'blur(8px)',duration:.45,ease:'power2.in',onComplete:()=>setPhase(next)});
  };

  const beginDrag=e=>{start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};
  const dragMove=e=>{
    if(start.current==null)return;
    const p=Math.max(0,Math.min(1,(e.clientX-start.current)/Math.max(190,innerWidth*.42)));
    setDrag(p);
    if(p>.93){start.current=null;pulse(true);setTimeout(()=>move('stitch'),260)}
  };
  const stopDrag=()=>{start.current=null;if(drag<.35)gsap.to({v:drag},{v:0,duration:.45,onUpdate:function(){setDrag(this.targets()[0].v)}})};

  useEffect(()=>{
    if(phase!=='stitch')return;
    const proxy={p:0};
    const tween=gsap.to(proxy,{p:1,duration:5.8,ease:'none',onUpdate:()=>setStitch(proxy.p),onComplete:()=>pulse()});
    stitchTimer.current=tween;
    return()=>tween.kill();
  },[phase]);

  const tie=()=>{
    if(stitch<.98)return;
    setKnot(true);pulse(true);
    setTimeout(()=>move('invite'),900);
  };

  return <main className={'silk-heritage phase-'+phase}>
    <div className="silk-grain"/><div className="silk-vignette"/>
    <header className="silk-chrome">
      <a href="?">emora<span>.</span></a><small>SILK HERITAGE · WEDDING 01</small>
      <b>{phase==='arrival'?'00':phase==='unfold'?'01':phase==='stitch'?'02':phase==='invite'?'03':'04'}</b>
    </header>

    {phase==='arrival'&&<Layer className="silk-arrival">
      <div className="silk-folded-object" aria-hidden="true"><i/><i/><b/></div>
      <div className="silk-copy silk-copy-arrival">
        <p>PRIVATE CEREMONY · WOVEN FOR YOU</p>
        <h1>{cfg.intro}</h1>
        <em>{cfg.recipient}</em>
        <button onClick={()=>move('unfold')}>Ipakni ochish →</button>
      </div>
    </Layer>}

    {phase==='unfold'&&<Layer className="silk-unfold">
      <div className="silk-table">
        <div className="silk-underlay">
          <span>{cfg.messages[0]}</span><strong>{cfg.recipient}</strong><small>{cfg.messages[1]}</small>
        </div>
        <div className="silk-drape" style={{'--drag':drag}}>
          <div className="silk-weave"/><div className="silk-fold f1"/><div className="silk-fold f2"/><div className="silk-fold f3"/>
        </div>
      </div>
      <div className="silk-gesture-copy"><span>01 · UNFOLD</span><p>Ipak chetini o‘ngga torting.</p></div>
      <button className="silk-drag-handle" aria-label="Ipakni ochish"
        onPointerDown={beginDrag} onPointerMove={dragMove} onPointerUp={stopDrag} onPointerCancel={stopDrag}>
        <i style={{transform:`scaleX(${Math.max(.05,drag)})`}}/><span>→</span>
      </button>
    </Layer>}

    {phase==='stitch'&&<Layer className="silk-stitch">
      <div className="silk-embroidery">
        <GoldThread progress={stitch}/>
        <div className={'silk-names '+(stitch>.32?'show':'')}><span>{cfg.messages[0]}</span><h2>{cfg.recipient}</h2></div>
        <div className={'silk-date '+(stitch>.67?'show':'')}><small>{cfg.messages[1]}</small><b>28 · 09 · 2026</b></div>
      </div>
      <div className="silk-stitch-status"><span>02 · GOLD THREAD</span><p>{stitch<.98?'Oltin ip naqshni tikyapti…':'Naqsh tayyor. Ikki ipni birlashtiring.'}</p></div>
      <button className={'silk-knot '+(stitch>.98?'ready ':'')+(knot?'tied':'')} disabled={stitch<.98} onClick={tie}>
        <i/><i/><b>{knot?'tugun':'bog‘lash'}</b>
      </button>
    </Layer>}

    {phase==='invite'&&<Layer className="silk-invite">
      <div className="silk-invite-frame">
        <GoldThread progress={1}/>
        <div className="silk-invite-inner">
          <p>WITH THE BLESSING OF OUR FAMILIES</p>
          <h2>{cfg.messages[0]}</h2>
          <em>{cfg.recipient}</em>
          <div className="silk-rule"><i/><b/><i/></div>
          <strong>{cfg.final}</strong>
          <small>{cfg.messages[2]}</small>
          <div className="silk-meta"><span>28 · 09 · 2026</span><span>TOSHKENT</span></div>
          <button onClick={()=>move('afterglow')}>Taklifnomani ko‘rish →</button>
        </div>
      </div>
    </Layer>}

    {phase==='afterglow'&&<Layer className="silk-afterglow">
      <div className="silk-after-orbit" aria-hidden="true"><i/><i/><i/></div>
      <div className="silk-after-copy"><p>THE THREAD IS COMPLETE</p><h2>{cfg.recipient}</h2><span>{cfg.final}</span>
        <button onClick={()=>{setDrag(0);setStitch(0);setKnot(false);move('arrival')}}>Boshidan ↺</button>
      </div>
    </Layer>}
  </main>;
}
