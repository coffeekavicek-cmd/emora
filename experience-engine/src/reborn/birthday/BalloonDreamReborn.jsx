import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './balloonDreamReborn.css';
import './balloonPhysics.css';

const FALLBACKS=['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80'];
function pulse(strong=false){try{navigator.vibrate?.(strong?[10,20,16]:[5])}catch{}}

function HoldPop({onDone}){
 const timer=useRef(null),started=useRef(0),[holding,setHolding]=useState(false);
 const complete=()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;started.current=0;setHolding(false);pulse(true);onDone()};
 const down=()=>{if(timer.current)return;started.current=performance.now();setHolding(true);timer.current=setTimeout(complete,900)};
 const up=()=>{const elapsed=started.current?performance.now()-started.current:0;if(timer.current){clearTimeout(timer.current);timer.current=null}started.current=0;setHolding(false);if(elapsed>=850)complete()};
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 return <button className={'bdr-hold '+(holding?'holding':'')} aria-label="Katta sharni bosib ushlab yoring" onPointerDown={down} onPointerUp={up} onPointerLeave={up} onPointerCancel={up}><i/><span>bosib ushlab turing</span><b>900ms</b></button>
}

function useBalloonPhysics(nodes){
 const api=useRef(null);
 useEffect(()=>{let dead=false,raf=0,world=null;const active=[false,false,false];
  (async()=>{try{
   const mod=await import('@dimforge/rapier3d-compat');const RAPIER=mod.default||mod;await RAPIER.init();if(dead)return;
   world=new RAPIER.World({x:0,y:-.7,z:0});
   const bodies=[0,1,2].map((_,i)=>{
    const body=world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0,0,0).setGravityScale(0).setLinearDamping(.18).setAngularDamping(.28));
    world.createCollider(RAPIER.ColliderDesc.ball(.48).setRestitution(.3),body);
    const el=nodes.current[i];if(el){el.classList.add('physics-bound');el.style.setProperty('--phys-x','0px');el.style.setProperty('--phys-y','0px');el.style.setProperty('--phys-r','0deg')}
    return body;
   });
   api.current={release(i){if(active[i])return;active[i]=true;const body=bodies[i];body.setGravityScale(-1.55,true);body.setLinvel({x:(i-1)*.34+(Math.random()-.5)*.14,y:1.42+Math.random()*.28,z:0},true);body.setAngvel({x:0,y:0,z:(i-1)*.72+(Math.random()-.5)*.35},true)}};
   const tick=()=>{
    if(dead)return;
    for(let i=0;i<3;i++)if(!active[i]){const body=bodies[i];body.setTranslation({x:0,y:0,z:0},true);body.setLinvel({x:0,y:0,z:0},true);body.setAngvel({x:0,y:0,z:0},true)}
    world.step();
    for(let i=0;i<3;i++){
     const body=bodies[i],p=body.translation(),r=body.rotation(),angle=2*Math.atan2(r.z,r.w)*180/Math.PI,el=nodes.current[i];
     if(el){el.style.setProperty('--phys-x',`${p.x*28}px`);el.style.setProperty('--phys-y',`${-p.y*32}px`);el.style.setProperty('--phys-r',`${angle}deg`)}
    }
    raf=requestAnimationFrame(tick)
   };
   tick();
  }catch{api.current=null}})();
  return()=>{dead=true;cancelAnimationFrame(raf);api.current=null;try{world?.free?.()}catch{}};
 },[nodes]);
 return api;
}

export function BalloonDreamReborn({content:contentProp=null,media={},embedded=false}){
 const content=useMemo(()=>contentProp||readUrlContent('birthday-balloon'),[contentProp]);const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;
 const [phase,setPhase]=useState('room');const [released,setReleased]=useState([]);const [memory,setMemory]=useState(0);const [pressure,setPressure]=useState(false);const balloonNodes=useRef([]);const physics=useBalloonPhysics(balloonNodes);
 const release=i=>{if(released.includes(i)||phase!=='room')return;physics.current?.release(i);const n=[...released,i];setReleased(n);setMemory(Math.max(memory,i+1));pulse();if(n.length===3)setTimeout(()=>setPhase(assets.video?'film':'hero'),950)};
 const pop=()=>{setPressure(true);setPhase('silence');setTimeout(()=>{setPressure(false);setPhase('sky')},500)};const roomLevel=released.length;
 return <main className={'balloon-dream-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase+' room-level-'+roomLevel+(pressure?' pressure':'')} style={{'--room-level':roomLevel}}>
  <ExperienceSoundscape preset={content.musicPreset||'Dream'} customUrl={assets.music} startAt={content.musicStart||0}/>
  <div className="bdr-room" aria-hidden="true"><div className="bdr-wall back"/><div className="bdr-wall left"/><div className="bdr-wall right"/><div className="bdr-floor"/><div className="bdr-ceiling"><i/><i/><i/><i/></div><div className="bdr-window"><i/><b/></div><div className="bdr-moonbeam"/><div className="bdr-room-shadow"/></div><div className="bdr-grain"/><div className="bdr-vignette"/>
  <header className="bdr-chrome"><a href="?">emora<span>.</span></a><small>BALLOON DREAM · PHYSICS ROOM</small><b>{phase==='room'?'00':phase==='film'?'01':phase==='hero'?'02':phase==='silence'?'03':'04'}</b></header>
  <section className="bdr-stage bdr-room-stage"><article><p>THREE BALLOONS · THREE MEMORIES</p><h1>{content.message||'Bu xona shiftida uchta xotira osilib turibdi.'}</h1><em>{content.recipient}</em></article><div className="bdr-balloons">{[0,1,2].map(i=><button ref={el=>{balloonNodes.current[i]=el}} key={i} className={'bdr-balloon '+(released.includes(i)?'released':'')} style={{'--i':i}} aria-label={(i+1)+'-sharni qo‘yib yuboring'} onClick={()=>release(i)}><i/><b/><span>{String(i+1).padStart(2,'0')}</span></button>)}</div><div className="bdr-projection-wall" aria-hidden="true">{photos.slice(0,3).map((src,i)=><figure key={i} className={memory>i?'show':''} style={{'--i':i}}><img src={src} alt=""/><figcaption>{content.captions?.[i]||['Shu kulgi.','Shu sarguzasht.','Shu inson.'][i]}</figcaption><i/></figure>)}</div><div className="bdr-room-meter"><span>ROOM LIGHT</span><i/><b>{roomLevel}/3</b></div></section>
  <section className="bdr-stage bdr-film"><div className="bdr-cinema-balloon"><div className="bdr-cinema-skin"><ExperienceVideo src={assets.video} poster={photos[2]} title="Birthday surprise film" autoReveal onEnded={()=>setPhase('hero')}/></div><i/><span/></div><p>ONE BALLOON CAME BACK WITH A MOVING MEMORY</p><button onClick={()=>setPhase('hero')}>Oxirgi shar →</button></section>
  <section className="bdr-stage bdr-hero"><div className="bdr-hero-balloon"><div><img src={assets.portrait||photos[0]} alt=""/><i/></div><span/></div><article><p>ONE LAST WISH</p><h2>{content.recipient}</h2><span>Bu safar sharni bosganda butun xona javob beradi.</span></article><HoldPop onDone={pop}/></section>
  <section className="bdr-stage bdr-silence"><div className="bdr-pop-core"/><div className="bdr-cracks">{Array.from({length:9},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><span>…</span></section>
  <section className="bdr-stage bdr-sky"><div className="bdr-ceiling-remains" aria-hidden="true">{Array.from({length:12},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><div className="bdr-clouds"><i/><i/><i/></div><div className="bdr-returning-balloons" aria-hidden="true"><i/><i/><i/></div><div className="bdr-confetti">{Array.from({length:48},(_,i)=><i key={i} style={{'--i':i}}/>)}</div><article><p>THE CEILING WAS NEVER THE LIMIT</p><h2>{content.recipient}</h2><span>{content.final||'Tug‘ilgan kuning bilan. Eng yaxshi osmon hali oldinda.'}</span><button onClick={()=>location.reload()}>Boshidan ↺</button></article></section>
 </main>
}
