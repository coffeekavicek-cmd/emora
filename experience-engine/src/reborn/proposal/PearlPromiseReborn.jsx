import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { readUrlContent } from '../../system/contentModel.js';
import { ExperienceSoundscape, ExperienceVideo, useExperienceMedia } from '../media/ExperienceMedia.jsx';
import './pearlPromiseReborn.css';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const FALLBACKS=[
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80'
];
function pulse(strong=false){try{navigator.vibrate?.(strong?[10,22,14]:[5])}catch{}}

function createVault(host){
  const mobile=Math.min(innerWidth,innerHeight)<760,scene=new THREE.Scene();scene.background=new THREE.Color(0x050506);scene.fog=new THREE.FogExp2(0x050506,.06);
  const renderer=new THREE.WebGLRenderer({antialias:!mobile,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.15:1.5));renderer.setSize(host.clientWidth,host.clientHeight,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.domElement.className='ppr-canvas';host.appendChild(renderer.domElement);
  const camera=new THREE.PerspectiveCamera(32,host.clientWidth/host.clientHeight,.1,50);camera.position.set(0,1.25,5.8);camera.lookAt(0,-.05,0);
  scene.add(new THREE.HemisphereLight(0x7b6778,0x080608,.85));const key=new THREE.DirectionalLight(0xffeadb,4.8);key.position.set(3.5,5,4);scene.add(key);const rim=new THREE.PointLight(0xd8a7ff,34,9,2);rim.position.set(-3,1.8,-1);scene.add(rim);const warm=new THREE.PointLight(0xffb67d,24,7,2);warm.position.set(2.4,.2,2.4);scene.add(warm);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(16,12),new THREE.MeshStandardMaterial({color:0x0c090c,roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.1;scene.add(floor);
  const box=new THREE.Group();scene.add(box);const velvet=new THREE.MeshPhysicalMaterial({color:0x27131e,roughness:.82,sheen:1,sheenColor:new THREE.Color(0x7d3857)});const base=new THREE.Mesh(new THREE.BoxGeometry(2.55,.72,2.1),velvet);base.position.y=-.62;box.add(base);const lidPivot=new THREE.Group();lidPivot.position.set(0,-.22,-1.03);box.add(lidPivot);const lid=new THREE.Mesh(new THREE.BoxGeometry(2.58,.3,2.12),velvet);lid.position.z=1.04;lidPivot.add(lid);
  const ring=new THREE.Group();ring.position.set(0,.23,.04);ring.scale.setScalar(.001);box.add(ring);const gold=new THREE.MeshPhysicalMaterial({color:0xe8c074,metalness:1,roughness:.12,clearcoat:1});const band=new THREE.Mesh(new THREE.TorusGeometry(.57,.095,mobile?16:24,mobile?56:96),gold);band.rotation.x=Math.PI/2;ring.add(band);const gem=new THREE.Mesh(new THREE.OctahedronGeometry(.31,mobile?1:2),new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.02,transmission:.94,thickness:.8,ior:2.35,clearcoat:1}));gem.position.y=.61;gem.rotation.y=Math.PI/4;ring.add(gem);
  const stars=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:0xf2dce8,size:.018,transparent:true,opacity:.45}));const arr=new Float32Array((mobile?70:140)*3);for(let i=0;i<arr.length/3;i++){arr[i*3]=(Math.random()-.5)*8;arr[i*3+1]=Math.random()*5-1.4;arr[i*3+2]=(Math.random()-.5)*6}stars.geometry.setAttribute('position',new THREE.BufferAttribute(arr,3));scene.add(stars);
  let dead=false,target=0,rot=0;const ro=new ResizeObserver(()=>{const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)});ro.observe(host);
  const tick=t=>{if(dead)return;rot+=(target-rot)*.1;ring.rotation.y=rot;gem.rotation.y=t*.00045;stars.rotation.y=t*.00001;box.rotation.y=Math.sin(t*.00022)*.018;renderer.render(scene,camera)};renderer.setAnimationLoop(tick);
  return{open(){gsap.to(lidPivot.rotation,{x:-1.45,duration:1.45,ease:'power4.inOut'});gsap.to(ring.scale,{x:1,y:1,z:1,duration:1.05,delay:.7,ease:'back.out(1.5)'});gsap.to(camera.position,{y:1.5,z:4.7,duration:1.5,ease:'power3.inOut',onUpdate:()=>camera.lookAt(0,.05,0)})},setRotation(v){target=v},reveal(){gsap.to(camera.position,{y:.82,z:3.45,duration:1.2,ease:'power3.inOut',onUpdate:()=>camera.lookAt(0,.28,0)});gsap.to(ring.scale,{x:1.3,y:1.3,z:1.3,duration:1.0,ease:'power3.out'});gsap.to(rim,{intensity:55,duration:1})},whiteout(){gsap.to(renderer,{toneMappingExposure:4.2,duration:1.1,ease:'power3.in'});gsap.to(scene.fog,{density:.012,duration:1})},destroy(){dead=true;ro.disconnect();renderer.setAnimationLoop(null);scene.traverse(o=>{o.geometry?.dispose?.();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose?.())}});renderer.dispose();renderer.domElement.remove()}};
}

export function PearlPromiseReborn({content:contentProp=null,media={},embedded=false}){
  const content=useMemo(()=>contentProp||readUrlContent('proposal-pearl'),[contentProp]);const assets=useExperienceMedia(media);const photos=assets.photos.length?assets.photos:FALLBACKS;
  const host=useRef(null),world=useRef(null),hold=useRef(null),drag=useRef(null),rot=useRef(0);const [phase,setPhase]=useState('vault');const [holding,setHolding]=useState(false);const [memory,setMemory]=useState(0);const [rotation,setRotation]=useState(0);
  useEffect(()=>{if(!host.current)return;world.current=createVault(host.current);return()=>{clearTimeout(hold.current);world.current?.destroy()}},[]);
  const open=()=>{clearTimeout(hold.current);hold.current=null;setHolding(false);pulse(true);world.current?.open();setPhase('opening');setTimeout(()=>{setPhase('memories');setMemory(1)},1450);setTimeout(()=>setMemory(2),2450);setTimeout(()=>setMemory(3),3450);setTimeout(()=>setPhase(assets.video?'vow':'rotate'),4550)};
  const startHold=()=>{if(phase!=='vault'||hold.current)return;setHolding(true);hold.current=setTimeout(open,850)};const cancelHold=()=>{if(hold.current){clearTimeout(hold.current);hold.current=null}setHolding(false)};
  const down=e=>{if(phase!=='rotate')return;drag.current=e.clientX;e.currentTarget.setPointerCapture?.(e.pointerId)};const move=e=>{if(drag.current==null||phase!=='rotate')return;const dx=e.clientX-drag.current;drag.current=e.clientX;const n=rot.current+dx*.02;rot.current=n;setRotation(n);world.current?.setRotation(n);if(Math.abs(n)>4.8){drag.current=null;pulse(true);setPhase('engraving');world.current?.reveal();setTimeout(()=>{world.current?.whiteout();setPhase('question')},1600)}};
  return <main className={'pearl-promise-reborn '+(embedded?'is-embedded ':'')+'phase-'+phase}>
    <ExperienceSoundscape preset={content.musicPreset||'Cinema'} customUrl={assets.music} startAt={content.musicStart||0}/><div ref={host} className="ppr-world"/><div className="ppr-grain"/><div className="ppr-vignette"/>
    <header className="ppr-chrome"><a href="?">emora<span>.</span></a><small>PEARL PROMISE · PRIVATE VAULT</small><b>{phase==='vault'?'00':phase==='opening'?'01':phase==='memories'?'02':phase==='vow'?'03':phase==='rotate'?'04':'05'}</b></header>
    <section className="ppr-stage ppr-vault"><article><p>ONE VAULT · ONE QUESTION</p><h1>{content.message||'Bu quti ichida uzukdan kattaroq narsa bor.'}</h1><em>{content.recipient}</em></article><button className={'ppr-hold '+(holding?'holding':'')} aria-label="Qutini bosib ushlab oching" onPointerDown={startHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold}><i/><span>bosib ushlab turing</span><b>850ms</b></button></section>
    <section className="ppr-stage ppr-memories"><div className="ppr-memory-orbit">{photos.slice(0,3).map((src,i)=><figure key={i} className={memory>i?'show':''} style={{'--i':i}}><img src={src} alt=""/><figcaption>{content.captions?.[i]||['Biz boshlagan joy.','Bizning eng yaxshi kunimiz.','Keyingi bob.'][i]}</figcaption></figure>)}</div><div className="ppr-memory-copy"><p>THE RING REMEMBERS</p><h2>{content.recipient}</h2></div></section>
    <section className="ppr-stage ppr-vow"><div className="ppr-video"><ExperienceVideo src={assets.video} poster={photos[1]} title="Private vow" autoReveal onEnded={()=>setPhase('rotate')}/></div><button onClick={()=>setPhase('rotate')}>Uzukka qaytish →</button></section>
    <section className="ppr-stage ppr-rotate"><article><p>04 · FIND THE ENGRAVING</p><h2>Uzukni aylantir.</h2><span>{Math.round(Math.abs(rotation)/(Math.PI*2)*100)}%</span></article><button className="ppr-drag" aria-label="Uzukni aylantiring" onPointerDown={down} onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}><i/><span>← drag →</span></button></section>
    <section className="ppr-stage ppr-engraving"><p>inside the ring:</p><h2>{content.recipient} · forever starts here</h2></section>
    <section className="ppr-stage ppr-question"><article><p>NO MORE HIDDEN WORDS</p><h2>{content.final||'Har kunimni sen bilan boshlashimga rozimisan?'}</h2><em>{content.recipient}</em><div><button>HA</button><button onClick={()=>location.reload()}>Qayta ko‘rish ↺</button></div></article></section>
  </main>;
}
