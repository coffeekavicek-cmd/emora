import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { readUrlContent } from '../system/contentModel.js';
import './galaxyReference.css';

const STAR_POSITIONS=[
  {x:25,y:33},
  {x:73,y:29},
  {x:57,y:72},
];

export function GalaxyExperience({content:contentProp=null,media=null,embedded=false}){
  const cfg=useMemo(()=>contentProp||readUrlContent('love-galaxy'),[contentProp]);
  const config=useMemo(()=>({
    recipient:cfg.recipient||'Dilnoza',
    intro:cfg.message||'Ba’zi tuyg‘ularni oddiy so‘z bilan aytib bo‘lmaydi.',
    messages:(cfg.paragraphs||[]).slice(0,3),
    final:cfg.final||'Mening kichik olamimda eng yorqin nuqta — sensan.',
  }),[cfg]);

  const hostRef=useRef(null);
  const engineRef=useRef(null);
  const audioRef=useRef(null);
  const openedRef=useRef(new Set());
  const morphQueuedRef=useRef(false);
  const holdTimerRef=useRef(null);
  const [phase,setPhase]=useState('intro');
  const [opened,setOpened]=useState([]);
  const [activeStar,setActiveStar]=useState(null);
  const [ready,setReady]=useState(false);
  const [holding,setHolding]=useState(false);
  const [soundOn,setSoundOn]=useState(true);
  const [portraitReady,setPortraitReady]=useState(false);

  const portrait=media?.portrait||null;
  const music=media?.music||null;
  const musicUrl=useMemo(()=>{
    if(!music)return '';
    return typeof music==='string'?music:URL.createObjectURL(music);
  },[music]);

  useEffect(()=>()=>{if(music&&typeof music!=='string'&&musicUrl)URL.revokeObjectURL(musicUrl)},[music,musicUrl]);

  const ensurePortraitPoints=useCallback(async()=>{
    const rect=hostRef.current?.getBoundingClientRect();
    const width=rect?.width||innerWidth;
    const height=rect?.height||innerHeight;
    const sampler=await import('./portraitSampler.js');
    if(portrait){
      try{return await sampler.samplePortraitFile(portrait,{width,height,count:1250})}
      catch{}
    }
    return sampler.createNamePoints(config.recipient,width,height,1150);
  },[portrait,config.recipient]);

  const queueMorph=useCallback(async()=>{
    if(morphQueuedRef.current)return;
    morphQueuedRef.current=true;
    setPhase('collapse');
    try{navigator.vibrate?.([12,16,18])}catch{}
    const points=await ensurePortraitPoints();
    const engine=engineRef.current;
    if(!engine)return;
    setPhase('morphing');
    engine.morphToPortrait(points,{onComplete:()=>{
      setPortraitReady(true);
      setPhase('portrait');
    }});
  },[ensurePortraitPoints]);

  const onStar=useCallback((index)=>{
    if(openedRef.current.has(index))return;
    openedRef.current.add(index);
    setOpened([...openedRef.current]);
    setActiveStar(index);
    try{navigator.vibrate?.(7)}catch{}
    setTimeout(()=>setActiveStar(current=>current===index?null:current),1800);
    if(openedRef.current.size===3)setTimeout(()=>setPhase('constellation'),1050);
  },[]);

  useEffect(()=>{
    let cancelled=false;
    let engine;
    (async()=>{
      const {GalaxyEngine}=await import('./GalaxyEngine.js');
      if(cancelled||!hostRef.current)return;
      engine=new GalaxyEngine(hostRef.current,{onStar,onReady:()=>setReady(true)});
      engineRef.current=engine;
      try{await engine.init()}
      catch(error){
        console.error('EMORA galaxy init failed',error);
        setPhase('fallback');
      }
    })();
    return()=>{
      cancelled=true;
      clearTimeout(holdTimerRef.current);
      engine?.destroy();
      engineRef.current=null;
      audioRef.current?.pause();
    };
  },[onStar]);

  const begin=()=>{
    if(!ready)return;
    if(audioRef.current&&musicUrl){
      audioRef.current.volume=0;
      audioRef.current.loop=true;
      audioRef.current.play().then(()=>gsap.to(audioRef.current,{volume:soundOn?.26:0,duration:1.6})).catch(()=>{});
    }
    openedRef.current.clear();
    setOpened([]);
    setActiveStar(null);
    setPortraitReady(false);
    morphQueuedRef.current=false;
    engineRef.current?.reset();
    setPhase('explore');
  };

  const beginHold=()=>{
    if(phase!=='constellation'||holding)return;
    setHolding(true);
    holdTimerRef.current=setTimeout(()=>{
      setHolding(false);
      queueMorph();
    },900);
  };
  const cancelHold=()=>{
    clearTimeout(holdTimerRef.current);
    setHolding(false);
  };

  const revealFinale=()=>{
    if(!portraitReady)return;
    setPhase('release');
    engineRef.current?.explode({onComplete:()=>{
      setPhase('silence');
      setTimeout(()=>setPhase('finale'),620);
    }});
  };

  const restart=()=>{
    clearTimeout(holdTimerRef.current);
    openedRef.current.clear();
    morphQueuedRef.current=false;
    setOpened([]);
    setActiveStar(null);
    setHolding(false);
    setPortraitReady(false);
    engineRef.current?.reset();
    setPhase('intro');
  };

  const toggleSound=()=>{
    setSoundOn(v=>{
      const next=!v;
      if(audioRef.current)gsap.to(audioRef.current,{volume:next?.26:0,duration:.3});
      return next;
    });
  };

  const isExplore=phase==='explore';

  return <main className={'galaxy-reference '+(embedded?'is-embedded ':'')+'phase-'+phase} aria-label="EMORA Galaxy Confession">
    {musicUrl&&<audio ref={audioRef} src={musicUrl} preload="metadata"/>}
    <div className="gr-world" ref={hostRef} aria-hidden="true"/>
    <div className="gr-depth"/><div className="gr-grain"/>

    <header className="gr-chrome">
      <a href="?">emora<span>.</span></a>
      <small>GALAXY CONFESSION</small>
      <div>{musicUrl&&<button onClick={toggleSound}>{soundOn?'SOUND ON':'SOUND OFF'}</button>}<b>{phase==='intro'?'00':isExplore?String(opened.length).padStart(2,'0')+'/03':phase==='constellation'?'04':'••'}</b></div>
    </header>

    <section className={'gr-intro '+(phase==='intro'?'visible':'')} aria-hidden={phase!=='intro'}>
      <p>SENGA ATALGAN KICHIK OLAM</p>
      <h1>{config.intro}</h1>
      <em>{config.recipient}</em>
      <button className="gr-enter" onClick={begin} disabled={!ready}>{ready?'Olamga kirish':'Yulduzlar uyg‘onmoqda…'}</button>
      <span className="gr-instruction">ichkarida uchta yorqin nuqta bor</span>
    </section>

    <section className={'gr-explore '+(isExplore?'visible':'')} aria-hidden={!isExplore}>
      <div className="gr-whisper">
        <span>{opened.length===0?'galaktikani suring':opened.length<3?(3-opened.length)+' ta sir qoldi':'endi markaz uyg‘onadi'}</span>
      </div>
      {STAR_POSITIONS.map((p,i)=><div key={i} className={'gr-discovery '+(activeStar===i?'show':'')} style={{left:p.x+'%',top:p.y+'%'}}>
        <i>0{i+1}</i><p>{config.messages[i]||''}</p>
      </div>)}
    </section>

    <section className={'gr-lock '+(phase==='constellation'?'visible':'')} aria-hidden={phase!=='constellation'}>
      <div className="gr-lines" aria-hidden="true"><i/><i/><i/><b/><b/></div>
      <div className={'gr-halo '+(holding?'holding':'')} role="button" tabIndex={0} aria-label="Galaktika markazini bosib ushlab yig‘ing"
        onPointerDown={beginHold} onPointerUp={cancelHold} onPointerLeave={cancelHold} onPointerCancel={cancelHold}
        onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();beginHold()}}}
        onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cancelHold()}}}>
        <i/><span>ushlab tur</span>
      </div>
      <p>Uch nuqta. Bitta markaz.</p>
    </section>

    <section className={'gr-morph '+(['collapse','morphing','portrait'].includes(phase)?'visible':'')} aria-hidden={!['collapse','morphing','portrait'].includes(phase)}>
      <div className={'gr-portrait-copy '+(phase==='portrait'?'show':'')}>
        <p>{portrait?'Yulduzlar tanish qiyofaga aylandi':'Yulduzlar bitta ismga aylandi'}</p>
        <h2>{config.recipient}</h2>
        {phase==='portrait'&&<button className="gr-release" onClick={revealFinale}>qo‘yib yubor</button>}
      </div>
    </section>

    <section className={'gr-silence '+(phase==='silence'?'visible':'')} aria-hidden={phase!=='silence'}><i>✦</i></section>

    <section className={'gr-finale '+(phase==='finale'?'visible':'')} aria-hidden={phase!=='finale'}>
      <p>OXIRIDA FAQAT BITTA GAP QOLDI</p>
      <h2>{config.final}</h2>
      <em>{config.recipient}</em>
      <button onClick={restart}>yana bir marta ↺</button>
    </section>

    {phase==='fallback'&&<section className="gr-fallback visible"><h1>Bu olam ochilmadi.</h1><p>WebGL mavjud brauzerda qayta oching.</p></section>}
  </main>;
}
