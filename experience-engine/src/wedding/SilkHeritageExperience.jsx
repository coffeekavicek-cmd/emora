import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { readUrlContent } from '../system/contentModel.js';
import './silkHeritage.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function silkTone(freq=330,duration=.12,vol=.018){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.setValueAtTime(freq,c.currentTime);
    g.gain.setValueAtTime(.0001,c.currentTime);
    g.gain.exponentialRampToValueAtTime(vol,c.currentTime+.008);
    g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+duration+.02);
    setTimeout(()=>c.close(),300);
  }catch{}
}

function formatEventDate(value){
  if(!value)return {date:'Sana siz bilan aniqlanadi',time:''};
  const d=new Date(value);
  if(Number.isNaN(d.getTime()))return {date:value,time:''};
  return{
    date:new Intl.DateTimeFormat('uz-UZ',{day:'numeric',month:'long',year:'numeric'}).format(d),
    time:new Intl.DateTimeFormat('uz-UZ',{hour:'2-digit',minute:'2-digit'}).format(d),
  };
}

function GoldMonogram({name='EM'}){
  const initials=String(name).trim().split(/\s+/).map(x=>x[0]||'').join('').slice(0,2).toUpperCase()||'EM';
  return <div className="sh-monogram" aria-hidden="true"><i/><span>{initials}</span><b/></div>;
}

function PullSilk({onComplete}){
  const start=useRef(null),done=useRef(false);
  const [p,setP]=useState(0);
  const down=e=>{
    if(done.current)return;
    start.current=e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    silkTone(220,.06,.009);
  };
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp((e.clientX-start.current)/185,0,1);
    setP(next);
    if(next>.94){
      done.current=true;start.current=null;
      silkTone(470,.14,.025);try{navigator.vibrate?.([8,22,10])}catch{}
      setTimeout(onComplete,420);
    }
  };
  const up=()=>{start.current=null;if(!done.current&&p<.3)setP(0)};
  const keyboard=e=>{
    if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;
    e.preventDefault();done.current=true;setP(1);silkTone(470,.14,.025);setTimeout(onComplete,420);
  };
  return <div className="sh-pull-ritual" style={{
    '--pull-left':(-p*31)+'%','--pull-right':(p*31)+'%',
    '--pull-left-rot':(p*15)+'deg','--pull-right-rot':(-p*15)+'deg',
    '--pull-handle':(p*70)+'px','--pull-opacity':String(.1+p*.9)
  }}>
    <div className="sh-fold sh-fold-left"><i/><b/></div>
    <div className="sh-fold sh-fold-right"><i/><b/></div>
    <div className="sh-thread-preview" aria-hidden="true"><span/><i/><b/></div>
    <button className="sh-pull-handle" aria-label="Ipakni o‘ngga tortib oching"
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={keyboard}>
      <i/><span>Ipakni torting</span><b>→</b>
    </button>
    <small>{Math.round(p*100)}%</small>
  </div>;
}

function KnotGesture({onComplete}){
  const start=useRef(null),done=useRef(false);
  const [p,setP]=useState(0);
  const down=e=>{
    if(done.current)return;
    start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId);silkTone(280,.06,.01);
  };
  const move=e=>{
    if(start.current==null||done.current)return;
    const next=clamp(Math.abs(e.clientX-start.current)/145,0,1);setP(next);
    if(next>.92){
      done.current=true;start.current=null;setP(1);
      silkTone(620,.18,.022);try{navigator.vibrate?.([7,18,12])}catch{}
      setTimeout(onComplete,500);
    }
  };
  const up=()=>{start.current=null;if(!done.current&&p<.3)setP(0)};
  const keyboard=e=>{
    if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;
    e.preventDefault();done.current=true;setP(1);silkTone(620,.18,.022);setTimeout(onComplete,500);
  };
  return <div className="sh-knot" style={{
    '--knot-line':(p*8)+'%','--knot-size':(22+p*42)+'px','--knot-rot':(p*140)+'deg',
    '--knot-opacity':String(.18+p*.82),'--knot-glow':(p*38)+'px','--knot-progress':(p*100)+'%'
  }}>
    <div className="sh-knot-lines" aria-hidden="true"><i/><b/><span/></div>
    <button aria-label="Oltin iplarni birlashtiring" onPointerDown={down} onPointerMove={move}
      onPointerUp={up} onPointerCancel={up} onKeyDown={keyboard}>
      <span>iplarni birlashtiring</span><i/>
    </button>
  </div>;
}

function createCalendar(content){
  const d=new Date(content.eventDate||'');
  if(Number.isNaN(d.getTime()))return;
  const utc=x=>new Date(x).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const esc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const lines=[
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//EMORA//Silk Heritage//UZ','BEGIN:VEVENT',
    'UID:'+d.getTime()+'@emora','DTSTAMP:'+utc(Date.now()),'DTSTART:'+utc(d),
    'DTEND:'+utc(d.getTime()+4*60*60*1000),
    'SUMMARY:'+esc((content.title||'To‘y marosimi')+' · '+(content.recipient||'')),
    'LOCATION:'+esc([content.venueName,content.venueAddress].filter(Boolean).join(', ')),
    'DESCRIPTION:'+esc(content.message||'EMORA invitation'),'END:VEVENT','END:VCALENDAR'
  ];
  const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='emora-silk-heritage.ics';document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export function SilkHeritageExperience({content:contentProp=null,embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('wedding-silk'),[contentProp]);
  const date=useMemo(()=>formatEventDate(content.eventDate),[content.eventDate]);
  const root=useRef(null);
  const [phase,setPhase]=useState('intro');

  useEffect(()=>{
    if(phase!=='weave')return;
    const timer=setTimeout(()=>setPhase('knot'),3900);
    return()=>clearTimeout(timer);
  },[phase]);

  useEffect(()=>{
    const ctx=gsap.context(()=>{
      gsap.fromTo('.sh-opening-copy>*',{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.9,stagger:.11,ease:'power3.out',delay:.18});
      gsap.fromTo('.sh-hero-cloth',{autoAlpha:0,scale:.94,rotateY:-8},{autoAlpha:1,scale:1,rotateY:0,duration:1.25,ease:'power4.out',delay:.26});
    },root);
    return()=>ctx.revert();
  },[]);

  const start=()=>{silkTone(390,.12,.014);setPhase('pull')};
  const mapQuery=[content.venueName,content.venueAddress,content.mapLocation].filter(Boolean).join(' ');
  const mapHref=mapQuery?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(mapQuery):'';

  return <main ref={root} className={'silk-heritage '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="sh-grain"/><div className="sh-gold-haze"/>
    <header className="sh-chrome"><a href="?">emora<span>.</span></a><small>SILK HERITAGE · CEREMONY 01</small><b>{phase==='intro'?'00':phase==='pull'?'01':phase==='weave'?'02':phase==='knot'?'03':'04'}</b></header>

    <section className="sh-layer sh-opening">
      <div className="sh-opening-copy">
        <p>WOVEN FOR ONE DAY · KEPT FOR YEARS</p>
        <h1>{content.message}</h1>
        <span>{content.guestGreeting||'Aziz mehmonimiz uchun'}</span>
        <button onClick={start}>Taklifnomani ochish <i>→</i></button>
      </div>
      <div className="sh-hero-cloth" aria-hidden="true">
        <div className="sh-cloth-face"><GoldMonogram name={content.recipient}/><i/><b/></div>
        <div className="sh-cloth-edge"/>
        <div className="sh-gold-thread thread-a"/>
        <div className="sh-gold-thread thread-b"/>
      </div>
    </section>

    <section className="sh-layer sh-pull">
      <div className="sh-stage-label"><span>01</span><p>THE UNFOLDING</p></div>
      <PullSilk onComplete={()=>setPhase('weave')}/>
    </section>

    <section className="sh-layer sh-weave">
      <div className="sh-weave-stage">
        <svg className="sh-embroidery" viewBox="0 0 900 620" aria-hidden="true">
          <defs>
            <linearGradient id="shGold" x1="0" x2="1"><stop stopColor="#8c6a31"/><stop offset=".48" stopColor="#f2d697"/><stop offset="1" stopColor="#96713a"/></linearGradient>
          </defs>
          <path className="sh-path sh-path-1" d="M92 310 C190 88 364 74 450 205 C536 74 710 88 808 310 C712 530 535 546 450 414 C365 546 188 530 92 310Z"/>
          <path className="sh-path sh-path-2" d="M185 310 C251 176 372 164 450 256 C528 164 649 176 715 310 C649 444 528 456 450 365 C372 456 251 444 185 310Z"/>
          <path className="sh-path sh-path-3" d="M450 112 C486 178 555 214 630 217 C566 261 542 329 559 403 C500 363 431 365 371 406 C389 329 365 259 298 217 C374 215 419 177 450 112Z"/>
        </svg>
        <div className="sh-woven-copy">
          <p>THE THREAD REMEMBERS</p>
          <h2>{content.title||'Ikki ism · bitta kun'}</h2>
          <em>{content.recipient}</em>
          <div><span>{date.date}</span>{date.time&&<b>{date.time}</b>}</div>
        </div>
      </div>
    </section>

    <section className="sh-layer sh-knot-layer">
      <div className="sh-knot-copy"><p>03 · THE KNOT</p><h2>Ikki ip. Bitta yo‘l.</h2><span>Shoshilmay birlashtiring.</span></div>
      <KnotGesture onComplete={()=>setPhase('finale')}/>
    </section>

    <section className="sh-layer sh-finale">
      <div className="sh-finale-cloth" aria-hidden="true"><i/><b/><span/></div>
      <div className="sh-invite">
        <p>WITH LOVE · EMORA SILK HERITAGE</p>
        <h2>{content.final}</h2>
        <GoldMonogram name={content.recipient}/>
        <div className="sh-event">
          <span><small>SANA</small><b>{date.date}</b>{date.time&&<em>{date.time}</em>}</span>
          <i/>
          <span><small>JOY</small><b>{content.venueName||'Manzil tez orada'}</b><em>{content.venueAddress||''}</em></span>
        </div>
        <div className="sh-actions">
          {content.eventDate&&content.calendarEnabled!==false&&<button onClick={()=>createCalendar(content)}>Kalendar +</button>}
          {mapHref&&<a href={mapHref} target="_blank" rel="noreferrer">Xaritada ochish ↗</a>}
          <button onClick={()=>setPhase('intro')}>Boshidan ↺</button>
        </div>
      </div>
    </section>
  </main>;
}
