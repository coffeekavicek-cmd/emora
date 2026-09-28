import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
function tactile(kind='soft'){
 try{
  const C=window.AudioContext||window.webkitAudioContext;if(C){
  const ctx=new C(),osc=ctx.createOscillator(),gain=ctx.createGain();
  const map={soft:[420,.035],pop:[155,.055],mechanical:[245,.045],light:[690,.032],ring:[520,.05]};
  const [freq,vol]=map[kind]||map.soft;osc.type=kind==='mechanical'?'square':'sine';osc.frequency.setValueAtTime(freq,ctx.currentTime);
  if(kind==='pop')osc.frequency.exponentialRampToValueAtTime(70,ctx.currentTime+.09);
  if(kind==='ring')osc.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+.18);
  gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(vol,ctx.currentTime+.006);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.16);
  osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.18);setTimeout(()=>ctx.close(),350);
  }
 }catch{}
 try{navigator.vibrate?.(kind==='pop'?[16,8,20]:kind==='mechanical'?[9]:kind==='ring'?[14,10,22]:[8])}catch{}
}

function personalized(base){
  const q=new URLSearchParams(location.search);
  const read=(key,fallback,max=180)=>{
    const value=String(q.get(key)||'').trim().slice(0,max);
    return value||fallback;
  };
  return{
    ...base,
    recipient:read('name','Sen uchun',42),
    intro:read('intro',base.intro,150),
    messages:[
      read('m1',base.messages[0],170),
      read('m2',base.messages[1],170),
      read('m3',base.messages[2],170),
    ],
    final:read('final',base.final,210),
  };
}

function Ambient({type}){
  const count=type==='rain'?34:type==='garden'?22:type==='balloons'?12:type==='aurora'?18:20;
  return <div className={'ritual-ambient ambient-'+type} aria-hidden="true">
    {Array.from({length:count},(_,i)=><i key={i} style={{'--i':i,'--x':((i*37)%100)+'%','--d':(2.7+(i%7)*.63)+'s'}} />)}
  </div>;
}

function RevealSequence({experience,onFinish}){
  const [index,setIndex]=useState(0);
  const cardRef=useRef(null);
  useLayoutEffect(()=>{
    const el=cardRef.current;
    if(!el)return;
    gsap.fromTo(el,{opacity:0,y:24,filter:'blur(9px)',scale:.965},{opacity:1,y:0,filter:'blur(0px)',scale:1,duration:.72,ease:'power3.out'});
  },[index]);
  const next=()=>{
    if(index>=2){onFinish();return}
    gsap.to(cardRef.current,{opacity:0,y:-18,filter:'blur(8px)',duration:.32,ease:'power2.in',onComplete:()=>setIndex(i=>i+1)});
  };
  return <div className={'reveal-sequence reveal-'+experience.ritual}>
    <figure className="reveal-artwork"><img src={experience.art} alt="" /><span/></figure>
    <div className="reveal-count">{String(index+1).padStart(2,'0')} / 03</div>
    <div className="reveal-card" ref={cardRef}>
      <span className="reveal-mark">{experience.ritual==='cinema'?'REC':experience.ritual==='ink'?'●':'✦'}</span>
      <p>{experience.messages[index]}</p>
    </div>
    <button className="ritual-primary" onClick={next}>{index===2?'Finale':'Keyingisi'} →</button>
  </div>;
}

function Curtain({complete}){
  const [open,setOpen]=useState(0);
  const drag=useRef(null);
  const done=useRef(false);
  const finish=(v=1)=>{
    setOpen(v);
    if(v>.92&&!done.current){done.current=true;tactile('soft');setTimeout(complete,650)}
  };
  return <div className="art curtain-art" style={{'--open':open}}>
    <div className="curtain-backdrop"><span>✦</span></div>
    <div className="curtain curtain-left"/><div className="curtain curtain-right"/>
    <button className="artifact-hit"
      onPointerDown={e=>{drag.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)}}
      onPointerMove={e=>{if(drag.current==null)return;finish(clamp(Math.abs(e.clientX-drag.current)/130))}}
      onPointerUp={()=>{drag.current=null;if(open<.35)finish(1)}}
      onClick={()=>finish(1)}>Pardani torting</button>
  </div>;
}

function Envelope({complete}){
  const [open,setOpen]=useState(false);
  const trigger=()=>{if(open)return;setOpen(true);setTimeout(complete,1150)};
  return <button className={'art envelope-art '+(open?'is-open':'')} onClick={trigger} aria-label="Muhrni ochish">
    <span className="letter-sheet"><b>for you</b></span>
    <span className="env-back"/>
    <span className="env-flap"/>
    <span className="wax-seal">E</span>
    <span className="env-hint">muhrga teging</span>
  </button>;
}

function Silk({complete}){
  const [open,setOpen]=useState(false);
  const go=()=>{if(open)return;tactile('soft');setOpen(true);setTimeout(complete,1350)};
  return <button className={'art silk-art '+(open?'is-open':'')} onClick={go}>
    <span className="silk-fold silk-a"/><span className="silk-fold silk-b"/><span className="silk-fold silk-c"/>
    <span className="silk-monogram">E</span><span className="silk-thread"/>
    <span className="art-label">ipakni oching</span>
  </button>;
}

function ThreeTapArtifact({kind,complete,onMessage}){
  const [opened,setOpened]=useState([]);
  const hit=i=>{
    if(opened.includes(i))return;
    const next=[...opened,i];tactile(kind==='balloons'?'pop':kind==='sky'?'light':'soft');setOpened(next);onMessage?.(i);
    if(next.length===3)setTimeout(complete,900);
  };
  if(kind==='garden')return <div className="art garden-art">
    <div className="garden-moon"/><div className="garden-ground"/>
    {[0,1,2].map(i=><button key={i} onClick={()=>hit(i)} className={'lantern lantern-'+i+' '+(opened.includes(i)?'lit':'')}><i/><span>✦</span></button>)}
    <div className="art-label">3 chiroqni yoqing</div>
  </div>;
  if(kind==='balloons')return <div className="art balloon-art">
    {[0,1,2].map(i=><button key={i} onClick={()=>hit(i)} className={'balloon balloon-'+i+' '+(opened.includes(i)?'popped':'')}><span>{i+1}</span><i/></button>)}
    <div className="art-label">3 sharni yorib chiqing</div>
  </div>;
  if(kind==='sky')return <div className={'art sky-art opened-'+opened.length}>
    <div className="sky-horizon"/>{[0,1,2].map(i=><button key={i} onClick={()=>hit(i)} className={'sky-star star-'+i+' '+(opened.includes(i)?'awake':'')}>✦</button>)}
    <div className="art-label">3 yulduzni uyg‘oting</div>
  </div>;
  return <div className={'art naqsh-art progress-'+opened.length}>
    <div className="naqsh-lines"><i/><i/><i/><i/><b/></div>
    {[0,1,2,3].map(i=><button key={i} onClick={()=>{if(i<3)hit(i);else if(opened.length===3)complete()}} className={'naqsh-node node-'+i+' '+((i<3&&opened.includes(i))||(i===3&&opened.length===3)?'active':'')}>{i===3?'✦':''}</button>)}
    <div className="art-label">{opened.length<3?'nuqtalarni uyg‘oting':'markazni bosing'}</div>
  </div>;
}

function Gift({complete}){
  const [open,setOpen]=useState(false);
  const go=()=>{if(open)return;tactile('pop');setOpen(true);setTimeout(complete,1200)};
  return <button className={'art gift-art '+(open?'is-open':'')} onClick={go}>
    <span className="gift-glow"/><span className="gift-box"/><span className="gift-lid"/><span className="gift-ribbon r1"/><span className="gift-ribbon r2"/>
    <span className="gift-burst">{Array.from({length:12},(_,i)=><i key={i} style={{'--i':i}}/> )}</span>
    <span className="art-label">qutini oching</span>
  </button>;
}

function Reel({complete,onMessage}){
  const [turns,setTurns]=useState(0);
  const turn=()=>{
    if(turns>=3)return;
    const n=turns+1;tactile('mechanical');setTurns(n);onMessage?.(turns);
    if(n===3)setTimeout(complete,900);
  };
  return <div className={'art reel-art turns-'+turns}>
    <div className="film-strip">{[0,1,2,3,4].map(i=><i key={i}/>)}</div>
    <button className="reel-wheel" onClick={turn}><span/><b/><em/></button>
    <div className="film-counter">0{turns} / 03</div>
    <div className="art-label">reelni 3 marta aylantiring</div>
  </div>;
}

function Rain({complete}){
  const [wipe,setWipe]=useState(0);
  const pointer=useRef(null),done=useRef(false);
  const update=v=>{
    const n=clamp(v);setWipe(n);
    if(n>.82&&!done.current){done.current=true;tactile('soft');setTimeout(complete,700)}
  };
  return <div className="art rain-art" style={{'--wipe':wipe}}>
    <div className="rain-message">men shu yerdaman</div>
    <div className="rain-glass">{Array.from({length:30},(_,i)=><i key={i} style={{'--i':i}}/>)}</div>
    <button className="artifact-hit"
      onPointerDown={e=>{pointer.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)}}
      onPointerMove={e=>{if(pointer.current==null)return;update(Math.abs(e.clientX-pointer.current)/180)}}
      onPointerUp={()=>{pointer.current=null;if(wipe<.3)update(1)}}
      onClick={()=>update(1)}>Oynani arting</button>
  </div>;
}

function Ink({complete}){
  const [bloom,setBloom]=useState(false);
  const go=()=>{if(bloom)return;tactile('soft');setBloom(true);setTimeout(complete,1450)};
  return <button className={'art ink-art '+(bloom?'is-bloom':'')} onClick={go}>
    <span className="paper-line"/>
    <span className="ink-drop"/><span className="ink-pool"/><span className="ink-script">kechir</span>
    <span className="art-label">siyohga teging</span>
  </button>;
}

function Lamp({complete}){
  const [on,setOn]=useState(false);
  const go=()=>{if(on)return;tactile('light');setOn(true);setTimeout(complete,1000)};
  return <div className={'art lamp-art '+(on?'is-on':'')}>
    <div className="lamp-light"/><div className="lamp-shade"/><div className="lamp-stand"/>
    <button className="lamp-chain" onClick={go}><i/><span>torting</span></button>
  </div>;
}

function Ring({complete}){
  const [held,setHeld]=useState(false),[open,setOpen]=useState(false);
  const timer=useRef(null);
  const start=()=>{
    if(open)return;
    setHeld(true);
    timer.current=setTimeout(()=>{tactile('ring');setOpen(true);setHeld(false);setTimeout(complete,1400)},900);
  };
  const stop=()=>{if(open)return;setHeld(false);clearTimeout(timer.current)};
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  return <div className={'art ring-art '+(held?'is-held ':'')+(open?'is-open':'')}>
    <div className="ring-aura"/><div className="ring-box"><i className="box-lid"/><i className="box-base"/><span className="ring-gem">◇</span></div>
    <button className="ring-hold" onPointerDown={start} onPointerUp={stop} onPointerCancel={stop} onPointerLeave={stop}>900ms ushlab turing<i/></button>
  </div>;
}

function Cinema({complete}){
  const [play,setPlay]=useState(false);
  const go=()=>{if(play)return;tactile('mechanical');setPlay(true);setTimeout(complete,1700)};
  return <button className={'art cinema-art '+(play?'is-playing':'')} onClick={go}>
    <span className="projector"><i/><i/><b/></span><span className="projector-beam"/>
    <span className="cinema-screen"><b>OUR STORY</b><em>00:00:01</em></span>
    <span className="art-label">proyektorni yoqing</span>
  </button>;
}

function RitualArtifact({experience,complete,onMessage}){
  switch(experience.ritual){
    case'curtain':return <Curtain complete={complete}/>;
    case'envelope':return <Envelope complete={complete}/>;
    case'silk':return <Silk complete={complete}/>;
    case'garden':return <ThreeTapArtifact kind="garden" complete={complete} onMessage={onMessage}/>;
    case'naqsh':return <ThreeTapArtifact kind="naqsh" complete={complete} onMessage={onMessage}/>;
    case'gift':return <Gift complete={complete}/>;
    case'balloons':return <ThreeTapArtifact kind="balloons" complete={complete} onMessage={onMessage}/>;
    case'reel':return <Reel complete={complete} onMessage={onMessage}/>;
    case'rain':return <Rain complete={complete}/>;
    case'ink':return <Ink complete={complete}/>;
    case'lamp':return <Lamp complete={complete}/>;
    case'ring':return <Ring complete={complete}/>;
    case'cinema':return <Cinema complete={complete}/>;
    case'sky':return <ThreeTapArtifact kind="sky" complete={complete} onMessage={onMessage}/>;
    default:return null;
  }
}

export function RitualExperience({definition}){
  const experience=useMemo(()=>personalized(definition),[definition]);
  const [phase,setPhase]=useState('intro');
  const [liveMessage,setLiveMessage]=useState('');
  const sceneRef=useRef(null);
  const go=next=>{
    const current=sceneRef.current;
    if(!current){setPhase(next);return}
    gsap.to(current,{opacity:0,scale:.985,filter:'blur(7px)',duration:.4,ease:'power2.in',onComplete:()=>setPhase(next)});
  };
  useLayoutEffect(()=>{
    if(!sceneRef.current)return;
    gsap.fromTo(sceneRef.current,{opacity:0,scale:1.018,filter:'blur(10px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:.78,ease:'power3.out'});
  },[phase]);
  useEffect(()=>{setLiveMessage('')},[phase]);

  return <main className={'ritual-experience tone-'+experience.tone+' ritual-'+experience.ritual+' phase-'+phase}>
    <Ambient type={experience.ritual}/>
    <div className="ritual-art-source" aria-hidden="true"><img src={experience.art} alt="" /><i/><b/></div>
    <div className="ritual-vignette"/><div className="ritual-grain"/>
    <header className="ritual-chrome">
      <a href="?" className="ritual-brand">emora<span>.</span></a>
      <span className="ritual-edition">{experience.group} · {experience.name}</span>
      <span className="ritual-phase">{phase==='intro'?'00':phase==='ritual'?'01':phase==='reveal'?'02':'03'}</span>
    </header>

    {phase==='intro'&&<section ref={sceneRef} className="ritual-scene intro-ritual">
      <div className="ritual-title">
        <p className="ritual-eyebrow">{experience.eyebrow}</p>
        <h1>{experience.intro}</h1>
        <p className="ritual-recipient">{experience.recipient}</p>
        <button className="ritual-primary" onClick={()=>go('ritual')}>{experience.instruction} →</button>
      </div>
      <div className="intro-orbit"><i/><i/><b/></div>
    </section>}

    {phase==='ritual'&&<section ref={sceneRef} className="ritual-scene artifact-scene">
      <div className="artifact-copy">
        <p className="ritual-eyebrow">{experience.name}</p>
        <h2>{experience.instruction}</h2>
      </div>
      <RitualArtifact experience={experience} complete={()=>go('reveal')} onMessage={i=>setLiveMessage(experience.messages[i])}/>
      <div className={'live-whisper '+(liveMessage?'show':'')} aria-live="polite">{liveMessage}</div>
    </section>}

    {phase==='reveal'&&<section ref={sceneRef} className="ritual-scene reveal-scene">
      <RevealSequence experience={experience} onFinish={()=>go('finale')}/>
    </section>}

    {phase==='finale'&&<section ref={sceneRef} className="ritual-scene final-ritual">
      <div className="final-art-transform" aria-hidden="true"><img src={experience.art} alt="" /><i/></div>
      <div className="final-halo"/><div className="finale-content">
        <span className="finale-symbol">{experience.ritual==='ring'?'◇':experience.ritual==='balloons'?'✦':experience.ritual==='rain'?'○':'✧'}</span>
        <p className="ritual-eyebrow">{experience.name} · FINALE</p>
        <h2>{experience.final}</h2>
        <p className="ritual-recipient">{experience.recipient}</p>
        <div className="final-actions">
          <button className="ritual-ghost" onClick={()=>go('intro')}>Boshidan ↺</button>
          <a className="ritual-ghost" href="?">15 experience</a>
        </div>
      </div>
    </section>}
  </main>;
}
