import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PearlSealEngine, playCrackSound } from './PearlSealEngine.js';
import { GalaxyEngine } from '../galaxy/GalaxyEngine.js';
import { createHeartPoints, samplePortraitFile } from '../galaxy/portraitSampler.js';
import { readUrlContent } from '../system/contentModel.js';
import './pearlMotion.css';

const FALLBACK='https://emora-v10-fifteen-experiences-production.up.railway.app/assets/love-pearl.png';

function softTone(freq=440,duration=.12,vol=.028){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.setValueAtTime(freq,c.currentTime);
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(vol,c.currentTime+.006);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+duration+.02);setTimeout(()=>c.close(),320);
  }catch{}
}
function thump(){softTone(120,.09,.05);try{navigator.vibrate?.([9])}catch{}}

function Signature({name,className=''}) {
  return <span className={'pm-signature '+className}>
    <span>{name}</span>
    <svg viewBox="0 0 320 86" aria-hidden="true">
      <path d="M18 57 C44 20 80 18 102 49 C119 72 141 67 153 42 C168 12 194 14 205 42 C216 72 244 68 262 46 C276 29 293 34 306 50"/>
      <path className="pm-signature-tail" d="M62 68 C120 80 204 79 287 65"/>
    </svg>
    <i/>
  </span>;
}

function DraggablePolaroid({index,src,caption,onExplore,cardRef}){
  const pointer=useRef(null);
  const dragged=useRef(false);
  const pos=useRef({x:0,y:0});
  const move=e=>{
    if(!pointer.current)return;
    const dx=e.clientX-pointer.current.x,dy=e.clientY-pointer.current.y;
    if(Math.abs(dx)+Math.abs(dy)>7)dragged.current=true;
    pos.current={x:pointer.current.ox+dx,y:pointer.current.oy+dy};
    gsap.set(cardRef.current,{x:pos.current.x,y:pos.current.y,rotation:(index-1)*5+dx*.018});
  };
  const down=e=>{
    const t=cardRef.current;if(!t)return;
    const x=Number(gsap.getProperty(t,'x'))||0,y=Number(gsap.getProperty(t,'y'))||0;
    pointer.current={x:e.clientX,y:e.clientY,ox:x,oy:y};dragged.current=false;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    gsap.to(t,{scale:1.04,zIndex:12,duration:.18,ease:'power2.out'});
    thump();
  };
  const up=()=>{
    if(!pointer.current)return;
    pointer.current=null;
    onExplore(index);
    gsap.to(cardRef.current,{scale:1,zIndex:index===1?4:3,duration:.28,ease:'power2.out'});
  };
  return <button ref={cardRef} className={'pm-polaroid pm-polaroid-'+index}
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
    <img src={src} alt=""/>
    <span>{caption}</span><b>0{index+1}</b>
  </button>;
}

export function PearlMotionExperience({content:contentProp=null,media=null,embedded=false}){
  const cfg=useMemo(()=>contentProp||readUrlContent('love-pearl'),[contentProp]);
  const root=useRef(null),intro=useRef(null),envelope=useRef(null),letter=useRef(null),paper=useRef(null),sealHost=useRef(null);
  const memory=useRef(null),finale=useRef(null),particleHost=useRef(null);
  const p0=useRef(null),p1=useRef(null),p2=useRef(null);
  const sealEngine=useRef(null),particleEngine=useRef(null);
  const holdTimer=useRef(null),started=useRef(false);
  const [step,setStep]=useState('intro');
  const [holding,setHolding]=useState(false);
  const [inkCount,setInkCount]=useState(0);
  const [explored,setExplored]=useState(new Set());
  const [portraitReady,setPortraitReady]=useState(false);

  const photos=media?.photos||[];
  const portrait=media?.portrait||null;
  const photoUrls=useMemo(()=>{
    if(!photos.length)return [FALLBACK,FALLBACK,FALLBACK];
    return [0,1,2].map(i=>{
      const item=photos[i%photos.length];
      return typeof item==='string'?item:URL.createObjectURL(item);
    });
  },[photos]);
  useEffect(()=>()=>{photoUrls.forEach((u,i)=>{if(photos.length&&typeof photos[i%photos.length]!=='string'&&u!==FALLBACK)URL.revokeObjectURL(u)})},[photos,photoUrls]);

  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.set([envelope.current,letter.current,memory.current,finale.current],{autoAlpha:0,pointerEvents:'none'});
      gsap.fromTo('.pm-intro-copy',{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:1.05,ease:'power3.out',delay:.15});
      gsap.fromTo('.pm-paper-stack',{autoAlpha:0,y:34,rotation:8},{autoAlpha:1,y:0,rotation:3,duration:1.25,ease:'power4.out',delay:.35});
    },root);
    return()=>ctx.revert();
  },[]);

  useEffect(()=>{
    if(!sealHost.current)return;
    const e=new PearlSealEngine(sealHost.current,{
      onCrack:()=>{playCrackSound();setHolding(false)},
      onSettled:()=>openEnvelope(),
    });
    sealEngine.current=e;e.init();
    return()=>e.destroy();
  },[]);

  useEffect(()=>{
    if(!particleHost.current)return;
    const e=new GalaxyEngine(particleHost.current,{showStars:false,interactive:false,onReady:()=>{particleEngine.current=e}});
    particleEngine.current=e;e.init();
    return()=>e.destroy();
  },[]);

  const startRitual=()=>{
    if(started.current)return;started.current=true;softTone(520,.16,.035);
    setStep('seal');
    const tl=gsap.timeline({defaults:{ease:'power3.inOut'}});
    tl.to(intro.current,{autoAlpha:0,scale:.985,duration:.55})
      .set(intro.current,{pointerEvents:'none'})
      .set(envelope.current,{autoAlpha:1,pointerEvents:'auto'})
      .fromTo('.pm-envelope-object',{y:90,scale:.84,rotationX:8},{y:0,scale:1,rotationX:0,duration:1.1,ease:'power4.out'},'<')
      .fromTo('.pm-seal-copy',{autoAlpha:0,y:14},{autoAlpha:1,y:0,duration:.6},'-=.35');
  };

  const startHold=()=>{
    if(step!=='seal')return;
    clearTimeout(holdTimer.current);
    setHolding(true);
    holdTimer.current=setTimeout(()=>sealEngine.current?.crack(),520);
  };
  const cancelHold=()=>{if(step!=='seal')return;clearTimeout(holdTimer.current);setHolding(false)};

  const openEnvelope=()=>{
    setStep('letter-rise');
    const flap=envelope.current?.querySelector('.pm-flap');
    const sheet=envelope.current?.querySelector('.pm-sheet');
    const pocket=envelope.current?.querySelector('.pm-pocket');
    const tl=gsap.timeline({defaults:{ease:'power4.inOut'}});
    tl.to('.pm-seal-copy',{autoAlpha:0,y:18,duration:.28})
      .to(flap,{rotationX:-178,duration:.9},'<')
      .to(sheet,{y:'-47%',scale:1.04,duration:1.15},'-=.45')
      .to(pocket,{y:45,autoAlpha:.5,duration:.8},'-=.75')
      .to(envelope.current,{backgroundColor:'#e7dac8',duration:.45},'-=.65')
      .to('.pm-envelope-object',{scale:1.24,y:85,duration:.95},'-=.6')
      .set(letter.current,{autoAlpha:1,pointerEvents:'auto'})
      .set(paper.current,{transformOrigin:'50% 50%'})
      .fromTo(paper.current,{y:240,scale:.55,rotation:-1,autoAlpha:0},{y:0,scale:1,rotation:0,autoAlpha:1,duration:1.15,ease:'power4.out'})
      .to(envelope.current,{autoAlpha:0,duration:.55},'-=.8')
      .call(()=>{setStep('ink');startInkSequence()});
  };

  const startInkSequence=()=>{
    setInkCount(0);
    [0,1,2].forEach((_,i)=>setTimeout(()=>{
      setInkCount(i+1);softTone(300+i*70,.08,.018);
    },520+i*1180));
    setTimeout(()=>{
      gsap.to('.pm-letter-continue',{autoAlpha:1,y:0,duration:.5,ease:'power2.out'});
    },4050);
  };

  const openMemories=()=>{
    if(step!=='ink')return;
    setStep('memories');thump();
    const cards=[p0.current,p1.current,p2.current];
    const tl=gsap.timeline({defaults:{ease:'power4.out'}});
    tl.to(paper.current,{scale:.87,y:-110,rotation:-2,autoAlpha:.26,filter:'blur(2px)',duration:.75,ease:'power3.inOut'})
      .set(memory.current,{autoAlpha:1,pointerEvents:'auto'},'-=.35')
      .fromTo('.pm-memory-kicker',{autoAlpha:0,y:-12},{autoAlpha:1,y:0,duration:.45},'-=.1');
    cards.forEach((c,i)=>{
      tl.fromTo(c,{autoAlpha:0,y:-220-(i*35),x:(i-1)*65,rotation:(i-1)*18,scale:.78},
        {autoAlpha:1,y:0,x:0,rotation:(i-1)*5,scale:1,duration:.75,ease:'back.out(1.18)'},i===0?'-=.15':'-=.48');
      tl.call(()=>thump(),null,'<+.08');
    });
  };

  const markExplored=i=>setExplored(prev=>{
    const next=new Set(prev);next.add(i);
    if(next.size===3)setTimeout(()=>gsap.to('.pm-memory-release',{autoAlpha:1,y:0,duration:.5,ease:'power2.out'}),250);
    return next;
  });

  const buildFinale=async()=>{
    if(step!=='memories')return;
    setStep('converge');softTone(180,.14,.04);
    const cards=[p0.current,p1.current,p2.current];
    const tl=gsap.timeline({defaults:{ease:'power4.inOut'}});
    cards.forEach((c,i)=>tl.to(c,{x:0,y:0,rotation:0,scale:.72,filter:'blur(1px)',duration:.7},i?'<+.06':0));
    tl.to(cards,{xPercent:(i)=>i===0?38:i===2?-38:0,yPercent:(i)=>i===1?0:6,scale:.42,autoAlpha:0,duration:.7,stagger:.04},'+=.1')
      .to(memory.current,{backgroundColor:'#08070a',duration:.5},'-=.55')
      .set(finale.current,{autoAlpha:1,pointerEvents:'auto'},'-=.35')
      .to(letter.current,{autoAlpha:0,duration:.3},'<')
      .call(()=>startPortrait());
  };

  const startPortrait=async()=>{
    const host=particleHost.current,e=particleEngine.current;if(!host||!e)return;
    const rect=host.getBoundingClientRect();
    let points;
    const source=portrait||photos[2]||photos[0]||null;
    try{points=source?await samplePortraitFile(source,{width:rect.width,height:rect.height,count:1650}):createHeartPoints(rect.width,rect.height,1650)}
    catch{points=createHeartPoints(rect.width,rect.height,1650)}
    gsap.fromTo(particleHost.current,{autoAlpha:0,scale:1.12},{autoAlpha:1,scale:1,duration:.75,ease:'power3.out'});
    e.morphToPortrait(points,{onComplete:()=>{
      setPortraitReady(true);setStep('finale');
      softTone(660,.32,.035);
      try{navigator.vibrate?.([8,35,12])}catch{}
      gsap.fromTo('.pm-final-copy',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:1.15,ease:'power3.out'});
    }});
  };

  const restart=()=>{
    setPortraitReady(false);setExplored(new Set());setInkCount(0);setStep('intro');started.current=false;
    particleEngine.current?.reset();sealEngine.current?.reset();
    const tl=gsap.timeline({defaults:{duration:.4}});
    tl.to([envelope.current,letter.current,memory.current,finale.current],{autoAlpha:0,pointerEvents:'none'})
      .set(intro.current,{autoAlpha:1,pointerEvents:'auto',scale:1})
      .fromTo('.pm-intro-copy',{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.7})
      .fromTo('.pm-paper-stack',{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:.8},'<+.08');
    gsap.set([p0.current,p1.current,p2.current],{clearProps:'transform,filter,opacity,visibility,zIndex'});
    gsap.set('.pm-letter-continue,.pm-memory-release',{autoAlpha:0,y:10});
  };

  useEffect(()=>()=>clearTimeout(holdTimer.current),[]);

  return <main ref={root} className={'pearl-motion '+(embedded?'is-embedded ':'')+'step-'+step}>
    <div className="pm-grain"/><div className="pm-vignette"/>
    <header className="pm-chrome"><a href="?">emora<span>.</span></a><small>PEARL LINEN · FLAGSHIP</small><b>{step==='intro'?'00':step==='seal'?'01':step==='letter-rise'?'02':step==='ink'?'03':step==='memories'?'04':step==='converge'?'05':'06'}</b></header>

    <section ref={intro} className="pm-layer pm-intro">
      <div className="pm-intro-copy">
        <p>PRIVATE LETTER · FOR ONE PERSON</p>
        <h1>{cfg.message}</h1>
        <Signature name={cfg.recipient}/>
        <button className="pm-primary" onClick={startRitual}>Maktubni olish</button>
      </div>
      <div className="pm-paper-stack" aria-hidden="true"><i/><i/><b>for you</b></div>
    </section>

    <section ref={envelope} className="pm-layer pm-envelope-layer">
      <div className="pm-envelope-object">
        <div className="pm-sheet"><Signature name={cfg.recipient} className="pm-sheet-name"/><small>faqat sen uchun</small></div>
        <div className="pm-pocket"/>
        <div className="pm-flap"/>
        <div ref={sealHost} className={'pm-seal '+(holding?'holding':'')}
          role="button" tabIndex={0} aria-label="Wax muhrni bosib ushlab oching"
          onPointerDown={startHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold}
          onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();startHold()}}}
          onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cancelHold()}}}
          onContextMenu={e=>e.preventDefault()}/>
      </div>
      <div className="pm-seal-copy">
        <span>01 · THE SEAL</span><p>Muhrning o‘zini bosib ushlab turing.</p>
        <div className={'pm-hold-meter '+(holding?'holding':'')} aria-hidden="true"><i/></div>
      </div>
    </section>

    <section ref={letter} className="pm-layer pm-letter-layer">
      <article ref={paper} className="pm-paper">
        <div className="pm-paper-fiber"/>
        <p className="pm-date">28 · 09 · 2026</p>
        <Signature name={cfg.recipient} className="pm-letter-name"/>
        <div className="pm-ink">
          {cfg.paragraphs.map((x,i)=><p className={i<inkCount?'visible':''} key={i}><span>{x}</span><i/></p>)}
        </div>
        <p className="pm-signoff">— samimiyat bilan</p>
      </article>
      <button className="pm-letter-continue pm-primary" onClick={openMemories}>Xotiralarni ochish →</button>
    </section>

    <section ref={memory} className="pm-layer pm-memory-layer">
      <p className="pm-memory-kicker">THREE THINGS I KEEP</p>
      <div className="pm-memory-desk">
        <DraggablePolaroid index={0} src={photoUrls[0]} caption={cfg.captions[0]} onExplore={markExplored} cardRef={p0}/>
        <DraggablePolaroid index={1} src={photoUrls[1]} caption={cfg.captions[1]} onExplore={markExplored} cardRef={p1}/>
        <DraggablePolaroid index={2} src={photoUrls[2]} caption={cfg.captions[2]} onExplore={markExplored} cardRef={p2}/>
      </div>
      <p className="pm-memory-note">{explored.size<3?'Uchalasiga ham tegib ko‘ring':'uchta xotira · bitta odam'}</p>
      <button className="pm-memory-release pm-primary" onClick={buildFinale}>Bitta joyga yig‘ish →</button>
    </section>

    <section ref={finale} className="pm-layer pm-finale-layer">
      <div ref={particleHost} className="pm-particles"/>
      <div className={'pm-final-copy '+(portraitReady?'ready':'')}>
        <p>AND THIS IS THE ONLY LINE THAT MATTERS</p>
        <h2>{cfg.final}</h2>
        <Signature name={cfg.recipient} className="pm-final-name"/>
        <button className="pm-final-restart" onClick={restart}>Boshidan ↺</button>
      </div>
    </section>
  </main>;
}
