import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
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

function DraggablePolaroid({index,src,caption,onExplore,cardRef,locked=false}){
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
    if(locked)return;
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
    gsap.to(cardRef.current,{scale:1,zIndex:1,duration:.32,ease:'power2.out'});
  };
  return <button ref={cardRef} aria-hidden={locked} tabIndex={locked?-1:0} className={'pm-polaroid pm-polaroid-'+index+(locked?' locked':'')}
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
    <img src={src} alt=""/>
    <span>{caption}</span><b>0{index+1}</b>
  </button>;
}

export function PearlMotionExperience({content:contentProp=null,media=null,embedded=false}){
  const cfg=useMemo(()=>contentProp||readUrlContent('love-pearl'),[contentProp]);
  const root=useRef(null),intro=useRef(null),envelope=useRef(null),letter=useRef(null),paper=useRef(null),sealHost=useRef(null);
  const memory=useRef(null),afterword=useRef(null),finale=useRef(null),particleHost=useRef(null),audioRef=useRef(null),counterRef=useRef(null);
  const p0=useRef(null),p1=useRef(null),p2=useRef(null);
  const sealEngine=useRef(null),particleEngine=useRef(null);
  const sealInitPromise=useRef(null),particleInitPromise=useRef(null);
  const holdTimer=useRef(null),afterHoldTimer=useRef(null),started=useRef(false);
  const [step,setStep]=useState('intro');
  const [holding,setHolding]=useState(false);
  const [sealCracked,setSealCracked]=useState(false);
  const [inkCount,setInkCount]=useState(0);
  const [explored,setExplored]=useState(new Set());
  const [memoryUnlocked,setMemoryUnlocked]=useState(1);
  const [afterHolding,setAfterHolding]=useState(false);
  const [portraitReady,setPortraitReady]=useState(false);
  const [soundOn,setSoundOn]=useState(true);

  const photos=media?.photos||[];
  const portrait=media?.portrait||null;
  const music=media?.music||null;
  const musicUrl=useMemo(()=>{
    if(!music)return '';
    return typeof music==='string'?music:URL.createObjectURL(music);
  },[music]);
  useEffect(()=>()=>{if(music&&typeof music!=='string'&&musicUrl)URL.revokeObjectURL(musicUrl)},[music,musicUrl]);
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
      gsap.set([envelope.current,letter.current,memory.current,afterword.current,finale.current],{autoAlpha:0,pointerEvents:'none'});
      gsap.fromTo('.pm-intro-copy',{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:1.05,ease:'power3.out',delay:.15});
      gsap.fromTo('.pm-paper-stack',{autoAlpha:0,y:34,rotation:8},{autoAlpha:1,y:0,rotation:3,duration:1.25,ease:'power4.out',delay:.35});
    },root);
    return()=>ctx.revert();
  },[]);

  const ensureSealEngine=async()=>{
    if(sealEngine.current)return sealEngine.current;
    if(sealInitPromise.current)return sealInitPromise.current;
    sealInitPromise.current=(async()=>{
      const mod=await import('./PearlSealEngine.js');
      if(!sealHost.current)return null;
      const e=new mod.PearlSealEngine(sealHost.current,{
        onCrack:()=>{mod.playCrackSound();setHolding(false);setSealCracked(true)},
        onSettled:()=>openEnvelope(),
      });
      sealEngine.current=e;
      await e.init();
      return e;
    })().finally(()=>{sealInitPromise.current=null});
    return sealInitPromise.current;
  };

  const ensureParticleEngine=async()=>{
    if(particleEngine.current)return particleEngine.current;
    if(particleInitPromise.current)return particleInitPromise.current;
    particleInitPromise.current=(async()=>{
      const {GalaxyEngine}=await import('../galaxy/GalaxyEngine.js');
      if(!particleHost.current)return null;
      const e=new GalaxyEngine(particleHost.current,{showStars:false,interactive:false});
      particleEngine.current=e;
      await e.init();
      return e;
    })().finally(()=>{particleInitPromise.current=null});
    return particleInitPromise.current;
  };

  const startRitual=async()=>{
    if(started.current)return;started.current=true;softTone(520,.16,.035);
    if(audioRef.current&&musicUrl){
      audioRef.current.volume=0;
      audioRef.current.loop=true;
      audioRef.current.play().then(()=>gsap.to(audioRef.current,{volume:soundOn?.32:0,duration:1.4,ease:'power2.out'})).catch(()=>{});
    }
    try{await ensureSealEngine()}catch{started.current=false;return}
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

  const revealInkParagraph=(next)=>{
    setInkCount(next);
    softTone(300+next*58,.09,.018);
    gsap.fromTo('.pm-letter-continue',{autoAlpha:0,y:8},{autoAlpha:1,y:0,duration:.55,delay:1.45,ease:'power2.out'});
  };

  const startInkSequence=()=>{
    setInkCount(0);
    setTimeout(()=>revealInkParagraph(1),620);
  };

  const continueLetter=()=>{
    if(step!=='ink')return;
    gsap.to('.pm-letter-continue',{autoAlpha:0,y:8,duration:.2});
    if(inkCount<3){
      setTimeout(()=>revealInkParagraph(inkCount+1),260);
      return;
    }
    openMemories();
  };

  const openMemories=()=>{
    if(step!=='ink')return;
    void import('../galaxy/GalaxyEngine.js');
    void import('../galaxy/portraitSampler.js');
    setStep('memories');setMemoryUnlocked(1);setExplored(new Set());thump();
    const cards=[p0.current,p1.current,p2.current];
    gsap.set(cards,{autoAlpha:0});
    const tl=gsap.timeline({defaults:{ease:'power4.out'}});
    tl.to(paper.current,{scale:.87,y:-110,rotation:-2,autoAlpha:.22,filter:'blur(2px)',duration:.9,ease:'power3.inOut'})
      .set(memory.current,{autoAlpha:1,pointerEvents:'auto'},'-=.42')
      .fromTo('.pm-memory-kicker',{autoAlpha:0,y:-12},{autoAlpha:1,y:0,duration:.55},'-=.1')
      .fromTo(p0.current,{autoAlpha:0,y:-250,x:-80,xPercent:-50,yPercent:-52,rotation:-16,scale:.72},
        {autoAlpha:1,y:0,x:0,xPercent:-50,yPercent:-52,rotation:-2,scale:1,duration:.95,ease:'back.out(1.12)'},'-=.15')
      .call(()=>thump(),null,'<+.12');
  };

  const unlockMemory=(index)=>{
    const cards=[p0.current,p1.current,p2.current];
    const card=cards[index];if(!card)return;
    if(index===1){
      gsap.to(p0.current,{x:0,y:0,xPercent:-96,yPercent:-46,rotation:-8,scale:.84,duration:.72,ease:'power3.inOut'});
    }
    if(index===2){
      gsap.to(p0.current,{x:0,y:0,xPercent:-101,yPercent:-44,rotation:-9,scale:.78,duration:.68,ease:'power3.inOut'});
      gsap.to(p1.current,{x:0,y:0,xPercent:-78,yPercent:-52,rotation:-3,scale:.84,duration:.68,ease:'power3.inOut'});
    }
    setMemoryUnlocked(index+1);
    gsap.fromTo(card,
      {autoAlpha:0,y:-260,x:index===1?70:-55,xPercent:-50,yPercent:-52,rotation:index===1?11:15,scale:.72},
      {autoAlpha:1,y:0,x:0,xPercent:-50,yPercent:-52,rotation:0,scale:1,duration:.95,ease:'back.out(1.12)'});
    thump();
  };

  const settleMemories=()=>{
    const cards=[p0.current,p1.current,p2.current];
    const targets=[
      {xPercent:-103,yPercent:-45,rotation:-9,scale:.8,zIndex:3},
      {xPercent:-50,yPercent:-55,rotation:0,scale:.84,zIndex:4},
      {xPercent:3,yPercent:-45,rotation:9,scale:.8,zIndex:3},
    ];
    cards.forEach((card,i)=>gsap.to(card,{x:0,y:0,...targets[i],duration:.82,ease:'power3.inOut'}));
  };

  const markExplored=i=>{
    if(explored.has(i))return;
    const next=new Set(explored);next.add(i);setExplored(next);
    if(i===0)setTimeout(()=>unlockMemory(1),650);
    if(i===1)setTimeout(()=>unlockMemory(2),650);
    if(next.size===3)setTimeout(()=>{settleMemories();gsap.to('.pm-memory-release',{autoAlpha:1,y:0,duration:.6,delay:.55,ease:'power2.out'})},450);
  };

  const openAfterword=()=>{
    if(step!=='memories'||explored.size<3)return;
    setStep('afterword');softTone(210,.18,.028);
    const cards=[p0.current,p1.current,p2.current];
    const tl=gsap.timeline({defaults:{ease:'power4.inOut'}});
    tl.to(cards,{x:0,y:0,xPercent:-50,yPercent:-50,rotation:0,scale:.56,filter:'blur(1px)',duration:.75,stagger:.05})
      .to(cards,{xPercent:(i)=>i===0?28:i===2?-28:0,yPercent:(i)=>i===1?3:9,autoAlpha:.24,duration:.72},'+=.08')
      .to(memory.current,{autoAlpha:.16,duration:.45},'<')
      .set(afterword.current,{autoAlpha:1,pointerEvents:'auto'},'-=.18')
      .fromTo('.pm-afterword-sheet',{y:120,rotationX:-14,scale:.86,autoAlpha:0},{y:0,rotationX:0,scale:1,autoAlpha:1,duration:1.05,ease:'power4.out'})
      .fromTo('.pm-afterword-copy',{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.8},'-=.35');
  };

  const startAfterHold=()=>{
    if(step!=='afterword')return;
    clearTimeout(afterHoldTimer.current);setAfterHolding(true);
    afterHoldTimer.current=setTimeout(()=>{setAfterHolding(false);buildFinale()},900);
  };
  const cancelAfterHold=()=>{if(step!=='afterword')return;clearTimeout(afterHoldTimer.current);setAfterHolding(false)};

  const buildFinale=async()=>{
    if(step!=='afterword')return;
    setStep('converge');softTone(165,.2,.045);
    const tl=gsap.timeline({defaults:{ease:'power4.inOut'}});
    tl.to('.pm-afterword-copy',{autoAlpha:0,y:-18,duration:.35})
      .to('.pm-afterword-sheet',{scale:.83,y:-36,autoAlpha:.12,duration:.75})
      .to(afterword.current,{autoAlpha:0,pointerEvents:'none',duration:.32},'-=.2')
      .to(memory.current,{autoAlpha:0,pointerEvents:'none',duration:.3},'<')
      .set(finale.current,{autoAlpha:1,pointerEvents:'auto'},'-=.05')
      .to(letter.current,{autoAlpha:0,duration:.3},'<')
      .call(()=>startPortrait());
  };

  const startPortrait=async()=>{
    const host=particleHost.current;if(!host)return;
    const [sampler,e]=await Promise.all([
      import('../galaxy/portraitSampler.js'),
      ensureParticleEngine(),
    ]);
    if(!e)return;
    const rect=host.getBoundingClientRect();
    let points;
    const source=portrait||photos[2]||photos[0]||null;
    try{points=source?await sampler.samplePortraitFile(source,{width:rect.width,height:rect.height,count:1650}):sampler.createHeartPoints(rect.width,rect.height,1350)}
    catch{points=sampler.createHeartPoints(rect.width,rect.height,1350)}
    const fit=source?1.1:1.0;
    points=points.map(p=>({...p,x:p.x*fit,y:p.y*fit}));
    const counter={value:0},target=e.points?.length||760;
    if(counterRef.current)counterRef.current.textContent='0';
    gsap.fromTo('.pm-particle-counter',{autoAlpha:0,y:10},{autoAlpha:1,y:0,duration:.45});
    gsap.to(counter,{value:target,duration:2.55,ease:'power2.out',onUpdate:()=>{
      if(counterRef.current)counterRef.current.textContent=Math.round(counter.value).toLocaleString('uz-UZ');
    }});
    gsap.fromTo(particleHost.current,{autoAlpha:0,scale:1.12},{autoAlpha:1,scale:1,duration:.85,ease:'power3.out'});
    e.morphToPortrait(points,{onComplete:()=>{
      setPortraitReady(true);setStep('finale');
      softTone(660,.32,.035);
      try{navigator.vibrate?.([8,35,12])}catch{}
      gsap.fromTo('.pm-final-copy',{autoAlpha:0,y:30},{autoAlpha:1,y:0,duration:1.15,ease:'power3.out'});
    }});
  };

  const shareExperience=async()=>{
    const payload={title:cfg.title||'Emora',text:cfg.final||cfg.message,url:location.href};
    try{
      if(navigator.share){await navigator.share(payload);return}
      await navigator.clipboard.writeText(location.href);
      softTone(760,.09,.02);
    }catch{}
  };

  const saveKeepsake=()=>{
    const esc=s=>String(s||'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
    const quote=esc(cfg.final||cfg.message),name=esc(cfg.recipient||'');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
      <defs><radialGradient id="g"><stop stop-color="#28171f"/><stop offset="1" stop-color="#08070a"/></radialGradient></defs>
      <rect width="1080" height="1350" fill="url(#g)"/>
      <text x="540" y="140" text-anchor="middle" fill="#b79ca8" font-family="Arial" font-size="20" letter-spacing="5">EMORA · PEARL LINEN</text>
      <foreignObject x="120" y="360" width="840" height="430"><div xmlns="http://www.w3.org/1999/xhtml" style="font:64px Georgia,serif;line-height:1.08;text-align:center;color:#fff7f3;">${quote}</div></foreignObject>
      <text x="540" y="1040" text-anchor="middle" fill="#e3a0b1" font-family="Georgia,serif" font-size="82" font-style="italic">${name}</text>
      <circle cx="540" cy="1180" r="3" fill="#e3a0b1"/><circle cx="520" cy="1180" r="2" fill="#fff1ed"/><circle cx="560" cy="1180" r="2" fill="#fff1ed"/>
    </svg>`;
    const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='emora-pearl-'+(cfg.recipient||'keepsake').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.svg';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
  };

  const toggleSound=()=>{
    setSoundOn(v=>{
      const next=!v;
      if(audioRef.current)gsap.to(audioRef.current,{volume:next?.32:0,duration:.35});
      return next;
    });
  };

  const restart=()=>{
    setPortraitReady(false);setExplored(new Set());setMemoryUnlocked(1);setAfterHolding(false);setInkCount(0);setSealCracked(false);setStep('intro');started.current=false;
    particleEngine.current?.reset();sealEngine.current?.reset();
    const tl=gsap.timeline({defaults:{duration:.4}});
    tl.to([envelope.current,letter.current,memory.current,afterword.current,finale.current],{autoAlpha:0,pointerEvents:'none'})
      .set(intro.current,{autoAlpha:1,pointerEvents:'auto',scale:1})
      .fromTo('.pm-intro-copy',{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.7})
      .fromTo('.pm-paper-stack',{autoAlpha:0,y:22},{autoAlpha:1,y:0,duration:.8},'<+.08');
    gsap.set([p0.current,p1.current,p2.current],{clearProps:'transform,filter,opacity,visibility,zIndex'});
    gsap.set('.pm-letter-continue,.pm-memory-release',{autoAlpha:0,y:10});
  };

  useEffect(()=>()=>{clearTimeout(holdTimer.current);clearTimeout(afterHoldTimer.current);sealEngine.current?.destroy();particleEngine.current?.destroy();audioRef.current?.pause()},[]);

  return <main ref={root} className={'pearl-motion '+(embedded?'is-embedded ':'')+'step-'+step}>
    {musicUrl&&<audio ref={audioRef} src={musicUrl} preload="metadata"/>}
    <div className="pm-grain"/><div className="pm-vignette"/>
    <header className="pm-chrome"><a href="?">emora<span>.</span></a><small>PEARL LINEN · FLAGSHIP</small>
      <div className="pm-chrome-actions">{musicUrl&&<button className="pm-sound" onClick={toggleSound} aria-label={soundOn?'Ovozni o‘chirish':'Ovozni yoqish'}>{soundOn?'SOUND ON':'SOUND OFF'}</button>}<b>{step==='intro'?'00':step==='seal'?'01':step==='letter-rise'?'02':step==='ink'?'03':step==='memories'?'04':step==='afterword'?'05':step==='converge'?'06':'07'}</b></div>
    </header>

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
        <div ref={sealHost} className={'pm-seal '+(holding?'holding ':'')+(sealCracked?'cracked':'')}
          role="button" tabIndex={0} aria-label="Wax muhrni bosib ushlab oching"
          onPointerDown={startHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold}
          onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();startHold()}}}
          onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cancelHold()}}}
          onContextMenu={e=>e.preventDefault()}>
          <span className="pm-seal-initial">{(cfg.recipient||'E').trim().charAt(0).toUpperCase()}</span>
        </div>
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
      <button className="pm-letter-continue pm-primary" onClick={continueLetter}>{inkCount<3?'Davomini o‘qish →':'Xotiralarni ochish →'}</button>
    </section>

    <section ref={memory} className="pm-layer pm-memory-layer">
      <p className="pm-memory-kicker">THREE THINGS I KEEP</p>
      <div className="pm-memory-desk">
        <DraggablePolaroid index={0} src={photoUrls[0]} caption={cfg.captions[0]} onExplore={markExplored} cardRef={p0} locked={memoryUnlocked<1}/>
        <DraggablePolaroid index={1} src={photoUrls[1]} caption={cfg.captions[1]} onExplore={markExplored} cardRef={p1} locked={memoryUnlocked<2}/>
        <DraggablePolaroid index={2} src={photoUrls[2]} caption={cfg.captions[2]} onExplore={markExplored} cardRef={p2} locked={memoryUnlocked<3}/>
      </div>
      <p className="pm-memory-note">{explored.size<3?`${explored.size}/3 · xotirani qo‘lingiz bilan oching`:'uchta xotira · bitta odam'}</p>
      <button className="pm-memory-release pm-primary" onClick={openAfterword}>Oxirgi sahifa →</button>
    </section>

    <section ref={afterword} className="pm-layer pm-afterword-layer">
      <article className="pm-afterword-sheet">
        <div className="pm-paper-fiber"/>
        <div className="pm-afterword-copy">
          <p>ONE MORE THING</p>
          <h2>Yana bitta narsa bor.</h2>
          <span>Bu qismni shoshilmay och.</span>
          <button className={'pm-pearl-hold '+(afterHolding?'holding':'')}
            aria-label="Oxirgi satrni bosib ushlab oching"
            onPointerDown={startAfterHold} onPointerUp={cancelAfterHold} onPointerCancel={cancelAfterHold} onPointerLeave={cancelAfterHold}
            onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();startAfterHold()}}}
            onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cancelAfterHold()}}}>
            <i/><b>900ms</b>
          </button>
          <small>marvaridni bosib ushlab turing</small>
        </div>
      </article>
    </section>

    <section ref={finale} className="pm-layer pm-finale-layer">
      <div ref={particleHost} className="pm-particles"/>
      <div className="pm-particle-counter"><b ref={counterRef}>0</b><span>marvarid nuqta · bitta xotira</span></div>
      <div className={'pm-final-copy '+(portraitReady?'ready':'')}>
        <p>AND THIS IS THE ONLY LINE THAT MATTERS</p>
        <h2>{cfg.final}</h2>
        <Signature name={cfg.recipient} className="pm-final-name"/>
        <div className="pm-final-actions">
          {cfg.shareEnabled!==false&&<button onClick={shareExperience}>Ulashish</button>}
          {cfg.saveEnabled!==false&&<button onClick={saveKeepsake}>Keepsake saqlash</button>}
          <button className="pm-final-restart" onClick={restart}>Boshidan ↺</button>
        </div>
      </div>
    </section>
  </main>;
}
