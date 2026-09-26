/* EMORA Silk Heritage: optional real 3D envelope. CSS stage always remains a working fallback. */
(async function(){
 'use strict';
 const intro=document.getElementById('silkIntro'),canvas=document.getElementById('silkCanvas');
 if(!intro||!canvas||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let THREE,renderer,observer;
 try{
  THREE=await import('https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js');
  if(intro.classList.contains('dismissed'))return;
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.65));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
 }catch(e){console.info('Silk 3D unavailable; original CSS experience remains available.');return}
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);
 camera.position.set(0,.05,5.9);
 scene.add(new THREE.AmbientLight(0xfff7e9,2.2));
 const key=new THREE.DirectionalLight(0xffe1aa,3.1);key.position.set(-2,3,4);scene.add(key);
 const edge=new THREE.DirectionalLight(0xffffff,1.9);edge.position.set(2,-1,1.5);scene.add(edge);
 const paper=new THREE.MeshStandardMaterial({color:0xfff7e7,roughness:.91,metalness:0,side:THREE.DoubleSide});
 const paperEdge=new THREE.MeshStandardMaterial({color:0xe3d2b9,roughness:.89});
 const gold=new THREE.MeshStandardMaterial({color:0xc2a06a,metalness:.79,roughness:.26,side:THREE.DoubleSide});
 const softGold=new THREE.MeshStandardMaterial({color:0xf6ddb0,metalness:.59,roughness:.3});
 const group=new THREE.Group();scene.add(group);
 const back=new THREE.Mesh(new THREE.BoxGeometry(2.16,1.51,.11),paper);back.position.z=-.06;group.add(back);
 const lip=new THREE.Mesh(new THREE.BoxGeometry(2.05,.70,.01),paperEdge);lip.position.set(0,-.30,.04);group.add(lip);
 const card=new THREE.Mesh(new THREE.BoxGeometry(1.72,1.21,.025),paper);
 card.position.set(0,-.06,.05);group.add(card);
 const innerFrame=new THREE.Mesh(new THREE.BoxGeometry(1.57,1.04,.002),gold);
 innerFrame.position.set(0,-.06,.067);group.add(innerFrame);
 const cardFront=new THREE.Mesh(new THREE.BoxGeometry(1.555,1.025,.003),paper);
 cardFront.position.set(0,-.06,.07);group.add(cardFront);
 const flapShape=new THREE.Shape();
 flapShape.moveTo(-1.08,0);flapShape.lineTo(1.08,0);flapShape.lineTo(0,-.91);flapShape.closePath();
 const flap=new THREE.Mesh(new THREE.ShapeGeometry(flapShape),paper);
 flap.position.set(0,.75,.125);group.add(flap);
 const wax=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.045,36),gold);
 wax.rotation.x=Math.PI/2;wax.position.set(0,-.02,.165);group.add(wax);
 const waxCenter=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.052,32),softGold);
 waxCenter.rotation.x=Math.PI/2;waxCenter.position.set(0,-.02,.175);group.add(waxCenter);
 const ribbon=new THREE.Mesh(new THREE.BoxGeometry(.11,1.92,.012),paperEdge);
 ribbon.position.set(0,.01,.095);group.add(ribbon);
 let start=0,disposed=false,ready=false,raf=0,lookX=0,lookY=0;
 const fit=()=>{
  if(!renderer||disposed)return;
  const box=canvas.getBoundingClientRect();
  const w=Math.max(1,Math.round(box.width)),h=Math.max(1,Math.round(box.height));
  if(w<2||h<2)return;
  renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
 };
 const onPointer=e=>{
  if(disposed||intro.classList.contains('opening'))return;
  const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
  lookX=Math.max(-.13,Math.min(.13,x*.18));lookY=Math.max(-.08,Math.min(.08,y*.12));
 };
 addEventListener('pointermove',onPointer,{passive:true});
 addEventListener('resize',fit,{passive:true});
 observer=new ResizeObserver(fit);observer.observe(canvas);
 fit();
 const ease=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
 function frame(now){
  if(disposed)return;
  if(intro.classList.contains('dismissed')){dispose();return}
  if(intro.classList.contains('opening')&&!start)start=now;
  const t=start?(now-start)/2000:0;
  const q=ease(t),flapQ=ease((t-.28)/.47),cardQ=ease((t-.45)/.48);
  flap.rotation.x=-2.68*flapQ;
  wax.scale.setScalar(1-.45*ease((t-.18)/.16));
  wax.visible=t<.36;waxCenter.visible=t<.36;
  ribbon.visible=t<.30;
  card.position.y=-.06+.91*cardQ;innerFrame.position.y=card.position.y;cardFront.position.y=card.position.y;
  group.rotation.y+=(lookX-group.rotation.y)*.035;
  group.rotation.x+=(lookY-group.rotation.x)*.035;
  group.position.z=.20*q;
  group.rotation.z=Math.sin(now*.00045)*.018*(1-q);
  renderer.render(scene,camera);
  raf=requestAnimationFrame(frame);
 }
 function dispose(){
  if(disposed)return;disposed=true;cancelAnimationFrame(raf);
  removeEventListener('pointermove',onPointer);removeEventListener('resize',fit);
  observer?.disconnect();group.traverse(o=>{o.geometry?.dispose()});
  paper.dispose();paperEdge.dispose();gold.dispose();softGold.dispose();renderer.dispose();
 }
 window.emoraSilk3D={dispose};
 intro.classList.add('webgl-ready');ready=true;
 raf=requestAnimationFrame(frame);
})().catch(()=>{console.info('Silk 3D is unavailable. 2.5D fallback remains visible.');});
