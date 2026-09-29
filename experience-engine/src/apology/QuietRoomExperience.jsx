import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './quietRoom.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function clickTone(freq=170,d=.08,v=.012){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=freq;
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(v,c.currentTime+.006);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02);setTimeout(()=>c.close(),220);
  }catch{}
}

function ChainPull({onComplete}){
  const start=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const down=e=>{if(done.current)return;start.current=e.clientY;e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp((e.clientY-start.current)/125,0,1);setP(next);
    if(next>.93){done.current=true;clickTone(120,.12,.026);try{navigator.vibrate?.([8])}catch{};setTimeout(onComplete,260)}
  };
  const up=()=>{start.current=null;if(!done.current&&p<.35)setP(0)};
  const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();done.current=true;setP(1);clickTone(120,.12,.026);setTimeout(onComplete,220)};
  return <button className="qr-chain" style={{'--chain-y':(p*82)+'px'}} aria-label="Chiroq zanjirini pastga torting"
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
    <i/><b/><span>pastga torting</span>
  </button>;
}

function MoveLamp({onComplete}){
  const start=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const down=e=>{if(done.current)return;start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp(Math.abs(e.clientX-start.current)/150,0,1);setP(next);
    if(next>.93){done.current=true;clickTone(80,.14,.015);setTimeout(onComplete,330)}
  };
  const up=()=>{start.current=null;if(!done.current&&p<.3)setP(0)};
  const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();done.current=true;setP(1);setTimeout(onComplete,300)};
  return <button className="qr-move" style={{'--move':(p*72)+'px','--dim':String(1-p*.58)}} aria-label="Yorug‘likni chetga suring"
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
    <i/><span>yorug‘likni chetga suring</span>
  </button>;
}

export function QuietRoomExperience({content:contentProp=null,embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('apology-quiet'),[contentProp]);
  const [phase,setPhase]=useState('dark');
  const [line,setLine]=useState(0);

  useEffect(()=>{
    if(phase!=='listen')return;
    setLine(0);
    const timers=[500,2200,4100].map((ms,i)=>setTimeout(()=>{setLine(i+1);clickTone(250+i*35,.05,.005)},ms));
    const next=setTimeout(()=>setPhase('move'),5900);
    return()=>{timers.forEach(clearTimeout);clearTimeout(next)};
  },[phase]);

  const darken=()=>{
    setPhase('blackout');
    setTimeout(()=>{clickTone(145,.16,.012);setPhase('finale')},1150);
  };

  return <main className={'quiet-room '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="qr-room" aria-hidden="true">
      <div className="qr-wall back"/><div className="qr-wall left"/><div className="qr-wall right"/><div className="qr-floor"/>
      <div className="qr-desk"><i/><b/></div>
      <div className="qr-lamp"><i/><b/><span/></div>
      <div className="qr-light-cone"/>
    </div>
    <div className="qr-noise"/>
    <header className="qr-chrome"><a href="?">emora<span>.</span></a><small>QUIET ROOM · APOLOGY 03</small><b>{phase==='dark'?'00':phase==='lit'?'01':phase==='listen'?'02':phase==='move'?'03':phase==='blackout'?'04':'05'}</b></header>

    <section className="qr-layer qr-dark">
      <div className="qr-whisper"><p>HECH NARSA DEMAY TURIB</p><h1>{content.message}</h1><span>Ba’zi gaplar yorug‘lik yoqilgandan keyin aytiladi.</span></div>
      <ChainPull onComplete={()=>{setPhase('lit');setTimeout(()=>setPhase('listen'),1300)}}/>
    </section>

    <section className="qr-layer qr-letter">
      <article>
        <p>{content.recipient},</p>
        <div className="qr-lines">{content.paragraphs.map((x,i)=><span key={i} className={line>i?'show':''}>{x}</span>)}</div>
        <em>— shoshilmasdan, rost gap bilan</em>
      </article>
    </section>

    <section className="qr-layer qr-move-layer">
      <div className="qr-move-copy"><p>ONE LAST THING</p><h2>Ba’zan yorug‘likni pasaytirib, gapni aniqroq ko‘rasan.</h2></div>
      <MoveLamp onComplete={darken}/>
    </section>

    <section className="qr-layer qr-phosphor"><span>men shu yerdaman.</span></section>

    <section className="qr-layer qr-finale">
      <article><p>THE ROOM IS QUIET AGAIN</p><h2>{content.final}</h2><em>{content.recipient}</em><button onClick={()=>{setLine(0);setPhase('dark')}}>Boshidan ↺</button></article>
    </section>
  </main>;
}
