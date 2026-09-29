import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { readUrlContent } from '../system/contentModel.js';
import './pearlPromise.css';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function tone(freq=180,duration=.13,vol=.028){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C(),osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(freq,ctx.currentTime);
    gain.gain.setValueAtTime(.0001,ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol,ctx.currentTime+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);
    osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration+.02);
    setTimeout(()=>ctx.close(),320);
  }catch{}
}

function createScene(host,onReady){
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x080609);
  scene.fog=new THREE.FogExp2(0x080609,.085);

  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  renderer.setSize(host.clientWidth,host.clientHeight,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.className='pp-canvas';
  host.appendChild(renderer.domElement);

  const camera=new THREE.PerspectiveCamera(31,Math.max(1,host.clientWidth)/Math.max(1,host.clientHeight),.1,40);
  camera.position.set(0,1.22,5.5);
  camera.lookAt(0,-.1,0);

  scene.add(new THREE.HemisphereLight(0x6d5264,0x120d11,.72));
  const key=new THREE.DirectionalLight(0xffdfd2,4.1);key.position.set(3.8,5.5,4.2);key.castShadow=true;scene.add(key);
  const rim=new THREE.PointLight(0xc889ff,22,8,2);rim.position.set(-3,1.8,-1.5);scene.add(rim);
  const warm=new THREE.PointLight(0xffaf91,18,7,2);warm.position.set(2,-.2,2);scene.add(warm);

  const floor=new THREE.Mesh(
    new THREE.PlaneGeometry(16,12),
    new THREE.MeshStandardMaterial({color:0x120d12,roughness:.9,metalness:0})
  );
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.08;floor.receiveShadow=true;scene.add(floor);

  const velvet=new THREE.MeshPhysicalMaterial({color:0x28131d,roughness:.88,metalness:0,clearcoat:.05,sheen:1,sheenColor:new THREE.Color(0x6b3047)});
  const inside=new THREE.MeshPhysicalMaterial({color:0x12090f,roughness:.96,metalness:0,sheen:1,sheenColor:new THREE.Color(0x5b2238)});

  const box=new THREE.Group();scene.add(box);
  const base=new THREE.Mesh(new THREE.BoxGeometry(2.45,.72,2.05),velvet);base.position.y=-.6;base.castShadow=true;base.receiveShadow=true;box.add(base);
  const cushion=new THREE.Mesh(new THREE.BoxGeometry(1.95,.22,1.55),inside);cushion.position.set(0,-.15,.02);cushion.castShadow=true;box.add(cushion);

  const lidPivot=new THREE.Group();lidPivot.position.set(0,-.22,-1.02);box.add(lidPivot);
  const lid=new THREE.Mesh(new THREE.BoxGeometry(2.48,.28,2.08),velvet);lid.position.set(0,0,1.02);lid.castShadow=true;lidPivot.add(lid);
  const lidInside=new THREE.Mesh(new THREE.BoxGeometry(2.12,.08,1.72),inside);lidInside.position.set(0,-.18,1.02);lidPivot.add(lidInside);

  const ring=new THREE.Group();ring.position.set(0,.23,.05);ring.scale.setScalar(.001);box.add(ring);
  const gold=new THREE.MeshPhysicalMaterial({color:0xe5bd72,metalness:1,roughness:.14,clearcoat:1,clearcoatRoughness:.08});
  const band=new THREE.Mesh(new THREE.TorusGeometry(.54,.095,32,120),gold);band.rotation.x=Math.PI/2;band.castShadow=true;ring.add(band);
  const shoulder=new THREE.Mesh(new THREE.TorusGeometry(.31,.055,22,70,Math.PI),gold);shoulder.rotation.set(Math.PI/2,0,Math.PI);shoulder.position.y=.25;ring.add(shoulder);

  const gemMat=new THREE.MeshPhysicalMaterial({
    color:0xffffff,metalness:0,roughness:.03,transmission:.92,thickness:.7,ior:2.35,
    clearcoat:1,clearcoatRoughness:.02,attenuationColor:new THREE.Color(0xffeefa),attenuationDistance:1.4
  });
  const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.29,2),gemMat);gem.position.set(0,.58,0);gem.rotation.y=Math.PI/4;gem.castShadow=true;ring.add(gem);
  [-.18,.18].forEach(x=>[-.12,.12].forEach(z=>{
    const p=new THREE.Mesh(new THREE.CylinderGeometry(.018,.025,.28,10),gold);p.position.set(x*.72,.46,z*.72);p.rotation.z=x>0?-.42:.42;ring.add(p);
  }));

  const dustGeo=new THREE.BufferGeometry();
  const count=180;
  const arr=new Float32Array(count*3);
  for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*7;arr[i*3+1]=Math.random()*4-1;arr[i*3+2]=(Math.random()-.5)*5}
  dustGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));
  const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xf5d8de,size:.018,transparent:true,opacity:.42,depthWrite:false}));
  scene.add(dust);

  const state={open:0,ringReady:0,rotation:0,targetRotation:0,pointerX:0,pointerY:0};
  let destroyed=false;
  const clock=new THREE.Clock();

  const resize=()=>{
    const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
  };
  const ro=new ResizeObserver(resize);ro.observe(host);resize();

  const render=()=>{
    if(destroyed)return;
    const t=clock.getElapsedTime();
    state.rotation+=(state.targetRotation-state.rotation)*.1;
    ring.rotation.y=state.rotation;
    ring.rotation.x=Math.sin(t*.55)*.035;
    gem.rotation.y=t*.42;
    dust.rotation.y=t*.016;
    box.rotation.y=Math.sin(t*.22)*.015+state.pointerX*.035;
    box.rotation.x=state.pointerY*.018;
    renderer.render(scene,camera);
  };
  renderer.setAnimationLoop(render);

  const api={
    canvas:renderer.domElement,
    state,
    open(){
      tone(105,.16,.05);try{navigator.vibrate?.([12,35,16])}catch{}
      gsap.to(lidPivot.rotation,{x:-1.42,duration:1.45,ease:'power4.inOut'});
      gsap.to(camera.position,{y:1.55,z:4.65,duration:1.55,ease:'power3.inOut',onUpdate:()=>camera.lookAt(0,-.05,0)});
      gsap.to(ring.scale,{x:1,y:1,z:1,duration:1.05,delay:.72,ease:'back.out(1.5)'});
      gsap.to(rim,{intensity:34,duration:1.2,delay:.55,ease:'power2.out'});
      gsap.to(warm,{intensity:26,duration:1.2,delay:.55,ease:'power2.out'});
      state.open=1;
    },
    setRotation(v){state.targetRotation=v},
    pointer(nx,ny){state.pointerX=clamp(nx,-1,1);state.pointerY=clamp(ny,-1,1)},
    reveal(){
      gsap.to(camera.position,{y:.9,z:3.55,duration:1.25,ease:'power3.inOut',onUpdate:()=>camera.lookAt(0,.25,0)});
      gsap.to(ring.scale,{x:1.26,y:1.26,z:1.26,duration:1.1,ease:'power3.out'});
      gsap.to(rim,{intensity:52,duration:1.1});tone(620,.22,.022);
    },
    whiteout(){
      gsap.to(renderer,{toneMappingExposure:3.8,duration:1.15,ease:'power3.in'});
      gsap.to(scene.fog,{density:.015,duration:1.0,ease:'power2.in'});
    },
    destroy(){
      destroyed=true;ro.disconnect();renderer.setAnimationLoop(null);
      renderer.dispose();dustGeo.dispose();
      scene.traverse(o=>{if(o.geometry)o.geometry.dispose?.();if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose?.())}});
      renderer.domElement.remove();
    }
  };
  onReady?.(api);
  return api;
}

export function PearlPromiseExperience({content:contentProp=null,embedded=false}){
  const cfg=useMemo(()=>contentProp||readUrlContent('proposal-pearl'),[contentProp]);
  const host=useRef(null),engine=useRef(null),holdTimer=useRef(null),drag=useRef(null);
  const [phase,setPhase]=useState('intro');
  const [holding,setHolding]=useState(false);
  const [memory,setMemory]=useState(0);
  const [rotation,setRotation]=useState(0);

  useEffect(()=>{
    if(!host.current)return;
    engine.current=createScene(host.current);
    return()=>engine.current?.destroy();
  },[]);

  useEffect(()=>{
    const move=e=>{
      const nx=(e.clientX/Math.max(1,innerWidth)-.5)*2,ny=(e.clientY/Math.max(1,innerHeight)-.5)*2;
      engine.current?.pointer(nx,ny);
      if(!drag.current||phase!=='rotate')return;
      const dx=e.clientX-drag.current.x;
      drag.current.x=e.clientX;
      const next=rotation+dx*.018;
      setRotation(next);engine.current?.setRotation(next);
      if(Math.abs(next)>=4.6){
        setPhase('engraving');drag.current=null;engine.current?.reveal();
        setTimeout(()=>{engine.current?.whiteout();setPhase('question')},1850);
      }
    };
    window.addEventListener('pointermove',move,{passive:true});
    return()=>window.removeEventListener('pointermove',move);
  },[phase,rotation]);

  const startHold=()=>{
    if(phase!=='intro')return;
    clearTimeout(holdTimer.current);setHolding(true);tone(88,.08,.02);
    holdTimer.current=setTimeout(()=>{
      setHolding(false);setPhase('opening');engine.current?.open();
      setTimeout(()=>{setPhase('memories');setMemory(1)},1600);
      setTimeout(()=>setMemory(2),2800);
      setTimeout(()=>setMemory(3),4000);
      setTimeout(()=>setPhase('rotate'),5200);
    },900);
  };
  const stopHold=()=>{if(phase!=='intro')return;clearTimeout(holdTimer.current);setHolding(false)};
  useEffect(()=>()=>clearTimeout(holdTimer.current),[]);

  const down=e=>{
    if(phase!=='rotate')return;
    drag.current={x:e.clientX};e.currentTarget.setPointerCapture?.(e.pointerId);tone(310,.06,.012);
  };
  const up=()=>{drag.current=null};

  const restart=()=>{
    location.href=location.pathname+'?template=proposal-pearl&name='+encodeURIComponent(cfg.recipient)+'&final='+encodeURIComponent(cfg.final);
  };

  return <main className={'pearl-promise '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <div ref={host} className="pp-webgl" aria-hidden="true"/>
    <div className="pp-grain"/><div className="pp-vignette"/>
    <header className="pp-chrome"><a href="?">emora<span>.</span></a><small>PEARL PROMISE · TRUE 3D</small><b>{phase==='intro'?'00':phase==='opening'?'01':phase==='memories'?'02':phase==='rotate'?'03':phase==='engraving'?'04':'05'}</b></header>

    <section className="pp-copy pp-intro">
      <p>ONE QUESTION · ONE PERSON</p>
      <h1>{cfg.message||'Bu quti ichida uzukdan kattaroq narsa bor.'}</h1>
      <em>{cfg.recipient}</em>
      <button className={'pp-hold '+(holding?'holding':'')} aria-label="Uzuk qutisini bosib ushlab oching"
        onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
        onKeyDown={e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();startHold()}}}
        onKeyUp={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();stopHold()}}}>
        <i/><span>Qutini bosib ushlab turing</span><b>900ms</b>
      </button>
    </section>

    <section className="pp-memories" aria-live="polite">
      {[0,1,2].map(i=><article key={i} className={memory>i?'show':''}><span>0{i+1}</span><p>{cfg.paragraphs?.[i]||['Bizning kechamiz.','Bizning uyimiz.','Bizning kelajagimiz.'][i]}</p></article>)}
    </section>

    <section className="pp-rotate">
      <p>RING STUDY · 360°</p>
      <h2>Uzukni aylantiring.</h2>
      <button className="pp-drag-surface" aria-label="Uzukni aylantiring" onPointerDown={down} onPointerUp={up} onPointerCancel={up}>
        <span>← drag →</span>
      </button>
      <small>{Math.min(100,Math.round(Math.abs(rotation)/4.6*100))}%</small>
    </section>

    <section className="pp-engraving">
      <p>INSIDE THE RING</p>
      <h2>FOREVER · {cfg.recipient}</h2>
      <span>engraved for one person</span>
    </section>

    <section className="pp-question">
      <p>THE ONLY QUESTION THAT MATTERS</p>
      <h2>{cfg.final||'Hayotimning keyingi barcha boblarini men bilan yozasanmi?'}</h2>
      <em>{cfg.recipient}</em>
      <div><button onClick={restart}>Boshidan ↺</button><a href="?">Barcha experience</a></div>
    </section>
  </main>;
}
