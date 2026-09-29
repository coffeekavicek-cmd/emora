import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './skyPromise.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const STARS=[{x:28,y:31},{x:58,y:22},{x:72,y:46}];

function cue(freq=420,d=.08,v=.009){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.setValueAtTime(freq,c.currentTime);
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(v,c.currentTime+.006);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02);setTimeout(()=>c.close(),240);
  }catch{}
}

export function SkyPromiseExperience({content:contentProp=null,embedded=false}){
  const c=useMemo(()=>contentProp||readUrlContent('proposal-sky'),[contentProp]);
  const host=useRef(null),engine=useRef(null),drag=useRef(null),finalTimer=useRef(null);
  const [phase,setPhase]=useState('night');
  const [selected,setSelected]=useState([]);
  const [dawn,setDawn]=useState(0);

  useEffect(()=>{
    let dead=false;
    (async()=>{
      const mod=await import('./SkyWorld.js');
      if(dead||!host.current)return;
      const e=new mod.SkyWorld(host.current);engine.current=e;await e.init();
    })();
    const move=e=>{const nx=(e.clientX/Math.max(1,innerWidth)-.5)*2,ny=(e.clientY/Math.max(1,innerHeight)-.5)*2;engine.current?.pointerTo(nx,ny)};
    window.addEventListener('pointermove',move,{passive:true});
    return()=>{dead=true;window.removeEventListener('pointermove',move);clearTimeout(finalTimer.current);engine.current?.destroy()};
  },[]);

  const select=i=>{
    if(phase!=='night'||selected.includes(i))return;
    cue(520+i*90,.09,.012);try{navigator.vibrate?.([5])}catch{}
    const next=[...selected,i];setSelected(next);
    if(next.length===3)setTimeout(()=>setPhase('horizon'),850);
  };

  const start=e=>{if(phase!=='horizon')return;drag.current=e.clientY;e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{
    if(drag.current==null||phase!=='horizon')return;
    const p=clamp((drag.current-e.clientY)/220,0,1);setDawn(p);engine.current?.setDawn(p);
    if(p>.95){drag.current=null;setDawn(1);engine.current?.setDawn(1);setPhase('predawn');cue(180,.16,.016);finalTimer.current=setTimeout(()=>{cue(690,.25,.02);setPhase('finale')},950)}
  };
  const stop=()=>{drag.current=null};

  const initial=(c.recipient||'S').trim().charAt(0).toUpperCase()||'S';
  return <main className={'sky-promise '+(embedded?'is-embedded ':'')+'phase-'+phase} style={{'--dawn':dawn}}>
    <div ref={host} className="sp-world" aria-hidden="true"/>
    <div className="sp-atmosphere"/><div className="sp-horizon-glow"/><div className="sp-grain"/>
    <header className="sp-chrome"><a href="?">emora<span>.</span></a><small>SKY PROMISE · PROPOSAL 03</small><b>{phase==='night'?'00':phase==='horizon'?'01':phase==='predawn'?'02':'03'}</b></header>

    <section className="sp-layer sp-night">
      <div className="sp-copy"><p>THREE STARS · ONE PROMISE</p><h1>{c.message||'Tong otishidan oldin osmon bitta sirni saqlaydi.'}</h1><em>{c.recipient}</em></div>
      <svg className={'sp-constellation lines-'+selected.length} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M28 31 L58 22 L72 46" pathLength="1"/>
      </svg>
      {STARS.map((s,i)=><button key={i} className={'sp-anchor a'+i+' '+(selected.includes(i)?'selected':'')} style={{left:s.x+'%',top:s.y+'%'}} aria-label={(i+1)+'-yulduzni ulang'} onClick={()=>select(i)}><i/><b/></button>)}
      <div className={'sp-initial '+(selected.length===3?'show':'')}>{initial}</div>
      <p className="sp-night-note">{selected.length<3?'Uch yulduzni ketma-ket ulang.':'Constellation tayyor.'}</p>
    </section>

    <section className="sp-layer sp-horizon">
      <div className="sp-horizon-copy"><p>DRAG THE NIGHT INTO MORNING</p><h2>Ufqqa yuqoriga suring.</h2><span>{c.recipient}</span></div>
      <button className="sp-drag-horizon" aria-label="Ufqqa yuqoriga suring" onPointerDown={start} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop}
        onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&phase==='horizon'){e.preventDefault();setDawn(1);engine.current?.setDawn(1);setPhase('predawn');finalTimer.current=setTimeout(()=>setPhase('finale'),950)}}}>
        <i style={{height:(dawn*100)+'%'}}/><b>↑</b><span>{Math.round(dawn*100)}%</span>
      </button>
    </section>

    <section className="sp-layer sp-predawn"><div className="sp-sun-edge"/><p>Bir lahza. Quyosh hali chiqmagan.</p></section>

    <section className="sp-layer sp-finale">
      <div className="sp-sun" aria-hidden="true"/><div className="sp-rays" aria-hidden="true"><i/><i/><i/><i/></div>
      <article><p>A NEW DAY STARTS HERE</p><h2>{c.final||'Har tongni yoningda kutib olishimga rozimisan?'}</h2><em>{c.recipient}</em><button onClick={()=>location.reload()}>Boshidan ↺</button></article>
    </section>
  </main>;
}
