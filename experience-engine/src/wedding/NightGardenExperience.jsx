import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../system/contentModel.js';
import './nightGarden.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function chime(freq=420,d=.1,v=.012){
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();
    o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(v,c.currentTime+.006);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+d+.02);setTimeout(()=>c.close(),260)}catch{}
}
function eventDate(value){
  if(!value)return {date:'Sana tez orada',time:''};const d=new Date(value);if(Number.isNaN(d.getTime()))return {date:value,time:''};
  return{date:new Intl.DateTimeFormat('uz-UZ',{day:'numeric',month:'long',year:'numeric'}).format(d),time:new Intl.DateTimeFormat('uz-UZ',{hour:'2-digit',minute:'2-digit'}).format(d)}
}
function calendar(content){
  const d=new Date(content.eventDate||'');if(Number.isNaN(d.getTime()))return;
  const utc=x=>new Date(x).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const esc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const body=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//EMORA//Night Garden//UZ','BEGIN:VEVENT','UID:'+d.getTime()+'@emora','DTSTAMP:'+utc(Date.now()),'DTSTART:'+utc(d),'DTEND:'+utc(d.getTime()+4*3600000),'SUMMARY:'+esc(content.title||'To‘y marosimi'),'LOCATION:'+esc([content.venueName,content.venueAddress].filter(Boolean).join(', ')),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const blob=new Blob([body],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='emora-night-garden.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function Fireflies({phase,name,lit}){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
    let raf=0,dead=false;const dpr=Math.min(devicePixelRatio||1,1.5);
    const fit=()=>{const r=canvas.getBoundingClientRect();canvas.width=Math.max(1,Math.floor(r.width*dpr));canvas.height=Math.max(1,Math.floor(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);return r};
    let rect=fit();const count=220;
    const sampleName=()=>{
      const off=document.createElement('canvas'),w=Math.max(320,Math.floor(rect.width*.78)),h=150;off.width=w;off.height=h;
      const oc=off.getContext('2d');oc.clearRect(0,0,w,h);oc.fillStyle='#fff';oc.textAlign='center';oc.textBaseline='middle';oc.font='italic 700 '+Math.min(92,w*.18)+'px Georgia';oc.fillText(String(name||'EMORA').slice(0,22),w/2,h/2);
      const data=oc.getImageData(0,0,w,h).data,pts=[];for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=4)if(data[(y*w+x)*4+3]>80)pts.push({x:x-w/2,y:y-h/2});
      return pts.length?pts:[{x:0,y:0}];
    };
    const target=sampleName();
    const flies=Array.from({length:count},(_,i)=>({x:Math.random()*rect.width,y:Math.random()*rect.height,tx:target[i%target.length].x,ty:target[i%target.length].y,seed:Math.random()*10,size:1+Math.random()*1.7}));
    const start=performance.now();
    const draw=now=>{
      if(dead)return;const t=(now-start)/1000,w=rect.width,h=rect.height;ctx.clearRect(0,0,w,h);
      const morph=(phase==='name'||phase==='gate'||phase==='finale')?clamp((t-.2)/1.6,0,1):0;
      for(let i=0;i<flies.length;i++){const p=flies[i];let x=p.x+Math.sin(t*.7+p.seed)*18,y=p.y+Math.cos(t*.55+p.seed)*12;
        if(morph>0){const q=1-Math.pow(1-morph,3);x=x*(1-q)+(w/2+p.tx)*q;y=y*(1-q)+(h*.4+p.ty)*q}
        const a=.12+lit*.14+.28*(.5+.5*Math.sin(t*2+p.seed));ctx.globalAlpha=Math.min(.9,a);ctx.fillStyle=i%7===0?'#fff3b0':'#c7e88c';ctx.shadowColor='#d8f29c';ctx.shadowBlur=10;
        ctx.beginPath();ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill()}
      ctx.shadowBlur=0;ctx.globalAlpha=1;raf=requestAnimationFrame(draw)
    };
    raf=requestAnimationFrame(draw);const ro=new ResizeObserver(()=>{rect=fit()});ro.observe(canvas);
    return()=>{dead=true;cancelAnimationFrame(raf);ro.disconnect()}
  },[phase,name,lit]);
  return <canvas ref={ref} className="ng-fireflies" aria-hidden="true"/>;
}

function Gate({onOpen}){
  const start=useRef(null),done=useRef(false);const [p,setP]=useState(0);
  const down=e=>{if(done.current)return;start.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};
  const move=e=>{if(start.current==null||done.current)return;const next=clamp(Math.abs(e.clientX-start.current)/175,0,1);setP(next);if(next>.94){done.current=true;setP(1);chime(520,.18,.018);try{navigator.vibrate?.([7,20,8])}catch{};setTimeout(onOpen,420)}};
  const up=()=>{start.current=null;if(!done.current&&p<.3)setP(0)};
  const key=e=>{if(done.current||e.repeat||!(e.key==='Enter'||e.key===' '))return;e.preventDefault();done.current=true;setP(1);setTimeout(onOpen,360)};
  return <div className="ng-gate" style={{'--gate':(p*47)+'%'}}>
    <div className="ng-gate-half left"/><div className="ng-gate-half right"/>
    <button aria-label="Bog‘ darvozasini oching" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>darvozani oching <b>{Math.round(p*100)}%</b></button>
  </div>;
}

export function NightGardenExperience({content:contentProp=null,embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('wedding-garden'),[contentProp]);
  const [phase,setPhase]=useState('intro'),[lit,setLit]=useState(0);
  const date=useMemo(()=>eventDate(content.eventDate),[content.eventDate]);
  const mapQ=[content.venueName,content.venueAddress,content.mapLocation].filter(Boolean).join(' ');
  const mapHref=mapQ?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(mapQ):'';

  const light=i=>{if(phase!=='lanterns'||i!==lit)return;const next=lit+1;setLit(next);chime(330+i*80,.13,.014);try{navigator.vibrate?.([4])}catch{};if(next===3)setTimeout(()=>setPhase('name'),700)};
  useEffect(()=>{if(phase!=='name')return;const t=setTimeout(()=>setPhase('gate'),2200);return()=>clearTimeout(t)},[phase]);

  return <main className={'night-garden '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div className="ng-world" aria-hidden="true"><div className="ng-moon"/><div className="ng-fog"/><div className="ng-leaves back"/><div className="ng-leaves front"/><div className="ng-path"/></div>
    <Fireflies phase={phase} name={content.recipient} lit={lit}/><div className="ng-grain"/>
    <header className="ng-chrome"><a href="?">emora<span>.</span></a><small>NIGHT GARDEN · WEDDING 02</small><b>{phase==='intro'?'00':phase==='lanterns'?'01':phase==='name'?'02':phase==='gate'?'03':'04'}</b></header>

    <section className="ng-layer ng-intro"><div><p>THE GARDEN WAKES FOR ONE NIGHT</p><h1>{content.message}</h1><em>{content.guestGreeting||content.recipient}</em><button onClick={()=>setPhase('lanterns')}>Bog‘ga kirish →</button></div></section>

    <section className="ng-layer ng-lanterns"><div className="ng-lantern-copy"><p>01 · THREE LIGHTS</p><h2>Uchta chiroqni navbat bilan yoq.</h2></div>
      <div className="ng-lantern-row">{[0,1,2].map(i=><button key={i} disabled={i!==lit} className={i<lit?'lit':''} aria-label={(i+1)+'-fonarni yoqing'} onClick={()=>light(i)}><i/><b/><span>0{i+1}</span></button>)}</div>
    </section>

    <section className="ng-layer ng-name"><p>FIREFLIES REMEMBER</p><h2>{content.recipient}</h2><span>{content.paragraphs[1]}</span></section>

    <section className="ng-layer ng-gate-layer"><div className="ng-gate-copy"><p>03 · THE GATE</p><h2>Endi marosimni och.</h2></div><Gate onOpen={()=>setPhase('finale')}/></section>

    <section className="ng-layer ng-finale">
      <div className="ng-bloom" aria-hidden="true">{Array.from({length:28},(_,i)=><i key={i} style={{'--i':i}}/>)}</div>
      <article><p>WITH LOVE · NIGHT GARDEN</p><h2>{content.final}</h2>
        <div className="ng-event"><span><small>SANA</small><b>{date.date}</b><em>{date.time}</em></span><i/><span><small>JOY</small><b>{content.venueName||'Manzil tez orada'}</b><em>{content.venueAddress||''}</em></span></div>
        <div className="ng-actions">{content.eventDate&&content.calendarEnabled!==false&&<button onClick={()=>calendar(content)}>Kalendar +</button>}{mapHref&&<a href={mapHref} target="_blank" rel="noreferrer">Xaritada ochish ↗</a>}<button onClick={()=>{setLit(0);setPhase('intro')}}>Boshidan ↺</button></div>
      </article>
    </section>
  </main>;
}
