import { useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { readUrlContent } from '../system/contentModel.js';
import './auroraPaper.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function pulse(strong=false){
  try{navigator.vibrate?.(strong?[12,18,18]:[7])}catch{}
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.setValueAtTime(strong?180:560,c.currentTime);
    if(strong)o.frequency.exponentialRampToValueAtTime(90,c.currentTime+.16);
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(strong?.035:.016,c.currentTime+.006);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.2);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.21);setTimeout(()=>c.close(),300);
  }catch{}
}

export function AuroraPaperExperience({content:contentProp=null,embedded=false}){
  const c=useMemo(()=>contentProp||readUrlContent('birthday-aurora'),[contentProp]);
  const [phase,setPhase]=useState('gift');
  const [ribbon,setRibbon]=useState(0);
  const [layer,setLayer]=useState(0);
  const [tear,setTear]=useState(0);
  const drag=useRef(null);

  const move=next=>{
    const el=document.querySelector('.aurora-paper .ap-stage.active');
    if(!el){setPhase(next);return}
    gsap.to(el,{autoAlpha:0,scale:.985,filter:'blur(10px)',duration:.42,ease:'power2.in',onComplete:()=>setPhase(next)});
  };

  const beginRibbon=e=>{drag.current={x:e.clientX,kind:'ribbon'};e.currentTarget.setPointerCapture?.(e.pointerId)};
  const moveRibbon=e=>{
    if(!drag.current||drag.current.kind!=='ribbon')return;
    const p=clamp((e.clientX-drag.current.x)/180,0,1);setRibbon(p);
    if(p>.92){drag.current=null;pulse(true);setTimeout(()=>move('layers'),250)}
  };

  const nextLayer=()=>{
    pulse();
    if(layer<2){setLayer(x=>x+1);return}
    move('tear');
  };

  const beginTear=e=>{drag.current={x:e.clientX,kind:'tear'};e.currentTarget.setPointerCapture?.(e.pointerId)};
  const moveTear=e=>{
    if(!drag.current||drag.current.kind!=='tear')return;
    const p=clamp((e.clientX-drag.current.x)/210,0,1);setTear(p);
    if(p>.94){drag.current=null;pulse(true);setTimeout(()=>move('finale'),260)}
  };

  const reset=()=>{setRibbon(0);setLayer(0);setTear(0);move('gift')};

  return <main className={'aurora-paper '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="ap-noise"/><div className="ap-vignette"/>
    <header className="ap-chrome"><a href="?">emora<span>.</span></a><small>AURORA PAPER · BIRTHDAY 01</small><b>{phase==='gift'?'00':phase==='layers'?'01':phase==='tear'?'02':'03'}</b></header>

    <section className={'ap-stage ap-gift '+(phase==='gift'?'active':'')}>
      <div className="ap-box" style={{'--r':ribbon}} aria-hidden="true">
        <div className="ap-lid"><i/><b/></div><div className="ap-base"/><div className="ap-ribbon-v"/><div className="ap-ribbon-h"/>
        <div className="ap-aurora-leak"/>
      </div>
      <div className="ap-copy">
        <p>ONE DAY · ONE PERSON</p><h1>{c.message||'Bu sovg‘a ichida buyum emas, kayfiyat bor.'}</h1><em>{c.recipient}</em>
        <button aria-label="Lentani yechish" onPointerDown={beginRibbon} onPointerMove={moveRibbon} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
          <i style={{transform:`scaleX(${Math.max(.04,ribbon)})`}}/><span>Lentani o‘ngga torting →</span>
        </button>
      </div>
    </section>

    <section className={'ap-stage ap-layers '+(phase==='layers'?'active':'')}>
      <div className="ap-paper-stack">
        {[0,1,2].map(i=><article key={i} className={'ap-sheet sheet-'+i+' '+(i<layer?'peeled':i===layer?'front':'behind')}>
          <span>0{i+1}</span><p>{c.paragraphs?.[i]||['Birinchi qatlam — kulgi uchun.','Ikkinchi qatlam — yangi orzular uchun.','Oxirgi qatlam — sen bo‘lganing uchun.'][i]}</p>
          <div className="ap-sheet-glow"/>
        </article>)}
      </div>
      <div className="ap-layer-ui"><p>LAYER {layer+1} / 3</p><button onClick={nextLayer}>{layer<2?'Keyingi qatlam':'Oxirgi qog‘oz'} →</button></div>
    </section>

    <section className={'ap-stage ap-tear '+(phase==='tear'?'active':'')}>
      <div className="ap-tear-sheet" style={{'--tear':tear}}>
        <div className="ap-tear-top"/><div className="ap-tear-bottom"/><div className="ap-tear-light"/>
        <p>{c.final||'Bugun osmon ham seni tabriklaydi.'}</p>
      </div>
      <div className="ap-tear-ui"><p>TEAR THE LAST LAYER</p>
        <button aria-label="Qog‘ozni yirtish" onPointerDown={beginTear} onPointerMove={moveTear} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
          <i style={{transform:`scaleX(${Math.max(.04,tear)})`}}/><span>Chiziq bo‘ylab yirting →</span>
        </button>
      </div>
    </section>

    <section className={'ap-stage ap-finale '+(phase==='finale'?'active':'')}>
      <div className="ap-aurora"><i/><i/><i/><i/></div>
      <div className="ap-confetti" aria-hidden="true">{Array.from({length:32},(_,i)=><i key={i} style={{'--i':i}}/>)}</div>
      <div className="ap-final-copy"><p>THE SKY OPENED FOR YOU</p><h2>{c.recipient}</h2><span>{c.final||'Tug‘ilgan kuning bilan. Eng yaxshi boblaring hali oldinda.'}</span><button onClick={reset}>Boshidan ↺</button></div>
    </section>
  </main>;
}
