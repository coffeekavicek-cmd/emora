import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PearlSealEngine } from './PearlSealEngine.js';
import { GalaxyEngine } from '../galaxy/GalaxyEngine.js';
import { createHeartPoints, samplePortraitFile } from '../galaxy/portraitSampler.js';
import './pearlFlagship.css';

const FALLBACK='https://emora-v10-fifteen-experiences-production.up.railway.app/assets/love-pearl.png';

function readConfig(){
  const q=new URLSearchParams(location.search);
  const read=(key,fallback,max)=>String(q.get(key)||'').trim().slice(0,max)||fallback;
  return{
    name:read('name','Dilnoza',42),
    intro:read('intro','Senga aytolmay yurgan bir nechta gapim bor.',130),
    letter:[
      read('m1','Ba’zan odam hayotga shovqinsiz kiradi. Keyin esa hamma narsa undan oldin va undan keyin bo‘lib qoladi.',240),
      read('m2','Sen bilan oddiy kun ham xotiraga aylanadi. Men aynan shu oddiylikni eng ko‘p qadrlayman.',240),
      read('m3','Bu maktub ichida katta va murakkab gap yo‘q. Faqat rost gap bor.',220),
    ],
    captions:[
      read('c1','bizning birinchi kulgimiz',72),
      read('c2','hech qayerga shoshilmagan kun',72),
      read('c3','yana qaytishni istaydigan lahza',72),
    ],
    final:read('final','Sening yoningda o‘zimni uyga qaytgandek his qilaman.',220),
  };
}

function useEntrance(ref,key){
  useLayoutEffect(()=>{
    if(!ref.current)return;
    gsap.fromTo(ref.current,{opacity:0,scale:1.02,filter:'blur(12px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.9,ease:'power3.out'});
  },[key]);
}

function Handwriting({text,className=''}) {
  return <span className={'pearl-handwriting '+className}>
    <span>{text}</span>
    <i aria-hidden="true"/>
  </span>;
}

function Intro({config,onStart,onPhotos,onPortrait,photosLabel,portraitLabel}){
  const ref=useRef(null);useEntrance(ref,'intro');
  return <section ref={ref} className="pearl-stage pearl-intro">
    <div className="linen-fibers" aria-hidden="true"/>
    <div className="pearl-intro-copy">
      <p className="pearl-kicker">PRIVATE LETTER · FOR ONE PERSON</p>
      <h1>{config.intro}</h1>
      <Handwriting text={config.name} className="intro-name"/>
      <p className="pearl-note">Avval ism yoziladi. Keyin muhrni ushlab sindirasan. Maktubning qolgan qismi o‘zi ochiladi.</p>
      <button className="pearl-button primary" onClick={onStart}>Maktubni olish</button>
      <details className="pearl-assets">
        <summary>Demo rasmlarini almashtirish</summary>
        <label>3 ta xotira<input type="file" accept="image/*" multiple onChange={onPhotos}/><small>{photosLabel}</small></label>
        <label>Final portret<input type="file" accept="image/*" onChange={onPortrait}/><small>{portraitLabel}</small></label>
      </details>
    </div>
    <div className="paper-stack" aria-hidden="true"><i/><i/><b>for you</b></div>
  </section>;
}

function Envelope({config,onDone}){
  const ref=useRef(null),host=useRef(null),engine=useRef(null),env=useRef(null);
  const [armed,setArmed]=useState(false),[cracked,setCracked]=useState(false);
  const timer=useRef(null);
  useEntrance(ref,'envelope');

  useEffect(()=>{
    if(!host.current)return;
    const e=new PearlSealEngine(host.current,{
      onCrack:()=>setCracked(true),
      onSettled:()=>{
        const node=env.current;
        const tl=gsap.timeline({defaults:{ease:'power3.inOut'}});
        tl.to(node.querySelector('.pearl-flap'),{rotateX:-176,duration:.95})
          .to(node.querySelector('.pearl-letter-preview'),{y:'-36%',scale:1.035,duration:1.0},'-=.42')
          .to(node,{y:24,scale:1.06,duration:.75},'-=.72')
          .to(ref.current,{backgroundColor:'#ebe2d3',duration:.45},'-=.45')
          .call(onDone,null,'+=.08');
      }
    });
    engine.current=e;e.init();
    return()=>e.destroy();
  },[onDone]);

  const holdStart=()=>{
    if(cracked)return;
    setArmed(true);
    timer.current=setTimeout(()=>engine.current?.crack(),520);
  };
  const holdEnd=()=>{setArmed(false);clearTimeout(timer.current)};
  useEffect(()=>()=>clearTimeout(timer.current),[]);

  return <section ref={ref} className={'pearl-stage pearl-envelope-stage '+(cracked?'cracked':'')}>
    <div className="dust-field" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{'--i':i}}/>)}</div>
    <div className="pearl-envelope" ref={env}>
      <div className="pearl-letter-preview">
        <Handwriting text={config.name}/>
        <small>faqat sen uchun</small>
      </div>
      <div className="pearl-pocket"/>
      <div className="pearl-flap"/>
      <div className={'seal-host '+(armed?'armed':'')} ref={host}/>
    </div>
    <button className="seal-hold"
      onPointerDown={holdStart}
      onPointerUp={holdEnd}
      onPointerCancel={holdEnd}
      onPointerLeave={holdEnd}>
      <span>{cracked?'muhr ochildi':'muhrni ushlab turing'}</span><i/>
    </button>
  </section>;
}

function Letter({config,onDone}){
  const ref=useRef(null);useEntrance(ref,'letter');
  const [shown,setShown]=useState(1);
  const next=()=>{
    if(shown<3){setShown(x=>x+1);return}
    onDone();
  };
  return <section ref={ref} className="pearl-stage pearl-letter-stage">
    <div className="letter-desk" aria-hidden="true"/>
    <article className="pearl-paper">
      <div className="paper-fibers" aria-hidden="true"/>
      <p className="paper-date">28 · 09 · 2026</p>
      <Handwriting text={config.name} className="letter-name"/>
      <div className="ink-copy">
        {config.letter.map((text,i)=><p key={i} className={i<shown?'ink-visible':''}>{text}</p>)}
      </div>
      <p className="letter-sign">— samimiyat bilan</p>
    </article>
    <button className="pearl-button letter-next" onClick={next}>{shown<3?'Keyingi satr':'Xotiralarni ochish'} →</button>
  </section>;
}

function Memories({config,files,onDone}){
  const ref=useRef(null);useEntrance(ref,'memories');
  const urls=useMemo(()=>{
    if(!files?.length)return [FALLBACK,FALLBACK,FALLBACK];
    return [0,1,2].map(i=>URL.createObjectURL(files[i%files.length]));
  },[files]);
  useEffect(()=>()=>{if(files?.length)urls.forEach(x=>URL.revokeObjectURL(x))},[files,urls]);
  const [opened,setOpened]=useState([]);
  const open=i=>{
    if(opened.includes(i))return;
    const next=[...opened,i];setOpened(next);
    if(next.length===3)setTimeout(onDone,850);
  };
  return <section ref={ref} className="pearl-stage pearl-memory-stage">
    <p className="pearl-kicker">THREE THINGS I KEEP</p>
    <div className="polaroid-table">
      {[0,1,2].map(i=><button key={i} className={'polaroid p'+i+' '+(opened.includes(i)?'opened':'')} onClick={()=>open(i)}>
        <img src={urls[i]} alt="" />
        <span>{config.captions[i]}</span>
        <b>{opened.includes(i)?'✓':'+'}</b>
      </button>)}
    </div>
    <p className="memory-hint">{opened.length<3?'Uchalasini ham oching':'hammasi bir joyga yig‘iladi…'}</p>
  </section>;
}

function Finale({config,portraitFile,onRestart}){
  const ref=useRef(null),host=useRef(null),engine=useRef(null);
  const [ready,setReady]=useState(false);
  useEntrance(ref,'finale');

  useEffect(()=>{
    if(!host.current)return;
    const e=new GalaxyEngine(host.current,{showStars:false,interactive:false,onReady:async()=>{
      engine.current=e;
      const rect=host.current.getBoundingClientRect();
      let points;
      try{
        points=portraitFile?await samplePortraitFile(portraitFile,{width:rect.width,height:rect.height,count:1450}):createHeartPoints(rect.width,rect.height,1450);
      }catch{
        points=createHeartPoints(rect.width,rect.height,1450);
      }
      e.morphToPortrait(points,{onComplete:()=>setReady(true)});
    }});
    engine.current=e;e.init();
    return()=>e.destroy();
  },[portraitFile]);

  return <section ref={ref} className="pearl-stage pearl-finale-stage">
    <div className="pearl-particle-host" ref={host} aria-hidden="true"/>
    <div className={'final-copy '+(ready?'show':'')}>
      <p className="pearl-kicker">AND THIS IS THE ONLY LINE THAT MATTERS</p>
      <h2>{config.final}</h2>
      <Handwriting text={config.name} className="final-name"/>
      <button className="pearl-button ghost" onClick={onRestart}>Boshidan ↺</button>
    </div>
  </section>;
}

export function PearlLinenFlagship(){
  const config=useMemo(readConfig,[]);
  const [phase,setPhase]=useState('intro');
  const [photos,setPhotos]=useState([]);
  const [portrait,setPortrait]=useState(null);

  const transition=useCallback(next=>{
    const active=document.querySelector('.pearl-stage');
    if(!active){setPhase(next);return}
    gsap.to(active,{opacity:0,filter:'blur(10px)',scale:.985,duration:.48,ease:'power2.in',onComplete:()=>setPhase(next)});
  },[]);

  const handlePhotos=e=>setPhotos(Array.from(e.target.files||[]).slice(0,3));
  const handlePortrait=e=>setPortrait(e.target.files?.[0]||null);

  return <main className={'pearl-flagship phase-'+phase}>
    <header className="pearl-chrome">
      <a href="?" className="pearl-brand">emora<span>.</span></a>
      <span>PEARL LINEN · FLAGSHIP 01</span>
      <b>{phase==='intro'?'00':phase==='envelope'?'01':phase==='letter'?'02':phase==='memories'?'03':'04'}</b>
    </header>
    {phase==='intro'&&<Intro config={config} onStart={()=>transition('envelope')} onPhotos={handlePhotos} onPortrait={handlePortrait} photosLabel={photos.length?photos.length+' ta tanlandi':'ixtiyoriy'} portraitLabel={portrait?.name||'ixtiyoriy'}/>}
    {phase==='envelope'&&<Envelope config={config} onDone={()=>transition('letter')}/>}
    {phase==='letter'&&<Letter config={config} onDone={()=>transition('memories')}/>}
    {phase==='memories'&&<Memories config={config} files={photos} onDone={()=>transition('finale')}/>}
    {phase==='finale'&&<Finale config={config} portraitFile={portrait} onRestart={()=>transition('intro')}/>}
  </main>;
}
