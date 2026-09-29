import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GalaxyEngine } from './GalaxyEngine.js';
import { createNamePoints, samplePortraitFile } from './portraitSampler.js';
import { getRenderTier } from '../system/renderQuality.js';
import './galaxy.css';

const DEFAULT={
  recipient:'Dilnoza',
  intro:'Ba’zi tuyg‘ularni oddiy so‘z bilan aytib bo‘lmaydi.',
  messages:[
    'Sening yoningda oddiy kunlar ham xotiraga aylanadi.',
    'Kulging — mening eng sevimli yulduzim.',
    'Bu olamda seni topganim eng go‘zal tasodif.',
  ],
  final:'Mening kichik olamimda eng yorqin nuqta — sensan.',
};

const clean=(value,fallback,max=220)=>{
  const text=String(value||'').trim().slice(0,max);
  return text||fallback;
};

function configFrom(content){
  if(content){
    return{
      recipient:clean(content.recipient,DEFAULT.recipient,60),
      intro:clean(content.message,DEFAULT.intro,160),
      messages:[0,1,2].map(i=>clean(content.paragraphs?.[i],DEFAULT.messages[i],220)),
      final:clean(content.final,DEFAULT.final,240),
      shareEnabled:content.shareEnabled!==false,
      saveEnabled:content.saveEnabled!==false,
    };
  }
  const q=new URLSearchParams(location.search);
  return{
    recipient:clean(q.get('name'),DEFAULT.recipient,60),
    intro:clean(q.get('intro'),DEFAULT.intro,160),
    messages:[
      clean(q.get('m1'),DEFAULT.messages[0],220),
      clean(q.get('m2'),DEFAULT.messages[1],220),
      clean(q.get('m3'),DEFAULT.messages[2],220),
    ],
    final:clean(q.get('final'),DEFAULT.final,240),
    shareEnabled:q.get('share')!=='0',
    saveEnabled:q.get('save')!=='0',
  };
}

function tone(freq=440,duration=.12,vol=.024){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C(),osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(freq,ctx.currentTime);
    gain.gain.setValueAtTime(.0001,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol,ctx.currentTime+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
    osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration+.02);
    setTimeout(()=>ctx.close(),320);
  }catch{}
}

export function GalaxyExperience({content:contentProp=null,media=null,embedded=false}){
  const config=useMemo(()=>configFrom(contentProp),[contentProp]);
  const initialTier=useMemo(()=>getRenderTier(),[]);
  const hostRef=useRef(null);
  const engineRef=useRef(null);
  const starHitRefs=useRef([]);
  const openedRef=useRef(new Set());
  const holdTimerRef=useRef(null);
  const audioRef=useRef(null);
  const [phase,setPhase]=useState('intro');
  const [opened,setOpened]=useState([]);
  const [activeIndex,setActiveIndex]=useState(-1);
  const [ready,setReady]=useState(initialTier==='fallback');
  const [holding,setHolding]=useState(false);
  const [runtimeFallback,setRuntimeFallback]=useState(initialTier==='fallback');
  const [particleCount,setParticleCount]=useState(0);
  const [soundOn,setSoundOn]=useState(true);

  const portrait=media?.portrait||null;
  const music=media?.music||null;
  const musicUrl=useMemo(()=>{
    if(!music)return '';
    return typeof music==='string'?music:URL.createObjectURL(music);
  },[music]);
  useEffect(()=>()=>{if(music&&typeof music!=='string'&&musicUrl)URL.revokeObjectURL(musicUrl)},[music,musicUrl]);

  const syncStar=useCallback((index,state)=>{
    const el=starHitRefs.current[index];if(!el)return;
    el.style.setProperty('--gx-x',state.x+'px');
    el.style.setProperty('--gx-y',state.y+'px');
    el.style.setProperty('--gx-scale',String(Math.max(.72,state.scale)));
    el.style.setProperty('--gx-alpha',String(Math.max(.12,state.alpha)));
  },[]);

  const onStar=useCallback((index)=>{
    if(openedRef.current.has(index))return;
    openedRef.current.add(index);
    const next=[...openedRef.current];
    setOpened(next);
    setActiveIndex(index);
    tone(420+index*88,.12,.025);
    try{navigator.vibrate?.([8])}catch{}
    if(next.length===3){
      setTimeout(()=>{
        setPhase('constellation');
        tone(220,.18,.03);
      },720);
    }
  },[]);

  useEffect(()=>{
    if(runtimeFallback||!hostRef.current)return;
    const engine=new GalaxyEngine(hostRef.current,{
      onStar,
      onStarLayout:syncStar,
      onReady:meta=>{setParticleCount(meta?.particleCount||0);setReady(true)},
    });
    engineRef.current=engine;
    engine.init().catch(()=>{
      engine.destroy();
      engineRef.current=null;
      setRuntimeFallback(true);
      setReady(true);
    });
    return()=>{engine.destroy();engineRef.current=null};
  },[onStar,runtimeFallback,syncStar]);

  const begin=()=>{
    if(!ready)return;
    openedRef.current.clear();
    setOpened([]);
    setActiveIndex(-1);
    setHolding(false);
    engineRef.current?.reset();
    setPhase('explore');
    tone(190,.24,.024);
    if(audioRef.current&&musicUrl){
      audioRef.current.volume=0;audioRef.current.loop=true;
      audioRef.current.play().then(()=>{
        const target=soundOn ? .28:0;
        const start=performance.now();
        const fade=()=>{
          if(!audioRef.current)return;
          const p=Math.min(1,(performance.now()-start)/1200);
          audioRef.current.volume=target*p;
          if(p<1)requestAnimationFrame(fade);
        };
        requestAnimationFrame(fade);
      }).catch(()=>{});
    }
  };

  const activateStar=index=>{
    if(phase!=='explore')return;
    if(runtimeFallback)onStar(index);
    else engineRef.current?.openStar(index);
  };

  const startCollapse=async()=>{
    setHolding(false);
    setPhase('collapse');
    tone(138,.25,.04);
    try{navigator.vibrate?.([16,16,28])}catch{}
    if(runtimeFallback){
      setTimeout(()=>setPhase('finale'),1450);
      return;
    }
    const engine=engineRef.current;
    if(!engine)return;
    engine.collapseToCore({onComplete:async()=>{
      setPhase('morphing');
      const rect=hostRef.current?.getBoundingClientRect();
      let points;
      try{
        points=portrait&&typeof portrait!=='string'
          ? await samplePortraitFile(portrait,{width:rect?.width||innerWidth,height:rect?.height||innerHeight,count:1700})
          : createNamePoints(config.recipient,rect?.width||innerWidth,rect?.height||innerHeight,1700);
      }catch{
        points=createNamePoints(config.recipient,rect?.width||innerWidth,rect?.height||innerHeight,1500);
      }
      engine.morphToPortrait(points,{onComplete:()=>{
        setPhase('finale');
        tone(660,.3,.032);
        try{navigator.vibrate?.([7,36,11])}catch{}
      }});
    }});
  };

  const beginHold=()=>{
    if(phase!=='constellation'||holding)return;
    setHolding(true);
    clearTimeout(holdTimerRef.current);
    holdTimerRef.current=setTimeout(startCollapse,900);
  };
  const cancelHold=()=>{
    if(phase!=='constellation')return;
    clearTimeout(holdTimerRef.current);
    setHolding(false);
  };

  const toggleSound=()=>{
    setSoundOn(v=>{
      const next=!v;
      if(audioRef.current)audioRef.current.volume=next ? .28 : 0;
      return next;
    });
  };

  const share=async()=>{
    const payload={title:'EMORA · Galaxy Confession',text:config.final,url:location.href};
    try{
      if(navigator.share){await navigator.share(payload);return}
      await navigator.clipboard.writeText(location.href);tone(760,.08,.018);
    }catch{}
  };

  const saveKeepsake=()=>{
    const esc=s=>String(s||'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">'+
      '<rect width="1080" height="1350" fill="#05050c"/>'+
      '<circle cx="540" cy="390" r="2" fill="#fff"/><circle cx="460" cy="330" r="4" fill="#edc9ff"/><circle cx="650" cy="440" r="3" fill="#fff"/>'+
      '<text x="540" y="650" text-anchor="middle" fill="#d9c9e8" font-family="Georgia,serif" font-size="94">'+esc(config.recipient)+'</text>'+
      '<foreignObject x="120" y="745" width="840" height="320"><div xmlns="http://www.w3.org/1999/xhtml" style="font:52px Georgia,serif;line-height:1.15;text-align:center;color:#fff;">'+esc(config.final)+'</div></foreignObject>'+
      '<text x="540" y="1210" text-anchor="middle" fill="#9b8aa9" font-family="Arial" font-size="18" letter-spacing="6">EMORA · GALAXY CONFESSION</text></svg>';
    const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='emora-galaxy-'+config.recipient.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.svg';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),900);
  };

  const restart=()=>{
    clearTimeout(holdTimerRef.current);
    openedRef.current.clear();
    setOpened([]);setActiveIndex(-1);setHolding(false);
    engineRef.current?.reset();
    setPhase('intro');
  };

  useEffect(()=>()=>clearTimeout(holdTimerRef.current),[]);

  const isExplore=phase==='explore';
  const isFinale=phase==='finale';

  return <main className={'gx-experience tier-'+(runtimeFallback?'fallback':initialTier)+' '+(embedded?'is-embedded ':'')+'phase-'+phase} aria-label="EMORA Galaxy Confession">
    {musicUrl&&<audio ref={audioRef} src={musicUrl} preload="metadata"/>}
    <div ref={hostRef} className="gx-world" aria-hidden="true"/>
    {runtimeFallback&&<div className="gx-fallback-world" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>}
    <div className="gx-atmosphere" aria-hidden="true"/>

    <header className="gx-chrome">
      <a href="?" className="gx-brand">emora<span>.</span></a>
      <span className="gx-progress">{phase==='intro'?'ready':isExplore?opened.length+'/3':phase==='constellation'?'all found':phase==='collapse'||phase==='morphing'?'converging':isFinale?'for '+config.recipient:'...'}</span>
      {musicUrl&&<button className="gx-sound" onClick={toggleSound}>{soundOn?'sound on':'sound off'}</button>}
    </header>

    <section className={'gx-scene gx-intro '+(phase==='intro'?'visible':'')} aria-hidden={phase!=='intro'}>
      <div className="gx-intro-copy">
        <h1>{config.intro}</h1>
        <p className="gx-recipient">{config.recipient}</p>
        <p className="gx-intro-note">Galaktikani aylantir. Uchta yorqin yulduz ichida senga atalgan uchta gap bor.</p>
        <button className="gx-enter" onClick={begin} disabled={!ready}>{ready?'Olamni ochish':'Yulduzlar uyg‘onmoqda…'}</button>
      </div>
      <div className="gx-orbit-mark" aria-hidden="true"><i/><i/><b/></div>
    </section>

    <section className={'gx-scene gx-explore '+(isExplore?'visible':'')} aria-hidden={!isExplore}>
      <p className="gx-discovery-count">{opened.length===0?'uchta yulduzni top':opened.length<3?(3-opened.length)+' ta qoldi':'hammasi topildi'}</p>
      <div className={'gx-whisper '+(activeIndex>=0?'show':'')} aria-live="polite">
        <span>{activeIndex>=0?'0'+(activeIndex+1):''}</span>
        <p>{activeIndex>=0?config.messages[activeIndex]:''}</p>
      </div>
      <div className="gx-drag-cue" aria-hidden="true"><i/> surib aylantir</div>
    </section>

    {[0,1,2].map(i=><button
      key={i}
      ref={el=>starHitRefs.current[i]=el}
      className={'gx-star-hit gx-star-'+i+' '+(opened.includes(i)?'opened':'')}
      aria-label={(i+1)+'-xotira yulduzi'}
      disabled={!isExplore||opened.includes(i)}
      onClick={()=>activateStar(i)}
    ><span>{i+1}</span></button>)}

    <section className={'gx-scene gx-constellation '+(phase==='constellation'?'visible':'')} aria-hidden={phase!=='constellation'}>
      <div className="gx-convergence-copy">
        <h2>Uchta nuqta.<br/>Bitta markaz.</h2>
        <p>Markazni bosib ushlab tur. Galaktika endi sen tomonga yig‘iladi.</p>
        <button className={'gx-core-hold '+(holding?'holding':'')}
          aria-label="Galaktika markazini bosib ushlab yig‘ing"
          onPointerDown={beginHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold}
          onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();beginHold()}}}
          onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cancelHold()}}}>
          <i/><b/>
        </button>
        <small>900 ms</small>
      </div>
    </section>

    <section className={'gx-scene gx-collapse '+((phase==='collapse'||phase==='morphing')?'visible':'')} aria-hidden={!(phase==='collapse'||phase==='morphing')}>
      <p>{phase==='collapse'?'hamma yo‘l markazga qaytyapti':'endi yulduzlar ismingni eslayapti'}</p>
      <div className="gx-collapse-ring" aria-hidden="true"/>
    </section>

    <section className={'gx-scene gx-finale '+(isFinale?'visible':'')} aria-hidden={!isFinale}>
      <div className="gx-final-copy">
        <p className="gx-final-meta">{portrait?'yulduzlardan yig‘ilgan portret':'yulduzlardan yozilgan ism'} · {particleCount||'adaptive'} nuqta</p>
        <h2>{config.final}</h2>
        <p className="gx-final-name">{config.recipient}</p>
        <div className="gx-final-actions">
          {config.shareEnabled&&<button onClick={share}>Ulashish</button>}
          {config.saveEnabled&&<button onClick={saveKeepsake}>Keepsake saqlash</button>}
          <button onClick={restart}>Boshidan ↺</button>
        </div>
      </div>
    </section>
  </main>;
}
