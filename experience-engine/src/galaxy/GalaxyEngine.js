import { Application, Container, Graphics, Sprite } from 'pixi.js';
import { gsap } from 'gsap';

const TAU=Math.PI*2;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const lerp=(a,b,t)=>a+(b-a)*t;

function makeDotTexture(app,size=22){
  const g=new Graphics();
  g.circle(size/2,size/2,size*.16).fill({color:0xffffff,alpha:1});
  g.circle(size/2,size/2,size*.34).fill({color:0xffffff,alpha:.22});
  g.circle(size/2,size/2,size*.5).fill({color:0xffffff,alpha:.05});
  const texture=app.renderer.generateTexture({target:g,resolution:2});
  g.destroy();
  return texture;
}

function pointInGalaxy(i,total,radius){
  const arm=i%4;
  const p=i/Math.max(1,total-1);
  const distance=radius*(.08+Math.pow(p,.7)*.92);
  const spiral=p*TAU*2.4+arm*(TAU/4);
  const jitter=(Math.random()-.5)*Math.min(72,22+distance*.12);
  return{
    distance:Math.max(8,distance+jitter),
    angle:spiral+(Math.random()-.5)*.42,
    lift:(Math.random()-.5)*(14+distance*.08),
    speed:.08+Math.random()*.08,
    phase:Math.random()*TAU,
  };
}

export class GalaxyEngine{
  constructor(host,{onStar,onReady}={}){
    this.host=host;
    this.onStar=onStar;
    this.onReady=onReady;
    this.app=null;
    this.root=null;
    this.galaxy=null;
    this.stars=[];
    this.points=[];
    this.dotTexture=null;
    this.drag={active:false,lastX:0,velocity:0};
    this.rotation=0;
    this.targetRotation=0;
    this.pointer={x:0,y:0};
    this.state={intro:0,morph:0,explode:0};
    this.mode='galaxy';
    this.destroyed=false;
    this.resizeObserver=null;
  }

  async init(){
    const app=new Application();
    await app.init({
      resizeTo:this.host,
      backgroundAlpha:0,
      antialias:true,
      autoDensity:true,
      resolution:Math.min(window.devicePixelRatio||1,2),
      preference:'webgl',
      powerPreference:'high-performance',
    });
    if(this.destroyed){app.destroy(true);return}
    this.app=app;
    app.canvas.className='galaxy-canvas';
    this.host.appendChild(app.canvas);
    this.dotTexture=makeDotTexture(app);
    this.root=new Container();
    this.galaxy=new Container();
    this.root.addChild(this.galaxy);
    app.stage.addChild(this.root);
    app.stage.eventMode='static';
    app.stage.hitArea=app.screen;
    this.createParticles();
    this.createInteractiveStars();
    this.installInput();
    app.ticker.add(this.tick);
    this.resizeObserver=new ResizeObserver(()=>this.layout());
    this.resizeObserver.observe(this.host);
    this.layout();
    gsap.to(this.state,{intro:1,duration:2.2,ease:'power3.out'});
    this.onReady?.();
  }

  qualityCount(){
    const mobile=Math.min(innerWidth,innerHeight)<760;
    const cores=navigator.hardwareConcurrency||4;
    if(mobile&&cores<=4)return 560;
    if(mobile)return 760;
    return cores>=8?1250:960;
  }

  createParticles(){
    const count=this.qualityCount();
    for(let i=0;i<count;i++){
      const sprite=new Sprite(this.dotTexture);
      sprite.anchor.set(.5);
      const size=.16+Math.random()*.46;
      sprite.scale.set(size);
      sprite.alpha=0;
      const warm=Math.random();
      sprite.tint=warm>.88?0xffc3d8:warm>.62?0xdad4ff:0xffffff;
      const meta=pointInGalaxy(i,count,360);
      meta.sprite=sprite;
      meta.baseScale=size;
      meta.portrait=null;
      meta.seed=Math.random()*TAU;
      this.points.push(meta);
      this.galaxy.addChild(sprite);
    }
  }

  createInteractiveStars(){
    const placements=[
      {x:.25,y:.33,label:'01'},
      {x:.73,y:.29,label:'02'},
      {x:.57,y:.72,label:'03'},
    ];
    placements.forEach((p,index)=>{
      const c=new Container();
      const glow=new Graphics();
      glow.circle(0,0,31).fill({color:0xffd7e7,alpha:.06});
      glow.circle(0,0,18).fill({color:0xffffff,alpha:.08});
      const core=new Graphics();
      core.star(0,0,5,8,2.8,0).fill({color:0xfff9ef,alpha:1});
      const ring=new Graphics();
      ring.circle(0,0,22).stroke({width:1,color:0xffd7e7,alpha:.36});
      c.addChild(glow,ring,core);
      c.eventMode='static';
      c.cursor='pointer';
      c.hitArea={contains:(x,y)=>x*x+y*y<42*42};
      c.alpha=0;
      c.scale.set(.8);
      c._placement=p;
      c._opened=false;
      c._pulse=Math.random()*TAU;
      c.on('pointertap',()=>{
        if(c._opened||this.mode!=='galaxy')return;
        c._opened=true;
        c.eventMode='none';
        gsap.timeline()
          .to(c.scale,{x:1.55,y:1.55,duration:.3,ease:'power2.out'})
          .to(c,{alpha:.18,duration:.45,ease:'power2.in'},'<')
          .to(c.scale,{x:.35,y:.35,duration:.45,ease:'power2.in'},'<');
        this.onStar?.(index);
      });
      this.stars.push(c);
      this.root.addChild(c);
    });
  }

  installInput(){
    const stage=this.app.stage;
    stage.on('pointerdown',e=>{
      if(this.mode!=='galaxy')return;
      this.drag.active=true;
      this.drag.lastX=e.global.x;
      this.drag.velocity=0;
    });
    stage.on('pointermove',e=>{
      const w=Math.max(1,this.app.screen.width),h=Math.max(1,this.app.screen.height);
      this.pointer.x=(e.global.x/w-.5)*2;
      this.pointer.y=(e.global.y/h-.5)*2;
      if(!this.drag.active||this.mode!=='galaxy')return;
      const dx=e.global.x-this.drag.lastX;
      this.drag.lastX=e.global.x;
      this.targetRotation+=dx*.0055;
      this.drag.velocity=dx*.0018;
    });
    const release=()=>{this.drag.active=false};
    stage.on('pointerup',release);
    stage.on('pointerupoutside',release);
  }

  layout(){
    if(!this.app)return;
    this.app.stage.hitArea=this.app.screen;
    const w=this.app.screen.width,h=this.app.screen.height;
    this.root.position.set(w/2,h/2);
    const radius=Math.min(w,h)*.48;
    const scale=clamp(radius/360,.72,1.62);
    this.galaxy.scale.set(scale);
    this.stars.forEach(c=>{
      c.position.set((c._placement.x-.5)*w,(c._placement.y-.5)*h);
    });
  }

  tick=(ticker)=>{
    if(!this.app)return;
    const dt=Math.min(ticker.deltaMS/1000,.034);
    this.targetRotation+=this.drag.velocity;
    this.drag.velocity*=Math.pow(.93,dt*60);
    this.rotation=lerp(this.rotation,this.targetRotation,1-Math.pow(.055,dt));
    const time=performance.now()/1000;
    const w=this.app.screen.width,h=this.app.screen.height;
    const parallaxX=this.pointer.x*Math.min(24,w*.025);
    const parallaxY=this.pointer.y*Math.min(18,h*.02);

    if(this.mode==='galaxy'||this.mode==='morph'){
      for(let i=0;i<this.points.length;i++){
        const p=this.points[i],s=p.sprite;
        const a=p.angle+this.rotation+p.speed*time*.17;
        const breathing=1+Math.sin(time*.55+p.phase)*.018;
        const gx=Math.cos(a)*p.distance*breathing+parallaxX*(p.distance/360);
        const gy=Math.sin(a)*p.distance*.57+p.lift+parallaxY*(p.distance/360);
        const m=this.state.morph;
        if(p.portrait){
          const px=p.portrait.x,py=p.portrait.y;
          s.x=lerp(gx,px,m);
          s.y=lerp(gy,py,m);
          s.alpha=lerp((.22+Math.random()*.02)*this.state.intro,p.portrait.alpha,m);
          s.tint=m>.55?p.portrait.tint:s.tint;
          const targetScale=clamp(p.baseScale*(.72+p.portrait.alpha*.68),.12,.7);
          const sc=lerp(p.baseScale,targetScale,m);
          s.scale.set(sc);
        }else{
          s.x=gx;s.y=gy;s.alpha=(.18+.48*(1-p.distance/430))*this.state.intro;
        }
      }
    }

    if(this.mode==='explode'){
      const e=this.state.explode;
      for(const p of this.points){
        const s=p.sprite;
        const angle=p.seed+this.rotation;
        const dist=(80+p.distance*1.7)*e;
        s.x=(p.portrait?.x||0)+Math.cos(angle)*dist;
        s.y=(p.portrait?.y||0)+Math.sin(angle)*dist;
        s.alpha=(1-e)*.92;
      }
    }

    this.stars.forEach((c,i)=>{
      if(c._opened)return;
      c.alpha=clamp(this.state.intro*(.72+Math.sin(time*1.7+c._pulse)*.24),0,1);
      const k=1+Math.sin(time*1.3+c._pulse)*.06;
      c.scale.set(k);
      c.rotation=Math.sin(time*.45+i)*.05;
    });
  }

  morphToPortrait(points,{onComplete}={}){
    if(!points?.length||!this.points.length)return;
    this.mode='morph';
    const scale=Math.min(this.app.screen.width,this.app.screen.height)/Math.max(520,Math.min(this.app.screen.width,this.app.screen.height));
    for(let i=0;i<this.points.length;i++){
      const source=points[i%points.length];
      this.points[i].portrait={
        x:source.x*scale,
        y:source.y*scale,
        alpha:source.alpha??.9,
        tint:source.tint??0xffe7ef,
      };
    }
    gsap.killTweensOf(this.state);
    gsap.fromTo(this.state,{morph:0},{morph:1,duration:2.6,ease:'power4.inOut',onComplete:()=>{
      this.mode='portrait';
      onComplete?.();
    }});
    this.stars.forEach(c=>gsap.to(c,{alpha:0,duration:.55}));
  }

  explode({onComplete}={}){
    this.mode='explode';
    gsap.fromTo(this.state,{explode:0},{explode:1,duration:1.8,ease:'power3.in',onComplete});
  }

  reset(){
    gsap.killTweensOf(this.state);
    this.mode='galaxy';
    this.state.morph=0;
    this.state.explode=0;
    this.rotation=0;this.targetRotation=0;
    this.stars.forEach(c=>{
      c._opened=false;c.eventMode='static';c.alpha=.8;c.scale.set(1);
    });
    this.points.forEach(p=>{p.portrait=null;p.sprite.alpha=.5});
  }

  destroy(){
    this.destroyed=true;
    this.resizeObserver?.disconnect();
    gsap.killTweensOf(this.state);
    this.app?.ticker.remove(this.tick);
    this.app?.destroy(true,{children:true,texture:true});
    this.app=null;
  }
}
