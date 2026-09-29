import { useEffect, useMemo, useRef, useState } from 'react';
import { readUrlContent } from '../../system/contentModel.js';
import './pearlArchive.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function cue(type='soft'){
  try{navigator.vibrate?.(type==='crack'?[12,18,10]:type==='final'?[8,20,24]:[5])}catch{}
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const c=new C(),o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
    const cfg=type==='crack'?[92,.18,.035,620]:type==='final'?[510,.32,.025,1500]:[360,.08,.012,900];
    o.type=type==='crack'?'triangle':'sine';o.frequency.setValueAtTime(cfg[0],c.currentTime);
    if(type==='final')o.frequency.exponentialRampToValueAtTime(860,c.currentTime+.28);
    f.type='lowpass';f.frequency.value=cfg[3];
    g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(cfg[2],c.currentTime+.006);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+cfg[1]);
    o.connect(f).connect(g).connect(c.destination);o.start();o.stop(c.currentTime+cfg[1]+.02);setTimeout(()=>c.close(),520);
  }catch{}
}

function SignatureParticles({name,onSettled}){
  const ref=useRef(null);
  useEffect(()=>{
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext('2d'),off=document.createElement('canvas'),oc=off.getContext('2d');
    let raf=0,dead=false;
    const resize=()=>{
      const d=Math.min(devicePixelRatio||1,1.5),w=canvas.clientWidth,h=canvas.clientHeight;
      canvas.width=Math.max(1,w*d);canvas.height=Math.max(1,h*d);ctx.setTransform(d,0,0,d,0,0);
      off.width=Math.max(1,Math.floor(w*.82));off.height=Math.max(1,Math.floor(h*.5));
    };
    resize();
    const w=off.width,h=off.height;
    oc.clearRect(0,0,w,h);oc.fillStyle='#fff';oc.textAlign='center';oc.textBaseline='middle';
    const initial=(name||'E').trim().charAt(0).toUpperCase()||'E';
    oc.font=`600 ${Math.floor(h*.62)}px Georgia`;
    oc.fillText(initial,w*.43,h*.49);
    oc.font=`400 ${Math.floor(h*.34)}px Georgia`;
    oc.fillText('♡',w*.69,h*.52);
    const data=oc.getImageData(0,0,w,h).data;
    const pts=[];const step=Math.max(4,Math.floor(w/145));
    for(let y=0;y<h;y+=step)for(let x=0;x<w;x+=step){
      if(data[(y*w+x)*4+3]>110)pts.push({
        tx:x+w*.09,ty:y+h*.17,
        x:Math.random()*canvas.clientWidth,y:canvas.clientHeight+40+Math.random()*240,
        vx:(Math.random()-.5)*2.3,vy:-1-Math.random()*2.2,
        s:.7+Math.random()*1.6,a:.32+Math.random()*.68
      });
    }
    while(pts.length>1900)pts.splice(Math.floor(Math.random()*pts.length),1);
    const start=performance.now();let settled=false;
    const draw=now=>{
      if(dead)return;
      const t=Math.min(1,(now-start)/3200),ease=1-Math.pow(1-t,4),cw=canvas.clientWidth,ch=canvas.clientHeight;
      ctx.clearRect(0,0,cw,ch);
      for(const p of pts){
        if(t<.18){p.x+=p.vx;p.y+=p.vy;p.vy+=.015}
        const blend=Math.max(0,(t-.12)/.88);
        p.x+=(p.tx-p.x)*(.018+.08*ease);p.y+=(p.ty-p.y)*(.018+.08*ease);
        const alpha=p.a*(.45+.55*blend);
        ctx.fillStyle=`rgba(246,230,198,${alpha})`;
        ctx.beginPath();ctx.arc(p.x,p.y,p.s*(.75+.35*ease),0,Math.PI*2);ctx.fill();
      }
      if(t>.9&&!settled){settled=true;onSettled?.()}
      raf=requestAnimationFrame(draw);
    };
    raf=requestAnimationFrame(draw);
    const ro=new ResizeObserver(()=>{});ro.observe(canvas);
    return()=>{dead=true;cancelAnimationFrame(raf);ro.disconnect()};
  },[name,onSettled]);
  return <canvas ref={ref} className="pr-signature-canvas" aria-hidden="true"/>;
}

export function PearlArchiveExperience({content:contentProp=null,embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('love-pearl'),[contentProp]);
  const host=useRef(null),world=useRef(null),threadStart=useRef(null),archiveStart=useRef(null),sealTimer=useRef(null),sealStarted=useRef(null);
  const [phase,setPhase]=useState('arrival');
  const [thread,setThread]=useState(0);
  const [sealHolding,setSealHolding]=useState(false);
  const [letterBeat,setLetterBeat]=useState(0);
  const [archive,setArchive]=useState(0);
  const [settled,setSettled]=useState(false);

  useEffect(()=>{
    let dead=false;
    (async()=>{
      const {PearlArchiveWorld}=await import('./PearlArchiveWorld.js');
      if(dead||!host.current)return;
      world.current=new PearlArchiveWorld(host.current).init();
      setTimeout(()=>!dead&&setPhase('thread'),1600);
    })();
    const move=e=>world.current?.pointer((e.clientX/Math.max(1,innerWidth)-.5)*2,(e.clientY/Math.max(1,innerHeight)-.5)*2);
    window.addEventListener('pointermove',move,{passive:true});
    return()=>{dead=true;window.removeEventListener('pointermove',move);if(sealTimer.current)clearTimeout(sealTimer.current);world.current?.destroy()};
  },[]);

  useEffect(()=>{
    if(phase!=='letter')return;
    setLetterBeat(0);
    const t1=setTimeout(()=>setLetterBeat(1),700);
    const t2=setTimeout(()=>setLetterBeat(2),1900);
    const t3=setTimeout(()=>setLetterBeat(3),3200);
    const t4=setTimeout(()=>setPhase('archive'),5000);
    return()=>[t1,t2,t3,t4].forEach(clearTimeout);
  },[phase]);

  const threadDown=e=>{if(phase!=='thread')return;threadStart.current={x:e.clientX,p:thread};e.currentTarget.setPointerCapture?.(e.pointerId);cue()};
  const threadMove=e=>{
    if(!threadStart.current||phase!=='thread')return;
    const next=clamp(threadStart.current.p+(e.clientX-threadStart.current.x)/Math.max(230,innerWidth*.46),0,1);
    setThread(next);world.current?.setThreadProgress(next);
    if(next>.975){
      threadStart.current=null;cue('final');world.current?.revealFolio();setPhase('transition-folio');
      setTimeout(()=>setPhase('folio'),850);
    }
  };
  const threadUp=()=>{threadStart.current=null};

  const completeSeal=()=>{
    if(phase!=='folio')return;
    if(sealTimer.current)clearTimeout(sealTimer.current);sealTimer.current=null;sealStarted.current=null;setSealHolding(false);
    cue('crack');world.current?.openFolio();setPhase('letter');
  };
  const sealDown=()=>{
    if(phase!=='folio'||sealTimer.current)return;
    sealStarted.current=performance.now();setSealHolding(true);cue();
    sealTimer.current=setTimeout(completeSeal,820);
  };
  const sealUp=()=>{
    const elapsed=sealStarted.current?performance.now()-sealStarted.current:0;
    if(sealTimer.current)clearTimeout(sealTimer.current);sealTimer.current=null;sealStarted.current=null;setSealHolding(false);
    if(elapsed>780)completeSeal();
  };

  const archiveDown=e=>{if(phase!=='archive')return;archiveStart.current={x:e.clientX,p:archive};e.currentTarget.setPointerCapture?.(e.pointerId);cue()};
  const archiveMove=e=>{
    if(!archiveStart.current||phase!=='archive')return;
    const next=clamp(archiveStart.current.p+(e.clientX-archiveStart.current.x)/Math.max(250,innerWidth*.52),0,1);
    setArchive(next);world.current?.setArchiveProgress(next);
    if(next>.975){
      archiveStart.current=null;cue('crack');setPhase('false-ending');world.current?.collapse();
      setTimeout(()=>{setPhase('particles');world.current?.igniteFinale();cue('final')},1350);
    }
  };
  const archiveUp=()=>{archiveStart.current=null};

  const memories=[
    {n:'01',title:content.captions?.[0]||'Bir qarashdan boshlangan narsa.',body:content.paragraphs?.[0]||'O‘sha kuni oddiy daqiqa keyin eng qadrli xotiraga aylanishini bilmagandim.'},
    {n:'02',title:content.captions?.[1]||'Bizning eng baland kulgimiz.',body:content.paragraphs?.[1]||'Ba’zi xotiralar ovozsiz ham eshitiladi.'},
    {n:'03',title:content.captions?.[2]||'Va hali tugamagan hikoya.',body:content.paragraphs?.[2]||'Eng yaxshi sahifalar hali yozilmagan.'},
  ];

  return <main className={'pearl-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase} style={{'--thread':thread,'--archive':archive}}>
    <div ref={host} className="pr-world"/>
    <div className="pr-grade"/><div className="pr-grain"/>
    <header className="pr-chrome"><a href="?">emora<span>.</span></a><small>PEARL LINEN · THE PRIVATE ARCHIVE</small><b>{phase==='arrival'?'00':phase==='thread'?'01':phase.includes('folio')?'02':phase==='letter'?'03':phase==='archive'?'04':'05'}</b></header>

    <section className="pr-stage pr-arrival">
      <div className="pr-arrival-copy"><p>PRIVATE ARCHIVE · FOR ONE PERSON</p><h1>Ba’zi so‘zlar yuborilmaydi.<br/><em>Ular ochiladi.</em></h1><span>{content.recipient}</span></div>
    </section>

    <section className="pr-stage pr-thread">
      <div className="pr-thread-copy"><p>01 · THE THREAD</p><h2>Ismingni bir ip bilan tikib chiqamiz.</h2></div>
      <div className="pr-stitched-name" aria-hidden="true" style={{clipPath:`inset(0 ${(1-thread)*100}% 0 0)`}}><span>{content.recipient}</span><i/></div>
      <button className="pr-thread-track" aria-label="Marvaridni ip bo‘ylab o‘ngga torting" onPointerDown={threadDown} onPointerMove={threadMove} onPointerUp={threadUp} onPointerCancel={threadUp}
        onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&phase==='thread'){e.preventDefault();setThread(1);world.current?.setThreadProgress(1);world.current?.revealFolio();setPhase('transition-folio');setTimeout(()=>setPhase('folio'),850)}}}>
        <i/><b/><span>marvaridni torting →</span>
      </button>
    </section>

    <section className="pr-stage pr-folio">
      <div className="pr-folio-copy"><p>02 · THE FOLIO</p><h2>Muhrni buzmasdan bu arxiv ochilmaydi.</h2></div>
      <button className={'pr-seal '+(sealHolding?'holding':'')} aria-label="Muhrni bosib ushlab oching" onPointerDown={sealDown} onPointerUp={sealUp} onPointerCancel={sealUp} onPointerLeave={sealUp}
        onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();sealDown()}}} onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sealUp()}}}>
        <span>EM</span>{Array.from({length:8},(_,i)=><i key={i} style={{'--i':i}}/>)}<b>820ms</b>
      </button>
    </section>

    <section className="pr-stage pr-letter">
      <article className="pr-letter-sheet">
        <p className="pr-kicker">FOR {content.recipient.toUpperCase()}</p>
        <h2 className={letterBeat>=1?'show':''}>{content.message||'Seni yaxshi ko‘rish — baland gap emas. Bu kundalik mayda narsalarda yashaydigan haqiqat.'}</h2>
        <div className="pr-letter-lines">
          <p className={letterBeat>=1?'show':''}>{content.paragraphs?.[0]}</p>
          <p className={letterBeat>=2?'show':''}>{content.paragraphs?.[1]}</p>
          <p className={letterBeat>=3?'show':''}>{content.paragraphs?.[2]}</p>
        </div>
        <em className={letterBeat>=3?'show':''}>— men tomondan, faqat senga.</em>
      </article>
      <div className="pr-ink-progress" style={{'--beat':Math.min(1,letterBeat/3)}}><i/><span>{Math.min(100,letterBeat*33)}%</span></div>
    </section>

    <section className="pr-stage pr-archive">
      <div className="pr-archive-head"><p>04 · MEMORY ARCHIVE</p><h2>Uch xotirani bitta harakatda varaqlang.</h2></div>
      <div className="pr-memory-deck" style={{transform:`translateX(${-archive*(innerWidth<760?158:74)}vw)`}}>
        {memories.map((m,i)=><article key={i} className={'pr-memory-card c'+i} style={{'--i':i}}>
          <span>{m.n}</span><h3>{m.title}</h3><p>{m.body}</p><i/>
        </article>)}
      </div>
      <button className="pr-archive-track" aria-label="Xotiralarni chapdan o‘ngga siljiting" onPointerDown={archiveDown} onPointerMove={archiveMove} onPointerUp={archiveUp} onPointerCancel={archiveUp}
        onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&phase==='archive'){e.preventDefault();setArchive(1);world.current?.setArchiveProgress(1);setPhase('false-ending');world.current?.collapse();setTimeout(()=>{setPhase('particles');world.current?.igniteFinale()},1350)}}}>
        <i/><b/><span>xotiralarni suring →</span>
      </button>
    </section>

    <section className="pr-stage pr-false-ending"><div><p>ARCHIVE CLOSED</p><span>…</span></div></section>

    <section className="pr-stage pr-particles">
      <SignatureParticles name={content.recipient} onSettled={()=>setSettled(true)}/>
      <div className={'pr-final-copy '+(settled?'show':'')}><p>NOT A PAGE. A TRACE.</p><h2>{content.recipient}</h2><span>{content.final||'Senga aytmoqchi bo‘lganim shu: bu hikoyada eng qadrli narsa — sen.'}</span><div><button>Ulashish</button><button onClick={()=>location.reload()}>Qayta ko‘rish ↺</button></div></div>
    </section>
  </main>;
}
