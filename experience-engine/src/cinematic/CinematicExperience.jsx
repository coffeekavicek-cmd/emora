import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { RitualArtifact } from '../rituals/RitualExperience.jsx';
import { CINEMATIC_SCENARIOS } from './cinematicScenarios.js';
import './cinematic.css';

function personalize(base){
  const q=new URLSearchParams(location.search);
  const read=(k,f,m=180)=>String(q.get(k)||'').trim().slice(0,m)||f;
  return{
    ...base,
    recipient:read('name','Sen uchun',42),
    intro:read('intro',base.intro,150),
    messages:[
      read('m1',base.messages[0],170),
      read('m2',base.messages[1],170),
      read('m3',base.messages[2],170),
    ],
    final:read('final',base.final,220),
  };
}

function pulse(kind='soft'){
  try{navigator.vibrate?.(kind==='strong'?[18,10,25]:[8])}catch{}
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C(),o=ctx.createOscillator(),g=ctx.createGain();
    o.type=kind==='mechanical'?'square':'sine';
    o.frequency.setValueAtTime(kind==='strong'?190:kind==='mechanical'?260:520,ctx.currentTime);
    if(kind==='strong')o.frequency.exponentialRampToValueAtTime(80,ctx.currentTime+.12);
    g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.045,ctx.currentTime+.006);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.16);
    o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.17);setTimeout(()=>ctx.close(),300);
  }catch{}
}

function Scene({children,phaseKey,className=''}) {
  const ref=useRef(null);
  useLayoutEffect(()=>{
    if(!ref.current)return;
    gsap.fromTo(ref.current,{opacity:0,scale:1.025,filter:'blur(12px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.78,ease:'power3.out'});
  },[phaseKey]);
  return <section ref={ref} className={'cin-scene '+className}>{children}</section>;
}

function MemoryMontage({experience,onDone}){
  const [index,setIndex]=useState(0);
  const frame=useRef(null);
  useLayoutEffect(()=>{
    if(!frame.current)return;
    gsap.fromTo(frame.current,{opacity:0,rotateZ:(index-1)*6,y:30,scale:.92},{opacity:1,rotateZ:(index-1)*2,y:0,scale:1,duration:.72,ease:'power3.out'});
  },[index]);
  const next=()=>{
    pulse('mechanical');
    if(index===2){onDone();return}
    gsap.to(frame.current,{opacity:0,x:index%2?30:-30,rotateZ:index%2?5:-5,duration:.3,ease:'power2.in',onComplete:()=>setIndex(i=>i+1)});
  };
  return <div className="cin-memory">
    <div className="cin-memory-strip" aria-hidden="true"><i/><i/><i/><i/><i/></div>
    <figure ref={frame} className={'cin-memory-frame memory-'+index}>
      <img src={experience.art} alt="" />
      <span className="cin-frame-number">0{index+1}</span>
      <figcaption>{experience.messages[index]}</figcaption>
    </figure>
    <button className="cin-action" onClick={next}>{index===2?'Davom etish':'Keyingi xotira'} →</button>
  </div>;
}

function DragProgress({label,onDone,mode='horizontal'}){
  const [p,setP]=useState(0);const start=useRef(null);const done=useRef(false);
  const update=(e)=>{
    if(start.current==null)return;
    const delta=mode==='vertical'?(start.current-e.clientY):(e.clientX-start.current);
    const next=Math.max(0,Math.min(1,Math.abs(delta)/170));setP(next);
    if(next>.92&&!done.current){done.current=true;pulse('strong');setTimeout(onDone,450)}
  };
  return <div className={'cin-drag cin-drag-'+mode} style={{'--p':p}}>
    <div className="cin-drag-visual"><i/><b/><span/></div>
    <button onPointerDown={e=>{start.current=mode==='vertical'?e.clientY:e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)}} onPointerMove={update} onPointerUp={()=>{start.current=null;if(p<.25)setP(0)}}>{label}</button>
  </div>;
}

function HoldGesture({label,onDone,kind='strong'}){
  const [held,setHeld]=useState(false);const timer=useRef(null);const done=useRef(false);
  const start=()=>{if(done.current)return;setHeld(true);timer.current=setTimeout(()=>{done.current=true;pulse(kind);setHeld(false);onDone()},850)};
  const stop=()=>{if(done.current)return;clearTimeout(timer.current);setHeld(false)};
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  return <div className={'cin-hold '+(held?'holding':'')}>
    <div className="cin-hold-object"><i/><b/><span/></div>
    <button onPointerDown={start} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop}>{label}<i/></button>
  </div>;
}

function TapPattern({label,onDone,count=4}){
  const [n,setN]=useState(0);
  const hit=()=>{const next=n+1;pulse('soft');setN(next);if(next>=count)setTimeout(onDone,450)};
  return <div className={'cin-tap-pattern progress-'+n}>
    <div className="cin-pattern-core">{Array.from({length:count},(_,i)=><i key={i} className={i<n?'active':''}/>)}</div>
    <button onClick={hit}>{label} · {Math.min(n+1,count)}/{count}</button>
  </div>;
}

function SecondaryGesture({type,onDone}){
  switch(type){
    case'pluck-petal':return <DragProgress label="Yaproqni torting" onDone={onDone}/>;
    case'tie-knot':return <DragProgress label="Iplarni birlashtiring" onDone={onDone}/>;
    case'open-gate':return <DragProgress label="Darvozani oching" onDone={onDone}/>;
    case'rotate-medallion':return <TapPattern label="Medalyonni aylantiring" onDone={onDone} count={4}/>;
    case'tear-paper':return <DragProgress label="Qog‘ozni yirting" onDone={onDone}/>;
    case'hold-pop':return <HoldGesture label="Sharni ushlab turing" onDone={onDone}/>;
    case'hold-frame':return <HoldGesture label="Kadrni ushlab turing" onDone={onDone} kind="mechanical"/>;
    case'trace-on-glass':return <TapPattern label="Bug‘ga chizing" onDone={onDone} count={5}/>;
    case'drag-nib':return <DragProgress label="Peroni sudrang" onDone={onDone}/>;
    case'dim-light':return <DragProgress label="Yorug‘likni pasaytiring" onDone={onDone} mode="vertical"/>;
    case'rotate-ring':return <TapPattern label="Uzukni aylantiring" onDone={onDone} count={5}/>;
    case'scrub-film':return <DragProgress label="Filmni scrub qiling" onDone={onDone}/>;
    case'drag-horizon':return <DragProgress label="Ufqqa yuqoriga suring" onDone={onDone} mode="vertical"/>;
    default:return <TapPattern label="Ritualni yakunlang" onDone={onDone} count={3}/>;
  }
}

function TurnScene({experience,scenario,onDone}){
  const [armed,setArmed]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setArmed(true),550);return()=>clearTimeout(t)},[]);
  return <div className={'cin-turn turn-'+experience.ritual+' '+(armed?'armed':'')}>
    <img src={experience.art} alt="" />
    <div className="cin-turn-mask"><i/><b/></div>
    <p>{scenario.beats.find(x=>x.type==='turn')?.copy}</p>
    {armed&&<button className="cin-action" onClick={()=>{pulse('strong');onDone()}}>Ochish →</button>}
  </div>;
}

function Finale({experience,scenario,onAfterglow}){
  return <div className={'cin-finale finale-'+scenario.finale}>
    <div className="cin-finale-art"><img src={experience.art} alt="" /><i/></div>
    <div className="cin-finale-particles">{Array.from({length:28},(_,i)=><i key={i} style={{'--i':i}}/>)}</div>
    <div className="cin-finale-copy">
      <span>✦</span><p>{experience.name} · FINALE</p><h2>{experience.final}</h2><em>{experience.recipient}</em>
      <button className="cin-action" onClick={onAfterglow}>Yakun →</button>
    </div>
  </div>;
}

function Afterglow({experience,scenario,onRestart}){
  return <div className="cin-afterglow">
    <img src={experience.art} alt="" /><i className="cin-afterglow-veil"/>
    <div className="cin-afterglow-copy">
      <p>{scenario.beats.find(x=>x.type==='afterglow')?.copy}</p>
      <h2>{experience.recipient}</h2>
      <button className="cin-ghost" onClick={onRestart}>Boshidan ↺</button>
      <a className="cin-ghost" href="?">Barcha experience</a>
    </div>
  </div>;
}

export function CinematicExperience({definition}){
  const experience=useMemo(()=>personalize(definition),[definition]);
  const scenario=CINEMATIC_SCENARIOS[definition.slug];
  const [phase,setPhase]=useState('opening');
  const [live,setLive]=useState('');

  if(!scenario) return null;

  const move=next=>{
    const active=document.querySelector('.cin-scene');
    if(!active){setPhase(next);return}
    gsap.to(active,{opacity:0,scale:.975,filter:'blur(10px)',duration:.42,ease:'power2.in',onComplete:()=>{setLive('');setPhase(next)}});
  };

  return <main className={'cinematic experience-'+experience.slug+' ritual-'+experience.ritual+' phase-'+phase}>
    <div className="cin-world" aria-hidden="true"><img src={experience.art} alt="" /><i/><b/></div>
    <header className="cin-chrome"><a href="?">emora<span>.</span></a><small>{experience.group} · {experience.name}</small><b>{
      {opening:'00',primary:'01',memory:'02',secondary:'03',turn:'04',finale:'05',afterglow:'06'}[phase]
    }</b></header>

    {phase==='opening'&&<Scene phaseKey={phase} className="cin-opening">
      <div className="cin-opening-copy"><p>{experience.eyebrow}</p><h1>{experience.intro}</h1><em>{experience.recipient}</em><button className="cin-action" onClick={()=>move('primary')}>{experience.instruction} →</button></div>
      <div className="cin-opening-symbol"><i/><i/><b/></div>
    </Scene>}

    {phase==='primary'&&<Scene phaseKey={phase} className="cin-primary">
      <div className="cin-scene-heading"><p>{scenario.beats.find(x=>x.type==='gesture')?.copy}</p><h2>{experience.name}</h2></div>
      <RitualArtifact experience={experience} complete={()=>move('memory')} onMessage={i=>setLive(experience.messages[i])}/>
      <div className={'cin-live '+(live?'show':'')}>{live}</div>
    </Scene>}

    {phase==='memory'&&<Scene phaseKey={phase} className="cin-memory-scene">
      <MemoryMontage experience={experience} onDone={()=>move('secondary')}/>
    </Scene>}

    {phase==='secondary'&&<Scene phaseKey={phase} className="cin-secondary">
      <div className="cin-secondary-copy"><p>{scenario.beats.find(x=>x.type==='gesture'&&x.gesture!==scenario.beats.find(b=>b.type==='gesture')?.gesture)?.copy||'Yana bitta kichik ritual.'}</p><h2>{experience.recipient}</h2></div>
      <SecondaryGesture type={scenario.secondary} onDone={()=>move('turn')}/>
    </Scene>}

    {phase==='turn'&&<Scene phaseKey={phase} className="cin-turn-scene">
      <TurnScene experience={experience} scenario={scenario} onDone={()=>move('finale')}/>
    </Scene>}

    {phase==='finale'&&<Scene phaseKey={phase} className="cin-finale-scene">
      <Finale experience={experience} scenario={scenario} onAfterglow={()=>move('afterglow')}/>
    </Scene>}

    {phase==='afterglow'&&<Scene phaseKey={phase} className="cin-afterglow-scene">
      <Afterglow experience={experience} scenario={scenario} onRestart={()=>move('opening')}/>
    </Scene>}
  </main>;
}
