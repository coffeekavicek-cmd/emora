import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './balloonDream.css';

const FALLBACK='https://emora-v10-fifteen-experiences-production.up.railway.app/assets/birthday-balloon.png';

function cue(freq=220,d=.08,v=.01){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.setValueAtTime(freq,c.currentTime);
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(v,c.currentTime+.005);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02);setTimeout(()=>c.close(),240);
  }catch{}
}

function useHero(media){
  const photo=media?.photos?.[0]||media?.portrait||null;
  const url=useMemo(()=>!photo?FALLBACK:typeof photo==='string'?photo:URL.createObjectURL(photo),[photo]);
  useEffect(()=>()=>{if(photo&&typeof photo!=='string'&&url!==FALLBACK)URL.revokeObjectURL(url)},[photo,url]);
  return url;
}

function HoldPop({onDone}){
  const timer=useRef(null),done=useRef(false);const [holding,setHolding]=useState(false);
  const start=()=>{
    if(done.current||timer.current!=null)return;
    setHolding(true);cue(94,.12,.018);
    timer.current=setTimeout(()=>{timer.current=null;done.current=true;setHolding(false);cue(58,.16,.035);try{navigator.vibrate?.([12,28,18])}catch{};onDone()},900);
  };
  const stop=()=>{if(timer.current!=null){clearTimeout(timer.current);timer.current=null}setHolding(false)};
  useEffect(()=>()=>{if(timer.current!=null)clearTimeout(timer.current)},[]);
  return <button className={'bd-hold '+(holding?'holding':'')} aria-label="Katta sharni bosib ushlab yoring"
    onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
    onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();start()}}}
    onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();stop()}}}>
    <i/><span>bosib ushlab turing</span><b>900ms</b>
  </button>;
}

export function BalloonDreamExperience({content:contentProp=null,media=null,embedded=false}){
  const c=useMemo(()=>contentProp||readUrlContent('birthday-balloon'),[contentProp]);
  const hero=useHero(media);
  const [phase,setPhase]=useState('room');
  const [released,setReleased]=useState([]);
  const silenceTimer=useRef(null);
  const wishes=c.paragraphs?.length?c.paragraphs:['Ko‘proq kulgi.','Ko‘proq sarguzasht.','Ko‘proq o‘zing bo‘lish uchun jasorat.'];

  const release=i=>{
    if(released.includes(i)||phase!=='room')return;
    cue(340+i*45,.06,.009);
    const next=[...released,i];setReleased(next);
    if(next.length===3)setTimeout(()=>setPhase('hero'),650);
  };
  const pop=()=>{
    setPhase('silence');
    silenceTimer.current=setTimeout(()=>setPhase('finale'),450);
  };
  useEffect(()=>()=>clearTimeout(silenceTimer.current),[]);

  return <main className={'balloon-dream '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="bd-room" aria-hidden="true"><div className="bd-wall back"/><div className="bd-wall left"/><div className="bd-wall right"/><div className="bd-floor"/><div className="bd-window"><i/><b/></div></div>
    <div className="bd-grain"/><div className="bd-vignette"/>
    <header className="bd-chrome"><a href="?">emora<span>.</span></a><small>BALLOON DREAM · BIRTHDAY 02</small><b>{phase==='room'?'00':phase==='hero'?'01':phase==='silence'?'02':'03'}</b></header>

    <section className="bd-layer bd-room-layer">
      <div className="bd-copy"><p>THREE WISHES · ONE PERSON</p><h1>{c.message||'Uchta shar ichida uchta yashirin tilak bor.'}</h1><em>{c.recipient}</em></div>
      <div className="bd-field">
        {[0,1,2].map(i=><button key={i} className={'bd-balloon b'+i+' '+(released.includes(i)?'released':'')} aria-label={(i===0?'Birinchi':i===1?'Ikkinchi':'Uchinchi')+' sharni qo‘yib yuboring'} onClick={()=>release(i)}>
          <i/><b/><span/><em>{String(i+1).padStart(2,'0')}</em>
        </button>)}
      </div>
      <div className="bd-wishes">{wishes.slice(0,3).map((x,i)=><p key={i} className={released.includes(i)?'show':''}>{x}</p>)}</div>
      <div className="bd-room-note">{released.length<3?'Sharlarni bittadan qo‘yib yuboring.':'Endi bitta shar qoldi…'}</div>
    </section>

    <section className="bd-layer bd-hero-layer">
      <div className="bd-hero-balloon">
        <div className="bd-hero-skin"><img src={hero} alt=""/><i/><b/></div>
        <div className="bd-hero-string"/>
      </div>
      <div className="bd-hero-copy"><p>ONE LAST WISH</p><h2>{c.recipient}</h2><span>Bu shar ichida bir xotira qolgan.</span></div>
      <HoldPop onDone={pop}/>
    </section>

    <section className="bd-layer bd-silence"><div className="bd-pop-ring"/><span>…</span></section>

    <section className="bd-layer bd-finale">
      <div className="bd-sky" aria-hidden="true"><i/><i/><i/></div>
      <div className="bd-confetti" aria-hidden="true">{Array.from({length:44},(_,i)=><i key={i} style={{'--i':i}}/>)}</div>
      <article><p>ALL THREE WISHES ARE IN THE SKY</p><h2>{c.recipient}</h2><span>{c.final||'Barcha tilaklar osmonga chiqdi. Tug‘ilgan kuning bilan!'}</span><button onClick={()=>location.reload()}>Boshidan ↺</button></article>
    </section>
  </main>;
}
