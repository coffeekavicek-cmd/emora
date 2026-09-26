/* EMORA Silk Heritage procedural three-dimensional opening. 2D fallback remains interactive. */
'use strict';
(function(){
 if(document.documentElement.dataset.template!=='wedding-silk')return;
 const motion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const get=sel=>document.querySelector(sel);
 function ready(){
  const intro=get('#intro'),object=get('#intro .intro-object'),container=get('#experience');
  if(!intro||!object||!container)return false;
  container.classList.add('silk');
  if(!intro.querySelector('.silk-drape')){
   const drapeL=document.createElement('div');drapeL.className='silk-drape left';
   const drapeR=document.createElement('div');drapeR.className='silk-drape right';
   const arch=document.createElement('div');arch.className='silk-arch';
   const light=document.createElement('div');light.className='silk-light';
   const flowers=document.createElement('div');flowers.className='silk-drape-flowers';
   const caption=document.createElement('div');caption.className='silk-live-caption';caption.textContent='SILK • GOLD • OUR MOMENT';
   intro.prepend(arch,drapeL,drapeR,light,flowers);object.appendChild(caption);
  }
  // This permanent, self-hosted illustration remains behind failed or expiring remote artwork.
  for(const selector of ['#introArt','#coverArt']){
   const el=get(selector);
   if(el){const original=el.style.backgroundImage;
     el.style.backgroundImage=(original?original+',':'')+'url("/templates/silk-atelier.svg")';
   }
  }
  get('#startIntro').textContent='Taklifnomani ochish ↗';
  get('#skipIntro').textContent='Animatsiyasiz ko‘rish ↗';
  if(motion||!window.WebGLRenderingContext||navigator.deviceMemory&&navigator.deviceMemory<2)return true;
  setup3D(intro,object,container);
  return true;
 }
 async function setup3D(intro,holder,container){
  // Import only in the wedding flagship. Any download or WebGL failure leaves accessible CSS 2.5D.
  let THREE;
  try {THREE=await import('https://cdn.jsdelivr.net/npm/three@0.175.0/build/three.module.js');}catch(e){return}
  if(intro.classList.contains('dismissed')||intro.classList.contains('playing')||!holder.isConnected)return;
  let renderer;
  try {
   renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   renderer.toneMapping=THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure=1.35;
  }catch(e){return}
  renderer.domElement.id='silk3d';renderer.domElement.setAttribute('aria-hidden','true');
  holder.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(37,1,.1,100);camera.position.set(0,.15,8.8);
  scene.add(new THREE.AmbientLight(0xfffaf0,2.15));
  const sun=new THREE.DirectionalLight(0xffe9c9,3.5);sun.position.set(-3,5,5);scene.add(sun);
  const rim=new THREE.PointLight(0xffedc7,85,15,2);rim.position.set(3,2,3);scene.add(rim);
  const ivory=new THREE.MeshPhysicalMaterial({color:0xf8f0df,roughness:.84,metalness:0,clearcoat:.11,side:THREE.DoubleSide});
  const flapMat=new THREE.MeshPhysicalMaterial({color:0xfffaed,roughness:.82,side:THREE.DoubleSide});
  const gold=new THREE.MeshStandardMaterial({color:0xc5a06d,roughness:.25,metalness:.68});
  const silkMat=new THREE.MeshPhysicalMaterial({color:0xfaf3e6,roughness:.46,metalness:.04,side:THREE.DoubleSide,transparent:true,opacity:.89});
  const sage=new THREE.MeshStandardMaterial({color:0x748f72,roughness:.74,side:THREE.DoubleSide});
  const petalMat=new THREE.MeshStandardMaterial({color:0xfffcf1,roughness:.82,side:THREE.DoubleSide});
  const root=new THREE.Group();scene.add(root);
  // An arched, extruded niche with actual depth, not a flat background image.
  const pts=[];for(let i=0;i<=28;i++){const a=Math.PI-i*Math.PI/28;pts.push(new THREE.Vector3(2.0*Math.cos(a),1.0+1.62*Math.sin(a),-.7))}
  const curve=new THREE.CatmullRomCurve3(pts);
  const arch=new THREE.Mesh(new THREE.TubeGeometry(curve,44,.085,8,false),ivory);scene.add(arch);
  for(const x of [-2,2]){
   const leg=new THREE.Mesh(new THREE.BoxGeometry(.18,2.8,.32),ivory);leg.position.set(x,-.42,-.7);scene.add(leg)
  }
  const envelope=new THREE.Group();root.add(envelope);envelope.rotation.y=-.13;
  const paper=new THREE.Mesh(new THREE.BoxGeometry(2.8,1.76,.15),ivory);envelope.add(paper);
  const pocketShape=new THREE.Shape();
  pocketShape.moveTo(-1.36,-.83);pocketShape.lineTo(0,.18);pocketShape.lineTo(1.36,-.83);pocketShape.lineTo(-1.36,-.83);
  const pocket=new THREE.Mesh(new THREE.ShapeGeometry(pocketShape),flapMat);pocket.position.z=.11;envelope.add(pocket);
  // A separate insert rises when the envelope opens.
  const letter=new THREE.Mesh(new THREE.BoxGeometry(2.43,1.44,.045),flapMat);letter.position.set(0,-.03,.055);envelope.add(letter);
  const frameMat=new THREE.LineBasicMaterial({color:0xc8ae7d});
  const lines=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.22,1.18,.01)),frameMat);
  lines.position.set(0,-.03,.09);envelope.add(lines);
  const flapPivot=new THREE.Group();flapPivot.position.set(0,.88,.14);envelope.add(flapPivot);
  const shape=new THREE.Shape();shape.moveTo(-1.37,0);shape.lineTo(1.37,0);shape.lineTo(0,-1.13);shape.closePath();
  const flap=new THREE.Mesh(new THREE.ShapeGeometry(shape),flapMat);flapPivot.add(flap);
  const seal=new THREE.Group();seal.position.set(0,.16,.25);envelope.add(seal);
  const wax=new THREE.Mesh(new THREE.CylinderGeometry(.27,.30,.09,48),gold);wax.rotation.x=Math.PI/2;seal.add(wax);
  const edge=new THREE.Mesh(new THREE.TorusGeometry(.215,.012,8,48),ivory);edge.position.z=.069;seal.add(edge);
  // Distinct ivory petals and small sage leaves flank the 3D invitation.
  const flowerGroup=new THREE.Group();root.add(flowerGroup);
  for(const side of [-1,1]){
   const bloom=new THREE.Group();bloom.position.set(side*1.48,-.8,.25);
   for(let i=0;i<6;i++){
    const p=new THREE.Mesh(new THREE.SphereGeometry(.19,10,8),petalMat);
    const a=2*Math.PI*i/6;p.position.set(Math.cos(a)*.19,Math.sin(a)*.19,0);
    p.scale.set(.9,1.35,.27);p.rotation.z=a;bloom.add(p)
   }
   const center=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),gold);center.position.z=.11;bloom.add(center);
   for(let i=0;i<3;i++){
    const leaf=new THREE.Mesh(new THREE.SphereGeometry(.17,10,6),sage);
    leaf.scale.set(.55,1.7,.16);leaf.position.set(side*(.36+i*.12),-.15+i*.20,-.12);leaf.rotation.z=.55+i*.55;bloom.add(leaf)
   }
   flowerGroup.add(bloom)
  }
  // Procedural silk planes contain real 3D vertices and different folding phases.
  const curtains=[];
  for(const side of [-1,1]){
   const geo=new THREE.PlaneGeometry(1.2,4.7,22,28);
   const attr=geo.attributes.position;
   for(let i=0;i<attr.count;i++){
    const x=attr.getX(i),y=attr.getY(i);
    attr.setZ(i,.10*Math.sin(x*12+side*2)+.028*Math.sin(y*4+x*7))
   }
   geo.computeVertexNormals();
   const mesh=new THREE.Mesh(geo,silkMat);
   mesh.position.set(side*1.98,0,.22);mesh.rotation.y=side*.08;
   scene.add(mesh);curtains.push({mesh,side})
  }
  const petals=new THREE.Group();scene.add(petals);
  for(let i=0;i<12;i++){
   const p=new THREE.Mesh(new THREE.SphereGeometry(.06,7,5),i%3?petalMat:ivory);
   p.scale.set(1.9,.75,.24);p.position.set((i%4-1.5)*.62,-1.38-Math.floor(i/4)*.14,.7);
   p.userData.index=i;petals.add(p)
  }
  let sizeW=1,sizeH=1,frame=0,playing=false,started=0,disposed=false,threeReady=false,raf=0;
  const ease=x=>1-Math.pow(1-x,3);
  const resize=()=>{
   if(disposed)return;
   const box=holder.getBoundingClientRect();
   sizeW=Math.max(1,box.width*1.22);sizeH=Math.max(1,box.height*1.12);
   camera.aspect=sizeW/sizeH;camera.updateProjectionMatrix();renderer.setSize(sizeW,sizeH,false)
  };
  const observer=window.ResizeObserver?new ResizeObserver(resize):null;
  observer?.observe(holder);window.addEventListener('resize',resize,{passive:true});resize();
  const stop=()=>{
   if(disposed)return;disposed=true;cancelAnimationFrame(raf);observer?.disconnect();
   window.removeEventListener('resize',resize);
   scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const a=Array.isArray(o.material)?o.material:[o.material];for(const m of a)m.dispose()}});
   renderer.dispose();renderer.domElement.remove();container.classList.remove('silk-3d-ready')
  };
  const onStart=()=>{
    if(playing||disposed)return;playing=true;started=performance.now();
    // release resources after the existing intro transition.
    setTimeout(stop,2550)
  };
  get('#startIntro').addEventListener('click',onStart);
  get('#skipIntro').addEventListener('click',stop,{once:true});
  window.addEventListener('pagehide',stop,{once:true});
  const tick=(time)=>{
   if(disposed)return;
   if(!document.hidden){
    const t=playing?Math.min(1,(time-started)/2150):0;
    const open=ease(Math.min(1,Math.max(0,(t-.08)/.49)));
    const spread=ease(Math.min(1,Math.max(0,(t-.35)/.56)));
    const float=.045*Math.sin(time*.0012);
    envelope.rotation.y=-.13+.20*open;envelope.position.y=float;
    flapPivot.rotation.x=-Math.PI*.91*open;
    letter.position.y=-.03+.60*open;letter.position.z=.055+.27*open;
    seal.scale.setScalar(Math.max(.001,1-open*1.08));
    for(const c of curtains){c.mesh.position.x=c.side*(1.98+1.85*spread);c.mesh.rotation.y=c.side*(.08+.3*spread)}
    camera.position.z=8.8-.65*spread;
    for(const p of petals.children){const i=p.userData.index;p.position.y=-1.5+2.1*spread+(.07*Math.sin(time*.001+i));p.rotation.z=.17*Math.sin(time*.0012+i)}
    renderer.render(scene,camera);
    if(!threeReady){threeReady=true;container.classList.add('silk-3d-ready')}
   }
   raf=requestAnimationFrame(tick)
  };
  raf=requestAnimationFrame(tick);
 }
 if(!ready()){
  const obs=new MutationObserver(()=>{if(ready())obs.disconnect()});
  obs.observe(document.documentElement,{childList:true,subtree:true})
 }
})();
