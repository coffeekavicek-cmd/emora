import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GalaxyEngine } from './GalaxyEngine.js';
import { createHeartPoints, samplePortraitFile } from './portraitSampler.js';

const DEFAULT_MESSAGES=[
  'Sening yoningda oddiy kunlar ham xotiraga aylanadi.',
  'Kulging — mening eng sevimli yulduzim.',
  'Bu olamda seni topganim eng go‘zal tasodif.',
];

const clean=(value,fallback,max=160)=>{
  const text=String(value||'').trim().slice(0,max);
  return text||fallback;
};

function readConfig(){
  const q=new URLSearchParams(location.search);
  return{
    recipient:clean(q.get('name'),'Sen uchun',42),
    intro:clean(q.get('intro'),'Ba’zi tuyg‘ularni oddiy so‘z bilan aytib bo‘lmaydi.',120),
    messages:[
      clean(q.get('m1'),DEFAULT_MESSAGES[0],150),
      clean(q.get('m2'),DEFAULT_MESSAGES[1],150),
      clean(q.get('m3'),DEFAULT_MESSAGES[2],150),
    ],
    final:clean(q.get('final'),'Mening kichik olamimda eng yorqin nuqta — sensan.',180),
  };
}

export function GalaxyExperience(){
  const hostRef=useRef(null);
  const engineRef=useRef(null);
  const openedRef=useRef(new Set());
  const portraitRef=useRef(null);
  const morphQueuedRef=useRef(false);
  const [phase,setPhase]=useState('intro');
  const [opened,setOpened]=useState([]);
  const [activeMessage,setActiveMessage]=useState('');
  const [ready,setReady]=useState(false);
  const [uploadName,setUploadName]=useState('');
  const config=useMemo(readConfig,[]);

  const queueMorph=useCallback(()=>{
    if(morphQueuedRef.current)return;
    morphQueuedRef.current=true;
    setPhase('morphing');
    setTimeout(()=>{
      const engine=engineRef.current;
      if(!engine)return;
      const rect=hostRef.current?.getBoundingClientRect();
      const points=portraitRef.current||createHeartPoints(rect?.width||innerWidth,rect?.height||innerHeight,1000);
      engine.morphToPortrait(points,{onComplete:()=>{
        setPhase('portrait');
        setTimeout(()=>setPhase('portrait-ready'),850);
      }});
    },720);
  },[]);

  const onStar=useCallback((index)=>{
    openedRef.current.add(index);
    setOpened([...openedRef.current]);
    setActiveMessage(config.messages[index]);
    if(openedRef.current.size===3)queueMorph();
  },[config.messages,queueMorph]);

  useEffect(()=>{
    if(!hostRef.current)return;
    const engine=new GalaxyEngine(hostRef.current,{onStar,onReady:()=>setReady(true)});
    engineRef.current=engine;
    engine.init().catch(error=>{
      console.error('EMORA galaxy init failed',error);
      setPhase('fallback');
    });
    return()=>{engine.destroy();engineRef.current=null};
  },[onStar]);

  const begin=()=>{
    if(!ready)return;
    openedRef.current.clear();
    setOpened([]);
    setActiveMessage('');
    morphQueuedRef.current=false;
    engineRef.current?.reset();
    setPhase('explore');
  };

  const handlePortrait=async(event)=>{
    const file=event.target.files?.[0];
    if(!file||!file.type.startsWith('image/'))return;
    setUploadName(file.name.slice(0,44));
    const rect=hostRef.current?.getBoundingClientRect();
    try{
      portraitRef.current=await samplePortraitFile(file,{
        width:rect?.width||innerWidth,
        height:rect?.height||innerHeight,
        count:1100,
      });
    }catch(error){
      console.error('Portrait sampling failed',error);
      portraitRef.current=null;
      setUploadName('');
    }
  };

  const revealFinale=()=>{
    setPhase('exploding');
    engineRef.current?.explode({onComplete:()=>setPhase('finale')});
  };

  const restart=()=>{
    openedRef.current.clear();
    portraitRef.current=null;
    morphQueuedRef.current=false;
    setUploadName('');
    setOpened([]);
    setActiveMessage('');
    engineRef.current?.reset();
    setPhase('intro');
  };

  const isIntro=phase==='intro';
  const isExplore=phase==='explore';
  const isPortrait=phase==='portrait'||phase==='portrait-ready';
  const isFinale=phase==='finale';

  return(
    <main className={'experience phase-'+phase} aria-label="EMORA Galaxy Confession">
      <div className="galaxy-host" ref={hostRef} aria-hidden="true" />
      <div className="space-vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="experience-chrome">
        <span className="brand">emora<span>.</span></span>
        <span className="edition">GALAXY CONFESSION · EXPERIMENT 01</span>
        <span className="step">{isIntro?'00':isExplore?String(opened.length).padStart(2,'0')+'/03':isPortrait?'04/05':isFinale?'05/05':'••'}</span>
      </header>

      <section className={'scene intro-scene '+(isIntro?'scene-visible':'')} aria-hidden={!isIntro}>
        <div className="intro-copy">
          <p className="eyebrow">SENGA ATALGAN KICHIK OLAM</p>
          <h1>{config.intro}</h1>
          <p className="recipient">{config.recipient}</p>
          <p className="intro-note">Barmog‘ing bilan galaktikani aylantir. Uchta yorqin nuqta ichida senga aytilmagan uchta gap bor.</p>
          <div className="intro-actions">
            <button className="primary" onClick={begin} disabled={!ready}>{ready?'Olamni ochish':'Yulduzlar uyg‘onmoqda…'}</button>
            <label className="upload">
              <span>{uploadName?'Portret: '+uploadName:'Portret yuklash · ixtiyoriy'}</span>
              <input type="file" accept="image/*" onChange={handlePortrait} />
            </label>
          </div>
        </div>
        <div className="gesture-orbit" aria-hidden="true"><i/><i/><i/><span>drag</span></div>
      </section>

      <section className={'scene explore-scene '+(isExplore?'scene-visible':'')} aria-hidden={!isExplore}>
        <div className="explore-head">
          <p className="eyebrow">GALAKTIKANI AYLANTIR · YULDUZLARNI TOP</p>
          <h2>{opened.length===0?'Uchta sir yashiringan.':opened.length<3?'Yana '+(3-opened.length)+' ta yulduz qoldi.':'Endi hammasi bir nuqtaga yig‘iladi.'}</h2>
        </div>
        <div className={'message-card '+(activeMessage?'show':'')} aria-live="polite">
          <span>{opened.length?String(opened.length).padStart(2,'0'):'✦'}</span>
          <p>{activeMessage||'Yorqin yulduzlardan biriga teg.'}</p>
        </div>
        <div className="drag-hint"><i/> suring · aylantiring · oching</div>
      </section>

      <section className={'scene morph-scene '+((phase==='morphing'||isPortrait)?'scene-visible':'')} aria-hidden={!(phase==='morphing'||isPortrait)}>
        <p className="eyebrow">{phase==='morphing'?'YULDUZLAR BIR JOYGA YIG‘ILYAPTI':'SHU OLAMdagi ENG TANISH QIYOFA'}</p>
        <div className={'portrait-copy '+(isPortrait?'show':'')}>
          <h2>{config.recipient}</h2>
          <p>{portraitRef.current?'Surating yulduzlarga aylandi.':'Hozircha yurak — keyin bu joyda haqiqiy portret yig‘iladi.'}</p>
          {phase==='portrait-ready'&&<button className="primary final-trigger" onClick={revealFinale}>Oxirgi gapni ochish</button>}
        </div>
      </section>

      <section className={'scene finale-scene '+(isFinale?'scene-visible':'')} aria-hidden={!isFinale}>
        <div className="finale-copy">
          <span className="final-symbol">✦</span>
          <p className="eyebrow">GALAXY CONFESSION · FINALE</p>
          <h2>{config.final}</h2>
          <p className="recipient">{config.recipient}</p>
          <button className="ghost" onClick={restart}>Boshidan ko‘rish ↺</button>
        </div>
      </section>

      {phase==='fallback'&&<section className="fallback scene-visible"><h1>Galaktika ochilmadi.</h1><p>WebGL mavjud brauzerda qayta oching.</p></section>}
    </main>
  );
}
