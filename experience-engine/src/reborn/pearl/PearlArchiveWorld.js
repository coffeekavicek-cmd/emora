import * as THREE from 'three';
import { gsap } from 'gsap';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

export class PearlArchiveWorld{
  constructor(host){
    this.host=host;this.renderer=null;this.scene=null;this.camera=null;this.pearl=null;this.thread=null;
    this.folio=null;this.cloth=null;this.pointer={x:0,y:0};this.targetPointer={x:0,y:0};this.threadProgress=0;
    this.archiveProgress=0;this.phase='thread';this.destroyed=false;this.ro=null;this.last=0;this.mobile=false;
    this.tick=this.tick.bind(this);
  }

  init(){
    const w=Math.max(1,this.host.clientWidth),h=Math.max(1,this.host.clientHeight);
    this.mobile=Math.min(w,h)<760;
    const scene=new THREE.Scene();
    scene.background=new THREE.Color(0x050505);
    scene.fog=new THREE.FogExp2(0x050505,.055);
    this.scene=scene;

    const renderer=new THREE.WebGLRenderer({antialias:!this.mobile,alpha:false,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,this.mobile?1.2:1.55));
    renderer.setSize(w,h,false);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.12;
    renderer.domElement.className='pr-world-canvas';
    this.host.appendChild(renderer.domElement);
    this.renderer=renderer;

    const camera=new THREE.PerspectiveCamera(34,w/h,.1,60);
    camera.position.set(0,2.7,7.5);
    camera.lookAt(0,.15,0);
    this.camera=camera;

    scene.add(new THREE.HemisphereLight(0x8e7c70,0x070707,1.05));
    const key=new THREE.DirectionalLight(0xffe9ce,4.8);key.position.set(3.5,6,3.5);scene.add(key);
    const rim=new THREE.PointLight(0xc8b6ff,26,9,2);rim.position.set(-3,2.2,-1.5);scene.add(rim);
    const warm=new THREE.PointLight(0xffb778,20,8,2);warm.position.set(2.7,.4,2.5);scene.add(warm);
    this.key=key;this.rim=rim;this.warm=warm;

    const clothGeo=new THREE.PlaneGeometry(13,8,this.mobile?34:58,this.mobile?24:42);
    const clothMat=new THREE.ShaderMaterial({
      uniforms:{
        uTime:{value:0},uFocus:{value:0},uLight:{value:new THREE.Color(0x7a6248)},
      },
      vertexShader:`
        uniform float uTime;uniform float uFocus;varying vec2 vUv;varying float vWave;
        void main(){
          vUv=uv;vec3 p=position;
          float wave=sin(p.x*.92+uTime*.36)*.045+sin(p.y*1.25-uTime*.29)*.03;
          float breath=sin((p.x+p.y)*.56+uTime*.18)*.018;
          p.z+=(wave+breath)*(1.0+uFocus*.7);
          vWave=wave;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
        }`,
      fragmentShader:`
        uniform vec3 uLight;uniform float uFocus;varying vec2 vUv;varying float vWave;
        float line(float v,float f){return smoothstep(.52,.48,abs(fract(v*f)-.5));}
        void main(){
          vec3 base=mix(vec3(.055,.047,.041),vec3(.16,.125,.09),vUv.y*.62+uFocus*.08);
          float warp=sin(vUv.x*820.)*.012+sin(vUv.y*720.)*.009;
          float weave=(line(vUv.x,180.)+line(vUv.y,150.))*.018;
          float sheen=pow(max(0.,1.-abs(vUv.x-.47)*2.),6.)*(.06+vWave*.4);
          vec3 c=base+uLight*(weave+sheen+warp);
          gl_FragColor=vec4(c,1.);
        }`,
      side:THREE.DoubleSide
    });
    const cloth=new THREE.Mesh(clothGeo,clothMat);
    cloth.rotation.x=-Math.PI/2.05;cloth.position.set(0,-1.0,-.25);scene.add(cloth);this.cloth=cloth;

    const pearlMat=new THREE.MeshPhysicalMaterial({
      color:0xfffaf2,metalness:0,roughness:.12,transmission:.15,thickness:1.2,ior:1.46,
      clearcoat:1,clearcoatRoughness:.03,iridescence:1,iridescenceIOR:1.35,iridescenceThicknessRange:[150,520]
    });
    const pearl=new THREE.Mesh(new THREE.SphereGeometry(.28,this.mobile?24:40,this.mobile?18:32),pearlMat);
    pearl.position.set(-3.2,.46,.6);scene.add(pearl);this.pearl=pearl;
    const halo=new THREE.Mesh(new THREE.SphereGeometry(.43,20,14),new THREE.MeshBasicMaterial({color:0xd9c8ff,transparent:true,opacity:.035,side:THREE.BackSide}));
    pearl.add(halo);

    const pts=[];
    for(let i=0;i<220;i++){
      const t=i/219;
      const x=-3.2+t*6.35;
      const y=.13+Math.sin(t*Math.PI*2.3)*.11;
      const z=.48+Math.sin(t*Math.PI*1.25)*.16;
      pts.push(new THREE.Vector3(x,y,z));
    }
    const threadGeo=new THREE.BufferGeometry().setFromPoints(pts);
    threadGeo.setDrawRange(0,2);
    const thread=new THREE.Line(threadGeo,new THREE.LineBasicMaterial({color:0xd6b45b,transparent:true,opacity:.92}));
    scene.add(thread);this.thread=thread;this.threadPoints=pts;

    const folio=new THREE.Group();folio.visible=false;folio.position.set(0,-.12,.1);folio.rotation.x=-.08;scene.add(folio);this.folio=folio;
    const linen=new THREE.MeshPhysicalMaterial({color:0x8e795d,roughness:.9,metalness:0,sheen:1,sheenColor:new THREE.Color(0xc7aa83),clearcoat:.02});
    const edge=new THREE.MeshStandardMaterial({color:0x2a211b,roughness:.95});
    const base=new THREE.Mesh(new THREE.BoxGeometry(4.5,.16,3.15),linen);base.position.y=-.16;folio.add(base);
    const lidPivot=new THREE.Group();lidPivot.position.set(0,-.03,-1.53);folio.add(lidPivot);this.lidPivot=lidPivot;
    const lid=new THREE.Mesh(new THREE.BoxGeometry(4.54,.12,3.18),linen);lid.position.z=1.56;lidPivot.add(lid);
    const spine=new THREE.Mesh(new THREE.BoxGeometry(4.6,.1,.09),edge);spine.position.set(0,-.04,-1.55);folio.add(spine);
    const paper=new THREE.Mesh(new THREE.PlaneGeometry(4.05,2.7,18,14),new THREE.MeshPhysicalMaterial({color:0xe9dfcd,roughness:.78,side:THREE.DoubleSide}));
    paper.rotation.x=-Math.PI/2;paper.position.set(0,.01,.08);paper.scale.set(.96,.96,.96);folio.add(paper);this.paper=paper;

    const dustGeo=new THREE.BufferGeometry();const count=this.mobile?70:140;const arr=new Float32Array(count*3);
    for(let i=0;i<count;i++){arr[i*3]=(Math.random()-.5)*9;arr[i*3+1]=Math.random()*5-1.2;arr[i*3+2]=(Math.random()-.5)*6}
    dustGeo.setAttribute('position',new THREE.BufferAttribute(arr,3));
    const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xf4e2c1,size:.014,transparent:true,opacity:.32,depthWrite:false}));
    scene.add(dust);this.dust=dust;

    this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(this.host);
    renderer.setAnimationLoop(this.tick);
    this.resize();
    return this;
  }

  resize(){
    if(!this.renderer)return;
    const w=Math.max(1,this.host.clientWidth),h=Math.max(1,this.host.clientHeight);
    this.camera.aspect=w/h;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);
  }

  pointer(nx,ny){this.targetPointer.x=clamp(nx,-1,1);this.targetPointer.y=clamp(ny,-1,1)}

  setThreadProgress(p){
    p=clamp(p,0,1);this.threadProgress=p;
    const idx=Math.floor(p*(this.threadPoints.length-1));
    this.thread.geometry.setDrawRange(0,Math.max(2,idx+1));
    const pt=this.threadPoints[idx]||this.threadPoints[0];
    this.pearl.position.copy(pt);
    this.pearl.position.y+=.33;
    this.cloth.material.uniforms.uFocus.value=p;
    this.warm.intensity=20+p*18;this.rim.intensity=26+p*16;
  }

  revealFolio(){
    if(!this.folio)return;
    this.phase='folio';this.folio.visible=true;
    this.folio.scale.set(.45,.45,.45);this.folio.position.set(0,-.7,-1.7);
    gsap.to(this.pearl.scale,{x:.1,y:.1,z:.1,duration:.45,ease:'power3.in'});
    gsap.to(this.thread.material,{opacity:.18,duration:.6});
    gsap.to(this.folio.scale,{x:1,y:1,z:1,duration:1.45,ease:'expo.out'});
    gsap.to(this.folio.position,{y:-.12,z:.1,duration:1.45,ease:'expo.out'});
    gsap.to(this.camera.position,{x:0,y:4.15,z:5.7,duration:1.6,ease:'power3.inOut',onUpdate:()=>this.camera.lookAt(0,-.18,0)});
  }

  openFolio(){
    this.phase='letter';
    gsap.to(this.lidPivot.rotation,{x:-Math.PI*.78,duration:1.4,ease:'power4.inOut'});
    gsap.to(this.paper.position,{y:.95,z:.35,duration:1.25,delay:.45,ease:'power3.out'});
    gsap.to(this.paper.rotation,{x:-.52,duration:1.25,delay:.45,ease:'power3.out'});
    gsap.to(this.camera.position,{y:2.65,z:4.15,duration:1.5,delay:.35,ease:'power3.inOut',onUpdate:()=>this.camera.lookAt(0,.25,0)});
    gsap.to(this.key,{intensity:7,duration:1.3,delay:.4});
  }

  setArchiveProgress(p){
    p=clamp(p,0,1);this.archiveProgress=p;this.phase='archive';
    const z=4.15-p*.75,y=2.65-p*.45,x=(p-.5)*.5;
    this.camera.position.set(x,y,z);this.camera.lookAt((p-.5)*.18,.2,0);
    this.folio.rotation.z=(p-.5)*.06;
    this.cloth.material.uniforms.uFocus.value=.45+p*.4;
    this.warm.intensity=26+p*18;this.rim.intensity=30+(1-p)*14;
  }

  collapse(){
    this.phase='collapse';
    gsap.to(this.folio.scale,{x:.06,y:.06,z:.06,duration:.9,ease:'power4.in'});
    gsap.to(this.folio.rotation,{z:1.2,y:.8,duration:.9,ease:'power4.in'});
    gsap.to(this.camera.position,{z:7.2,y:2.9,duration:1.0,ease:'power3.inOut'});
    gsap.to(this.renderer,{toneMappingExposure:.14,duration:.75,ease:'power3.in'});
    gsap.to(this.key,{intensity:.25,duration:.7});gsap.to(this.rim,{intensity:.4,duration:.7});gsap.to(this.warm,{intensity:.3,duration:.7});
  }

  igniteFinale(){
    this.phase='finale';
    this.folio.visible=false;this.pearl.visible=true;this.pearl.scale.set(.18,.18,.18);this.pearl.position.set(0,-1.7,.2);
    gsap.to(this.renderer,{toneMappingExposure:1.45,duration:1.1,ease:'power3.out'});
    gsap.to(this.key,{intensity:6.5,duration:1.0});gsap.to(this.rim,{intensity:40,duration:1.0});gsap.to(this.warm,{intensity:35,duration:1.0});
    gsap.to(this.pearl.position,{y:.7,duration:1.3,ease:'expo.out'});
    gsap.to(this.pearl.scale,{x:1.25,y:1.25,z:1.25,duration:1.3,ease:'back.out(1.6)'});
  }

  tick(time=0){
    if(this.destroyed||!this.renderer||document.hidden)return;
    if(this.mobile&&time-this.last<32)return;this.last=time;
    const t=time*.001;
    this.pointer.x+=(this.targetPointer.x-this.pointer.x)*.04;this.pointer.y+=(this.targetPointer.y-this.pointer.y)*.04;
    this.cloth.material.uniforms.uTime.value=t;
    if(this.phase==='thread'){
      this.camera.position.x=this.pointer.x*.12;this.camera.position.y=2.7+this.pointer.y*.08;this.camera.lookAt(0,.12,0);
      this.pearl.rotation.y=t*.3;this.pearl.rotation.x=t*.17;
    }else if(this.phase==='folio'||this.phase==='letter'||this.phase==='archive'){
      this.folio.rotation.y=this.pointer.x*.018;this.folio.rotation.x=-.08+this.pointer.y*.012;
    }else if(this.phase==='finale'){
      this.pearl.rotation.y=t*.42;this.pearl.rotation.x=Math.sin(t*.7)*.08;
    }
    this.dust.rotation.y=t*.012;this.dust.rotation.x=Math.sin(t*.08)*.015;
    this.renderer.render(this.scene,this.camera);
  }

  destroy(){
    this.destroyed=true;this.ro?.disconnect();this.renderer?.setAnimationLoop(null);
    this.scene?.traverse(o=>{o.geometry?.dispose?.();if(o.material){const m=Array.isArray(o.material)?o.material:[o.material];m.forEach(x=>x.dispose?.())}});
    this.renderer?.dispose();this.renderer?.domElement?.remove();
  }
}
